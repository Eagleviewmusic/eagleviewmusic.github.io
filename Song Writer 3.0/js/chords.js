/* ==========================================================================
   Song Writer — chords.js
   --------------------------------------------------------------------------
   SW.chords   The chord engine every chord-shaped component reads — the
               chord panel, the lane, the corner under the panel, the
               keyboard dock, the player and Layout settings. It is Digital
               Accordion's chord side, ported: the scale decides the chords,
               the same finger holds the same job in every scale, and five
               held buttons change any chord.

   THE BOARD — fourteen places, named by the key that plays them, laid
   out as Digital Accordion's Panels view lays them (bottom row first):

         1  2  3  4  5      the scale's five extra chords (`top`)
         Q  W  E  R         ranks 8 9 7 6
         A  S  D            ranks 4 3 2
         F (wide)  G        rank 1 (the tonic chord) and rank 5

   In major: F=I  D=V  S=IV  A=vi  G=ii  R=iii  E=V/V  Q=V/vi  W=IV/IV,
   1–5 = ♭VI iv ii/IV iii/V V/ii (3 and 4 were vii°7/V and V/iii until
   2026-10-28). Any place can be re-chorded (root,
   quality, permanent functions, label) — the song remembers it
   (`score.board`), so a song that says "D is V7" opens that way.

   CHORD SETS — Core (F D S A) · Full (+ G R) · Extended (+ E Q W) ·
   Extreme (everything): how much of the board is out (a View pref).

   Z X C V B — five held buttons, each holding a function of the room's
   choosing (View pref `modSlots`; to start sus2 add9 sus4 ♭7 maj7). The
   colour functions go through the hand-off's engine (lib/keyblocks-
   layers.js, via Theory.applyMods); the inversions are voiced here:
   6 and 6/4 invert the triad, 6/5 4/3 4/2 make a 7th chord first (the
   scale's own 7th above the root). While a button is held every chord on
   the panel relabels, and a chord played then is the modified chord.

   A CHORD IS A STRING — the lane, the model and links carry a roman
   numeral the engine can read back in any key:
       I   V7   ii   bVI   #iv°7   Imaj7   V:inv64   V7:inv43   I:sus4,add9
   root (♭/♯ + numeral, lower case = minor family) + Theory's quality
   suffix, then `:` and the functions applied. The fourteen ids Song
   Writer wrote before 2026-09-27 (I ii iii IV V vi V/V V/vi IV/IV bVI iv
   vii°7/V V/iii V/ii) still read.

   API (the main calls)
     scaleId() · scale() · scaleGroups()          the song's scale (Theory.SCALES)
     board() → [{ place, id, spec, custom }]      the fourteen places, this scale
     entry(place) · setBoard(place, spec|null)    read / re-chord / reset a place
     parse(id|spec) · toId(spec) · isKnown(id)
     describe(id|spec, { held }) → names, colour, tones, bass, place, key…
     midis(id|spec, { held, voice })               the notes, voiced (a voice: the chord's own notes)
     cleanVoice(v) · voiceMidis(v) · voiceOf(id) · refitVoice(v, fromId, toId)   voices (2026-10-28, below midis)
     voiceNotes(v) · spellMidi(midi, dir, tones?) · pairOf(d, acc) · nameVoice(v) · describeVoiced(id, voice)
     play(id|spec, source, { voice }) · playPlace(place, source) · announce(id, midis, source)
     bend() · bendDelta(deg)                       the chord in hand bends the scale (the keyboard's)
     holdPlace(place, holder, source) · releaseHold(holder) · isHeld(place)   a chord held down (rings, re-strikes)
     offered() · placeShown(place) · setChordSet(id) · setIndex() · CHORD_SETS
     heldMods · setMod(M, on) · clearMods() · slotFunc(M) · setSlot(M, id) · MOD_FUNCS
     placeForKey(k) · keyOf(place) · isModKey(k)
   Events: chords:changed { why } · mods:changed { held } · chord:played { id, midis, source }
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  /* lib/theory.js declares `const Theory` at the top level of a classic
     script: a global binding, not a property of window. */
  const T = (typeof Theory !== 'undefined') ? Theory : null;
  if (!T) { console.error('chords.js: lib/theory.js is missing'); return; }

  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const SOLFEGE_UP = ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'];
  const SOLFEGE_DOWN = ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'];

  /* ---------------- the places, the keys, the sets ---------------- */
  const PLACES = ['f', 'd', 's', 'a', 'g', 'r', 'e', 'q', 'w', '1', '2', '3', '4', '5'];
  const ROLE_OF_RANK = ['f', 'd', 's', 'a', 'g', 'r', 'e', 'q', 'w'];     // scale.chords[i] → its place
  /* the Panels shape, bottom row first: F wide beside G; A S D; Q W E R; 1 2 3 4 5 */
  const SHAPE = [
    [{ place: 'f', w: 3 }, { place: 'g', w: 1 }],
    [{ place: 'a' }, { place: 's' }, { place: 'd' }],
    [{ place: 'q' }, { place: 'w' }, { place: 'e' }, { place: 'r' }],
    [{ place: '1' }, { place: '2' }, { place: '3' }, { place: '4' }, { place: '5' }]
  ];
  const CHORD_SETS = [
    { id: 'core', name: 'Core', short: 'Core', places: 'fdsa', desc: 'the four chords most songs need' },
    { id: 'full', name: 'Full', short: 'Full', places: 'gr', desc: 'adds the other two chords of the scale' },
    { id: 'extended', name: 'Extended', short: 'Extd', places: 'eqw', desc: 'adds the chords that lead somewhere' },
    { id: 'extreme', name: 'Extreme', short: 'Xtrm', places: '12345', desc: 'everything, the number row too' }
  ];
  const EXTREME = CHORD_SETS.length - 1;
  const SET_OF = {};
  CHORD_SETS.forEach((s, i) => s.places.split('').forEach(p => { SET_OF[p] = i; }));
  /* the fourteen ids Song Writer wrote before the board (1.0's nine + the number row) */
  const LEGACY_ID = {
    'I': 'I', 'ii': 'ii', 'iii': 'iii', 'IV': 'IV', 'V': 'V', 'vi': 'vi',
    'V/V': 'II', 'V/vi': 'III', 'IV/IV': 'bVII',
    'bVI': 'bVI', 'iv': 'iv', 'vii°7/V': '#iv°7', 'V/iii': 'VII', 'V/ii': 'VI'
  };
  const LEGACY_PLACE = {
    'I': 'f', 'ii': 'g', 'iii': 'r', 'IV': 's', 'V': 'd', 'vi': 'a', 'V/V': 'e', 'V/vi': 'q', 'IV/IV': 'w',
    'bVI': '1', 'iv': '2', 'vii°7/V': '3', 'V/iii': '4', 'V/ii': '5'
  };
  /* ---------------- Z X C V B: the functions ---------------- */
  const SLOT_KEYS = ['Z', 'X', 'C', 'V', 'B'];
  const MOD_FUNCS = [
    { id: 'sus2', name: 'sus2', engine: 'Z', does: 'The 3rd drops to the 2nd' },
    { id: 'add9', name: 'add9', engine: 'X', does: 'Adds the major 9th' },
    { id: 'sus4', name: 'sus4', engine: 'C', does: 'The 3rd rises to the 4th' },
    { id: 'b7', name: '♭7', engine: 'V', does: 'Adds the minor 7th (with maj7, a 6th)' },
    { id: 'maj7', name: 'maj7', engine: 'B', does: 'Adds the major 7th (with ♭7, a 6th)' },
    { id: 'inv6', name: '6', figs: ['6'], inv: 1, does: 'First inversion: the 3rd in the bass' },
    { id: 'inv64', name: '6/4', figs: ['6', '4'], inv: 2, does: 'Second inversion: the 5th in the bass' },
    { id: 'inv65', name: '6/5', figs: ['6', '5'], inv: 1, seventh: true, does: 'A 7th chord in first inversion: the 3rd in the bass' },
    { id: 'inv43', name: '4/3', figs: ['4', '3'], inv: 2, seventh: true, does: 'A 7th chord in second inversion: the 5th in the bass' },
    { id: 'inv42', name: '4/2', figs: ['4', '2'], inv: 3, seventh: true, does: 'A 7th chord in third inversion: the 7th in the bass' }
  ];
  const MOD_BY_ID = {};
  MOD_FUNCS.forEach(f => { MOD_BY_ID[f.id] = f; });
  const DEFAULT_SLOTS = ['sus2', 'add9', 'sus4', 'b7', 'maj7'];
  const heldMods = new Set();                      // slot keys held right now

  const view = () => (SW.settings && SW.settings.view) || {};
  const keyIndex = () => M.KEY_SIGNATURES_CHROMATIC_INDEX[S.key] || 0;
  /* the key as Theory spells it — Song Writer's own spelling (F♯ stays
     F♯, G♭ stays G♭), respelled only where the scale needs it (D♭ minor
     is C♯ minor), exactly as the blocks are (core.js spelledKey) */
  const tonicName = () => M.spelledKey();

  /* ---------------- the scale ---------------- */
  function scaleId() { return T.SCALE_BY_ID[S.scale] ? S.scale : 'major'; }
  function scale() { return T.SCALE_BY_ID[scaleId()]; }
  /* Theory's scales grouped by family, for a menu */
  function scaleGroups() {
    const groups = [];
    T.SCALES.forEach(sc => {
      let g = groups.find(x => x.label === sc.family);
      if (!g) { g = { label: sc.family, scales: [] }; groups.push(g); }
      g.scales.push({ id: sc.id, name: sc.name });
    });
    return groups;
  }

  /* ---------------- specs and ids ---------------- */
  function accAscii(alter) { return alter > 0 ? '#'.repeat(alter) : alter < 0 ? 'b'.repeat(-alter) : ''; }
  /* ♭ and ♯ for the b and # in a numeral or a suffix (bVI, #iv°7, II7b5, V7#9) */
  function pretty(s) { return String(s).replace(/b(?=[IViv\d])/g, '♭').replace(/#(?=[IViv\d])/g, '♯'); }
  function prettyAcc(s) { return String(s).replace(/#/g, '♯').replace(/b/g, '♭'); }

  function cleanMods(list) {
    const out = [];
    (Array.isArray(list) ? list : []).forEach(id => { if (MOD_BY_ID[id] && out.indexOf(id) === -1) out.push(id); });
    return MOD_FUNCS.map(f => f.id).filter(id => out.indexOf(id) !== -1);
  }
  /* { root, q, mods, label } from anything: a spec, a canonical id, an old id */
  function parse(x) {
    if (x && typeof x === 'object') {
      if (!T.QUALITIES[x.q] || !/^[#b]*[1-7]$/.test(String(x.root))) return null;
      const spec = { root: String(x.root), q: x.q, mods: cleanMods(x.mods) };
      if (typeof x.label === 'string' && x.label.trim()) spec.label = x.label.trim().slice(0, 12);
      return spec;
    }
    let s = String(x || '').trim();
    if (!s) return null;
    if (LEGACY_ID[s]) s = LEGACY_ID[s];
    const cut = s.indexOf(':');
    const head = cut < 0 ? s : s.slice(0, cut);
    const modsStr = cut < 0 ? '' : s.slice(cut + 1);
    const m = /^([b#♭♯]*)(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(.*)$/.exec(head);
    if (!m) return null;
    const acc = m[1].replace(/♭/g, 'b').replace(/♯/g, '#');
    const lower = m[2] === m[2].toLowerCase();
    const num = ROMAN.indexOf(m[2].toUpperCase()) + 1;
    let sfx = m[3].replace(/#/g, '♯').replace(/b(?=\d)/g, '♭').replace(/^o(?=7|$)/, '°');
    const q = Object.keys(T.QUALITIES).find(k => (T.QUALITIES[k].roman === 'lower') === lower && T.QUALITIES[k].rsfx === sfx);
    if (!q) return null;
    const mods = cleanMods(modsStr.split(',').map(t => t.trim()));
    return { root: acc + num, q, mods };
  }
  /* the canonical id of a spec: 'V7', 'bVI', '#iv°7', 'V:inv64' */
  function toId(spec) {
    const sp = parse(spec);
    if (!sp) return null;
    const Q = T.QUALITIES[sp.q];
    const d = T.parseDegree(sp.root);
    let r = ROMAN[d.num - 1];
    if (Q.roman === 'lower') r = r.toLowerCase();
    return accAscii(d.alter) + r + Q.rsfx + (sp.mods.length ? ':' + sp.mods.join(',') : '');
  }
  const isKnown = id => !!parse(id);
  const sameChord = (a, b) => !!(a && b) && a.root === b.root && a.q === b.q;

  /* ---------------- the board ---------------- */
  /* the scale's own chord for a place, labelled as the scale labels it */
  function presetAt(place, sc) {
    sc = sc || scale();
    const i = ROLE_OF_RANK.indexOf(place);
    const c = i >= 0 ? sc.chords[i] : (sc.top || [])[PLACES.indexOf(place) - 9];
    if (!c) return null;
    return { root: c.root, q: c.q, mods: [], label: c.label || null };
  }
  function boardStore() { if (!S.board || typeof S.board !== 'object') S.board = {}; return S.board; }
  function entry(place) {
    if (PLACES.indexOf(place) === -1) return null;
    const preset = presetAt(place);
    const own = boardStore()[place];
    const spec = own ? parse(own) : null;
    const use = spec || preset;
    if (!use) return null;
    return { place, spec: use, id: toId(use), custom: !!spec, preset };
  }
  function board() { return PLACES.map(entry).filter(Boolean); }
  /* the scale's label for a spec ('V/V', 'IV/♭III', 'bIII+'), if the scale knows it */
  function presetLabel(spec) {
    const sc = scale();
    const hit = sc.chords.concat(sc.top || []).find(c => c.root === spec.root && c.q === spec.q && c.label);
    return hit ? hit.label : null;
  }
  /* re-chord a place (spec), or null to put the scale's chord back */
  function setBoard(place, spec) {
    if (PLACES.indexOf(place) === -1) return;
    const store = boardStore();
    const sp = spec ? parse(spec) : null;
    const preset = presetAt(place);
    if (!sp || (preset && sameChord(sp, preset) && !sp.mods.length && (!sp.label || sp.label === (preset.label || '')))) delete store[place];
    else {
      const keep = { root: sp.root, q: sp.q, mods: sp.mods };
      if (sp.label) keep.label = sp.label;
      store[place] = keep;
    }
    SW.bus.emit('chords:changed', { why: 'board', place });
    if (SW.score) SW.score.changed('board');
  }
  /* what the model stores: { place: { root, q, mods, label? } } */
  function boardModel() {
    const out = {};
    PLACES.forEach(p => { const e = entry(p); if (e && e.custom) out[p] = Object.assign({}, boardStore()[p]); });
    return out;
  }

  /* ---------------- the chord set ---------------- */
  function setIndex() {
    const i = CHORD_SETS.findIndex(c => c.id === view().chordSet);
    return i < 0 ? EXTREME : i;
  }
  function placeShown(place) { return setIndex() === EXTREME || SET_OF[place] <= setIndex(); }
  function placeAllowed(place) {
    const allowed = SW.settings && SW.settings.layout && SW.settings.layout.chords;
    return !allowed || allowed.indexOf(place) !== -1;
  }
  /* the places that are out right now: in the set, and allowed by Layout settings */
  function offered() { return PLACES.filter(p => placeShown(p) && placeAllowed(p) && entry(p)); }
  function setChordSet(id) {
    if (!CHORD_SETS.some(c => c.id === id) || id === view().chordSet) return;
    SW.settings.setView({ chordSet: id }, { quiet: true });
    SW.bus.emit('chords:changed', { why: 'set' });
  }
  function describeSet(i) {
    if (i === EXTREME) return 'Extreme — all ' + offered().length + ' chords';
    const places = CHORD_SETS[i].places.split('').filter(placeAllowed);
    const names = places.map(p => { const e = entry(p); return e ? describe(e.spec).roman : null; }).filter(Boolean).join(' ');
    return CHORD_SETS[i].name + ' — ' + (i ? 'adds ' : '') + (names || 'no chords') + ' (' + places.map(p => p.toUpperCase()).join(' ') + ')';
  }

  /* ---------------- Z X C V B ---------------- */
  function modSlots() {
    const v = view().modSlots;
    const slots = Array.isArray(v) && v.length === 5 ? v.slice() : DEFAULT_SLOTS.slice();
    return slots.map(id => (id && MOD_BY_ID[id]) ? id : null);
  }
  function slotFunc(Mk) { return MOD_BY_ID[modSlots()[SLOT_KEYS.indexOf(Mk)]] || null; }
  function setSlot(Mk, id) {
    const slots = modSlots();
    slots[SLOT_KEYS.indexOf(Mk)] = (id && MOD_BY_ID[id]) ? id : null;
    if (heldMods.size) clearMods();
    SW.settings.setView({ modSlots: slots }, { quiet: true });
    SW.bus.emit('chords:changed', { why: 'slots' });
  }
  function resetSlots() {
    if (heldMods.size) clearMods();
    SW.settings.setView({ modSlots: DEFAULT_SLOTS.slice() }, { quiet: true });
    SW.bus.emit('chords:changed', { why: 'slots' });
  }
  const isModKey = k => SLOT_KEYS.indexOf(String(k || '').toUpperCase()) !== -1 && String(k).length === 1;
  function setMod(Mk, on) {
    if (SLOT_KEYS.indexOf(Mk) === -1 || on === heldMods.has(Mk)) return;
    if (on) heldMods.add(Mk); else heldMods.delete(Mk);
    SW.bus.emit('mods:changed', { held: Array.from(heldMods) });
    restrike();                              // a chord held down sounds the change (HOLDING A CHORD)
  }
  function clearMods() {
    if (!heldMods.size) return;
    heldMods.clear();
    SW.bus.emit('mods:changed', { held: [] });
  }
  /* the functions on a chord: its own, then whatever is held (in slot order) */
  function withHeld(spec) {
    const mods = spec.mods.slice();
    SLOT_KEYS.forEach(Mk => {
      if (!heldMods.has(Mk)) return;
      const f = slotFunc(Mk);
      if (f && mods.indexOf(f.id) === -1) mods.push(f.id);
    });
    return Object.assign({}, spec, { mods });
  }

  /* ---------------- theory: tones, voicing, names ---------------- */
  /* a chord as it sounds: the engine letters (7th → sus → 9th) applied,
     the inversion (the latest wins), a 7th added first when the
     inversion asks for one */
  function effective(spec) {
    const mods = cleanMods(spec.mods);
    const letters = ['V', 'B', 'Z', 'C', 'X'].filter(L => mods.some(id => MOD_BY_ID[id].engine === L));
    let tones = letters.length ? T.applyMods(T.qualityTones(spec.q), letters) : null;
    const invs = spec.mods.filter(id => MOD_BY_ID[id] && MOD_BY_ID[id].inv);   // in the order they were added
    const inv = invs.length ? MOD_BY_ID[invs[invs.length - 1]] : null;
    if (inv && inv.seventh) {
      const t = tones || T.qualityTones(spec.q);
      if (!t.some(x => x[1] === 7)) tones = withSeventh(spec, t);
    }
    return { mods, tones, inv, colour: letters.length > 0 };
  }
  /* a triad made a 7th chord: the 7th the scale has above the root; a ♭7 where it has neither */
  function withSeventh(spec, tones) {
    const set = new Set(scale().degrees.map(T.degreeSemis));
    const r = T.degreeSemis(spec.root);
    const semi = [10, 11, 9].find(x => set.has((r + x) % 12));
    return tones.concat([[semi === undefined ? 10 : semi, 7]]).sort((a, b) => a[0] - b[0]);
  }
  /* the tone an inversion puts in the bass: 1 the 3rd (or the sus note standing in), 2 the 5th, 3 the 7th */
  function bassTone(tones, n) {
    const has3 = tones.some(t => t[1] === 3);
    const members = tones.filter(t => t[1] === 3 || t[1] === 5 || t[1] === 7 || (!has3 && (t[1] === 2 || t[1] === 4))).sort((a, b) => a[1] - b[1]);
    return members[n - 1] || null;
  }
  /* The notes of a chord spelled in Song Writer's key: a tone the scale
     has takes the scale's spelling (so it agrees with the blocks); one
     outside sits on the letter its interval says. Root first. */
  function spellTones(spec, tones) {
    const t = tonicName();
    const sc = scale();
    const rootP = T.parseDegree(spec.root);
    const rootSemis = T.degreeSemis(spec.root);
    const seen = new Set(), out = [];
    (tones || T.qualityTones(spec.q)).slice().sort((a, b) => a[0] - b[0]).forEach(tone => {
      const semis = tone[0], gen = tone[1] - 1;
      const pc = (rootSemis + semis) % 12;
      if (seen.has(pc)) return;
      seen.add(pc);
      let deg = sc.degrees.find(d => T.degreeSemis(d) === pc);
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
        name: sp.name, letter: sp.letter, color: M.LETTER_COLORS[sp.letter], pc
      });
    });
    return out;
  }
  /* figured bass on a numeral: I⁶ I⁶₄, V⁶₅ V⁴₃ V⁴₂ — before a slash (V⁶₅/V) */
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
  /* how far a long name shrinks to fit a card or a block (2026-10-29): V7sus4 to 0.58 of the size */
  function nameScale(text) {
    const n = Array.from(String(text)).length;
    return n <= 3 ? 1 : n === 4 ? 0.84 : n === 5 ? 0.7 : n === 6 ? 0.58 : n === 7 ? 0.5 : 0.44;
  }
  function modLabelHTML(f) {
    if (!f) return '—';
    return f.figs ? '<span class="figs"><i>' + f.figs.join('</i><i>') + '</i></span>' : escapeHtml(f.name);
  }

  /* Everything a component shows about a chord. `opts.held` applies the
     Z X C V B buttons held right now. */
  function describe(x, opts) {
    const o = opts || {};
    let spec = parse(x);
    if (!spec) {
      const raw = String(x);
      return { id: raw, known: false, roman: raw, letter: raw, color: '#8A8A8A', inScale: true, tones: [], mods: [], modded: false };
    }
    if (o.held) spec = withHeld(spec);
    const eff = effective(spec);
    const tones = eff.tones || T.qualityTones(spec.q);
    const rootSp = T.spellDegree(tonicName(), spec.root);
    const sfx = T.suffixFor(tones, spec.q);
    const named = spellTones(spec, tones);
    // the numeral: the scale's own label (V/V) unless the colour changed it
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
    const place = PLACES.find(p => { const e = entry(p); return e && sameChord(e.spec, spec) && e.spec.mods.join() === spec.mods.join(); }) || null;
    return {
      id: toId(spec), known: true, spec, roman, letter,
      quality: T.QUALITIES[spec.q].name,
      color: M.LETTER_COLORS[rootSp.letter] || '#8A8A8A',
      inScale: T.chordInScale(scaleId(), spec, tones),
      tones: named, bass,
      mods: eff.mods, modded: eff.mods.length > 0,
      inv: eff.inv ? eff.inv.id : null,
      place, kb: place ? place.toUpperCase() : null
    };
  }

  /* The notes a chord sounds, as MIDI. An inverted chord: the bass tone
     at the bottom (no higher than B3), the others close above, the bass
     doubled on top when that leaves three. Otherwise Digital Accordion's
     voicing (1.0's nine were a choice under Sound until 2026-10-29). */
  function midis(x, opts) {
    const o = opts || {};
    if (o.voice) { const v = cleanVoice(o.voice); if (v) return voiceMidis(v); }   // the chord's own notes (a VOICE, below) win
    let spec = parse(x);
    if (!spec) return [];
    if (o.held) spec = withHeld(spec);
    const eff = effective(spec);
    const tones = eff.tones || T.qualityTones(spec.q);
    const bt = eff.inv ? bassTone(tones, eff.inv.inv) : null;
    if (bt) {
      const root = T.tonicMidi(keyIndex()) - 12 + T.degreeSemis(spec.root);
      let bass = root + (bt[0] % 12);
      if (bass > 59) bass -= 12;
      const pcs = Array.from(new Set(tones.map(t => (root + t[0]) % 12))).filter(pc => pc !== bass % 12);
      const upper = pcs.map(pc => { const d = ((pc - bass) % 12 + 12) % 12; return bass + (d || 12); }).sort((a, b) => a - b);
      const out = [bass].concat(upper);
      if (out.length < 4) out.push(bass + 12);
      return out;
    }
    return T.chordMidis(keyIndex(), spec.root, spec.q, 0, eff.tones);
  }

  /* ---------------- a chord's own notes (2026-10-28) ----------------
     A VOICE is a chord's notes as the song keeps them (the Chord Chart's
     Focus makes them): [[step, semi], …] — semi the semitones above the
     key's tonic (Theory's tonicMidi, the note the engine voices from),
     step the letters above the tonic's letter (0 its own, 7 an octave
     up), which keeps the spelling (G♯ stays G♯). It moves with the key,
     and it wins over the engine's voicing wherever the chord sounds.
       cleanVoice(v) → v | null    2–8 notes, low to high, no pitch twice
       voiceMidis(v) · voiceOf(id) (the engine's voicing as a voice)
       refitVoice(v, fromId, toId) the voice kept in shape when a new scale changes its chord */
  const NAT = [0, 2, 4, 5, 7, 9, 11];
  const LETTERS = 'CDEFGAB';
  const natSemis = step => 12 * Math.floor(step / 7) + NAT[((step % 7) + 7) % 7];
  // the step nearest a pitch, among the ones with letter offset d (any, when d is null)
  function stepFor(semi, d) {
    let best = null;
    for (let s = Math.floor(semi * 7 / 12) - 8; s <= Math.floor(semi * 7 / 12) + 8; s++) {
      if (d !== null && ((s % 7) + 7) % 7 !== d) continue;
      if (best === null || Math.abs(natSemis(s) - semi) < Math.abs(natSemis(best) - semi)) best = s;
    }
    return best;
  }
  function cleanVoice(v) {
    if (!Array.isArray(v)) return null;
    const seen = new Set(), out = [];
    v.forEach(n => {
      if (!Array.isArray(n) || n.length !== 2) return;
      const se = Number(n[1]);
      let st = Number(n[0]);
      if (!Number.isInteger(se) || se < -36 || se > 36 || seen.has(se)) return;
      if (!Number.isInteger(st) || Math.abs(natSemis(st) - se) > 2) st = stepFor(se, null);
      seen.add(se);
      out.push([st, se]);
    });
    if (out.length < 2 || out.length > 8) return null;
    return out.sort((a, b) => a[1] - b[1]);
  }
  const voiceMidis = v => v.map(n => T.tonicMidi(keyIndex()) + n[1]);
  const letterStep = (letter, semi) => stepFor(semi, ((LETTERS.indexOf(letter) - LETTERS.indexOf(tonicName()[0])) % 7 + 7) % 7);
  function voiceOf(x, opts) {
    const spec = parse(x);
    if (!spec) return null;
    const named = spellTones(spec, effective(spec).tones || T.qualityTones(spec.q));
    const t0 = T.tonicMidi(keyIndex());
    return cleanVoice(midis(spec, opts).map(m => {
      const semi = m - t0, tone = named.find(t => t.pc === ((semi % 12) + 12) % 12);
      return [tone ? letterStep(tone.letter, semi) : stepFor(semi, null), semi];
    }));
  }
  /* ---- a voice's notes, spelled (2026-10-28, Focus) ----
     voiceNotes(v) → [{ step, semi, midi, d, letter, acc, name }] low to high:
     `d` the note's place on a staff (letters from C0: C4 = 28, as staff.js
     counts), `acc` −2 … +2 from the natural letter. spellMidi(midi, dir,
     tones?) → [step, semi] — the letter a new pitch takes: a tone of the
     chord's (`tones`, describe().tones) its letter; else the scale's; else
     the natural; else ♯ going up, ♭ going down. pairOf(d, acc) the other
     way round. */
  const NATPC = [0, 2, 4, 5, 7, 9, 11];
  const ACC = { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' };
  const natMidi = d => 12 * (Math.floor(d / 7) + 1) + NATPC[((d % 7) + 7) % 7];
  function tonicD() {
    const t0 = T.tonicMidi(keyIndex()), L = LETTERS.indexOf(tonicName()[0]);
    for (let d = L; d < 70; d += 7) { const a = t0 - natMidi(d); if (a >= -2 && a <= 2) return d; }
    return 28 + L;
  }
  const pairOf = (d, acc) => [d - tonicD(), natMidi(d) + acc - T.tonicMidi(keyIndex())];
  function voiceNotes(v) {
    const t0 = T.tonicMidi(keyIndex()), d0 = tonicD();
    return (v || []).map(([step, semi]) => {
      const d = d0 + step, midi = t0 + semi, acc = midi - natMidi(d), letter = LETTERS[((d % 7) + 7) % 7];
      return { step, semi, midi, d, letter, acc, name: letter + (ACC[acc] || '') };
    });
  }
  function spellMidi(midi, dir, tones) {
    const t0 = T.tonicMidi(keyIndex()), pc = ((midi - t0) % 12 + 12) % 12, abs = ((midi % 12) + 12) % 12;
    let letter = null;
    const tone = (tones || []).find(t => t.pc === pc);
    if (tone) letter = tone.letter;
    if (!letter) {
      const deg = scale().degrees.find(x => T.degreeSemis(x) === pc);
      if (deg) letter = LETTERS[(LETTERS.indexOf(tonicName()[0]) + T.parseDegree(deg).num - 1) % 7];
    }
    if (!letter && NATPC.indexOf(abs) !== -1) letter = LETTERS[NATPC.indexOf(abs)];
    if (!letter) letter = LETTERS[NATPC.indexOf(dir < 0 ? (abs + 1) % 12 : (abs + 11) % 12)];
    const L = LETTERS.indexOf(letter);
    let acc = ((abs - NATPC[L]) % 12 + 12) % 12;
    if (acc > 6) acc -= 12;
    const d = (Math.round((midi - acc - NATPC[L]) / 12) - 1) * 7 + L;
    return pairOf(d, acc);
  }
  /* ---- a chord named by its notes (D10: the name follows them) ----
     nameVoice(v) → { id, spec } — the chord those notes make, its root
     the bass when it can be (C E G → I; E to F → Isus4; E in the bass →
     I⁶, as the inversion functions name it) — or { unnamed: true, notes }
     when no chord quality has them (C F B). describeVoiced(id, voice) is
     describe(id) — the colour, the place, the key stay the chord it
     started as — with its names from its notes. */
  const TRIAD_Q = ['maj', 'min', 'dim', 'aug'];
  const SEVENTH_Q = ['dom7', 'maj7', 'min7', 'm7b5', 'dim7', 'mmaj7', 'aug7', 'dom7b5'];
  function nameVoice(v) {
    const ns = voiceNotes(cleanVoice(v) || []);
    if (!ns.length) return { unnamed: true, notes: '' };
    const t0 = T.tonicMidi(keyIndex());
    const pcs = Array.from(new Set(ns.map(n => ((n.midi - t0) % 12 + 12) % 12)));
    const bassPc = ((ns[0].midi - t0) % 12 + 12) % 12;
    const roots = [bassPc].concat(pcs.filter(p => p !== bassPc));
    // a quality's notes as a set — with its perfect 5th left out (F A is still IV, F A E♭ still IV7)
    const qset = (id, no5) => {
      let iv = Array.from(new Set(T.QUALITIES[id].iv.map(x => x % 12)));
      if (no5) { if (iv.indexOf(7) === -1) return null; iv = iv.filter(x => x !== 7); if (iv.length < 2) return null; }
      return iv.sort((a, b) => a - b).join();
    };
    const tries = [];
    [false, true].forEach(no5 => roots.forEach(r => tries.push([r, no5])));      // every whole chord first, then a 5th left out
    for (const [r, no5] of tries) {
      const set = pcs.map(p => ((p - r) % 12 + 12) % 12).sort((a, b) => a - b).join();
      const q = Object.keys(T.QUALITIES).find(id => qset(id, no5) === set);
      if (!q) continue;
      const root = T.semisToDegree(r, scale().degrees);
      const i = ((bassPc - r) % 12 + 12) % 12;
      let inv = null;
      if (i && TRIAD_Q.indexOf(q) !== -1) inv = i === 3 || i === 4 ? 'inv6' : i >= 6 && i <= 8 ? 'inv64' : null;
      else if (i && SEVENTH_Q.indexOf(q) !== -1) inv = i === 3 || i === 4 ? 'inv65' : i >= 6 && i <= 8 ? 'inv43' : i >= 9 ? 'inv42' : null;
      const spec = { root, q, mods: inv ? [inv] : [] };
      return { id: toId(spec), spec, slash: i && !inv ? ns[0].name : null };
    }
    return { unnamed: true, notes: Array.from(new Set(ns.map(n => n.name))).join(' ') };
  }
  function describeVoiced(id, voice) {
    const d = describe(id);
    if (!voice || !d.known) return d;
    const n = nameVoice(voice);
    if (n.unnamed) return Object.assign({}, d, { roman: n.notes, letter: n.notes, voiced: true, unnamed: true });
    const v = describe(n.id);
    return Object.assign({}, d, { roman: v.roman, letter: v.letter + (n.slash ? '/' + n.slash : ''), voiced: true, voiceId: n.id });
  }

  /* A new scale gives a chord picked from the panel another chord (IV → iv):
     each note of the voice that was one of its tones moves to the same
     tone of the new chord (the third of IV to the third of iv); a note
     that was not (an added one) stays. */
  function refitVoice(v, fromId, toId) {
    const a = parse(fromId), b = parse(toId);
    if (!v || !a || !b) return v;
    const ta = spellTones(a, effective(a).tones || T.qualityTones(a.q));
    const tb = spellTones(b, effective(b).tones || T.qualityTones(b.q));
    return cleanVoice(v.map(([st, se]) => {
      const i = ta.findIndex(t => t.pc === ((se % 12) + 12) % 12);
      if (i < 0 || !tb[i]) return [st, se];
      let ds = ((tb[i].pc - ta[i].pc) % 12 + 12) % 12;
      if (ds > 6) ds -= 12;
      let dl = ((LETTERS.indexOf(tb[i].letter) - LETTERS.indexOf(ta[i].letter)) % 7 + 7) % 7;
      if (dl > 3) dl -= 7;
      return [st + dl, se + ds];
    })) || v;
  }

  /* ---------------- playing ---------------- */
  function announce(id, list, source) {
    S.soundingChord = { id, midis: list };
    SW.bus.emit('chord:played', { id, midis: list, source: source || 'strip' });
  }
  /* The chord's notes leave the keyboard (user, 2026-09-27): a tap on the
     manuscript — not on a note — or the chord panel going away clears
     them; stepping with the arrows or changing a pitch never does, so the
     chord stays under the tune for as long as it is wanted. */
  function clearSounding() {
    if (!S.soundingChord) return;
    S.soundingChord = null;
    SW.bus.emit('chord:cleared', {});
  }
  /* CHORDS BEND THE SCALE — Digital Accordion's chordBend. While a chord
     is in hand (S.soundingChord: the panel, its keys, the lane, Play —
     until it is cleared, as its lit keys are), each of its notes the
     scale does not have takes the place of the scale's note on the same
     letter: V/V in C puts F♯ where F was, V in C minor B where B♭ was.
     Matching by letter is Digital Accordion's safeguard: a pentatonic
     scale has no F to bend, so V/V leaves it alone. The keyboard follows
     (keymap.js: the melody keys play the bent note; keyboard-dock.js: the
     keys wear it); the notes on the page do not.
     Layout settings → Chords on the panel → "Chords bend the keyboard"
     (layout.chordBend, on unless switched off) turns it off.
       bend() → { letter: { pc, abs, name, deg } }   pc above the tonic, abs absolute
       bendDelta(deg) → semitones a scale degree moves under it (0, ±1 …) */
  function bend() {
    if (SW.settings && SW.settings.layout && SW.settings.layout.chordBend === false) return {};   // Layout settings: off
    const ch = S.soundingChord;
    const spec = ch && parse(ch.id);
    if (!spec) return {};
    const tones = effective(spec).tones || T.qualityTones(spec.q);
    const inScale = new Set(scale().degrees.map(T.degreeSemis));
    const map = {};
    spellTones(spec, tones).forEach(t => {
      if (!inScale.has(t.pc)) map[t.letter] = { pc: t.pc, abs: (keyIndex() + t.pc) % 12, name: t.name, deg: t.deg };
    });
    return map;
  }
  function bendDelta(deg, map) {
    const alt = (map || bend())[T.spellDegree(tonicName(), deg).letter];
    if (!alt) return 0;
    let d = ((alt.pc - T.degreeSemis(deg)) % 12 + 12) % 12;
    if (d > 6) d -= 12;
    return d;
  }

  /* Sound a chord (the id as given — the held buttons are not applied
     here; playPlace does that) and tell the listeners. */
  function play(x, source, opts) {
    const id = toId(x);
    const list = id ? midis(id, opts) : [];          // opts.voice: the chord's own notes
    if (!list.length) { console.warn('Chord ' + x + ' could not be voiced'); return []; }
    SW.audio.playChordFrequencies(list.map(M.midiToFreq));
    announce(id, list, source);
    return list;
  }
  /* ---------------- holding a chord ----------------
     Digital Accordion's way (user, 2026-10-02): a chord rings for as long
     as its key — or a finger on its block — is held (never shorter than a
     tapped chord), and a function key pressed or let go while it is held
     strikes it again, changed: hold I, tap C over and over, and the
     suspension trills — Isus4, I, Isus4, I. A change that leaves the notes
     as they were keeps it ringing (Digital Accordion's retriggerHeld). The
     keyboard's lights, the bend and the corner follow each strike; the
     lane keeps what was written when the chord went down.
       holdPlace(place, holder, source) → id   holder: a key's code, 'p' + a pointer
       holdSpec(x, holder, source) → id        any chord, no place (the Chord Chart's circle, 2026-10-29)
       releaseHold(holder) → place | null · isHeld(place) · releaseAllHolds() */
  const holding = new Map();                 // holder → { place | base (a spec), id, list, voice }
  function holdPlace(place, holder, source) {
    const e = entry(place);
    if (!e) return null;
    releaseHold(holder);                     // the same key or finger, pressed again
    const id = toId(withHeld(e.spec));
    const list = midis(id);
    if (!list.length) return null;
    S.selectedChord = { place, id };
    holding.set(holder, { place, id, list, voice: SW.audio.holdChord(list.map(M.midiToFreq)) });
    announce(id, list, source);
    return id;
  }
  function holdSpec(x, holder, source) {
    const base = parse(x);
    if (!base) return null;
    releaseHold(holder);
    const id = toId(withHeld(base));
    const list = midis(id);
    if (!list.length) return null;
    holding.set(holder, { place: null, base, id, list, voice: SW.audio.holdChord(list.map(M.midiToFreq)) });
    announce(id, list, source);
    return id;
  }
  function releaseHold(holder) {
    const h = holding.get(holder);
    if (!h) return null;
    holding.delete(holder);
    if (h.voice) h.voice.release();
    return h.place;
  }
  const isHeld = place => Array.from(holding.values()).some(h => h.place === place);
  function releaseAllHolds() { Array.from(holding.keys()).forEach(releaseHold); }
  function restrike() {
    holding.forEach(h => {
      const e = h.place ? entry(h.place) : { spec: h.base };
      if (!e || !e.spec) return;
      const id = toId(withHeld(e.spec));
      const list = midis(id);
      if (!list.length || (list.length === h.list.length && list.every((m, i) => m === h.list[i]))) return;
      if (h.voice) h.voice.stop();
      h.voice = SW.audio.holdChord(list.map(M.midiToFreq));
      h.id = id;
      h.list = list;
      if (h.place) S.selectedChord = { place: h.place, id };
      announce(id, list, 'mod');
    });
  }
  // the window losing focus never sends the let-go
  window.addEventListener('blur', releaseAllHolds);
  document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAllHolds(); });

  /* A place on the board, played as the held buttons make it: returns the
     id of what sounded (what the lane writes). */
  function playPlace(place, source) {
    const e = entry(place);
    if (!e) return null;
    const id = toId(withHeld(e.spec));
    S.selectedChord = { place, id };
    play(id, source);
    return id;
  }

  /* ---------------- how chords are named, and whether their notes show ----------------
     Digital Accordion's two head buttons: names as roman numerals (I IV V)
     or letters (C F G) — one or the other — and ♪ notes, a column of the
     chord's notes inside every block (letters with letters, solfège with
     numerals, as Digital Accordion shows degrees). View prefs. */
  const naming = () => (view().chordNames === 'letter' ? 'letter' : 'roman');
  function setNaming(mode) {
    mode = mode === 'letter' ? 'letter' : 'roman';
    if (mode === naming()) return;
    SW.settings.setView({ chordNames: mode }, { quiet: true });
    SW.bus.emit('chords:changed', { why: 'naming' });
  }
  const tonesOn = () => !!view().chordTones;
  function setTones(on) {
    if (!!on === tonesOn()) return;
    SW.settings.setView({ chordTones: !!on }, { quiet: true });
    SW.bus.emit('chords:changed', { why: 'tones' });
  }
  /* the name a component shows for a described chord, and the text on a note pill */
  const nameOf = d => (naming() === 'letter' ? d.letter : d.roman);
  const otherNameOf = d => (naming() === 'letter' ? d.roman : d.letter);
  const toneText = t => (naming() === 'letter' ? t.name : t.solfege);

  /* ---------------- keys ---------------- */
  const placeForKey = k => (PLACES.indexOf(String(k || '').toLowerCase()) !== -1 ? String(k).toLowerCase() : null);
  const keyOf = place => String(place).toUpperCase();

  /* ---------------- the room changed ---------------- */
  SW.bus.on('scale:changed', () => { S.selectedChord = null; clearSounding(); clearMods(); SW.bus.emit('chords:changed', { why: 'scale' }); });
  // a new key: the chord in hand was the old key's (the keyboard drops its lit keys, and its bend)
  SW.bus.on('key:changed', clearSounding);
  SW.bus.on('score:loaded', () => { S.selectedChord = null; S.soundingChord = null; clearMods(); SW.bus.emit('chords:changed', { why: 'song' }); });
  SW.bus.on('layout:changed', () => SW.bus.emit('chords:changed', { why: 'layout' }));
  // the chord panel put away (the Song or Keyboard tab, View, a lesson): its chord leaves the keys
  ['view:changed', 'policy:changed'].forEach(evt => SW.bus.on(evt, () => { if (SW.settings && !SW.settings.shows('strip')) clearSounding(); }));
  window.addEventListener('blur', clearMods);

  SW.chords = {
    PLACES, SHAPE, CHORD_SETS, SLOT_KEYS, MOD_FUNCS, MOD_BY_ID, DEFAULT_SLOTS, LEGACY_PLACE,
    scaleId, scale, scaleGroups,
    board, entry, presetAt, presetLabel, setBoard, boardModel,
    parse, toId, isKnown, sameChord,
    describe, midis, spellTones, play, playPlace, announce, clearSounding, bend, bendDelta,
    cleanVoice, voiceMidis, voiceOf, refitVoice, voiceNotes, spellMidi, pairOf, nameVoice, describeVoiced,
    holdPlace, holdSpec, releaseHold, isHeld, releaseAllHolds,
    offered, placeShown, placeAllowed, setIndex, setChordSet, describeSet,
    heldMods, setMod, clearMods, isModKey, slotFunc, setSlot, resetSlots, modSlots, withHeld,
    placeForKey, keyOf,
    naming, setNaming, tonesOn, setTones, nameOf, otherNameOf, toneText,
    labelHTML, nameScale, modLabelHTML, figured, escapeHtml
  };
})();

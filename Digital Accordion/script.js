/* ==========================================================================
   Digital Accordion — script.js   (the app was called Key Blocks until
   2026-09-26; storage keys and the `key-blocks` library id keep that name
   so saved layouts and links still open)
   One data model (rows of blocks per side) and three views of it: Tower,
   Panels and Keys. Everything the user can change lives in `layout`, which
   is what a share link carries and what the library stores.
   ========================================================================== */
(() => {
'use strict';
const T = Theory;
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

const LIBRARY_KEY = 'key_blocks_library_v1';
const SCALES_KEY = 'key_blocks_scales_v1';     // the user's own saved scales
const SANDBOX_KEY = 'key_blocks_sandbox_v1';   // the one scratch scale
const CURRENT_KEY = 'key_blocks_current_v1';
const VERSION = 4;                              // 2: T→G (and, briefly, S/D) 2026-09-27; 3: S/D back, number row 2 4 / 1 3 5 (upgradeLayout); 4: Panels shapes by identity, notes' Panels layout 'grid', keys by role, the Digital style retired (2026-09-27)

/* ---------------- computer keyboard ---------------- */
const KB_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];
/* No keys are reserved any more: the ♭ ♯ hotkeys were retired on 2026-09-20
   (the top-bar buttons remain), so - and = are ordinary playable keys. */
const RESERVED = {};
const ALL_KEYS = new Set(KB_ROWS.flat());
const LEFT_KEYS = new Set('12345qwertasdfgzxcvb'.split(''));
const SHIFT_MAP = { '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  ':': ';', '<': ',', '>': '.', '?': '/', '_': '-', '+': '=', '{': '[', '}': ']', '"': "'" };
/* Melody by scale degree from the tonic on j: the bottom row n m , . / is
   3 4 5 6 7 below it, the home and top rows climb k l ; u i o p, and the
   number row carries on 7 8 9 0 -. The left hand mirrors the same shape. */
const MELODY_HANDS = {
  right: { tonic: ['j'], up: ['k', 'l', ';', 'u', 'i', 'o', 'p', '7', '8', '9', '0', '-'], down: ['/', '.', ',', 'm', 'n'] },
  left:  { tonic: ['a'], up: ['s', 'd', 'f', 'q', 'w', 'e', 'r', '1', '2', '3', '4', '5'], down: ['b', 'v', 'c', 'x', 'z'] }
};
/* Keys follow the chord tower's reading order (bottom row first, left to
   right, a stack bottom to top), and buildChordSide lays the ranked chords
   out so that the same finger holds the same relationship in every scale:
     1 3 5        number row (top[0], top[2], top[4])
     2 4          number row (top[1], top[3])
     Q W E        ranks 8 9 7   (major: V/vi IV/IV V/V)
     A S D        ranks 4 3 2   (major: vi IV V)
     F | G/R      rank 1 wide, ranks 5 and 6 stacked (major: I, ii under iii)
   User's changes, 2026-09-27: rank 5 moved from T to G, so the stack's
   bottom sits on the home row beside F (T took G's old job: the key for an
   added chord); the number-row chords kept their keys but moved from
   4 5 under 1 2 3 to 2 4 under 1 3 5. (S and D were swapped for a few
   hours that day and put back — see upgradeLayout.) */
const CHORD_HANDS = {
  left:  ['f', 'g', 'r', 'a', 's', 'd', 'q', 'w', 'e', '2', '4', '1', '3', '5', 't'],
  right: ['j', 'h', 'u', ';', 'l', 'k', 'p', 'o', 'i', '9', '7', '0', '8', '6', 'y']
};
/* Since 2026-09-27 a chord's key follows the chord itself, not its row: scale.chords[i] answers to
   CHORD_ROLE[i] on the left hand (I → F, V → D, IV → S, vi → A, ii → G, iii → R, V/V → E,
   V/vi → Q, IV/IV → W in major), top[i] to the number key i + 1, and the right hand mirrors
   (RIGHT_OF). A chord the preset does not know gets the spare key, T (Y). The Panels view lays the
   chords out by the same roles: F (3/4) beside G; A S D; Q W E R; 1 2 3 4 5 — the same shape in
   every scale and key, with the chords outside the set left out. */
const CHORD_ROLE = ['f', 'd', 's', 'a', 'g', 'r', 'e', 'q', 'w'];
const RIGHT_OF = {}; CHORD_HANDS.left.forEach((k, i) => { RIGHT_OF[k] = CHORD_HANDS.right[i]; });
const CHORD_ORDER = ['f', 'g', 'a', 's', 'd', 'q', 'w', 'e', 'r', '1', '2', '3', '4', '5', 't'];   // the Panels shape's reading order
const PANEL_CHORD_SHAPE = [['f', 'g'], ['a', 's', 'd'], ['q', 'w', 'e', 'r'], ['1', '2', '3', '4', '5']];
function chordRole(b, scale) {
  if (!b) return null;
  const i = scale.chords.findIndex(c => c.root === b.root && c.q === b.q);
  if (i >= 0) return CHORD_ROLE[i];
  const j = (scale.top || []).findIndex(c => c.root === b.root && c.q === b.q);
  return j >= 0 ? String(j + 1) : null;
}
/* Z X C V B are chord modifiers (held keys, or the column beside the
   chord tower): sus2, add9, sus4, ♭7, maj7. They are never chord keys. */
const MOD_KEYS = { z: 'Z', x: 'X', c: 'C', v: 'V', b: 'B' };
/* The five chord buttons sit on Z X C V B; what each one does is the layout's
   own choice (`layout.modSlots`, set in Edit mode or from Settings). The colour
   functions go through the hand-off's engine by its letters; the inversions are
   voiced here. 6/5, 4/3 and 4/2 make a 7th chord first — the scale's own 7th
   above the root — unless the chord already has one. */
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
const MOD_BY_ID = {}; MOD_FUNCS.forEach(f => { MOD_BY_ID[f.id] = f; });
const DEFAULT_SLOTS = ['sus2', 'add9', 'sus4', 'b7', 'maj7'];
const LETTER_TO_MOD = { Z: 'sus2', X: 'add9', C: 'sus4', V: 'b7', B: 'maj7' };   // how block.mods were kept before 2026-09-26
let heldMods = new Set();                     // slot keys (Z X C V B) held down
/* The chord set: how much of the chord tower is out. Each set adds the chords
   on its keys — left hand here; the mirrored preset uses the same places on
   the right hand (J K L ; …). Extreme is everything, added chords included.
   Below Extreme the Z X C V B tabs lie along the bottom of the chord side. */
const CHORD_SETS = [
  { id: 'core', name: 'Core', keys: 'fdsa' },
  { id: 'full', name: 'Full', keys: 'gr' },
  { id: 'extended', name: 'Extended', keys: 'eqw' },
  { id: 'extreme', name: 'Extreme', keys: '12345t' }
];
const EXTREME = CHORD_SETS.length - 1;
const CHORD_RANK = 'fdsagreqw12345t'.split('');        // importance, as the presets rank the chords
const LEFT_OF = {};                                    // a chord key → its left-hand place
CHORD_HANDS.left.forEach((k, i) => { LEFT_OF[k] = k; LEFT_OF[CHORD_HANDS.right[i]] = k; });
const SET_OF = {};                                     // a left-hand place → its set
CHORD_SETS.forEach((s, i) => s.keys.split('').forEach(k => { SET_OF[k] = i; }));
const KEY_PRESETS = [
  { id: 'split', name: 'Chords left hand · melody right hand' },
  { id: 'split-mirror', name: 'Melody left hand · chords right hand' },
  { id: 'melody-both', name: 'Melody on both hands (Melody Tower)' },
  { id: 'chords-both', name: 'Chords on both hands (Chord Tower)' },
  { id: 'custom', name: 'Custom — as bound in Edit mode' }
];
const SIZES = [0.6, 1, 1.5, 2, 3];
const SIZE_NAMES = { 0.6: 'Short', 1: 'S', 1.5: 'M', 2: 'Tall', 3: 'Giant' };
/* The Panels view's three layouts for the notes (2026-09-27): the four-across grid it always had,
   and the two tower designs that used to be the Digital style's. All three hold the same notes;
   the Buttons view places them on the standard board whichever is chosen. */
const MELODY_DESIGNS = [
  { id: 'grid', name: 'Grid — four across, 4̣ 5̣ 6̣ 7̣ up to 5′' },
  { id: 'A', name: 'Design A — skinny 7, big 1, 2 under 3' },
  { id: 'B', name: 'Design B — big 1 beside a 2·3·4 stack' }
];
const WIDTHS = [0.55, 0.8, 1, 1.2, 1.45, 2, 3];
const WIDTH_NAMES = { 0.55: 'Skinny', 0.8: 'Narrow', 1: 'Normal', 1.2: 'Wide', 1.45: 'Wider', 2: 'Double', 3: 'Triple' };

/* ---------------- state ---------------- */
let layout = null;
// Each side locks on its own: the Accordion style gives each a switch; Digital's Edit button unlocks both.
const editSides = { chords: false, melody: false };
function anyEditing() { return editSides.chords || editSides.melody; }
/* Where a chord tab or key cap is being edited: in Keys view either side will do. */
function editingHere(side) { return layout.view === 'keys' ? anyEditing() : editSides[side]; }
const regOpen = { chords: false, melody: false };   // each side's register drawer (Accordion style)
let dirty = false;
let libraryOpenState = false;
const held = new Map();          // source -> { voice, side, id }
const activeCount = new Map();   // side/id -> n
let keyIndex = {};               // key -> [{side,id}]
let sharpHeld = false, flatHeld = false, sharpLatch = false, flatLatch = false;
let octaveLatch = false, octaveKey = false;
let selectedBlock = null;        // { side, id } while the editor is open
let saveTimer = null;

/* ==================================================================
   LAYOUT MODEL
   ================================================================== */
function newId(L, prefix) { L.seq = (L.seq || 0) + 1; return prefix + L.seq; }

/* The melody tower, bottom to top, for a seven-note scale:
     4′ 5′ 6′          short, even row (keys 9 0 -)
     7 | 1′ | 2′/3′    tall row: skinny 7, big tonic, 2 under 3
     4  5  6           short, even row
     7̣ | 1 | 2/3       tall row
     4̣ 5̣ 6̣            short, even row
     3̣                 one long, short block (key n)
   Widths in a tall row are 0.55 / 1.45 / 1 so the 2/3 column lines up
   under the 6 above it. Other scale sizes keep the same shape with
   their own degree counts. A row member that is an array is a stack. */
function buildMelodySide(L) {
  return (L.melodyDesign === 'B' ? buildMelodyB : buildMelodyA)(L);
}
function buildMelodyA(L) {
  const scale = T.SCALE_BY_ID[baseOf(L)];
  const degs = scale.degrees, n = degs.length;
  const blocks = {}, rows = [];
  const mk = (deg, oct, size, w) => { const id = newId(L, 'm'); blocks[id] = { deg, oct, size, w: w || 1, keys: [], label: null }; return id; };
  const mids = degs.slice(3, n - 1);                 // 4 5 6
  const tall = oct => [mk(degs[n - 1], oct - 1, 2, 0.55), mk(degs[0], oct, 2, 1.45), [mk(degs[1], oct, 1), mk(degs[2], oct, 1)]];
  const even = oct => mids.map(d => mk(d, oct, 1));
  if (n >= 3) rows.push([mk(degs[2], -1, 0.6)]);
  if (mids.length) rows.push(even(-1));
  rows.push(tall(0));
  if (mids.length) rows.push(even(0));
  rows.push(tall(1));
  if (mids.length) rows.push(even(1));
  return { custom: false, rows, blocks };
}
/* Design B, bottom to top, for a seven-note scale:
     2′ 3′ 4′ 5′ 6′    small blocks (keys 7 8 9 0 -)
     5·6·7 | 1′        a stack of three beside the big tonic
     1 | 2·3·4         the big tonic beside a stack of three
     3̣ 4̣ 5̣ 6̣ 7̣        the bottom row (n m , . /)                          */
function buildMelodyB(L) {
  const scale = T.SCALE_BY_ID[baseOf(L)];
  const degs = scale.degrees, n = degs.length;
  const blocks = {}, rows = [];
  const mk = (deg, oct, size, w) => { const id = newId(L, 'm'); blocks[id] = { deg, oct, size, w: w || 1, keys: [], label: null }; return id; };
  const stack = list => list.length === 1 ? list[0] : list;
  rows.push(degs.slice(2).map(d => mk(d, -1, 1)));
  rows.push([mk(degs[0], 0, 2, 2), stack(degs.slice(1, 4).map(d => mk(d, 0, 1)))]);
  const upper = degs.slice(4);
  rows.push(upper.length ? [stack(upper.map(d => mk(d, 0, 1))), mk(degs[0], 1, 2, 2)] : [mk(degs[0], 1, 2, 2)]);
  rows.push(degs.slice(1, n - 1).map(d => mk(d, 1, 1)));
  return { custom: false, rows: rows.filter(r => r.length), blocks };
}
/* The Grid keeps the blocks as they are (it draws its own); Design A or B rebuilds the rows. */
function setMelodyDesign(id) {
  if (!MELODY_DESIGNS.some(d => d.id === id)) return;
  layout.melodyDesign = id;
  if (id !== 'grid') {
    layout.melody = buildMelodySide(layout);
    applyKeyPreset(layout, layout.keyPreset === 'custom' ? 'split' : undefined);
    if (!isBuiltIn(layout.scale)) markSandbox();
  }
  stopAllBlocks();
  touch(); renderAll();
  toast('Panels: ' + (id === 'grid' ? 'the grid' : 'Design ' + id));
}

function buildChordSide(L) {
  const scale = T.SCALE_BY_ID[baseOf(L)];
  const blocks = {}, rows = [];
  const mk = (spec, size, w) => { const id = newId(L, 'c'); blocks[id] = { root: spec.root, q: spec.q, label: spec.label || null, oct: 0, size, w: w || 1, keys: [], mods: [] }; return id; };
  const c = scale.chords, top = scale.top || [];
  const pick = (list, i, size, w) => (list[i] ? [mk(list[i], size, w)] : []);
  // the Panels shape (2026-09-27): F wide (3/4) beside G; A S D; Q W E R; 1 2 3 4 5
  rows.push([...pick(c, 0, 2, 3), ...pick(c, 4, 1)]);                                       // F | G
  rows.push([...pick(c, 3, 1), ...pick(c, 2, 1), ...pick(c, 1, 1)]);                        // A S D
  rows.push([...pick(c, 7, 1), ...pick(c, 8, 1), ...pick(c, 6, 1), ...pick(c, 5, 1)]);      // Q W E R
  rows.push([...pick(top, 0, 1), ...pick(top, 1, 1), ...pick(top, 2, 1), ...pick(top, 3, 1), ...pick(top, 4, 1)]);   // 1 2 3 4 5
  return { custom: false, rows: rows.filter(r => r.length), blocks };
}

function orderedIds(side) { return side.rows.flat(2); }

/* ---------- the chord set: Core, Full, Extended, Extreme ----------
   A chord's place is the left-hand key it answers to (its own keys, read
   through the mirror for the right hand), or — with no chord key, as when the
   melody has both hands — the key its spot in the tower would have. */
function chordSetIndex(L) {
  const i = CHORD_SETS.findIndex(c => c.id === (L || layout).chordSet);
  return i < 0 ? EXTREME : i;
}
function chordPlace(id, L) {
  L = L || layout;
  const b = L.chords.blocks[id];
  let best = null;
  (b ? b.keys : []).forEach(k => { const p = LEFT_OF[k]; if (p && (!best || CHORD_RANK.indexOf(p) < CHORD_RANK.indexOf(best))) best = p; });
  return best || chordRole(b, T.SCALE_BY_ID[baseOf(L)]) || CHORD_ORDER[orderedIds(L.chords).indexOf(id)] || 't';
}
function chordSetOf(id, L) { const t = SET_OF[chordPlace(id, L)]; return t === undefined ? EXTREME : t; }
function chordShown(id) { return chordSetIndex() === EXTREME || chordSetOf(id) <= chordSetIndex(); }
/* The chord rows with the chords outside the set taken out: a stack left
   with one block becomes that block, an emptied row goes. */
function chordRowsInSet() {
  const rows = layout.chords.rows;
  if (chordSetIndex() === EXTREME) return rows;
  return rows
    .map(r => r.map(m => Array.isArray(m) ? m.filter(chordShown) : (chordShown(m) ? m : null))
      .filter(m => m && (!Array.isArray(m) || m.length))
      .map(m => Array.isArray(m) && m.length === 1 ? m[0] : m))
    .filter(r => r.length);
}
/* The Panels view's chord shape: each chord in the place of the key it answers to, whatever the
   scale; chords the preset does not know in a row of their own at the top; chords outside the set
   left out (a row emptied goes). */
function panelChordRows() {
  const S = layout.chords, scale = T.SCALE_BY_ID[sc()], byRole = {}, extra = [];
  orderedIds(S).forEach(id => { const role = chordRole(S.blocks[id], scale); if (role && !byRole[role]) byRole[role] = id; else extra.push(id); });
  const rows = PANEL_CHORD_SHAPE.map(r => r.map(k => byRole[k]).filter(Boolean));
  if (extra.length) rows.push(extra);
  return rows.map(r => r.filter(chordShown)).filter(r => r.length);
}
/* What a key plays right now: its blocks, less any chord outside the set. */
function playable(k) { return (keyIndex[k] || []).filter(o => o.side !== 'chords' || chordShown(o.id)); }
/* "Core — I V IV vi (F D S A)": the chords a set brings in, in order of importance. */
function describeChordSet(i) {
  if (i === EXTREME) return 'Extreme — all ' + Object.keys(layout.chords.blocks).length + ' chords';
  const ids = Object.keys(layout.chords.blocks).filter(id => chordSetOf(id) === i)
    .sort((a, b) => CHORD_RANK.indexOf(chordPlace(a)) - CHORD_RANK.indexOf(chordPlace(b)));
  const names = ids.map(id => blockInfo('chords', layout.chords.blocks[id]).main).join(' ');
  const keys = ids.map(id => { const b = layout.chords.blocks[id]; return (b.keys.find(k => LEFT_OF[k]) || '').toUpperCase(); }).filter(Boolean).join(' ');
  return CHORD_SETS[i].name + ' — ' + (i ? 'adds ' : '') + (names || 'no chords') + (keys ? ' (' + keys + ')' : '');
}
function setChordSet(id) {
  if (!CHORD_SETS.some(c => c.id === id)) return;
  stopAllBlocks();
  layout.chordSet = id;
  touch(); renderAll();
  toast(describeChordSet(chordSetIndex()));
}

/* ---------- scales: built-in, the Sandbox, and saved ones ----------
   `layout.scale` is a built-in id, 'sandbox', or 'custom:<id>'. The
   built-in scale a layout is based on (`scaleBase`) is what the theory
   engine sees — degrees, spelling, chord bank — while the blocks
   themselves are whatever the user built. */
function isBuiltIn(id) { return !!T.SCALE_BY_ID[id]; }
function baseOf(L) { return isBuiltIn(L.scale) ? L.scale : (isBuiltIn(L.scaleBase) ? L.scaleBase : 'major'); }
function sc() { return baseOf(layout); }
function getScales() { try { const raw = localStorage.getItem(SCALES_KEY); const s = raw ? JSON.parse(raw) : {}; return (s && typeof s === 'object') ? s : {}; } catch (e) { return {}; } }
function saveScales(s) { try { localStorage.setItem(SCALES_KEY, JSON.stringify(s)); } catch (e) { toast('No room to save — the browser storage is full'); } }
function loadSandbox() { try { const raw = localStorage.getItem(SANDBOX_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function saveSandbox() {
  if (layout.scale !== 'sandbox') return;
  try { localStorage.setItem(SANDBOX_KEY, JSON.stringify({ v: VERSION, base: sc(), melodyDesign: layout.melodyDesign, melody: layout.melody, chords: layout.chords, savedAt: Date.now() })); } catch (e) {}
}
function scaleName(id, L) {
  if (isBuiltIn(id)) return T.SCALE_BY_ID[id].name;
  if (id === 'sandbox') return 'Sandbox';
  const rec = getScales()[String(id).slice(7)];
  return rec ? rec.name : (L ? T.SCALE_BY_ID[baseOf(L)].name : 'Sandbox');
}
/* The first edit to a scale's blocks moves the work into the Sandbox, so
   a built-in or saved scale is never changed in place. */
function markSandbox() {
  if (layout.scale === 'sandbox') { saveSandbox(); return; }
  const previous = loadSandbox();
  layout.scaleBase = sc();
  layout.scale = 'sandbox';
  saveSandbox();
  toast(previous ? 'Editing in the Sandbox — the previous Sandbox was replaced. Save it as a scale to keep it.' : 'Editing in the Sandbox — save it as a scale to keep it.');
}
function newScaleId() { return 'sc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6); }
function saveScaleAs(name) {
  const scales = getScales();
  const id = newScaleId();
  scales[id] = { v: VERSION, id, name, base: sc(), melodyDesign: layout.melodyDesign, melody: cloneLayout(layout.melody), chords: cloneLayout(layout.chords), createdAt: Date.now() };
  saveScales(scales);
  layout.scale = 'custom:' + id; layout.scaleBase = scales[id].base;
  try { localStorage.removeItem(SANDBOX_KEY); } catch (e) {}
  touch(); renderAll();
  toast('Saved the scale “' + name + '”');
}
function deleteScale(id) {
  const scales = getScales(); const rec = scales[id]; if (!rec) return;
  delete scales[id]; saveScales(scales);
  if (layout.scale === 'custom:' + id) { layout.scaleBase = rec.base; markSandbox(); renderAll(); }
}

/* Panels view shows the melody as a solid 4-wide grid, bottom to top
   4̣5̣6̣7̣ / 1234 / 567 1′ / 2′3′4′5′ — sixteen scale steps from the 4th
   note of the low octave, whatever the scale's size. A cell uses the
   tower's own block when one has that pitch (so its keys, highlight and
   chord bending carry over) and a fill-in note otherwise. */
let panelVirtual = {};
function getBlock(side, id) { return layout[side].blocks[id] || (side === 'melody' ? panelVirtual[id] : null) || null; }
function panelMelodyRows() {
  panelVirtual = {};
  const degs = T.SCALE_BY_ID[sc()].degrees, n = degs.length;
  const S = layout.melody;
  const byMidi = {};
  orderedIds(S).forEach(id => { const b = S.blocks[id]; const m = melodyMidiOf(layout, b); if (!byMidi[m] || (!S.blocks[byMidi[m]].keys.length && b.keys.length)) byMidi[m] = id; });
  const ids = [];
  for (let i = 0; i < 16; i++) {
    const step = 3 + i, deg = degs[step % n], oct = -1 + Math.floor(step / n);
    const m = T.melodyMidi(layout.key, deg, oct);
    if (byMidi[m]) ids.push(byMidi[m]);
    else { const id = 'v' + i; panelVirtual[id] = { deg, oct, size: 1, w: 1, keys: [], label: null }; ids.push(id); }
  }
  const rows = [];
  for (let i = 0; i < 16; i += 4) rows.push(ids.slice(i, i + 4));
  return rows;
}

function melodyMidiOf(L, b) { return T.melodyMidi(L.key, b.deg, b.oct); }

function applyKeyPreset(L, override) {
  const p = override || L.keyPreset;
  if (p === 'custom') return;
  const melodyHands = p === 'split' ? ['right'] : p === 'split-mirror' ? ['left'] : p === 'melody-both' ? ['left', 'right'] : [];
  const chordHands = p === 'split' ? ['left'] : p === 'split-mirror' ? ['right'] : p === 'chords-both' ? ['left', 'right'] : [];
  Object.values(L.melody.blocks).forEach(b => { b.keys = []; });
  Object.values(L.chords.blocks).forEach(b => { b.keys = []; });

  // melody: by pitch, anchored on the tonic in the main octave
  const ids = Object.keys(L.melody.blocks).sort((a, b) => melodyMidiOf(L, L.melody.blocks[a]) - melodyMidiOf(L, L.melody.blocks[b]));
  const uniq = []; const seen = new Set();
  ids.forEach(id => { const m = melodyMidiOf(L, L.melody.blocks[id]); if (!seen.has(m)) { seen.add(m); uniq.push(id); } });
  let anchor = uniq.findIndex(id => { const b = L.melody.blocks[id]; return T.degreeSemis(b.deg) === 0 && b.oct === 0; });
  if (anchor < 0) anchor = Math.floor(uniq.length / 2);
  melodyHands.forEach(h => {
    const H = MELODY_HANDS[h];
    if (uniq[anchor]) L.melody.blocks[uniq[anchor]].keys.push(...H.tonic);
    for (let i = anchor + 1, k = 0; i < uniq.length && k < H.up.length; i++, k++) L.melody.blocks[uniq[i]].keys.push(H.up[k]);
    for (let i = anchor - 1, k = 0; i >= 0 && k < H.down.length; i--, k++) L.melody.blocks[uniq[i]].keys.push(H.down[k]);
  });
  // chords: by what each chord is (its role in the scale's preset); a chord the preset does not know gets the spare key
  const scale = T.SCALE_BY_ID[baseOf(L)], cids = orderedIds(L.chords);
  chordHands.forEach(h => {
    const taken = new Set(), extras = [];
    cids.forEach(id => {
      const role = chordRole(L.chords.blocks[id], scale);
      if (role && !taken.has(role)) { taken.add(role); L.chords.blocks[id].keys.push(h === 'left' ? role : RIGHT_OF[role]); }
      else extras.push(id);
    });
    if (extras.length) L.chords.blocks[extras[0]].keys.push(h === 'left' ? 't' : 'y');
  });
}

function makeLayout(opts) {
  opts = opts || {};
  const L = {
    v: VERSION, id: null, title: '', createdAt: Date.now(), seq: 0,
    key: opts.key !== undefined ? opts.key : 0,
    scale: opts.scale || 'major', scaleBase: opts.scale || 'major',
    view: opts.view || 'tower', show: 'both', order: 'chords-left',
    keyPreset: opts.keyPreset || 'split', showKeys: true, chordTones: false, chordBend: true,
    melodyDesign: opts.melodyDesign || 'grid', chordSet: 'extreme', modSlots: DEFAULT_SLOTS.slice(),
    naming: { melody: 'solfege', chords: 'roman' },
    sound: { melody: opts.melodySound || 'piano', chords: opts.chordSound || 'pad', melodyLevel: 0.85, chordsLevel: 0.7, reverb: 0.35 },
    melody: null, chords: null
  };
  L.melody = buildMelodySide(L);
  L.chords = buildChordSide(L);
  applyKeyPreset(L);
  return L;
}

/* Make anything that claims to be a layout safe to use. */
function normalizeLayout(src) {
  const srcBase = src && (isBuiltIn(src.scale) ? src.scale : (isBuiltIn(src.scaleBase) ? src.scaleBase : 'major'));
  // before v4 the design named the Digital tower's shape, which is gone: those layouts open on the Panels grid
  const base = makeLayout({ key: src && src.key, scale: srcBase || 'major', melodyDesign: src && MELODY_DESIGNS.some(d => d.id === src.melodyDesign) && (Number(src.v) || 1) >= 4 ? src.melodyDesign : 'grid' });
  if (!src || typeof src !== 'object') return base;
  const L = base;
  if (src.scale === 'sandbox') L.scale = 'sandbox';
  else if (typeof src.scale === 'string' && src.scale.startsWith('custom:')) L.scale = getScales()[src.scale.slice(7)] ? src.scale : 'sandbox';
  L.scaleBase = srcBase;
  L.id = typeof src.id === 'string' ? src.id : null;
  L.title = typeof src.title === 'string' ? src.title.trim().slice(0, 60) : '';
  L.createdAt = Number(src.createdAt) || Date.now();
  L.isStarter = !!src.isStarter;
  L.key = Math.min(11, Math.max(0, parseInt(src.key, 10) || 0));
  if (['tower', 'panels', 'keys'].includes(src.view)) L.view = src.view;
  if (['both', 'chords', 'melody'].includes(src.show)) L.show = src.show;
  if (['chords-left', 'melody-left'].includes(src.order)) L.order = src.order;
  if (KEY_PRESETS.some(p => p.id === src.keyPreset)) L.keyPreset = src.keyPreset;
  if (src.showKeys !== undefined) L.showKeys = !!src.showKeys;
  if (src.chordTones !== undefined) L.chordTones = !!src.chordTones;
  if (src.chordBend !== undefined) L.chordBend = !!src.chordBend;
  if (CHORD_SETS.some(c => c.id === src.chordSet)) L.chordSet = src.chordSet;
  if (Array.isArray(src.modSlots) && src.modSlots.length === SLOT_KEYS.length) L.modSlots = src.modSlots.map(id => MOD_BY_ID[id] ? id : null);
  if (src.naming) {
    if (['solfege', 'letter', 'degree', 'both'].includes(src.naming.melody)) L.naming.melody = src.naming.melody;
    if (['roman', 'letter', 'both'].includes(src.naming.chords)) L.naming.chords = src.naming.chords;
  }
  if (src.sound) {
    if (Audio.PRESETS[src.sound.melody]) L.sound.melody = src.sound.melody;
    if (Audio.PRESETS[src.sound.chords]) L.sound.chords = src.sound.chords;
    ['melodyLevel', 'chordsLevel', 'reverb'].forEach(k => { const v = Number(src.sound[k]); if (!isNaN(v)) L.sound[k] = Math.min(1, Math.max(0, v)); });
  }
  const validKeys = keys => Array.isArray(keys) ? keys.filter(k => typeof k === 'string' && ALL_KEYS.has(k) && !RESERVED[k]).slice(0, 6) : [];
  const readSide = (s, kind) => {
    if (!s || typeof s !== 'object' || !s.blocks || !Array.isArray(s.rows)) return null;
    const blocks = {};
    Object.keys(s.blocks).forEach(id => {
      const b = s.blocks[id]; if (!b) return;
      const size = SIZES.includes(Number(b.size)) ? Number(b.size) : 1;
      const w = WIDTHS.includes(Number(b.w)) ? Number(b.w) : 1;
      const oct = Math.min(2, Math.max(-2, parseInt(b.oct, 10) || 0));
      const label = (typeof b.label === 'string' && b.label.trim()) ? b.label.trim().slice(0, 12) : null;
      if (kind === 'melody') {
        if (!/^[#b]{0,2}[1-7]$/.test(String(b.deg))) return;
        blocks[id] = { deg: String(b.deg), oct, size, w, keys: validKeys(b.keys), label };
      } else {
        if (!/^[#b]{0,2}[1-7]$/.test(String(b.root)) || !T.QUALITIES[b.q]) return;
        const mods = Array.isArray(b.mods) ? b.mods.map(m => LETTER_TO_MOD[m] || m).filter((m, i, a) => MOD_BY_ID[m] && a.indexOf(m) === i) : [];
        blocks[id] = { root: String(b.root), q: b.q, oct, size, w, keys: validKeys(b.keys), label, mods };
      }
    });
    const member = m => Array.isArray(m) ? m.filter(id => blocks[id]) : (blocks[m] ? m : null);
    const rows = s.rows.map(r => Array.isArray(r) ? r.map(member).filter(m => m && (!Array.isArray(m) || m.length)).map(m => Array.isArray(m) && m.length === 1 ? m[0] : m) : []).filter(r => r.length);
    const placed = new Set(rows.flat(2));
    Object.keys(blocks).forEach(id => { if (!placed.has(id)) rows.push([id]); });
    if (!rows.length) return null;
    const out = { custom: !!s.custom, rows, blocks };
    // a board designed in Accordion Builder: each block's centre and face, in the builder's own area
    const bd = s.board;
    if (bd && typeof bd === 'object' && bd.buttons && typeof bd.buttons === 'object') {
      const w = Number(bd.w), h = Number(bd.h), buttons = {};
      if (w >= 40 && w <= 20000 && h >= 40 && h <= 20000) {
        Object.keys(bd.buttons).forEach(id => {
          const c = bd.buttons[id]; if (!blocks[id] || !c) return;
          const cx = Number(c.cx), cy = Number(c.cy), d = Number(c.d);
          if (isFinite(cx) && isFinite(cy) && d > 0 && d <= 4000) buttons[id] = { cx, cy, d };
        });
        if (Object.keys(buttons).length) out.board = { w, h, tabs: ['bottom', 'side', 'none'].includes(bd.tabs) ? bd.tabs : 'bottom', buttons };
      }
    }
    return out;
  };
  const m = readSide(src.melody, 'melody'), c = readSide(src.chords, 'chords');
  if (m) L.melody = m;
  if (c) L.chords = c;
  if (c && (Number(src.v) || 1) < VERSION) upgradeLayout(L, Number(src.v) || 1);
  // ids must stay unique for anything we add later
  let maxSeq = 0;
  [L.melody, L.chords].forEach(s => Object.keys(s.blocks).forEach(id => { const n = parseInt(id.slice(1), 10); if (n > maxSeq) maxSeq = n; }));
  L.seq = Math.max(L.seq || 0, maxSeq, Number(src.seq) || 0);
  if (L.keyPreset !== 'custom') applyKeyPreset(L);
  return L;
}

/* Layouts saved by older versions are brought up to date when they open:
     before v2  rank 5 was on T; it is on G now. A Custom key map moves with
                it (T→G, and the right-hand mirror Y→H).
     v2 only    for a few hours on 2026-09-27 the chords on S and D were
                swapped (V on S); they go back.
     before v3  the number-row chords read 4 5 under 1 2 3; now 2 4 under
                1 3 5, each keeping its key.
   Rows move only while they still hold the scale's own chords in the old
   order, so anything the user arranged stays put. The presets re-key the
   result afterwards; a Custom key map stays on its blocks. */
function sameChord(S, id, spec) { const b = typeof id === 'string' && S.blocks[id]; return !!(b && spec && String(b.root) === String(spec.root) && b.q === spec.q); }
function rowIs(S, row, specs) { return Array.isArray(row) && row.length === specs.length && specs.every((spec, i) => sameChord(S, row[i], spec)); }
function upgradeTopRows(S, base) {
  const top = T.SCALE_BY_ID[base].top || [];
  if (top.length < 5) return;
  const a = S.rows.findIndex(r => rowIs(S, r, [top[3], top[4]]));
  const b = S.rows.findIndex(r => rowIs(S, r, [top[0], top[1], top[2]]));
  if (a < 0 || b < 0) return;
  const [t3, t4] = S.rows[a], [t0, t1, t2] = S.rows[b];
  S.rows[a] = [t1, t3]; S.rows[b] = [t0, t2, t4];
}
function upgradeLayout(L, v) {
  const S = L.chords, base = baseOf(L), custom = L.keyPreset === 'custom';
  const remap = MOVE => Object.values(S.blocks).forEach(b => { b.keys = b.keys.map(k => MOVE[k] || k); });
  if (v < 2 && custom) remap({ t: 'g', g: 't', y: 'h', h: 'y' });
  const c = T.SCALE_BY_ID[base].chords;
  const sd = v === 2 ? S.rows.find(r => rowIs(S, r, [c[3], c[1], c[2]])) : null;
  if (sd) { [sd[1], sd[2]] = [sd[2], sd[1]]; if (custom) remap({ s: 'd', d: 's', l: 'k', k: 'l' }); }
  if (v < 3) upgradeTopRows(S, base);
}

function cloneLayout(L) { return JSON.parse(JSON.stringify(L)); }

/* ==================================================================
   DESCRIBING BLOCKS
   ================================================================== */
/* ---------- chords bending the scale ----------
   While a chord is held, each of its notes that lies outside the scale
   takes over the melody block on the same letter: IV/IV in C major turns
   Ti (B) into Te (B♭) for as long as the chord sounds. Matching by letter
   is what keeps pentatonic and symmetric scales honest — a scale with no
   B has nothing to bend when a B♭ is played. */
let chordAlter = {};   // letter -> { deg, semis }

function bendMap() {
  const map = {};
  if (!layout.chordBend) return map;
  const scaleSet = new Set(T.SCALE_BY_ID[sc()].degrees.map(T.degreeSemis));
  held.forEach(h => {
    if (h.side !== 'chords') return;
    const b = layout.chords.blocks[h.id]; if (!b) return;
    T.chordTones(layout.key, sc(), b, chordEffective(b).tones).forEach(t => {
      const semis = T.degreeSemis(t.deg);
      if (!scaleSet.has(semis)) map[t.letter] = { deg: t.deg, semis };
    });
  });
  return map;
}
function melodyEffective(b) {
  const sp = T.spellDegree(T.tonicName(layout.key, sc()), b.deg);
  const alt = chordAlter[sp.letter];
  const base = T.melodyMidi(layout.key, b.deg, b.oct);
  if (!alt || alt.semis === T.degreeSemis(b.deg)) return { deg: b.deg, midi: base, bent: false };
  let delta = ((alt.semis - T.degreeSemis(b.deg)) % 12 + 12) % 12;
  if (delta > 6) delta -= 12;
  return { deg: alt.deg, midi: base + delta, bent: true };
}
function updateBend() {
  const next = bendMap();
  if (JSON.stringify(next) === JSON.stringify(chordAlter)) return;
  chordAlter = next;
  paintMelody();
}
function setMod(m, on) {
  if (on === heldMods.has(m)) return;
  if (on) heldMods.add(m); else heldMods.delete(m);
  retriggerHeld('chords');
  updateBend();
  paintChords();
}
/* Relabel chord blocks (and key caps) in place while modifiers are held. */
function paintChords() {
  $$('[data-side="chords"][data-block]').forEach(el => {
    const b = getBlock('chords', el.dataset.block); if (!b) return;
    const info = blockInfo('chords', b);
    const main = $('.main', el); if (main) { setLabel(main, info.main); if (el.classList.contains('kcap')) fitCapLabel(main); else if (el._d) fitRoundLabel(el, el._d); }
    const sub = $('.sub:not(.octmark)', el); if (sub && info.sub) sub.textContent = info.sub;
    el.classList.toggle('modded', info.modded);
    el.classList.toggle('out-of-scale', !info.inScale);
    const col = $('.tones', el); if (col) col.replaceWith(chordToneColumn(b));
  });
  $$('.mod-btn').forEach(btn => btn.classList.toggle('on', heldMods.has(btn.dataset.mod)));
  $$('.kcap.mod').forEach(cap => cap.classList.toggle('is-on', heldMods.has(MOD_KEYS[cap.dataset.key])));
  requestAnimationFrame(fitStage);
}
/* Relabel melody blocks and key caps in place — a re-render would drop
   the pointer that is holding the chord. */
function paintMelody() {
  $$('[data-side="melody"][data-block]').forEach(el => {
    const b = getBlock('melody', el.dataset.block); if (!b) return;
    const info = blockInfo('melody', b);
    const main = $('.main', el); if (main) { setLabel(main, info.main); if (el._d) fitRoundLabel(el, el._d); }
    const sub = $('.sub:not(.octmark)', el); if (sub && info.sub) sub.textContent = info.sub;
    el.classList.toggle('bent', info.bent);
  });
  requestAnimationFrame(fitStage);
}

function heldLatch(b) {
  for (const h of held.values()) if (h.latch && h.side === 'melody' && getBlock('melody', h.id) === b) return h.latch;
  return null;
}
function blockInfo(side, b) {
  if (side === 'melody') {
    const eff = heldLatch(b) || melodyEffective(b);
    const d = T.describeNote(layout.key, sc(), eff.deg, b.oct);
    const mode = layout.naming.melody;
    const auto = mode === 'letter' ? d.letter : mode === 'degree' ? d.degree : d.solfege;
    return { main: b.label || auto, sub: (mode === 'both' && !b.label) ? d.letter : null, color: d.color, inScale: d.inScale, oct: b.oct, letter: d.letter, solfege: d.solfege, bent: eff.bent };
  }
  const eff = chordEffective(b);
  const d = T.describeChord(layout.key, sc(), b, eff.tones);
  let roman = d.roman, letter = d.letter;
  const tones = eff.tones || T.qualityTones(b.q);
  const bt = eff.inv ? bassTone(tones, eff.inv.inv) : null;
  if (bt) {
    const colour = eff.mods.some(id => MOD_BY_ID[id].engine);
    roman = figured(b.label && !colour ? b.label : d.roman, eff.inv.inv, tones.some(t => t[1] === 7));
    const pc = (T.degreeSemis(b.root) + bt[0]) % 12;
    const bassName = (T.chordTones(layout.key, sc(), b, tones).find(t => t.pc === pc) || {}).name;
    if (bassName) letter = d.letter + '/' + bassName;
  }
  const mode = layout.naming.chords;
  return { main: mode === 'letter' ? letter : roman, sub: mode === 'both' ? letter : null, color: d.color, inScale: d.inScale, oct: b.oct, letter, roman, modded: eff.mods.length > 0 };
}

function slotFunc(M) { return MOD_BY_ID[(layout.modSlots || DEFAULT_SLOTS)[SLOT_KEYS.indexOf(M)]] || null; }
/* A button's face: the name, or figured-bass numbers stacked. */
function modLabelHTML(f) {
  if (!f) return '—';
  return f.figs ? '<span class="figs">' + f.figs.map(n => '<i>' + n + '</i>').join('') + '</span>' : escapeHtml(f.name);
}
/* A chord block as it sounds right now: its own permanent functions plus
   whatever the held buttons do (function ids, in the order they came). */
function chordMods(b) {
  const ids = (b.mods || []).slice();
  heldMods.forEach(M => { const f = slotFunc(M); if (f && !ids.includes(f.id)) ids.push(f.id); });
  return ids;
}
function chordEffective(b) {
  const mods = chordMods(b);
  const letters = ['V', 'B', 'Z', 'C', 'X'].filter(L => mods.some(id => MOD_BY_ID[id].engine === L));   // 7th → sus → 9th
  let tones = letters.length ? T.applyMods(T.qualityTones(b.q), letters) : null;
  const invs = mods.filter(id => MOD_BY_ID[id].inv);
  const inv = invs.length ? MOD_BY_ID[invs[invs.length - 1]] : null;   // the latest inversion wins
  if (inv && inv.seventh) {
    const t = tones || T.qualityTones(b.q);
    if (!t.some(x => x[1] === 7)) tones = withSeventh(b, t);
  }
  return { mods, tones, inv };
}
/* A triad made a 7th chord: the 7th the scale has above the root (V → V7,
   I → Imaj7, ii → ii7, vii° → viiø7); a ♭7 where the scale has neither. */
function withSeventh(b, tones) {
  const scaleSet = new Set(T.SCALE_BY_ID[sc()].degrees.map(T.degreeSemis));
  const r = T.degreeSemis(b.root);
  const semi = [10, 11, 9].find(x => scaleSet.has((r + x) % 12));
  return tones.concat([[semi === undefined ? 10 : semi, 7]]).sort((a, c) => a[0] - c[0]);
}
/* The tone an inversion puts in the bass: 1 the 3rd (or the sus note standing
   in for it), 2 the 5th, 3 the 7th. */
function bassTone(tones, n) {
  const has3 = tones.some(t => t[1] === 3);
  const members = tones.filter(t => t[1] === 3 || t[1] === 5 || t[1] === 7 || (!has3 && (t[1] === 2 || t[1] === 4)))
    .sort((a, c) => a[1] - c[1]);
  return members[n - 1] || null;
}
/* The chord's notes. Inverted: the bass tone at the bottom (no higher than
   B3), the other chord tones close above it, the bass doubled on top when
   that leaves only three notes. */
function chordVoicing(b, eff) {
  const tones = eff.tones || T.qualityTones(b.q);
  const bt = eff.inv ? bassTone(tones, eff.inv.inv) : null;
  if (!bt) return T.chordMidis(layout.key, b.root, b.q, b.oct, eff.tones);
  const root = T.tonicMidi(layout.key) - 12 + T.degreeSemis(b.root);
  let bass = root + (bt[0] % 12);
  if (bass > 59) bass -= 12;
  const pcs = [...new Set(tones.map(t => (root + t[0]) % 12))].filter(pc => pc !== bass % 12);
  const upper = pcs.map(pc => { const d = ((pc - bass) % 12 + 12) % 12; return bass + (d || 12); }).sort((a, c) => a - c);
  const out = [bass].concat(upper);
  if (out.length < 4) out.push(bass + 12);
  return out.map(m => m + 12 * (b.oct || 0));
}
/* A label on the page: figured-bass numbers (kept as ⁶₄ in the text) drawn as
   a small stack beside the numeral. data-measure is what fitStage sizes by. */
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBS = '₀₁₂₃₄₅₆₇₈₉';
const FIGS_RE = /([⁰¹²³⁴⁵⁶⁷⁸⁹]+)([₀₁₂₃₄₅₆₇₈₉]*)/g;
function labelHTML(text) {
  return escapeHtml(text).replace(FIGS_RE, (m, sup, sub) => {
    const top = [...sup].map(c => SUPS.indexOf(c)).join(''), low = [...sub].map(c => SUBS.indexOf(c)).join('');
    return low ? '<span class="figs"><i>' + top + '</i><i>' + low + '</i></span>' : '<sup class="fig">' + top + '</sup>';
  });
}
function setLabel(el, text) {
  el.dataset.text = text;
  el.innerHTML = labelHTML(text);
  if (FIGS_RE.test(text)) el.dataset.measure = text.replace(FIGS_RE, '6'); else delete el.dataset.measure;
  FIGS_RE.lastIndex = 0;
}
/* Figured bass on a numeral: I⁶ I⁶₄, V⁶₅ V⁴₃ V⁴₂ — before a slash (V⁶₅/V),
   the 7 dropped since the figures say it. */
function figured(roman, n, has7) {
  const figs = has7 ? ['⁶₅', '⁴₃', '⁴₂'][n - 1] : ['⁶', '⁶₄', '⁶₄'][n - 1];
  const cut = roman.indexOf('/');
  let head = cut < 0 ? roman : roman.slice(0, cut);
  const tail = cut < 0 ? '' : roman.slice(cut);
  if (has7) head = head.replace(/7$/, '');
  return head + figs + tail;
}

/* The note column inside a chord block: root at the bottom. Letters in
   chord-name mode, scale degrees in roman-numeral mode. */
function chordToneColumn(b) {
  const tones = T.chordTones(layout.key, sc(), b, chordEffective(b).tones);
  const useDegrees = layout.naming.chords === 'roman';
  const col = document.createElement('span'); col.className = 'tones';
  tones.slice().reverse().forEach(t => {
    const i = document.createElement('i');
    paintCap(i, t.color);
    i.textContent = useDegrees ? t.degreeLabel : t.name;
    col.appendChild(i);
  });
  return col;
}
function chordToneText(b) {
  const tones = T.chordTones(layout.key, sc(), b, chordEffective(b).tones);
  return layout.naming.chords === 'roman' ? tones.map(t => t.degreeLabel).join(' ') : tones.map(t => t.name).join(' ');
}

function freqsFor(side, b, source) {
  const shift = accidentalShift();
  if (side === 'melody') {
    const h = source && held.get(source);
    let m = (h && h.latch ? h.latch.midi : melodyEffective(b).midi) + shift;
    if (octaveActive(source)) m += 12;
    return [T.midiToFreq(m)];
  }
  return chordVoicing(b, chordEffective(b)).map(m => T.midiToFreq(m + shift));
}
function accidentalShift() {
  const s = sharpHeld || sharpLatch, f = flatHeld || flatLatch;
  if (s && f) return 0;
  return s ? 1 : f ? -1 : 0;
}
function octaveActive(source) {
  if (octaveLatch) return true;
  if (!octaveKey) return false;
  // Melody Tower rule: with both hands on the melody, the left hand stays low
  if (source && source.startsWith('key:') && layout.keyPreset === 'melody-both' && LEFT_KEYS.has(source.slice(4))) return false;
  return true;
}

/* ==================================================================
   PLAYING
   ================================================================== */
function startBlock(side, id, source) {
  if (held.has(source)) return;
  const b = getBlock(side, id);
  if (!b) return;
  const preset = layout.sound[side];
  const freqs = freqsFor(side, b, source);
  const voice = Audio.play(side, freqs, preset);
  // a melody note keeps the pitch it was pressed with, bent or not, until it is let go
  held.set(source, { voice, side, id, freqs, latch: side === 'melody' ? melodyEffective(b) : null });
  bumpActive(side, id, 1);
  if (side === 'chords') updateBend();
}
function stopBlock(source) {
  const h = held.get(source);
  if (!h) return;
  Audio.stop(h.voice);
  held.delete(source);
  bumpActive(h.side, h.id, -1);
  if (h.side === 'chords') updateBend();
  else if (h.latch) {
    // let go of a note held through a chord change: its block now shows what a press would play
    const b = getBlock('melody', h.id);
    if (b && h.latch.deg !== melodyEffective(b).deg) paintMelody();
  }
}
function stopAllBlocks() { [...held.keys()].forEach(stopBlock); }
/* Re-voice held blocks whose pitches have changed (a bend, a modifier, 8va).
   A block that still sounds the same notes keeps ringing — a held C must not
   be struck again because a V/V came and went. */
function retriggerHeld(filterSide) {
  [...held.entries()].forEach(([source, h]) => {
    if (filterSide && h.side !== filterSide) return;
    const b = getBlock(h.side, h.id);
    if (!b) return;
    const freqs = freqsFor(h.side, b, source);
    if (h.freqs && freqs.length === h.freqs.length && freqs.every((f, i) => Math.abs(f - h.freqs[i]) < 1e-6)) return;
    Audio.stop(h.voice);
    h.voice = Audio.play(h.side, freqs, layout.sound[h.side]);
    h.freqs = freqs;
  });
}
function bumpActive(side, id, d) {
  const k = side + '/' + id;
  const n = (activeCount.get(k) || 0) + d;
  if (n <= 0) activeCount.delete(k); else activeCount.set(k, n);
  $$(`[data-side="${side}"][data-block="${id}"]`).forEach(el => el.classList.toggle('is-on', n > 0));
  paintSignal();
}

function rebuildKeyIndex() {
  keyIndex = {};
  ['chords', 'melody'].forEach(side => {
    Object.keys(layout[side].blocks).forEach(id => {
      layout[side].blocks[id].keys.forEach(k => { (keyIndex[k] = keyIndex[k] || []).push({ side, id }); });
    });
  });
}

/* ---------- accidentals / octave UI ---------- */
function setSharp(latch, heldNow) {
  if (latch !== null) sharpLatch = latch;
  if (heldNow !== null) sharpHeld = heldNow;
  if (sharpLatch || sharpHeld) { flatLatch = false; }
  paintPerf(); retriggerHeld();
}
function setFlat(latch, heldNow) {
  if (latch !== null) flatLatch = latch;
  if (heldNow !== null) flatHeld = heldNow;
  if (flatLatch || flatHeld) { sharpLatch = false; }
  paintPerf(); retriggerHeld();
}
function setOctave(latch, keyNow) {
  if (latch !== null) octaveLatch = latch;
  if (keyNow !== null) octaveKey = keyNow;
  paintPerf(); retriggerHeld('melody');
}
function paintPerf() {
  $$('.oct-btn').forEach(b => { b.classList.toggle('on', octaveLatch); b.classList.toggle('held', octaveKey); });
}

/* ==================================================================
   RENDERING
   ================================================================== */
function tonicColor() {
  const t = T.tonicName(layout.key, sc());
  return T.KEY_COLORS[t.charAt(0)] || '#888';
}
/* Legends are printed the way a cap's colour needs them: dark on the light
   colours (orange, yellow, green, teal), cream on red, blue and purple. */
const lightCache = {};
function isLightColour(hex) {
  if (typeof hex !== 'string' || hex.length < 7) return false;
  if (hex in lightCache) return lightCache[hex];
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * lin(parseInt(hex.slice(1, 3), 16)) + 0.7152 * lin(parseInt(hex.slice(3, 5), 16)) + 0.0722 * lin(parseInt(hex.slice(5, 7), 16));
  return (lightCache[hex] = L > 0.3);
}
function paintCap(el, hex) {
  el.style.setProperty('--c', hex);
  el.classList.toggle('ink-dark', isLightColour(hex));
}

function refreshScaleSelect() {
  const sel = $('#scale-select');
  sel.innerHTML = '';
  const families = [];
  T.SCALES.forEach(s => { let f = families.find(x => x.name === s.family); if (!f) { f = { name: s.family, items: [] }; families.push(f); } f.items.push(s); });
  const scales = Object.values(getScales()).sort((a, b) => a.name.localeCompare(b.name));
  const sandbox = loadSandbox();
  if (scales.length || sandbox || layout.scale === 'sandbox') {
    const og = document.createElement('optgroup'); og.label = 'My scales';
    if (sandbox || layout.scale === 'sandbox') {
      const o = document.createElement('option'); o.value = 'sandbox';
      const from = layout.scale === 'sandbox' ? sc() : (sandbox && isBuiltIn(sandbox.base) ? sandbox.base : 'major');
      o.textContent = 'Sandbox · from ' + T.SCALE_BY_ID[from].name; og.appendChild(o);
    }
    scales.forEach(r => { const o = document.createElement('option'); o.value = 'custom:' + r.id; o.textContent = r.name; og.appendChild(o); });
    sel.appendChild(og);
  }
  families.forEach(f => { const og = document.createElement('optgroup'); og.label = f.name; f.items.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; og.appendChild(o); }); sel.appendChild(og); });
  sel.value = layout.scale;
}
function renderTopbar() {
  const tonic = T.tonicName(layout.key, sc());
  $('#key-name').textContent = tonic.replace('#', '♯').replace('b', '♭');
  const color = tonicColor();
  document.documentElement.style.setProperty('--tonic', color);
  document.documentElement.style.setProperty('--tonic-ink', isLightColour(color) ? '#1d140b' : '#fffaf0');
  refreshScaleSelect();
  $('#save-scale-btn').hidden = layout.scale !== 'sandbox';
  $$('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.view === layout.view));
  document.title = (layout.title ? layout.title + ' — ' : '') + 'Digital Accordion';
}

function renderStage() {
  const stage = $('#stage');
  stage.innerHTML = '';
  stage.dataset.view = layout.view;
  stage.classList.toggle('editing', anyEditing());
  stage.classList.toggle('hide-keys', !layout.showKeys);
  rebuildKeyIndex();
  if (layout.view === 'keys') {
    stage.appendChild(renderKeyboard());
  } else {
    const order = layout.order === 'melody-left' ? ['melody', 'chords'] : ['chords', 'melody'];
    order.forEach((side, i) => {
      if (layout.show !== 'both' && layout.show !== side) return;
      // the bellows sit between the two hands
      if (i === 1 && layout.show === 'both') { const b = document.createElement('div'); b.className = 'bellows'; b.setAttribute('aria-hidden', 'true'); b.appendChild(document.createElement('i')); stage.appendChild(b); }
      stage.appendChild(renderSide(side, layout.show === 'both' ? i : 0));
    });
  }
  paintSignal();
  requestAnimationFrame(fitStage);
}
/* While anything sounds the bellows open, and each side's lamp lights. */
function paintSignal() {
  const on = { chords: false, melody: false };
  activeCount.forEach((n, k) => { on[k.slice(0, k.indexOf('/'))] = true; });
  document.body.classList.toggle('sounding', on.chords || on.melody);
  $$('.side').forEach(s => s.classList.toggle('sounding', !!on[s.dataset.side]));
}
/* Power-on: a lamp test sweeps the panel from bottom left to top right. */
function lampTest() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const stage = $('#stage');
  const caps = $$('.block, .kcap.bound', stage);
  if (!caps.length) return;
  const box = stage.getBoundingClientRect();
  const span = (box.width + box.height) || 1;
  caps.forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--boot', Math.round(((r.left - box.left) + (box.bottom - r.bottom)) / span * 650) + 'ms'); });
  stage.classList.add('booting');
  setTimeout(() => stage.classList.remove('booting'), 1300);
}

/* pos: 0 for the first side on the stage (its outer edge is the left), 1 for the second. */
function renderSide(side, pos) {
  const S = layout[side];
  const editing = editSides[side];
  const el = document.createElement('section');
  el.className = 'side' + (editing ? ' editing' : ''); el.dataset.side = side;

  const head = document.createElement('div'); head.className = 'side-head';
  // the lock switch sits on the outer edge of the side, one per hand
  const lock = lockSwitch(side);
  if (pos !== 1) head.appendChild(lock);
  const hm = document.createElement('div'); hm.className = 'head-main';
  const title = document.createElement('span'); title.className = 'side-title';
  title.textContent = side === 'chords' ? 'Chords' : 'Melody';
  hm.appendChild(title);
  hm.appendChild(registerButton(side));
  const tools = document.createElement('div'); tools.className = 'side-tools';

  const naming = document.createElement('button'); naming.className = 'mini-btn'; naming.title = 'Change the names on the blocks';
  const nm = layout.naming[side];
  naming.textContent = side === 'melody'
    ? ({ solfege: 'Do Re Mi', letter: 'C D E', degree: '1 2 3', both: 'Do + C' })[nm]
    : ({ roman: 'I IV V', letter: 'C F G', both: 'I + C' })[nm];
  naming.addEventListener('click', () => {
    const cycle = side === 'melody' ? ['solfege', 'letter', 'degree', 'both'] : ['roman', 'letter', 'both'];
    layout.naming[side] = cycle[(cycle.indexOf(nm) + 1) % cycle.length];
    touch(); renderAll();
  });
  tools.appendChild(naming);
  if (side === 'melody') {
    const octBtn = document.createElement('button'); octBtn.className = 'mini-btn lamp oct-btn' + (octaveLatch ? ' on' : '') + (octaveKey ? ' held' : '');
    octBtn.innerHTML = '8<sup>va</sup>'; octBtn.title = 'Melody up an octave (Shift or Caps Lock holds it)';
    octBtn.addEventListener('pointerdown', e => { e.preventDefault(); setOctave(!octaveLatch, null); });
    tools.appendChild(octBtn);
    if (layout.view === 'panels') {   // the notes' Panels layout: Grid, Design A or Design B (the Buttons view has the standard board)
      const cur = MELODY_DESIGNS.some(d => d.id === layout.melodyDesign) ? layout.melodyDesign : 'grid';
      const designBtn = document.createElement('button'); designBtn.className = 'mini-btn design-btn';
      designBtn.title = 'How the notes are laid out in Panels: ' + MELODY_DESIGNS.map(d => d.name.split(' — ')[0]).join(' · ') + ' (Design A or B rebuilds the note blocks)';
      designBtn.textContent = cur === 'grid' ? 'Grid' : 'Design ' + cur;
      designBtn.addEventListener('click', () => { const i = MELODY_DESIGNS.findIndex(d => d.id === cur); setMelodyDesign(MELODY_DESIGNS[(i + 1) % MELODY_DESIGNS.length].id); });
      tools.appendChild(designBtn);
    }
  }
  if (side === 'chords') {
    const tonesBtn = document.createElement('button'); tonesBtn.className = 'mini-btn lamp' + (layout.chordTones ? ' on' : '');
    tonesBtn.title = 'Show the notes inside each chord'; tonesBtn.textContent = '♪ notes';
    tonesBtn.addEventListener('click', () => { layout.chordTones = !layout.chordTones; touch(); renderAll(); });
    tools.appendChild(tonesBtn);
    const setBtn = document.createElement('button'); setBtn.className = 'mini-btn set-btn';
    const cur = chordSetIndex(), next = CHORD_SETS[(cur + 1) % CHORD_SETS.length];
    setBtn.textContent = CHORD_SETS[cur].name; setBtn.dataset.set = CHORD_SETS[cur].id;
    setBtn.title = 'How many chords are out: ' + CHORD_SETS.map(c => c.name).join(' · ') + ' — tap for ' + next.name;
    setBtn.addEventListener('click', () => setChordSet(next.id));
    tools.appendChild(setBtn);
  }

  if (editing) {
    const add = document.createElement('button'); add.className = 'mini-btn add'; add.textContent = '+ Add';
    add.addEventListener('click', () => side === 'chords' ? openAddChord() : addMelodyBlock());
    tools.appendChild(add);
  }
  if (layout.show === 'both') {
    const solo = document.createElement('button'); solo.className = 'mini-btn'; solo.title = 'Fill the screen with this side'; solo.textContent = '⤢';
    solo.addEventListener('click', () => { layout.show = side; touch(); renderAll(); });
    tools.appendChild(solo);
  } else {
    const both = document.createElement('button'); both.className = 'mini-btn on'; both.textContent = 'Show both';
    both.addEventListener('click', () => { layout.show = 'both'; touch(); renderAll(); });
    tools.appendChild(both);
  }
  hm.appendChild(tools);
  head.appendChild(hm);
  if (pos === 1) { lock.classList.add('at-end'); head.appendChild(lock); }
  el.appendChild(head);
  if (regOpen[side]) el.appendChild(registerDrawer(side));

  const body = document.createElement('div'); body.className = 'side-body';
  const tower = document.createElement('div'); tower.className = 'tower';
  if (!S.rows.length && !(layout.view === 'panels' && side === 'melody')) {
    const e = document.createElement('div'); e.className = 'empty-side'; e.textContent = editing ? 'No blocks — tap + Add' : 'No blocks here yet';
    body.appendChild(e);
  }
  const heightOf = m => Array.isArray(m) ? m.reduce((t, id) => t + (getBlock(side, id).size || 1), 0) : (getBlock(side, m).size || 1);
  const widthOf = m => Array.isArray(m) ? Math.max(...m.map(id => getBlock(side, id).w || 1)) : (getBlock(side, m).w || 1);
  const rowsToRender = layout.view === 'panels'
    ? (side === 'melody' ? ((layout.melodyDesign || 'grid') === 'grid' ? panelMelodyRows() : S.rows) : panelChordRows())
    : side === 'chords' ? chordRowsInSet() : S.rows;
  if (isRound()) {
    // round buttons: the blocks sit loose in the body and fitRoundSide() packs them (and the tabs)
    body.classList.add('round');
    tower.classList.add('round-tower');
    rowsToRender.flat(2).forEach(id => tower.appendChild(renderBlock(side, id)));
    body.appendChild(tower);
    if (side === 'chords') { const mods = renderModColumn(true); mods.classList.add('round-mods'); body.appendChild(mods); }
    el._rows = rowsToRender;
    el.appendChild(body);
    return el;
  }
  rowsToRender.forEach((row, ri) => {
    const r = document.createElement('div'); r.className = 'row'; r.dataset.row = ri;
    r.style.flex = `${Math.max(...row.map(heightOf))} 1 0`;
    row.forEach(m => {
      if (Array.isArray(m)) {
        const st = document.createElement('div'); st.className = 'stack';
        st.style.flex = `${widthOf(m)} 1 0`;
        m.forEach(id => { const el = renderBlock(side, id); el.style.flex = `${getBlock(side, id).size || 1} 1 0`; st.appendChild(el); });
        r.appendChild(st);
      } else r.appendChild(renderBlock(side, m));
    });
    tower.appendChild(r);
  });
  body.appendChild(tower);
  const modsBelow = side === 'chords' && chordSetIndex() < EXTREME;
  if (side === 'chords' && !modsBelow) body.appendChild(renderModColumn(false));
  el.appendChild(body);
  if (modsBelow) el.appendChild(renderModColumn(true));
  return el;
}
/* The Z X C V B tabs: a column beside the tower (top to bottom B V C X Z), or
   below Extreme a row along the bottom in keyboard order, Z X C V B. */
function renderModColumn(asRow) {
  const col = document.createElement('div'); col.className = asRow ? 'mod-row' : 'mod-col';
  (asRow ? SLOT_KEYS.slice() : SLOT_KEYS.slice().reverse()).forEach(M => {
    const f = slotFunc(M);
    if (!f && !editSides.chords) return;              // an empty slot has no button (Edit mode shows it, to fill)
    const btn = document.createElement('button'); btn.className = 'mod-btn' + (heldMods.has(M) ? ' on' : '') + (f ? '' : ' empty'); btn.type = 'button';
    btn.dataset.mod = M; btn.title = editSides.chords ? 'Choose what ' + M + ' does' : (f.does + ' — hold ' + M);
    btn.innerHTML = '<span class="mod-name">' + modLabelHTML(f) + '</span><span class="mod-key">' + M.toLowerCase() + '</span>';
    attachModHandlers(btn, M);
    col.appendChild(btn);
  });
  return col;
}
/* Hold to modify; touch can hold one finger here and tap chords with another.
   In Edit mode a tap opens the chooser for that button instead. */
function attachModHandlers(el, M) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (editingHere('chords')) { openModSheet(M); return; }
    Audio.ensure();
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    setMod(M, true);
    const up = () => { setMod(M, false); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
  el.addEventListener('contextmenu', e => e.preventDefault());
}

function renderBlock(side, id) {
  const b = getBlock(side, id);
  const info = blockInfo(side, b);
  const el = document.createElement('button');
  el.className = 'block'; el.type = 'button';
  el.dataset.side = side; el.dataset.block = id;
  paintCap(el, info.color);
  el.style.flex = `${b.w || 1} 1 0`;
  if (!info.inScale) el.classList.add('out-of-scale');
  if (info.bent) el.classList.add('bent');
  if (activeCount.get(side + '/' + id)) el.classList.add('is-on');
  if (selectedBlock && selectedBlock.side === side && selectedBlock.id === id) el.classList.add('selected');
  if (info.oct) { const o = document.createElement('span'); o.className = 'oct'; o.textContent = info.oct > 0 ? '▲'.repeat(info.oct) : '▼'.repeat(-info.oct); el.appendChild(o); }
  if (side === 'chords' && layout.chordTones) { el.classList.add('has-tones'); el.appendChild(chordToneColumn(b)); }
  if (side === 'chords' && info.modded) el.classList.add('modded');
  const main = document.createElement('span'); main.className = 'main'; setLabel(main, info.main); el.appendChild(main);
  if (info.sub) { const s = document.createElement('span'); s.className = 'sub'; s.textContent = info.sub; el.appendChild(s); }
  if (b.keys.length) {
    const ks = document.createElement('span'); ks.className = 'keys';
    b.keys.slice(0, 3).forEach(k => { const c = document.createElement('span'); c.className = 'kcap-mini'; c.textContent = k; ks.appendChild(c); });
    el.appendChild(ks);
  }
  attachPlayHandlers(el, side, id);
  return el;
}

/* Long chord names (vii°7/V, vi(maj7)) shrink to stay on their key cap. */
function fitCapLabel(m) {
  const n = m.textContent.length;
  m.style.fontSize = n > 5 ? `calc(var(--k) * ${(0.33 * 4.6 / n).toFixed(3)})` : '';
}
function renderKeyboard() {
  const wrap = document.createElement('div'); wrap.className = 'kbd-wrap';
  const kbd = document.createElement('div'); kbd.className = 'kbd';
  KB_ROWS.forEach((row, ri) => {
    const r = document.createElement('div'); r.className = 'kb-row'; r.dataset.row = ri;
    row.forEach(k => {
      const cap = document.createElement('button'); cap.className = 'kcap'; cap.type = 'button'; cap.dataset.key = k;
      const kc = document.createElement('span'); kc.className = 'kc'; kc.textContent = k; cap.appendChild(kc);
      const bound = playable(k);
      if (MOD_KEYS[k] && !bound.length && (slotFunc(MOD_KEYS[k]) || anyEditing())) {
        const f = slotFunc(MOD_KEYS[k]);
        cap.classList.add('mod'); cap.dataset.mod = MOD_KEYS[k];
        if (heldMods.has(MOD_KEYS[k])) cap.classList.add('is-on');
        const m = document.createElement('span'); m.className = 'main'; m.innerHTML = modLabelHTML(f); cap.appendChild(m);
        cap.title = f ? 'Chord button: ' + f.does : 'An empty chord button — tap to choose';
        attachModHandlers(cap, MOD_KEYS[k]);
      } else if (RESERVED[k]) {
        cap.classList.add('reserved');
        const m = document.createElement('span'); m.className = 'main'; m.textContent = RESERVED[k]; cap.appendChild(m);
        cap.title = RESERVED[k] === '♯' ? 'Sharp' : 'Flat';
        cap.addEventListener('pointerdown', e => e.preventDefault());
      } else if (bound.length) {
        const first = bound[0];
        const b = layout[first.side].blocks[first.id];
        const info = blockInfo(first.side, b);
        cap.classList.add('bound', first.side);
        cap.dataset.side = first.side; cap.dataset.block = first.id;
        paintCap(cap, info.color);
        if (info.bent) cap.classList.add('bent');
        if (activeCount.get(first.side + '/' + first.id)) cap.classList.add('is-on');
        const m = document.createElement('span'); m.className = 'main'; setLabel(m, info.main); cap.appendChild(m);
        fitCapLabel(m);
        if (info.sub) { const s = document.createElement('span'); s.className = 'sub'; s.textContent = info.sub; cap.appendChild(s); }
        if (bound.length > 1) cap.classList.add('multi');
        if (info.oct) { const o = document.createElement('span'); o.className = 'sub octmark'; o.textContent = info.oct > 0 ? '▲'.repeat(info.oct) : '▼'.repeat(-info.oct); cap.appendChild(o); }
        attachKeyCapHandlers(cap, k);
      } else {
        attachKeyCapHandlers(cap, k);
      }
      r.appendChild(cap);
    });
    kbd.appendChild(r);
  });
  wrap.appendChild(kbd);
  const legend = document.createElement('div'); legend.className = 'kbd-legend';
  legend.innerHTML = '<span><i class="dot chords"></i>Chord blocks</span><span><i class="dot"></i>Melody blocks</span><span><i class="dot mod"></i>Chord modifiers (hold)</span><span>' + (anyEditing() ? 'Tap a key to choose what it plays' : 'Play the keys here or on your keyboard') + '</span>'
    + (chordSetIndex() < EXTREME ? '<span class="set-note">Chord set: ' + CHORD_SETS[chordSetIndex()].name + ' — Settings shows more</span>' : '');
  wrap.appendChild(legend);
  const lock = lockSwitch(null); lock.classList.add('kbd-lock'); wrap.appendChild(lock);
  return wrap;
}

/* A key cap in the Keys view plays everything bound to that key. */
function attachKeyCapHandlers(cap, k) {
  cap.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (anyEditing()) { openBindSheet(k); return; }
    const bound = playable(k);
    if (!bound.length) return;
    Audio.ensure();
    try { cap.setPointerCapture(e.pointerId); } catch (err) {}
    bound.forEach((b, i) => startBlock(b.side, b.id, `ptr:${e.pointerId}:${i}`));
    const up = () => { bound.forEach((b, i) => stopBlock(`ptr:${e.pointerId}:${i}`)); cap.removeEventListener('pointerup', up); cap.removeEventListener('pointercancel', up); };
    cap.addEventListener('pointerup', up); cap.addEventListener('pointercancel', up);
  });
  cap.addEventListener('contextmenu', e => e.preventDefault());
}

/* Blocks: press to play, slide to glide between blocks of the same side. */
function attachPlayHandlers(el, side, id) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (editSides[side]) { if (layout[side].blocks[id]) openBlockEditor(side, id); else toast('This note is part of the grid — edit the note blocks in Buttons view, or choose Design A or B here'); return; }
    Audio.ensure();
    const source = 'ptr:' + e.pointerId;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    startBlock(side, id, source);
    let current = id;
    const move = ev => {
      const target = document.elementFromPoint(ev.clientX, ev.clientY);
      const blk = target && target.closest ? target.closest('.block') : null;
      if (blk && blk.dataset.side === side && blk.dataset.block !== current) {
        stopBlock(source); current = blk.dataset.block; startBlock(side, current, source);
      }
    };
    const up = () => { stopBlock(source); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
  el.addEventListener('contextmenu', e => e.preventDefault());
}

/* Label sizes follow the block; the keyboard's key size follows the stage. */
const measure = document.createElement('canvas').getContext('2d');
/* Where canvas cannot set a font width, semi-expanded Saira measures about 8% narrow. */
const STRETCH_FIX = (window.CanvasRenderingContext2D && 'fontStretch' in CanvasRenderingContext2D.prototype) ? 1 : 1.08;
/* A block label's width in the current style's block font. */
function labelWidth(text, px) {
  measure.font = `800 ${px}px Fraunces, Georgia, serif`;
  measure.fontStretch = 'normal';
  return measure.measureText(text).width;
}
function fitStage() {
  const stage = $('#stage');
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  document.documentElement.style.setProperty('--stage-h', rect.height + 'px');
  const kbd = $('.kbd', stage);
  if (kbd) {
    const wrap = $('.kbd-wrap', stage).getBoundingClientRect();
    const k = Math.max(26, Math.min((wrap.width - 24) / 13.4, (wrap.height - 50) / 4.6));
    kbd.style.setProperty('--k', k + 'px');
    kbd.classList.toggle('tiny', k < 40);
    return;
  }
  placeDrawers();
  if (isRound()) { $$('.side', stage).forEach(fitRoundSide); return; }
  $$('.block', stage).forEach(el => {
    const w = el.clientWidth, h = el.clientHeight;
    const main = $('.main', el); if (!main) return;
    const tones = $('.tones', el);
    let toneW = 0;
    if (tones) {
      const n = tones.children.length || 3;
      const gap = 3, inset = 8;
      // fill the block's height, then cap by the block's width
      const size = Math.max(12, Math.min((h - 2 * inset - gap * (n - 1)) / n, w * 0.26, 46));
      tones.style.setProperty('--tone', size + 'px');
      toneW = inset + size + 10;
      el.style.paddingLeft = toneW + 'px';
    }
    let px = Math.min(h * 0.46, (w - toneW) * 0.42, 64);
    const hasSub = !!$('.sub', el);
    if (hasSub) px = Math.min(px, h * 0.36);
    const tw = labelWidth(main.dataset.measure || main.textContent, px);
    if (tw > (w - toneW) * 0.82) px = px * ((w - toneW) * 0.82) / tw;
    px = Math.max(9, px);
    main.style.fontSize = px + 'px';
    const sub = $('.sub', el); if (sub) sub.style.fontSize = Math.max(8, px * 0.48) + 'px';
  });
}

/* ---------- round buttons (Accordion style, Tower view) ----------
   The blocks of a side are packed as circles by packRound() — rows of buttons that nest
   diagonally, like an accordion's — and the Z X C V B tabs go down the side or along the
   bottom, whichever leaves the bigger buttons. Only rows, sizes and the space count: a label
   changing while a modifier is held never moves a button. */
const packPrev = { chords: undefined, melody: undefined };
function isRound() { return !!layout && layout.view === 'tower'; }
function fitRoundSide(sideEl) {
  const side = sideEl.dataset.side, body = $('.side-body.round', sideEl), rows = sideEl._rows;
  if (!body || !rows) return;
  const W = body.clientWidth, H = body.clientHeight;
  if (!W || !H) return;
  const mods = $('.round-mods', body);
  const blocks = {};
  rows.flat(2).forEach(id => { const b = getBlock(side, id); if (b) blocks[id] = { size: b.size || 1, w: b.w || 1 }; });
  // the last arrangement is passed back in, so a resize keeps it unless another is clearly bigger
  const other = side === 'chords' ? 'melody' : 'chords';
  const S = layout[side], nMods = mods ? mods.children.length : 0;
  // a board designed in Accordion Builder places every button itself, as long as it knows them all;
  // failing that, the standard board does, as long as every block is one it knows; failing that, the packer
  const B = (S.board && rows.flat(2).every(id => S.board.buttons[id])) ? S.board : standardBoardFor(side, rows);
  const designed = !!B;
  const out = designed ? placeBoard(B, rows, W, H, nMods) : window.packRound({ side, rows, blocks, W, H, mods: { count: nMods }, RING: 4, MIN_GAP: 2,
    prev: packPrev[side], partner: layout.show === 'both' ? packPrev[other] : undefined });   // (the other side's slant, matched when it costs little)
  packPrev[side] = designed ? undefined : out.variant;
  const els = {};
  $$('.block', body).forEach(e => { els[e.dataset.block] = e; });
  out.circles.forEach(c => {
    const el = els[c.id]; if (!el) return;
    el.style.left = (c.cx - c.d / 2) + 'px'; el.style.top = (c.cy - c.d / 2) + 'px';
    el.style.setProperty('--d', c.d + 'px');
    el._d = c.d;
    fitRoundLabel(el, c.d);
  });
  if (mods) {
    const R = out.mods && out.mods.rect;
    mods.hidden = !R;
    if (R) {
      const side = out.mods.placement === 'side';
      mods.classList.toggle('mod-col', side); mods.classList.toggle('mod-row', !side);
      Object.assign(mods.style, { left: R.x + 'px', top: R.y + 'px', width: R.w + 'px', height: R.h + 'px' });
    }
  }
}
/* The standard board (standard-board.js; designed in Accordion Builder, 2026-09-27): where the round
   buttons go when a layout has no board of its own. A chord finds its place by which of the preset's
   fourteen it is — I, V, IV … V/ii in major, the same fourteen places in every scale and key — and a
   note by its scale step and octave, so the Design A / B towers land on the same board and a chord set
   below Extreme just leaves its places empty. A side with a block the standard does not know (an
   added chord, a note off the seven steps, an eight-note scale, the same chord twice) is packed instead. */
function standardBoardFor(side, rows) {
  const std = window.StandardBoard && window.StandardBoard[side];
  if (!std) return null;
  const S = layout[side], scale = T.SCALE_BY_ID[sc()], buttons = {}, used = new Set();
  for (const id of rows.flat(2)) {
    const b = S.blocks[id]; if (!b) return null;
    let key = null;
    if (side === 'chords') key = chordRole(b, scale);
    else {
      const ord = scale.degrees.indexOf(b.deg);
      key = ord >= 0 ? ord + ',' + (b.oct || 0) : null;
    }
    const slot = key && std.slots[key];
    if (!slot || used.has(key)) return null;
    used.add(key); buttons[id] = slot;
  }
  return { w: std.w, h: std.h, tabs: std.tabs || 'none', buttons };
}
/* A board designed in Accordion Builder (layout.<side>.board): every button's centre and face in
   the builder's own units, for the area beside the tabs. It is scaled to fit the space here as a
   whole and centred, so the design keeps its proportions on every screen; the tabs keep the strip
   the builder reserved for them (bottom, side or none) and grow into the slack the way the
   packer's do (40 px at least, 52 / 60 px at most). */
function placeBoard(B, rows, W, H, nMods) {
  const tabs = nMods ? (B.tabs || 'bottom') : 'none', TG = 8;
  let aw = W, ah = H;
  if (tabs === 'side') aw = W - TG - 40; else if (tabs === 'bottom') ah = H - TG - 40;
  const s = Math.max(0.01, Math.min(aw / B.w, ah / B.h));
  const bw = B.w * s, bh = B.h * s;
  let fx = (aw - bw) / 2, fy = (ah - bh) / 2, rect = null;
  if (tabs === 'side') {
    const slack = Math.max(0, W - bw - TG - 40), tw = Math.max(40, Math.min(60, 40 + slack / 2));
    fx = Math.max(0, (W - (bw + TG + tw)) / 2);
    const th = Math.min(H, Math.max(44 * nMods, Math.min(96 * nMods, bh))), ty = Math.max(0, Math.min(H - th, fy + bh / 2 - th / 2));
    rect = { x: Math.min(W - tw, fx + bw + TG), y: ty, w: tw, h: th };
  } else if (tabs === 'bottom') {
    const slack = Math.max(0, H - bh - TG - 40), th = Math.max(40, Math.min(52, 40 + slack / 2));
    fy = Math.max(0, (H - (bh + TG + th)) / 2);
    const tw = Math.min(W, Math.max(56 * nMods, Math.min(120 * nMods, bw))), tx = Math.max(0, Math.min(W - tw, fx + bw / 2 - tw / 2));
    rect = { x: tx, y: Math.min(H - th, fy + bh + TG), w: tw, h: th };
  }
  // the rings and the air between them keep their pixels, so the faces scale a little more than the
  // centres do: buttons that touched still touch and never overlap (Accordion Builder's rescale does the same)
  const pad = 2 * 4 + 2;
  const circles = rows.flat(2).map(id => { const c = B.buttons[id]; return { id, cx: fx + c.cx * s, cy: fy + c.cy * s, d: Math.max(2, (c.d + pad) * s - pad) }; });
  return { circles, mods: rect ? { placement: tabs, rect } : { placement: 'none' } };
}
/* A line's width at a size. Fraunces changes its letter shapes with the size (optical sizing),
   so width is not proportional to size: measure at the size itself, and remember it. */
const lineWidthCache = new Map();
function roundLineWidth(t, px) {
  const k = t + '|' + Math.round(px * 4);
  let w = lineWidthCache.get(k);
  if (w === undefined) {
    w = labelWidth(t.replace(FIGS_RE, '6'), Math.round(px * 4) / 4);
    if (lineWidthCache.size > 4000) lineWidthCache.clear();
    lineWidthCache.set(k, w);
  }
  return w;
}
/* Where a long name may break into two lines: before a slash (vii°7 / /V), or a letter chord's
   root over its quality (F♯ / °7), or a numeral over its extension (vii° / 7). */
function labelSplits(text) {
  const out = [];
  const slash = text.indexOf('/');
  if (slash > 0) out.push([text.slice(0, slash), text.slice(slash)]);
  const m = /^([A-G][♯♭#b]?)(.{2,})$/.exec(text);
  if (m && slash < 0) out.push([m[1], m[2]]);
  const r = /^([b#♭♯]?[ivIV]+[°ø+]?)([\d⁰¹²³⁴⁵⁶⁷⁸⁹].*)$/.exec(text);
  if (r && slash < 0 && text.length >= 5) out.push([r[1], r[2]]);
  return out;
}
/* The biggest size at which the lines (and the sub line) fit inside the face — each line
   checked against the circle at its own height — below the octave mark or the chord's notes
   at the top, above the key letter at the bottom. */
const LINE_PITCH = 0.78, INK = 0.74;
function fitRoundLines(lines, sub, subScale, d, ceil, floor) {
  const R = d / 2 * 0.9;
  const mid = (ceil + floor) / 2;
  const fits = (t, b, w) => { const y = Math.max(Math.abs(t), Math.abs(b)); return (w / 2) * (w / 2) + y * y <= R * R; };
  let lo = 4, hi = Math.min(d, 90), best = 0;
  for (let it = 0; it < 18; it++) {
    const px = (lo + hi) / 2;
    const subPx = sub ? Math.max(7, px * subScale) : 0;
    const hMain = INK * px + (lines.length - 1) * LINE_PITCH * px;
    const h = hMain + (sub ? subPx * 0.95 + px * 0.1 : 0);
    const top = mid - h / 2, bottom = mid + h / 2;
    let ok = top >= ceil - 0.5 && bottom <= floor + 0.5;
    for (let i = 0; ok && i < lines.length; i++) { const lt = top + i * LINE_PITCH * px; ok = fits(lt, lt + INK * px, roundLineWidth(lines[i], px)); }
    if (ok && sub) { const st = top + hMain + px * 0.1; ok = fits(st, st + subPx * 0.95, roundLineWidth(sub, subPx)); }
    if (ok) { lo = px; best = px; } else hi = px;
  }
  return Math.min(best, 64);
}
/* (The Packing Lab's harness.js mirrors this label rule to score packers: change both together.)
   On small faces the key letter and the octave mark slide out onto the chrome rim, a little
   at a time, so a bigger button never ends up with smaller text. */
function roundMarks(d) {
  const t = Math.max(0, Math.min(1, (d - 44) / 28));
  const kh = Math.max(12, Math.min(d * 0.17, 22)), mh = Math.max(7, Math.min(d * 0.085, 11));
  return { t, kh, mh, keyBottom: (1 - t) * (-0.4 * kh) + t * (0.08 * d), markTop: (1 - t) * (-0.3 * mh) + t * (0.085 * d) };
}
function fitRoundLabel(el, d) {
  const main = $('.main', el); if (!main) return;
  const text = main.dataset.text || main.textContent;
  const sub = $('.sub', el), subText = sub ? sub.textContent : '';
  const ks = $('.keys', el);
  const hasKey = !!(ks && ks.children.length && d >= 30 && getComputedStyle(ks).display !== 'none');
  const oct = $('.oct', el), hasOct = !!(oct && d >= 26);
  let tones = $('.tones', el);
  el.classList.toggle('small', d < 30);   // too small for the key letter
  el.classList.toggle('tiny', d < 26);    // …or the octave mark
  el.classList.toggle('no-tones', !!tones && d < 58);   // ♪ notes need room for a row
  if (tones && d < 58) tones = null;
  let tone = 0;
  if (tones) {
    const n = tones.children.length || 3;
    tone = Math.max(9, Math.min(d * 0.16, (d * 0.6 - 3 * (n - 1)) / n, 24));
    tones.style.setProperty('--tone', tone + 'px');
  }
  const mk = roundMarks(d);
  el.style.setProperty('--kh', mk.kh + 'px'); el.style.setProperty('--kb', mk.keyBottom + 'px');
  el.style.setProperty('--mh', mk.mh + 'px'); el.style.setProperty('--mt', mk.markTop + 'px');
  el.classList.toggle('on-rim', mk.t < 0.5);
  const floor = hasKey ? d / 2 - mk.keyBottom - mk.kh - 2 : d / 2 * 0.9;
  const ceil = tones ? -(d / 2 - d * 0.1 - tone - 3) : hasOct ? -(d / 2 - mk.markTop - mk.mh - 2) : -d / 2 * 0.9;
  const subScale = text.length <= 2 ? 0.55 : 0.48;
  let lines = [text], px = fitRoundLines([text], subText, subScale, d, ceil, floor);
  const gate = text.length >= 4 ? 1.04 : 1.12;
  labelSplits(text).forEach(pair => {
    const p = fitRoundLines(pair, subText, 0.48, d, ceil, floor);
    if (p > px * gate) { px = p; lines = pair; }
  });
  px = Math.max(8, px);
  main.innerHTML = lines.length > 1 ? lines.map(l => '<span class="ln">' + labelHTML(l) + '</span>').join('') : labelHTML(text);
  main.classList.toggle('two', lines.length > 1);
  main.style.fontSize = px + 'px';
  if (sub) sub.style.fontSize = Math.max(7, px * (lines.length > 1 ? 0.48 : subScale)) + 'px';
  el.style.setProperty('--lab-y', ((ceil + floor) / 2) + 'px');
}

function renderAll() { renderTopbar(); renderStage(); }

/* ---------- the look: the Accordion style, and only that (the Digital lab was retired 2026-09-27) ---------- */
function isAccordion() { return true; }

/* ==================================================================
   EDITING
   ================================================================== */
function touch() { dirty = true; scheduleSave(); renderTopbar(); }
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem(CURRENT_KEY, JSON.stringify(layout)); } catch (e) {} saveSandbox(); }, 300);
}

function setKey(idx) { layout.key = (idx + 12) % 12; stopAllBlocks(); touch(); renderAll(); }
function setScale(id) {
  stopAllBlocks();
  if (isBuiltIn(id)) {
    layout.scale = id; layout.scaleBase = id;
    layout.melody = buildMelodySide(layout);
    layout.chords = buildChordSide(layout);
  } else {
    const rec = id === 'sandbox' ? loadSandbox() : getScales()[String(id).slice(7)];
    if (!rec || !rec.melody || !rec.chords) { toast('That scale is not here any more'); renderAll(); return; }
    layout.scale = id; layout.scaleBase = isBuiltIn(rec.base) ? rec.base : 'major';
    if (rec.melodyDesign) layout.melodyDesign = (Number(rec.v) || 1) >= 4 && MELODY_DESIGNS.some(d => d.id === rec.melodyDesign) ? rec.melodyDesign : 'grid';
    layout.melody = cloneLayout(rec.melody);
    layout.chords = cloneLayout(rec.chords);
    if ((Number(rec.v) || 1) < 3) upgradeTopRows(layout.chords, layout.scaleBase);   // saved before the number row became 2 4 / 1 3 5
  }
  applyKeyPreset(layout, layout.keyPreset === 'custom' ? 'split' : undefined);
  touch(); renderAll();
}
function rebuildSide(side) {
  layout[side] = side === 'melody' ? buildMelodySide(layout) : buildChordSide(layout);
  applyKeyPreset(layout, layout.keyPreset === 'custom' ? 'split' : undefined);
  if (!isBuiltIn(layout.scale)) markSandbox();
  touch(); renderAll();
  toast(side === 'melody' ? 'Melody blocks rebuilt from the scale' : 'Chord blocks rebuilt from the scale');
}

/* Where a block sits: row r, member i, and s if it is inside a stack. */
function findRow(S, id) {
  for (let r = 0; r < S.rows.length; r++) {
    for (let i = 0; i < S.rows[r].length; i++) {
      const m = S.rows[r][i];
      if (m === id) return { r, i, s: -1 };
      if (Array.isArray(m)) { const s = m.indexOf(id); if (s >= 0) return { r, i, s }; }
    }
  }
  return null;
}
/* Take a block out of the rows; a stack left with one block unwraps. */
function detach(S, id) {
  const pos = findRow(S, id); if (!pos) return null;
  const row = S.rows[pos.r];
  if (pos.s >= 0) {
    const st = row[pos.i]; st.splice(pos.s, 1);
    if (st.length === 1) row[pos.i] = st[0];
    else if (!st.length) row.splice(pos.i, 1);
  } else row.splice(pos.i, 1);
  return pos;
}
function tidyRows(S) { S.rows = S.rows.filter(r => r.length); S.custom = true; markSandbox(); }
/* A board designed in Accordion Builder (S.board) places every button itself. Moving a block to
   another row, adding one or duplicating one leaves nothing to say where the new arrangement
   goes, so those edits release the board and the packer takes over; removing a block only
   removes its circle. */
function releaseBoard(S, side) {
  if (!S.board) return;
  delete S.board;
  setTimeout(() => toast('The designed board is released — the ' + (side === 'chords' ? 'chords' : 'notes') + ' are packed again'), 150);
}
function moveBlock(side, id, dir) {
  const S = layout[side]; const pos = findRow(S, id); if (!pos) return;
  const row = S.rows[pos.r];
  if (pos.s >= 0) {
    const st = row[pos.i];
    if (dir === 'up' && pos.s < st.length - 1) { [st[pos.s + 1], st[pos.s]] = [st[pos.s], st[pos.s + 1]]; }
    else if (dir === 'down' && pos.s > 0) { [st[pos.s - 1], st[pos.s]] = [st[pos.s], st[pos.s - 1]]; }
    else if (dir === 'left' || dir === 'right') { detach(S, id); const at = Math.min(dir === 'left' ? pos.i : pos.i + 1, S.rows[pos.r].length); S.rows[pos.r].splice(at, 0, id); }
    else if (dir === 'up') { detach(S, id); if (pos.r === S.rows.length - 1) S.rows.push([id]); else S.rows[pos.r + 1].splice(Math.min(pos.i, S.rows[pos.r + 1].length), 0, id); }
    else if (dir === 'down') { detach(S, id); if (pos.r === 0) S.rows.unshift([id]); else S.rows[pos.r - 1].splice(Math.min(pos.i, S.rows[pos.r - 1].length), 0, id); }
    else return;
  } else if (dir === 'left' && pos.i > 0) { [row[pos.i - 1], row[pos.i]] = [row[pos.i], row[pos.i - 1]]; }
  else if (dir === 'right' && pos.i < row.length - 1) { [row[pos.i + 1], row[pos.i]] = [row[pos.i], row[pos.i + 1]]; }
  else if (dir === 'up') {
    row.splice(pos.i, 1);
    if (pos.r === S.rows.length - 1) S.rows.push([id]); else S.rows[pos.r + 1].splice(Math.min(pos.i, S.rows[pos.r + 1].length), 0, id);
  } else if (dir === 'down') {
    row.splice(pos.i, 1);
    if (pos.r === 0) S.rows.unshift([id]); else S.rows[pos.r - 1].splice(Math.min(pos.i, S.rows[pos.r - 1].length), 0, id);
  } else if (dir === 'stack') {
    if (pos.i === 0) return;
    row.splice(pos.i, 1);
    const left = row[pos.i - 1];
    if (Array.isArray(left)) left.push(id); else row[pos.i - 1] = [left, id];
  } else return;
  releaseBoard(S, side);
  tidyRows(S);
  touch(); renderAll();
}
function removeBlock(side, id) {
  const S = layout[side]; if (!findRow(S, id)) return;
  detach(S, id);
  S.rows = S.rows.filter(r => r.length);
  delete S.blocks[id];
  if (S.board) delete S.board.buttons[id];
  S.custom = true;
  stopAllBlocks();
  markSandbox();
  touch(); renderAll();
}
function duplicateBlock(side, id) {
  const S = layout[side]; const pos = findRow(S, id); if (!pos) return;
  const nid = newId(layout, side === 'melody' ? 'm' : 'c');
  S.blocks[nid] = Object.assign({}, JSON.parse(JSON.stringify(S.blocks[id])), { keys: [] });
  if (pos.s >= 0) S.rows[pos.r][pos.i].splice(pos.s + 1, 0, nid); else S.rows[pos.r].splice(pos.i + 1, 0, nid);
  S.custom = true;
  releaseBoard(S, side);
  markSandbox();
  if (side === 'chords') revealChord(nid);
  touch(); renderAll();
  return nid;
}
function addMelodyBlock() {
  const S = layout.melody;
  const scale = T.SCALE_BY_ID[sc()];
  const have = new Set(Object.values(S.blocks).map(b => T.degreeSemis(b.deg) + 12 * b.oct));
  let deg = scale.degrees[0], oct = 0;
  outer: for (const o of [0, 1, -1, 2]) for (const d of scale.degrees) { if (!have.has(T.degreeSemis(d) + 12 * o)) { deg = d; oct = o; break outer; } }
  const id = newId(layout, 'm');
  S.blocks[id] = { deg, oct, size: 1, w: 1, keys: [], label: null };
  S.rows.push([id]);
  S.custom = true;
  releaseBoard(S, 'melody');
  markSandbox();
  if (layout.keyPreset !== 'custom') applyKeyPreset(layout);
  touch(); renderAll();
  openBlockEditor('melody', id);
}
function addChordBlock(spec) {
  const S = layout.chords;
  const id = newId(layout, 'c');
  S.blocks[id] = { root: spec.root, q: spec.q, label: spec.label || null, oct: 0, size: 1, w: 1, keys: [], mods: [] };
  const top = S.rows[S.rows.length - 1];
  if (top && top.length < 2) top.push(id); else S.rows.push([id]);
  S.custom = true;
  releaseBoard(S, 'chords');
  markSandbox();
  if (layout.keyPreset !== 'custom') applyKeyPreset(layout);
  revealChord(id);
  touch(); renderAll();
  return id;
}
function revealChord(id) {
  if (chordShown(id)) return;
  layout.chordSet = 'extreme';
  setTimeout(() => toast('Showing every chord (Extreme) so the new one is out'), 250);
}
function setEditing(on) {
  editSides.chords = editSides.melody = on;
  stopAllBlocks();
  if (!on) selectedBlock = null;
  renderAll();
}
function setSideEditing(side, on) {
  editSides[side] = on;
  stopAllBlocks();
  if (!on && selectedBlock && selectedBlock.side === side) selectedBlock = null;
  renderAll();
  toast((side === 'chords' ? 'Chords' : 'Melody') + (on ? ' unlocked — tap a block to edit it' : ' locked'));
}
/* A vertical slide switch: up is locked (play), down is unlocked (edit).
   side null: the Keys view's one switch, for both hands. */
const LOCK_ICONS = {
  shut: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.4" y="5.4" width="7.2" height="5.2" rx="1"/><path d="M4 5.4V4a2 2 0 0 1 4 0v1.4"/></svg>',
  open: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.4" y="5.4" width="7.2" height="5.2" rx="1"/><path d="M8 5.4V3.3a2 2 0 0 0-4 0v.5"/></svg>'
};
function lockSwitch(side) {
  const on = side ? editSides[side] : anyEditing();
  const name = side === 'chords' ? 'chords' : side === 'melody' ? 'melody' : 'keyboard';
  const b = document.createElement('button'); b.type = 'button';
  b.className = 'lock-sw' + (on ? ' unlocked' : '');
  b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', String(on));
  b.setAttribute('aria-label', 'Unlock the ' + name + ' to edit');
  b.title = on ? 'Unlocked: tap a block to edit it. Slide up to lock.' : 'Locked: slide down to edit the ' + name;
  b.innerHTML = '<i class="lk lk-shut">' + LOCK_ICONS.shut + '</i><span class="lock-slot"><span class="lock-knob"></span></span><i class="lk lk-open">' + LOCK_ICONS.open + '</i>';
  b.addEventListener('click', () => { if (side) setSideEditing(side, !editSides[side]); else setEditing(!anyEditing()); });
  return b;
}

/* ---------- registers: each side's sound, picked from a drawer of accordion register tabs ---------- */
const REG_FAMILIES = [
  { name: 'Struck & plucked', ids: ['piano', 'epiano', 'pluck', 'marimba', 'bell'] },
  { name: 'Held', ids: ['organ', 'pad', 'strings', 'voice'] },
  { name: 'Pure waves', ids: ['sine', 'triangle', 'square', 'sawtooth'] }
];
const REG_SHORT = { epiano: 'E. Piano', pad: 'Pad' };
/* An accordion register's mark: a circle in three bands — high, middle and low reeds — with a dot for each
   reed that sounds (organ is low + high, as on a real accordion; strings two middles, like violin). */
const REG_REEDS = { piano: 'LM', epiano: 'MH', pluck: 'H', marimba: 'L', bell: 'HH', organ: 'LH', pad: 'LMM', strings: 'MM', voice: 'MMM' };
const REG_WAVES = {
  sine: 'M4.4 12C6.7 5.8 9.7 5.8 12 12S17.3 18.2 19.6 12',
  triangle: 'M4.4 12L8.2 7L15.8 17L19.6 12',
  square: 'M4.6 15.2V8.8H12V15.2H19.4V8.8',
  sawtooth: 'M4.8 15.2L12 8.8V15.2L19.2 8.8'
};
function regName(id) { return REG_SHORT[id] || (Audio.PRESETS[id] ? Audio.PRESETS[id].name : id); }
function regMark(id) {
  let inner = '';
  if (REG_WAVES[id]) inner = '<path d="' + REG_WAVES[id] + '"/>';
  else {
    inner = '<path d="M3 8.6H21M3 15.4H21"/>';
    const reeds = REG_REEDS[id] || 'M';
    const y = { H: 5.5, M: 12, L: 18.5 };
    ['H', 'M', 'L'].forEach(band => {
      const n = reeds.split('').filter(c => c === band).length;
      (n === 1 ? [12] : n === 2 ? [9.3, 14.7] : n === 3 ? [7.4, 12, 16.6] : []).forEach(x => { inner += '<circle class="dot" cx="' + x + '" cy="' + y[band] + '" r="1.75"/>'; });
    });
  }
  return '<svg class="reg-mark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6"/>' + inner + '</svg>';
}
function regButtonHTML(side) {
  const id = layout.sound[side];
  return regMark(id) + '<span class="reg-name">' + escapeHtml(regName(id)) + '</span><i class="reg-chev" aria-hidden="true"></i>';
}
function registerButton(side) {
  const b = document.createElement('button'); b.type = 'button';
  b.className = 'reg-btn' + (regOpen[side] ? ' open' : '');
  b.setAttribute('aria-expanded', String(regOpen[side]));
  b.title = 'Sound: choose the ' + side + ' register';
  b.innerHTML = regButtonHTML(side);
  b.addEventListener('click', () => toggleRegisters(side));
  return b;
}
function toggleRegisters(side, open) {
  regOpen[side] = open === undefined ? !regOpen[side] : open;
  const el = $(`.side[data-side="${side}"]`);
  if (!el) return;
  const old = $('.reg-drawer', el); if (old) old.remove();
  const btn = $('.reg-btn', el);
  if (btn) { btn.classList.toggle('open', regOpen[side]); btn.setAttribute('aria-expanded', String(regOpen[side])); }
  if (regOpen[side]) { const d = registerDrawer(side); d.classList.add('enter'); el.appendChild(d); placeDrawers(); }
  releaseFocus();
}
function registerDrawer(side) {
  const d = document.createElement('div'); d.className = 'reg-drawer';
  d.setAttribute('role', 'group'); d.setAttribute('aria-label', (side === 'chords' ? 'Chords' : 'Melody') + ' sound');
  const cur = layout.sound[side];
  const fams = REG_FAMILIES.map(f => ({ name: f.name, ids: f.ids.filter(id => Audio.PRESETS[id]) }));
  Audio.PRESET_ORDER.forEach(id => { if (!fams.some(f => f.ids.includes(id))) fams[fams.length - 1].ids.push(id); });
  fams.forEach(f => {
    if (!f.ids.length) return;
    const fam = document.createElement('div'); fam.className = 'reg-fam';
    const name = document.createElement('span'); name.className = 'reg-fam-name'; name.textContent = f.name; fam.appendChild(name);
    const row = document.createElement('div'); row.className = 'reg-row';
    f.ids.forEach(id => {
      const t = document.createElement('button'); t.type = 'button'; t.dataset.sound = id;
      t.className = 'reg-tab' + (id === cur ? ' on' : '');
      t.setAttribute('aria-pressed', String(id === cur));
      t.innerHTML = '<span class="reg-plate">' + escapeHtml(regName(id)) + '</span><span class="reg-cap">' + regMark(id) + '</span>';
      t.addEventListener('click', () => chooseRegister(side, id));
      row.appendChild(t);
    });
    fam.appendChild(row); d.appendChild(fam);
  });
  const foot = document.createElement('div'); foot.className = 'reg-foot';
  const lvlKey = side === 'chords' ? 'chordsLevel' : 'melodyLevel';
  const vol = document.createElement('label'); vol.className = 'reg-vol';
  vol.innerHTML = '<span>Volume</span>';
  const range = document.createElement('input'); range.type = 'range'; range.min = 0; range.max = 1; range.step = 0.02;
  range.value = layout.sound[lvlKey]; range.setAttribute('aria-label', (side === 'chords' ? 'Chords' : 'Melody') + ' volume');
  range.addEventListener('input', () => { layout.sound[lvlKey] = +range.value; applySound(); touch(); });
  range.addEventListener('change', () => range.blur());
  vol.appendChild(range);
  const close = document.createElement('button'); close.type = 'button'; close.className = 'reg-close';
  close.innerHTML = '<i aria-hidden="true"></i><span>Close</span>';
  close.addEventListener('click', () => toggleRegisters(side, false));
  foot.appendChild(vol); foot.appendChild(close);
  d.appendChild(foot);
  return d;
}
function chooseRegister(side, id) {
  layout.sound[side] = id; touch();
  const el = $(`.side[data-side="${side}"]`);
  if (el) {
    $$('.reg-tab', el).forEach(t => { const on = t.dataset.sound === id; t.classList.toggle('on', on); t.setAttribute('aria-pressed', String(on)); });
    const btn = $('.reg-btn', el); if (btn) btn.innerHTML = regButtonHTML(side);
  }
  releaseFocus();
  previewSound(side);
}
/* The drawer hangs from the side's header and stops short of the bottom of the side. */
function placeDrawers() {
  $$('.side').forEach(el => {
    const d = $('.reg-drawer', el); if (!d) return;
    const head = $('.side-head', el);
    const top = head.offsetTop + head.offsetHeight + 5;
    d.style.top = top + 'px';
    d.style.maxHeight = Math.max(140, el.clientHeight - top - 7) + 'px';
  });
}

/* ---------- key binding ---------- */
function bindKey(side, id, k, on) {
  if (RESERVED[k] || !ALL_KEYS.has(k)) return;
  const b = layout[side].blocks[id];
  const has = b.keys.includes(k);
  if (on === undefined) on = !has;
  if (on && !has) b.keys.push(k);
  if (!on && has) b.keys = b.keys.filter(x => x !== k);
  layout.keyPreset = 'custom';
  touch(); rebuildKeyIndex();
}
function keyOwners(k) { return keyIndex[k] || []; }

/* ---------- mini keyboard (used by the editor) ---------- */
function miniKeyboard(side, id, onChange) {
  const el = document.createElement('div'); el.className = 'mini-kbd';
  const paint = () => {
    el.innerHTML = '';
    KB_ROWS.forEach((row, ri) => {
      const r = document.createElement('div'); r.className = 'kb-row'; r.dataset.row = ri;
      row.forEach(k => {
        const b = document.createElement('button'); b.className = 'mk'; b.type = 'button'; b.textContent = k;
        if (RESERVED[k]) { b.classList.add('reserved'); b.title = RESERVED[k]; }
        else {
          const owners = keyOwners(k);
          const mine = owners.some(o => o.side === side && o.id === id);
          if (owners.length) { const o = owners[0]; b.classList.add('bound'); paintCap(b, blockInfo(o.side, layout[o.side].blocks[o.id]).color); b.title = owners.map(o => blockInfo(o.side, layout[o.side].blocks[o.id]).main).join(', '); }
          if (mine) b.classList.add('mine');
          b.addEventListener('click', () => { bindKey(side, id, k); paint(); onChange && onChange(); });
        }
        r.appendChild(b);
      });
      el.appendChild(r);
    });
  };
  paint();
  el.repaint = paint;
  return el;
}

/* ---------- block editor sheet ---------- */
function openBlockEditor(side, id) {
  const S = layout[side]; const b = S.blocks[id]; if (!b) return;
  selectedBlock = { side, id };
  renderStage();
  const body = $('#block-sheet-body'), foot = $('#block-sheet-foot');
  body.innerHTML = ''; foot.innerHTML = '';
  $('#block-sheet-title').textContent = side === 'melody' ? 'Melody block' : 'Chord block';

  const preview = document.createElement('button'); preview.className = 'preview-block'; preview.type = 'button';
  const paintPreview = () => {
    const info = blockInfo(side, b);
    paintCap(preview, info.color);
    preview.innerHTML = '';
    const m = document.createElement('span'); setLabel(m, info.main); preview.appendChild(m);
    const s = document.createElement('small'); s.textContent = side === 'melody' ? info.letter + (b.oct ? (b.oct > 0 ? ' ▲' : ' ▼').repeat(Math.abs(b.oct)) : '') : info.letter + '  ·  ' + T.chordTones(layout.key, sc(), b).map(t => t.name).join(' '); preview.appendChild(s);
    if (!info.inScale) { const w = document.createElement('small'); w.textContent = 'outside the scale'; preview.appendChild(w); }
  };
  paintPreview();
  let pv = null;
  preview.addEventListener('pointerdown', e => { e.preventDefault(); Audio.ensure(); pv = Audio.play(side, freqsFor(side, b, 'preview'), layout.sound[side]); });
  const stopPv = () => { if (pv) { Audio.stop(pv); pv = null; } };
  preview.addEventListener('pointerup', stopPv); preview.addEventListener('pointercancel', stopPv); preview.addEventListener('pointerleave', stopPv);
  body.appendChild(rowOf('Hear', preview));

  const refresh = () => { S.custom = true; markSandbox(); touch(); paintPreview(); renderTopbar(); renderStage(); };

  if (side === 'melody') {
    // pitch
    const chips = document.createElement('div'); chips.className = 'chips';
    const scale = T.SCALE_BY_ID[sc()];
    const scaleSet = new Set(scale.degrees.map(T.degreeSemis));
    const paintChips = () => {
      chips.innerHTML = '';
      T.chromaticDegrees(sc()).forEach(deg => {
        const d = T.describeNote(layout.key, sc(), deg, 0);
        const c = document.createElement('button'); c.className = 'chip'; c.type = 'button';
        paintCap(c, d.color);
        if (scaleSet.has(T.degreeSemis(deg))) c.classList.add('in-scale'); else c.classList.add('dim');
        if (T.degreeSemis(deg) === T.degreeSemis(b.deg)) c.classList.add('selected');
        c.innerHTML = `<span>${d.solfege}</span><small>${d.letter}</small>`;
        c.addEventListener('click', () => { b.deg = deg; paintChips(); refresh(); });
        chips.appendChild(c);
      });
    };
    paintChips();
    body.appendChild(rowOf('Note', chips));
    body.appendChild(rowOf('Octave', segControl([[-1, 'Low ▼'], [0, 'Middle'], [1, 'High ▲'], [2, 'Top ▲▲']], b.oct, v => { b.oct = v; refresh(); })));
  } else {
    const chips = document.createElement('div'); chips.className = 'chips';
    const scale = T.SCALE_BY_ID[sc()];
    const scaleSet = new Set(scale.degrees.map(T.degreeSemis));
    const paintChips = () => {
      chips.innerHTML = '';
      T.chromaticDegrees(sc()).forEach(deg => {
        const sp = T.spellDegree(T.tonicName(layout.key, sc()), deg);
        const c = document.createElement('button'); c.className = 'chip'; c.type = 'button';
        paintCap(c, T.KEY_COLORS[sp.letter]);
        if (scaleSet.has(T.degreeSemis(deg))) c.classList.add('in-scale'); else c.classList.add('dim');
        if (T.degreeSemis(deg) === T.degreeSemis(b.root)) c.classList.add('selected');
        c.innerHTML = `<span>${sp.name}</span><small>${deg.replace(/#/g, '♯').replace(/b/g, '♭')}</small>`;
        c.addEventListener('click', () => { b.root = deg; b.label = null; paintChips(); labelInput.value = ''; refresh(); });
        chips.appendChild(c);
      });
    };
    paintChips();
    body.appendChild(rowOf('Root', chips));
    const qsel = document.createElement('select'); qsel.className = 'select';
    Object.keys(T.QUALITIES).forEach(q => { const o = document.createElement('option'); o.value = q; o.textContent = T.QUALITIES[q].name; qsel.appendChild(o); });
    qsel.value = b.q;
    qsel.addEventListener('change', () => { b.q = qsel.value; b.label = null; labelInput.value = ''; refresh(); });
    body.appendChild(rowOf('Quality', qsel));
    body.appendChild(rowOf('Register', segControl([[-1, 'Low'], [0, 'Middle'], [1, 'High']], b.oct, v => { b.oct = v; refresh(); })));
    // permanent functions: any of the chord buttons' functions, stuck to this chord (one inversion at a time)
    const modChips = document.createElement('div'); modChips.className = 'chips';
    const paintMods = () => {
      modChips.innerHTML = '';
      MOD_FUNCS.forEach(f => {
        const on = (b.mods || []).includes(f.id);
        const slot = SLOT_KEYS.find(M => slotFunc(M) === f);
        const c = document.createElement('button'); c.className = 'chip mod-chip' + (on ? ' selected' : ''); c.type = 'button';
        c.innerHTML = `<span>${modLabelHTML(f)}</span><small>${slot ? slot.toLowerCase() : '&nbsp;'}</small>`; c.title = f.does;
        c.addEventListener('click', () => {
          let set = (b.mods || []).filter(id => id !== f.id);
          if (!on) { if (f.inv) set = set.filter(id => !MOD_BY_ID[id].inv); set.push(f.id); }
          b.mods = MOD_FUNCS.map(x => x.id).filter(id => set.includes(id));
          paintMods(); refresh();
        });
        modChips.appendChild(c);
      });
    };
    paintMods();
    const modNote = document.createElement('span'); modNote.className = 'status-msg'; modNote.textContent = 'Stuck to this chord. The Z X C V B buttons do the same thing while held.';
    const modWrap = document.createElement('div'); modWrap.style.display = 'flex'; modWrap.style.flexDirection = 'column'; modWrap.style.gap = '6px'; modWrap.append(modChips, modNote);
    body.appendChild(rowOf('Modify', modWrap));
  }

  // label
  const labelInput = document.createElement('input'); labelInput.className = 'text-field'; labelInput.type = 'text'; labelInput.maxLength = 12;
  labelInput.placeholder = 'Automatic'; labelInput.value = b.label || '';
  labelInput.addEventListener('input', () => { b.label = labelInput.value.trim() || null; refresh(); });
  body.appendChild(rowOf('Label', labelInput));

  // height & width
  body.appendChild(rowOf('Height', segControl(SIZES.map(s => [s, SIZE_NAMES[s]]), b.size, v => { b.size = v; refresh(); })));
  body.appendChild(rowOf('Width', segControl(WIDTHS.map(s => [s, WIDTH_NAMES[s]]), b.w || 1, v => { b.w = v; refresh(); })));

  // keys
  const keysWrap = document.createElement('div'); keysWrap.className = 'keychips';
  const mini = miniKeyboard(side, id, () => paintKeys());
  const paintKeys = () => {
    keysWrap.innerHTML = '';
    if (!b.keys.length) { const e = document.createElement('span'); e.className = 'status-msg'; e.textContent = 'No key yet — tap one below, or press a key now.'; keysWrap.appendChild(e); }
    b.keys.forEach(k => {
      const c = document.createElement('button'); c.className = 'keychip'; c.type = 'button'; c.innerHTML = `<b>${k}</b><span>×</span>`;
      c.addEventListener('click', () => { bindKey(side, id, k, false); paintKeys(); mini.repaint(); renderStage(); });
      keysWrap.appendChild(c);
    });
  };
  paintKeys();
  body.appendChild(rowOf('Keys', keysWrap));
  body.appendChild(rowOf('', mini));
  $('#block-sheet').dataset.bind = JSON.stringify({ side, id });
  $('#block-sheet').onBindKey = k => { bindKey(side, id, k); paintKeys(); mini.repaint(); renderStage(); };

  // (the move pad and Stack went on 2026-09-27: every view now places a block by what it is, not by its row)

  // foot
  const dup = document.createElement('button'); dup.className = 'btn'; dup.textContent = 'Duplicate';
  dup.addEventListener('click', () => { const nid = duplicateBlock(side, id); if (nid) openBlockEditor(side, nid); });
  const rem = document.createElement('button'); rem.className = 'btn btn-danger'; rem.textContent = 'Remove';
  rem.addEventListener('click', () => { removeBlock(side, id); closeSheet('block-sheet'); });
  const done = document.createElement('button'); done.className = 'btn btn-primary'; done.textContent = 'Done';
  done.addEventListener('click', () => closeSheet('block-sheet'));
  foot.append(dup, rem, done);
  openSheet('block-sheet');
}
function rowOf(label, control) {
  const r = document.createElement('div'); r.className = 'editor-row';
  const l = document.createElement('span'); l.className = 'editor-label'; l.textContent = label; r.appendChild(l);
  r.appendChild(control); return r;
}
function segControl(options, value, onChange) {
  const seg = document.createElement('div'); seg.className = 'seg';
  const paint = () => { $$('button', seg).forEach(b => b.classList.toggle('active', String(b.dataset.v) === String(value))); };
  options.forEach(([v, t]) => {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v; b.textContent = t;
    b.addEventListener('click', () => { value = v; paint(); onChange(v); });
    seg.appendChild(b);
  });
  paint();
  return seg;
}

/* ---------- the chord buttons: what Z X C V B do ---------- */
let modSheetSlot = 'Z';
function setSlot(M, id) {
  const slots = (layout.modSlots || DEFAULT_SLOTS).slice();
  slots[SLOT_KEYS.indexOf(M)] = id;
  layout.modSlots = slots;
  if (heldMods.size) { heldMods.clear(); retriggerHeld('chords'); }
  touch(); renderAll();
}
function openModSheet(M) {
  if (M) modSheetSlot = M;
  const body = $('#mods-body'); body.innerHTML = '';
  const hint = document.createElement('p'); hint.className = 'sheet-hint';
  hint.textContent = 'Five buttons, on Z X C V B, change any chord while you hold them. Pick a button, then what it does. Leave one empty to hide it.';
  body.appendChild(hint);
  const slots = document.createElement('div'); slots.className = 'slot-tabs';
  SLOT_KEYS.forEach(K => {
    const f = slotFunc(K);
    const t = document.createElement('button'); t.type = 'button'; t.className = 'slot-tab' + (K === modSheetSlot ? ' current' : '') + (f ? '' : ' empty');
    t.innerHTML = '<span class="slot-name">' + modLabelHTML(f) + '</span><span class="slot-key">' + K + '</span>';
    t.addEventListener('click', () => openModSheet(K));
    slots.appendChild(t);
  });
  body.appendChild(slots);
  const cur = slotFunc(modSheetSlot);
  const group = (title, list) => {
    const h = document.createElement('div'); h.className = 'bind-group-title'; h.textContent = title; body.appendChild(h);
    const chips = document.createElement('div'); chips.className = 'chips';
    list.forEach(f => {
      const c = document.createElement('button'); c.type = 'button'; c.className = 'chip mod-chip func-chip' + (cur === f ? ' selected' : '');
      c.innerHTML = '<span>' + modLabelHTML(f) + '</span>'; c.title = f ? f.does : 'No button';
      c.addEventListener('click', () => { setSlot(modSheetSlot, f ? f.id : null); openModSheet(); });
      chips.appendChild(c);
    });
    body.appendChild(chips);
  };
  group('Change the chord', MOD_FUNCS.filter(f => f.engine));
  group('Invert it — 6/5, 4/3 and 4/2 make it a 7th chord', MOD_FUNCS.filter(f => f.inv));
  group('Nothing', [null]);
  const does = document.createElement('p'); does.className = 'panel-note';
  does.textContent = modSheetSlot + ': ' + (cur ? cur.does + '.' : 'empty — no button.');
  body.appendChild(does);
  const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'btn';
  reset.textContent = 'Back to sus2 · add9 · sus4 · ♭7 · maj7';
  reset.addEventListener('click', () => { layout.modSlots = DEFAULT_SLOTS.slice(); if (heldMods.size) heldMods.clear(); touch(); renderAll(); openModSheet(); });
  body.appendChild(reset);
  if (!$('#mods-sheet').classList.contains('open')) openSheet('mods-sheet');
}

/* ---------- add chord sheet ---------- */
function openAddChord() {
  const body = $('#add-chord-body'); body.innerHTML = '';
  const scale = T.SCALE_BY_ID[sc()];
  const have = new Set(Object.values(layout.chords.blocks).map(b => b.root + '|' + b.q));
  const list = document.createElement('div'); list.className = 'chord-list';
  const section = (title, specs) => {
    if (!specs.length) return;
    const h = document.createElement('div'); h.className = 'lib-group'; h.textContent = title; list.appendChild(h);
    specs.forEach(spec => {
      const d = T.describeChord(layout.key, sc(), spec);
      const item = document.createElement('div'); item.className = 'chord-item';
      const added = have.has(spec.root + '|' + spec.q);
      if (added) item.classList.add('added');
      const sw = document.createElement('div'); sw.className = 'swatch'; paintCap(sw, d.color); sw.textContent = d.roman;
      const names = document.createElement('div'); names.className = 'names';
      names.innerHTML = `<b>${d.letter}</b><span>${T.chordTones(layout.key, sc(), spec).map(t => t.name).join(' ')} · ${T.QUALITIES[spec.q].name}${d.inScale ? '' : ' · outside the scale'}</span>`;
      const hear = document.createElement('button'); hear.className = 'btn btn-sm'; hear.textContent = '▶';
      let pv = null;
      hear.addEventListener('pointerdown', e => { e.preventDefault(); Audio.ensure(); pv = Audio.play('chords', T.chordMidis(layout.key, spec.root, spec.q, 0).map(T.midiToFreq), layout.sound.chords); });
      const stop = () => { if (pv) { Audio.stop(pv); pv = null; } };
      hear.addEventListener('pointerup', stop); hear.addEventListener('pointercancel', stop); hear.addEventListener('pointerleave', stop);
      const add = document.createElement('button'); add.className = 'btn btn-sm btn-primary'; add.textContent = added ? 'Add again' : 'Add';
      add.addEventListener('click', () => { addChordBlock(spec); closeSheet('add-chord-sheet'); toast('Added ' + d.roman); });
      item.append(sw, names, hear, add);
      list.appendChild(item);
    });
  };
  section('This scale\'s chords, by importance', scale.chords);
  section('More chords for this scale', scale.more || []);
  const custom = document.createElement('button'); custom.className = 'btn'; custom.textContent = 'Custom chord…';
  custom.addEventListener('click', () => { const id = addChordBlock({ root: '1', q: 'maj' }); closeSheet('add-chord-sheet'); openBlockEditor('chords', id); });
  body.appendChild(list);
  body.appendChild(custom);
  openSheet('add-chord-sheet');
}

/* ---------- bind sheet (Keys view, edit mode) ---------- */
function openBindSheet(k) {
  if (RESERVED[k]) { toast('That key is ' + (RESERVED[k] === '♯' ? 'sharp' : 'flat')); return; }
  $('#bind-title').textContent = 'Key  ' + k.toUpperCase();
  const body = $('#bind-body'); body.innerHTML = '';
  const groups = document.createElement('div'); groups.className = 'bind-groups';
  const hint = document.createElement('p'); hint.className = 'sheet-hint'; hint.textContent = 'Tap the blocks this key should play. A key can play more than one.';
  body.appendChild(hint);
  ['chords', 'melody'].forEach(side => {
    const g = document.createElement('div');
    const t = document.createElement('div'); t.className = 'bind-group-title'; t.textContent = side === 'chords' ? 'Chord blocks' : 'Melody blocks'; g.appendChild(t);
    const chips = document.createElement('div'); chips.className = 'chips';
    orderedIds(layout[side]).forEach(id => {
      const b = layout[side].blocks[id]; const info = blockInfo(side, b);
      const c = document.createElement('button'); c.className = 'chip'; c.type = 'button'; paintCap(c, info.color);
      if (b.keys.includes(k)) c.classList.add('selected');
      c.innerHTML = `<span>${info.main}</span><small>${info.oct ? (info.oct > 0 ? '▲' : '▼') + ' ' : ''}${b.keys.join(' ') || '—'}</small>`;
      c.addEventListener('click', () => { bindKey(side, id, k); c.classList.toggle('selected', b.keys.includes(k)); c.querySelector('small').textContent = b.keys.join(' ') || '—'; renderStage(); });
      chips.appendChild(c);
    });
    g.appendChild(chips); groups.appendChild(g);
  });
  body.appendChild(groups);
  const clear = document.createElement('button'); clear.className = 'btn'; clear.textContent = 'Clear this key';
  clear.addEventListener('click', () => { keyOwners(k).slice().forEach(o => bindKey(o.side, o.id, k, false)); renderStage(); closeSheet('bind-sheet'); });
  body.appendChild(clear);
  openSheet('bind-sheet');
}

/* ==================================================================
   SHEETS & TOAST
   ================================================================== */
function openSheet(id) { const el = $('#' + id); el.classList.add('open'); }
function closeSheet(id) {
  const el = $('#' + id); el.classList.remove('open');
  releaseFocus();
  if (id === 'block-sheet') { selectedBlock = null; el.onBindKey = null; renderStage(); }
}
function anySheetOpen() { return !!$('.sheet-backdrop.open'); }
$$('.sheet-backdrop').forEach(bd => {
  bd.addEventListener('pointerdown', e => { if (e.target === bd) closeSheet(bd.id); });
  $$('[data-close]', bd).forEach(b => b.addEventListener('click', () => closeSheet(bd.id)));
});
let toastTimer = null;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ==================================================================
   LIBRARY
   ================================================================== */
function starterLayouts() {
  const mk = (id, title, opts, tweak) => { const L = makeLayout(opts); L.id = id; L.title = title; L.isStarter = true; L.createdAt = 0; if (tweak) tweak(L); return L; };
  return [
    mk('starter-c-major', 'C Major — the classic pair', { key: 0, scale: 'major', melodySound: 'piano', chordSound: 'pad' }),
    mk('starter-e-phrygian', 'E Phrygian — flamenco', { key: 4, scale: 'phrygian', melodySound: 'pluck', chordSound: 'strings' }),
    mk('starter-a-minor-pent', 'A Minor Pentatonic — blues hands', { key: 9, scale: 'minor-pentatonic', melodySound: 'epiano', chordSound: 'organ' }, L => { L.naming.chords = 'both'; }),
    mk('starter-eb-lydian', 'E♭ Lydian — dreamy', { key: 3, scale: 'lydian', melodySound: 'bell', chordSound: 'pad' }, L => { L.sound.reverb = 0.6; }),
    mk('starter-d-dorian', 'D Dorian — modal jam', { key: 2, scale: 'dorian', melodySound: 'marimba', chordSound: 'epiano' }),
    mk('starter-whole-tone', 'C Whole Tone — floating', { key: 0, scale: 'whole-tone', melodySound: 'bell', chordSound: 'strings' }, L => { L.sound.reverb = 0.7; }),
    mk('starter-octatonic', 'D Octatonic — mystery', { key: 2, scale: 'octatonic-hw', melodySound: 'pluck', chordSound: 'pad' }),
    mk('starter-phrygian-dom', 'A Phrygian Dominant — panels for thumbs', { key: 9, scale: 'phrygian-dominant', view: 'panels', melodySound: 'voice', chordSound: 'organ' })
  ];
}
function getLibrary() {
  let lib = null;
  try { const raw = localStorage.getItem(LIBRARY_KEY); if (raw) lib = JSON.parse(raw); } catch (e) {}
  if (!lib || typeof lib !== 'object') lib = {};
  starterLayouts().forEach(s => { if (!lib[s.id] || (Number(lib[s.id].v) || 1) < VERSION) lib[s.id] = s; });   // starters are read-only, so an old copy is simply replaced
  return lib;
}
function saveLibrary(lib) {
  try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib)); }
  catch (e) { toast('No room to save — the browser storage is full'); }
}
function newLayoutId() { return 'kb-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }

function describeLayout(L) {
  const t = T.tonicName(L.key, baseOf(L)).replace('#', '♯').replace('b', '♭');
  const s = scaleName(L.scale, L);
  return `${t} ${s} · ${Object.keys(L.chords.blocks).length} chords · ${Object.keys(L.melody.blocks).length} notes` + (L.chords.board ? ' · designed board' : '');
}
function swatchFor(L) {
  const ids = orderedIds(L.chords).slice(0, 5);
  const t = T.tonicName(L.key, baseOf(L));
  return ids.map(id => { const sp = T.spellDegree(t, L.chords.blocks[id].root); return `<i style="background:${T.KEY_COLORS[sp.letter]}"></i>`; }).join('');
}

function renderLibrary() {
  const lib = getLibrary();
  $('#now-title').textContent = layout.title || 'Untitled';
  $('#now-note').textContent = describeLayout(layout) + (dirty ? ' · unsaved changes' : '');
  const saveBtn = $('#save-btn');
  const isSaved = layout.id && lib[layout.id] && !lib[layout.id].isStarter;
  saveBtn.textContent = isSaved ? 'Save' : 'Save…';
  const list = $('#library-list'); list.innerHTML = '';
  const mine = Object.values(lib).filter(L => !L.isStarter).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const starters = Object.values(lib).filter(L => L.isStarter);
  const group = (title, items, emptyText) => {
    const h = document.createElement('div'); h.className = 'lib-group'; h.textContent = title; list.appendChild(h);
    if (!items.length) { const e = document.createElement('div'); e.className = 'lib-empty'; e.textContent = emptyText; list.appendChild(e); return; }
    items.forEach(L => {
      const item = document.createElement('div'); item.className = 'lib-item';
      if (L.id === layout.id) item.classList.add('current');
      const title = document.createElement('div'); title.className = 'lib-title'; title.innerHTML = `<span class="lib-swatch">${swatchFor(L)}</span>` + escapeHtml(L.title);
      const meta = document.createElement('div'); meta.className = 'lib-meta'; meta.textContent = describeLayout(L);
      const actions = document.createElement('div'); actions.className = 'lib-actions';
      const open = document.createElement('button'); open.className = 'btn btn-sm btn-primary'; open.textContent = 'Open';
      open.addEventListener('click', () => { adopt(L); closeSheet('library-sheet'); toast('Opened “' + L.title + '”'); });
      actions.appendChild(open);
      if (!L.isStarter) {
        const del = document.createElement('button'); del.className = 'btn btn-sm btn-danger'; del.textContent = 'Delete';
        del.addEventListener('click', () => {
          if (!confirm('Delete “' + L.title + '” from your library?')) return;
          const lib2 = getLibrary(); delete lib2[L.id]; saveLibrary(lib2);
          if (layout.id === L.id) { layout.id = null; dirty = true; renderTopbar(); }
          renderLibrary();
        });
        actions.appendChild(del);
      } else {
        const copy = document.createElement('button'); copy.className = 'btn btn-sm'; copy.textContent = 'Copy';
        copy.addEventListener('click', () => { const c = normalizeLayout(cloneLayout(L)); c.id = newLayoutId(); c.isStarter = false; c.title = L.title + ' (copy)'; c.createdAt = Date.now(); const lib2 = getLibrary(); lib2[c.id] = c; saveLibrary(lib2); renderLibrary(); toast('Copied to your layouts'); });
        actions.appendChild(copy);
      }
      item.append(title, actions, meta);
      list.appendChild(item);
    });
  };
  group('My layouts', mine, 'Nothing saved yet. Save… keeps the layout you are playing.');
  const scales = Object.values(getScales()).sort((a, b) => a.name.localeCompare(b.name));
  if (scales.length) {
    const h = document.createElement('div'); h.className = 'lib-group'; h.textContent = 'My scales'; list.appendChild(h);
    scales.forEach(rec => {
      const item = document.createElement('div'); item.className = 'lib-item';
      if (layout.scale === 'custom:' + rec.id) item.classList.add('current');
      const title = document.createElement('div'); title.className = 'lib-title'; title.textContent = rec.name;
      const meta = document.createElement('div'); meta.className = 'lib-meta'; meta.textContent = 'from ' + (T.SCALE_BY_ID[rec.base] ? T.SCALE_BY_ID[rec.base].name : 'Major') + ' · ' + Object.keys(rec.chords.blocks).length + ' chords · ' + Object.keys(rec.melody.blocks).length + ' notes';
      const actions = document.createElement('div'); actions.className = 'lib-actions';
      const use = document.createElement('button'); use.className = 'btn btn-sm btn-primary'; use.textContent = 'Use';
      use.addEventListener('click', () => { setScale('custom:' + rec.id); closeSheet('library-sheet'); toast('Scale: ' + rec.name); });
      const del = document.createElement('button'); del.className = 'btn btn-sm btn-danger'; del.textContent = 'Delete';
      del.addEventListener('click', () => { if (!confirm('Delete the scale “' + rec.name + '”?')) return; deleteScale(rec.id); renderLibrary(); });
      actions.append(use, del);
      item.append(title, actions, meta);
      list.appendChild(item);
    });
  }
  group('Starters', starters, '');
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

function adopt(record) {
  stopAllBlocks();
  layout = normalizeLayout(cloneLayout(record));
  dirty = false;
  applySound();
  renderAll();
  scheduleSave();
}
function saveCurrent(asNew) {
  const lib = getLibrary();
  const isSaved = layout.id && lib[layout.id] && !lib[layout.id].isStarter;
  if (isSaved && !asNew) {
    const rec = cloneLayout(layout); rec.isStarter = false; lib[layout.id] = rec; saveLibrary(lib);
    dirty = false; renderTopbar(); renderLibrary(); toast('Saved');
    return;
  }
  nameMode = 'layout';
  $('#name-sub').textContent = 'Give it a name so you can find it later.';
  $('#name-heading').textContent = asNew && isSaved ? 'Save a copy' : 'Save layout';
  $('#name-input').value = layout.title && layout.isStarter ? '' : (layout.title || '');
  $('#name-input').placeholder = describeLayout(layout).split(' · ')[0];
  openSheet('name-sheet');
  setTimeout(() => $('#name-input').focus(), 50);
}
let nameMode = 'layout';
function confirmName() {
  const name = $('#name-input').value.trim() || $('#name-input').placeholder;
  if (nameMode === 'scale') { nameMode = 'layout'; closeSheet('name-sheet'); saveScaleAs(name); return; }
  const lib = getLibrary();
  const rec = cloneLayout(layout);
  rec.id = newLayoutId(); rec.title = name; rec.isStarter = false; rec.createdAt = Date.now();
  lib[rec.id] = rec; saveLibrary(lib);
  layout.id = rec.id; layout.title = name; layout.isStarter = false; layout.createdAt = rec.createdAt;
  dirty = false;
  closeSheet('name-sheet'); renderTopbar(); renderLibrary(); scheduleSave();
  toast('Saved “' + name + '”');
}

/* ---------- share links & backup ---------- */
function encodeLayout(L) {
  const json = JSON.stringify(L);
  const bytes = new TextEncoder().encode(json);
  let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeLayout(s) {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) { return null; }
}
function makeShareLink() {
  const rec = cloneLayout(layout); delete rec.id; delete rec.isStarter;
  if (typeof layout.scale === 'string' && layout.scale.startsWith('custom:')) { const s = getScales()[layout.scale.slice(7)]; if (s) rec.scaleRecord = cloneLayout(s); }
  return location.origin + location.pathname + '?layout=' + encodeLayout(rec);
}
function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
  } catch (e) {}
  return Promise.resolve(fallbackCopy(text));
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta); return ok;
}
function exportLibrary() {
  const lib = getLibrary();
  const mine = Object.values(lib).filter(L => !L.isStarter);
  const data = { app: 'Digital Accordion', version: VERSION, exportedAt: new Date().toISOString(), layouts: mine.length ? mine : [cloneLayout(layout)], scales: Object.values(getScales()) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'digital-accordion-layouts.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importLibrary(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let data = null; try { data = JSON.parse(reader.result); } catch (e) {}
    const items = data && Array.isArray(data.layouts) ? data.layouts : (data && data.melody ? [data] : null);
    if (!items) { $('#import-status').textContent = 'That file is not a Digital Accordion (or Key Blocks) backup.'; return; }
    if (data && Array.isArray(data.scales)) {
      const scales = getScales();
      data.scales.forEach(r => { if (r && r.id && r.melody && r.chords && !scales[r.id]) scales[r.id] = { v: Number(r.v) || 1, id: r.id, name: String(r.name || 'Imported scale').slice(0, 60), base: isBuiltIn(r.base) ? r.base : 'major', melodyDesign: r.melodyDesign, melody: r.melody, chords: r.chords, createdAt: Date.now() }; });
      saveScales(scales);
    }
    const lib = getLibrary(); let n = 0;
    items.forEach(src => { const L = normalizeLayout(src); if (!L.title) L.title = 'Imported layout'; L.id = newLayoutId(); L.isStarter = false; L.createdAt = Date.now() + n; lib[L.id] = L; n++; });
    saveLibrary(lib); renderLibrary();
    $('#import-status').textContent = n + (n === 1 ? ' layout added.' : ' layouts added.');
  };
  reader.readAsText(file);
}

/* ==================================================================
   SETTINGS
   ================================================================== */
function applySound() {
  Audio.setLevel('melody', layout.sound.melodyLevel);
  Audio.setLevel('chords', layout.sound.chordsLevel);
  Audio.setReverb(layout.sound.reverb);
}
function fillSettings() {
  const fillPresets = sel => { sel.innerHTML = ''; Audio.PRESET_ORDER.forEach(id => { const o = document.createElement('option'); o.value = id; o.textContent = Audio.PRESETS[id].name; sel.appendChild(o); }); };
  fillPresets($('#melody-sound')); fillPresets($('#chords-sound'));
  $('#melody-sound').value = layout.sound.melody; $('#chords-sound').value = layout.sound.chords;
  $('#melody-level').value = layout.sound.melodyLevel; $('#chords-level').value = layout.sound.chordsLevel; $('#reverb-level').value = layout.sound.reverb;
  const kp = $('#key-preset'); kp.innerHTML = ''; KEY_PRESETS.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = p.name; kp.appendChild(o); });
  kp.value = layout.keyPreset;
  $('#show-keys-check').checked = layout.showKeys;
  $('#chord-tones-check').checked = layout.chordTones;
  $('#chord-bend-check').checked = layout.chordBend;
  const md = $('#melody-design'); md.innerHTML = ''; MELODY_DESIGNS.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = d.name; md.appendChild(o); }); md.value = layout.melodyDesign || 'A';
  const cs = $('#chord-set'); cs.innerHTML = ''; CHORD_SETS.forEach((c, i) => { const o = document.createElement('option'); o.value = c.id; o.textContent = describeChordSet(i); cs.appendChild(o); }); cs.value = CHORD_SETS[chordSetIndex()].id;
  $('#order-select').value = layout.order; $('#show-select').value = layout.show;
  $('#melody-naming').value = layout.naming.melody; $('#chords-naming').value = layout.naming.chords;
}
/* Selects and sliders in the settings sheet hold focus too; a key press
   should play once the sheet is closed. */
function releaseFocus() { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); }
function wireSettings() {
  $('#melody-sound').addEventListener('change', e => { layout.sound.melody = e.target.value; touch(); previewSound('melody'); });
  $('#chords-sound').addEventListener('change', e => { layout.sound.chords = e.target.value; touch(); previewSound('chords'); });
  $('#melody-level').addEventListener('input', e => { layout.sound.melodyLevel = +e.target.value; applySound(); touch(); });
  $('#chords-level').addEventListener('input', e => { layout.sound.chordsLevel = +e.target.value; applySound(); touch(); });
  $('#reverb-level').addEventListener('input', e => { layout.sound.reverb = +e.target.value; applySound(); touch(); });
  $('#key-preset').addEventListener('change', e => { layout.keyPreset = e.target.value; applyKeyPreset(layout); touch(); renderAll(); });
  $('#show-keys-check').addEventListener('change', e => { layout.showKeys = e.target.checked; touch(); renderAll(); });
  $('#chord-tones-check').addEventListener('change', e => { layout.chordTones = e.target.checked; touch(); renderAll(); });
  $('#chord-bend-check').addEventListener('change', e => { layout.chordBend = e.target.checked; touch(); updateBend(); renderAll(); });
  $('#melody-design').addEventListener('change', e => setMelodyDesign(e.target.value));
  $('#chord-set').addEventListener('change', e => setChordSet(e.target.value));
  $('#mods-edit-btn').addEventListener('click', () => { closeSheet('settings-sheet'); openModSheet('Z'); });
  $('#order-select').addEventListener('change', e => { layout.order = e.target.value; touch(); renderAll(); });
  $('#show-select').addEventListener('change', e => { layout.show = e.target.value; touch(); renderAll(); });
  $('#melody-naming').addEventListener('change', e => { layout.naming.melody = e.target.value; touch(); renderAll(); });
  $('#chords-naming').addEventListener('change', e => { layout.naming.chords = e.target.value; touch(); renderAll(); });
  $('#rebuild-melody-btn').addEventListener('click', () => rebuildSide('melody'));
  $('#rebuild-chords-btn').addEventListener('click', () => rebuildSide('chords'));
}
function previewSound(side) {
  Audio.ensure();
  const freqs = side === 'melody'
    ? [T.midiToFreq(T.tonicMidi(layout.key) + 4)]
    : T.chordMidis(layout.key, '1', T.SCALE_BY_ID[sc()].chords[0].q, 0).map(T.midiToFreq);
  const v = Audio.play(side, freqs, layout.sound[side]);
  setTimeout(() => Audio.stop(v), 450);
}

/* ==================================================================
   KEYBOARD INPUT
   ================================================================== */
function mappedKey(e) {
  let k = e.key;
  if (SHIFT_MAP[k]) return SHIFT_MAP[k];
  return k.length === 1 ? k.toLowerCase() : k;
}
function isTyping() {
  const a = document.activeElement;
  return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
}
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const open = $('.sheet-backdrop.open'); if (open) { closeSheet(open.id); return; }
    ['chords', 'melody'].forEach(side => { if (regOpen[side]) toggleRegisters(side, false); });
  }
  if (isTyping()) return;
  if (e.metaKey || e.ctrlKey) return;
  const k = mappedKey(e);
  // octave from Shift / Caps Lock
  const capsOn = e.getModifierState && e.getModifierState('CapsLock');
  const octNow = e.shiftKey || capsOn;
  if (octNow !== octaveKey) setOctave(null, octNow);
  if (e.key === 'Escape') { const open = $('.sheet-backdrop.open'); if (open) closeSheet(open.id); return; }
  if (e.repeat) return;
  const blockSheet = $('#block-sheet');
  if (blockSheet.classList.contains('open') && blockSheet.onBindKey && ALL_KEYS.has(k) && !RESERVED[k]) { e.preventDefault(); blockSheet.onBindKey(k); return; }
  if (anySheetOpen()) return;
  const bound = playable(k);
  if (MOD_KEYS[k] && !(bound && bound.length)) { e.preventDefault(); Audio.ensure(); setMod(MOD_KEYS[k], true); return; }
  if (layout.view === 'keys' && anyEditing()) return;
  if (bound && bound.length) {
    e.preventDefault();
    Audio.ensure();
    bound.forEach((b, i) => { if (!editSides[b.side]) startBlock(b.side, b.id, `key:${k}` + (i ? ':' + i : '')); });
  }
});
window.addEventListener('keyup', e => {
  const k = mappedKey(e);
  const capsOn = e.getModifierState && e.getModifierState('CapsLock');
  const octNow = e.shiftKey || capsOn;
  if (octNow !== octaveKey) setOctave(null, octNow);
  const bound = playable(k);
  if (MOD_KEYS[k] && !(bound && bound.length)) { setMod(MOD_KEYS[k], false); return; }
  if (bound) bound.forEach((b, i) => stopBlock(`key:${k}` + (i ? ':' + i : '')));
  // a key released after a re-bind may be held under an old index
  [...held.keys()].filter(s => s === `key:${k}` || s.startsWith(`key:${k}:`)).forEach(stopBlock);
});
window.addEventListener('blur', () => { stopAllBlocks(); sharpHeld = flatHeld = octaveKey = false; paintPerf(); if (heldMods.size) { heldMods.clear(); paintChords(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAllBlocks(); });

/* ==================================================================
   TOP BAR WIRING
   ================================================================== */
function wireTopbar() {
  $('#key-down').addEventListener('click', () => setKey(layout.key - 1));
  $('#key-up').addEventListener('click', () => setKey(layout.key + 1));
  $('#key-name').addEventListener('click', () => {
    const grid = $('#key-grid'); grid.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const b = document.createElement('button'); b.type = 'button';
      b.textContent = T.tonicName(i, sc()).replace('#', '♯').replace('b', '♭');
      if (i === layout.key) b.classList.add('current');
      b.addEventListener('click', () => { setKey(i); closeSheet('key-sheet'); });
      grid.appendChild(b);
    }
    openSheet('key-sheet');
  });
  const sel = $('#scale-select');
  sel.addEventListener('change', () => { setScale(sel.value); sel.blur(); });
  $('#save-scale-btn').addEventListener('click', () => {
    closeSheet('library-sheet');
    nameMode = 'scale';
    $('#name-heading').textContent = 'Save this scale';
    $('#name-sub').textContent = 'It joins “My scales” in the scale menu, in every key.';
    $('#name-input').value = ''; $('#name-input').placeholder = 'e.g. My ' + T.SCALE_BY_ID[sc()].name;
    openSheet('name-sheet'); setTimeout(() => $('#name-input').focus(), 50);
  });
  $$('.seg-btn').forEach(b => b.addEventListener('click', () => { layout.view = b.dataset.view; touch(); renderAll(); }));
  $('#library-btn').addEventListener('click', () => { renderLibrary(); openSheet('library-sheet'); });
  $('#settings-btn').addEventListener('click', () => { fillSettings(); openSheet('settings-sheet'); });

  // library sheet
  $('#save-btn').addEventListener('click', () => saveCurrent(false));
  $('#save-as-btn').addEventListener('click', () => saveCurrent(true));
  $('#name-confirm').addEventListener('click', confirmName);
  $('#name-input').addEventListener('keydown', e => { if (e.key === 'Enter') confirmName(); });
  $('#new-layout-btn').addEventListener('click', () => {
    const L = makeLayout({ key: layout.key, scale: sc(), melodySound: layout.sound.melody, chordSound: layout.sound.chords, melodyDesign: layout.melodyDesign });
    if (!isBuiltIn(layout.scale)) { L.scale = layout.scale; L.scaleBase = sc(); L.melody = cloneLayout(layout.melody); L.chords = cloneLayout(layout.chords); applyKeyPreset(L); }
    L.view = layout.view; L.chordSet = layout.chordSet; L.modSlots = (layout.modSlots || DEFAULT_SLOTS).slice(); L.naming = Object.assign({}, layout.naming); L.sound = Object.assign({}, layout.sound);
    adopt(L); dirty = true; renderTopbar(); closeSheet('library-sheet'); toast('Fresh layout from the scale');
  });
  $('#share-toggle-btn').addEventListener('click', () => { const p = $('#share-panel'); p.hidden = !p.hidden; });
  $('#make-link-btn').addEventListener('click', () => {
    const link = makeShareLink();
    $('#share-link').value = link; $('#share-row').hidden = false;
    $('#share-status').textContent = (link.length / 1024).toFixed(1) + ' KB link — the whole layout is inside it.';
  });
  $('#copy-link-btn').addEventListener('click', () => {
    copyToClipboard($('#share-link').value).then(ok => {
      $('#share-status').textContent = ok ? 'Link copied to your clipboard.' : 'Select the link above and copy it.';
      if (!ok) { $('#share-link').focus(); $('#share-link').select(); }
    });
  });
  $('#export-btn').addEventListener('click', exportLibrary);
  $('#import-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', e => { if (e.target.files[0]) importLibrary(e.target.files[0]); e.target.value = ''; });
}

/* ==================================================================
   START
   ================================================================== */
function layoutFromUrl() {
  const params = new URLSearchParams(location.search);
  if (params.has('layout')) {
    const decoded = decodeLayout(params.get('layout'));
    if (history.replaceState) history.replaceState({}, '', location.pathname);
    if (!decoded || !decoded.melody) { toast('That link could not be read'); return null; }
    if (decoded.scaleRecord && decoded.scaleRecord.id && decoded.scaleRecord.melody && decoded.scaleRecord.chords) {
      const scales = getScales();
      if (!scales[decoded.scaleRecord.id]) { const r = decoded.scaleRecord; scales[r.id] = { v: Number(r.v) || 1, id: r.id, name: String(r.name || 'Shared scale').slice(0, 60), base: isBuiltIn(r.base) ? r.base : 'major', melodyDesign: r.melodyDesign, melody: r.melody, chords: r.chords, createdAt: Date.now() }; saveScales(scales); }
    }
    const L = normalizeLayout(decoded);
    if (L.scale === 'sandbox') { layout = L; saveSandbox(); }
    L.id = newLayoutId(); L.isStarter = false; L.createdAt = Date.now();
    if (!L.title) L.title = 'Shared layout';
    const lib = getLibrary(); lib[L.id] = L; saveLibrary(lib);
    setTimeout(() => toast('Added “' + L.title + '” to your library'), 300);
    return L;
  }
  if (params.has('key') || params.has('scale')) {
    const keyMap = { 'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3, 'e': 4, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8, 'ab': 8, 'a': 9, 'a#': 10, 'bb': 10, 'b': 11 };
    const k = (params.get('key') || 'c').trim().toLowerCase().replace('♯', '#').replace('♭', 'b');
    const scale = (params.get('scale') || 'major').trim().toLowerCase();
    const L = makeLayout({ key: keyMap[k] !== undefined ? keyMap[k] : 0, scale: T.SCALE_BY_ID[scale] ? scale : 'major' });
    const timbre = (params.get('timbre') || '').toLowerCase();
    if (Audio.PRESETS[timbre]) { L.sound.melody = timbre; L.sound.chords = timbre; }
    if (history.replaceState) history.replaceState({}, '', location.pathname);
    return L;
  }
  return null;
}

function start() {
  try { if (window.self !== window.top) document.documentElement.classList.add('in-iframe'); } catch (e) { document.documentElement.classList.add('in-iframe'); }
  document.documentElement.dataset.style = 'accordion';   // the only look
  wireTopbar(); wireSettings();
  let L = layoutFromUrl();
  if (!L) { try { const raw = localStorage.getItem(CURRENT_KEY); if (raw) L = normalizeLayout(JSON.parse(raw)); } catch (e) {} }
  if (!L) L = getLibrary()['starter-c-major'] ? normalizeLayout(cloneLayout(getLibrary()['starter-c-major'])) : makeLayout({});
  layout = L; dirty = false;
  renderAll();
  requestAnimationFrame(() => requestAnimationFrame(lampTest));
  window.addEventListener('resize', () => requestAnimationFrame(fitStage));
  if (window.ResizeObserver) new ResizeObserver(() => fitStage()).observe($('#stage'));
  document.fonts && document.fonts.ready.then(fitStage);
  const unlock = () => { Audio.ensure(); applySound(); };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
  /* On a touch screen (smart boards, tablets, phones) a finger going down is not
     a "user activation" — only lifting it is — so the browser keeps audio asleep
     through the very first press. Wake it on the first lift, and let that first
     press be heard as the finger lifts (a short note); from then on every press
     sounds straight away. */
  const wake = e => {
    if (e.pointerType === 'mouse') return;
    const c = Audio.ensure();
    if (c.state === 'running') { window.removeEventListener('pointerup', wake, true); window.removeEventListener('touchend', wake, true); return; }
    const h = e.type === 'pointerup' && held.get('ptr:' + e.pointerId);
    if (h) { const v = Audio.play(h.side, h.freqs, layout.sound[h.side]); setTimeout(() => Audio.stop(v), 450); }
  };
  window.addEventListener('pointerup', wake, true);
  window.addEventListener('touchend', wake, true);
}
start();

window.KeyBlocks = { get layout() { return layout; }, makeLayout, normalizeLayout, encodeLayout, decodeLayout, applyKeyPreset };
window.DigitalAccordion = window.KeyBlocks;
})();

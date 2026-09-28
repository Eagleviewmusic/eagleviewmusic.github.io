/* ==========================================================================
   COMPONENT SLOT — the chord panel (left hand)              #chord-strip
   and the corner under it                                    #dock-corner
   --------------------------------------------------------------------------
   Digital Accordion's chord side, in Song Writer's frame: the fourteen
   chords of the song's scale in the Panels shape (rows share the height;
   F is wide), the Core · Full · Extended · Extreme set button, the
   Z X C V B tabs along the bottom, and — with the hat on — a pencil on
   every chord that opens the chord editor. js/chords.js is the engine.

         [ Chords        (C) (♪)     Extreme ]   C/I: names as letters or numerals; ♪: the notes in every chord
         [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ]              ♭VI iv vii°7/V V/iii V/ii
         [ Q ][ W ][ E ][ R ]                   V/vi IV/IV V/V iii
         [ A ][ S ][ D ]                        vi IV V
         [ F  F  F ][ G ]                       I  ii
         [ Z sus2 ][ X add9 ][ C sus4 ][ V ♭7 ][ B maj7 ]    (✎ in Edit)

   PLAYING — tap a chord, or press its key (F D S A G R E Q W, 1–5) in
   Perform; in Edit the letters are 1.0's solfège keys unless a lane slot
   is chosen (glowing), when the left hand takes them back. Hold a tab
   (or Z X C V B) while you play: every chord relabels to what it would
   become, and the chord that sounds — and is written into the lane — is
   the modified one.

   EDITING — the hat on: ✎ on a chord opens the editor (root, quality,
   permanent functions such as 7ths and 6/4, a label, back to the
   scale's chord); ✎ at the end of the tabs opens the Z X C V B chooser.
   Re-chording is saved with the song (score.board).

   THE CORNER — under the panel, beside the keyboard: the chord selected
   (or the tonic chord until one is), its other name, and its notes as
   coloured pills (solfège with numerals, letters with letters) in the top half;
   the keyboard's own Octaves and Focus rows in the bottom half
   (keyboard-dock.js seats them in #corner-panel while the corner is out).

   API
     SW.chordStrip.render()               redraw (scale, key, names, set, layout)
     SW.chordStrip.trigger(place, src)    play a place + light + (Edit) write to the lane
     SW.chordStrip.openEditor(place)      the chord editor sheet
     SW.chordStrip.openModsSheet(M)       the Z X C V B chooser
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const ui = SW.ui;
  const el = document.getElementById('chord-strip');
  const now = document.getElementById('corner-now');
  if (!el || !C) return;

  let litTimer = null;
  const BASE_FS = { f: 34, g: 20, a: 20, s: 20, d: 20, q: 17, w: 17, e: 17, r: 17, '1': 15, '2': 15, '3': 15, '4': 15, '5': 15 };

  /* dark or light writing on a colour */
  function inkOn(color) {
    const hex = /^#([0-9a-f]{6})$/i.exec(color || '');
    if (!hex) return '#fff';
    const n = parseInt(hex[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const lum = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
    return (1.05 / (L + 0.05)) >= 3.6 ? '#fff' : '#1c1a22';
  }

  /* the name on a block: figured bass drawn as a stack; a slash chord on two lines */
  function mainHtml(label) {
    const cut = label.indexOf('/');
    if (cut > 0 && cut < label.length - 1) {
      return '<span class="cb-main two"><span>' + C.labelHTML(label.slice(0, cut)) + '</span><span>' + C.labelHTML(label.slice(cut)) + '</span></span>';
    }
    return '<span class="cb-main">' + C.labelHTML(label) + '</span>';
  }

  /* the notes inside a block (♪ on): a column of pills, root at the bottom */
  function tonesHtml(d) {
    if (!C.tonesOn()) return '';
    return '<span class="cb-tones">' + d.tones.slice().reverse().map(t =>
      '<i style="--c:' + t.color + ';color:' + inkOn(t.color) + '" title="' + t.name + ' · ' + t.solfege + ' · ' + t.degreeLabel + '">' + C.escapeHtml(C.toneText(t)) + '</i>').join('') + '</span>';
  }
  /* what is inside a block: the key, the name, the notes (♪), the pencil (Edit) */
  function blockInner(entry, d) {
    return '<span class="cb-key">' + C.keyOf(entry.place) + '</span>' +
      mainHtml(C.nameOf(d)) +
      tonesHtml(d) +
      (S.editing ? '<span class="cb-edit" role="button" title="Change this chord — root, quality, 7ths and inversions, its name"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span>' : '');
  }
  function blockHtml(entry, w) {
    const d = C.describe(entry.spec, { held: true });
    const cls = ['cblock'];
    if (!d.inScale) cls.push('out-of-scale');
    if (d.modded) cls.push('modded');
    if (entry.custom) cls.push('custom');
    if (C.tonesOn()) cls.push('has-tones');
    if (S.selectedChord && S.selectedChord.place === entry.place) cls.push('selected');
    const title = d.roman + ' — ' + d.letter + ' · ' + d.tones.map(t => t.name).join(' ') + ' (key ' + C.keyOf(entry.place) + ')';
    return '<button type="button" class="' + cls.join(' ') + '" data-place="' + entry.place + '" style="--c:' + d.color + ';--ink:' + inkOn(d.color) + ';flex-grow:' + (w || 1) + '" title="' + C.escapeHtml(title) + '">' +
      blockInner(entry, d) + '</button>';
  }

  function modTabHtml(Mk) {
    const f = C.slotFunc(Mk);
    if (!f && !S.editing) return '';
    return '<button type="button" class="cmod' + (f ? '' : ' empty') + (C.heldMods.has(Mk) ? ' on' : '') + '" data-mod="' + Mk + '" data-hold title="' +
      (f ? C.escapeHtml(f.does) + ' — hold ' + Mk + ' (or this tab) while you play a chord' : 'No button — the pencil chooses what ' + Mk + ' does') + '">' +
      '<b class="cmod-key">' + Mk + '</b><span class="cmod-name">' + C.modLabelHTML(f) + '</span></button>';
  }

  function render() {
    const offered = C.offered();
    let rows = '';
    C.SHAPE.forEach(row => {
      const cells = row.filter(cell => offered.indexOf(cell.place) !== -1).map(cell => blockHtml(C.entry(cell.place), cell.w)).join('');
      if (cells) rows += '<div class="crow">' + cells + '</div>';
    });
    const setI = C.setIndex();
    const set = C.CHORD_SETS[setI], next = C.CHORD_SETS[(setI + 1) % C.CHORD_SETS.length];
    const tabs = C.SLOT_KEYS.map(modTabHtml).join('') +
      (S.editing ? '<button type="button" class="cmod-edit" title="Choose what Z X C V B do"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>' : '');
    // the names button shows the OTHER way: "C" (the key's letter) while the numerals are on, "I" while the letters are
    const letters = C.naming() === 'letter';
    const tonicLetter = (Theory.spellDegree(S.key, '1').name || 'C');
    el.innerHTML =
      '<div class="strip-head">' +
        '<span class="strip-title">Chords</span>' +
        '<button type="button" class="head-btn name-btn' + (letters ? ' letters' : '') + '" title="' + (letters ? 'Chord names as roman numerals (I IV V)' : 'Chord names as letters (' + tonicLetter + ' F G)') + '">' + (letters ? 'I' : C.escapeHtml(tonicLetter)) + '</button>' +
        '<button type="button" class="head-btn tones-btn' + (C.tonesOn() ? ' on' : '') + '" aria-pressed="' + String(C.tonesOn()) + '" title="♪ notes — show the notes inside every chord">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8.5" cy="17.5" rx="4.4" ry="3" fill="currentColor" stroke="none" transform="rotate(-18 8.5 17.5)"/><path d="M12.4 16.8V4.2"/><path d="M12.4 4.2c4.2 1.6 6.3 4.6 5.2 9.2"/></svg>' +
        '</button>' +
        '<button type="button" class="set-btn" data-set="' + set.id + '" title="How many chords are out: ' + C.CHORD_SETS.map(c => c.name).join(' · ') + ' — tap for ' + next.name + '"><span class="set-long">' + set.name + '</span><span class="set-short">' + set.short + '</span></button>' +
      '</div>' +
      '<div class="strip-tower" data-rows="' + (rows.match(/class="crow"/g) || []).length + '">' + (rows || '<p class="strip-empty">No chords in this set are switched on in Layout settings</p>') + '</div>' +
      '<div class="strip-mods" role="group" aria-label="Chord buttons Z X C V B">' + tabs + '</div>';
    fitLabels();
    renderCorner();
  }

  /* While a tab is held the blocks relabel in place — a re-render would
     drop the pointer holding the tab. */
  function relabel() {
    el.querySelectorAll('.cblock').forEach(b => {
      const e = C.entry(b.dataset.place);
      if (!e) return;
      const d = C.describe(e.spec, { held: true });
      b.innerHTML = blockInner(e, d);
      b.classList.toggle('modded', d.modded);
      b.classList.toggle('out-of-scale', !d.inScale);
      b.style.setProperty('--c', d.color);
      b.style.setProperty('--ink', inkOn(d.color));
    });
    el.querySelectorAll('.cmod').forEach(t => t.classList.toggle('on', C.heldMods.has(t.dataset.mod)));
    fitLabels();
    renderCorner();
  }

  /* Names fit their blocks: the biggest size that fits the width, down to 9px. */
  function fitLabels() {
    el.querySelectorAll('.cblock').forEach(b => {
      const main = b.querySelector('.cb-main');
      if (!main) return;
      const base = BASE_FS[b.dataset.place] || 17;
      main.style.fontSize = base + 'px';
      const avail = b.clientWidth - 8;
      if (avail <= 0) return;
      const need = main.scrollWidth;
      if (need > avail) main.style.fontSize = Math.max(9, Math.floor(base * avail / need * 10) / 10) + 'px';
      // the notes column (♪): pills sized to what the block has left under the name
      const tones = b.querySelector('.cb-tones');
      let tonesH = 0;
      if (tones) {
        const n = tones.children.length || 1;
        const room = b.clientHeight - 15 - 10 - Math.min(base, 22) - 4;   // the key cap, padding, the name
        const th = Math.max(11, Math.min(17, Math.floor((room - 2 * (n - 1)) / n)));
        tones.style.setProperty('--th', th + 'px');
        tones.style.setProperty('--tf', Math.max(8, Math.min(10.5, th * 0.62)).toFixed(1) + 'px');
        tonesH = n * th + 2 * (n - 1) + 3;
      }
      // and the height: a two-line name in a short block
      const tall = b.clientHeight - 6 - tonesH - (tones ? 15 : 0);
      if (tall > 0 && main.scrollHeight > tall) main.style.fontSize = Math.max(9, Math.floor(parseFloat(main.style.fontSize) * tall / main.scrollHeight * 10) / 10) + 'px';
    });
  }

  /* Play a place: the panel, its key, or the number row. */
  function trigger(place, source) {
    if (C.offered().indexOf(place) === -1) {
      if (C.entry(place)) ui.toast(C.placeShown(place) ? 'That chord is switched off in Layout settings' : 'That chord is outside the ' + C.CHORD_SETS[C.setIndex()].name + ' set — tap the set button for more');
      return;
    }
    const id = C.playPlace(place, source || 'strip');
    el.querySelectorAll('.cblock').forEach(b => {
      b.classList.toggle('selected', b.dataset.place === place);
      b.classList.toggle('is-on', b.dataset.place === place);
    });
    clearTimeout(litTimer);
    litTimer = setTimeout(() => el.querySelectorAll('.cblock.is-on').forEach(b => b.classList.remove('is-on')), 260);
    // Edit, with a lane slot chosen: the chord is written there, as it sounded
    const syl = SW.lane && SW.lane.chosenSyllable();
    if (syl && id) SW.lane.assign(syl, id, { silent: true });
    renderCorner();
  }

  /* ---------------- the corner: what the left hand holds ---------------- */
  function renderCorner() {
    if (!now) return;
    const sel = S.selectedChord && C.entry(S.selectedChord.place) ? S.selectedChord.place : null;
    const home = sel || (C.offered()[0] || 'f');
    const e = C.entry(home);
    if (!e) { now.innerHTML = ''; return; }
    const d = C.describe(e.spec, { held: true });
    const main = C.nameOf(d);
    const alt = C.otherNameOf(d);
    const tones = d.tones.map(t => '<i style="--c:' + t.color + ';color:' + inkOn(t.color) + '" title="' + t.name + ' · ' + t.solfege + ' · ' + t.degreeLabel + '">' + C.escapeHtml(C.toneText(t)) + '</i>').join('');
    const held = C.SLOT_KEYS.filter(Mk => C.heldMods.has(Mk)).map(Mk => C.slotFunc(Mk)).filter(Boolean);
    let note = d.quality;
    if (held.length) note = 'holding ' + held.map(f => f.name).join(' + ');
    else if (!d.inScale) note = 'outside the scale';
    now.className = 'corner-now' + (sel ? '' : ' idle') + (d.modded ? ' modded' : '');
    now.title = (sel ? 'The chord in hand' : 'The tonic chord — tap a chord, or press its key') + ': ' + d.roman + ' — ' + d.letter + ' · ' + d.tones.map(t => t.name).join(' ');
    now.innerHTML =
      '<div class="cn-row"><span class="cn-name" style="--c:' + d.color + '">' + C.labelHTML(main) + '</span><span class="cn-key" title="Its key">' + C.keyOf(home) + '</span></div>' +
      '<div class="cn-alt">' + C.escapeHtml(alt) + '<span class="cn-note">' + C.escapeHtml(note) + '</span></div>' +
      '<div class="cn-tones">' + tones + '</div>';
  }

  /* ---------------- pointer ---------------- */
  el.addEventListener('pointerdown', e => {
    const tab = e.target.closest('.cmod');
    if (tab) {
      e.preventDefault();
      const Mk = tab.dataset.mod;
      if (tab.classList.contains('empty')) { openModsSheet(Mk); return; }
      try { tab.setPointerCapture(e.pointerId); } catch (err) {}
      C.setMod(Mk, true);
      const up = () => { C.setMod(Mk, false); tab.removeEventListener('pointerup', up); tab.removeEventListener('pointercancel', up); };
      tab.addEventListener('pointerup', up);
      tab.addEventListener('pointercancel', up);
      return;
    }
    const b = e.target.closest('.cblock');
    if (!b) return;
    e.preventDefault();
    if (e.target.closest('.cb-edit')) { openEditor(b.dataset.place); return; }
    trigger(b.dataset.place, 'strip');
  });
  el.addEventListener('click', e => {
    if (e.target.closest('.name-btn')) { e.stopPropagation(); C.setNaming(C.naming() === 'letter' ? 'roman' : 'letter'); return; }
    if (e.target.closest('.tones-btn')) { e.stopPropagation(); C.setTones(!C.tonesOn()); return; }
    const setBtn = e.target.closest('.set-btn');
    if (setBtn) {
      e.stopPropagation();
      const i = C.setIndex();
      const next = C.CHORD_SETS[(i + 1) % C.CHORD_SETS.length];
      C.setChordSet(next.id);
      ui.toast(C.describeSet(C.setIndex()));
      return;
    }
    if (e.target.closest('.cmod-edit')) { e.stopPropagation(); openModsSheet(); }
  });
  el.addEventListener('contextmenu', e => { if (e.target.closest('.cblock, .cmod')) e.preventDefault(); });

  /* ==================================================================
     THE CHORD EDITOR — Digital Accordion's block editor for one place
     ================================================================== */
  const sheet = document.getElementById('chord-sheet');
  const sheetBody = document.getElementById('chord-sheet-body');
  const sheetFoot = document.getElementById('chord-sheet-foot');
  const sheetTitle = document.getElementById('chord-sheet-title');
  let editPlace = null;

  function rowOf(label, control) {
    const r = document.createElement('div');
    r.className = 'editor-row';
    const l = document.createElement('span');
    l.className = 'editor-label';
    l.textContent = label;
    r.appendChild(l);
    r.appendChild(control);
    return r;
  }

  function openEditor(place) {
    const e = C.entry(place);
    if (!e || !sheet) return;
    editPlace = place;
    const spec = { root: e.spec.root, q: e.spec.q, mods: e.spec.mods.slice(), label: e.custom ? (e.spec.label || null) : null };
    sheetTitle.textContent = 'Chord on ' + C.keyOf(place);
    sheetBody.innerHTML = '';
    sheetFoot.innerHTML = '';

    // hear it: the chord as it is now
    const preview = document.createElement('button');
    preview.type = 'button';
    preview.className = 'chord-preview';
    const paintPreview = () => {
      const d = C.describe(spec);
      preview.style.setProperty('--c', d.color);
      preview.style.setProperty('--ink', inkOn(d.color));
      preview.innerHTML = '<span class="cp-name">' + C.labelHTML(d.roman) + '</span><span class="cp-letter">' + C.escapeHtml(d.letter) + '</span>' +
        '<span class="cp-tones">' + d.tones.map(t => '<i style="--c:' + t.color + ';color:' + inkOn(t.color) + '">' + t.name + '</i>').join('') + '</span>' +
        (d.inScale ? '' : '<span class="cp-warn">outside the scale</span>');
    };
    paintPreview();
    preview.addEventListener('click', ev => { ev.stopPropagation(); C.play(spec, 'editor'); });
    sheetBody.appendChild(rowOf('Hear', preview));

    const commit = () => { C.setBoard(place, spec); paintPreview(); syncReset(); };

    // root: the twelve notes, spelled for the scale
    const chips = document.createElement('div');
    chips.className = 'chips';
    const sc = C.scale();
    const scaleSet = new Set(sc.degrees.map(Theory.degreeSemis));
    const paintChips = () => {
      chips.innerHTML = '';
      Theory.chromaticDegrees(C.scaleId()).forEach(deg => {
        const sp = Theory.spellDegree(S.key, deg);
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'chip root-chip' + (scaleSet.has(Theory.degreeSemis(deg)) ? ' in-scale' : ' dim') + (Theory.degreeSemis(deg) === Theory.degreeSemis(spec.root) ? ' selected' : '');
        c.style.setProperty('--c', SW.music.LETTER_COLORS[sp.letter]);
        c.style.setProperty('--ink', inkOn(SW.music.LETTER_COLORS[sp.letter]));
        c.innerHTML = '<span>' + C.escapeHtml(sp.name) + '</span><small>' + C.escapeHtml(deg.replace(/#/g, '♯').replace(/b/g, '♭')) + '</small>';
        c.addEventListener('click', () => { spec.root = deg; spec.label = null; labelInput.value = ''; paintChips(); commit(); });
        chips.appendChild(c);
      });
    };
    paintChips();
    sheetBody.appendChild(rowOf('Root', chips));

    // quality
    const qsel = document.createElement('select');
    qsel.className = 'sound-select quality-select';
    Object.keys(Theory.QUALITIES).forEach(q => {
      const o = document.createElement('option');
      o.value = q;
      o.textContent = Theory.QUALITIES[q].name;
      qsel.appendChild(o);
    });
    qsel.value = spec.q;
    qsel.addEventListener('change', () => { spec.q = qsel.value; spec.label = null; labelInput.value = ''; commit(); qsel.blur(); });
    sheetBody.appendChild(rowOf('Quality', qsel));

    // permanent functions: any of the chord buttons' functions, stuck to this chord (one inversion at a time)
    const modChips = document.createElement('div');
    modChips.className = 'chips';
    const paintMods = () => {
      modChips.innerHTML = '';
      C.MOD_FUNCS.forEach(f => {
        const on = spec.mods.indexOf(f.id) !== -1;
        const slot = C.SLOT_KEYS.find(Mk => C.slotFunc(Mk) === f);
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'chip mod-chip' + (on ? ' active' : '');
        c.innerHTML = '<span>' + C.modLabelHTML(f) + '</span><small>' + (slot ? slot : '') + '</small>';
        c.title = f.does;
        c.addEventListener('click', () => {
          let set = spec.mods.filter(id => id !== f.id);
          if (!on) { if (f.inv) set = set.filter(id => !C.MOD_BY_ID[id].inv); set.push(f.id); }
          spec.mods = C.MOD_FUNCS.map(x => x.id).filter(id => set.indexOf(id) !== -1);
          paintMods();
          commit();
        });
        modChips.appendChild(c);
      });
    };
    paintMods();
    const modWrap = document.createElement('div');
    modWrap.className = 'mod-wrap';
    const modNote = document.createElement('p');
    modNote.className = 'card-desc';
    modNote.textContent = 'Stuck to this chord: a 7th, a sus, an inversion (6, 6/4; 6/5, 4/3 and 4/2 make it a 7th chord). The Z X C V B buttons do the same while held.';
    modWrap.append(modChips, modNote);
    sheetBody.appendChild(rowOf('Modify', modWrap));

    // label
    const labelInput = document.createElement('input');
    labelInput.className = 'text-field';
    labelInput.type = 'text';
    labelInput.maxLength = 12;
    labelInput.placeholder = 'Automatic — ' + C.describe({ root: spec.root, q: spec.q, mods: [] }).roman;
    labelInput.value = spec.label || '';
    labelInput.addEventListener('input', () => { spec.label = labelInput.value.trim() || null; commit(); });
    labelInput.addEventListener('keydown', ev => ev.stopPropagation());
    sheetBody.appendChild(rowOf('Name', labelInput));

    // foot
    const reset = document.createElement('button');
    reset.className = 'btn';
    reset.textContent = 'Back to the scale’s chord';
    reset.title = 'Put the scale’s own chord back on this key';
    const syncReset = () => { const cur = C.entry(place); reset.disabled = !(cur && cur.custom); };
    reset.addEventListener('click', () => {
      C.setBoard(place, null);
      const fresh = C.entry(place);
      spec.root = fresh.spec.root; spec.q = fresh.spec.q; spec.mods = []; spec.label = null;
      qsel.value = spec.q; labelInput.value = '';
      paintChips(); paintMods(); paintPreview(); syncReset();
    });
    syncReset();
    const done = document.createElement('button');
    done.className = 'btn btn-primary';
    done.textContent = 'Done';
    done.addEventListener('click', () => ui.closeSheet('chord-sheet'));
    sheetFoot.append(reset, done);
    ui.openSheet('chord-sheet');
  }

  /* ==================================================================
     Z X C V B — what each button does (Digital Accordion's Chord buttons)
     ================================================================== */
  const modsBody = document.getElementById('mods-body');
  let modsSlot = 'Z';
  function openModsSheet(Mk) {
    if (!modsBody) return;
    if (Mk) modsSlot = Mk;
    modsBody.innerHTML = '';
    const hint = document.createElement('p');
    hint.className = 'sheet-sub';
    hint.textContent = 'Five buttons, on Z X C V B, change any chord while you hold them. Pick a button, then what it does. Leave one empty to hide it.';
    modsBody.appendChild(hint);
    const slots = document.createElement('div');
    slots.className = 'slot-tabs';
    C.SLOT_KEYS.forEach(K => {
      const f = C.slotFunc(K);
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'slot-tab' + (K === modsSlot ? ' current' : '') + (f ? '' : ' empty');
      t.innerHTML = '<span class="slot-key">' + K + '</span><span class="slot-name">' + C.modLabelHTML(f) + '</span>';
      t.addEventListener('click', () => openModsSheet(K));
      slots.appendChild(t);
    });
    modsBody.appendChild(slots);
    const cur = C.slotFunc(modsSlot);
    const group = (title, list) => {
      const h = document.createElement('div');
      h.className = 'lesson-sub';
      h.textContent = title;
      modsBody.appendChild(h);
      const chips = document.createElement('div');
      chips.className = 'chips';
      list.forEach(f => {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'chip mod-chip func-chip' + (cur === f ? ' active' : '');
        c.innerHTML = '<span>' + C.modLabelHTML(f) + '</span>';
        c.title = f ? f.does : 'No button';
        c.addEventListener('click', () => { C.setSlot(modsSlot, f ? f.id : null); openModsSheet(); });
        chips.appendChild(c);
      });
      modsBody.appendChild(chips);
    };
    group('Change the chord', C.MOD_FUNCS.filter(f => f.engine));
    group('Invert it — 6/5, 4/3 and 4/2 make it a 7th chord', C.MOD_FUNCS.filter(f => f.inv));
    group('Nothing', [null]);
    const does = document.createElement('p');
    does.className = 'card-desc';
    does.textContent = modsSlot + ': ' + (cur ? cur.does + '.' : 'empty — no button.');
    modsBody.appendChild(does);
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'btn';
    reset.textContent = 'Back to sus2 · add9 · sus4 · ♭7 · maj7';
    reset.addEventListener('click', () => { C.resetSlots(); openModsSheet(); });
    modsBody.appendChild(reset);
    if (!document.getElementById('mods-sheet').classList.contains('show')) ui.openSheet('mods-sheet');
  }

  /* ---------------- events ---------------- */
  ['chords:changed', 'key:changed', 'names:changed', 'layout:changed', 'mode:changed', 'policy:changed'].forEach(evt => SW.bus.on(evt, render));
  SW.bus.on('mods:changed', relabel);
  SW.bus.on('chord:played', renderCorner);
  SW.bus.on('score:loaded', renderCorner);
  SW.bus.on('view:changed', fitLabels);
  if (window.ResizeObserver) new ResizeObserver(fitLabels).observe(el);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLabels);

  render();
  SW.chordStrip = { render, trigger, openEditor, openModsSheet, renderCorner };
})();

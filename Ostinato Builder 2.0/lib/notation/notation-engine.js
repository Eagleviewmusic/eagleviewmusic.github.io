/* =====================================================================
   RHYTHM NOTATION ENGINE

   Draws rhythmic notation as SVG, computed from a pattern rather than
   picked from a set of fixed pictures. Because every notehead is placed
   at an x you supply, the notation can be lined up exactly with whatever
   sits above and below it - tappable dots, lyrics, a timeline - and any
   duration can be written, including ones you have no picture for.

   No dependencies. Drop it in with a glyph file:

       <script src="glyphs-leland.js"></script>
       <script src="notation-engine.js"></script>
       <script>
         RhythmNotation.useGlyphs(GLYPHS_LELAND);

         const map = RhythmNotation.buildMap({
           beats: [{ slots: 2, flags: [true, false] },
                   { slots: 4, flags: [false, false, true, true] }]
         });

         el.innerHTML = RhythmNotation.engrave(Object.assign({}, map, {
           slotCentres: [20, 60, 100, 120, 140, 160],
           width: 180,
           height: 84
         }));
       </script>

   or in Node:  const RN = require('./notation-engine.js');

   ---------------------------------------------------------------------
   THE MODEL

   Time is counted in TICKS, 24 to a quarter note. That number is chosen
   so every division this engine can draw lands on a whole tick:

       quarter 24 · eighth 12 · sixteenth 6 · thirty-second 3
       triplet eighth 8 · sextuplet sixteenth 4
       dotted quarter 36 · compound duplet 18 · quadruplet 9
       quarter-note triplet 16 · half-note triplet 32

   Each subdivision slot carries one of three ROLES:

       'note'  this slot starts a note
       'hold'  this slot continues the note before it
       'rest'  this slot is silent

   Do NOT hand the engine raw booleans if your app already decides
   elsewhere whether an inactive slot is a held note or a rest - derive
   the roles from that decision instead, so the notation can never
   disagree with the rest of your UI. rolesFromFlags() implements the
   usual reading if you have no such logic yet.

   A SLOT MAP is what the engraver actually works from:

       roles         'note' | 'hold' | 'rest', one per slot
       slotTicks     how long each slot lasts, in ticks
       slotBeat      which beat each slot belongs to, so beams break on
                     the beat rather than running through it
       slotSubGroup  optional finer grouping, so six notes to a beat can
                     read as three pairs
       tuplets       slot ranges that are tuplets, each carrying the
                     ratio between what is played and what is written

   Carrying the ticks PER SLOT rather than assuming one subdivision is
   what lets a single span mix divisions freely - a half note, then a
   beat of sixteenths - and is what tuplets are built on. buildMap()
   below assembles all of this from plain numbers.

   Anything that cannot be written as one notehead is tied automatically,
   and a note running out of a tuplet into plain beats is split and tied
   at the boundary, so the engine never runs out of shapes.
   ===================================================================== */

(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RhythmNotation = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* One staff space is 360 outline units. This is a property of the glyph
     files, not a preference - see extract-glyphs.py. Bravura's black
     notehead measures exactly 360 tall, which is the SMuFL definition of
     one staff space. */
  var FONT_UNITS = 360;

  /* Ticks in a quarter note. See the note at the top for why 24. */
  var TICKS_PER_QUARTER = 24;

  /* A beat is a quarter in simple time, a dotted quarter in compound. */
  var SIMPLE_BEAT = 24;
  var COMPOUND_BEAT = 36;

  var GLYPHS = null;

  /* ------------------------------------------------------------------
     House style. Everything is in staff spaces, so the notation keeps
     its proportions at any size. Change these to match existing artwork
     rather than editing the drawing code.

     ssOfBox    one staff space, as a fraction of the note box's height.
                Bigger = chunkier notes. 0.21 is textbook engraving,
                0.285 matches bold artwork drawn for young readers.
     noteYSS    how far the notehead's centre sits above the box floor.
     stemSS     stem length. Textbook is 3.5; short stems with large
                noteheads read as a bolder, more childlike style.
     ------------------------------------------------------------------ */
  var STYLE = {
    ssOfBox:   0.285,
    noteYSS:   0.70,
    stemSS:    2.62,
    beamSS:    0.72,
    beamGapSS: 0.22,
    stemWSS:   0.163,
    tieSS:     0.52,
    dotGapSS:  0.42,
    tupletNumSS: 0.42     // tuplet numeral size, relative to a notehead
  };

  /* Room a note needs before the next one, in staff spaces. A flagged
     note needs far more, because the flag curls out to the right into
     the space where the next notehead wants to be. Ignore this and an
     eighth followed by a quarter will collide. */
  var ROOM_PLAIN   = 1.45;
  var ROOM_FLAGGED = 3.05;

  /* Rests have no stem, so they need placing by hand. These are the
     height of each rest's bounding-box centre above the note line, in
     staff spaces. */
  var REST_CENTRE = {
    restWhole: -1.30, restHalf: -0.90, restQuarter: -1.00,
    rest8th: -0.90, rest16th: -1.00, rest32nd: -1.00
  };

  /* ---- what can be written with a single notehead, in WRITTEN ticks ----
     Inside a tuplet a note is written as the value it stands in for, so a
     triplet eighth - eight ticks long - is drawn as an eighth (twelve)
     and bracketed. */
  var NOTE_VALUES = [
    { ticks: 96, head: 'whole', stem: false, beams: 0, dots: 0, name: 'whole' },
    { ticks: 72, head: 'half',  stem: true,  beams: 0, dots: 1, name: 'dotted half' },
    { ticks: 48, head: 'half',  stem: true,  beams: 0, dots: 0, name: 'half' },
    { ticks: 36, head: 'black', stem: true,  beams: 0, dots: 1, name: 'dotted quarter' },
    { ticks: 24, head: 'black', stem: true,  beams: 0, dots: 0, name: 'quarter' },
    { ticks: 18, head: 'black', stem: true,  beams: 1, dots: 1, name: 'dotted eighth' },
    { ticks: 12, head: 'black', stem: true,  beams: 1, dots: 0, name: 'eighth' },
    { ticks:  9, head: 'black', stem: true,  beams: 2, dots: 1, name: 'dotted sixteenth' },
    { ticks:  6, head: 'black', stem: true,  beams: 2, dots: 0, name: 'sixteenth' },
    { ticks:  3, head: 'black', stem: true,  beams: 3, dots: 0, name: 'thirty-second' }
  ];
  var REST_VALUES = [
    { ticks: 96, glyph: 'restWhole',   dots: 0, name: 'whole rest' },
    { ticks: 72, glyph: 'restHalf',    dots: 1, name: 'dotted half rest' },
    { ticks: 48, glyph: 'restHalf',    dots: 0, name: 'half rest' },
    { ticks: 36, glyph: 'restQuarter', dots: 1, name: 'dotted quarter rest' },
    { ticks: 24, glyph: 'restQuarter', dots: 0, name: 'quarter rest' },
    { ticks: 18, glyph: 'rest8th',     dots: 1, name: 'dotted eighth rest' },
    { ticks: 12, glyph: 'rest8th',     dots: 0, name: 'eighth rest' },
    { ticks:  9, glyph: 'rest16th',    dots: 1, name: 'dotted sixteenth rest' },
    { ticks:  6, glyph: 'rest16th',    dots: 0, name: 'sixteenth rest' },
    { ticks:  3, glyph: 'rest32nd',    dots: 0, name: 'thirty-second rest' }
  ];

  var TUPLET_GAP_SS = 0.22;        // clearance between the number and the beam

  function tupletNumHalf(SS) {
    return (GLYPHS.timeSig3.h * (SS / FONT_UNITS) * STYLE.tupletNumSS) / 2;
  }

  /* How much taller a note box has to be for a tuplet's number to sit above
     the notes without squashing them. Pass the height the notes are sized
     from; add the result to the height you actually draw at, and the extra
     lands above the notes where the number goes. Zero when nothing needs it. */
  function notationHeadroom(sizeH) {
    if (!GLYPHS) return 0;
    var SS = staffSpace(sizeH);
    var need = 2 * tupletNumHalf(SS) + SS * TUPLET_GAP_SS + 1;
    var stemTopAt = sizeH - SS * STYLE.noteYSS - STYLE.stemSS * SS;
    return Math.max(0, Math.ceil(need - stemTopAt));
  }

  function useGlyphs(table) { GLYPHS = table; }
  function setStyle(patch) { for (var k in patch) STYLE[k] = patch[k]; }
  function staffSpace(boxH) { return (boxH || 84) * STYLE.ssOfBox; }

  /* The usual reading of on/off slots: an active slot starts a note, the
     inactive ones after it hold that note, and inactive slots before any
     note are silence. */
  function rolesFromFlags(flags) {
    var roles = [], started = false, i;
    for (i = 0; i < flags.length; i++) {
      if (flags[i]) { roles.push('note'); started = true; }
      else roles.push(started ? 'hold' : 'rest');
    }
    return roles;
  }

  /* Does this many slots in one beat mean a tuplet, and if so, how many
     notes is it standing in for? Three eighths in the time of two, four
     sixteenths in the time of six, and so on. */
  function beatSlotTuplet(slots, beatTicks) {
    /* The number names the grouping the beat is put into, not how many
       notes are in it: a beat divided in three reads 3 whether that is
       three eighths or six sixteenths, and a compound beat borrowed into
       two reads 2 whether that is two eighths or four sixteenths. The
       ratio used to work out what to draw is unaffected. */
    if (beatTicks === COMPOUND_BEAT) {
      if (slots === 2) return { count: 2, inSpaceOf: 3, show: 2 };
      if (slots === 4) return { count: 4, inSpaceOf: 6, show: 2 };
      return null;
    }
    if (slots === 3) return { count: 3, inSpaceOf: 2, show: 3 };
    if (slots === 6) return { count: 6, inSpaceOf: 4, show: 3 };
    return null;
  }

  /**
   * Assemble a slot map from plain numbers. Two shapes:
   *
   *   buildMap({ beats: [{slots, flags}, ...], compound: false })
   *       one or more ordinary beats read together. Each beat may be
   *       divided differently, which is how a run carries a half note
   *       and then a beat of sixteenths.
   *
   *   buildMap({ tuplet: { beats: 2, slots: 3, flags: [...] } })
   *       a tuplet spread across several beats - three notes in the time
   *       of two, say - whose notes fall between the beat lines and so
   *       belong to the run rather than to any one beat.
   *
   * Pass `roles` instead of `flags` if your app already knows which
   * inactive slots hold and which are silent.
   */
  function buildMap(spec) {
    var beatTicks = spec.compound ? COMPOUND_BEAT : SIMPLE_BEAT;
    if (spec.beatTicks) beatTicks = spec.beatTicks;

    var roles = [], slotTicks = [], slotBeat = [], slotSubGroup = [], tuplets = [];
    var i, b, t;

    if (spec.tuplet) {
      var tp = spec.tuplet;
      t = (tp.beats * beatTicks) / tp.slots;
      var tRoles = tp.roles || rolesFromFlags(tp.flags || []);
      for (i = 0; i < tp.slots; i++) {
        roles.push(tRoles[i] || 'rest');
        slotTicks.push(t);
        var ofBeat = Math.floor((i * t) / beatTicks);
        slotBeat.push(ofBeat);
        slotSubGroup.push(ofBeat);
      }
      /* Spread across beats, a tuplet is three in the time of two at its
         top level however finely it is then divided, so it reads 3. */
      tuplets.push({ from: 0, to: tp.slots - 1, count: 3, inSpaceOf: 2, show: 3 });
      return { roles: roles, slotTicks: slotTicks, slotBeat: slotBeat,
               slotSubGroup: slotSubGroup, tuplets: tuplets, beats: tp.beats };
    }

    var beats = spec.beats || [];
    var idx = 0;
    for (b = 0; b < beats.length; b++) {
      var beat = beats[b];
      var slots = beat.slots;
      t = beatTicks / slots;
      var tup = beatSlotTuplet(slots, beatTicks);
      if (tup) tuplets.push({ from: idx, to: idx + slots - 1,
                              count: tup.count, inSpaceOf: tup.inSpaceOf, show: tup.show });
      var bRoles = beat.roles || rolesFromFlags(beat.flags || []);
      for (i = 0; i < slots; i++) {
        roles.push(bRoles[i] || 'rest');
        slotTicks.push(t);
        slotBeat.push(b);
        // six slots to a beat are read in twos
        slotSubGroup.push(b * 100 + (slots === 6 ? Math.floor(i / 2) : 0));
        idx++;
      }
    }
    /* When beats are read together, holds carry across the beat line, so
       the roles are re-derived over the whole span unless given. */
    if (beats.length > 1 && !beats.some(function (x) { return x.roles; })) {
      var flat = [];
      for (b = 0; b < beats.length; b++)
        for (i = 0; i < beats[b].slots; i++) flat.push(!!(beats[b].flags || [])[i]);
      roles = rolesFromFlags(flat);
    }
    return { roles: roles, slotTicks: slotTicks, slotBeat: slotBeat,
             slotSubGroup: slotSubGroup, tuplets: tuplets, beats: beats.length };
  }

  /* ---- duration maths ---- */
  function splitDuration(ticks, table) {
    var out = [], left = ticks, i, v;
    while (left > 0.0001) {
      v = null;
      for (i = 0; i < table.length; i++) {
        if (table[i].ticks <= left + 0.0001) { v = table[i]; break; }
      }
      if (!v) break;
      out.push(v);
      left -= v.ticks;
    }
    return out;
  }

  /* Where each slot starts, and how long the whole span is. */
  function slotStarts(slotTicks) {
    var starts = [], t = 0, i;
    for (i = 0; i < slotTicks.length; i++) { starts.push(t); t += slotTicks[i]; }
    return { starts: starts, total: t };
  }

  /* A stretch marked as a tuplet only really is one when more than one
     note falls inside it. Three slots holding a single sustained note
     simply last as long as they last - that is a plain note, not a
     triplet of anything - so the ratio and the bracket both drop away. */
  function tupletIsSounding(map, tp) {
    var onsets = 0, i;
    for (i = tp.from; i <= tp.to; i++) if (map.roles[i] === 'note') onsets++;
    if (onsets >= 2) return true;
    if (onsets === 0) return false;                  // silence across the span
    return map.roles[tp.from] !== 'note';
  }

  function activeTuplets(map) {
    return (map.tuplets || []).filter(function (tp) { return tupletIsSounding(map, tp); });
  }

  /* Split the span into stretches written at a single ratio, so a note
     running out of a tuplet and into plain beats is tied at the boundary
     instead of being written as something unplayable. */
  function writtenRegions(map, starts, total) {
    var regions = [], cursor = 0;
    var tups = activeTuplets(map).slice().sort(function (a, b) { return a.from - b.from; });
    for (var i = 0; i < tups.length; i++) {
      var tp = tups[i];
      var from = starts[tp.from];
      var to = starts[tp.to] + map.slotTicks[tp.to];
      if (from > cursor) regions.push({ from: cursor, to: from, ratio: 1, tuplet: null });
      regions.push({ from: from, to: to, ratio: tp.count / tp.inSpaceOf, tuplet: tp });
      cursor = to;
    }
    if (cursor < total) regions.push({ from: cursor, to: total, ratio: 1, tuplet: null });
    if (!regions.length) regions.push({ from: 0, to: total, ratio: 1, tuplet: null });
    return regions;
  }

  /* Decide what will be drawn without drawing it. Useful on its own for
     tests, for debugging, and for the layout pass that has to ask how
     wide a beat needs to be before anything is rendered. */
  function plan(map) {
    var roles = map.roles;
    var n = roles.length;
    if (!n) return [];
    var sp = slotStarts(map.slotTicks);
    var starts = sp.starts, total = sp.total;
    var regions = writtenRegions(map, starts, total);

    function nearestSlot(tick) {
      var best = 0, bestD = Infinity, i, d;
      for (i = 0; i < n; i++) {
        d = Math.abs(starts[i] - tick);
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    }

    /* a note runs until the next note starts; silence runs until then too */
    var events = [], i = 0, j;
    while (i < n) {
      if (roles[i] === 'note') {
        j = i + 1;
        while (j < n && roles[j] === 'hold') j++;
        events.push({ type: 'note', from: starts[i], to: j < n ? starts[j] : total });
        i = j;
      } else {
        j = i + 1;
        while (j < n && roles[j] !== 'note') j++;
        events.push({ type: 'rest', from: starts[i], to: j < n ? starts[j] : total });
        i = j;
      }
    }

    var items = [];
    for (var e = 0; e < events.length; e++) {
      var ev = events[e];
      var table = ev.type === 'note' ? NOTE_VALUES : REST_VALUES;
      var pieces = [];
      for (var r = 0; r < regions.length; r++) {
        var rg = regions[r];
        var from = Math.max(ev.from, rg.from);
        var to = Math.min(ev.to, rg.to);
        if (to - from < 0.0001) continue;
        var at = from;
        var vals = splitDuration((to - from) * rg.ratio, table);
        for (var v = 0; v < vals.length; v++) {
          pieces.push({ value: vals[v], tick: at });
          at += vals[v].ticks / rg.ratio;
        }
      }
      for (var p = 0; p < pieces.length; p++) {
        var slot = nearestSlot(pieces[p].tick);
        items.push({
          kind: ev.type,
          value: pieces[p].value,
          slot: slot,
          tick: pieces[p].tick,
          tiedTo: ev.type === 'note' && p < pieces.length - 1,
          beat: map.slotBeat ? map.slotBeat[slot] : 0
        });
      }
    }

    /* beam runs of short notes that share a beat */
    var run = [];
    function closeRun() {
      if (run.length > 1) for (var k = 0; k < run.length; k++) run[k].beamed = true;
      run = [];
    }
    for (var m = 0; m < items.length; m++) {
      var it = items[m];
      if (it.kind === 'note' && it.value.beams > 0) {
        if (run.length && run[0].beat === it.beat) run.push(it);
        else { closeRun(); run = [it]; }
      } else closeRun();
    }
    closeRun();
    return items;
  }

  /* The narrowest slot width, in px, at which this span engraves cleanly.
     Call this BEFORE laying out, and size your grid columns to at least
     this - that is what lets sixteenths spread as far as they need to
     instead of colliding. */
  function minSlotWidth(map, boxH) {
    var items = plan(map);
    var worst = ROOM_PLAIN, i, it, next, gap, flagged;
    for (i = 0; i < items.length; i++) {
      it = items[i]; next = items[i + 1];
      if (!next) continue;
      gap = next.slot - it.slot;
      if (gap <= 0) continue;
      flagged = it.kind === 'note' && it.value.beams > 0 && !it.beamed;
      worst = Math.max(worst, (flagged ? ROOM_FLAGGED : ROOM_PLAIN) / gap);
    }
    return Math.ceil(worst * staffSpace(boxH));
  }

  /* ---- drawing ---- */
  function nz(n, p) { return Number(Number(n).toFixed(p === undefined ? 2 : p)); }

  function glyphNode(name, x, y, k, cls, vScale) {
    var g = GLYPHS[name];
    if (!g) return '';
    var sy = vScale === undefined ? k : k * vScale;
    return '<path class="' + cls + '" transform="translate(' + nz(x) + ' ' + nz(y) + ') '
         + 'scale(' + nz(k, 5) + ' ' + nz(sy, 5) + ') '
         + 'translate(' + nz(-g.x0) + ' ' + nz(-g.y0) + ')" d="' + g.d + '"/>';
  }

  function beamNode(x0, x1, y, t) {
    return '<rect class="beam" x="' + nz(x0) + '" y="' + nz(y)
         + '" width="' + nz(x1 - x0) + '" height="' + nz(t) + '"/>';
  }

  /* thin at the tips, thicker in the middle, arching below the notes */
  function tieNode(a, b, y, SS) {
    var x0 = a.x + a.headW * 0.30, x1 = b.x - b.headW * 0.30;
    if (x1 - x0 < SS * 0.5) return '';
    var mid = (x0 + x1) / 2;
    var depth = Math.max(SS * 0.34, Math.min(SS * 0.62, (x1 - x0) * 0.13));
    var thick = SS * 0.16;
    return '<path class="tie" d="M ' + nz(x0) + ' ' + nz(y)
         + ' Q ' + nz(mid) + ' ' + nz(y + depth) + ' ' + nz(x1) + ' ' + nz(y)
         + ' Q ' + nz(mid) + ' ' + nz(y + depth - thick) + ' ' + nz(x0) + ' ' + nz(y) + ' Z"/>';
  }

  /* bracket with the number sitting in a gap along its length */
  function tupletNode(x0, x1, bracketY, SS, k, show, withBracket) {
    var g = GLYPHS['timeSig' + (show || 3)] || GLYPHS.timeSig3;
    var s = k * STYLE.tupletNumSS, w = g.w * s;
    var y = Math.max((g.h * s) / 2 + 1, bracketY);
    var mid = (x0 + x1) / 2, lw = Math.max(1.3, SS * 0.085);
    var num = glyphNode('timeSig' + (show || 3), mid - w / 2, y - (g.h * s) / 2, s, 'tuplet');
    if (!withBracket) return num;
    return '<path class="bracket" fill="none" stroke="#000" stroke-width="' + nz(lw)
         + '" d="M ' + nz(x0) + ' ' + nz(y + SS * 0.32) + ' L ' + nz(x0) + ' ' + nz(y)
         + ' L ' + nz(mid - w * 0.95) + ' ' + nz(y)
         + ' M ' + nz(mid + w * 0.95) + ' ' + nz(y) + ' L ' + nz(x1) + ' ' + nz(y)
         + ' L ' + nz(x1) + ' ' + nz(y + SS * 0.32) + '"/>' + num;
  }

  /**
   * Engrave one span - a beat, a run of beats, or a tuplet - as one SVG.
   * Takes a slot map plus:
   *
   *   slotCentres   x centre of each slot, in px, within this SVG.
   *                 Measure these off your real layout - do not compute
   *                 them from CSS you hope matches.
   *   width,height  the drawing box, in px
   *   className     extra class on the <svg>
   */
  function engrave(opts) {
    if (!GLYPHS) throw new Error('RhythmNotation: call useGlyphs(...) first');

    var boxH = opts.height || 84;
    var sizeH = opts.sizeHeight || boxH;   // note size, independent of headroom
    var cx = opts.slotCentres;
    var slotW = cx.length > 1 ? cx[1] - cx[0] : opts.width;

    var SS = staffSpace(sizeH);
    var k = SS / FONT_UNITS;
    var noteY = boxH - SS * STYLE.noteYSS;
    var stemW = Math.max(1.8, SS * STYLE.stemWSS);

    /* The notes keep their full length. It is the box that grows to hold a
       tuplet's number - see notationHeadroom - and because everything is
       measured up from the floor, the extra height lands above the notes
       exactly where the number goes. */
    var live = activeTuplets(opts);
    var stemLen = STYLE.stemSS * SS;
    if (noteY - stemLen < 2) stemLen = noteY - 2;
    var stemTop = noteY - stemLen;
    var beamT = STYLE.beamSS * SS;
    var beamGap = STYLE.beamGapSS * SS;
    var dotGap = SS * STYLE.dotGapSS;

    var parts = [], drawn = [];
    var items = plan(opts);

    function dotAt(x, y) {
      var g = GLYPHS.augmentationDot;
      return glyphNode('augmentationDot', x, y - (g.h * k) / 2, k, 'dot');
    }

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var x = cx[Math.min(Math.round(it.slot), cx.length - 1)];
      var d;

      if (it.kind === 'rest') {
        var rg = GLYPHS[it.value.glyph];
        var cyr = noteY + (REST_CENTRE[it.value.glyph] || -1) * SS;
        parts.push(glyphNode(it.value.glyph, x - (rg.w * k) / 2,
                             cyr - (rg.h * k) / 2, k, 'rest'));
        for (d = 0; d < it.value.dots; d++)
          parts.push(dotAt(x + (rg.w * k) / 2 + dotGap + d * dotGap * 1.8, cyr));
        continue;
      }

      var v = it.value;
      var headName = v.head === 'whole' ? 'noteheadWhole'
                   : v.head === 'half'  ? 'noteheadHalf' : 'noteheadBlack';
      var hg = GLYPHS[headName];
      var w = hg.w * k;
      var hx = x - w / 2;                      // notehead centred on its slot
      parts.push(glyphNode(headName, hx, noteY - (hg.h * k) / 2, k, 'head'));
      it.x = x; it.headW = w;

      if (v.stem) {
        it.stemX = hx + w - stemW;             // up-stem on the right edge
        parts.push('<rect class="stem" x="' + nz(it.stemX) + '" y="' + nz(stemTop)
                 + '" width="' + nz(stemW) + '" height="' + nz(stemLen) + '"/>');
      }
      if (v.beams > 0 && !it.beamed) {
        // a note standing on its own gets a flag; squash it if the stem is short
        var fname = v.beams >= 3 ? 'flag32ndUp' : v.beams === 2 ? 'flag16thUp' : 'flag8thUp';
        var room = (noteY - SS * 0.35) - stemTop;
        var vs = Math.min(1, room / (GLYPHS[fname].h * k));
        parts.push(glyphNode(fname, it.stemX, stemTop, k, 'flag', vs));
      }
      for (d = 0; d < v.dots; d++)
        parts.push(dotAt(x + w / 2 + dotGap + d * dotGap * 1.8, noteY - SS * 0.12));

      drawn.push(it);
    }

    /* ---- beams ---- */
    var grp = [];
    function sub(it2) { return opts.slotSubGroup ? opts.slotSubGroup[it2.slot] : 0; }
    function flushBeams() {
      if (grp.length < 2) { grp = []; return; }
      parts.push(beamNode(grp[0].stemX, grp[grp.length - 1].stemX + stemW, stemTop, beamT));

      /* Second beam only over the notes that need it, and only while they
         stay in the same sub-group - which is how six notes to a beat read
         as three pairs. A lone short note gets a stub pointing back at the
         note it belongs with. */
      var need = [], j;
      for (j = 0; j < grp.length; j++) need.push(grp[j].value.beams);
      var y2 = stemTop + beamT + beamGap, a = 0, b;
      while (a < grp.length) {
        if (need[a] < 2) { a++; continue; }
        b = a;
        while (b + 1 < grp.length && need[b + 1] >= 2 && sub(grp[b + 1]) === sub(grp[a])) b++;
        if (b > a) parts.push(beamNode(grp[a].stemX, grp[b].stemX + stemW, y2, beamT));
        else {
          var stub = Math.min(slotW * 0.45, SS * 1.1);
          var sx = a > 0 ? grp[a].stemX + stemW - stub : grp[a].stemX;
          parts.push(beamNode(sx, sx + stub, y2, beamT));
        }
        a = b + 1;
      }
      grp = [];
    }
    for (var m = 0; m < drawn.length; m++) {
      if (drawn[m].beamed) {
        if (grp.length && grp[0].beat === drawn[m].beat) grp.push(drawn[m]);
        else { flushBeams(); grp = [drawn[m]]; }
      } else flushBeams();
    }
    flushBeams();

    /* ---- ties ---- */
    for (var t = 0; t < drawn.length - 1; t++)
      if (drawn[t].tiedTo)
        parts.push(tieNode(drawn[t], drawn[t + 1], noteY + SS * STYLE.tieSS, SS));

    /* ---- A number over every stretch that really is a tuplet, and a
       bracket only when the notes are not already gathered under a single
       beam, since the beam itself shows how far the group reaches. ---- */
    for (var q = 0; q < live.length; q++) {
      var tp = live[q];
      var inside = drawn.filter(function (it3) { return it3.slot >= tp.from && it3.slot <= tp.to; });
      var restsInside = items.some(function (it3) {
        return it3.kind === 'rest' && it3.slot >= tp.from && it3.slot <= tp.to;
      });
      var oneBeam = inside.length > 1 && !restsInside && inside.every(function (it3) {
        return it3.beamed && it3.beat === inside[0].beat;
      });
      var bx0 = cx[Math.min(tp.from, cx.length - 1)];
      var bx1 = cx[Math.min(tp.to, cx.length - 1)];
      parts.push(tupletNode(bx0, bx1, stemTop - (tupletNumHalf(SS) + SS * TUPLET_GAP_SS),
                            SS, k, tp.show, !oneBeam));
    }

    /* fill and stroke are attributes as well as CSS: html2canvas and other
       exporters serialise this node without the page's stylesheet, and the
       notation has to survive that. */
    return '<svg class="rhythm-svg' + (opts.className ? ' ' + opts.className : '')
         + '" xmlns="http://www.w3.org/2000/svg" '
         + 'viewBox="0 0 ' + nz(opts.width) + ' ' + nz(boxH) + '" '
         + 'width="' + nz(opts.width) + '" height="' + nz(boxH) + '" '
         + 'fill="#000" stroke="none" aria-hidden="true" focusable="false">'
         + parts.join('') + '</svg>';
  }

  return {
    useGlyphs: useGlyphs,
    setStyle: setStyle,
    buildMap: buildMap,
    engrave: engrave,
    plan: plan,
    minSlotWidth: minSlotWidth,
    notationHeadroom: notationHeadroom,
    rolesFromFlags: rolesFromFlags,
    beatSlotTuplet: beatSlotTuplet,
    staffSpace: staffSpace,
    TICKS_PER_QUARTER: TICKS_PER_QUARTER,
    SIMPLE_BEAT: SIMPLE_BEAT,
    COMPOUND_BEAT: COMPOUND_BEAT,
    FONT_UNITS: FONT_UNITS,
    NOTE_VALUES: NOTE_VALUES,
    REST_VALUES: REST_VALUES
  };
}));

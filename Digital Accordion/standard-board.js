/* Digital Accordion — standard-board.js
   The standard board: where the round buttons of the Buttons view (Accordion style) go when a
   layout has no board of its own. Designed by hand in Accordion Builder ("Accordion Layout 4", 2026-09-27),
   for the space each side gets on a 1440 × 900 laptop; Digital Accordion scales it to fit any
   screen (placeBoard in script.js), rings kept.
   Made by ../Digital Accordion Packing Lab/standard-from-file.mjs from the builder's export.

   chords: by the key the chord answers to in the split preset — the tower's reading order
           F G R A S D Q W E 2 4 1 3 5 (in major: I ii iii vi IV V V/vi IV/IV V/V iv V/iii ♭VI vii°7/V V/ii);
           the same fourteen places hold every scale's own fourteen chords. The Z X C V B tabs
           lie along the bottom.
   melody: by scale step (0 = the tonic) and octave: '2,-1' is the third step an octave down.
           Any seven-note scale fits; Design A and Design B both land here.
   Copied byte-identical into ../Accordion Builder/ (its Standard presets): change it here, then copy. */
window.StandardBoard = {
  chords: { w: 653, h: 701, tabs: 'bottom', slots: {
    'f': { cx: 316, cy: 553, d: 189 },
    'g': { cx: 514, cy: 495, d: 120 },
    'r': { cx: 549, cy: 351, d: 120 },
    'a': { cx: 121, cy: 519, d: 131 },
    's': { cx: 229, cy: 393, d: 131 },
    'd': { cx: 394, cy: 390, d: 131 },
    'q': { cx: 79, cy: 352, d: 120 },
    'w': { cx: 273, cy: 255, d: 120 },
    'e': { cx: 420, cy: 246, d: 120 },
    '2': { cx: 213, cy: 118, d: 100 },
    '4': { cx: 481, cy: 118, d: 100 },
    '1': { cx: 124, cy: 221, d: 100 },
    '3': { cx: 340, cy: 120, d: 100 },
    '5': { cx: 587, cy: 214, d: 100 }
  } },
  melody: { w: 653, h: 755, tabs: 'none', slots: {
    '2,-1': { cx: 108, cy: 691, d: 111.76 },
    '3,-1': { cx: 241, cy: 604, d: 111.76 },
    '4,-1': { cx: 359, cy: 526, d: 111.76 },
    '5,-1': { cx: 476, cy: 454, d: 111.76 },
    '6,-1': { cx: 593.12, cy: 388, d: 111.76 },
    '0,0': { cx: 106, cy: 544, d: 133 },
    '1,0': { cx: 236, cy: 468, d: 111.76 },
    '2,0': { cx: 356, cy: 389, d: 111.76 },
    '3,0': { cx: 476, cy: 314, d: 111.76 },
    '4,0': { cx: 103, cy: 401, d: 111.76 },
    '5,0': { cx: 232, cy: 333, d: 111.76 },
    '6,0': { cx: 354, cy: 250, d: 111.76 },
    '0,1': { cx: 476, cy: 170, d: 133 },
    '1,1': { cx: 106, cy: 267, d: 111.76 },
    '2,1': { cx: 228, cy: 202, d: 111.76 },
    '3,1': { cx: 349, cy: 111, d: 111.76 },
    '4,1': { cx: 106, cy: 131, d: 111.76 },
    '5,1': { cx: 228, cy: 65, d: 111.76 }
  } }
};

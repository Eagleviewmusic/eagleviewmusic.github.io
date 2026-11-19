/*
 * clarinet-eb.js: the E♭ clarinet for clarinet-art.js. The same Boehm machine as the B♭ (17 keys, 6 rings) plus the left little
 * finger's A♭/E♭ lever, on a one-piece body like the Buffet R13 and Tosca E♭. It is not a scaled B♭: the tube is about 70% as long
 * but nearly as thick, and the keys under the fingers barely shrink, so they crowd together.
 *
 * The keywork is placed from a straight-on photograph of an E♭ (in its own pixel coordinates, inside the BODY transform, so the
 * drawing can be laid over the picture), and drawn with the B♭'s parts: the same rings, cups, touches, posts and polished plating.
 * Everything else is in millimetres from the tip of the mouthpiece, x = 0 on the centre line.
 */
(function (global) {
  'use strict';
  const CA = global.ClarinetArt;
  if (!CA || !CA.kit) return;
  const K = CA.kit;
  const { n, smooth, rng, defsMarkup, castShadow, rectPath, circlePath, ellipsePath, silhouette, ball, foot, post, neck, rodV, rodBreak,
    sleeve, spear, ringKey, ringArm, cup, sideCup, touch, flag, band, glint, splash, woodPart, collar, stamp, mouthpieceMarkup, labelsMarkup, STYLE } = K;

  // ----- where things are -----
  const Y = { tip: 0, mpEnd: 60, barrelTop: 60, barrelEnd: 99, bodyTop: 99, bodyEnd: 402, bellTop: 402, bellEnd: 490 };
  // Photo pixels -> millimetres: the body is 26 mm across, 187 px in the photograph, which leans a little
  const ES = 7.2, EX = 382.5, EY = 117, EK = 0.002;
  const eMM = (x, y) => [(x - EX - (y - EY) * EK) / ES, Y.bodyTop + (y - EY) / ES];
  const BODY = `matrix(${1 / ES} 0 ${-EK / ES} ${1 / ES} ${(-EX + EK * EY) / ES} ${Y.bodyTop - EY / ES})`;
  const HW = 13;   // half the body's width

  // ----- the wood -----
  const BODY_WOOD = `M${-HW} ${Y.bodyTop}L${HW} ${Y.bodyTop}L${HW + .3} ${Y.bodyEnd + 4}L${-HW - .3} ${Y.bodyEnd + 4}Z`;
  function woodMarkup() {
    let out = '';
    // Barrel: narrow at the top, a belly below the middle, pinched into its lower ring
    const barrel = smooth([
      [-12.3, 62, 1], [-12.6, 69], [-13.4, 76.5], [-14.2, 83], [-14.4, 86.6], [-14.1, 90.3], [-13.7, 94, 1],
      [13.7, 94, 1], [14.1, 90.3], [14.4, 86.6], [14.2, 83], [13.4, 76.5], [12.6, 69], [12.3, 62, 1],
    ]);
    out += woodPart('ebbarrel', barrel, -15, 15, 62, 95, 12, 1.1);
    out += woodPart('ebbody', BODY_WOOD, -14, 14, Y.bodyTop, Y.bodyEnd + 4, 24);
    // Bell: shorter and proportionally narrower than the B♭'s, the same slow flare turning out into a rolled wooden lip
    const b = Y.bellTop;
    const half = [[3.5, 13.9], [16, 14.6], [30, 15.7], [44, 17.1], [56, 18.7], [64, 20], [70, 21.8], [74, 23.9], [77, 26.2], [79.5, 28.7], [81.6, 30.7], [83.2, 31.7], [84.4, 31.9], [85.6, 31.2], [86.6, 29.6]];
    const hwAt = y => {
      for (let i = 1; i < half.length; i++) if (y <= half[i][0]) {
        const t = (y - half[i - 1][0]) / (half[i][0] - half[i - 1][0]);
        return half[i - 1][1] + (half[i][1] - half[i - 1][1]) * t;
      }
      return half[half.length - 1][1];
    };
    const leftDown = half.map(([y, w], i) => i ? [-w, b + y] : [-w, b + y, 1]);
    const rightUp = half.map(([y, w], i) => i ? [w, b + y] : [w, b + y, 1]).reverse();
    const bell = smooth(leftDown.concat([[-21, b + 87.6], [0, b + 88.3], [21, b + 87.6]]).concat(rightUp), true, .42);
    out += `<clipPath id="clip-ebbell"><path d="${bell}"/></clipPath><path d="${bell}" fill="url(#wood)"/>`;
    const r = rng(45);
    let dark = '', light = '';
    for (let i = 0; i < 440; i++) {
      const u = (r() * 2 - 1) * .98, y0 = 4 + r() * 74, len = 1.5 + r() * r() * 14, m = y0 + len / 2, y1 = Math.min(82, y0 + len);
      const seg = `M${n(u * hwAt(y0))} ${n(b + y0)}Q${n(u * hwAt(m))} ${n(b + m)} ${n(u * hwAt(y1))} ${n(b + y1)}`;
      if (r() < .8) dark += seg; else light += seg;
    }
    out += `<g clip-path="url(#clip-ebbell)"><path d="${dark}" fill="none" stroke="#030202" stroke-width=".12" opacity=".4"/><path d="${light}" fill="none" stroke="#5e4f47" stroke-width=".08" opacity=".14"/>`;
    const sat = (u1, u2, y1, y2) => {
      const up = [], dn = [];
      for (let y = y1; y <= y2; y += 6) { up.push([u1 * hwAt(y), b + y]); dn.unshift([u2 * hwAt(y), b + y]); }
      return smooth(up.concat(dn), true, .4);
    };
    out += `<path d="${sat(-.68, -.3, 6, 76)}" fill="#c9c6d0" opacity=".11" filter="url(#bellSoft)"/><path d="${sat(.34, .7, 6, 76)}" fill="#d0c9c6" opacity=".09" filter="url(#bellSoft)"/>`;
    out += `<path d="M${-hwAt(84)} ${b + 83.6}C-26 ${b + 81} -23 ${b + 79} -20 ${b + 75}C-22 ${b + 80} -23 ${b + 83} -18 ${b + 85}Z" fill="#b5a99c" opacity=".3" filter="url(#bellSoft)"/>`;
    out += `<path d="M${hwAt(84)} ${b + 83.6}C26 ${b + 81} 23 ${b + 79} 20 ${b + 75}C22 ${b + 80} 23 ${b + 83} 18 ${b + 85}Z" fill="#b5a99c" opacity=".26" filter="url(#bellSoft)"/>`;
    const lipY = 84.4, lipSag = 2.4;
    out += `<path d="M${-hwAt(lipY)} ${b + lipY}Q0 ${b + lipY + lipSag * 2} ${hwAt(lipY)} ${b + lipY}" fill="none" stroke="#050303" stroke-width=".45"/>`;
    out += `<path d="M${n(-hwAt(lipY) * .8)} ${b + lipY + 1}Q0 ${b + lipY + lipSag * 2 - .3} ${n(hwAt(lipY) * .8)} ${b + lipY + 1}" fill="none" stroke="#6d4a44" stroke-width=".2" opacity=".6"/>`;
    out += `<path d="M${n(-hwAt(86))} ${b + 86.3}Q0 ${b + 91.6} ${n(hwAt(86))} ${b + 86.3}L${n(hwAt(86))} ${b + 90}L${n(-hwAt(86))} ${b + 90}Z" fill="#8d8a92" opacity=".14" filter="url(#bellSoft)"/></g>`;
    return out;
  }

  function collarsMarkup() {
    let out = '';
    out += collar(Y.barrelTop, [[1, 12.4], [.3, 12.2, 1], [.8, 12.35], [.3, 12.2, 1], [3.2, 12.5]], 'collarB');          // top of the barrel
    out += collar(92.6, [[3.4, 14.2], [.3, 13.95, 1], [.9, 14.1], [.3, 13.95, 1], [1.5, 14.2]], 'collarC');              // bottom of the barrel
    out += collar(Y.bellTop, [[1.1, 14.25], [.3, 14.05, 1], [.8, 14.2], [.3, 14.05, 1], [3.6, 14.35]], 'collarB');        // top of the bell
    return out;
  }

  // ----- the keywork, in the photograph's pixels -----

  // The long plate down the left of the body that carries the side keys, stepped out in three points like the B♭'s, but shorter
  const SIDE_PLATE = smooth([
    [266, 380, 1], [257, 378], [253.5, 392], [253, 440], [250, 498], [245, 530], [236, 552], [224, 568], [219, 580, 1],
    [224, 594], [234, 612], [242, 640], [244, 680], [239, 699], [230, 712, 1], [234, 728], [243, 750], [247, 790], [244, 832], [237, 851], [231, 863, 1],
    [235, 878], [241, 905], [241, 940], [236, 962], [229, 975, 1], [262, 975, 1], [267, 930], [269, 700], [269, 500], [268, 420],
  ], true, .34);
  const PLATE_SEAMS = [
    [[245, 556], [232, 566], [226, 580], [231, 596], [243, 618]],
    [[241, 696], [233, 709], [235, 726], [244, 746]],
    [[244, 838], [235, 854], [236, 872], [244, 894], [249, 930], [245, 958], [238, 972]],
  ];

  function backPartsMarkup() {
    let out = '';
    // Trill key 1's cup, high on the left of the tube, seen from the side
    out += sideCup('T1', 287, 257, 14, 33, 1, 14);
    silhouette(ellipsePath(287, 257, 14, 33));
    // Its arm, flat and tapered, nearly white with a fine dark reflection, down to the knuckle where trill key 2 turns
    const stem = 'M279 288L297 288L294 548L262 548Z';
    silhouette(stem);
    const sid = K.newId();
    out += `<clipPath id="${sid}"><path d="${stem}"/></clipPath><path d="${stem}" fill="#fff" filter="url(#chrome)"/><g clip-path="url(#${sid})">
      ${band([[285, 288], [282, 380], [279, 470], [276, 550]], 3, '#17181c', .95)}
    </g><path d="${stem}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".6"/>`;
    out += rodV(272, 12, 582, 640, 'rv', 'rodV2');
    // Side key 4's lever, behind the plate and darker, running down to its spoon
    const lever2 = smooth([[236, 930, 1], [238, 985], [226, 1015], [208, 1036], [198, 1060], [196, 1092, 1], [188, 1092, 1], [189, 1056], [199, 1030], [216, 1006], [227, 975]], true, .42);
    silhouette(lever2);
    out += `<g class="key" data-k="S4"><path class="arm" d="${lever2}" fill="#fff" filter="url(#chrome)"/><path d="${lever2}" fill="#000" opacity=".22"/><path class="tint" d="${lever2}" fill="url(#noteFill)"/><path d="${lever2}" fill="none" stroke="#3f3f3c" stroke-width=".8" opacity=".7"/></g>`;
    // The long plate: flat polished metal, a hard dark reflection along each inner edge and into each bend, a bright ridge along its crown
    silhouette(SIDE_PLATE);
    const cid = K.newId();
    out += `<clipPath id="${cid}"><path d="${SIDE_PLATE}"/></clipPath><path class="plate" d="${SIDE_PLATE}" fill="#fff" filter="url(#chromeFlat)"/><g clip-path="url(#${cid})">`;
    PLATE_SEAMS.forEach(p => { out += band(p, 4.4, '#0f1115', .96); });
    out += band([[262, 400], [261, 460], [258, 520], [250, 548]], 3.6, '#0f1115', .95) + band([[258, 630], [260, 670], [256, 698]], 3.4, '#0f1115', .95) + band([[260, 760], [261, 800], [258, 836]], 3.4, '#0f1115', .95);
    out += band([[258, 900], [258, 935], [252, 965]], 3.4, '#0f1115', .95);
    out += glint([[257, 400], [256, 470], [250, 530], [234, 566]], 3) + glint([[230, 600], [240, 640], [240, 690]], 3);
    out += glint([[238, 732], [244, 780], [242, 836]], 3) + glint([[238, 880], [240, 930], [234, 962]], 3);
    out += `<rect x="258" y="540" width="10" height="440" fill="#000" opacity=".3" filter="url(#blur2)"/>`;
    out += `</g><path d="${SIDE_PLATE}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".7" stroke-linejoin="round"/>`;
    return out;
  }

  // The hinge rods down the left, each ending where the next begins, and the short thicker sleeves that carry the arms
  function rodsMarkup() {
    let out = '';
    out += rodV(259, 10, 640, 1625, 'rs', 'rodV2');
    out += rodV(271, 18, 585, 1610);
    [690, 760, 860, 1105, 1240, 1385, 1540].forEach(y => { out += rodBreak(271, 18, y); });
    [[697, 720], [786, 809], [861, 885], [1154, 1178], [1252, 1276], [1396, 1420], [1453, 1484], [1555, 1579]].forEach(([a, b]) => { out += sleeve(271, 18, a, b); });
    return out;
  }

  function postsMarkup() {
    let out = '';
    out += post(271, 541, 16, 306, 541, 9, 15);
    out += post(267, 772, 16, 304, 773, 9, 15);
    out += foot(303, 840, 9, 14);
    out += post(272, 1122, 16, 303, 1122, 9, 15);
    out += post(270, 1590, 16, 303, 1590, 10, 16);
    out += foot(292, 1302, 8, 12);
    return out;
  }

  function topKeysMarkup() {
    let out = '';
    // The knuckle where trill key 2 turns, its cup hidden behind the tube
    silhouette(rectPath(230, 546, 62, 38));
    out += `<g class="cup" data-cup="T2">
      <g class="up">${K.shadow(268, 568, 24, 22)}</g>
      <g class="down">${K.shadow(265, 566, 22, 20)}</g>
      <g class="face">
        <path d="M292 547L292 583L246 583C234 583 226 574 222 565C226 556 234 547 246 547Z" fill="url(#ball)" stroke="#6a665b" stroke-width=".9"/>
        <path d="M278 551C284 555 287 562 287 566C287 571 284 577 280 580C281 574 282 557 278 551Z" fill="#2c2e35" opacity=".8"/>
        <ellipse cx="252" cy="553" rx="12" ry="2.4" fill="#fff"/>
      </g>
    </g>`;

    // G♯ cup at the left of the A key, seen a little from the side
    out += sideCup('Gs', 316, 463, 28, 33, 1, 14);
    silhouette(ellipsePath(316, 463, 28, 33));
    // A cup
    out += cup('A', 374, 415, 34, 'cw2', -96);
    silhouette(circlePath(374, 415, 34));
    // The hinge the A key turns on, between two posts
    out += foot(352, 514, 13, 17) + foot(424, 515, 13, 17);
    out += neck(352, 424, 514, 16);
    out += `<rect x="356" y="506" width="2.4" height="16" fill="#1c1d21"/><rect x="418" y="506" width="2.4" height="16" fill="#1c1d21"/>`;
    out += ball(341, 513, 17) + ball(438, 516, 17);
    // The G cup behind the A touch: the thumb ring or the first finger's ring closes it. Its arm runs under the touch
    out += cup('P', 381, 578, 29, 'cw3', 20);
    silhouette(circlePath(381, 578, 29));
    out += spear([[262, 584], [272, 576], [362, 575], [376, 583], [362, 591], [272, 591]], 583, 270, 362, undefined, 'P');

    // The A touch: a short arm from the cup, past its screw, into a teardrop paddle
    const Aout = smooth([
      [374, 419, 1], [383, 444, 1], [383, 518], [386, 533], [399, 549], [409, 566], [411, 588], [405, 606], [393, 617], [380, 620],
      [367, 617], [355, 606], [349, 588], [351, 566], [360, 549], [370, 533], [373, 518], [365, 444, 1],
    ]);
    out += touch('A', Aout,
      band([[377, 530], [380, 560], [381, 586], [378, 606]], 6, '#23252b', .9) + band([[402, 566], [404, 590], [396, 610]], 2.6, '#17181c', .7) +
      band([[374.3, 424], [374.3, 446]], 3) +
      glint([[358, 560], [355, 580], [357, 600], [364, 612]], 2.6));
    out += `<circle cx="374.5" cy="458" r="10" fill="url(#rodH)" stroke="#6a665b" stroke-width=".9"/><circle cx="374.5" cy="458" r="7" fill="#a9a597"/><path d="M368 458L381 458" stroke="#26282d" stroke-width="1.4"/>`;

    // The G♯ key: its hinge on two posts at the right, an arm across to its cup, and the long paddle growing out of the arm's end
    silhouette(rectPath(426, 395, 24, 122));
    out += foot(421, 396, 9, 16) + foot(423, 516, 10, 16);
    out += touch('Gs', smooth([
      [452, 456, 1], [463, 456, 1], [471, 484], [487, 512], [504, 542], [517, 576], [523, 610], [521, 640], [511, 660], [498, 666], [485, 660], [473, 640], [466, 612], [463, 578], [462, 544], [459, 500],
    ]),
      band([[468, 520], [474, 556], [475, 590], [472, 622]], 7, '#23252b', .9) + band([[514, 600], [514, 632], [504, 656]], 2.6, '#17181c', .7) +
      glint([[494, 548], [506, 582], [510, 616], [505, 648]], 4, .9) +
      glint([[465, 560], [464, 600], [466, 636]], 1.6, .8));
    out += `<g class="key" data-k="Gs">
      <rect class="rv" x="426" y="397" width="24" height="120" fill="url(#rodV)"/><rect class="tint" x="426" y="397" width="24" height="120" fill="url(#noteFill)"/>
      ${spear([[304, 463], [326, 455], [360, 452], [426, 452], [454, 455], [460, 462], [454, 470], [426, 472], [360, 472], [326, 470]], 461, 312, 454, 461)}
    </g>`;
    out += ball(436, 394, 17) + ball(437, 518, 16);
    // A stop for the G♯ paddle, a small button in its edge
    out += foot(459, 612, 8, 13);
    return out;
  }

  function leftHandMarkup() {
    let out = '';
    // The E cup between the first and second fingers: the second finger's ring closes it, or the right-hand rings through the linkage
    out += cup('Ev', 415, 793, 30, 'cw2', -5);
    silhouette(circlePath(415, 793, 30));
    out += spear([[250, 797], [264, 789], [372, 789], [404, 796], [372, 805], [264, 806]], 797, 262, 396, undefined, 'Ev');
    // Rings: each arm grows out from under its ring
    out += ringArm('L1', 246, 708, 700, 716, 375.5, 705, 45.5);
    out += ringKey('L1', 375.5, 705, 45.5, 33.4, 378, 703, 23);
    out += ringArm('L2', 246, 873, 865, 881, 375, 873, 47.5);
    out += ringKey('L2', 375, 873, 47.5, 34.4, 379, 871, 24.4, 8);
    // Third finger: a plain hole in the wood, no ring
    out += `<g class="ring plain" data-k="L3">
      <circle class="hole" cx="372" cy="1007" r="25" fill="#060405"/>
      <path class="hole" d="M347.6 1011C350 1024 360 1033.6 372 1033.6C384 1033.6 394 1024 396.4 1011C393 1021 383 1028 372 1028C361 1028 351 1021 347.6 1011Z" fill="#3b2c26"/>
      <circle class="hole" cx="372" cy="1007" r="25" fill="none" stroke="#1b1412" stroke-width="1.2"/>
      <g class="finger"><circle cx="372" cy="1007" r="26" fill="url(#noteFill)"/><circle cx="372" cy="1007" r="26" fill="url(#fingerShade)"/></g>
    </g>`;

    // The E♭/B♭ key: a short lever on two posts at the right edge of the tube, its pad the small cup seen edge-on there, its touch
    // curling down and in under the second finger's ring
    out += foot(458, 806, 9, 15) + foot(458, 930, 9, 15);
    silhouette('M479 852H497V914H479Z');
    out += `<g class="cup edge" data-cup="Eb">
      <g class="up"><path d="M476 856H479V910H476Z" fill="#17181c" opacity=".8"/></g><g class="down"></g>
      <g class="face">
        <path d="M475 854C477 866 477 900 475 912L479 914L479 852Z" fill="#e4e1d6" stroke="#3f3f3c" stroke-width=".8"/>
        <path d="M479 850C488 851 494 855 496 864C498 876 498 890 496 902C494 910 488 914 479 915Z" fill="url(#rodV)" stroke="#55544e" stroke-width=".9"/>
      </g>
    </g>`;
    out += `<g class="key" data-k="Eb">${spear([[462, 876], [481, 877], [494, 883], [481, 890], [462, 891]], 883, 465, 489)}</g>`;
    const sliver = smooth([
      [463, 818, 1], [480, 818, 1], [481, 900], [478, 918], [468, 932], [452, 942], [428, 949], [402, 954], [387, 952], [380, 946], [386, 939],
      [408, 935], [436, 927], [452, 916], [460, 900],
    ]);
    out += touch('Eb', sliver,
      band([[466, 830], [468, 870], [466, 910]], 3.6, '#17181c', .9) +
      band([[410, 948], [432, 944], [452, 936]], 3.4, '#17181c', .85) +
      glint([[392, 943], [416, 938], [442, 931], [458, 918], [464, 900]], 3.4, .95));
    out += ball(472, 806, 15) + ball(472, 931, 15);

    // C♯/G♯ key for the left little finger: from its hinge a flat channel runs down, turns along the tube and widens into the touch
    out += touch('LCs', smooth([
      [292, 990, 1], [318, 990, 1], [318, 1058], [322, 1078], [336, 1090], [366, 1093], [404, 1087], [436, 1074], [458, 1058], [483, 1046], [504, 1044], [519, 1052],
      [523, 1071], [518, 1092], [500, 1106], [470, 1111], [440, 1110], [400, 1115], [360, 1121], [330, 1119], [306, 1108], [295, 1090], [292, 1060],
    ]),
      band([[305, 996], [305, 1060], [312, 1088], [332, 1104], [362, 1108]], 5, '#17181c', .9) +
      band([[372, 1108], [404, 1104], [432, 1098]], 3, '#17181c', .85) +
      band([[452, 1072], [478, 1062], [504, 1062]], 6, '#23252b', .85) +
      band([[510, 1098], [518, 1086], [520, 1072]], 2.2, '#55524a', .8) +
      glint([[296, 1000], [297, 1056], [303, 1082]], 2.2, .9));
    out += ball(303, 977, 16);
    return out;
  }

  // The side keys, in a stepped arc at the foot of the plate: two mushroom buttons, each on its own block, and two spoons with corks
  function sideKeysMarkup() {
    let out = '';
    const dome = (id, cx, cy, rx, ry, neckPath) => {
      silhouette(ellipsePath(cx, cy, rx, ry));
      return `<g class="key" data-k="${id}">
      ${neckPath ? `<path class="arm" d="${neckPath}" fill="#fff" filter="url(#chromeFlat)"/><path class="tint" d="${neckPath}" fill="url(#noteFill)"/>` : ''}
      <ellipse class="b" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" filter="url(#chrome)"/>
      <path class="rd" d="M${n(cx + rx * .7)} ${n(cy - ry * .3)}C${n(cx + rx * .78)} ${n(cy - ry * .1)} ${n(cx + rx * .78)} ${n(cy + ry * .1)} ${n(cx + rx * .7)} ${n(cy + ry * .3)}L${n(cx + rx * .62)} ${n(cy + ry * .24)}C${n(cx + rx * .68)} ${n(cy + ry * .1)} ${n(cx + rx * .68)} ${n(cy - ry * .1)} ${n(cx + rx * .62)} ${n(cy - ry * .24)}Z" fill="#2c2e35"/>
      <path class="rd" d="M${n(cx - rx * .3)} ${n(cy + ry * .88)}C${n(cx + rx * .2)} ${n(cy + ry * .96)} ${n(cx + rx * .62)} ${n(cy + ry * .72)} ${n(cx + rx * .8)} ${n(cy + ry * .48)}C${n(cx + rx * .6)} ${n(cy + ry * .62)} ${n(cx + rx * .1)} ${n(cy + ry * .8)} ${n(cx - rx * .3)} ${n(cy + ry * .88)}Z" fill="#2c2e35" opacity=".85"/>
      <path class="tint" d="${ellipsePath(cx, cy, rx, ry)}" fill="url(#noteFill)"/>
      <path d="M${n(cx + rx * .86)} ${n(cy - ry * .46)}C${n(cx + rx * .96)} ${n(cy - ry * .2)} ${n(cx + rx * .96)} ${n(cy + ry * .2)} ${n(cx + rx * .86)} ${n(cy + ry * .46)}" fill="none" stroke="#fff" stroke-width="1.4"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${n(rx - .4)}" ry="${n(ry - .4)}" fill="none" stroke="url(#edgeG)" stroke-width="1"/></g>`;
    };
    // Side keys 1 and 2 hang on short curved arms off the foot of the plate
    const arm1 = smooth([[234, 962, 1], [240, 972], [234, 984], [218, 990], [200, 990], [190, 986], [194, 978], [210, 978], [224, 972]], true, .4);
    const arm2 = smooth([[238, 990, 1], [241, 1004], [234, 1020], [220, 1034], [204, 1042], [192, 1043], [194, 1033], [208, 1028], [222, 1016], [230, 1000]], true, .4);
    out += touch('S1', arm1, band([[232, 968], [228, 980], [214, 985], [200, 984]], 2.4, '#17181c', .85)) + touch('S2', arm2, band([[236, 996], [230, 1014], [216, 1030], [200, 1038]], 2.4, '#17181c', .85));
    out += dome('S1', 176, 981, 17, 22.5) + dome('S2', 178, 1038, 17.5, 23);
    out += `<path d="M163 970C158 978 158 986 163 994" fill="none" stroke="#17181c" stroke-width="2.2" opacity=".7"/><path d="M165 1026C160 1034 160 1042 165 1050" fill="none" stroke="#17181c" stroke-width="2.2" opacity=".7"/>`;
    // Side key 3 hangs from the plate's foot on a slim neck, a thin cork along its right edge
    out += `<path d="M216 1072C223 1080 224 1098 216 1106L208 1108Z" fill="url(#cork)"/>`;
    silhouette('M216 1072C223 1080 224 1098 216 1106L208 1108Z');
    out += touch('S3', smooth([[240, 1004, 1], [247, 1010, 1], [232, 1034], [219, 1058], [214, 1068], [217, 1077], [219, 1091], [215, 1103], [205, 1108], [195, 1104], [190, 1092], [191, 1079], [198, 1067], [210, 1052], [226, 1028]]),
      band([[215, 1082], [216, 1094], [211, 1103]], 2.2, '#17181c', .9) +
      glint([[199, 1074], [194, 1084], [194, 1096]], 2.4, .95));
    // Side key 4: its lever carries on down past the blocks to a spoon with a cork along its right edge
    silhouette('M222 1118C232 1130 233 1152 224 1166L210 1170Z');
    out += `<path d="M222 1118C232 1130 233 1152 224 1166C221 1169 216 1170 210 1170C218 1162 224 1142 222 1118Z" fill="url(#cork)"/>`;
    out += touch('S4', smooth([[188, 1090, 1], [196, 1090, 1], [196, 1104], [204, 1114], [218, 1122], [226, 1136], [226, 1152], [219, 1165], [206, 1171], [195, 1167], [189, 1154], [187, 1130]]),
      band([[192, 1094], [192, 1110], [196, 1118]], 2.2, '#17181c', .9) +
      band([[221, 1138], [221, 1152], [214, 1164]], 2.2, '#17181c', .9) +
      glint([[198, 1128], [192, 1140], [192, 1152], [197, 1162]], 2.6, .95));
    return out;
  }

  function rightHandMarkup() {
    let out = '';
    // The cup above the right hand: it closes with the first or second finger, unless the B/F♯ sliver is held
    out += cup('C', 372, 1165, 33, 'cw1', 0);
    silhouette(circlePath(372, 1165, 33));
    out += spear([[246, 1166], [258, 1157], [320, 1157], [366, 1161], [320, 1175], [258, 1176]], 1166, 256, 352, 1162, 'C');
    out += K.screwPlate(320, 1188, 9, 10);
    // Right-hand rings
    out += ringArm('R1', 246, 1265, 1257, 1274, 376, 1262, 49);
    out += ringKey('R1', 376, 1262, 49, 35.4, 378, 1261, 25.4, 40);
    out += ringArm('R2', 246, 1408, 1400, 1417, 374, 1408, 49);
    out += ringKey('R2', 374, 1408, 49, 35.4, 376, 1408, 25.4, 14);
    // The right-hand sliver between the second and third fingers, growing out of its own sleeve on the rod
    out += K.screwPlate(300, 1446, 6, 8) + K.screwPlate(300, 1505, 7, 9);
    out += touch('BF', smooth([[284, 1456, 1], [298, 1458], [316, 1466], [328, 1476], [340, 1480], [354, 1478], [364, 1482], [366, 1492], [358, 1499], [342, 1499], [326, 1494], [310, 1484], [296, 1479], [284, 1479, 1]]),
      band([[316, 1482], [332, 1491], [352, 1494]], 3.4, '#17181c', .92) +
      glint([[290, 1464], [308, 1468], [324, 1478], [342, 1484], [360, 1486]], 5, .95));
    out += `<ellipse cx="358" cy="1488" rx="6" ry="5" fill="url(#cork)" opacity=".95"/>`;
    out += ringArm('R3', 246, 1560, 1552, 1569, 378, 1567, 56);
    out += ringKey('R3', 378, 1567, 56, 42.4, 380, 1566, 29.4, 50);
    return out;
  }

  // The left little finger's five keys: C♯/G♯ is above (leftHandMarkup); here the four long levers on the right of the tube,
  // each one piece from its touch down to its arm low on the body. The A♭/E♭ lever is the fourth, the E♭ clarinet's extra key
  function leftLittleMarkup() {
    let out = '';
    // Their pins first, low on the body: each lever comes down onto its own, which reaches no further than that lever.
    // E/B and F♯/C♯ reach across to the right little finger's bars, A♭/E♭ to the G♯ pad
    const pin = (id, x1, x2, y, h = 11) => {
      silhouette(rectPath(x1, y - h / 2, x2 - x1, h));
      return `<g class="key" data-k="${id}"><rect class="rh" x="${x1}" y="${y - h / 2}" width="${x2 - x1}" height="${h}" rx="${h / 2}" fill="url(#rodH)"/><rect class="tint" x="${x1}" y="${y - h / 2}" width="${x2 - x1}" height="${h}" rx="${h / 2}" fill="url(#noteFill)"/><path d="M${x1 + 4} ${y - h * .22}H${x2 - 4}" stroke="#fff" stroke-width="1.2" opacity=".7"/></g>`;
    };
    out += pin('LF', 466, 494, 1700) + pin('LE', 404, 505, 1683) + pin('LFs', 430, 534, 1724) + pin('LAb', 490, 552, 1751);
    // The hinge rod down the right edge, and the posts and feet that hold it
    out += rodV(451, 18, 1190, 1735);
    [1300, 1420, 1600].forEach(y => { out += rodBreak(451, 18, y); });
    out += foot(446, 1462, 8, 12) + foot(447, 1510, 8, 12);
    // F/C: the top touch, behind, its round head out to the right
    const LF = smooth([[478, 1700], [480, 1708], [486, 1711], [492, 1708], [494, 1700], [494, 1690, 1], [478, 1690, 1], [478, 1240], [481, 1206], [489, 1182], [502, 1166], [518, 1154], [528, 1136], [544, 1119], [565, 1111], [586, 1113], [598, 1124], [599, 1141], [591, 1156], [573, 1165], [549, 1171], [527, 1177], [511, 1191], [499, 1213], [494, 1250], [494, 1690, 1]]);
    out += touch('LF', LF,
      band([[530, 1160], [552, 1152], [576, 1146], [592, 1140]], 9, '#23252b', .9) +
      band([[498, 1220], [496, 1400], [494, 1600]], 3, '#0f1115', .9) +
      glint([[540, 1124], [562, 1116], [584, 1117], [594, 1126]], 3) +
      splash([[556, 1119], [568, 1116], [571, 1122], [558, 1125]]));
    // F♯/C♯, broad, its head at the right
    const LFs = smooth([[518, 1724], [520, 1732], [526, 1735], [532, 1732], [534, 1724], [534, 1714, 1], [518, 1714, 1], [518, 1600], [521, 1520], [526, 1460], [532, 1410], [540, 1360], [547, 1310], [550, 1275], [549, 1240], [551, 1212], [560, 1198], [574, 1194], [587, 1200], [593, 1218], [592, 1245], [584, 1272], [572, 1300], [562, 1340], [552, 1390], [542, 1440], [536, 1500], [534, 1600], [534, 1714, 1]]);
    out += touch('LFs', LFs,
      band([[580, 1212], [584, 1240], [576, 1272], [564, 1310]], 7, '#23252b', .9) +
      band([[554, 1360], [544, 1420], [534, 1500], [528, 1610]], 3, '#0f1115', .95) +
      glint([[556, 1212], [554, 1240], [556, 1270]], 3) +
      splash([[564, 1201], [574, 1200], [578, 1207], [567, 1208]]));
    // A♭/E♭ lever, the E♭ clarinet's extra key: the lowest head, in front of F♯/C♯
    const LAb = smooth([[536, 1751], [538, 1759], [544, 1762], [550, 1759], [552, 1751], [552, 1740, 1], [536, 1740, 1], [537, 1600], [539, 1520], [542, 1470], [548, 1430], [556, 1395], [560, 1366], [556, 1350], [552, 1330], [553, 1305], [559, 1287], [572, 1278], [588, 1281], [597, 1295], [598, 1318], [592, 1336], [584, 1350], [582, 1368], [576, 1400], [566, 1440], [558, 1480], [554, 1530], [552, 1600], [552, 1740, 1]]);
    out += `<path d="M560 1290C552 1330 566 1370 556 1420" fill="none" stroke="#000" stroke-width="5" opacity=".45" filter="url(#blur2)"/>`;
    out += touch('LAb', LAb,
      band([[586, 1294], [590, 1318], [584, 1340]], 6.4, '#17181c', .9) +
      band([[574, 1372], [566, 1420], [558, 1470], [554, 1540]], 3, '#0f1115', .9) +
      glint([[560, 1298], [559, 1318], [564, 1336]], 2.6) +
      splash([[574, 1286], [583, 1286], [585, 1293], [576, 1293]]));
    out += `<path d="M528 1200C532 1240 520 1280 514 1330" fill="none" stroke="#000" stroke-width="5" opacity=".5" filter="url(#blur2)"/>`;
    // E/B in front, the broadest, its head at the top left
    const LE = smooth([[489, 1683], [491, 1691], [497, 1694], [503, 1691], [505, 1683], [505, 1672, 1], [489, 1672, 1], [489, 1600], [490, 1500], [490, 1420], [489, 1330], [487, 1290], [482, 1264], [474, 1240], [471, 1210], [475, 1186], [488, 1174], [504, 1171], [519, 1178], [527, 1195], [529, 1220], [524, 1242], [515, 1264], [511, 1290], [510, 1330], [509, 1420], [507, 1500], [505, 1600], [505, 1672, 1]]);
    out += touch('LE', LE,
      band([[500, 1186], [512, 1206], [516, 1232], [508, 1260]], 9, '#23252b', .9) +
      band([[504, 1290], [502, 1360], [500, 1440], [498, 1520]], 3, '#0f1115', .95) +
      glint([[495, 1540], [495, 1600], [496, 1660], [497, 1708]], 4, .9) +
      band([[526, 1210], [524, 1236], [516, 1258]], 2.6, '#17181c', .72) +
      glint([[477, 1206], [478, 1236], [486, 1262], [492, 1300]], 3) +
      splash([[488, 1178], [498, 1176], [502, 1182], [492, 1184]]));
    out += ball(458, 1171, 19) + ball(445, 1206, 12);
    // Posts at the right of the levers
    const stub = (y, r) => {
      silhouette(circlePath(560, y, r));
      return `<rect x="540" y="${y - 6}" width="18" height="12" fill="url(#rodH)"/>${ball(560, y, r)}`;
    };
    out += stub(1462, 12) + stub(1508, 15);
    return out;
  }

  // The right little finger's four spoons, the B♭'s shapes made a little smaller and set closer: F♯ and E behind, G♯ and F in front
  function rightLittleMarkup() {
    let out = '';
    // The B♭'s spoon shapes with blunter, rounder outer ends, as on this instrument
    const RFs = smooth([[85, 824], [88, 805], [102, 789], [123, 780], [163, 775], [197, 785], [224, 796], [250, 812], [252, 860, 1], [183, 855], [127, 850], [104, 846], [91, 837]]);
    const RE = smooth([[46, 917], [50, 897], [66, 884], [88, 879], [140, 880], [177, 888], [230, 908], [230, 960, 1], [183, 958], [140, 955], [92, 949], [66, 942], [52, 932]]);
    // B♭ lower-joint pixels -> this photograph's: the spoons a little smaller, each row placed on its own
    const UP = 'translate(119 947) scale(.84 .86)', LO = 'translate(131 961) scale(.84 .86)';
    out += K.partsIn(UP, () => touch('RFs', RFs,
        flag([[166, 794], [196, 798], [230, 818], [202, 816], [178, 806]]) +
        band([[150, 828], [196, 834], [236, 844]], 2.4, '#17181c', .8) +
        glint([[96, 806], [122, 786], [163, 780], [197, 790], [224, 801]], 2)));
    out += K.partsIn(LO, () => touch('RE', RE,
        flag([[138, 892], [172, 896], [208, 914], [178, 912], [152, 902]]) +
        band([[86, 924], [124, 932], [176, 938], [220, 946]], 2.4, '#17181c', .8) +
        glint([[54, 902], [88, 884], [140, 885], [176, 893], [194, 900]], 2)));
    // Where a spoon lies across the one behind it: a tight shadow on that spoon
    const onU = K.newId(), onL = K.newId();
    out += `<g transform="${UP}"><clipPath id="${onU}"><path d="${RFs}"/></clipPath><g clip-path="url(#${onU})"><path d="${smooth([[172, 833], [187, 809], [220, 804], [253, 811], [262, 830], [250, 866], [207, 873], [187, 864], [177, 851]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/></g></g>`;
    out += `<g transform="${LO}"><clipPath id="${onL}"><path d="${RE}"/></clipPath><g clip-path="url(#${onL})"><path d="${smooth([[158, 923], [168, 903], [197, 894], [227, 896], [240, 920], [232, 962], [197, 963], [180, 956], [165, 943]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/></g></g>`;
    out += K.partsIn(UP, () => {
      return touch('RGs', smooth([
        [169, 832], [173, 813], [188, 802], [215, 798], [250, 800], [290, 810], [325, 822], [340, 835], [348, 855], [352, 880], [355, 905], [355, 950, 1], [339, 950, 1], [339, 925], [336, 905], [326, 888], [312, 878], [290, 872], [240, 868], [190, 858], [176, 848],
      ]),
        flag([[262, 812], [298, 822], [326, 842], [340, 876], [324, 854], [298, 836], [276, 824]]) +
        band([[218, 846], [262, 852], [304, 860]], 2.4, '#17181c', .8) +
        band([[336, 892], [345, 925], [347, 948]], 2.2, '#17181c', .8) +
        glint([[180, 816], [215, 803], [250, 805], [290, 815], [325, 827], [338, 840], [345, 858]], 2));
    });
    out += K.partsIn(LO, () => touch('RF', smooth([
        [155, 921], [159, 904], [172, 893], [190, 890], [215, 890], [250, 893], [290, 905], [325, 918], [340, 930], [350, 948], [355, 965], [358, 1000], [358, 1040, 1], [340, 1040, 1], [338, 1020], [334, 1000], [326, 990], [312, 977], [290, 971], [240, 968], [200, 957], [173, 948], [160, 936],
      ]),
        flag([[254, 906], [292, 918], [320, 938], [336, 968], [318, 946], [292, 930], [268, 918]]) +
        band([[254, 948], [296, 952], [322, 964], [334, 988]], 2.4, '#17181c', .8) +
        band([[346, 996], [348, 1020], [349, 1036]], 2.4, '#17181c', .8) +
        glint([[164, 908], [190, 895], [215, 895], [250, 898], [290, 910], [325, 923], [338, 935], [347, 952]], 2)));
    return out;
  }

  // Below the hands: the low pads and the long bars that carry the little fingers down to them
  function lowMarkup() {
    let out = '';
    // The low G♯ pad at the right edge, edge-on: it swings out when its key (or the A♭/E♭ lever) is pressed
    out += sideCup('RGs', 487, 1751, 7, 26, -1, 5);
    silhouette(ellipsePath(487, 1751, 7, 26));
    out += `<g class="key" data-k="RGs">${spear([[400, 1745], [482, 1745], [487, 1751], [482, 1757], [400, 1757]], 1751, 404, 480)}</g>`;
    // The F♯ key's stem from its spoon down the middle, and the F and E keys' two bars beside it
    silhouette(rectPath(362, 1800, 28, 440));
    out += `<g class="key" data-k="RFs"><rect class="rv" x="344" y="1800" width="12" height="70" fill="url(#rodV)"/><rect class="tint" x="344" y="1800" width="12" height="70" fill="url(#noteFill)"/></g>`;
    out += `<g class="key" data-k="RF"><rect class="rv" x="362" y="1806" width="12" height="244" fill="url(#rodV2)"/><rect class="tint" x="362" y="1806" width="12" height="244" fill="url(#noteFill)"/></g>`;
    out += `<rect x="374" y="1806" width="3" height="420" fill="#17181c"/>`;
    out += `<g class="key" data-k="RE"><rect class="rv" x="377" y="1806" width="13" height="420" fill="url(#rodV)"/><rect class="tint" x="377" y="1806" width="13" height="420" fill="url(#noteFill)"/></g>`;
    [1950, 2110].forEach(y => { out += rodBreak(362, 28, y); });
    out += `<rect x="340" y="1800" width="60" height="40" fill="url(#shadeDown)"/>`;
    // Posts: the hinge end and ball at the right, a short tube with its ball below
    // The right little finger's hinge tube: the G♯ and F spoons' necks come down onto it
    out += `<rect x="398" y="1758" width="22" height="192" fill="url(#rodV)"/>`;
    [1810, 1872].forEach(y => { out += rodBreak(398, 22, y); });
    silhouette(rectPath(398, 1758, 22, 192));
    out += ball(407, 1952, 17) + post(458, 1897, 17, 440, 1897, 7, 14);
    out += ball(366, 2075, 8) + ball(366, 2117, 6);
    // The three low cups, open until the little fingers close them, so they stand up from the tube
    out += sideCup('Fs', 282, 1862, 30, 55, 1, 12, true);
    silhouette(ellipsePath(282, 1862, 30, 55));
    out += spear([[262, 1872], [300, 1866], [452, 1866], [470, 1872], [452, 1880], [300, 1880]], 1872, 290, 450, undefined, 'Fs');
    out += `<circle cx="470" cy="1870" r="11" fill="url(#rodH)" stroke="#55544e" stroke-width=".8"/><circle cx="470" cy="1870" r="6" fill="#17181c"/>`;
    out += sideCup('F', 470, 2041, 33, 56, -1, 12, true);
    silhouette(ellipsePath(470, 2041, 33, 56));
    out += spear([[352, 2045], [366, 2036], [440, 2036], [464, 2043], [440, 2052], [366, 2052]], 2044, 362, 446, 2043, 'F');
    out += sideCup('E', 282, 2224, 30, 55, 1, 12, true);
    silhouette(ellipsePath(282, 2224, 30, 55));
    out += spear([[262, 2224], [300, 2218], [372, 2218], [384, 2225], [372, 2232], [300, 2232]], 2225, 290, 372, undefined, 'E');
    return out;
  }

  // ----- the back: register key and thumb ring, and the thumb rest lower down -----
  function backMarkup() {
    const top = 93, end = 265;
    let out = woodPart('ebback', `M-13 ${top}L13 ${top}L13 ${end}Q0 ${end + 4} -13 ${end}Z`, -14, 14, top, end + 4, 79);
    out += `<path d="M-13 ${end}Q0 ${end + 4} 13 ${end}" fill="none" stroke="#6d5f58" stroke-width=".5"/>`;
    out += collar(92.6, [[3.4, 14.2], [.3, 13.95, 1], [.9, 14.1], [.3, 13.95, 1], [1.5, 14.2]], 'collarC');
    // Thumb rest, under the right hand: a narrow base plate held by two screws, and a saddle curving out from it
    const r = 243;
    const base = `M-3.6 ${r}Q0 ${r - .7} 3.6 ${r}L4 ${r + 10}L-4 ${r + 10}Z`;
    const hook = smooth([[-4, r + 8.8, 1], [4, r + 8.8, 1], [6.2, r + 11.6], [7.8, r + 15.4], [7.3, r + 18], [0, r + 19.3], [-7.3, r + 18], [-7.8, r + 15.4], [-6.2, r + 11.6]], true, .42);
    out += `<path d="${hook}" fill="#000" opacity=".8" transform="translate(.6 3)" filter="url(#mpSoft)"/>`;
    out += `<path d="${base}" fill="#000" opacity=".5" transform="translate(.7 .6)" filter="url(#mpSoft)"/>`;
    out += `<path d="${base}" fill="url(#plateR)" stroke="#55544e" stroke-width=".14"/>`;
    [r + 2.8, r + 7].forEach((y, i) => { out += `<circle cx="0" cy="${y}" r="1.05" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><path d="M${i ? -.7 : -.6} ${n(y + (i ? .28 : -.35))}L${i ? .7 : .6} ${n(y - (i ? .28 : -.35))}" stroke="#16161a" stroke-width=".2"/>`; });
    out += `<path d="${hook}" fill="url(#hookFace)" stroke="#55544e" stroke-width=".14"/>`;
    out += `<path d="M-3.8 ${r + 9.2}Q0 ${r + 8.5} 3.8 ${r + 9.2}" fill="none" stroke="#fff" stroke-width=".24"/>`;
    // Register key: the pad near the top, a long arm, its hinge between two posts, and the thumb's paddle
    const pad = 113;
    out += `<g class="cup" data-cup="R">
      <g class="up"><ellipse cx=".2" cy="${pad + 1.1}" rx="6.6" ry="6.6" fill="url(#softSh)"/><circle cx=".1" cy="${pad + .5}" r="4.9" fill="#e6e2d7"/><circle cx="-.2" cy="${pad + .2}" r="4.8" fill="#141317"/></g>
      <g class="down"><ellipse cx=".1" cy="${pad + .7}" rx="6" ry="6" fill="url(#softSh)"/><circle cx="-.3" cy="${pad + .1}" r="4.9" fill="#e6e2d7"/></g>
      <g class="face"><circle cx="-.6" cy="${pad - .1}" r="4.8" fill="url(#cupFace)"/>
        <g transform="translate(-.6 ${pad - .1}) rotate(40) scale(.045)"><use href="#cw3"/></g>
        <circle cx="-.6" cy="${pad - .1}" r="4.35" fill="none" stroke="#fff" stroke-width=".2"/>
        <circle cx="-.6" cy="${pad - .1}" r="4.75" fill="none" stroke="#6a665b" stroke-width=".12"/></g></g>`;
    const hinge = 144;
    out += `<ellipse cx="7.6" cy="${hinge}" rx="2.7" ry="3" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/><circle cx="9" cy="${hinge}" r="2.3" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><ellipse cx="-3.3" cy="${hinge}" rx="1.4" ry="2.1" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/>`;
    const regKey = smooth([[-1.5, pad + 3.2, 1], [.3, pad + 3.2, 1], [.4, hinge + 3.5], [2.3, hinge + 11], [2.9, hinge + 17.5], [1.4, hinge + 22.5], [-.6, hinge + 23.6], [-2.7, hinge + 22.5], [-3.8, hinge + 17.5], [-2.9, hinge + 11], [-1.4, hinge + 3.5]]);
    out += `<g class="key" data-k="R">
      <path class="b" d="${regKey}" fill="url(#sv)" stroke="#6a665b" stroke-width=".14"/>
      <rect class="rh" x="-3.1" y="${hinge - 1.1}" width="10.4" height="2.2" rx=".6" fill="url(#rodH)"/>
      <path class="rd" d="M-.8 ${hinge + 5.5}L-.1 ${hinge + 5.5}L.8 ${hinge + 16}C.6 ${hinge + 19.5} -.3 ${hinge + 21.3} -1.1 ${hinge + 21.3}C-1.7 ${hinge + 18.6} -1.4 ${hinge + 12.5} -.8 ${hinge + 5.5}Z" fill="#2c2e35"/>
      <path class="rd" d="M-.8 ${pad + 6}L-.35 ${pad + 6}L-.35 ${hinge - 2.5}L-.8 ${hinge - 2.5}Z" fill="#2c2e35" opacity=".85"/>
      <path class="tint" d="${regKey}" fill="url(#noteFill)"/><rect class="tint" x="-3.1" y="${hinge - 1.1}" width="10.4" height="2.2" rx=".6" fill="url(#noteFill)"/>
      <ellipse cx="-2.1" cy="${hinge + 17.5}" rx=".7" ry="3" fill="#fff"/></g>`;
    // Thumb ring: its arm runs to a hinge held by two posts, inside the tube's edge
    const t = 174;
    out += `<rect x="8.3" y="${t - 9}" width="2.2" height="18" fill="url(#rodV)"/><circle cx="9.4" cy="${t - 9.8}" r="2.1" fill="url(#ball)" stroke="#6a665b" stroke-width=".1"/><circle cx="9.4" cy="${t + 9.6}" r="2.1" fill="url(#ball)" stroke="#6a665b" stroke-width=".1"/>`;
    out += `<g class="key" data-k="T"><path class="arm" d="M6.4 ${t - 1.8}L8.7 ${t - 1.5}L8.7 ${t + 1.5}L6.4 ${t + 1.8}Z" fill="url(#armTop)"/><path class="tint" d="M6.4 ${t - 1.8}L8.7 ${t - 1.5}L8.7 ${t + 1.5}L6.4 ${t + 1.8}Z" fill="url(#noteFill)"/></g>`;
    const R = 7, ri = 5.35;
    const tRing = `M${-R} ${t}A${R} ${R} 0 1 1 ${R} ${t}A${R} ${R} 0 1 1 ${-R} ${t}ZM${-ri} ${t}A${ri} ${ri} 0 1 0 ${ri} ${t}A${ri} ${ri} 0 1 0 ${-ri} ${t}Z`;
    out += `<g class="ring" data-k="T">
      <circle class="hole" cx="0" cy="${t}" r="5.5" fill="url(#ledge)"/><circle class="hole" cx=".3" cy="${t - .2}" r="3.2" fill="#040304"/>
      <g class="finger"><circle cx="0" cy="${t}" r="5.5" fill="url(#noteFill)"/><circle cx="0" cy="${t}" r="5.5" fill="url(#fingerShade)"/></g>
      <path class="rg" fill-rule="evenodd" d="${tRing}" fill="url(#ringMetal)"/>
      <path class="tint" fill-rule="evenodd" d="${tRing}" fill="url(#noteFill)"/>
      <circle cx="0" cy="${t}" r="${R}" fill="none" stroke="#6a665b" stroke-width=".14"/><circle cx="0" cy="${t}" r="${ri + .05}" fill="none" stroke="#17181b" stroke-width=".16"/>
    </g>`;
    return out;
  }

  // ----- the words beside the keys -----
  const P = (x, y) => eMM(x, y);
  const LABELS = [
    { k: 'R', f: 'L thumb', name: 'Register', at: [-3.4, 162], side: 'back' },
    { k: 'T', f: 'L thumb', name: 'Thumb ring', at: [-6.4, 174], side: 'back' },
    { k: 'rest', f: 'R thumb', name: 'Thumb rest', at: [-7.4, 256], side: 'back' },
    { k: 'A', f: 'L1', name: 'A', at: P(380, 600), side: 'R' },
    { k: 'Gs', f: 'L1', name: 'G♯', at: P(514, 625), side: 'R' },
    { k: 'L1', f: 'L1', name: 'E', at: P(418, 705), side: 'R' },
    { k: 'L2', f: 'L2', name: 'D', at: P(420, 873), side: 'R' },
    { k: 'Eb', f: 'L2', name: 'E♭ / B♭', at: P(470, 925), side: 'R' },
    { k: 'L3', f: 'L3', name: 'C', at: P(396, 1007), side: 'R' },
    { k: 'LCs', f: 'L4', name: 'C♯ / G♯', at: P(518, 1072), side: 'R' },
    { k: 'LF', f: 'L4', name: 'F / C', at: P(592, 1132), side: 'R' },
    { k: 'LE', f: 'L4', name: 'E / B', at: P(520, 1210), side: 'R' },
    { k: 'LFs', f: 'L4', name: 'F♯ / C♯', at: P(590, 1235), side: 'R' },
    { k: 'LAb', f: 'L4', name: 'A♭ / E♭', at: P(594, 1310), side: 'R' },
    { k: 'S1', f: 'R1', name: 'Side 1', at: P(167, 981), side: 'L' },
    { k: 'S2', f: 'R1', name: 'Side 2', at: P(168, 1037), side: 'L' },
    { k: 'S3', f: 'R1', name: 'Side 3', at: P(191, 1090), side: 'L' },
    { k: 'S4', f: 'R1', name: 'Side 4', at: P(189, 1145), side: 'L' },
    { k: 'R1', f: 'R1', name: 'B♭', at: P(330, 1262), side: 'L' },
    { k: 'R2', f: 'R2', name: 'A', at: P(328, 1408), side: 'L' },
    { k: 'BF', f: 'R2', name: 'B / F♯', at: P(292, 1470), side: 'L' },
    { k: 'R3', f: 'R3', name: 'G', at: P(325, 1567), side: 'L' },
    { k: 'RFs', f: 'R4', name: 'F♯ / C♯', at: P(196, 1655), side: 'L' },
    { k: 'RE', f: 'R4', name: 'E / B', at: P(170, 1750), side: 'L' },
    { k: 'RGs', f: 'R4', name: 'G♯ / D♯', at: P(415, 1690), side: 'R' },
    { k: 'RF', f: 'R4', name: 'F / C', at: P(418, 1790), side: 'R' },
  ];

  // The keywork alone, in the photograph's pixels (the scene puts it on the body; a test page lays it over the photograph)
  function keysMarkup() {
    return backPartsMarkup() + rodsMarkup() + postsMarkup() + topKeysMarkup() + leftHandMarkup() + sideKeysMarkup() +
      rightHandMarkup() + leftLittleMarkup() + lowMarkup() + rightLittleMarkup();
  }

  function sceneMarkup() {
    K.startShadows('tubeE');
    const keys = keysMarkup();
    const sil = K.takeShadows();
    // The tube a cup's own shadow may fall on, in the photograph's pixels
    const tubeClip = `<clipPath id="tubeE"><path d="M289 100L477 100L486 2340L292 2340Z"/></clipPath>`;
    return `<style>${STYLE}</style>${defsMarkup()}<defs>${tubeClip}</defs>
      <g id="cl-back" transform="translate(-76 0)">
        <text id="backCaption" x="0" y="93" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#374151">Back</text>
        ${backMarkup()}
      </g>
      <g id="cl-body">
        ${woodMarkup()}
        <g transform="scale(.86 .845)">${mouthpieceMarkup()}</g>
        ${stamp(0, 78.5, .5)}
        ${stamp(1.6, 109, .64, 'E♭')}
        ${stamp(0, 432, .7)}
        <g clip-path="url(#clip-ebbody)"><g transform="${BODY}">${castShadow(sil, 7, 9, 'shBroad', .55)}${castShadow(sil, 8, 4, 'shCrisp', .85)}</g></g>
        ${collarsMarkup()}
        <g transform="${BODY}">${keys}</g>
      </g>
      <g class="labels">${labelsMarkup(LABELS)}</g>`;
  }

  function cupStates(keys) {
    const has = k => keys.has(k);
    const anyE = has('LE') || has('RE');
    const anyF = has('LF') || has('RF');
    const anyFs = has('LFs') || has('RFs');
    const rightRings = (has('R1') || has('R2')) && !has('BF');
    return {
      opened: {
        A: has('A'), Gs: has('Gs') || has('A'), Eb: has('Eb') || has('S4'), T1: has('S1'), T2: has('S2'),
        R: has('R'), RGs: has('RGs') || has('LAb'),   // the A♭/E♭ lever opens the same pad as the right hand's G♯/D♯ key
      },
      closed: {
        P: has('T') || has('L1'),
        C: rightRings,
        Ev: has('L2') || rightRings,
        Fs: anyE || anyF || anyFs,
        F: anyE || anyF,
        E: anyE,
      },
    };
  }

  CA.register('eb', {
    scene: sceneMarkup,
    cupStates,
    photoScale: ES,
    views: { whole: [-86, -3, 172, 496], close: [-57, 89, 114, 252], closeTall: [-74, 89, 128, 252] },
    back: { whole: -76, close: -62, tallWhole: -64, tallClose: -61 },
    labelX: { R: 33, Rtall: 31, L: -32, back: -14 },
    captionY: 89,
  });
  // For checking the drawing against the photograph
  CA.eb = { keysMarkup, ES, EX, EY, EK, eMM };
})(window);

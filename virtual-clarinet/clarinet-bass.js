/*
 * clarinet-bass.js: the bass clarinet for clarinet-art.js, a school instrument to low E♭ laid out like the Yamaha YCL-221II
 * (Boehm, 7 covered finger holes). The same fingering logic as the B♭, but nearly every part the fingers touch is different:
 * covered plates instead of rings (the first finger's with a small vent for the half-hole), a curved metal neck with its own
 * register vent, one register key that opens the neck vent or the body vent, a low E♭ key, and a metal bow and bell.
 *
 * The body is drawn front-on with the keys toward the viewer, the way fingering charts show it. The neck and the bell are turned
 * into the picture, the neck curving away to the left and the bell up at the right, as catalogue photographs show a bass.
 * Everything is in millimetres, x = 0 on the body's centre line, y down from above the neck. The keywork is drawn with the B♭'s
 * parts at the B♭'s scale (8.2 units to the millimetre) inside one transform, so its plating and lighting look the same.
 */
(function (global) {
  'use strict';
  const CA = global.ClarinetArt;
  if (!CA || !CA.kit) return;
  const K = CA.kit;
  const { n, smooth, rng, defsMarkup, castShadow, circlePath, ellipsePath, silhouette, ball, foot, post, rodV, rodBreak, sleeve,
    spear, ringArm, cup, sideCup, touch, flag, band, glint, splash, woodPart, collar, stamp, labelsMarkup, STYLE } = K;

  const S = 8.2;                                    // key units to the millimetre, as the B♭'s photographs
  const Pm = pts => pts.map(p => p.length > 2 ? [p[0] * S, p[1] * S, p[2]] : [p[0] * S, p[1] * S]);
  const KEYS = `scale(${1 / S})`;

  // ----- where things are -----
  const Y = { bodyTop: 120, joint: 539, bodyEnd: 976 };
  const HW = 20;                                    // the body is 40 mm across
  const PLATE = { L1: [0, 378, 10.4], L2: [0, 418, 10.4], L3: [0, 452, 10.6], R1: [0, 596, 10.8], R2: [0, 641, 10.8], R3: [0, 676, 11.2] };

  // ----- colour helpers for the metal tubes -----
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function colorAt(list, t) {
    for (let i = 1; i < list.length; i++) if (t <= list[i][0]) {
      const [t0, c0] = list[i - 1], [t1, c1] = list[i], f = (t - t0) / (t1 - t0 || 1);
      const a = hex(c0), b = hex(c1);
      return '#' + a.map((v, k) => Math.round(v + (b[k] - v) * f).toString(16).padStart(2, '0')).join('');
    }
    return list[list.length - 1][1];
  }
  const NECK_METAL = [[0, '#3a3936'], [.06, '#8b8a84'], [.16, '#d9d8d3'], [.3, '#f7f7f5'], [.42, '#fdfdfc'], [.52, '#c9c8c2'], [.6, '#5a5953'], [.66, '#2c2c2a'], [.72, '#6f6e68'], [.82, '#d4d3cd'], [.92, '#a3a29c'], [1, '#3f3e3a']];
  const BELL_METAL = [[0, '#4a4945'], [.07, '#a9a8a2'], [.18, '#eeeeeb'], [.3, '#fdfdfc'], [.43, '#dcdbd6'], [.52, '#85847e'], [.58, '#3a3936'], [.64, '#77766f'], [.74, '#d9d8d3'], [.84, '#f4f4f1'], [.93, '#b0afa9'], [1, '#55544e']];

  // A metal tube along a centre line: its shading runs lengthwise and follows every bend, as a polished tube's reflections do
  function tube(pts, radius, stopsList, strips = 30) {
    const N = pts.length;
    const nm = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      return [-dy / L, dx / L];
    });
    const R = pts.map((p, i) => radius(i / (N - 1)));
    const edge = v => pts.map((p, i) => [p[0] + nm[i][0] * R[i] * v, p[1] + nm[i][1] * R[i] * v]);
    const strip = (a, b) => 'M' + a.concat(b.slice().reverse()).map(p => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z';
    let out = '';
    for (let k = 0; k < strips; k++) {
      const v1 = -1 + 2 * k / strips, v2 = -1 + 2 * (k + 1) / strips;
      out += `<path d="${strip(edge(Math.max(-1, v1 - .03)), edge(Math.min(1, v2 + .03)))}" fill="${colorAt(stopsList, (k + .5) / strips)}"/>`;
    }
    return { markup: out, outline: strip(edge(-1), edge(1)), edge, nm, R };
  }
  // Points along an arc (angles in degrees, y down)
  const arc = (cx, cy, r, a0, a1, steps) => Array.from({ length: steps + 1 }, (_, i) => {
    const a = (a0 + (a1 - a0) * i / steps) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const line = (x0, y0, x1, y1, steps) => Array.from({ length: steps + 1 }, (_, i) => [x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps]);

  // ----- the neck: up out of the body, over in a tight curve, and out to the mouthpiece -----
  const NECK = (() => {
    const a = line(0, 108, 0, 102, 3);
    const b = arc(-38, 102, 38, 0, -150, 28).slice(1);
    const c = line(-70.91, 83, -80.91, 100.32, 5).slice(1);
    const C = [-106.89, 85.32], R = 30, d = [];
    for (let i = 1; i <= 20; i++) { const f = (120 + 80 * i / 20) * Math.PI / 180; d.push([C[0] + R * Math.sin(f), C[1] - R * Math.cos(f)]); }
    return a.concat(b, c, d);
  })();
  const NECK_END = NECK[NECK.length - 1];
  const NECK_DIR = [Math.cos(200 * Math.PI / 180), Math.sin(200 * Math.PI / 180)];   // the way the mouthpiece points: up and out

  function neckMarkup() {
    const t = tube(NECK, s => 12 - .6 * s, NECK_METAL);
    let out = `<g filter="url(#tubeSoft)">${t.markup}</g>`;
    // A crisp edge, and a second piece's joint ring near the top of the curve
    out += `<path d="${t.outline}" fill="none" stroke="#3f3e3a" stroke-width=".35" opacity=".8"/>`;
    const ring = (i, w) => {
      const p = NECK[i], q = t.nm[i], r = t.R[i] + .9;
      const tx = -q[1], ty = q[0];
      const c = (v, s) => [p[0] + q[0] * r * v + tx * s, p[1] + q[1] * r * v + ty * s];
      const pts = [c(-1, -w / 2), c(1, -w / 2), c(1, w / 2), c(-1, w / 2)];
      return `<path d="M${pts.map(v => `${n(v[0])} ${n(v[1])}`).join('L')}Z" fill="url(#collarB)" stroke="#55544e" stroke-width=".25"/>`;
    };
    out += ring(26, 2.6);
    // Where the mouthpiece's cork tenon goes in: a short bright ferrule
    return out;
  }

  // The mouthpiece seen from the side: black, its beak sloping to the tip, the reed under it and a metal ligature
  function mouthpieceMarkup() {
    const [x0, y0] = NECK_END, ang = Math.atan2(NECK_DIR[1], NECK_DIR[0]) * 180 / Math.PI;
    // In its own frame: x along the mouthpiece from the tenon (0) to the tip (98), y across, + toward the reed
    const body = smooth([[0, -14.6, 1], [30, -14.9], [58, -14.4], [70, -12.6], [82, -9.2], [92, -5.4], [97.6, -2.6], [99, -.6, 1], [98.4, 1.4, 1], [62, 10], [30, 13.6], [0, 14.6, 1]], true, .4);
    const reed = smooth([[26, 13.4, 1], [62, 9.8], [98.8, 1.4, 1], [100, 3.6, 1], [64, 12.8], [26, 16.6, 1]], true, .3);
    // The reed faces down, toward the player's lower lip
    let out = `<g transform="translate(${n(x0)} ${n(y0)}) rotate(${n(ang)}) scale(1 -1)">`;
    out += `<path d="M-7 -11.4L1 -11.6L1 11.6L-7 11.4Z" fill="url(#ligSide)" stroke="#55544e" stroke-width=".22"/><path d="M-1 -13L1.2 -13.4L1.2 13.4L-1 13Z" fill="url(#ligSide)" stroke="#55544e" stroke-width=".2"/>`;
    out += `<path d="${reed}" fill="url(#reedG)" stroke="#8d7346" stroke-width=".25"/>`;
    out += `<path d="${body}" fill="url(#mpSide)"/>`;
    out += `<path d="M4 -11.6C30 -12.2 56 -11.8 68 -10.4C80 -7.4 90 -4.6 96 -2.2" fill="none" stroke="#fff" stroke-width="1.4" opacity=".24" filter="url(#mpSoft)"/>`;
    out += `<path d="M2 10C30 9.8 50 8 64 6" fill="none" stroke="#9fa1a8" stroke-width=".7" opacity=".35"/>`;
    // The ligature: two bands round mouthpiece and reed, joined by a plate, screws on the reed side
    const lig = (x, w) => `<path d="M${x} -15L${x + w} -14.9L${x + w} 17.2L${x} 17.4Z" fill="url(#ligSide)" stroke="#55544e" stroke-width=".22"/>`;
    out += lig(34, 5.4) + lig(58, 5.2) + `<path d="M39.4 -14.2L58 -13.8L58 -11.6L39.4 -12Z" fill="url(#ligSide)" opacity=".9"/>`;
    const screw = x => `<rect x="${x - 1.7}" y="17.2" width="3.4" height="5.8" fill="url(#rodV)" stroke="#55544e" stroke-width=".16"/><ellipse cx="${x}" cy="24.3" rx="4" ry="2.4" fill="url(#ball)" stroke="#55544e" stroke-width=".16"/>`;
    out += screw(36.7) + screw(60.6);
    out += `<path d="M0 -14.6L0 14.6" stroke="#000" stroke-width=".6" opacity=".6"/>`;
    return out + '</g>';
  }

  // ----- the bow, the bell and the floor peg -----
  const BOW = (() => {
    const a = line(0, 966, 0, 1000, 6);
    const b = arc(30.5, 1000, 30.5, 180, 0, 28).slice(1);
    return a.concat(b);
  })();
  const BELL_AXIS = (() => {
    const pts = [], x0 = 61, y0 = 1000, x1 = 90, y1 = 818;
    for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([x0 + (x1 - x0) * Math.pow(t, 1.8), y0 + (y1 - y0) * t]); }
    return pts;
  })();
  const bellR = s => 23.4 + 1.6 * s + 42 * (Math.exp(5 * s) - 1) / (Math.exp(5) - 1);

  function bowBellMarkup() {
    let out = '';
    // The peg's holder under the bow, and the peg down to the floor with its rubber tip
    out += `<rect x="27.1" y="1046" width="6.8" height="78" fill="url(#rodV)"/><rect x="27.1" y="1046" width="6.8" height="78" fill="#000" opacity=".08"/>`;
    out += `<path d="M23 1050L38 1050L36.5 1064L24.5 1064Z" fill="url(#rodV)" stroke="#55544e" stroke-width=".3"/><circle cx="39" cy="1058" r="2.6" fill="url(#ball)" stroke="#55544e" stroke-width=".2"/>`;
    out += `<path d="M24.5 1122C24.5 1118 26.5 1116.6 30.5 1116.6C34.5 1116.6 36.5 1118 36.5 1122L37.1 1132C37.1 1137 34.1 1139.6 30.5 1139.6C26.9 1139.6 23.9 1137 23.9 1132Z" fill="url(#rubber)"/>`;
    const bow = tube(BOW, s => 21.2 + 2.4 * Math.max(0, (s - .3) / .7), BELL_METAL);
    out += `<g filter="url(#tubeSoft)">${bow.markup}</g><path d="${bow.outline}" fill="none" stroke="#3f3e3a" stroke-width=".35" opacity=".7"/>`;
    const bell = tube(BELL_AXIS, bellR, BELL_METAL, 34);
    out += `<g filter="url(#tubeSoft)">${bell.markup}</g><path d="${bell.outline}" fill="none" stroke="#3f3e3a" stroke-width=".35" opacity=".7"/>`;
    // A joint ring where the bell meets the bow, and the bow's ring on the body
    const ringAt = (pts, tb, i, w) => {
      const p = pts[i], q = tb.nm[i], r = tb.R[i] + 1, tx = -q[1], ty = q[0];
      const c = (v, s) => [p[0] + q[0] * r * v + tx * s, p[1] + q[1] * r * v + ty * s];
      const ps = [c(-1, -w / 2), c(1, -w / 2), c(1, w / 2), c(-1, w / 2)];
      return `<path d="M${ps.map(v => `${n(v[0])} ${n(v[1])}`).join('L')}Z" fill="url(#collarA)" stroke="#55544e" stroke-width=".3"/>`;
    };
    out += ringAt(BELL_AXIS, bell, 3, 5) + ringAt(BELL_AXIS, bell, 7, 2.2);
    // The rim: we look a little down into the bell, so its mouth is an ellipse with the bright inside showing
    const top = BELL_AXIS[BELL_AXIS.length - 1], R = bellR(1) + 1.6;
    const tilt = Math.atan2(BELL_AXIS[40][0] - BELL_AXIS[36][0], -(BELL_AXIS[40][1] - BELL_AXIS[36][1])) * 180 / Math.PI;
    const cx = top[0], cy = top[1];
    out += `<g transform="translate(${n(cx)} ${n(cy)}) rotate(${n(tilt)})">
      <ellipse cx="0" cy="0" rx="${n(R)}" ry="${n(R * .3)}" fill="url(#bellInside)"/>
      <path d="M${n(-R * .62)} ${n(-R * .1)}C${n(-R * .2)} ${n(R * .02)} ${n(R * .3)} ${n(R * .04)} ${n(R * .7)} ${n(-R * .1)}C${n(R * .3)} ${n(R * .14)} ${n(-R * .2)} ${n(R * .13)} ${n(-R * .62)} ${n(-R * .1)}Z" fill="#2c2e35" opacity=".55" filter="url(#tubeSoft)"/>
      <ellipse cx="${n(R * .05)}" cy="${n(R * .07)}" rx="${n(R * .5)}" ry="${n(R * .14)}" fill="url(#throat)"/>
      <ellipse cx="0" cy="${n(R * .015)}" rx="${n(R + .6)}" ry="${n(R * .3 + .9)}" fill="none" stroke="#55544e" stroke-width="7.6" opacity=".55"/>
      <ellipse cx="0" cy="0" rx="${n(R)}" ry="${n(R * .3)}" fill="none" stroke="url(#rimG)" stroke-width="7"/>
      <ellipse cx="0" cy="${n(-R * .01)}" rx="${n(R)}" ry="${n(R * .3)}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/>
      <ellipse cx="0" cy="${n(R * .02)}" rx="${n(R - 3.8)}" ry="${n(R * .3 - 2.6)}" fill="none" stroke="#55544e" stroke-width=".6" opacity=".7"/>
      <path d="M${n(-R * .96)} ${n(R * .04)}A${n(R)} ${n(R * .3)} 0 0 0 ${n(R * .96)} ${n(R * .04)}" fill="none" stroke="#fff" stroke-width=".9" opacity=".9"/>
      <path d="M${n(-R * .9)} ${n(-R * .12)}A${n(R)} ${n(R * .3)} 0 0 1 ${n(-R * .2)} ${n(-R * .29)}" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>
    </g>`;
    return out;
  }

  // ----- the body -----
  const UPPER_WOOD = `M${-HW} ${Y.bodyTop}L${HW} ${Y.bodyTop}L${HW} ${Y.joint}L${-HW} ${Y.joint}Z`;
  const LOWER_WOOD = `M${-HW} ${Y.joint}L${HW} ${Y.joint}L${HW + .3} ${Y.bodyEnd}L${-HW - .3} ${Y.bodyEnd}Z`;
  const BODY_WOOD = `M${-HW} ${Y.bodyTop}L${HW} ${Y.bodyTop}L${HW + .3} ${Y.bodyEnd}L${-HW - .3} ${Y.bodyEnd}Z`;
  function woodMarkup() {
    return woodPart('bupper', UPPER_WOOD, -21, 21, Y.bodyTop, Y.joint, 41, .55) + woodPart('blower', LOWER_WOOD, -21, 21, Y.joint, Y.bodyEnd, 42, .55);
  }
  function collarsMarkup() {
    let out = '';
    // The metal socket the neck fits into, with its clamp screw at the side
    out += collar(100, [[2.4, 14.9], [.3, 14.4, 1], [10.6, 13.9]], 'collarB', 1.2);
    out += collar(113.2, [[1.8, 21.2], [.3, 20.9, 1], [1, 21.1], [.3, 20.9, 1], [9.4, 21.3]], 'collarA', 1.6);
    out += `<rect x="13.6" y="103.6" width="5.6" height="5.6" rx="1.2" fill="url(#rodH)" stroke="#55544e" stroke-width=".25"/><ellipse cx="21" cy="106.4" rx="2.4" ry="3.8" fill="url(#ball)" stroke="#55544e" stroke-width=".25"/>`;
    // The tenon rings where the joints meet, and the ring at the foot of the body that the bow fits
    out += collar(Y.joint - 7, [[3.2, 21.2], [.3, 21, 1], [1.2, 21.3], [.3, 21, 1], [3.4, 21.4], [.4, 21, 1], [5, 21.3]], 'collarA', 1.6);
    out += collar(Y.bodyEnd - 10, [[1.2, 21.1], [.3, 20.9, 1], [10, 21.6]], 'collarC', 1.6);
    return out;
  }

  // ----- the keywork, in key units -----

  // A covered plate: a flat polished disc on its arm, the pad's pale edge showing under it while it is up. The first finger's has a
  // small vent hole: covered with the finger, open for the half-hole (the plate stays down)
  function plate(id, cx, cy, r, vent) {
    const X = cx * S, Yc = cy * S, R = r * S;
    silhouette(circlePath(X, Yc, R));
    const cid = K.newId();
    const v = vent ? { x: X + R * .06, y: Yc - R * .06, r: R * .23 } : null;
    return `<g class="ring plate${vent ? ' vented' : ''}" data-k="${id}">
      <g class="pad"><circle cx="${n(X + R * .05)}" cy="${n(Yc + R * .07)}" r="${n(R * 1.03)}" fill="#e7e1d0" stroke="#8a826f" stroke-width="1"/></g>
      <clipPath id="${cid}"><circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}"/></clipPath>
      <circle class="b" cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}" fill="#fff" filter="url(#chromeFlat)"/>
      <g clip-path="url(#${cid})">
        <rect x="${n(X - R)}" y="${n(Yc - R)}" width="${n(2 * R)}" height="${n(2 * R)}" fill="url(#plateHorizon)"/>
        <g filter="url(#blur1)"><path class="rd" d="M${n(X + R * .35)} ${n(Yc - R * .95)}C${n(X + R * .75)} ${n(Yc - R * .7)} ${n(X + R * .95)} ${n(Yc - R * .3)} ${n(X + R)} ${n(Yc + R * .05)}" fill="none" stroke="#3a3c43" stroke-width="${n(R * .16)}" opacity=".4"/></g>
      </g>
      <circle class="tint" cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}" fill="url(#noteFill)"/>
      <circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R - 2.4)}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".9" stroke-dasharray="${n(R * 1.6)} ${n(R * 4.7)}" stroke-dashoffset="${n(R * 3.3)}"/>
      <circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R - 4.4)}" fill="none" stroke="#8d8c86" stroke-width=".8" opacity=".5"/>
      <circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R - .6)}" fill="none" stroke="#6a665b" stroke-width="1.2"/>
      ${v ? `<g class="vent"><circle cx="${n(v.x)}" cy="${n(v.y)}" r="${n(v.r + 2.4)}" fill="#bdbcb6" stroke="#55544e" stroke-width=".9"/><circle cx="${n(v.x)}" cy="${n(v.y)}" r="${n(v.r)}" fill="#050405"/><path d="M${n(v.x - v.r * .7)} ${n(v.y + v.r * .7)}A${n(v.r)} ${n(v.r)} 0 0 0 ${n(v.x + v.r * .8)} ${n(v.y + v.r * .6)}" fill="none" stroke="#3a2e29" stroke-width="1.4"/></g>
        <g class="vcover"><circle cx="${n(v.x)}" cy="${n(v.y)}" r="${n(v.r + .6)}" fill="url(#noteFill)"/><circle cx="${n(v.x)}" cy="${n(v.y)}" r="${n(v.r + .6)}" fill="url(#fingerShade)"/></g>` : ''}
    </g>`;
  }
  // A flat vent disc on a short arm, nested against a plate as on the Yamaha: open until a plate closes it
  function flatCup(id, x, y, r) {
    const X = x * S, Yc = y * S, R = r * S, cid = K.newId();
    silhouette(circlePath(X, Yc, R));
    return `<g class="cup" data-cup="${id}">
      <g class="up">${K.shadow(X + 9, Yc + 7, R + 14, R + 14)}<circle cx="${n(X + 5)}" cy="${n(Yc + 4)}" r="${n(R)}" fill="#dcd8cd"/><circle cx="${n(X + 3)}" cy="${n(Yc + 2.4)}" r="${n(R - .4)}" fill="#121115"/></g>
      <g class="down">${K.shadow(X + 4, Yc + 4, R + 7, R + 7)}</g>
      <g class="face"><clipPath id="${cid}"><circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}"/></clipPath>
        <circle class="cf" cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}" fill="#fff" filter="url(#chromeFlat)"/>
        <g clip-path="url(#${cid})"><rect x="${n(X - R)}" y="${n(Yc - R)}" width="${n(2 * R)}" height="${n(2 * R)}" fill="url(#plateHorizon)"/></g>
        <circle class="tint" cx="${n(X)}" cy="${n(Yc)}" r="${n(R)}" fill="url(#noteFill)"/>
        <circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R - 2)}" fill="none" stroke="#fff" stroke-width="2" opacity=".85" stroke-dasharray="${n(R * 1.4)} ${n(R * 4.9)}" stroke-dashoffset="${n(R * 3.3)}"/>
        <circle cx="${n(X)}" cy="${n(Yc)}" r="${n(R - .5)}" fill="none" stroke="#6a665b" stroke-width="1.1"/></g>
    </g>`;
  }
  // The narrow waist that joins a plate and the vent disc nested under it into one figure-8 key
  const waist = (x, y1, y2) => `<path d="M${n((x - 2.6) * S)} ${n(y1 * S)}C${n((x - 1.6) * S)} ${n(((y1 + y2) / 2) * S)} ${n((x - 1.6) * S)} ${n(((y1 + y2) / 2) * S)} ${n((x - 2.6) * S)} ${n(y2 * S)}L${n((x + 2.6) * S)} ${n(y2 * S)}C${n((x + 1.6) * S)} ${n(((y1 + y2) / 2) * S)} ${n((x + 1.6) * S)} ${n(((y1 + y2) / 2) * S)} ${n((x + 2.6) * S)} ${n(y1 * S)}Z" fill="url(#rodV)" stroke="#6a665b" stroke-width=".8"/>`;
  // An arm from the hinge rod to a plate
  const plateArm = (id, cy, cx, r, tip = -24.2) => ringArm(id, tip * S, cy * S, (cy - 1.9) * S, (cy + 1.9) * S, cx * S, cy * S, r * S);
  const Cup = (id, x, y, r, w, rot) => { silhouette(circlePath(x * S, y * S, r * S)); return cup(id, x * S, y * S, r * S, w, rot); };
  const Ball = (x, y, r) => ball(x * S, y * S, r * S);
  const Foot = (x, y, rx, ry) => foot(x * S, y * S, rx * S, ry * S);
  const Post = (bx, by, r, fx, fy, rx, ry) => post(bx * S, by * S, r * S, fx * S, fy * S, rx * S, ry * S);
  const Rod = (x, w, y1, y2, cls, paint) => rodV(x * S, w * S, y1 * S, y2 * S, cls, paint);
  const Spear = (pts, ry, rx1, rx2, ry2, id) => spear(Pm(pts), ry * S, rx1 * S, rx2 * S, ry2 === undefined ? undefined : ry2 * S, id);
  const Band = (pts, w, c, o) => band(Pm(pts), w * S, c, o);
  const Glint = (pts, w, o, c) => glint(Pm(pts), w * S, o, c);
  const Touch = (id, pts, refl, t = .5) => touch(id, smooth(Pm(pts), true, t), refl);

  // The hinge rods: one down the left of each joint carrying the plates' arms, one down the right for the little fingers' keys
  function rodsMarkup() {
    let out = '';
    out += Rod(-25.6, 1.4, 300, 530, 'rs', 'rodV2') + Rod(-24.2, 3.4, 302, 530);
    [408, 437].forEach(y => { out += rodBreak(-24.2 * S, 3.4 * S, y * S); });
    out += Rod(-25.6, 1.4, 556, 712, 'rs', 'rodV2') + Rod(-24.2, 3.4, 556, 712);
    [[372, 384], [412, 424], [446, 458], [503, 515], [556, 568], [590, 602], [635, 647], [654, 663], [670, 682]].forEach(([a, b]) => { out += sleeve(-24.2 * S, 3.4 * S, a * S, b * S); });
    // Right side: the long tubes of the little fingers' keys, from the left hand's touches down past the joint to the low pads
    out += Rod(21.4, 3.4, 486, 962, 'rv', 'rodV2') + Rod(24.8, 2.8, 498, 950) + Rod(27.8, 2.8, 712, 958, 'rv', 'rodV2');
    [530, 548].forEach(y => { out += rodBreak(21.4 * S, 6.2 * S, y * S); });
    // Hinge tubes where the low pads' arms join the rods
    [762, 820, 879, 938].forEach(y => { out += sleeve(21.4 * S, 3.4 * S, (y - 6) * S, (y + 6) * S) + sleeve(27.8 * S, 2.8 * S, (y - 4) * S, (y + 4) * S); });
    return out;
  }
  function postsMarkup() {
    let out = '';
    [312, 364, 434, 476, 626, 664, 702].forEach(y => { out += Post(-27.2, y, 2.1, -21.4, y, 1.3, 2.1); });
    [500, 556, 724, 786, 848, 908].forEach(y => { out += Post(33.2, y, 2.2, 29.4, y, 1.3, 2.1); });
    return out;
  }

  // Top of the upper joint: the trill keys' pads at the left edge, the A and G♯ (A♭) keys, the first trill key's knuckle
  function topMarkup() {
    let out = '';
    // Trill key 1's pad at the left edge, its arm down to the knuckle where trill key 2 turns, and their own hinge rod
    out += Rod(-29.4, 1.8, 262, 306, 'rs', 'rodV2') + Post(-31.4, 266, 1.9, -27.6, 266, 1.1, 1.8);
    out += sideCup('T1', -19.2 * S, 252 * S, 3.2 * S, 7.4 * S, 1, 3.4 * S);
    silhouette(ellipsePath(-19.2 * S, 252 * S, 3.2 * S, 7.4 * S));
    const stem = smooth(Pm([[-21.4, 259, 1], [-18.6, 259, 1], [-19.6, 296, 1], [-23.4, 296, 1]]), true, .3);
    silhouette(stem);
    out += `<path d="${stem}" fill="#fff" filter="url(#chrome)"/><path d="${stem}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".6"/>`;
    out += `<g class="cup" data-cup="T2"><g class="up">${K.shadow(-22 * S, 302 * S, 4 * S, 3.4 * S)}</g><g class="down"></g>
      <g class="face"><rect x="${-27 * S}" y="${297 * S}" width="${8 * S}" height="${6 * S}" rx="${2.6 * S}" fill="url(#ball)" stroke="#6a665b" stroke-width=".9"/>
      <ellipse cx="${-25 * S}" cy="${298.2 * S}" rx="${1.6 * S}" ry="${.35 * S}" fill="#fff"/></g></g>`;
    silhouette(K.rectPath(-27 * S, 297 * S, 8 * S, 6 * S));
    // G♯ pad, seen a little from the side, and the A pad
    out += sideCup('Gs', -11 * S, 294 * S, 5.4 * S, 6.4 * S, 1, 2.4 * S);
    silhouette(ellipsePath(-11 * S, 294 * S, 5.4 * S, 6.4 * S));
    out += Cup('A', 3.4, 280, 6.8, 'cw2', -96);
    // The A key's hinge between two posts, under its cup
    out += Foot(-7, 308, 1.6, 2.2) + Foot(13, 308, 1.6, 2.2);
    out += `<rect x="${-6 * S}" y="${307 * S}" width="${18 * S}" height="${2 * S}" fill="url(#rodH)"/>`;
    out += Ball(-8.6, 308, 2.2) + Ball(14.6, 308, 2.2);
    // The G cup, closed by the thumb plate or the first finger's plate: clear of the A touch, between it and the G♯ touch
    out += Spear([[22.6, 347], [21.4, 346], [18.6, 346], [17, 347], [18.6, 348], [21.4, 348]], 347, 21.6, 18.4, undefined, 'P');
    out += Cup('P', 14.4, 347, 4.6, 'cw3', 20);
    // The A touch: a short arm from the cup down past its screw to a teardrop paddle above the first plate
    out += Touch('A', [[3.4, 281, 1], [4.6, 286, 1], [4.6, 330], [5, 336], [7, 340], [8.8, 346], [9, 353], [7.8, 358], [5.6, 360.8], [3.2, 361.4], [.8, 360.8], [-1.4, 358], [-2.4, 353], [-2.2, 346], [-.4, 340], [1.6, 336], [2.2, 330], [2.2, 286, 1]],
      Band([[3.4, 336], [3.6, 344], [3.6, 352], [3.2, 358]], .9, '#23252b', .9) + Band([[3.4, 290], [3.4, 302]], .5) +
      Glint([[-.6, 346], [-1, 352], [-.2, 357]], .45));
    out += `<circle cx="${3.4 * S}" cy="${294 * S}" r="${1.6 * S}" fill="url(#rodH)" stroke="#6a665b" stroke-width=".9"/><path d="M${2.4 * S} ${294 * S}L${4.4 * S} ${294 * S}" stroke="#26282d" stroke-width="1.6"/>`;
    // The G♯ key: hinge on two posts at the right, an arm across from its pad, a long paddle for the first finger's side
    out += Foot(22.4, 282, 1.3, 2) + Foot(22.4, 298, 1.4, 2);
    out += `<rect class="rv" x="${21.2 * S}" y="${282 * S}" width="${3.2 * S}" height="${16 * S}" fill="url(#rodV)"/>`;
    silhouette(K.rectPath(21.2 * S, 282 * S, 3.2 * S, 16 * S));
    out += Touch('Gs', [[23.4, 298.0, 1], [25.8, 298.0, 1], [27.6, 308.0], [30.6, 318.0], [33.2, 330.0], [34.4, 342.0], [34, 352.0], [32, 358.0], [29.6, 359.0], [27.4, 356.0], [26, 348.0], [25.6, 336.0], [25.4, 322.0], [24.6, 308.0]],
      Band([[26.6, 320.0], [27.4, 332.0], [27.6, 344.0], [27, 354.0]], 1.2, '#23252b', .9) + Glint([[31.6, 330.0], [32.8, 340.0], [32.6, 350.0]], .7, .9));
    out += `<g class="key" data-k="Gs">${Spear([[-7, 294], [-3, 292.8], [10, 292.4], [22, 292.4], [25.4, 293.2], [26.2, 294.4], [25.4, 295.6], [22, 296.4], [10, 296.4], [-3, 296]], 294.2, -6, 25, 294.2)}</g>`;
    out += Ball(22.8, 280.6, 2.1) + Ball(22.8, 299.4, 2);
    return out;
  }

  // The long plate down the left that carries the side keys, stepped out in three points like the B♭'s
  const SIDE_PLATE = smooth(Pm([
    [-21.6, 304, 1], [-23.4, 304], [-24.6, 314], [-25.4, 330], [-26.2, 346], [-27.6, 358], [-29.6, 368, 1], [-28, 378], [-26.6, 392], [-26.2, 416],
    [-27.8, 426], [-29.6, 432, 1], [-28.2, 440], [-26.8, 452], [-26.6, 470], [-27.4, 480, 1], [-21.6, 480, 1],
  ]), true, .34);
  function sidePlateMarkup() {
    silhouette(SIDE_PLATE);
    const cid = K.newId();
    let out = `<clipPath id="${cid}"><path d="${SIDE_PLATE}"/></clipPath><path d="${SIDE_PLATE}" fill="#fff" filter="url(#chromeFlat)"/><g clip-path="url(#${cid})">`;
    out += Band([[-22.6, 310], [-23.2, 330], [-24, 350], [-26.6, 364]], .7, '#0f1115', .96) + Band([[-24.2, 380], [-24, 412], [-26, 426]], .7, '#0f1115', .96) + Band([[-25, 442], [-24.6, 462], [-25.2, 478]], .7, '#0f1115', .96);
    out += Glint([[-24.8, 316], [-25.4, 334], [-27.6, 364]], .6) + Glint([[-27.2, 382], [-27, 412]], .6) + Glint([[-28, 440], [-27.6, 462]], .6);
    return out + `</g><path d="${SIDE_PLATE}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".7"/>`;
  }

  function leftHandMarkup() {
    let out = '';
    // The E cup between the first and second plates, at the right: closed by the second plate, or by the right hand's plates
    out += waist(0, 378, 395.4) + flatCup('Ev', 0, 395.4, 8.8);
    // The three plates, each on an arm from the rod
    ['L1', 'L2', 'L3'].forEach(k => {
      const [x, y, r] = PLATE[k];
      out += plateArm(k, y, x, r) + plate(k, x, y, r, k === 'L1');
    });
    // The E♭/B♭ key: a lever on two posts at the right edge, its pad seen edge-on there, its touch curling in under the second plate
    out += Foot(22, 389, 1.3, 2) + Foot(22, 437, 1.3, 2);
    out += `<g class="cup edge" data-cup="Eb"><g class="up"><path d="M${19.6 * S} ${410 * S}H${20 * S}V${424 * S}H${19.6 * S}Z" fill="#17181c" opacity=".8"/></g><g class="down"></g>
      <g class="face"><path d="M${19.8 * S} ${409 * S}C${21.6 * S} ${409.4 * S} ${22.6 * S} ${411 * S} ${22.8 * S} ${413 * S}V${421 * S}C${22.6 * S} ${423 * S} ${21.6 * S} ${424.6 * S} ${19.8 * S} ${425 * S}Z" fill="url(#rodV)" stroke="#55544e" stroke-width=".9"/></g></g>`;
    silhouette(K.rectPath(19.8 * S, 409 * S, 3 * S, 16 * S));
    out += Touch('Eb', [[22.4, 389.0, 1], [24.4, 389.0, 1], [24.4, 427.0], [23.6, 431.0], [21.4, 433.6], [17.6, 435.0], [14, 437.4], [10, 439.4], [6.4, 439.2], [4.8, 436.4], [6.2, 433.2], [10, 431.8], [15, 431.4], [19.6, 429.6], [22, 425.0]],
      Band([[23.4, 395.0], [23.4, 413.0], [23.2, 425.0]], .6, '#17181c', .9) + Band([[8, 437.4], [12, 436.6], [17, 434.2]], 1.2, '#23252b', .85) + Glint([[6.6, 434.6], [10.6, 433.2], [16, 432.6], [21, 428.6]], .7, .95));
    out += Ball(23.6, 388, 1.9) + Ball(23.6, 438, 1.9);
    // C♯/G♯ key for the left little finger: down from its hinge, along under the third plate, out to a teardrop at the right
    out += Ball(-11, 468, 2);
    out += Touch('LCs', [[-12.6, 469.0, 1], [-9.4, 469.0, 1], [-9.4, 482.0], [-8.4, 486.0], [-5, 488.0], [2, 487.4], [9, 485.6], [14.6, 482.0], [19, 479.6], [23, 479.2], [25.6, 480.8], [26.4, 483.6], [25.4, 487.0], [22.6, 489.4], [17.6, 490.4], [10, 491.0], [2, 492.6], [-6, 493.0], [-10.4, 491.4], [-12.2, 488.0], [-12.6, 482.0]],
      Band([[-11, 471.0], [-11, 484.0], [-9, 490.0], [-4, 491.0]], .8, '#17181c', .9) + Band([[17, 483.0], [21, 482.0], [24.4, 482.6]], .9, '#23252b', .85) +
      Glint([[-12, 474.0], [-12, 484.0]], .4, .9));
    // Its pad, below the third plate: closed until the key opens it
    out += Cup('Cs', 0, 509, 9.4, 'cw1', 30);
    out += Spear([[-24, 509], [-22.4, 507.6], [-14, 507.6], [-9.4, 509], [-14, 510.4], [-22.4, 510.4]], 509, -22, -12, undefined, 'Cs');
    return out;
  }

  // The side keys at the foot of their plate, for the right first finger: two buttons and two spoons
  function sideKeysMarkup() {
    let out = '';
    const dome = (id, cx, cy, rx, ry) => {
      const X = cx * S, Yc = cy * S, RX = rx * S, RY = ry * S;
      silhouette(ellipsePath(X, Yc, RX, RY));
      return `<g class="key" data-k="${id}"><ellipse class="b" cx="${n(X)}" cy="${n(Yc)}" rx="${n(RX)}" ry="${n(RY)}" fill="#fff" filter="url(#chrome)"/>
        <path class="rd" d="M${n(X - RX * .3)} ${n(Yc + RY * .88)}C${n(X + RX * .2)} ${n(Yc + RY * .96)} ${n(X + RX * .62)} ${n(Yc + RY * .72)} ${n(X + RX * .8)} ${n(Yc + RY * .48)}C${n(X + RX * .6)} ${n(Yc + RY * .62)} ${n(X + RX * .1)} ${n(Yc + RY * .8)} ${n(X - RX * .3)} ${n(Yc + RY * .88)}Z" fill="#2c2e35" opacity=".85"/>
        <path class="tint" d="${ellipsePath(X, Yc, RX, RY)}" fill="url(#noteFill)"/>
        <ellipse cx="${n(X)}" cy="${n(Yc)}" rx="${n(RX - .4)}" ry="${n(RY - .4)}" fill="none" stroke="url(#edgeG)" stroke-width="1"/></g>`;
    };
    // The guard's lever carries on down over the tenon to a block below it, left of the rods
    const link = smooth(Pm([[-27.6, 478, 1], [-25.6, 478, 1], [-26.4, 530], [-28.6, 548, 1], [-30.6, 548, 1], [-28.6, 530]]), true, .3);
    silhouette(link);
    out += `<path d="${link}" fill="#fff" filter="url(#chromeFlat)"/><path d="${link}" fill="none" stroke="url(#edgeV)" stroke-width=".8" opacity=".7"/>`;
    const block = smooth(Pm([[-31.6, 547], [-26.6, 547], [-26.2, 556], [-26.6, 570], [-31.6, 570], [-32, 558]]), true, .2);
    silhouette(block);
    out += `<path d="${block}" fill="#fff" filter="url(#chrome)"/><path d="${block}" fill="none" stroke="url(#edgeG)" stroke-width=".8" opacity=".6"/>`;
    // Side keys 1 and 2: each a short lever from its own post on the block, out to a domed button
    out += Touch('S1', [[-31, 549.6, 1], [-31, 553.6, 1], [-34, 554.4], [-36.6, 553.8], [-36.6, 550.4], [-34, 549.8]], Band([[-31.4, 552.4], [-34, 552.8], [-36, 552.6]], .5, '#17181c', .8));
    out += Touch('S2', [[-31, 562.4, 1], [-31, 566.6, 1], [-34, 567.6], [-36.8, 567], [-36.8, 563.4], [-34, 562.8]], Band([[-31.4, 565.4], [-34, 565.8], [-36, 565.6]], .5, '#17181c', .8));
    out += Ball(-30.6, 551.6, 1.5) + Ball(-30.6, 564.6, 1.5);
    out += dome('S1', -39.6, 552, 3.6, 4.8) + dome('S2', -39.8, 565.2, 3.7, 4.9);
    out += Touch('S3', [[-30.4, 570, 1], [-28.8, 570, 1], [-28.6, 574], [-27.8, 578.6], [-28.2, 583.6], [-30.2, 586.4], [-33.2, 586.4], [-35.2, 583.4], [-35, 578.4], [-32.4, 574]],
      Glint([[-33.4, 577], [-34, 582]], .6, .95));
    out += `<path d="M${-27.8 * S} ${590 * S}C${-25.8 * S} ${592.6 * S} ${-25.8 * S} ${600 * S} ${-27.8 * S} ${602.6 * S}L${-29.2 * S} ${602.6 * S}Z" fill="url(#cork)"/>`;
    out += Touch('S4', [[-30.8, 586.6, 1], [-29.4, 586.6, 1], [-28.6, 589.6], [-27.4, 594.6], [-27.8, 600], [-30.2, 603.4], [-33.6, 603.4], [-35.6, 600.4], [-35.6, 594.6], [-33.2, 589.6]],
      Band([[-28.6, 595], [-29, 600]], .5, '#17181c', .9) + Glint([[-34, 594], [-34.2, 599]], .6, .95));
    return out;
  }

  // The left little finger's three long levers on the right of the upper joint, each one piece from its touch down past the joint
  function leftLittleMarkup() {
    let out = '';
    // F/C: the top touch, behind, its head out to the right
    out += Touch('LF', [[24.8, 552.0, 1], [24.8, 516.0], [25.4, 506.0], [27.6, 498.0], [31, 492.0], [35.4, 487.6], [40, 485.6], [43.4, 486.6], [44.4, 490.4], [43, 495.0], [39, 498.6], [34.4, 501.4], [30.4, 505.6], [28.6, 512.0], [28.2, 524.0], [28.2, 552.0, 1]],
      Band([[33, 494.0], [37.6, 491.4], [41.6, 490.4]], 1.4, '#17181c', .92) + Glint([[26, 518.0], [26, 534.0], [26, 548.0]], .7, .9) +
      Glint([[34, 489.6], [38.6, 487.6], [42, 487.8]], .5));
    // F♯/C♯ at the right
    out += Touch('LFs', [[28.6, 560.0, 1], [28.6, 536.0], [29.4, 524.0], [31.4, 516.0], [34.4, 510.0], [38, 506.2], [41.6, 505.6], [43.8, 507.8], [44, 512.0], [42.2, 517.4], [38.6, 523.0], [35, 529.0], [32.6, 538.0], [32, 560.0, 1]],
      Band([[37.6, 509.0], [41, 509.6], [42.4, 512.4]], 1.3, '#23252b', .9) + Band([[34.6, 526.0], [32.6, 538.0], [31.6, 554.0]], .6, '#0f1115', .9) + Glint([[30.2, 528.0], [29.8, 542.0]], .5, .9));
    // E/B in front: a long teardrop pointing up
    out += Touch('LE', [[21.8, 570.0, 1], [21.8, 534.0], [21.2, 520.0], [20.4, 508.0], [20.6, 498.0], [22.6, 492.4], [26, 491.2], [29, 493.0], [30, 497.6], [29.6, 506.0], [28, 516.0], [26.4, 530.0], [25.6, 548.0], [25.6, 570.0, 1]],
      Band([[25.4, 496.0], [27.2, 502.0], [27, 512.0], [25.6, 524.0]], 1.6, '#23252b', .9) + Glint([[22.2, 518.0], [22.4, 540.0], [22.8, 564.0]], .8, .9) +
      `<path class="rl" d="${smooth(Pm([[22, 496.6], [24.2, 494.4], [25.2, 495.6], [23, 497.6]]), true, .4)}" fill="#fff" opacity=".95"/>`);
    out += Ball(23.4, 488, 2.4);
    return out;
  }

  function rightHandMarkup() {
    let out = '';
    // The cup above the right hand: closed by the first or second plate, unless the B/F♯ key is held
    out += Cup('C', 1, 562, 8.4, 'cw1', 0);
    out += Spear([[-24, 562], [-22.4, 560.8], [-9, 560.8], [-5, 562], [-9, 563.2], [-22.4, 563.2]], 562, -22, -9, undefined, 'C');
    out += waist(0, 596, 614.2) + flatCup('Bv', 0, 614.2, 9.2);
    ['R1', 'R2'].forEach(k => {
      const [x, y, r] = PLATE[k];
      out += plateArm(k, y, x, r) + plate(k, x, y, r);
    });
    // B/F♯: a slim touch between the second and third plates, out of its own sleeve on the rod
    out += Touch('BF', [[-22.6, 656.6, 1], [-18, 657.2], [-8, 658.4], [0, 659.4], [5, 658.8], [9.4, 658.6], [12.4, 660.2], [12.8, 663.2], [10.6, 665.4], [6.4, 665.6], [1, 664.0], [-8, 662.6], [-18, 661.4], [-22.6, 661.0, 1]],
      Band([[-4, 662.0], [3, 662.8], [9, 663.6]], .8, '#17181c', .92) + Glint([[-20, 658.4], [-8, 659.6], [2, 660.6], [8, 660.2], [11.6, 661.2]], 1, .95));
    const [x3, y3, r3] = PLATE.R3;
    out += plateArm('R3', y3, x3, r3) + plate('R3', x3, y3, r3);
    return out;
  }

  // The right little finger's five keys: the B♭'s four spoons made larger, F♯ and E behind, G♯ and F in front, and the low E♭ below
  function rightLittleMarkup() {
    let out = '';
    const RFs = smooth([[88, 820], [94, 800], [123, 781], [163, 775], [197, 785], [224, 796], [250, 812], [252, 860, 1], [183, 855], [127, 849], [106, 840]]);
    const RE = smooth([[49, 912], [58, 890], [88, 878], [140, 880], [177, 888], [230, 908], [230, 960, 1], [183, 958], [140, 955], [90, 947], [60, 933]]);
    const T = 'translate(-449 4486) scale(1.42)';   // B♭ lower-joint pixels -> key units
    out += K.partsIn(T, () => touch('RFs', RFs,
      flag([[166, 794], [196, 798], [230, 818], [202, 816], [178, 806]]) +
      band([[150, 828], [196, 834], [236, 844]], 2.4, '#17181c', .8) +
      glint([[96, 806], [122, 786], [163, 780], [197, 790], [224, 801]], 2)));
    out += K.partsIn(T, () => touch('RE', RE,
      flag([[138, 892], [172, 896], [208, 914], [178, 912], [152, 902]]) +
      band([[86, 924], [124, 932], [176, 938], [220, 946]], 2.4, '#17181c', .8) +
      glint([[54, 902], [88, 884], [140, 885], [176, 893], [194, 900]], 2)));
    const on = K.newId();
    out += `<g transform="${T}"><clipPath id="${on}"><path d="${RFs}"/><path d="${RE}"/></clipPath><g clip-path="url(#${on})">
      <path d="${smooth([[172, 833], [187, 809], [220, 804], [253, 811], [262, 830], [250, 866], [207, 873], [187, 864], [177, 851]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/>
      <path d="${smooth([[158, 923], [168, 903], [197, 894], [227, 896], [240, 920], [232, 962], [197, 963], [180, 956], [165, 943]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/></g></g>`;
    out += K.partsIn(T, () => touch('RGs', smooth([
      [172, 828], [185, 806], [215, 798], [250, 800], [290, 810], [325, 822], [340, 835], [348, 855], [352, 880], [355, 905], [355, 950, 1], [339, 950, 1], [339, 925], [336, 905], [326, 888], [312, 878], [290, 872], [240, 868], [190, 858], [177, 845],
    ]),
      flag([[262, 812], [298, 822], [326, 842], [340, 876], [324, 854], [298, 836], [276, 824]]) +
      band([[218, 846], [262, 852], [304, 860]], 2.4, '#17181c', .8) +
      band([[336, 892], [345, 925], [347, 948]], 2.2, '#17181c', .8) +
      glint([[180, 816], [215, 803], [250, 805], [290, 815], [325, 827], [338, 840], [345, 858]], 2)));
    // The low E♭ key, below the others for the same little finger: a spoon on its own long lever
    out += K.partsIn('translate(-340 4746) scale(1.42 1.3)', () => touch('REb', smooth([[60, 933], [70, 914], [100, 905], [150, 906], [190, 914], [236, 932], [236, 980, 1], [190, 974], [140, 970], [96, 962], [68, 950]]),
      flag([[148, 916], [182, 920], [218, 936], [188, 934], [162, 926]]) +
      band([[96, 948], [134, 955], [186, 960], [228, 968]], 2.4, '#17181c', .8) +
      glint([[64, 926], [98, 910], [150, 911], [186, 918], [204, 924]], 2)));
    out += K.partsIn(T, () => touch('RF', smooth([
      [158, 917], [168, 899], [190, 890], [215, 890], [250, 893], [290, 905], [325, 918], [340, 930], [350, 948], [355, 965], [358, 1000], [358, 1040, 1], [340, 1040, 1], [338, 1020], [334, 1000], [326, 990], [312, 977], [290, 971], [240, 968], [200, 957], [175, 947], [161, 932],
    ]),
      flag([[254, 906], [292, 918], [320, 938], [336, 968], [318, 946], [292, 930], [268, 918]]) +
      band([[254, 948], [296, 952], [322, 964], [334, 988]], 2.4, '#17181c', .8) +
      band([[346, 996], [348, 1020], [349, 1036]], 2.4, '#17181c', .8) +
      glint([[164, 908], [190, 895], [215, 895], [250, 898], [290, 910], [325, 923], [338, 935], [347, 952]], 2)));
    return out;
  }

  // Below the hands: the G♯ pad, the four big open pads of the low notes, and the bars that carry the little fingers down to them
  function lowMarkup() {
    let out = '';
    // The low G♯ pad at the right edge, edge-on: it swings out when its key is pressed
    out += sideCup('RGs', 21.2 * S, 715 * S, 1.6 * S, 5.6 * S, -1, 1.1 * S);
    silhouette(ellipsePath(21.2 * S, 715 * S, 1.6 * S, 5.6 * S));
    out += `<g class="key" data-k="RGs">${Spear([[5, 714], [20, 714], [21.2, 715], [20, 716.2], [5, 716.2]], 715, 6, 19.6)}</g>`;
    // The right little finger's bars down the left of the lower joint, side by side, F/C and E/B in front of F♯ and low E♭
    const bar = (id, x, w, y1, y2, paint) => { silhouette(K.rectPath(x * S, y1 * S, w * S, (y2 - y1) * S)); return `<g class="key" data-k="${id}"><rect class="rv" x="${n(x * S)}" y="${n(y1 * S)}" width="${n(w * S)}" height="${n((y2 - y1) * S)}" fill="url(#${paint})"/><rect class="tint" x="${n(x * S)}" y="${n(y1 * S)}" width="${n(w * S)}" height="${n((y2 - y1) * S)}" fill="url(#noteFill)"/></g>`; };
    out += bar('REb', -20.4, 2.6, 741, 942, 'rodV2') + bar('RFs', -17.6, 2.6, 741, 764, 'rodV');
    out += bar('RE', -14.8, 2.6, 741, 882, 'rodV') + bar('RF', -12, 2.6, 741, 820, 'rodV2');
    out += `<rect x="${-21 * S}" y="${739 * S}" width="${12 * S}" height="${10 * S}" fill="url(#shadeDown)"/>`;
    // The four big pads, open until the little fingers close them, each on a long arm from the tube at the right. The low E♭ key
    // closes its own pad and every pad above it
    const low = [['Fs', 762, 10.6], ['F', 820, 11.4], ['E', 879, 12], ['LEb', 938, 12.6]];
    low.forEach(([id, y, r], i) => {
      out += Cup(id, -2, y, r, ['cw1', 'cw2', 'cw3', 'cw1'][i], [10, -20, 40, -60][i]);
      out += Spear([[4, y], [8, y - 1.2], [21, y - 1.2], [22.4, y], [21, y + 1.2], [8, y + 1.2]], y, 6, 21, undefined, id);
    });
    // Where the bars meet the pads' arms: a small foot on each
    [[762, -16.3], [820, -10.7], [879, -13.5], [938, -19.1]].forEach(([y, x]) => { out += Ball(x, y + 4.2, 1.2); });
    return out;
  }

  // ----- the neck's register key: its pad on the curve, its lever back to the body, where the body's register rod lifts it -----
  function neckKeyMarkup() {
    const t = tube(NECK, s => 12 - .6 * s, NECK_METAL);
    const i0 = NECK.length - 15, i1 = 32;   // the pad, on the start of the second bend; the lever's tail, up the falling leg
    const side = (i, v) => { const p = NECK[i], q = t.nm[i]; return [p[0] + q[0] * t.R[i] * v, p[1] + q[1] * t.R[i] * v]; };
    // The lever: a flat bar along the tube's outer side, on two posts
    const pts = [];
    for (let i = i0; i >= i1; i--) pts.push(side(i, -.55));
    const lev = smooth(pts.map(p => [p[0] - .9, p[1] - .2]).concat(pts.slice().reverse().map(p => [p[0] + .9, p[1] + .2])), true, .3);
    let out = `<g class="carmN"><path d="${lev}" fill="url(#armTopN)" stroke="#6f6b60" stroke-width=".2"/></g>`;
    [i0 - 3, i1 + 2].forEach(i => { const [x, y] = side(i, -.55); out += `<circle cx="${n(x)}" cy="${n(y)}" r="1.25" fill="url(#ball)" stroke="#55544e" stroke-width=".14"/>`; });
    // Its tail ends in a small hook that the body's register linkage lifts
    const [tx, ty] = side(i1, -.55);
    out += `<path d="M${n(tx - 1)} ${n(ty)}L${n(tx + 3.6)} ${n(ty - 3)}L${n(tx + 4.4)} ${n(ty - 1.6)}L${n(tx + .4)} ${n(ty + 1)}Z" fill="url(#armTopN)" stroke="#6f6b60" stroke-width=".18"/>`;
    // The body's linkage: a short arm out of the receiver toward it
    out += `<path d="M-12.6 104.2L-24 96.8L-23 95.2L-11.6 102.4Z" fill="url(#armTopN)" stroke="#6f6b60" stroke-width=".2"/><circle cx="-12" cy="103.4" r="1.4" fill="url(#ball)" stroke="#55544e" stroke-width=".14"/>`;
    // Its pad over the vent
    const [cx, cy] = side(i0, -.3);
    out += `<g class="cup vent" data-cup="NV">
      <g class="up"><ellipse cx="${n(cx + 1.2)}" cy="${n(cy + 1.4)}" rx="5.6" ry="5.6" fill="url(#softSh)"/><circle cx="${n(cx + 1.3)}" cy="${n(cy + 1.5)}" r="4" fill="#e6e2d7"/><circle cx="${n(cx + .9)}" cy="${n(cy + 1.1)}" r="3.9" fill="#141317"/></g>
      <g class="down"><ellipse cx="${n(cx + .4)}" cy="${n(cy + .5)}" rx="4.8" ry="4.8" fill="url(#softSh)"/></g>
      <g class="face"><circle cx="${n(cx)}" cy="${n(cy)}" r="4" fill="url(#cupFace)"/><g transform="translate(${n(cx)} ${n(cy)}) rotate(30) scale(.038)"><use href="#cw3"/></g>
        <circle cx="${n(cx)}" cy="${n(cy)}" r="3.6" fill="none" stroke="#fff" stroke-width=".22"/><circle cx="${n(cx)}" cy="${n(cy)}" r="3.95" fill="none" stroke="#6a665b" stroke-width=".14"/></g>
      <circle class="vmark" cx="${n(cx)}" cy="${n(cy)}" r="5.4" fill="none" stroke="url(#noteFill)" stroke-width="1"/>
    </g>`;
    return out;
  }

  // ----- the back: register vent, the thumb's register lever and plate, and the thumb rest -----
  const BACK_TOP = 262, BACK_END = 650;
  function backMarkup() {
    let out = woodPart('bback', `M-20 ${BACK_TOP}L20 ${BACK_TOP}L20 ${Y.joint}L-20 ${Y.joint}Z`, -21, 21, BACK_TOP, Y.joint, 77, .55);
    out += woodPart('bback2', `M-20 ${Y.joint}L20 ${Y.joint}L20 ${BACK_END}Q0 ${BACK_END + 4} -20 ${BACK_END}Z`, -21, 21, Y.joint, BACK_END + 4, 78, .55);
    out += `<path d="M-20 ${BACK_END}Q0 ${BACK_END + 4} 20 ${BACK_END}" fill="none" stroke="#6d5f58" stroke-width=".5"/>`;
    out += collar(Y.joint - 7, [[3.2, 21.2], [.3, 21, 1], [1.2, 21.3], [.3, 21, 1], [3.4, 21.4], [.4, 21, 1], [5, 21.3]], 'collarA', 1.6);
    // The rod that carries the register mechanism up the back to the neck, beside the lever
    out += `<rect x="8.2" y="${BACK_TOP}" width="1.9" height="${322 - BACK_TOP}" fill="url(#rodV)"/>`;
    // Register key: the body vent's pad at the top, a long arm, its hinge between two posts, and the thumb's spatula
    const vent = 284, hinge = 322;
    out += `<g class="cup vent" data-cup="R">
      <g class="up"><ellipse cx="1.4" cy="${vent + 2}" rx="7" ry="7" fill="url(#softSh)"/><circle cx="1.3" cy="${vent + 1.7}" r="5.3" fill="#e6e2d7"/><circle cx=".9" cy="${vent + 1.2}" r="5.2" fill="#141317"/></g>
      <g class="down"><ellipse cx=".1" cy="${vent + .7}" rx="6.4" ry="6.4" fill="url(#softSh)"/><circle cx="-.3" cy="${vent + .1}" r="5.3" fill="#e6e2d7"/></g>
      <g class="face"><circle cx="-.6" cy="${vent - .1}" r="5.2" fill="url(#cupFace)"/>
        <g transform="translate(-.6 ${vent - .1}) rotate(40) scale(.05)"><use href="#cw3"/></g>
        <circle cx="-.6" cy="${vent - .1}" r="4.7" fill="none" stroke="#fff" stroke-width=".22"/><circle cx="-.6" cy="${vent - .1}" r="5.15" fill="none" stroke="#6a665b" stroke-width=".12"/></g>
      <circle class="vmark" cx="-.6" cy="${vent - .1}" r="7" fill="none" stroke="url(#noteFill)" stroke-width="1.1"/></g>`;
    out += `<ellipse cx="10" cy="${hinge}" rx="3.2" ry="3.6" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/><circle cx="11.8" cy="${hinge}" r="2.8" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><ellipse cx="-5" cy="${hinge}" rx="1.8" ry="2.6" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/>`;
    const regKey = smooth([[-1.7, vent + 4, 1], [.5, vent + 4, 1], [.7, hinge + 4], [3.2, hinge + 13], [4.1, hinge + 22], [2, hinge + 28.4], [-.8, hinge + 30], [-3.7, hinge + 28.4], [-5.3, hinge + 22], [-4, hinge + 13], [-1.8, hinge + 4]]);
    out += `<g class="key" data-k="R">
      <path class="b" d="${regKey}" fill="url(#sv)" stroke="#6a665b" stroke-width=".14"/>
      <rect class="rh" x="-4.2" y="${hinge - 1.5}" width="14.4" height="3" rx=".8" fill="url(#rodH)"/>
      <path class="rd" d="M-1.1 ${hinge + 7}L-.1 ${hinge + 7}L1.1 ${hinge + 20}C.9 ${hinge + 25} -.4 ${hinge + 27.4} -1.5 ${hinge + 27.4}C-2.3 ${hinge + 24} -1.9 ${hinge + 16} -1.1 ${hinge + 7}Z" fill="#2c2e35"/>
      <path class="rd" d="M-1 ${vent + 7}L-.4 ${vent + 7}L-.4 ${hinge - 3}L-1 ${hinge - 3}Z" fill="#2c2e35" opacity=".85"/>
      <path class="tint" d="${regKey}" fill="url(#noteFill)"/><rect class="tint" x="-4.2" y="${hinge - 1.5}" width="14.4" height="3" rx=".8" fill="url(#noteFill)"/>
      <ellipse cx="-2.9" cy="${hinge + 22}" rx="1" ry="4.4" fill="#fff"/></g>`;
    // The thumb plate: a covered pad like the front ones, its arm to a hinge at the side
    const t = 363;
    out += `<rect x="-17.6" y="${t - 1.3}" width="9.6" height="2.6" fill="url(#armTop)"/><circle cx="-18.6" cy="${t}" r="2" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/>`;
    out += `<g transform="scale(${1 / S})">${plate('T', 0, t, 8.6)}</g>`;
    // Thumb rest on the lower joint, with the ring for a neck strap
    const r = 584;
    const base = `M-4.6 ${r}Q0 ${r - .8} 4.6 ${r}L5 ${r + 12}L-5 ${r + 12}Z`;
    const hook = smooth([[-5, r + 10.6, 1], [5, r + 10.6, 1], [7.8, r + 14], [9.8, r + 18.8], [9.2, r + 22], [0, r + 23.6], [-9.2, r + 22], [-9.8, r + 18.8], [-7.8, r + 14]], true, .42);
    out += `<path d="${hook}" fill="#000" opacity=".8" transform="translate(.6 3)" filter="url(#mpSoft)"/><path d="${base}" fill="#000" opacity=".5" transform="translate(.7 .6)" filter="url(#mpSoft)"/>`;
    out += `<path d="${base}" fill="url(#plateR)" stroke="#55544e" stroke-width=".14"/>`;
    [r + 3.4, r + 8.4].forEach((y, i) => { out += `<circle cx="0" cy="${y}" r="1.25" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><path d="M${i ? -.8 : -.7} ${n(y + (i ? .3 : -.4))}L${i ? .8 : .7} ${n(y - (i ? .3 : -.4))}" stroke="#16161a" stroke-width=".22"/>`; });
    out += `<path d="${hook}" fill="url(#restPlastic)" stroke="#0c0c0e" stroke-width=".14"/><path d="M-4.8 ${r + 11}Q0 ${r + 10.2} 4.8 ${r + 11}" fill="none" stroke="#7d7f86" stroke-width=".3"/>`;
    out += `<circle cx="6.4" cy="${r + 2.4}" r="2.8" fill="none" stroke="url(#rodH)" stroke-width="1.1"/><circle cx="6.4" cy="${r + 2.4}" r="2.8" fill="none" stroke="#55544e" stroke-width=".12"/>`;
    // The panel shows only this stretch of the back: the wood fades out above it
    out += `<rect x="-22" y="${BACK_TOP - .5}" width="44" height="16" fill="url(#fadeTop)"/>`;
    return out;
  }

  // ----- the words beside the keys -----
  const at = (x, y) => [x, y];
  const LABELS = [
    { k: 'R', f: 'L thumb', name: 'Register', at: at(-4.6, 344), side: 'back' },
    { k: 'T', f: 'L thumb', name: 'Thumb plate', at: at(-8.6, 363), side: 'back' },
    { k: 'rest', f: 'R thumb', name: 'Thumb rest', at: at(-9.4, 603), side: 'back' },
    { k: 'A', f: 'L1', name: 'A', at: at(8.4, 353), side: 'R' },
    { k: 'Gs', f: 'L1', name: 'G♯', at: at(34, 342), side: 'R' },
    { k: 'L1', f: 'L1', name: 'E', at: at(10.4, 378), side: 'R' },
    { k: 'HH', f: 'L1', name: 'Half-hole', at: at(.6, 375.4), side: 'R' },
    { k: 'L2', f: 'L2', name: 'D', at: at(10.4, 418), side: 'R' },
    { k: 'Eb', f: 'L2', name: 'E♭ / B♭', at: at(20, 431), side: 'R' },
    { k: 'L3', f: 'L3', name: 'C', at: at(10.6, 452), side: 'R' },
    { k: 'LCs', f: 'L4', name: 'C♯ / G♯', at: at(26, 484), side: 'R' },
    { k: 'LF', f: 'L4', name: 'F / C', at: at(44, 489), side: 'R' },
    { k: 'LE', f: 'L4', name: 'E / B', at: at(28.6, 504), side: 'R' },
    { k: 'LFs', f: 'L4', name: 'F♯ / C♯', at: at(43.6, 511), side: 'R' },
    { k: 'S1', f: 'R1', name: 'Side 1', at: at(-43, 552), side: 'L' },
    { k: 'S2', f: 'R1', name: 'Side 2', at: at(-43.4, 565.2), side: 'L' },
    { k: 'S3', f: 'R1', name: 'Side 3', at: at(-35, 576), side: 'L' },
    { k: 'S4', f: 'R1', name: 'Side 4', at: at(-35.4, 590), side: 'L' },
    { k: 'R1', f: 'R1', name: 'B♭', at: at(-10.8, 596), side: 'L' },
    { k: 'R2', f: 'R2', name: 'A', at: at(-10.8, 641), side: 'L' },
    { k: 'BF', f: 'R2', name: 'B / F♯', at: at(-14, 659), side: 'L' },
    { k: 'R3', f: 'R3', name: 'G', at: at(-11.2, 676), side: 'L' },
    { k: 'RFs', f: 'R4', name: 'F♯ / C♯', at: at(-40, 689), side: 'L' },
    { k: 'RE', f: 'R4', name: 'E / B', at: at(-44, 703), side: 'L' },
    { k: 'REb', f: 'R4', name: 'Low E♭', at: at(-28, 731), side: 'L' },
    { k: 'RGs', f: 'R4', name: 'G♯ / D♯', at: at(5, 695), side: 'R' },
    { k: 'RF', f: 'R4', name: 'F / C', at: at(6, 715), side: 'R' },
  ];

  const BASS_STYLE = `
    #clarinet .ring.plate .tint { opacity: .6; }
    #clarinet .plate .vcover { display: none; }
    #clarinet .plate.on .vcover { display: inline; }
    #clarinet .plate.on.half .vcover { display: none; }
    #clarinet .plate.on .pad { display: none; }
    #clarinet .plate.on.half .vent circle:nth-child(2) { stroke: #fff; stroke-width: 2.2; }
    #clarinet .cup .cwg { opacity: .62; }
    #clarinet .cup.on .cwg { opacity: .3; }
    #clarinet .cup.vent .vmark { display: none; }
    #clarinet .cup.vent.isopen .vmark { display: inline; }
    #clarinet .cup.vent.isopen .face { transform: translate(-.9px, -1.1px); }
  `;

  function keysMarkup() {
    return rodsMarkup() + sidePlateMarkup() + postsMarkup() + topMarkup() + leftHandMarkup() + sideKeysMarkup() + leftLittleMarkup() +
      rightHandMarkup() + lowMarkup() + rightLittleMarkup();
  }

  function sceneMarkup() {
    K.startShadows('tubeB');
    const keys = keysMarkup();
    const sil = K.takeShadows();
    const extraDefs = `<defs>
      <clipPath id="tubeB"><rect x="${-HW * S}" y="${Y.bodyTop * S}" width="${2 * HW * S}" height="${(Y.bodyEnd - Y.bodyTop) * S}"/></clipPath>
      <filter id="tubeSoft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".22"/></filter>
      <linearGradient id="mpSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2b30"/><stop offset=".18" stop-color="#121215"/><stop offset=".55" stop-color="#060607"/><stop offset=".85" stop-color="#16171a"/><stop offset="1" stop-color="#030304"/></linearGradient>
      <linearGradient id="reedG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8975e"/><stop offset=".6" stop-color="#d9c08a"/><stop offset="1" stop-color="#e9d6a6"/></linearGradient>
      <linearGradient id="ligSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f6e68"/><stop offset=".2" stop-color="#f4f4f1"/><stop offset=".45" stop-color="#c9c8c2"/><stop offset=".6" stop-color="#55544e"/><stop offset=".8" stop-color="#e9e8e3"/><stop offset="1" stop-color="#77766f"/></linearGradient>
      <linearGradient id="plateHorizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#3a3c43" stop-opacity=".12"/><stop offset=".62" stop-color="#2c2e35" stop-opacity=".42"/><stop offset=".78" stop-color="#4b4e56" stop-opacity=".22"/><stop offset=".92" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
      <linearGradient id="armTopN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a19e94"/><stop offset=".3" stop-color="#fdffff"/><stop offset=".55" stop-color="#8d8a80"/><stop offset="1" stop-color="#cfccc3"/></linearGradient>
      <radialGradient id="bellInside" cx=".42" cy=".6" r=".7"><stop offset="0" stop-color="#9d9c96"/><stop offset=".35" stop-color="#e9e8e3"/><stop offset=".7" stop-color="#fbfbf9"/><stop offset=".9" stop-color="#c9c8c2"/><stop offset="1" stop-color="#8d8c86"/></radialGradient>
      <linearGradient id="rimG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d8c86"/><stop offset=".25" stop-color="#fbfbf9"/><stop offset=".55" stop-color="#c9c8c2"/><stop offset=".8" stop-color="#f4f4f1"/><stop offset="1" stop-color="#77766f"/></linearGradient>
      <radialGradient id="throat" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2a2b30" stop-opacity=".75"/><stop offset=".55" stop-color="#55565c" stop-opacity=".35"/><stop offset="1" stop-color="#9d9c96" stop-opacity="0"/></radialGradient>
      <linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="restPlastic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3b40"/><stop offset=".45" stop-color="#16171a"/><stop offset=".8" stop-color="#2e2f34"/><stop offset="1" stop-color="#0a0a0c"/></linearGradient>
      <radialGradient id="rubber" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4a4b50"/><stop offset=".5" stop-color="#18191c"/><stop offset="1" stop-color="#050506"/></radialGradient>
    </defs>`;
    return `<style>${STYLE}${BASS_STYLE}</style>${defsMarkup()}${extraDefs}
      <g id="cl-back" transform="translate(-215 0)">
        <text id="backCaption" x="0" y="262" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#374151">Back</text>
        ${backMarkup()}
      </g>
      <g id="cl-body">
        ${bowBellMarkup()}
        ${neckMarkup()}
        ${mouthpieceMarkup()}
        ${neckKeyMarkup()}
        ${woodMarkup()}
        ${stamp(0, 232, .9, 'Bass')}
        ${stamp(0, 566, .8)}
        <g clip-path="url(#clip-bupper)"><g transform="${KEYS}">${castShadow(sil, 7, 9, 'shBroad', .55)}${castShadow(sil, 8, 4, 'shCrisp', .85)}</g></g>
        <g clip-path="url(#clip-blower)"><g transform="${KEYS}">${castShadow(sil, 7, 9, 'shBroad', .55)}${castShadow(sil, 8, 4, 'shCrisp', .85)}</g></g>
        ${collarsMarkup()}
        <g transform="${KEYS}">${keys}</g>
      </g>
      <g class="labels">${labelsMarkup(LABELS)}</g>`;
  }

  function cupStates(keys) {
    const has = k => keys.has(k);
    const anyE = has('LE') || has('RE');
    const anyF = has('LF') || has('RF');
    const anyFs = has('LFs') || has('RFs');
    const low = has('REb');                                    // low E♭ closes its own pad and every pad above it
    const rightPlates = (has('R1') || has('R2')) && !has('BF');
    return {
      opened: {
        A: has('A'), Gs: has('Gs') || has('A'), Eb: has('Eb') || has('S4'), T1: has('S1'), T2: has('S2'),
        // One register key, two vents: the right third finger down opens the one on the body, up the one on the neck
        R: has('R') && has('R3'), NV: has('R') && !has('R3'),
        RGs: has('RGs'), Cs: has('LCs'),
      },
      closed: {
        P: has('T') || has('L1'),
        C: rightPlates,
        Bv: has('R1'),                                         // the vent tucked under the first right-hand plate
        Ev: has('L2') || rightPlates,
        Fs: anyE || anyF || anyFs || low,
        F: anyE || anyF || low,
        E: anyE || low,
        LEb: low,
      },
    };
  }

  // The half-hole: the first plate down with its vent open
  function decorate(svg, keys) {
    const l1 = svg.querySelector('.plate[data-k="L1"]');
    if (l1) l1.classList.toggle('half', keys.has('HH'));
    svg.querySelectorAll('.carmN').forEach(el => el.classList.toggle('on', keys.has('R') && !keys.has('R3')));
  }

  CA.register('bass', {
    scene: sceneMarkup,
    cupStates,
    decorate,
    photoScale: S,
    views: { whole: [-262, 40, 474, 1108], close: [-124, 250, 268, 512], closeTall: [-152, 250, 256, 512] },
    back: { whole: -215, close: -118, tallWhole: -190, tallClose: -124 },
    labelX: { R: 46, Rtall: 40, L: -46, back: -26 },
    captionY: 259,
  });
  CA.bass = { keysMarkup, NECK, BELL_AXIS };
})(window);

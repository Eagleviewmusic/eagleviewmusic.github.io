// Virtual Clarinet — the 3D bass clarinet (the model only).
// A school bass clarinet to low E♭, laid out like the flat drawing (clarinet-bass.js, after the Yamaha YCL-221II): seven
// covered plates instead of rings, a plated swan neck with its own register vent, a plated bow and upturned bell, a floor
// peg. The viewer (camera, labels, studio, reflections, taking apart) and every small builder are clarinet-3d.js's: it
// calls buildBass(K) with its kit of builders, so both clarinets are made of the same parts and lit the same way.
//
// The frame is the B♭'s: the model lies along +x, x = s = millimetres DOWN the instrument (the flat drawing's y: 120 = the
// top of the body, 539 = the middle joint, 976 = its foot), +z = the front (the plates), +y = the PLAYER'S LEFT, θ round
// the body from the front toward the player's left. The neck curls back toward the player (-z); the bow and bell come
// forward (+z), as on the instrument. A point [x, y] of the flat drawing is (s = y, dx = x).

const DEG = Math.PI / 180;
const RB = s => s < 539 ? 20 : 20 + 0.3 * Math.min(1, (s - 539) / 427);   // the body is 40 mm across
const bellR = t => 26 + 13 * t + 29 * Math.pow(t, 6.5);                  // narrow for two thirds, then a hard flare to the mouth (136 mm)

function linkage(keys) {
  const has = k => keys.has(k), closed = new Set(), moved = new Set();
  const anyE = has('LE') || has('RE'), anyF = has('LF') || has('RF'), anyFs = has('LFs') || has('RFs'), low = has('REb');
  const rightPlates = (has('R1') || has('R2')) && !has('BF');
  if (has('T') || has('L1')) closed.add('P');
  if (rightPlates) closed.add('C');
  if (has('R1')) closed.add('Bv');
  if (has('L2') || rightPlates) closed.add('Ev');
  if (anyE || anyF || anyFs || low) closed.add('Fs');
  if (anyE || anyF || low) closed.add('F');
  if (anyE || low) closed.add('E');                                       // the low E♭ key closes its own pad and every pad above it
  if (low) closed.add('LEb');
  if (has('A')) moved.add('Gs');
  // one register key, two vents: the right third finger down opens the one on the body, up the one on the neck
  if (has('R')) moved.add(has('R3') ? 'RV' : 'NV');
  return { closed, moved };
}

export const BASS = {
  RB, rootY: 592, floorS: 1127.5,
  JOINTS: ['mp', 'neck', 'upper', 'lower', 'bell'],
  jointOf: s => s < 113 ? 'neck' : s < 539 ? 'upper' : s < 962 ? 'lower' : 'bell',
  // taken apart: the mouthpiece comes off along its own line, the neck lifts out, the bow and bell drop off the foot
  APART: { mp: [-66, 0, -62], neck: [-42, 0, 0], upper: 0, lower: 0, bell: [56, 0, 0] },
  reach: [60, 60], mix: [250, 700], shadow: { half: 240, cz: -24 }, label: '3D bass clarinet',
  capsules: W3 => [{ id: 'body', a: W3(118), b: W3(978), r: 19.6 }, { id: 'bell', a: W3(1000, 0, 68), b: W3(850, 0, 96), r: 28 }],
  refl: (joints, V3) => [
    { obj: joints.upper, a: V3(120, 0, 0), u: V3(1, 0, 0), r: 20, L: 419 },
    { obj: joints.lower, a: V3(539, 0, 0), u: V3(1, 0, 0), r: 20.15, L: 427 },
  ],
  // (the "front" is a little toward the player's right, so the bell does not stand in front of the low keys)
  VIEWS: {
    front: { az: -26, el: 6 },
    left:  { az: 90, el: 5 },
    back:  { az: 180, el: 5 },
    right: { az: -90, el: 5 },
    keys:  { az: -12, el: 5, x: [246, 748], zoom: true },
    mouth: { az: -90, el: 8, x: [40, 190], zoom: true },
    lh:    { az: -14, el: 6, x: [240, 600], zoom: true },
    rh:    { az: 12, el: 5, x: [540, 760], zoom: true },
    bell:  { az: -40, el: 12, x: [740, 1142], zoom: true },
  },
  linkage,
  CHIP_LIST: [
    ['T', 'LT', 'Thumb plate'], ['R', 'LT', 'Register', true], ['A', 'L1', 'A', true], ['Gs', 'L1', 'G♯', true],
    ['L1', 'L1', 'E'], ['L2', 'L2', 'D'], ['Eb', 'L2', 'E♭ / B♭', true], ['L3', 'L3', 'C'], ['LCs', 'L4', 'C♯ / G♯', true],
    ['LF', 'L4', 'F / C', true], ['LFs', 'L4', 'F♯ / C♯', true], ['LE', 'L4', 'E / B', true],
    ['S1', 'R1', 'Side 1', true], ['S2', 'R1', 'Side 2', true], ['S3', 'R1', 'Side 3', true], ['S4', 'R1', 'Side 4', true],
    ['R1', 'R1', 'B♭'], ['R2', 'R2', 'A'], ['BF', 'R2', 'B / F♯', true], ['R3', 'R3', 'G'],
    ['RFs', 'R4', 'F♯ / C♯', true], ['RE', 'R4', 'E / B', true], ['RGs', 'R4', 'G♯ / D♯', true], ['RF', 'R4', 'F / C', true], ['REb', 'R4', 'Low E♭', true],
  ],
  PICK_LIST: {
    T: ['Thumb plate', 'LT'], R: ['Register key', 'LT'], A: ['A key', 'L1'], Gs: ['G♯ key', 'L1'], L1: ['First finger plate (E), with the half-hole vent', 'L1'], L2: ['Second finger plate (D)', 'L2'],
    Eb: ['E♭ / B♭ key', 'L2'], L3: ['Third finger plate (C)', 'L3'], LCs: ['C♯ / G♯ key', 'L4'], LF: ['F / C lever', 'L4'], LFs: ['F♯ / C♯ lever', 'L4'], LE: ['E / B lever', 'L4'],
    S1: ['Side key 1', 'R1'], S2: ['Side key 2', 'R1'], S3: ['Side key 3', 'R1'], S4: ['Side key 4', 'R1'],
    R1: ['First finger plate (B♭)', 'R1'], R2: ['Second finger plate (A)', 'R2'], BF: ['B / F♯ key', 'R2'], R3: ['Third finger plate (G)', 'R3'],
    RFs: ['F♯ / C♯ key', 'R4'], RE: ['E / B key', 'R4'], RGs: ['G♯ / D♯ key', 'R4'], RF: ['F / C key', 'R4'], REb: ['Low E♭ key', 'R4'],
    P: ['G cup (closed by the thumb plate or the first finger)', ''], Ev: ['E cup (closed by the second finger, or by the right hand)', ''],
    C: ['B♭ cup (closed by the right hand\'s first or second finger)', ''], Bv: ['Vent cup (closed by the right first finger)', ''],
    Fs: ['F♯ / C♯ pad', ''], F: ['F / C pad', ''], E: ['E / B pad', ''], LEb: ['Low E♭ pad, on the bell', ''],
    RV: ['Register vent on the body (opens with the right third finger down)', ''], NV: ['Register vent on the neck (opens with the right third finger up)', ''],
  },
  staticName(owner, mat, s, z) {
    if (owner === 'mp') return mat === 'reed' ? 'Reed' : mat === 'lig' ? 'Ligature' : mat === 'cork' ? 'Tenon cork' : 'Mouthpiece';
    if (owner === 'neck') return 'Neck';
    if (owner === 'bell') return mat === 'ebonite' ? 'Floor peg tip' : z < -20 && mat === 'silver' ? 'Floor peg' : mat === 'silver' ? 'Bell ring' : 'Bell';
    if (mat === 'cork') return 'Tenon cork';
    if (mat === 'ebonite' || mat === 'rest') return 'Thumb rest';
    if (mat === 'silver') return s < 128 ? 'Neck socket' : Math.abs(s - 539) < 8 ? 'Joint ring' : z < -19 && (Math.abs(s - 578) < 7 || Math.abs(s - 470) < 7) ? 'Strap ring' : 'Rod and posts';
    return owner === 'upper' ? 'Upper joint' : 'Lower joint';
  },
};

export function buildBass(K) {
  const { THREE, V3, AX, AY, AZ, clamp, smooth, sweep, lathe, place, spline, densify, rad, nrm, tan, wrap, wrapTh, ball, plateGeo, withUV, X, disc, rodSeg,
    cupH, cupGeo, padGeo, seatGeo, lever, leverP, plate, flat, tearXY, capPad, leverZ, dense, initRods, M, joints, statics, add, addTo, plain,
    fingers, reflCups, mkPart, partAdd, chooseSign, onRod, sleeve, cupOn, cupArm, openCup, rocker } = K;
  const P3 = (s, z, y = 0) => V3(s, y, z);
  // ---- posts (2026-11-20 b): turned pillars, not the B♭'s ball heads (an outside judge: "the balls are what most gives the
  //      model away"): a flared foot 7 mm across on the wood, a 4.8 mm pillar, and a barrel head round the rod, its ends
  //      rounded, lying along the rod (`axis`) ----
  const barrel = (at, axis, r = 2.7, len = 5.4) => { const h = len / 2; return place(lathe([[-h, 0], [-h, r - 0.75], [-h + 0.2, r - 0.3], [-h + 0.65, r], [h - 0.65, r], [h - 0.2, r - 0.3], [h, r - 0.75], [h, 0]], { segs: 32, crease: 50 }), at, axis); };
  // (a pillar with a rounded cap: the rod runs through its upper end; a barrel head lying along the rod read as a cotton reel)
  const post = (s, th, R, o = {}) => {
    const n = nrm(th), a = rad(s, th, RB(s) - 0.4), L = rad(s, th, R).distanceTo(a), r = o.r || 2.45, top = L + 0.5, prof = [[0, 0], [0, 3.6], [0.35, 3.55], [0.7, 3.15], [1.05, 2.7], [1.5, r + 0.05], [top, r]];
    for (let k = 1; k <= 8; k++) { const q = k / 8 * Math.PI / 2; prof.push([top + 1.7 * Math.sin(q), r * Math.cos(q)]); }
    return [place(lathe(prof, { segs: 32, crease: 60 }), a, n)];
  };
  // a pivot screw's head, flush with the end of a hinge tube or a post: a 2.5 mm disc with its slot
  const screw = (at, out, r = 1.25) => [place(lathe([[0, 0], [0, r], [0.12, r], [0.2, r - 0.12], [0.2, 0]], { segs: 20, crease: 40 }), at, out)];
  const rodStatic = (rd, posts) => {
    add('silver', rodSeg(rd.a, rd.b, rd.r));
    for (const s of posts) {
      const q = rd.at(s), hr = Math.max(2.3, rd.r + 0.85);
      add('silver', ...post(s, rd.th, Math.hypot(q.y, q.z), { axis: rd.dir, r: hr }));
      if (Math.abs(s - rd.s0) < 0.01 || Math.abs(s - rd.s1) < 0.01) {     // an end post: its pivot screw's head and slot on the outer end
        const out = rd.dir.clone().multiplyScalar(Math.abs(s - rd.s0) < 0.01 ? -1 : 1), e = q.clone().addScaledVector(out, hr - 0.02);
        add('silver', ...screw(e, out));
        const across = nrm(rd.th), third = out.clone().cross(across).normalize(), g = new THREE.BoxGeometry(0.45, 0.4, 2.3), m = new THREE.Matrix4().makeBasis(third, out, across);
        m.setPosition(e.clone().addScaledVector(out, 0.14)); g.applyMatrix4(m); add('dark', g);
      }
    }
  };
  // ---- the bass's cups (2026-11-24, after t64-mid / u4-mid / u2-c): ONE family on the whole instrument. Each is a thick
  //      little drum: a straight wall 3-4 mm high, a crisp chamfered shoulder and a nearly flat top (they were thin
  //      coins with a low dome, and the low pads the B♭'s shallow cones) ----
  // (round 2, after the first blind review: the rim a 1 mm fillet, not a hard chamfer; the top a shallow cone rising to
  // the point where the arm lands, 0.7 mm on a small cup and 1.3 mm on a low pad, its apex rounded, as on u1-top)
  const wallB = r => 2.6 + 0.07 * r;                                      // r 5 → 2.95, 7.7 → 3.1, 14.5 → 3.6 (round 3: a little lower)
  const riseB = r => 0.09 * r, HB = r => wallB(r) + riseB(r);             // the height of the middle of its top
  const filletB = (hT, r, f) => { const q = [[0.3, r - 0.75], [0, r - 0.3], [0.3, r], [hT - f, r]]; for (let k = 1; k <= 8; k++) { const a = k / 8 * Math.PI / 2; q.push([hT - f + f * Math.sin(a), r - f + f * Math.cos(a)]); } return q; };
  const coneB = k => (Math.sqrt(k * k + 0.0144) - 0.12) / (Math.sqrt(1.0144) - 0.12);   // 0 at the middle, 1 at the rim, the apex rounded
  const bCup = r => {
    const hT = wallB(r), f = 1.0, R = r - f, prof = filletB(hT, r, f);
    for (let k = 1; k <= 14; k++) { const u = 1 - k / 14; prof.push([hT + riseB(r) * (1 - coneB(u)), R * u]); }
    return lathe(prof, { segs: 72, crease: 28 });
  };
  // (its seat: a raised black ring nearly as wide as the cup, so the cup sits low on the body, not on a narrow stalk)
  // (round 4: the seat only as high as the tone hole needs, about 1 mm lower than the B♭'s rule, and narrower than the
  // cup, which overhangs it by a millimetre and more; at 0.9 of the cup's width it stood out like a grommet)
  const seatB = (seat, n, r) => add('wood', place(lathe([[-7, r * 0.78], [-1.15, r * 0.78], [-0.85, r * 0.72], [-0.85, r * 0.6]], { segs: 48, crease: 40 }), seat.clone(), n));
  const lower = c => { const sh = Math.min(c.sh, RB(c.s) - Math.sqrt(Math.max(1, RB(c.s) * RB(c.s) - 0.36 * c.r * c.r)) + 0.95); c.sh = sh; c.seat = rad(c.s, c.th, RB(c.s) + sh); return c; };
  const asB = (c, calc) => { lower(c); c.geo = bCup; c.top = c.seat.clone().addScaledVector(c.n, HB(c.r)); if (!calc) seatB(c.seat, c.n, c.r); return c; };
  const cupTh0 = K.cupTh, cupTh = (th, s, r, calc) => asB(cupTh0(th, s, r), calc), cupAtB = (dx, s, r) => asB(K.cupAt(dx, s, r));
  const toP = p => [Math.atan2(p.y, p.z) / DEG, Math.hypot(p.y, p.z), p.x];   // a point as [th, R, s], for leverP
  // A plump touch (2026-11-21): a teardrop LOFTED from its round end A to its neck B, so its face is one smooth swelling
  // with no crease (a plate drawn round a centre folds along the rays into a narrow neck). pt(u, v) = the point of its
  // plane at the front view's [dx, s]; n = the plane's outward normal; w, wn = widths at the belly and the neck;
  // o.thick / o.tn = how far the face stands above the plane at the belly / the neck; the back is flatter (o.back).
  const loft = (pt, n, A, B, w, wn, o = {}) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), N = 46, segs = 40, aW = (o.wf || 0.3) * L, tk = o.thick || 2.3, tn = o.tn || 1.0, bk = o.back || 0.45;
    const belly = a => Math.sqrt(Math.max(0, 1 - Math.pow((aW - a) / aW, 2))), fade = a => (1 + Math.cos(Math.PI * clamp((a - aW) / (L - aW), 0, 1))) / 2;
    const P = [], hw = [], ht = [];
    for (let i = 0; i <= N; i++) {
      const a = L * Math.pow(i / N, 1.5);
      P.push(pt(A[0] + (B[0] - A[0]) * a / L, A[1] + (B[1] - A[1]) * a / L));
      hw.push(a <= aW ? w / 2 * belly(a) : wn / 2 + (w - wn) / 2 * fade(a)); ht.push(a <= aW ? tk * Math.pow(belly(a), 0.85) : tn + (tk - tn) * fade(a));
    }
    const g = sweep(P, 1, { up: n, segs }), q = g.attributes.position, T = P[N].clone().sub(P[0]).normalize(), Bv = T.clone().cross(n).normalize(), W = segs + 1;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= segs; j++) {
      const a = j / segs * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), v = P[i].clone().addScaledVector(n, c * ht[i] * (c >= 0 ? 1 : bk)).addScaledVector(Bv, sn * hw[i]);
      q.setXYZ(i * W + j, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const nr = g.attributes.normal;                                        // (the seam down the middle of the face: one normal, not two)
    for (let i = 0; i <= N; i++) { const a = i * W, b = a + segs, m = V3(nr.getX(a) + nr.getX(b), nr.getY(a) + nr.getY(b), nr.getZ(a) + nr.getZ(b)).normalize(); nr.setXYZ(a, m.x, m.y, m.z); nr.setXYZ(b, m.x, m.y, m.z); }
    for (let j = 0; j <= segs; j++) nr.setXYZ(j, -T.x, -T.y, -T.z);
    return g;
  };
  // A skin swept along a bent centre line P (2026-11-21, little-finger pass): its section a rounded box (a superellipse:
  // sq 2 = an ellipse, 4 = nearly square) hw either side, standing hf over the line and hb under it along a normal that
  // starts as n0 and is carried down the line without twisting. f(S, L) = { hw, hf, hb, sq, ridge (a crown along the
  // middle of the top), off (the section moved sideways) } at S mm along it. So one piece can be a spoon at one end and
  // a flat strap at the other with no step between. Where hw is 0 the end closes to a point; o.cap shuts the far end flat.
  const skin = (P, n0, f, o = {}) => {
    const n = P.length, segs = o.segs || 40, W = segs + 1, S = [0];
    for (let i = 1; i < n; i++) S[i] = S[i - 1] + P[i].distanceTo(P[i - 1]);
    const L = S[n - 1], g = sweep(P, 1, { up: n0, segs, capB: !!o.cap }), q = g.attributes.position, N = V3(), T0 = V3(), tip = f(0, L).hw < 1e-6;
    let last = null;
    for (let i = 0; i < n; i++) {
      const T = P[Math.min(n - 1, i + 1)].clone().sub(P[Math.max(0, i - 1)]).normalize();
      if (!i) { N.copy(n0).addScaledVector(T, -n0.dot(T)).normalize(); T0.copy(T); }
      else { const ax = last.clone().cross(T), sn = ax.length(); if (sn > 1e-9) N.applyAxisAngle(ax.divideScalar(sn), Math.atan2(sn, last.dot(T))); N.addScaledVector(T, -N.dot(T)).normalize(); }
      last = T;
      let B = T.clone().cross(N); const s = f(S[i], L), e = 2 / (s.sq || 2), rg = s.ridge || 0, off = s.off || 0;
      // (s.roll: the section turned that many radians about the line here, without disturbing the carried normal;
      // s.aim + s.aw: its face turned that share of the way toward the direction s.aim)
      let Nn = s.roll ? N.clone().multiplyScalar(Math.cos(s.roll)).addScaledVector(B, Math.sin(s.roll)) : N;
      if (s.aim && s.aw > 0) { const t = s.aim.clone().addScaledVector(T, -s.aim.dot(T)).normalize(); Nn = Nn.clone().lerp(t, s.aw).normalize(); }
      if (s.roll || (s.aim && s.aw > 0)) B = T.clone().cross(Nn);
      for (let j = 0; j <= segs; j++) {
        const a = j / segs * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), cx = Math.sign(c) * Math.pow(Math.abs(c), e), sy = Math.sign(sn) * Math.pow(Math.abs(sn), e);
        const v = P[i].clone().addScaledVector(Nn, cx >= 0 ? cx * (s.hf + rg * (1 - sy * sy)) : cx * s.hb).addScaledVector(B, off + sy * s.hw);
        q.setXYZ(i * W + j, v.x, v.y, v.z);
      }
      if (o.cap && i === n - 1) {                                        // the flat end: its centre, then a copy of the last ring
        const c = P[i].clone().addScaledVector(Nn, (s.hf - s.hb) / 2).addScaledVector(B, off);
        q.setXYZ(n * W, c.x, c.y, c.z);
        for (let j = 0; j <= segs; j++) q.setXYZ(n * W + 1 + j, q.getX(i * W + j), q.getY(i * W + j), q.getZ(i * W + j));
      }
    }
    g.computeVertexNormals();
    const nr = g.attributes.normal;                                        // (the seam: one normal, not two)
    for (let i = 0; i < n; i++) { const a = i * W, b = a + segs, m = V3(nr.getX(a) + nr.getX(b), nr.getY(a) + nr.getY(b), nr.getZ(a) + nr.getZ(b)).normalize(); nr.setXYZ(a, m.x, m.y, m.z); nr.setXYZ(b, m.x, m.y, m.z); }
    if (tip) for (let j = 0; j <= segs; j++) nr.setXYZ(j, -T0.x, -T0.y, -T0.z);
    if (f(L, L).hw < 1e-6) { const Te = P[n - 1].clone().sub(P[n - 2]).normalize(); for (let j = 0; j <= segs; j++) nr.setXYZ((n - 1) * W + j, Te.x, Te.y, Te.z); }
    return g;
  };
  // points along a polyline at the given distances along it
  const resample = (P, at) => {
    const out = []; let i = 1, acc = 0;
    for (const t of at) {
      while (i < P.length - 1 && acc + P[i].distanceTo(P[i - 1]) < t) { acc += P[i].distanceTo(P[i - 1]); i++; }
      const d = P[i].distanceTo(P[i - 1]) || 1; out.push(P[i - 1].clone().lerp(P[i], clamp((t - acc) / d, 0, 1)));
    }
    return out;
  };
  // distances for resample: fine near the round end (where the outline turns fast), then every `step` mm
  const stations = (L, aR, step = 0.7) => { const at = []; for (let k = 0; k <= 14; k++) at.push(aR * Math.pow(k / 14, 1.7)); for (let s = aR + step; s < L; s += step) at.push(s); at.push(L); return at; };

  // A cup's arm (2026-11-24, after t64-mid / t99-lower): broad where it leaves its hinge tube, tapering all the way to a
  // point at the middle of the cup, with a ridge down its back (the B♭'s is an even flat ribbon with a pointed end).
  // rise = how far the cup's top stands above its rim at the middle (negative for a dished finger plate).
  const armB = (c, th1, R1, w = 4.4, o = {}) => {
    const rise = o.rise != null ? o.rise : riseB(c.r), pw = o.pow || 1, k0 = o.k0 || 0;   // (k0: it stops that far short of the middle, for the first plate's vent)
    let d = th1 - c.th; while (d > 180) d -= 360; while (d < -180) d += 360;
    const tg = tan(c.th).multiplyScalar(Math.sign(d) || 1), on = k => c.top.clone().addScaledVector(tg, c.r * k).addScaledVector(c.n, -0.1 - rise * Math.pow(Math.min(k, 0.9), pw));
    const rim = on(1.07).addScaledVector(c.n, -0.45), th0 = Math.atan2(rim.y, rim.z) / DEG, R0 = Math.hypot(rim.y, rim.z);
    let e = c.th + d - th0; while (e > 180) e -= 360; while (e < -180) e += 360;
    const P = [on(k0), on(k0 + (0.9 - k0) / 3), on(k0 + 2 * (0.9 - k0) / 3), on(0.9), rim];
    for (let k = 1; k <= 6; k++) { const u = k / 6; P.push(rad(c.s, th0 + e * u, Math.max(RB(c.s) + 1.5, R0 + (R1 + 0.8 - R0) * smooth(0, 1, u)))); }
    // (round 3: a ridged wedge: a point at the middle, 3 mm wide at the rim, `w` at its hinge tube, 2.4 mm high with a
    // ridge down its back and a flat underside; the round 2 arm thinned to a needle on the cup)
    const C = spline(P, 60), L = lengthOf(C), Sr = c.r * (1.0 - k0);
    return skin(resample(C, stations(L, 0.01, 0.5)), c.n, S => {
      // (round 4: lower and flatter: its point 1.5 mm wide and under a millimetre proud of the cup, the ridge growing
      // only toward the rim; in round 3 it stood 3 mm off the middle of the cup like a tusk)
      const hw = S < 0.02 ? 0 : S < Sr ? 0.75 * smooth(0, 1.4, S) + 0.75 * S / Sr : 1.5 + (w / 2 - 1.5) * smooth(Sr, L, S);
      return { hw, hf: 0.22 + 0.5 * smooth(0, Sr, S), hb: 0.3 + 0.45 * smooth(0, 0.6 * Sr, S), ridge: 0.55 * smooth(0.2 * Sr, 1.1 * Sr, S), sq: 4 };
    }, { segs: 24, cap: true });
  };
  const openCupB = (id, c, rd, o = {}) => {
    const p = onRod(id, rd, c.s, { angle: o.angle || 6, out: c.n, anchor: c.top.clone(), size: c.r, restUp: true });
    cupOn(p, c);
    const a = rd.at(c.s);
    partAdd(p, 'key', armB(c, rd.th, Math.hypot(a.y, a.z), o.w || 4.0, o.arm), sleeve(rd, ...(o.tube || [c.s - 3.4, c.s + 3.4])));
    chooseSign(p, c.seat, c.n);
    return p;
  };

  // ---- tools for the bent tubes: a point and the tube's direction a way along a path; a band round it there ----
  const along = (P, S) => {
    let acc = 0;
    for (let i = 1; i < P.length; i++) { const d = P[i].distanceTo(P[i - 1]); if (acc + d >= S) return { p: P[i - 1].clone().lerp(P[i], (S - acc) / d), T: P[i].clone().sub(P[i - 1]).normalize() }; acc += d; }
    const n = P.length; return { p: P[n - 1].clone(), T: P[n - 1].clone().sub(P[n - 2]).normalize() };
  };
  const lengthOf = P => { let L = 0; for (let i = 1; i < P.length; i++) L += P[i].distanceTo(P[i - 1]); return L; };
  const band = (P, S, w, r0, r1) => { const { p, T } = along(P, S); return place(lathe([[-w / 2, r0], [-w / 2, r1 - 0.35], [-w / 2 + 0.35, r1], [w / 2 - 0.35, r1], [w / 2, r1 - 0.35], [w / 2, r0]], { segs: 72, crease: 30 }), p, T); };
  const upOf = T => V3(T.z, 0, -T.x);                                    // across a tube lying in the s-z plane: its upper / outer side

  // ---- the neck: up out of the body, over toward the player, down a little, and up again to the mouthpiece ----
  // (drawn like a turtle: a = the way it is heading, 0 = up, 90 = toward the player)
  const NK = (() => {
    const pts = [[0, 113]]; let z = 0, s = 113, a = 0;
    const step = L => { z -= Math.sin(a * DEG) * L; s -= Math.cos(a * DEG) * L; pts.push([z, s]); };
    const go = L => { const n = Math.ceil(L / 1.2); for (let i = 0; i < n; i++) step(L / n); };
    const turn = (r, da) => { const n = Math.ceil(Math.abs(da) / 2.5); for (let i = 0; i < n; i++) { a += da / n / 2; step(r * Math.abs(da) / n * DEG); a += da / n / 2; } };
    go(6); turn(38, 152); go(10); turn(46, -82); go(26);                // (a straight run into the ferrule the mouthpiece fits on, as on the photographs)
    return { P: densify(pts.map(([z, s]) => P3(s, z)), 1.2), end: P3(s, z), axis: P3(Math.cos(a * DEG), Math.sin(a * DEG)) };   // axis: from the mouthpiece's tip toward the neck
  })();
  const NP = NK.P, NL = lengthOf(NP);
  // a stout tube, 25.5 mm at the body, tapering to 18.5 at the ferrule the mouthpiece pushes onto (measured on the Thomann
  // neck photograph: the neck by the mouthpiece is a little over half the mouthpiece's width)
  const neckR = S => 12.75 - 3.5 * Math.pow(Math.min(1, S / (NL - 14)), 1.35);
  addTo('neck', 'neck', sweep(NP, (S) => neckR(S), { segs: 72 }));
  addTo('neck', 'neck', X(lathe([[112.5, 12.4], [136, 12.4], [136.4, 12.0], [136.4, 9.6]], { segs: 48, crease: 40 })));      // its tenon, inside the body
  addTo('neck', 'dark', place(disc(9.6), V3(136.5, 0, 0), AX), place(disc(9.4), along(NP, NL - 0.2).p.addScaledVector(NK.axis, -0.3), along(NP, NL).T));
  // the ferrule at its foot, a joint ring over the top of the curve, and the collar the mouthpiece butts against
  addTo('neck', 'silver', plain(X(lathe([[100.6, 13.2], [100.6, 15.5], [101, 15.95], [112.5, 15.95], [113, 15.5], [113, 12.4]], { segs: 72, crease: 30 }))),
    plain(band(NP, 92, 1.7, 10.4, neckR(92) + 0.75)));
  // the ferrule at the top (2026-11-20 b): a plain cylinder 13 mm long at the mouthpiece's width, a stepped edge toward the
  // neck with a fine bead (the photographs' receiver; a smooth funnel read as a bulb)
  {
    const E = along(NP, NL), r0 = neckR(NL);
    addTo('neck', 'neck', place(lathe([[-13.8, r0 - 0.3], [-13.8, r0 + 0.5], [-13.6, 13.2], [-13.3, 13.75], [-12.9, 14.15], [-12.4, 14.75], [-11.6, 14.95], [-10.8, 14.75], [-0.4, 14.75], [0, 14.35], [0, 10]], { segs: 72, crease: 30 }), E.p, E.T));
  }

  // ---- the mouthpiece: the B♭'s (already in the 'mp' piece), a size larger, pushed onto the end of the neck with the reed underneath ----
  {
    // (it has no tenon of its own: its socket goes over the neck's cork, so the B♭'s tenon and cork come off and the base is closed)
    statics.mp.cork.length = 0; statics.mp.dark.length = 0; statics.mp.ebonite.splice(1);
    { const cap = X(lathe([[70.6, 14.05], [71, 13.7], [71, 9.2], [69, 9.2]], { segs: 56, crease: 40 })), q = cap.attributes.position;   // (cut flat by the table: no lip below the reed's heel)
      for (let i = 0; i < q.count; i++) if (q.getZ(i) < -9.4) q.setZ(i, -9.4);
      cap.computeVertexNormals(); addTo('mp', 'ebonite', cap); }
    const k = [1.5, 1.3, 1.3], a = NK.axis, zl = P3(-a.z, a.x);
    const m = new THREE.Matrix4().makeBasis(a.clone().multiplyScalar(k[0]), AY.clone().multiplyScalar(k[1]), zl.multiplyScalar(k[2]));
    m.setPosition(NK.end.clone().addScaledVector(a, -71 * k[0]));
    for (const list of Object.values(statics.mp)) for (const g of list) g.applyMatrix4(m);
  }

  // ---- the body: two joints, deep black, a plated socket for the neck, a ring where they meet ----
  M.wood.color.set(0x242326); M.wood.map = null; M.wood.envMapIntensity = 1.05; M.wood.roughness = 0.6;
  const tubeU = X(lathe(dense([[120, 13.2], [120, 19.7], [120.3, 20], [538.8, 20], [539, 19.85], [539, 13]], 2), { segs: 96, crease: 40 }));
  tubeU.userData.tube = true; addTo('upper', 'wood', tubeU);
  const tubeL = X(lathe(dense([[539, 13], [539, 19.85], [539.2, 20], [965.7, 20.3], [966, 20.0], [966, 17.2], [983.6, 17.2], [984, 16.8], [984, 12]], 2), { segs: 96, crease: 40 }));
  tubeL.userData.tube = true; addTo('lower', 'wood', tubeL);
  addTo('lower', 'cork', X(lathe([[969.5, 17.2], [969.5, 17.5], [980.5, 17.5], [980.5, 17.2]], { segs: 48, crease: 40 })));
  addTo('lower', 'dark', place(disc(12), V3(984.1, 0, 0), AX));
  addTo('upper', 'silver', plain(X(lathe([[112.8, 12.6], [112.8, 20.4], [113.2, 21.1], [115, 21.2], [115.2, 20.9], [115.5, 21.15], [116.6, 21.15], [116.8, 20.9], [117.1, 21.35], [125.6, 21.35], [126, 20.95], [126, 20.1]], { segs: 96, crease: 30 }))));
  addTo('upper', 'dark', X(lathe([[112.9, 12.6], [137, 12.6], [137, 9.5]], { segs: 40, crease: 40 })));
  // the socket's clamp screw, out at the player's left
  addTo('upper', 'silver', plain(place(lathe([[0, 0], [0, 2.6], [0.4, 3.0], [4.6, 3.0], [5, 2.6], [5, 0]], { segs: 24, crease: 40 }), V3(119, 20.6, 0), AY)),
    plain(place(lathe([[0, 0], [0, 1.3], [3.2, 1.3], [3.4, 3.6], [3.8, 4.0], [5.6, 4.0], [6.1, 3.4], [6.3, 0]], { segs: 32, crease: 40 }), V3(119, 25.4, 0), AY)));
  // (2026-11-20 b: 11 mm, 0.8 proud, a 1 mm bead at each edge, as on the Thomann photographs; it was 14 mm with three grooves)
  addTo('lower', 'silver', plain(X(lathe([[533.5, 19.9], [533.5, 20.65], [533.65, 20.95], [534.0, 21.15], [534.45, 21.12], [534.7, 20.95], [534.9, 20.85], [536.5, 21.0], [539, 21.06], [541.5, 21.0], [543.1, 20.85], [543.3, 20.95], [543.55, 21.12], [544.0, 21.15], [544.35, 20.95], [544.5, 20.65], [544.5, 19.9]], { segs: 96, crease: 30 }))));

  // ---- the bow and the bell: one plated piece, down under the foot of the body, round, and up in front ----
  {
    const pts = [], rr = [], BC = 34;                                    // (BC: the bow's centre-line radius)
    for (let i = 0; i <= 12; i++) { pts.push(P3(972 + 28 * i / 12, 0)); rr.push(21.25); }
    for (let i = 1; i <= 52; i++) { const a = (180 - 180 * i / 52) * DEG; pts.push(P3(1000 + BC * Math.sin(a), BC + BC * Math.cos(a))); rr.push(21.25 + 4.75 * smooth(0.05, 1, i / 52)); }
    const BT = t => P3(1000 - 182 * t, 2 * BC + 14 * t + 30 * Math.pow(t, 2.3));
    for (let i = 1; i <= 92; i++) { const t = i / 92; pts.push(BT(t)); rr.push(bellR(t)); }
    addTo('bell', 'tube', sweep(pts, rr, { segs: 128 }));
    // the inside, as far down as you can see, and the rolled rim (a 4 mm bead)
    const ins = [], ri = [];
    for (let i = 3; i <= 92; i++) { const t = i / 92; ins.push(BT(t)); ri.push(bellR(t) - 1.1); }
    const inner = sweep(ins, ri, { segs: 128, inside: true });
    // (vertex colours: bright at the rim, dark by the throat, and warmer the deeper you look: light that bounces round
    // inside plated metal several times comes out cream to gold, as in every product photograph of this bell)
    { const W = 129, col = new Float32Array(inner.attributes.position.count * 3);
      for (let v = 0; v < inner.attributes.position.count; v++) { const t = (3 + Math.floor(v / W)) / 92, k = 0.05 + 0.95 * Math.pow(smooth(0.0, 0.97, t), 1.9), w = 1 - smooth(0.62, 1.0, t);
        col[v * 3] = k; col[v * 3 + 1] = k * (1 - 0.12 * w); col[v * 3 + 2] = k * (1 - 0.34 * w); }
      inner.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
    addTo('bell', 'tube', inner);
    addTo('bell', 'dark', place(disc(bellR(3 / 92) - 1), BT(3 / 92), BT(0.05).sub(BT(0.03)).normalize()));
    const tip = BT(1), dir = BT(1).sub(BT(0.985)).normalize(), R1 = bellR(1), rim = [];
    for (let k = 0; k <= 32; k++) { const a = (-205 + 320 * k / 32) * DEG; rim.push([0.4 + 2.6 * Math.sin(a), R1 - 0.6 + 2.6 * Math.cos(a)]); }   // (a 5 mm rolled bead)
    addTo('bell', 'tube', place(lathe(rim, { segs: 160, crease: 80 }), tip, dir));
    const BP = []; for (let i = 0; i <= 92; i++) BP.push(BT(i / 92));
    addTo('bell', 'silver', plain(band(BP, 11, 5.2, 24, bellR(0.06) + 1.15)), plain(band(BP, 19, 1.4, 24, bellR(0.104) + 0.8)));
    // the socket that takes the foot of the body
    addTo('bell', 'silver', plain(X(lathe([[957.6, 20.4], [957.6, 21.3], [958, 21.75], [960, 21.75], [960.2, 21.4], [960.5, 21.6], [961.5, 21.6], [961.7, 21.4], [962, 21.85], [977.4, 21.85], [978, 21.3], [978, 20.6]], { segs: 96, crease: 30 }))));
    addTo('bell', 'dark', X(lathe([[957.7, 20.4], [957.7, 17.6], [985, 17.6], [985, 12]], { segs: 40, crease: 40 })));
    // the floor peg: in a clamp bracketed to the back of the bow, behind the foot of the body; its thumbscrew, the rod, a rubber tip
    const pz = -29.5, p0 = 990;
    addTo('bell', 'silver', plain(place(lathe([[-1, 0], [-1, 6.4], [-0.4, 7.0], [17.4, 7.0], [18, 6.4], [18, 0]], { segs: 40, crease: 35 }), P3(p0, pz), AX)),
      plain(sweep([P3(p0 + 3.5, pz + 5.5), P3(p0 + 3.5, -19.5)], 1, { up: AX, scaleN: 2.4, scaleB: 4.4, sq: 4, segs: 16, capA: true, capB: true })),
      plain(sweep([P3(p0 + 14, pz + 5.5), P3(p0 + 14, -19.8)], 1, { up: AX, scaleN: 2.4, scaleB: 4.4, sq: 4, segs: 16, capA: true, capB: true })),
      plain(place(lathe([[0, 0], [0, 3.3], [136, 3.3], [136, 0]], { segs: 28, crease: 40 }), P3(p0 - 14, pz), AX)),
      plain(place(lathe([[0, 0], [0, 1.4], [5.5, 1.4], [5.8, 4.4], [6.3, 4.9], [9.2, 4.9], [9.8, 4.2], [10, 0]], { segs: 40, crease: 40 }), P3(p0 + 8.5, pz, 6.4), AY.clone())));
    addTo('bell', 'ebonite', place(lathe([[0, 0], [0, 4.4], [1.2, 5.6], [4, 6.3], [11, 6.9], [14.6, 6.9], [16.4, 6.1], [17, 4.6], [17, 0]], { segs: 40, crease: 50 }), P3(1110, pz), AX));
  }

  // ---- the thumb rest on the back of the lower joint, and the rings for a neck strap ----
  {
    const back = lift => (u, v, h) => V3(v, -u, -(RB(v) + (typeof lift === 'function' ? lift(u, v) : lift) + h));
    add('rest', plateGeo([[-4.8, 584], [4.8, 584], [5.2, 597], [-5.2, 597]], [0, 590.5], back(0.5), { thick: 1.6, dome: 0.1, edge: 0.2 }));
    add('ebonite', plateGeo([[-5.2, 595], [5.2, 595], [8, 598.4], [10, 603], [9.4, 606.4], [0, 608], [-9.4, 606.4], [-10, 603], [-8, 598.4]], [0, 601.5], back((u, v) => 1.0 + 11 * Math.pow(smooth(595, 609, v), 1.4) + 0.02 * u * u), { thick: 3.0, dome: 0, edge: 0.3 }));
    for (const s of [587.4, 592.6]) add('silver', place(lathe([[0, 0], [0, 1.3], [0.5, 1.3], [0.75, 1.0], [0.75, 0]], { segs: 16, crease: 40 }), rad(s, 180, RB(s) + 1.0), nrm(180)));
    for (const s of [578, 470]) {
      const ring = new THREE.TorusGeometry(4.0, 1.05, 14, 40); ring.rotateX(Math.PI / 2); ring.translate(s, 0, -(RB(s) + 5.4));
      add('silver', ring, place(lathe([[0, 0], [0, 3.2], [0.5, 3.0], [0.9, 2.0], [2.2, 1.5], [2.2, 0]], { segs: 20, crease: 40 }), rad(s, 180, RB(s) - 0.2), nrm(180)));
    }
  }

  // ======== the keywork ========
  const R_ = initRods({
    LU: { th: -72, R: 25.6, s0: 304, s1: 498, r: 1.7 },        // the left hand's plates, down the player's right (to 498: below it the side keys come forward)
    LL: { th: -72, R: 25.9, s0: 552, s1: 690, r: 1.7 },        // (ends just under the third plate: the little finger's touches sit below)        // the right hand's plates
    Th: { th: 222, R: 24.2, s0: 351, s1: 375, r: 1.3 },        // the thumb plate (on the back)
    Gs: { th: 44, R: 24.6, s0: 288, s1: 344, r: 1.5 },         // the G♯ key's long hinge, front-left, from its cup down to the A key's touch
    Eb: { th: 66, R: 24.0, s0: 389, s1: 437, r: 1.3 },
    Cs: { th: -58, R: 23.8, s0: 492, s1: 520, r: 1.3 },
    Rg: { th: 30, lift: 3.4, s0: 699, s1: 723, r: 1.2 },       // the right little finger's G♯
    Pd: { th: 42, lift: 5.0, s0: 729, s1: 950, r: 1.7 },       // the three low pads' hinge, front-left
    Lk0: { th: 66, lift: 4.6, s0: 604, s1: 722, r: 1.5 },      // the left little finger's three rods, on down toward the low pads
    Lk: { th: 80, lift: 4.2, s0: 609, s1: 727, r: 1.5 },
    Lk2: { th: 94, lift: 4.0, s0: 614, s1: 944, r: 1.5 },
    // the right little finger's four hinge tubes, down the player's right, each starting just under its own touch (2026-11-20 b)
    BF_: { th: -60, lift: 3.4, s0: 715, s1: 850, r: 1.1 },
    BEb: { th: -73, lift: 3.4, s0: 726, s1: 946, r: 1.1 },
    BE: { th: -86, lift: 3.4, s0: 711.5, s1: 926, r: 1.1 },
    BFs: { th: -100, lift: 3.4, s0: 698, s1: 776, r: 1.1 },
  });
  rodStatic(R_.LU, [304, 364, 430, 498]);
  rodStatic(R_.LL, [552, 608, 629, 690]);
  rodStatic(R_.Th, [351, 375], { ball: 2.0 });
  rodStatic(R_.Gs, [288, 344]);
  rodStatic(R_.Eb, [389, 437], { ball: 2.0 });
  rodStatic(R_.Cs, [492, 520], { ball: 2.0 });
  rodStatic(R_.Rg, [699, 723], { ball: 1.9 });
  rodStatic(R_.Pd, [729, 809, 884, 950]);
  rodStatic(R_.Lk0, [604, 660, 722]);
  rodStatic(R_.Lk, [609, 665, 727]);
  rodStatic(R_.Lk2, [614, 700, 820, 944]);
  // (the four bars start side by side under one saddle; each ends at its own post beside its pad)
  rodStatic(R_.BFs, [698, 776]); rodStatic(R_.BE, [711.5, 815, 926]); rodStatic(R_.BF_, [715, 850]); rodStatic(R_.BEb, [726, 835, 946]);

  // A covered plate: a low flat cap with a rolled shoulder and the faintest dish for the fingertip, on an arm from its
  // rod; it stands a few degrees open until the finger closes it. (vent: the first finger's small hole for the half-hole.)
  // (2026-11-24: a drum like the cups, 3.9 mm of straight wall, a crisp chamfer and a flat top with the faintest dish;
  // the first finger's vent a 2.3 mm pinhole, no grommet, as on u4-top)
  // (round 2: the edge a 1 mm fillet, a flat rim 1.3 mm wide, then a dish 0.5 mm deep; the vent a 2.2 mm hole in a
  // 3.6 mm countersink)
  const HPL = 4.4, DISH = 0.32;                                          // (round 3: barely dished; 0.5 read as a bowl)
  const plateCap = (r, vent) => {
    const f = 0.8, Rd = r - f - 1.0, r0 = vent ? 1.8 : 0, prof = filletB(HPL, r, f);
    prof.push([HPL, Rd + 0.5]);
    for (let k = 0; k <= 12; k++) { const rr = r0 + (Rd - r0) * (1 - k / 12); prof.push([HPL - DISH * Math.pow(1 - Math.pow(rr / Rd, 2), 1), rr]); }
    if (vent) prof.push([HPL - DISH - 0.32, 1.15], [HPL - DISH - 0.4, 1.1], [HPL - 2.8, 1.1]);
    return lathe(prof, { segs: 72, crease: 28 });
  };
  const plateKey = (id, th, s, r, rd, o = {}) => {
    const c = lower(cupTh0(th, s, r)); c.top = c.seat.clone().addScaledVector(c.n, HPL - DISH); seatB(c.seat, c.n, r);
    const p = onRod(id, rd, s, { angle: o.angle || 3.0, out: c.n, anchor: c.top.clone(), size: r, restUp: true });
    partAdd(p, 'key', place(plateCap(r, o.vent), c.seat.clone(), c.n)); partAdd(p, 'pad', place(padGeo(r), c.seat.clone(), c.n));
    add('wood', place(seatGeo(r), c.seat.clone(), c.n)); add('dark', place(disc(r * 0.5), c.seat.clone().addScaledVector(c.n, -1.55), c.n));
    p.cups.push(c); reflCups.push({ p, c });
    const a = rd.at(s), R1 = Math.hypot(a.y, a.z);
    partAdd(p, 'key', armB(c, rd.th, R1, o.w || 4.8, { rise: -DISH, pow: 2, k0: o.vent ? 0.34 : 0 }), sleeve(rd, ...(o.tube || [s - 5.6, s + 5.6])));
    if (o.vent) {
      partAdd(p, 'dark', place(disc(1.1), c.seat.clone().addScaledVector(c.n, HPL - 2.7), c.n));
      // a fingertip over the vent (shown while the plate is down and the half-hole is not being played)
      const g = withUV(place(lathe([[0, 3.3], [0.5, 3.2], [0.85, 2.2], [1.0, 0]], { segs: 32 }), c.seat.clone().addScaledVector(c.n, HPL - DISH - 0.1), c.n)); g.translate(-p.pivot.x, -p.pivot.y, -p.pivot.z);
      const f = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0, transparent: true, opacity: 0, depthWrite: false }));
      f.visible = false; f.name = 'finger:' + id; f.renderOrder = 1; p.group.add(f);
      fingers.push({ id, mesh: f, mat: f.material, s, a: 0, to: 0, show: keys => keys.has(id) && !keys.has('HH') });
    }
    chooseSign(p, c.seat, c.n);
    return p;
  };

  // ---- the plates and the open cups between them ----
  // (round 3: every key has its own hinge tube, reaching from post to post or butting on its neighbour's with half a
  // millimetre between, as on wiki-5; they were short collars on one bare rod)
  plateKey('L1', 0, 378, 10.4, R_.LU, { vent: true, tube: [366.8, 386.4] });
  plateKey('L2', 0, 418, 10.4, R_.LU, { tube: [406.9, 427.2] });
  plateKey('L3', 0, 452, 10.6, R_.LU, { tube: [432.8, 495.2] });
  plateKey('R1', 0, 596, 10.8, R_.LL, { tube: [581, 605.2] });
  plateKey('R2', 0, 641, 10.8, R_.LL, { tube: [631.8, 651.5] });
  plateKey('R3', 0, 678, 11.2, R_.LL, { tube: [665.5, 687.2] });
  plateKey('T', 180, 363, 8.6, R_.Th, { w: 4.2, tube: [353.6, 372.4] });
  // (2026-11-24: the small cup under the first plate touches it, so the pair reads as a figure of eight, as on u4-top;
  // the same for the small cup above the right hand's second plate, as on u4-mid)
  // (after the last judge, not re-judged: the half-hole plate is a finger touch, so it is a flat dished disc like the
  // first plate, at the same height, not a coned pad cup)
  { const c = cupTh(0, 394.9, 7.7); c.geo = r => plateCap(r); c.top = c.seat.clone().addScaledVector(c.n, HPL - DISH);
    openCupB('Ev', c, R_.LU, { angle: 3.2, w: 4.4, tube: [386.9, 406.4], arm: { rise: -DISH, pow: 2 } }); }
  openCupB('Bv', cupTh(0, 621.8, 8.1), R_.LL, { angle: 3.2, w: 4.4, tube: [610.8, 626.2] });
  openCupB('C', cupTh(4, 566, 8.4), R_.LL, { angle: 6, w: 4.4, tube: [554.8, 580.5] });
  // (2026-11-21, top keys: the G cup is a full-sized cup on the front, under the A key's arm, on an arm from the plates'
  // rod, as on the photographs; it was a 9 mm cup round at the player's left on a rod of its own)
  openCupB('P', cupTh(5, 329, 7.0), R_.LU, { angle: 5, w: 4.4, tube: [306.8, 361.2] });

  // ---- the A key: a see-saw on a cross axle, its cup high on the front, a slim arm down over the G cup to a teardrop
  //      touch just above the first plate (2026-11-21: the touch 10 mm lower and a true teardrop, the arm pointed on the cup) ----
  {
    const sA = 308, lift = 4.8, cx = 3.4;
    const a0 = wrap(-8.6, sA, lift), a1 = wrap(14.6, sA, lift);
    add('silver', rodSeg(a0, a1, 1.25), ...post(sA, wrapTh(-8.6, sA, lift), Math.hypot(a0.y, a0.z), { axis: a1.clone().sub(a0) }), ...post(sA, wrapTh(14.6, sA, lift), Math.hypot(a1.y, a1.z), { axis: a1.clone().sub(a0) }));
    const rA = 7.7, c = cupAtB(cx, 279.5, rA);
    const T = tearXY([cx, 364.4], [cx, 338.5], 11.4, 3.6, 0.34);
    const pad = plate(T.pts, 8.6, { c: T.centre, thick: 2.3, dome: 0.55, edge: 0.3, NT: 128, NR: 12, NE: 10 });
    const arm = lever([[cx, 280, c.sh + HB(rA) + 0.25], [cx, 290, 6.3], [cx, sA - 3, 6.1], [cx, sA + 3, 6.3], [cx, 320, 6.9], [cx, 331, 7.6], [cx, 341.5, 8.2]], 3.4, 1.7, { taper: (S, L) => 0.22 + 0.78 * smooth(0, 0.1, S / L) });
    const p = rocker('A', { pivot: wrap(cx, sA, lift), axis: AY.clone(), angle: 6, s: sA, size: 5 }, [pad, arm, rodSeg(wrap(cx - 4.6, sA, lift), wrap(cx + 4.6, sA, lift), 1.95)], wrap(cx, 355, 9.8), nrm(0));
    cupOn(p, c);
    partAdd(p, 'key', place(lathe([[0, 0], [0, 1.8], [0.9, 1.8], [1.2, 1.4], [1.2, 0]], { segs: 18, crease: 40 }), wrap(cx, 295, 6.4), nrm(wrapTh(cx, 295, 6))));
  }
  // ---- the G♯ key (2026-11-21, rebuilt from the photographs): its cup beside the A key's, a broad arm arching over the A
  //      key's arm to the top of a long hinge tube down the front-left; at the tube's foot, a long leaf of a touch hanging
  //      beside the A key's touch and the first plate, where the side of the first finger finds it ----
  {
    const rd = R_.Gs, rG = 6.7, c = cupAtB(-10.2, 295, rG), R0 = RB(294), FACE = 46, k = Math.tan(FACE * DEG);
    const arm = sweep(spline([rad(295, c.th, R0 + c.sh + HB(rG) + 0.25), rad(294.6, c.th + 12, R0 + 7.0), rad(294, 8, R0 + 9.0), rad(294, 30, R0 + 7.4), rad(294, rd.th, rd.R)], 30), (S, L) => 0.3 + 0.7 * smooth(0, 0.35, S / L), { up: AX, scaleN: 2.2, scaleB: 0.8, sq: 3, segs: 14, capA: true, capB: true });
    const T = tearXY([27.4, 383], [20.6, 337], 11.8, 4.0, 0.3), cc = T.centre, z0 = 11.6, zAt = u => z0 - k * (u - cc[0]);
    const pad = loft((u, v) => V3(v, u, zAt(u)), nrm(FACE), [27.4, 383], [20.6, 337], 11.8, 4.0, { thick: 1.7, tn: 1.0, wf: 0.3, back: 0.6 });
    const q = rd.at(339), lug = leverZ([[q.y, 339, q.z], [19.2, 338, 17.0], [21.2, 341, zAt(21.2) - 0.7], [22.6, 349, zAt(22.6) - 0.8]], 4.2, 1.9, FACE);
    const p = rocker('Gs', { pivot: rd.at(294), angle: 5.5, s: 294, size: 5 }, [arm, pad, lug, sleeve(rd, rd.s0 + 1.6, rd.s1 - 1.6)], V3(cc[1], cc[0], z0).addScaledVector(nrm(FACE), 1.9), nrm(FACE));
    cupOn(p, c);
  }
  // ---- the E♭ / B♭ key of the left hand: a sliver curling in under the second plate, its pad round the player's left ----
  {
    const rd = R_.Eb, c = cupTh(92, 413, 5.2);
    // (2026-11-24: its touch a slim convex leaf 25 × 5.6 mm lying nearly level between the second and third plates, one
    // piece with its arm from the foot of the hinge tube, as on u4-top; it was a small scoop on a wrapped plate)
    const C = spline([rd.at(434.8), wrap(19.4, 435.1, 4.4), wrap(14, 435.2, 4.9), wrap(7, 435.0, 5.2), wrap(0, 434.6, 5.3), wrap(-5.5, 434.2, 5.2)], 120), Lc = lengthOf(C);
    const pad = skin(resample(C, stations(Lc, 0.01, 0.5)), nrm(rd.th), S => {
      const t = S / Lc, leaf = Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(Math.min(t, 0.86) / 0.86 * 0.8, 0.8))), 0.7), e1 = t > 0.86 ? Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.86) / 0.14, 2))) : 1;
      return { hw: Math.max(S > Lc - 0.02 ? 0 : 0.2, Math.max(1.45 * (1 - smooth(0.2, 0.5, t)), 2.75 * leaf) * e1), hf: 0.9 * Math.pow(e1, 0.3), hb: 0.8 * Math.pow(e1, 0.3), ridge: 0.3 * leaf, sq: 3.6 };
    }, { segs: 32 });
    const p = rocker('Eb', { pivot: rd.at(c.s), angle: 5, s: c.s, size: 3 }, [pad, sleeve(rd, rd.s0 + 1.6, rd.s1 - 1.6), armB(c, rd.th, rd.R, 3.6)], wrap(3, 434.6, 6.4), nrm(wrapTh(3, 434.6, 5)));
    cupOn(p, c);
  }
  // ---- the B / F♯ sliver, between the right hand's second and third plates ----
  {
    // (2026-11-24: a slim flat bar 22 × 4.8 mm with round ends, lying across the front a little aslant, one piece with
    // its arm from the plates' rod, as on u2-c; it was a hollow scoop)
    // (round 2: a 2.6 mm arm 10 mm long, then a narrow convex teardrop 19 × 5.2 mm ending over the middle of the front)
    const rd = R_.LL, C = spline([rd.at(659.2), wrap(-15.5, 659.4, 3.7), wrap(-10, 659.7, 4.5), wrap(-3, 660.1, 5.0), wrap(4, 660.6, 5.1), wrap(9, 661.0, 4.9)], 120), Lc = lengthOf(C), Lb = 19;
    const bar = skin(resample(C, stations(Lc, 0.01, 0.4)), nrm(rd.th), S => {
      const t = clamp((S - (Lc - Lb)) / Lb, 0, 1), tear = t < 0.68 ? Math.pow(Math.sin(Math.PI / 2 * t / 0.68), 1.3) : Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.68) / 0.32, 2)));
      return { hw: S > Lc - 0.02 ? 0 : Math.max(0.03, 1.3 * (t < 0.68 ? 1 : tear) + 1.3 * tear * (t < 0.68 ? 1 : 0) + (t >= 0.68 ? 1.3 * tear : 0)), hf: 0.75 * (t < 0.68 ? 1 : Math.pow(tear, 0.4)), hb: 0.75 * (t < 0.68 ? 1 : Math.pow(tear, 0.4)), ridge: 0.45 * tear, sq: 3 };
    }, { segs: 32 });
    rocker('BF', { pivot: rd.at(659), angle: 4, s: 659, size: 2.6 }, [bar, sleeve(rd, 652, 665)], wrap(2, 660.4, 6.4), nrm(wrapTh(2, 660.4, 5)));
  }

  // ---- the four side keys (right first finger), work order items 5 and 6 (2026-11-21, night; four rounds of blind
  //      review): each is ONE flat bar with crisp edges, 5 × 1.8 mm (4.6 on the short ones), from a pointed arm on its
  //      cup down the player's right 3-4 mm off the wood, kinked out over the C♯ / G♯ key, its last 20 mm bent forward
  //      into its own small touch with a round end that curls out from the body. Each rocks on a hinge tube soldered
  //      across under it, turning on a pin between two posts; the two long ones also rest on guide posts. The touches
  //      are of different sizes and step down like a staircase below the ring, each 13-14 mm lower, 1.5 mm further out and 7° further
  //      round than the one above, and no lever crosses another. (They were thin arcs 7 mm off the wood on a single
  //      saddle post, ending in Z-folded brackets under four equal ovals stacked like beads.) ----
  {
    // a pin across the lane(s) at s between posts at th0 and th1 (R = its height at the posts); at(th) = the point of
    // the pin under a bar at th; tube(a, b) = a hinge tube on it from th a to th b
    const hinge = (s, th0, th1, R) => {
      const a = rad(s, th0, R), b = rad(s, th1, R), ax = b.clone().sub(a).normalize(), m = (th0 + th1) / 2, h = R * Math.cos((th1 - th0) / 2 * DEG);
      add('silver', rodSeg(a, b, 1.0), ...post(s, th0, R, { r: 2.4 }), ...post(s, th1, R, { r: 2.4 }), ...screw(a.clone().addScaledVector(ax, -2.45), ax.clone().negate(), 1.3), ...screw(b.clone().addScaledVector(ax, 2.45), ax, 1.3));
      const at = th => rad(s, th, h / Math.cos((th - m) * DEG));
      return { ax, at, tube: (t0, t1, r = 2.2) => { const p = at(t0), q = at(t1), L = p.distanceTo(q); return place(lathe([[0, 1.0], [0, r - 0.3], [0.3, r], [L - 0.3, r], [L, r - 0.3], [L, 1.0]], { segs: 28, crease: 40 }), p, q.clone().sub(p).normalize()); } };
    };
    const guide = (s, th, under) => add('silver', ...post(s, th, under - 2.2, { r: 2.0 }));   // (its domed head just under the bar)
    // the lever: cup c; its lane [[th, R, s], ...]; its touch hanging down at (th, R) from s0 to s1, w wide, its face
    // turned toward nrm(face); it rocks on hinge hg (its own tube from th tb[0] to tb[1]) at sPiv, under the lane's th there
    const side = (id, c, lane, t, hg, sPiv, thPiv, tb) => {
      const n = c.n, first = rad(lane[0][2], lane[0][0], lane[0][1]), tg = first.clone().sub(c.top); tg.addScaledVector(n, -tg.dot(n)).normalize();
      const top = c.top, tA = rad(t.s0, t.th, t.R), tB = rad(t.s1, t.th, t.R + 1.1), hb0 = t.hw || 2.3;   // (its last few mm curl out from the body)
      const key = [top.clone().addScaledVector(n, 0.3), top.clone().addScaledVector(tg, c.r * 0.5).addScaledVector(n, 0.3), top.clone().addScaledVector(tg, c.r * 0.9).addScaledVector(n, 0.0), top.clone().addScaledVector(tg, c.r * 1.15).addScaledVector(n, -0.6),
        ...lane.map(([th, R, s]) => rad(s, th, R)), tA, tA.clone().lerp(tB, 0.5), tB];
      const C = spline(key, 500), L = lengthOf(C);
      let St = 0; { let best = 1e9, acc = 0; for (let i = 1; i < C.length; i++) { acc += C[i].distanceTo(C[i - 1]); const d = C[i].distanceTo(tA); if (d < best) { best = d; St = acc; } } }
      const Sb = L - 0.5 * t.w, R0 = c.r * 1.5, at = [];
      for (let k = 0; k <= 12; k++) at.push(R0 * Math.pow(k / 12, 1.7));
      for (let s = R0 + 0.6; s < L - 4; s += 0.6) at.push(s);
      for (let k = 0; k <= 16; k++) at.push(L - 4 * Math.pow(1 - k / 16, 1.6));
      const aim = nrm(t.face);
      const bar = skin(resample(C, at), n, S => {
        // (round 3) a pointed spine on the cup like every other key's arm; one crisp flat section 2 mm thick down the
        // lane; at the foot it widens over 9 mm into a flat touch plate 2.5 mm thick with a round end, its face turning
        // toward the finger over 23 mm
        // (round 4: the face turns only part of the way toward the finger, and over 36 mm: a quick full twist warped the tips)
        const tf = smooth(St - 8, St + 4, S);
        const e1 = S > Sb ? Math.sqrt(Math.max(0, 1 - Math.pow((S - Sb) / (L - Sb), 2))) : 1, w0 = hb0 * (0.12 + 0.88 * smooth(0, 1.5 * c.r, S));
        const hw = Math.max(0.12, (w0 + (t.w / 2 - hb0) * tf) * e1), tk = Math.max(0.15, Math.pow(e1, 0.2));
        return { hw, hf: 0.9 * tk, hb: 0.9 * tk, sq: 5.5, aim, aw: 0.7 * smooth(St - 40, St - 4, S) };
      }, { segs: 40 });
      const gs = [bar, hg.tube(tb[0], tb[1])];
      // (pressed, its touch goes about 3 mm toward the wood, whatever its length: a fixed angle buried the long ones)
      const pc = hg.at(thPiv), mid = tA.clone().lerp(tB, 0.45), ang = Math.min(5, 3.2 / Math.max(1, mid.distanceTo(pc)) / DEG);
      const p = rocker(id, { pivot: pc, axis: hg.ax.clone(), angle: ang, s: sPiv, joint: 'upper', size: 4 }, gs, mid.clone().addScaledVector(aim, 1.6), aim);
      cupOn(p, c);
      return p;
    };
    // S1 and S2: the two long ones, each on its own pin (S1's above the plates' rod, S2's a third of the way down)
    // (round 3: the touches a staircase, each 14-15 mm lower, 1.5 mm further out and 7° further round than the one above,
    // and no lever crosses another: S2 comes forward over S3's cup, above S3's lane)
    side('S1', cupTh(-64, 252, 5.2), [[-74, 24.8, 261], [-82, 24.5, 273], [-86, 24.4, 288], [-86, 24.4, 400], [-86, 24.4, 472], [-86, 26.6, 486], [-84.5, 27.6, 505], [-80, 28.6, 521], [-74.5, 29.7, 536]],
      { th: -70, R: 30.5, s0: 547.5, s1: 558, w: 8.2, face: -62, hw: 2.5 }, hinge(286, -64, -108, 24.2), 286, -85.5, [-70.6, -101.4]);
    side('S2', cupTh(-104, 300, 5.0), [[-110, 24.7, 307], [-115, 24.5, 318], [-116, 24.4, 332], [-116, 24.4, 400], [-116, 24.4, 470], [-116, 28.0, 486], [-116, 30.2, 500], [-113, 30.4, 515], [-105, 30.8, 530], [-97, 31.0, 542], [-90, 31.4, 552], [-85, 31.8, 558]],
      { th: -78, R: 32.0, s0: 562, s1: 571.5, w: 7.6, face: -70, hw: 2.4 }, hinge(388, -101, -134, 23.8), 388, -116, [-107.2, -127.8]);
    for (const [s, th] of [[340, -86], [400, -86], [460, -86], [330, -116], [450, -116]]) guide(s, th, 23.4);
    // S3 and S4: the short ones, their cups under the C♯ / G♯ pad, both on one pin across under the ring
    const h34 = hinge(548, -95, -139, 24.2);
    side('S3', cupTh(-110, 526, 4.6), [[-108, 24.4, 534], [-108, 24.4, 553], [-106, 24.9, 560], [-100, 26.4, 565.5], [-93, 28.6, 569.5], [-88, 31.0, 572.5]],
      { th: -85, R: 33.5, s0: 575.5, s1: 585, w: 7.2, face: -77, hw: 2.3 }, h34, 548, -108, [-101, -115.3]);
    side('S4', cupTh(-126, 524.5, 4.6), [[-124, 24.6, 532], [-124, 24.6, 556], [-123, 24.8, 565], [-117, 26.0, 574], [-108, 28.2, 580.5], [-100, 31.0, 585], [-95, 33.6, 587.5]],
      { th: -92, R: 35.0, s0: 589, s1: 597.5, w: 6.8, face: -84, hw: 2.3 }, h34, 548, -124, [-116.7, -132.5]);
  }

  // ---- the register key (left thumb): one spatula, two vents. The body's vent pad is a see-saw on the same axle; the
  //      neck's is a lever along the top of the neck, lifted by a rod that runs up the back of the body ----
  {
    const sA = 322, lift = 3.6, pv = rad(sA, 180, RB(sA) + lift);
    const a0 = V3(sA, 5.2, -(RB(sA) + lift)), a1 = V3(sA, -11.4, -(RB(sA) + lift - 2.6));
    add('silver', rodSeg(a0, a1, 1.2), ...post(sA, 180 - Math.atan2(5.2, RB(sA) + lift) / DEG, Math.hypot(a0.y, a0.z), { axis: a1.clone().sub(a0) }), ...post(sA, 180 + Math.atan2(11.4, RB(sA) + lift - 2.6) / DEG, Math.hypot(a1.y, a1.z), { axis: a1.clone().sub(a0) }));
    // (round 3: the touch a lever 4.4 mm wide and 2.4 thick with a ridge, widening into a teardrop for the thumb; the
    // vent's arm a ridged wedge ending in a point on an 11 mm cup; both were flat cut-outs with no visible thickness)
    const bk = (v, y, L) => V3(v, y, -(RB(v) + L)), ptsOf = (f, a, b) => { const o = []; for (let v = a; Math.abs(v - b) > 0.3; v += Math.sign(b - a) * 0.6) o.push(f(v)); o.push(f(b)); return o; };
    const Ps = ptsOf(v => bk(v, 0.4, 3.4 + 2.6 * smooth(326, 351, v)), 323.2, 353), Ls = lengthOf(Ps);
    // (round 4: blades 2 mm thick, not rods: the touch 5 mm wide at the axle widening at once into a crowned teardrop
    // 10.5 mm across; the vent's arm 5 mm at the axle and 3.5 at its cup, in one easy S)
    const spat = skin(Ps, nrm(180), S => { const t = S / Ls, tear = t < 0.7 ? smooth(0.1, 0.7, t) : Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.7) / 0.3, 2))), e1 = t < 0.7 ? 1 : Math.pow(tear, 0.35);
      return { hw: S > Ls - 0.02 ? 0 : Math.max(0.05, t < 0.7 ? 2.5 + 2.75 * tear : 5.25 * tear), hf: 1.0 * e1, hb: 1.0 * e1, ridge: 0.2 + 0.7 * (t < 0.7 ? tear : tear), sq: 4 }; }, { segs: 32 });
    rocker('R', { pivot: pv, axis: AY.clone(), angle: 5, s: sA, size: 4.5 }, [spat, rodSeg(V3(sA, 2.4, pv.z), V3(sA, -1.6, pv.z), 1.85)], rad(344, 180, RB(344) + 6.6), nrm(180));
    // the body's vent: its pad high up, a long arm down to the axle
    const c = cupTh(180, 284, 5.6), hC = c.sh + HB(5.6);
    const Pa = ptsOf(v => bk(v, -3.4 * smooth(298, 321, v), v > 290 ? 3.5 + (hC - 0.1 - 3.5) * smooth(312, 291, v) : hC - 0.1 - riseB(5.6) * Math.min(0.9, (v - 284) / 5.6)), 322.6, 284), La = lengthOf(Pa);
    const arm = skin(Pa, nrm(180), S => { const d = La - S, k = Math.min(1, d / 5.6); return { hw: d < 0.02 ? 0 : 0.75 * smooth(0, 1.4, d) + 1.0 * k + 0.75 * smooth(6, La, d), hf: 0.25 + 0.75 * smooth(0, 5, d), hb: 0.3 + 0.7 * smooth(0, 4, d), ridge: 0.3 * smooth(0.5, 5, d), sq: 4.5 }; }, { segs: 24 });
    const pV = mkPart('RV', { pivot: pv, axis: AY.clone(), angle: 5, s: sA, joint: 'upper', out: nrm(180), anchor: c.top.clone(), size: 5 });
    partAdd(pV, 'key', arm, rodSeg(V3(sA, -1.9, pv.z), V3(sA, -6.6, pv.z), 1.85));
    cupOn(pV, c); chooseSign(pV, c.seat, c.n);
    add('silver', place(lathe([[-2, 2.2], [1.4, 2.2], [1.55, 2.0], [1.55, 1.4]], { segs: 20, crease: 40 }), rad(c.s, 180, RB(c.s)), nrm(180)));
    // the rod up the player's right of the back to the top of the body, and the plated blade at its top that lifts the
    // neck key's tail
    const th = -142, RR = 22.9;
    add('silver', rodSeg(rad(321, th, RR), rad(131, th, RR), 1.1), ...post(300, th, RR, { r: 2.3 }), ...post(258, th, RR, { r: 2.3 }), ...post(215, th, RR, { r: 2.3 }), ...post(173, th, RR, { r: 2.3 }), ...post(131, th, RR, { r: 2.3 }),
      sweep(spline([rad(321, th, RR), rad(322, -150, RR + 0.2), a1.clone()], 12), 1, { up: AX, scaleN: 1.7, scaleB: 0.8, sq: 4, segs: 14, capA: true, capB: true }));
    addTo('upper', 'silver', sweep(spline([rad(131, th, RR + 0.6), rad(121, -122, 23.3), rad(113.4, -104, 23.4), V3(110.6, -19.4, -1.6)], 30), 1, { up: AX, scaleN: 2.6, scaleB: 0.95, sq: 4, segs: 16, capA: true, capB: true }));

    // the neck key (2026-11-24, round 3; two outside judges could not read the old strip along the neck's side): a
    // cup on the outer side of the lower bend, a pointed arm from its middle back along the underside of the neck to a
    // hinge tube between two posts, and a flat tail on along the same line, under the crook, turning out to the
    // player's right at the socket, where its touch rests on the blade the body's register rod lifts
    const Sp = NL - 54, Sh = Sp - 27, rC = 5.8;
    const nB = S => upOf(along(NP, S).T).negate(), bel = (S, h) => { const a = along(NP, S); return a.p.addScaledVector(upOf(a.T).negate(), neckR(S) + h); };
    const q = along(NP, Sp), nq = nB(Sp), rq = neckR(Sp), seat = q.p.clone().addScaledVector(nq, rq + 1.7), topC = seat.clone().addScaledVector(nq, HB(rC));
    addTo('neck', 'silver', place(lathe([[-1.5, 4.3], [1.9, 4.3], [2.2, 4.0], [2.2, 3.1]], { segs: 28, crease: 40 }), q.p.clone().addScaledVector(nq, rq), nq));
    addTo('neck', 'dark', place(disc(3.1), q.p.clone().addScaledVector(nq, rq + 1.5), nq));
    const pivot = bel(Sh, 2.2), pad0 = V3(107.6, -21.0, -0.6);
    const pN = mkPart('NV', { pivot, axis: AY.clone(), angle: 3.2, s: pivot.x, joint: 'neck', out: nq, anchor: topC.clone(), size: 5 });
    // (one piece from the point on the cup to the foot: over the rim, along the underside, through the hinge, and round
    // to the player's right over the last 25 mm)
    const back = q.T.clone().negate(), P = [0, 0.4, 0.8].map(k => topC.clone().addScaledVector(back, rC * k).addScaledVector(nq, -0.1 - riseB(rC) * k));
    P.push(topC.clone().addScaledVector(back, rC * 1.15).addScaledVector(nq, -0.3), bel(Sp - rC - 5, 2.4));
    for (let S = Sp - rC - 9; S > 40; S -= 4) P.push(bel(S, S > Sh ? 2.2 : 1.9));
    for (const [S, w, h] of [[36, 0.12, 1.9], [30, 0.4, 2.1], [24, 0.72, 2.4], [18, 0.93, 2.6], [13.5, 1, 2.6]]) { const a = along(NP, S), d = nB(S).lerp(AY.clone().negate(), w).normalize(); P.push(a.p.addScaledVector(d, neckR(S) + h)); }
    P.push(V3(103.2, -19.8, -0.4), pad0.clone().add(V3(-3.2, 0, 0)));
    const C = spline(P, 260), Lk = lengthOf(C), Sr = rC * 1.1;
    partAdd(pN, 'key', skin(resample(C, stations(Lk, 0.01, 0.6)), nq, S => ({ hw: S < 0.02 ? 0 : S < Sr ? 0.1 + 1.4 * Math.pow(S / Sr, 0.75) : 1.5, hf: 0.25 + 0.8 * smooth(0, 5, S), hb: 0.3 + 0.75 * smooth(0, 4, S), ridge: 0.4 * smooth(1, 5, S) * (1 - smooth(Sr + 16, Sr + 26, S)), sq: 4, aim: AY.clone().negate(), aw: smooth(Lk - 52, Lk - 22, S) }), { segs: 24, cap: true }),
      sweep([pad0.clone().add(V3(-4, 0, 0)), pad0.clone().add(V3(4, 0, 0))], 1, { up: AY, scaleN: 0.65, scaleB: 3.0, sq: 4, segs: 20, capA: true, capB: true }),
      rodSeg(pivot.clone().add(V3(0, -4.2, 0)), pivot.clone().add(V3(0, 4.2, 0)), 1.9, 18), place(bCup(rC), seat.clone(), nq));
    partAdd(pN, 'pad', place(padGeo(rC), seat.clone(), nq));
    chooseSign(pN, seat, nq);
    // its hinge: a pin across under the neck between two posts 12 mm apart, each with a domed head; one guide saddle on the tail
    const dome = (at, dir, r) => place(lathe([[0, 0], [0, r], [0.25, r], [0.5, r * 0.85], [0.8, r * 0.5], [0.9, 0]], { segs: 20, crease: 50 }), at, dir);
    { const a = along(NP, Sh), n = nB(Sh);
      addTo('neck', 'silver', rodSeg(pivot.clone().add(V3(0, -6, 0)), pivot.clone().add(V3(0, 6, 0)), 1.0, 12));
      for (const sg of [-1, 1]) { const e = a.p.clone().add(V3(0, sg * 6, 0)); addTo('neck', 'silver', rodSeg(e.clone().addScaledVector(n, neckR(Sh) - 2.2), e.clone().addScaledVector(n, neckR(Sh) + 3.4), 1.9, 16), dome(e.clone().addScaledVector(n, neckR(Sh) + 3.4), n, 1.9), dome(pivot.clone().add(V3(0, sg * 6, 0)).add(V3(0, sg * 1.9, 0)), V3(0, sg, 0), 1.2)); } }
    { const S = 62, a = along(NP, S), n = nB(S);
      for (const sg of [-1, 1]) { const e = a.p.clone().add(V3(0, sg * 2.5, 0)); addTo('neck', 'silver', rodSeg(e.clone().addScaledVector(n, neckR(S) - 0.8), e.clone().addScaledVector(n, neckR(S) + 3.2), 0.85, 12), dome(e.clone().addScaledVector(n, neckR(S) + 3.2), n, 0.95)); } }
  }

  // ---- the left little finger's cluster (2026-11-21, rebuilt from the photographs; work order items 3, 4 and 8 the same
  //      night, two rounds of blind review): three spoons of different size and lean nested in three layers off the
  //      player's left of the upper joint, with the C♯ / G♯ leaf laid across above them. Each spoon runs on as one piece
  //      into a slim strap that runs down over the joint ring to its own cross pin, where it is soldered to a barrel that
  //      turns on the pin; spacer tubes fill the rest of the pin; below the pins its foot turns in to a hinge tube on the
  //      rod that carries its motion down ----
  {
    const FACE = 42, sF = Math.sin(FACE * DEG), cF = Math.cos(FACE * DEG), nF = nrm(FACE), tF = tan(FACE), D = 26.4;   // the straps' plane: D mm out from the axis
    const zOn = (u, d = D, f = FACE) => (d - u * Math.sin(f * DEG)) / Math.cos(f * DEG);
    const on = (u, v, dd = D, f = FACE) => V3(v, u, zOn(u, dd, f));
    const PD = D - 4.6;                                                    // the cross pins' plane, 4.6 mm under the straps
    const pinAt = (s, a, d = PD) => V3(s, 0, 0).addScaledVector(nF, d).addScaledVector(tF, a);
    const aOf = u => (u - D * sF) / cF;                                   // how far out along the pins a strap at u crosses them
    // A spoon (round 2, after a blind review: no elbows in the stems, teardrop heads, deeper nesting). Its strap runs
    // straight down at u = uS from sS; above sS it bends through o.lean degrees (+ = its top out toward the player's
    // left) on ONE arc of radius o.rho, then runs straight on through its neck (o.ext) and its head (o.Lh long, o.w wide,
    // widest a third of the way from its round top at s = o.sTop). Its head stands o.dz out of the straps' plane, in a
    // plane turned o.th round the body, its face rolled o.roll further; the depth eases back into the plane below sS.
    const spoon = (id, uS, o) => {
      const lam = o.lean * DEG, sg = Math.sign(lam) || 1, al = Math.abs(lam), Lh = o.Lh, Lt = Lh + o.ext, aW = 0.31 * Lh, w = o.w, tk = 1.95, tb = 0.95, ht = 0.8;
      const sS = o.sTop + Lt * Math.cos(lam) + o.rho * Math.sin(al), E = [uS + sg * o.rho * (1 - Math.cos(al)), sS - o.rho * Math.sin(al)];
      const sB = sS - o.rho * Math.sin(al) - o.ext * Math.cos(lam), th = o.th, e = o.rd.at(o.sEnd);
      // (the depth eases back over ~60 mm, so the front spoon's step reads as one gentle slope, not an S)
      const dAt = s => D + o.dz * (1 - smooth(sB - 6, sS + 46, s)), fAt = s => th + (FACE - th) * smooth(sB - 6, sS + 46, s);
      const at = (u, s) => on(u, s, dAt(s), fAt(s));
      const P0 = [];
      for (let t = Lt; t > 0.01; t -= 0.5) P0.push(at(E[0] + Math.sin(lam) * t, E[1] - Math.cos(lam) * t));
      for (let k = 0, n = Math.max(2, Math.ceil(al * o.rho / 0.5)); k <= n; k++) { const f = al * (1 - k / n); P0.push(at(uS + sg * o.rho * (1 - Math.cos(f)), sS - o.rho * Math.sin(f))); }
      // below the bend: dead straight down over the ring and past the pins in the straps' plane, the same width all the
      // way (a wider foot at its own pin read as a wavy strap); a flat lug under it there is soldered to the barrel
      const low = spline([P0[P0.length - 1], at(uS, sS + 10), at(uS, sS + 22), ...(sS + 30 < 540 ? [at(uS, (sS + 22 + 548) / 2)] : []), at(uS, 548), on(uS, o.sPin - 7), on(uS, o.sPin), on(uS, o.sPin + 6),
        ...(o.sPin < 590 ? [on(uS, 596)] : []), V3((595 + o.sEnd) / 2 + 2, (uS + e.y) / 2 + 0.6, (zOn(uS) + e.z) / 2 + 0.9), V3(o.sEnd - 1.5, e.y + 0.3, e.z + 1.2), V3(o.sEnd + 2.5, e.y, e.z + 0.9)], 300);
      const C = [...P0, ...low.slice(1)], P = resample(C, stations(lengthOf(C), aW, 0.7));
      let Sp = 0; { let acc = 0, best = 1e9; for (let i = 1; i < P.length; i++) { acc += P[i].distanceTo(P[i - 1]); const dd = Math.abs(P[i].x - o.sPin) + (P[i].x < 550 ? 1e6 : 0); if (dd < best) { best = dd; Sp = acc; } } }
      const r0 = -(o.roll || 0) * DEG, r1 = (th - FACE) * DEG;
      const body = skin(P, nrm(th), S => {
        if (S <= aW) { const b = Math.sqrt(Math.max(0, 1 - Math.pow((aW - S) / aW, 2))), h = Math.pow(b, 0.85); return { hw: w / 2 * b, hf: tk * h, hb: tb * h, sq: 2.6, roll: r0 }; }
        // (round 3: the head swells out of a 5.2 mm stem within its own length; the stem then eases to the 4 mm strap)
        const fd = (1 + Math.cos(Math.PI * clamp((S - aW) / (Lh - aW), 0, 1))) / 2, f2 = 1 - smooth(Lh, Lt + 18, S), lug = Math.exp(-Math.pow((S - Sp) / 3.4, 4));
        return { hw: 1.9 + 0.5 * f2 + (w / 2 - 2.4) * fd, hf: 0.95 + 0.25 * f2 + (tk - 1.2) * fd, hb: 0.9 + (tb - 0.9) * fd + 0.75 * lug, sq: 2.6 + 1.6 * (1 - fd), roll: r0 * fd + r1 * (1 - fd) };   // (round 2: a rounded shaft 3.3 × 2.25; round 4, after a judge preferred the start build's blades and t64-mid shows strips: a flat strip 3.8 × 1.85 with soft edges; it began as 4 × 1.6)
      }, { segs: 40, cap: true });
      // (item 8: its barrel, 5.2 × 7.2 mm with a collar 0.5 mm proud at each end, wider than the strap and the spacer tubes, so it shows either side)
      const pv = pinAt(o.sPin, aOf(uS)), c = on(E[0] + Math.sin(lam) * (Lt - aW), E[1] - Math.cos(lam) * (Lt - aW), D + o.dz, th);
      // (pressed, a head moves about 1.5 mm: the layers are 1.7-1.9 mm apart in depth where they overlap)
      return rocker(id, { pivot: pv, axis: tF.clone(), angle: 0.85, s: c.x, joint: 'upper', size: 5 }, [body, place(lathe([[-3.6, 0], [-3.6, 2.85], [-3.4, 3.1], [-2.9, 3.1], [-2.7, 2.6], [2.7, 2.6], [2.9, 3.1], [3.4, 3.1], [3.6, 2.85], [3.6, 0]], { segs: 32, crease: 40 }), pv, tF), sleeve(o.rd, o.sEnd, o.sEnd + 13, 0.75)], c.clone().addScaledVector(nrm(th), 2.4), nrm(th));
    };
    // the straps, inner to outer, 5.5 mm apart in their plane (1.5 mm between them); the inner one on the lowest pin
    const SP = [[25.1, 590], [29.2, 580], [33.3, 570]];
    // front layer: the big front spoon, near upright, 7 mm out; middle: the small one, its head under the front one's
    // edge; back: the top one, 2.4 mm in, its neck behind the middle one (head tops 7-10 mm apart)
    // (round 4: all three heads in planes parallel to the straps', so what overlaps in the plane overlaps in the view
    // along it; leans 4°, 12° and 18°, each head over the next one's edge by ~5 mm)
    spoon('LE', SP[0][0], { sPin: SP[0][1], rd: R_.Lk0, sEnd: 611, sTop: 466, lean: 4, rho: 30, Lh: 28, ext: 4, w: 15.0, dz: 5.8, th: 42, roll: -4 });
    spoon('LFs', SP[1][0], { sPin: SP[1][1], rd: R_.Lk, sEnd: 616, sTop: 476, lean: 12, rho: 28, Lh: 22, ext: 4, w: 12.4, dz: 2.6, th: 42, roll: 6 });
    spoon('LF', SP[2][0], { sPin: SP[2][1], rd: R_.Lk2, sEnd: 621, sTop: 459, lean: 18, rho: 26, Lh: 23, ext: 4, w: 13.0, dz: -2.4, th: 42, roll: 10 });
    // the three cross pins: each from a post at the front-left out past the straps; on it the spoon's own barrel, spacer
    // tubes either side with a gap, a collar under each strap that only passes over it, and at the outer end a sleeve
    // cap 6.8 mm long with a stepped rim and a domed screw head (as on u1-bot)
    const aEnd = 27.6;
    for (const [uS, sP] of SP) {
      const a = aOf(uS), end = pinAt(sP, aEnd), cap = [[0, 1.4], [0, 2.1], [0.25, 2.4], [4.6, 2.4], [4.8, 2.2], [5.0, 2.2]];
      for (let q = 1; q <= 10; q++) { const t = q / 10 * Math.PI / 2; cap.push([5.0 + 1.8 * Math.sin(t), 2.2 * Math.cos(t) + 0.0001]); }
      const tube = (a0, a1, r = 1.9) => place(lathe([[0, 1.0], [0, r - 0.25], [0.25, r], [a1 - a0 - 0.25, r], [a1 - a0, r - 0.25], [a1 - a0, 1.0]], { segs: 28, crease: 40 }), pinAt(sP, a0), tF);
      add('silver', rodSeg(pinAt(sP, -1.2), end, 1.1), tube(2.7, a - 4.1), tube(a + 4.1, aEnd - 0.2), place(lathe(cap, { segs: 32, crease: 40 }), end, tF), ...post(sP, FACE, PD, { r: 2.5 }), ...screw(pinAt(sP, -1.25), tF.clone().negate(), 1.3));
      for (const [u2] of SP) if (u2 !== uS && aOf(u2) < aEnd - 2) { const a2 = aOf(u2); add('silver', tube(a2 - 2.3, a2 + 2.3, 2.5)); }
    }
    // the triangular foot the first pin's post stands on, with its screw (as under the ring on the photographs)
    add('silver', plate([[8.6, 562.4], [13.4, 561.8], [18.4, 562.6], [19.2, 564.6], [15.6, 574.6], [13.6, 576.2], [11.6, 574.6], [7.8, 564.4]], 0.55, { thick: 1.1, dome: 0, edge: 0.14 }), ...screw(wrap(13.4, 565.2, 1.1), nrm(wrapTh(13.4, 565.2, 1.1)), 1.5));
    { const at = wrap(13.4, 565.2, 1.32), n = nrm(wrapTh(13.4, 565.2, 1.1)), g = new THREE.BoxGeometry(2.4, 0.4, 0.45), m = new THREE.Matrix4().makeBasis(AX, n, AX.clone().cross(n)); m.setPosition(at); g.applyMatrix4(m); add('dark', g); }

    // ---- the C♯ / G♯ key (item 4): its pad round on the player's right; its arm, one flat bar 5.5 tapering to 4.5 mm and
    //      2 mm thick, leaves a boss on its hinge tube there, runs level across the front under the third plate, then rises
    //      in one S 30 mm high into a leaf 24 × 12.5 mm laid across the top of the cluster, 33° above level, tucked 4 mm
    //      behind the front spoon's top. (It was a 3.4 mm wire that hooked back on itself seen from the side, with a small
    //      upright touch. Round 2: lifted clear of the top spoon, which it passed through when pressed; round 3: shorter,
    //      wider and lower, after a blind review.) ----
    {
      const rd = R_.Cs, c = cupTh(-122, 506, 8.2), dL = 26.4, sJ = 505;
      const A = [30.6, 460.4], B = [10.5, 473.5], Lh = Math.hypot(B[0] - A[0], B[1] - A[1]), aW = 0.36 * Lh, Lt = Lh + 6;
      const cc = [A[0] + (B[0] - A[0]) * 0.36, A[1] + (B[1] - A[1]) * 0.36];
      // (the leaf curls round the body: its round end in a plane at 46°, its neck at 28°, 8 mm off the wood, so seen from
      // the side the arm leaves it in one easy bend, not a hairpin)
      const key = [0, 0.25, 0.5, 0.75, 1].map(k => on(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, dL + (26.8 - dL) * k, 46 - 18 * k));
      // (round 4: the arm stops on the near face of the boss, 4° short of the tube's centre line; it ran on past the
      // centre and showed beyond the tube, so it read as a hook draped over it)
      key.push(wrap(6.5, 476.6, 6.2), wrap(3.5, 480.8, 5.8), wrap(1.8, 486.2, 5.4), wrap(0.6, 492.2, 4.9), wrap(-1.6, 498.2, 4.4), wrap(-5.6, 502.6, 4.0), wrap(-10.4, 504.6, 3.7), wrap(-14.6, 505, 3.5), rad(sJ, rd.th + 4.6, rd.R + 0.4));
      const C = spline(key, 300);
      const touch = skin(resample(C, stations(lengthOf(C), aW, 0.6)), nrm(46), S => {
        if (S <= aW) { const b = Math.sqrt(Math.max(0, 1 - Math.pow((aW - S) / aW, 2))), h = Math.pow(b, 0.85); return { hw: 6.75 * b, hf: 1.9 * h, hb: 1.0 * h, sq: 2.6 }; }
        const fd = (1 + Math.cos(Math.PI * clamp((S - aW) / (Lt - aW), 0, 1))) / 2, g = smooth(Lt, Lt + 40, S);
        return { hw: 2.25 + 0.5 * g + 4.5 * fd, hf: 1.0 + 0.9 * fd, hb: 1.0, sq: 2.6 + 2.0 * (1 - fd) };
      }, { segs: 40, cap: true });
      // its hinge tube, and the boss on it the arm is soldered to: the arm stops on the boss's near face (rounds 2-4: its
      // end ran past the tube's centre and showed beyond it, so it read as a hook draped over the tube)
      const boss = X(lathe([[sJ - 4.6, 0], [sJ - 4.6, 2.5], [sJ - 4.1, 3.05], [sJ + 4.1, 3.05], [sJ + 4.6, 2.5], [sJ + 4.6, 0]], { segs: 28, crease: 40 })).translate(0, rd.at(sJ).y, rd.at(sJ).z);
      const p = rocker('LCs', { pivot: rd.at(506), angle: 3.5, s: 506, size: 4.5 }, [touch, boss, sleeve(rd, rd.s0 + 1.6, rd.s1 - 1.6), armB(c, rd.th, rd.R, 4.0)], on(cc[0], cc[1], dL - 0.8, 40).addScaledVector(nrm(40), 2.0), nrm(40));
      cupOn(p, c);
    }
  }

  // ---- the right little finger's five touches (2026-11-20 b, rebuilt): slim flat spatulas 21 × 8 mm, slightly dished, packed
  //      at the player's right edge of the lower joint in two overlapping rows (outer F♯, E, E♭; inner G♯, F), each pointing
  //      up and out on a short straight arm to the top of its own hinge tube; the tubes run down the player's right to
  //      tongues lying on their pads. (An outside judge: the old ones read as "a bunch of spoons" on looping arms.) ----
  {
    // (2026-11-21, lower keys: three pads on the body, spaced out down to the foot; the fourth, low E♭, is on the bell's bow)
    const PADS = { Fs: [772, 13.0, -10], F: [846, 13.75, -25], E: [922, 14.5, -12] };
    const FACE = -40, sf = Math.sin(FACE * DEG), cf = Math.cos(FACE * DEG), nF = nrm(FACE);
    const zOn = (D, u) => (D - u * sf) / cf;                                 // the touches' plane (D mm out from the axis), at a front-view dx
    const onPl = (D, u, v, h = 0) => V3(v, u, zOn(D, u)).addScaledVector(nF, h);
    // a bar's tongue at its foot, lying on the shoulder of its pad
    // (2026-11-24: it comes over the rim and stops a third of the way in, a foot resting on the flat top)
    const tongue = (rd, pad) => {
      const [sp, r, padTh] = PADS[pad], c = cupTh(padTh, sp, r, true), tg = tan(padTh).multiplyScalar(Math.sign(rd.th - padTh) || 1), H = HB(r), at = (k, h) => c.seat.clone().addScaledVector(tg, r * k).addScaledVector(c.n, h);
      // (round 3: a flat bar 4 × 2 mm, straight from its tube up to the rim, then a short round-ended foot lying on the top)
      const q = rd.at(sp - 0.5), hR = H - riseB(r), e0 = at(1.06, hR + 1.3), C = spline([q, q.clone().lerp(e0, 0.5), e0, at(0.86, hR + 1.25), at(0.66, H - riseB(r) * 0.66 + 1.0)], 60), L = lengthOf(C);
      return skin(resample(C, stations(L, 0.01, 0.5)).reverse(), c.n, S => { const e1 = S < 2 ? Math.sqrt(Math.max(0, 1 - Math.pow((2 - S) / 2, 2))) : 1; return { hw: S < 0.02 ? 0 : Math.max(0.15, 2.0 * e1), hf: Math.pow(e1, 0.3), hb: Math.pow(e1, 0.3), sq: 4.5 }; }, { segs: 24, cap: true });
    };
    // B: the neck of the touch in the front view's [dx, s]; D: its plane; it rocks on rd, its arm meeting the tube at sTop
    // A touch (2026-11-21, little-finger pass): a flat paddle about 2.5 mm thick with a shallow dish for the finger, a full
    // round end and a neck that narrows onto its arm, bowed along its length so that it curls round toward the body. Each
    // has its own length, width, slant and outline (o.L, o.w, o.al = degrees up from level, o.asym = one edge straighter
    // than the other), as on the photographs; they were five copies of one round "cigar". B = the neck in the front
    // view's [dx, s]; D = the plane it lies in; it rocks on rd, its arm meeting the tube at sTop.
    const spatula = (id, rd, B, D, sTop, o = {}) => {
      const L = o.L || 34, al = (o.al || 30) * DEG, w = o.w || 11.5, aR = 0.25 * L, sag = o.sag != null ? o.sag : 0.8, drop = o.drop || 0, curl = o.curl || 0, asym = o.asym || 0;
      // a = mm from the round end along the touch; its point lifted h off the plane, bowed `sag` in the middle, the round end
      // `drop` lower, and its outer 40 % curled `curl` mm further toward the body (about 30° at the tip for 5 mm)
      const at = (a, h = 0) => { const r = L - a, t = a / L; return onPl(D, B[0] - r * Math.cos(al) * cf, B[1] - r * Math.sin(al), h + sag * 4 * t * (1 - t) - drop * (1 - t) - 0.4 * curl * Math.pow(Math.max(0, 1 - t / 0.4), 2)); };   // (round 4: flatter: less bow and curl, so the top reads as a flat face with a bevel, not a pillow)
      // (a blind A/B: running the paddle's own skin on as its arm folded into a hook wherever the tube lies behind the
      // paddle, and a point past its end left a stub; so the paddle closes round at both ends, and its arm, 4 × 2.5 mm,
      // starts hidden under the paddle's second half and leaves from its underside in a swan neck to the top of its tube)
      const Pp = stations(L, aR, 0.6).map(a => at(a)), Ln = lengthOf(Pp);
      // the outline: an oval (o.n: 2 = an ellipse, 3 = squarer), widest o.wf of the way from its round end
      const wf = o.wf || 0.42, n = o.n || 2.6;
      const oval = S => { const u = S <= wf * Ln ? 0.5 * S / (wf * Ln) : 0.5 + 0.5 * (S - wf * Ln) / (Ln - wf * Ln); return Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * clamp(u, 0, 1) - 1), n)), 1 / n); };
      const head = skin(Pp, nF, S => {
        const e = oval(S), r = Math.sqrt(e);
        return { hw: w / 2 * e, hf: 1.3 * r, hb: 1.0 * r, ridge: -0.12 * e, sq: 5.5, off: asym * w * e * (1 - e) * smooth(0.8 * wf * Ln, 1.3 * wf * Ln, S) };
      }, { segs: 48 });
      const q = rd.at(sTop), mid = at(L, -2.5).lerp(q, 0.5); if (o.lift) mid.z += o.lift;
      const arm = sweep(spline([at(0.6 * L, -1.0), at(0.86 * L, -1.9), mid, q], 40), 1, { up: nF, scaleN: 1.25, scaleB: 2.0, sq: 4, segs: 20, capA: true, capB: true });
      const gs = [head, arm, ...(o.extra || [])];
      if (o.pad) { gs.push(tongue(rd, o.pad)); const m = o.mid; if (m) gs.push(sleeve(rd, sTop - 1.2, m - 2.8), sleeve(rd, m + 2.8, rd.s1 - 2.6)); else gs.push(sleeve(rd, sTop - 1.2, rd.s1 - 2.6)); }
      return rocker(id, { pivot: q.clone(), axis: rd.dir.clone(), angle: 4.2, s: sTop, size: 6 }, gs, at(aR, 1.8), nF);
    };
    // (two tiers: the outer three lower, the inner two over their necks; necks 15 mm apart so the paddles lie 1-1.5 mm apart)
    const Dout = 23.5, Din = 27.0;
    spatula('RFs', R_.BFs, [-27, 700], Dout, 700, { pad: 'Fs', L: 33, w: 11.6, al: 35, asym: 0.8, drop: 1.0, curl: 5, n: 2.4, wf: 0.4 });
    spatula('RE', R_.BE, [-27.5, 715], Dout, 715, { pad: 'E', mid: 815, L: 36, w: 12.2, al: 30, asym: 0.15, drop: 1.0, curl: 5.5, n: 3.1, wf: 0.5 });
    {
      // the low E♭ touch: its tube runs the whole way down the joint to a foot that reaches under the bell key's lever
      const rd = R_.BEb, e = rd.at(944.5);
      spatula('REb', rd, [-28, 730], Dout, 730, { L: 32, w: 11.0, al: 25, asym: -0.6, drop: 1.0, curl: 4.5, n: 2.1, wf: 0.35, extra: [sleeve(rd, 728.8, 832.2), sleeve(rd, 837.8, 943.4),
        sweep(spline([e, V3(946.4, e.y - 1.4, e.z + 0.2), V3(948.2, e.y - 2.6, e.z + 0.2)], 10), 1, { up: AX, scaleN: 2.0, scaleB: 0.9, sq: 4, segs: 14, capA: true, capB: true })] });
    }
    spatula('RF', R_.BF_, [-15.5, 720.5], Din, 720.5, { pad: 'F', L: 33, w: 11.4, al: 31, asym: 0.3, drop: 0.6, curl: 1.2, n: 2.8, wf: 0.45 });
    {
      // the G♯: its cup round on the player's left, so its arm crosses the front of the joint to a short tube there
      const rd = R_.Rg, c = cupTh(82, 711, 7.0), q = rd.at(711);
      const p = spatula('RGs', rd, [-15, 705.5], Din, 706, { lift: 2.4, L: 30, w: 11.0, al: 37, asym: 0.7, drop: 0.6, curl: 1.2, n: 2.3, wf: 0.32, extra: [sleeve(rd, 700.6, 721.4), armB(c, rd.th, Math.hypot(q.y, q.z), 4.0)] });
      cupOn(p, c);
    }
    // the four big pads low on the joint, open until the little fingers close them: each on a broad arm to a long hinge tube
    for (const [id, [sp, r, padTh]] of Object.entries(PADS)) {
      openCupB(id, cupTh(padTh, sp, r), R_.Pd, { angle: 6.5, w: 5.6, tube: { Fs: [731.8, 806.2], F: [811.8, 881.2], E: [886.8, 947.2] }[id] });
    }

    // ---- the low E♭ key, on the bell (2026-11-21: the piece that was missing at the bottom). Its tone hole is in the bow,
    //      just under the socket, on the player's right; the big cup hangs from a short hinge across the top of the bow,
    //      and a strap from the hinge runs up over the socket to the foot of the low E♭ touch's tube. It stands open
    //      until that touch closes it, and it stays on the bell when the bell comes off. ----
    {
      const r = 14.5, ph = 11 * DEG, BC = 34, C = V3(1000 + BC * Math.sin(ph), 0, BC - BC * Math.cos(ph)), Rt = 21.3, n = AY.clone().negate(), up = AX.clone().negate();
      const sh = Rt - Math.sqrt(Rt * Rt - 0.36 * r * r) + 1.0, seat = C.clone().addScaledVector(n, Rt + sh), top = seat.clone().addScaledVector(n, HB(r));
      // the chimney soldered on the bow, and the dark of the hole
      addTo('bell', 'tube', place(lathe([[-sh - 4, r * 0.74], [-1.15, r * 0.74], [-0.95, r * 0.7], [-0.95, r * 0.6], [-1.6, r * 0.56]], { segs: 56, crease: 40 }), seat.clone(), n));
      addTo('bell', 'dark', place(disc(r * 0.57), seat.clone().addScaledVector(n, -1.5), n));
      // its hinge: a rod across the bow between two posts, 6 mm above the cup
      const sH = seat.x - r - 5.4, yH = -(Rt + 3.9), h0 = V3(sH, yH, C.z - 9.5), h1 = V3(sH, yH, C.z + 9.5);
      addTo('bell', 'silver', plain(rodSeg(h0, h1, 1.2)), ...[h0, h1].flatMap((h, i) => {
        const R = Math.hypot(h.y, h.z), th = Math.atan2(h.y, h.z) / DEG, out = AZ.clone().multiplyScalar(i ? 1 : -1);
        return [...post(sH, th, R, { r: 2.4 }).map(plain), ...screw(h.clone().addScaledVector(out, 2.42), out, 1.3).map(plain)];
      }));
      const p = mkPart('LEb', { pivot: V3(sH, yH, C.z), axis: AZ.clone(), angle: 5.5, s: seat.x, joint: 'bell', out: n.clone(), anchor: top.clone(), size: r, restUp: true });
      const spine = sweep(spline([top.clone().addScaledVector(n, 0.3), top.clone().addScaledVector(up, r * 0.5).addScaledVector(n, 0.3), top.clone().addScaledVector(up, r * 0.86).addScaledVector(n, 0.05), top.clone().addScaledVector(up, r * 1.04).addScaledVector(n, -0.5), V3(sH + 1.6, yH - 0.7, C.z), V3(sH, yH - 1.2, C.z)], 40),
        (S, L) => 0.1 + 0.9 * smooth(0, 0.3, S / L), { up: n, scaleN: 0.95, scaleB: 2.6, sq: 5, segs: 22, capA: true, capB: true });
      // the strap up over the socket to the touch's foot, with a small button on its end
      const e = R_.BEb.at(946), tipS = V3(948.6, e.y - 3.6, e.z + 0.2);
      const strap = sweep(spline([V3(sH, yH - 1.2, C.z + 4.6), V3(sH - 8, yH - 1.5, e.z - 0.4), V3(966, e.y - 4.1, e.z + 0.1), V3(956, e.y - 3.9, e.z + 0.2), tipS], 40), 1, { up: n, scaleN: 0.85, scaleB: 1.9, sq: 5, segs: 20, capA: true, capB: true });
      partAdd(p, 'key', place(bCup(r), seat.clone(), n), spine, strap, rodSeg(V3(sH, yH, C.z - 7.1), V3(sH, yH, C.z + 7.1), 2.0, 18), ball(tipS, 1.9, 18));
      partAdd(p, 'pad', place(padGeo(r), seat.clone(), n));
      chooseSign(p, seat, n);
    }
  }
}

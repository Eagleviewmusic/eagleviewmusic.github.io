// Virtual Flute — the 3D instrument.
// A silver Boehm flute (closed holes, offset G, B foot) in real millimetres, built entirely in code: geometry,
// studio reflections, everything. No downloads. Every key moves on its rod; the page says which keys a fingering
// presses and this file works out which cups close, the way the mechanism links them.
//
//   import { createFlute } from './flute-3d.js';
//   const f = createFlute(container, { labels: 'off', view: 'front' });
//   f.setKeys(['T', 'L1', 'L2', 'L3', 'Eb'], '#e11d48');
//
// Axes (mm): +x = from the head toward the foot, +y = up, +z = toward the camera in the front view (the way the
// cups face, the side every fingering chart and product photo shows).
// Origin: the centre of the embouchure hole, on the tube's axis. Angles round the tube (θ) are measured from +z
// toward +y: θ = 0 faces the camera, +90 is the top, -90 the bottom, 180 the back.
// The key positions are the ones the page's drawing uses (index.html, OPEN_CUPS and friends): Yamaha's labelled
// parts diagram, Nelson's patent US4819538 for the spacing round the left index finger, and the user's photos.

import * as THREE from './lib/three.module.min.js';
import { OrbitControls } from './lib/OrbitControls.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const AX = V3(1, 0, 0), AY = V3(0, 1, 0), AZ = V3(0, 0, 1);
const RAD = Math.PI / 180;
// The film curve (the trumpet's): straight up to 0.72, then each channel rolls off on its own, so the brightest
// highlights go white the way a camera's do.
const FILM = (() => {
  const key = 'vec3 CustomToneMapping( vec3 color ) { return color; }', ch = THREE.ShaderChunk.tonemapping_pars_fragment || '';
  if (ch.includes('vtFilm')) return true;
  if (!ch.includes(key)) return false;
  THREE.ShaderChunk.tonemapping_pars_fragment = ch.replace(key, 'vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }');
  return true;
})();

/* ------------------------------------------------------------------ *
 *  Geometry tools (from the Virtual Trumpet's trumpet-3d.js)
 * ------------------------------------------------------------------ */
function densify(P, step) {
  const out = [P[0]];
  for (let i = 1; i < P.length; i++) {
    const d = P[i].distanceTo(P[i - 1]), n = Math.ceil(d / step);
    for (let k = 1; k <= n; k++) out.push(P[i - 1].clone().lerp(P[i], k / n));
  }
  return out;
}

function spline(pts, n) { return new THREE.CatmullRomCurve3(pts, false, 'centripetal').getPoints(n); }

// Sweep a (possibly changing) round or squarish section along a path.
// rad: number | array | (s, L, i) => r.   Normals are analytic, so a flare shades smoothly.
function sweep(P, rad, o = {}) {
  const n = P.length, segs = o.segs || 28;
  const S = [0]; for (let i = 1; i < n; i++) S[i] = S[i - 1] + P[i].distanceTo(P[i - 1]);
  const L = S[n - 1];
  const R = []; for (let i = 0; i < n; i++) R[i] = typeof rad === 'function' ? rad(S[i], L, i) : Array.isArray(rad) ? rad[i] : rad;
  const T = [];
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    T[i] = b.clone().sub(a).normalize();
  }
  let N = (o.up || (Math.abs(T[0].z) < 0.9 ? AZ : AX)).clone();
  N.addScaledVector(T[0], -N.dot(T[0])).normalize();
  const kn = o.scaleN || 1, kb = o.scaleB || 1, sq = o.sq || 2, inside = !!o.inside;
  const pos = [], nor = [], uv = [], idx = [];
  const q = new THREE.Quaternion(), dir = V3(), nn = V3(), B = V3();
  for (let i = 0; i < n; i++) {
    if (i > 0) { q.setFromUnitVectors(T[i - 1], T[i]); N.applyQuaternion(q); N.addScaledVector(T[i], -N.dot(T[i])).normalize(); }
    B.crossVectors(T[i], N);
    const dR = i === 0 ? (R[1] - R[0]) / (S[1] - S[0] || 1) : i === n - 1 ? (R[i] - R[i - 1]) / (S[i] - S[i - 1] || 1) : (R[i + 1] - R[i - 1]) / (S[i + 1] - S[i - 1] || 1);
    for (let j = 0; j <= segs; j++) {
      const a = (j / segs) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      let cx = c, sy = s, gx = c / kn, gy = s / kb;
      if (sq !== 2) {
        cx = Math.sign(c) * Math.pow(Math.abs(c), 2 / sq); sy = Math.sign(s) * Math.pow(Math.abs(s), 2 / sq);
        gx = Math.sign(c) * Math.pow(Math.abs(c), 2 * (sq - 1) / sq) / kn; gy = Math.sign(s) * Math.pow(Math.abs(s), 2 * (sq - 1) / sq) / kb;
      }
      dir.set(0, 0, 0).addScaledVector(N, cx * kn).addScaledVector(B, sy * kb);
      pos.push(P[i].x + dir.x * R[i], P[i].y + dir.y * R[i], P[i].z + dir.z * R[i]);
      nn.set(0, 0, 0).addScaledVector(N, gx).addScaledVector(B, gy).normalize().addScaledVector(T[i], -dR).normalize();
      if (inside) nn.negate();
      nor.push(nn.x, nn.y, nn.z);
      uv.push(j / segs, S[i] / (o.uvLen || L || 1));
    }
  }
  const W = segs + 1;
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < segs; j++) {
    const a = i * W + j, b = a + 1, c = a + W, d = c + 1;
    if (inside) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
  }
  const cap = (i, sign) => {
    const base = pos.length / 3, t = T[i];
    pos.push(P[i].x, P[i].y, P[i].z); nor.push(t.x * sign, t.y * sign, t.z * sign); uv.push(0.5, 0.5);
    for (let j = 0; j <= segs; j++) {
      const k = (i * W + j) * 3;
      pos.push(pos[k], pos[k + 1], pos[k + 2]); nor.push(t.x * sign, t.y * sign, t.z * sign); uv.push(0.5, 0.5);
    }
    for (let j = 0; j < segs; j++) { if (sign > 0) idx.push(base, base + 1 + j, base + 2 + j); else idx.push(base, base + 2 + j, base + 1 + j); }
  };
  if (o.capA) cap(0, -1);
  if (o.capB) cap(n - 1, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.userData.rings = n; g.userData.W = W;
  return g;
}

// Surface of revolution about +Y. prof = [[y, r], ...], walked "bottom centre -> out -> up -> in";
// corners sharper than `crease` stay sharp.
function lathe(prof, o = {}) {
  const segs = o.segs || 48, crease = Math.cos((o.crease || 32) * Math.PI / 180);
  const P = prof.filter((p, i) => i === 0 || Math.hypot(p[0] - prof[i - 1][0], p[1] - prof[i - 1][1]) > 1e-6);
  const segN = [];
  for (let i = 0; i < P.length - 1; i++) {
    const dt = P[i + 1][0] - P[i][0], dr = P[i + 1][1] - P[i][1], l = Math.hypot(dt, dr);
    segN.push([-dr / l, dt / l]);
  }
  const rings = [];   // {y, r, ny, nr, v}
  let len = 0;
  for (let i = 0; i < P.length; i++) {
    if (i > 0) len += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    const a = segN[i - 1], b = segN[i];
    if (a && b && a[0] * b[0] + a[1] * b[1] >= crease) {
      const ny = a[0] + b[0], nr = a[1] + b[1], l = Math.hypot(ny, nr);
      rings.push({ y: P[i][0], r: P[i][1], ny: ny / l, nr: nr / l, v: len, brk: false });
    } else {
      if (a) rings.push({ y: P[i][0], r: P[i][1], ny: a[0], nr: a[1], v: len, brk: true });
      if (b) rings.push({ y: P[i][0], r: P[i][1], ny: b[0], nr: b[1], v: len, brk: false });
    }
  }
  const pos = [], nor = [], uv = [], idx = [], W = segs + 1;
  for (const k of rings) for (let j = 0; j <= segs; j++) {
    const a = (j / segs) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    pos.push(k.r * c, k.y, k.r * s); nor.push(k.nr * c, k.ny, k.nr * s); uv.push(j / segs, k.v / (len || 1));
  }
  for (let i = 0; i < rings.length - 1; i++) {
    if (rings[i].brk) continue;                      // the gap between the two copies of a creased ring
    for (let j = 0; j < segs; j++) {
      const a = i * W + j, b = a + 1, c = a + W, d = c + 1;
      idx.push(a, c, b, c, d, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// Stand a lathe (built about +Y from y = 0) at `origin`, pointing along `dir`.
function place(g, origin, dir = AY) {
  const m = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(AY, dir.clone().normalize()));
  m.setPosition(origin);
  return g.applyMatrix4(m);
}

function merge(list) {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), col = new Float32Array(nv * 3).fill(1);
  const idx = new Uint32Array(ni);
  let v = 0, i = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, v * 3); nor.set(g.attributes.normal.array, v * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, v * 2);
    if (g.attributes.color) col.set(g.attributes.color.array, v * 3);
    const src = g.index.array; for (let k = 0; k < src.length; k++) idx[i + k] = src[k] + v;
    v += g.attributes.position.count; i += src.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}


// distance between two segments (squared): is a name tag hidden behind the tube?
const _d1 = V3(), _d2 = V3(), _r = V3();
function segSegDist2(p1, q1, p2, q2) {
  _d1.subVectors(q1, p1); _d2.subVectors(q2, p2); _r.subVectors(p1, p2);
  const a = _d1.dot(_d1), e = _d2.dot(_d2), f = _d2.dot(_r), c = _d1.dot(_r), b = _d1.dot(_d2);
  let s = 0, t = 0;
  if (a > 1e-9 && e > 1e-9) {
    const den = a * e - b * b;
    s = den > 1e-9 ? clamp((b * f - c * e) / den, 0, 1) : 0;
    t = (b * s + f) / e;
    if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); } else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
  } else if (a > 1e-9) s = clamp(-c / a, 0, 1);
  else if (e > 1e-9) t = clamp(f / e, 0, 1);
  const x = _r.x + _d1.x * s - _d2.x * t, y = _r.y + _d1.y * s - _d2.y * t, z = _r.z + _d1.z * s - _d2.z * t;
  return x * x + y * y + z * z;
}


/* ------------------------------------------------------------------ *
 *  Measurements (mm from the embouchure hole's centre)
 * ------------------------------------------------------------------ */
const F = {
  R: 9.5,                 // the tube (19 mm across)
  seat: 11.3,             // a tone hole's chimney rim, from the axis (drawn holes rise ~1.8 mm above the tube)
  cupR: 9.3,              // a body cup (18.6 mm)
  crown: -72.5, headEnd: -62,
  sock: [117.6, 160.2],   // the body's socket: ridged rings at 118 and 160
  bodyEnd: 479.5, footSock: 491.5, end: 654,
  rodBody: { th: -62, R: 17, x0: 216, x1: 476.5 },     // about 5.5 mm below the tube in front, well forward (product photos)
  rodG:    { th: -32, R: 13.5, x0: 316, x1: 366 },
  rodFoot: { th: 18, R: 13.4, x0: 485, x1: 647 },   // crosses the front just above the axis
  rodGiz:  { th: 56, R: 12.9, x0: 509, x1: 592 },
  rodTrill:{ th: -80, R: 20.6, x0: 186, x1: 458 },   // the long trill rod: a second rod below the main one in front
  axThumb: { th: -152, R: 12.0, x: 301.5 },            // the thumb keys' short axle lies ACROSS the tube (see TH below)
};
// the head joint's outside tapers a little toward the crown (about 89 % of the body's width there)
const headR = x => 9.5 - 0.9 * Math.pow(clamp((110 - x) / 172, 0, 1), 2);
const rad = (x, th, R) => V3(x, R * Math.sin(th * RAD), R * Math.cos(th * RAD));
const nrm = th => V3(0, Math.sin(th * RAD), Math.cos(th * RAD));          // outward, round the tube
const tan = th => V3(0, Math.cos(th * RAD), -Math.sin(th * RAD));         // round the tube, toward larger θ... (d/dθ of nrm)
// The thumb keys (the B key and the Briccialdi B♭ lever) are two long see-saw levers lying along the back of the tube.
// They rock on one short steel axle that crosses the tube 36 mm foot-side of the thumb hole: a straight line, tangent
// to a circle of 12 mm about the tube's axis at θ -152, from a ball post low on the back (θ -172) up to a taller post
// on the rod side (θ -110). Measured from two photographs of real flutes seen from the back.
const TH = (() => {
  const a = F.axThumb, ax = tan(a.th), c0 = rad(a.x, a.th, a.R);
  return { x: a.x, ax, pv: c0, ang: 5 * RAD, at: s => c0.clone().addScaledVector(ax, s), sOf: th => a.R * Math.tan((th - a.th) * RAD) };
})();

// The cups: tone hole position, angle round the tube, cup radius, the rod it turns on, open at rest or not.
// Names are the page's: a hole is named by the note it sounds as the highest open hole; `name` is what flutists
// call the key (the note it makes as the last key down), `finger` who presses it.
const CUPS = [
  { id: 'Cs',  x: 227,   th: 0,  r: 6.7, rod: 'rodBody', name: 'B' },
  { id: 'L1',  x: 261,   th: 0,  r: 8.0, rod: 'rodBody', plate: true, finger: 'L1', name: 'B' },
  { id: 'Bb',  x: 282,   th: 0,  r: F.cupR, rod: 'rodBody', name: 'B♭' },
  { id: 'As',  x: 305,   th: 0,  r: F.cupR, rod: 'rodBody', finger: 'L2', name: 'A' },
  { id: 'A',   x: 329,   th: 18, r: F.cupR, rod: 'rodG', finger: 'L3', name: 'G' },
  { id: 'Gf',  x: 353.5, th: 18, r: F.cupR, rod: 'rodG', name: 'G♯' },
  { id: 'G',   x: 378,   th: 0,  r: F.cupR, rod: 'rodBody', name: 'F♯' },
  { id: 'Fs',  x: 406,   th: 0,  r: F.cupR, rod: 'rodBody', finger: 'R1', name: 'F' },
  { id: 'F',   x: 436,   th: 0,  r: F.cupR, rod: 'rodBody', finger: 'R2', name: 'E' },
  { id: 'E',   x: 467,   th: 0,  r: F.cupR, rod: 'rodBody', finger: 'R3', name: 'D' },
  { id: 'D',   x: 534,   th: -50, r: F.cupR, rod: 'rodFoot', foot: true, name: 'C♯' },
  { id: 'CsF', x: 570,   th: -50, r: F.cupR, rod: 'rodFoot', foot: true, name: 'C' },
  { id: 'CF',  x: 608.5, th: -50, r: 9.5, rod: 'rodFoot', foot: true, name: 'B' },
  // closed at rest: their keys open them
  { id: 'Ds',  x: 498,   th: 86, r: 8.8, rod: 'rodFoot', shut: true, name: 'E♭' },
  { id: 'trDs',x: 193,   th: -125, r: 5.4, rod: 'rodTrill', shut: true, name: 'D♯ trill' },
  { id: 'trD', x: 211,   th: -125, r: 5.4, rod: 'rodTrill', shut: true, name: 'D trill' },
  { id: 'GsR', x: 353.5, th: -136, r: 7.7, rod: 'rodBody', shut: true, name: 'G♯' },
  // the thumb's cup on the back (the B key) and its hole
  { id: 'Th',  x: 265,   th: -140, r: 8.7, rod: 'axThumb', finger: 'LT', name: 'thumb B' },
];

/* ------------------------------------------------------------------ *
 *  The studio
 * ------------------------------------------------------------------ */
// A product photographer's light tent for polished silver, written as one GLSL function of the direction looked in,
// in the camera's own frame (+z back toward the camera, +y up on the screen): the polished metal looks it up
// exactly, so reflections stay crisp at any zoom, and the set turns with the camera, like a turntable shot.
// The numbers are MEASURED from a maker's product photograph of a silver flute (the brightness down a plain stretch
// of tube, top edge to bottom edge, turned back into the brightness of the room in each direction): a tent that is
// light everywhere (no hot lamp: nothing clips to white), brightest high in front, a little dimmer round the
// camera, ONE narrow black slit a little below the camera (the crisp dark line along the tube that makes silver
// read as silver), an even lighter-grey floor, and dark behind the flute, so every outline is drawn with a thin
// dark edge against the pale page.
// The tent is zonal about the camera's line of sight (brightness by the angle away from the camera, upper and
// lower halves each with their own curve): a zonal room can only put smooth bands on tubes, balls and domes.
const STUDIO_GLSL = `
  float fsBand(float x, float a, float b, float e){ return smoothstep(a - e, a + e, x) * (1.0 - smoothstep(b - e, b + e, x)); }
  float fsUp(float r){
    const float X[13] = float[13](0.0, 12.0, 25.0, 40.0, 55.0, 72.0, 88.0, 104.0, 122.0, 136.0, 150.0, 164.0, 180.0);
    const float V[13] = float[13](0.90, 0.95, 1.06, 1.36, 1.6, 1.6, 1.3, 0.98, 0.80, 1.05, 0.85, 0.36, 0.22);
    float v = V[0];
    for (int i = 0; i < 12; i++) v = mix(v, V[i + 1], clamp((r - X[i]) / (X[i + 1] - X[i]), 0.0, 1.0));
    return v;
  }
  float fsDown(float r){
    const float X[13] = float[13](0.0, 8.0, 18.0, 28.0, 36.0, 44.0, 54.0, 70.0, 95.0, 112.0, 128.0, 148.0, 180.0);
    const float V[13] = float[13](0.90, 1.0, 1.1, 1.0, 0.78, 0.56, 0.44, 0.5, 0.76, 0.86, 0.70, 0.40, 0.20);
    float v = V[0];
    for (int i = 0; i < 12; i++) v = mix(v, V[i + 1], clamp((r - X[i]) / (X[i + 1] - X[i]), 0.0, 1.0));
    return v;
  }
  vec3 fsStudio(vec3 d, float rough){
    d = normalize(d);
    float e = 1.2 + 70.0 * rough * rough + 25.0 * rough;
    float u = degrees(atan(d.y, d.z));                                   // 0 = toward the camera, 90 = up, ±180 = behind, -90 = down
    float s = degrees(asin(clamp(d.x, -1.0, 1.0)));                       // left / right
    float rho = degrees(acos(clamp(d.z, -1.0, 1.0)));                     // the angle away from the camera
    float up = smoothstep(-0.4, 0.4, d.y / max(1e-4, length(d.xy)));
    float v = mix(fsDown(rho), fsUp(rho), up);
    v = mix(v, 0.8, smoothstep(0.12, 0.6, rough));                        // a rough surface sees the tent's average
    vec3 white = vec3(1.0, 0.997, 0.985);
    vec3 c = white * v;
    // the floor behind and below: a little warm (the table), as the bottom edge of every photographed tube is
    c *= mix(vec3(1.0), vec3(1.0, 0.95, 0.89), (1.0 - up) * smoothstep(120.0, 165.0, rho));
    // the room's sides are dark (black flags left and right of the set), each with one tall strip light in it: a tube
    // seen at a slant, and the left and right shoulders of every cup and ball, mirror these, so they show dark with a
    // bright streak instead of the tent's even white
    float elev = degrees(asin(clamp(d.y, -1.0, 1.0)));
    float wall = smoothstep(50.0, 60.0 + e, abs(s)) * fsBand(elev, -52.0, 58.0, e + 6.0);
    c = mix(c, vec3(0.17, 0.172, 0.18), 0.9 * wall);
    c = mix(c, white * 1.5, fsBand(abs(s), 65.0, 74.0, 2.0 + e) * fsBand(elev, -38.0, 46.0, e + 3.0));
    // The dark band just ABOVE the camera (the black card over the lens): on a tube it is the narrow dark stripe just
    // above the middle, hard against the bright streak of the overhead light, which is what makes polished silver read
    // as silver. Above, not below: a cup's flat face, seen from a little above as the flute usually is, mirrors what
    // lies BELOW the camera, and must stay light. Its upper edge is crisp (its own ~1° edge, widened only as far as a
    // pixel needs so it never shimmers on a small flute), its lower edge soft.
    float fw = clamp(fwidth(u), 0.0, 8.0);
    float eT = max(0.8, 0.45 * fw) + 30.0 * rough, hi = max(23.0, 5.0 + 2.6 * fw);
    float band = smoothstep(5.0 - 3.0 - eT, 5.0 + 3.0 + eT, u) * (1.0 - smoothstep(hi - eT, hi + eT, u));
    c = mix(c, vec3(0.045, 0.047, 0.052), 0.96 * band * (1.0 - smoothstep(30.0, 50.0, abs(s))));
    return c;
  }`;

// The flute mirrored in itself (quality 'high'): the reflected ray is first tested against a short list of plain
// cylinders standing in for the tube, the rods and the cups (fsA = start + radius, fsB = unit axis + length, all in
// the camera's frame, rewritten every frame so moving keys and the take-apart are followed). A cup's underside shows
// dark (the pad in its own shadow); anything else hit shows the studio reflected once more, a little dimmer. A ray
// that hits nothing sees the studio. The tube therefore shows the cups and rods as dark and bright streaks, and the
// cups show the tube, as in a photograph.
const TRACE_GLSL = `
  #ifdef FS_TRACE
  uniform vec4 fsA[ FS_N ];
  uniform vec4 fsB[ FS_N ];
  vec3 fsRadiance( vec3 P, vec3 D, float rough ) {
    float tBest = 1e9, under = 0.0, wBest = 0.0; vec3 nBest = vec3( 0.0, 0.0, 1.0 );
    for ( int i = 0; i < FS_N; i ++ ) {
      vec3 A = fsA[ i ].xyz; float r = fsA[ i ].w; vec3 U = fsB[ i ].xyz; float L = fsB[ i ].w;
      vec3 oc = P - A; float dU = dot( D, U ), oU = dot( oc, U );
      vec3 d2 = D - dU * U, o2 = oc - oU * U;
      float a = dot( d2, d2 ), b = dot( o2, d2 ), c = dot( o2, o2 ) - r * r, h = b * b - a * c;
      if ( h > 0.0 && a > 1e-6 ) {
        float t = ( - b - sqrt( h ) ) / a, sU = oU + t * dU;
        if ( t > 0.3 && t < tBest && sU > 0.0 && sU < L ) {
          float dmin = sqrt( max( 0.0, c + r * r - b * b / a ) );                 // how close the ray passes to the axis: soft near the outline
          tBest = t; nBest = ( o2 + t * d2 ) / r; under = 0.0; wBest = smoothstep( r, r * 0.82 - 0.4, dmin ) * smoothstep( 0.0, 0.8, sU ) * smoothstep( L, L - 0.8, sU ); }
      }
      if ( L < 20.0 && abs( dU ) > 1e-4 ) {
        float t0 = - oU / dU; vec3 q0 = o2 + t0 * d2;
        if ( dU > 0.0 && t0 > 0.3 && t0 < tBest && dot( q0, q0 ) < r * r ) { tBest = t0; nBest = - U; under = 1.0; wBest = smoothstep( r, r - 1.0, length( q0 ) ); }
        float t1 = ( L - oU ) / dU; vec3 q1 = o2 + t1 * d2;
        if ( dU < 0.0 && t1 > 0.3 && t1 < tBest && dot( q1, q1 ) < r * r ) { tBest = t1; nBest = U; under = 0.0; wBest = smoothstep( r, r - 1.0, length( q1 ) ); }
      }
    }
    vec3 miss = fsStudio( D, rough );
    if ( tBest > 1e8 ) return miss;
    vec3 col = vec3( 0.86 ) * fsStudio( reflect( D, nBest ), rough + 0.05 );
    col = mix( col, vec3( 0.2, 0.2, 0.21 ), 0.85 * under );
    return mix( miss, col, wBest * exp( - tBest / 160.0 ) * ( 1.0 - smoothstep( 0.15, 0.45, rough ) ) );
  }
  #endif`;

function studioScene() {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(60, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 d;' + STUDIO_GLSL + ' void main(){ gl_FragColor = vec4(fsStudio(d, 0.0), 1.0); }',
  })));
  return s;
}

/* ------------------------------------------------------------------ *
 *  Small builders
 * ------------------------------------------------------------------ */
// A plain cylinder along x through (y, z)
function cylX(x0, x1, y, z, r, segs = 20) {
  return place(lathe([[x0, 0], [x0, r], [x1, r], [x1, 0]], { segs, crease: 30 }), V3(0, y, z), AX);
}
function ball(p, r, segs = 24) { const g = new THREE.SphereGeometry(r, segs, Math.max(8, segs >> 1)); g.translate(p.x, p.y, p.z); return g; }
// points round the tube at one x, from θ0 to θ1, the radius going from R0 to R1
function arcPts(x, th0, th1, R0, R1, n = 10) {
  const out = [];
  for (let k = 0; k <= n; k++) { const t = k / n; out.push(rad(x, th0 + (th1 - th0) * t, R0 + (R1 - R0) * smooth(0, 1, t))); }
  return out;
}
// a flat strap (wide along x) along a path
function strap(P, w, th, o = {}) { return sweep(P, 1, Object.assign({ up: AX, scaleN: w / 2, scaleB: th / 2, sq: 3.2, segs: 14, capA: true, capB: true }, o)); }
// a low lens-shaped touch piece: len along x, wid round the tube, standing on the tube at (x, θ, R)
function touchPad(x, th, R, len, wid, thick, o = {}) {
  // a lens: domed face, and a gently rounded back so it never shows a flat white disc from behind
  const prof = [[-0.25, 0], [-0.22, 0.5], [-0.1, 0.86], [0, 1], [0.5, 1], [0.78, 0.95], [0.9, 0.86], [1.0, 0.7], [1.14, 0.35], [1.2, 0]];
  const g = lathe(prof.map(([y, r]) => [y * thick, r]), { segs: 48, crease: 60 });
  if (o.sq && o.sq !== 2) {                       // square the outline up (a superellipse), keeping the domed section
    const q = g.attributes.position, nn = o.sq;
    for (let i = 0; i < q.count; i++) {
      const x = q.getX(i), z = q.getZ(i), r = Math.hypot(x, z); if (r < 1e-6) continue;
      const f = 0.86 / Math.pow(Math.pow(Math.abs(x / r), nn) + Math.pow(Math.abs(z / r), nn), 1 / nn);   // pushed out toward the corners, same direction
      q.setX(i, x * f); q.setZ(i, z * f);
    }
  }
  const n = nrm(th), t = tan(th), m = new THREE.Matrix4();
  const tilt = o.tilt || 0;      // lean it round the x axis (degrees): it then faces θ + tilt
  const nn = n.clone().applyAxisAngle(AX, -tilt * RAD), tt = t.clone().applyAxisAngle(AX, -tilt * RAD);
  m.makeBasis(AX.clone().multiplyScalar(len / 2), nn, tt.clone().multiplyScalar(-wid / 2));     // (x, out, -round: right-handed)
  m.setPosition(rad(x, th, R));
  g.applyMatrix4(m);
  g.computeVertexNormals();
  return g;
}
// A plate with any outline: `pts` = the outline's control points [[u, v], ...] (a closed smooth curve through them),
// `centre` = a point inside that sees the whole outline, `map(u, v, h)` = where the plate's own point (u, v) at height h
// lies in the flute. A low dome on top, a rounded edge, a flat back.
function plateGeo(pts, centre, map, o = {}) {
  const NT = o.NT || 112, NR = o.NR || 9, NE = o.NE || 7, T = o.thick || 1.4, dome = o.dome || 0, e = o.edge || 0.12;
  const ol = new THREE.CatmullRomCurve3(pts.map(([u, v]) => V3(u, v, 0)), true, 'centripetal').getSpacedPoints(NT).slice(0, NT);
  const prof = [];
  if (o.pillow) {                                   // one smooth swelling from edge to edge (a spoon), no flat and no bevel
    const ht = T / 2 + dome, hb = -T / 2 + 0.3 * T, N = NR + 5;
    for (let j = 1; j <= N; j++) { const a = j / N * Math.PI / 2; prof.push([Math.sin(a), hb + (ht - hb) * Math.cos(a)]); }
    prof.push([0.985, -T / 2 + 0.1 * T], [0.93, -T / 2]);
    for (let j = NR - 1; j >= 1; j--) prof.push([0.93 * j / NR, -T / 2]);
  } else {
    for (let j = 1; j <= NR; j++) { const r = j / NR; prof.push([r * (1 - e), T / 2 + dome * (1 - r * r)]); }
    for (let i = 1; i < NE; i++) { const a = i / NE * Math.PI; prof.push([1 - e + e * Math.sin(a), T / 2 * Math.cos(a)]); }
    for (let j = NR; j >= 1; j--) { const r = j / NR; prof.push([r * (1 - e), -T / 2]); }
  }
  const pos = [], idx = [], put = q => pos.push(q.x, q.y, q.z);
  put(map(centre[0], centre[1], T / 2 + dome + (o.top ? o.top(centre[0], centre[1], 0) : 0)));
  // o.top(u, v, rho): extra height on the face (a dish, a curve), fading out round the edge
  for (const [rho, h] of prof) for (let k = 0; k < NT; k++) { const u = centre[0] + (ol[k].x - centre[0]) * rho, v = centre[1] + (ol[k].y - centre[1]) * rho; put(map(u, v, h + (o.top && h > 0 ? o.top(u, v, rho) * Math.min(1, h / (T / 2)) : 0))); }
  put(map(centre[0], centre[1], -T / 2));
  const ring = i => 1 + i * NT, last = 1 + prof.length * NT, nP = prof.length;
  for (let k = 0; k < NT; k++) { const k1 = (k + 1) % NT; idx.push(0, ring(0) + k, ring(0) + k1, last, ring(nP - 1) + k1, ring(nP - 1) + k); }
  for (let i = 0; i < nP - 1; i++) for (let k = 0; k < NT; k++) { const k1 = (k + 1) % NT, a = ring(i) + k, b = ring(i) + k1, c = ring(i + 1) + k, d = ring(i + 1) + k1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const up = map(centre[0], centre[1], 1).sub(map(centre[0], centre[1], 0)), n0 = V3().fromBufferAttribute(g.attributes.normal, 0);
  if (n0.dot(up) < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
  return g;
}
// a thin rib soldered along the tube under a rod's posts
function rib(x0, x1, th, w = 4.2) {
  const P = [rad(x0, th, F.R + 0.25), rad(x1, th, F.R + 0.25)];
  return sweep(densify(P, 20), 1, { up: tan(th), scaleN: w / 2, scaleB: 0.4, sq: 4, segs: 12, capA: true, capB: true });
}
// a post: foot on the rib, pillar out to the rod, a ball round the rod's end
function post(x, rd) {
  const n = nrm(rd.th), a = rad(x, rd.th, F.R + 0.5), b = rad(x, rd.th, rd.R);
  const pillar = place(lathe([[0, 0], [0, 3.0], [0.6, 2.75], [1.6, 2.0], [b.distanceTo(a) - 0.6, 2.0], [b.distanceTo(a), 0]], { segs: 18 }), a, n);
  return [pillar, ball(b, 2.75, 26)];
}
// the cup: a lathe about +Y, y = 0 at the pad's face; scaled to radius r
function cupShell(r, plain) {
  const s = r / 9.3, h = Math.sqrt(s);
  // skirt, rounded shoulder, a flat ring, a small step, then the low dome in the middle (the ring every cup shows)
  const prof = [[0.36, 8.32], [0.3, 8.86], [0.62, 9.3], [2.3, 9.3], [2.95, 9.12], [3.42, 8.62], [3.72, 7.9], [3.86, 7.2], [3.96, 6.3], [4.0, 5.4], [4.0, 5.25], [4.1, 5.1], [4.13, 4.9], [4.34, 3.2], [4.46, 1.5], [4.5, 0]];
  // (plain: one smooth low dome, no ring: the thumb's cup)
  const profP = [[0.36, 8.32], [0.3, 8.86], [0.62, 9.3], [2.3, 9.3], [2.95, 9.12], [3.42, 8.62], [3.72, 7.9], [3.9, 7.0], [4.06, 5.8], [4.22, 4.4], [4.36, 2.9], [4.46, 1.5], [4.5, 0]];
  const g = lathe((plain ? profP : prof).map(([y, rr]) => [y * h, rr * s]), { segs: 88, crease: 50 });
  const pos = g.attributes.position, col = [];
  for (let i = 0; i < pos.count; i++) { const v = 0.42 + 0.58 * smooth(0.4 * h, 3.3 * h, pos.getY(i)); col.push(v, v, v); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return g;
}
// the pad: its edge shows as a thin pale line just under the cup's rim
function cupPad(r) { const s = r / 9.3; return lathe([[-0.18, 0], [-0.18, 8.45 * s], [-0.05, 8.62 * s], [0.5, 8.62 * s], [0.5, 0]], { segs: 40, crease: 50 }); }
// the tone hole's chimney: y = 0 at its rim, going down into the tube
function chimney(r) {
  const ro = r * 0.78, ri = ro - 0.75;
  return lathe([[-7, ro], [-0.35, ro], [-0.05, ro - 0.2], [0, ro - 0.42], [0, ri + 0.2], [-0.15, ri], [-2.6, ri]], { segs: 40, crease: 50 });
}
// (the tube itself is not cut, so the dark floor must sit above its surface: 1 mm under the rim)
function holeDark(r) { const ri = r * 0.78 - 0.75; return lathe([[-1.0, 0], [-1.0, ri + 0.05], [-0.9, ri + 0.05]], { segs: 32 }); }

// Contact shading for the keywork (vertex colours, multiplied into the polished metal's reflection): whatever is
// close to the tube, and whatever faces it, sits in the tube's shade. This is what makes the gaps between the rods,
// the posts, the cups' undersides and the tube read dark, as in every photograph, instead of white on white.
function contactShade(g) {
  const p = g.attributes.position, n = g.attributes.normal; if (!n) return g;
  const old = g.attributes.color, col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), z = p.getZ(i), r = Math.hypot(y, z);
    let k = 1;
    if (r > 1e-3) {
      const fac = Math.max(0, -(n.getY(i) * y + n.getZ(i) * z) / r), near = 1 - smooth(F.R + 0.4, F.R + 6.5, r);
      k = Math.max(0.07, 1 - 0.72 * near * (0.45 + 0.55 * fac) - 0.55 * fac * (1 - smooth(F.R + 7, F.R + 14, r)));
    }
    if (old) k *= old.getX(i);
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
// the lip plate and its riser, in place (the hole's centre over the origin)
function lipPlate() {
  const HY = 2.0, AXh = 6.1, AYh = 4.85, OY = 0;      // OY: the plate reaches further toward the player, so the hole sits toward its far edge                  // the hole: 12.2 x 10.2 mm, a little toward the far side (+y)
  // 4.4 mm over the tube at the hole; across, it wraps well round the tube (a photo from the player's side shows the
  // near edge hanging far down the tube's side in the middle); along the tube the crest stays nearly straight
  // across: on the player's side (y < 0) a tight curve that wraps well down the tube, on the far side a gentler one so
  // the plate stands 3-4 mm proud of the tube's outline there too (same height and slope at the crest)
  const zP = (x, y) => (y < 0 ? 0.3 + Math.sqrt(Math.max(1, 13.6 * 13.6 - y * y)) : -1.1 + Math.sqrt(Math.max(1, 15 * 15 - y * y))) - x * x / 560;   // (a gentle saddle: the ends dip about 1 mm toward the tube)
  const outline = t => {                                  // the "loaf": arched far side, flatter and longer player's side
    const c = Math.cos(t), s = Math.sin(t), far = s > 0;
    const n = 3.2 - 0.3 * s, b = 13.0;                                           // a rounded oblong (smooth all the way round)
    const a = 22.5 * (1 - (far ? 0.05 : 0) * Math.pow(Math.abs(s), 1.5));
    return [a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), OY + b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)];
  };
  const se = (v, n) => Math.sign(v) * Math.pow(Math.abs(v), 2 / n);
  const hole = t => [AXh * se(Math.cos(t), 2.8), HY + AYh * se(Math.sin(t), 2.8)];      // a rounded rectangle, as cut
  const NT = 120, NR = 14, thick = 1.9;
  const surf = (fn) => {                                   // a grid from the hole's edge (k = 0) to the outline (k = NR)
    const pos = [], idx = [];
    for (let j = 0; j <= NT; j++) {
      const t = j / NT * Math.PI * 2, h = hole(t), o = outline(t);
      for (let k = 0; k <= NR; k++) { const u = k / NR, w = u * u * (3 - 2 * u) * 0.35 + u * 0.65; const p = fn(h[0] + (o[0] - h[0]) * w, h[1] + (o[1] - h[1]) * w); pos.push(p.x, p.y, p.z); }
    }
    for (let j = 0; j < NT; j++) for (let k = 0; k < NR; k++) { const a = j * (NR + 1) + k, b = a + 1, c = a + NR + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
  };
  const nAt = (x, y) => { const e = 0.01, dx = (zP(x + e, y) - zP(x - e, y)) / (2 * e), dy = (zP(x, y + e) - zP(x, y - e)) / (2 * e); return V3(-dx, -dy, 1).normalize(); };
  const top = surf((x, y) => V3(x, y, zP(x, y)));
  const bot = surf((x, y) => V3(x, y, zP(x, y)).addScaledVector(nAt(x, y), -thick));
  // the rim round the outline: top edge, a rounded middle, bottom edge
  const rimPos = [], rimIdx = [], RS = 4;
  for (let j = 0; j <= NT; j++) {
    const t = j / NT * Math.PI * 2, o = outline(t), o2 = outline(t + 0.01), tx = o2[0] - o[0], ty = o2[1] - o[1], l = Math.hypot(tx, ty) || 1;
    const out = V3(ty / l, -tx / l, 0), n = nAt(o[0], o[1]);
    for (let k = 0; k <= RS; k++) { const a = k / RS * Math.PI; const p = V3(o[0], o[1], zP(o[0], o[1])).addScaledVector(n, -thick * (1 - Math.cos(a)) / 2).addScaledVector(out, Math.sin(a) * thick * 0.45); rimPos.push(p.x, p.y, p.z); }
  }
  for (let j = 0; j < NT; j++) for (let k = 0; k < RS; k++) { const a = j * (RS + 1) + k, b = a + 1, c = a + RS + 1, d = c + 1; rimIdx.push(a, b, c, b, d, c); }
  const rim = new THREE.BufferGeometry(); rim.setAttribute('position', new THREE.Float32BufferAttribute(rimPos, 3)); rim.setIndex(rimIdx);
  // the riser: the hole's wall, from the plate down into the bore (its top two millimetres catch the light,
  // below that it is dark), and its outside wall under the plate down to the tube
  const wall = (z0, z1, grow, n = 8) => {
    const pos = [], idx = [];
    for (let j = 0; j <= NT; j++) {
      const t = j / NT * Math.PI * 2, h = hole(t), hx = h[0] * (1 + grow / AXh), hy = HY + (h[1] - HY) * (1 + grow / AYh);
      for (let k = 0; k <= n; k++) { const u = k / n; const zt = typeof z0 === 'function' ? z0(hx, hy) : z0, zb = typeof z1 === 'function' ? z1(hx, hy) : z1; pos.push(hx, hy, zt + (zb - zt) * u); }
    }
    for (let j = 0; j < NT; j++) for (let k = 0; k < n; k++) { const a = j * (n + 1) + k, b = a + 1, c = a + n + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
  };
  const farK = y => smooth(-0.4, 0.8, (y - HY) / AYh);
  const wallTop = wall((x, y) => zP(x, y) - 0.05, (x, y) => zP(x, y) - 0.95 - 0.6 * farK(y), 0, 2);   // a lit lip: about 1.5 mm on the far wall, thin on the near side
  const wallLow = wall((x, y) => zP(x, y) - 0.95 - 0.6 * farK(y), 9.75, -0.06, 4);           // down to a dark floor just above the (uncut) tube
  const warm = (v, out) => out.push(v, v * 0.95, v * 0.88);
  { const p = wallLow.attributes.position, col = []; for (let i = 0; i < p.count; i++) { const k = (i % 5) / 4, far = smooth(-0.6, 0.9, (p.getY(i) - HY) / AYh), v = 0.01 + (0.6 - 0.46 * far) * (1 - smooth(0.25, 1.0, k)); warm(v, col); } wallLow.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const outerW = wall((x, y) => zP(x, y) - thick * 0.9, (x, y) => Math.sqrt(Math.max(0, headR(x) ** 2 - y * y)) - 0.4, 1.7, 4);
  const floor = new THREE.CircleGeometry(1, 40); floor.scale(AXh + 0.9, AYh + 0.9, 1); floor.translate(0, HY, 9.75);
  { const p = floor.attributes.position, col = []; for (let i = 0; i < p.count; i++) warm(0.008 + 0.01 * smooth(-1, 1, (p.getY(i) - HY) / (AYh + 0.9)), col); floor.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  // the grids close on themselves along +x (the foot side of the hole): average the normals across that seam, or it
  // shows as a dark slit running from the hole across the plate
  const weld = (g, cols) => { g.userData.weld = cols; return g; };
  return { top: weld(top, NR + 1), bot: weld(bot, NR + 1), rim: weld(rim, RS + 1), wallTop: weld(wallTop, 3), wallLow: weld(wallLow, 5), outerW: weld(outerW, 5), floor, nAt, zP, HY };
}

// Make a geometry's faces point out (toward `out` from `centre`), whatever order its triangles were written in.
function faceOut(g, centre, flip = false) {
  g.computeVertexNormals();
  weldSeam(g);
  const p = g.attributes.position, n = g.attributes.normal; let s = 0;
  for (let i = 0; i < p.count; i += 7) s += (p.getX(i) - centre.x) * n.getX(i) + (p.getY(i) - centre.y) * n.getY(i) + (p.getZ(i) - centre.z) * n.getZ(i);
  if ((s < 0) !== flip) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.index.needsUpdate = true; g.computeVertexNormals(); weldSeam(g); }
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(p.count * 2), 2));
  return g;
}
// a closed grid (rows of `cols` vertices, the last row repeating the first): give both copies the same normal
function weldSeam(g) {
  const cols = g.userData.weld; if (!cols) return;
  const n = g.attributes.normal, rows = n.count / cols, v = V3(), w = V3();
  for (let k = 0; k < cols; k++) {
    const i0 = k, i1 = (rows - 1) * cols + k;
    v.fromBufferAttribute(n, i0).add(w.fromBufferAttribute(n, i1)).normalize();
    n.setXYZ(i0, v.x, v.y, v.z); n.setXYZ(i1, v.x, v.y, v.z);
  }
  n.needsUpdate = true;
}
const withUV = g => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]); return g; };

/* ------------------------------------------------------------------ *
 *  The flute
 * ------------------------------------------------------------------ */
function buildFlute() {
  const root = new THREE.Group(); root.name = 'flute';
  const M = {
    silver: new THREE.MeshPhysicalMaterial({ color: 0xe9e8e2, metalness: 1, roughness: 0.045, vertexColors: true }),   // (vertex colours: the tube's contact shading)
    satin: new THREE.MeshPhysicalMaterial({ color: 0xe4e5e7, metalness: 1, roughness: 0.2 }),       // the steel rods inside the hinge tubes
    pad: new THREE.MeshStandardMaterial({ color: 0xe9e0c8, roughness: 0.78, metalness: 0, envMapIntensity: 0.9 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x0d0d0e, roughness: 0.9, metalness: 0, envMapIntensity: 0.25, side: THREE.DoubleSide }),
    riser: new THREE.MeshPhysicalMaterial({ color: 0xdedfe1, metalness: 1, roughness: 0.3 }),                            // the embouchure hole's wall
    bore: new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, side: THREE.DoubleSide }),
    cork: new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.55, metalness: 0.2, envMapIntensity: 0.6 }),   // felt under the foot's rollers
    spring: new THREE.MeshStandardMaterial({ color: 0x3d4658, roughness: 0.35, metalness: 1, envMapIntensity: 1.0 }),     // steel
  };
  M.silver.name = 'silver';
  // Three joints, so the flute can be taken apart: the head (crown to the tenon), the body (socket to its tenon,
  // and the keys on it), the foot. A piece belongs to the joint its middle lies in.
  const JOINT_AT = [F.sock[0], F.bodyEnd];
  const jointOf = x => x < JOINT_AT[0] ? 'head' : x < JOINT_AT[1] ? 'body' : 'foot';
  const joints = {};
  for (const j of ['head', 'body', 'foot']) { joints[j] = new THREE.Group(); joints[j].name = 'joint:' + j; root.add(joints[j]); }
  const statics = {};
  for (const j of Object.keys(joints)) statics[j] = { silver: [], satin: [], pad: [], dark: [], cork: [], spring: [], riser: [], bore: [] };
  const add = (mat, ...gs) => { for (const g of gs) { withUV(g); g.computeBoundingBox(); const bb = g.boundingBox; if (mat === 'silver' && !g.userData.tube && bb.min.x > 150) contactShade(g); statics[jointOf((bb.min.x + bb.max.x) / 2)][mat].push(g); } };

  // ---- the tube, crown to foot: one lathe per joint (axial coordinate = x) ----
  const fine = (x0, x1, r, n, d) => { const out = []; const w = (x1 - x0) / n; for (let i = 0; i < n; i++) { const a = x0 + i * w; out.push([a + 0.15 * w, r], [a + 0.5 * w, r - d], [a + 0.85 * w, r]); } return out; };
  const ridges = (x0, x1, r, n) => { const out = []; const w = (x1 - x0) / n; for (let i = 0; i < n; i++) { const a = x0 + i * w; out.push([a + 0.08 * w, r], [a + 0.32 * w, r], [a + 0.5 * w, r - 0.22], [a + 0.68 * w, r], [a + 0.92 * w, r]); } return out; };
  const prof = [
    [F.crown, 0], [F.crown + 0.15, 2.6], [F.crown + 0.55, 4.6], [F.crown + 1.3, 6.4], [F.crown + 2.3, 7.7], [F.crown + 3.4, 8.6], [F.crown + 4.0, 9.1],
    // the crown: a smooth dome and one finely knurled band, a little proud of the (tapered) head tube
    [F.crown + 4.3, 9.3], [F.crown + 4.6, 9.45],
    ...fine(F.crown + 4.8, F.crown + 8.4, 9.45, 9, 0.07),
    [F.crown + 8.6, 9.45], [F.crown + 8.9, 9.25], [F.crown + 9.2, headR(F.crown + 9.2)],
    ...[-50, -30, -10, 10, 30, 50, 70, 90, 110].map(x => [x, headR(x)]),
    // the head joint goes into the body's socket here; its tenon (hidden when the flute is together) and bore
    [F.sock[0], 9.5], [F.sock[0] + 0.1, 9.22], [F.sock[0] + 33, 9.22], [F.sock[0] + 33.2, 8.95], [F.sock[0] + 33.2, 8.4], [F.sock[0] + 32, 8.4],
  ];
  const profBody = [
    [F.sock[0], 9.3], [F.sock[0], 10.2], [F.sock[0] + 0.3, 10.75],
    ...ridges(F.sock[0] + 0.3, F.sock[0] + 4.3, 10.75, 2),
    [F.sock[0] + 4.5, 10.75], [F.sock[0] + 4.7, 10.12], [F.sock[1] - 4.7, 10.12], [F.sock[1] - 4.5, 10.75],
    ...ridges(F.sock[1] - 4.3, F.sock[1] - 0.3, 10.75, 2),
    [F.sock[1] - 0.3, 10.75], [F.sock[1], 10.2], [F.sock[1] + 0.3, 9.5],
    // the body's own tenon, into the foot's socket
    [F.bodyEnd, 9.5], [F.bodyEnd + 0.1, 9.22], [F.bodyEnd + 22, 9.22], [F.bodyEnd + 22.2, 8.95], [F.bodyEnd + 22.2, 8.4], [F.bodyEnd + 21, 8.4],
  ];
  const profFoot = [
    [F.bodyEnd, 9.3], [F.bodyEnd, 10.3], [F.bodyEnd + 0.3, 10.75],
    ...ridges(F.bodyEnd + 0.3, F.bodyEnd + 3.8, 10.75, 2),
    [F.bodyEnd + 4.0, 10.75], [F.bodyEnd + 4.2, 10.25], [F.footSock - 0.5, 10.25], [F.footSock - 0.2, 9.9], [F.footSock, 9.5],
    [F.end - 4.6, 9.5], [F.end - 4.3, 10.15], [F.end - 0.6, 10.15], [F.end - 0.2, 9.95], [F.end, 9.55], [F.end, 8.75], [F.end - 0.5, 8.7],
  ];
  // contact shading baked into the tube (vertex colours): a soft dark patch under each cup and its tail, a darker
  // strip under each rod and rib; the polished metal's reflection is multiplied by it, so the keys sit on the tube
  // instead of floating over it
  const shadeTube = g => {
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3), P = V3(), d = V3();
    const cups = CUPS.filter(c => !c.plate).map(c => ({ seat: rad(c.x, c.th, F.seat), n: nrm(c.th), r: c.r, x: c.x, th: c.th, rod: F[c.rod] }));
    const rods = ['rodBody', 'rodG', 'rodFoot', 'rodGiz', 'rodTrill'].map(k => F[k]);
    // the thumb levers and their axle: [x0, x1, θ0, θ1, depth] (soft-edged patches)
    const patches = [[273, 298, -179, -141, 0.72], [296, 329, -150, -126, 0.62], [276, 300, -134, -120, 0.3], [TH.x - 2.4, TH.x + 2.4, -181, -106, 0.6], [TH.x - 2.4, TH.x + 2.4, -238, -160, 0.3]];
    for (let i = 0; i < pos.count; i++) {
      P.fromBufferAttribute(pos, i);
      let k = 1;
      if (Math.hypot(P.y, P.z) > F.R - 0.3) {
        const thP = Math.atan2(P.y, P.z) / RAD;
        for (const c of cups) {
          if (Math.abs(P.x - c.x) > c.r + 9) continue;
          if (Math.abs(((thP - c.th) + 540) % 360 - 180) > 50) continue;          // only on the cup's own side of the tube
          d.subVectors(P, c.seat); const along = d.dot(c.n); if (along > 0.5) continue;
          const perp = Math.sqrt(Math.max(0, d.lengthSq() - along * along));
          k *= 1 - 0.55 * smooth(c.r + 2.8, c.r - 2.4, perp) - 0.2 * smooth(c.r + 7.5, c.r + 2.8, perp);   // dark under it, a soft halo round it
          // the tail's shadow, from the cup toward its rod
          const tp = rad(c.x, (c.th + c.rod.th) / 2, F.R), dt = Math.hypot(P.x - c.x, P.y - tp.y, P.z - tp.z);
          k *= 1 - 0.45 * smooth(5.5, 1.5, dt);
        }
        for (const [x0, x1, t0, t1, dep] of patches) {
          if (P.x < x0 - 4 || P.x > x1 + 4) continue;
          const tm = (t0 + t1) / 2, a = Math.abs(((thP - tm) + 540) % 360 - 180), hw = (t1 - t0) / 2;
          k *= 1 - dep * smooth(hw + 9, hw - 4, a) * smooth(x0 - 3.5, x0 + 1.5, P.x) * smooth(x1 + 3.5, x1 - 1.5, P.x);
        }
        for (const rd of rods) {
          if (P.x < rd.x0 - 3 || P.x > rd.x1 + 3) continue;
          const a = Math.abs(((Math.atan2(P.y, P.z) / RAD - rd.th) + 540) % 360 - 180);   // degrees round the tube from the rod
          k *= 1 - 0.6 * smooth(24, 4, a);
        }
      }
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.userData.tube = true;
    return g;
  };
  // (the long straight runs get a ring every 1.5 mm, or the shading has no vertices to live on)
  const dense = pr => { const out = [pr[0]]; for (let i = 1; i < pr.length; i++) { const [x0, r0] = pr[i - 1], [x1, r1] = pr[i], n = Math.max(1, Math.ceil(Math.abs(x1 - x0) / 1.5)); for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, r0 + (r1 - r0) * k / n]); } return out; };
  // the head: shaded only under the lip plate's overhang (a dark crescent below its edges, as in every photo)
  const shadeHead = g => {
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), th = Math.atan2(y, z) / RAD;
      const inX = smooth(26, 19, Math.abs(x)), band = smooth(-125, -95, th) * smooth(-30, -55, th) + smooth(125, 95, th) * smooth(35, 60, th);
      const k = 1 - 0.7 * inX * band;
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  };
  add('silver', shadeHead(place(lathe(dense(prof.filter(([x]) => true)), { segs: 96, crease: 35 }), V3(0, 0, 0), AX)));
  for (const pr of [profBody, profFoot]) add('silver', shadeTube(place(lathe(dense(pr), { segs: 96, crease: 35 }), V3(0, 0, 0), AX)));
  // dark inside the sockets and the tenons' bores (seen when the flute is apart)
  const darkDisc = (x, r, toward) => { const g = new THREE.CircleGeometry(r, 40); g.rotateY(toward * Math.PI / 2); g.translate(x, 0, 0); return g; };
  add('dark', darkDisc(F.sock[0] + 31.5, 8.4, 1), darkDisc(F.sock[0] + 1.2, 9.3, -1), darkDisc(F.bodyEnd + 20.5, 8.4, 1), darkDisc(F.bodyEnd + 1.2, 9.3, -1));
  // the bore at the foot's open end, and a dark plug inside it
  add('dark', place(lathe([[F.end - 14, 0], [F.end - 14, 8.7], [F.end - 0.5, 8.7]], { segs: 40 }), V3(0, 0, 0), AX));

  // ---- the lip plate and riser ----
  const lp = lipPlate();
  const lpC = V3(0, 0, -4);
  add('silver', faceOut(lp.top, lpC), faceOut(lp.bot, V3(0, 0, 40)), faceOut(lp.rim, V3(0, lp.HY, 8)), faceOut(lp.outerW, V3(0, lp.HY, 12)));
  add('riser', faceOut(lp.wallTop, V3(0, lp.HY, 12.8), true));
  add('bore', faceOut(lp.wallLow, V3(0, lp.HY, 8.5), true), withUV(lp.floor));

  // ---- tone holes (chimneys) and their dark insides ----
  for (const c of CUPS) {
    if (c.plate) continue;
    const n = nrm(c.th), seat = rad(c.x, c.th, F.seat);
    add('silver', place(chimney(c.r), seat.clone(), n));
    add('dark', place(holeDark(c.r), seat.clone(), n));
  }

  // ---- rods, ribs, posts ----
  const rodLine = (rd, x0 = rd.x0, x1 = rd.x1, r = 1.9) => { const p = rad(0, rd.th, rd.R); return cylX(x0, x1, p.y, p.z, r, 18); };
  const gaps = (rd, xs) => { for (const x of xs) { const p = rad(0, rd.th, rd.R); add('satin', cylX(x - 0.35, x + 0.35, p.y, p.z, 1.93, 16)); } };
  for (const key of ['rodBody', 'rodG', 'rodFoot', 'rodGiz', 'rodTrill']) add('silver', rodLine(F[key]));
  gaps(F.rodBody, [238.5, 249.5, 271.5, 292.5, 316.5, 341.5, 366, 389.5, 395.2, 421, 451.5]);
  gaps(F.rodFoot, [503, 516, 552, 589]);
  const posts = { rodBody: [216, 271.5, 316.5, 387.5, 475.5], rodG: [316, 366], rodFoot: [483.5, 552, 647], rodGiz: [509, 592], rodTrill: [186, 284, 458] };
  for (const [key, xs] of Object.entries(posts)) {
    const rd = F[key];
    for (const x of xs) add('silver', ...post(x, rd));
    // a slotted pivot-screw head on the outside of each end post (the rod's screws)
    for (const [x, dir] of [[xs[0], -1], [xs[xs.length - 1], 1]]) {
      const c = rad(0, rd.th, rd.R), x0 = x + dir * 2.1, x1 = x + dir * 2.75;
      add('silver', cylX(Math.min(x0, x1), Math.max(x0, x1), c.y, c.z, 1.15, 16));
      const slot = new THREE.BoxGeometry(0.3, 2.1, 0.32); slot.rotateX(-rd.th * RAD); slot.translate(x1 + dir * 0.02, c.y, c.z);
      add('dark', slot);
    }
    if (key !== 'rodGiz') add('silver', rib(xs[0] - 3.5, xs[xs.length - 1] + 3.5, rd.th, 4.4));
    else add('silver', rib(xs[0] - 3, xs[0] + 3, rd.th, 4), rib(xs[1] - 3, xs[1] + 3, rd.th, 4));
  }
  // adjusting screws: a small lug on the hinge tube beside the arms of the linked keys, a slotted screw in each
  for (const x of [311.5, 384.5, 412.5, 442.5, 460.5]) {
    const rd = F.rodBody, dir = nrm(rd.th + 70), c0 = rad(x, rd.th, rd.R), tipS = c0.clone().addScaledVector(dir, 3.7);
    add('silver', sweep([c0.clone().addScaledVector(dir, 1.2), tipS], 1, { up: AX, scaleN: 1.15, scaleB: 0.95, sq: 4, segs: 16, capA: true, capB: true }));
    add('silver', place(lathe([[0, 0], [0, 0.8], [0.5, 0.8], [0.62, 0.66], [0.62, 0]], { segs: 16, crease: 40 }), tipS.clone(), dir));
  }
  // needle springs: a blued-steel wire from a little spring post on the rib to a hook on each key's hinge tube,
  // lying between the rod and the tube (the thin dark line a real flute shows under its rod)
  for (const c of CUPS) {
    if (c.shut || c.plate || c.foot || c.id === 'Th') continue;                         // (the foot's read as dashes in front: left out)
    const rd = F[c.rod], th = rd.th + 14, R = F.R + 2.1;   // (the foot's lie beyond its rod, out of the front view)
    const x0 = c.x - (c.foot ? 13 : 11), x1 = c.x - 3;
    add('spring', sweep([rad(x0, th, R), rad(x1, th, R + 0.4)], 0.26, { segs: 8, capA: true, capB: true }));
    add('silver', place(lathe([[0, 0], [0, 0.75], [2.4, 0.6], [2.6, 0]], { segs: 12 }), rad(x0, th, F.R - 0.2), nrm(th)));
  }

  // ---- the moving parts ----
  const parts = {};               // id -> { group, pivot, sign, angle, mats: [materials to paint], anchor, out }
  const mkPart = (id, rdKey, opt = {}) => {
    const rd = F[rdKey], piv = opt.pivot ? opt.pivot.clone() : rad(0, rd.th, rd.R);
    const g = new THREE.Group(); g.name = id; g.position.copy(piv);
    const joint = joints[jointOf(opt.xMid)]; joint.add(g);
    const mat = M.silver.clone(); mat.name = 'key:' + id; mat.clearcoat = 0.001; mat.roughness = 0.06; mat.color.set(0xe9e8e1); mat.vertexColors = true;
    const p = { id, group: g, pivot: piv, sign: 1, angle: opt.angle || 7 * RAD, mat, meshes: [], x: 0, v: 0, to: 0, paint: 0, paintTo: 0, col: new THREE.Color(0xf0f0f1), colTo: new THREE.Color(0xf0f0f1), out: opt.out || null, anchor: opt.anchor || null, xMid: opt.xMid, joint, axis: opt.axis || null, rot: 0 };   // axis: null = about its rod (along x)
    parts[id] = p;
    return p;
  };
  const partAdd = (p, matKey, ...gs) => {
    for (const g0 of gs) {
      const g = withUV(g0); if (matKey === 'key') contactShade(g); g.translate(-p.pivot.x, -p.pivot.y, -p.pivot.z);
      const m = new THREE.Mesh(g, matKey === 'key' ? p.mat : M[matKey]); m.name = p.id + ':' + matKey;
      p.group.add(m); p.meshes.push(m);
    }
  };
  // which way round the rod makes `probe` move along `want` (out of / into the tube)
  const chooseSign = (p, probe, want) => {
    const v = probe.clone().sub(p.pivot), a = v.clone().applyAxisAngle(p.axis || AX, 0.01).sub(v);
    p.sign = a.dot(want) >= 0 ? 1 : -1;
  };

  // Cups: shell + pad, the arm to the rod, a hinge tube
  for (const c of CUPS) {
    const rd = F[c.rod], n = nrm(c.th), seat = rad(c.x, c.th, F.seat);
    const isTh = c.id === 'Th';      // the thumb's cup rocks on the cross axle; its lever is built with the thumb keys below
    const p = mkPart(c.id, c.rod, isTh ? { angle: TH.ang, out: n.clone(), xMid: c.x, pivot: TH.pv, axis: TH.ax } : { angle: (c.shut ? 7.5 : 8.5) * RAD, out: n.clone(), xMid: c.x });
    p.cup = c; p.size = c.r; p.anchor = seat.clone().addScaledVector(n, 4.3 * Math.sqrt(c.r / 9.3));
    partAdd(p, 'key', place(cupShell(c.r, isTh), seat.clone(), n));
    if (!c.plate) partAdd(p, 'pad', place(cupPad(c.r), seat.clone().addScaledVector(n, 0.02), n));
    if (isTh) { chooseSign(p, seat, n); continue; }
    // the arm: from the cup's side nearest the rod, down to the hinge tube
    const piv = rad(c.x, rd.th, rd.R);
    const toRod = piv.clone().sub(seat); toRod.addScaledVector(n, -toRod.dot(n)).normalize();
    const h = Math.sqrt(c.r / 9.3);
    if (c.foot) {
      // the foot's keys: a long point lying on the cup, out from the rod above
      const tipP = seat.clone().addScaledVector(n, 4.2 * h + 0.65);
      const mid = tipP.clone().lerp(piv, 0.5); mid.addScaledVector(nrm((c.th + rd.th) / 2), 1.6);
      const P = spline([piv.clone().addScaledVector(nrm(rd.th), 0.3), mid, tipP.clone().addScaledVector(toRod, c.r * 0.97).addScaledVector(n, -0.9 * h), tipP.clone().addScaledVector(toRod, c.r * 0.55).addScaledVector(n, -0.12), tipP.clone().addScaledVector(toRod, -c.r * 0.15)], 40);
      // a flat strap that narrows to a point on the cup's crown
      partAdd(p, 'key', sweep(P, (s, L) => 1 - 0.94 * smooth(0.5, 1, s / L), { up: AX, scaleN: 1.0, scaleB: 0.62, sq: 2.2, segs: 14, capA: true, capB: true }));
    } else {
      // a teardrop tail (about half the cup's width where it leaves the cup, 3.5 mm at the hinge tube): it shows
      // in front between the cup and the rod, as on every real flute
      const a0 = seat.clone().addScaledVector(toRod, c.r - 2.6).addScaledVector(n, 2.3 * h);
      const out = seat.clone().addScaledVector(toRod, c.r + 1.4).addScaledVector(n, 2.05 * h);
      const P = spline([a0, out, piv.clone().lerp(out, 0.45).addScaledVector(n, 0.5), piv], 28);
      const wMax = Math.min(6.4, c.r * 0.7);
      const k35 = 3.4 / wMax;
      // (waisted: broad where it leaves the rim, drawing in quickly, then a slim neck down to the hinge tube)
      partAdd(p, 'key', sweep(P, (s, L) => { const t = clamp((s / L - 0.1) / 0.55, 0, 1); return k35 + (1 - k35) * (1 - t) * (1 - t); }, { up: AX, scaleN: wMax / 2, scaleB: 0.95, sq: 3.4, segs: 18, capA: true, capB: true }));
      if (!c.plate) {
        // the pointed arm: up over the rim and along the cup's top, narrowing to a point at the middle
        const S = spline([piv.clone().lerp(out, 0.55).addScaledVector(n, 0.9), seat.clone().addScaledVector(toRod, c.r + 0.75).addScaledVector(n, 2.5 * h), seat.clone().addScaledVector(toRod, c.r * 0.84).addScaledVector(n, 3.72 * h + 0.42), seat.clone().addScaledVector(toRod, c.r * 0.45).addScaledVector(n, 4.26 * h + 0.36), seat.clone().addScaledVector(toRod, -c.r * 0.08).addScaledVector(n, 4.5 * h + 0.1)], 36);
        partAdd(p, 'key', sweep(S, (s, L) => 1 - 0.95 * smooth(0.42, 1, s / L), { up: AX, scaleN: Math.min(1.12, c.r * 0.12), scaleB: 0.6, sq: 3.6, segs: 14, capA: true, capB: true }));
      }
    }
    // the hinge tube (it turns about its own axis, so it can ride with the key)
    const hw = c.plate || c.id === 'Cs' ? 9 : 10;
    partAdd(p, 'key', place(lathe([[c.x - hw / 2, 0], [c.x - hw / 2, 1.75], [c.x - hw / 2 + 0.4, 2.12], [c.x + hw / 2 - 0.4, 2.12], [c.x + hw / 2, 1.75], [c.x + hw / 2, 0]], { segs: 20, crease: 40 }), V3(0, piv.y, piv.z), AX));
    // open = away from the tube
    chooseSign(p, seat, n);
    if (c.foot) p.mat.envMapIntensity = 1.1;
  }
  // the L1 plate's link to the little C♯ cup: a bar from the plate along the rod (rides with the plate)
  {
    const p = parts.L1, rd = F.rodBody;
    partAdd(p, 'key', cylX(232, 256.5, rad(0, rd.th, rd.R).y, rad(0, rd.th, rd.R).z, 2.08, 18));
  }

  // Touches. A pressed touch dips toward the tube by `angle` about its rod.
  const touch = (id, rdKey, gs, anchor, out, angle = 5, o = {}) => {
    const p = mkPart(id, rdKey, Object.assign({ angle: angle * RAD, out, anchor, xMid: anchor.x }, o));
    partAdd(p, 'key', ...gs);
    chooseSign(p, anchor, out.clone().negate());
    p.touch = true; p.xMid = anchor.x;
    return p;
  };
  // G♯ (left little finger): a spoon on the top side, a leg over the front between the two G cups, down to the rod
  {
    // the spoon stands well up above the tube on a stem (every product photo), facing the way the cups do
    // a comma-shaped paddle (about 19 x 12 mm) whose narrow end flows into a flat stem 4.5 mm wide
    // one swept piece: a round end (a half circle 12 mm across in outline) tapering into the stem, flat, facing the camera
    const CP = spline([V3(320.5, 24.2, 3.1), V3(324.5, 23.4, 3.1), V3(329, 21.6, 3.0), V3(333, 18.9, 2.9), V3(336.2, 15.9, 2.8), V3(338.4, 13.6, 2.75)], 40);
    const comma0 = sweep(CP, (sx, L) => sx < 6 ? Math.sqrt(Math.max(0.02, 1 - Math.pow((6 - sx) / 6, 2))) : 1 - 0.62 * smooth(6, L, sx), { up: AZ, scaleN: 1.05, scaleB: 6, sq: 2.6, segs: 28, capA: true, capB: true });
    const comma = comma0.applyMatrix4(new THREE.Matrix4().makeTranslation(338.4, 13.6, 2.75).multiply(new THREE.Matrix4().makeRotationX(-15 * RAD)).multiply(new THREE.Matrix4().makeTranslation(-338.4, -13.6, -2.75)));
    const stem = strap(spline([V3(338.2, 13.9, 2.75), V3(339.8, 12.4, 2.8), rad(340.8, 70, 12.1), rad(341.3, 50, 12.8), rad(341.5, 20, 12.6), rad(341.5, -20, 12.8), rad(341.5, -48, 14.6), rad(341.5, F.rodBody.th, F.rodBody.R)], 40), 3.2, 1.9);
    touch('Gs', 'rodBody', [comma, stem], V3(327, 22.0, 4.4), nrm(12), 5);
  }
  // B♭ lever (the side of the right index finger): a bulge just head-side of R1, a bar headward along the rod
  // (low between the G and R1 cups, close over the tube; its arm runs under the main rod to its own hinge)
  const bblHook = sweep(spline([rad(393.6, 6, 12.0), rad(393.3, -4, 11.95), rad(392.6, -16, 12.0), rad(392.0, -28, 12.3)], 30), (sx, L) => sx < 3.4 ? Math.sqrt(Math.max(0.03, 1 - Math.pow((3.4 - sx) / 3.4, 2))) : 1 - 0.55 * smooth(3.4, L, sx), { up: nrm(-8), scaleN: 0.9, scaleB: 3.5, sq: 2.6, segs: 24, capA: true, capB: true });
  // (a small hooked spoon: a round touch at the top, tapering down into its arm)
  touch('BbL', 'rodBody', [bblHook, strap(spline([rad(392.2, -30, 12.0), rad(392.2, -52, 11.6), rad(392.2, F.rodBody.th, F.rodBody.R)], 16), 2.0, 1.2), (() => { const q = rad(0, F.rodBody.th, F.rodBody.R); return cylX(389.8, 394.9, q.y, q.z, 2.1, 18); })(), sweep(spline([rad(392.4, -30, 12.1), rad(389.5, -40, 12.5), rad(384, -45, 12.9), rad(376, -46, 13.0), rad(368.5, -46, 12.9)], 30), (sx, L) => 1 - 0.3 * smooth(0.6, 1, sx / L), { up: nrm(-46), scaleN: 0.7, scaleB: 1.5, sq: 3, segs: 14, capA: true, capB: true })], rad(392.2, -14, 13.7), nrm(-22), 6);
  // trill keys: upright pills low between the right-hand cups, arms round under the main rod to the trill rod at the back
  for (const [id, x] of [['trD', 421], ['trDs', 451.5]]) {
    // upright pills between the right-hand cups, close over the tube; the arm passes under the main rod to the trill rod
    const pill = touchPad(x, -12, 11.4, 5.6, 12.5, 1.8);
    const arm = strap(spline([rad(x, -34, 11.8), rad(x, -58, 11.3), rad(x, -74, 12.6), rad(x, -80, 16.0), rad(x, F.rodTrill.th, F.rodTrill.R)], 24), 3.0, 1.5);
    touch(id + ':t', 'rodTrill', [pill, arm], rad(x, -12, 13.2), nrm(-12), 6);    // (the cup at the back keeps the plain id)
  }
  // ---- the thumb keys, on the back (from two photographs of real flutes seen from behind) ----
  // Two long levers lie along the tube and rock like see-saws on the short axle that crosses it (TH):
  //  * the B key: the thumb's cup, a gently dished leaf-shaped plate for the thumb foot-side of it, whose top edge runs
  //    on into a square bar that grows out of the leaf, crosses the axle and ends in a tail;
  //  * the Briccialdi B♭ lever: a comma-shaped domed paddle lying over the cup (pressing it shuts the cup too), a stout
  //    half-round arm from the paddle's rod-side corner that steps down onto the axle beside the bar, and a tail that
  //    lifts the two little feet of the B♭ key.
  {
    const cTh = CUPS.find(c => c.id === 'Th'), th0 = cTh.th, hh = Math.sqrt(cTh.r / 9.3), n = nrm(th0), t = tan(th0), seat = rad(cTh.x, th0, F.seat), pTh = parts.Th;
    const rotM = ang => new THREE.Matrix4().makeTranslation(TH.pv.x, TH.pv.y, TH.pv.z).multiply(new THREE.Matrix4().makeRotationAxis(TH.ax, ang)).multiply(new THREE.Matrix4().makeTranslation(-TH.pv.x, -TH.pv.y, -TH.pv.z));
    const Mopen = rotM(pTh.sign * TH.ang);               // from "cup shut" to the key at rest (cup up, tail down)
    const hingeTube = (s0, s1, r = 1.9) => place(lathe([[0, 0], [0, r - 0.32], [0.32, r], [s1 - s0 - 0.32, r], [s1 - s0, r - 0.32], [s1 - s0, 0]], { segs: 22, crease: 40 }), TH.at(s0), TH.ax);

    // -- the B key (drawn at rest, as in the photographs: plate and bar level with the tube; then turned to "cup shut",
    //    the pose every cup is built in). The plate lies in a plane 14.1 mm from the axis, facing θ -158. --
    const Mshut = rotM(-pTh.sign * TH.ang), thL = -158, nL = nrm(thL), tL = tan(thL), RL = 14.1;
    const leafPt = (u, w, h) => V3(265 + u, 0, 0).addScaledVector(nL, RL + h).addScaledVector(tL, w);      // u from the cup's middle, w across (+ = the rod's side)
    const LEAF = [[9.0, 4.85], [13, 4.85], [18, 4.85], [23, 4.85], [28, 4.85], [31.6, 4.8], [32.3, 3.3], [31.6, 1.8], [30.2, 1.5], [28.9, 0.8], [27.7, -0.6], [25.6, -2.6], [22, -4.2], [17.5, -4.85], [12.8, -4.75], [9.6, -3.9], [7.9, -2.0], [7.5, 0.6], [7.8, 3.2]];
    // a shallow dish, deepest along the middle, rising to a rounded rim
    const leaf = plateGeo(LEAF, [16, 1.2], leafPt, { thick: 1.5, dome: 0, edge: 0.075, NT: 168, NR: 12, top: (u, w, rho) => -0.6 * (1 - Math.pow(rho, 6)) * (1 - Math.pow(Math.abs(w + 0.4) / 5.25, 2.4)) });
    // the bar grows out of the leaf's upper edge: a low ridge along that edge at first (its outer side always ON the
    // edge), widening and rising to the full square bar by the neck
    const bar0 = 265 + 24.5, barEnd = 327.6, grow = x => smooth(0, 6.2, x - bar0), barK = x => 0.5 + 0.5 * grow(x);
    const bar = sweep(densify([bar0, 265 + 31.5, TH.x, 314, barEnd].map(x => V3(x, 0, 0)), 0.6).map(q => { const x = q.x; return q.addScaledVector(nL, RL + 0.15 + 1.25 * grow(x) - 1.1 * barK(x)).addScaledVector(tL, 4.85 - 1.6 * barK(x)); }),
      (s, L) => (0.5 + 0.5 * smooth(0, 6.2, s)) * (1 - 0.2 * smooth(L - 1.1, L, s)), { up: tL, scaleN: 1.6, scaleB: 1.1, sq: 6, segs: 24, capA: true, capB: true });
    partAdd(pTh, 'key', bar.applyMatrix4(Mshut), leaf.applyMatrix4(Mshut), hingeTube(-2.1, 2.9));
    pTh.anchor = leafPt(17, 0, 1.0).applyMatrix4(Mshut); pTh.out = nL.clone();       // the thumb's place is the leaf

    // -- the Briccialdi lever (built at rest: the paddle just over the open cup) --
    const Tp = 1.5, dome = 1.6, C = seat.clone().addScaledVector(n, 4.5 * hh + 0.3 + Tp / 2).addScaledVector(AX, 3.0).addScaledVector(t, -0.6);
    const padPt = (u, v, h) => C.clone().addScaledVector(AX, u).addScaledVector(t, v).addScaledVector(n, h).applyMatrix4(Mopen);
    // an egg, broad across the top and narrower below, its foot-side edge slanting back; the arm leaving its top makes it a comma
    const PADDLE = [[1.5, 6.4], [5.0, 5.2], [6.3, 2.2], [5.6, -1.2], [4.0, -4.0], [1.2, -5.9], [-2.2, -5.4], [-4.8, -2.8], [-5.9, 0.8], [-4.9, 4.0], [-2.2, 6.0]];
    const paddle = plateGeo(PADDLE, [0.3, 0.3], padPt, { thick: Tp, dome, pillow: true, NR: 12, NT: 144 });
    // a little web rounding the corner between the arm and the paddle's foot-side edge
    const web = plateGeo([[5.5, 4.7], [7.2, 4.55], [9.2, 4.5], [7.7, 3.85], [6.85, 2.9], [6.4, 1.4], [5.8, 2.4], [5.5, 3.6]], [6.3, 3.9], (u, v, h) => padPt(u, v, h - 0.3), { thick: 1.2, dome: 0.15, edge: 0.2, NT: 64, NR: 5 });
    const neck = padPt(6.4, 5.3, -0.35), Rn = Math.hypot(neck.y, neck.z), thN = Math.atan2(neck.y, neck.z) / RAD;      // the arm leaves the paddle level
    const tT = thN - 7, RT = 16.6;                         // its tail lies beside the bar's rod-side edge
    const armEnd = barEnd - 4.8, bendAt = x => { const q = smooth(293, 308, x); return rad(x, thN + (tT - thN) * q, (Rn - 0.45) + (RT + 0.1 - (Rn - 0.45)) * q); };
    const arm = sweep(spline([padPt(0.0, 4.6, 0.2), padPt(3.4, 5.1, 0.05), neck, rad(280, thN, Rn - 0.1), rad(287, thN, Rn - 0.25), ...[293, 296, 299, 302, 305, 308].map(bendAt), rad(314, tT, RT), rad(armEnd, tT, RT - 0.1)], 110),
      (s, L) => (0.66 + 0.34 * smooth(4, 24, s) - 0.15 * smooth(36, 46, s)) * (1 - 0.2 * smooth(L - 1.0, L, s)),
      { up: tan(thN), scaleN: 1.7, scaleB: 1.15, sq: 2.3, segs: 24, capA: true, capB: true });
    const sA = TH.sOf(tT), boss = sweep([TH.at(sA), TH.at(sA).addScaledVector(nrm(tT), 4.9)], 1, { up: AX, scaleN: 1.35, scaleB: 1.3, sq: 4, segs: 16, capA: true, capB: true });
    const pTb = touch('Tb', 'axThumb', [paddle, web, arm, boss, hingeTube(3.2, 8.4)], padPt(0, 0, Tp / 2 + dome), nrm(th0), 5, { pivot: TH.pv, axis: TH.ax });
    pTb.angle = TH.ang;

    // -- the axle and its two posts (still) --
    const sB = TH.sOf(-172), sT = TH.sOf(-110), pB = TH.at(sB), pT = TH.at(sT), rB = 1.95;
    add('satin', place(lathe([[0, 0], [0, 1.0], [sT - sB, 1.0], [sT - sB, 0]], { segs: 14 }), pB.clone(), TH.ax));
    // the low post: a plain ball on a short neck, on a long pointed foot that lies on round the tube; one small hole for the pivot screw
    add('silver', ball(pB, rB, 28), place(lathe([[0, 0], [0, 2.6], [0.45, 2.25], [1.2, 1.5], [3.2, 1.5], [3.2, 0]], { segs: 18 }), rad(TH.x, -172, F.R + 0.25), nrm(-172)));
    { const P = []; for (let k = 0; k <= 34; k++) { const q = k / 34, w = 1 - 0.95 * smooth(0.7, 1, q); P.push(rad(TH.x, -160 - 70 * q, F.R + 0.03 + 0.42 * w)); }       // (thinning down ONTO the tube: no lifted tip)
      add('silver', sweep(P, (s, L) => (1 - 0.95 * smooth(0.7, 1, s / L)) * Math.sqrt(Math.max(0.06, 1 - Math.pow(Math.max(0, 1 - s / 2.4), 2))), { up: AX, scaleN: 2.2, scaleB: 0.45, sq: 3, segs: 14, capA: true, capB: true })); }
    { const hole = new THREE.CircleGeometry(0.5, 20); hole.applyMatrix4(new THREE.Matrix4().makeBasis(AX, nrm(F.axThumb.th), TH.ax.clone().negate()).setPosition(TH.at(sB - rB - 0.015))); add('dark', hole); }
    // the tall post on the rod side: a pillar with a round head the axle's end sits in
    { const a = rad(TH.x, -110, F.R + 0.4), len = pT.distanceTo(a);
      add('silver', place(lathe([[0, 0], [0, 2.7], [0.55, 2.4], [1.5, 1.6], [len - 0.4, 1.6], [len, 0]], { segs: 18 }), a, nrm(-110)), rib(TH.x - 3.4, TH.x + 3.4, -110, 3.8), ball(pT, 2.05, 28)); }

    // -- the B♭ key's feet: an arm from the main rod round under the trill rod, ending in two short pointed feet side by
    //    side that rest on the Briccialdi's tail (drawn at rest, then turned to the B♭ cup's "shut" pose) --
    { const pBb = parts.Bb, rd = F.rodBody, q = rad(0, rd.th, rd.R), x = armEnd - 1.6;
      const M = new THREE.Matrix4().makeTranslation(q.x, q.y, q.z).multiply(new THREE.Matrix4().makeRotationX(-pBb.sign * pBb.angle)).multiply(new THREE.Matrix4().makeTranslation(-q.x, -q.y, -q.z));
      const A = rad(x, -110, 20.3), B = rad(x, tT, RT + 1.0 + 0.55), e = B.clone().sub(A), len = e.length(); e.normalize();
      const nF = V3().crossVectors(e, AX); if (nF.dot(A) < 0) nF.negate();
      const pieces = [sweep(spline([rad(x, rd.th, rd.R), rad(x, -80, 16.2), rad(x, -96, 17.3), rad(x, -106, 19.3), A.clone().addScaledVector(e, 0.5).addScaledVector(nF, -0.25)], 32), (s, L) => 1 - 0.3 * smooth(0.6, 1, s / L), { up: AX, scaleN: 1.15, scaleB: 1.0, sq: 2.3, segs: 18, capA: true, capB: true })];
      for (const dx of [-1.32, 1.32]) pieces.push(plateGeo([[0, -1.1], [0, 1.1], [2.6, 1.15], [len - 2.3, 1.15], [len, 0], [len - 2.3, -1.15], [2.6, -1.15]], [len * 0.45, 0],
        (u, v, h) => A.clone().addScaledVector(e, u).addScaledVector(AX, v + dx).addScaledVector(nF, h), { thick: 1.0, dome: 0.2, edge: 0.16, NT: 64, NR: 5 }));
      partAdd(pBb, 'key', cylX(x - 2.4, x + 2.4, q.y, q.z, 2.12, 18), ...pieces.map(g => g.applyMatrix4(M))); }
  }
  // E♭ (right little finger): a touch beside the socket below the tube, its strap round the front up to the foot rod
  {
    // a broad flat paddle well below the tube, its face turned ~35° toward the front so it reads from the front (as on a real foot)
    const sp = touchPad(484.2, -80, 17.2, 13.5, 22, 2.0, { tilt: 46, sq: 3.6 });
    const st = strap(spline([rad(487.6, -80, 17.0), rad(487.6, -45, 13.2), rad(487.6, -10, 12.6), rad(487.6, F.rodFoot.th, F.rodFoot.R)], 28), 2.6, 1.3);
    touch('Eb', 'rodFoot', [sp, st], rad(484, -90, 19.2), nrm(-54), 5);
  }
  // the rollers (C roller beyond, B roller next to the rod), the C♯ touch under them, the gizmo at their far ends
  const roller = (id, th, out) => {
    const R = 14.6, a = rad(0, th, R), g = place(lathe([[491.5, 0], [491.5, 1.45], [492, 1.95], [493.2, 2.3], [496, 2.72], [500, 2.9], [504, 2.72], [506.8, 2.3], [508, 1.95], [508.5, 1.45], [508.5, 0]], { segs: 48, crease: 40 }), V3(0, a.y, a.z), AX);
    // the lugs drop from the axle ends down to the tube and run up close along its surface to the rod (a roller sits
    // at the end of its key's lever, which hugs the foot), not in loops over the front
    const lugs = (th < -15 ? [490.4, 509.6] : [492.0, 508.0]).map(x => strap(spline([rad(x, th, R), rad(x, th + 2, 12.3), rad(x, (th + F.rodFoot.th) / 2, 11.5), rad(x, F.rodFoot.th - 6, 12.0), rad(x, F.rodFoot.th, F.rodFoot.R)], 24), 2.0, 1.0));
    const axle = cylX(490.5, 509.5, a.y, a.z, 0.8, 10);
    return touch(id, 'rodFoot', [g, axle, ...lugs], rad(500, th, R + 2.6), nrm(th), 4);
  };
  roller('B', -6, nrm(-6));
  roller('C', -30, nrm(-30));
  {
    const sp = touchPad(502.5, -70, 17.2, 21, 15, 2.0, { tilt: 40, sq: 3.4 });
    // its tail runs close over the tube (under the rollers' line), not in a hoop in front of them
    const tail = strap(spline([rad(513, -66, 16.8), rad(517.5, -45, 13.4), rad(518.5, -15, 12.4), rad(518.5, 5, 12.3), rad(518.5, F.rodFoot.th, F.rodFoot.R)], 30), 2.6, 1.3);
    touch('CsT', 'rodFoot', [sp, tail], rad(503, -72, 19.0), nrm(-46), 5);
  }
  {
    const pad = touchPad(512.5, -18, 16.2, 6.5, 9, 2.0, { tilt: 0 });
    const st = strap(spline([rad(512.5, -10, 16.0), rad(512.5, 0, 12.6), rad(512.5, 18, 11.6), rad(512, 38, 11.9), rad(511, F.rodGiz.th, F.rodGiz.R)], 24), 2.2, 1.2);
    const p = touch('giz', 'rodGiz', [pad, st], rad(512.5, -18, 18.2), nrm(-18), 5);
    // the gizmo's piece at the far end: an arm from its rod down onto the last cup's arm
    partAdd(p, 'key', strap(spline([rad(590, F.rodGiz.th, F.rodGiz.R), rad(596, 40, 14.4), rad(600, F.rodFoot.th + 2, F.rodFoot.R + 1.6)], 16), 2.2, 1.3));
  }
  // felt bumpers under the touches (dark specks where the keys stop)
  // (felt bumpers under the touches were tried: from the front they read as stray black dots, so they are left out)

  // ---- merge the still parts by material ----
  const meshes = [];
  for (const [j, byMat] of Object.entries(statics)) for (const [k, list] of Object.entries(byMat)) {
    if (!list.length) continue;
    const m = new THREE.Mesh(merge(list), M[k]); m.name = j + ':' + k; joints[j].add(m); meshes.push(m);
  }
  // each key's pieces become one mesh per material (fewer draw calls: matters on a school Chromebook)
  for (const p of Object.values(parts)) {
    const byMat = new Map();
    for (const m of p.meshes) { if (!byMat.has(m.material)) byMat.set(m.material, []); byMat.get(m.material).push(m); }
    const merged = [];
    for (const [mat, list] of byMat) {
      const g = merge(list.map(m => m.geometry));                       // (always: it also gives every piece a colour attribute)
      const mesh = new THREE.Mesh(g, mat); mesh.name = list[0].name;
      for (const m of list) p.group.remove(m);
      p.group.add(mesh); merged.push(mesh);
    }
    p.meshes = merged;
    meshes.push(...merged);
  }
  // what can hide a name tag: the tube and the rods, as capsules
  const capsules = [{ id: 'tube', a: V3(F.crown, 0, 0), b: V3(F.end, 0, 0), r: F.R }, { id: 'plate', a: V3(-18, 1, 11), b: V3(18, 1, 11), r: 3 }];
  for (const key of ['rodBody', 'rodFoot', 'rodTrill']) { const rd = F[key]; capsules.push({ id: key, a: rad(rd.x0, rd.th, rd.R), b: rad(rd.x1, rd.th, rd.R), r: 2 }); }
  // the stand-ins the traced reflections test against: { obj whose matrixWorld places it, a (start), u (axis), r, L }
  const refl = [
    { obj: joints.head, a: V3(F.crown + 4, 0, 0), u: AX.clone(), r: 9.15, L: F.sock[0] - F.crown - 4 },
    { obj: joints.body, a: V3(F.sock[0], 0, 0), u: AX.clone(), r: F.R, L: F.bodyEnd - F.sock[0] },
    { obj: joints.foot, a: V3(F.bodyEnd, 0, 0), u: AX.clone(), r: F.R, L: F.end - F.bodyEnd },
  ];
  // (the rods were tried too: thin as they are, their mirror images broke into ladders, so they are left out)
  for (const c of CUPS) {
    const p = parts[c.id], n = nrm(c.th), seat = rad(c.x, c.th, F.seat);
    refl.push({ obj: p.group, a: seat.clone().sub(p.pivot), u: n, r: c.r, L: 4.2 * Math.sqrt(c.r / 9.3) });
  }
  // assembly guides, shown only while the flute is apart: a thin line through the embouchure hole along the head joint,
  // one along the middle of the body's keys, one along the foot's rod. Put back together, the three run in one line.
  const guideMat = new THREE.MeshBasicMaterial({ color: 0x3b6ea8, transparent: true, opacity: 0, depthWrite: false });
  M.guide = guideMat;
  const guides = [
    ['head', cylX(-58, F.sock[0] + 30, 0, 9.75, 0.32, 8), V3(0, 0, 0)],
    ['body', cylX(F.sock[0] + 3, F.bodyEnd + 18, 0, 9.85, 0.32, 8), V3(0, 0, 0)],
    ['foot', (() => { const q = rad(0, F.rodFoot.th, F.rodFoot.R + 2.1); return cylX(F.bodyEnd + 2, F.end - 6, q.y, q.z, 0.32, 8); })(), V3(0, 0, 0)],
  ].map(([j, g]) => { const m = new THREE.Mesh(withUV(g), guideMat); m.name = 'guide:' + j; m.renderOrder = 2; m.visible = false; joints[j].add(m); return m; });
  return { root, M, parts, meshes, capsules, lip: lp, joints, jointOf, refl, guides };
}


/* ------------------------------------------------------------------ *
 *  Fingerings -> keys
 * ------------------------------------------------------------------ */
// The page's fingering keys: T (thumb on the B key), Tb (thumb B♭), L1 L2 L3, R1 R2 R3, Gs, Eb, Cs, C, B, giz, trD, trDs, BbL.
// Returns which cups are shut, which closed-at-rest cups are opened, and which touches are down.
function linkage(keys) {
  const has = k => keys.has(k), closed = new Set();
  if (has('L1')) { closed.add('L1'); closed.add('Cs'); }
  if (has('L2')) { closed.add('As'); closed.add('Bb'); }
  if (has('L3')) { closed.add('A'); closed.add('Gf'); }
  if (has('R1')) { closed.add('Fs'); closed.add('G'); closed.add('Bb'); }
  if (has('R2')) { closed.add('F'); closed.add('G'); }
  if (has('R3')) { closed.add('E'); closed.add('G'); }
  if (has('Tb') || has('BbL')) closed.add('Bb');
  if (has('T') || has('Tb')) closed.add('Th');
  if (has('Cs')) closed.add('D');
  if (has('C')) { closed.add('D'); closed.add('CsF'); }
  if (has('B')) { closed.add('D'); closed.add('CsF'); closed.add('CF'); }
  if (has('giz')) closed.add('CF');
  const opened = new Set();
  if (has('Eb')) opened.add('Ds');
  if (has('Gs')) opened.add('GsR');
  if (has('trD')) opened.add('trD');
  if (has('trDs')) opened.add('trDs');
  const touches = new Set();
  for (const k of ['Gs', 'Tb', 'BbL', 'Eb', 'C', 'B', 'giz']) if (has(k)) touches.add(k);
  if (has('Cs')) touches.add('CsT');
  if (has('trD')) touches.add('trD:t');
  if (has('trDs')) touches.add('trDs:t');
  return { closed, opened, touches };
}

/* ------------------------------------------------------------------ *
 *  Name tags
 * ------------------------------------------------------------------ */
// Parts view: [text, anchor (mm), outward direction (the tag fades when it faces away)]
const PARTS = [
  ['Crown', [-70, 6, 7], null],
  ['Lip plate', [-15, -7, 11.8], [0, -0.45, 0.9]],
  ['Embouchure hole', [0, 1.2, 13.6], [0, 0, 1]],
  ['Head joint', [60, 9.5, 0.5], null],
  ['Body', [175, 9.5, 0.5], null],
  ['Rod', [258, -15, 8], [0, -0.9, 0.45]],
  ['Post', [216, -15, 8], [0, -0.9, 0.45]],
  ['Thumb keys', [268, -12, -18.5], [0, -0.57, -0.82]],
  ['Trill keys', [421, -2.7, 12.9], [0, -0.2, 1]],
  ['G♯ key', [327, 22.0, 4.2], [0, 0.2, 1]],
  ['Foot joint', [630, 9.5, 0.5], null],
  ['Rollers', [500, -1.8, 17.0], [0, -0.1, 1]],
  ['Gizmo', [512.5, -5.6, 17.3], [0, -0.3, 1]],
  ['E♭ key', [484, -19.2, 0.3], [0, -0.8, 0.6]],
];

const CSS = `
.vf3d-root{position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.vf3d-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;cursor:grab;touch-action:none}
.vf3d-canvas.vf3d-drag{cursor:grabbing}
.vf3d-canvas:focus-visible{outline:2px solid #3b6ea8;outline-offset:-2px;border-radius:12px}
.vf3d-over{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.vf3d-over svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.vf3d-over line{stroke:#1f2937;stroke-width:1;stroke-opacity:.7;transition:opacity .16s}
.vf3d-over circle{fill:#1f2937;transition:opacity .16s}
.vf3d-tag{position:absolute;left:0;top:0;font:600 13px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.28);border-radius:7px;padding:3px 7px 4px;white-space:nowrap;box-shadow:0 1px 3px rgba(31,41,55,.16);will-change:transform,opacity;transition:opacity .16s}
.vf3d-chip{position:absolute;left:0;top:0;min-width:22px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;font:700 12px/18px system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center;color:#1f2937;background:rgba(255,255,255,.94);border:1.5px solid #4b5563;box-shadow:0 1px 3px rgba(31,41,55,.22);white-space:nowrap;will-change:transform,opacity;transition:opacity .14s}
.vf3d-chip.on{background:#1f2937;color:#fff;border-color:#1f2937}
.vf3d-chip.behind{border-style:dashed;box-shadow:none}
.vf3d-pick{z-index:2;font-weight:600;padding:0 9px;transition:none}
.vf3d-chip.on.behind{background:#4b5563;border-color:#1f2937}
`;

/* ------------------------------------------------------------------ *
 *  The viewer
 * ------------------------------------------------------------------ */
// whole-flute views (az from +z toward +x, el up), and close-ups that frame one stretch of the flute
const VIEWS = {
  front:  { az: 0, el: 8 },
  player: { az: -38, el: 13 },
  top:    { az: 0, el: 86 },
  under:  { az: 0, el: -84 },
  back:   { az: 180, el: 8 },
  foot:   { az: 66, el: 14 },
  head:   { az: -18, el: 22, x: [-80, 70], zoom: true },
  left:   { az: -8, el: 14, x: [215, 365], zoom: true },
  right:  { az: -8, el: 10, x: [370, 482], zoom: true },
  footkeys: { az: 8, el: 6, x: [476, 655], zoom: true },
};

export function createFlute(container, options = {}) {
  const opt = Object.assign({ labels: 'off', view: 'front', shot: false }, options);
  if (!document.getElementById('vf3d-style')) { const st = document.createElement('style'); st.id = 'vf3d-style'; st.textContent = CSS; document.head.appendChild(st); }
  container.classList.add('vf3d-root');
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: !!opt.shot, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = FILM ? THREE.CustomToneMapping : THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.9;
  const canvas = renderer.domElement; canvas.className = 'vf3d-canvas'; canvas.setAttribute('aria-label', '3D flute: drag to turn it, pinch or scroll to zoom; with the keyboard, arrows turn it, Page Up and Page Down zoom, Home puts it back');
  container.appendChild(canvas);
  const over = document.createElement('div'); over.className = 'vf3d-over'; container.appendChild(over);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); over.appendChild(svg);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(studioScene(), 0.01, 0.1, 200);
  scene.environment = envRT.texture;
  pmrem.dispose();

  const T = buildFlute();
  scene.add(T.root);
  const PAINTABLE = Object.values(T.parts);
  const ALL_PARTS = T.parts;

  /* ---- the studio, looked up exactly by the polished metal ---- */
  // 'high' = the studio function in the shader; 'plain' = three.js's own baked lookup (the way out if the patch
  // ever fails to compile). The page never depends on the patch.
  const metalMats = [T.M.silver, T.M.satin, T.M.riser, ...PAINTABLE.map(p => p.mat)];
  const target = 'vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n\t\t\treturn envMapColor.rgb * envMapIntensity;';
  const chunk = THREE.ShaderChunk.envmap_physical_pars_fragment || '';
  const usable = chunk.includes(target);
  let level = 'plain';
  const NR = T.refl.length;
  const TU = { fsA: { value: T.refl.map(() => new THREE.Vector4()) }, fsB: { value: T.refl.map(() => new THREE.Vector4()) } };
  const _a = V3(), _u = V3();
  function writeReflectors() {                       // into the camera's frame, every frame (keys move, joints slide)
    const vm = camera.matrixWorldInverse;
    T.refl.forEach((k, i) => {
      _a.copy(k.a).applyMatrix4(k.obj.matrixWorld).applyMatrix4(vm);
      _u.copy(k.u).transformDirection(k.obj.matrixWorld).transformDirection(vm);
      TU.fsA.value[i].set(_a.x, _a.y, _a.z, k.r); TU.fsB.value[i].set(_u.x, _u.y, _u.z, k.L);
    });
  }
  function setLevel(q) {
    q = usable ? (q === 'high' || q === 'low' ? q : 'plain') : 'plain';
    if (q === level) return;
    level = q;
    for (const m of metalMats) {
      delete m.defines.FS_TRACE; delete m.defines.FS_N;
      const isKey = /^key:/.test(m.name);
      if (isKey) m.defines.FS_KEYS = 1;
      if (q === 'plain') { m.onBeforeCompile = () => {}; m.customProgramCacheKey = () => 'vf-plain'; }
      else {
        if (q === 'high') { m.defines.FS_TRACE = 1; m.defines.FS_N = NR; }
        m.customProgramCacheKey = () => 'vf-' + q + (isKey ? '-k' : '');
        m.onBeforeCompile = sh => {
          Object.assign(sh.uniforms, TU);
          sh.fragmentShader = sh.fragmentShader.replace('#include <envmap_physical_pars_fragment>', STUDIO_GLSL + TRACE_GLSL + '\n' +
            chunk.replace(target, 'vec3 fsV = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz );\n\t\t\t#ifdef FS_TRACE\n\t\t\treturn fsRadiance( - vViewPosition + normal * 0.05, fsV, roughness ) * envMapIntensity;\n\t\t\t#else\n\t\t\treturn fsStudio( fsV, roughness ) * envMapIntensity;\n\t\t\t#endif'));
        };
      }
      m.needsUpdate = true;
    }
  }
  let shaderFailed = false;
  renderer.debug.onShaderError = (gl, program, vs, fs) => {
    if (shaderFailed) return;
    shaderFailed = true;
    console.warn('Virtual Flute: the studio shader did not compile here; using plain reflections. ' + (gl.getProgramInfoLog(program) || '') + ' ' + (gl.getShaderInfoLog(fs) || '').slice(0, 600));
  };
  setLevel(opt.reflections === 'plain' ? 'plain' : opt.reflections === 'low' ? 'low' : 'high');

  // points used to frame the flute from any direction
  const fitPts = [];
  const box = new THREE.Box3();
  T.root.updateMatrixWorld(true);
  for (const m of T.meshes) {
    let j = m.parent; while (j && !/^joint:/.test(j.name)) j = j.parent;
    const p = m.geometry.attributes.position, step = Math.max(1, Math.floor(p.count / 1500));
    for (let i = 0; i < p.count; i += step) { const v = V3().fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); v.j = j; fitPts.push(v); box.expandByPoint(v); }
    // and the extremes along the flute, so the nearest end is never cut off in an end-on view
    m.geometry.computeBoundingBox(); const bb = m.geometry.boundingBox;
    for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { const v = V3(x, y, z).applyMatrix4(m.matrixWorld); v.j = j; fitPts.push(v); }
  }
  const centre = box.getCenter(V3());
  // taken apart: the head joint slides off toward the crown, the foot off the end
  const APART = { head: -75, body: 0, foot: 75 };
  // and each end joint turns as it comes off (you twist gently as you pull), so putting it back shows the lining up:
  // the embouchure hole in line with the keys, the foot's rod in line with the middle of the last body key
  const TWIST = { head: -38 * RAD, body: 0, foot: 30 * RAD };
  let apart = 0, apartTo = 0;
  // a point given in the assembled flute's coordinates, where it is now (its joint may be slid off and turned)
  const jointPlace = v => { const g = T.joints[T.jointOf(v.x)]; g.updateMatrix(); return v.applyMatrix4(g.matrix); };
  box.min.x += APART.head; box.max.x += APART.foot;

  /* ---- contact shadow on a floor below, baked once ---- */
  const floorY = -34;
  const shadow = (() => {
    const W = 1024, H = 160, halfW = 480, halfH = 66, cx = centre.x, cz = 0;
    const rtA = new THREE.WebGLRenderTarget(W, H, { depthBuffer: false }), rtB = new THREE.WebGLRenderTarget(W, H, { depthBuffer: false });
    const cam = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 600);
    cam.position.set(cx, 300, cz); cam.up.set(0, 0, -1); cam.lookAt(cx, 0, cz);
    const sil = new THREE.ShaderMaterial({
      uniforms: { y0: { value: floorY } }, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.MaxEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      vertexShader: 'varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'varying float h; void main(){ float k = 1.0 - 0.6 * smoothstep(0.0, 70.0, h); gl_FragColor = vec4(k, k, k, 1.0); }',
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: { tex: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false, depthWrite: false,
      vertexShader: 'varying vec2 u; void main(){ u = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `varying vec2 u; uniform sampler2D tex; uniform vec2 dir;
        void main(){ float s = 0.0, w = 0.0; for (int i = -8; i <= 8; i++){ float f = float(i); float g = exp(-f*f/18.0); s += texture2D(tex, u + dir * f).r * g; w += g; } gl_FragColor = vec4(vec3(s / w), 1.0); }`,
    }));
    const qScene = new THREE.Scene(); qScene.add(quad); const qCam = new THREE.Camera();
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(halfW * 2, halfH * 2), new THREE.ShaderMaterial({
      uniforms: { tex: { value: rtA.texture }, k: { value: 0.3 } }, transparent: true, depthWrite: false,
      vertexShader: 'varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.1, u) * smoothstep(0.0, 0.1, 1.0 - u); gl_FragColor = vec4(0.05, 0.05, 0.06, a * k * e.x * e.y); }',
    }));
    plane.rotation.x = -Math.PI / 2; plane.position.set(cx, floorY, cz); plane.renderOrder = -1; plane.name = 'shadow';
    scene.add(plane);
    const bake = () => {
      const prevTM = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
      plane.visible = false; scene.overrideMaterial = sil;
      renderer.setRenderTarget(rtA); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = null; plane.visible = true;
      const u = quad.material.uniforms;
      for (const r of [4, 2, 1]) {
        u.tex.value = rtA.texture; u.dir.value.set(r / W, 0); renderer.setRenderTarget(rtB); renderer.render(qScene, qCam);
        u.tex.value = rtB.texture; u.dir.value.set(0, r / H); renderer.setRenderTarget(rtA); renderer.render(qScene, qCam);
      }
      renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 0); renderer.toneMapping = prevTM;
    };
    return { plane, bake, dispose() { rtA.dispose(); rtB.dispose(); sil.dispose(); quad.geometry.dispose(); quad.material.dispose(); plane.geometry.dispose(); plane.material.dispose(); } };
  })();
  shadow.bake();

  /* ---- camera, controls ---- */
  const camera = new THREE.PerspectiveCamera(20, 2, 20, 8000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.09;
  controls.minPolarAngle = 0.03; controls.maxPolarAngle = Math.PI - 0.03;
  controls.zoomSpeed = 0.9; controls.screenSpacePanning = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.target.copy(centre);

  let W = 2, H = 2, cssScale = 1, disposed = false, raf = 0, viewName = null, labelMode = 'off', lowRes = false, slow = 0, lastFrame = 0, avgF = 0;
  const viewCbs = [];
  const insets = () => opt.insets || (labelMode === 'parts' ? { l: 14, r: 14, t: 58, b: 84 } : { l: 12, r: 12, t: 14, b: 40 });

  const tmpR = V3(), tmpU = V3(), tmpF = V3(), tmpV = V3();
  function frameFor(az, el, xr) {
    const a = az * Math.PI / 180, e = el * Math.PI / 180;
    tmpF.set(-Math.sin(a) * Math.cos(e), -Math.sin(e), -Math.cos(a) * Math.cos(e));
    tmpR.crossVectors(tmpF, AY).normalize(); tmpU.crossVectors(tmpR, tmpF).normalize();
    const ins = insets(), aw = Math.max(40, W - ins.l - ins.r), ah = Math.max(40, H - ins.t - ins.b);
    const th = Math.tan(camera.fov * Math.PI / 360) * (ah / H), tw = Math.tan(camera.fov * Math.PI / 360) * (aw / H);
    // (where the parts will be once a take-apart under way has finished; a close-up keeps its stretch of the flute)
    const pts = (xr ? fitPts.filter(p => p.x >= xr[0] && p.x <= xr[1]) : fitPts).map(p => { const v = p.clone(); v.x += APART[p.j.name.slice(6)] * apartTo; return v; });
    const bb = new THREE.Box3(); for (const p of pts) bb.expandByPoint(p);
    const target = bb.getCenter(V3()); let dist = 1000;
    for (let it = 0; it < 6; it++) {
      let d = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) {
        tmpV.subVectors(p, target); const px = tmpV.dot(tmpR), py = tmpV.dot(tmpU), pz = tmpV.dot(tmpF);
        d = Math.max(d, Math.abs(px) / tw - pz, Math.abs(py) / th - pz);
        const k = 1 / (dist + pz); x0 = Math.min(x0, px * k); x1 = Math.max(x1, px * k); y0 = Math.min(y0, py * k); y1 = Math.max(y1, py * k);
      }
      target.addScaledVector(tmpR, (x0 + x1) / 2 * dist).addScaledVector(tmpU, (y0 + y1) / 2 * dist);
      dist = d;
    }
    return { dist: dist * 1.04, target };
  }
  function applyOffset() {
    const ins = insets();
    camera.setViewOffset(W, H, -(ins.l - ins.r) / 2, -(ins.t - ins.b) / 2, W, H);
  }
  const cur = { az: 0, el: 0, dist: 1000, target: centre.clone() };
  function placeCamera() {
    const a = cur.az * Math.PI / 180, e = cur.el * Math.PI / 180;
    camera.position.set(cur.target.x + cur.dist * Math.sin(a) * Math.cos(e), cur.target.y + cur.dist * Math.sin(e), cur.target.z + cur.dist * Math.cos(a) * Math.cos(e));
    controls.target.copy(cur.target); camera.lookAt(cur.target);
  }
  function readCamera() {
    const v = camera.position.clone().sub(controls.target); cur.dist = v.length();
    cur.el = Math.asin(clamp(v.y / cur.dist, -1, 1)) * 180 / Math.PI; cur.az = Math.atan2(v.x, v.z) * 180 / Math.PI; cur.target.copy(controls.target);
  }
  let camAnim = null;
  function settle() { controls.enableDamping = false; controls.update(); controls.enableDamping = true; }
  function goTo(az, el, dist, target, ms = 650) {
    settle(); readCamera();
    const daz = ((az - cur.az + 540) % 360) - 180;
    if (!ms) { cur.az = az; cur.el = el; cur.dist = dist; cur.target.copy(target); placeCamera(); controls.update(); camAnim = null; invalidate(); return; }
    camAnim = { t0: performance.now(), ms, az0: cur.az, daz, el0: cur.el, el1: el, d0: cur.dist, d1: dist, tg0: cur.target.clone(), tg1: target.clone() };
    invalidate();
  }
  function limits() {
    const f = frameFor(VIEWS.front.az, VIEWS.front.el);
    controls.minDistance = f.dist * 0.06; controls.maxDistance = f.dist * 2.2;
  }

  /* ---- the keys ---- */
  const SILVER = new THREE.Color(0xe9e8e1);
  const turn = (p, a) => { p.rot = a; if (p.axis) p.group.quaternion.setFromAxisAngle(p.axis, a); else p.group.rotation.x = a; };
  let lastT = 0;
  function animate(now) {
    const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
    let busy = false;
    for (const p of PAINTABLE) {
      if (Math.abs(p.to - p.x) > 1e-4 || Math.abs(p.v) > 1e-3) {
        // a quick sprung move, a touch of overshoot, like a pad landing
        const w = 58, z = 0.78;
        let t = dt; while (t > 0) { const h = Math.min(t, 0.004); p.v += (w * w * (p.to - p.x) - 2 * z * w * p.v) * h; p.x += p.v * h; t -= h; }
        if (Math.abs(p.to - p.x) < 5e-4 && Math.abs(p.v) < 0.02) { p.x = p.to; p.v = 0; }
        turn(p, p.sign * p.angle * clamp(p.x, -0.06, 1.06)); busy = true;
      }
      if (Math.abs(p.paintTo - p.paint) > 1e-3) { p.paint += (p.paintTo - p.paint) * Math.min(1, dt * 20); if (Math.abs(p.paintTo - p.paint) < 0.004) p.paint = p.paintTo; busy = true; }
      const k = p.paint, m = p.mat;
      m.color.copy(SILVER).lerp(p.colTo, k);
      m.metalness = 1 - 0.62 * k; m.roughness = 0.06 + 0.2 * k;
      m.clearcoat = Math.max(0.001, k); m.clearcoatRoughness = 0.06;   // (never 0: that would swap shaders, a hitch on the first note)
      m.emissive.copy(p.colTo).multiplyScalar(0.3 * k);
      if (p === hovered) m.emissive.addScalar(0.1);                       // the key under the pointer glows faintly: it can be tapped
    }
    if (apart !== apartTo) {
      const d = apartTo - apart, step = dt * 2.2;
      apart = Math.abs(d) <= step ? apartTo : apart + Math.sign(d) * step;
      const e = apart * apart * (3 - 2 * apart);
      for (const [j, g] of Object.entries(T.joints)) { g.position.x = APART[j] * e; g.rotation.x = TWIST[j] * smooth(0, 0.7, apart); g.updateMatrix(); }
      T.M.guide.opacity = 0.85 * smooth(0.05, 0.6, apart);
      for (const g of T.guides) g.visible = apart > 0.01;
      if (apart === apartTo) shadow.bake();
      busy = true;
    }
    if (camAnim) {
      const k = clamp((now - camAnim.t0) / camAnim.ms, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cur.az = camAnim.az0 + camAnim.daz * e; cur.el = camAnim.el0 + (camAnim.el1 - camAnim.el0) * e;
      cur.dist = camAnim.d0 + (camAnim.d1 - camAnim.d0) * e; cur.target.lerpVectors(camAnim.tg0, camAnim.tg1, e);
      placeCamera(); if (k >= 1) { camAnim = null; settle(); placeCamera(); } busy = true;
    }
    return busy;
  }
  // rest positions: open-at-rest cups up, the rest down
  for (const p of PAINTABLE) { p.to = p.x = p.cup && !p.cup.shut ? 1 : 0; turn(p, p.sign * p.angle * p.x); }

  /* ---- name tags and chips ---- */
  const tags = [], chips = [];
  function clearTags() { for (const t of tags) { t.el.remove(); t.line.remove(); t.dot.remove(); } tags.length = 0; for (const c of chips) c.el.remove(); chips.length = 0; }
  // what each key says in the Fingers and Names views: [part id, fingers text, names text, shown in Fingers only while pressed]
  const CHIPS = [
    ['L1', 'L1', 'B'], ['Cs', '', 'B'], ['Bb', '', 'B♭'], ['As', 'L2', 'A'], ['A', 'L3', 'G'], ['Gf', '', 'G♯'], ['G', '', 'F♯'],
    ['Fs', 'R1', 'F'], ['F', 'R2', 'E'], ['E', 'R3', 'D'], ['D', '', 'C♯'], ['CsF', '', 'C'], ['CF', '', 'B'],
    ['Gs', 'L4', 'G♯'], ['Th', 'LT', 'thumb B'], ['Tb', 'LT', 'thumb B♭', true], ['BbL', 'R1', 'B♭ lever', true],
    ['trD', 'R2', 'D trill', true], ['trDs', 'R3', 'D♯ trill', true], ['Eb', 'R4', 'E♭'], ['Ds', '', 'E♭'],
    ['CsT', 'R4', 'C♯', true], ['C', 'R4', 'C', true], ['B', 'R4', 'B', true], ['giz', 'R4', 'gizmo', true],
  ];
  let pressedNow = new Set();
  // Tap a key (or any part) to see what it is called and who plays it, whatever the labels button says
  const PICK_NAMES = {};
  for (const [id, fin, name] of CHIPS) PICK_NAMES[id === 'trD' || id === 'trDs' ? id + ':t' : id] = [name, fin];
  Object.assign(PICK_NAMES, { L1: ['B key', 'L1'], Cs: ['B (C♯ cup, closed by L1)', ''], Bb: ['B♭ cup', ''], As: ['A key', 'L2'], A: ['G key', 'L3'], Gf: ['G♯ cup (closed by L3)', ''],
    G: ['F♯ cup (closed by any right-hand finger)', ''], Fs: ['F key', 'R1'], F: ['E key', 'R2'], E: ['D key', 'R3'], D: ['C♯ cup', ''], CsF: ['C cup', ''], CF: ['B cup', ''],
    Gs: ['G♯ key', 'L4'], GsR: ['G♯ cup (opened by the G♯ key)', ''], Th: ['Thumb B key', 'LT'], Tb: ['Thumb B♭ key', 'LT'], BbL: ['B♭ lever', 'R1'],
    'trD:t': ['D trill key', 'R2'], 'trDs:t': ['D♯ trill key', 'R3'], trD: ['D trill cup', ''], trDs: ['D♯ trill cup', ''], Eb: ['E♭ key', 'R4'], Ds: ['E♭ cup (opened by the E♭ key)', ''],
    CsT: ['C♯ key', 'R4'], C: ['C roller', 'R4'], B: ['B roller', 'R4'], giz: ['Gizmo (low B only)', 'R4'] });
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let pick = null;
  function pickAt(cx, cy) {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    ndc.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(T.meshes, false)[0];
    if (pick) { pick.el.remove(); pick = null; }
    if (!hit) { invalidate(); return; }
    const [owner, mat] = hit.object.name.split(':');
    let text;
    if (PICK_NAMES[owner]) { const [n, f] = PICK_NAMES[owner]; text = f ? `${n} · ${f}` : n; }
    else {
      const hl = T.joints[owner] ? hit.point.clone().applyMatrix4(T.joints[owner].matrix.clone().invert()) : hit.point, x = hl.x;
      text = owner === 'head' ? (x < -60 ? 'Crown' : Math.abs(x) < 26 && hl.z > 9.6 ? (Math.abs(x) < 7 && Math.abs(hl.y - 2) < 6 ? 'Embouchure hole' : 'Lip plate') : 'Head joint')
        : owner === 'foot' ? 'Foot joint' : mat === 'spring' ? 'Needle spring' : 'Body';
      if (mat === 'silver' && Math.hypot(hl.y, hl.z) > F.R + 1.2 && owner !== 'head') text = Math.hypot(hl.y, hl.z) > 12 ? 'Rod and posts' : text;
    }
    const el = document.createElement('div'); el.className = 'vf3d-chip on vf3d-pick'; el.textContent = text; over.appendChild(el);
    const local = hit.point.clone(); let j = hit.object.parent; while (j && !/^joint:/.test(j.name)) j = j.parent;
    if (j) { j.updateMatrix(); local.applyMatrix4(j.matrix.clone().invert()); }
    pick = { el, local, joint: j, until: performance.now() + 2600, w: el.offsetWidth, h: el.offsetHeight };
    invalidate();
  }
  function layoutPick(now) {
    if (!pick) return false;
    if (now > pick.until) { pick.el.remove(); pick = null; return false; }
    const s = project(pick.joint ? wp.copy(pick.local).applyMatrix4(pick.joint.matrix) : wp.copy(pick.local));
    pick.el.style.transform = `translate(${(s.x - pick.w / 2).toFixed(1)}px,${(s.y - pick.h - 16).toFixed(1)}px)`;
    pick.el.style.opacity = Math.min(1, (pick.until - now) / 400).toFixed(2);
    return true;
  }
  function buildTags() {
    clearTags();
    if (labelMode === 'parts') {
      for (const [text, pos, out] of PARTS) {
        const el = document.createElement('div'); el.className = 'vf3d-tag'; el.textContent = text; over.appendChild(el);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'), dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', 2.4); svg.appendChild(line); svg.appendChild(dot);
        tags.push({ el, line, dot, pos: V3(...pos), out: out ? V3(...out).normalize() : null, w: 0, h: 0, side: 0, x: 0, y: 0, a: 1 });
      }
      for (const t of tags) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
    } else if (labelMode === 'fingers' || labelMode === 'names') {
      for (const [id, fin, name, onlyPressed] of CHIPS) {
        const text = labelMode === 'fingers' ? fin : name; if (!text) continue;
        const pid = id === 'trD' || id === 'trDs' ? id + ':t' : id;
        const p = ALL_PARTS[pid] || ALL_PARTS[id]; if (!p || !p.anchor) continue;
        const el = document.createElement('div'); el.className = 'vf3d-chip'; el.textContent = text; over.appendChild(el);
        chips.push({ el, p, pid, only: labelMode === 'fingers' && !!onlyPressed, prio: fin ? 0 : 1, w: 0, h: 0 });
      }
      for (const c of chips) { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; }
    }
  }
  const pv = V3(), camDir = V3(), wp = V3(), camR = V3();
  function project(p) {
    pv.copy(p);
    const beh = pv.clone().sub(camera.position).dot(camera.getWorldDirection(camDir)) < 0;
    pv.project(camera);
    return { x: (pv.x * 0.5 + 0.5) * W, y: (-pv.y * 0.5 + 0.5) * H, behind: beh };
  }
  const eyeEnd = V3();
  function hidden(pt, skip) {
    eyeEnd.subVectors(pt, camera.position); const len = eyeEnd.length(); if (len < 10) return false;
    eyeEnd.multiplyScalar((len - 3) / len).add(camera.position);
    for (const k of T.capsules) { if (k.id === skip) continue; const rr = k.r * 0.92; if (segSegDist2(camera.position, eyeEnd, k.a, k.b) < rr * rr) return true; }
    return false;
  }
  // a part's anchor where it is now (it turns with its key)
  function anchorNow(p, out) {
    p.group.updateMatrixWorld();
    out.copy(p.anchor).sub(p.pivot).applyAxisAngle(p.axis || AX, p.rot).add(p.pivot);
    p.joint.updateMatrix();
    return out.applyMatrix4(p.joint.matrix);
  }
  let columns = false;
  function layoutTags() {
    if (chips.length) {
      // first where each chip goes, then placement: chips for keys you can see before the faded ones round the back
      const placed = [];
      for (const c of chips) {
        const p = c.p, down = pressedNow.has(c.pid) || pressedNow.has(p.id);
        let a = 1;
        if (c.only && !down) a = 0;
        if (labelMode === 'fingers' && c.pid === 'Th' && pressedNow.has('Tb')) a = 0;     // thumb B♭: the thumb is on the lever, say so only there
        anchorNow(p, wp);
        const s = project(wp), up = project(wp.clone().addScaledVector(p.out, 6));
        pv.copy(camera.position).sub(wp).normalize();
        const facing = clamp(pv.dot(p.out), 0, 1);
        a *= smooth(-0.15, 0.2, pv.dot(p.out));
        if (a > 0 && hidden(wp, null)) a = 0;
        // a finger's key round the back or underneath (the thumb, the little fingers) still says so, faded and dashed
        let behind = false;
        if (a < 0.5 && labelMode === 'fingers' && c.prio === 0 && !c.only) { a = 0.62; behind = true; }
        if (labelMode === 'fingers' && c.pid === 'Th' && pressedNow.has('Tb')) { a = 0; behind = false; }
        if (s.behind) a = 0;
        // how big the key is on the screen: its radius in pixels
        camR.setFromMatrixColumn(camera.matrixWorld, 0);
        const edge = project(wp.clone().addScaledVector(camR, p.size || 4)), rpx = Math.hypot(edge.x - s.x, edge.y - s.y);
        let x, y;
        if (facing > 0.5 && rpx > 1.15 * c.w) { x = s.x - c.w / 2; y = s.y - c.h / 2; }          // close up: on the key itself
        else {
          // otherwise beside it: straight up the screen when the key faces the camera, out along the key when it is edge-on
          let dx = up.x - s.x, dy = up.y - s.y - rpx * facing; const l = Math.hypot(dx, dy) || 1;
          dx /= l; dy /= l;
          const off = 10 + c.h / 2 + rpx * facing + 0.4 * Math.hypot(up.x - s.x, up.y - s.y);
          x = s.x + dx * off - c.w / 2; y = s.y + dy * off - c.h / 2;
        }
        Object.assign(c, { lx: x, ly: y, la: a, down, behindNow: behind });
      }
      const order = chips.slice().sort((a, b) => (a.behindNow - b.behindNow) || (a.prio - b.prio));
      for (const c of order) {
        let a = c.la; const x = c.lx, y = c.ly;
        // no pile-ups: a chip that would cover one already placed waits until the flute is turned or zoomed
        if (a > 0.05) for (const q of placed) if (x < q.x + q.w + 2 && x + c.w + 2 > q.x && y < q.y + q.h + 1 && y + c.h + 1 > q.y) { a = 0; break; }
        if (a > 0.05) placed.push({ x, y, w: c.w, h: c.h });
        c.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
        c.el.style.opacity = a.toFixed(2);
        c.el.classList.toggle('on', c.down && labelMode === 'fingers');
        c.el.classList.toggle('behind', c.behindNow);
      }
      return;
    }
    if (labelMode !== 'parts' || !tags.length) return;
    let cy = 0;
    for (const t of tags) {
      const s = project(jointPlace(wp.copy(t.pos))); t.ax = s.x; t.ay = s.y;
      let a = s.behind ? 0 : 1;
      if (t.out) { pv.copy(camera.position).sub(t.pos).normalize(); a *= smooth(-0.25, 0.12, pv.dot(t.out)); }
      if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) a = 0;
      if (a > 0 && hidden(jointPlace(wp.copy(t.pos)), 'plate')) a = 0;
      t.a = a;
    }
    const c = project(centre); cy = c.y;
    const vis = tags.filter(t => t.a > 0.01);
    let bx0 = Infinity, bx1 = -Infinity;
    for (const t of vis) { bx0 = Math.min(bx0, t.ax); bx1 = Math.max(bx1, t.ax); }
    if (vis.length) { const bw = bx1 - bx0; if (bw < 0.40 * W) columns = true; else if (bw > 0.5 * W) columns = false; }
    if (columns) {
      const mx = (bx0 + bx1) / 2;
      for (const t of vis) { const d = t.ax - mx; if (!t.col) t.col = d < 0 ? -1 : 1; else if (d * t.col < -24) t.col = -t.col; }
      for (const col of [-1, 1]) {
        const list = vis.filter(t => t.col === col).sort((a, b) => a.ay - b.ay);
        if (!list.length) continue;
        const edge = col < 0 ? Math.max(6, bx0 - 70) : Math.min(W - 6, bx1 + 70);
        for (const t of list) { t.x = col < 0 ? Math.max(6, edge - t.w) : Math.min(W - t.w - 6, edge); t.y = t.ay - t.h / 2; }
        let y = 8; for (const t of list) { t.y = Math.max(t.y, y); y = t.y + t.h + 5; }
        y = H - 40; for (let k = list.length - 1; k >= 0; k--) { const t = list[k]; t.y = Math.min(t.y, y - t.h); y = t.y - 5; }
        for (const t of list) { t.lx = col < 0 ? t.x + t.w : t.x; t.ly = t.y + t.h / 2; }
      }
    } else {
      for (const t of tags) { const d = t.ay - cy; if (!t.side) t.side = d < 0 ? -1 : 1; else if (d * t.side < -16) t.side = -t.side; }
      for (const side of [-1, 1]) {
        const row = vis.filter(t => t.side === side).sort((a, b) => a.ax - b.ax);
        if (!row.length) continue;
        const need = row.reduce((s, t) => s + t.w + 8, 0), tiers = need > W - 20 ? 2 : (row.length > 6 ? 2 : 1);
        const yBase = side < 0 ? 8 : H - 40;
        for (let tier = 0; tier < tiers; tier++) {
          const sub = row.filter((t, k) => k % tiers === tier);
          for (const t of sub) { t.x = clamp(t.ax - t.w / 2, 6, W - t.w - 6); t.y = side < 0 ? yBase + tier * (t.h + 6) : yBase - t.h - tier * (t.h + 6); }
          for (let pass = 0; pass < 8; pass++) {
            for (let k = 1; k < sub.length; k++) { const a = sub[k - 1], b = sub[k], ov = a.x + a.w + 8 - b.x; if (ov > 0) { a.x -= ov / 2; b.x += ov / 2; } }
            for (const t of sub) t.x = clamp(t.x, 6, W - t.w - 6);
          }
        }
      }
      for (const t of vis) { t.lx = clamp(t.ax, t.x + 8, t.x + t.w - 8); t.ly = t.side < 0 ? t.y + t.h : t.y; }
    }
    for (const t of tags) {
      t.el.style.transform = `translate(${(t.x || 0).toFixed(1)}px,${(t.y || 0).toFixed(1)}px)`; t.el.style.opacity = t.a.toFixed(2);
      t.line.setAttribute('x1', (t.lx || 0).toFixed(1)); t.line.setAttribute('y1', (t.ly || 0).toFixed(1)); t.line.setAttribute('x2', t.ax.toFixed(1)); t.line.setAttribute('y2', t.ay.toFixed(1));
      t.dot.setAttribute('cx', t.ax.toFixed(1)); t.dot.setAttribute('cy', t.ay.toFixed(1));
      t.line.style.opacity = t.dot.style.opacity = t.a.toFixed(2);
    }
  }

  /* ---- drawing, only when something changed ---- */
  function invalidate() { if (!raf && !disposed) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0; if (disposed) return;
    let again = animate(now);
    if (!camAnim && controls.update()) again = true;
    if (controls.autoRotate) again = true;
    const tg = controls.target;
    if (!box.containsPoint(tg)) { const c = box.clampPoint(tg, V3()), d = c.sub(tg); tg.add(d); camera.position.add(d); }
    const elev = Math.asin(clamp((camera.position.y - floorY) / camera.position.distanceTo(V3(tg.x, floorY, tg.z)), -1, 1));
    shadow.plane.material.uniforms.k.value = 0.3 * smooth(0.02, 0.22, elev);
    shadow.plane.visible = elev > 0.02;
    scene.environmentRotation.y = -Math.atan2(camera.position.x - tg.x, camera.position.z - tg.z);
    if (level === 'high') { scene.updateMatrixWorld(); camera.updateMatrixWorld(); writeReflectors(); }
    renderer.render(scene, camera);
    if (shaderFailed && level !== 'plain') { setLevel('plain'); again = true; }
    // too slow to turn smoothly (an old Chromebook driving a big screen): draw fewer pixels, once
    if (again && !opt.shot && (!lowRes || level === 'high')) {
      const dtF = now - lastFrame;
      // a smoothed frame time (single frames come in steps of the screen's refresh, so a steady 20 fps reads 50, 67, 50 ...)
      if (dtF < 400) { avgF = avgF ? avgF * 0.85 + dtF * 0.15 : dtF; slow = avgF > 42 ? slow + 1 : Math.max(0, slow - 1); if (slow > 20) { if (!lowRes) { lowRes = true; resize(); } else if (level === 'high') setLevel('low'); slow = 0; avgF = 0; } }
    }
    lastFrame = now;
    layoutTags();
    if (layoutPick(now)) again = true;
    if (again) invalidate(); else lastT = 0;
  }
  controls.addEventListener('change', invalidate);
  controls.addEventListener('start', () => { camAnim = null; viewName = null; canvas.classList.add('vf3d-drag'); for (const cb of viewCbs) { try { cb(); } catch (e) { console.error(e); } } });
  controls.addEventListener('end', () => canvas.classList.remove('vf3d-drag'));

  let lastTap = 0, lastTapX = 0, lastTapY = 0, downX = 0, downY = 0, downT = 0;
  let pickTimer = 0;
  const onDbl = e => { e.preventDefault(); clearTimeout(pickTimer); if (pick) { pick.el.remove(); pick = null; } api.resetView(); };
  const onDown = e => { downX = e.clientX; downY = e.clientY; downT = performance.now(); };
  // hovering (a mouse, no button down): a pointer cursor and a faint glow on the key under it
  let hovered = null, hoverRaf = 0, hoverX = 0, hoverY = 0;
  const partOfMesh = new Map(); for (const p of PAINTABLE) for (const m of p.meshes) partOfMesh.set(m, p);
  const partMeshes = [...partOfMesh.keys()];
  const onMove = e => {
    if (e.pointerType !== 'mouse' || e.buttons) { if (hovered) { hovered = null; canvas.style.cursor = ''; invalidate(); } return; }
    hoverX = e.clientX; hoverY = e.clientY;
    if (hoverRaf) return;
    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = 0;
      const r = canvas.getBoundingClientRect(); if (!r.width) return;
      ndc.set((hoverX - r.left) / r.width * 2 - 1, -(hoverY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(partMeshes, false)[0], p = hit ? partOfMesh.get(hit.object) : null;
      if (p !== hovered) { hovered = p; canvas.style.cursor = p ? 'pointer' : ''; invalidate(); }
    });
  };
  const onLeave = () => { if (hovered) { hovered = null; canvas.style.cursor = ''; invalidate(); } };
  const onUp = e => {
    const now = performance.now();
    if (now - downT > 260 || Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return;
    // a tap (not a drag): say what was touched, unless it turns out to be the first half of a double-click
    clearTimeout(pickTimer); const px = e.clientX, py = e.clientY; pickTimer = setTimeout(() => pickAt(px, py), 260);
    if (e.pointerType !== 'touch') return;
    if (now - lastTap < 330 && Math.hypot(e.clientX - lastTapX, e.clientY - lastTapY) < 40) { lastTap = 0; clearTimeout(pickTimer); api.resetView(); }
    else { lastTap = now; lastTapX = e.clientX; lastTapY = e.clientY; }
  };
  const noMenu = e => e.preventDefault();
  canvas.addEventListener('dblclick', onDbl); canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('contextmenu', noMenu);
  canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerleave', onLeave);
  // keyboard, once the flute has focus (Tab to it, or click it): arrows turn it, Page Up / Down zoom, Home puts it back
  canvas.tabIndex = 0;
  const onKey = e => {
    const turn = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] }[e.key];
    if (turn) { e.preventDefault(); readCamera(); viewName = null; for (const cb of viewCbs) { try { cb(); } catch (er) { console.error(er); } } goTo(cur.az + turn[0], clamp(cur.el + turn[1], -85, 85), cur.dist, cur.target, 260); return; }
    if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); readCamera(); goTo(cur.az, cur.el, clamp(cur.dist * (e.key === 'PageUp' ? 0.8 : 1.25), controls.minDistance, controls.maxDistance), cur.target, 220); return; }
    if (e.key === 'Home') { e.preventDefault(); api.resetView(); }
  };
  canvas.addEventListener('keydown', onKey);
  const onLost = e => { e.preventDefault(); }, onRestored = () => { shadow.bake(); invalidate(); };
  canvas.addEventListener('webglcontextlost', onLost); canvas.addEventListener('webglcontextrestored', onRestored);

  function frameView(name, ms) {
    const v = VIEWS[name] || VIEWS.front;
    const f = frameFor(v.az, v.el, v.x);
    goTo(v.az, v.el, f.dist, f.target, ms);
  }
  function resize() {
    if (disposed) return;
    const w = Math.max(2, container.clientWidth), h = Math.max(2, container.clientHeight);
    const rect = container.getBoundingClientRect();
    cssScale = rect.width > 0 && w > 0 ? rect.width / w : 1;
    let pr = Math.min((window.devicePixelRatio || 1) * cssScale, lowRes ? 1 : 2.5);
    pr = Math.max(pr, lowRes ? 0.6 : 0.75);
    const mp = w * h * pr * pr; if (mp > 4e6) pr *= Math.sqrt(4e6 / mp);
    const changed = w !== W || h !== H;
    if (changed || Math.abs(pr - renderer.getPixelRatio()) > 0.01) { renderer.setPixelRatio(pr); renderer.setSize(w, h, false); }
    W = w; H = h;
    camera.aspect = w / h; applyOffset(); camera.updateProjectionMatrix();
    controls.rotateSpeed = 0.9 / cssScale; controls.panSpeed = 1 / cssScale;
    limits();
    if (changed && viewName) frameView(viewName, 0);
    if (tags.length) for (const t of tags) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
    if (chips.length) for (const c of chips) { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; }
    invalidate();
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
  if (ro) ro.observe(container);

  const api = {
    // keys: the page's fingering (a Set or array of T Tb L1 L2 L3 R1 R2 R3 Gs Eb Cs C B giz trD trDs BbL);
    // color: the note's colour, upper: the next letter's colour for a sharp (blended head to foot, like the drawing)
    setKeys(keys, color, upper) {
      const K = keys instanceof Set ? keys : new Set(keys || []);
      const { closed, opened, touches } = linkage(K);
      const c0 = color ? new THREE.Color(color) : null, c1 = upper ? new THREE.Color(upper) : c0;
      pressedNow = new Set([...closed, ...touches]);
      for (const p of PAINTABLE) {
        let down;
        if (p.cup) {
          if (p.cup.shut) { p.to = opened.has(p.id) ? 1 : 0; down = false; }
          else { const shut = closed.has(p.id); p.to = shut ? 0 : 1; down = shut; }
        } else { down = touches.has(p.id); p.to = down ? 1 : 0; }
        if (down && c0) { p.colTo.copy(c0).lerp(c1, clamp((p.xMid - 200) / 420, 0, 1)); p.paintTo = 1; } else p.paintTo = 0;
      }
      invalidate();
    },
    setLabels(mode) {
      mode = mode === 'fingers' || mode === 'names' || mode === 'parts' ? mode : 'off';
      if (mode === labelMode) return;
      const was = labelMode; labelMode = mode; buildTags();
      if ((was === 'parts') !== (mode === 'parts')) { applyOffset(); camera.updateProjectionMatrix(); if (viewName) frameView(viewName, 350); }
      invalidate();
    },
    setView(name, ms) {
      viewName = VIEWS[name] ? name : 'front';
      applyOffset(); camera.updateProjectionMatrix();
      frameView(viewName, ms == null ? 700 : ms);
    },
    resetView() { api.setView('front'); },
    setCamera(az, el, dist, ms = 0) { viewName = null; const f = frameFor(az, el); goTo(az, el, f.dist * (dist || 1), f.target, ms); },
    lookAt(x, y, z, az, el, dist, ms = 0) { viewName = null; goTo(az, el, dist, V3(x, y, z), ms); },
    // take the flute apart (head joint, body, foot joint) or put it back together
    setApart(on) {
      apartTo = on ? 1 : 0;
      if (viewName) frameView(viewName, 800);
      invalidate();
    },
    get apart() { return apartTo === 1; },
    // 'high' = the flute mirrored in itself, 'low' = the studio only, 'plain' = three.js's own shading
    setQuality(q) { setLevel(q); slow = 0; invalidate(); },
    get quality() { return level; },
    setAutoRotate(on) { controls.autoRotate = !!on; controls.autoRotateSpeed = 1.6; invalidate(); },
    onViewChange(cb) { if (typeof cb === 'function') viewCbs.push(cb); return () => { const i = viewCbs.indexOf(cb); if (i >= 0) viewCbs.splice(i, 1); }; },
    resize,
    render: invalidate,
    views: Object.keys(VIEWS),
    get view() { return viewName; },
    get labels() { return labelMode; },
    scene, camera, renderer, controls, flute: T.root, materials: T.M, parts: T.parts,
    info() { let tris = 0; for (const m of T.meshes) tris += m.geometry.index.count / 3; return { triangles: tris, meshes: T.meshes.length, calls: renderer.info.render.calls, pixelRatio: renderer.getPixelRatio(), size: [W, H], cssScale, reflections: level, parts: PAINTABLE.length, lowRes }; },
    dispose() {
      if (disposed) return; disposed = true;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(pickTimer); if (pick) pick.el.remove();
      if (ro) ro.disconnect();
      canvas.removeEventListener('dblclick', onDbl); canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('contextmenu', noMenu);
      canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); if (hoverRaf) cancelAnimationFrame(hoverRaf);
      canvas.removeEventListener('keydown', onKey);
      canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored);
      controls.dispose(); clearTags(); shadow.dispose();
      for (const m of T.meshes) m.geometry.dispose();
      for (const m of Object.values(T.M)) m.dispose();
      for (const p of PAINTABLE) p.mat.dispose();
      envRT.dispose(); renderer.dispose();
      canvas.remove(); over.remove(); container.classList.remove('vf3d-root');
      viewCbs.length = 0;
    },
  };

  resize();
  labelMode = 'off'; api.setLabels(opt.labels);
  { viewName = VIEWS[opt.view] ? opt.view : 'front'; applyOffset(); camera.updateProjectionMatrix(); frameView(viewName, 0); }
  invalidate();
  return api;
}

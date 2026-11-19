// Virtual Trumpet — the 3D instrument.
// A B-flat trumpet (modelled on a Yamaha student trumpet) in real millimetres,
// built entirely in code: geometry, studio reflections, textures. No downloads.
// The polished metal is mirrored in the studio and in the instrument itself (see STUDIO_GLSL and TRACE_GLSL);
// createTrumpet(el, { reflections: 'low' }) or .setQuality('low') turns the self-reflections off, and the viewer
// does so by itself if frames get slow or the shader will not compile.
//
//   import { createTrumpet } from './trumpet-3d.js';
//   const t = createTrumpet(container, { labels: 'off', view: 'side' });
//   t.setValves([true, false, true], '#e11d48');
//   t.setSlides({ third: 0.55 });   // (after setValves: an out slide takes the note's colour, or pass color: '#…')
//   A pressed valve's pearl, button rim and brass casing take the colour; the nickel caps stay silver.
//
// Axes (mm): +x = toward the bell, +y = up (valve buttons), +z = the player's
// right (the leadpipe side, the side every product photo is taken from).
// Origin: the 2nd valve's axis, at the height of the leadpipe's centre line.

import * as THREE from './lib/three.module.min.js';
import { OrbitControls } from './lib/OrbitControls.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const AX = V3(1, 0, 0), AY = V3(0, 1, 0), AZ = V3(0, 0, 1);
// The film curve: straight up to 0.72, then each colour channel rolls off on its own, as a camera's do. Bright
// brass therefore goes lemon and then white (red clips first), which is how the highlights look in the photos;
// a hue-keeping curve leaves them cream.
const FILM = (() => {
  const key = 'vec3 CustomToneMapping( vec3 color ) { return color; }', ch = THREE.ShaderChunk.tonemapping_pars_fragment || '';
  if (ch.includes('vtFilm')) return true;
  if (!ch.includes(key)) return false;
  THREE.ShaderChunk.tonemapping_pars_fragment = ch.replace(key, 'vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }');
  return true;
})();
const BRASS = 0xf9cf7a, NICKEL = 0xe2e3e2, KNURL = 0xe9eae9;   // base colours of the two polished metals (and the knurled nickel)

/* ------------------------------------------------------------------ *
 *  Measurements (mm). Taken from a true side photo of a YTR-2330,
 *  see _reference/more/thomann-ytr2330-side-full.jpg (17.25 px = 1 mm).
 * ------------------------------------------------------------------ */
const D = {
  zL: 15.6,            // leadpipe / main tuning slide plane
  zB: -19.5,           // bell plane
  z1: 13.5,            // 1st valve slide plane
  V: 24.4,             // valve spacing
  casingR: 9.75,
  casingTop: 7.9, casingBot: -103.2, capTop: 15.0, capBot: -110.9,
  stroke: 16.5,
  buttonUnder: 31.9, buttonTop: 36.5,
  mouthRim: -242.6, recvEnd: -176.5, recvFront: -129.9,
  leadR: 5.5, outerR: 6.7, bowR: 6.35,
  leadFerrule: 72.2, slideFerrule: 158.4, bowStart: 170.8, bowCorner: 25.7, bowFront: 196.5,
  lowerY: -67.4,       // main tuning slide lower leg
  s3: { yU: -53.7, yL: -73.8, x0: 47.2, x1: 147.5, out: 25 },
  s1: { yU: -56.7, yL: -74.9, x0: -36.1, x1: -91.6, out: 12 },
  s2: { yU: -54.0, yL: -75.2 },
  bell: { rimX: 310, rimR: 61.5, bowCx: -135.4, bowR: 39.5, lowY: -79 },
};

/* ------------------------------------------------------------------ *
 *  Geometry tools
 * ------------------------------------------------------------------ */

// A polyline with rounded corners -> dense list of points.
function roundedPath(pts, radii, arcStep = 0.1) {
  const out = [];
  const push = p => { if (!out.length || out[out.length - 1].distanceToSquared(p) > 1e-8) out.push(p); };
  push(pts[0].clone());
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const a = p.clone().sub(pts[i - 1]).normalize();
    const b = pts[i + 1].clone().sub(p).normalize();
    const th = Math.acos(clamp(a.dot(b), -1, 1));
    const R = Array.isArray(radii) ? radii[i - 1] : radii;
    if (th < 1e-4 || !R) { push(p.clone()); continue; }
    const t = R * Math.tan(th / 2);
    const p0 = p.clone().addScaledVector(a, -t);
    const bis = b.clone().sub(a).normalize();
    const c = p.clone().addScaledVector(bis, R / Math.cos(th / 2));
    const n = Math.max(2, Math.ceil(th / arcStep));
    const v0 = p0.clone().sub(c), axis = a.clone().cross(b).normalize();
    for (let k = 0; k <= n; k++) push(v0.clone().applyAxisAngle(axis, th * k / n).add(c));
  }
  push(pts[pts.length - 1].clone());
  return out;
}

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

// Take rings i0..i1 of a (cap-less) sweep as its own geometry — two pieces that share a ring join with no crack.
function sliceRings(g, i0, i1) {
  const W = g.userData.W, out = new THREE.BufferGeometry();
  for (const k of ['position', 'normal', 'uv', 'color']) {
    const a = g.getAttribute(k); if (!a) continue;
    out.setAttribute(k, new THREE.BufferAttribute(a.array.slice(i0 * W * a.itemSize, (i1 + 1) * W * a.itemSize), a.itemSize));
  }
  const src = g.index.array, idx = [];
  for (let t = 0; t < src.length; t += 3) {
    const r = Math.floor(Math.min(src[t], src[t + 1], src[t + 2]) / W);
    if (r >= i0 && r < i1) idx.push(src[t] - i0 * W, src[t + 1] - i0 * W, src[t + 2] - i0 * W);
  }
  out.setIndex(idx);
  return out;
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

// A knurled band about +Y, from y0 to y1: a plain cylinder whose uv.x counts the teeth. The teeth themselves are
// drawn by the knurl material's shader (dark valleys, faded out where they get finer than a pixel).
function knurlBand(y0, y1, r, teeth) {
  const segs = 96, pos = [], nor = [], uv = [], idx = [];
  for (let j = 0; j <= segs; j++) {
    const a = j / segs * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    pos.push(r * c, y0, r * s, r * c, y1, r * s); nor.push(c, 0, s, c, 0, s); uv.push(teeth * j / segs, 0, teeth * j / segs, 1);
  }
  for (let j = 0; j < segs; j++) { const a = j * 2; idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function arc2(cy, cr, R, a0, a1, n = 6) {          // points of an arc in (y, r), angles in degrees from +y toward +r
  const out = [];
  for (let k = 0; k <= n; k++) { const a = (a0 + (a1 - a0) * k / n) * Math.PI / 180; out.push([cy + R * Math.cos(a), cr + R * Math.sin(a)]); }
  return out;
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

function roundedBox(w, h, d, r) {                  // centred, edges rounded by r
  const s = new THREE.Shape(), x = w / 2 - r, y = h / 2 - r;
  s.absarc(x, y, r, 0, Math.PI / 2); s.absarc(-x, y, r, Math.PI / 2, Math.PI);
  s.absarc(-x, -y, r, Math.PI, Math.PI * 1.5); s.absarc(x, -y, r, Math.PI * 1.5, Math.PI * 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.999, bevelOffset: -r * 0.999, bevelSegments: 3, curveSegments: 5 });
  g.translate(0, 0, -(d - 2 * r) / 2);
  const out = g.index ? g.toNonIndexed() : g;
  out.setIndex([...Array(out.attributes.position.count).keys()]);
  return out;
}

/* ------------------------------------------------------------------ *
 *  Textures and the studio (all drawn in code)
 * ------------------------------------------------------------------ */

// A product photographer's set, written as one GLSL function of direction, so the polished metal can look it up
// exactly (no texture, no blur: reflections stay crisp at any zoom) and the same function is also baked into an
// ordinary environment map for the rougher materials. Direction az = 0 is "toward the camera": the viewer turns
// the set with the camera, so the lights stay put while the instrument turns in front of them, as on a turntable.
// The set is a white cyclorama: an over-exposed backdrop behind the instrument, a big soft box in front and
// above (the white streak along the upper third of every tube), a white table lit hard from the front (the
// white streak along the lower third), a dimmer camera side and a thin black flag just left of the camera.
// The levels were fitted to brightness profiles read off the reference photo, tube by tube (_tools/profiles.json), and then checked
// against it as a whole: _tools/stats.json compares the brass-only tone percentiles of photo and model from the
// photo's own camera (they agree to within about a tenth).
const STUDIO_GLSL = `
  float vtBand(float x, float a, float b, float e){ return smoothstep(a - e, a + e, x) * (1.0 - smoothstep(b - e, b + e, x)); }
  float vtStrip(float az, float c, float w, float e){ float x = abs(mod(az - c + 180.0, 360.0) - 180.0); return 1.0 - smoothstep(w - e, w + e, x); }
  float vtCap(vec3 n, float az, float el, float R, float e){ float a = radians(az), b = radians(el); return 1.0 - smoothstep(R - e, R + e, degrees(acos(clamp(dot(n, vec3(sin(a) * cos(b), sin(b), cos(a) * cos(b))), -1.0, 1.0)))); }
  // bl = how many degrees of the room one screen pixel covers in this reflection: every edge is softened by that
  // much, so hairline reflections (a light seen in a tube seen in a tube) fade out instead of breaking into dashes
  // The room is a light tent: big, smooth, glowing surfaces and nothing with an edge. (A highlight a third of a
  // tube's width means a light some 80 to 90 degrees across; everything crisp in a product photo is the instrument
  // mirrored in itself, which the tracer below does.)
  // n = the direction looked in, as seen from where the mirror stands in the room; s = the same direction for a
  // mirror at the middle of the room (used for the light at the instrument's own height, so that it never slides
  // onto the long level tubes); upr = 0 leaves that light out (the bell)
  float vtLobe(vec3 n, float az, float el, float sig){
    float a = radians(az), b = radians(el), d = degrees(acos(clamp(dot(n, vec3(sin(a) * cos(b), sin(b), cos(a) * cos(b))), -1.0, 1.0)));
    return exp(-d * d / (2.0 * sig * sig));
  }
  float vtEdgeK = 1.0, vtTubeK = 0.0, vtFrontK = 1.0, vtBellW = 0.0;                              // set per material by the mirror shader (the baked map uses these defaults)
  vec3 vtStudio(vec3 n, vec3 s, float bl, float upr){
    n = normalize(n); s = normalize(s);
    float az = degrees(atan(n.x, n.z));
    vec3 white = vec3(1.0, 0.985, 0.955);
    float ek = vtEdgeK, tk = vtTubeK, bw = vtBellW;
    // the tent's own glow: pale on the camera's side, falling smoothly to warm dark behind the instrument
    vec3 c = mix(vec3(0.43, 0.335, 0.24), white * (0.66 + 0.06 * smoothstep(-70.0, 45.0, az)), smoothstep(-0.95, 0.40, n.z));
    // ... for the long level tubes and the bell (tk = 1) without the mid-greys: tan is gold times grey. There every
    // direction is either bright (clean yellow-gold in the brass, rising to white in the lights) or dark and warm
    // (deep amber-brown), with a definite edge between
    c = mix(c, mix(vec3(0.27, 0.155, 0.07), white * vec3(1.02, 1.0, 0.96), smoothstep(mix(-0.36, -0.82, bw), mix(-0.12, -0.56, bw), n.z)), tk);
    // The lights are soft boxes: flat, with a definite but soft edge (a transition some 6 to 10 % of a tube's
    // width; a hard edge reads as a drawing, an edge half a tube wide as satin paint).
    float up = degrees(atan(n.y, n.z)), ends = (1.0 - smoothstep(0.93, 0.995, abs(n.x))) * mix(1.0, 0.85, smoothstep(0.5, 0.93, abs(n.x)));   // (the long lights run far past the instrument's ends, a little dimmer out there)
    // the long level tubes and the bell (tk = 1) see the lower half of the tent warmer: rich orange-gold below
    c *= mix(vec3(1.0), vec3(0.97, 0.86, 0.66), tk * (1.0 - 0.5 * bw) * vtBand(up, -89.0, -10.0, 6.0));   // (richer below)
    // the key box, overhead, long from left to right. On the valve block (tk = 0): a wide pale stripe. On the level
    // tubes and the bell: a narrow near-white highlight with a thin dark-amber line under it, as in the photos
    vec3 key0 = white * (1.3 + 1.5 * vtBand(up, 57.0, 87.0, 7.0)), key1 = white * (0.95 + 0.45 * bw + 2.4 * vtBand(up, 63.0 - 7.0 * bw, 89.0 + 10.0 * bw, 3.5 * ek + bl));
    c = mix(c, mix(key0, key1, tk), mix(vtBand(up, 47.0, 118.0, 5.0 + bl), vtBand(up, 58.0 - 8.0 * bw, 106.0 + 10.0 * bw, 4.0 * ek + bl), tk) * ends);
    c = mix(c, vec3(0.24, 0.14, 0.06), tk * (0.92 - 0.1 * bw) * vtBand(up, 35.0 - 9.0 * bw, 54.0 - 9.0 * bw, 3.0 * ek + bl) * ends);
    // the white table below and in front (the lighter lower part of every tube), and the dark gap between table
    // and tent (the deep amber line low down)
    c = mix(c, mix(vec3(0.30, 0.215, 0.14), vec3(0.24, 0.14, 0.06), tk), mix(0.62, 0.9, tk) * vtBand(up, -37.0, -21.0, 4.5 * mix(1.0, ek, tk) + bl) * ends);
    c = mix(c, white * 0.92 * mix(vec3(1.0), vec3(1.12, 0.99, 0.80), tk), vtBand(up, -86.0, -40.0, 5.0 * mix(1.0, ek, tk) + bl) * ends);
    // at the instrument's own height (upr): a soft box beside the camera, a hair left of it (the near-white band
    // down the middle of every casing; on the level tubes only a pale line; dimmer still for the nickel, whose
    // flat faces would otherwise all turn white), a second, paler one to the right (the casings' second bright
    // zone) and the gap between them
    float saz = degrees(atan(s.x, s.z)), sel = degrees(asin(clamp(s.y, -1.0, 1.0))), sb = min(bl, 2.5);   // (little softening with distance: a casing a few pixels wide keeps its white stripe)
    float nk = step(vtFrontK, 0.99);                                               // nickel and silver
    c = mix(c, white * mix(2.8 * vtFrontK, 1.7, tk), upr * vtStrip(saz, -5.0 - 15.0 * nk, 14.0, 4.5 + 8.0 * nk + sb) * vtBand(sel, -12.0 - 6.0 * nk, 8.0 + 6.0 * nk, 4.0 + 5.0 * nk + sb));
    c = mix(c, vec3(0.30, 0.285, 0.27), 0.85 * nk * vtLobe(n, 7.0, 1.0, 10.0));   // (nickel only) the camera's own dark corner: a flat polished face turned to the camera is never a blank white disc
    c *= 1.0 - mix(0.22, 0.62, tk) * upr * vtStrip(saz, 22.0, 6.0, 4.5 + sb) * vtBand(sel, -34.0, 26.0, 6.0 + sb);
    c = mix(c, white * 0.90, upr * vtStrip(saz, 60.0, 24.0, 6.0 + sb) * vtBand(sel, -40.0, 30.0, 7.0 + sb));
    return c;
  }`;

function studioScene() {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(60, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 d;' + STUDIO_GLSL + ' void main(){ gl_FragColor = vec4(vtStudio(d, d, 0.0, 1.0), 1.0); }',
  })));
  return s;
}

// What the polished metal runs instead of the plain environment lookup: the mirror ray is first tested against
// the instrument's own tubes (a short list of capsules and flat-ended cylinders, in a small float texture), so a
// casing shows the leadpipe and its neighbours, tubes show each other, and brass seen in brass comes out the deep
// orange it is in the photos. Up to two bounces; whatever the ray escapes to is the studio above.
const TRACE_GLSL = `
  uniform highp sampler2D vtCaps;
  uniform vec3 vtTint[3];
  uniform float vtAo, vtCool, vtPix, vtUpright, vtDeep, vtBlob, vtWave, vtEdge, vtTube, vtFront;
  uniform vec3 vtBell;
  uniform vec2 vtSkip;
  uniform mat3 vtRot;
  ${STUDIO_GLSL}
  #if VT_TRACE == 1
  // ray against a tube from pa along the unit axis ax for len, radius ra; round ends, or flat ones (flt).
  // Worked in the plane across the axis, which keeps the numbers small enough for 32-bit floats near a graze.
  // pen = how deep the ray cuts into the tube (0 = a graze, 1 = through the axis)
  float vtHit(vec3 ro, vec3 rd, vec3 pa, vec3 ax, float len, float ra, bool flt, out float pen){
    pen = 1.0;
    vec3 oa = ro - pa;
    float rdA = dot(rd, ax), oaA = dot(oa, ax);
    vec3 rdP = rd - ax * rdA, oaP = oa - ax * oaA;
    float a = dot(rdP, rdP), b = dot(rdP, oaP), c = dot(oaP, oaP) - ra * ra;
    float h = b * b - a * c;
    if (h < 0.0 || a < 1e-7) return -1.0;
    h = sqrt(h);
    float t = (-b - h) / a;
    float y = oaA + t * rdA;
    if (y > 0.0 && y < len){ pen = 1.0 - sqrt(max(ra * ra - h * h / a, 0.0)) / ra; return t; }
    if (flt) {
      float tc = ((y < 0.0 ? 0.0 : len) - oaA) / rdA;
      return abs(b + a * tc) < h ? tc : -1.0;
    }
    vec3 oc = y <= 0.0 ? oa : oa - ax * len;
    float b2 = dot(rd, oc), h2 = b2 * b2 - dot(oc, oc) + ra * ra;
    return h2 > 0.0 ? -b2 - sqrt(h2) : -1.0;
  }
  vec3 vtNormalAt(vec3 p, vec3 pa, vec3 ax, float len, float ra, bool flt){
    vec3 q = p - pa;
    float h = dot(q, ax);
    if (!flt) h = clamp(h, 0.0, len);
    vec3 rad = q - h * ax;
    if (flt && dot(rad, rad) < ra * ra * 0.985) return ax * sign(h - 0.5 * len);
    return normalize(rad);
  }
  #endif
  float vtUpr = 1.0;
  vec3 vtRoom(vec3 d, vec3 s, float bl){                                                  // nickel and silver see the room with less of its warmth and more contrast: plain mirrors, near-black to white
    vec3 e = vtStudio(d, s, bl, vtUpr);
    if (vtCool > 0.0){ e = mix(e, vec3(dot(e, vec3(0.3, 0.59, 0.11))), vtCool); e = 0.75 * pow(e / 0.75, vec3(2.0)) + 0.05; }
    return e;
  }
  const vec3 vtMid = vec3(35.0, -35.0, 0.0);                                      // the middle of the set. The set is a room, not the sky:
  const float vtFar = 700.0;                                                      // what a tube sees shifts along its length
  #if VT_TRACE == 1
  // follow one mirror ray: up to two bounces off the tubes, then the room. bl = softening for the room lookup,
  // px = the size of one pixel out here (mm)
  vec3 vtTrace(vec3 ro, vec3 rd, float bl, float px, float fan, out bool any){
    vec3 thr = vec3(1.0), acc = vec3(0.0); float wgt = 1.0, top = 1e3;
    any = false;
    for (int bounce = 0; bounce < 2; bounce++){
      float tMin = 1e9, pen = 1.0, pn; int hit = -1;
      for (int i = 0; i < VT_N; i++){
        if (float(i) >= vtSkip.x && float(i) < vtSkip.y) continue;
        vec4 A = texelFetch(vtCaps, ivec2(i, 0), 0), B = texelFetch(vtCaps, ivec2(i, 1), 0);
        float t = vtHit(ro, rd, A.xyz, B.xyz, abs(B.w), A.w, B.w < 0.0, pn);
        if (t > 0.02 && t < tMin){ tMin = t; hit = i; pen = pn; }
      }
      if (hit < 0) break;
      any = true;
      vec4 A = texelFetch(vtCaps, ivec2(hit, 0), 0), B = texelFetch(vtCaps, ivec2(hit, 1), 0);
      // a ray that only grazes a tube is shared between the tube and what lies past it: the outline of every
      // mirrored tube is a soft step about a pixel wide (sized from how far one pixel's ray fans out by the time
      // it gets there), not a hard one; a mirrored tube thinner than a pixel fades out
      float thin = (px + tMin * fan) / A.w;                                       // 1 / (how many pixels wide this tube is in the mirror); fan = how fast neighbouring pixels' rays part
      float cov = smoothstep(0.0, max(clamp(thin, 0.06, 1.6), vtBlob), pen) ;
      if (cov < 0.999) acc += wgt * (1.0 - cov) * thr * min(vtRoom(vtRot * (rd * vtFar + ro - vtMid), vtRot * rd, bl + 4.0), vec3(top));
      top = min(top, mix(1.7, 0.64, smoothstep(0.004, 0.03, thin)));               // a light seen in a mirrored tube is a hairline: hold it down, or it breaks into dots (and brass seen in brass reads as the deep orange of the photos)
      if (vtBlob > 0.0) top = min(top, 1.25);                                     // in the bell a mirrored tube is gold to amber: never white, never near-black
      wgt *= cov;
      if (vtBlob > 0.0) return acc + wgt * mix(vec3(1.0), vtTint[0], 0.4) * 0.92;                        // in the bell: a smooth golden shape, as in the photos (the detail inside it only ever looked like damage)
      vec3 p = ro + rd * tMin, n = vtNormalAt(p, A.xyz, B.xyz, abs(B.w), A.w, B.w < 0.0);
      thr *= vtTint[int(texelFetch(vtCaps, ivec2(hit, 2), 0).x + 0.5)] * vtDeep;
      if (bounce == 1) return acc + wgt * thr * vec3(0.42, 0.35, 0.28) * (1.0 + 0.9 * step(0.05, vtBlob));           // caught between two tubes: the bounces after this are not followed; what comes back is dim
      ro = p + n * 0.4; rd = reflect(rd, n); bl = max(bl * 1.6 + 1.0, min(VT_SOFT * thin, 60.0));   // a tube a few pixels wide holds the whole room: soften to match
    }
    return acc + wgt * thr * min(vtRoom(vtRot * (rd * vtFar + ro - vtMid), vtRot * rd, bl), vec3(top));
  }
  #endif
  bool vtHave = false; vec3 vtCache = vec3(0.0);
  vec3 vtRadiance(vec3 rd, vec3 viewNormal){
    if (vtHave) return vtCache;
    vec3 nW = inverseTransformDirection(viewNormal, viewMatrix);
    vec3 ro = cameraPosition + (vec4(-vViewPosition, 0.0) * viewMatrix).xyz + nW * 1.3;
    float lift = dot(rd, nW);                                                     // along a tube's outline the smoothed normal can lean away from the eye:
    if (lift < 0.03) rd = normalize(rd + nW * (0.03 - lift));                     // never let the mirror ray dive back into its own tube
    vtUpr = vtUpright < 0.0 ? 1.0 - smoothstep(205.0, 255.0, ro.x) : vtUpright;
    vtEdgeK = vtEdge; vtTubeK = vtTube; vtFrontK = vtFront; vtBellW = step(0.05, vtBlob);
    if (vtWave > 0.0){
      vec3 w = ro * 0.11;
      rd = normalize(rd + vtWave * vec3(sin(w.y * 1.3 + w.z * 0.7 + 1.0) + sin(w.x * 0.9 - w.y * 0.5), sin(w.x * 1.1 + w.z * 1.7 + 2.0) + sin(w.y * 0.6 + w.x * 0.4 + 0.5), sin(w.z * 1.2 + w.y * 0.8 + 4.0) + sin(w.x * 0.7 - w.z * 0.9)));
    }
    vec3 look = vtRot * (rd * vtFar + ro - vtMid);
    float bl = clamp(degrees(length(fwidth(normalize(look)))) * 0.7, 0.0, 12.0);  // how much of the room one pixel covers in this mirror
    #ifdef VT_INSIDE
    // inside the flare the studio is mirrored once, softly (the hollow blurs it), then dimmed and reddened toward
    // the throat by the shading baked into the vertex colours: deep in there brass sees only more brass, and the
    // throat is a dark hole
    // (now: a ray that leaves through the mouth shows the room, crisp; one that does not meets the wall opposite,
    // brass seen in brass, darker the deeper in)
    float qx = (vtBell.x - ro.x) / max(rd.x, 1e-3);
    float qr = rd.x > 1e-3 ? length(ro.yz + rd.yz * qx - vec2(0.0, vtBell.y)) / vtBell.z : 4.0;
    float outW = 1.0 - smoothstep(0.45, 1.1, qr);                                 // no border: the far wall comes in gradually
    float deepK = smoothstep(0.25, 0.95, vColor.r);
    vec3 wall = vtTint[0] * vec3(0.66, 0.52, 0.37) * mix(0.4, 1.0, deepK);
    vtCache = vColor * mix(vtTint[0] * vtTint[0] * 1.5, vec3(1.0), deepK) * max(mix(wall, min(vtRoom(look, vtRot * rd, max(bl, 4.0)), vec3(5.0)), outW), vec3(1.45, 1.40, 1.30) * smoothstep(0.84, 0.995, vColor.r));   // (and the last stretch before the rim always catches the tent: a bright zone all the way round)
    #elif VT_TRACE == 1
    float px = length(vViewPosition) * vtPix;
    bool any;
    vtCache = vtTrace(ro, rd, bl, px, clamp(length(fwidth(rd)), 0.0, 0.5), any);
    if (vtBlob > 0.0 && any) vtCache = max(vtCache, vec3(0.34, 0.24, 0.13));
    #else
    vtCache = vtRoom(look, vtRot * rd, bl);
    #endif
    vtHave = true;
    return vtCache;
  }`;

/* ------------------------------------------------------------------ *
 *  The instrument
 * ------------------------------------------------------------------ */

function buildTrumpet() {
  const M = {};
  // lacquered brass: the colour is the photo's mid-tone gold divided by the white it reflects there (pale, champagne);
  // the deep oranges come from brass seen in brass, not from the base colour
  M.brass = new THREE.MeshPhysicalMaterial({ color: BRASS, metalness: 1, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, vertexColors: true });   // a thin lacquer: at full strength every tube edge and the whole flare washed out to cream
  M.brassV = M.brass.clone();                           // the valve block (casings, stays, knuckles, 2nd slide): the same metal; the mirror shader lights the long level tubes a little differently
  M.brassBell = M.brass.clone();                        // the bell: the same brass, but its mirror rays skip the stepped stand-in for the bell itself
  M.brassIn = new THREE.MeshPhysicalMaterial({ color: BRASS, metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, vertexColors: true });   // inside the bell
  M.nickel = new THREE.MeshPhysicalMaterial({ color: NICKEL, metalness: 1, roughness: 0.04, vertexColors: true });
  M.satin = new THREE.MeshPhysicalMaterial({ color: 0xdcdddd, metalness: 1, roughness: 0.27, vertexColors: true });   // the stems: satin, a step duller than the polished caps
  const knurl = () => {
    const m = new THREE.MeshPhysicalMaterial({ color: KNURL, metalness: 1, roughness: 0.24, vertexColors: true });   // the knurled bands: bright ridges, dark valleys
    m.defines.USE_UV = '';
    m.customProgramCacheKey = () => 'vt-knurl';
    m.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        { float kt = vUv.x, kw = fwidth(kt);
          float ridge = smoothstep(0.05, 0.55, abs(fract(kt) - 0.5) * 2.0);
          diffuseColor.rgb *= mix(0.46, 1.0, mix(ridge, 0.6, smoothstep(0.3, 1.1, kw))); }`);
    };
    return m;
  };
  M.knurl = knurl();
  // each valve button's own rim (the nickel round the pearl and its knurled edge), so a pressed valve's rim can take
  // a darker shade of the note's colour: the pearl alone was easy to miss
  for (const n of [1, 2, 3]) { M['rim' + n] = M.nickel.clone(); M['rim' + n].userData.like = 'nickel'; M['rimKnurl' + n] = knurl(); }
  // and each valve's brass casing, and the moving part of the 3rd valve slide, so they can turn a metallic version of the
  // note's colour while that valve is down or the slide is out (the nickel stays silver). `like` = the material they shade as
  for (const n of [1, 2, 3]) { M['case' + n] = M.brassV.clone(); M['case' + n].userData.like = 'brassV'; }
  M.slide3B = M.brass.clone(); M.slide3B.userData.like = 'brass';
  M.silver = new THREE.MeshPhysicalMaterial({ color: 0xf3f3f1, metalness: 1, roughness: 0.03, vertexColors: true });
  M.felt = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0, roughness: 1, vertexColors: true });
  M.cork = new THREE.MeshStandardMaterial({ color: 0xc58f62, metalness: 0, roughness: 0.9, vertexColors: true });
  M.rubber = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0, roughness: 0.55, vertexColors: true });
  M.steel = new THREE.MeshStandardMaterial({ color: 0xc2c0ba, metalness: 1, roughness: 0.25, vertexColors: true });
  M.dark = new THREE.MeshBasicMaterial({ color: 0x0c0906 });
  M.vent = new THREE.MeshBasicMaterial({ color: 0x2e1c0e });                    // the vent hole in a bottom cap: dark brown (brass inside)
  const pearl = () => new THREE.MeshPhysicalMaterial({ color: 0xe7e2d8, metalness: 0, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, iridescence: 0.55, iridescenceIOR: 1.5, sheen: 0.4, sheenColor: 0xcfe0ff, vertexColors: true });
  M.pearl1 = pearl(); M.pearl2 = pearl(); M.pearl3 = pearl();

  const root = new THREE.Group(); root.name = 'trumpet';
  const groups = {};
  const G = (name, parent) => {
    if (groups[name]) return groups[name];
    const obj = new THREE.Group(); obj.name = name;
    (parent ? G(parent).obj : root).add(obj);
    return (groups[name] = { obj, bins: new Map() });
  };
  const add = (name, mat, geom) => { const g = G(name); if (!g.bins.has(mat)) g.bins.set(mat, []); g.bins.get(mat).push(geom); return geom; };
  const capsules = [];                                  // every tube, as a line + radius: used for soft shading in the gaps
  // the short list the mirror rays are tested against: capsules, or flat-ended cylinders (flat: true);
  // kind 0 brass, 1 nickel / silver, 2 black; mov = the moving group it rides on
  const refl = [];
  const rc = (a, b, r, o = {}) => refl.push({ a: a.clone(), b: b.clone(), r, kind: o.kind || 0, flat: !!o.flat, mov: o.mov || null });
  const rcPath = (P, r, n, o) => {                      // n capsules along a path
    const S = [0]; for (let i = 1; i < P.length; i++) S[i] = S[i - 1] + P[i].distanceTo(P[i - 1]);
    const L = S[P.length - 1];
    const at = s => { let i = 1; while (i < P.length - 1 && S[i] < s) i++; return P[i - 1].clone().lerp(P[i], clamp((s - S[i - 1]) / (S[i] - S[i - 1] || 1), 0, 1)); };
    for (let k = 0; k < n; k++) rc(at(L * k / n), at(L * (k + 1) / n), typeof r === 'function' ? r((k + 0.5) / n) : r, o);
  };
  const tube = (name, mat, pts, r, o = {}) => {
    const g = add(name, mat, sweep(densify(pts, 3), r, o));
    if (!o.noAO) for (let i = 1; i < pts.length; i++) capsules.push({ a: pts[i - 1], b: pts[i], r: typeof r === 'number' ? r : (Array.isArray(r) ? r[i] : 6), id: o.id || name });
    return g;
  };
  // a short sleeve (ferrule) with softened ends, from p along dir
  const sleeve = (name, mat, p, dir, len, r, o = {}) => {
    const prof = [[0, r - 0.9], [0, r - 0.12], [0.12, r], [len - 0.12, r], [len, r - 0.12], [len, r - 0.9]];
    add(name, mat, place(lathe(prof, { segs: o.segs || 36, crease: 30 }), p, dir));
  };
  const fine = (prof, step = 2.5) => {                  // more rings along a lathe profile
    const out = [prof[0]];
    for (let i = 1; i < prof.length; i++) { const a = prof[i - 1], b = prof[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step); for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
    return out;
  };
  const ring = (name, mat, p, dir, r, w = 1.4, h = 0.55) => {   // a raised bead around a tube, centred on p
    const ww = w * 0.7, hh = h * 0.32;                         // low: a step with a hairline, not a pipe flange
    const prof = [[-ww / 2, r - 0.3], ...arc2(0, r, 1, 180, 0, 8).map(q => [q[0] * ww / 2, r + (q[1] - r) * hh]), [ww / 2, r - 0.3]];
    add(name, mat, place(lathe(prof, { segs: 36 }), p, dir));
  };

  const { zL, zB, z1, V } = D;

  /* ---------- mouthpiece (silver plate) ---------- */
  {
    const p = [];
    p.push([19.5, 1.83], [15.5, 1.9], [12.5, 2.6], [10, 3.9], [7.6, 5.5], [5.2, 6.9], [3.0, 7.8], [1.6, 8.2]);        // cup, from the throat out
    p.push(...arc2(1.9, 10.4, 2.2, 270, 180, 8).map(q => [q[0] - 0.3 + 0.3, q[1]]));                                  // inner bite and rim crown
    p.push(...arc2(2.1, 10.5, 2.1, 180, 90, 8));                                                                       // rim crown to outer edge
    p.push([8.0, 12.6], ...arc2(8.0, 11.5, 1.1, 90, 0, 6));
    p.push([9.3, 11.1], [10.0, 11.1], [10.3, 10.9]);                                                                   // the small ledge under the rim block
    p.push([11.4, 10.75], [12.6, 10.4], [13.9, 9.85], [15.2, 9.15], [16.6, 8.35], [18.0, 7.55], [19.4, 6.85], [20.8, 6.3], [22.0, 5.95], [22.6, 5.85]);   // the bowl: rounded, running smoothly down to the throat
    p.push([22.9, 5.95], [23.7, 5.95], [24.0, 4.5], [28.2, 4.5], [28.5, 5.2], [29.3, 5.2], [29.6, 4.75]);
    p.push(...arc2(32, 4.6, 1.9, 180, 0, 10).map(q => [q[0], 4.6 + (q[1] - 4.6) * 0.75]));                              // the bead on the stem
    p.push([34.4, 4.75], [34.7, 5.2], [35.5, 5.2], [35.8, 4.5], [39.4, 4.5], [40.3, 5.8], [41, 5.85], [66, 5.35], [86, 4.9], [86, 4.2]);
    for (const q of p) q[0] = q[0] <= 24 ? q[0] * 0.9 : q[0] <= 39.4 ? q[0] - 2.4 : q[0];                             // the cup block is a tenth shorter than first drawn
    add('mouthpiece', M.silver, place(lathe(p, { segs: 72, crease: 40 }), V3(D.mouthRim, 0, zL), AX));
    add('mouthpiece', M.dark, place(lathe([[17.45, 0], [17.45, 1.9]], { segs: 16 }), V3(D.mouthRim, 0, zL), AX));
    capsules.push({ a: V3(D.mouthRim + 1, 0, zL), b: V3(D.mouthRim + 9, 0, zL), r: 13, id: 'mouthpiece' }, { a: V3(D.mouthRim + 12, 0, zL), b: V3(D.mouthRim + 20, 0, zL), r: 9, id: 'mouthpiece' });
    rc(V3(D.mouthRim + 11.5, 0, zL), V3(D.mouthRim + 12.5, 0, zL), 11, { kind: 1 }); rc(V3(D.mouthRim + 30, 0, zL), V3(D.recvEnd + 2, 0, zL), 5.2, { kind: 1 });
  }

  /* ---------- leadpipe: receiver, pipe, the two outer slide tubes, the elbow into valve 3 ---------- */
  {
    const r0 = D.recvEnd;
    const p = [[0, 5.45], [0, 6.2], ...arc2(5.2, 5.2, 5.3, 168, 12, 14).map(q => [q[0], 6.25 + (q[1] - 6.25) * 0.2]), [10.6, 6.5], [10.9, 6.95], [12.3, 6.95], [12.6, 6.4], [D.recvFront - r0 - 0.5, 6.4], [D.recvFront - r0, 5.9], [D.recvFront - r0, 5.4]];
    add('leadpipe', M.brass, place(lathe(p, { segs: 56, crease: 40 }), V3(r0, 0, zL), AX));
    add('leadpipe', M.dark, place(lathe([[3, 0], [3, 5.45]], { segs: 24 }), V3(r0, 0, zL), AX));
    tube('leadpipe', M.brass, [V3(D.recvFront - 2, 0, zL), V3(D.leadFerrule + 2, 0, zL)], (s, L) => 5.25 + 0.95 * s / L, { segs: 40 });   // the leadpipe grows toward the valves
    sleeve('leadpipe', M.brass, V3(D.leadFerrule, 0, zL), AX, 2.6, D.outerR + 0.35);
    tube('leadpipe', M.brass, [V3(D.leadFerrule + 1, 0, zL), V3(D.slideFerrule + 0.3, 0, zL)], D.outerR, { segs: 40 });
    // lower leg: outer tube, a ring, and the elbow that turns into the 3rd valve casing
    tube('leadpipe', M.brass, [V3(D.slideFerrule + 0.3, D.lowerY, zL), V3(37.5, D.lowerY, zL)], D.outerR - 0.2, { segs: 40 });
    sleeve('leadpipe', M.brass, V3(38.4, D.lowerY, zL), V3(-1, 0, 0), 2.4, D.outerR + 0.1);
    tube('leadpipe', M.brass, roundedPath([V3(38, D.lowerY, zL), V3(V + 2.6, D.lowerY, zL), V3(V + 2.6, D.lowerY, 0)], 7.2), 6.1, { segs: 36 });
    rc(V3(r0 + 6, 0, zL), V3(D.recvFront - 5, 0, zL), 6.4); rc(V3(D.recvFront, 0, zL), V3(-25, 0, zL), 5.55); rc(V3(-25, 0, zL), V3(D.leadFerrule, 0, zL), 6.0);
    rc(V3(D.leadFerrule, 0, zL), V3(D.bowStart, 0, zL), 6.8); rc(V3(D.bowStart, D.lowerY, zL), V3(40, D.lowerY, zL), 6.6);
    rcPath(roundedPath([V3(40, D.lowerY, zL), V3(V + 2.6, D.lowerY, zL), V3(V + 2.6, D.lowerY, 4)], 7.2), 6.1, 2);
  }

  /* ---------- main tuning slide: two sleeves and the D-shaped bow ---------- */
  {
    for (const y of [0, D.lowerY]) {
      sleeve('tuningSlide', M.brass, V3(D.slideFerrule, y, zL), AX, D.bowStart - D.slideFerrule + 0.6, D.outerR + 0.45, { segs: 44 });
      ring('tuningSlide', M.brass, V3(D.slideFerrule + 1.2, y, zL), AX, D.outerR + 0.45, 1.6, 0.5);
      ring('tuningSlide', M.brass, V3(D.bowStart - 0.6, y, zL), AX, D.outerR + 0.45, 1.6, 0.5);
    }
    const bow = roundedPath([V3(D.bowStart - 3, 0, zL), V3(D.bowFront, 0, zL), V3(D.bowFront, D.lowerY, zL), V3(D.bowStart - 3, D.lowerY, zL)], D.bowCorner, 0.06);
    tube('tuningSlide', M.brass, bow, D.bowR, { segs: 44 });
    rcPath(bow, D.bowR, 6);
  }

  /* ---------- valves ---------- */
  const valveX = [-V, 0, V];
  valveX.forEach((x, i) => {
    const cn = 'casing' + (i + 1), vn = 'valve' + (i + 1), mv = vn + '.moving';
    const R = D.casingR, Ru = R + 0.35, Rl = R - 0.5, at = V3(x, 0, 0);
    // brass casing: the upper barrel is wider than the lower; they meet at a step with a fine bead
    const body = [[D.casingBot, Rl], [-27.4, Rl], [-26.7, Ru - 0.05], ...arc2(-25.9, Ru, 0.7, 180, 0, 8).map(q => [q[0], Ru + (q[1] - Ru) * 0.4]), [D.casingTop, Ru]];
    add(cn, M['case' + (i + 1)], place(lathe(fine(body), { segs: 72 }), at));
    capsules.push({ a: V3(x, D.capBot, 0), b: V3(x, D.capTop, 0), r: R, id: cn });
    rc(V3(x, D.casingBot, 0), V3(x, -26.5, 0), Rl, { flat: true }); rc(V3(x, -26.5, 0), V3(x, D.casingTop, 0), Ru, { flat: true });
    rc(V3(x, D.casingTop, 0), V3(x, D.casingTop + 6.2, 0), 11.3, { flat: true, kind: 1 }); rc(V3(x, D.casingBot - 8, 0), V3(x, D.casingBot, 0), 10.2, { flat: true, kind: 1 });
    rc(V3(x, D.buttonUnder - 0.9, 0), V3(x, D.buttonUnder + 3.6, 0), 8.1, { flat: true, kind: 1, mov: mv });
    // top cap (nickel): collar, knurled band (the widest part), smooth domed shoulder, a thin felt under the button
    const t0 = D.casingTop;
    add(cn, M.nickel, place(lathe([[t0 - 0.2, Ru - 0.1], [t0 - 0.2, Ru + 0.3], [t0 + 1.3, Ru + 0.3], [t0 + 1.4, 11.1]], { segs: 64 }), at));
    add(cn, M.knurl, place(knurlBand(t0 + 1.4, t0 + 4.6, 11.5, 90), at));
    // a rounded shoulder and a flat top; one unbroken black felt ring lies on it, a little proud
    add(cn, M.nickel, place(lathe([...arc2(t0 + 4.6, 9.4, 2.1, 90, 14, 10), [t0 + 6.6, 8.8]], { segs: 72, crease: 50 }), at));
    add(cn, M.felt, place(lathe([[t0 + 6.45, 8.9], [t0 + 6.8, 8.9], [t0 + 6.9, 8.75], [t0 + 6.9, 3.0], [t0 + 5.2, 3.0], [t0 + 5.2, 0]], { segs: 64, crease: 50 }), at));
    // bottom cap (nickel): band, knurled rim, slightly domed face with the vent hole
    const b0 = D.casingBot;
    add(cn, M.nickel, place(lathe([[b0 - 3.4, 9.9], [b0 - 3.3, Rl + 0.3], [b0 + 0.2, Rl + 0.3], [b0 + 0.2, Rl]], { segs: 64 }), at));
    add(cn, M.knurl, place(knurlBand(b0 - 7.0, b0 - 3.4, 10.3, 86), at));
    add(cn, M.nickel, place(lathe([[b0 - 7.6, 1.35], [b0 - 8.3, 1.6], ...[2.6, 3.6, 4.6, 5.6, 6.6, 7.6, 8.6, 9.2].map(r => [b0 - 7.7 - 0.6 * (1 - ((r - 1.6) / 7.75) ** 2), r]), ...arc2(b0 - 7.0, 9.6, 0.7, 168, 90, 6)], { segs: 64, crease: 50 }), at));   // a slightly domed face, vent hole
    add(cn, M.vent, place(lathe([[b0 - 7.6, 0], [b0 - 7.6, 1.45]], { segs: 24 }), at));
    // the moving part: a slim satin stem, the button (underside tapering to the stem, rounded knurled rim), the pearl
    G(vn); G(mv, vn);
    const u = D.buttonUnder, ub = u - 0.9;
    add(mv, M.satin, place(lathe([[-14, 2.5], [u + 0.3, 2.5]], { segs: 28 }), at));
    add(mv, M['rim' + (i + 1)], place(lathe([[ub, 2.4], [ub, 6.5], ...arc2(ub + 0.9, 7.25, 0.9, 180, 90, 6)], { segs: 56, crease: 50 }), at));
    add(mv, M['rimKnurl' + (i + 1)], place(knurlBand(ub + 0.9, u + 2.6, 8.15, 80), at));
    add(mv, M['rim' + (i + 1)], place(lathe([...arc2(u + 2.6, 7.15, 1.0, 90, 0, 8), [u + 3.6, 6.62], [u + 3.45, 6.58]], { segs: 64, crease: 60 }), at));
    const dome = []; for (let k = 0; k <= 8; k++) { const r = 6.6 * (1 - k / 8); dome.push([u + 3.5 + 1.0 * (1 - (r / 6.6) ** 2), r]); }
    add(mv, M['pearl' + (i + 1)], place(lathe(dome, { segs: 48 }), at));
    capsules.push({ a: V3(x, u, 0), b: V3(x, u + 3.5, 0), r: 8, id: mv });
  });
  {
    // the barrel-shaped stays between the casings: smooth, with one fine bead round the middle
    const link = (xa, y) => {
      add('casing2', M.brassV, place(lathe([[0, 3.85], [9.6, 3.85], [10.4, 4.1], [11.3, 4.38], [12.2, 4.45], [13.1, 4.38], [14.0, 4.1], [14.8, 3.85], [V, 3.85]], { segs: 36 }), V3(xa, y, 0), AX));
      rc(V3(xa + 7, y, 0), V3(xa + V - 7, y, 0), 4.2);
    };
    link(-V, -34.5); link(-V, -91); link(0, -34.5); link(0, -91);
    // the crossover knuckles from valve to valve: short and level, with a fine collar, just behind the centre line
    const cross = (xa, y) => {
      tube('casing2', M.brassV, [V3(xa + 5, y, -2.2), V3(xa + V - 5, y, -2.2)], 4.3, { segs: 32 });
      ring('casing2', M.brassV, V3(xa + V / 2 - 0.35, y, -2.2), AX, 4.3, 2.2, 0.6);
      rc(V3(xa + 7, y, -2.2), V3(xa + V - 7, y, -2.2), 4.4);
    };
    cross(-V, -64); cross(0, -72);
  }

  /* ---------- bell: knuckle out of valve 1, lower leg, the big bow, the tail and the flare ---------- */
  // radius of the bell, d mm back from the rim: a table read off the photos, joined by a smooth monotone curve
  const BELL = [[0, 61.5], [4, 57.2], [10, 50.6], [17.7, 43.9], [23.7, 37.7], [29.6, 32.6], [35.6, 28.4], [41.6, 25.3], [53.6, 20.8], [65.5, 17.8], [83.4, 14.9], [101, 13.0], [119, 11.4], [150, 10.2], [190, 9.3], [273, 8.3], [334, 7.6], [445.4, 7.0]];
  const bellR = (() => {
    const n = BELL.length, x = BELL.map(p => p[0]), y = BELL.map(p => Math.log(p[1])), h = [], dl = [], m = [];
    for (let i = 0; i < n - 1; i++) { h[i] = x[i + 1] - x[i]; dl[i] = (y[i + 1] - y[i]) / h[i]; }
    m[0] = dl[0]; m[n - 1] = dl[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = dl[i - 1] * dl[i] <= 0 ? 0 : 3 * (h[i - 1] + h[i]) / ((2 * h[i] + h[i - 1]) / dl[i - 1] + (h[i] + 2 * h[i - 1]) / dl[i]);
    const raw = d => {
      if (d <= 0) return y[0]; if (d >= x[n - 1]) return y[n - 1];
      let i = 0; while (d > x[i + 1]) i++;
      const t = (d - x[i]) / h[i], t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * y[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * y[i + 1] + (t3 - t2) * h[i] * m[i + 1];
    };
    // The table is a tracing off a photo: its small wobbles (well under half a millimetre) would show as waves in
    // every reflection on the flare. Iron them out: the curve is sampled each millimetre, smoothed, and read back
    // through a smooth interpolant.
    // Laid over the photo from the photo's camera, the flare between 15 and 65 mm from the rim stood 5 to 13 %
    // too fat (it opened too early); these factors, read off that overlay, take it back.
    const TRIM = [[8, 1], [14, 0.95], [20, 0.865], [26.3, 0.875], [34.5, 0.891], [42.8, 0.915], [51, 0.939], [59.3, 0.966], [67.6, 1]];
    const trim = d => { if (d <= TRIM[0][0] || d >= TRIM[TRIM.length - 1][0]) return 1; let i = 0; while (d > TRIM[i + 1][0]) i++; return TRIM[i][1] + (TRIM[i + 1][1] - TRIM[i][1]) * (d - TRIM[i][0]) / (TRIM[i + 1][0] - TRIM[i][0]); };
    const N = 446, S = new Float64Array(N + 1);
    for (let i = 0; i <= N; i++) S[i] = raw(i) + Math.log(trim(i));
    for (let pass = 0; pass < 2; pass++) {
      const T = S.slice(), g = j => j < 0 ? 2 * T[0] - T[-j] : j > N ? 2 * T[N] - T[2 * N - j] : T[j];
      for (let i = 1; i < N; i++) {
        const sig = clamp(2 + i * 0.06, 2, 10), w = Math.ceil(sig * 2.5); let a = 0, b = 0;
        for (let k = -w; k <= w; k++) { const q = Math.exp(-k * k / (2 * sig * sig)); a += g(i + k) * q; b += q; }
        S[i] = a / b;
      }
    }
    const at = j => S[clamp(j, 0, N)];
    return d => {
      if (d <= 0) return BELL[0][1]; if (d >= N) return Math.exp(S[N]);
      const i = Math.floor(d), t = d - i, p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      return Math.exp(p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0))));
    };
  })();
  if (typeof location !== 'undefined' && /vtdebug/.test(location.search)) { let mx = 0, at = 0; for (const [d, r] of BELL) { const e = Math.abs(bellR(d) - r); if (e > mx) { mx = e; at = d; } } console.log('bell smoothing: largest change ' + mx.toFixed(3) + ' mm at d=' + at); }
  {
    const B = D.bell, xL = B.bowCx - B.bowR;
    const sBend = spline([V3(-28, B.lowY, zB + 13), V3(-32, B.lowY, zB + 12.4), V3(-36, B.lowY, zB + 10.4), V3(-40.5, B.lowY, zB + 6.5), V3(-45, B.lowY, zB + 2.6), V3(-49, B.lowY, zB + 0.6), V3(-53, B.lowY, zB)], 40);
    const head = [...sBend, ...roundedPath([V3(-53, B.lowY, zB), V3(xL, B.lowY, zB), V3(xL, 0, zB), V3(B.bowCx + 6, 0, zB)], [B.bowR, B.bowR], 0.045).slice(1)];
    sleeve('bellTube', M.brass, V3(-36.2, B.lowY, zB + 10.25), V3(4, 0, 1.7), 4.2, 6.3, { segs: 40 });
    const P = densify(head, 3), Rr = [];
    for (const p of P) {
      if (p.x < B.bowCx - 1e-3) { const u = Math.atan2(-(p.x - B.bowCx), -(p.y + B.bowR)) / Math.PI; Rr.push(6.1 + 1.0 * smooth(0, 1, u)); }
      else Rr.push(p.y < -1 ? 6.1 - 0.35 * smooth(-47, -30, p.x) : bellR(B.rimX - p.x));
    }
    const split = P.length - 1;
    for (let x = B.bowCx + 6; x < B.rimX;) {
      const d = B.rimX - x, step = clamp(d * 0.05, 0.22, 5);
      x = Math.min(B.rimX, x + step); P.push(V3(x, 0, zB)); Rr.push(bellR(B.rimX - x));
    }
    const all = sweep(P, Rr, { segs: 112, up: AY });
    add('bellTube', M.brass, sliceRings(all, 0, split));
    add('bell', M.brassBell, sliceRings(all, split, P.length - 1));
    all.dispose();
    for (let i = 4; i < P.length; i += 4) capsules.push({ a: P[i - 4], b: P[i], r: (Rr[i - 4] + Rr[i]) / 2, id: 'bell' });
    rcPath(P.slice(0, split + 1), 6.5, 7);                                         // knuckle, lower leg, the big bow
    const bx = [B.bowCx + 6, -40, 50, 115, 160, 190, 212, 230, 245, 257, 267, 275];   // the tail and the start of the flare, in steps
    refl.skipBell = [refl.length, refl.length + bx.length - 1];
    for (let i = 1; i < bx.length; i++) rc(V3(bx[i - 1], 0, zB), V3(bx[i], 0, zB), bellR(B.rimX - (bx[i - 1] + bx[i]) / 2));
    // inside of the flare (what you see looking into the bell), darker toward the throat
    const Pi = [], Ri = [];
    for (let i = P.length - 1; i >= 0 && P[i].x > 40; i--) { Pi.unshift(P[i]); Ri.unshift(Rr[i] - 0.45); }
    const inner = sweep(Pi, Ri, { segs: 112, up: AY, inside: true });
    const col = new Float32Array(inner.attributes.position.count * 3), ip = inner.attributes.position;
    for (let i = 0; i < ip.count; i++) {
      // darker the narrower it gets: the throat ends in a deep brown hole, as it does when you look into a real bell
      const rr = Math.hypot(ip.getY(i), ip.getZ(i) - zB), k = (0.02 + 0.26 * smooth(7.5, 25, rr) + 0.32 * smooth(22, 47, rr) + 0.40 * smooth(44, 61, rr)) ** 0.6;
      col[i * 3] = k; col[i * 3 + 1] = k * (0.88 + 0.12 * k * k); col[i * 3 + 2] = k * (0.66 + 0.34 * k * k);   // deeper = more gold: light that has bounced off brass twice
    }
    inner.setAttribute('color', new THREE.BufferAttribute(col, 3));
    inner.userData.keepColor = true;
    add('bell', M.brassIn, inner);
    // the end of the throat: a dark stop, so you can never see daylight through the tube
    const stop = new THREE.CircleGeometry(Ri[0] + 0.3, 32); stop.rotateY(Math.PI / 2); stop.translate(Pi[0].x + 0.2, 0, zB);
    add('bell', M.dark, stop);
    // rolled rim
    const rim = new THREE.TorusGeometry(B.rimR - 0.7, 2.3, 20, 128); rim.rotateY(Math.PI / 2); rim.translate(B.rimX - 1.7, 0, zB);   // the bead is rolled back, behind the edge
    add('bell', M.brassBell, rim);
    // sleeve where the bow tube meets the knuckle from valve 1
    sleeve('bellTube', M.brass, V3(-64, B.lowY, zB), AX, 11, 6.75, { segs: 40 });
    ring('bellTube', M.brass, V3(-62.6, B.lowY, zB), AX, 6.75, 1.5, 0.5); ring('bellTube', M.brass, V3(-54.4, B.lowY, zB), AX, 6.75, 1.5, 0.5);
  }

  /* ---------- 3rd valve slide ---------- */
  {
    const S = D.s3; G('slide3'); G('slide3.moving', 'slide3');
    for (const y of [S.yU, S.yL]) {
      tube('slide3', M.brass, [V3(V + 4, y, 0), V3(S.x0, y, 0)], 6.0, { segs: 36 });                  // stub on the casing
      ring('slide3', M.brass, V3(V + 11.6, y, 0), AX, 6.05, 1.5, 0.5);
      tube('slide3', M.nickel, [V3(S.x0 - 1, y, 0), V3(S.x0 + 62, y, 0)], 5.7, { segs: 32, noAO: true });   // inner leg (nickel silver), seen when the slide is out
      tube('slide3.moving', M.slide3B, [V3(S.x0, y, 0), V3(S.x1 - 2.6, y, 0)], 6.3, { segs: 40, capA: true });
      ring('slide3.moving', M.slide3B, V3(S.x0 + 0.9, y, 0), AX, 6.4, 1.8, 0.75);
      sleeve('slide3.moving', M.slide3B, V3(S.x1 - 3.2, y, 0), AX, 4.2, 6.6, { segs: 40 });
    }
    const rb = (S.yU - S.yL) / 2;
    tube('slide3.moving', M.slide3B, roundedPath([V3(S.x1 - 1, S.yU, 0), V3(S.x1 + rb, S.yU, 0), V3(S.x1 + rb, S.yL, 0), V3(S.x1 - 1, S.yL, 0)], rb, 0.07), 6.1, { segs: 40 });
    for (const y of [S.yU, S.yL]) { rc(V3(V + 6, y, 0), V3(S.x0, y, 0), 6.0); rc(V3(S.x0, y, 0), V3(S.x1, y, 0), 6.3, { mov: 'slide3.moving' }); }
    rcPath(roundedPath([V3(S.x1, S.yU, 0), V3(S.x1 + rb, S.yU, 0), V3(S.x1 + rb, S.yL, 0), V3(S.x1, S.yL, 0)], rb, 0.07), 6.1, 4, { mov: 'slide3.moving' });
    // finger ring on its bar, the clamp that holds the bar, the thumb screw, the rubber tip
    const yT = S.yU + 6.6;                                                                             // top of the upper tube
    const band = [[-3.2, 10.3], ...arc2(-2.7, 11.4, 0.5, 180, 90, 4), ...arc2(2.7, 11.4, 0.5, 90, 0, 4), [3.2, 10.3], ...arc2(2.7, 10.3, 0.5, 0, -90, 4), ...arc2(-2.7, 10.3, 0.5, -90, -180, 4)];
    add('slide3.moving', M.nickel, place(lathe(band, { segs: 72, crease: 60 }), V3(73.3, yT + 3.3 + 11.8, 0), AZ));
    const bar = roundedBox(52, 2.3, 5.4, 0.7); bar.translate(73.3 + 2 + 26, yT + 2.5, 0); add('slide3.moving', M.nickel, bar);
    const blk = roundedBox(9.4, 9.2, 9.2, 1.1); blk.translate(109, yT + 3.6, 0); add('slide3.moving', M.slide3B, blk);
    add('slide3.moving', M.nickel, place(lathe([[0, 1.3], [3.2, 1.3], [3.2, 3.0]], { segs: 20 }), V3(109, yT + 8.1, 0)));
    add('slide3.moving', M.knurl, place(knurlBand(3.2, 5.2, 3.3, 22), V3(109, yT + 8.1, 0)));
    add('slide3.moving', M.nickel, place(lathe([[5.2, 3.3], [5.5, 2.9], [5.5, 0]], { segs: 24 }), V3(109, yT + 8.1, 0)));
    add('slide3.moving', M.rubber, place(lathe([[0, 2.2], [0, 3.1], [4.5, 3.1], ...arc2(4.5, 0, 3.1, 90, 0, 6)], { segs: 24 }), V3(126.5, yT + 2.5, 0), AX));
    // the little stop screw under the lower leg
    add('slide3', M.nickel, place(lathe([[0, 0], [0, 3.1], [0.6, 3.4]], { segs: 24 }), V3(96.7, S.yL - 6.2 - 4.4, 3.5)));
    add('slide3', M.knurl, place(knurlBand(0.6, 3.6, 3.45, 22), V3(96.7, S.yL - 6.2 - 4.4, 3.5)));
    add('slide3', M.nickel, place(lathe([[3.6, 3.4], [4.4, 1.6], [4.4, 1.3], [6.4, 1.3]], { segs: 24 }), V3(96.7, S.yL - 6.2 - 4.4, 3.5)));
  }

  /* ---------- 1st valve slide ---------- */
  {
    const S = D.s1; G('slide1'); G('slide1.moving', 'slide1');
    for (const y of [S.yU, S.yL]) {
      const xc = y === S.yU ? -V - 7.3 : -V - 2.1;                                                    // where this leg turns in to the casing
      tube('slide1', M.brass, roundedPath([V3(xc, y, 2), V3(xc, y, z1), V3(S.x0 - 1.5, y, z1)], 6.6), 6.0, { segs: 36 });
      tube('slide1', M.nickel, [V3(S.x0 - 0.5, y, z1), V3(S.x0 - 40, y, z1)], 5.7, { segs: 32, noAO: true });   // (starts inside the outer tube: a millimetre further out it showed as a pale end face beside valve 1)
      tube('slide1.moving', M.brass, [V3(S.x1 + 2.6, y, z1), V3(S.x0, y, z1)], 6.3, { segs: 40 });
      ring('slide1.moving', M.brass, V3(S.x0 - 0.35, y, z1), AX, 6.4, 1.8, 0.75);
      sleeve('slide1.moving', M.brass, V3(S.x1 + 3.2, y, z1), V3(-1, 0, 0), 4.2, 6.6, { segs: 40 });
    }
    const rb = (S.yU - S.yL) / 2;
    tube('slide1.moving', M.brass, roundedPath([V3(S.x1 + 1, S.yU, z1), V3(S.x1 - rb, S.yU, z1), V3(S.x1 - rb, S.yL, z1), V3(S.x1 + 1, S.yL, z1)], rb, 0.07), 6.1, { segs: 40 });
    for (const y of [S.yU, S.yL]) {
      const xc = y === S.yU ? -V - 7.3 : -V - 2.1;
      rcPath(roundedPath([V3(xc, y, 5), V3(xc, y, z1), V3(S.x0, y, z1)], 6.6), 6.0, 2); rc(V3(S.x0, y, z1), V3(S.x1, y, z1), 6.3, { mov: 'slide1.moving' });
    }
    rcPath(roundedPath([V3(S.x1, S.yU, z1), V3(S.x1 - rb, S.yU, z1), V3(S.x1 - rb, S.yL, z1), V3(S.x1, S.yL, z1)], rb, 0.07), 6.1, 4, { mov: 'slide1.moving' });
    // thumb saddle: a U of flat nickel strip standing on the upper leg
    const yT = S.yU + 6.6, cx = -50.2, w = 11.0;
    const U = spline([V3(cx - w - 1.7, yT + 27.5, z1), V3(cx - w - 0.9, yT + 25, z1), V3(cx - w - 0.3, yT + 22, z1), V3(cx - w, yT + 18, z1), V3(cx - w, yT + 12, z1), V3(cx - w * 0.9, yT + 7.2, z1), V3(cx - w * 0.66, yT + 3.6, z1), V3(cx - w * 0.34, yT + 1.75, z1), V3(cx, yT + 1.2, z1), V3(cx + w * 0.34, yT + 1.75, z1), V3(cx + w * 0.66, yT + 3.6, z1), V3(cx + w * 0.9, yT + 7.2, z1), V3(cx + w, yT + 12, z1), V3(cx + w, yT + 18, z1), V3(cx + w + 0.3, yT + 22, z1), V3(cx + w + 0.9, yT + 25, z1), V3(cx + w + 1.7, yT + 27.5, z1)], 80);
    add('hooks', M.nickel, sweep(U, 1.15, { segs: 20, up: AZ, scaleN: 3.1, scaleB: 1, sq: 5, capA: true, capB: true }));   // a flat strap: 7 mm wide, square ends
    const sf = roundedBox(8, 1.7, 6.4, 0.5); sf.translate(cx, yT + 0.05, z1); add('hooks', M.nickel, sf);                    // its soldered foot
  }

  /* ---------- 2nd valve slide: a short crook pointing out and back from the middle casing ---------- */
  {
    const S = D.s2, a = 40 * Math.PI / 180, u = V3(-Math.sin(a), 0, Math.cos(a));
    const at = (s, y) => V3(2.8 + u.x * (s - 8), y, 9.35 + u.z * (s - 8));  // s = 8 is where the leg's axis leaves the casing wall
    for (const y of [S.yU, S.yL]) {
      tube('slide2', M.brassV, [at(5, y), at(16, y)], 6.4, { segs: 36, capA: true });
      sleeve('slide2', M.brassV, at(15.6, y), u, 11.6, 6.8, { segs: 36 });                 // a smooth sleeve with two fine lines
      ring('slide2', M.brassV, at(21.2, y), u, 6.8, 1.2, 0.5);
    }
    const rb = (S.yU - S.yL) / 2, ym = (S.yU + S.yL) / 2;
    const A = at(26.5, S.yU), C = at(26.5, S.yL), tip = at(28 + rb, 0);
    tube('slide2', M.brassV, roundedPath([A, V3(tip.x, S.yU, tip.z), V3(tip.x, S.yL, tip.z), C], rb, 0.07), D.bowR, { segs: 40 });
    rc(at(9, S.yU), A, 6.7); rc(at(9, S.yL), C, 6.7);
    rcPath(roundedPath([A, V3(tip.x, S.yU, tip.z), V3(tip.x, S.yL, tip.z), C], rb, 0.07), D.bowR, 4);
    // pull knob: on the face of the bow toward the player's right, so from the side it shows in the middle of the C
    const wv = V3(Math.cos(a), 0, Math.sin(a));
    add('slide2', M.brassV, place(lathe([[0, 1.7], [3.6, 1.7], ...arc2(5.2, 0, 2.6, 125, 0, 8)], { segs: 20 }), V3(tip.x, ym, tip.z).addScaledVector(wv, D.bowR - 0.8), wv));
  }

  /* ---------- braces between leadpipe and bell ---------- */
  {
    const brace = (xa, xb, ra) => {
      // (the post starts and ends inside the two tubes, and is never wider than they are)
      const rbell = bellR(D.bell.rimX - xb), za = zL - 2.0, zb = zB + 2.0, Lz = za - zb;
      const foot = d => 1.5 * (1 - smooth(0, 5.0, d));                                                     // the post flares into its foot
      add('braces', M.brass, sweep(densify([V3(xa, 0, za), V3(xb, 0, zb)], 0.6), s => 3.1 + foot(s - (ra - 2.0)) + foot(Lz - s - (rbell - 2.0)), { segs: 28, up: AY }));
      // feet: flat tongues soldered along each tube
      // feet: diamond flanges wrapped round each tube
      const flange = (zAxis, rAt, x0, x1, th0, wrap = 0.66) => {
        const nx = 16, nt = 8, Wd = nt + 1, pos = [], nor = [], uv = [], idx = [];
        for (let i = 0; i <= nx; i++) {
          const q = i / nx, x = x0 + (x1 - x0) * q, half = wrap * (1 - Math.abs(2 * q - 1)) + 0.02, R = rAt(x) + 0.9;
          for (let j = 0; j <= nt; j++) { const th = th0 + half * (2 * j / nt - 1), c = Math.cos(th), sn = Math.sin(th); pos.push(x, R * sn, zAxis + R * c); nor.push(0, sn, c); uv.push(q, j / nt); }
        }
        for (let i = 0; i < nx; i++) for (let j = 0; j < nt; j++) { const a = i * Wd + j; idx.push(a, a + Wd, a + 1, a + 1, a + Wd, a + Wd + 1); }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
        add('braces', M.brass, g);
      };
      flange(zL, () => ra, xa - 13, xa + 13, Math.PI, 0.95); flange(zB, x => bellR(D.bell.rimX - x), xb - 13, xb + 13, 0, 0.5);
    };
    brace(-101, -101, 5.45);                                   // (no photo shows them: built the usual way)
    brace(150, 150, D.outerR);
  }

  /* ---------- pinky hook on the leadpipe ---------- */
  {
    const y0 = 6.1;                                           // the top of the leadpipe here
    const H = spline([V3(71, y0 + 0.6, zL), V3(62, y0 + 0.6, zL), V3(53.5, y0 + 0.9, zL), V3(48.4, y0 + 3.2, zL), V3(45.6, y0 + 8.6, zL), V3(45.2, y0 + 14.6, zL), V3(47.2, y0 + 19.3, zL), V3(51.6, y0 + 22.0, zL), V3(57.5, y0 + 22.8, zL)], 64);
    // a slim strip, thinner toward the tip
    add('hooks', M.brass, sweep(H, (s, L) => (1.5 - 0.2 * s / L) * (0.6 + 0.4 * smooth(7, 17, s)) * (0.4 + 0.6 * Math.sqrt(smooth(0, 1.2, L - s))) + 0.02, { segs: 18, up: AZ, scaleN: 2.3, scaleB: 1, sq: 4, capA: true }));
  }

  /* ---------- water keys (main tuning slide, 3rd slide) ---------- */
  {
    const key = (group, z, base, n, lever, pivot, postFrom, brass = M.brass) => {
      const N = V3(n[0], n[1], 0).normalize(), b = V3(base[0], base[1], z);
      add(group, brass, place(lathe([[-3, 3.0], [2.4, 3.0], [2.4, 2.2]], { segs: 20 }), b, N));                                         // nipple
      add(group, M.cork, place(lathe([[2.4, 0], [2.4, 4.0], [4.4, 4.0], [4.4, 0]], { segs: 24, crease: 40 }), b, N));                      // cork
      add(group, M.nickel, place(lathe([[4.0, 4.5], [4.6, 4.7], ...arc2(5.0, 3.5, 1.2, 90, 0, 6), [6.2, 0]], { segs: 28 }), b, N));        // cup that holds the cork
      const Lp = spline(lever.map(p => V3(p[0], p[1], z)), 60);
      const pv = V3(pivot[0], pivot[1], z), pf = V3(postFrom[0], postFrom[1], z);
      let ip = 0; for (let i = 1; i < Lp.length; i++) if (Lp[i].distanceToSquared(pv) < Lp[ip].distanceToSquared(pv)) ip = i;
      const tp = ip / 60;
      // the lever: a strip arm from the cup, deep where the pivot screw goes through, then a broad paddle that follows the bow
      add(group, M.nickel, sweep(Lp, (s, L) => (1.05 + 1.25 * Math.exp(-(((s / L - tp) / 0.1) ** 2))) * Math.sqrt(smooth(0, 1.5, s) * smooth(0, 1.5, L - s)) + 0.02, { segs: 16, up: AZ, scaleN: 2.5, scaleB: 1, sq: 3.5 }));
      add(group, M.nickel, sweep(Lp.slice(Math.min(Lp.length - 8, ip + 5)), (s, L) => 0.85 * Math.sqrt(smooth(0, 3, s) * smooth(0, 2.2, L - s)) + 0.02, { segs: 16, up: AZ, scaleN: 5.0, scaleB: 1, sq: 2.5 }));
      for (const dz of [-3.6, 3.6]) add(group, brass, sweep([pf.clone().setZ(z + dz), pv.clone().lerp(pf, -0.18).setZ(z + dz)], 1.5, { segs: 12, capB: true }));   // the two posts
      add(group, M.nickel, place(lathe([[-5.3, 0], [-5.3, 1.7], [-5.0, 2.0], [-4.7, 2.0], [-4.7, 1.0], [4.7, 1.0], [4.7, 2.0], [5.0, 2.0], [5.3, 1.7], [5.3, 0]], { segs: 20, crease: 40 }), pv, AZ));  // pivot screw and its heads
      const coil = new THREE.TorusGeometry(1.9, 0.34, 6, 18);                                                                              // the spring, coiled round the screw between the posts
      for (let dz = -2.1; dz <= 2.11; dz += 0.7) { const c = coil.clone(); c.translate(pv.x, pv.y, z + dz); add(group, M.steel, c); }
      coil.dispose();
    };
    // main bow: nipple on the outside of the lower corner
    key('waterKeys', zL, [184.2, -70.8], [0.418, -0.908], [[185.0, -75.6], [190.4, -76.6], [196.6, -70.6], [202.4, -61.0], [207.6, -50], [210.6, -41], [211.9, -34.6]], [201.6, -62.2], [197.6, -59.0]);
    // 3rd slide bow
    G('slide3.moving');
    const k3 = 'slide3.moving';
    key(k3, 0, [155.7, -77.9], [0.5, -0.866], [[156.6, -82.6], [162.2, -83.4], [167.6, -77.5], [170.6, -68.5], [171.2, -59], [170.2, -51.5], [168.8, -47]], [170.4, -68.0], [165.2, -66.6], M.slide3B);
  }

  /* ---------- soft shading where tubes sit close together (baked into vertex colours) ---------- */
  const ao = (geom, self) => {
    if (geom.userData.keepColor) return;
    const p = geom.attributes.position, nrm = geom.attributes.normal, col = new Float32Array(p.count * 3);
    const ab = V3(), ap = V3(), c = V3(), v = V3(), nv = V3();
    geom.computeBoundingBox();
    const bb = geom.boundingBox, kb = new THREE.Box3();
    const near = capsules.filter(k => {
      if (k.id === self) return false;
      kb.makeEmpty().expandByPoint(k.a).expandByPoint(k.b).expandByScalar(k.r * 3.2 + 6);
      return kb.intersectsBox(bb);
    });
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); nv.fromBufferAttribute(nrm, i);
      let occ = 0;
      for (const k of near) {
        ab.subVectors(k.b, k.a); ap.subVectors(v, k.a);
        const t = clamp(ap.dot(ab) / (ab.lengthSq() || 1), 0, 1);
        c.copy(k.a).addScaledVector(ab, t).sub(v);
        const d = c.length();
        if (d > k.r * 3.2 + 6) continue;
        const cosN = c.dot(nv) / (d || 1);
        const gap = Math.max(d - k.r, 0.4);
        occ += Math.max(0, cosN * 0.75 + 0.25) * clamp(k.r / (k.r + gap * 1.6), 0, 1) ** 2 * (cosN > -0.2 ? 1 : 0);
      }
      const a = 1 - 0.7 * clamp(occ, 0, 1.25) / 1.25;
      col[i * 3] = a; col[i * 3 + 1] = a * (0.84 + 0.16 * a); col[i * 3 + 2] = a * (0.6 + 0.4 * a);
    }
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3));
  };

  // merge everything into one mesh per material per group
  const meshes = [];
  for (const [name, g] of Object.entries(groups)) {
    for (const [mat, list] of g.bins) {
      if (mat !== M.dark) for (const geom of list) ao(geom, name.startsWith('bell') ? 'bell' : name);
      const mesh = new THREE.Mesh(merge(list), mat);
      mesh.name = name + ':' + Object.keys(M).find(k => M[k] === mat);
      g.obj.add(mesh); meshes.push(mesh);
    }
    g.bins.clear();
  }
  const obj = n => groups[n].obj;
  for (let i = 1; i <= 3; i++) { obj('valve' + i).userData.moving = obj('valve' + i + '.moving'); obj('valve' + i).moving = obj('valve' + i + '.moving'); }
  for (const n of ['slide1', 'slide3']) { obj(n).userData.moving = obj(n + '.moving'); obj(n).moving = obj(n + '.moving'); }
  return { root, M, obj, meshes, valveX, capsules, refl };
}

// squared distance between the segments p1-q1 and p2-q2
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
 *  Name tags
 * ------------------------------------------------------------------ */
const PARTS = [
  // text, anchor (mm), which moving part it rides on (if any), outward direction (tag fades when this faces away),
  // and the part whose own tubes should not count as hiding it
  ['Mouthpiece', [-235.5, 12.6, D.zL], null, null],
  ['Mouthpiece receiver', [-158, 6.4, D.zL], null, null],
  ['Leadpipe', [-88, 5.5, D.zL], null, null],
  ['1st valve', [-D.V, D.buttonTop, 0], 'valve1.moving', null],
  ['2nd valve', [0, D.buttonTop, 0], 'valve2.moving', null],
  ['3rd valve', [D.V, D.buttonTop, 0], 'valve3.moving', null],
  ['Finger hook (pinky)', [47.5, 26, D.zL], null, null],
  ['Bell', [268, 20, D.zB + 15.4], null, null, 'bell'],
  ['3rd slide ring', [73.3, -23.8, 3], 'slide3.moving', null],
  ['Valve casings', [D.V, -92, 9.5], null, null],
  ['Valve caps', [-D.V, -108.5, 10.3], null, null],
  ['1st slide thumb saddle', [-59.9, -35, D.z1 + 2.5], 'slide1.moving', null],
  ['1st valve slide', [-96, -72, D.z1 + 4], 'slide1.moving', null],
  ['2nd valve slide', [-17.5, -64.6, 36.5], null, [-0.5, 0, 0.86]],
  ['3rd valve slide', [92, -50.6, 5.4], 'slide3.moving', null],
  ['Main tuning slide', [178, 5.6, D.zL + 4], null, null],
  ['Water key', [207, -51, D.zL + 2], null, null],
];

const CSS = `
.vt3d-root{position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.vt3d-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;cursor:grab;touch-action:none}
.vt3d-canvas.vt3d-drag{cursor:grabbing}
.vt3d-over{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.vt3d-over svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.vt3d-over line{stroke:#1f2937;stroke-width:1;stroke-opacity:.7;transition:opacity .16s}
.vt3d-over circle{fill:#1f2937;transition:opacity .16s}
.vt3d-tag{position:absolute;left:0;top:0;font:600 13px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.28);border-radius:7px;padding:3px 7px 4px;white-space:nowrap;box-shadow:0 1px 3px rgba(31,41,55,.16);will-change:transform,opacity;transition:opacity .16s}
.vt3d-num{position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;font:700 14px/24px system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center;color:#1f2937;background:#fff;border:1.5px solid #1f2937;box-shadow:0 1px 3px rgba(31,41,55,.25);will-change:transform}
`;

/* ------------------------------------------------------------------ *
 *  The viewer
 * ------------------------------------------------------------------ */
const ENV_SIGN = -1;
const VIEWS = {
  side:   { az: -4, el: 9 },
  player: { az: -64, el: 22 },
  bell:   { az: 50, el: 10 },
  top:    { az: 0, el: 87 },
  bottom: { az: 0, el: -86 },
  left:   { az: 176, el: 9 },
};

export function createTrumpet(container, options = {}) {
  const opt = Object.assign({ labels: 'off', view: 'side', shot: false }, options);
  if (!document.getElementById('vt3d-style')) { const st = document.createElement('style'); st.id = 'vt3d-style'; st.textContent = CSS; document.head.appendChild(st); }
  container.classList.add('vt3d-root');
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: !!opt.shot, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = FILM ? THREE.CustomToneMapping : THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  const canvas = renderer.domElement; canvas.className = 'vt3d-canvas'; canvas.setAttribute('aria-label', '3D trumpet: drag to turn it, pinch or scroll to zoom');
  container.appendChild(canvas);
  const over = document.createElement('div'); over.className = 'vt3d-over'; container.appendChild(over);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); over.appendChild(svg);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const bake = st => { const rt = pmrem.fromScene(st, 0.012, 0.1, 200); st.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); return rt; };
  // one room for everything: the rougher materials read it from this baked map, the polished metals look the same
  // room up exactly, in the shader (see TRACE_GLSL)
  const envRT = bake(studioScene());
  scene.environment = envRT.texture;
  pmrem.dispose();

  const T = buildTrumpet();
  scene.add(T.root);

  /* ---- mirror reflections of the instrument in itself ---- */
  // quality 'high' = traced against the tube list; 'low' = the studio only (weak graphics chips); 'plain' = three.js's
  // own shading, the way out if the patched shader ever fails to compile. The page never depends on the patch.
  const tracer = (() => {
    const list = T.refl, N = list.length, data = new Float32Array(N * 12), ax = V3();   // per tube: start + radius | unit axis + length (negative = flat ends) | kind
    const tex = new THREE.DataTexture(data, N, 3, THREE.RGBAFormat, THREE.FloatType);
    tex.minFilter = tex.magFilter = THREE.NearestFilter; tex.generateMipmaps = false;
    const lin = hex => { const c = new THREE.Color(hex); return V3(c.r, c.g, c.b); };
    const U = { vtPix: { value: 0.001 }, vtRot: { value: new THREE.Matrix3() }, vtBell: { value: V3(D.bell.rimX, D.zB, D.bell.rimR) }, vtCaps: { value: tex }, vtAo: { value: 0.5 }, vtTint: { value: [lin(BRASS), lin(NICKEL).multiplyScalar(0.9), V3(0.03, 0.03, 0.03)] } };
    const mats = [T.M.brass, T.M.brassV, T.M.brassBell, T.M.brassIn, T.M.nickel, T.M.silver, T.M.rim1, T.M.rim2, T.M.rim3, T.M.case1, T.M.case2, T.M.case3, T.M.slide3B];
    const like = m => (m.userData.like && T.M[m.userData.like]) || m;      // the colourable copies shade exactly as the metal they copy
    const nk = m => m === T.M.nickel || m === T.M.silver;
    const write = () => {
      for (let i = 0; i < N; i++) {
        const k = list[i], o = k.mov ? T.obj(k.mov).position : null, ox = o ? o.x : 0, oy = o ? o.y : 0, oz = o ? o.z : 0;
        const len = ax.subVectors(k.b, k.a).length(); ax.multiplyScalar(1 / len);
        data.set([k.a.x + ox, k.a.y + oy, k.a.z + oz, k.r], i * 4);
        data.set([ax.x, ax.y, ax.z, k.flat ? -len : len], (N + i) * 4);
        data[(2 * N + i) * 4] = k.kind;
      }
      tex.needsUpdate = true;
    };
    write();
    const target = 'vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n\t\t\treturn envMapColor.rgb * envMapIntensity;';
    const chunk = THREE.ShaderChunk.envmap_physical_pars_fragment || '';
    const usable = chunk.includes(target) && renderer.capabilities.isWebGL2 !== false;
    let level = 'plain';
    const set = q => {
      q = usable && (q === 'high' || q === 'low') ? q : 'plain';
      if (q === level) return;
      level = q;
      for (const m of mats) {
        if (q === 'plain') { m.onBeforeCompile = () => {}; m.customProgramCacheKey = () => 'vt-plain'; delete m.defines.VT_N; delete m.defines.VT_TRACE; delete m.defines.VT_INSIDE; delete m.defines.VT_SOFT; }
        else {
          m.defines.VT_N = N; m.defines.VT_TRACE = q === 'high' ? 1 : 0; m.defines.VT_SOFT = (opt.soften || 90).toFixed(1); if (m === T.M.brassIn) m.defines.VT_INSIDE = 1;
          m.customProgramCacheKey = () => 'vt-studio';
          m.onBeforeCompile = sh => {
            const b = like(m);
            Object.assign(sh.uniforms, U, { vtUpright: { value: b === T.M.brassBell ? -1 : b === T.M.brassIn ? 0 : 1 }, vtEdge: { value: b === T.M.brassBell ? 0.4 : 1 }, vtTube: { value: b === T.M.brass || b === T.M.brassBell ? 1 : 0 }, vtFront: { value: nk(b) ? 0.6 : 1 }, vtDeep: { value: b === T.M.brassBell ? 0.92 : 1 }, vtCool: { value: nk(b) ? 0.25 : 0 }, vtBlob: { value: b === T.M.brassBell ? 0.62 : 0 }, vtWave: { value: opt.wave === false ? 0 : b === T.M.brassBell ? 0.006 : b === T.M.brass ? 0.0045 : 0 }, vtSkip: { value: b === T.M.brassBell ? new THREE.Vector2(list.skipBell[0], list.skipBell[1]) : new THREE.Vector2(-1, -1) } });
            sh.fragmentShader = sh.fragmentShader
              .replace('#include <envmap_physical_pars_fragment>', TRACE_GLSL + '\n' + chunk.replace(target, 'return vtRadiance( reflectVec, normal ) * envMapIntensity;'))
              .replace('#include <color_fragment>', '#if defined( USE_COLOR ) && ! defined( VT_INSIDE )\n\tdiffuseColor.rgb *= mix( vec3( 1.0 ), vColor, vtAo );\n#endif');
          };
        }
        m.needsUpdate = true;
      }
      U.vtAo.value = q === 'high' ? 0.6 : 0.8;          // without the traced reflections the baked contact shading carries the gaps
    };
    // the set follows the camera, round and (all but 7 degrees, where the photo's camera stood) up and down: the
    // lights stay where they are on the screen while the instrument turns in front of them, as in a hand
    const aim = (az, el) => {
      const t = el - 7 * Math.PI / 180, sa = Math.sin(az), ca = Math.cos(az), st = Math.sin(t), ct = Math.cos(t);
      U.vtRot.value.set(ca, 0, -sa, -sa * st, ct, -ca * st, sa * ct, st, ca * ct);
      U.vtPix.value = 2 / (camera.projectionMatrix.elements[5] * Math.max(1, renderer.domElement.height));   // the angle one pixel covers
    };
    return { set, write, aim, uniforms: U, get level() { return level; }, count: N, dispose() { tex.dispose(); } };
  })();
  let shaderFailed = false;
  renderer.debug.onShaderError = (gl, program, vs, fs) => {
    if (shaderFailed) return;
    shaderFailed = true;
    console.warn('Virtual Trumpet: the reflection shader did not compile here; using plain reflections. ' + (gl.getProgramInfoLog(program) || '') + ' ' + (gl.getShaderInfoLog(fs) || '').slice(0, 600));
  };
  tracer.set(opt.reflections === 'low' || opt.reflections === false ? 'low' : 'high');

  // points used to frame the instrument from any direction
  const fitPts = [];
  const box = new THREE.Box3();
  T.root.updateMatrixWorld(true);
  for (const m of T.meshes) {
    const p = m.geometry.attributes.position, step = Math.max(1, Math.floor(p.count / 500));
    for (let i = 0; i < p.count; i += step) { const v = V3().fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); fitPts.push(v); box.expandByPoint(v); }
  }
  const centre = box.getCenter(V3());

  /* ---- contact shadow, baked once: the instrument's footprint seen from below, blurred ---- */
  const floorY = D.capBot - 16;
  const shadow = (() => {
    const W = 512, H = 256, halfW = 330, halfH = 165, cx = centre.x, cz = centre.z;
    const rtA = new THREE.WebGLRenderTarget(W, H, { depthBuffer: false }), rtB = new THREE.WebGLRenderTarget(W, H, { depthBuffer: false });
    const cam = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 600);
    cam.position.set(cx, 300, cz); cam.up.set(0, 0, -1); cam.lookAt(cx, 0, cz);
    const sil = new THREE.ShaderMaterial({
      uniforms: { y0: { value: floorY } }, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.MaxEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      vertexShader: 'varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'varying float h; void main(){ float k = 1.0 - 0.72 * smoothstep(0.0, 190.0, h); gl_FragColor = vec4(k, k, k, 1.0); }',
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
      fragmentShader: 'varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.12, u) * smoothstep(0.0, 0.12, 1.0 - u); gl_FragColor = vec4(0.07, 0.05, 0.03, a * k * e.x * e.y); }',
    }));
    plane.rotation.x = -Math.PI / 2; plane.position.set(cx, floorY, cz); plane.renderOrder = -1; plane.name = 'shadow';
    scene.add(plane);
    const bake = () => {
      const prevTM = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
      plane.visible = false; scene.overrideMaterial = sil;
      renderer.setRenderTarget(rtA); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = null; plane.visible = true;
      const u = quad.material.uniforms;
      for (const r of [5, 2.4, 1.2]) {
        u.tex.value = rtA.texture; u.dir.value.set(r / W, 0); renderer.setRenderTarget(rtB); renderer.render(qScene, qCam);
        u.tex.value = rtB.texture; u.dir.value.set(0, r / H); renderer.setRenderTarget(rtA); renderer.render(qScene, qCam);
      }
      renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 0); renderer.toneMapping = prevTM;
    };
    return { plane, bake, dispose() { rtA.dispose(); rtB.dispose(); sil.dispose(); quad.geometry.dispose(); quad.material.dispose(); plane.geometry.dispose(); plane.material.dispose(); } };
  })();
  shadow.bake();

  /* ---- camera, controls ---- */
  const camera = new THREE.PerspectiveCamera(20, 2, 30, 6000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.09;
  controls.minPolarAngle = 0.03; controls.maxPolarAngle = Math.PI - 0.03;
  controls.zoomSpeed = 0.9; controls.screenSpacePanning = true;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.target.copy(centre);

  let W = 2, H = 2, cssScale = 1, disposed = false, raf = 0, viewName = null, labelMode = 'off';
  const viewCbs = [];
  const endOn = () => viewName === 'player' || viewName === 'bell';      // tags stand beside the instrument in these views, not above and below
  const insets = () => opt.insets || (labelMode === 'parts' && !endOn() ? { l: 14, r: 14, t: 62, b: 96 } : { l: 10, r: 10, t: 14, b: 40 });

  // where to stand (distance and aim point) so the whole instrument fills the free part of the container
  const tmpR = V3(), tmpU = V3(), tmpF = V3(), tmpV = V3();
  function frameFor(az, el) {
    const a = az * Math.PI / 180, e = el * Math.PI / 180;
    tmpF.set(-Math.sin(a) * Math.cos(e), -Math.sin(e), -Math.cos(a) * Math.cos(e));            // camera -> target
    tmpR.crossVectors(tmpF, AY).normalize(); tmpU.crossVectors(tmpR, tmpF).normalize();
    const ins = insets(), aw = Math.max(40, W - ins.l - ins.r), ah = Math.max(40, H - ins.t - ins.b);
    const th = Math.tan(camera.fov * Math.PI / 360) * (ah / H), tw = Math.tan(camera.fov * Math.PI / 360) * (aw / H);
    const target = centre.clone(); let dist = 1000;
    for (let it = 0; it < 6; it++) {
      let d = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of fitPts) {
        tmpV.subVectors(p, target); const px = tmpV.dot(tmpR), py = tmpV.dot(tmpU), pz = tmpV.dot(tmpF);
        d = Math.max(d, Math.abs(px) / tw - pz, Math.abs(py) / th - pz);
        const k = 1 / (dist + pz); x0 = Math.min(x0, px * k); x1 = Math.max(x1, px * k); y0 = Math.min(y0, py * k); y1 = Math.max(y1, py * k);
      }
      target.addScaledVector(tmpR, (x0 + x1) / 2 * dist).addScaledVector(tmpU, (y0 + y1) / 2 * dist);
      dist = d;
    }
    return { dist: dist * 1.03, target };
  }
  let photo = null;
  function applyOffset() {
    if (photo) { camera.setViewOffset(photo.full[0], photo.full[1], photo.crop[0], photo.crop[1], photo.crop[2], photo.crop[2] * H / W); return; }
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
  // drop whatever spin is left over from the last drag, so it cannot nudge the camera after a view change
  function settle() { controls.enableDamping = false; controls.update(); controls.enableDamping = true; }
  function goTo(az, el, dist, target, ms = 650) {
    settle(); readCamera();
    let daz = ((az - cur.az + 540) % 360) - 180;
    if (!ms) { cur.az = az; cur.el = el; cur.dist = dist; cur.target.copy(target); placeCamera(); controls.update(); camAnim = null; invalidate(); return; }
    camAnim = { t0: performance.now(), ms, az0: cur.az, daz, el0: cur.el, el1: el, d0: cur.dist, d1: dist, tg0: cur.target.clone(), tg1: target.clone() };
    invalidate();
  }
  function limits() {
    const f = frameFor(VIEWS.side.az, VIEWS.side.el);
    controls.minDistance = f.dist * 0.16; controls.maxDistance = f.dist * 2.4;
  }

  /* ---- valves, slides ---- */
  const valves = [0, 1, 2].map(i => ({ obj: T.obj('valve' + (i + 1) + '.moving'), mat: T.M['pearl' + (i + 1)], rim: T.M['rim' + (i + 1)], knurl: T.M['rimKnurl' + (i + 1)], dark: new THREE.Color(), body: T.M['case' + (i + 1)], metal: new THREE.Color(), x: 0, v: 0, to: 0, col: new THREE.Color(0xe7e2d8), colTo: new THREE.Color(0xe7e2d8), mix: 0, mixTo: 0 }));
  const PEARL = new THREE.Color(0xe7e2d8), NICK = new THREE.Color(NICKEL), KNURLC = new THREE.Color(KNURL), hsl = {};
  // the rim's shade: the same hue, a little richer and a good deal darker, so it frames the lit pearl
  const BRASSC = new THREE.Color(BRASS);
  let lastColor = null;                                                   // the last note's colour, for a slide pushed out with it
  // the brass's shade: the note's colour as polished metal (a touch paler, as brass is, so its highlights still sparkle)
  const metalOf = (c, out) => { c.getHSL(hsl, THREE.SRGBColorSpace); return out.setHSL(hsl.h, Math.min(1, hsl.s * 1.05), clamp(0.18 + hsl.l * 0.78, 0.45, 0.66), THREE.SRGBColorSpace); };
  const darkOf = (c, out) => { c.getHSL(hsl, THREE.SRGBColorSpace); return out.setHSL(hsl.h, Math.min(1, hsl.s * 1.1 + 0.05), clamp(hsl.l * 0.6, 0.16, 0.36), THREE.SRGBColorSpace); };
  const slides = { third: { obj: T.obj('slide3.moving'), x: 0, to: 0, len: D.s3.out, dir: 1, mat: T.M.slide3B, metal: new THREE.Color(), mix: 0, mixTo: 0 }, first: { obj: T.obj('slide1.moving'), x: 0, to: 0, len: D.s1.out, dir: -1 } };
  // the saddle rides on the 1st slide
  {
    const hooks = T.obj('hooks'), sad = hooks.children.find(m => m.name === 'hooks:nickel');
    if (sad) slides.first.obj.add(sad);
  }
  let lastT = 0, movedParts = false, lastFrame = 0, slow = 0, autoLow = false;
  function animate(now) {
    const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
    let busy = false;
    for (const v of valves) {
      // a quick sprung move: about 70 ms down, a little slower up, a touch of overshoot
      if (Math.abs(v.to - v.x) > 1e-4 || Math.abs(v.v) > 1e-3) {
        const w = v.to > 0.5 ? 62 : 46, z = 0.72;
        let t = dt; while (t > 0) { const h = Math.min(t, 0.004); v.v += (w * w * (v.to - v.x) - 2 * z * w * v.v) * h; v.x += v.v * h; t -= h; }
        if (Math.abs(v.to - v.x) < 5e-4 && Math.abs(v.v) < 0.02) { v.x = v.to; v.v = 0; }
        v.obj.position.y = -D.stroke * clamp(v.x, -0.03, 1.0); busy = true; movedParts = true;
      }
      if (Math.abs(v.mixTo - v.mix) > 1e-3) { v.mix += (v.mixTo - v.mix) * Math.min(1, dt * 22); if (Math.abs(v.mixTo - v.mix) < 0.004) v.mix = v.mixTo; busy = true; }
      v.mat.color.copy(PEARL).lerp(v.colTo, v.mix);
      v.mat.emissive.copy(v.colTo).multiplyScalar(0.55 * v.mix);                 // lit from inside a little, so it reads across a room
      v.mat.envMapIntensity = 0.62 * (1 - 0.72 * v.mix); v.mat.clearcoat = 0.7 * (1 - 0.55 * v.mix);
      v.mat.iridescence = 0.55 * (1 - v.mix); v.mat.sheen = 0.4 * (1 - v.mix);
      v.rim.color.copy(NICK).lerp(v.dark, v.mix); v.knurl.color.copy(KNURLC).lerp(v.dark, v.mix);
      v.rim.emissive.copy(v.dark).multiplyScalar(0.35 * v.mix); v.knurl.emissive.copy(v.dark).multiplyScalar(0.35 * v.mix);
      v.body.color.copy(BRASSC).lerp(v.metal, v.mix);
    }
    for (const s of Object.values(slides)) {
      if (Math.abs(s.to - s.x) > 1e-4) {
        s.x += (s.to - s.x) * Math.min(1, dt * 13); if (Math.abs(s.to - s.x) < 0.002) s.x = s.to;
        s.obj.position.x = s.dir * s.len * s.x; busy = true; movedParts = true;
      }
      if (s.mat) {
        if (Math.abs(s.mixTo - s.mix) > 1e-3) { s.mix += (s.mixTo - s.mix) * Math.min(1, dt * 22); if (Math.abs(s.mixTo - s.mix) < 0.004) s.mix = s.mixTo; busy = true; }
        s.mat.color.copy(BRASSC).lerp(s.metal, s.mix);
      }
    }
    if (camAnim) {
      const k = clamp((now - camAnim.t0) / camAnim.ms, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cur.az = camAnim.az0 + camAnim.daz * e; cur.el = camAnim.el0 + (camAnim.el1 - camAnim.el0) * e;
      cur.dist = camAnim.d0 + (camAnim.d1 - camAnim.d0) * e; cur.target.lerpVectors(camAnim.tg0, camAnim.tg1, e);
      placeCamera(); if (k >= 1) { camAnim = null; settle(); placeCamera(); } busy = true;
    }
    return busy;
  }

  /* ---- name tags ---- */
  const tags = [];
  const nums = [];
  function clearTags() { for (const t of tags) { t.el.remove(); t.line.remove(); t.dot.remove(); } tags.length = 0; for (const n of nums) n.el.remove(); nums.length = 0; }
  function buildTags() {
    clearTags();
    if (labelMode === 'parts') {
      for (const [text, pos, on, out, skip] of PARTS) {
        const el = document.createElement('div'); el.className = 'vt3d-tag'; el.textContent = text; over.appendChild(el);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'), dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', 2.4); svg.appendChild(line); svg.appendChild(dot);
        tags.push({ el, line, dot, skip, pos: V3(...pos), on: on ? T.obj(on) : null, out: out ? V3(...out).normalize() : null, w: 0, h: 0, side: 0, x: 0, y: 0, a: 1 });
      }
      for (const t of tags) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
    } else if (labelMode === 'fingers') {
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('div'); el.className = 'vt3d-num'; el.textContent = String(i + 1); over.appendChild(el);
        nums.push({ el, on: T.obj('valve' + (i + 1) + '.moving'), pos: V3(T.valveX[i], D.buttonTop + 1, 0) });
      }
    }
  }
  const pv = V3(), camDir = V3();
  function project(p, on) {
    pv.copy(p); if (on) pv.add(on.position);
    const beh = pv.clone().sub(camera.position).dot(camera.getWorldDirection(camDir)) < 0;
    pv.project(camera);
    return { x: (pv.x * 0.5 + 0.5) * W, y: (-pv.y * 0.5 + 0.5) * H, behind: beh };
  }
  // is a tag's anchor hidden behind a tube, seen from the camera? (the tubes as lines with a radius: quick enough for every frame)
  const eyeEnd = V3(), wAnchor = V3();
  function occluded(t) {
    wAnchor.copy(t.pos); if (t.on) wAnchor.add(t.on.position);
    eyeEnd.subVectors(wAnchor, camera.position); const len = eyeEnd.length(); if (len < 10) return false;
    eyeEnd.multiplyScalar((len - 4) / len).add(camera.position);
    for (const k of T.capsules) {
      if (k.id === t.skip || (t.on && k.id === t.on.name)) continue;
      const rr = k.r * 0.9; if (segSegDist2(camera.position, eyeEnd, k.a, k.b) < rr * rr) return true;
    }
    return false;
  }
  let columns = false;
  function layoutTags() {
    if (labelMode === 'fingers') {
      for (const n of nums) {
        const s = project(n.pos, n.on), up = project(n.pos.clone().add(V3(0, 14, 0)), n.on);
        // float the number a fixed distance "above" the button in whatever direction up is on screen
        let dx = up.x - s.x, dy = up.y - s.y; const l = Math.hypot(dx, dy);
        if (l < 4) { dx = 0; dy = -1; } else { dx /= l; dy /= l; }
        n.el.style.transform = `translate(${(s.x + dx * 24).toFixed(1)}px,${(s.y + dy * 24).toFixed(1)}px)`;
        n.el.style.opacity = s.behind ? 0 : 1;
      }
      return;
    }
    if (labelMode !== 'parts' || !tags.length) return;
    // anchors on screen
    let cy = 0, n = 0;
    for (const t of tags) {
      const s = project(t.pos, t.on); t.ax = s.x; t.ay = s.y;
      let a = s.behind ? 0 : 1;
      if (t.out) { pv.copy(camera.position).sub(t.pos).normalize(); a *= smooth(-0.25, 0.12, pv.dot(t.out)); }
      if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) a = 0;
      if (a > 0 && occluded(t)) a = 0;                              // behind a tube from here: no tag
      t.a = a;
    }
    const c = project(centre); cy = c.y;
    const vis = tags.filter(t => t.a > 0.01);
    // anchors bunched in a narrow part of the box (the end-on views): tags stand in a column either side of the
    // instrument; otherwise they go in rows above and below it
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
        let y = 8; for (const t of list) { t.y = Math.max(t.y, y); y = t.y + t.h + 5; }                       // no overlaps: push down from the top,
        y = H - 40; for (let k = list.length - 1; k >= 0; k--) { const t = list[k]; t.y = Math.min(t.y, y - t.h); y = t.y - 5; }   // then back up from the floor
        for (const t of list) { t.lx = col < 0 ? t.x + t.w : t.x; t.ly = t.y + t.h / 2; }
      }
    } else {
      // above or below the instrument: whichever side the anchor is on (with a little stickiness)
      for (const t of tags) { const d = t.ay - cy; if (!t.side) t.side = d < 0 ? -1 : 1; else if (d * t.side < -16) t.side = -t.side; }
      for (const side of [-1, 1]) {
        const row = vis.filter(t => t.side === side).sort((a, b) => a.ax - b.ax);
        if (!row.length) continue;
        // two tiers, alternating, so neighbours never collide
        const need = row.reduce((s, t) => s + t.w + 8, 0), tiers = need > W - 20 ? 2 : (row.length > 5 ? 2 : 1);
        const yBase = side < 0 ? 8 : H - 40;
        for (let tier = 0; tier < tiers; tier++) {
          const sub = row.filter((t, k) => k % tiers === tier);
          for (const t of sub) { t.x = clamp(t.ax - t.w / 2, 6, W - t.w - 6); t.y = side < 0 ? yBase + tier * (t.h + 6) : yBase - t.h - tier * (t.h + 6); }
          for (let pass = 0; pass < 8; pass++) {
            for (let k = 1; k < sub.length; k++) {
              const a = sub[k - 1], b = sub[k], ov = a.x + a.w + 8 - b.x;
              if (ov > 0) { a.x -= ov / 2; b.x += ov / 2; }
            }
            for (const t of sub) t.x = clamp(t.x, 6, W - t.w - 6);
          }
        }
      }
      for (const t of vis) { t.lx = clamp(t.ax, t.x + 8, t.x + t.w - 8); t.ly = t.side < 0 ? t.y + t.h : t.y; }
    }
    for (const t of tags) {
      t.el.style.transform = `translate(${t.x.toFixed(1)}px,${t.y.toFixed(1)}px)`; t.el.style.opacity = t.a.toFixed(2);
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
    // keep the aim point near the instrument so it cannot be lost
    const tg = controls.target;
    if (!box.containsPoint(tg)) { const c = box.clampPoint(tg, V3()), d = c.sub(tg); tg.add(d); camera.position.add(d); }
    const elev = Math.asin(clamp((camera.position.y - floorY) / camera.position.distanceTo(V3(tg.x, floorY, tg.z)), -1, 1));
    shadow.plane.material.uniforms.k.value = 0.34 * smooth(0.02, 0.22, elev);
    shadow.plane.visible = elev > 0.02;
    const envAz = Math.atan2(camera.position.x - tg.x, camera.position.z - tg.z) * ENV_SIGN;   // the lights turn with the camera
    scene.environmentRotation.y = envAz;
    { const dx = camera.position.x - tg.x, dy = camera.position.y - tg.y, dz = camera.position.z - tg.z; tracer.aim(Math.atan2(dx, dz), Math.atan2(dy, Math.hypot(dx, dz))); }
    if (movedParts) { tracer.write(); movedParts = false; }
    renderer.render(scene, camera);
    if (shaderFailed && tracer.level !== 'plain') { tracer.set('plain'); again = true; }      // never leave the page without its trumpet
    // too slow to turn smoothly with the traced reflections (an old Chromebook): drop them, once
    if (again && !opt.shot && tracer.level === 'high') {
      const dtF = now - lastFrame;
      if (dtF < 400) { slow = dtF > 55 ? slow + 1 : Math.max(0, slow - 2); if (slow > 14) { tracer.set('low'); autoLow = true; } }
    }
    lastFrame = now;
    layoutTags();
    if (again) invalidate(); else lastT = 0;
  }
  controls.addEventListener('change', invalidate);
  controls.addEventListener('start', () => { camAnim = null; viewName = null; canvas.classList.add('vt3d-drag'); for (const cb of viewCbs) { try { cb(); } catch (e) { console.error(e); } } });
  controls.addEventListener('end', () => canvas.classList.remove('vt3d-drag'));

  // double-click / double-tap = back to the side view
  let lastTap = 0, lastTapX = 0, lastTapY = 0, downX = 0, downY = 0, downT = 0;
  const onDbl = e => { e.preventDefault(); api.resetView(); };
  const onDown = e => { downX = e.clientX; downY = e.clientY; downT = performance.now(); };
  const onUp = e => {
    if (e.pointerType !== 'touch') return;
    const now = performance.now();
    if (now - downT > 260 || Math.hypot(e.clientX - downX, e.clientY - downY) > 12) return;
    if (now - lastTap < 330 && Math.hypot(e.clientX - lastTapX, e.clientY - lastTapY) < 40) { lastTap = 0; api.resetView(); }
    else { lastTap = now; lastTapX = e.clientX; lastTapY = e.clientY; }
  };
  const noMenu = e => e.preventDefault();
  canvas.addEventListener('dblclick', onDbl); canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('contextmenu', noMenu);
  const onLost = e => { e.preventDefault(); }, onRestored = () => { shadow.bake(); invalidate(); };
  canvas.addEventListener('webglcontextlost', onLost); canvas.addEventListener('webglcontextrestored', onRestored);

  function resize() {
    if (disposed) return;
    const w = Math.max(2, container.clientWidth), h = Math.max(2, container.clientHeight);
    const rect = container.getBoundingClientRect();
    cssScale = rect.width > 0 && w > 0 ? rect.width / w : 1;
    let pr = Math.min((window.devicePixelRatio || 1) * cssScale, 2.5);
    pr = Math.max(pr, 0.75);
    const mp = w * h * pr * pr; if (mp > 4e6) pr *= Math.sqrt(4e6 / mp);
    const changed = w !== W || h !== H;
    if (changed || Math.abs(pr - renderer.getPixelRatio()) > 0.01) { renderer.setPixelRatio(pr); renderer.setSize(w, h, false); }
    W = w; H = h;
    camera.aspect = photo ? photo.full[0] / photo.full[1] : w / h; applyOffset(); camera.updateProjectionMatrix();
    controls.rotateSpeed = 0.9 / cssScale; controls.panSpeed = 1 / cssScale;     // pointer travel is in screen px, the canvas in layout px
    limits();
    if (changed && viewName) { const v = VIEWS[viewName], f = frameFor(v.az, v.el); goTo(v.az, v.el, f.dist, f.target, 0); }
    if (tags.length) for (const t of tags) { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
    invalidate();
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
  if (ro) ro.observe(container);

  const api = {
    setValves(pressed, color) {
      const c = color ? new THREE.Color(color) : null;
      lastColor = c;
      valves.forEach((v, i) => {
        const on = !!(pressed && pressed[i]);
        v.to = on ? 1 : 0;
        if (on && c) { v.colTo.copy(c); darkOf(c, v.dark); metalOf(c, v.metal); v.mixTo = 1; } else v.mixTo = 0;
      });
      invalidate();
    },
    setSlides(s = {}) {
      if (s.third != null) {
        const t3 = slides.third, c = s.color ? new THREE.Color(s.color) : lastColor;   // a slide that goes out takes the note's colour (the one given, or the valves')
        t3.to = clamp(+s.third || 0, 0, 1);
        if (t3.to > 0 && c) { metalOf(c, t3.metal); t3.mixTo = 1; } else t3.mixTo = 0;
      }
      if (s.first != null) slides.first.to = clamp(+s.first || 0, 0, 1);
      invalidate();
    },
    setLabels(mode) {
      mode = mode === 'fingers' || mode === 'parts' ? mode : 'off';
      if (mode === labelMode) return;
      const was = labelMode; labelMode = mode; buildTags();
      if ((was === 'parts') !== (mode === 'parts')) {                 // name tags need room above and below
        applyOffset(); camera.updateProjectionMatrix();
        if (viewName) { const v = VIEWS[viewName], f = frameFor(v.az, v.el); goTo(v.az, v.el, f.dist, f.target, 350); }
      }
      invalidate();
    },
    setView(name, ms) {
      const v = VIEWS[name] || VIEWS.side; viewName = VIEWS[name] ? name : 'side';
      applyOffset(); camera.updateProjectionMatrix();
      const f = frameFor(v.az, v.el); goTo(v.az, v.el, f.dist, f.target, ms == null ? 650 : ms);
    },
    resetView() { api.setView('side'); },
    setCamera(az, el, dist, ms = 0) {                                 // for test pages: any direction; dist is a multiple of the fitted distance
      viewName = null; const f = frameFor(az, el); goTo(az, el, f.dist * (dist || 1), f.target, ms);
    },
    lookAt(x, y, z, az, el, dist, ms = 0) { viewName = null; goTo(az, el, dist, V3(x, y, z), ms); },
    photoCamera(p) {                                                  // for test pages: stand where a reference photo's camera stood
      photo = p; viewName = null; camAnim = null; camera.fov = p.fov; camera.position.set(...p.pos); controls.target.set(...p.target); camera.lookAt(controls.target);
      camera.aspect = p.full[0] / p.full[1]; applyOffset(); camera.updateProjectionMatrix(); controls.update(); invalidate();
    },
    // 'high' = the instrument mirrored in itself (traced in the shader), 'low' = studio reflections only
    setQuality(q) { tracer.set(q === 'low' ? 'low' : 'high'); slow = 0; invalidate(); },
    get quality() { return tracer.level; },
    setAutoRotate(on) { controls.autoRotate = !!on; controls.autoRotateSpeed = 1.6; invalidate(); },
    onViewChange(cb) { if (typeof cb === 'function') viewCbs.push(cb); return () => { const i = viewCbs.indexOf(cb); if (i >= 0) viewCbs.splice(i, 1); }; },
    resize,
    render: invalidate,
    tracer,                                                           // for test pages
    get view() { return viewName; },
    get labels() { return labelMode; },
    scene, camera, renderer, controls, trumpet: T.root, materials: T.M,
    info() { let tris = 0; for (const m of T.meshes) tris += m.geometry.index.count / 3; return { triangles: tris, meshes: T.meshes.length, calls: renderer.info.render.calls, pixelRatio: renderer.getPixelRatio(), size: [W, H], cssScale, reflections: tracer.level, reflectors: tracer.count, autoLow }; },
    dispose() {
      if (disposed) return; disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      canvas.removeEventListener('dblclick', onDbl); canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('contextmenu', noMenu);
      canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored);
      controls.dispose(); clearTags(); shadow.dispose();
      for (const m of T.meshes) m.geometry.dispose();
      for (const m of Object.values(T.M)) m.dispose();
      envRT.dispose(); tracer.dispose(); renderer.dispose();
      canvas.remove(); over.remove(); container.classList.remove('vt3d-root');
      viewCbs.length = 0;
    },
  };

  resize();
  labelMode = 'off'; api.setLabels(opt.labels);
  { const v = VIEWS[opt.view] ? opt.view : 'side'; viewName = v; applyOffset(); camera.updateProjectionMatrix(); const f = frameFor(VIEWS[v].az, VIEWS[v].el); goTo(VIEWS[v].az, VIEWS[v].el, f.dist, f.target, 0); }
  invalidate();
  return api;
}

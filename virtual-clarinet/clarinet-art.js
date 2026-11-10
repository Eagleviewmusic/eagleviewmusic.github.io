/*
 * clarinet-art.js: the drawing of a Boehm B♭ clarinet (17 keys, 6 rings), seen from the front with the
 * mouthpiece up, the way fingering charts and catalogue photographs show it.
 *
 * Everything on the two joints is placed from straight-on photographs of a real instrument: the code below
 * uses the photographs' own pixel coordinates inside two group transforms (UPPER and LOWER), so a part
 * can be checked by laying the drawing over the picture. The rest of the instrument is in millimetres from
 * the tip of the mouthpiece, with x = 0 on the centre line.
 *
 * ClarinetArt.create(svg) draws it once and returns an object with:
 *   setKeys(keys, note)   keys: a Set of key ids (see KEY IDS below); note: { color, upperColor } or null
 *   setLabels(mode)       'keys' (no text) | 'fingers' | 'names'
 *   setView(mode)         'whole' | 'close'
 *
 * KEY IDS  T thumb ring · R register key · L1 L2 L3 R1 R2 R3 the finger holes · A G♯: A, Gs · Eb the left-hand sliver ·
 *          S1 S2 S3 S4 the side keys · BF the right-hand sliver · LE LF LFs LCs left little finger · RE RF RFs RGs right little finger
 */
(function (global) {
  'use strict';

  // ----- where things are -----
  const Y = {
    tip: 0, mpEnd: 71, barrelTop: 71, barrelEnd: 136,
    upperTop: 136, upperEnd: 326, lowerTop: 326, lowerEnd: 566, bellTop: 566, bellEnd: 672,
  };
  // Photo pixels -> millimetres
  const US = 8.2, UX = 348.5, UY = 228;      // upper joint: tube x 230–467, y 228–1786
  const LS = 7.19, LX = 283, LY = 75, LK = 0.0045;   // lower joint: its ring starts at y 75; the photo leans a little
  const uMM = (x, y) => [(x - UX) / US, Y.upperTop + (y - UY) / US];
  const lMM = (x, y) => [(x - LX - (y - LY) * LK) / LS, Y.lowerTop + (y - LY) / LS];
  const UPPER = `matrix(${1 / US} 0 0 ${1 / US} ${-UX / US} ${Y.upperTop - UY / US})`;
  const LOWER = `matrix(${1 / LS} 0 ${-LK / LS} ${1 / LS} ${(-LX + LK * LY) / LS} ${Y.lowerTop - LY / LS})`;

  // ----- small helpers -----
  const n = v => Math.round(v * 100) / 100;

  // A smooth path through a list of points; a point with a third value of 1 is a corner
  function smooth(pts, closed = true, tension = 0.5) {
    const N = pts.length;
    const at = i => closed ? pts[(i + N) % N] : pts[Math.max(0, Math.min(N - 1, i))];
    let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
    const segs = closed ? N : N - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const t1 = p1[2] ? 0 : tension / 3 * 2, t2 = p2[2] ? 0 : tension / 3 * 2;
      const c1 = [p1[0] + (p2[0] - p0[0]) * t1 / 2, p1[1] + (p2[1] - p0[1]) * t1 / 2];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t2 / 2, p2[1] - (p3[1] - p1[1]) * t2 / 2];
      d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  const poly = pts => 'M' + pts.map(p => `${n(p[0])} ${n(p[1])}`).join('L') + 'Z';

  // Repeatable random numbers, so the wood looks the same every time
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  // ----- shared paint -----
  // Polished plating in a studio photograph is not a soft rounded shine: it is a flat, nearly white surface broken by hard-edged
  // reflections of the dark wood. So the metal here is a bright base, thin edges, and hard dark shapes that follow each part.
  function stops(list) {
    return list.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('');
  }
  function lin(id, x1, y1, x2, y2, list) {
    return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(list)}</linearGradient>`;
  }
  function rad(id, cx, cy, r, list, fx, fy) {
    return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx !== undefined ? ` fx="${fx}" fy="${fy}"` : ''}>${stops(list)}</radialGradient>`;
  }

  const ROD = [[0, '#4f4d47'], [.08, '#9d9b93'], [.22, '#e9e8e3'], [.4, '#fbfbf9'], [.58, '#d5d4ce'], [.68, '#8b8a84'], [.74, '#3a3936'], [.8, '#6f6e68'], [.9, '#c9c8c2'], [1, '#5f5e58']];
  const ROD2 = [[0, '#5f5e58'], [.1, '#c9c8c2'], [.2, '#6f6e68'], [.26, '#3a3936'], [.32, '#8b8a84'], [.42, '#d5d4ce'], [.6, '#fbfbf9'], [.78, '#e9e8e3'], [.92, '#9d9b93'], [1, '#4f4d47']];
  const WOOD = [[0, '#060404'], [.05, '#0f0b0a'], [.18, '#1a1412'], [.34, '#241c19'], [.47, '#2c2320'], [.57, '#302623'], [.68, '#251d1a'], [.84, '#171110'], [.95, '#0e0a09'], [1, '#050303']];

  function defsMarkup() {
    return `<defs>
      ${lin('rodV', 0, 0, 1, 0, ROD)}
      ${lin('rodV2', 0, 0, 1, 0, ROD2)}
      ${lin('rodH', 0, 0, 0, 1, ROD)}
      ${lin('rodDim', 0, 0, 1, 0, [[0, '#2c2a26'], [.18, '#8d897c'], [.6, '#a39f92'], [.72, '#1b1a18'], [.84, '#6f6b60'], [1, '#2c2a26']])}
      ${lin('sv', 0, 0, 1, 1, [[0, '#f4f4f1'], [.3, '#e6e5e1'], [.62, '#d6d5d0'], [1, '#c4c3bd']])}
            ${lin('plateL', 0, 0, 1, 0, [[0, '#8d8c86'], [.3, '#c6c5bf'], [1, '#dcdbd6']])}
      ${lin('plateR', 0, 0, 1, 0, [[0, '#f4f4f1'], [.6, '#dfdeda'], [1, '#9d9c96']])}
      ${lin('warmIn', 0, 0, 1, 0, [[0, '#dedcd4'], [.5, '#bdb8a8'], [1, '#8f8a78']])}
      ${lin('warmLever', 0, 0, 1, 0, [[0, '#2c2c2c'], [.3, '#77766f'], [.55, '#bdbcb6'], [.8, '#6f6e68'], [1, '#2c2c2c']])}
      ${lin('wood', 0, 0, 1, 0, WOOD)}
      ${lin('woodSheen', 0, 0, 1, 0, [[0, '#fff', 0], [.16, '#fff', .012], [.34, '#fff', .06], [.5, '#fff', .1], [.62, '#fff', .085], [.76, '#fff', .03], [.9, '#fff', 0], [1, '#fff', 0]])}
      ${lin('collarA', 0, 0, 1, 0, [[0, '#5f5e58'], [.05, '#b9b8b2'], [.16, '#f4f4f1'], [.34, '#e6e5e1'], [.4, '#6f6e68'], [.45, '#2c2d32'], [.51, '#55544e'], [.57, '#f1f1ee'], [.72, '#dcdbd6'], [.8, '#c6c5bf'], [.88, '#e9e8e4'], [.95, '#a9a8a2'], [1, '#5a5953']])}
      ${lin('collarB', 0, 0, 1, 0, [[0, '#5f5e58'], [.06, '#c3c2bc'], [.2, '#f6f6f3'], [.33, '#dfdeda'], [.38, '#85847e'], [.41, '#55544e'], [.45, '#c3c2bc'], [.55, '#f8f8f6'], [.8, '#e9e8e4'], [.94, '#b0afa9'], [1, '#5a5953']])}
      ${lin('collarC', 0, 0, 1, 0, [[0, '#5f5e58'], [.07, '#c0bfb9'], [.24, '#f4f4f1'], [.44, '#e2e1dd'], [.5, '#6f6e68'], [.55, '#33343a'], [.6, '#85847e'], [.67, '#f4f4f1'], [.82, '#dcdbd6'], [.9, '#e6e5e1'], [.96, '#a6a59f'], [1, '#5a5953']])}
      ${lin('collarG', 0, 0, 1, 0, [[0, '#2e2c28'], [.2, '#7d786b'], [.5, '#9d998c'], [.8, '#6f6b60'], [1, '#2e2c28']])}
      ${lin('mpBody', 0, 0, 1, 0, [[0, '#030304'], [.1, '#121215'], [.27, '#1d1e22'], [.42, '#0c0c0e'], [.66, '#09090b'], [.84, '#17181b'], [.95, '#0a0a0c'], [1, '#030304']])}
      ${lin('mpSail', 0, 0, 0, 1, [[0, '#b9bac0', .9], [.5, '#85868c', .5], [1, '#3a3b40', .05]])}
      ${lin('ligature', 0, 0, 1, 0, [[0, '#55544e'], [.08, '#a9a8a2'], [.2, '#ebeae6'], [.5, '#e4e3df'], [.8, '#ebeae6'], [.93, '#a9a8a2'], [1, '#55544e']])}
      ${lin('ligV', 0, 0, 0, 1, [[0, '#fff', .75], [.04, '#fff', 0], [.94, '#000', 0], [1, '#000', .3]])}
      ${lin('reflDark', 0, 0, 0, 1, [[0, '#101216'], [.5, '#22252c'], [.85, '#4b4e56'], [1, '#6c6e74']])}
      ${rad('wedgeFill', 0, 0, 100, [[0, '#2c2e35'], [.55, '#4b4e56'], [1, '#6f7178']])}
      ${rad('ball', .4, .32, .82, [[0, '#ffffff'], [.3, '#ecebe7'], [.58, '#bfbeb8'], [.84, '#7b7a73'], [1, '#55544e']])}
      ${rad('domeFace', .55, .45, .72, [[0, '#f1f0ec'], [.6, '#dcdcd8'], [.9, '#bdbdb8'], [1, '#8f8e88']])}
      ${rad('softSh', .5, .5, .5, [[0, '#000', .8], [.74, '#000', .66], [.9, '#000', .24], [1, '#000', 0]])}
      ${lin('footMetal', 0, 0, 1, 1, [[0, '#e4e3de'], [.4, '#a9a8a2'], [.75, '#6f6e68'], [1, '#4f4e49']])}
      ${lin('ledge', 0, 0, 1, 1, [[0, '#2c2624'], [.5, '#191514'], [1, '#0d0b0b']])}
      ${rad('fingerShade', .5, .46, .56, [[0, '#fff', .16], [.55, '#fff', 0], [.82, '#000', .05], [1, '#000', .42]])}
      ${lin('ringMetal', 0, 0, 1, 1, [[0, '#fbfbf9'], [.45, '#ebeae6'], [.72, '#d8d7d2'], [1, '#b9b8b2']])}
      ${lin('armTop', 0, 0, 0, 1, [[0, '#a19e94'], [.12, '#f4f3ee'], [.46, '#fdffff'], [.5, '#6d6b64'], [.56, '#e3e1d9'], [.84, '#c0bdb3'], [1, '#7b786f']])}
      ${lin('gusset', 0, 0, 1, 0, [[0, '#e9e5da'], [.3, '#6f7078'], [.62, '#23252c'], [1, '#3b3e47']])}
      ${rad('cupFace', .5, .5, .5, [[0, '#f2f2ef'], [.7, '#dddcd7'], [.92, '#c3c2bc'], [1, '#9d9c96']])}
      ${rad('discFace', .42, .42, .7, [[0, '#f4f4f1'], [.45, '#d6d5d0'], [.8, '#b0afa9'], [1, '#85847e']])}
      ${lin('cupWall', 0, 0, 0, 1, [[0, '#55544e'], [.26, '#2c2c30'], [.42, '#8d8a7e'], [.5, '#e9e6da'], [.58, '#8d8a7e'], [.74, '#2c2c30'], [1, '#55544e']])}
      ${lin('cork', 0, 0, 1, 1, [[0, '#ab9068'], [.5, '#927652'], [1, '#6e563a']])}
      ${lin('shadeDown', 0, 0, 0, 1, [[0, '#000', .75], [.5, '#000', .35], [1, '#000', 0]])}
      <linearGradient id="noteFill" x1="0" y1="0" x2="1" y2="0"><stop id="nf0" offset="0" stop-color="#888"/><stop id="nf1" offset="1" stop-color="#888"/></linearGradient>
      <filter id="mpSoft" x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation=".22"/></filter>
      ${lin('edgeG', 0, 0, 1, 1, [[0, '#8d8c86'], [.45, '#77766f'], [1, '#3f3f3c']])}
      ${lin('edgeV', 0, 0, 1, 0, [[0, '#8d8c86'], [1, '#3f3f3c']])}
      ${lin('crescentG', 0, 0, 1, 0, [[0, '#8d8c86'], [.5, '#c9c8c2'], [1, '#ecebe6']])}
      ${lin('horizon', 0, 0, 0, 1, [[0, '#23252b'], [.5, '#30323a'], [.8, '#5c5e65', .8], [1, '#a9a8a2', .15]])}
      ${lin('ligStripe', 0, 0, 1, 0, [[0, '#e4e3df'], [.18, '#9aa0a8'], [.36, '#4c5563'], [.5, '#6b7683'], [.64, '#4c5563'], [.82, '#9aa0a8'], [1, '#e4e3df']])}
      ${lin('corkH', 0, 0, 1, 0, [[0, '#5e4a30'], [.3, '#b3946a'], [.7, '#a58558'], [1, '#5e4a30']])}
      ${lin('hookFace', 0, 0, 0, 1, [[0, '#55544e'], [.4, '#25252a'], [.72, '#77766f'], [.86, '#ecebe6'], [1, '#a9a8a2']])}
      <filter id="wobble" x="-20%" y="-5%" width="140%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".32 .14" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.3" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".12"/></filter>
      <filter id="sailSoft" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation=".5"/></filter>
      ${chromeFilter('chrome', 3.2, 5, 12)}
      ${chromeFilter('chromeFlat', 1.5, 2.6, 7)}
      <filter id="coneSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter>
      <filter id="feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".5"/></filter>
      <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1"/></filter>
      <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <filter id="blur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="shCrisp" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <filter id="shBroad" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="bellSoft" x="-40%" y="-10%" width="180%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
      <filter id="grainDark" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.6 .03" numOctaves="3" seed="7"/>
        <feColorMatrix values="0 0 0 0 .02  0 0 0 0 .012  0 0 0 0 .012  2.2 0 0 0 -1.02"/>
      </filter>
      <filter id="grainLight" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1 .022" numOctaves="2" seed="23"/>
        <feColorMatrix values="0 0 0 0 .3  0 0 0 0 .23  0 0 0 0 .2  0 .55 0 0 -.36"/>
      </filter>
      <clipPath id="tubeU"><rect x="230" y="0" width="237" height="2000"/></clipPath>
      <clipPath id="tubeL"><path d="M180 60L386 60L403 1810L178 1810Z"/></clipPath>
      <g id="ballSym">
        <circle r="20" fill="url(#ball)"/>
        <path d="M-16.2 8.4C-10.6 15.6 9.6 16.4 16.8 7.6C17.6 2 16.6 -5 13 -11C15.4 -3 13.6 4 9.6 7.4C3 11.4 -9.6 11.4 -16.2 8.4Z" fill="#23252b" opacity=".86"/>
        <path d="M-13.6 14C-7.6 18.8 7.6 18.8 13.8 13.6C7.6 16.4 -7.6 16.6 -13.6 14Z" fill="#f4f4f1" opacity=".85"/>
        <ellipse cx="-7.5" cy="-9" rx="4.2" ry="2.4" fill="#fff" transform="rotate(-28 -7.5 -9)"/>
        <circle r="19.6" fill="none" stroke="#55544e" stroke-width=".9"/>
      </g>
      ${wedgeSym('cw1', [[-62, -18], [70, 118]])}
      ${wedgeSym('cw2', [[-44, 40]])}
      ${wedgeSym('cw3', [[-30, 8]])}
    </defs>`;
  }

  // Polished plating: the shape's outline is turned into a rounded surface and lit from the upper left, and a curve then maps that light
  // to what a mirror shows. A face turned to the viewer is mid silver, one turned to the light goes white, and one turned away falls through
  // grey into a thin dark edge. So every key's edge changes from bright to dark along its length, by itself.
  // A lighting filter measures slopes in device pixels, so surfaceScale follows the drawing's size: see fitLighting.
  function chromeFilter(id, sigma, scale, domeScale) {
    const R = '.20 .16 .13 .12 .13 .16 .21 .29 .38 .47 .56 .64 .71 .76 .79 .80 .82 .87 .95 1 1';
    const B = '.23 .19 .16 .15 .16 .19 .24 .31 .40 .48 .56 .64 .70 .75 .78 .80 .82 .87 .94 1 1';
    // The rolled edge and the dome over the whole key are lit apart. The dome's height map is so gentle that its 8-bit steps show as contour
    // lines, so its light is blurred smooth before the two are multiplied (a flat face lights to .82 in each, so k1 = 1 / .82 keeps it at .82)
    return `<filter id="${id}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${sigma}" result="edge"/>
      <feDiffuseLighting class="lit" data-s="${scale}" in="edge" surfaceScale="${scale}" diffuseConstant="1" lighting-color="#fff" result="e0"><feDistantLight azimuth="232" elevation="55"/></feDiffuseLighting>
      <feGaussianBlur in="e0" stdDeviation="${n(sigma * .16)}" result="e"/>
      <feGaussianBlur in="SourceAlpha" stdDeviation="${n(sigma * 4.4)}" result="dome"/>
      <feDiffuseLighting class="lit" data-s="${domeScale}" in="dome" surfaceScale="${domeScale}" diffuseConstant="1" lighting-color="#fff" result="d0"><feDistantLight azimuth="232" elevation="55"/></feDiffuseLighting>
      <feGaussianBlur in="d0" stdDeviation="${n(sigma * 1.6)}" result="d"/>
      <feComposite in="e" in2="d" operator="arithmetic" k1="1.22" k2="0" k3="0" k4="0" result="l"/>
      <feComponentTransfer in="l" result="c"><feFuncR type="table" tableValues="${R}"/><feFuncG type="table" tableValues="${R}"/><feFuncB type="table" tableValues="${B}"/></feComponentTransfer>
      <feComposite in="c" in2="SourceAlpha" operator="in"/>
    </filter>`;
  }

  // A key cup is spun, so its dark reflections are wedges meeting at the centre, narrow there and wide at the edge
  function wedgeSym(id, list) {
    const P = (r, deg) => `${n(Math.cos(deg * Math.PI / 180) * r)} ${n(Math.sin(deg * Math.PI / 180) * r)}`;
    const paths = list.map(([a, b]) => {
      const d = b - a, big = d > 180 ? 1 : 0;
      return `<path class="wd" d="M0 0Q${P(58, a + d * .26)} ${P(100, a)}A100 100 0 ${big} 1 ${P(100, b)}Q${P(58, b - d * .26)} 0 0Z" fill="url(#wedgeFill)"/>`;
    }).join('');
    return `<g id="${id}"><g filter="url(#coneSoft)">${paths}</g></g>`;
  }

  // ----- shadows: every part leaves its outline here, and they are drawn once on the wood -----
  let SIL = [];
  let SILT = '';        // a transform the parts being drawn sit inside (the other clarinets borrow parts this way), so their shadows land with them
  let TUBE = 'tubeU';   // the tube a cup's own shadow falls on, so none falls on the page
  const silhouette = d => { SIL.push(SILT ? { d, t: SILT } : d); return d; };
  const rectPath = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
  const circlePath = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const ellipsePath = (x, y, rx, ry) => `M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
  function castShadow(paths, dx, dy, filter, opacity) {
    const plain = paths.filter(p => typeof p === 'string'), moved = paths.filter(p => typeof p !== 'string');
    return `<g transform="translate(${dx} ${dy})" filter="url(#${filter})" opacity="${opacity}"><path d="${plain.join('')}" fill="#000"/>${moved.map(p => `<path d="${p.d}" transform="${p.t}" fill="#000"/>`).join('')}</g>`;
  }

  // ----- building blocks, drawn in photo pixels -----
  let CID = 0;
  // A ball-topped post, seen from the side
  const ball = (x, y, r = 20) => {
    silhouette(circlePath(x, y, r));
    return `<use href="#ballSym" transform="translate(${x} ${y}) scale(${n(r / 20)})"/>`;
  };
  // The turned flange at the bottom of a post
  function footMark(x, y, rx, ry) {
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".9"/>
      <path d="M${n(x - rx * .78)} ${n(y - ry * .34)}A${rx} ${ry} 0 0 1 ${n(x + rx * .2)} ${n(y - ry * .84)}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".75"/>`;
  }
  const foot = (x, y, rx, ry) => { silhouette(ellipsePath(x, y, rx, ry)); return footMark(x, y, rx, ry); };
  // A post seen from the side: its foot on the wood, a flared neck, the ball at the end
  const post = (bx, by, r, fx, fy, rx, ry) => {
    silhouette(ellipsePath(fx, fy, rx, ry));
    const dir = bx > fx ? 1 : -1;
    const d = `M${fx} ${fy - ry * .62}C${fx + dir * rx} ${fy - ry * .42} ${bx - dir * r * .7} ${by - r * .55} ${bx} ${by - r * .55}L${bx} ${by + r * .55}C${bx - dir * r * .7} ${by + r * .55} ${fx + dir * rx} ${fy + ry * .42} ${fx} ${fy + ry * .62}Z`;
    return footMark(fx, fy, rx, ry) + `<path d="${d}" fill="url(#rodH)"/>` + ball(bx, by, r);
  };
  const neck = (x1, x2, y, h) => { silhouette(rectPath(x1, y - h / 2, x2 - x1, h)); return `<rect x="${x1}" y="${y - h / 2}" width="${x2 - x1}" height="${h}" fill="url(#rodH)"/>`; };
  // The plate a screw holds a spring or a post through
  const screwPlate = (x, y, rx, ry) => {
    silhouette(ellipsePath(x, y, rx, ry));
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#footMetal)" stroke="#55503f" stroke-width=".9"/>
     <ellipse cx="${x}" cy="${y}" rx="${n(rx * .5)}" ry="${n(ry * .5)}" fill="#7d7766" stroke="#3f3b2f" stroke-width=".8"/>
     <path d="M${n(x - rx * .34)} ${n(y + ry * .3)}L${n(x + rx * .34)} ${n(y - ry * .3)}" stroke="#17181b" stroke-width="1.7"/>`;
  };
  const rodV = (x, w, y1, y2, cls = 'rv', paint = 'rodV') => { silhouette(rectPath(x, y1, w, y2 - y1)); return `<rect class="${cls}" x="${x}" y="${y1}" width="${w}" height="${y2 - y1}" fill="url(#${paint})"/>`; };
  // Where one hinge tube ends and the next begins: a fine gap across the rod
  const rodBreak = (x, w, y) => `<rect x="${x - .5}" y="${y}" width="${w + 1}" height="1.8" fill="#17181b"/><rect x="${x}" y="${y + 1.8}" width="${w}" height="1" fill="#fff" opacity=".8"/>`;
  // The short thicker tube of a hinge that carries an arm
  const sleeve = (x, w, y1, y2) => { silhouette(rectPath(x - 2.5, y1, w + 5, y2 - y1)); return `<rect x="${x - 2.5}" y="${y1}" width="${w + 5}" height="${y2 - y1}" fill="url(#rodV)"/><rect x="${x - 2.5}" y="${y1}" width="${w + 5}" height="1.5" fill="#17181b"/><rect x="${x - 2.5}" y="${y2 - 1.5}" width="${w + 5}" height="1.5" fill="#17181b"/>`; };

  // A flat arm with a pointed end, faceted along its length. cupId: the cup it moves, so it can take the note's colour with the cup
  function spear(pts, ridgeY1, ridgeX1, ridgeX2, ridgeY2, cupId) {
    const d = poly(pts);
    silhouette(d);
    const body = `<path class="arm" d="${d}" fill="url(#armTop)" stroke="#6f6b60" stroke-width=".9" stroke-linejoin="round"/><path class="tint" d="${d}" fill="url(#noteFill)"/>` +
      `<path class="ridge" d="M${ridgeX1} ${ridgeY1}L${ridgeX2} ${ridgeY2 === undefined ? ridgeY1 : ridgeY2}" stroke="#fff" stroke-width="1.1" opacity=".7"/>`;
    return cupId ? `<g class="carm" data-cup="${cupId}">${body}</g>` : body;
  }

  // A ring key around a tone hole, on its raised chimney: a thick bright ring, a dark ledge, and a smaller bore set off-centre
  function ringKey(id, cx, cy, R, r, hx, hy, hr, reflAt = 26) {
    silhouette(circlePath(cx, cy, R));
    const ring = `M${cx - R} ${cy}A${R} ${R} 0 1 1 ${cx + R} ${cy}A${R} ${R} 0 1 1 ${cx - R} ${cy}ZM${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
    const mid = (R + r) / 2;
    const pt = (rad, deg) => [cx + rad * Math.cos(deg * Math.PI / 180), cy + rad * Math.sin(deg * Math.PI / 180)];
    const halfW = (R - r) * .3, outer = [], inner = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, deg = reflAt + 70 * t, w = halfW * Math.sin(Math.PI * t);
      outer.push(pt(mid + w, deg));
      inner.unshift(pt(mid - w, deg));
    }
    const refl = smooth(outer.concat(inner), true, .4);
    const outer2 = [], inner2 = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, deg = reflAt + 172 + 46 * t, w = halfW * .55 * Math.sin(Math.PI * t);
      outer2.push(pt(mid + w, deg));
      inner2.unshift(pt(mid - w, deg));
    }
    const refl2 = smooth(outer2.concat(inner2), true, .4);
    const ledge = `M${cx - r - 1} ${cy}A${r + 1} ${r + 1} 0 1 1 ${cx + r + 1} ${cy}A${r + 1} ${r + 1} 0 1 1 ${cx - r - 1} ${cy}ZM${hx - hr} ${hy}A${hr} ${hr} 0 1 0 ${hx + hr} ${hy}A${hr} ${hr} 0 1 0 ${hx - hr} ${hy}Z`;
    return `<g class="ring" data-k="${id}">
      <path class="hole" fill-rule="evenodd" d="${ledge}" fill="url(#ledge)"/>
      <circle class="hole" cx="${hx}" cy="${hy}" r="${hr}" fill="#040304"/>
      <path class="hole" d="M${n(hx - hr * .7)} ${n(hy + hr * .72)}A${hr} ${hr} 0 0 0 ${n(hx + hr * .78)} ${n(hy + hr * .62)}A${n(hr * 1.2)} ${n(hr * 1.2)} 0 0 1 ${n(hx - hr * .7)} ${n(hy + hr * .72)}Z" fill="#33261f"/>
      <circle class="hole" cx="${hx}" cy="${hy}" r="${n(hr + .6)}" fill="none" stroke="#3a2e29" stroke-width=".9" opacity=".7"/>
      <circle class="hole" cx="${cx}" cy="${cy}" r="${n(r - 2.2)}" fill="none" stroke="#4a403a" stroke-width="1" opacity=".55"/>
      <g class="finger"><circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="url(#noteFill)"/><circle cx="${cx}" cy="${cy}" r="${r + 1}" fill="url(#fingerShade)"/></g>
      <path class="rg" fill-rule="evenodd" d="${ring}" fill="url(#ringMetal)"/>
      <circle cx="${cx}" cy="${cy}" r="${n(R - .9)}" fill="none" stroke="#6f6e68" stroke-width="1.2" opacity=".5"/>
      <circle cx="${cx}" cy="${cy}" r="${n(r + 1.1)}" fill="none" stroke="#6f6e68" stroke-width="1" opacity=".4"/>
      <path class="rd" d="${refl}" fill="#2c2e35" opacity=".85" filter="url(#feather)"/>
      <path class="rd" d="${refl2}" fill="#55565c" opacity=".6"/>
      <path class="tint" fill-rule="evenodd" d="${ring}" fill="url(#noteFill)"/>
      <circle cx="${cx}" cy="${cy}" r="${n(mid - .4)}" fill="none" stroke="#fff" stroke-width="1.5" opacity=".85" stroke-dasharray="${n(mid * 2.4)} ${n(mid * 3.9)}" stroke-dashoffset="${n(mid * 3.4)}"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#55544e" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="${n(r + .4)}" fill="none" stroke="#17181b" stroke-width="1.2"/>
    </g>`;
  }

  // An arm that grows out of its ring: drawn before the ring, so the ring cuts it off cleanly. Its flare has a dark reflecting face
  function ringArm(id, tipX, tipY, topY, botY, cx, cy, R) {
    const ang = 38 * Math.PI / 180;
    const ex = n(cx - R * Math.cos(ang) + 2), ey1 = n(cy - R * Math.sin(ang)), ey2 = n(cy + R * Math.sin(ang));
    const sx = tipX + 14, mx = n(sx + (ex - sx) * .42);
    const d = `M${tipX} ${tipY}L${sx} ${topY}L${mx} ${topY}C${n(mx + (ex - mx) * .55)} ${topY} ${n(ex - 12)} ${n(ey1 + 12)} ${ex} ${ey1}L${n(ex + 6)} ${ey1}L${n(ex + 6)} ${ey2}L${ex} ${ey2}C${n(ex - 12)} ${n(ey2 - 12)} ${n(mx + (ex - mx) * .55)} ${botY} ${mx} ${botY}L${sx} ${botY}Z`;
    silhouette(d);
    const midY = (topY + botY) / 2;
    const g = `M${n(mx + 6)} ${midY}C${n(mx + (ex - mx) * .55)} ${n(midY - 2)} ${n(ex - 8)} ${n(ey1 + 12)} ${ex + 4} ${n(ey1 + 5)}L${ex + 4} ${n(ey2 - 5)}C${n(ex - 8)} ${n(ey2 - 12)} ${n(mx + (ex - mx) * .55)} ${n(midY + 2)} ${n(mx + 6)} ${midY}Z`;
    return `<g class="key" data-k="${id}"><path class="arm" d="${d}" fill="url(#armTop)" stroke="#6f6b60" stroke-width=".9" stroke-linejoin="round"/><path class="gs" d="${g}" fill="url(#gusset)"/><path class="tint" d="${d}" fill="url(#noteFill)"/><path d="M${tipX + 8} ${n(midY)}L${mx} ${n(midY)}" stroke="#fff" stroke-width="1.5" opacity=".8"/></g>`;
  }

  const shadow = (cx, cy, rx, ry) => `<ellipse class="sh" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#softSh)" clip-path="url(#${TUBE})"/>`;

  // A round cup seen from the front: a shallow cone, so its dark reflections meet at the centre, with a turned double rim
  function cup(id, cx, cy, r, wedges, rot) {
    const s = r / 100;
    return `<g class="cup" data-cup="${id}">
      <g class="up">${shadow(cx + 9, cy + 7, r + 15, r + 15)}
        <circle cx="${cx + 5}" cy="${cy + 3}" r="${r}" fill="#dcd8cd"/>
        <circle cx="${cx + 3}" cy="${cy + 2}" r="${r - .4}" fill="#121115"/>
      </g>
      <g class="down">${shadow(cx + 4, cy + 4, r + 7, r + 7)}</g>
      <g class="face">
        <circle class="cf" cx="${cx}" cy="${cy}" r="${r}" fill="url(#cupFace)"/>
        <g class="cwg" transform="translate(${cx} ${cy}) rotate(${rot}) scale(${n(s * .94)})"><use href="#${wedges}"/></g>
        <circle class="tint" cx="${cx}" cy="${cy}" r="${r}" fill="url(#noteFill)"/>
        <circle cx="${cx}" cy="${cy}" r="${n(r - 3.4)}" fill="none" stroke="#8d897d" stroke-width=".8"/>
        <circle cx="${cx}" cy="${cy}" r="${n(r - 1.7)}" fill="none" stroke="#fff" stroke-width="1.8"/>
        <circle cx="${cx}" cy="${cy}" r="${n(r - .3)}" fill="none" stroke="#6a665b" stroke-width="1"/>
      </g>
    </g>`;
  }

  // A cup on the curve of the tube, so seen at an angle: a nearly flat bright face, its wall mirroring dark and gold beside it, and the
  // pale edge of the pad beyond that. side: +1 the wall shows to the right of the face, -1 to the left
  function sideCup(id, cx, cy, rx, ry, side, wall, dimple) {
    const wx = cx + side * wall;
    const rimPath = `M${n(cx - side * rx * .8)} ${n(cy - ry * .6)}A${rx} ${ry} 0 0 ${side > 0 ? 0 : 1} ${n(cx - side * rx * .8)} ${n(cy + ry * .6)}`;
    return `<g class="cup side" data-cup="${id}">
      <g class="up">
        ${shadow(wx + side * 10, cy + 4, rx + 18, ry + 10)}
        <ellipse cx="${n(wx + side * 3.4)}" cy="${cy}" rx="${n(rx * .97)}" ry="${n(ry * .97)}" fill="#dedcd4"/>
        <ellipse cx="${n(wx + side * 1.8)}" cy="${cy}" rx="${n(rx * .98)}" ry="${n(ry * .98)}" fill="#1b1a1e"/>
        <ellipse cx="${wx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#cupWall)"/>
      </g>
      <g class="down">
        ${shadow(cx + side * 8, cy + 3, rx + 10, ry + 6)}
        <ellipse cx="${n(cx + side * wall * .66)}" cy="${cy}" rx="${n(rx * .97)}" ry="${n(ry * .97)}" fill="#e4e1d6" stroke="#55544e" stroke-width=".6"/>
        <ellipse cx="${n(cx + side * wall * .44)}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#cupWall)"/>
      </g>
      <g class="face">
        <ellipse class="cf" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#discFace)"/>
        <g class="cwg" opacity=".85" transform="translate(${cx} ${cy}) rotate(${side > 0 ? 8 : 172}) scale(${n(rx * .94 / 100)} ${n(ry * .94 / 100)})"><use href="#cw3"/></g>
        <ellipse class="tint" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#noteFill)"/>
        ${dimple ? `<ellipse cx="${n(cx - side * rx * .66)}" cy="${cy}" rx="${n(rx * .12)}" ry="${n(ry * .22)}" fill="#fff" opacity=".6"/>` : ''}
        <ellipse cx="${cx}" cy="${cy}" rx="${n(rx - .4)}" ry="${n(ry - .4)}" fill="none" stroke="#55544e" stroke-width="1"/>
        <path d="${rimPath}" fill="none" stroke="#fff" stroke-width="1.5" opacity=".85"/>
      </g>
    </g>`;
  }

  // A touch piece: a bright flat surface with a thin edge, a little shade just inside that edge, and its reflections on top
  function touch(id, d, reflections = '') {
    silhouette(d);
    const cid = `tc${++CID}`;
    const lights = (reflections.match(/<path class="rl"[^>]*\/>/g) || []).join('');
    const darks = reflections.replace(/<path class="rl"[^>]*\/>/g, '');
    return `<g class="key" data-k="${id}"><clipPath id="${cid}"><path d="${d}"/></clipPath>
      <path class="b" d="${d}" fill="#fff" filter="url(#chrome)"/>
      <g clip-path="url(#${cid})"><g filter="url(#feather)">${darks}</g></g>
      <path class="tint" d="${d}" fill="url(#noteFill)"/>
      <g clip-path="url(#${cid})">${lights}</g>
      <path d="${d}" fill="none" stroke="url(#edgeG)" stroke-width=".9" opacity=".62" stroke-linejoin="round"/></g>`;
  }
  // A reflection of the dark room: a crisp horizon along its upper edge, fading out toward the lower
  const flag = (pts, tension = .42) => `<path class="rd" d="${smooth(pts, true, tension)}" fill="url(#horizon)"/>`;
  // A shape that follows a curve, thinning to a point at each end
  const taper = (pts, w) => {
    const N = pts.length, up = [], dn = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const t = N > 1 ? i / (N - 1) : .5, half = w / 2 * Math.pow(Math.sin(Math.PI * t), .55);
      up.push([p[0] - dy / L * half, p[1] + dx / L * half]);
      dn.unshift([p[0] + dy / L * half, p[1] - dx / L * half]);
    });
    return smooth(up.concat(dn), true, .42);
  };
  const band = (pts, w, color = '#2c2e35', op = .88) => `<path class="rd" d="${taper(pts, w)}" fill="${color}" opacity="${op}"/>`;
  // A highlight: a thin bright sliver, not a drawn line
  const glint = (pts, w, op = .95, c = '#fff') => `<path class="rl" d="${taper(pts, w * 1.25)}" fill="${c}" opacity="${op}"/>`;
  const splash = (pts, op = .95) => `<path class="rl" d="${smooth(pts, true, .4)}" fill="#fff" opacity="${op}"/>`;

  // ----- the wood: dark, nearly even, with fine pores and a broad soft shine -----
  function grainLines(x1, x2, y1, y2, count, seed) {
    const r = rng(seed);
    let dark = '', light = '';
    for (let i = 0; i < count; i++) {
      const x = x1 + r() * (x2 - x1);
      const a = y1 + r() * (y2 - y1) * .9;
      const len = (y2 - y1) * (.015 + r() * r() * .16);
      const b = Math.min(y2, a + len);
      const seg = `M${n(x)} ${n(a)}L${n(x + (r() - .5) * .12)} ${n(b)}`;
      if (r() < .78) dark += seg; else light += seg;
    }
    return `<path d="${dark}" fill="none" stroke="#040303" stroke-width=".12" opacity=".36"/>` +
           `<path d="${light}" fill="none" stroke="#5e4f47" stroke-width=".08" opacity=".12"/>`;
  }
  function woodPart(id, d, x1, x2, y1, y2, seed, density = 1) {
    const count = Math.round((y2 - y1) * (x2 - x1) * .04 * density);
    return `<clipPath id="clip-${id}"><path d="${d}"/></clipPath>
      <path d="${d}" fill="url(#wood)"/>
      <g clip-path="url(#clip-${id})">
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" filter="url(#grainDark)" opacity=".8"/>
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" filter="url(#grainLight)" opacity=".7"/>
        ${grainLines(x1, x2, y1, y2, count, seed)}
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="url(#woodSheen)"/></g>`;
  }

  // A silver collar across the tube, wrapping round it, in turned steps: each band has its own width, with a groove between them
  function collar(y0, bands, paint = 'collarA', sag = 1.15) {
    const order = ['collarA', 'collarB', 'collarC'];
    let y = y0, out = '', i = order.indexOf(paint);
    const arc = (yy, hw) => `M${-hw} ${n(yy)}Q0 ${n(yy + sag * 2)} ${hw} ${n(yy)}`;
    bands.forEach(([h, hw, groove]) => {
      const y2 = y + h;
      const d = `M${-hw} ${n(y)}Q0 ${n(y + sag * 2)} ${hw} ${n(y)}L${hw} ${n(y2)}Q0 ${n(y2 + sag * 2)} ${-hw} ${n(y2)}Z`;
      out += `<path d="${d}" fill="url(#${groove ? 'collarG' : order[i++ % 3]})"/>`;
      if (!groove) {
        out += `<path d="${arc(y + .12, hw - .1)}" fill="none" stroke="#fff" stroke-width=".18" opacity=".9"/>`;
        out += `<path d="${arc(y2 - .08, hw - .1)}" fill="none" stroke="#57534a" stroke-width=".16" opacity=".8"/>`;
      }
      y = y2;
    });
    // A small shadow on the wood just below it
    const last = bands[bands.length - 1][1];
    out += `<path d="${arc(y + .32, last)}" fill="none" stroke="#000" stroke-width=".7" opacity=".55"/>`;
    return out;
  }

  // A small stamped emblem, in gold leaf
  function stamp(cx, cy, scale, line2) {
    const g = '#c4a04e';
    return `<g transform="translate(${cx} ${cy}) scale(${scale})" fill="${g}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif">
      <g fill="${g}">
        <path d="M0 -6.4C.5 -6.9 1.2 -7 1.6 -6.7L2.3 -6.4L1.6 -6.2C1.3 -5.9 1.1 -5.6 1 -5.1L.75 -3.4L0 -2.6L-.75 -3.4L-.95 -5.2C-.95 -5.8 -.6 -6.2 0 -6.4Z"/>
        <path d="M.75 -4.8C1.9 -6 3.9 -6.4 5.6 -6.4C4.9 -5.9 4.7 -5.6 4.4 -5.3C4.7 -5.3 4.9 -5.3 5.1 -5.3C4.5 -4.8 4.1 -4.5 3.7 -4.3C3.9 -4.2 4.1 -4.2 4.3 -4.2C3.5 -3.6 2.3 -3.2 1 -3.4Z"/>
        <path d="M-.75 -4.8C-1.9 -6 -3.9 -6.4 -5.6 -6.4C-4.9 -5.9 -4.7 -5.6 -4.4 -5.3C-4.7 -5.3 -4.9 -5.3 -5.1 -5.3C-4.5 -4.8 -4.1 -4.5 -3.7 -4.3C-3.9 -4.2 -4.1 -4.2 -4.3 -4.2C-3.5 -3.6 -2.3 -3.2 -1 -3.4Z"/>
      </g>
      <text x="0" y="-.2" font-size="2.15" font-weight="700" letter-spacing=".12">EAGLE VIEW</text>
      <text x="0" y="2.3" font-size="1.3" letter-spacing=".42">MUSIC</text>
      ${line2 ? `<text x="0" y="6.8" font-size="3" font-style="italic" font-weight="700">${line2}</text>` : ''}
    </g>`;
  }

  // ----- the wooden body -----
  const UPPER_WOOD = `M-14.45 ${Y.upperTop}L14.45 ${Y.upperTop}L14.45 ${Y.upperEnd + 4}L-14.45 ${Y.upperEnd + 4}Z`;
  const LOWER_WOOD = `M-14.3 ${Y.lowerTop}L14.3 ${Y.lowerTop}L15.65 ${Y.lowerEnd + 4}L-15.65 ${Y.lowerEnd + 4}Z`;
  function woodMarkup() {
    let out = '';
    // Barrel: narrower at the top, a belly below the middle, pinched to its lower ring
    const barrel = smooth([
      [-13.6, 74, 1], [-13.9, 86], [-14.7, 98], [-15.7, 110], [-16, 118], [-15.5, 125], [-14.9, 133, 1],
      [14.9, 133, 1], [15.5, 125], [16, 118], [15.7, 110], [14.7, 98], [13.9, 86], [13.6, 74, 1],
    ]);
    out += woodPart('barrel', barrel, -17, 17, 74, 134, 11, 1.1);
    out += woodPart('upper', UPPER_WOOD, -15, 15, Y.upperTop, Y.upperEnd + 4, 22);
    out += woodPart('lower', LOWER_WOOD, -16, 16, Y.lowerTop, Y.lowerEnd + 4, 33);
    // Bell, measured off the photograph: a slow flare that turns out sharply at the end into a rolled wooden lip. It has no metal ring
    const b = Y.bellTop;
    const half = [[5, 15.4], [22, 16], [40, 17], [58, 18.4], [71, 20.4], [78, 22.3], [86, 24.5], [90, 26.4], [93, 28.4], [96, 32], [98.4, 34.3], [100.4, 34.9], [102.2, 34.2], [103.8, 32.2]];
    const hwAt = y => {
      for (let i = 1; i < half.length; i++) if (y <= half[i][0]) {
        const t = (y - half[i - 1][0]) / (half[i][0] - half[i - 1][0]);
        return half[i - 1][1] + (half[i][1] - half[i - 1][1]) * t;
      }
      return half[half.length - 1][1];
    };
    const leftDown = half.map(([y, w], i) => i ? [-w, b + y] : [-w, b + y, 1]);
    const rightUp = half.map(([y, w], i) => i ? [w, b + y] : [w, b + y, 1]).reverse();
    const bell = smooth(leftDown.concat([[-22, b + 105.9], [0, b + 106.7], [22, b + 105.9]]).concat(rightUp), true, .42);
    out += `<clipPath id="clip-bell"><path d="${bell}"/></clipPath><path d="${bell}" fill="url(#wood)"/>`;
    const r = rng(44);
    let dark = '', light = '';
    for (let i = 0; i < 620; i++) {
      const u = (r() * 2 - 1) * .98, y0 = 5 + r() * 90, len = 2 + r() * r() * 20, m = y0 + len / 2, y1 = Math.min(99, y0 + len);
      const seg = `M${n(u * hwAt(y0))} ${n(b + y0)}Q${n(u * hwAt(m))} ${n(b + m)} ${n(u * hwAt(y1))} ${n(b + y1)}`;
      if (r() < .8) dark += seg; else light += seg;
    }
    out += `<g clip-path="url(#clip-bell)"><path d="${dark}" fill="none" stroke="#030202" stroke-width=".12" opacity=".4"/><path d="${light}" fill="none" stroke="#5e4f47" stroke-width=".08" opacity=".14"/>`;
    // Two broad satin lights, one each side of the middle, that follow the flare and fade where it turns out
    const sat = (u1, u2, y1, y2) => {
      const up = [], dn = [];
      for (let y = y1; y <= y2; y += 8) { up.push([u1 * hwAt(y), b + y]); dn.unshift([u2 * hwAt(y), b + y]); }
      return smooth(up.concat(dn), true, .4);
    };
    out += `<path d="${sat(-.68, -.3, 8, 90)}" fill="#c9c6d0" opacity=".11" filter="url(#bellSoft)"/><path d="${sat(.34, .7, 8, 90)}" fill="#d0c9c6" opacity=".09" filter="url(#bellSoft)"/>`;
    // The top of the lip catches the light at both sides
    out += `<path d="M${-hwAt(100)} ${b + 99.6}C-28 ${b + 96} -24 ${b + 93} -21 ${b + 88}C-23 ${b + 95} -24 ${b + 99} -18 ${b + 101.6}Z" fill="#b5a99c" opacity=".3" filter="url(#bellSoft)"/>`;
    out += `<path d="M${hwAt(100)} ${b + 99.6}C28 ${b + 96} 24 ${b + 93} 21 ${b + 88}C23 ${b + 95} 24 ${b + 99} 18 ${b + 101.6}Z" fill="#b5a99c" opacity=".26" filter="url(#bellSoft)"/>`;
    // The lip's edge, a fine dark line with a red-brown glint, and the underside rolling away below it
    const lipY = 100.5, lipSag = 2.6;
    out += `<path d="M${-hwAt(lipY)} ${b + lipY}Q0 ${b + lipY + lipSag * 2} ${hwAt(lipY)} ${b + lipY}" fill="none" stroke="#050303" stroke-width=".5"/>`;
    out += `<path d="M${-hwAt(lipY) * .8} ${b + lipY + 1.2}Q0 ${b + lipY + lipSag * 2 - .35} ${hwAt(lipY) * .8} ${b + lipY + 1.2}" fill="none" stroke="#6d4a44" stroke-width=".2" opacity=".6"/>`;
    out += `<path d="M${-hwAt(102.5)} ${b + 103}Q0 ${b + 109.6} ${hwAt(102.5)} ${b + 103}L${hwAt(102.5)} ${b + 108}L${-hwAt(102.5)} ${b + 108}Z" fill="#8d8a92" opacity=".14" filter="url(#bellSoft)"/></g>`;
    return out;
  }

  // ----- collars -----
  function collarsMarkup() {
    const b = Y.bellTop;
    let out = '';
    out += collar(Y.barrelTop, [[1.2, 14.2], [.3, 13.95, 1], [.9, 14.15], [.3, 13.95, 1], [3.7, 14.3]], 'collarB');   // top of the barrel
    out += collar(129.6, [[3.4, 15.35], [.3, 15.1, 1], [.9, 15.25], [.3, 15.1, 1], [1.5, 15.35]], 'collarC');          // bottom of the barrel
    out += collar(Y.lowerTop, [[3.4, 14.8], [.3, 14.55, 1], [.9, 14.9], [.3, 14.65, 1], [2.9, 15.05]], 'collarA');       // top of the lower joint
    out += collar(b, [[1.2, 16.05], [.3, 15.8, 1], [.9, 15.95], [.3, 15.8, 1], [3.9, 16.15]], 'collarB');               // top of the bell
    return out;
  }

  // ----- the mouthpiece and ligature -----
  function mouthpieceMarkup() {
    const outline = smooth([
      [-5.2, 1.4], [-3, .25], [0, 0], [3, .25], [5.2, 1.4], [6.5, 4.5], [8.4, 15], [10.4, 28], [12, 42], [13, 58], [13.5, 73, 1],
      [-13.5, 73, 1], [-13, 58], [-12, 42], [-10.4, 28], [-8.4, 15], [-6.5, 4.5],
    ]);
    let out = `<path d="${outline}" fill="url(#mpBody)"/><clipPath id="clip-mp"><path d="${outline}"/></clipPath>`;
    // The beak has no drawn edge: a broad soft sail of reflected light down its left side, and long streaks that follow the taper
    const sail = smooth([[-4.4, 2.2], [-2.2, 1.4], [-.6, 2.2], [.3, 10], [.4, 19], [-1, 27], [-3, 31.4], [-5, 26], [-6.5, 19], [-6.4, 10]]);
    out += `<g clip-path="url(#clip-mp)"><path d="${sail}" fill="url(#mpSail)" filter="url(#sailSoft)"/>
      <path d="${taper([[5, 4], [6.6, 14], [7.8, 26], [9, 37]], .7)}" fill="#fff" opacity=".2"/>
      <path d="${taper([[-7.4, 12], [-8.8, 24], [-10, 37]], .6)}" fill="#fff" opacity=".22"/>
      <path d="${taper([[-8.6, 40], [-9.6, 54], [-10.2, 73]], 1.2)}" fill="#fff" opacity=".2"/>
      <path d="${taper([[8, 40], [8.8, 56], [9.4, 73]], .7)}" fill="#fff" opacity=".1"/>
      <path d="${taper([[-4.6, 36], [-5, 50], [-5.4, 73]], .8)}" fill="#fff" opacity=".2"/>
    </g>`;
    out += `<path d="M-5 1.7C-2.6 .7 2.6 .7 5 1.7" fill="none" stroke="#9a9ba1" stroke-width=".22"/>`;
    // The ligature: two rails joined by a waist, an oval window in the middle and a notch at each side, so each rail ends in an ear
    const hwAt = y => 11.25 + (y - 28) * (12.95 - 11.25) / 30 + .55;
    const T = 37.6, R1 = 44.1, R2 = 55.7, D = 62.2, sag = .5;
    const earL = y => -hwAt(y) - 1.1, earR = y => hwAt(y) + .9;
    const waist = y => hwAt(y) - 1.5;
    const band2 = `M${n(earL(T))} ${T}Q0 ${T + sag * 2} ${n(earR(T))} ${T}L${n(earR(R1))} ${R1}L${n(waist(R1))} ${R1 + .5}Q${n(waist(50))} ${(R1 + R2) / 2} ${n(waist(R2))} ${R2 - .5}L${n(earR(R2))} ${R2}L${n(earR(D))} ${D}Q0 ${D + sag * 2} ${n(earL(D))} ${D}L${n(earL(R2))} ${R2}L${n(-waist(R2))} ${R2 - .5}Q${n(-waist(50))} ${(R1 + R2) / 2} ${n(-waist(R1))} ${R1 + .5}L${n(earL(R1))} ${R1}Z`;
    const win = smooth([[-7.6, 47.2], [-4.8, 45.5], [0, 45], [4.8, 45.5], [7.6, 47.2], [8.4, 50], [7.6, 52.9], [4.8, 54.6], [0, 55.1], [-4.8, 54.6], [-7.6, 52.9], [-8.4, 50]], true, .42);
    // Its shadow on the rubber below each rail, seen through the openings
    out += `<g clip-path="url(#clip-mp)"><path d="M-14 ${R1}H14V${R1 + 2}H-14Z" fill="#000" opacity=".6" filter="url(#mpSoft)"/><path d="M-14 ${D + .8}H14V${D + 2.2}H-14Z" fill="#000" opacity=".5" filter="url(#mpSoft)"/></g>`;
    // The thumbscrews: a neck through the ear and a silver dome
    const screw = y => {
      const e = earL(y);
      const dome = `M${n(e - 1)} ${n(y - 4)}C${n(e - 4.4)} ${n(y - 4.2)} ${n(e - 6)} ${n(y - 2.2)} ${n(e - 6)} ${y}C${n(e - 6)} ${n(y + 2.2)} ${n(e - 4.4)} ${n(y + 4.2)} ${n(e - 1)} ${n(y + 4)}C${n(e - 1.6)} ${n(y + 2)} ${n(e - 1.6)} ${n(y - 2)} ${n(e - 1)} ${n(y - 4)}Z`;
      let ridges = '';
      for (let i = -3; i <= 3; i++) ridges += `M${n(e - 1.1)} ${n(y + i * 1.05)}H${n(e - 2.1)}`;
      return `<path d="M${n(e + .4)} ${n(y - 2.2)}L${n(e - .8)} ${n(y - 1.6)}V${n(y + 1.6)}L${n(e + .4)} ${n(y + 2.2)}Z" fill="url(#rodH)" stroke="#55544e" stroke-width=".12"/>
        <path d="${dome}" fill="url(#ball)" stroke="#55544e" stroke-width=".14"/>
        <path d="${ridges}" stroke="#3a3936" stroke-width=".22"/>
        <path d="M${n(e - 2)} ${n(y + 2.4)}C${n(e - 3.8)} ${n(y + 2.4)} ${n(e - 5)} ${n(y + 1.2)} ${n(e - 5.3)} ${n(y - .2)}C${n(e - 4.4)} ${n(y + .8)} ${n(e - 3.2)} ${n(y + 1.5)} ${n(e - 2)} ${n(y + 1.5)}Z" fill="#77766f" opacity=".6"/>
        <ellipse cx="${n(e - 3.8)}" cy="${n(y - 1.7)}" rx="1" ry=".55" fill="#fff" transform="rotate(-30 ${n(e - 3.8)} ${n(y - 1.7)})"/>`;
    };
    out += screw(40.9) + screw(58.9);
    out += `<path d="${band2} ${win}" fill-rule="evenodd" fill="url(#ligature)"/>`;
    // One soft blue-grey reflection runs down the bend of the metal, broken by the window, with mottled edges
    const clipLig = `tc${++CID}`;
    out += `<clipPath id="${clipLig}"><path d="${band2} ${win}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${clipLig})"><rect x="-3.6" y="36" width="7.2" height="29" fill="url(#ligStripe)" filter="url(#wobble)"/></g>`;
    out += `<path d="${band2} ${win}" fill-rule="evenodd" fill="url(#ligV)"/>`;
    // Through the window: the rubber, its long light, the shadow the upper rail throws on it, and the thickness of the metal round the opening
    const clipWin = `tc${++CID}`;
    out += `<clipPath id="${clipWin}"><path d="${win}"/></clipPath><g clip-path="url(#${clipWin})">
      <path d="M-14 44.4H14V46.6Q0 47.6 -14 46.6Z" fill="#000" opacity=".7"/>
      <path d="M-5.6 44L-5.9 56L-4.6 56L-4.3 44Z" fill="#fff" opacity=".2"/>
    </g>`;
    out += `<path d="${win}" fill="none" stroke="#3a3833" stroke-width=".26"/>`;
    out += `<path d="M-7.6 52.9C-4.8 54.6 4.8 54.6 7.6 52.9C8.1 52.2 8.4 51 8.4 50C8.2 51.4 7.6 52.4 6.8 53C4 54.4 -4 54.4 -6.8 53C-7.2 52.8 -7.4 52.8 -7.6 52.9Z" fill="#fff" opacity=".85" transform="translate(0 .36)"/>`;
    // Edges: light along the top of each rail, dark under it
    const rail = (y, c, w, op) => `<path d="M${n(earL(y) + .3)} ${y}Q0 ${y + sag * 2} ${n(earR(y) - .3)} ${y}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`;
    out += rail(T + .35, '#fff', .3, .95) + rail(D - .3, '#4d4a43', .28, .8) + rail(R2 + .3, '#fff', .2, .55);
    out += `<path d="${band2}" fill="none" stroke="#55544e" stroke-width=".14"/>`;
    return out;
  }

  // ----- upper joint keywork, in the photograph's pixels -----

  // The long plate down the left of the joint that carries the side keys, with its low rounded shoulders
  const SIDE_PLATE = smooth([
    [200, 772, 1], [186, 774], [183, 830], [180, 880], [174, 930], [160, 960], [146, 992, 1], [160, 1025], [172, 1065], [177, 1110], [172, 1150], [160, 1185], [146, 1217, 1],
    [156, 1255], [164, 1300], [165, 1345], [159, 1380], [149, 1410, 1], [158, 1440], [163, 1472], [160, 1515], [150, 1565], [130, 1625], [111, 1697], [108, 1722, 1],
    [150, 1733, 1], [148, 1700], [158, 1672], [174, 1640], [183, 1600], [186, 1540], [197, 1450, 1],
  ], true, .34);
  const PLATE_SEAMS = [
    [[187, 972], [172, 981], [168, 993], [176, 1012], [192, 1042]],
    [[172, 1192], [162, 1208], [163, 1234], [171, 1258], [178, 1282]],
    [[186, 1372], [173, 1391], [168, 1405], [176, 1428], [184, 1447], [191, 1490], [188, 1530], [173, 1568], [150, 1597], [132, 1642], [116, 1682], [98, 1716]],
  ];

  function upperBackMarkup() {
    let out = '';
    // Trill key 1's cup, high on the left of the tube
    out += sideCup('T1', 214, 467, 21, 41, 1, 24);
    silhouette(ellipsePath(214, 467, 21, 41));
    // The arm from cup 1 down to its hinge knuckle: flat, tapered, nearly white, with one fine dark reflection along it
    const stem = 'M206 505L228 505L232 765L195 765Z';
    silhouette(stem);
    const sid = `tc${++CID}`;
    out += `<clipPath id="${sid}"><path d="${stem}"/></clipPath><path d="${stem}" fill="#fff" filter="url(#chrome)"/><g clip-path="url(#${sid})">
      ${band([[213, 504], [209, 620], [206, 700], [204, 768]], 3.2, '#17181c', .95)}
    </g><path d="${stem}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".6"/>`;
    // Below the knuckle the same key carries on as a hinge tube down to its post
    out += rodV(218, 14, 812, 948, 'rv', 'rodV2');
    // The second lever, behind the plate and darker, with a slit of daylight between them: it runs on down to side key 4
    const lever2 = smooth([[192, 1480, 1], [197, 1610], [191, 1644], [177, 1684], [167, 1718], [163, 1745, 1], [153, 1745, 1], [153, 1712], [161, 1680], [174, 1652], [184, 1625], [188, 1590], [189, 1530]], true, .42);
    silhouette(lever2);
    out += `<g class="key" data-k="S4"><path class="arm" d="${lever2}" fill="#fff" filter="url(#chrome)"/><path d="${lever2}" fill="#000" opacity=".22"/><path class="tint" d="${lever2}" fill="url(#noteFill)"/><path d="${lever2}" fill="none" stroke="#3f3f3c" stroke-width=".8" opacity=".7"/></g>`;
    // The long plate: flat polished metal, a hard dark reflection along each inner edge and into each bend, and a bright ridge along its crown
    silhouette(SIDE_PLATE);
    const cid = `tc${++CID}`;
    out += `<clipPath id="${cid}"><path d="${SIDE_PLATE}"/></clipPath><path class="plate" d="${SIDE_PLATE}" fill="#fff" filter="url(#chromeFlat)"/><g clip-path="url(#${cid})">`;
    PLATE_SEAMS.forEach(p => { out += band(p, 5, '#0f1115', .96); });
    out += band([[190, 820], [188, 880], [178, 940]], 4, '#0f1115', .95) + band([[188, 1056], [190, 1110], [188, 1160]], 4, '#0f1115', .95) + band([[188, 1288], [189, 1340], [186, 1374]], 4, '#0f1115', .95);
    out += band([[176, 1505], [177, 1545], [166, 1570]], 3.4, '#0f1115', .95) + band([[148, 1610], [134, 1652], [122, 1696]], 4.5, '#0f1115', .96);
    out += glint([[168, 800], [166, 880], [160, 930], [150, 980]], 3.4) + glint([[154, 1012], [164, 1060], [168, 1110], [162, 1160], [152, 1204]], 3.4);
    out += glint([[152, 1232], [158, 1290], [158, 1350], [152, 1396]], 3.4) + glint([[154, 1424], [156, 1490], [146, 1560], [126, 1630], [114, 1690]], 3.6);
    // The rods lying over it throw a thin shadow
    out += `<rect x="186" y="948" width="11" height="800" fill="#000" opacity=".3" filter="url(#blur2)"/>`;
    out += `</g><path d="${SIDE_PLATE}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".7" stroke-linejoin="round"/>`;
    return out;
  }

  function upperRodsMarkup() {
    let out = '';
    // The long hinge tubes, each ending where the next begins, and one fine needle spring beside them
    out += rodV(218, 11, 1000, 1755, 'rs', 'rodV2');
    out += rodV(195, 23, 950, 1745);
    [1012, 1147, 1206, 1306, 1352, 1431, 1476].forEach(y => { out += rodBreak(195, 23, y); });
    out += sleeve(195, 23, 972, 1012) + sleeve(195, 23, 1160, 1194) + sleeve(195, 23, 1314, 1348) + sleeve(195, 23, 1437, 1470);
    return out;
  }

  function upperPostsMarkup() {
    let out = '';
    out += post(208, 960, 22, 252, 960, 13, 21);
    out += foot(255, 1179, 12, 21);
    out += post(204, 1224, 20, 258, 1225, 10, 21);
    out += post(233, 1413, 16, 259, 1413, 9, 21);
    return out;
  }

  function upperKeysMarkup() {
    let out = '';

    // The knuckle where trill key 2 turns: a short barrel with a capped end, its cup hidden behind the tube
    silhouette(rectPath(183, 765, 69, 53));
    out += `<g class="cup" data-cup="T2">
      <g class="up">${shadow(232, 796, 30, 32)}</g>
      <g class="down">${shadow(228, 794, 28, 30)}</g>
      <g class="face">
        <rect x="189" y="765" width="63" height="53" rx="24" fill="url(#ball)" stroke="#6a665b" stroke-width=".9"/>
        <path d="M236 771C243 776 247 786 247 792C247 800 243 808 238 812C240 804 241 780 236 771Z" fill="#2c2e35" opacity=".8"/>
        <ellipse cx="206" cy="775" rx="11" ry="2.8" fill="#fff"/>
      </g>
    </g>`;

    // G♯ cup, at the left of the A key, seen a little from the side
    out += sideCup('Gs', 266, 845, 34, 42, 1, 20);
    silhouette(ellipsePath(266, 845, 34, 42));

    // A cup
    out += cup('A', 341.5, 759, 42.5, 'cw2', -96);
    silhouette(circlePath(341.5, 759, 42.5));
    // The hinge the A key turns on
    out += foot(299, 910, 19, 25) + foot(375, 910, 19, 25);
    out += neck(304, 372, 910, 22);
    out += `<rect x="308" y="899" width="3" height="22" fill="#1c1d21"/><rect x="365" y="899" width="3" height="22" fill="#1c1d21"/>`;
    out += ball(289, 910, 21) + ball(392, 910, 21);

    // The G cup behind the A touch: it closes with the thumb ring or the first finger's ring. Its arm runs under the touch
    out += cup('P', 351, 987, 37, 'cw3', 20);
    silhouette(circlePath(351, 987, 37));
    out += spear([[180, 993], [192, 982], [325, 981], [342, 992], [325, 1003], [192, 1003]], 991, 190, 325, undefined, 'P');

    // The A touch: arm from the cup, past a screw, into its paddle
    const Aout = smooth([
      [341.7, 763, 1], [356, 800, 1], [356, 925], [358, 945], [372, 985], [381, 1020], [382, 1045], [373, 1070], [358, 1085], [343, 1090],
      [325, 1085], [310, 1070], [301, 1045], [301, 1020], [310, 985], [322, 945], [328, 925], [328, 800, 1],
    ]);
    out += touch('A', Aout,
      band([[340, 950], [342, 996], [343, 1030], [339, 1056]], 7, '#23252b', .9) + band([[368, 1000], [372, 1034], [362, 1066]], 3, '#17181c', .7) +
      band([[341.8, 772], [341.8, 806]], 3.4) +
      band([[370, 1004], [373, 1040], [362, 1072]], 2.4, '#55524a', .7) +
      glint([[316, 1000], [310, 1024], [310, 1046], [318, 1066]], 3));
    out += `<circle cx="342.3" cy="822" r="14" fill="url(#rodH)" stroke="#6a665b" stroke-width=".9"/><circle cx="342.3" cy="822" r="10" fill="#a9a597"/><path d="M332.8 822L351.8 822" stroke="#26282d" stroke-width="1.6"/>`;

    // The G♯ key: hinge on its two posts at the right, an arm across to its cup, and the long paddle growing out of the arm's end
    silhouette(rectPath(412, 765, 28, 185));
    out += foot(398, 768, 11, 21) + foot(398, 952, 12, 21);
    out += touch('Gs', smooth([
      [441, 846, 1], [454, 846, 1], [463, 905], [483, 955], [503, 995], [516, 1035], [521, 1085], [517, 1135], [505, 1168], [490, 1177], [470, 1165], [455, 1140], [448, 1100], [449, 1050], [451, 1010], [450, 965], [445, 900],
    ]),
      band([[461, 936], [470, 985], [471, 1026], [464, 1066]], 9, '#23252b', .9) + band([[510, 1060], [510, 1110], [496, 1160]], 3, '#17181c', .7) +
      glint([[490, 985], [504, 1040], [509, 1090], [502, 1140]], 5, .9) +
      glint([[453, 1002], [452, 1060], [453, 1112]], 1.8, .8));
    out += `<g class="key" data-k="Gs">
      <rect class="rv" x="412" y="768" width="28" height="180" fill="url(#rodV)"/><rect class="tint" x="412" y="768" width="28" height="180" fill="url(#noteFill)"/>
      ${spear([[260, 845], [290, 835], [336, 831], [412, 832], [448, 836], [454, 846], [448, 856], [412, 857], [336, 857], [290, 855]], 843, 268, 448, 843)}
    </g>`;
    out += ball(423, 765, 18) + ball(423, 950, 19);

    // The E cup, between the first and second fingers: open until the second finger's ring closes it, or the right-hand rings through
    // the bridge. Its arm is on the second ring's hinge
    out += cup('Ev', 334, 1329, 42.5, 'cw2', -5);
    silhouette(circlePath(334, 1329, 42.5));
    out += spear([[176, 1330], [196, 1320], [290, 1322], [326, 1330], [295, 1340], [196, 1342]], 1329, 186, 318, undefined, 'Ev');

    // Rings: each arm grows out from under its ring
    out += ringArm('L1', 180, 1177, 1165, 1190, 340.5, 1175, 51);
    out += ringKey('L1', 340.5, 1175, 51, 38.5, 344, 1174, 22.5);
    out += ringArm('L2', 180, 1450, 1437, 1460, 329.2, 1447.5, 58.5);
    out += ringKey('L2', 329.2, 1447.5, 58.5, 44, 336, 1445, 27, 8);

    // Third finger: a plain hole in the wood, with no ring. Its far wall catches a little light
    out += `<g class="ring plain" data-k="L3">
      <circle class="hole" cx="361.7" cy="1639.3" r="33" fill="#060405"/>
      <path class="hole" d="M329.4 1644C333 1660 346 1672.6 362 1672.6C378 1672.6 391 1660 394.4 1644C390 1657 377 1666 362 1666C347 1666 334 1657 329.4 1644Z" fill="#3b2c26"/>
      <circle class="hole" cx="361.7" cy="1639.3" r="33" fill="none" stroke="#1b1412" stroke-width="1.4"/>
      <g class="finger"><circle cx="361.7" cy="1639.3" r="34" fill="url(#noteFill)"/><circle cx="361.7" cy="1639.3" r="34" fill="url(#fingerShade)"/></g>
    </g>`;

    // The E♭/B♭ key. Its pad is the small cup at the right edge of the tube, seen edge-on, between the second and third fingers
    out += foot(438, 1365, 11, 21) + foot(440, 1527, 11, 21);
    silhouette('M476 1424H494V1496H476Z');
    out += `<g class="cup edge" data-cup="Eb">
      <g class="up"><path d="M473 1428H476V1492H473Z" fill="#17181c" opacity=".8"/></g><g class="down"></g>
      <g class="face">
        <path d="M472 1426C474 1440 474 1480 472 1494L476 1496L476 1424Z" fill="#e4e1d6" stroke="#3f3f3c" stroke-width=".8"/>
        <path d="M476 1422C485 1423 491 1427 493 1436C495 1450 495 1470 493 1484C491 1493 485 1497 476 1498Z" fill="url(#rodV)" stroke="#55544e" stroke-width=".9"/>
      </g>
    </g>`;
    out += `<g class="key" data-k="Eb">${spear([[456, 1452], [478, 1453], [492, 1460], [478, 1467], [456, 1469]], 1460, 460, 488)}</g>`;
    const sliver = smooth([
      [303, 1555], [318, 1545], [357, 1530], [400, 1517], [428, 1503], [444, 1487], [451, 1465], [452, 1370, 1], [476, 1370, 1], [476, 1490, 1], [463, 1500], [448, 1512], [433, 1520], [395, 1540], [357, 1556], [317, 1563],
    ]);
    out += touch('Eb', sliver,
      band([[344, 1550], [376, 1540], [414, 1523]], 5, '#17181c', .9) +
      band([[461, 1378], [462, 1440], [458, 1492]], 4.2, '#17181c', .9) +
      glint([[318, 1553], [360, 1538], [402, 1524], [430, 1510], [446, 1496]], 5, .95));
    out += ball(465, 1363, 17) + ball(465, 1523, 17);

    // C♯/G♯ key for the left little finger: two flat faces come down from its hinge, turn along the bottom of the joint and widen to the touch
    out += foot(257, 1607, 10, 20);
    out += touch('LCs', smooth([
      [224, 1605, 1], [248, 1605, 1], [249, 1677], [253, 1700], [260, 1717], [280, 1733], [300, 1738], [340, 1738], [373, 1732], [405, 1718], [430, 1700], [455, 1692], [480, 1690], [500, 1696], [513, 1708], [514, 1726], [503, 1748], [485, 1762], [455, 1764], [420, 1756], [373, 1758], [323, 1765], [300, 1765], [280, 1762], [257, 1750], [237, 1727], [226, 1693],
    ]),
      band([[241, 1620], [241, 1690], [252, 1722], [278, 1746], [318, 1752]], 6, '#17181c', .9) +
      band([[330, 1751], [372, 1746], [414, 1740]], 3.4, '#17181c', .85) +
      band([[432, 1722], [462, 1712], [492, 1716]], 7, '#23252b', .85) +
      band([[499, 1748], [508, 1737], [512, 1724]], 2.6, '#55524a', .8) +
      glint([[230, 1612], [231, 1680], [240, 1716]], 2.4, .9));
    out += ball(234, 1607, 16);
    silhouette(rectPath(191, 1742, 76, 40));
    out += post(205, 1762, 20, 258, 1762, 9, 19);
    out += ball(237, 1762, 20);

    // The side keys, in a stepped arc, each a separate key with air round it: two mushroom buttons, each on its own block, and two spoons on their own stems
    const dome = (id, cx, cy, rx, ry, neckPath) => {
      silhouette(ellipsePath(cx, cy, rx, ry));
      return `<g class="key" data-k="${id}">
      ${neckPath ? `<path class="arm" d="${neckPath}" fill="#fff" filter="url(#chromeFlat)"/><path class="tint" d="${neckPath}" fill="url(#noteFill)"/>` : ''}
      <ellipse class="b" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" filter="url(#chrome)"/>
      <path class="rd" d="M${n(cx + rx * .7)} ${n(cy - ry * .3)}C${n(cx + rx * .78)} ${n(cy - ry * .1)} ${n(cx + rx * .78)} ${n(cy + ry * .1)} ${n(cx + rx * .7)} ${n(cy + ry * .3)}L${n(cx + rx * .62)} ${n(cy + ry * .24)}C${n(cx + rx * .68)} ${n(cy + ry * .1)} ${n(cx + rx * .68)} ${n(cy - ry * .1)} ${n(cx + rx * .62)} ${n(cy - ry * .24)}Z" fill="#2c2e35"/>
      <path class="rd" d="M${n(cx - rx * .3)} ${n(cy + ry * .88)}C${n(cx + rx * .2)} ${n(cy + ry * .96)} ${n(cx + rx * .62)} ${n(cy + ry * .72)} ${n(cx + rx * .8)} ${n(cy + ry * .48)}C${n(cx + rx * .6)} ${n(cy + ry * .62)} ${n(cx + rx * .1)} ${n(cy + ry * .8)} ${n(cx - rx * .3)} ${n(cy + ry * .88)}Z" fill="#2c2e35" opacity=".85"/>
      <path class="tint" d="${ellipsePath(cx, cy, rx, ry)}" fill="url(#noteFill)"/>
      <path d="M${n(cx + rx * .86)} ${n(cy - ry * .46)}C${n(cx + rx * .96)} ${n(cy - ry * .2)} ${n(cx + rx * .96)} ${n(cy + ry * .2)} ${n(cx + rx * .86)} ${n(cy + ry * .46)}" fill="none" stroke="#fff" stroke-width="1.6"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${n(rx - .4)}" ry="${n(ry - .4)}" fill="none" stroke="url(#edgeG)" stroke-width="1"/></g>`;
    };
    // The plate's foot, with its square notch, then a second block below it, a dark line between them
    silhouette('M104 1722H150V1745H104Z'); silhouette('M110 1748H146L142 1790H114Z');
    const blockA = smooth([[106, 1722], [148, 1722], [151, 1730], [149, 1745], [106, 1745], [103, 1733]], true, .2);
    const blockB = smooth([[112, 1748], [144, 1748], [146, 1760], [142, 1790], [115, 1790], [110, 1760]], true, .2);
    out += `<path d="${blockA}" fill="#fff" filter="url(#chrome)"/><path d="${blockA}" fill="none" stroke="url(#edgeG)" stroke-width=".8" opacity=".6"/>
      <path d="M126 1745V1738H135V1745Z" fill="#17181c"/><path d="${blockB}" fill="#fff" filter="url(#chrome)"/><path d="${blockB}" fill="none" stroke="url(#edgeG)" stroke-width=".8" opacity=".6"/>
      <path d="M106 1746.5H146" stroke="#17181c" stroke-width="1.6"/>`;
    out += band([[132, 1752], [131, 1770], [130, 1788]], 3, '#17181c', .8);
    out += dome('S1', 72, 1720, 22, 30, 'M92 1711L106 1708L106 1732L92 1730Z') + dome('S2', 72, 1783, 24, 30, 'M92 1770L112 1752L115 1766L95 1786Z');
    // Side key 3 hangs from the second block on a slim neck
    out += touch('S3', smooth([[116, 1791, 1], [130, 1791, 1], [128, 1812], [135, 1830], [140, 1850], [135, 1868], [124, 1880], [111, 1876], [101, 1858], [99, 1838], [106, 1816]]),
      band([[136, 1838], [137, 1856], [130, 1872]], 2.6, '#17181c', .9) +
      glint([[116, 1824], [108, 1838], [108, 1856]], 3, .95));
    // Side key 4: the second lever carries on down past the blocks, clear of key 3, to a spoon with a thin cork along its right edge
    silhouette('M159 1908C166 1926 165 1942 158 1952L142 1958Z');
    out += `<path d="M159 1908C166 1926 165 1942 158 1952C155 1956 150 1958 142 1958C150 1952 156 1934 159 1908Z" fill="url(#cork)"/>`;
    out += touch('S4', smooth([[153, 1745, 1], [163, 1745, 1], [162, 1820], [159, 1872], [161, 1902], [159, 1930], [149, 1950], [132, 1956], [117, 1946], [110, 1924], [114, 1902], [128, 1888], [143, 1876], [151, 1820]]),
      band([[157, 1752], [157, 1820], [153, 1872]], 2.8, '#17181c', .9) +
      band([[155, 1906], [155, 1928], [146, 1948]], 2.6, '#17181c', .9) +
      glint([[130, 1896], [121, 1910], [120, 1926], [126, 1940]], 3, .95));

    return out;
  }

  // The bridge lever over the joint, drawn after the lower joint so that it overlaps: a bright rim round a wide dark web, and a cork foot that rests on the lower tab
  function bridgeMarkup() {
    let out = '';
    const tongue = smooth([[196, 1778, 1], [226, 1778, 1], [222, 1800], [226, 1826], [228, 1852, 1], [203, 1852, 1], [200, 1826], [197, 1806]], true, .42);
    silhouette(tongue);
    const tid = `tc${++CID}`;
    out += `<g class="carm" data-cup="C"><clipPath id="${tid}"><path d="${tongue}"/></clipPath><path d="${tongue}" fill="#fff" filter="url(#chromeFlat)"/>
      <g clip-path="url(#${tid})"><path d="M208 1784L219 1784C216 1802 220 1826 222 1846L208 1846Z" fill="#15161b"/></g>
      <path class="tint" d="${tongue}" fill="url(#noteFill)"/><path d="${tongue}" fill="none" stroke="url(#edgeV)" stroke-width=".9" opacity=".7"/></g>`;
    out += `<rect x="204" y="1852" width="21" height="36" rx="4" fill="url(#corkH)"/><g fill="#4d3b24" opacity=".85"><ellipse cx="209" cy="1859" rx="1.3" ry=".8"/><ellipse cx="217" cy="1864" rx="1.8" ry=".9"/><ellipse cx="210" cy="1873" rx="1" ry=".7"/><ellipse cx="219" cy="1878" rx="1.2" ry=".8"/><ellipse cx="213" cy="1883" rx="1.2" ry=".7"/></g>`;
    return out;
  }

  // ----- lower joint keywork, in the photograph's pixels -----
  function lowerMarkup() {
    let out = '';

    // Top left: the lever that takes the upper joint's bridge, stepped out from the rod, with a strip of cork on its upper face
    const bridgeLo = smooth([[150, 152], [160, 148], [176, 148], [181, 153], [182, 186], [176, 197], [176, 245, 1], [163, 245, 1], [156, 232], [157, 200], [152, 180]], true, .36);
    silhouette(bridgeLo);
    out += `<g class="carm" data-cup="C"><path d="${bridgeLo}" fill="#fff" filter="url(#chromeFlat)"/><path class="tint" d="${bridgeLo}" fill="url(#noteFill)"/></g>`;
    out += band([[168, 158], [169, 192], [167, 238]], 4, '#15161b', .9);
    // The hinge rod down the left
    out += rodV(163, 24, 243, 738);
    [262, 372, 526, 566, 690].forEach(y => { out += rodBreak(163, 24, y); });
    out += sleeve(163, 24, 228, 252) + sleeve(163, 24, 336, 370) + sleeve(163, 24, 530, 564) + sleeve(163, 24, 695, 730);

    // Right of the tube: the long tubes and the left little finger's stems
    out += rodV(367, 12, 222, 845);
    silhouette(rectPath(380, 222, 17, 206));
    out += `<path d="M379 420L397 420L397 590L391 842L379 842Z" fill="url(#rodV2)"/>`;
    out += `<path d="M380 222H397V418C397 426 392 430 388.5 430C385 430 380 426 380 418Z" fill="url(#rodV2)"/>`;
    silhouette(rectPath(378, 426, 46, 416));
    // Below that the hinge rods run on side by side, each edged by the dark of the gap beside it
    out += `<path d="M409.2 600L410.5 842L408.5 842Z" fill="#17161a"/><path d="M396 600L395.5 842" fill="none" stroke="#17161a" stroke-width="1.2"/>`;
    
    // The left little finger's keys: each is one long lever, from its touch down past the two posts to its own arm low on the joint. The F/C key sits behind the other two
    out += touch('LF', smooth([[417, 84], [428, 72], [446, 65], [468, 64], [486, 74], [494, 96], [488, 116], [470, 124], [450, 123], [444, 116], [440, 104], [428, 95]]),
      band([[438, 108], [460, 118], [484, 112], [492, 96]], 8, '#17181c', .92) +
      glint([[448, 76], [464, 70], [478, 75], [484, 88]], 3) +
      splash([[452, 74], [462, 71], [464, 76], [454, 79]]));
    // The F♯/C♯ key at the right
    out += touch('LFs', smooth([[451, 150], [458, 138], [470, 133], [482, 139], [492, 160], [500, 200], [497, 232], [491, 250], [474, 303], [466, 345], [460, 380], [450, 440], [438, 510], [425, 590], [423.5, 700], [423.5, 870, 1], [410.5, 870, 1], [410.5, 700], [411, 590], [422, 530], [434, 460], [443, 400], [446, 340], [446, 300], [447, 240], [449, 190]]),
      band([[458, 200], [458, 270], [454, 345]], 8, '#23252b', .9) +
      band([[452, 340], [446, 410], [434, 490], [424, 560]], 4, '#0f1115', .95) +
      glint([[420, 560], [417, 640], [417, 760], [417, 868]], 8, .9) +
      band([[492, 214], [486, 246], [472, 300]], 3, '#17181c', .75) +
      glint([[474, 146], [486, 170], [490, 204], [484, 236]], 3) +
      splash([[468, 140], [476, 142], [480, 152], [472, 150]]));
    // A tight shadow where the E/B key lies over the others, and where the touches cross the collar
    out += `<path d="M444 96C450 130 450 220 450 300C450 340 440 410 432 460" fill="none" stroke="#000" stroke-width="5" opacity=".55" filter="url(#blur2)"/>`;
    out += `<path d="M376 86L388 82L388 152L376 152Z" fill="#000" opacity=".4" filter="url(#blur2)"/>`;
    // The E/B key in front, the long S
    out += touch('LE', smooth([[388, 94], [398, 84], [410, 79], [428, 82], [441, 92], [445, 130], [446, 220], [444, 300], [441, 345], [437, 400], [428, 460], [418, 530], [409, 590], [408.5, 700], [408.5, 848, 1], [395.5, 848, 1], [395.5, 700], [396, 590], [404, 530], [414, 470], [420, 420], [423, 370], [424, 330], [414, 264], [400, 226], [390, 190], [384, 150], [383, 115]]),
      band([[396, 150], [408, 200], [424, 250], [432, 300]], 10, '#23252b', .9) +
      band([[432, 296], [434, 350], [428, 410], [416, 480], [407, 550]], 5, '#0f1115', .95) +
      glint([[405, 548], [402, 640], [402, 760], [402, 846]], 8, .9) +
      band([[440, 150], [442, 230], [441, 300]], 3, '#17181c', .72) +
      glint([[416, 92], [430, 106], [436, 132], [436, 200]], 3.2) +
      splash([[410, 86], [420, 87], [424, 94], [414, 94]]));

    // Post stubs at the right of the stems
    const stub = (y, x0) => {
      silhouette(rectPath(x0, y - 16, 484 - x0, 32));
      return `<rect x="${x0}" y="${y - 12}" width="${464 - x0}" height="24" fill="url(#rodH)"/>
      <rect x="${x0 + 26}" y="${y - 17}" width="${464 - x0 - 26}" height="34" rx="3" fill="url(#rodH)"/>
      <path d="M462 ${y - 18}C478 ${y - 18} 484 ${y - 8} 484 ${y}C484 ${y + 8} 478 ${y + 18} 462 ${y + 18}Z" fill="url(#ball)" stroke="#6a665b" stroke-width=".8"/>
      <path d="M464 ${y + 10}C472 ${y + 11} 479 ${y + 7} 482 ${y + 3}C480 ${y + 10} 472 ${y + 15} 464 ${y + 14}Z" fill="#17181c"/>`;
    };
    out += stub(519, 432) + stub(571, 425);

    // The cup at the top of the joint: it closes with the first or second finger
    out += screwPlate(212, 263, 14, 15) + screwPlate(355, 257, 11, 18);
    out += post(175, 211, 19, 213, 213, 14, 16) + post(382, 209, 22, 351, 214, 9, 18);
    out += cup('C', 295.7, 236.7, 46, 'cw1', 0);
    silhouette(circlePath(295.7, 236.7, 46));
    out += spear([[152, 240], [168, 228], [235, 229], [293, 231], [240, 248], [168, 250]], 239, 164, 286, 233, 'C');

    // Rings for the right hand: each arm grows out from under its ring
    out += ringArm('R1', 152, 352, 343, 362, 293.7, 351.7, 56.5);
    out += ringKey('R1', 293.7, 351.7, 56.5, 44, 296, 351, 30, 40);
    out += ringArm('R2', 153, 547, 537, 557, 295.7, 545.7, 55.3);
    out += ringKey('R2', 295.7, 545.7, 55.3, 43, 297, 546, 28.5, 14);

    // The right-hand sliver between the second and third fingers: a slim rounded bar growing straight out of its own hinge tube on the rod
    out += screwPlate(198, 584, 8, 11) + screwPlate(198, 642, 9, 13);
    out += sleeve(163, 24, 596, 628);
    out += touch('BF', smooth([[186, 601, 1], [205, 603], [250, 612], [320, 624], [333, 627], [338, 633], [333, 640], [320, 642], [243, 632], [205, 626], [186, 624, 1]]),
      band([[268, 623], [296, 628], [324, 634]], 4, '#17181c', .92) +
      glint([[192, 611], [230, 615], [270, 621], [316, 629], [332, 632]], 9, .95));

    out += ringArm('R3', 153, 712, 703, 722, 295, 715, 61);
    out += ringKey('R3', 295, 715, 61, 47.5, 297, 714, 32.5, 50);
    out += post(178, 746, 19, 213, 749, 13, 18);

    // Behind the right little finger's keys: the F♯ key's stem runs down to its cup's arm, and the E and F keys' stems carry on past it as two bars, side by side
    silhouette(rectPath(262, 960, 16, 195)); silhouette(rectPath(289, 960, 27, 195)); silhouette(rectPath(343, 960, 15, 195)); silhouette(rectPath(367, 880, 24, 190));
    out += `<g class="key" data-k="RFs"><rect class="rv" x="262" y="962" width="16" height="193" fill="url(#rodV)"/><rect class="tint" x="262" y="962" width="16" height="193" fill="url(#noteFill)"/></g>`;
    out += `<rect x="343" y="960" width="15" height="195" fill="url(#rodV)"/><rect x="358" y="880" width="9" height="190" fill="#17161a"/><rect x="367" y="880" width="11" height="190" fill="url(#rodV2)"/><rect x="378" y="880" width="13" height="190" fill="url(#rodV)"/>`;
    // In the gap between the two front keys, the stems of the back keys show dark and warm
    silhouette('M196 862L340 880L342 925L196 900Z');
    out += `<g clip-path="url(#tubeL)"><path d="M196 866L340 878L344 928L196 902Z" fill="#000" opacity=".42" filter="url(#blur2)"/></g>`;
    out += `<g fill="url(#rodDim)"><rect x="262" y="870" width="16" height="44"/><rect x="289" y="872" width="11" height="48"/><rect x="303.4" y="872" width="12.6" height="50"/></g>`;
    // The low G♯ pad on the far right of the tube: it swings out when its key is pressed
    out += sideCup('RGs', 409, 953, 9, 46, -1, 6);
    silhouette(ellipsePath(409, 953, 9, 46));

    // Two balls behind the bars, where the F cup's arm crosses them
    out += foot(297, 1378, 25, 28) + foot(297, 1428, 25, 28) + foot(300, 1660, 23, 13);
    // The two long bars, from under the keys down the middle to the lowest cup, with a dark gap between them
    silhouette(rectPath(289, 962, 27, 714));
    out += `<g class="key" data-k="RF"><rect class="rv" x="289" y="962" width="11" height="714" fill="url(#rodV2)"/><rect class="tint" x="289" y="962" width="11" height="714" fill="url(#noteFill)"/></g>`;
    out += `<rect x="300" y="962" width="3.4" height="714" fill="#17181c"/>`;
    out += `<g class="key" data-k="RE"><rect class="rv" x="303.4" y="962" width="12.6" height="714" fill="url(#rodV)"/><rect class="tint" x="303.4" y="962" width="12.6" height="714" fill="url(#noteFill)"/></g>`;
    [1320, 1460].forEach(y => { out += rodBreak(289, 27, y); });
    out += `<rect x="258" y="962" width="103" height="64" fill="url(#shadeDown)"/>`;

    // The three low cups. These are open until the little fingers close them, so they stand up from the tube
    out += post(380, 1108, 20, 362, 1108, 7, 18);
    out += post(340, 1190, 20, 321, 1190, 7, 17);
    out += sideCup('Fs', 174, 1155, 31, 62, 1, 12, true);
    silhouette(ellipsePath(174, 1155, 31, 62));
    out += spear([[150, 1154], [205, 1148], [358, 1150], [366, 1158], [358, 1167], [205, 1163]], 1156, 170, 354, undefined, 'Fs');
    out += sideCup('F', 400, 1387, 23, 62, -1, 11, true);
    silhouette(ellipsePath(400, 1387, 23, 62));
    out += spear([[275, 1397], [292, 1388], [380, 1381], [421, 1386], [380, 1395], [292, 1405]], 1391, 290, 408, 1387, 'F');
    out += sideCup('E', 168, 1670, 34, 62, 1, 12, true);
    silhouette(ellipsePath(168, 1670, 34, 62));
    out += spear([[142, 1667], [205, 1668], [316, 1672], [327, 1683], [316, 1692], [205, 1682]], 1677, 170, 318, 1681, 'E');
    out += post(302, 1711, 24, 278, 1712, 7, 19);

    // Arms the little finger keys drive, at the right
    out += `<g class="key" data-k="LE">${spear([[350, 842], [417, 841], [423, 847], [417, 853], [350, 853]], 847, 354, 416)}<path d="M417 847L423 847L417 853Z" fill="#55544e" opacity=".8"/></g>`;
    out += `<g class="key" data-k="LFs">${spear([[352, 862], [438, 862], [445, 870], [438, 878], [352, 878]], 870, 356, 438)}<path d="M438 870L445 870L438 878Z" fill="#55544e" opacity=".8"/></g>`;
    out += `<g class="key" data-k="RGs">${spear([[353, 944], [404, 944], [410, 953], [404, 962], [353, 962]], 953, 357, 402)}</g>`;

    // The right little finger's four spoons, F♯ and E behind, G♯ and F in front. Each is traced from the photograph: nearly white, a hard
    // dark reflection across its inner half, a thin rim of light along the top, then a slim neck and a tight bend down to its stem
    out += touch('RFs', smooth([[88, 820], [94, 800], [123, 781], [163, 775], [197, 785], [224, 796], [250, 812], [252, 860, 1], [183, 855], [127, 849], [106, 840]]),
      flag([[166, 794], [196, 798], [230, 818], [202, 816], [178, 806]]) +
      band([[150, 828], [196, 834], [236, 844]], 2.4, '#17181c', .8) +
      glint([[96, 806], [122, 786], [163, 780], [197, 790], [224, 801]], 2));
    out += touch('RE', smooth([[49, 912], [58, 890], [88, 878], [140, 880], [177, 888], [230, 908], [230, 960, 1], [183, 958], [140, 955], [90, 947], [60, 933]]),
      flag([[138, 892], [172, 896], [208, 914], [178, 912], [152, 902]]) +
      band([[86, 924], [124, 932], [176, 938], [220, 946]], 2.4, '#17181c', .8) +
      glint([[54, 902], [88, 884], [140, 885], [176, 893], [194, 900]], 2));
    // Where one spoon lies across another: a dark line, and a tight shadow
    const onSpoons = `tc${++CID}`;
    out += `<clipPath id="${onSpoons}"><path d="M180 60L386 60L403 1810L178 1810Z"/><path d="${smooth([[88, 820], [94, 800], [123, 781], [163, 775], [197, 785], [224, 796], [250, 812], [252, 860, 1], [183, 855], [127, 849], [106, 840]])}"/><path d="${smooth([[49, 912], [58, 890], [88, 878], [140, 880], [177, 888], [230, 908], [230, 960, 1], [183, 958], [140, 955], [90, 947], [60, 933]])}"/></clipPath><g clip-path="url(#${onSpoons})">
      <path d="${smooth([[172, 833], [187, 809], [220, 804], [253, 811], [262, 830], [250, 866], [207, 873], [187, 864], [177, 851]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/>
      <path d="${smooth([[158, 923], [168, 903], [197, 894], [227, 896], [240, 920], [232, 962], [197, 963], [180, 956], [165, 943]])}" fill="#000" opacity=".6" transform="translate(-3 3)" filter="url(#blur2)"/></g>`;
    out += touch('RGs', smooth([
      [172, 828], [185, 806], [215, 798], [250, 800], [290, 810], [325, 822], [340, 835], [348, 855], [352, 880], [355, 905], [355, 960, 1], [339, 960, 1], [339, 925], [336, 905], [326, 888], [312, 878], [290, 872], [240, 868], [190, 858], [177, 845],
    ]),
      flag([[262, 812], [298, 822], [326, 842], [340, 876], [324, 854], [298, 836], [276, 824]]) +
      band([[218, 846], [262, 852], [304, 860]], 2.4, '#17181c', .8) +
      band([[336, 892], [345, 925], [347, 955]], 2.2, '#17181c', .8) +
      glint([[180, 816], [215, 803], [250, 805], [290, 815], [325, 827], [338, 840], [345, 858]], 2));
    out += touch('RF', smooth([
      [158, 917], [168, 899], [190, 890], [215, 890], [250, 893], [290, 905], [325, 918], [340, 930], [350, 948], [355, 965], [358, 1000], [358, 1082, 1], [340, 1082, 1], [338, 1040], [334, 1012], [326, 990], [312, 977], [290, 971], [240, 968], [200, 957], [175, 947], [161, 932],
    ]),
      flag([[254, 906], [292, 918], [320, 938], [336, 968], [318, 946], [292, 930], [268, 918]]) +
      band([[254, 948], [296, 952], [322, 964], [334, 988]], 2.4, '#17181c', .8) +
      band([[346, 996], [348, 1040], [349, 1078]], 2.4, '#17181c', .8) +
      glint([[164, 908], [190, 895], [215, 895], [250, 898], [290, 910], [325, 923], [338, 935], [347, 952]], 2));
    // Its stem turns into the arm at its hinge
    out += `<g class="key" data-k="RF">${spear([[340, 1072], [401, 1072], [407, 1081], [401, 1090], [340, 1090]], 1081, 346, 400)}</g>`;
    return out;
  }

  // ----- the back of the upper joint: thumb ring and register key -----
  function backMarkup() {
    // The whole upper joint from its top ring, and just enough of the lower joint for the thumb rest, ending in a clean round cut
    const endCut = 'M-14.75 364Q0 368.6 14.75 364';
    let out = woodPart('back', `M-14.45 133L14.45 133L14.45 331L-14.45 331Z`, -15, 15, 133, 331, 77);
    out += woodPart('back2', `M-14.4 330L14.4 330L14.75 364Q0 368.6 -14.75 364Z`, -15, 15, 330, 368, 78);
    out += `<path d="${endCut}" fill="none" stroke="#6d5f58" stroke-width=".5"/>`;
    out += collar(129.6, [[3.4, 15.35], [.3, 15.1, 1], [.9, 15.25], [.3, 15.1, 1], [1.5, 15.35]], 'collarC');
    out += collar(326, [[3.4, 14.8], [.3, 14.55, 1], [.9, 14.9], [.3, 14.65, 1], [2.9, 15.05]], 'collarB');
    // Thumb rest on the lower joint: a narrow base plate held by two screws in line, and a saddle curving out from it to carry the thumb
    const base = 'M-4 338Q0 337.2 4 338L4.4 349L-4.4 349Z';
    const hook = smooth([[-4.4, 347.6, 1], [4.4, 347.6, 1], [6.8, 350.6], [8.6, 354.8], [8, 357.6], [0, 359], [-8, 357.6], [-8.6, 354.8], [-6.8, 350.6]], true, .42);
    out += `<path d="${hook}" fill="#000" opacity=".8" transform="translate(.6 3)" filter="url(#mpSoft)"/>`;
    out += `<path d="${base}" fill="#000" opacity=".5" transform="translate(.7 .6)" filter="url(#mpSoft)"/>`;
    out += `<path d="${base}" fill="url(#plateR)" stroke="#55544e" stroke-width=".14"/>`;
    [341, 345.6].forEach((y, i) => { out += `<circle cx="0" cy="${y}" r="1.15" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><path d="M${i ? -.76 : -.66} ${y + (i ? .3 : -.38)}L${i ? .76 : .66} ${y - (i ? .3 : -.38)}" stroke="#16161a" stroke-width=".22"/>`; });
    out += `<path d="${hook}" fill="url(#hookFace)" stroke="#55544e" stroke-width=".14"/>`;
    out += `<path d="M-4.2 348Q0 347.2 4.2 348" fill="none" stroke="#fff" stroke-width=".26"/>`;
    // Register key: the pad at the top, a long arm, its hinge between two posts, and the thumb's paddle
    out += `<g class="cup" data-cup="R">
      <g class="up"><ellipse cx=".2" cy="156.6" rx="7.4" ry="7.4" fill="url(#softSh)"/><circle cx=".1" cy="156" r="5.5" fill="#e6e2d7"/><circle cx="-.2" cy="155.7" r="5.4" fill="#141317"/></g>
      <g class="down"><ellipse cx=".1" cy="156.2" rx="6.8" ry="6.8" fill="url(#softSh)"/><circle cx="-.3" cy="155.6" r="5.5" fill="#e6e2d7"/></g>
      <g class="face"><circle cx="-.6" cy="155.4" r="5.4" fill="url(#cupFace)"/>
        <g transform="translate(-.6 155.4) rotate(40) scale(.05)"><use href="#cw3"/></g>
        <circle cx="-.6" cy="155.4" r="4.9" fill="none" stroke="#fff" stroke-width=".22"/>
        <circle cx="-.6" cy="155.4" r="5.35" fill="none" stroke="#6a665b" stroke-width=".12"/></g></g>`;
    out += `<ellipse cx="8.4" cy="197" rx="3" ry="3.4" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/><circle cx="10" cy="197" r="2.6" fill="url(#ball)" stroke="#55544e" stroke-width=".1"/><ellipse cx="-3.6" cy="197" rx="1.6" ry="2.4" fill="url(#footMetal)" stroke="#3a3936" stroke-width=".1"/>`;
    const regKey = smooth([[-1.6, 159, 1], [.4, 159, 1], [.5, 201], [2.6, 212], [3.3, 222], [1.6, 229], [-.7, 230.4], [-3, 229], [-4.3, 222], [-3.2, 212], [-1.5, 201]]);
    out += `<g class="key" data-k="R">
      <path class="b" d="${regKey}" fill="url(#sv)" stroke="#6a665b" stroke-width=".14"/>
      <rect class="rh" x="-3.4" y="195.8" width="11.6" height="2.5" rx=".7" fill="url(#rodH)"/>
      <path class="rd" d="M-.9 204L-.1 204L.9 218C.7 223 -.3 225.4 -1.2 225.4C-1.9 222 -1.5 214 -.9 204Z" fill="#2c2e35"/>
      <path class="rd" d="M-.85 162L-.35 162L-.35 194L-.85 194Z" fill="#2c2e35" opacity=".85"/>
      <path class="tint" d="${regKey}" fill="url(#noteFill)"/><rect class="tint" x="-3.4" y="195.8" width="11.6" height="2.5" rx=".7" fill="url(#noteFill)"/>
      <ellipse cx="-2.3" cy="222" rx=".8" ry="3.6" fill="#fff"/></g>`;
    // Thumb ring: the arm runs to a hinge held by two posts, inside the tube's edge
    out += `<rect x="9.2" y="229" width="2.4" height="21" fill="url(#rodV)"/><circle cx="10.4" cy="228" r="2.3" fill="url(#ball)" stroke="#6a665b" stroke-width=".1"/><circle cx="10.4" cy="250.6" r="2.3" fill="url(#ball)" stroke="#6a665b" stroke-width=".1"/>`;
    out += `<g class="key" data-k="T"><path class="arm" d="M7.2 237.6L9.6 237.9L9.6 241.3L7.2 241.6Z" fill="url(#armTop)"/><path class="tint" d="M7.2 237.6L9.6 237.9L9.6 241.3L7.2 241.6Z" fill="url(#noteFill)"/></g>`;
    const tRing = 'M-7.7 239.5A7.7 7.7 0 1 1 7.7 239.5A7.7 7.7 0 1 1 -7.7 239.5ZM-5.9 239.5A5.9 5.9 0 1 0 5.9 239.5A5.9 5.9 0 1 0 -5.9 239.5Z';
    out += `<g class="ring" data-k="T">
      <circle class="hole" cx="0" cy="239.5" r="6.1" fill="url(#ledge)"/><circle class="hole" cx=".3" cy="239.3" r="3.5" fill="#040304"/>
      <g class="finger"><circle cx="0" cy="239.5" r="6.1" fill="url(#noteFill)"/><circle cx="0" cy="239.5" r="6.1" fill="url(#fingerShade)"/></g>
      <path class="rg" fill-rule="evenodd" d="${tRing}" fill="url(#ringMetal)"/>
      <path class="tint" fill-rule="evenodd" d="${tRing}" fill="url(#noteFill)"/>
      <circle cx="0" cy="239.5" r="7.7" fill="none" stroke="#6a665b" stroke-width=".14"/><circle cx="0" cy="239.5" r="5.95" fill="none" stroke="#17181b" stroke-width=".16"/>
    </g>`;
    return out;
  }

  // ----- the words beside the keys -----
  // Each: the key it belongs to, the finger's name and the key's name, the point on the key, and where the words sit.
  const P_U = (x, y) => uMM(x, y);
  const P_L = (x, y) => lMM(x, y);
  const LABELS = [
    // Left hand on the upper joint
    { k: 'R', f: 'L thumb', name: 'Register', at: [-4, 222], side: 'back', y: 205 },
    { k: 'T', f: 'L thumb', name: 'Thumb ring', at: [-7, 239.5], side: 'back', y: 239.5 },
    { k: 'rest', f: 'R thumb', name: 'Thumb rest', at: [-8, 347], side: 'back', y: 347 },
    { k: 'A', f: 'L1', name: 'A', at: P_U(341, 1040), side: 'R', y: 196 },
    { k: 'Gs', f: 'L1', name: 'G♯', at: P_U(496, 1060), side: 'R', y: 212 },
    { k: 'L1', f: 'L1', name: 'E', at: P_U(385, 1175), side: 'R', y: 228 },
    { k: 'L2', f: 'L2', name: 'D', at: P_U(385, 1447), side: 'R', y: 262 },
    { k: 'Eb', f: 'L2', name: 'E♭ / B♭', at: P_U(452, 1500), side: 'R', y: 280 },
    { k: 'L3', f: 'L3', name: 'C', at: P_U(392, 1639), side: 'R', y: 297 },
    { k: 'LCs', f: 'L4', name: 'C♯ / G♯', at: P_U(508, 1720), side: 'R', y: 313 },
    { k: 'LF', f: 'L4', name: 'F / C', at: P_L(490, 95), side: 'R', y: 329 },
    { k: 'LFs', f: 'L4', name: 'F♯ / C♯', at: P_L(500, 200), side: 'R', y: 345 },
    { k: 'LE', f: 'L4', name: 'E / B', at: P_L(432, 200), side: 'R', y: 361 },
    // Right hand
    { k: 'S1', f: 'R1', name: 'Side 1', at: P_U(62, 1720), side: 'L', y: 324 },
    { k: 'S2', f: 'R1', name: 'Side 2', at: P_U(60, 1783), side: 'L', y: 336 },
    { k: 'S3', f: 'R1', name: 'Side 3', at: P_U(96, 1846), side: 'L', y: 348 },
    { k: 'S4', f: 'R1', name: 'Side 4', at: P_U(100, 1908), side: 'L', y: 360 },
    { k: 'R1', f: 'R1', name: 'B♭', at: P_L(245, 352), side: 'L', y: 376 },
    { k: 'R2', f: 'R2', name: 'A', at: P_L(245, 546), side: 'L', y: 402 },
    { k: 'BF', f: 'R2', name: 'B / F♯', at: P_L(205, 610), side: 'L', y: 416 },
    { k: 'R3', f: 'R3', name: 'G', at: P_L(240, 715), side: 'L', y: 430 },
    { k: 'RFs', f: 'R4', name: 'F♯ / C♯', at: P_L(95, 815), side: 'L', y: 444 },
    { k: 'RE', f: 'R4', name: 'E / B', at: P_L(55, 910), side: 'L', y: 458 },
    { k: 'RGs', f: 'R4', name: 'G♯ / D♯', at: P_L(335, 838), side: 'R', y: 415 },
    { k: 'RF', f: 'R4', name: 'F / C', at: P_L(345, 940), side: 'R', y: 432 },
  ];

  function labelsMarkup(list = LABELS) {
    let out = '';
    list.forEach(l => {
      const [px, py] = l.at;
      out += `<g class="lab" data-k="${l.k}" data-fname="${l.f}" data-kname="${l.name}" data-side="${l.side}" data-ax="${n(px)}" data-ay="${n(py)}">
        <path class="lead" fill="none" stroke="#6b7280"/>
        <circle class="pt" cx="${n(px)}" cy="${n(py)}" fill="#6b7280"/>
        <text class="labt"></text></g>`;
    });
    return out;
  }

  // ----- the whole instrument -----
  const STYLE = `
    #clarinet .tint { display: none; mix-blend-mode: multiply; }
    #clarinet .key.on .tint, #clarinet .ring.on .tint, #clarinet .cup.on .tint, #clarinet .carm.on .tint, #clarinet .st2.on { display: inline; }
    #clarinet .finger { display: none; }
    #clarinet .ring.on .finger { display: inline; }
    #clarinet .ring.on .hole { display: none; }
    #clarinet .key.on .gs { opacity: .78; }
    #clarinet .cup.on .cwg { opacity: .35; }
    #clarinet .ring .tint { opacity: .42; }
    #clarinet .cup .up { display: none; }
    #clarinet .cup .down { display: inline; }
    #clarinet .cup.isopen .up { display: inline; }
    #clarinet .cup.isopen .down { display: none; }
    #clarinet .cup.edge.isopen .face { transform: translateX(6px); }
    #clarinet .labels { display: none; font-family: Arial, Helvetica, sans-serif; }
    #clarinet.show-labels .labels { display: inline; }
    #clarinet .lab { display: none; }
    #clarinet .lab.shown { display: inline; }
    #clarinet .labt { fill: #374151; font-weight: 700; }
    #clarinet .lab.down .labt { fill: #111827; }
  `;

  function sceneMarkup() {
    SILT = '';
    // Build the keywork first: each part leaves its outline behind for the shadows
    SIL = []; TUBE = 'tubeU';
    const upperKeys = upperBackMarkup() + upperRodsMarkup() + upperPostsMarkup() + upperKeysMarkup();
    const bridge = bridgeMarkup();
    const upperSil = SIL;
    SIL = []; TUBE = 'tubeL';
    const lowerKeys = lowerMarkup();
    const lowerSil = SIL;
    return `<style>${STYLE}</style>${defsMarkup()}
      <g id="cl-back" transform="translate(-100 0)">
        <text id="backCaption" x="0" y="139" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#374151">Back</text>
        ${backMarkup()}
      </g>
      <g id="cl-body">
        ${woodMarkup()}
        ${mouthpieceMarkup()}
        ${stamp(0, 103, .62)}
        ${stamp(2.2, 164, .78, 'B♭')}
        ${stamp(0, 600, .85)}
        <g clip-path="url(#clip-upper)"><g transform="${UPPER}">${castShadow(upperSil, 7, 9, 'shBroad', .55)}${castShadow(upperSil, 8, 4, 'shCrisp', .85)}</g></g>
        <g clip-path="url(#clip-lower)"><g transform="${LOWER}">${castShadow(lowerSil, 7, 9, 'shBroad', .55)}${castShadow(lowerSil, 8, 4, 'shCrisp', .85)}</g></g>
        ${collarsMarkup()}
        <g transform="${UPPER}">${upperKeys}</g>
        <g transform="${LOWER}">${lowerKeys}</g>
        <g transform="${UPPER}">${bridge}</g>
      </g>
      <g class="labels">${labelsMarkup()}</g>`;
  }

  // ----- what each key does to the cups -----
  function cupStates(keys) {
    const has = k => keys.has(k);
    const anyE = has('LE') || has('RE');
    const anyF = has('LF') || has('RF');
    const anyFs = has('LFs') || has('RFs');
    const rightRings = (has('R1') || has('R2')) && !has('BF');   // the B/F♯ sliver holds the C cup up
    return {
      // Closed until a key opens them
      opened: {
        A: has('A'), Gs: has('Gs') || has('A'), Eb: has('Eb') || has('S4'), T1: has('S1'), T2: has('S2'),
        R: has('R'), RGs: has('RGs'),
      },
      // Open until something closes them
      closed: {
        P: has('T') || has('L1'),
        C: rightRings,
        Ev: has('L2') || rightRings,                               // the bridge carries the right-hand rings up to this cup
        Fs: anyE || anyF || anyFs,
        F: anyE || anyF,
        E: anyE,
      },
    };
  }

  // ----- the clarinets this file can draw: the B♭ here, the E♭ and the bass in their own files (they borrow the parts above) -----
  const MODELS = {};
  function register(id, model) { MODELS[id] = model; }
  register('bb', {
    scene: sceneMarkup,
    cupStates,
    photoScale: US,                                   // photo pixels per millimetre where the keys are drawn: the lighting follows it
    views: { whole: [-112, -3, 224, 684], close: [-79, 122, 158, 334], closeTall: [-100, 122, 158, 334] },
    back: { whole: -100, close: -80, tallWhole: -84, tallClose: -80 },   // where the back section sits
    labelX: { R: 44, Rtall: 34, L: -44, back: -18 },  // where the words go: right of the tube, left of it, left of the back section
    captionY: 128,
  });

  function create(svg, modelId) {
    let model = MODELS[modelId] || MODELS.bb;
    let keyEls, ringEls, cupEls, labEls, stems, cupArms, nf0, nf1, backEl, lit;
    let current = new Set(), currentNote = null;

    function build() {
      svg.innerHTML = model.scene();
      keyEls = {}; ringEls = {}; cupEls = {}; labEls = [];
      svg.querySelectorAll('.key[data-k]').forEach(el => { (keyEls[el.dataset.k] = keyEls[el.dataset.k] || []).push(el); });
      svg.querySelectorAll('.ring[data-k]').forEach(el => { (ringEls[el.dataset.k] = ringEls[el.dataset.k] || []).push(el); });
      svg.querySelectorAll('.cup[data-cup]').forEach(el => { cupEls[el.dataset.cup] = el; });
      svg.querySelectorAll('.lab').forEach(el => labEls.push(el));
      stems = svg.querySelectorAll('.st2[data-sk]');
      cupArms = svg.querySelectorAll('.carm[data-cup]');
      nf0 = svg.querySelector('#nf0'); nf1 = svg.querySelector('#nf1');
      backEl = svg.querySelector('#cl-back');
      lit = svg.querySelectorAll('.lit');
    }
    build();

    function setKeys(keys, note) {
      keys = keys || new Set();
      current = keys;
      if (note) {
        currentNote = note;
        nf0.setAttribute('stop-color', note.color);
        nf1.setAttribute('stop-color', note.upperColor || note.color);
        svg.style.setProperty('--note-edge', note.edge || '#333');
      }
      Object.keys(keyEls).forEach(k => keyEls[k].forEach(el => el.classList.toggle('on', keys.has(k))));
      Object.keys(ringEls).forEach(k => ringEls[k].forEach(el => el.classList.toggle('on', keys.has(k))));
      stems.forEach(el => el.classList.toggle('on', keys.has(el.dataset.sk)));
      const { opened, closed } = model.cupStates(keys);
      Object.keys(cupEls).forEach(id => {
        const el = cupEls[id];
        if (id in opened) {
          el.classList.toggle('isopen', opened[id]);
          el.classList.remove('on');
        } else {
          el.classList.toggle('isopen', !closed[id]);
          el.classList.toggle('on', !!closed[id]);
        }
      });
      cupArms.forEach(el => el.classList.toggle('on', !!closed[el.dataset.cup]));
      labEls.forEach(el => el.classList.toggle('down', keys.has(el.dataset.k)));
      if (model.decorate) model.decorate(svg, keys);   // anything else a clarinet shows (the bass's half-hole)
    }

    let labelMode = 'keys', viewMode = 'whole';
    let backX = model.back.whole;   // where the back section sits: well clear of the words in the whole view, nearer in the close one
    let tall = false, closeNow = false;
    function placeBack(mode) {
      closeNow = mode === 'close';
      const b = model.back;
      backX = tall ? (closeNow ? b.tallClose : b.tallWhole) : (closeNow ? b.close : b.whole);
      if (backEl) backEl.setAttribute('transform', `translate(${backX} 0)`);
    }
    function setLabels(mode) {
      labelMode = mode;
      svg.classList.toggle('show-labels', mode !== 'keys');
      labEls.forEach(el => {
        const t = el.querySelector('text');
        const words = mode === 'fingers' ? el.dataset.fname : el.dataset.kname;
        t.innerHTML = words.replace(/♭/g, '<tspan dx="-.26em">♭</tspan>').replace(/♯/g, '<tspan dx="-.08em">♯</tspan>');
      });
      layoutLabels();
    }

    // Words stay the same size on the screen whatever the view: they spread out along each side of the instrument
    function layoutLabels() {
      const box = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      if (!box.width || !vb.width) return;
      const pxPerMM = Math.min(box.width / vb.width, box.height / vb.height);
      const font = 12 / pxPerMM, line = font * 1.32;
      const caption = svg.querySelector('#backCaption');
      if (caption) {
        caption.setAttribute('font-size', n(font * .95));
        caption.setAttribute('y', n(model.captionY - font * .4));
      }
      const sides = { R: [], L: [], back: [] };
      labEls.forEach(el => {
        const ay = Number(el.dataset.ay);
        const visible = labelMode !== 'keys' && ay > vb.y + font && ay < vb.y + vb.height - font
          && !(tall && closeNow && el.dataset.side === 'back');   // no room for those words there
        el.classList.toggle('shown', visible);
        if (visible) sides[el.dataset.side].push({ el, ax: Number(el.dataset.ax) + (el.dataset.side === 'back' ? backX : 0), ay });
      });
      const L = model.labelX;
      const X = { R: tall && closeNow ? L.Rtall : L.R, L: L.L, back: backX + L.back };
      Object.keys(sides).forEach(side => {
        const list = sides[side].sort((p, q) => p.ay - q.ay);
        // Spread out from where the keys are, keeping every line clear of the one above
        list.forEach((it, i) => { it.y = i ? Math.max(it.ay, list[i - 1].y + line) : it.ay; });
        const limit = vb.y + vb.height - font;
        if (list.length && list[list.length - 1].y > limit) {
          list[list.length - 1].y = limit;
          for (let i = list.length - 2; i >= 0; i--) list[i].y = Math.min(list[i].y, list[i + 1].y - line);
        }
        list.forEach(it => {
          const tx = X[side], sign = side === 'R' ? 1 : -1;
          const t = it.el.querySelector('text');
          t.setAttribute('x', tx);
          t.setAttribute('y', n(it.y + font * .36));
          t.setAttribute('font-size', n(font));
          t.setAttribute('text-anchor', side === 'R' ? 'start' : 'end');
          const lead = it.el.querySelector('.lead');
          lead.setAttribute('d', `M${it.ax} ${it.ay}L${n(tx - sign * font * .35)} ${n(it.y)}`);
          lead.setAttribute('stroke-width', n(.8 / pxPerMM));
          const pt = it.el.querySelector('.pt');
          pt.setAttribute('cx', it.ax);
          pt.setAttribute('r', n(1.3 / pxPerMM));
        });
      });
    }

    let viewNow = model.views.whole.slice(), anim = 0;
    function setView(mode, instant) {
      const V = model.views;
      const target = (tall && mode === 'close' ? V.closeTall : V[mode]) || V.whole;
      cancelAnimationFrame(anim);
      if (instant) {
        viewNow = target.slice();
        svg.setAttribute('viewBox', viewNow.join(' '));
        return;
      }
      const from = viewNow.slice(), t0 = performance.now(), dur = 260;
      const step = now => {
        const t = Math.min(1, (now - t0) / dur), e = t * t * (3 - 2 * t);
        viewNow = from.map((v, i) => v + (target[i] - v) * e);
        svg.setAttribute('viewBox', viewNow.map(v => v.toFixed(2)).join(' '));
        if (t < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }

    function fitLighting() {
      const box = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      if (box.width && vb.width) {
        const pxPerMM = Math.min(box.width / vb.width, box.height / vb.height) * (window.devicePixelRatio || 1);
        lit.forEach(el => el.setAttribute('surfaceScale', n(Number(el.dataset.s) * pxPerMM / model.photoScale)));
      }
      layoutLabels();
    }
    window.addEventListener('resize', () => requestAnimationFrame(fitLighting));
    requestAnimationFrame(fitLighting);

    // Change to another clarinet: draw it afresh and carry over what is held, the words and the view
    function setModel(id) {
      if (!MODELS[id] || MODELS[id] === model) return;
      model = MODELS[id];
      build();
      setLabels(labelMode);
      placeBack(viewMode);
      setView(viewMode, true);
      setKeys(current, currentNote);
      fitLighting();
    }

    setKeys(new Set());
    return {
      setKeys, setLabels, setModel,
      setView: (m) => { viewMode = m; placeBack(m); setView(m, true); fitLighting(); },
      setTall: (v) => { tall = v; }, fitLighting,
    };
  }

  // The parts, for the other clarinets' files
  const kit = {
    n, smooth, poly, rng, stops, lin, rad, defsMarkup, chromeFilter, wedgeSym, castShadow, rectPath, circlePath, ellipsePath,
    silhouette, ball, footMark, foot, post, neck, screwPlate, rodV, rodBreak, sleeve, spear, ringKey, ringArm, shadow, cup, sideCup,
    touch, flag, taper, band, glint, splash, grainLines, woodPart, collar, stamp, mouthpieceMarkup, labelsMarkup, STYLE, ROD, ROD2, WOOD,
    // Shadows: start collecting outlines for one tube, then take them; partsIn draws parts placed by a transform
    startShadows(tube) { SIL = []; SILT = ''; TUBE = tube; },
    takeShadows() { const s = SIL; SIL = []; return s; },
    partsIn(t, draw) { const was = SILT; SILT = was ? `${was} ${t}` : t; try { return `<g transform="${t}">${draw()}</g>`; } finally { SILT = was; } },
    newId: () => `tc${++CID}`,
  };

  global.ClarinetArt = { create, register, kit, Y, uMM, lMM, UPPER, LOWER };
})(window);

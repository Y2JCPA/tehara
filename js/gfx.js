/* ============================================
   TEHARA: drawing kit (storybook style)
   Shaded, textured shapes on a 540x960 canvas. Every solid has a
   gradient body, a darker outline of its own hue, and a highlight,
   so walkable surfaces, stairs, ladders and hazards read at a glance.
   ============================================ */
const G = (function () {
  const C = {
    ink: '#3b2a20', inkSoft: 'rgba(59,42,32,0.55)',
    skyTop: '#5fb4ef', skyBot: '#cdeeff',
    grass: '#7cc242', grassLight: '#a8e063', grassDark: '#4e8f2a',
    dirt: '#b07d4a', dirtLight: '#d6a774', dirtDark: '#7e5430', path: '#e3c48f',
    stone: '#eedfba', stoneMid: '#dcc797', stoneDark: '#b89f6c', mortar: '#a88f60',
    rock: '#a9967a', rockDark: '#7d6c55', rockLight: '#cdbd9f',
    water: '#3fa7e0', waterLight: '#8fd3fb', waterDark: '#1f78b4',
    gold: '#f7c844', goldLight: '#fff3b5', goldDark: '#b5841a',
    wood: '#b5763c', woodLight: '#dba066', woodDark: '#7a4a20',
    leaf: '#5cb046', leafLight: '#8fd46a', leafDark: '#2f7a2c', olive: '#90a85c', oliveLight: '#c3d39a', oliveDark: '#5d7536',
    purple: '#9b5de5', purpleDeep: '#6a2fb8',
    lime: '#fdfdf6', bone: '#f7f1e2', boneShade: '#d9cfb6',
    clay: '#cf6d3c', clayDark: '#94431f', clayLight: '#ea9a68',
    metal: '#b4c0cc', metalDark: '#6f7d8b', metalLight: '#eef4fa',
    stoneVessel: '#d7d0c2', stoneVesselDark: '#9f9787',
    white: '#ffffff', green: '#33b864', red: '#e5484d',
  };

  // ---------- color helpers ----------
  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const dark = (c, t = 0.35) => mix(c, '#2a1a10', t);
  const light = (c, t = 0.35) => mix(c, '#ffffff', t);
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
  function rad(g, x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }

  // ---------- textures (cached noise patterns) ----------
  const TEX = {};
  function texture(kind) {
    if (TEX[kind]) return TEX[kind];
    if (typeof document === 'undefined') return null;
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const x = cv.getContext('2d'); const r = rng(kind.length * 97 + 13);
    if (kind === 'dirt') {
      for (let i = 0; i < 900; i++) { x.fillStyle = r() < 0.5 ? 'rgba(60,35,15,0.10)' : 'rgba(255,240,210,0.08)'; x.fillRect(r() * 128, r() * 128, 1 + r() * 2.5, 1 + r() * 2.5); }
      for (let i = 0; i < 14; i++) { x.fillStyle = 'rgba(70,45,25,0.22)'; x.beginPath(); x.ellipse(r() * 128, r() * 128, 2 + r() * 3, 1.5 + r() * 2, r() * 3, 0, 7); x.fill(); x.fillStyle = 'rgba(255,240,220,0.18)'; x.beginPath(); x.ellipse(r() * 128 - 0.5, r() * 128 - 0.5, 1.2, 0.8, 0, 0, 7); x.fill(); }
    } else if (kind === 'stone') {
      for (let i = 0; i < 1400; i++) { x.fillStyle = r() < 0.5 ? 'rgba(90,70,40,0.07)' : 'rgba(255,255,255,0.07)'; x.fillRect(r() * 128, r() * 128, 1 + r() * 2, 1 + r() * 2); }
    } else if (kind === 'rock') {
      for (let i = 0; i < 1000; i++) { x.fillStyle = r() < 0.55 ? 'rgba(40,30,20,0.10)' : 'rgba(255,255,255,0.07)'; x.fillRect(r() * 128, r() * 128, 1 + r() * 3, 1 + r() * 2); }
      for (let i = 0; i < 6; i++) { x.strokeStyle = 'rgba(40,30,20,0.18)'; x.lineWidth = 1.2; x.beginPath(); const sx = r() * 128, sy = r() * 128; x.moveTo(sx, sy); x.lineTo(sx + r() * 20 - 10, sy + r() * 16); x.lineTo(sx + r() * 24 - 12, sy + 10 + r() * 16); x.stroke(); }
    } else if (kind === 'wood') {
      for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(80,40,10,${0.08 + r() * 0.1})`; x.lineWidth = 1 + r(); const y = r() * 128; x.beginPath(); x.moveTo(0, y); for (let xx = 0; xx <= 128; xx += 16) x.lineTo(xx, y + Math.sin(xx / 20 + i) * 1.5); x.stroke(); }
    } else if (kind === 'grass') {
      for (let i = 0; i < 700; i++) { x.fillStyle = r() < 0.5 ? 'rgba(20,70,10,0.10)' : 'rgba(230,255,180,0.08)'; x.fillRect(r() * 128, r() * 128, 1, 2 + r() * 3); }
    }
    TEX[kind] = x.createPattern(cv, 'repeat');
    return TEX[kind];
  }
  // overlay a texture on the current path
  function texFill(g, kind, alpha = 1) { const p = texture(kind); if (!p) return; g.save(); g.globalAlpha = alpha; g.fillStyle = p; g.fill(); g.restore(); }

  // ---------- primitives ----------
  function path(g, pts, close) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    if (close) g.closePath();
  }
  function fillStroke(g, fill, lw = 2.5, stroke) {
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (lw) { g.lineWidth = lw; g.strokeStyle = stroke || (typeof fill === 'string' && fill[0] === '#' ? dark(fill, 0.55) : C.ink); g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
  }
  function rrPath(g, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function rr(g, x, y, w, h, r, fill, lw = 2.5, stroke) { rrPath(g, x, y, w, h, r); fillStroke(g, fill, lw, stroke); }
  function ell(g, x, y, rx, ry, fill, lw = 2.5, stroke) { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); fillStroke(g, fill, lw, stroke); }
  function circ(g, x, y, r, fill, lw, stroke) { ell(g, x, y, r, r, fill, lw, stroke); }
  function poly(g, pts, fill, lw = 2.5, stroke) { path(g, pts, true); fillStroke(g, fill, lw, stroke); }
  function line(g, x1, y1, x2, y2, lw = 3, stroke = C.ink) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineWidth = lw; g.strokeStyle = stroke; g.lineCap = 'round'; g.stroke(); }
  function shadow(g, x, y, rx, ry = rx * 0.28, a = 0.22) { g.fillStyle = rad(g, x, y, 0, rx, [[0, `rgba(30,20,10,${a})`], [1, 'rgba(30,20,10,0)']]); g.save(); g.translate(x, y); g.scale(1, ry / rx); g.beginPath(); g.arc(0, 0, rx, 0, 7); g.restore(); g.fill(); }
  // a shaded blob: gradient from light (top-left) to dark (bottom-right)
  function blob(g, x, y, w, h, base) { return lin(g, x, y, x + w * 0.4, y + h, [[0, light(base, 0.25)], [0.55, base], [1, dark(base, 0.22)]]); }

  // ---------- text ----------
  let LANG = 'en';
  function setLang(l) { LANG = l; }
  function font(size, bold = true, display = false) {
    const fam = display ? '"Suez One", "Rubik", sans-serif' : '"Rubik", sans-serif';
    return `${bold ? 700 : 500} ${size}px ${fam}`;
  }
  function text(g, s, x, y, { size = 18, color = C.ink, align = 'center', bold = true, outline = 0, outlineColor = '#fff', display = false, base = 'middle' } = {}) {
    g.font = font(size, bold, display); g.textAlign = align; g.textBaseline = base;
    g.direction = LANG === 'he' ? 'rtl' : 'ltr';
    if (outline) { g.lineWidth = outline; g.strokeStyle = outlineColor; g.lineJoin = 'round'; g.strokeText(s, x, y); }
    g.fillStyle = color; g.fillText(s, x, y);
    g.direction = 'ltr';
  }
  // a rounded label tag (for in-scene captions)
  function tag(g, s, x, y, { size = 14, bg = 'rgba(255,250,238,0.93)', color = C.ink, border = 'rgba(59,42,32,0.6)' } = {}) {
    g.font = font(size); const w = g.measureText(s).width + 18, h = size + 12;
    rr(g, x - w / 2, y - h / 2, w, h, h / 2, bg, 2, border);
    text(g, s, x, y + 1, { size, color });
  }
  // wooden sign on a post
  function sign(g, x, y, s, { w = 150, size = 14, post = true } = {}) {
    const lines = String(s).split('\n');
    const h = 16 + lines.length * (size + 4);
    if (post) { shadow(g, x, y + 46, 14); rr(g, x - 5, y - 6, 10, 52, 3, lin(g, x - 5, 0, x + 5, 0, [[0, C.woodLight], [1, C.woodDark]]), 2, C.woodDark); }
    rr(g, x - w / 2, y - h, w, h, 6, lin(g, 0, y - h, 0, y, [[0, '#e8b979'], [1, '#c98e4f']]), 2.5, C.woodDark);
    rrPath(g, x - w / 2, y - h, w, h, 6); texFill(g, 'wood', 0.8);
    for (const nx of [x - w / 2 + 7, x + w / 2 - 7]) circ(g, nx, y - h / 2, 2.2, C.woodDark, 0);
    lines.forEach((ln, i) => text(g, ln, x, y - h + 10 + (size + 4) * (i + 0.5), { size, color: '#3b2210' }));
  }
  function bubble(g, x, y, s, { size = 16, maxW = 230, color = '#fff' } = {}) {
    g.font = font(size);
    const words = String(s).split(' '); const lines = []; let cur = '';
    for (const w of words) { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t2; }
    if (cur) lines.push(cur);
    const w = Math.min(maxW, Math.max(...lines.map(l => g.measureText(l).width))) + 26;
    const h = lines.length * (size + 5) + 18;
    const bx = Math.max(6, Math.min(540 - w - 6, x - w / 2)), by = Math.max(6, y - h - 14);
    g.save(); g.shadowColor = 'rgba(0,0,0,0.18)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
    rr(g, bx, by, w, h, 14, color, 2.5, C.ink); g.restore();
    const tx = Math.max(bx + 16, Math.min(bx + w - 16, x));
    poly(g, [[tx - 9, by + h - 2], [tx + 9, by + h - 2], [tx, by + h + 12]], color, 0); line(g, tx - 9, by + h, tx, by + h + 12, 2.5); line(g, tx + 9, by + h, tx, by + h + 12, 2.5);
    lines.forEach((l, i) => text(g, l, bx + w / 2, by + 9 + (size + 5) * (i + 0.5), { size }));
  }

  // ---------- sky and distance ----------
  function sky(g, mode = 'day', t = 0, starsN = 0) {
    const stops = {
      day: [[0, '#4aa6ea'], [0.55, '#9ad5f7'], [1, '#e7f6ff']],
      sunset: [[0, '#4b5aa8'], [0.45, '#e07a6a'], [0.75, '#f6b46b'], [1, '#ffe2a8']],
      night: [[0, '#0d1236'], [0.6, '#22306b'], [1, '#41508f']],
      indoor: [[0, '#4a3826'], [1, '#2c2116']],
    }[mode] || [];
    g.fillStyle = lin(g, 0, 0, 0, 960, stops); g.fillRect(0, 0, 540, 960);
    if (mode === 'day') {
      g.fillStyle = rad(g, 450, 110, 10, 170, [[0, 'rgba(255,250,220,0.95)'], [0.2, 'rgba(255,245,200,0.55)'], [1, 'rgba(255,245,200,0)']]); g.fillRect(250, 0, 290, 320);
      circ(g, 450, 110, 30, '#fffbe0', 0);
      cloud(g, 110 + Math.sin(t / 4200) * 14, 120, 1.05); cloud(g, 330 + Math.cos(t / 5200) * 12, 205, 0.75);
    }
    if (mode === 'night' || mode === 'sunset') {
      const r = rng(4); g.fillStyle = 'rgba(255,255,255,0.6)';
      if (mode === 'night') for (let i = 0; i < 40; i++) { const s = r() * 1.6 + 0.5; g.fillRect(r() * 540, r() * 380, s, s); }
      const pts = [[120, 90], [300, 64], [440, 120]];
      for (let i = 0; i < Math.min(starsN, 3); i++) star(g, pts[i][0], pts[i][1], 11, '#fff3a0', true);
    }
  }
  function star(g, x, y, r, fill, glow) {
    if (glow) { g.fillStyle = rad(g, x, y, 0, r * 3, [[0, 'rgba(255,246,180,0.7)'], [1, 'rgba(255,246,180,0)']]); g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); }
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr2 = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr2, y + Math.sin(a) * rr2]); }
    poly(g, pts, fill, 1.5, '#c9a227');
  }
  function cloud(g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = 'rgba(160,190,220,0.35)';
    g.beginPath(); g.arc(-34, 14, 24, 0, 7); g.arc(0, 2, 32, 0, 7); g.arc(36, 14, 24, 0, 7); g.fill();
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(-34, 8, 24, 0, 7); g.arc(-4, -10, 32, 0, 7); g.arc(32, 6, 26, 0, 7); g.rect(-34, 8, 66, 22); g.fill();
    g.restore();
  }
  // layered hills with haze; Jerusalem-style terraces in the distance
  function hills(g, y, color, seed = 1, amp = 40, haze = 0) {
    const r = rng(seed); g.beginPath(); g.moveTo(0, 960); g.lineTo(0, y);
    for (let x = 0; x <= 540; x += 90) g.quadraticCurveTo(x + 45, y - amp * (0.4 + r()), x + 90, y + (r() - 0.5) * 20);
    g.lineTo(540, 960); g.closePath();
    g.fillStyle = lin(g, 0, y - amp, 0, y + 200, [[0, light(color, 0.1 + haze)], [1, dark(color, 0.1)]]); g.fill();
  }
  function distance(g, t, { seed = 1, y = 330, night = false } = {}) {
    const a = night ? '#3a4878' : '#a9c7d6', b = night ? '#2b3762' : '#8db88a', c = night ? '#23305a' : '#6fa860';
    hills(g, y - 40, a, seed, 50, 0.15);
    // distant olive dots
    const r = rng(seed + 9); for (let i = 0; i < 9; i++) { const x = r() * 540, yy = y - 10 + r() * 30; circ(g, x, yy, 7 + r() * 5, night ? '#24305c' : '#7e9d72', 0); }
    hills(g, y + 10, b, seed + 3, 34, 0.05);
    hills(g, y + 50, c, seed + 5, 24);
  }

  // ---------- terrain ----------
  // A cut-away block of earth: grass (or dirt/stone) lip on top, textured soil, darker below.
  function platform(g, x, y, w, h, { top = 'grass', face = 'earth', seed = 1, edgeL = true, edgeR = true } = {}) {
    const base = face === 'rock' ? C.rock : C.dirt;
    rrPath(g, x, y, w, h, 6);
    g.fillStyle = lin(g, 0, y, 0, y + h, [[0, light(base, 0.08)], [0.5, base], [1, dark(base, 0.3)]]); g.fill();
    texFill(g, face === 'rock' ? 'rock' : 'dirt');
    // strata and embedded stones
    const r = rng(seed * 31 + x);
    g.save(); rrPath(g, x, y, w, h, 6); g.clip();
    for (let yy = y + 40; yy < y + h; yy += 46 + r() * 20) { g.beginPath(); g.moveTo(x, yy); for (let xx = x; xx <= x + w; xx += 30) g.lineTo(xx, yy + Math.sin(xx / 40 + yy) * 4); g.lineWidth = 2; g.strokeStyle = 'rgba(60,35,15,0.18)'; g.stroke(); }
    for (let i = 0; i < w * h / 4200; i++) { const sx = x + r() * w, sy = y + 30 + r() * (h - 30); ell(g, sx, sy, 5 + r() * 7, 3.5 + r() * 4, light(face === 'rock' ? C.rockDark : '#9d7b58', 0.15), 1.5, 'rgba(60,35,15,0.4)'); }
    // side shading
    if (edgeL) { g.fillStyle = lin(g, x, 0, x + 18, 0, [[0, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(x, y, 18, h); }
    if (edgeR) { g.fillStyle = lin(g, x + w - 22, 0, x + w, 0, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.22)']]); g.fillRect(x + w - 22, y, 22, h); }
    g.restore();
    rrPath(g, x, y, w, h, 6); g.lineWidth = 2.5; g.strokeStyle = dark(base, 0.55); g.stroke();
    // the walkable top
    if (top === 'grass') {
      rr(g, x - 2, y - 4, w + 4, 16, 8, lin(g, 0, y - 4, 0, y + 12, [[0, C.grassLight], [1, C.grass]]), 2.5, C.grassDark);
      const r2 = rng(seed + x + y);
      for (let i = 0; i < w / 9; i++) { const gx = x + 3 + r2() * (w - 6); const hh = 5 + r2() * 7; poly(g, [[gx - 3, y + 1], [gx + r2() * 4 - 2, y - hh], [gx + 3, y + 1]], r2() < 0.5 ? C.grass : C.grassLight, 0); }
      for (let i = 0; i < w / 60; i++) { const gx = x + 8 + r2() * (w - 16); if (r2() < 0.35) { line(g, gx, y + 2, gx, y - 10, 1.5, C.grassDark); circ(g, gx, y - 12, 3.4, r2() < 0.5 ? '#e5484d' : '#f7f2ff', 1, 'rgba(0,0,0,0.3)'); } }
    } else if (top === 'dirt') {
      rr(g, x - 1, y - 2, w + 2, 12, 6, lin(g, 0, y, 0, y + 10, [[0, C.path], [1, C.dirtLight]]), 2.5, C.dirtDark);
    } else if (top === 'stone') {
      rr(g, x - 1, y - 3, w + 2, 12, 3, lin(g, 0, y, 0, y + 10, [[0, light(C.stone, 0.3)], [1, C.stoneMid]]), 2.5, C.stoneDark);
    }
  }
  // A gap/ravine: dark, with a soft gradient into the depths
  function chasm(g, x, y, w, h) {
    g.fillStyle = lin(g, 0, y, 0, y + h, [[0, '#5b3d22'], [0.4, '#3b2615'], [1, '#1e130a']]); g.fillRect(x, y, w, h);
    g.fillStyle = lin(g, x, 0, x + 16, 0, [[0, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(x, y, 16, h);
    g.fillStyle = lin(g, x + w - 16, 0, x + w, 0, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.35)']]); g.fillRect(x + w - 16, y, 16, h);
  }
  // A flight of stone stairs going down from (x, y): dir 1 = down to the right,
  // -1 = down to the left. Drawn as a slab with bright treads and shaded risers,
  // with the rock showing beneath it, so it reads as stairs.
  function stairs(g, x, y, steps, { stepW = 24, stepH = 22, dir = 1, thick = 26 } = {}) {
    const pts = [[x, y]];
    for (let i = 0; i < steps; i++) { const sx = x + dir * (i + 1) * stepW; pts.push([sx, y + i * stepH]); pts.push([sx, y + (i + 1) * stepH]); }
    const ex = x + dir * steps * stepW, ey = y + steps * stepH;
    pts.push([ex, ey + thick * 0.4]); pts.push([x, y + thick]);
    g.save(); g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 8; g.shadowOffsetY = 4;
    poly(g, pts, lin(g, x, y, ex, ey, [[0, C.stoneMid], [1, C.stoneDark]]), 2.5, '#8a7148'); g.restore();
    path(g, pts, true); texFill(g, 'stone');
    for (let i = 0; i < steps; i++) {
      const x0 = x + dir * i * stepW, x1 = x + dir * (i + 1) * stepW, sy = y + i * stepH;
      const lx = Math.min(x0, x1), w = Math.abs(x1 - x0);
      // riser (the vertical face) in shade
      g.fillStyle = lin(g, 0, sy, 0, sy + stepH, [[0, 'rgba(70,45,20,0.5)'], [1, 'rgba(70,45,20,0.2)']]);
      g.fillRect(dir > 0 ? x1 - 2 : x1 - 3, sy + 3, 5, stepH);
      // tread (the top you walk on), bright
      rr(g, lx - 2, sy - 4, w + 4, 9, 2.5, lin(g, 0, sy - 4, 0, sy + 5, [[0, '#fffbef'], [1, '#e6d3a6']]), 2, '#8a7148');
    }
  }
  function ladder(g, x, y1, y2, { w = 34 } = {}) {
    const rail = lin(g, x - w / 2, 0, x + w / 2, 0, [[0, C.woodLight], [1, C.woodDark]]);
    for (let yy = y1 + 16; yy < y2; yy += 22) rr(g, x - w / 2, yy - 3, w, 7, 3, C.woodLight, 2, C.woodDark);
    rr(g, x - w / 2 - 5, y1, 8, y2 - y1, 3, rail, 2, C.woodDark); rr(g, x + w / 2 - 3, y1, 8, y2 - y1, 3, rail, 2, C.woodDark);
  }
  // Herodian ashlar wall: blocks with a drafted margin and a raised boss
  function stoneWall(g, x, y, w, h, { block = 40, seed = 3, tone = 0 } = {}) {
    g.save(); rrPath(g, x, y, w, h, 2); g.clip();
    g.fillStyle = C.mortar; g.fillRect(x, y, w, h);
    const r = rng(seed); const bh = Math.round(block * 0.6);
    for (let row = 0, yy = y; yy < y + h; row++, yy += bh) {
      let xx = x - (row % 2 ? block * 0.55 : 0) - r() * 6;
      while (xx < x + w) {
        const bw = block * (0.85 + r() * 0.6);
        const base = mix(C.stone, row % 3 === 1 ? '#e6cf9c' : '#f3e6c6', r() * 0.8);
        const fill = mix(base, '#8a7148', tone);
        rr(g, xx + 1.5, yy + 1.5, bw - 3, bh - 3, 2.5, lin(g, xx, yy, xx + bw * 0.3, yy + bh, [[0, light(fill, 0.25)], [1, dark(fill, 0.12)]]), 0);
        // drafted margin: a smooth frame, with a slightly raised boss inside
        rr(g, xx + 6, yy + 5, bw - 12, bh - 11, 2, null, 1.2, 'rgba(120,95,55,0.35)');
        g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(xx + 7, yy + 6, bw - 14, 2);
        xx += bw;
      }
    }
    g.fillStyle = texture('stone') || 'transparent'; g.fillRect(x, y, w, h);
    g.restore();
    rr(g, x, y, w, h, 2, null, 2.5, dark(C.mortar, 0.4));
  }
  function river(g, x, y, w, h, t = 0) {
    rr(g, x, y, w, h, 8, lin(g, 0, y, 0, y + h, [[0, C.waterLight], [0.25, C.water], [1, C.waterDark]]), 2.5, C.waterDark);
    g.save(); rrPath(g, x, y, w, h, 8); g.clip();
    for (let i = 0; i < 7; i++) { const yy = y + 14 + i * (h / 7); const off = (t / 28 + i * 37) % 70; for (let xx = x - 70 + off; xx < x + w; xx += 70) line(g, xx, yy, xx + 22, yy, 2.5, 'rgba(255,255,255,0.5)'); }
    g.restore();
  }
  function tree(g, x, y, s = 1, kind = 'terebinth', seed = 7) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 2, 60, 12, 0.25);
    const trunk = lin(g, -14, 0, 14, 0, [[0, C.woodLight], [0.5, C.wood], [1, C.woodDark]]);
    g.beginPath(); g.moveTo(-14, 0); g.bezierCurveTo(-8, -30, -12, -60, -6, -86); g.lineTo(8, -86); g.bezierCurveTo(10, -60, 6, -30, 16, 0); g.closePath(); fillStroke(g, trunk, 2.5, C.woodDark);
    line(g, -2, -50, -26, -82, 7, C.woodDark); line(g, -2, -50, -26, -82, 4, C.wood);
    line(g, 4, -60, 28, -90, 7, C.woodDark); line(g, 4, -60, 28, -90, 4, C.wood);
    const base = kind === 'olive' ? C.olive : C.leaf, hi = kind === 'olive' ? C.oliveLight : C.leafLight, lo = kind === 'olive' ? C.oliveDark : C.leafDark;
    const r = rng(seed);
    const puffs = [[-40, -96, 34], [40, -98, 34], [0, -126, 44], [-22, -116, 30], [24, -118, 30], [0, -92, 30]];
    for (const [px, py, pr] of puffs) circ(g, px, py + 4, pr, lo, 0);
    for (const [px, py, pr] of puffs) { g.beginPath(); g.arc(px, py, pr, 0, 7); g.fillStyle = rad(g, px - pr * 0.35, py - pr * 0.45, pr * 0.1, pr * 1.1, [[0, hi], [0.6, base], [1, lo]]); g.fill(); }
    // leaf flecks
    for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = r() * 52; ell(g, Math.cos(a) * d, -110 + Math.sin(a) * d * 0.7, 4, 2.2, i % 3 ? hi : lo, 0); }
    if (kind === 'olive') for (let i = 0; i < 10; i++) { const a = r() * 6.28, d = r() * 46; ell(g, Math.cos(a) * d, -108 + Math.sin(a) * d * 0.6, 2.4, 3.4, '#3d4524', 0); }
    g.restore();
  }
  function bush(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    for (const [px, py, pr] of [[-14, -10, 14], [10, -12, 15], [0, -20, 14]]) { g.beginPath(); g.arc(px, py, pr, 0, 7); g.fillStyle = rad(g, px - 5, py - 6, 2, pr, [[0, C.leafLight], [1, C.leafDark]]); g.fill(); }
    g.restore();
  }
  function rock(g, x, y, w, h, seed = 2) {
    const r = rng(seed); const pts = [];
    for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; pts.push([x + Math.cos(a) * w / 2 * (0.85 + r() * 0.2), y + Math.sin(a) * h * (0.85 + r() * 0.2)]); }
    poly(g, pts, blob(g, x - w / 2, y - h, w, h, C.rock), 2.5, C.rockDark);
    path(g, pts, true); texFill(g, 'rock');
  }

  // ---------- graves (Second Temple style rock-cut tombs) ----------
  // A tomb cut into a rock face, with a round rolling stone (golel) in front of the door.
  function tomb(g, x, y, s = 1, { open = false } = {}) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 0, 80, 12);
    g.beginPath(); g.moveTo(-78, 0); g.quadraticCurveTo(-72, -84, -10, -96); g.quadraticCurveTo(64, -98, 78, 0); g.closePath();
    g.fillStyle = lin(g, -78, -96, 40, 0, [[0, C.rockLight], [0.6, C.rock], [1, C.rockDark]]); g.fill(); texFill(g, 'rock'); g.lineWidth = 2.5; g.strokeStyle = C.rockDark; g.stroke();
    // carved doorway
    rr(g, -24, -56, 40, 56, 4, lin(g, 0, -56, 0, 0, [[0, '#2a1d12'], [1, '#120c07']]), 2.5, '#5e4c36');
    rr(g, -30, -62, 52, 8, 2, C.rockLight, 2, C.rockDark);
    if (!open) { // rolling stone
      g.beginPath(); g.arc(14, -30, 30, 0, 7); g.fillStyle = rad(g, 4, -40, 4, 32, [[0, '#d3c4a6'], [1, '#8f7d62']]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = C.rockDark; g.stroke();
      g.beginPath(); g.arc(14, -30, 30, 0, 7); texFill(g, 'rock'); circ(g, 14, -30, 18, null, 1.5, 'rgba(80,60,40,0.35)');
    }
    g.restore();
  }
  // A simple grave in a field: a low stone heap with a standing marker stone
  function grave(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 0, 60, 12);
    g.beginPath(); g.ellipse(0, 0, 56, 26, 0, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, -26, 0, 0, [[0, '#cdbf9e'], [1, '#9c8c6c']]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = C.rockDark; g.stroke();
    const r = rng(5); for (let i = 0; i < 9; i++) ell(g, -40 + i * 10 + r() * 4, -6 - r() * 12, 8, 5, light(C.rock, 0.2 + r() * 0.2), 1.5, C.rockDark);
    rr(g, -12, -60, 24, 46, 10, lin(g, -12, 0, 12, 0, [[0, '#f2ecdc'], [1, '#bfb49c']]), 2.5, '#8e8168');
    g.restore();
  }
  function cave(g, x, y, w, h, { closed = true } = {}) {
    g.beginPath(); g.moveTo(x - 30, y + h); g.quadraticCurveTo(x + w / 2, y - h * 0.9, x + w + 30, y + h); g.closePath();
    g.fillStyle = lin(g, x, y - h * 0.5, x + w, y + h, [[0, C.rockLight], [1, C.rockDark]]); g.fill(); texFill(g, 'rock'); g.lineWidth = 2.5; g.strokeStyle = C.rockDark; g.stroke();
    const dw = w * 0.42, dh = h * 0.62, dx = x + w / 2 - dw / 2, dy = y + h - dh;
    g.beginPath(); g.moveTo(dx, y + h); g.lineTo(dx, dy + dw / 2); g.arc(dx + dw / 2, dy + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw, y + h); g.closePath();
    g.fillStyle = lin(g, 0, dy, 0, y + h, [[0, '#2a1d12'], [1, '#0e0905']]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#5e4c36'; g.stroke();
    if (closed) { const cx = dx + dw / 2 + dw * 0.25, cy = y + h - dw * 0.45; g.beginPath(); g.arc(cx, cy, dw * 0.48, 0, 7); g.fillStyle = rad(g, cx - 8, cy - 8, 2, dw * 0.5, [[0, '#d3c4a6'], [1, '#8f7d62']]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = C.rockDark; g.stroke(); }
  }
  function house(g, x, y, w, h, { door = true, roof = '#c65d3b', flat = true } = {}) {
    shadow(g, x + w / 2, y + h, w * 0.6, 10);
    stoneWall(g, x, y, w, h, { block: 30 });
    if (flat) { rr(g, x - 8, y - 12, w + 16, 14, 3, lin(g, 0, y - 12, 0, y + 2, [[0, '#d8c39a'], [1, '#a8925f']]), 2.5, C.mortar); for (let xx = x - 4; xx < x + w; xx += 14) circ(g, xx + 6, y - 5, 3, C.woodDark, 0); }
    else poly(g, [[x - 10, y + 2], [x + w + 10, y + 2], [x + w - 6, y - 22], [x + 6, y - 22]], roof, 2.5);
    if (door) { rr(g, x + w / 2 - 15, y + h - 44, 30, 44, 14, lin(g, 0, y + h - 44, 0, y + h, [[0, C.woodLight], [1, C.woodDark]]), 2.5, C.woodDark); circ(g, x + w / 2 + 8, y + h - 22, 2.5, C.goldDark, 0); }
    rr(g, x + 14, y + 18, 20, 16, 3, '#3b2a1c', 2, C.mortar);
  }
  function walls(g, x, y, w, h) {
    shadow(g, x + w / 2, y + h, w * 0.55, 12);
    stoneWall(g, x, y, w, h, { block: 46, seed: 9 });
    for (let xx = x; xx < x + w - 10; xx += 38) { rr(g, xx + 4, y - 20, 24, 22, 2, lin(g, 0, y - 20, 0, y, [[0, '#f6ead0'], [1, C.stoneMid]]), 2.5, C.mortar); }
    const gw = 76; g.beginPath(); g.moveTo(x + w / 2 - gw / 2, y + h); g.lineTo(x + w / 2 - gw / 2, y + h - 74); g.arc(x + w / 2, y + h - 74, gw / 2, Math.PI, 0); g.lineTo(x + w / 2 + gw / 2, y + h); g.closePath();
    g.fillStyle = lin(g, 0, y + h - 110, 0, y + h, [[0, '#6b4a26'], [1, '#3e2914']]); g.fill(); g.lineWidth = 3; g.strokeStyle = C.mortar; g.stroke();
  }

  // ---------- props ----------
  // A golden pin from (x1,y1) ring-end to (x2,y2). t = 0..1 pulled out.
  function pin(g, x1, y1, x2, y2, t = 0, { hot = false, glint = 0 } = {}) {
    const dx = x1 - x2, dy = y1 - y2, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const off = t * (L + 50);
    const ax = x1 + ux * off, ay = y1 + uy * off, bx = x2 + ux * off, by = y2 + uy * off;
    const nx = -uy, ny = ux;
    g.beginPath(); g.moveTo(ax + nx * 6, ay + ny * 6); g.lineTo(bx + nx * 5 - ux * 4, by + ny * 5 - uy * 4); g.lineTo(bx - ux * 10, by - uy * 10); g.lineTo(bx - nx * 5 - ux * 4, by - ny * 5 - uy * 4); g.lineTo(ax - nx * 6, ay - ny * 6); g.closePath();
    g.fillStyle = lin(g, ax + nx * 6, ay + ny * 6, ax - nx * 6, ay - ny * 6, [[0, C.goldLight], [0.45, C.gold], [1, C.goldDark]]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#7a5410'; g.stroke();
    const rx = ax + ux * 17, ry = ay + uy * 17;
    g.beginPath(); g.arc(rx, ry, 18, 0, 7); g.arc(rx, ry, 10, 0, 7, true);
    g.fillStyle = rad(g, rx - 6, ry - 6, 2, 22, [[0, C.goldLight], [0.5, C.gold], [1, C.goldDark]]); g.fill('evenodd');
    circ(g, rx, ry, 18, null, 2.5, '#7a5410'); circ(g, rx, ry, 10, null, 2, '#7a5410');
    if (hot) circ(g, rx, ry, 24, null, 3, 'rgba(255,240,150,0.8)');
    // a little sparkle so pins read as "tap me"
    if (glint > 0) { const s = 4 + glint * 4; g.save(); g.globalAlpha = glint; line(g, rx + 10 - s, ry - 12, rx + 10 + s, ry - 12, 2, '#fff'); line(g, rx + 10, ry - 12 - s, rx + 10, ry - 12 + s, 2, '#fff'); g.restore(); }
    return { rx, ry };
  }
  function plank(g, x, y, w, angle = 0, h = 14) {
    g.save(); g.translate(x, y); g.rotate(angle);
    shadow(g, 0, h, w * 0.5, 5, 0.18);
    rr(g, -w / 2, -h / 2, w, h, 3, lin(g, 0, -h / 2, 0, h / 2, [[0, C.woodLight], [1, C.wood]]), 2.5, C.woodDark);
    rrPath(g, -w / 2, -h / 2, w, h, 3); texFill(g, 'wood');
    for (const nx of [-w / 2 + 8, w / 2 - 8]) circ(g, nx, 0, 2, '#5a3412', 0);
    g.restore();
  }
  function log(g, x, y, w, angle = 0) {
    g.save(); g.translate(x, y); g.rotate(angle);
    rr(g, -w / 2, -12, w, 24, 12, lin(g, 0, -12, 0, 12, [[0, C.woodLight], [0.5, C.wood], [1, C.woodDark]]), 2.5, C.woodDark);
    rrPath(g, -w / 2, -12, w, 24, 12); texFill(g, 'wood');
    ell(g, w / 2 - 8, 0, 7, 11, '#e9c08a', 2, C.woodDark); ell(g, w / 2 - 8, 0, 3.5, 5.5, null, 1.2, C.woodDark);
    g.restore();
  }
  function rope(g, x1, y1, x2, y2, sag = 0) {
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + sag, x2, y2);
    g.lineWidth = 6; g.strokeStyle = '#6b4a22'; g.stroke(); g.lineWidth = 3.5; g.strokeStyle = '#d9b77a'; g.stroke();
    g.setLineDash([3, 5]); g.lineWidth = 3.5; g.strokeStyle = '#b8945a'; g.stroke(); g.setLineDash([]);
  }
  function bone(g, x, y, s = 1, a = 0, glow = false, t = 0) {
    g.save(); g.translate(x, y);
    if (glow) tumahGlow(g, 0, 0, 30 * s, 1, t);
    g.rotate(a); g.scale(s, s);
    const fill = lin(g, 0, -9, 0, 9, [[0, '#fffaf0'], [1, C.boneShade]]);
    for (const sx of [-15, 15]) for (const sy of [-4.5, 4.5]) circ(g, sx, sy, 5.2, fill, 2, '#8f8266');
    rr(g, -14, -4, 28, 8, 3, fill, 2, '#8f8266');
    for (const sx of [-15, 15]) for (const sy of [-4.5, 4.5]) circ(g, sx, sy, 3.6, fill, 0);
    rr(g, -13, -2.6, 26, 5.2, 2, fill, 0);
    g.restore();
  }
  // a white twig (a decoy that looks a little like a bone)
  function twig(g, x, y, s = 1, a = 0) {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    line(g, -16, 0, 16, 0, 5, '#7d6a4f'); line(g, -16, 0, 16, 0, 3, '#d8cbb0'); line(g, 4, 0, 12, -7, 3, '#7d6a4f'); line(g, 4, 0, 12, -7, 1.5, '#d8cbb0');
    g.restore();
  }
  function skull(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    const f = rad(g, -6, -8, 2, 24, [[0, '#fffaf0'], [1, C.boneShade]]);
    circ(g, 0, 0, 20, f, 2.5, '#8f8266'); rr(g, -11, 12, 22, 12, 4, f, 2.5, '#8f8266');
    ell(g, -7, -1, 5.5, 6.5, '#3b2a20', 0); ell(g, 7, -1, 5.5, 6.5, '#3b2a20', 0); poly(g, [[0, 6], [-3, 11], [3, 11]], '#3b2a20', 0);
    g.restore();
  }
  function deadMouse(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 10, 22, 4);
    ell(g, 0, 0, 18, 11, rad(g, -5, -5, 2, 20, [[0, '#c4c4c4'], [1, '#808080']]), 2.5, '#555');
    circ(g, 16, -2, 8, '#b0b0b0', 2.5, '#555'); circ(g, 13, -10, 5, '#f4b6c2', 2, '#555');
    line(g, 13, -4, 18, 1, 2, '#333'); line(g, 18, -4, 13, 1, 2, '#333');
    for (const lx of [-8, 0, 8]) line(g, lx, 8, lx, 16, 2.5, '#555');
    g.beginPath(); g.moveTo(-18, 2); g.quadraticCurveTo(-34, -6, -38, 6); g.lineWidth = 2.5; g.strokeStyle = '#555'; g.stroke();
    g.restore();
  }
  // a dead fox (nevelah): conveys by touch and carrying, not by ohel
  function deadFox(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 12, 40, 6);
    g.beginPath(); g.moveTo(-36, 4); g.quadraticCurveTo(-60, -6, -62, 12); g.quadraticCurveTo(-48, 14, -36, 10); g.closePath(); fillStroke(g, '#e07b2f', 2.5, '#8a3d10'); circ(g, -58, 11, 4, '#fff', 0);
    ell(g, 0, 2, 38, 14, lin(g, 0, -12, 0, 16, [[0, '#f0934a'], [1, '#c45a1c']]), 2.5, '#8a3d10');
    ell(g, 0, 10, 26, 5, '#fbe3c8', 0);
    g.beginPath(); g.moveTo(30, -6); g.lineTo(54, 2); g.lineTo(32, 12); g.closePath(); fillStroke(g, '#e07b2f', 2.5, '#8a3d10');
    poly(g, [[34, -6], [40, -20], [44, -4]], '#e07b2f', 2.5, '#8a3d10');
    line(g, 38, 0, 44, 6, 2, '#333'); line(g, 44, 0, 38, 6, 2, '#333'); circ(g, 54, 2, 2.5, '#333', 0);
    for (const lx of [-18, -6, 10, 22]) line(g, lx, 12, lx + 3, 22, 3, '#8a3d10');
    g.restore();
  }
  function barrel(g, x, y, s = 1, tipped = 0) {
    g.save(); g.translate(x, y); g.rotate(tipped); g.scale(s, s);
    shadow(g, 0, 30, 26, 6);
    g.beginPath(); g.moveTo(-20, -30); g.quadraticCurveTo(-28, 0, -20, 30); g.lineTo(20, 30); g.quadraticCurveTo(28, 0, 20, -30); g.closePath();
    g.fillStyle = lin(g, -24, 0, 24, 0, [[0, C.woodDark], [0.35, C.woodLight], [1, C.woodDark]]); g.fill(); texFill(g, 'wood'); g.lineWidth = 2.5; g.strokeStyle = '#5a3412'; g.stroke();
    for (const by of [-18, 16]) { rr(g, -24, by - 3, 48, 7, 3, lin(g, 0, by - 3, 0, by + 4, [[0, '#cfd6dd'], [1, '#6f7d8b']]), 1.5, '#444'); }
    if (!tipped) ell(g, 0, -30, 20, 6, lin(g, 0, -36, 0, -24, [[0, C.waterLight], [1, C.water]]), 2, '#5a3412');
    g.restore();
  }
  function hive(g, x, y, s = 1, wet = false) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 14, 20, 4, 0.15);
    for (let i = 3; i >= 0; i--) ell(g, 0, -i * 11, 24 - i * 4, 9, lin(g, 0, -i * 11 - 9, 0, -i * 11 + 9, [[0, wet ? '#d4b15c' : '#ffd66b'], [1, wet ? '#9a7a2c' : '#d99a1e']]), 2.5, '#8a5a10');
    ell(g, 0, 8, 6, 5, '#3b2a20', 0);
    if (wet) for (let i = 0; i < 5; i++) ell(g, -14 + i * 7, 6 + (i % 2) * 4, 2, 3, C.waterLight, 1, C.water);
    g.restore();
  }
  function bee(g, x, y) { ell(g, x - 2, y - 6, 4.5, 3, 'rgba(255,255,255,0.85)', 1, '#555'); ell(g, x, y, 6.5, 5, lin(g, x - 6, 0, x + 6, 0, [[0, '#ffd23f'], [0.4, '#3b2a20'], [0.55, '#ffd23f'], [0.8, '#3b2a20'], [1, '#ffd23f']]), 1.5, '#3b2a20'); }
  // stepping stone: wobbly ones sit on a few pebbles (look closely!)
  function stoneTile(g, x, y, r, { wobbly = false, wob = 0, tested = false, look = 0 } = {}) {
    g.save(); g.translate(x, y); g.rotate(wob);
    if (wobbly) { for (const px of [-r * 0.5, r * 0.45]) ell(g, px, r * 0.42, 5, 3.5, '#8d8070', 1.2, '#5e5446'); }
    else { ell(g, 0, r * 0.38, r * 1.05, r * 0.32, 'rgba(90,60,30,0.35)', 0); }
    ell(g, 0, 6, r, r * 0.55, '#7f7668', 2.5, '#4f473b');
    ell(g, 0, 0, r, r * 0.55, rad(g, -r * 0.3, -r * 0.3, 2, r * 1.1, [[0, '#e3ddd1'], [1, look ? '#a39a89' : '#a8a092']]), 2.5, '#4f473b');
    ell(g, -r * 0.3, -r * 0.18, r * 0.28, r * 0.12, 'rgba(255,255,255,0.5)', 0);
    g.restore();
    if (tested) { circ(g, x + r * 0.8, y - r * 0.6, 11, wobbly ? C.red : C.green, 2, '#fff'); text(g, wobbly ? '✗' : '✓', x + r * 0.8, y - r * 0.6, { size: 14, color: '#fff' }); }
  }
  function footprint(g, x, y, a = 0, alpha = 0.5) {
    g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha = alpha; ell(g, 0, 0, 4, 7, '#7a5530', 0); circ(g, 0, -9, 2.5, '#7a5530', 0); g.restore();
  }
  // material: clay | stone | metal ; seal: 'kg' | 'broken' ; sealed (plaster), loose (cloth)
  function jar(g, x, y, s = 1, { material = 'clay', sealed = false, loose = false, seal = null, flask = false, bowl = false, oil = false } = {}) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 0, 4, 28, 6);
    const fill = material === 'stone' ? C.stoneVessel : material === 'metal' ? C.metal : C.clay;
    const dk = material === 'stone' ? C.stoneVesselDark : material === 'metal' ? C.metalDark : C.clayDark;
    const lt = material === 'stone' ? '#f1ece2' : material === 'metal' ? C.metalLight : C.clayLight;
    const body = lin(g, -26, 0, 26, 0, [[0, dk], [0.3, lt], [0.6, fill], [1, dk]]);
    let topY;
    if (bowl) {
      g.beginPath(); g.moveTo(-30, -24); g.quadraticCurveTo(-28, 6, 0, 6); g.quadraticCurveTo(28, 6, 30, -24); g.closePath(); fillStroke(g, body, 2.5, dark(dk, 0.3));
      ell(g, 0, -24, 30, 7, oil ? lin(g, 0, -30, 0, -18, [[0, '#ffe08a'], [1, '#d9a520']]) : dark(fill, 0.25), 2.5, dark(dk, 0.3)); topY = -24;
    } else if (flask) {
      ell(g, 0, -16, 19, 22, body, 2.5, dark(dk, 0.3)); rr(g, -6, -50, 12, 16, 3, body, 2.5, dark(dk, 0.3)); topY = -50;
    } else {
      g.beginPath(); g.moveTo(-10, -44); g.quadraticCurveTo(-32, -28, -25, -4); g.quadraticCurveTo(-18, 6, 0, 6); g.quadraticCurveTo(18, 6, 25, -4); g.quadraticCurveTo(32, -28, 10, -44); g.closePath();
      fillStroke(g, body, 2.5, dark(dk, 0.3));
      if (material === 'clay') { g.beginPath(); g.moveTo(-18, -24); g.quadraticCurveTo(0, -18, 18, -24); g.lineWidth = 2; g.strokeStyle = 'rgba(80,30,10,0.4)'; g.stroke(); g.beginPath(); g.moveTo(-22, -12); g.quadraticCurveTo(0, -6, 22, -12); g.stroke(); }
      if (material === 'stone') { line(g, -14, -14, -6, -14, 2, dk); line(g, 6, -20, 14, -20, 2, dk); }
      rr(g, -12, -53, 24, 11, 4, body, 2.5, dark(dk, 0.3)); topY = -53;
      if (!sealed && !loose && !seal) ell(g, 0, topY + 1, 9, 3, oil ? '#e0b030' : '#2a1a10', 0);
    }
    if (sealed) { g.beginPath(); g.moveTo(-15, topY + 2); g.quadraticCurveTo(-16, topY - 12, 0, topY - 13); g.quadraticCurveTo(16, topY - 12, 15, topY + 2); g.closePath(); fillStroke(g, lin(g, 0, topY - 13, 0, topY + 2, [[0, '#c9a07a'], [1, '#8a6040']]), 2.5, '#5a3a20'); }
    if (loose) { g.beginPath(); g.moveTo(-17, topY + 4); g.quadraticCurveTo(0, topY - 20, 17, topY + 4); g.quadraticCurveTo(22, topY + 12, 10, topY + 8); g.lineTo(-10, topY + 9); g.closePath(); fillStroke(g, '#efe7d2', 2, '#8a7d62'); line(g, -14, topY + 4, 14, topY + 4, 1.5, '#8a7d62'); }
    if (seal) {
      const sy = topY - 5;
      if (seal === 'broken') { circ(g, -6, sy, 7, '#b8322a', 2, '#6e1610'); poly(g, [[4, sy - 5], [12, sy - 2], [6, sy + 6]], '#b8322a', 2, '#6e1610'); }
      else { circ(g, 0, sy, 10, rad(g, -3, sy - 3, 1, 11, [[0, '#e0574d'], [1, '#8e1f18']]), 2, '#5e120c'); star(g, 0, sy, 5, C.gold); }
    }
    g.restore();
  }
  function ladle(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); line(g, 0, -40, 0, 0, 7, C.metalDark); line(g, 0, -40, 0, 0, 4, C.metalLight); ell(g, 0, 6, 12, 8, lin(g, -12, 0, 12, 0, [[0, C.metalLight], [1, C.metalDark]]), 2.5, '#444'); g.restore(); }
  function cup(g, x, y, s = 1, material = 'stone') {
    g.save(); g.translate(x, y); g.scale(s, s); shadow(g, 0, 6, 18, 4);
    const f = material === 'stone' ? C.stoneVessel : material === 'metal' ? C.metal : C.clay;
    poly(g, [[-16, -22], [16, -22], [11, 6], [-11, 6]], lin(g, -16, 0, 16, 0, [[0, dark(f, 0.2)], [0.35, light(f, 0.3)], [1, dark(f, 0.25)]]), 2.5, dark(f, 0.5));
    ell(g, 0, -22, 16, 4, dark(f, 0.3), 2, dark(f, 0.5));
    g.restore();
  }
  function crate(g, x, y, w, h) {
    shadow(g, x + w / 2, y + h, w * 0.6, 5);
    rr(g, x, y, w, h, 3, lin(g, x, y, x + w, y + h, [[0, C.woodLight], [1, C.wood]]), 2.5, C.woodDark); rrPath(g, x, y, w, h, 3); texFill(g, 'wood');
    line(g, x + 5, y + 5, x + w - 5, y + h - 5, 3, C.woodDark); line(g, x + w - 5, y + 5, x + 5, y + h - 5, 3, C.woodDark);
  }
  // strong: big chest, steady legs. Weak: trembling knees. Old: grey muzzle.
  function donkey(g, x, y, s = 1, { strong = true, phase = 0, dir = 1, color, plop = 0 } = {}) {
    g.save(); g.translate(x, y); g.scale(s * dir, s);
    shadow(g, 0, 40, 52, 8);
    const body = color || (strong ? '#8c7663' : '#b9ab9d');
    const sw = Math.sin(phase) * 6, wob = strong ? 0 : Math.sin(phase * 4) * 2.5;
    const leg = (lx, k) => { const kx = lx + (strong ? 0 : wob * k); rr(g, kx - 5, 8, 10, 20, 4, dark(body, 0.12), 2, dark(body, 0.5)); rr(g, kx - 5 + (strong ? 0 : -wob * k * 1.5), 24, 10, 16, 4, dark(body, 0.12), 2, dark(body, 0.5)); rr(g, kx - 6, 37, 12, 6, 2, '#3b2a20', 0); };
    leg(-26, 1); leg(-12, -1); leg(14, 1); leg(28, -1);
    ell(g, 0, 0, 42, 24, lin(g, 0, -24, 0, 24, [[0, light(body, 0.2)], [1, dark(body, 0.15)]]), 2.5, dark(body, 0.5));
    ell(g, 0, 10, 30, 10, light(body, 0.35), 0);
    g.beginPath(); g.moveTo(28, -10); g.lineTo(50, -36); g.lineTo(64, -28); g.lineTo(44, 6); g.closePath(); fillStroke(g, body, 2.5, dark(body, 0.5));
    ell(g, 60, -27, 14, 11, body, 2.5, dark(body, 0.5)); ell(g, 69, -23, 7, 6, strong ? '#d8cfc4' : '#e8e4df', 0);
    poly(g, [[50, -40], [44, -64], [57, -44]], body, 2.5, dark(body, 0.5)); poly(g, [[58, -40], [61, -64], [65, -42]], body, 2.5, dark(body, 0.5));
    circ(g, 58, -31, 2.8, '#2a1a10', 0); if (!strong) line(g, 54, -36, 61, -34, 2, '#2a1a10');
    g.beginPath(); g.moveTo(-42, -4); g.quadraticCurveTo(-54, 4, -52 + sw * 0.3, 20); g.lineWidth = 3; g.strokeStyle = dark(body, 0.5); g.stroke();
    // mane
    for (let i = 0; i < 5; i++) line(g, 36 + i * 4, -18 - i * 5, 32 + i * 4, -24 - i * 5, 3, '#4a3424');
    if (plop > 0) { g.save(); g.globalAlpha = Math.min(1, plop); ell(g, -50, 44, 7, 5, '#6b4a26', 1.5, '#3b2a1a'); ell(g, -40, 46, 6, 4, '#6b4a26', 1.5, '#3b2a1a'); g.restore(); }
    g.restore();
  }
  function cart(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    rr(g, -52, -32, 104, 32, 4, lin(g, 0, -32, 0, 0, [[0, C.woodLight], [1, C.wood]]), 2.5, C.woodDark); rrPath(g, -52, -32, 104, 32, 4); texFill(g, 'wood');
    for (const wx of [-30, 30]) { circ(g, wx, 4, 17, lin(g, 0, -13, 0, 21, [[0, C.wood], [1, C.woodDark]]), 2.5, '#5a3412'); for (let a = 0; a < 6; a++) line(g, wx, 4, wx + Math.cos(a) * 14, 4 + Math.sin(a) * 14, 2, C.woodLight); circ(g, wx, 4, 4, '#5a3412', 0); }
    line(g, 52, -14, 82, -4, 5, C.woodDark);
    g.restore();
  }
  function hay(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(-42, 0); g.quadraticCurveTo(-38, -42, 0, -46); g.quadraticCurveTo(38, -42, 42, 0); g.closePath();
    fillStroke(g, lin(g, 0, -46, 0, 0, [[0, '#ffe58a'], [1, '#d9a92c']]), 2.5, '#9a7310');
    const r = rng(3); for (let i = 0; i < 22; i++) { const hx = -34 + r() * 68; line(g, hx, -2 - r() * 8, hx + r() * 8 - 4, -18 - r() * 22, 1.6, '#b98d1e'); }
    g.restore();
  }
  function blower(g, x, y, s = 1, a = 0, on = false) {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    rr(g, -16, -13, 30, 26, 9, lin(g, 0, -13, 0, 13, [[0, '#ff8a5c'], [1, '#c8401c']]), 2.5, '#7a2410');
    rr(g, 10, -7, 38, 14, 6, lin(g, 0, -7, 0, 7, [[0, '#ffb593'], [1, '#e0693d']]), 2.5, '#7a2410');
    line(g, -6, 13, -12, 26, 5, '#5a1a08');
    if (on) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(52, 0, 10 + i * 9, -0.6, 0.6); g.lineWidth = 2.5; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.stroke(); }
    g.restore();
  }
  function bucket(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-12, -16], [12, -16], [9, 8], [-9, 8]], lin(g, -12, 0, 12, 0, [[0, '#7b8794'], [0.4, '#d2dae2'], [1, '#6c7884']]), 2.5, '#3f4852'); ell(g, 0, -16, 12, 4, C.lime, 2, '#8f8a7a'); g.beginPath(); g.arc(0, -16, 12, Math.PI, 0); g.lineWidth = 2; g.strokeStyle = '#3f4852'; g.stroke(); g.restore(); }
  function menorah(g, x, y, s = 1, lit = [], t = performance.now()) {
    g.save(); g.translate(x, y); g.scale(s, s);
    const gold = lin(g, -100, 0, 100, 0, [[0, C.goldDark], [0.3, C.goldLight], [0.55, C.gold], [1, C.goldDark]]);
    shadow(g, 0, 14, 60, 8);
    rr(g, -44, 0, 88, 14, 4, gold, 2.5, '#7a5410'); rr(g, -24, -14, 48, 16, 4, gold, 2.5, '#7a5410');
    rr(g, -6, -124, 12, 112, 4, gold, 2.5, '#7a5410');
    for (let i = 1; i <= 3; i++) { const r = i * 30; g.beginPath(); g.arc(0, -124, r, 0, Math.PI); g.lineWidth = 12; g.strokeStyle = '#7a5410'; g.stroke(); g.lineWidth = 7.5; g.strokeStyle = gold; g.stroke(); }
    [-90, -60, -30, 0, 30, 60, 90].forEach((lx, i) => { rr(g, lx - 10, -138, 20, 14, 5, gold, 2.5, '#7a5410'); if (lit[i]) { g.fillStyle = rad(g, lx, -150, 2, 40, [[0, 'rgba(255,220,120,0.55)'], [1, 'rgba(255,220,120,0)']]); g.fillRect(lx - 40, -190, 80, 80); flame(g, lx, -142, 1, t); } });
    g.restore();
  }
  function flame(g, x, y, s = 1, t = performance.now()) {
    const f = 1 + Math.sin(t / 90 + x) * 0.08;
    g.save(); g.translate(x, y); g.scale(s, s * f);
    g.beginPath(); g.moveTo(0, -22); g.quadraticCurveTo(11, -6, 0, 2); g.quadraticCurveTo(-11, -6, 0, -22); fillStroke(g, lin(g, 0, -22, 0, 2, [[0, '#ffdd55'], [1, '#ff7b00']]), 1.5, '#d94f00');
    g.beginPath(); g.moveTo(0, -12); g.quadraticCurveTo(5, -3, 0, 1); g.quadraticCurveTo(-5, -3, 0, -12); g.fillStyle = '#fff6c8'; g.fill();
    g.restore();
  }
  function loaf(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); shadow(g, 0, 4, 26, 5); g.beginPath(); g.ellipse(0, 0, 25, 16, 0, Math.PI, 0); g.lineTo(25, 4); g.lineTo(-25, 4); g.closePath(); fillStroke(g, lin(g, 0, -16, 0, 4, [[0, '#f2c27a'], [1, '#b8742c']]), 2.5, '#7a4410'); line(g, -9, -10, -5, -2, 2, '#7a4410'); line(g, 3, -12, 7, -4, 2, '#7a4410'); g.restore(); }
  // a little glowing sparkle to show "you can tap this"
  function sparkle(g, x, y, t, s = 1) {
    const k = (Math.sin(t / 300) + 1) / 2; if (k < 0.4) return;
    g.save(); g.globalAlpha = (k - 0.4) / 0.6; g.translate(x, y); g.scale(s, s);
    line(g, -7, 0, 7, 0, 2.5, '#fff'); line(g, 0, -7, 0, 7, 2.5, '#fff'); g.restore();
  }

  // ---------- tumah ----------
  // A pulsing purple glow with rising motes (only shown once tumah is revealed)
  function tumahGlow(g, x, y, r, level, t = 0) {
    const pulse = 1 + Math.sin(t / 260) * 0.08;
    g.fillStyle = rad(g, x, y, r * 0.15, r * pulse, [[0, 'rgba(155,93,229,0.55)'], [0.6, 'rgba(155,93,229,0.22)'], [1, 'rgba(155,93,229,0)']]);
    g.beginPath(); g.arc(x, y, r * pulse, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 4; i++) { const k = ((t / 1400) + i / 4) % 1; circ(g, x + Math.sin(i * 2.3 + t / 700) * r * 0.5, y - k * r * 1.2, 2.5 * (1 - k) + 0.5, `rgba(200,160,255,${1 - k})`, 0); }
  }
  function badge(g, x, y, label, { color = C.purple } = {}) {
    circ(g, x, y, 14, rad(g, x - 4, y - 4, 1, 16, [[0, light(color, 0.3)], [1, color]]), 2.5, '#fff');
    text(g, String(label), x, y + 1, { size: String(label).length > 1 ? 11 : 16, color: '#fff' });
  }
  function ohelTint(g, pts) { g.save(); path(g, pts, true); g.fillStyle = 'rgba(155,93,229,0.2)'; g.fill(); g.setLineDash([8, 6]); g.lineWidth = 2; g.strokeStyle = 'rgba(155,93,229,0.7)'; g.stroke(); g.setLineDash([]); g.restore(); }
  function vignette(g, a = 0.28) { g.fillStyle = rad(g, 270, 480, 300, 640, [[0, 'rgba(0,0,0,0)'], [1, `rgba(20,10,0,${a})`]]); g.fillRect(0, 0, 540, 960); }

  return {
    C, rng, mix, dark, light, lin, rad, texture, texFill, setLang, font, text, tag, sign, bubble,
    path, rrPath, fillStroke, rr, ell, circ, poly, line, shadow, blob, star,
    sky, cloud, hills, distance, platform, chasm, stairs, ladder, stoneWall, river, tree, bush, rock, tomb, grave, cave, house, walls,
    pin, plank, log, rope, bone, twig, skull, deadMouse, deadFox, barrel, hive, bee, stoneTile, footprint,
    jar, ladle, cup, crate, donkey, cart, hay, blower, bucket, menorah, flame, loaf, sparkle,
    tumahGlow, badge, ohelTint, vignette,
  };
})();

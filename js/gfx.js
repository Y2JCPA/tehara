/* ============================================
   TEHARA: drawing helpers (bright cartoon, thick outlines)
   Everything is drawn in code on a 540x960 canvas.
   ============================================ */
const G = (function () {
  const C = {
    ink: '#3a2a1e',
    skyTop: '#7fcdfb', skyBot: '#dff4ff',
    hill1: '#a6d96a', hill2: '#7fbf4d', hill3: '#5fa83a',
    dirt: '#c99a63', dirtDark: '#a97a45', dirtLight: '#dcb27e',
    stone: '#ecdcb6', stoneShade: '#d6c08f', mortar: '#c3ad7f',
    water: '#4fb3e8', waterDark: '#2f8fc8',
    gold: '#f5c542', goldLight: '#fff1a8', goldDark: '#c8961c',
    wood: '#b9763f', woodDark: '#8a5428', woodLight: '#d89a5e',
    leaf: '#4caf50', leafDark: '#2e7d32', olive: '#8aa860',
    purple: '#9b5de5', purpleGlow: 'rgba(155,93,229,0.38)', ohel: 'rgba(155,93,229,0.22)',
    lime: '#fbfbf2', bone: '#f6f0e1', clay: '#c8693c', clayDark: '#9c4a26',
    metal: '#a9b4bf', metalDark: '#76838f', stoneVessel: '#cfc8bb',
    white: '#ffffff', green: '#3fbf6a', red: '#e5484d',
  };

  // ---------- primitives ----------
  function path(g, pts, close) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    if (close) g.closePath();
  }
  function fillStroke(g, fill, lw = 3, stroke = C.ink) {
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (lw) { g.lineWidth = lw; g.strokeStyle = stroke; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
  }
  function rr(g, x, y, w, h, r, fill, lw, stroke) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    fillStroke(g, fill, lw, stroke);
  }
  function ell(g, x, y, rx, ry, fill, lw, stroke) {
    g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); fillStroke(g, fill, lw, stroke);
  }
  function circ(g, x, y, r, fill, lw, stroke) { ell(g, x, y, r, r, fill, lw, stroke); }
  function poly(g, pts, fill, lw, stroke) { path(g, pts, true); fillStroke(g, fill, lw, stroke); }
  function line(g, x1, y1, x2, y2, lw = 3, stroke = C.ink) {
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineWidth = lw; g.strokeStyle = stroke; g.lineCap = 'round'; g.stroke();
  }
  // seeded random so scenery doesn't flicker
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

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
  // wooden sign on a post
  function sign(g, x, y, s, { w = 150, size = 15, color = '#fffaf0', post = true } = {}) {
    if (post) { rr(g, x - 4, y, 8, 46, 2, C.woodDark, 2.5); }
    const lines = String(s).split('\n');
    const h = 14 + lines.length * (size + 4);
    rr(g, x - w / 2, y - h, w, h, 8, color, 3);
    lines.forEach((ln, i) => text(g, ln, x, y - h + 10 + (size + 4) * (i + 0.5), { size }));
  }
  function bubble(g, x, y, s, { size = 16, maxW = 220, tail = 'down', color = '#fff' } = {}) {
    g.font = font(size);
    const words = String(s).split(' '); const lines = []; let cur = '';
    for (const w of words) { const t2 = cur ? cur + ' ' + w : w; if (g.measureText(t2).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t2; }
    if (cur) lines.push(cur);
    const w = Math.min(maxW, Math.max(...lines.map(l => g.measureText(l).width))) + 24;
    const h = lines.length * (size + 5) + 16;
    const bx = Math.max(6, Math.min(540 - w - 6, x - w / 2)), by = y - h - 14;
    rr(g, bx, by, w, h, 12, color, 3);
    if (tail === 'down') { poly(g, [[x - 9, by + h - 2], [x + 9, by + h - 2], [x, by + h + 12]], color, 0); line(g, x - 9, by + h, x, by + h + 12); line(g, x + 9, by + h, x, by + h + 12); }
    lines.forEach((l, i) => text(g, l, bx + w / 2, by + 8 + (size + 5) * (i + 0.5), { size }));
  }

  // ---------- scenery ----------
  function sky(g, mode = 'day', t = 0, starsN = 0) {
    const grd = g.createLinearGradient(0, 0, 0, 960);
    if (mode === 'night') { grd.addColorStop(0, '#13183d'); grd.addColorStop(1, '#3a3f78'); }
    else if (mode === 'sunset') { grd.addColorStop(0, '#5b6fc4'); grd.addColorStop(0.55, '#f6a35c'); grd.addColorStop(1, '#ffd89b'); }
    else if (mode === 'indoor') { grd.addColorStop(0, '#5a4630'); grd.addColorStop(1, '#3d2f20'); }
    else { grd.addColorStop(0, C.skyTop); grd.addColorStop(1, C.skyBot); }
    g.fillStyle = grd; g.fillRect(0, 0, 540, 960);
    if (mode === 'day') { cloud(g, 90 + Math.sin(t / 4000) * 12, 90, 1); cloud(g, 400 + Math.cos(t / 5000) * 10, 150, 0.8); }
    if (mode === 'night' || mode === 'sunset') {
      const pts = [[120, 80], [300, 60], [440, 110], [210, 140], [370, 40], [70, 170]];
      for (let i = 0; i < Math.min(starsN, pts.length); i++) star(g, pts[i][0], pts[i][1], 9 + (i < 3 ? 3 : 0), '#fff6b0');
    }
  }
  function star(g, x, y, r, fill) {
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr2 = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr2, y + Math.sin(a) * rr2]); }
    poly(g, pts, fill, 2);
  }
  function cloud(g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.arc(-30, 6, 22, 0, 7); g.arc(0, -8, 28, 0, 7); g.arc(32, 6, 22, 0, 7); g.rect(-30, 6, 62, 22);
    g.fillStyle = '#fff'; g.fill(); g.restore();
  }
  function hills(g, y, color, seed = 1, amp = 40) {
    const r = rng(seed); g.beginPath(); g.moveTo(0, 960); g.lineTo(0, y);
    for (let x = 0; x <= 540; x += 90) g.quadraticCurveTo(x + 45, y - amp * (0.4 + r()), x + 90, y + (r() - 0.5) * 20);
    g.lineTo(540, 960); g.closePath(); g.fillStyle = color; g.fill();
  }
  function ground(g, x, y, w, h, kind = 'dirt') {
    const top = kind === 'grass' ? C.hill2 : kind === 'field' ? '#d8b56f' : C.dirt;
    rr(g, x, y, w, h, 6, kind === 'field' ? '#c49b56' : C.dirtDark, 3);
    rr(g, x, y, w, Math.min(18, h), 6, top, 0);
    line(g, x + 4, y + 1.5, x + w - 4, y + 1.5, 3, C.ink);
    if (kind === 'grass') { const r = rng(x + y); for (let i = 0; i < w / 14; i++) { const gx = x + 6 + r() * (w - 12); line(g, gx, y + 2, gx - 3, y - 6, 2.5, C.hill3); } }
  }
  // Jerusalem stone blocks
  function stoneWall(g, x, y, w, h, { block = 34, seed = 3, shade = true } = {}) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = C.mortar; g.fillRect(x, y, w, h);
    const r = rng(seed); const bh = block * 0.62;
    for (let row = 0, yy = y; yy < y + h; row++, yy += bh) {
      let xx = x - (row % 2 ? block / 2 : 0);
      while (xx < x + w) {
        const bw = block * (0.8 + r() * 0.5);
        const tone = r(); const fill = tone < 0.33 ? C.stone : tone < 0.66 ? '#e4d2a8' : '#f1e3c2';
        rr(g, xx + 1.5, yy + 1.5, bw - 3, bh - 3, 3, fill, 0);
        if (shade) { g.fillStyle = 'rgba(160,130,80,0.18)'; g.fillRect(xx + 1.5, yy + bh - 7, bw - 3, 5.5); }
        xx += bw;
      }
    }
    g.restore();
    rr(g, x, y, w, h, 2, null, 3);
  }
  function river(g, x, y, w, h, t = 0) {
    rr(g, x, y, w, h, 10, C.water, 3);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    for (let i = 0; i < 6; i++) { const yy = y + 12 + i * (h / 6); const off = (t / 30 + i * 40) % 80; for (let xx = x - 80 + off; xx < x + w; xx += 80) line(g, xx, yy, xx + 26, yy, 3, 'rgba(255,255,255,0.55)'); }
    g.restore();
  }
  function tree(g, x, y, s = 1, kind = 'terebinth') {
    g.save(); g.translate(x, y); g.scale(s, s);
    poly(g, [[-12, 0], [12, 0], [7, -70], [-7, -70]], C.wood, 3);
    const col = kind === 'olive' ? C.olive : C.leaf;
    const dk = kind === 'olive' ? '#6b8a45' : C.leafDark;
    circ(g, -34, -88, 34, dk, 3); circ(g, 34, -88, 34, dk, 3); circ(g, 0, -118, 42, col, 3);
    circ(g, -24, -100, 26, col, 0); circ(g, 22, -98, 26, col, 0);
    if (kind === 'olive') { for (const [ox, oy] of [[-20, -110], [10, -125], [26, -96], [-32, -86]]) ell(g, ox, oy, 4, 6, '#3f4a2a', 0); }
    g.restore();
  }
  function grave(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.ellipse(0, 0, 54, 26, 0, Math.PI, 0); g.closePath(); fillStroke(g, '#bfae8a', 3);
    for (const [sx, sy] of [[-26, -8], [0, -16], [24, -8], [-10, -4], [14, -5]]) ell(g, sx, sy, 10, 6, '#d8c9a5', 2);
    rr(g, -10, -56, 20, 40, 8, '#e3dccb', 3);
    line(g, -4, -42, 4, -42, 2.5); line(g, -4, -34, 4, -34, 2.5);
    g.restore();
  }
  function cave(g, x, y, w, h, { closed = true, label } = {}) {
    // hillside with a carved door
    g.beginPath(); g.moveTo(x - 30, y + h); g.quadraticCurveTo(x + w / 2, y - h * 0.9, x + w + 30, y + h); g.closePath(); fillStroke(g, '#b9a274', 3);
    const dw = w * 0.42, dh = h * 0.62, dx = x + w / 2 - dw / 2, dy = y + h - dh;
    g.beginPath(); g.moveTo(dx, y + h); g.lineTo(dx, dy + dw / 2); g.arc(dx + dw / 2, dy + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw, y + h); g.closePath();
    fillStroke(g, '#2a2018', 3);
    if (closed) circ(g, dx + dw / 2 + dw * 0.25, y + h - dw * 0.45, dw * 0.48, '#a59473', 3);
    if (label) sign(g, x + w + 10, y + h - 50, label, { w: 120, size: 13 });
  }
  function house(g, x, y, w, h, { door = true, roof = '#c65d3b' } = {}) {
    stoneWall(g, x, y, w, h, { block: 28 });
    poly(g, [[x - 10, y + 2], [x + w + 10, y + 2], [x + w - 6, y - 20], [x + 6, y - 20]], roof, 3);
    if (door) rr(g, x + w / 2 - 14, y + h - 40, 28, 40, 12, C.woodDark, 3);
  }
  function walls(g, x, y, w, h) { // Yerushalayim city wall with crenellations and a gate
    stoneWall(g, x, y, w, h, { block: 40, seed: 9 });
    for (let xx = x; xx < x + w - 10; xx += 36) rr(g, xx + 4, y - 18, 22, 20, 2, '#efe1bf', 3);
    const gw = 70; g.beginPath(); g.moveTo(x + w / 2 - gw / 2, y + h); g.lineTo(x + w / 2 - gw / 2, y + h - 70); g.arc(x + w / 2, y + h - 70, gw / 2, Math.PI, 0); g.lineTo(x + w / 2 + gw / 2, y + h); g.closePath(); fillStroke(g, '#5a3f22', 3);
  }

  // ---------- props ----------
  // A golden pin from (x1,y1) handle-end to (x2,y2). t = 0..1 pulled out along its axis.
  function pin(g, x1, y1, x2, y2, t = 0, { hot = false } = {}) {
    const dx = x1 - x2, dy = y1 - y2, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const off = t * (L + 40);
    const ax = x1 + ux * off, ay = y1 + uy * off, bx = x2 + ux * off, by = y2 + uy * off;
    line(g, ax, ay, bx, by, 13, C.ink); line(g, ax, ay, bx, by, 8, C.gold); line(g, ax, ay - 2, bx, by - 2, 2.5, C.goldLight);
    const rx = ax + ux * 16, ry = ay + uy * 16;
    circ(g, rx, ry, 17, null, 12, C.ink); circ(g, rx, ry, 17, null, 7, hot ? '#ffe680' : C.gold);
    return { rx, ry };
  }
  function plank(g, x, y, w, angle = 0, h = 14) {
    g.save(); g.translate(x, y); g.rotate(angle); rr(g, -w / 2, -h / 2, w, h, 4, C.woodLight, 3);
    line(g, -w / 2 + 10, 0, w / 2 - 10, 0, 1.5, C.woodDark); g.restore();
  }
  function log(g, x, y, w, angle = 0) {
    g.save(); g.translate(x, y); g.rotate(angle);
    rr(g, -w / 2, -11, w, 22, 11, C.wood, 3); ell(g, w / 2 - 8, 0, 7, 10, C.woodLight, 2.5);
    line(g, -w / 2 + 16, -3, w / 2 - 30, -3, 1.5, C.woodDark); g.restore();
  }
  function rope(g, x1, y1, x2, y2) { line(g, x1, y1, x2, y2, 5, C.ink); line(g, x1, y1, x2, y2, 3, '#d9b77a'); }
  function bone(g, x, y, s = 1, a = 0, glow = false) {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    if (glow) circ(g, 0, 0, 24, C.purpleGlow, 0);
    rr(g, -14, -4, 28, 8, 4, C.bone, 2.5);
    for (const sx of [-14, 14]) { circ(g, sx, -4, 5, C.bone, 2.5); circ(g, sx, 4, 5, C.bone, 2.5); }
    rr(g, -12, -3, 24, 6, 3, C.bone, 0);
    g.restore();
  }
  function skull(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    circ(g, 0, 0, 20, C.bone, 3); rr(g, -11, 12, 22, 12, 4, C.bone, 3);
    circ(g, -7, -1, 5.5, C.ink, 0); circ(g, 7, -1, 5.5, C.ink, 0); poly(g, [[0, 6], [-3, 11], [3, 11]], C.ink, 0);
    line(g, -4, 18, -4, 23, 2); line(g, 4, 18, 4, 23, 2);
    g.restore();
  }
  function deadMouse(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    ell(g, 0, 0, 18, 11, '#9e9e9e', 3); circ(g, 16, -2, 8, '#a8a8a8', 3); circ(g, 13, -10, 5, '#f4b6c2', 2.5);
    line(g, 12, -4, 16, 0, 2); line(g, 16, -4, 12, 0, 2);
    for (const lx of [-8, 0, 8]) line(g, lx, 8, lx, 16, 2.5);
    g.beginPath(); g.moveTo(-18, 2); g.quadraticCurveTo(-34, -6, -38, 6); g.lineWidth = 2.5; g.strokeStyle = C.ink; g.stroke();
    g.restore();
  }
  function barrel(g, x, y, s = 1, tipped = 0) {
    g.save(); g.translate(x, y); g.rotate(tipped); g.scale(s, s);
    rr(g, -22, -30, 44, 60, 12, C.wood, 3); line(g, -22, -14, 22, -14, 3); line(g, -22, 14, 22, 14, 3);
    if (!tipped) ell(g, 0, -30, 22, 6, C.water, 3);
    g.restore();
  }
  function hive(g, x, y, s = 1, wet = false) {
    g.save(); g.translate(x, y); g.scale(s, s);
    for (let i = 0; i < 4; i++) ell(g, 0, -i * 11, 24 - i * 4, 8, wet ? '#c9a24a' : '#f2c14e', 3);
    circ(g, 0, 10, 5, C.ink, 0);
    g.restore();
  }
  function bee(g, x, y) { ell(g, x, y, 6, 4.5, '#ffd23f', 2); line(g, x - 1, y - 4, x - 1, y + 4, 2); ell(g, x - 2, y - 6, 4, 3, 'rgba(255,255,255,0.8)', 1.5); }
  function stoneTile(g, x, y, r, { wobbly = false, wob = 0, tested = false } = {}) {
    g.save(); g.translate(x, y); g.rotate(wob);
    const col = wobbly ? '#c9c2b3' : '#b7b0a1';
    ell(g, 0, 4, r, r * 0.55, '#8d8678', 3); ell(g, 0, 0, r, r * 0.55, col, 3);
    ell(g, -r * 0.3, -r * 0.15, r * 0.25, r * 0.12, 'rgba(255,255,255,0.45)', 0);
    g.restore();
    if (tested) text(g, wobbly ? '✗' : '✓', x, y - r * 0.9, { size: 18, color: wobbly ? C.red : C.green, outline: 4 });
  }
  function footprint(g, x, y, a = 0, alpha = 0.5) {
    g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha = alpha; ell(g, 0, 0, 4, 7, '#7a5530', 0); circ(g, 0, -9, 2.5, '#7a5530', 0); g.restore();
  }
  // material: clay | stone | metal ; seal: 'kg' | 'ord' | 'none' | 'broken' ; sealed (plaster), loose (cloth)
  function jar(g, x, y, s = 1, { material = 'clay', sealed = false, loose = false, seal = null, flask = false } = {}) {
    g.save(); g.translate(x, y); g.scale(s, s);
    const fill = material === 'stone' ? C.stoneVessel : material === 'metal' ? C.metal : C.clay;
    const dark = material === 'stone' ? '#a9a191' : material === 'metal' ? C.metalDark : C.clayDark;
    if (flask) { ell(g, 0, -14, 18, 22, fill, 3); rr(g, -6, -46, 12, 14, 3, fill, 3); }
    else {
      g.beginPath(); g.moveTo(-10, -44); g.quadraticCurveTo(-30, -28, -24, -4); g.quadraticCurveTo(-18, 6, 0, 6); g.quadraticCurveTo(18, 6, 24, -4); g.quadraticCurveTo(30, -28, 10, -44); g.closePath();
      fillStroke(g, fill, 3);
      g.beginPath(); g.moveTo(-16, -26); g.quadraticCurveTo(0, -20, 16, -26); g.lineWidth = 2; g.strokeStyle = dark; g.stroke();
      rr(g, -12, -52, 24, 10, 4, fill, 3);
      if (material === 'stone') { line(g, -14, -12, -6, -12, 2, dark); line(g, 6, -16, 14, -16, 2, dark); }
      if (material === 'metal') ell(g, -10, -20, 4, 10, 'rgba(255,255,255,0.5)', 0);
    }
    const topY = flask ? -46 : -52;
    if (sealed) { rr(g, -14, topY - 8, 28, 10, 5, '#a0785a', 3); }
    if (loose) { g.beginPath(); g.moveTo(-16, topY + 2); g.quadraticCurveTo(0, topY - 18, 16, topY + 2); g.quadraticCurveTo(20, topY + 10, 10, topY + 6); fillStroke(g, '#e8e0cc', 2.5); }
    if (seal) {
      const sy = topY - 4;
      if (seal === 'broken') { circ(g, -6, sy, 7, '#c0392b', 2.5); poly(g, [[4, sy - 5], [12, sy - 2], [6, sy + 6]], '#c0392b', 2.5); }
      else if (seal !== 'none') { circ(g, 0, sy, 9, seal === 'kg' ? '#c0392b' : '#8d6e63', 2.5); if (seal === 'kg') star(g, 0, sy, 5, C.gold); }
    }
    g.restore();
  }
  function ladle(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); line(g, 0, -40, 0, 0, 7, C.ink); line(g, 0, -40, 0, 0, 4, C.metal); ell(g, 0, 6, 12, 8, C.metal, 3); g.restore(); }
  function cup(g, x, y, s = 1, material = 'stone') {
    g.save(); g.translate(x, y); g.scale(s, s);
    poly(g, [[-16, -22], [16, -22], [11, 6], [-11, 6]], material === 'stone' ? C.stoneVessel : material === 'metal' ? C.metal : C.clay, 3);
    g.restore();
  }
  function crate(g, x, y, w, h) { rr(g, x, y, w, h, 3, C.woodLight, 3); line(g, x + 4, y + 4, x + w - 4, y + h - 4, 2.5, C.woodDark); line(g, x + w - 4, y + 4, x + 4, y + h - 4, 2.5, C.woodDark); }
  function donkey(g, x, y, s = 1, { strong = true, phase = 0, dir = 1 } = {}) {
    g.save(); g.translate(x, y); g.scale(s * dir, s);
    const body = strong ? '#9e8a78' : '#b8aca0';
    const legSwing = Math.sin(phase) * 6, wob = strong ? 0 : Math.sin(phase * 3) * 3;
    for (const lx of [-26, -12, 14, 28]) { const sw = (lx > 0 ? legSwing : -legSwing); rr(g, lx - 4 + (strong ? 0 : wob * (lx > 0 ? 1 : -1)), 6, 8, 34 + sw * 0.2, 3, body, 3); }
    ell(g, 0, 0, 40, 22, body, 3);
    poly(g, [[30, -8], [52, -34], [64, -26], [44, 4]], body, 3);
    ell(g, 60, -26, 13, 10, body, 3); ell(g, 68, -22, 6, 5, '#d8cfc4', 0);
    poly(g, [[50, -40], [46, -60], [56, -44]], body, 3); poly(g, [[58, -40], [60, -60], [64, -42]], body, 3);
    circ(g, 58, -30, 2.5, C.ink, 0);
    g.beginPath(); g.moveTo(-40, -4); g.quadraticCurveTo(-52, 4, -50, 18); g.lineWidth = 3; g.strokeStyle = C.ink; g.stroke();
    if (!strong) { text(g, '~', -26, 46, { size: 14 }); }
    g.restore();
  }
  function cart(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    rr(g, -50, -30, 100, 30, 4, C.woodLight, 3); circ(g, -30, 4, 16, C.wood, 3); circ(g, 30, 4, 16, C.wood, 3);
    circ(g, -30, 4, 4, C.ink, 0); circ(g, 30, 4, 4, C.ink, 0); line(g, 50, -14, 80, -4, 4);
    g.restore();
  }
  function hay(g, x, y, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(-40, 0); g.quadraticCurveTo(-36, -40, 0, -44); g.quadraticCurveTo(36, -40, 40, 0); g.closePath(); fillStroke(g, '#f2cf5b', 3);
    for (let i = -30; i <= 30; i += 10) line(g, i, -4, i + 4, -30, 2, '#c99e2a');
    g.restore();
  }
  function blower(g, x, y, s = 1, a = 0, on = false) {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    rr(g, -14, -12, 28, 24, 8, '#e85d3a', 3); rr(g, 12, -6, 34, 12, 5, '#f39a73', 3); line(g, -6, 12, -12, 24, 4);
    if (on) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(48, 0, 10 + i * 9, -0.6, 0.6); g.lineWidth = 2.5; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.stroke(); }
    g.restore();
  }
  function bucket(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-12, -16], [12, -16], [9, 8], [-9, 8]], '#9aa7b3', 3); ell(g, 0, -16, 12, 4, C.lime, 2.5); g.beginPath(); g.arc(0, -16, 12, Math.PI, 0); g.lineWidth = 2; g.strokeStyle = C.ink; g.stroke(); g.restore(); }
  function menorah(g, x, y, s = 1, lit = []) {
    g.save(); g.translate(x, y); g.scale(s, s);
    rr(g, -40, 0, 80, 14, 4, C.gold, 3); rr(g, -6, -120, 12, 122, 4, C.gold, 3);
    for (let i = 1; i <= 3; i++) { const r = i * 30; g.beginPath(); g.arc(0, -120, r, 0, Math.PI); g.lineWidth = 11; g.strokeStyle = C.ink; g.stroke(); g.lineWidth = 6; g.strokeStyle = C.gold; g.stroke(); }
    const xs = [-90, -60, -30, 0, 30, 60, 90];
    xs.forEach((lx, i) => { rr(g, lx - 9, -134, 18, 12, 4, C.gold, 3); if (lit[i]) flame(g, lx, -140, 1); });
    g.restore();
  }
  function flame(g, x, y, s = 1, t = performance.now()) {
    const f = 1 + Math.sin(t / 90 + x) * 0.08;
    g.save(); g.translate(x, y); g.scale(s, s * f);
    g.beginPath(); g.moveTo(0, -20); g.quadraticCurveTo(10, -6, 0, 2); g.quadraticCurveTo(-10, -6, 0, -20); fillStroke(g, '#ffb703', 2, '#e85d04');
    g.beginPath(); g.moveTo(0, -11); g.quadraticCurveTo(5, -3, 0, 1); g.quadraticCurveTo(-5, -3, 0, -11); g.fillStyle = '#fff3b0'; g.fill();
    g.restore();
  }
  function loaf(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.ellipse(0, 0, 24, 15, 0, Math.PI, 0); g.lineTo(24, 4); g.lineTo(-24, 4); g.closePath(); fillStroke(g, '#e0a458', 3); line(g, -8, -10, -4, -2, 2); line(g, 4, -12, 8, -4, 2); g.restore(); }

  // ---------- tumah ----------
  // A soft pulsing glow plus a badge: 'av' | 1 | 2 | 3 | 'tm' (tamei met)
  function tumahGlow(g, x, y, r, level, t = 0) {
    const pulse = 1 + Math.sin(t / 260) * 0.08;
    const grd = g.createRadialGradient(x, y, r * 0.2, x, y, r * pulse);
    grd.addColorStop(0, 'rgba(155,93,229,0.55)'); grd.addColorStop(1, 'rgba(155,93,229,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r * pulse, 0, Math.PI * 2); g.fill();
  }
  function badge(g, x, y, label, { color = C.purple } = {}) {
    circ(g, x, y, 14, color, 3); text(g, String(label), x, y + 1, { size: label.length > 1 ? 11 : 16, color: '#fff' });
  }
  function ohelTint(g, pts) { poly(g, pts, C.ohel, 0); }

  return {
    C, rng, setLang, font, text, sign, bubble,
    path, fillStroke, rr, ell, circ, poly, line, star,
    sky, cloud, hills, ground, stoneWall, river, tree, grave, cave, house, walls,
    pin, plank, log, rope, bone, skull, deadMouse, barrel, hive, bee, stoneTile, footprint,
    jar, ladle, cup, crate, donkey, cart, hay, blower, bucket, menorah, flame, loaf,
    tumahGlow, badge, ohelTint,
  };
})();

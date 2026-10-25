/* ============================================
   TEHARA: characters (storybook chibi). Feet are at (x, y).
   Eli and Yehuda wear white linen and a white cap, Kohen-style.
   The real bigdei kehunah are only for the Mikdash, so on the road
   it's everyday white clothes.
   ============================================ */
const Chars = (function () {
  const { C, rr, ell, circ, poly, line, lin, rad, dark, light } = G;
  const LOOKS = {
    eli:      { skin: '#f6cfa6', hair: '#a8461f', robe: '#fbfbf7', cap: 'kohen', sash: '#e9e9e2' },
    yehuda:   { skin: '#e9b98c', hair: '#2b1d14', robe: '#fbfbf7', cap: 'kohen', sash: '#e9e9e2', curls: true },
    gad:      { skin: '#e0ab7c', hair: '#5a3a1e', robe: '#5e9e48', cap: 'straw', beard: '#5a3a1e', sash: '#8a5a2c' },
    zevulun:  { skin: '#f0c7a3', hair: '#ececec', robe: '#8d6e63', cap: 'none', beard: '#fafafa', longBeard: true, cane: true, bald: true, sash: '#5d4037' },
    miriam:   { skin: '#f6cfa6', hair: '#a8461f', robe: '#d9536f', cap: 'scarf', scarf: '#4a7bd0', basket: true },
    batya:    { skin: '#d9a477', hair: '#3b2416', robe: '#f0a43a', cap: 'scarf', scarf: '#f6d860' },
    helper:   { skin: '#e2b088', hair: '#3b2416', robe: '#a47148', cap: 'none', beard: '#3b2416', sash: '#6d4a2c' },
    kohen:    { skin: '#efc6a2', hair: '#4a3020', robe: '#fbfbf7', cap: 'kohen', sash: '#e9e9e2', beard: '#4a3020', tall: true },
    pilgrimA: { skin: '#e8b98d', hair: '#2b1d14', robe: '#4f86e0', cap: 'none', beard: '#2b1d14', sash: '#2f5fb0' },
    pilgrimB: { skin: '#f3c9a0', hair: '#6b3b1b', robe: '#e27d60', cap: 'scarf', scarf: '#85c7a2' },
    pilgrimC: { skin: '#d9a477', hair: '#1f140c', robe: '#9b72cf', cap: 'none', sash: '#6f4aa8' },
    farmer:   { skin: '#d9a477', hair: '#3b2416', robe: '#c9a227', cap: 'straw', beard: '#3b2416', sash: '#7a5a10' },
  };

  function draw(g, kind, x, y, { dir = 1, phase = 0, mood = 'idle', s = 1, walking = false, hold = null, glow = null, t = 0 } = {}) {
    const L = LOOKS[kind] || LOOKS.eli;
    const S = s * (L.tall ? 1.08 : 1);
    g.save(); g.translate(x, y);
    G.shadow(g, 0, 1, 24 * S, 6 * S, 0.28);
    if (glow) G.tumahGlow(g, 0, -48 * S, 66 * S, glow, t);
    g.scale(S * dir, S);
    const sw = walking ? Math.sin(phase) : 0;
    const breathe = walking ? 0 : Math.sin(t / 600 + x) * 0.8;
    const bob = walking ? Math.abs(Math.sin(phase)) * 2.5 : 0;
    const robe = L.robe, robeDk = dark(robe, robe === '#fbfbf7' ? 0.18 : 0.3), robeLt = light(robe, 0.25);
    // legs and sandals
    for (const [lx, k] of [[-6, 1], [6, -1]]) {
      const off = sw * 7 * k;
      rr(g, lx - 4 + off * 0.6, -18, 8, 18, 3, L.skin, 2, dark(L.skin, 0.45));
      ell(g, lx + off * 0.6 + 1, -1, 8, 4, '#7a4a24', 2, '#4a2a10');
    }
    g.translate(0, -bob);
    // robe body with folds
    g.beginPath(); g.moveTo(-15, -58 + breathe); g.quadraticCurveTo(-18, -40, -22, -15); g.quadraticCurveTo(0, -10, 22, -15); g.quadraticCurveTo(18, -40, 15, -58 + breathe); g.closePath();
    g.fillStyle = lin(g, -22, 0, 22, 0, [[0, robeLt], [0.5, robe], [1, robeDk]]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = dark(robe, 0.55); g.stroke();
    line(g, -6, -40, -9, -16, 1.5, dark(robe, 0.25)); line(g, 7, -40, 10, -16, 1.5, dark(robe, 0.25));
    if (L.sash) rr(g, -17, -38, 34, 7, 3, lin(g, 0, -38, 0, -31, [[0, light(L.sash, 0.2)], [1, dark(L.sash, 0.15)]]), 1.8, dark(L.sash, 0.5));
    // arms
    const aA = mood === 'happy' ? -2.3 : mood === 'no' ? -1.3 : walking ? -sw * 0.55 : 0.18 + breathe * 0.02;
    const aB = mood === 'happy' ? 2.3 : walking ? sw * 0.55 : -0.18;
    arm(g, -14, -54 + breathe, aA, L, robe);
    if (L.basket) { rr(g, 12, -36, 24, 15, 5, lin(g, 0, -36, 0, -21, [[0, '#e6b56a'], [1, '#b8803a']]), 2, '#7a4a14'); line(g, 14, -36, 34, -36, 2, '#7a4a14'); circ(g, 19, -38, 4.5, '#f2c14e', 1.5, '#9a6a10'); circ(g, 28, -39, 4.5, '#8bc34a', 1.5, '#4a7a20'); }
    if (L.cane) line(g, 22, -44, 27, 0, 4, C.woodDark);
    if (hold === 'blower') G.blower(g, 26, -40, 0.7, 0, false);
    if (hold === 'bucket') G.bucket(g, 22, -28, 0.9);
    if (hold === 'lamp') { G.flame(g, 26, -66, 0.8, t); rr(g, 20, -62, 12, 8, 3, G.C.clay, 1.5); }
    if (hold === 'jug') G.jar(g, 24, -30, 0.45, { material: 'clay', seal: 'kg' });
    arm(g, 14, -54 + breathe, -aB, L, robe);
    // head
    const hy = -76 + breathe;
    if (L.cap === 'scarf') { g.beginPath(); g.ellipse(0, hy + 2, 22, 24, 0, Math.PI * 0.85, Math.PI * 2.15, false); g.lineTo(19, hy + 22); g.lineTo(-19, hy + 22); g.closePath(); G.fillStroke(g, lin(g, -20, 0, 20, 0, [[0, light(L.scarf, 0.2)], [1, dark(L.scarf, 0.2)]]), 2.5, dark(L.scarf, 0.5)); }
    circ(g, 0, hy, 20, rad(g, -6, hy - 8, 2, 24, [[0, light(L.skin, 0.25)], [0.7, L.skin], [1, dark(L.skin, 0.12)]]), 2.5, dark(L.skin, 0.5));
    // ear
    ell(g, -18, hy + 2, 4, 5.5, L.skin, 2, dark(L.skin, 0.5));
    if (!L.bald && L.cap !== 'scarf') {
      g.beginPath(); g.arc(0, hy - 2, 20.5, Math.PI * 1.02, Math.PI * 1.98); g.quadraticCurveTo(12, hy - 6, 4, hy - 9); g.quadraticCurveTo(-6, hy - 4, -20, hy - 2); g.closePath();
      G.fillStroke(g, lin(g, 0, hy - 22, 0, hy, [[0, light(L.hair, 0.15)], [1, dark(L.hair, 0.15)]]), 2.2, dark(L.hair, 0.5));
      if (L.curls) for (const cx of [-15, -7, 3, 12]) circ(g, cx, hy - 16, 5.5, L.hair, 1.8, dark(L.hair, 0.5));
      line(g, -12, hy - 12, -6, hy - 16, 1.5, light(L.hair, 0.3));
    }
    if (L.bald) { circ(g, -18, hy + 2, 6, L.hair, 1.5, '#bbb'); circ(g, 18, hy + 2, 6, L.hair, 1.5, '#bbb'); }
    if (L.cap === 'scarf') { g.beginPath(); g.arc(0, hy - 2, 21, Math.PI, Math.PI * 2); g.lineTo(21, hy + 3); g.quadraticCurveTo(0, hy - 9, -21, hy + 3); g.closePath(); G.fillStroke(g, lin(g, 0, hy - 24, 0, hy, [[0, light(L.scarf, 0.25)], [1, L.scarf]]), 2.5, dark(L.scarf, 0.5)); }
    if (L.cap === 'kohen') { // a rounded white linen cap, wrapped
      g.beginPath(); g.moveTo(-19, hy - 9); g.quadraticCurveTo(-21, hy - 32, 0, hy - 33); g.quadraticCurveTo(21, hy - 32, 19, hy - 9); g.quadraticCurveTo(0, hy - 13, -19, hy - 9); g.closePath();
      G.fillStroke(g, lin(g, -20, 0, 20, 0, [[0, '#ffffff'], [0.6, '#f2f2ec'], [1, '#d6d8d4']]), 2.5, '#9a9c96');
      for (const yy of [hy - 15, hy - 21, hy - 27]) { g.beginPath(); g.moveTo(-17, yy + 2); g.quadraticCurveTo(0, yy - 3, 17, yy + 2); g.lineWidth = 1.3; g.strokeStyle = '#c6c8c2'; g.stroke(); }
    }
    if (L.cap === 'straw') { ell(g, 0, hy - 13, 32, 8, lin(g, 0, hy - 21, 0, hy - 5, [[0, '#f5d27a'], [1, '#c9a043']]), 2.5, '#8a6a1a'); g.beginPath(); g.ellipse(0, hy - 15, 17, 13, 0, Math.PI, 0); G.fillStroke(g, lin(g, 0, hy - 28, 0, hy - 15, [[0, '#f5d27a'], [1, '#d4ab4b']]), 2.5, '#8a6a1a'); rr(g, -16, hy - 18, 32, 5, 2, '#c0392b', 0); }
    if (L.beard) {
      g.beginPath(); g.moveTo(-17, hy + 3);
      if (L.longBeard) { g.quadraticCurveTo(-12, hy + 44, 0, hy + 48); g.quadraticCurveTo(12, hy + 44, 17, hy + 3); }
      else { g.quadraticCurveTo(-9, hy + 24, 0, hy + 24); g.quadraticCurveTo(9, hy + 24, 17, hy + 3); }
      g.quadraticCurveTo(0, hy + 13, -17, hy + 3);
      G.fillStroke(g, lin(g, 0, hy, 0, hy + 40, [[0, light(L.beard, 0.15)], [1, dark(L.beard, 0.1)]]), 2.2, dark(L.beard, 0.45));
    }
    face(g, hy, mood, L);
    g.restore();
  }
  function arm(g, x, y, a, L, robe) {
    g.save(); g.translate(x, y); g.rotate(a);
    rr(g, -5, 0, 10, 23, 5, lin(g, -5, 0, 5, 0, [[0, light(robe, 0.15)], [1, dark(robe, 0.2)]]), 2, dark(robe, 0.55));
    circ(g, 0, 25, 5, L.skin, 2, dark(L.skin, 0.5));
    g.restore();
  }
  function face(g, hy, mood, L) {
    const ink = '#2b1b12';
    if (mood === 'sleep') { line(g, -10, hy, -3, hy, 2.5, ink); line(g, 4, hy, 11, hy, 2.5, ink); return; }
    for (const ex of [-6.5, 7.5]) {
      ell(g, ex, hy - 0.5, 3.3, 4.3, '#2b1b12', 0);
      circ(g, ex + 1.1, hy - 2, 1.4, '#fff', 0); circ(g, ex - 0.8, hy + 1.6, 0.6, 'rgba(255,255,255,0.7)', 0);
    }
    line(g, -10, hy - 9, -3, hy - 10, 2, dark(L.hair, 0.3)); line(g, 4, hy - 10, 11, hy - 9, 2, dark(L.hair, 0.3));
    ell(g, -11, hy + 7, 4, 2.2, 'rgba(240,110,110,0.4)', 0); ell(g, 12, hy + 7, 4, 2.2, 'rgba(240,110,110,0.4)', 0);
    ell(g, 1.5, hy + 4, 2, 1.5, dark(L.skin, 0.25), 0);
    g.beginPath();
    if (mood === 'happy') { g.moveTo(-5, hy + 8); g.quadraticCurveTo(1, hy + 16, 7, hy + 8); g.closePath(); g.fillStyle = '#8a2a20'; g.fill(); g.lineWidth = 2; g.strokeStyle = ink; g.stroke(); }
    else if (mood === 'sad' || mood === 'no') { g.arc(1, hy + 14, 5, 1.15 * Math.PI, 1.85 * Math.PI); g.lineWidth = 2.5; g.strokeStyle = ink; g.stroke(); }
    else if (mood === 'oh') { ell(g, 1, hy + 10, 3.5, 4.5, '#8a2a20', 2, ink); }
    else { g.arc(1, hy + 6, 4.5, 0.2 * Math.PI, 0.8 * Math.PI); g.lineWidth = 2.3; g.strokeStyle = ink; g.stroke(); }
  }

  // ---------- an actor that walks along a path ----------
  class Actor {
    constructor(kind, x, y, opts = {}) {
      Object.assign(this, { kind, x, y, dir: 1, phase: 0, mood: 'idle', s: 1, path: [], speed: 150, glow: null, badge: null, hold: null, visible: true }, opts);
      this.onArrive = null; this.say = null; this.sayUntil = 0;
    }
    walk(pts, onArrive, speed) { this.path = pts.slice(); this.onArrive = onArrive || null; if (speed) this.speed = speed; }
    get walking() { return this.path.length > 0; }
    update(dt) {
      if (!this.path.length) return;
      const [tx, ty] = this.path[0];
      const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
      const step = this.speed * dt;
      if (Math.abs(dx) > 0.5) this.dir = dx > 0 ? 1 : -1;
      this.phase += dt * 11;
      if (d <= step) {
        this.x = tx; this.y = ty; this.path.shift();
        if (!this.path.length) { const cb = this.onArrive; this.onArrive = null; if (cb) cb(this); }
      } else { this.x += dx / d * step; this.y += dy / d * step; }
    }
    talk(textStr, ms = 2400) { this.say = textStr; this.sayUntil = performance.now() + ms; }
    draw(g, t) {
      if (!this.visible) return;
      draw(g, this.kind, this.x, this.y, { dir: this.dir, phase: this.phase, mood: this.mood, s: this.s, walking: this.walking, hold: this.hold, glow: this.glow, t });
      if (this.badge != null) G.badge(g, this.x + 24 * this.s, this.y - 108 * this.s, this.badge);
    }
    drawBubble(g) {
      if (this.say && performance.now() < this.sayUntil) G.bubble(g, this.x, this.y - 112 * this.s, this.say, { size: 15 });
    }
  }

  return { draw, Actor, LOOKS };
})();

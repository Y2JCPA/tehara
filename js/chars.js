/* ============================================
   TEHARA: characters (chibi style). Feet are at (x, y).
   Eli and Yehuda wear plain white linen and a white cap. The real
   bigdei kehunah are only worn in the Mikdash, so on the road it's
   everyday white clothes.
   ============================================ */
const Chars = (function () {
  const { C, rr, ell, circ, poly, line } = G;
  const LOOKS = {
    eli:      { skin: '#f3c9a0', hair: '#9a3f1c', robe: '#fbfbf8', trim: '#d9d9d2', cap: 'kohen', belt: '#e8e8e0' },
    yehuda:   { skin: '#e8b98d', hair: '#2b1d14', robe: '#fbfbf8', trim: '#d9d9d2', cap: 'kohen', belt: '#e8e8e0', curls: true },
    gad:      { skin: '#e0ac7e', hair: '#5a3a1e', robe: '#6aa84f', trim: '#4e8a37', cap: 'straw', beard: '#5a3a1e' },
    zevulun:  { skin: '#efc6a2', hair: '#f2f2f2', robe: '#8d6e63', trim: '#6d4c41', cap: 'none', beard: '#f7f7f7', longBeard: true, cane: true, bald: true },
    miriam:   { skin: '#f3c9a0', hair: '#9a3f1c', robe: '#d9536f', trim: '#b23b56', cap: 'scarf', scarf: '#4a7bd0', basket: true },
    batya:    { skin: '#d9a477', hair: '#3b2416', robe: '#f0a43a', trim: '#cf8420', cap: 'scarf', scarf: '#f6d860' },
    helper:   { skin: '#e2b088', hair: '#3b2416', robe: '#a47148', trim: '#7d5432', cap: 'none', beard: '#3b2416' },
    kohen:    { skin: '#efc6a2', hair: '#4a3020', robe: '#fbfbf8', trim: '#d9d9d2', cap: 'kohen', belt: '#e8e8e0', beard: '#4a3020' },
    pilgrimA: { skin: '#e8b98d', hair: '#2b1d14', robe: '#5b8def', trim: '#3f6fcf', cap: 'none', beard: '#2b1d14' },
    pilgrimB: { skin: '#f3c9a0', hair: '#6b3b1b', robe: '#e27d60', trim: '#c25d40', cap: 'scarf', scarf: '#85c7a2' },
    pilgrimC: { skin: '#d9a477', hair: '#1f140c', robe: '#9b72cf', trim: '#7b52af', cap: 'none' },
    farmer:   { skin: '#d9a477', hair: '#3b2416', robe: '#c9a227', trim: '#a9821a', cap: 'straw', beard: '#3b2416' },
  };

  function draw(g, kind, x, y, { dir = 1, phase = 0, mood = 'idle', s = 1, walking = false, hold = null, glow = null, t = 0 } = {}) {
    const L = LOOKS[kind] || LOOKS.eli;
    g.save(); g.translate(x, y); g.scale(s * dir, s);
    if (glow) G.tumahGlow(g, 0, -40, 60, glow, t);
    const sw = walking ? Math.sin(phase) * 7 : 0;
    const bob = walking ? Math.abs(Math.sin(phase)) * 2 : 0;
    // shadow
    ell(g, 0, 2, 20, 5, 'rgba(0,0,0,0.15)', 0);
    // legs
    rr(g, -10 + sw * 0.6, -16, 8, 17, 3, L.skin, 2.5); rr(g, 2 - sw * 0.6, -16, 8, 17, 3, L.skin, 2.5);
    ell(g, -6 + sw * 0.6, 0, 7, 4, '#7a5230', 2.5); ell(g, 6 - sw * 0.6, 0, 7, 4, '#7a5230', 2.5);
    g.translate(0, -bob);
    // robe
    poly(g, [[-15, -52], [15, -52], [20, -12], [-20, -12]], L.robe, 3);
    line(g, -19, -15, 19, -15, 2, L.trim);
    if (L.belt) { rr(g, -16, -36, 32, 6, 3, L.belt, 2); }
    // arms
    const armA = mood === 'happy' ? -2.2 : mood === 'no' ? -1.2 : walking ? Math.sin(phase + Math.PI) * 0.5 : 0.2;
    const armB = mood === 'happy' ? 2.2 : walking ? Math.sin(phase) * 0.5 : -0.2;
    arm(g, -14, -48, armA, L); arm(g, 14, -48, -armB, L, true);
    if (L.basket) { rr(g, 12, -34, 22, 14, 4, '#d9a35a', 2.5); line(g, 14, -34, 32, -34, 2); circ(g, 18, -36, 4, '#f2c14e', 2); circ(g, 26, -37, 4, '#8bc34a', 2); }
    if (L.cane) { line(g, 22, -40, 26, 0, 4, C.woodDark); }
    if (hold === 'blower') G.blower(g, 26, -36, 0.7, 0, false);
    if (hold === 'bucket') G.bucket(g, 22, -26, 0.9);
    if (hold === 'lamp') { G.flame(g, 24, -60, 0.8, t); }
    // head
    const hy = -70;
    if (L.cap === 'scarf') { g.beginPath(); g.ellipse(0, hy + 2, 21, 22, 0, Math.PI * 0.85, Math.PI * 2.15, false); g.lineTo(18, hy + 20); g.lineTo(-18, hy + 20); g.closePath(); G.fillStroke(g, L.scarf, 3); }
    circ(g, 0, hy, 18, L.skin, 3);
    // hair
    if (!L.bald && L.cap !== 'scarf') {
      g.beginPath(); g.arc(0, hy - 2, 18, Math.PI * 1.05, Math.PI * 1.95); g.lineTo(14, hy - 4); g.quadraticCurveTo(0, hy - 10, -14, hy - 4); g.closePath(); G.fillStroke(g, L.hair, 2.5);
      if (L.curls) for (const cx of [-14, -6, 4, 12]) circ(g, cx, hy - 14, 5, L.hair, 2);
    }
    if (L.bald) { circ(g, -16, hy + 2, 5, L.hair, 2); circ(g, 16, hy + 2, 5, L.hair, 2); }
    if (L.cap === 'scarf') { g.beginPath(); g.arc(0, hy - 2, 19, Math.PI * 1.0, Math.PI * 2.0); g.lineTo(19, hy + 2); g.quadraticCurveTo(0, hy - 8, -19, hy + 2); g.closePath(); G.fillStroke(g, L.scarf, 3); }
    if (L.cap === 'kohen') { // a rounded white linen cap
      g.beginPath(); g.ellipse(0, hy - 13, 17, 11, 0, Math.PI, 0); g.closePath(); G.fillStroke(g, '#ffffff', 3);
      line(g, -15, hy - 12, 15, hy - 12, 2, '#cfcfc7'); line(g, -10, hy - 18, 10, hy - 18, 1.5, '#e2e2da');
    }
    if (L.cap === 'straw') { ell(g, 0, hy - 12, 30, 7, '#e9c46a', 3); g.beginPath(); g.ellipse(0, hy - 14, 16, 12, 0, Math.PI, 0); G.fillStroke(g, '#e9c46a', 3); line(g, -15, hy - 15, 15, hy - 15, 3, '#c0392b'); }
    // beard
    if (L.beard) {
      g.beginPath(); g.moveTo(-15, hy + 4);
      if (L.longBeard) g.quadraticCurveTo(-10, hy + 40, 0, hy + 44), g.quadraticCurveTo(10, hy + 40, 15, hy + 4);
      else g.quadraticCurveTo(-8, hy + 22, 0, hy + 22), g.quadraticCurveTo(8, hy + 22, 15, hy + 4);
      g.quadraticCurveTo(0, hy + 12, -15, hy + 4); G.fillStroke(g, L.beard, 2.5);
    }
    // face
    face(g, hy, mood);
    g.restore();
  }
  function arm(g, x, y, a, L, back) {
    g.save(); g.translate(x, y); g.rotate(a);
    rr(g, -4, 0, 8, 22, 4, L.robe, 2.5); circ(g, 0, 24, 4.5, L.skin, 2.5);
    g.restore();
  }
  function face(g, hy, mood) {
    if (mood === 'sleep') { line(g, -9, hy, -3, hy, 2.5); line(g, 3, hy, 9, hy, 2.5); return; }
    circ(g, -6, hy - 1, 2.8, C.ink, 0); circ(g, 7, hy - 1, 2.8, C.ink, 0);
    circ(g, -5.2, hy - 2, 0.9, '#fff', 0); circ(g, 7.8, hy - 2, 0.9, '#fff', 0);
    ell(g, -10, hy + 6, 3.5, 2, 'rgba(240,120,120,0.45)', 0); ell(g, 11, hy + 6, 3.5, 2, 'rgba(240,120,120,0.45)', 0);
    g.beginPath();
    if (mood === 'happy') { g.arc(1, hy + 5, 6, 0.1 * Math.PI, 0.9 * Math.PI); g.lineWidth = 2.5; g.strokeStyle = C.ink; g.stroke(); }
    else if (mood === 'sad' || mood === 'no') { g.arc(1, hy + 11, 5, 1.15 * Math.PI, 1.85 * Math.PI); g.lineWidth = 2.5; g.strokeStyle = C.ink; g.stroke(); }
    else if (mood === 'oh') { circ(g, 1, hy + 8, 3.5, C.ink, 0); }
    else { g.arc(1, hy + 5, 4.5, 0.15 * Math.PI, 0.85 * Math.PI); g.lineWidth = 2.5; g.strokeStyle = C.ink; g.stroke(); }
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
      this.phase += dt * 12;
      if (d <= step) {
        this.x = tx; this.y = ty; this.path.shift();
        if (!this.path.length) { const cb = this.onArrive; this.onArrive = null; if (cb) cb(this); }
      } else { this.x += dx / d * step; this.y += dy / d * step; }
    }
    talk(textStr, ms = 2200) { this.say = textStr; this.sayUntil = performance.now() + ms; }
    draw(g, t) {
      if (!this.visible) return;
      draw(g, this.kind, this.x, this.y, { dir: this.dir, phase: this.phase, mood: this.mood, s: this.s, walking: this.walking, hold: this.hold, glow: this.glow, t });
      if (this.badge != null) G.badge(g, this.x + 22 * this.s, this.y - 96 * this.s, this.badge);
    }
    drawBubble(g) {
      if (this.say && performance.now() < this.sayUntil) G.bubble(g, this.x, this.y - 100 * this.s, this.say, { size: 15 });
    }
  }

  return { draw, Actor, LOOKS };
})();

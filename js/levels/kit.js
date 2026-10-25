/* ============================================
   TEHARA: shared pieces for building levels
   ============================================ */
const Kit = (function () {
  const near = (p, x, y, r) => Math.hypot(p.x - x, p.y - y) <= r;
  const inRect = (p, x, y, w, h) => p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // ---------- a golden pin you tap to pull out ----------
  // (x1,y1) is the ring end; (x2,y2) the tip.
  class Pin {
    constructor(id, x1, y1, x2, y2) { Object.assign(this, { id, x1, y1, x2, y2, t: 0, pulling: false, out: false, onOut: null }); Live.pins.push(this); }
    get ring() {
      const dx = this.x1 - this.x2, dy = this.y1 - this.y2, L = Math.hypot(dx, dy);
      return [this.x1 + dx / L * 16, this.y1 + dy / L * 16];
    }
    hit(p) { if (this.pulling || this.out) return false; const [rx, ry] = this.ring; return near(p, rx, ry, 34); }
    pull(onOut) { if (this.pulling || this.out) return false; this.pulling = true; this.onOut = onOut; Sound.play('pin'); return true; }
    update(dt) {
      if (!this.pulling) return;
      this.t = Math.min(1, this.t + dt * 2.6);
      if (this.t >= 1) { this.pulling = false; this.out = true; const cb = this.onOut; this.onOut = null; cb && cb(); }
    }
    draw(g) { if (Game.scene3d) return; if (this.t < 1) G.pin(g, this.x1, this.y1, this.x2, this.y2, ease(this.t)); }
  }

  // ---------- simple tweens ----------
  class Tweens {
    constructor() { this.list = []; }
    to(obj, props, dur, done, delay = 0) {
      const from = {}; for (const k in props) from[k] = obj[k];
      this.list.push({ obj, props, from, dur, t: -delay, done });
    }
    wait(dur, done) { this.list.push({ obj: {}, props: {}, from: {}, dur, t: 0, done }); }
    update(dt) {
      for (const tw of this.list.slice()) {
        tw.t += dt; if (tw.t < 0) continue;
        const k = Math.min(1, tw.t / tw.dur), e = ease(k);
        for (const p in tw.props) tw.obj[p] = lerp(tw.from[p], tw.props[p], e);
        if (k >= 1) { this.list.splice(this.list.indexOf(tw), 1); tw.done && tw.done(); }
      }
    }
    get busy() { return this.list.length > 0; }
  }

  // ---------- backgrounds ----------
  function outdoor(g, t, { mode = 'day', stars = 0, far = true, seed = 1, y = 330 } = {}) {
    G.sky(g, mode, t, stars);
    if (far) G.distance(g, t, { seed, y, night: mode === 'night' });
  }

  // A tumah status line under a character
  function statusTag(g, actor, L) {
    if (!actor.badge) return;
  }

  // Draw a dirt path (thick ribbon) through points
  function trail(g, pts, w = 34, color = G.C.path) {
    G.path(g, pts, false); g.lineCap = 'round'; g.lineJoin = 'round';
    g.lineWidth = w + 5; g.strokeStyle = G.dark(color, 0.45); g.stroke();
    g.lineWidth = w; g.strokeStyle = color; g.stroke();
    g.save(); g.lineWidth = w; g.strokeStyle = G.texture('dirt') || color; g.stroke(); g.restore();
    g.lineWidth = Math.max(2, w * 0.18); g.strokeStyle = 'rgba(255,255,255,0.18)'; g.stroke();
  }

  // plowed furrows inside a field
  function furrows(g, x, y, w, h) {
    for (let yy = y + 18; yy < y + h - 6; yy += 22) {
      g.beginPath(); g.moveTo(x + 8, yy);
      for (let xx = x + 8; xx <= x + w - 8; xx += 20) g.lineTo(xx, yy + Math.sin(xx / 30 + yy) * 2);
      g.lineWidth = 4; g.strokeStyle = 'rgba(80,50,20,0.3)'; g.stroke();
      g.save(); g.translate(0, -3); g.lineWidth = 2; g.strokeStyle = 'rgba(255,230,190,0.25)'; g.stroke(); g.restore();
    }
  }

  // Go button helper
  function go(onClick, label) { return { id: 'go', label: label || { en: 'Go!', he: 'קדימה!' }, cls: 'btn-green', onClick }; }

  // Source line for a Why? card
  function src(q, en, he, ref) {
    return { q, ref: { en, he: he || en }, url: ref ? 'https://www.sefaria.org/' + ref : null };
  }

  // ---------- choosing a route by tapping it ----------
  // routes: [{ id, box: [x, y, w, h], glow: [[x,y]...] }]
  class Routes {
    constructor(list) { this.list = list; this.sel = null; }
    hit(p) { const r = this.list.find(r => inRect(p, ...r.box)); if (r) { this.sel = r.id; Sound.play('tap'); } return r; }
    draw(g, t) {
      const r = this.list.find(r => r.id === this.sel); if (!r) return;
      const a = 0.55 + Math.sin(t / 200) * 0.25;
      G.path(g, r.glow); g.lineCap = 'round'; g.lineJoin = 'round';
      g.lineWidth = 14; g.strokeStyle = `rgba(255,225,90,${a * 0.5})`; g.stroke();
      g.setLineDash([10, 10]); g.lineDashOffset = -t / 40; g.lineWidth = 4; g.strokeStyle = `rgba(255,240,170,${a + 0.2})`; g.stroke(); g.setLineDash([]);
    }
    hot() { const h = {}; for (const r of this.list) h['route:' + r.id] = [r.box[0] + r.box[2] / 2, r.box[1] + r.box[3] / 2]; return h; }
  }

  // Tumah zones stay hidden until the player fails there (or asks for a hint)
  const revealed = (api, key) => !!(api.state.reveal && api.state.reveal[key]);
  const reveal = (api, key) => { api.state.reveal = api.state.reveal || {}; api.state.reveal[key] = true; };

  return { near, inRect, lerp, ease, Pin, Tweens, Routes, revealed, reveal, outdoor, trail, furrows, go, src, statusTag };
})();

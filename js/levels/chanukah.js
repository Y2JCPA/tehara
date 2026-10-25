/* ============================================
   TEHARA: Chanukah pack, The Sealed Jug
   Hero: Yehuda, a young Kohen in the days of the Chashmona'im.
   Each level lives in js/levels/ch/ and adds itself to CHANUKAH.
   ============================================ */
const CH = {};
const CHANUKAH = [];

// Inside the Mikdash: Jerusalem-stone walls and a floor
CH.temple = (g, t, { floor = 860, seed = 5, dim = 0 } = {}) => {
  G.sky(g, 'indoor', t);
  G.stoneWall(g, 0, 0, 540, floor, { block: 48, seed, tone: dim });
  G.rr(g, -4, floor, 548, 110, 0, G.lin(g, 0, floor, 0, 960, [[0, '#e6d3a6'], [1, '#bfa572']]), 2.5, G.C.mortar);
  for (let x = -40; x < 560; x += 64) G.line(g, x, floor + 2, x - 30, 960, 1.5, 'rgba(120,90,50,0.3)');
  G.line(g, 0, floor + 40, 540, floor + 40, 1.5, 'rgba(120,90,50,0.25)');
  G.vignette(g, 0.3);
};

// the same room in 3D
CH.temple3d = (K, { floor = 860, seed = 5, lamps = true } = {}) => K.room({ floor, seed, lamps });

// A jar or jug with a clear, readable seal: red wax on a cord round the neck.
// The Kohen Gadol's seal has a gold star; a broken one is cracked in two.
CH.jar3d = (K, look = {}, s = 1) => {
  const T3 = K.THREE, { seal, ...rest } = look;
  const o = CH.metalize(K, K.jar(rest, s));
  if (rest.oil && !rest.bowl && !rest.sealed && !rest.loose && !seal) {   // oil shining in the open mouth
    const d = K.mesh(new T3.CircleGeometry(0.15, 16), K.std(0xe8b830, { roughness: 0.15, metalness: 0.2 }), 0, 0.77 * 0.95 * s, 0); d.rotation.x = -Math.PI / 2; d.scale.setScalar(s * 0.95); o.add(d);
  }
  if (!seal) return o;
  const top = (rest.bowl ? 0.31 : 0.8) * 0.95 * s, y = top - 0.14 * s, z = 0.2 * s;
  const wax = K.std(0xc0302a, { roughness: 0.4 }), cord = K.std(0x7a5a32, { roughness: 1 });
  const ring = K.mesh(new T3.TorusGeometry(0.15 * s, 0.018 * s, 6, 20), cord, 0, top - 0.09 * s, 0); ring.rotation.x = Math.PI / 2; o.add(ring);
  const disc = (r, a0 = 0, len = Math.PI * 2) => { const m = K.mesh(new T3.CylinderGeometry(r, r, 0.06 * s, 24, 1, false, a0, len), wax); m.rotation.x = Math.PI / 2; return m; };
  if (seal === 'broken') {
    const a = disc(0.13 * s, 0, Math.PI * 1.1); a.position.set(-0.03 * s, y, z); a.rotation.y = 0.3; o.add(a);
    const b = disc(0.13 * s, Math.PI * 1.25, Math.PI * 0.6); b.position.set(0.07 * s, y - 0.07 * s, z + 0.02); b.rotation.z = -0.5; o.add(b);
  } else {
    const d = disc(0.14 * s); d.position.set(0, y, z); o.add(d);
    const st = new T3.Shape();
    for (let i = 0; i < 10; i++) { const r = (i % 2 ? 0.035 : 0.085) * s, a = Math.PI / 2 + i * Math.PI / 5; i ? st.lineTo(Math.cos(a) * r, Math.sin(a) * r) : st.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    o.add(K.mesh(new T3.ExtrudeGeometry(st, { depth: 0.03 * s, bevelEnabled: false }), K.MAT.goldBright, 0, y, z + 0.03 * s));
  }
  return o;
};

// Fully metallic materials look black without an environment map, so CH
// vessels use a brushed-metal look that reads well under plain lights.
// (Open bowls and jars are also made two-sided, so you can see into them.)
CH.metalize = (K, o) => {
  const T3 = K.THREE, two = { side: T3.DoubleSide };
  const swap = new Map([
    [K.MAT.metal, K.std(0xd5dde4, { metalness: 0.45, roughness: 0.32, side: T3.DoubleSide })],
    [K.MAT.clay, K.std(0xc9693a, { roughness: 0.8, ...two })],
    [K.MAT.stoneVessel, K.std(0xd9d2c4, { roughness: 0.75, ...two })],
  ]);
  o.traverse(c => { if (c.isMesh && swap.has(c.material)) c.material = swap.get(c.material); });
  return o;
};

// the Menorah standing on a stone block, base at logical (x, y); returns its group (userData.flames)
CH.menorahStand = (K, x, y, s = 1) => {
  K.wall(x - 56, y, 112, 860 - y, { mat: K.MAT.stoneSmooth, z0: -0.8, z1: 0.75 });
  const m = K.place(K.menorah(s), x, y, 0);
  return m.children[0];
};

// broken pottery lying on the floor
CH.shards = (K, x, y) => {
  const T3 = K.THREE, g = new T3.Group();
  for (const [dx, dy, r, rot] of [[-0.25, 0.1, 0.2, 0.4], [0.18, 0.08, 0.16, -0.6], [0.02, 0.04, 0.12, 1.2], [0.36, 0.03, 0.08, 0.2]]) {
    const m = K.mesh(new T3.SphereGeometry(r, 10, 6, 0, Math.PI * 1.2, 0, Math.PI / 2), K.MAT.clay); m.material = K.std(0xc9693a, { roughness: 0.8, side: T3.DoubleSide });
    m.position.set(dx, dy - 0.04, 0); m.rotation.set(rot, rot * 2, 0.6 + rot); g.add(m);
  }
  K.scene.add(g); return K.place(g, x, y, 0.1);
};

// A "choose what to do" room: options are buttons. opt.result(api) returns
// { ok, msg }: ok → next room; otherwise fail (or a mistake if opt.soft).
CH.choice = ({ intro, draw, build, scene, options, actors = [] }) => api => {
  let done = false;
  const pick = o => {
    if (done) return;
    const r = o.result(api);
    if (r.ok) { done = true; api.setButtons([]); if (r.msg) api.say(r.msg, 'good'); setTimeout(() => api.complete(), r.delay || 1000); return; }
    if (o.soft) api.mistake(r.msg); else { done = true; api.setButtons([]); api.fail(r.msg); }
  };
  const acts = actors.map(a => new Chars.Actor(a.kind, a.x, a.y, a.opts || {}));
  return {
    intro, scene, build: build && (K => build(K, api)),
    buttons: options.map(o => ({ id: o.id, label: o.label, cls: o.cls || 'btn-gold', onClick: () => pick(o) })),
    update(dt) { for (const a of acts) a.update(dt); },
    draw(g, t) { draw(g, t, api); for (const a of acts) { a.draw(g, t); a.drawBubble(g); } },
    hot() { return {}; },
  };
};

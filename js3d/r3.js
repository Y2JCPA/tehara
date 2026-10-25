/* ============================================
   TEHARA 3D: the diorama renderer and kit
   Each room is a small 3D diorama seen from the front by a camera that sits a
   little above it. The camera uses an off-axis projection, so the plane z = 0
   maps exactly onto the game's 540x960 logical coordinates: the level logic,
   hit areas and 2D overlay (labels, glows) all stay in those coordinates.
   Characters, materials and textures are adapted from the Avodah:
   Beit HaMikdash game.
   ============================================ */
import * as THREE from '../vendor/three/three.module.min.js';
import { mergeGeometries } from '../vendor/three/addons/utils/BufferGeometryUtils.js';
import * as TX from './textures.js';

const U = 70;                         // logical pixels per world unit
const W = 540 / U, H = 960 / U;       // visible plane size in world units
const CAM_D = 34, CAM_RISE = 7.5;     // camera distance, and how far above the frame centre it sits
const P = (x, y, z = 0) => new THREE.Vector3(x / U, -y / U, z);

let renderer = null, camera = null;
const MAT = {}, TEX = {};

// ---------- materials ----------
const cache = new Map();
function std(color, opts = {}) {
  const key = color + '|' + Object.keys(opts).sort().map(k => k + ':' + (opts[k]?.isTexture ? opts[k].uuid : opts[k])).join(',');
  if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...opts }));
  return cache.get(key);
}
let owned = null;     // textures made for one room, freed with it
function canvasTex(w, h, paint, { repeat = true, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  if (owned) owned.push(t);
  return t;
}
function rnd(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function paintEarth(m, S, base, seed, rock) {
  const r = rnd(seed);
  m.fillStyle = base; m.fillRect(0, 0, S, S);
  for (let i = 0; i < 9000; i++) { m.fillStyle = r() < 0.5 ? 'rgba(40,22,8,0.10)' : 'rgba(255,235,200,0.07)'; m.fillRect(r() * S, r() * S, 1 + r() * 3, 1 + r() * 3); }
  for (let y = 40; y < S; y += 70 + r() * 40) {   // strata
    m.beginPath(); m.moveTo(0, y); for (let x = 0; x <= S; x += 32) m.lineTo(x, y + Math.sin(x / 50 + y) * 6);
    m.lineWidth = 3; m.strokeStyle = 'rgba(50,28,10,0.22)'; m.stroke();
  }
  for (let i = 0; i < (rock ? 40 : 60); i++) {    // pebbles
    const x = r() * S, y = r() * S, rx = 5 + r() * (rock ? 18 : 11), ry = rx * (0.55 + r() * 0.3);
    const v = r();
    m.fillStyle = rock ? `rgba(${120 + v * 50 | 0},${110 + v * 40 | 0},${95 + v * 35 | 0},0.9)` : `rgba(${150 + v * 50 | 0},${120 + v * 40 | 0},${90 + v * 30 | 0},0.85)`;
    m.beginPath(); m.ellipse(x, y, rx, ry, r() * 3, 0, 7); m.fill();
    m.fillStyle = 'rgba(255,245,225,0.35)'; m.beginPath(); m.ellipse(x - rx * 0.25, y - ry * 0.3, rx * 0.4, ry * 0.3, 0, 0, 7); m.fill();
    m.fillStyle = 'rgba(40,22,8,0.3)'; m.beginPath(); m.ellipse(x + rx * 0.15, y + ry * 0.55, rx * 0.8, ry * 0.25, 0, 0, 7); m.fill();
  }
  if (rock) for (let i = 0; i < 26; i++) { m.strokeStyle = 'rgba(40,28,18,0.35)'; m.lineWidth = 2; m.beginPath(); let x = r() * S, y = r() * S; m.moveTo(x, y); for (let k = 0; k < 4; k++) { x += r() * 40 - 20; y += r() * 30; m.lineTo(x, y); } m.stroke(); }
}

async function buildMaterials() {
  TX.setTextureResolution(512);
  const ash = TX.ashlarTextures();
  const step = () => new Promise(r => requestAnimationFrame(() => r()));
  await step();
  TEX.linen = TX.linenTexture();
  TEX.avnet = TX.avnetTexture();
  TEX.soft = TX.softSprite();
  const wood = TX.woodTextures('log'), plank = TX.woodTextures('plank');
  await step();
  TEX.earth = canvasTex(512, 512, (m, S) => paintEarth(m, S, '#a8743f', 3, false));
  TEX.rock = canvasTex(512, 512, (m, S) => paintEarth(m, S, '#a99478', 7, true));
  TEX.lime = canvasTex(256, 256, (m, S) => { const r = rnd(21); m.fillStyle = '#efe2c2'; m.fillRect(0, 0, S, S); for (let i = 0; i < 5000; i++) { m.fillStyle = r() < 0.5 ? 'rgba(150,120,80,0.10)' : 'rgba(255,255,245,0.16)'; m.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2); } for (let i = 0; i < 18; i++) { m.fillStyle = 'rgba(170,140,95,0.12)'; m.beginPath(); m.ellipse(r() * S, r() * S, 8 + r() * 20, 5 + r() * 10, r() * 3, 0, 7); m.fill(); } });
  TEX.grass = canvasTex(256, 256, (m, S) => { const r = rnd(5); m.fillStyle = '#6fb23c'; m.fillRect(0, 0, S, S); for (let i = 0; i < 4000; i++) { m.fillStyle = r() < 0.5 ? 'rgba(30,80,10,0.18)' : 'rgba(210,255,150,0.15)'; m.fillRect(r() * S, r() * S, 1.5, 2 + r() * 5); } });
  TEX.path = canvasTex(256, 256, (m, S) => { const r = rnd(9); m.fillStyle = '#d9b680'; m.fillRect(0, 0, S, S); for (let i = 0; i < 3000; i++) { m.fillStyle = r() < 0.5 ? 'rgba(90,60,25,0.14)' : 'rgba(255,245,220,0.18)'; m.fillRect(r() * S, r() * S, 1 + r() * 3, 1 + r() * 3); } });
  TEX.field = canvasTex(256, 256, (m, S) => { const r = rnd(11); m.fillStyle = '#b98a4f'; m.fillRect(0, 0, S, S); for (let y = 8; y < S; y += 16) { m.fillStyle = 'rgba(70,40,15,0.35)'; m.fillRect(0, y, S, 5); m.fillStyle = 'rgba(255,230,190,0.22)'; m.fillRect(0, y - 4, S, 3); } for (let i = 0; i < 2500; i++) { m.fillStyle = r() < 0.5 ? 'rgba(60,35,10,0.15)' : 'rgba(255,240,210,0.12)'; m.fillRect(r() * S, r() * S, 2, 2); } });
  await step();

  const rep = (t, x, y = x) => { const c = t.clone(); c.repeat.set(x, y); c.needsUpdate = true; return c; };
  MAT.earth = new THREE.MeshStandardMaterial({ map: TEX.earth, roughness: 1 });
  MAT.rock = new THREE.MeshStandardMaterial({ map: TEX.rock, roughness: 0.95 });
  MAT.grass = new THREE.MeshStandardMaterial({ map: TEX.grass, roughness: 1 });
  MAT.path = new THREE.MeshStandardMaterial({ map: TEX.path, roughness: 1 });
  MAT.field = new THREE.MeshStandardMaterial({ map: TEX.field, roughness: 1 });
  MAT.stone = new THREE.MeshStandardMaterial({ map: ash.map, bumpMap: ash.bump, bumpScale: 2.5, roughness: 0.88 });
  MAT.stoneSmooth = new THREE.MeshStandardMaterial({ map: TEX.lime, roughness: 0.75 });
  MAT.wood = new THREE.MeshStandardMaterial({ map: wood.map, roughness: 0.85 });
  MAT.plank = new THREE.MeshStandardMaterial({ map: plank.map, color: 0xd8c2a4, roughness: 0.8 });
  MAT.gold = new THREE.MeshStandardMaterial({ color: 0xffc95c, metalness: 1, roughness: 0.25 });
  MAT.goldBright = new THREE.MeshStandardMaterial({ color: 0xffd36e, metalness: 1, roughness: 0.18 });
  MAT.metal = new THREE.MeshStandardMaterial({ color: 0xc9d2da, metalness: 1, roughness: 0.3 });
  MAT.dark = new THREE.MeshStandardMaterial({ color: 0x1b120b, roughness: 1 });
  MAT.cave = new THREE.MeshStandardMaterial({ color: 0x2c1f14, roughness: 1 });
  MAT.water = new THREE.MeshStandardMaterial({ color: 0x4aa8de, metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.88 });
  MAT.leaf = new THREE.MeshStandardMaterial({ color: 0x5aa83f, roughness: 0.9 });
  MAT.leafDark = new THREE.MeshStandardMaterial({ color: 0x3e7f2e, roughness: 0.9 });
  MAT.olive = new THREE.MeshStandardMaterial({ color: 0x8fa463, roughness: 0.9 });
  MAT.trunk = new THREE.MeshStandardMaterial({ color: 0x7a5636, roughness: 1, map: wood.map });
  MAT.bone = new THREE.MeshStandardMaterial({ color: 0xf6efdc, roughness: 0.55 });
  MAT.lime = new THREE.MeshStandardMaterial({ color: 0xfbfbf4, roughness: 0.9 });
  MAT.clay = new THREE.MeshStandardMaterial({ color: 0xc9693a, roughness: 0.8 });
  MAT.stoneVessel = new THREE.MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.75 });
  MAT.plaster = new THREE.MeshStandardMaterial({ color: 0xb08a62, roughness: 0.9 });
  const fl = TX.floorTextures ? TX.floorTextures() : null;
  MAT.floor = fl ? new THREE.MeshStandardMaterial({ map: fl.map, bumpMap: fl.bump, bumpScale: 1.5, roughness: 0.8 }) : MAT.stoneSmooth;
  MAT.hay = new THREE.MeshStandardMaterial({ color: 0xf0cc5a, roughness: 1 });
}

// ---------- geometry helpers ----------
function mesh(geo, mat, x = 0, y = 0, z = 0, cast = true, receive = true) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = receive; return m;
}
// a rounded rectangle extruded along z: our basic "diorama block"
function slab(w, h, d, r = 0.12, bevel = 0.06) {
  const s = new THREE.Shape();
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(r, 0); s.lineTo(w - r, 0); s.quadraticCurveTo(w, 0, w, r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(r, h); s.quadraticCurveTo(0, h, 0, h - r); s.lineTo(0, r); s.quadraticCurveTo(0, 0, r, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 4 });
  // world-scale UVs on every face: 1 texture repeat per 2.5 units
  const pos = g.attributes.position, nrm = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nrm.getX(i)), ny = Math.abs(nrm.getY(i));
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (ny > 0.7) uv.setXY(i, x / 2.5, z / 2.5); else if (nx > 0.7) uv.setXY(i, z / 2.5, y / 2.5); else uv.setXY(i, x / 2.5, y / 2.5);
  }
  return g;
}
// lumpy organic shapes (rocks, tree crowns, mounds)
function lumpy(r, detail, amp, seed) {
  const g = new THREE.IcosahedronGeometry(r, detail);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = 1 + amp * Math.sin(x * 5.1 + seed) * Math.sin(y * 4.3 + seed * 2) * Math.sin(z * 4.7 + seed * 3) + amp * 0.5 * Math.sin(x * 13 + y * 11 + seed);
    p.setXYZ(i, x * n, y * n, z * n);
  }
  g.computeVertexNormals();
  return g;
}

// ---------- the scene context for one room ----------
// where to put something far away (depth z < 0) so it appears at logical (x, y)
const EYE_Y = -H / 2 + CAM_RISE;
function far(x, y, z) { const sc = (CAM_D - z) / CAM_D; return new THREE.Vector3(W / 2 + (x / U - W / 2) * sc, EYE_Y + (-y / U - EYE_Y) * sc, z); }
function farRect(o, x1, y1, x2, y2, z) {
  const sc = (CAM_D - z) / CAM_D;
  o.position.copy(far((x1 + x2) / 2, (y1 + y2) / 2, z));
  o.scale.set((x2 - x1) / U * sc, (y2 - y1) / U * sc, 1);
}
function backdrop(scene, mode, seed, horizon) {
  const sky = canvasTex(4, 256, (m) => {
    const g = m.createLinearGradient(0, 0, 0, 256);
    const st = { day: ['#3f9be6', '#8fd0f6', '#e9f7ff'], sunset: ['#4655a8', '#e5876e', '#ffd9a0'], night: ['#0b1033', '#1f2c66', '#3a4a8a'], indoor: ['#3a2a1a', '#2a1d12', '#1a120b'] }[mode] || ['#3f9be6', '#8fd0f6', '#e9f7ff'];
    g.addColorStop(0, st[0]); g.addColorStop(0.55, st[1]); g.addColorStop(1, st[2]); m.fillStyle = g; m.fillRect(0, 0, 4, 256);
  }, { repeat: false });
  scene.background = sky;
  if (mode === 'indoor') return;
  if (mode === 'night') {   // stars
    const n = 160, pos = new Float32Array(n * 3), r = rnd(seed + 99);
    for (let i = 0; i < n; i++) { const v = far(r() * 540, r() * 420, -30); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; }
    const gm = new THREE.BufferGeometry(); gm.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(gm, new THREE.PointsMaterial({ color: 0xfff6d0, size: 2.2, sizeAttenuation: false, fog: false, userData: { own: true } })));
    const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.soft, color: 0xfff3c8, transparent: true, depthWrite: false, fog: false }));
    farRect(moon, 400, 70, 500, 170, -30); scene.add(moon);
  }
  // painted hills far behind, in layers for depth
  const layers = mode === 'night' ? ['#2a3766', '#22305a', '#1b264c'] : ['#a9c9dc', '#8bb889', '#6da35b'];
  layers.forEach((col, i) => {
    const tex = canvasTex(1024, 256, (m, w, h) => {
      const r = rnd(seed * 7 + i);
      m.beginPath(); m.moveTo(0, h);
      let y = h * (0.35 + i * 0.12);
      for (let x = 0; x <= w; x += 64) { y = h * (0.3 + i * 0.12) + (r() - 0.5) * h * 0.25; m.quadraticCurveTo(x - 32, y - 30, x, y); }
      m.lineTo(w, h); m.closePath();
      const g = m.createLinearGradient(0, h * 0.2, 0, h); g.addColorStop(0, col); g.addColorStop(1, new THREE.Color(col).multiplyScalar(0.8).getStyle()); m.fillStyle = g; m.fill();
      if (i === 1 && mode !== 'night') for (let k = 0; k < 26; k++) { const x = r() * w, yy = h * (0.45 + r() * 0.2); m.fillStyle = 'rgba(80,110,60,0.8)'; m.beginPath(); m.arc(x, yy, 6 + r() * 6, 0, 7); m.fill(); }
    }, { repeat: false });
    // horizon: the logical y where the room's ground is; the hills rise behind it
    const z = -26 + i * 7, top = horizon - 220 + i * 30, bottom = top + 410;
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, userData: { own: true } }));
    farRect(pl, -40, top, 620, bottom, z);
    pl.renderOrder = -10 + i;
    scene.add(pl);
    if (i === layers.length - 1) {   // and below them, more hillside (never the sky)
      const fill = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(0.8), depthWrite: false, fog: false, userData: { own: true } }));
      farRect(fill, -40, bottom - 4, 620, 1200, z); fill.renderOrder = -10 + i; scene.add(fill);
    }
  });
  if (mode === 'day') {
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.soft, color: 0xfff3c0, transparent: true, depthWrite: false, fog: false }));
    farRect(sun, 380, 40, 520, 180, -30); scene.add(sun);
    const cl = std(0xffffff, { roughness: 1, emissive: 0xbfd6e8, emissiveIntensity: 0.35 });
    for (const [cx, cy, s] of [[1.6, -1.6, 1], [5.2, -2.9, 0.8]]) {
      const g = new THREE.Group();
      for (const [dx, dy, r] of [[-0.6, 0, 0.5], [0, 0.25, 0.7], [0.7, 0, 0.5], [0.3, -0.15, 0.45]]) g.add(mesh(new THREE.SphereGeometry(r, 16, 12), cl, dx, dy, 0, false, false));
      const fz = -12, sc = (CAM_D - fz) / CAM_D; g.scale.setScalar(s * sc); g.position.copy(far(cx * U, -cy * U, fz)); scene.add(g);
    }
  }
}

function newScene({ mode = 'day', seed = 1, horizon = 330 } = {}) {
  const scene = new THREE.Scene();
  const own = owned = [];
  backdrop(scene, mode, seed, horizon);
  owned = null;
  const indoor = mode === 'indoor', night = mode === 'night';
  scene.add(new THREE.HemisphereLight(indoor ? 0xffe2b8 : night ? 0x8090c0 : 0xd8ecff, indoor ? 0x5a4026 : 0x7a5a3a, indoor ? 1.1 : night ? 0.6 : 1.15));
  const sun = new THREE.DirectionalLight(indoor ? 0xffd9a0 : night ? 0xaab8ff : 0xfff1d6, indoor ? 1.6 : night ? 0.8 : 2.4);
  sun.position.set(W / 2 - 5, 6, 14); sun.target.position.set(W / 2, -H / 2, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.02;
  const sc = sun.shadow.camera; sc.left = -9; sc.right = 9; sc.top = 11; sc.bottom = -11; sc.near = 1; sc.far = 40;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45); fill.position.set(W / 2 + 6, -H / 2, 20); scene.add(fill);
  const ctx = {
    scene, mode, actors: new Map(), pins: new Map(), syncs: [],
    add(o) { scene.add(o); return o; },
    sync(fn) { ctx.syncs.push(fn); },
    dispose() {
      scene.traverse(o => { if (o.isMesh || o.isInstancedMesh) o.geometry?.dispose?.(); if (o.material?.userData?.own) o.material.dispose(); });
      for (const t of own) t.dispose();
    },
  };
  ctx.K = makeKit(ctx);
  return ctx;
}

// ---------- the kit: all positions are in logical (x, y) pixels ----------
function makeKit(ctx) {
  const add = o => ctx.add(o);
  const K = {
    P, U, MAT, TEX, std, mesh, THREE, scene: ctx.scene, slab, lumpy,
    // A block of earth or rock seen in cut-away, with grass / dirt / stone on top.
    block(x, y, w, h, { face = 'earth', top = 'grass', z0 = -1.8, z1 = 0.7 } = {}) {
      const g = new THREE.Group();
      const ww = w / U, hh = h / U, d = z1 - z0;
      const body = mesh(slab(ww, hh, d, 0.1, 0.05), face === 'rock' ? MAT.rock : face === 'stone' ? MAT.stone : MAT.earth, 0, -hh, z0);
      g.add(body);
      if (top === 'grass' || top === 'dirt' || top === 'stone' || top === 'path') {
        const th = top === 'grass' ? 0.2 : 0.12;
        const cap = mesh(slab(ww + 0.08, th, d + 0.14, 0.08, 0.04), top === 'grass' ? MAT.grass : top === 'stone' ? MAT.stoneSmooth : MAT.path, -0.04, -th * 0.6, z0 - 0.07);
        g.add(cap);
        if (top === 'grass') {   // tufts along the front edge
          const r = rnd(Math.round(x * 3 + y));
          const tuft = new THREE.ConeGeometry(0.035, 0.22, 4);
          const n = Math.floor(ww * 9);
          const im = new THREE.InstancedMesh(tuft, std(0x5fa832, { roughness: 1 }), n);
          const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
          for (let i = 0; i < n; i++) {
            e.set((r() - 0.5) * 0.5, 0, (r() - 0.5) * 0.6); q.setFromEuler(e);
            const s = 0.6 + r() * 0.8;
            m4.compose(new THREE.Vector3(r() * ww, 0.14 + 0.05 * s, z1 + 0.02 - r() * 0.5), q, new THREE.Vector3(s, s, s));
            im.setMatrixAt(i, m4);
          }
          im.castShadow = false; g.add(im);
          for (let i = 0; i < ww * 1.2; i++) if (r() < 0.5) { const fx = r() * ww; g.add(mesh(new THREE.SphereGeometry(0.05, 6, 5), std(r() < 0.5 ? 0xe5484d : 0xf7f2ff, { roughness: 0.8 }), fx, 0.2, z1 - r() * 0.3, false)); }
        }
      }
      g.position.copy(P(x, y));
      return add(g);
    },
    // a dark recess behind everything (a ravine, a cave interior, a shaft)
    recess(x, y, w, h, { z = -1.7, mat } = {}) {
      const m = mesh(slab(w / U, h / U, 0.2, 0.01, 0), mat || MAT.cave, 0, 0, 0, false, true);
      m.position.copy(P(x, y + h, z - 0.1)); return add(m);
    },
    // a flight of stairs going down from (x, y); each step is a real stone block
    stairs(x, y, steps, { stepW = 24, stepH = 22, dir = 1, z0 = -0.6, z1 = 0.6, thick = 26 } = {}) {
      const g = new THREE.Group();
      for (let i = 0; i < steps; i++) {
        const sx = dir > 0 ? x + i * stepW : x - (i + 1) * stepW, sy = y + i * stepH;
        const st = mesh(slab((stepW + 2) / U, (stepH + thick * 0.5) / U, z1 - z0, 0.04, 0.025), MAT.stoneSmooth, 0, 0, 0);
        st.position.copy(P(sx, sy + stepH + thick * 0.5, z0));
        g.add(st);
      }
      return add(g);
    },
    ladder(x, y1, y2, { w = 32, z = 0.15 } = {}) {
      const g = new THREE.Group(), len = (y2 - y1) / U;
      for (const s of [-1, 1]) { const r = mesh(new THREE.BoxGeometry(0.09, len, 0.09), MAT.wood); r.position.set(s * w / U / 2, -len / 2, 0); g.add(r); }
      for (let yy = 0.25; yy < len; yy += 0.32) { const r = mesh(new THREE.CylinderGeometry(0.035, 0.035, w / U, 8), MAT.wood); r.rotation.z = Math.PI / 2; r.position.set(0, -yy, 0); g.add(r); }
      g.position.copy(P(x, y1, z)); return add(g);
    },
    // Herodian ashlar wall
    wall(x, y, w, h, { z0 = -1.2, z1 = 0.4, mat } = {}) {
      const m = mesh(slab(w / U, h / U, z1 - z0, 0.03, 0.02), mat || MAT.stone, 0, -h / U, z0);
      const g = new THREE.Group(); g.add(m); g.position.copy(P(x, y)); return add(g);
    },
    house(x, y, w, h, { door = true } = {}) {
      const g = new THREE.Group();
      g.add(mesh(slab(w / U, h / U, 1.6, 0.03, 0.02), MAT.stone, 0, -h / U, -1.4));
      g.add(mesh(slab(w / U + 0.24, 0.16, 1.9, 0.03, 0.02), MAT.plaster, -0.12, 0, -1.55));
      for (let i = 0; i < w / U / 0.22; i++) { const b = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), MAT.wood, 0.1 + i * 0.22, 0.05, 0.4); b.rotation.x = Math.PI / 2; g.add(b); }
      if (door) { const d = mesh(slab(0.42, 0.66, 0.08, 0.2, 0.02), MAT.plank, w / U / 2 - 0.21, -h / U, 0.2); g.add(d); }
      g.add(mesh(new THREE.BoxGeometry(0.3, 0.24, 0.05), MAT.dark, 0.35, -0.45, 0.21, false));
      g.position.copy(P(x, y)); return add(g);
    },
    cityWall(x, y, w, h) {
      const g = new THREE.Group(), ww = w / U, hh = h / U;
      g.add(mesh(slab(ww, hh, 1.6, 0.03, 0.02), MAT.stone, 0, -hh, -1.6));
      for (let xx = 0.05; xx < ww - 0.2; xx += 0.55) g.add(mesh(slab(0.34, 0.3, 1.0, 0.02, 0.02), MAT.stone, xx, 0, -1.3));
      const arch = new THREE.Shape(); const gw = 1.1, gh = 1.3;
      arch.moveTo(0, 0); arch.lineTo(0, gh - gw / 2); arch.absarc(gw / 2, gh - gw / 2, gw / 2, Math.PI, 0, true); arch.lineTo(gw, 0); arch.closePath();
      g.add(mesh(new THREE.ExtrudeGeometry(arch, { depth: 0.05, bevelEnabled: false }), std(0x3a2614), ww / 2 - gw / 2, -hh, 0.02, false));
      g.position.copy(P(x, y)); return add(g);
    },
    tree(x, y, s = 1, kind = 'terebinth', seed = 3) {
      const g = new THREE.Group(), r = rnd(seed * 13 + 5);
      const trunk = mesh(new THREE.CylinderGeometry(0.11, 0.2, 1.3, 9), MAT.trunk, 0, 0.65, 0); g.add(trunk);
      for (const sd of [-1, 1]) { const b = mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.7, 7), MAT.trunk, sd * 0.25, 1.15, 0); b.rotation.z = -sd * 0.7; g.add(b); }
      const mat = kind === 'olive' ? MAT.olive : MAT.leaf;
      for (const [dx, dy, dz, rr] of [[0, 1.75, 0, 0.62], [-0.55, 1.45, 0.1, 0.5], [0.55, 1.5, -0.1, 0.5], [0.15, 1.35, 0.35, 0.42], [-0.2, 1.95, -0.25, 0.42]]) {
        g.add(mesh(lumpy(rr, 2, 0.12, r() * 10), r() < 0.3 ? MAT.leafDark : mat, dx, dy, dz));
      }
      if (kind === 'olive') for (let i = 0; i < 14; i++) g.add(mesh(new THREE.SphereGeometry(0.035, 6, 5), std(0x3b4a22), (r() - 0.5) * 1.2, 1.3 + r() * 0.7, 0.3 + r() * 0.3, false));
      g.scale.setScalar(s * 1.05); g.position.copy(P(x, y, -0.2)); return add(g);
    },
    bush(x, y, s = 1) { const g = new THREE.Group(); for (const [dx, dy, rr] of [[-0.18, 0.15, 0.22], [0.15, 0.17, 0.24], [0, 0.3, 0.2]]) g.add(mesh(lumpy(rr, 1, 0.1, dx * 9), MAT.leaf, dx, dy, 0)); g.scale.setScalar(s); g.position.copy(P(x, y)); return add(g); },
    rock(x, y, w, h, seed = 2) { const m = mesh(lumpy(0.5, 1, 0.16, seed), MAT.rock); m.scale.set(w / U, h / U, w / U * 0.9); m.position.copy(P(x, y - h * 0.42)); return add(m); },
    // Second Temple style tomb: a rock outcrop with a carved doorway and a rolling stone (golel)
    tomb(x, y, s = 1, { open = false } = {}) {
      const g = new THREE.Group();
      const mound = mesh(lumpy(1, 2, 0.08, 4), MAT.rock); mound.scale.set(1.15, 0.95, 0.8); mound.position.set(0, 0.15, -0.3); g.add(mound);
      g.add(mesh(new THREE.BoxGeometry(0.62, 0.8, 0.2), MAT.dark, -0.12, 0.4, 0.42, false));
      g.add(mesh(new THREE.BoxGeometry(0.82, 0.12, 0.3), MAT.stoneSmooth, -0.12, 0.86, 0.42));
      if (!open) { const st = mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.18, 28), MAT.rock, 0.22, 0.45, 0.6); st.rotation.x = Math.PI / 2; g.add(st); g.add(mesh(new THREE.TorusGeometry(0.28, 0.02, 6, 24), MAT.rock, 0.22, 0.45, 0.7, false)); }
      g.scale.setScalar(s * 1.15); g.position.copy(P(x, y)); return add(g);
    },
    grave(x, y, s = 1) {
      const g = new THREE.Group(), r = rnd(8);
      for (let i = 0; i < 11; i++) g.add(mesh(lumpy(0.13 + r() * 0.07, 0, 0.15, i), MAT.rock, (r() - 0.5) * 1.1, 0.08 + r() * 0.12, (r() - 0.5) * 0.5));
      g.add(mesh(slab(0.34, 0.7, 0.14, 0.15, 0.03), MAT.stoneSmooth, -0.17, 0.05, -0.05));
      g.scale.setScalar(s); g.position.copy(P(x, y)); return add(g);
    },
    cave(x, y, w, h, { closed = true } = {}) {
      const g = new THREE.Group();
      const hill = mesh(lumpy(1, 2, 0.08, 9), MAT.rock); hill.scale.set(w / U * 0.75, h / U * 0.9, 0.9); hill.position.set(w / U / 2, -h / U * 0.1, -0.5); g.add(hill);
      g.add(mesh(new THREE.CircleGeometry(h / U * 0.35, 20, 0, Math.PI), MAT.dark, w / U / 2, -h / U * 0.62, 0.36, false));
      g.add(mesh(new THREE.PlaneGeometry(h / U * 0.7, h / U * 0.38), MAT.dark, w / U / 2, -h / U * 0.81, 0.36, false));
      if (closed) { const st = mesh(new THREE.CylinderGeometry(h / U * 0.3, h / U * 0.3, 0.16, 24), MAT.rock, w / U / 2 + h / U * 0.18, -h / U * 0.72, 0.48); st.rotation.x = Math.PI / 2; g.add(st); }
      g.position.copy(P(x, y)); return add(g);
    },
    water(x, y, w, h) { const m = mesh(new THREE.BoxGeometry(w / U, h / U, 1.2), MAT.water, 0, 0, 0, false, true); m.position.copy(P(x + w / 2, y + h / 2, -0.5)); return add(m); },
    field(x, y, w, h, { z0 = -1.6, z1 = 0.6 } = {}) { const m = mesh(slab(w / U, 0.12, z1 - z0, 0.05, 0.02), MAT.field, 0, -0.12, z0); const g = new THREE.Group(); g.add(m); g.position.copy(P(x, y)); return add(g); },
    // a flat thing lying on the ground plane (painted marks, a lime ring) — drawn as a thin slab
    disc(x, y, rx, ry, mat, { z = 0, h = 0.03 } = {}) { const m = mesh(new THREE.CylinderGeometry(1, 1, h, 32), mat, 0, 0, 0, false); m.scale.set(rx / U, 1, ry / U); m.position.copy(P(x, y, z)); return add(m); },
    // An indoor room in the Mikdash: an ashlar back wall, a stone floor, pilasters at the sides.
    room({ floor = 860, seed = 5, pillars = true, lamps = true } = {}) {
      const g = new THREE.Group();
      g.add(mesh(slab(W + 2, floor / U + 1, 0.4, 0.01, 0), MAT.stone, -1, -floor / U - 0.5, -2.6));
      const fl = mesh(slab(W + 1, (960 - floor) / U + 0.5, 4.2, 0.02, 0.02), MAT.floor, -0.5, -960 / U - 0.5, -2.4);
      g.add(fl);
      if (pillars) for (const px of [0.25, W - 0.25]) {
        g.add(mesh(slab(0.6, floor / U + 0.6, 0.6, 0.02, 0.02), MAT.stone, px - 0.3, -floor / U, -2.1));
        g.add(mesh(new THREE.BoxGeometry(0.8, 0.25, 0.8), MAT.stoneSmooth, px, -floor / U + 0.12, -1.8));
      }
      if (lamps) for (const [lx, ly] of [[90, floor - 330], [450, floor - 330]]) {
        const l = new THREE.PointLight(0xffc070, 6, 9, 1.6); l.position.copy(P(lx, ly, -1.2)); g.add(l);
        g.add(mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.12, 12), MAT.clay, lx / U, -ly / U - 0.12, -1.9));
        const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.soft, color: 0xffb040, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); f.scale.set(0.9, 0.9, 1); f.position.copy(P(lx, ly, -1.85)); g.add(f);
      }
      return add(g);
    },
    // a soft point light (an oil lamp, a fire) at logical (x, y)
    light(x, y, { color = 0xffc070, power = 5, dist = 8, z = 0.6 } = {}) { const l = new THREE.PointLight(color, power, dist, 1.6); l.position.copy(P(x, y, z)); return add(l); },
    // a straight beam (a ramp, a rail, a pole) between two logical points; thickness h px, depth d units
    beam(x1, y1, x2, y2, { h = 14, d = 0.8, z = 0.1, mat } = {}) {
      const L = Math.hypot(x2 - x1, y2 - y1);
      const m = mesh(new THREE.BoxGeometry(L / U, h / U, d), mat || MAT.plank);
      m.position.copy(P((x1 + x2) / 2, (y1 + y2) / 2, z)); m.rotation.z = -Math.atan2(y2 - y1, x2 - x1);
      return add(m);
    },
    // a rope between two logical points (with an optional sag in px)
    rope(x1, y1, x2, y2, { sag = 0, z = 0.3, r = 0.035 } = {}) {
      const a = P(x1, y1, z), b = P(x2, y2, z), m = a.clone().lerp(b, 0.5); m.y -= sag / U;
      const tube = mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, m, b), 20, r, 6), std(0xc8a36a, { roughness: 1 }));
      return add(tube);
    },
    // ---- props (return an Object3D; move it with K.place) ----
    pin() { // a golden pin along +x (ring at x=0, tip at x=len); set length with obj.userData.len
      const g = new THREE.Group();
      const rod = mesh(new THREE.CylinderGeometry(0.075, 0.075, 1, 14), MAT.gold); rod.rotation.z = Math.PI / 2; g.add(rod);
      const tip = mesh(new THREE.ConeGeometry(0.075, 0.18, 14), MAT.gold); tip.rotation.z = -Math.PI / 2; g.add(tip);
      const ring = mesh(new THREE.TorusGeometry(0.2, 0.065, 12, 28), MAT.goldBright); g.add(ring);
      g.userData = { rod, tip, ring }; return add(g);
    },
    plank(w, h = 14, d = 0.9) { const m = mesh(new THREE.BoxGeometry(w / U, h / U, d), MAT.plank); return add(wrap(m)); },
    log(w) { const m = mesh(new THREE.CylinderGeometry(0.17, 0.17, w / U, 14), MAT.wood); m.rotation.z = Math.PI / 2; return add(wrap(m)); },
    boulder(r) { return add(wrap(mesh(lumpy(r / U, 1, 0.14, 7), MAT.rock))); },
    stoneBlock(s = 44) { return add(wrap(mesh(slab(s / U, s / U, s / U, 0.06, 0.03), std(0xb5afa4, { roughness: 0.9, map: TEX.lime }), -s / U / 2, -s / U / 2, -s / U / 2))); },
    bone(s = 1) {
      const g = new THREE.Group();
      g.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.36, 10), MAT.bone)).rotation.z = Math.PI / 2;
      for (const sx of [-0.2, 0.2]) for (const sz of [-0.05, 0.05]) g.add(mesh(new THREE.SphereGeometry(0.07, 10, 8), MAT.bone, sx, 0, sz));
      g.scale.setScalar(s); return add(wrap(g));
    },
    twig(s = 1) { const g = new THREE.Group(); const a = mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.42, 6), std(0xd2c3a2)); a.rotation.z = Math.PI / 2; g.add(a); const b = mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.16, 5), std(0xd2c3a2), 0.08, 0.05, 0); b.rotation.z = -0.8; g.add(b); g.scale.setScalar(s); return add(wrap(g)); },
    skull(s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.SphereGeometry(0.2, 16, 12), MAT.bone)); g.add(mesh(new THREE.BoxGeometry(0.2, 0.12, 0.16), MAT.bone, 0, -0.16, 0.02)); for (const ex of [-0.07, 0.07]) g.add(mesh(new THREE.SphereGeometry(0.05, 8, 6), MAT.dark, ex, 0, 0.17, false)); g.scale.setScalar(s); return add(wrap(g)); },
    mouse(s = 1) {
      const g = new THREE.Group(), fur = std(0x9a9a9a, { roughness: 1 });
      const b = mesh(new THREE.SphereGeometry(0.2, 14, 10), fur); b.scale.set(1.2, 0.65, 0.8); g.add(b);
      g.add(mesh(new THREE.SphereGeometry(0.1, 10, 8), fur, 0.25, 0.02, 0));
      g.add(mesh(new THREE.SphereGeometry(0.06, 8, 6), std(0xf4b6c2), 0.22, 0.12, 0.05));
      const tail = mesh(new THREE.TorusGeometry(0.15, 0.015, 5, 12, Math.PI), std(0xd8a0a8), -0.32, 0.02, 0); g.add(tail);
      for (const lx of [-0.08, 0.08]) { const l = mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 5), fur, lx, 0.15, 0.05); g.add(l); }
      g.rotation.z = Math.PI; g.scale.setScalar(s);
      const w = new THREE.Group(); g.position.y = 0.12; w.add(g); return add(w);
    },
    fox(s = 1) {
      const g = new THREE.Group(), fur = std(0xe07b2f, { roughness: 1 }), white = std(0xfbe3c8, { roughness: 1 });
      const b = mesh(new THREE.SphereGeometry(0.4, 16, 12), fur); b.scale.set(1.3, 0.5, 0.6); g.add(b);
      g.add(mesh(new THREE.SphereGeometry(0.2, 12, 10), fur, 0.55, 0.02, 0));
      const snout = mesh(new THREE.ConeGeometry(0.1, 0.25, 10), white, 0.75, -0.02, 0); snout.rotation.z = -Math.PI / 2; g.add(snout);
      for (const ez of [-0.08, 0.08]) { const e = mesh(new THREE.ConeGeometry(0.06, 0.15, 6), fur, 0.55, 0.18, ez); g.add(e); }
      const tail = mesh(new THREE.SphereGeometry(0.2, 10, 8), fur, -0.62, -0.02, 0); tail.scale.set(1.8, 0.6, 0.7); g.add(tail);
      g.add(mesh(new THREE.SphereGeometry(0.09, 8, 6), white, -0.9, -0.02, 0));
      g.scale.setScalar(s); return add(wrap(g));
    },
    barrel(s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 18, 1), MAT.plank)); for (const yy of [-0.25, 0.25]) g.add(mesh(new THREE.TorusGeometry(0.31, 0.025, 6, 24), MAT.metal, 0, yy, 0)).rotation.x = Math.PI / 2; g.add(mesh(new THREE.CircleGeometry(0.28, 18), MAT.water, 0, 0.41, 0)).rotation.x = -Math.PI / 2; g.scale.setScalar(s); return add(wrap(g)); },
    hive(s = 1) { const g = new THREE.Group(); for (let i = 0; i < 4; i++) g.add(mesh(new THREE.TorusGeometry(0.3 - i * 0.06, 0.1, 10, 20), std(0xf2b84b, { roughness: 0.9 }), 0, -i * 0.15, 0)).rotation.x = Math.PI / 2; g.add(mesh(new THREE.CircleGeometry(0.07, 10), MAT.dark, 0, 0.05, 0.36)); g.scale.setScalar(s); return add(wrap(g)); },
    bee() { const g = new THREE.Group(); const b = mesh(new THREE.SphereGeometry(0.07, 8, 6), std(0xffd23f), 0, 0, 0, false); b.scale.set(1.4, 1, 1); g.add(b); g.add(mesh(new THREE.SphereGeometry(0.05, 6, 4), std(0xffffff, { transparent: true, opacity: 0.7 }), 0, 0.07, 0, false)); return add(g); },
    stepStone(r, wobbly) {
      const g = new THREE.Group();
      const st = mesh(lumpy(r / U, 1, 0.08, r), std(wobbly ? 0xc4bdb0 : 0xb3ab9c, { roughness: 0.9, map: TEX.rock })); st.scale.set(1, 0.35, 0.8); g.add(st);
      if (wobbly) for (const px of [-0.45, 0.4]) g.add(mesh(new THREE.SphereGeometry(0.06, 8, 6), std(0x8a7f70), px * r / U, -0.13, 0.15));
      return add(wrap(g));
    },
    crate(w, h) { return add(wrap(mesh(new THREE.BoxGeometry(w / U, h / U, 0.7), MAT.plank))); },
    jar({ material = 'clay', sealed = false, loose = false, seal = null, flask = false, bowl = false, oil = false } = {}, s = 1) {
      const mat = material === 'stone' ? MAT.stoneVessel : material === 'metal' ? MAT.metal : MAT.clay;
      const g = new THREE.Group();
      const prof = bowl ? [[0, 0], [0.3, 0.02], [0.42, 0.18], [0.44, 0.3], [0.4, 0.31]] : flask ? [[0, 0], [0.28, 0.04], [0.33, 0.28], [0.25, 0.52], [0.1, 0.6], [0.09, 0.78], [0.12, 0.8]] : [[0, 0], [0.2, 0.02], [0.34, 0.2], [0.36, 0.42], [0.22, 0.68], [0.14, 0.72], [0.16, 0.8]];
      const top = prof[prof.length - 1][1];
      g.add(mesh(new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 24), mat));
      if (bowl && oil) g.add(mesh(new THREE.CircleGeometry(0.4, 20), std(0xe0b030, { roughness: 0.2 }), 0, top - 0.04, 0)).rotation.x = -Math.PI / 2;
      if (sealed) g.add(mesh(new THREE.SphereGeometry(0.17, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0x9c7350), 0, top, 0));
      if (loose) { const c = mesh(new THREE.SphereGeometry(0.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xefe7d2, { roughness: 1 }), 0, top - 0.02, 0); c.scale.set(1.2, 0.6, 1.2); g.add(c); }
      if (seal) {
        const sm = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16), std(0xb8322a), 0.0, top - 0.12, 0.15); sm.rotation.x = Math.PI / 2; g.add(sm);
        if (seal === 'kg') g.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 6), MAT.goldBright, 0, top - 0.12, 0.17)).rotation.x = Math.PI / 2;
        if (seal === 'broken') { sm.scale.set(0.6, 1, 1); sm.position.x = -0.05; const sb = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 6), std(0xb8322a), 0.08, top - 0.16, 0.15); sb.rotation.x = Math.PI / 2; g.add(sb); }
      }
      g.scale.setScalar(s * 0.95); return add(wrap(g));
    },
    ladle(s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8), MAT.metal, 0, 0.35, 0)); g.add(mesh(new THREE.SphereGeometry(0.11, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.metal, 0, 0.06, 0)); g.scale.setScalar(s); return add(wrap(g)); },
    cup(material = 'stone', s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.LatheGeometry([[0, 0], [0.16, 0.01], [0.2, 0.3], [0.22, 0.32]].map(([a, b]) => new THREE.Vector2(a, b)), 20), material === 'stone' ? MAT.stoneVessel : material === 'metal' ? MAT.metal : MAT.clay)); g.scale.setScalar(s); return add(wrap(g)); },
    loaf(s = 1) { const m = mesh(new THREE.SphereGeometry(0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(0xd9963e, { roughness: 0.8 })); m.scale.set(1.2, 0.8, 0.8); m.scale.multiplyScalar(s); return add(wrap(m)); },
    hay(s = 1) { const m = mesh(lumpy(0.5, 2, 0.12, 2), MAT.hay); m.scale.set(1.2, 0.7, 0.8); m.scale.multiplyScalar(s); return add(wrap(m)); },
    cart(s = 1) {
      const g = new THREE.Group();
      g.add(mesh(new THREE.BoxGeometry(1.4, 0.4, 0.8), MAT.plank, 0, 0.45, 0));
      for (const wx of [-0.45, 0.45]) { const w = mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 16), MAT.wood, wx, 0.25, 0.42); w.rotation.x = Math.PI / 2; g.add(w); }
      const sh = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), MAT.wood, 0.95, 0.45, 0); sh.rotation.z = 1.3; g.add(sh);
      g.scale.setScalar(s); return add(wrap(g));
    },
    blower(s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.BoxGeometry(0.4, 0.34, 0.3), std(0xe85d3a, { roughness: 0.5 }))); const n = mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.5, 12), std(0xf39a73, { roughness: 0.5 }), 0.42, 0, 0); n.rotation.z = Math.PI / 2; g.add(n); g.scale.setScalar(s); return add(wrap(g)); },
    bucket(s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.34, 14), MAT.metal)); g.add(mesh(new THREE.CircleGeometry(0.19, 14), MAT.lime, 0, 0.17, 0)).rotation.x = -Math.PI / 2; g.scale.setScalar(s); return add(wrap(g)); },
    sheep(s = 1) { const g = new THREE.Group(); const b = mesh(lumpy(0.3, 2, 0.12, 3), std(0xf5f2ea, { roughness: 1 }), 0, 0.35, 0); b.scale.set(1.3, 0.9, 0.9); g.add(b); g.add(mesh(new THREE.SphereGeometry(0.13, 10, 8), std(0x3a3028), 0.42, 0.42, 0)); for (const lx of [-0.2, 0.2]) g.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.25, 6), std(0x3a3028), lx, 0.1, 0.1)); g.scale.setScalar(s); return add(wrap(g)); },
    menorah(s = 1) {
      const g = new THREE.Group(), flames = [];
      g.add(mesh(new THREE.CylinderGeometry(0.5, 0.65, 0.18, 24), MAT.gold, 0, 0.09, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.7, 12), MAT.gold, 0, 1.0, 0));
      for (let i = 1; i <= 3; i++) { const a = mesh(new THREE.TorusGeometry(i * 0.42, 0.045, 10, 30, Math.PI), MAT.gold, 0, 1.85, 0); a.rotation.z = Math.PI; g.add(a); }
      [-3, -2, -1, 0, 1, 2, 3].forEach(k => {
        const x = k * 0.42;
        g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, k === 0 ? 0.0 : 0.0, 6), MAT.gold, x, 1.85, 0));
        g.add(mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.12, 12), MAT.goldBright, x, 1.92, 0));
        const f = mesh(new THREE.ConeGeometry(0.06, 0.2, 10), new THREE.MeshBasicMaterial({ color: 0xffc040 }), x, 2.08, 0, false, false); f.visible = false; g.add(f);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.soft, color: 0xffb040, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(0.6, 0.6, 1); glow.position.set(x, 2.08, 0.05); glow.visible = false; g.add(glow);
        flames.push([f, glow]);
      });
      g.userData.flames = flames;
      g.scale.setScalar(s); return add(wrap(g));
    },
    // a wooden sign board (text is drawn in the 2D overlay)
    signBoard(x, y, w, h, { post = true } = {}) {
      const g = new THREE.Group();
      g.add(mesh(new THREE.BoxGeometry(w / U, h / U, 0.08), MAT.plank, 0, 0, 0));
      if (post) g.add(mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), MAT.wood, 0, -h / U / 2 - 0.4, -0.05));
      g.position.copy(P(x, y - h / 2, 0.3)); return add(g);
    },
    donkey(opts) { return add(wrap(makeDonkey(opts))); },
    char(kind) { const c = makeChar(kind); add(c.group); return c; },
    // place an Object3D at logical (x, y), z depth, rotation around z (radians, logical clockwise)
    place(o, x, y, z = 0, rot = 0) { o.position.copy(P(x, y, z)); o.rotation.z = -rot; return o; },
  };
  return K;
}
function wrap(o) { const g = new THREE.Group(); g.add(o); return g; }

// ---------- characters (adapted from Avodah: Beit HaMikdash) ----------
const GEO = {};
const CHAR_S = 1.1;      // a character is about 1.75 units (122 px) tall
function geo() {
  if (GEO.head) return GEO;
  GEO.head = new THREE.SphereGeometry(0.26, 24, 18);
  GEO.eye = new THREE.SphereGeometry(0.042, 10, 8);
  GEO.glint = new THREE.SphereGeometry(0.014, 6, 4);
  GEO.cheek = new THREE.SphereGeometry(0.05, 10, 6); GEO.cheek.scale(1, 0.6, 0.3);
  GEO.smile = new THREE.TorusGeometry(0.05, 0.013, 6, 14, Math.PI); GEO.smile.rotateZ(Math.PI);
  GEO.frown = new THREE.TorusGeometry(0.045, 0.013, 6, 14, Math.PI);
  GEO.mouthO = new THREE.SphereGeometry(0.035, 10, 8);
  GEO.nose = new THREE.SphereGeometry(0.03, 8, 6);
  GEO.arm = new THREE.CapsuleGeometry(0.068, 0.3, 4, 10); GEO.arm.translate(0, -0.2, 0);
  GEO.hand = new THREE.SphereGeometry(0.072, 10, 8);
  GEO.foot = new THREE.SphereGeometry(0.075, 10, 8); GEO.foot.scale(1, 0.55, 1.5);
  GEO.robe = new THREE.LatheGeometry([[0.3, 0.0], [0.31, 0.04], [0.28, 0.3], [0.235, 0.62], [0.215, 0.85], [0.19, 1.02], [0.12, 1.1], [0.0, 1.12]].map(([x, y]) => new THREE.Vector2(x, y)), 28);
  GEO.sash = new THREE.CylinderGeometry(0.228, 0.236, 0.1, 28, 1, true);
  GEO.band = new THREE.CylinderGeometry(0.229, 0.231, 0.0185, 28, 1, true);
  GEO.turbanRing = new THREE.TorusGeometry(0.2, 0.065, 10, 24); GEO.turbanRing.rotateX(Math.PI / 2);
  GEO.dome = new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  GEO.hairBack = new THREE.SphereGeometry(0.272, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62);
  GEO.beard = new THREE.SphereGeometry(0.2, 14, 10, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55); GEO.beard.scale(1.05, 1.0, 0.9);
  GEO.longBeard = new THREE.ConeGeometry(0.17, 0.5, 14); GEO.longBeard.rotateX(Math.PI);
  GEO.cap = new THREE.SphereGeometry(0.27, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42);
  GEO.scarf = new THREE.SphereGeometry(0.29, 18, 14, Math.PI * 0.85, Math.PI * 1.3, 0, Math.PI * 0.62);
  GEO.scarfTop = new THREE.SphereGeometry(0.292, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.3);
  GEO.drape = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 18, 1, true, Math.PI * 0.35, Math.PI * 1.3);
  GEO.brim = new THREE.CylinderGeometry(0.46, 0.46, 0.03, 24);
  GEO.crown = new THREE.SphereGeometry(0.24, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  GEO.curl = new THREE.SphereGeometry(0.07, 8, 6);
  return GEO;
}
// kind → look. 'kohenRoad' = white linen and a white cap, without the avnet (that's only for the Avodah)
const LOOKS = {
  eli:      { role: 'kohenRoad', skin: 0xf3d0b0, hair: 0xa8461f },
  yehuda:   { role: 'kohenRoad', skin: 0xe8b98f, hair: 0x2a1b10, curls: true },
  kohen:    { role: 'kohen', skin: 0xf0c7a3, hair: 0x4a3020, beard: true, scale: 1.08 },
  gad:      { role: 'yisrael', skin: 0xe0ab7c, hair: 0x5a3a1e, beard: true, robe: 0x5e9e48, accent: 0x8a5a2c, hat: 'straw' },
  farmer:   { role: 'yisrael', skin: 0xd9a477, hair: 0x3b2416, beard: true, robe: 0xc9a227, accent: 0x7a5a10, hat: 'straw' },
  zevulun:  { role: 'yisrael', skin: 0xf0c7a3, hair: 0xf2f2f2, longBeard: true, robe: 0x8d6e63, accent: 0x5d4037, cane: true, accent2: 0xf2f2f2 },
  miriam:   { role: 'woman', skin: 0xf3d0b0, hair: 0xa8461f, robe: 0xd9536f, accent: 0x4a7bd0, basket: true },
  batya:    { role: 'woman', skin: 0xd9a477, hair: 0x3b2416, robe: 0xf0a43a, accent: 0xf6d860 },
  helper:   { role: 'yisrael', skin: 0xe2b088, hair: 0x3b2416, beard: true, robe: 0xa47148, accent: 0x6d4a2c },
  pilgrimA: { role: 'yisrael', skin: 0xe8b98f, hair: 0x2b1d14, beard: true, robe: 0x4f86e0, accent: 0x2f5fb0 },
  pilgrimB: { role: 'woman', skin: 0xf3c9a0, hair: 0x6b3b1b, robe: 0xe27d60, accent: 0x85c7a2 },
  pilgrimC: { role: 'yisrael', skin: 0xd9a477, hair: 0x1f140c, robe: 0x9b72cf, accent: 0x6f4aa8 },
};
function bakeGroup(group) {
  const buckets = {};
  const remove = [];
  for (const child of group.children) {
    if (!child.isMesh || child.userData.noBake) continue;
    child.updateMatrix();
    const m = child.material;
    const key = m.metalness > 0.5 ? 'metal' : 'std';
    const g = child.geometry.clone().applyMatrix4(child.matrix);
    const col = new THREE.Color(m.color);
    if (g.index) { /* keep */ }
    const n = g.attributes.position.count, cols = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b; }
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k);
    (buckets[key] = buckets[key] || []).push(g.index ? g.toNonIndexed() : g);
    remove.push(child);
  }
  for (const c of remove) group.remove(c);
  for (const key in buckets) {
    const merged = mergeGeometries(buckets[key], false);
    if (!merged) continue;
    const mm = new THREE.Mesh(merged, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: key === 'metal' ? 0.25 : 0.8, metalness: key === 'metal' ? 1 : 0 }));
    mm.castShadow = true; mm.userData.baked = true;
    group.add(mm);
  }
}
function makeChar(kind) {
  const G = geo(), L = LOOKS[kind] || LOOKS.eli;
  const role = L.role;
  const isKohen = role === 'kohen' || role === 'kohenRoad';
  const skinM = std(L.skin, { roughness: 0.65 }), hairM = std(L.hair, { roughness: 0.9 });
  const robeM = isKohen ? std(0xfbf8f2, { map: TEX.linen, roughness: 0.85 }) : std(L.robe ?? 0x9b6b43, { roughness: 0.9 });
  const root = new THREE.Group(), turn = new THREE.Group(), body = new THREE.Group();
  root.add(turn); turn.add(body);
  body.add(mesh(G.robe, robeM, 0, 0.02, 0));
  if (role === 'kohen') {
    const bands = [0x2346a8, 0xf2ede0, 0x6b2a8c, 0xf2ede0, 0xc0283a, 0xf2ede0];
    bands.forEach((c, i) => body.add(mesh(G.band, std(c, { roughness: 0.8 }), 0, 0.67 + i * 0.0185, 0)));
  } else if (role === 'kohenRoad') {
    body.add(mesh(G.sash, std(0xece8dc, { roughness: 0.9 }), 0, 0.72, 0));
  } else body.add(mesh(G.sash, std(L.accent ?? 0x5a4a3a), 0, 0.72, 0));
  const head = new THREE.Group(); head.position.y = 1.36; body.add(head);
  head.add(mesh(G.head, skinM));
  const eyeM = std(0x1d1410, { roughness: 0.3 }), glintM = std(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.5 });
  for (const s of [-1, 1]) {
    head.add(mesh(G.eye, eyeM, s * 0.092, 0.025, 0.225, false));
    head.add(mesh(G.glint, glintM, s * 0.092 + 0.014, 0.042, 0.262, false));
    head.add(mesh(G.cheek, std(0xf6ab9e, { roughness: 1 }), s * 0.155, -0.045, 0.2, false));
  }
  head.add(mesh(G.nose, std(new THREE.Color(L.skin).multiplyScalar(0.92).getHex()), 0, -0.01, 0.255, false));
  const mouths = { smile: mesh(G.smile, std(0x5a2a1a), 0, -0.075, 0.235, false), frown: mesh(G.frown, std(0x5a2a1a), 0, -0.1, 0.235, false), oh: mesh(G.mouthO, std(0x5a2a1a), 0, -0.09, 0.235, false) };
  for (const k in mouths) { mouths[k].userData.noBake = true; mouths[k].visible = k === 'smile'; head.add(mouths[k]); }
  const hb = mesh(G.hairBack, hairM, 0, 0, -0.012); hb.rotation.x = -0.55; head.add(hb);
  if (L.curls) for (let i = 0; i < 7; i++) head.add(mesh(G.curl, hairM, Math.cos(i * 0.5 + 0.4) * 0.22, 0.18 + Math.sin(i) * 0.03, 0.08 - i * 0.03));
  if (L.beard) head.add(mesh(G.beard, hairM, 0, -0.06, 0.06));
  if (L.longBeard) head.add(mesh(G.longBeard, hairM, 0, -0.3, 0.12));
  if (role === 'kohen') {
    const tm = std(0xfbf8f2, { map: TEX.linen, roughness: 0.85 });
    for (let i = 0; i < 3; i++) { const r = mesh(G.turbanRing, tm, 0, 0.14 + i * 0.075, 0); r.scale.setScalar(1.12 - i * 0.07); head.add(r); }
    head.add(mesh(G.dome, tm, 0, 0.27, 0));
  } else if (role === 'kohenRoad') head.add(mesh(G.cap, std(0xffffff, { map: TEX.linen, roughness: 0.85 }), 0, 0.07, 0));
  else if (role === 'woman') { const sm = std(L.accent ?? 0x8a3b4a, { roughness: 0.9 }); head.add(mesh(G.scarf, std(L.accent ?? 0x8a3b4a, { roughness: 0.9, side: THREE.DoubleSide }), 0, -0.02, -0.01)); head.add(mesh(G.scarfTop, sm, 0, -0.02, -0.01)); head.add(mesh(G.drape, std(L.accent ?? 0x8a3b4a, { roughness: 0.9, side: THREE.DoubleSide }), 0, -0.3, -0.02)); }
  else if (L.hat === 'straw') { const sm = std(0xe9c46a, { roughness: 1 }); head.add(mesh(G.brim, sm, 0, 0.16, 0)); head.add(mesh(G.crown, sm, 0, 0.16, 0)); head.add(mesh(G.band, std(0xc0392b), 0, 0.2, 0)); }
  else head.add(mesh(G.cap, std(L.accent2 ?? 0xe9dfca), 0, 0.07, 0));
  const arms = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(s * 0.215, 0.98, 0);
    pivot.add(mesh(G.arm, robeM)); pivot.add(mesh(G.hand, skinM, 0, -0.42, 0));
    pivot.rotation.z = s * 0.12; body.add(pivot); arms.push(pivot);
  }
  const feet = [];
  const footM = isKohen ? skinM : std(0x6b4a2b);
  for (const s of [-1, 1]) { const f = mesh(G.foot, footM, s * 0.11, 0.035, 0.08); turn.add(f); feet.push(f); }
  const holder = new THREE.Group(); holder.position.set(0.25, 0.86, 0.3); body.add(holder);
  if (L.basket) { const b = mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.18, 14), std(0xd9a35a, { roughness: 1 }), 0.32, 0.55, 0.12); b.userData.noBake = true; body.add(b); for (const [dx, c] of [[-0.06, 0xf2c14e], [0.06, 0x8bc34a]]) { const f = mesh(new THREE.SphereGeometry(0.06, 8, 6), std(c), 0.32 + dx, 0.66, 0.12); f.userData.noBake = true; body.add(f); } }
  if (L.cane) { const c = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 6), MAT.wood, 0.42, 0.55, 0.1); c.userData.noBake = true; turn.add(c); }
  bakeGroup(body); bakeGroup(head); arms.forEach(a => bakeGroup(a));
  root.scale.setScalar((L.scale ?? 1) * CHAR_S);
  const ch = {
    group: root, kind, phase: 0, t: Math.random() * 10, mood: 'idle', held: null, glowMat: null,
    setHeld(obj) { if (this.held) holder.remove(this.held); this.held = obj || null; if (obj) { holder.add(obj); obj.position.set(0, 0, 0); } },
    setMood(m) { this.mood = m; mouths.smile.visible = m === 'idle' || m === 'happy'; mouths.frown.visible = m === 'sad' || m === 'no'; mouths.oh.visible = m === 'oh'; },
    update(dt, { walking = false, dir = 1, phase = 0 } = {}) {
      this.t += dt;
      const sw = walking ? Math.sin(phase) : 0;
      turn.rotation.y = walking ? dir * 1.15 : dir * 0.35;
      body.position.y = walking ? Math.abs(Math.sin(phase)) * 0.045 : Math.sin(this.t * 2) * 0.006;
      body.rotation.z = walking ? Math.sin(phase) * 0.035 : 0;
      head.rotation.y = this.mood === 'no' ? Math.sin(this.t * 10) * 0.35 : 0;
      feet[0].position.z = 0.08 + sw * 0.17; feet[1].position.z = 0.08 - sw * 0.17;
      feet[0].position.y = 0.035 + Math.max(0, sw) * 0.06; feet[1].position.y = 0.035 + Math.max(0, -sw) * 0.06;
      const raise = this.mood === 'happy' ? 1 : 0, carry = this.held ? 1 : 0;
      for (let i = 0; i < 2; i++) {
        const s = i === 0 ? -1 : 1;
        arms[i].rotation.x = -sw * s * 0.55 * (1 - raise) - carry * 1.0 * (i === 1 ? 1 : 0) - raise * 2.7 + (raise ? Math.sin(this.t * 8 + i) * 0.2 : 0);
        arms[i].rotation.z = s * (0.12 + raise * 0.4);
      }
    },
  };
  ch.setMood('idle');
  return ch;
}
function makeDonkey({ strong = true, color, s = 1 } = {}) {
  const g = new THREE.Group();
  const col = color ?? (strong ? 0x8c7663 : 0xb9ab9d);
  const m = std(col, { roughness: 1 }), light = std(new THREE.Color(col).lerp(new THREE.Color(0xffffff), 0.45).getHex(), { roughness: 1 });
  const body = mesh(new THREE.CapsuleGeometry(0.32, 0.7, 6, 14), m, 0, 0.85, 0); body.rotation.z = Math.PI / 2; g.add(body);
  const neck = mesh(new THREE.CapsuleGeometry(0.14, 0.4, 4, 10), m, 0.55, 1.15, 0); neck.rotation.z = -0.7; g.add(neck);
  const head = mesh(new THREE.CapsuleGeometry(0.15, 0.3, 4, 10), m, 0.82, 1.32, 0); head.rotation.z = -1.3; g.add(head);
  g.add(mesh(new THREE.SphereGeometry(0.12, 10, 8), light, 1.0, 1.24, 0));
  for (const ez of [-0.07, 0.07]) { const e = mesh(new THREE.ConeGeometry(0.05, 0.32, 8), m, 0.72, 1.6, ez); e.rotation.z = 0.2; g.add(e); }
  for (const ez of [-0.11, 0.11]) g.add(mesh(new THREE.SphereGeometry(0.03, 6, 5), std(0x111111), 0.86, 1.4, ez * 1.2, false));
  const legs = [];
  for (const [lx, lz] of [[-0.4, -0.15], [-0.4, 0.15], [0.38, -0.15], [0.38, 0.15]]) { const l = mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.62, 8), m, lx, 0.32, lz); legs.push(l); g.add(l); g.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.06, 8), std(0x2a1d14), lx, 0.03, lz)); }
  const tail = mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.45, 6), m, -0.75, 0.75, 0); tail.rotation.z = 0.4; g.add(tail);
  g.userData = { legs, strong };
  g.scale.setScalar(s);
  return g;
}

// ---------- the renderer ----------
// ?gfx=low: no shadows or antialiasing, half resolution (old phones, and the browser tests)
const LOW = /[?&]gfx=low\b/.test(location.search);
function init(canvas) {
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW }); } catch (e) { renderer = null; return false; }
  renderer.shadowMap.enabled = !LOW; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  // metals need something to reflect: a soft sky-over-earth environment, used only by the metal materials
  const envScene = new THREE.Scene();
  const sphere = new THREE.SphereGeometry(10, 32, 16), cols = [];
  for (let i = 0; i < sphere.attributes.position.count; i++) { const y = sphere.attributes.position.getY(i) / 10; const c = new THREE.Color(y > 0 ? 0xcfe6ff : 0x8a6a48).lerp(new THREE.Color(0xfff4dc), Math.max(0, 1 - Math.abs(y) * 3)); cols.push(c.r, c.g, c.b); }
  sphere.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  envScene.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const env = new THREE.PMREMGenerator(renderer).fromScene(envScene, 0.04).texture;
  for (const m of [MAT.metal, MAT.gold, MAT.goldBright]) { m.envMap = env; m.needsUpdate = true; }
  camera = new THREE.PerspectiveCamera(30, W / H, 1, 200);
  setCamera();
  resize();
  window.addEventListener('resize', resize);
  return true;
}
// An off-axis frustum: the camera sits CAM_RISE units above the frame centre and
// looks straight down -z, and the window on z = 0 is exactly the logical frame.
function setCamera() {
  const cx = W / 2, cy = -H / 2;
  camera.position.set(cx, cy + CAM_RISE, CAM_D);
  camera.rotation.set(0, 0, 0);
  camera.updateMatrixWorld();
  const n = camera.near, k = n / CAM_D;
  const left = -W / 2 * k, right = W / 2 * k, top = (H / 2 - CAM_RISE) * k, bottom = (-H / 2 - CAM_RISE) * k;
  camera.projectionMatrix.makePerspective(left, right, top, bottom, n, camera.far);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}
function resize() {
  if (!renderer) return;
  const dpr = LOW ? 0.5 : Math.min(2, window.devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);
  renderer.setSize(540, 960, false);
}
function render(ctx) { if (renderer && ctx) renderer.render(ctx.scene, camera); }

// keep characters and pins in step with the game's 2D objects
function syncActor(ctx, a, dt) {
  let c = ctx.actors.get(a);
  if (!c) { c = makeChar(a.kind); ctx.scene.add(c.group); ctx.actors.set(a, c); }
  c.group.visible = a.visible !== false;
  c.group.position.copy(P(a.x, a.y, a.z ?? 0.05));
  c.group.scale.setScalar(CHAR_S * (a.s || 1) * ((LOOKS[a.kind] || {}).scale || 1));
  if (c.mood !== a.mood) c.setMood(a.mood);
  if ((a.hold || null) !== (c.heldKind || null)) {
    c.heldKind = a.hold || null;
    const K = ctx.K;
    const obj = a.hold === 'blower' ? K.blower(0.6) : a.hold === 'bucket' ? K.bucket(0.8) : a.hold === 'jug' ? K.jar({ seal: 'kg' }, 0.5) : a.hold === 'lamp' ? K.jar({ bowl: true, oil: true }, 0.4) : a.hold ? K.crate(20, 20) : null;
    if (obj) ctx.scene.remove(obj);
    c.setHeld(obj);
  }
  c.update(dt, { walking: a.walking, dir: a.dir, phase: a.phase });
}
function syncPin(ctx, p) {
  let o = ctx.pins.get(p);
  if (!o) { o = ctx.K.pin(); ctx.pins.set(p, o); }
  const dx = p.x2 - p.x1, dy = p.y2 - p.y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const e = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
  const off = -e * (L + 50);
  const len = L / U;
  o.visible = p.t < 1;
  const { rod, tip, ring } = o.userData;
  rod.scale.set(1, len, 1); rod.position.set(len / 2 + 0.2, 0, 0);
  tip.position.set(len + 0.29, 0, 0);
  ring.position.set(0, 0, 0);
  o.position.copy(P(p.x1 + ux * off - ux * 16, p.y1 + uy * off - uy * 16, 0.45));
  o.rotation.set(0, 0, -Math.atan2(dy, dx));
}
function frame(ctx, actors, pins, dt, t) {
  for (const a of actors) syncActor(ctx, a, dt);
  for (const p of pins) syncPin(ctx, p);
  for (const f of ctx.syncs) f(t, dt);
}

// render a one-off scene (the title picture) and hand the canvas to draw(), then free it
function snapshot(build, actors, draw, opts = { mode: 'day', seed: 4, horizon: 700 }) {
  if (!renderer) return false;
  const ctx = newScene(opts);
  build(ctx.K);
  frame(ctx, actors, [], 0.016, 0);
  renderer.render(ctx.scene, camera);
  draw(renderer.domElement);
  ctx.dispose();
  return true;
}

let readyResolve;
const ready = new Promise(r => { readyResolve = r; });
window.R3 = { init, newScene, render, frame, snapshot, ready, P, U, W, H, THREE, CAM_D, CAM_RISE };
buildMaterials().then(() => readyResolve());
window.dispatchEvent(new Event('r3'));

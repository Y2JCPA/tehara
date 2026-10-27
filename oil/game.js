/* The Last Jug: test scene (Act II, Beit Shemaniya).
   A point-and-click scene in a low-poly diorama: tap the floor to walk, tap a thing
   to look at it, use it, or tag its tumah level for Yoezer's ledger.
   Halachic notes and sources: docs/OIL_QUEST.md and docs/research/. */
import * as THREE from '../vendor/three/three.module.min.js';

// ============================================================ helpers
const $ = (s, root = document) => root.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const sef = (ref, label) => `<a href="https://www.sefaria.org/${ref}" target="_blank" rel="noopener">${label}</a>`;

// ============================================================ the grid
const COLS = 8, ROWS = 6;
const wx = c => c - (COLS - 1) / 2;
const wz = r => r - (ROWS - 1) / 2;
const K = (c, r) => c + ',' + r;
const blocked = new Set();
const inGrid = (c, r) => c >= 0 && r >= 0 && c < COLS && r < ROWS;
const walkable = (c, r) => inGrid(c, r) && !blocked.has(K(c, r));

function bfs(start, goal) {
  const prev = new Map([[K(...start), null]]);
  const q = [start];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === goal[0] && cur[1] === goal[1]) {
      const path = []; let k = K(...cur), node = cur;
      while (node) { path.unshift(node); node = prev.get(k); k = node && K(...node); }
      return path;
    }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = [cur[0] + dc, cur[1] + dr];
      if (!walkable(...n) || prev.has(K(...n))) continue;
      prev.set(K(...n), cur); q.push(n);
    }
  }
  return null;
}

// ============================================================ palette and materials
const C = {
  stone: '#dcc196', stoneMid: '#c9a677', stoneDark: '#9a7a52', floorA: '#d2b386', floorB: '#c6a678',
  slab: '#8a6a49', rock: '#4b3b37', rock2: '#3a2f30',
  clay: '#b9673e', clayDark: '#8b4428', clayLight: '#d08b5b', wood: '#7a5236', woodDark: '#563823',
  bronze: '#b9883a', oil: '#d9a21c', bread: '#c4864a', cake: '#ecc87e', linen: '#f2ece0', skin: '#c58c62',
  beard: '#d4ccbd', leviRobe: '#6a587c', leviWrap: '#8a6a4a', sashBlue: '#3b5aa6', sashRed: '#b23a3e',
  iron: '#60656e', mouse: '#8f8a86', dark: '#2a1d14', wax: '#9c2f28', dust: '#ead7b2', stoneCup: '#a9a59c',
};
const MATS = new Map();
function mat(color, o = {}) {
  const k = color + JSON.stringify(o);
  if (!MATS.has(k)) MATS.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, flatShading: true, ...o }));
  return MATS.get(k);
}
function mesh(geo, m, x = 0, y = 0, z = 0, shadow = true) {
  const me = new THREE.Mesh(geo, m); me.position.set(x, y, z);
  me.castShadow = shadow; me.receiveShadow = true; return me;
}

// ============================================================ renderer
const stage = $('#stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (e) {
  document.body.append(el('div', '', '<div id="nogl"><p>This scene needs WebGL, which this browser has turned off.</p></div>'));
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#2e2943', 22, 48);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
const camTarget = new THREE.Vector3(0, 0.2, 0);

const hemi = new THREE.HemisphereLight('#a4b6e6', '#5b3a28', 1.35);
const sun = new THREE.DirectionalLight('#ffcf97', 3.1);
sun.position.set(6.5, 11, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 32 });
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
const torchLight = new THREE.PointLight('#ff8c3a', 9, 6, 2);
torchLight.position.set(wx(0) - 0.55, 1.45, wz(4) - 0.85);
const jugGlow = new THREE.PointLight('#ffc85a', 0, 3, 2);
scene.add(hemi, sun, sun.target, torchLight, jugGlow);

// ============================================================ geometry kit
function jugGeo(s = 1, { phi = Math.PI * 2, open = true } = {}) {
  const p = [[0, 0], [0.17, 0], [0.29, 0.08], [0.37, 0.28], [0.39, 0.52], [0.33, 0.76], [0.2, 0.92], [0.14, 0.98], [0.17, 1.04]];
  if (open) p.push([0.15, 1.07], [0.12, 1.01]);
  return new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x * s, y * s)), 9, 0, phi);
}
function bigJug({ s = 1.25, open = true, sealed = false, broken = false, color = C.clay } = {}) {
  const g = new THREE.Group();
  const m = broken ? mat(color, { side: THREE.DoubleSide }) : mat(color);
  g.add(mesh(jugGeo(s, { phi: broken ? Math.PI * 1.35 : Math.PI * 2, open }), m));
  // a painted band
  g.add(mesh(new THREE.CylinderGeometry(0.39 * s, 0.395 * s, 0.05 * s, 9, 1, true), mat(C.clayDark, { side: THREE.DoubleSide }), 0, 0.6 * s, 0, false));
  if (open && !broken) {
    g.add(mesh(new THREE.CircleGeometry(0.125 * s, 9).rotateX(-Math.PI / 2), mat('#1d1209'), 0, 1.0 * s, 0, false));
  }
  if (sealed) {
    g.add(mesh(new THREE.CylinderGeometry(0.15 * s, 0.17 * s, 0.07 * s, 9), mat(C.clayDark), 0, 1.07 * s, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.065 * s, 0.07 * s, 0.03 * s, 9), mat(C.wax), 0, 1.115 * s, 0));
    g.add(mesh(new THREE.TorusGeometry(0.15 * s, 0.012 * s, 4, 12).rotateX(Math.PI / 2), mat('#d9c39b'), 0, 0.99 * s, 0, false));
  }
  return g;
}
function smallJug() {
  const g = new THREE.Group(), s = 0.36;
  g.add(mesh(jugGeo(s, { open: false }), mat(C.clayLight)));
  g.add(mesh(new THREE.TorusGeometry(0.075, 0.018, 4, 8, Math.PI).rotateZ(-Math.PI / 2), mat(C.clayLight), 0.08, 0.26, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.058, 0.062, 0.04, 9), mat(C.clayDark), 0, 0.385, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.038, 0.04, 0.025, 9), mat(C.wax), 0, 0.41, 0));
  return g;
}
function shard(r, color = C.clay) {
  const m = mesh(new THREE.TetrahedronGeometry(0.09, 0), mat(color));
  m.scale.set(1, 0.3, 1.4); m.rotation.set(r() * 3, r() * 3, r() * 3); return m;
}

// ============================================================ the room
const room = new THREE.Group();
scene.add(room);
const floorTiles = [];
function buildRoom() {
  const r = rng(7);
  // floor tiles
  for (let c = 0; c < COLS; c++) for (let rr = 0; rr < ROWS; rr++) {
    const col = new THREE.Color((c + rr) % 2 ? C.floorA : C.floorB).offsetHSL(0, 0, (r() - 0.5) * 0.04);
    const t = mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), mat('#' + col.getHexString()), wx(c), -0.06, wz(rr), false);
    t.userData.tile = [c, rr];
    room.add(t); floorTiles.push(t);
  }
  // the slab under the floor and the floating rock it sits on
  room.add(mesh(new THREE.BoxGeometry(COLS + 0.95, 0.5, ROWS + 0.95), mat(C.slab), -0.24, -0.3, -0.24, false));
  const base = mesh(new THREE.CylinderGeometry(5.6, 1.2, 3.6, 7), mat(C.rock), -0.2, -2.35, -0.3, false);
  base.rotation.y = 0.3; base.scale.z = 0.8; room.add(base);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2, rad = 2.6 + r() * 1.2;
    const rock = mesh(new THREE.DodecahedronGeometry(0.5 + r() * 0.5, 0), mat(r() > 0.5 ? C.rock : C.rock2), Math.cos(a) * rad - 0.2, -2.0 - r() * 1.2, Math.sin(a) * rad * 0.7 - 0.3, false);
    rock.rotation.set(r() * 3, r() * 3, r() * 3); room.add(rock);
  }
  // walls: courses of ashlar blocks, ruined at the top
  const course = 0.34;
  function wall({ axis, from, to, at, maxCourses, gap }) {
    for (let k = 0; k < maxCourses; k++) {
      let p = from - (k % 2) * 0.35;
      while (p < to) {
        const len = Math.min(0.55 + r() * 0.6, to - p);
        const mid = p + len / 2;
        const ruin = maxCourses - 1 - Math.floor(Math.max(0, Math.sin(mid * 1.7 + at) * 1.6 + r() * 1.2));
        const inGap = gap && k < gap.courses && mid > gap.from - 0.05 && mid < gap.to + 0.05;
        if (len > 0.12 && k <= ruin && !inGap) {
          const col = new THREE.Color(r() > 0.35 ? C.stone : C.stoneMid).offsetHSL(0, 0, (r() - 0.5) * 0.05);
          const depth = 0.5 + (r() - 0.5) * 0.06;
          const b = axis === 'x'
            ? mesh(new THREE.BoxGeometry(len - 0.04, course - 0.03, depth), mat('#' + col.getHexString()), mid, k * course + course / 2, at)
            : mesh(new THREE.BoxGeometry(depth, course - 0.03, len - 0.04), mat('#' + col.getHexString()), at, k * course + course / 2, mid);
          room.add(b);
        }
        p += len;
      }
    }
  }
  wall({ axis: 'x', from: -4.5, to: 4.2, at: wz(0) - 0.76, maxCourses: 7 });
  wall({ axis: 'z', from: -3.5, to: 3.2, at: wx(0) - 0.76, maxCourses: 7, gap: { from: wz(4) - 0.5, to: wz(4) + 0.5, courses: 5 } });
  room.add(mesh(new THREE.BoxGeometry(0.56, 0.3, 1.5), mat(C.stoneDark), wx(0) - 0.76, 5 * course + 0.15, wz(4)));
  wall({ axis: 'z', from: -3.5, to: -0.9, at: wx(COLS - 1) + 0.76, maxCourses: 3 });

  // torch by the doorway
  room.add(mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.42, 5), mat(C.woodDark), wx(0) - 0.47, 1.3, wz(4) - 0.85));
  const flame = mesh(new THREE.ConeGeometry(0.07, 0.2, 5), new THREE.MeshBasicMaterial({ color: '#ffb347' }), wx(0) - 0.47, 1.58, wz(4) - 0.85, false);
  room.add(flame); room.userData.flame = flame;

  // shelf along the back wall (cols 1-3)
  const shelfX = wx(2), shelfZ = wz(0) - 0.27;
  for (const y of [0.55, 1.12]) room.add(mesh(new THREE.BoxGeometry(2.85, 0.07, 0.44), mat(C.wood), shelfX, y, shelfZ));
  for (const dx of [-1.35, 0, 1.35]) room.add(mesh(new THREE.BoxGeometry(0.08, 1.15, 0.4), mat(C.woodDark), shelfX + dx, 0.575, shelfZ));
  const jars = [[-1.05, 0.59, false], [-0.7, 0.59, true], [0.65, 0.59, false], [-0.9, 1.16, false], [0.2, 1.16, true], [0.95, 1.16, false]];
  for (const [dx, y, tipped] of jars) {
    const j = mesh(jugGeo(0.28), mat(C.clayLight)); j.position.set(shelfX + dx, y, shelfZ);
    if (tipped) { j.rotation.z = Math.PI / 2; j.position.y += 0.1; }
    room.add(j);
  }
  for (const [c, rr, cnt] of [[2, 1, 3], [6, 0, 6], [7, 0, 7], [3, 4, 2]]) {
    for (let i = 0; i < cnt; i++) {
      const s = shard(r); s.position.set(wx(c) + (r() - 0.5) * 0.8, 0.02, wz(rr) + (r() - 0.5) * 0.8); room.add(s);
    }
  }
  // the smashed pile in the back right corner
  const tippedAmph = bigJug({ s: 0.85, broken: true }); tippedAmph.rotation.set(0, 0.8, Math.PI / 2.2);
  tippedAmph.position.set(wx(6) + 0.6, 0.32, wz(0) - 0.05); room.add(tippedAmph);
  blocked.add(K(6, 0)); blocked.add(K(7, 0));
  // crates and a sack at the front right
  room.add(mesh(new THREE.BoxGeometry(0.72, 0.6, 0.72), mat(C.wood), wx(7), 0.3, wz(5)));
  room.add(mesh(new THREE.BoxGeometry(0.5, 0.42, 0.5), mat(C.woodDark), wx(7) + 0.05, 0.81, wz(5) - 0.03));
  blocked.add(K(7, 5));
  const sack = mesh(new THREE.DodecahedronGeometry(0.28, 0), mat('#b9a27a')); sack.scale.set(1, 0.8, 1); sack.position.set(wx(7) + 0.1, 0.22, wz(4) + 0.15); room.add(sack);
  blocked.add(K(7, 4));

}
buildRoom();

// node dots on walkable tiles (filled in after objects block their tiles)
const dots = new THREE.Group(); room.add(dots);
function rebuildDots() {
  dots.clear();
  const g = new THREE.CircleGeometry(0.06, 4).rotateX(-Math.PI / 2);
  const m = new THREE.MeshBasicMaterial({ color: '#fff4dc', transparent: true, opacity: 0.32 });
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (walkable(c, r)) dots.add(mesh(g, m, wx(c), 0.006, wz(r), false));
}
const marker = mesh(new THREE.RingGeometry(0.2, 0.27, 4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffe3a1', transparent: true, opacity: 0 }), 0, 0.01, 0, false);
room.add(marker);

// ============================================================ characters
function buildEli() {
  const g = new THREE.Group();
  const body = new THREE.Group(); g.add(body);
  body.add(mesh(new THREE.CylinderGeometry(0.15, 0.24, 0.62, 8), mat(C.linen), 0, 0.33, 0));
  body.add(mesh(new THREE.CylinderGeometry(0.163, 0.17, 0.055, 8), mat(C.sashBlue), 0, 0.47, 0));
  body.add(mesh(new THREE.CylinderGeometry(0.168, 0.174, 0.03, 8), mat(C.sashRed), 0, 0.43, 0));
  body.add(mesh(new THREE.BoxGeometry(0.05, 0.2, 0.02), mat(C.sashRed), 0.06, 0.33, 0.19));
  body.add(mesh(new THREE.IcosahedronGeometry(0.14, 1), mat(C.skin), 0, 0.8, 0));
  body.add(mesh(new THREE.CylinderGeometry(0.137, 0.15, 0.12, 8), mat(C.linen), 0, 0.9, -0.01));
  body.add(mesh(new THREE.SphereGeometry(0.137, 8, 3, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.linen), 0, 0.955, -0.01));
  for (const s of [-1, 1]) body.add(mesh(new THREE.BoxGeometry(0.03, 0.035, 0.02), mat(C.dark), s * 0.05, 0.81, 0.13, false));
  const arms = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Group(); a.position.set(s * 0.18, 0.62, 0);
    a.add(mesh(new THREE.BoxGeometry(0.075, 0.32, 0.08), mat(C.linen), 0, -0.15, 0));
    a.add(mesh(new THREE.IcosahedronGeometry(0.045, 0), mat(C.skin), 0, -0.33, 0));
    body.add(a); arms.push(a);
  }
  // the spare spears, strapped to his back (the running gag)
  const spears = new THREE.Group(); spears.position.set(0, 0.55, -0.22); spears.rotation.z = 0.42;
  for (const dx of [-0.05, 0, 0.05]) {
    spears.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.15, 4), mat(C.wood), dx, 0, 0));
    spears.add(mesh(new THREE.ConeGeometry(0.03, 0.14, 4), mat(C.iron, { metalness: 0.4, roughness: 0.5 }), dx, 0.64, 0));
  }
  spears.add(mesh(new THREE.TorusGeometry(0.075, 0.012, 3, 8).rotateX(Math.PI / 2), mat('#8c6d45'), 0, 0.1, 0));
  body.add(spears);
  g.userData = { body, arms, spears };
  return g;
}
function buildLevi() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(0.62, 0.38, 0.5), mat(C.wood), 0, 0.19, -0.05));
  const body = new THREE.Group(); g.add(body);
  body.add(mesh(new THREE.CylinderGeometry(0.17, 0.25, 0.46, 8), mat(C.leviRobe), 0, 0.6, -0.05));
  body.add(mesh(new THREE.BoxGeometry(0.34, 0.12, 0.34), mat(C.leviRobe), 0, 0.42, 0.17));
  body.add(mesh(new THREE.IcosahedronGeometry(0.135, 1), mat(C.skin), 0, 0.96, -0.04));
  const beard = mesh(new THREE.ConeGeometry(0.11, 0.26, 6), mat(C.beard), 0, 0.84, 0.06); beard.rotation.x = Math.PI + 0.25; body.add(beard);
  body.add(mesh(new THREE.CylinderGeometry(0.15, 0.145, 0.12, 8), mat(C.leviWrap), 0, 1.06, -0.04));
  for (const s of [-1, 1]) {
    body.add(mesh(new THREE.BoxGeometry(0.06, 0.025, 0.02), mat(C.beard), s * 0.05, 1.0, 0.09, false));
    body.add(mesh(new THREE.BoxGeometry(0.028, 0.02, 0.02), mat(C.dark), s * 0.05, 0.965, 0.1, false));
  }
  body.add(mesh(new THREE.BoxGeometry(0.28, 0.025, 0.2), mat('#e8dcc0'), 0, 0.52, 0.28));
  body.add(mesh(new THREE.BoxGeometry(0.29, 0.03, 0.21), mat('#6b4a2c'), 0, 0.505, 0.28));
  for (const s of [-1, 1]) body.add(mesh(new THREE.BoxGeometry(0.075, 0.08, 0.3), mat(C.leviRobe), s * 0.17, 0.56, 0.12));
  g.userData = { body };
  return g;
}
function buildMouse() {
  const g = new THREE.Group();
  const b = mesh(new THREE.IcosahedronGeometry(0.07, 0), mat(C.mouse)); b.scale.set(0.9, 0.7, 1.4); b.position.y = 0.05; g.add(b);
  const h = mesh(new THREE.ConeGeometry(0.045, 0.1, 5), mat(C.mouse), 0, 0.055, 0.12); h.rotation.x = Math.PI / 2; g.add(h);
  for (const s of [-1, 1]) g.add(mesh(new THREE.CircleGeometry(0.03, 6), mat('#d9a7a2', { side: THREE.DoubleSide }), s * 0.035, 0.1, 0.09, false));
  const t = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 3), mat('#c99f9a'), 0, 0.03, -0.18); t.rotation.x = Math.PI / 2.4; g.add(t);
  return g;
}

// ============================================================ objects
const LV = {
  av: { en: 'Av HaTumah', he: 'אב הטומאה', c: '#c25cff' },
  rishon: { en: 'Rishon', he: 'ראשון', c: '#a57dff' },
  sheni: { en: 'Sheni', he: 'שני', c: '#8f95ff' },
  shlishi: { en: 'Shlishi', he: 'שלישי', c: '#86b3ff' },
  revii: { en: "Revi'i", he: 'רביעי', c: '#93d0ff' },
  tahor: { en: 'Tahor', he: 'טהור', c: '#f6e3a0' },
  untrusted: { en: "Can't be trusted", he: 'אין לסמוך עליו', c: '#b9b1a3' },
};
const SRC = {
  vayikra1131: sef('Leviticus.11.31', 'Vayikra 11:31'),
  vayikra1133: sef('Leviticus.11.33', 'Vayikra 11:33'),
  kelim11: sef('Mishnah_Kelim.1.1', 'Mishnah Kelim 1:1'),
  parah87: sef('Mishnah_Parah.8.7', 'Mishnah Parah 8:7'),
  sat112: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.2', "Rambam, She'ar Avot HaTumot 11:2"),
  sat113: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.3', "Rambam, She'ar Avot HaTumot 11:3"),
  sat117: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.7', "Rambam, She'ar Avot HaTumot 11:7"),
  sat118: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.8', "Rambam, She'ar Avot HaTumot 11:8"),
  tumatOkhalin12: sef('Mishneh_Torah,_Defilement_of_Foods.1.2', 'Rambam, Tumat Okhalin 1:2'),
  kelimR16: sef('Mishneh_Torah,_Vessels.1.6', 'Rambam, Kelim 1:6'),
  shabbat21b: sef('Shabbat.21b.10', 'Shabbat 21b'),
  rashi: sef('Rashi_on_Shabbat.21b.10.2', 'Rashi there'),
  tosafot: sef('Tosafot_on_Shabbat.21b.10.1', 'Tosafot there'),
  middot25: sef('Mishnah_Middot.2.5', 'Mishnah Middot 2:5'),
};

const OBJ = {};
function addObj(id, def) { OBJ[id] = { id, ...def }; if (def.group) { tagMeshes(def.group, id); room.add(def.group); } for (const t of def.tiles || []) blocked.add(K(...t)); }
function tagMeshes(g, id) { g.traverse(m => { if (m.isMesh) m.userData.oid = id; }); }
function at(c, r, dx = 0, dz = 0) { return [wx(c) + dx, wz(r) + dz]; }

// --- the mouse jug, back wall
{
  const g = bigJug({ open: true }); const [x, z] = at(5, 0, 0.05, -0.05); g.position.set(x, 0, z); g.rotation.z = 0.06;
  addObj('jugA', { name: 'Big open jug', tiles: [[5, 0]], group: g, anchor: new THREE.Vector3(x, 1.65, z), answer: 'rishon' });
}
// --- the spill, the loaf, the terumah cake and the half-log measure
{
  const [x, z] = at(5, 1, 0.15, -0.05);
  const p = mesh(new THREE.CircleGeometry(0.58, 10).rotateX(-Math.PI / 2), mat(C.oil, { roughness: 0.15, metalness: 0.15, emissive: '#5a3c00', emissiveIntensity: 0.35, flatShading: false }), x, 0.008, z, false);
  p.scale.set(1.15, 1, 0.8);
  const g = new THREE.Group(); g.add(p);
  addObj('puddle', { name: 'Spilled oil', tiles: [[5, 1]], group: g, anchor: new THREE.Vector3(x - 0.1, 0.45, z), answer: 'rishon' });
}
{
  const [x, z] = at(6, 1, -0.28, 0.05);
  const g = new THREE.Group();
  const loaf = mesh(new THREE.IcosahedronGeometry(0.2, 1), mat(C.bread)); loaf.scale.set(1.35, 0.6, 0.95); loaf.position.set(x, 0.1, z);
  g.add(loaf);
  for (const d of [-0.08, 0.04]) { const sc = mesh(new THREE.BoxGeometry(0.03, 0.02, 0.2), mat('#e9c48d'), x + d, 0.205, z, false); sc.rotation.y = 0.3; g.add(sc); }
  addObj('loaf', { name: "Yoezer's lunch", tiles: [[6, 1]], group: g, anchor: new THREE.Vector3(x, 0.62, z - 0.05), answer: 'sheni' });
}
{
  const g = new THREE.Group();
  const [mx, mz] = at(6, 1, 0.33, 0.62);
  g.add(mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.24, 10, 1, true), mat(C.bronze, { metalness: 0.55, roughness: 0.45, side: THREE.DoubleSide }), mx, 0.12, mz));
  g.add(mesh(new THREE.CircleGeometry(0.13, 10).rotateX(-Math.PI / 2), mat(C.bronze, { metalness: 0.55, roughness: 0.45 }), mx, 0.005, mz, false));
  g.add(mesh(new THREE.CircleGeometry(0.16, 10).rotateX(-Math.PI / 2), mat(C.oil, { roughness: 0.12, emissive: '#5a3c00', emissiveIntensity: 0.4, flatShading: false }), mx, 0.2, mz, false));
  addObj('measure', { name: 'Half-log measure', tiles: [[6, 2]], group: g, anchor: new THREE.Vector3(mx + 0.1, 0.72, mz), answer: 'rishon' });
  // the cake, leaning from the loaf into the measure
  const cg = new THREE.Group();
  const [cx, cz] = at(6, 1, 0.05, 0.36);
  const cake = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 9), mat(C.cake), cx, 0.17, cz); cake.rotation.set(0.55, 0.6, -0.3);
  cg.add(cake);
  const plate = mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.03, 9), mat(C.clayLight), cx - 0.45, 0.06, cz - 0.05); plate.rotation.z = 0.35; cg.add(plate);
  addObj('cake', { name: 'Terumah cake', tiles: [], group: cg, anchor: new THREE.Vector3(cx + 0.05, 0.58, cz + 0.1), answer: 'shlishi', near: [[6, 1], [6, 2]] });
}
// --- the jug with the perfect seal, and the ring in the dust where it used to stand
{
  const g = bigJug({ open: false, sealed: true, s: 1.15 }); const [x, z] = at(1, 3, 0.05, 0.05); g.position.set(x, 0, z); g.rotation.y = 0.4;
  const ring = mesh(new THREE.RingGeometry(0.3, 0.42, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.dust, transparent: true, opacity: 0.7 }), wx(1), 0.004, wz(2), false);
  room.add(ring);
  for (const d of [-0.12, 0.12]) room.add(mesh(new THREE.BoxGeometry(0.035, 0.004, 0.62), new THREE.MeshBasicMaterial({ color: C.dust, transparent: true, opacity: 0.5 }), wx(1) + d, 0.005, wz(2) + 0.5, false));
  addObj('jugC', { name: 'Sealed jug', tiles: [[1, 3]], group: g, anchor: new THREE.Vector3(x, 1.7, z), answer: 'untrusted' });
}
// --- the opened and knocked-over jugs
{
  const g = new THREE.Group();
  const a = bigJug({ s: 1.1 }); a.rotation.set(0, 0.7, Math.PI / 2); a.position.set(wx(0) + 0.15, 0.4, wz(0) + 0.05); g.add(a);
  const b = bigJug({ s: 1.15, broken: true }); b.position.set(wx(0) + 0.05, 0, wz(1)); b.rotation.y = 2.2; g.add(b);
  const c = bigJug({ s: 1.2 }); c.position.set(wx(4), 0, wz(0) - 0.05); g.add(c);
  const lid = mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.08, 9), mat(C.clayDark), wx(4) + 0.45, 0.04, wz(0) + 0.42); lid.rotation.z = 0.15; g.add(lid);
  const r = rng(3); for (let i = 0; i < 5; i++) { const s = shard(r, C.clayDark); s.position.set(wx(0) + 0.3 + r() * 0.4, 0.02, wz(1) + r() * 0.5); g.add(s); }
  addObj('jugsD', { name: 'Opened jugs', tiles: [[0, 0], [0, 1], [4, 0]], group: g, anchor: new THREE.Vector3(wx(0) + 0.1, 1.55, wz(1)), answer: 'untrusted' });
}
// --- the stone cup on the shelf
{
  const g = new THREE.Group(); const x = wx(2) + 0.3, z = wz(0) - 0.24;
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.16, 7), mat(C.stoneCup), x, 0.67, z));
  g.add(mesh(new THREE.CircleGeometry(0.085, 7).rotateX(-Math.PI / 2), mat('#5e5a54'), x, 0.752, z, false));
  addObj('cup', { name: 'Stone cup', tiles: [[1, 0], [2, 0], [3, 0]], group: g, anchor: new THREE.Vector3(x, 1.0, z), answer: 'tahor', near: [[2, 0]] });
}
// --- the loose floor tile
{
  const t = floorTiles.find(f => f.userData.tile[0] === 3 && f.userData.tile[1] === 2);
  t.position.y = -0.03; t.rotation.set(0.05, 0.08, -0.04); t.userData = {}; t.material = mat('#d8bc90');
  const g = new THREE.Group(); g.add(t);
  addObj('tile', { name: 'Loose floor tile', tiles: [[3, 2]], group: g, anchor: new THREE.Vector3(wx(3), 0.5, wz(2)) });
  OBJ.tile.mesh = t;
}
// --- Yoezer
{
  const g = buildLevi(); g.position.set(wx(4), 0, wz(4)); g.rotation.y = -0.9;
  addObj('levi', { name: 'Yoezer the Levi', tiles: [[4, 4]], group: g, anchor: new THREE.Vector3(wx(4), 1.45, wz(4)) });
}
// --- the dead mouse (inside jugA, reached through the close-up) and the live one
OBJ.mouseDead = { id: 'mouseDead', name: 'Dead mouse', anchor: new THREE.Vector3(wx(5) + 0.05, 2.0, wz(0)), answer: 'av', hidden: true };
const live = buildMouse(); tagMeshes(live, 'mouse'); room.add(live);
OBJ.mouse = { id: 'mouse', name: 'Mouse (alive)', group: live, anchor: live.position };
// --- the small jug, under the tile
const pach = smallJug(); pach.visible = false; pach.position.set(wx(3), -0.4, wz(2)); tagMeshes(pach, 'pach'); room.add(pach);
OBJ.pach = { id: 'pach', name: 'Small jug', group: pach };
const hole = mesh(new THREE.BoxGeometry(0.8, 0.02, 0.8), mat('#20150e'), wx(3), -0.005, wz(2), false); hole.visible = false; room.add(hole);

// --- Eli
const eli = { c: 0, r: 4, seg: null, path: [], onArrive: null, face: Math.PI / 2, faceTo: Math.PI / 2, model: buildEli() };
eli.model.position.set(wx(0), 0, wz(4)); tagMeshes(eli.model, 'eli'); room.add(eli.model);
OBJ.eli = { id: 'eli', name: 'Eli', group: eli.model };
rebuildDots();

const TAGGABLE = ['mouseDead', 'jugA', 'puddle', 'loaf', 'cake', 'measure', 'jugC', 'jugsD', 'cup'];

// tumah-view rings and labels
const ringGeo = new THREE.RingGeometry(0.34, 0.46, 20).rotateX(-Math.PI / 2);
for (const id of TAGGABLE) {
  const o = OBJ[id];
  if (id !== 'mouseDead') {
    const ring = mesh(ringGeo, new THREE.MeshBasicMaterial({ color: '#8a8597', transparent: true, opacity: 0, depthWrite: false }), o.anchor.x, 0.012, o.anchor.z, false);
    if (id === 'cup') ring.position.set(o.anchor.x, 0.77, o.anchor.z);
    room.add(ring); o.ring = ring;
  }
  o.label = el('div', 'tag unknown', '?'); $('#labels').append(o.label);
}

// ============================================================ game state
const S = {
  started: false, tags: {}, peeked: false, ledgerDone: false, pachFound: false, pachTaken: false, duelWon: false,
  cupTaken: false, tumah: false, busy: 0, inv: ['Spare spears (3)'], rules: [], comebacks: [],
};
const taggedCount = () => TAGGABLE.filter(id => S.tags[id]).length;

// ============================================================ camera framing
function frame() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  const aspect = w / h; camera.aspect = aspect;
  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const portrait = aspect < 0.8;
  const needW = portrait ? 9.4 : 11.8, needH = 9.2;
  const d = Math.max(needH / (2 * t), needW / (2 * t * aspect));
  const az = THREE.MathUtils.degToRad(32), el_ = THREE.MathUtils.degToRad(portrait ? 50 : 44);
  camTarget.set(0.1, portrait ? -0.9 : 0.1, portrait ? 0.3 : 0.1);
  scene.fog.near = d + 2; scene.fog.far = d + 26;
  camera.position.set(
    camTarget.x + d * Math.cos(el_) * Math.sin(az),
    camTarget.y + d * Math.sin(el_),
    camTarget.z + d * Math.cos(el_) * Math.cos(az));
  camera.lookAt(camTarget);
  camera.updateProjectionMatrix();
}
addEventListener('resize', frame); frame();

// ============================================================ UI: portraits and art
const PORTRAIT = {
  eli: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#2c3552"/><path d="M14 100 Q50 60 86 100Z" fill="#f2ece0"/><path d="M40 78 h20 v6 h-20Z" fill="#3b5aa6"/><rect x="42" y="64" width="16" height="14" fill="#b07a52"/><circle cx="50" cy="52" r="21" fill="#c58c62"/><path d="M28 47 Q28 22 50 21 Q72 22 72 47 Q50 37 28 47Z" fill="#f7f2e8"/><path d="M29 45 Q50 36 71 45" stroke="#d9d0bf" stroke-width="2" fill="none"/><path d="M37 50 l9 -3 M54 47 l9 3" stroke="#3a2618" stroke-width="2.4" stroke-linecap="round"/><circle cx="42" cy="56" r="2.8" fill="#2a1d14"/><circle cx="58" cy="56" r="2.8" fill="#2a1d14"/><path d="M45 66 Q50 63 55 66" stroke="#7a4a30" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`,
  levi: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#3a2f45"/><path d="M12 100 Q50 62 88 100Z" fill="#6a587c"/><circle cx="50" cy="48" r="20" fill="#c58c62"/><path d="M30 52 Q32 94 50 96 Q68 94 70 52 Q60 64 50 64 Q40 64 30 52Z" fill="#d4ccbd"/><path d="M39 70 Q50 76 61 70" stroke="#b9b0a0" stroke-width="2" fill="none"/><path d="M29 42 Q30 22 50 22 Q70 22 71 42 Q50 34 29 42Z" fill="#8a6a4a"/><path d="M34 43 l12 3 M54 46 l12 -3" stroke="#e8e2d6" stroke-width="5" stroke-linecap="round"/><path d="M38 51 h8 M54 51 h8" stroke="#2a1d14" stroke-width="2.6" stroke-linecap="round"/><path d="M44 61 Q50 58 56 61" stroke="#8a5a40" stroke-width="2.2" fill="none"/></svg>`,
};
const WHO = { eli: 'Eli', levi: 'Yoezer the Levi', narr: '' };

function sealArt(kind) {
  if (kind === 'kg') return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#9c2f28"/><circle cx="60" cy="60" r="46" fill="none" stroke="#c9574c" stroke-width="2"/><path d="M60 38 l-6 -10 l6 5 l6 -5 Z" fill="#e7a196"/><circle cx="60" cy="56" r="16" fill="#c9574c"/><path d="M60 40 v32" stroke="#9c2f28" stroke-width="2"/><text x="60" y="94" text-anchor="middle" font-family="Frank Ruhl Libre, serif" font-size="15" fill="#f1c7bf">לכהן גדול</text></svg>`;
  if (kind === 'calf') return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#8c6a3c"/><circle cx="60" cy="60" r="46" fill="none" stroke="#b48e58" stroke-width="2"/><text x="60" y="72" text-anchor="middle" font-family="Frank Ruhl Libre, serif" font-size="34" fill="#f0dcb4">עגל</text></svg>`;
  return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#5d6a7a"/><circle cx="60" cy="60" r="46" fill="none" stroke="#8796a8" stroke-width="2"/><ellipse cx="60" cy="64" rx="18" ry="24" fill="#8796a8"/><circle cx="52" cy="54" r="6" fill="#e9eef4"/><circle cx="68" cy="54" r="6" fill="#e9eef4"/><circle cx="52" cy="54" r="2.5" fill="#2a2f38"/><circle cx="68" cy="54" r="2.5" fill="#2a2f38"/><path d="M57 62 l3 5 l3 -5Z" fill="#e2b04a"/><path d="M44 42 l6 8 M76 42 l-6 8" stroke="#8796a8" stroke-width="4"/></svg>`;
}
const ART = {
  jugInside: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#191421"/><ellipse cx="160" cy="104" rx="132" ry="88" fill="#8b4428"/><ellipse cx="160" cy="100" rx="114" ry="74" fill="#5a2a18"/><ellipse cx="160" cy="112" rx="98" ry="58" fill="#b8880f"/><ellipse cx="128" cy="98" rx="44" ry="9" fill="#efcb62" opacity=".5"/><g transform="translate(170 118) rotate(-8)"><path d="M-46 4 q-30 -2 -40 -20" stroke="#c99f9a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="34" ry="19" fill="#9a958f"/><ellipse cx="2" cy="4" rx="24" ry="11" fill="#d8d2c9"/><circle cx="36" cy="-4" r="14" fill="#9a958f"/><circle cx="34" cy="-18" r="8" fill="#d9a7a2"/><circle cx="46" cy="-13" r="7" fill="#d9a7a2"/><path d="M36 -6 l6 6 M42 -6 l-6 6" stroke="#2a1d14" stroke-width="2.2"/><path d="M-16 -16 v-14 M-4 -18 v-14 M12 -18 v-14 M22 -16 v-12" stroke="#c99f9a" stroke-width="3" stroke-linecap="round"/></g><text x="160" y="190" text-anchor="middle" font-family="Alegreya, serif" font-style="italic" font-size="14" fill="#c9bfae">Looking in. Not touching. Definitely not touching.</text></svg>`,
  sealC: `<svg viewBox="0 0 320 170"><rect width="320" height="170" fill="#191421"/><g transform="translate(82 82)"><circle r="62" fill="#8b4428"/><circle r="50" fill="#a65a36"/><circle r="26" fill="#9c2f28"/><path d="M0 -14 v28 M-10 -6 q10 -10 20 0 M-10 4 q10 -10 20 0" stroke="#d26a5e" stroke-width="3" fill="none"/><text y="80" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-size="12" fill="#c9bfae">The seal: perfect</text></g><g transform="translate(232 82)"><rect x="-70" y="-62" width="140" height="124" rx="8" fill="#c9a677"/><g fill="#b39066" opacity=".9"><circle cx="-40" cy="-30" r="3"/><circle cx="30" cy="-40" r="2"/><circle cx="44" cy="20" r="3"/><circle cx="-50" cy="34" r="2"/><circle cx="10" cy="44" r="2.5"/></g><circle r="34" fill="none" stroke="#efe0bf" stroke-width="10"/><path d="M-10 34 v40 M10 34 v40" stroke="#efe0bf" stroke-width="4" opacity=".8"/><text y="80" text-anchor="middle" font-family="Alegreya Sans, sans-serif" font-size="12" fill="#c9bfae">The floor next to it</text></g></svg>`,
};

// ============================================================ UI: dialogue, menus, modals, toasts
const dlg = $('#dlg');
let keyboardUser = false;
addEventListener('keydown', e => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const focusIf = b => { if (b && keyboardUser) b.focus({ preventScroll: true }); };
let dlgNext = null;
function setTalking(on) { document.body.classList.toggle('talking', on); }
function speak(who, html, choices, duel) {
  return new Promise(res => {
    dlg.hidden = false; setTalking(true);
    dlg.classList.toggle('narr', who === 'narr');
    $('.portrait', dlg).innerHTML = PORTRAIT[who] || '';
    $('.who', dlg).textContent = WHO[who];
    $('.text', dlg).innerHTML = html;
    const ch = $('.choices', dlg); ch.innerHTML = '';
    const d = $('.duel', dlg);
    d.hidden = !duel;
    if (duel) d.innerHTML = 'Pilpul duel ' + [0, 1, 2].map(i => `<i class="${i < duel.won ? 'won' : ''}"></i>`).join('');
    const nextBtn = $('.next', dlg);
    if (choices) {
      nextBtn.hidden = true; dlgNext = null;
      choices.forEach((c, i) => { const b = el('button', 'choice', c); b.type = 'button'; b.onclick = () => res(i); ch.append(b); });
      focusIf(ch.firstChild);
    } else {
      nextBtn.hidden = false; dlgNext = () => { dlgNext = null; res(-1); };
      focusIf(nextBtn);
    }
  });
}
$('.next', dlg).onclick = () => dlgNext && dlgNext();
$('.text', dlg).onclick = () => dlgNext && dlgNext();
function endTalk() { dlg.hidden = true; setTalking(false); }
async function lines(...ls) { for (const [who, t] of ls) await speak(who, t); }

const modal = $('#modal');
function openModal(html, wire) {
  endTalk(); caption.classList.remove('on');
  return new Promise(res => {
    modal.innerHTML = `<div class="card" role="dialog" aria-modal="true">${html}</div>`;
    modal.hidden = false;
    const close = v => { modal.hidden = true; modal.innerHTML = ''; res(v); };
    modal.querySelectorAll('[data-v]').forEach(b => b.onclick = () => close(b.dataset.v));
    if (wire) wire(modal, close);
    (modal.querySelector('.primary') || modal.querySelector('button'))?.focus({ preventScroll: true });
  });
}

const toastEl = $('#toast'); let toastT;
function toast(html) { toastEl.innerHTML = html; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2600); }

function setObjective(t) { $('#objective').textContent = t; }
function objective() {
  if (!S.started) return setObjective('Enter the oil chamber');
  if (!S.ledgerDone) return setObjective(`Tag everything for Yoezer's ledger (${taggedCount()} of ${TAGGABLE.length})`);
  if (!S.pachFound) return setObjective('The mouse is scratching at a loose tile');
  if (!S.duelWon) return setObjective("Win Yoezer's argument");
  setObjective('Done. Next in the full game: carry the jug to the Heichal');
}
function renderStatus() {
  const jug = S.pachTaken ? `<div class="jug"><b>The small jug</b>
    <div class="row"><span class="k">Sealed</span><span class="v ok">✓</span></div>
    <div class="row"><span class="k">Kohen Gadol's seal</span><span class="v ok">✓</span></div>
    <div class="row"><span class="k">Never moved</span><span class="v ok">✓</span></div>
    <div class="row"><span class="k">Nothing added</span><span class="v ok">✓</span></div></div>` : '';
  $('#status').innerHTML = `<div class="row"><span class="k">Eli</span><span class="v ok">Tahor</span></div>
    <div class="row"><span class="k">Carrying</span><span class="v">${S.inv.join(', ')}</span></div>${jug}`;
}

// ---------- the action menu
const menu = $('#menu');
let menuFor = null;
function closeMenu() { menu.hidden = true; menuFor = null; }
function placeMenu(o) {
  const p = screenPos(o.anchor || o.group.position);
  const w = menu.offsetWidth, h = menu.offsetHeight;
  menu.style.left = Math.max(12, Math.min(innerWidth - w - 12, p.x + 18)) + 'px';
  menu.style.top = Math.max(70, Math.min(innerHeight - h - 12, p.y - h / 2)) + 'px';
}
function showMenu(id, items, title) {
  const o = OBJ[id]; menuFor = id;
  menu.innerHTML = `<div class="title">${title || o.name}</div>`;
  for (const [label, fn, disabled] of items) {
    const b = el('button', '', label); b.type = 'button'; b.disabled = !!disabled;
    b.onclick = () => { closeMenu(); fn(); }; menu.append(b);
  }
  menu.hidden = false; placeMenu(o);
  focusIf(menu.querySelector('button:not([disabled])'));
}
function showTagPicker(id) {
  const o = OBJ[id]; menuFor = id;
  menu.innerHTML = `<div class="title">Tag: ${o.name}</div><div class="tags"></div>`;
  const box = $('.tags', menu);
  for (const [k, v] of Object.entries(LV)) {
    const b = el('button', k === 'untrusted' ? 'wide' : '', `<span>${v.en}</span><span class="he">${v.he}</span>`); b.type = 'button';
    b.onclick = () => { closeMenu(); checkTag(id, k); }; box.append(b);
  }
  const back = el('button', '', 'Never mind'); back.type = 'button'; back.onclick = closeMenu; menu.append(back);
  menu.hidden = false; placeMenu(o);
  focusIf(box.querySelector('button'));
}

// ============================================================ content: what everything says
const busy = async fn => { S.busy++; closeMenu(); try { await fn(); } finally { S.busy--; endTalk(); } };

const LOOK = {
  jugA: "A big clay jug, open at the top. It smells like oil and something else. Something that used to squeak.",
  puddle: "Oil from the big jug spilled when it tipped. It's spreading toward everything Yoezer owns.",
  loaf: "A loaf of ordinary bread, half in the oil. Yoezer keeps looking at it the way you'd look at an old friend.",
  cake: "A terumah cake. A Kohen left it on a plate when the Greeks came. It slid off the plate, over the loaf, and into the bronze measure.",
  measure: "A bronze half-log measure: exactly enough for one lamp of the menorah. It's full of oil set aside for the menorah. And a cake.",
  jugC: "A sealed jug. The seal is perfect! Finally, something in here that—hm. Why is the floor like that?",
  jugsD: "Big jugs, opened and knocked over. Someone broke the seals and threw them on the floor. Then, apparently, kicked them.",
  cup: "A plain stone cup. The only thing in this chamber nobody bothered to smash.",
  tile: "One floor tile sits a finger's width higher than the rest. Every floor has one.",
  mouse: "MOUSE! ...It's alive. Phew. A live mouse doesn't make anything tamei; only a dead one does.",
  eli: "Eli. Kohen. Tahor. Carrying three spears nobody has explained.",
  sky: "No roof. These four corner chambers were open to the sky. Good news if you're worried about ohel. Bad news if it rains.",
};

const WHY = {
  mouseDead: {
    title: 'The dead mouse', body: `A dead sheretz (a mouse, a lizard, and six others in the Torah's list) is an <em>Av HaTumah</em>, a source of tumah. It makes people and vessels tamei by touch, and a clay vessel just by being inside its airspace. Unlike a met, it doesn't spread by being carried or by sharing a roof. And it has to be dead: <span class="he">בְּמֹתָם</span>, "when they are dead."`,
    src: [SRC.kelim11, SRC.vayikra1131],
  },
  jugA: {
    title: 'The mouse jug', body: `The mouse never touched the jug's walls from the outside. It didn't need to. A clay vessel becomes tamei only through its inside: an Av in its airspace makes it a <em>Rishon</em>. (Touching a clay jug from the outside does nothing. Remember that; it matters later.)`,
    src: [SRC.vayikra1133, SRC.kelim11],
  },
  puddle: {
    title: 'The spilled oil', body: `This oil was inside the mouse jug, so it's a <em>Rishon</em>. Oil is one of the seven liquids, and liquids are the most sensitive things there are: anything that would disqualify terumah makes a liquid a Rishon. They never count down.`,
    src: [SRC.parah87, SRC.tumatOkhalin12],
  },
  loaf: {
    title: "Yoezer's lunch", body: `The loaf touched a Rishon, so it's one step down: a <em>Sheni</em>. For chullin, ordinary food, that's the end of the line. A Sheni of chullin is pasul (unfit), but it can't make other chullin tamei. (It was baked from dough kneaded with water, so it was always able to become tamei.)`,
    src: [SRC.sat112],
  },
  cake: {
    title: 'The terumah cake', body: `It touched Yoezer's loaf, a Sheni. Ordinary food would be fine; the chain stops at Sheni. But terumah is holier, so it goes one step further: <em>Shlishi</em>. A Shlishi of terumah is pasul and stops there. It can't harm other terumah, only things holier still.`,
    src: [SRC.sat113, SRC.sat117],
  },
  measure: {
    title: 'The menorah oil', body: `You'd expect one more step: kodesh goes down to <em>Revi'i</em>. For a solid, that would be right. But this is a liquid. Even a Shlishi of terumah makes kodesh liquid a <em>Rishon</em>. That's why oil for the menorah is the easiest thing in the world to ruin, and why one untouched, sealed jug mattered so much.`,
    src: [SRC.sat118, SRC.parah87],
  },
  jugC: {
    title: 'The jug that was moved', body: `The seal is perfect, but there's a clean ring in the dust and drag marks: someone moved this jug. Rashi says the Kohen Gadol's seal mattered because it showed nobody had touched the jug. Tosafot asks how a jug could survive if it had been moved, and answers that the one they found must have been hidden in the ground. This one was moved, so we can't rely on it.`,
    src: [SRC.shabbat21b, SRC.rashi, SRC.tosafot],
  },
  jugsD: {
    title: 'The opened jugs', body: `Once the seal is broken there's no way to know who touched the oil. The Gemara says that when the Greeks came into the Heichal they made all the oils tamei, and the Chashmona'im searched for a jug whose seal proved no one had.`,
    src: [SRC.shabbat21b],
  },
  cup: {
    title: 'The stone cup', body: `Stone vessels can't become tamei, ever: not by Torah law and not by rabbinic law, no matter what touches them. In a wrecked storeroom, it's the one vessel you can be completely sure of.`,
    src: [SRC.kelimR16],
  },
};

const WRONG = {
  mouseDead: { rishon: ['eli', "Rishon of what? Nothing made the mouse tamei. The chain starts with it."], tahor: ['levi', "It was tahor when it was alive. That's rather the point."], untrusted: ['levi', "Oh, you can trust it. You can trust it completely. It's tamei."], _: ['levi', "It's not one step from anything. It's where everything starts."] },
  jugA: { av: ['eli', "The mouse is the Av. The jug only caught it from the mouse."], tahor: ['levi', "Nobody touched it, you say? Clay doesn't need touching. It's the inside that counts."], untrusted: ['levi', "We can trust it fine. We can trust it's tamei. What kind?"], _: ['eli', "Count again. How many steps between the mouse and the jug it's floating in?"] },
  puddle: { sheni: ['levi', "One step down from the jug, so Sheni? Not oil. Liquids don't step down. They jump right back to the top."], tahor: ['levi', "It came out of the mouse jug! Would you like some on your bread? Oh wait. I already have some on mine."], _: ['eli', "Where did this oil come from, and what does that make it?"] },
  loaf: { rishon: ['eli', "Bread going one step down from a Rishon makes... not a Rishon. Only liquids jump back up."], tahor: ['levi', "It's sitting IN the oil. Believe me, I've checked. Several times. With feeling."], shlishi: ['eli', "It touched the oil, and the oil is a Rishon. One step down."], _: ['eli', "It touched the oil directly. One step down from the oil."] },
  cake: { tahor: ['levi', "To ordinary bread, my loaf can't do a thing anymore. But terumah is holier. It feels things bread doesn't."], sheni: ['eli', "One more step: it touched a Sheni."], revii: ['eli', "Terumah doesn't go that far. That's kodesh."], _: ['eli', "It touched Yoezer's loaf. What is the loaf, and how far down does terumah go?"] },
  measure: { revii: ['levi', "Ha! That's what I said the first time. Revi'i would be right for a cake of kodesh. But oil is a liquid. Liquids jump."], shlishi: ['eli', "That's what the cake is. What does a Shlishi do to a liquid?"], tahor: ['levi', "A terumah cake fell in it. It's not tahor. I'm not even angry. I'm just sad."], _: ['eli', "It's kodesh, and it's a liquid. Liquids don't count down."] },
  jugC: { tahor: ['levi', "Look at the floor, young man. The floor never lies. Well, it lies there. But it doesn't lie."], _: ['eli', "The seal's perfect. But look at the floor next to it. Can I rely on a jug that's been moved?"] },
  jugsD: { tahor: ['levi', "Would you bet the menorah on it?"], _: ['eli', "Broken seals. Who knows who touched them? That's the problem, not a step on the ladder."] },
  cup: { untrusted: ['eli', "It's stone. Stone doesn't do tumah. You can trust it more than anything in here."], _: ['levi', "Stone? Tamei? Ask any stone. It'll tell you."] },
};

const HINT = () => {
  if (!S.peeked && !S.tags.mouseDead) return "Start where it started. Look inside the big jug by the back wall. Look. Don't touch.";
  const order = ['mouseDead', 'jugA', 'puddle', 'loaf', 'cake', 'measure', 'jugC', 'jugsD', 'cup'];
  const next = order.find(id => !S.tags[id]);
  return {
    mouseDead: "The mouse in the big jug. Everything starts there. What's a dead mouse?",
    jugA: "What's inside that jug, and what does that do to clay?",
    puddle: "The oil came out of the mouse jug. And oil is a liquid. Liquids are... sensitive.",
    loaf: "My lunch touched the oil. One step down from whatever the oil is.",
    cake: "Terumah goes one step further than ordinary bread.",
    measure: "Menorah oil. A liquid. Liquids don't count down the way bread does.",
    jugC: "That sealed one by the left wall? Look at the floor around it.",
    jugsD: "The open ones. Would you light the menorah with oil anyone could have touched?",
    cup: "Stone. Think about stone.",
  }[next] || "The ledger's done. I'm going to have a nap.";
};

// ============================================================ actions
function actionsFor(id) {
  const o = OBJ[id];
  const tagged = S.tags[id];
  const tagItem = TAGGABLE.includes(id)
    ? [[tagged ? `Tagged: ${LV[tagged].en} ✓` : 'Tag it…', () => showTagPicker(id), !!tagged]] : [];
  const look = ['Look', () => busy(async () => { await speak('eli', LOOK[id]); if (id === 'jugC') await sealCloseup(); })];
  switch (id) {
    case 'jugA': return [look, ['Peek inside', () => busy(peekJug)], ...tagItem];
    case 'puddle': return [look, ['Walk through it', () => busy(() => lines(['eli', "No. I'm not walking through oil from the mouse jug. Not today, not in these sandals."]))], ...tagItem];
    case 'loaf': return [look, ['Eat it', () => busy(() => lines(['levi', 'That is my lunch.'], ['eli', 'Was.'], ['levi', '...Was.']))], ...tagItem];
    case 'cake': return [look, ['Pick it up', () => busy(() => lines(['eli', "And make my hands a Sheni? I've got a jug to find. If there is one."]))], ...tagItem];
    case 'measure': return [look, ['Fish the cake out', () => busy(() => lines(['eli', "Too late for that. The damage was done the moment it touched."]))], ...tagItem];
    case 'jugC': return [look, ['Inspect the seal', () => busy(sealCloseup)], ...tagItem];
    case 'jugsD': return [look, ['Check for any oil left', () => busy(() => lines(['eli', 'Plenty of oil. None of it with a seal anyone can vouch for.'], ['levi', 'Four hundred and twelve jugs of it. Roughly.']))], ...tagItem];
    case 'cup': return [look, [S.cupTaken ? 'Already taken' : 'Take it', () => busy(takeCup), S.cupTaken], ...tagItem];
    case 'tile': return [look, ['Pry it up', () => busy(pryTile), S.pachFound]];
    case 'levi': return [['Talk', () => busy(talkLevi)], ['Look', () => busy(() => lines(['eli', "Yoezer the Levi. He's in charge of this storeroom, and of a ledger he loves more than most people."]))]];
    case 'mouse': return [look, ['Tag it…', () => busy(() => lines(['eli', 'Tahor. Alive and tahor. Also not part of the ledger. Also, please stop running at my feet.']))]]
      .concat(S.ledgerDone && !S.pachFound ? [['Pry up the tile it’s scratching', async () => { if (await goTo('tile')) busy(pryTile); }]] : []);
    case 'eli': return [['Look at Eli', () => busy(() => lines(['eli', LOOK.eli]))], ['Look up', () => busy(() => lines(['eli', LOOK.sky], ['narr', `${SRC.middot25}: the four chambers in the corners of the Ezrat Nashim were not roofed. This was the oil chamber, Beit Shemaniya.`]))]];
    case 'pach': return [['Look closer', () => busy(pachCloseup)]];
  }
  return [look];
}

async function peekJug() {
  S.peeked = true;
  const v = await openModal(`<div class="eyebrow">Close-up</div><h2>Inside the big jug</h2><div class="art">${ART.jugInside}</div>
    <p>A mouse. A dead one. It fell in and never climbed out.</p>
    <div class="actions"><button class="btn" data-v="close">Back away</button><button class="btn primary" data-v="tag" ${S.tags.mouseDead ? 'disabled' : ''}>${S.tags.mouseDead ? 'Mouse tagged ✓' : 'Tag the mouse…'}</button></div>`);
  if (v === 'tag') { showTagPicker('mouseDead'); }
}
async function sealCloseup() {
  await openModal(`<div class="eyebrow">Close-up</div><h2>The sealed jug</h2><div class="art">${ART.sealC}</div>
    <p>The seal is unbroken. But on the floor beside the jug there's a clean ring in the dust, the size of this jug's base, and two drag marks leading here.</p>
    <div class="actions"><button class="btn primary" data-v="ok">Hm.</button></div>`);
  await speak('eli', "Someone moved it. Recently. Can I rely on a jug that's been moved?");
}
async function takeCup() {
  if (!S.tags.cup) {
    await lines(['levi', "Ledger first! Nothing leaves this storeroom until it's written down."], ['eli', 'Even a cup?'], ['levi', 'Especially a cup. Cups are sneaky.']);
    return;
  }
  S.cupTaken = true; S.inv.push('stone cup'); OBJ.cup.group.visible = false; renderStatus();
  await lines(['eli', 'One stone cup. Whatever happens next, this cup will still be tahor.'], ['levi', "Signed out. Bring it back. Eventually."]);
}

async function checkTag(id, t) {
  const o = OBJ[id];
  await busy(async () => {
    if (t === o.answer) {
      S.tags[id] = t;
      updateLabel(id, true);
      const w = WHY[id];
      await openModal(`<div class="eyebrow">Ledger entry</div><h2>${w.title}: <span class="lvl" style="--c:${LV[t].c}">${LV[t].en}</span></h2>
        <p>${w.body}</p><div class="sources">Sources: ${w.src.join(' · ')}</div>
        <div class="actions"><button class="btn primary" data-v="ok">Yoezer, write it down</button></div>`);
      S.rules.push(id);
      toast(`<b>Ledger:</b> ${o.name}, ${LV[t].en}`);
      objective();
      if (taggedCount() === TAGGABLE.length) await ledgerDone();
    } else {
      const set = WRONG[id] || {};
      const [who, text] = set[t] || set._ || ['levi', "That's not what I'd write."];
      await speak(who, text);
    }
  });
}

async function talkLevi() {
  faceEliTo(OBJ.levi.anchor);
  if (!S.started) return;
  while (true) {
    const opts = ['What happened in here?', 'Any advice?', 'Why the ledger?', 'Nothing. Carry on counting.'];
    const i = await speak('levi', S.ledgerDone ? 'Yes? Ledger\'s done, you know.' : 'Yes? Ledger\'s open, young man.', opts);
    if (i === 0) await lines(['levi', 'The Greeks came through, opened everything and threw the seals on the floor. Then a mouse fell into the big jug by the back wall. The jug tipped, the oil went everywhere, my lunch went into the oil, and some Kohen\'s terumah cake slid off its plate into the half-log measure for the menorah.'], ['levi', 'So: a Tuesday.']);
    else if (i === 1) await speak('levi', HINT());
    else if (i === 2) await lines(['levi', "Every jug in this chamber was counted in. Every jug gets counted out. If I don't write it down, it didn't happen. And if it didn't happen, somebody will blame a Levi."]);
    else return;
  }
}

async function intro() {
  await lines(
    ['levi', '...four hundred and eleven... four hundred and twelve...'],
    ['eli', 'Excuse me?'],
    ['levi', 'Four hundred and— who are you? Now I\'ve lost count.'],
    ['eli', "Eli. I'm a Kohen. Yehuda sent me. I need pure oil for the menorah."],
    ['levi', 'Pure oil! In here? Young man, the Greeks opened every jug in this chamber. Then a mouse fell into the big one. Then my lunch fell into the oil. Nothing in Beit Shemaniya is fit for anything.'],
  );
  const i = await speak('levi', "And what's all that on your back?", ['Spears. The quartermaster made me sign for them.', 'Spare spears. For spare emergencies.', 'What spears?']);
  if (i === 0) await speak('levi', 'Of course he did.');
  if (i === 1) await speak('levi', '...Right.');
  if (i === 2) await lines(['levi', 'The three very large spears. On your back.'], ['eli', 'Oh. Those spears.']);
  await lines(
    ['levi', "Well. If you want to look around, it's my storeroom, so we do it properly. Everything gets written in my ledger: what it is, and how tamei it is. You tag it, I write it."],
    ['eli', 'And if I find something pure?'],
    ['levi', "Then I'll eat my ledger."],
  );
  S.started = true; objective(); renderStatus();
  toast('<b>Tip:</b> tap anything to look at it or tag it. Turn on Tumah view to see what you’ve worked out.');
}

async function ledgerDone() {
  S.ledgerDone = true; objective();
  await lines(
    ['levi', 'Nine items. All written. All tamei or useless, except one stone cup. As I said.'],
    ['narr', '<em>Squeak.</em>'],
  );
  live.userData.goal = [3, 2];
  await wait(1400);
  bubble('squeak!', OBJ.tile.anchor);
  await lines(
    ['eli', "Look at the mouse. The live one. It's scratching at that tile."],
    ['levi', 'Mice. Always digging. That tile has been loose since my grandfather\'s time.'],
  );
  objective();
}

async function pryTile() {
  if (!S.ledgerDone) {
    await lines(['eli', 'That tile is definitely loose.'], ['levi', "Nobody pries up my floor until the ledger's done. Regulations."]);
    return;
  }
  faceEliTo(OBJ.tile.anchor);
  await lines(
    ['eli', "I need something long and strong to lever it up. If only I had something long and strong."],
    ['eli', '...'],
    ['eli', 'Oh. The spears.'],
    ['levi', 'Is that a regulation spear?'],
    ['eli', "It's a spare."],
  );
  endTalk();
  eli.model.userData.spears.rotation.z = 1.2;
  await animate(900, k => { const t = OBJ.tile.mesh; t.position.y = -0.03 + k * 0.25; t.position.x = wx(3) + k * 0.7; t.rotation.z = -0.04 - k * 0.5; });
  eli.model.userData.spears.rotation.z = 0.42;
  hole.visible = true; pach.visible = true;
  live.userData.goal = [2, 2];
  await animate(1100, k => { pach.position.y = -0.4 + k * 0.42; jugGlow.intensity = k * 3; });
  jugGlow.position.set(wx(3), 0.6, wz(2));
  S.pachFound = true; objective();
  await lines(['eli', 'A small jug. Sealed. Hidden under the floor, where nobody could move it.'], ['levi', 'That... was not in the ledger.']);
  await pachCloseup();
}

async function pachCloseup() {
  if (S.pachTaken) { await speak('eli', "It's in my hands, sealed, and it's staying that way."); return; }
  const order = ['calf', 'kg', 'owl'];
  let pick;
  while (true) {
    pick = await openModal(`<div class="eyebrow">Close-up</div><h2>Whose seal is this?</h2>
      <p>Yoezer opens his ledger to a page of seal impressions. One of them matches the seal on the small jug. Which one?</p>
      <div class="seals">${order.map(k => `<button type="button" data-v="${k}">${sealArt(k)}<span>${{ calf: 'A token marked “calf”', kg: 'A pomegranate, “for the Kohen Gadol”', owl: 'An owl' }[k]}</span></button>`).join('')}</div>
      <p style="margin-top:12px">On the jug: <span style="display:inline-block;width:70px;vertical-align:middle">${sealArt('kg')}</span></p>`);
    if (pick === 'kg') break;
    if (pick === 'calf') await speak('levi', "That's one of the Temple's tokens. You buy it to get the right wine and flour for a korban. It's not anybody's seal on a jug.");
    else await speak('levi', "An owl? That's Greek. If you see an owl on a jug, run. Or at least don't buy it.");
    endTalk();
  }
  await openModal(`<div class="eyebrow">The small jug</div><h2>Is it fit for the menorah?</h2>
    <ul class="check">
      <li>Sealed, and the seal is unbroken <small>Shabbat 21b</small></li>
      <li>The seal is the Kohen Gadol's <small>Rashi: so he knew nobody had touched it</small></li>
      <li>Never moved: hidden under the floor <small>Tosafot</small></li>
      <li>Clay, tightly sealed, so its inside never met the mouse <small>Vayikra 11:33</small></li>
      <li>Enough for one night: seven lamps, half a log each <small>Mishnah Menachot 9:3</small></li>
    </ul>
    <p>For one night. The menorah needs it for eight.</p>
    <div class="actions"><button class="btn primary" data-v="take">Take the jug</button></div>`,
  m => { m.querySelectorAll('.check li').forEach((li, i) => setTimeout(() => li.classList.add('on'), REDUCED ? 0 : 250 + i * 320)); });
  S.pachTaken = true; pach.visible = false; jugGlow.intensity = 0; S.inv.push('the small jug'); renderStatus();
  await duel();
}

async function duel() {
  await lines(
    ['levi', "Not so fast! Nobody walks out of my storeroom with a jug unless they can argue for it."],
    ['eli', 'Is that a real regulation?'],
    ['levi', 'It is now.'],
  );
  const rounds = [
    { say: "You've been tramping around next to a puddle of tamei oil. You're tamei yourself!",
      opts: [
        { t: 'I’m wearing very clean sandals.', back: [['levi', 'Your sandals are not the question.']] },
        { t: 'The puddle is a Rishon. Only an Av can make a person tamei. And I never touched it.', ok: true },
        { t: 'Your lunch is tamei.', back: [['levi', 'I KNOW my lunch is tamei.']] }],
      rule: 'Only an Av makes a person tamei. A Rishon can’t (Mishnah Kelim 1:1).' },
    { say: 'That little jug sat in this room all week, a few steps from a dead mouse!',
      opts: [
        { t: 'Mice can’t count steps.', back: [['levi', "Don't get clever."]] },
        { t: 'It was under the floor. Hiding. Like you, from work.', back: [['levi', 'I am AT work.']] },
        { t: 'The mouse was inside another jug. Clay only becomes tamei from its own inside, and this one is sealed tight.', ok: true }],
      rule: 'Clay becomes tamei only through its own inside, and a tight seal protects it (Vayikra 11:33; Bamidbar 19:15).' },
    { say: "Fine. But it's tiny! Top it up from my big jug. More oil, more light, everybody's happy.",
      opts: [
        { t: 'Break the seal and pour in tamei oil? Then all of it is tamei. One small jug of pure oil beats a whole storeroom of tamei oil.', ok: true },
        { t: 'Good idea. Pass the ladle.', back: [['eli', 'Wait. No. Absolutely not.'], ['levi', 'Ha! Almost had you.']] },
        { t: 'Your big jug has a mouse in it.', back: [['levi', 'Not THAT big jug. The other big jug.'], ['eli', 'Every big jug in here is open.'], ['levi', '...Hm.']] }],
      rule: 'Tamei oil poured into pure oil makes all of it tamei. Liquids pass tumah on in any amount.' },
  ];
  let won = 0;
  for (const r of rounds) {
    while (true) {
      const i = await speak('levi', r.say, r.opts.map(o => o.t), { won });
      const o = r.opts[i];
      if (o.ok) { won++; S.comebacks.push(r.rule); await speak('levi', ['Hmph.', 'Hmph!', '...Hmph.'][won - 1], null, { won }); break; }
      await lines(...o.back);
    }
  }
  S.duelWon = true; objective();
  await lines(
    ['levi', 'Well argued. For a Kohen.'],
    ['levi', 'Go on, then. And take your spears.'],
    ['eli', "They're not mine. They're the quartermaster's."],
    ['levi', 'Then take his spears.'],
    ['eli', 'And, about eating your ledger...'],
    ['levi', 'Out.'],
  );
  endTalk();
  await ending();
}

async function ending() {
  const v = await openModal(`<div class="splash"><div class="eyebrow">End of the test scene</div><h2>One small jug</h2>
    <p class="lede">Eli has it: sealed with the Kohen Gadol's seal, never moved, nothing added. Enough for one night.</p>
    <p>In the full game, he now has to carry it through the courtyards to the Heichal without breaking the seal or becoming tamei himself, past a few more people with opinions. The spears will come in handy. Eventually.</p>
    <div class="actions"><button class="btn" data-v="nb">Open the notebook</button><button class="btn primary" data-v="again">Play again</button></div></div>`);
  if (v === 'nb') await notebook();
  if (v === 'again') location.reload();
}

async function notebook() {
  closeMenu();
  const ledger = TAGGABLE.map(id => {
    const t = S.tags[id];
    return `<div><span>${OBJ[id].name}</span><span style="--c:${t ? LV[t].c : 'var(--muted)'}">${t ? LV[t].en : '…'}</span></div>`;
  }).join('');
  const rules = S.rules.length ? S.rules.map(id => `<div class="rule"><b>${WHY[id].title}: ${LV[S.tags[id]].en}</b><p>${WHY[id].body}</p><div class="src">${WHY[id].src.join(' · ')}</div></div>`).join('')
    : '<p class="empty">Nothing yet. Tag something for Yoezer\'s ledger and the rule behind it goes here.</p>';
  const cb = S.comebacks.length ? `<ul>${S.comebacks.map(c => `<li>${c}</li>`).join('')}</ul>` : '<p class="empty">Win an argument to collect comebacks.</p>';
  await openModal(`<div class="nb"><div class="eyebrow">Eli's notebook</div><h2>Sefer Taharah</h2>
    <h3>Yoezer's ledger</h3><div class="ledger">${ledger}</div>
    <h3>The ladder</h3><p>Whatever touches an Av becomes a Rishon; whatever touches a Rishon becomes a Sheni, and so on. Chullin stops at Sheni, terumah at Shlishi, kodesh at Revi'i. Liquids always jump back to Rishon.</p>
    <h3>Rules you've worked out</h3>${rules}
    <h3>Comebacks</h3>${cb}
    <h3>About this test scene</h3><ul>
      <li>One scene (Act II, scene 11) of the planned game, built to test the look, the point-and-click play and the writing.</li>
      <li>All 3D art is built in code from simple shapes: no textures, no downloaded models.</li>
      <li>Yoezer is invented. The four unroofed corner chambers and the oil chamber are from ${SRC.middot25}.</li>
      <li>The game treats oil set aside for the menorah as kodesh. That is a working assumption awaiting a rav's review, as is all the halacha here.</li>
    </ul></div>
    <div class="actions"><button class="btn primary" data-v="ok">Close</button></div>`);
}

// ============================================================ labels, bubbles, small animations
function screenPos(v) {
  const p = v.clone().project(camera);
  return { x: (p.x + 1) / 2 * stage.clientWidth, y: (1 - p.y) / 2 * stage.clientHeight, behind: p.z > 1 };
}
function updateLabel(id, flash) {
  const o = OBJ[id], t = S.tags[id], lab = o.label;
  if (t) {
    lab.className = 'tag'; lab.style.setProperty('--c', LV[t].c);
    lab.innerHTML = `<span>${LV[t].en}</span><span class="he">${LV[t].he}</span>`;
    if (o.ring) { o.ring.material.color.set(LV[t].c); }
  }
  if (flash) { lab.classList.add('flash'); setTimeout(() => lab.classList.remove('flash'), 3000); }
}
function bubble(text, anchor) {
  const b = el('div', 'bubble', text); $('#labels').append(b);
  const p = screenPos(anchor); b.style.left = p.x + 'px'; b.style.top = p.y + 'px';
  setTimeout(() => b.remove(), 1600);
}
const anims = [];
function animate(ms, fn) { return new Promise(res => anims.push({ t: 0, ms: REDUCED ? 1 : ms, fn, res })); }
function faceEliTo(v) { eli.faceTo = Math.atan2(v.x - eli.model.position.x, v.z - eli.model.position.z); }

// ============================================================ walking
function startOf() { return eli.seg ? eli.seg.to : [eli.c, eli.r]; }
function walkPath(path) {
  return new Promise(res => {
    if (eli.onArrive) eli.onArrive(false);
    eli.path = path.slice(1); eli.onArrive = res;
    if (!eli.seg && !eli.path.length) { eli.onArrive = null; res(true); }
  });
}
function nearestAdjacent(targets) {
  const start = startOf();
  let best = null;
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (!walkable(c, r)) continue;
    if (!targets.some(([tc, tr]) => Math.max(Math.abs(tc - c), Math.abs(tr - r)) === 1)) continue;
    const p = bfs(start, [c, r]);
    if (p && (!best || p.length < best.length)) best = p;
  }
  return best;
}
async function goTo(id) {
  const o = OBJ[id];
  const targets = o.near || o.tiles;
  if (!targets || !targets.length) return true;
  const start = startOf();
  const adjacentNow = !eli.seg && targets.some(([tc, tr]) => Math.max(Math.abs(tc - start[0]), Math.abs(tr - start[1])) === 1);
  if (!adjacentNow) {
    const p = nearestAdjacent(targets);
    if (!p) { busy(() => speak('eli', "I can't get there from here.")); return false; }
    const ok = await walkPath(p);
    if (!ok) return false;
  }
  faceEliTo(o.anchor || o.group.position);
  return true;
}

// ============================================================ input
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(room.children, true);
  for (const h of hits) {
    if (!h.object.visible || !isShown(h.object)) continue;
    if (h.object.userData.oid) return { oid: h.object.userData.oid };
    if (h.object.userData.tile) return { tile: h.object.userData.tile };
  }
  return null;
}
function isShown(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }

const caption = $('#caption');
renderer.domElement.addEventListener('pointermove', ev => {
  if (ev.pointerType !== 'mouse') return;
  const h = !S.busy && S.started && modal.hidden ? pick(ev) : null;
  const name = h?.oid ? OBJ[h.oid]?.name : null;
  caption.textContent = name || ''; caption.classList.toggle('on', !!name);
  stage.classList.toggle('pointing', !!h);
});
renderer.domElement.addEventListener('click', async ev => {
  if (S.busy || !S.started || !modal.hidden) return;
  const h = pick(ev);
  if (!h) { closeMenu(); return; }
  if (h.oid) {
    closeMenu();
    const id = h.oid;
    if (id !== 'mouse' && id !== 'eli' && !(await goTo(id))) return;
    if (id === 'mouse') faceEliTo(live.position);
    if (S.busy) return;
    showMenu(id, actionsFor(id));
    return;
  }
  closeMenu();
  const [c, r] = h.tile;
  if (!walkable(c, r)) return;
  const p = bfs(startOf(), [c, r]);
  if (!p) return;
  marker.position.set(wx(c), 0.01, wz(r)); marker.material.opacity = 0.9;
  walkPath(p);
});
addEventListener('keydown', ev => {
  if (ev.key === 'Escape') {
    if (!menu.hidden) closeMenu();
    else if (!modal.hidden) modal.querySelector('[data-v]')?.click();
  }
});

$('#btn-tumah').onclick = () => {
  S.tumah = !S.tumah;
  $('#btn-tumah').setAttribute('aria-pressed', String(S.tumah));
  document.body.classList.toggle('tumah', S.tumah);
};
$('#btn-notebook').onclick = () => { if (modal.hidden) notebook(); };

// ============================================================ the loop
const clock = new THREE.Clock();
const dust = (() => {
  const n = 90, g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), r = rng(11);
  for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 8; pos[i * 3 + 1] = r() * 2.6; pos[i * 3 + 2] = (r() - 0.5) * 6; }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffd9a0', size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(p); return p;
})();
live.userData = { c: 2, r: 5, from: [2, 5], to: [2, 5], t: 1, wait: 1, goal: null };
live.position.set(wx(2), 0, wz(5));

function stepMouse(dt) {
  const u = live.userData;
  if (u.t < 1) {
    u.t = Math.min(1, u.t + dt * 2.6);
    const x = THREE.MathUtils.lerp(wx(u.from[0]), wx(u.to[0]), u.t), z = THREE.MathUtils.lerp(wz(u.from[1]), wz(u.to[1]), u.t);
    live.position.set(x, 0, z);
    live.rotation.y = Math.atan2(wx(u.to[0]) - wx(u.from[0]), wz(u.to[1]) - wz(u.from[1]));
    return;
  }
  u.wait -= dt; if (u.wait > 0) return;
  const here = u.to;
  let next;
  if (u.goal) {
    if (here[0] === u.goal[0] && here[1] === u.goal[1]) { u.wait = 0.4; live.rotation.y += Math.sin(clock.elapsedTime * 20) * 0.3; return; }
    // the mouse may cross the loose tile; it ignores Eli's rules
    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [here[0] + a, here[1] + b])
      .filter(([c, r]) => inGrid(c, r) && (walkable(c, r) || (c === u.goal[0] && r === u.goal[1])) && !(c === eli.c && r === eli.r));
    opts.sort((a, b) => (Math.abs(a[0] - u.goal[0]) + Math.abs(a[1] - u.goal[1])) - (Math.abs(b[0] - u.goal[0]) + Math.abs(b[1] - u.goal[1])));
    next = opts[0]; u.wait = 0.05;
  } else {
    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [here[0] + a, here[1] + b]).filter(([c, r]) => walkable(c, r) && !(c === eli.c && r === eli.r));
    next = opts[Math.floor(Math.random() * opts.length)]; u.wait = 0.6 + Math.random() * 2.2;
  }
  if (next) { u.from = here; u.to = next; u.t = 0; }
}

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  // Eli walking
  if (!eli.seg && eli.path.length) eli.seg = { from: [eli.c, eli.r], to: eli.path.shift(), t: 0 };
  const m = eli.model, ud = m.userData;
  if (eli.seg) {
    const s = eli.seg; s.t = Math.min(1, s.t + dt * 2.8);
    m.position.x = THREE.MathUtils.lerp(wx(s.from[0]), wx(s.to[0]), s.t);
    m.position.z = THREE.MathUtils.lerp(wz(s.from[1]), wz(s.to[1]), s.t);
    eli.faceTo = Math.atan2(s.to[0] - s.from[0], s.to[1] - s.from[1]);
    ud.body.position.y = Math.abs(Math.sin(t * 14)) * 0.04;
    ud.arms[0].rotation.x = Math.sin(t * 14) * 0.5; ud.arms[1].rotation.x = -Math.sin(t * 14) * 0.5;
    if (s.t >= 1) {
      [eli.c, eli.r] = s.to; eli.seg = null;
      if (!eli.path.length && eli.onArrive) { const f = eli.onArrive; eli.onArrive = null; f(true); }
    }
  } else {
    ud.body.position.y = REDUCED ? 0 : Math.sin(t * 2) * 0.008;
    ud.arms[0].rotation.x *= 0.85; ud.arms[1].rotation.x *= 0.85;
  }
  let d = eli.faceTo - eli.face; d = Math.atan2(Math.sin(d), Math.cos(d)); eli.face += d * Math.min(1, dt * 10);
  m.rotation.y = eli.face;
  // Yoezer turns toward Eli
  const lv = OBJ.levi.group, want = Math.atan2(m.position.x - lv.position.x, m.position.z - lv.position.z);
  let dl = want - lv.rotation.y; dl = Math.atan2(Math.sin(dl), Math.cos(dl)); lv.rotation.y += dl * Math.min(1, dt * 2.5);
  lv.userData.body.rotation.z = REDUCED ? 0 : Math.sin(t * 1.3) * 0.015;
  // ambient
  stepMouse(dt);
  const fl = room.userData.flame; fl.scale.y = 1 + Math.sin(t * 17) * 0.12 + Math.sin(t * 7.3) * 0.08;
  torchLight.intensity = 8.5 + Math.sin(t * 13) * 0.8 + Math.sin(t * 5.1) * 0.6;
  if (!REDUCED) { dust.rotation.y = t * 0.01; dust.position.y = Math.sin(t * 0.3) * 0.05; }
  marker.material.opacity *= 0.96;
  if (S.pachFound && !S.pachTaken) { pach.rotation.y += dt * 0.6; jugGlow.intensity = 2.6 + Math.sin(t * 3) * 0.5; }
  // tumah view
  const k = S.tumah ? 1 : 0;
  sun.intensity += ((S.tumah ? 1.4 : 3.1) - sun.intensity) * Math.min(1, dt * 4);
  hemi.color.lerp(new THREE.Color(S.tumah ? '#a58cf0' : '#a4b6e6'), Math.min(1, dt * 4));
  for (const id of TAGGABLE) {
    const o = OBJ[id];
    if (o.ring) {
      const tagged = S.tags[id];
      const target = k * (tagged ? (tagged === 'tahor' ? 0.75 : tagged === 'untrusted' ? 0.45 : 0.85) : 0.25);
      o.ring.material.opacity += (target - o.ring.material.opacity) * Math.min(1, dt * 5);
      const pulse = tagged === 'av' || tagged === 'rishon' ? 1 + Math.sin(t * 4) * 0.08 : 1;
      o.ring.scale.setScalar(pulse);
    }
    if (o.hidden && !S.peeked) { o.label.classList.add('offscreen'); continue; }
    const p = screenPos(o.anchor);
    o.label.classList.toggle('offscreen', p.behind);
    o.label.style.left = p.x + 'px'; o.label.style.top = p.y + 'px';
  }
  // timed animations
  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i]; a.t += dt * 1000; const kk = Math.min(1, a.t / a.ms);
    a.fn(kk < 0.5 ? 2 * kk * kk : 1 - Math.pow(-2 * kk + 2, 2) / 2);
    if (kk >= 1) { anims.splice(i, 1); a.res(); }
  }
  if (menuFor && !menu.hidden && OBJ[menuFor] && innerWidth > 640) placeMenu(OBJ[menuFor]);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ============================================================ start
renderStatus(); objective();
// a small hook for automated tests and console poking
window.__oil = { S, screenOf: id => { const o = OBJ[id]; let first = null; o.group.traverse(m => { if (!first && m.isMesh) first = m; }); const v = new THREE.Box3().setFromObject((id === 'cake' || id === 'jugsD') ? first : o.group).getCenter(new THREE.Vector3()); const p = screenPos(v); return [p.x, p.y]; }, tileAt: (c, r) => { const p = screenPos(new THREE.Vector3(wx(c), 0, wz(r))); return [p.x, p.y]; }, eli: () => [eli.c, eli.r] };
(async () => {
  const v = await openModal(`<div class="splash"><div class="eyebrow">The Last Jug · Act II · test scene</div><h2>Beit Shemaniya</h2>
    <p class="lede">You are Eli, a young Kohen. Yehuda HaMaccabi sent you to find pure oil for the menorah. This is the Mikdash's oil chamber, and something has gone very wrong in it.</p>
    <div class="how"><div><b>Walk</b>Tap the floor.</div><div><b>Look, use, tag</b>Tap anything. Tag each thing's level of tumah for the storekeeper's ledger.</div><div><b>Tumah view</b>The button at the top shows everything you've worked out.</div></div>
    <p class="note">A playable test of the look, the controls and the writing for one scene of the planned game. Sources are linked throughout; the halacha still needs a rav's review.</p>
    <div class="actions"><button class="btn primary" data-v="go">Enter the chamber</button></div></div>`);
  if (v !== 'go') return;
  await walkPath(bfs([0, 4], [2, 4]));
  await busy(intro);
})();

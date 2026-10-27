/* The Last Jug (הכד האחרון).
   A point-and-click adventure in low-poly dioramas: Eli, a young Kohen, carries the one
   sealed jug of pure oil to the menorah at the end of the Chanukah battles.
   Built from oil/src/*.js by tools/build-oil.py; edit the sources, not oil/game.js.
   Halachic notes and sources: docs/OIL_QUEST.md and docs/research/. */
import * as THREE from '../vendor/three/three.module.min.js';

// ============================================================ helpers
const $ = (s, root = document) => root.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const sef = (ref, en, he) => ({
  en: `<a href="https://www.sefaria.org/${ref}" target="_blank" rel="noopener">${en}</a>`,
  he: `<a href="https://www.sefaria.org/${ref}?lang=he" target="_blank" rel="noopener">${he}</a>`,
});

// ============================================================ language
// Visible text is stored as [English, Hebrew] pairs (or {en, he}) and picked at render time.
let LANG = 'en';
try { if (localStorage.getItem('tehara.oil.lang') === 'he') LANG = 'he'; } catch (e) { /* storage blocked */ }
const isHe = () => LANG === 'he';
const tx = v => v == null ? '' : Array.isArray(v) ? v[isHe() ? 1 : 0] : (typeof v === 'object' && 'en' in v) ? v[LANG] : v;

// ============================================================ sources
const SRC = {
  bamidbar1911: sef('Numbers.19.11', 'Bamidbar 19:11', 'במדבר יט, יא'),
  bamidbar1914: sef('Numbers.19.14', 'Bamidbar 19:14', 'במדבר יט, יד'),
  bamidbar1915: sef('Numbers.19.15', 'Bamidbar 19:15', 'במדבר יט, טו'),
  bamidbar1916: sef('Numbers.19.16', 'Bamidbar 19:16', 'במדבר יט, טז'),
  vayikra1131: sef('Leviticus.11.31', 'Vayikra 11:31', 'ויקרא יא, לא'),
  vayikra1133: sef('Leviticus.11.33', 'Vayikra 11:33', 'ויקרא יא, לג'),
  shemot3019: sef('Exodus.30.19', 'Shemot 30:19-21', 'שמות ל, יט-כא'),
  shemot2720: sef('Exodus.27.20', 'Shemot 27:20', 'שמות כז, כ'),
  kelim11: sef('Mishnah_Kelim.1.1', 'Mishnah Kelim 1:1', 'משנה כלים א, א'),
  kelim18: sef('Mishnah_Kelim.1.8', 'Mishnah Kelim 1:8', 'משנה כלים א, ח'),
  oholot61: sef('Mishnah_Oholot.6.1', 'Mishnah Oholot 6:1', 'משנה אהלות ו, א'),
  parah87: sef('Mishnah_Parah.8.7', 'Mishnah Parah 8:7', 'משנה פרה ח, ז'),
  tevulYom22: sef('Mishnah_Tevul_Yom.2.2', 'Mishnah Tevul Yom 2:2', 'משנה טבול יום ב, ב'),
  middot12: sef('Mishnah_Middot.1.2', 'Mishnah Middot 1:2', 'משנה מידות א, ב'),
  middot25: sef('Mishnah_Middot.2.5', 'Mishnah Middot 2:5', 'משנה מידות ב, ה'),
  nazir68: sef('Mishnah_Nazir.6.8', 'Mishnah Nazir 6:8', 'משנה נזיר ו, ח'),
  shekalim51: sef('Mishnah_Shekalim.5.1', 'Mishnah Shekalim 5:1', 'משנה שקלים ה, א'),
  yoma310: sef('Mishnah_Yoma.3.10', 'Mishnah Yoma 3:10', 'משנה יומא ג, י'),
  menachot93: sef('Mishnah_Menachot.9.3', 'Mishnah Menachot 9:3', 'משנה מנחות ט, ג'),
  tm210: sef('Mishneh_Torah,_Defilement_by_a_Corpse.2.10', 'Rambam, Tumat Met 2:9-10', 'רמב"ם, טומאת מת ב, ט-י'),
  tm53: sef('Mishneh_Torah,_Defilement_by_a_Corpse.5.3', 'Rambam, Tumat Met 5:3', 'רמב"ם, טומאת מת ה, ג'),
  tm121: sef('Mishneh_Torah,_Defilement_by_a_Corpse.12.1', 'Rambam, Tumat Met 12:1', 'רמב"ם, טומאת מת יב, א'),
  tm141: sef('Mishneh_Torah,_Defilement_by_a_Corpse.14.1', 'Rambam, Tumat Met 14:1', 'רמב"ם, טומאת מת יד, א'),
  yoma20b: sef('Yoma.20b', 'Yoma 20b', 'יומא כ:'),
  kelim19: sef('Mishnah_Kelim.1.9', 'Mishnah Kelim 1:9', 'משנה כלים א, ט'),
  sat88: sef('Mishneh_Torah,_Other_Sources_of_Defilement.8.8', "Rambam, She'ar Avot HaTumot 8:8", 'רמב"ם, שאר אבות הטומאות ח, ח'),
  sat112: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.2', "Rambam, She'ar Avot HaTumot 11:2", 'רמב"ם, שאר אבות הטומאות יא, ב'),
  sat113: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.3', "Rambam, She'ar Avot HaTumot 11:3", 'רמב"ם, שאר אבות הטומאות יא, ג'),
  sat117: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.7', "Rambam, She'ar Avot HaTumot 11:7", 'רמב"ם, שאר אבות הטומאות יא, ז'),
  sat118: sef('Mishneh_Torah,_Other_Sources_of_Defilement.11.8', "Rambam, She'ar Avot HaTumot 11:8", 'רמב"ם, שאר אבות הטומאות יא, ח'),
  tumatOkhalin12: sef('Mishneh_Torah,_Defilement_of_Foods.1.2', 'Rambam, Tumat Okhalin 1:2', 'רמב"ם, טומאת אוכלין א, ב'),
  tumatOkhalin42: sef('Mishneh_Torah,_Defilement_of_Foods.4.2', 'Rambam, Tumat Okhalin 4:2', 'רמב"ם, טומאת אוכלין ד, ב'),
  kelimR16: sef('Mishneh_Torah,_Vessels.1.6', 'Rambam, Kelim 1:6', 'רמב"ם, כלים א, ו'),
  biat415: sef('Mishneh_Torah,_Admission_into_the_Sanctuary.4.15', "Rambam, Bi'at HaMikdash 4:15", 'רמב"ם, ביאת המקדש ד, טו'),
  chanukah32: sef('Mishneh_Torah,_Scroll_of_Esther_and_Hanukkah.3.2', 'Rambam, Chanukah 3:2', 'רמב"ם, חנוכה ג, ב'),
  shabbat21b: sef('Shabbat.21b.10', 'Shabbat 21b', 'שבת כא:'),
  rashi: sef('Rashi_on_Shabbat.21b.10.2', 'Rashi there', 'רש"י שם'),
  tosafot: sef('Tosafot_on_Shabbat.21b.10.1', 'Tosafot there', 'תוספות שם'),
  yoma6b: sef('Yoma.6b', 'Yoma 6b', 'יומא ו:'),
  yoma45b: sef('Yoma.45b', 'Yoma 45b', 'יומא מה:'),
  rh24b: sef('Rosh_Hashanah.24b', 'Rosh Hashanah 24b', 'ראש השנה כד:'),
};

// ============================================================ palette and materials
const C = {
  stone: '#dcc196', stoneMid: '#c9a677', stoneDark: '#9a7a52', floorA: '#d2b386', floorB: '#c6a678',
  slab: '#8a6a49', rock: '#4b3b37', rock2: '#3a2f30', grassA: '#8f9a5b', grassB: '#86914f', dirtA: '#b39467', dirtB: '#a98a5e',
  paveA: '#e2d0a8', paveB: '#d8c59b', clay: '#b9673e', clayDark: '#8b4428', clayLight: '#d08b5b', wood: '#7a5236', woodDark: '#563823',
  bronze: '#b9883a', gold: '#e2b04a', oil: '#d9a21c', bread: '#c4864a', cake: '#ecc87e', linen: '#f2ece0', skin: '#c58c62',
  beard: '#d4ccbd', iron: '#60656e', mouse: '#8f8a86', dark: '#2a1d14', wax: '#9c2f28', dust: '#ead7b2', stoneCup: '#a9a59c',
  cloth: '#7c8597', canvas: '#c9b79a', water: '#3f6f86', sashBlue: '#3b5aa6', sashRed: '#b23a3e',
};
const MATS = new Map();
function mat(color, o = {}) {
  const k = color + JSON.stringify(o);
  if (!MATS.has(k)) MATS.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0, flatShading: true, ...o }));
  return MATS.get(k);
}
const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, ...o });
function mesh(geo, m, x = 0, y = 0, z = 0, shadow = true) {
  const me = new THREE.Mesh(geo, m); me.position.set(x, y, z);
  me.castShadow = shadow; me.receiveShadow = true; return me;
}
function group(...kids) { const g = new THREE.Group(); for (const k of kids) if (k) g.add(k); return g; }
const at = (g, x, y, z, ry = 0) => { g.position.set(x, y, z); g.rotation.y = ry; return g; };

// ============================================================ renderer
const stage = $('#stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (e) {
  document.body.append(el('div', '', '<div id="nogl"><p>This game needs WebGL, which this browser has turned off. · המשחק צריך WebGL, והדפדפן הזה כיבה אותו.</p></div>'));
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#2e2943', 22, 48);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
const camTarget = new THREE.Vector3();
const hemi = new THREE.HemisphereLight('#a4b6e6', '#5b3a28', 1.35);
const sun = new THREE.DirectionalLight('#ffcf97', 3.1);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 36 });
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
const eliLight = new THREE.PointLight('#ffb35a', 0, 5, 2);   // Eli's lamp in dark rooms
scene.add(hemi, sun, sun.target, eliLight);

// times of day: [sky top, sky bottom, fog, hemi sky, hemi ground, hemi intensity, sun color, sun intensity, exposure]
const LIGHTS = {
  dusk: ['#1d2440', '#a2593a', '#2e2943', '#a4b6e6', '#5b3a28', 1.35, '#ffcf97', 3.1, 1.0],
  evening: ['#141a2c', '#6a3f55', '#2a2540', '#9aa6d8', '#4a3226', 1.15, '#ffc285', 2.4, 1.0],
  dark: ['#0d1220', '#3a2b44', '#1c1a2c', '#7a86b8', '#3a2a22', 0.55, '#c8d2ff', 0.7, 1.05],
  night: ['#0b1020', '#2f2a4a', '#1a1a30', '#8f9ad0', '#3a2a22', 0.85, '#bfcaff', 1.2, 1.05],
  heichal: ['#120e16', '#4a3018', '#1c140f', '#c9a46a', '#3a2412', 0.9, '#ffd28a', 1.0, 1.1],
};

// ============================================================ geometry kit
function jugGeo(s = 1, { phi = Math.PI * 2, open = true } = {}) {
  const p = [[0, 0], [0.17, 0], [0.29, 0.08], [0.37, 0.28], [0.39, 0.52], [0.33, 0.76], [0.2, 0.92], [0.14, 0.98], [0.17, 1.04]];
  if (open) p.push([0.15, 1.07], [0.12, 1.01]);
  return new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x * s, y * s)), 9, 0, phi);
}
const K3 = {
  jug({ s = 1.25, open = true, sealed = false, broken = false, color = C.clay } = {}) {
    const g = new THREE.Group();
    const m = broken ? mat(color, { side: THREE.DoubleSide }) : mat(color);
    g.add(mesh(jugGeo(s, { phi: broken ? Math.PI * 1.35 : Math.PI * 2, open }), m));
    g.add(mesh(new THREE.CylinderGeometry(0.39 * s, 0.395 * s, 0.05 * s, 9, 1, true), mat(C.clayDark, { side: THREE.DoubleSide }), 0, 0.6 * s, 0, false));
    if (open && !broken) g.add(mesh(new THREE.CircleGeometry(0.125 * s, 9).rotateX(-Math.PI / 2), mat('#1d1209'), 0, 1.0 * s, 0, false));
    if (sealed) {
      g.add(mesh(new THREE.CylinderGeometry(0.15 * s, 0.17 * s, 0.07 * s, 9), mat(C.clayDark), 0, 1.07 * s, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.065 * s, 0.07 * s, 0.03 * s, 9), mat(C.wax), 0, 1.115 * s, 0));
      g.add(mesh(new THREE.TorusGeometry(0.15 * s, 0.012 * s, 4, 12).rotateX(Math.PI / 2), mat('#d9c39b'), 0, 0.99 * s, 0, false));
    }
    return g;
  },
  smallJug() {
    const g = new THREE.Group(), s = 0.36;
    g.add(mesh(jugGeo(s, { open: false }), mat(C.clayLight)));
    g.add(mesh(new THREE.TorusGeometry(0.075, 0.018, 4, 8, Math.PI).rotateZ(-Math.PI / 2), mat(C.clayLight), 0.08, 0.26, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.058, 0.062, 0.04, 9), mat(C.clayDark), 0, 0.385, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.038, 0.04, 0.025, 9), mat(C.wax), 0, 0.41, 0));
    return g;
  },
  shard(r, color = C.clay) {
    const m = mesh(new THREE.TetrahedronGeometry(0.09, 0), mat(color));
    m.scale.set(1, 0.3, 1.4); m.rotation.set(r() * 3, r() * 3, r() * 3); return m;
  },
  crate(s = 0.72, color = C.wood) {
    const g = group(mesh(new THREE.BoxGeometry(s, s * 0.85, s), mat(color), 0, s * 0.425, 0));
    g.add(mesh(new THREE.BoxGeometry(s + 0.02, 0.06, 0.08), mat(C.woodDark), 0, s * 0.6, s / 2 - 0.03, false));
    g.add(mesh(new THREE.BoxGeometry(s + 0.02, 0.06, 0.08), mat(C.woodDark), 0, s * 0.25, s / 2 - 0.03, false));
    return g;
  },
  barrel() {
    return group(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.66, 10), mat(C.wood), 0, 0.33, 0),
      mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 10), mat(C.iron), 0, 0.12, 0, false),
      mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 10), mat(C.iron), 0, 0.54, 0, false));
  },
  // a sloped cloth roof on poles over a rectangle of tiles (world units)
  roof(w, d, h, color, { torn = false, slope = 0.25, poles = true, opacity = 1 } = {}) {
    const g = new THREE.Group();
    const cloth = mesh(new THREE.BoxGeometry(w, 0.04, d), mat(color, opacity < 1 ? { side: THREE.DoubleSide, transparent: true, opacity, depthWrite: false } : { side: THREE.DoubleSide }), 0, h, 0, opacity === 1);
    cloth.rotation.x = slope * 0.4; g.add(cloth);
    if (torn) { const flap = mesh(new THREE.BoxGeometry(w * 0.35, 0.03, d * 0.4), mat(color), w * 0.25, h - 0.35, d * 0.5); flap.rotation.x = 1.1; g.add(flap); }
    if (poles) for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, h, 5), mat(C.woodDark), sx * (w / 2 - 0.08), h / 2, sz * (d / 2 - 0.08)));
    return g;
  },
  // an A-frame tent: a triangular prism with its ridge along x, and a dark doorway at one end
  tent(w, d, color = C.canvas) {
    const g = new THREE.Group(), h = d * 0.75;
    const shape = new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, h)]);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: w, bevelEnabled: false }); geo.translate(0, 0, -w / 2); geo.rotateY(Math.PI / 2);
    g.add(mesh(geo, mat(color)));
    const door = new THREE.Shape([new THREE.Vector2(-d * 0.18, 0), new THREE.Vector2(d * 0.18, 0), new THREE.Vector2(0, h * 0.6)]);
    const dm = mesh(new THREE.ShapeGeometry(door), mat('#3a2a1c', { side: THREE.DoubleSide }), w / 2 + 0.005, 0.005, 0, false); dm.rotation.y = Math.PI / 2; g.add(dm);
    return g;
  },
  // a covered, still shape: one of the fallen
  fallen(color = '#6f7686') {
    const g = new THREE.Group();
    const b = mesh(new THREE.CapsuleGeometry(0.16, 0.62, 3, 7), mat(color));
    b.rotation.z = Math.PI / 2; b.scale.set(1, 1, 0.75); b.position.y = 0.13; g.add(b);
    g.add(mesh(new THREE.BoxGeometry(0.98, 0.03, 0.5), mat('#5c6272'), 0, 0.015, 0, false));
    return g;
  },
  bone() {
    const g = new THREE.Group();
    const b = mesh(new THREE.CapsuleGeometry(0.025, 0.07, 2, 5), mat('#efe6d2')); b.rotation.z = Math.PI / 2; b.position.y = 0.03; g.add(b);
    return g;
  },
  sword() {
    const g = new THREE.Group();
    const blade = mesh(new THREE.BoxGeometry(0.7, 0.02, 0.07), mat('#9aa1ab', { metalness: 0.5, roughness: 0.4 }), 0.1, 0.02, 0); g.add(blade);
    g.add(mesh(new THREE.BoxGeometry(0.05, 0.04, 0.24), mat(C.bronze), -0.27, 0.03, 0));
    g.add(mesh(new THREE.BoxGeometry(0.16, 0.04, 0.05), mat(C.woodDark), -0.37, 0.03, 0));
    g.rotation.y = 0.5; return g;
  },
  plank(len = 0.95) { return group(mesh(new THREE.BoxGeometry(len, 0.06, 0.32), mat('#a07a4c'), 0, 0.03, 0)); },
  stall(color = '#9a4f3a') {
    const g = group(mesh(new THREE.BoxGeometry(1.7, 0.5, 0.6), mat(C.wood), 0, 0.25, 0));
    g.add(K3.roof(1.9, 0.9, 1.25, color, { slope: 0 }));
    for (let i = 0; i < 4; i++) { const j = mesh(jugGeo(0.32), mat(i % 2 ? '#c99a52' : C.clayLight)); j.position.set(-0.6 + i * 0.4, 0.5, 0); g.add(j); }
    return g;
  },
  gate(w = 1.6, h = 2.3, open = true) {
    const g = new THREE.Group();
    for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(0.55, h, 0.7), mat(C.stone), s * (w / 2 + 0.27), h / 2, 0));
    g.add(mesh(new THREE.BoxGeometry(w + 1.2, 0.4, 0.75), mat(C.stoneMid), 0, h + 0.2, 0));
    const doors = new THREE.Group();
    for (const s of [-1, 1]) {
      const d = mesh(new THREE.BoxGeometry(w / 2, h - 0.1, 0.08), mat('#b48a3e', { metalness: 0.3 }), s * w / 4, (h - 0.1) / 2, 0);
      if (open) { d.rotation.y = s * 1.3; d.position.x = s * (w / 2 - 0.05); d.position.z = 0.3; }
      doors.add(d);
    }
    g.add(doors); g.userData.doors = doors;
    return g;
  },
  fence(len) {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(len, 0.06, 0.08), mat('#8a6a49'), 0, 0.55, 0));
    g.add(mesh(new THREE.BoxGeometry(len, 0.06, 0.08), mat('#8a6a49'), 0, 0.2, 0));
    for (let x = -len / 2 + 0.1; x <= len / 2; x += 0.25) g.add(mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), mat('#9c7a52'), x, 0.3, 0, false));
    return g;
  },
  door(h = 1.7, color = '#6b4a2c') { return group(mesh(new THREE.BoxGeometry(0.9, h, 0.1), mat(color), 0, h / 2, 0)); },
  fire() {
    const g = new THREE.Group();
    for (let i = 0; i < 4; i++) { const l = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 5), mat(C.woodDark), 0, 0.05, 0); l.rotation.set(Math.PI / 2, i * 0.8, 0); g.add(l); }
    const f = mesh(new THREE.ConeGeometry(0.16, 0.42, 6), basic('#ffa63d'), 0, 0.26, 0, false); g.add(f);
    g.add(mesh(new THREE.ConeGeometry(0.09, 0.28, 5), basic('#ffe08a'), 0, 0.22, 0, false));
    g.userData.flame = f; return g;
  },
  pot() { return group(mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.34, 9), mat('#4a4440', { metalness: 0.3 }), 0, 0.55, 0), mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), mat(C.iron), 0, 0.4, 0.3)); },
  log(len = 0.8, color = '#8c6440') { const l = mesh(new THREE.CylinderGeometry(0.1, 0.11, len, 7), mat(color), 0, 0.11, 0); l.rotation.z = Math.PI / 2; return group(l); },
  lamp(lit = false) {
    const g = new THREE.Group();
    const b = mesh(new THREE.SphereGeometry(0.09, 8, 4), mat(C.clayLight)); b.scale.y = 0.45; b.position.y = 0.04; g.add(b);
    g.add(mesh(new THREE.ConeGeometry(0.035, 0.1, 5), mat(C.clayLight), 0.1, 0.05, 0).rotateZ(-Math.PI / 2));
    const f = mesh(new THREE.ConeGeometry(0.03, 0.09, 5), basic('#ffc04d'), 0.15, 0.11, 0, false); f.visible = lit; g.add(f);
    g.userData.flame = f; return g;
  },
  kiyor() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.7, 8), mat(C.bronze, { metalness: 0.5, roughness: 0.45 }), 0, 0.35, 0));
    const basin = mesh(new THREE.CylinderGeometry(0.55, 0.35, 0.35, 12, 1, true), mat(C.bronze, { metalness: 0.5, roughness: 0.45, side: THREE.DoubleSide }), 0, 0.88, 0); g.add(basin);
    const water = mesh(new THREE.CircleGeometry(0.5, 12).rotateX(-Math.PI / 2), mat('#5b8aa3', { roughness: 0.15, flatShading: false }), 0, 0.98, 0, false); g.add(water);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 4), mat(C.bronze), Math.cos(a) * 0.4, 0.68, Math.sin(a) * 0.4).rotateZ(0.6)); }
    g.userData.water = water; return g;
  },
  wheel() {
    const g = new THREE.Group();
    const w = new THREE.Group();
    w.add(mesh(new THREE.TorusGeometry(0.42, 0.04, 5, 14), mat(C.wood)));
    for (let i = 0; i < 4; i++) { const s = mesh(new THREE.BoxGeometry(0.84, 0.05, 0.05), mat(C.woodDark)); s.rotation.z = i * Math.PI / 4; w.add(s); }
    w.position.y = 0.75; g.add(w);
    g.add(mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(C.woodDark), 0, 0.4, -0.08));
    g.userData.wheel = w; return g;
  },
  altar() {
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(2.6, 1.3, 2.6), mat('#cdb48c'), 0, 0.65, 0));
    g.add(mesh(new THREE.BoxGeometry(2.3, 0.2, 2.3), mat('#bfa57b'), 0, 1.4, 0));
    for (const [x, z] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]]) g.add(mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), mat('#d8c297'), x, 1.6, z));
    const ramp = mesh(new THREE.BoxGeometry(0.9, 0.12, 2.0), mat('#c4aa80'), 0, 0.65, 2.1); ramp.rotation.x = 0.62; g.add(ramp);
    const fire = K3.fire(); fire.position.set(0, 1.5, 0); fire.scale.setScalar(2); g.add(fire); g.userData.flame = fire.userData.flame;
    return g;
  },
  // the menorah the Chashmona'im made: iron spears, wrapped in tin
  menorah() {
    const g = new THREE.Group(), m = mat('#7d838c', { metalness: 0.55, roughness: 0.45 });
    g.add(mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.12, 6), m, 0, 0.06, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.5, 5), m, 0, 0.8, 0));
    const lamps = [];
    const lampAt = (x, y) => { const l = K3.lamp(false); l.scale.setScalar(0.8); l.position.set(x - 0.08, y, 0); g.add(l); lamps.push(l); };
    // straight branches rising diagonally from the stem, as the Rambam drew it; all seven lamps level
    for (const r of [0.22, 0.42, 0.62]) {
      for (const s of [-1, 1]) {
        const len = r * Math.SQRT2;
        const b = mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 5), m, s * r / 2, 1.55 - r / 2, 0);
        b.rotation.z = -s * Math.PI / 4; g.add(b);
        lampAt(s * r, 1.56);
      }
    }
    lampAt(0, 1.56);
    g.userData.lamps = lamps; return g;
  },
  spearBundle() {
    const g = new THREE.Group();
    for (const dx of [-0.05, 0, 0.05]) {
      g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.15, 4), mat(C.iron), dx, 0, 0));
      g.add(mesh(new THREE.ConeGeometry(0.03, 0.14, 4), mat(C.iron, { metalness: 0.4, roughness: 0.5 }), dx, 0.64, 0));
    }
    g.add(mesh(new THREE.TorusGeometry(0.075, 0.012, 3, 8).rotateX(Math.PI / 2), mat('#8c6d45'), 0, 0.1, 0));
    return g;
  },
  goldBox(w, h, d) { return group(mesh(new THREE.BoxGeometry(w, h, d), mat(C.gold, { metalness: 0.6, roughness: 0.35 }), 0, h / 2, 0)); },
  bush(r) { const b = mesh(new THREE.IcosahedronGeometry(0.35 + r() * 0.2, 0), mat(r() > 0.5 ? '#6f7d45' : '#5f6d3c')); b.position.y = 0.25; b.scale.y = 0.7; return group(b); },
  olive(r) {
    const g = group(mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.9, 5), mat('#6b5440'), 0, 0.45, 0));
    for (let i = 0; i < 3; i++) g.add(mesh(new THREE.IcosahedronGeometry(0.35 + r() * 0.15, 0), mat(i % 2 ? '#7d8a55' : '#6c7a4a'), (r() - 0.5) * 0.4, 1.0 + r() * 0.3, (r() - 0.5) * 0.4));
    return g;
  },
  mouse() {
    const g = new THREE.Group();
    const b = mesh(new THREE.IcosahedronGeometry(0.07, 0), mat(C.mouse)); b.scale.set(0.9, 0.7, 1.4); b.position.y = 0.05; g.add(b);
    const h = mesh(new THREE.ConeGeometry(0.045, 0.1, 5), mat(C.mouse), 0, 0.055, 0.12); h.rotation.x = Math.PI / 2; g.add(h);
    for (const s of [-1, 1]) g.add(mesh(new THREE.CircleGeometry(0.03, 6), mat('#d9a7a2', { side: THREE.DoubleSide }), s * 0.035, 0.1, 0.09, false));
    const t = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 3), mat('#c99f9a'), 0, 0.03, -0.18); t.rotation.x = Math.PI / 2.4; g.add(t);
    return g;
  },
};

// ============================================================ people
// person(): a small low-poly figure facing +z. Options pick clothes, headwear, beard and pose.
function person({ robe = C.linen, sash = null, sash2 = null, head = 'turban', headColor = C.linen, beard = null, hair = null, scale = 1, pose = 'stand', skin = C.skin, armor = null, prop = null } = {}) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const seated = pose === 'sit', lying = pose === 'lie';
  if (seated) g.add(mesh(new THREE.BoxGeometry(0.58, 0.38, 0.5), mat(C.wood), 0, 0.19, -0.05));
  const robeH = seated ? 0.46 : 0.62, baseY = seated ? 0.37 : 0;
  body.add(mesh(new THREE.CylinderGeometry(0.15, 0.24, robeH, 8), mat(robe), 0, baseY + robeH / 2 + (seated ? 0 : 0.02), 0));
  if (seated) body.add(mesh(new THREE.BoxGeometry(0.34, 0.12, 0.34), mat(robe), 0, 0.42, 0.17));
  const top = baseY + robeH + (seated ? 0 : 0.02);
  if (armor) body.add(mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.28, 8), mat(armor, { metalness: 0.4, roughness: 0.5 }), 0, top - 0.17, 0));
  if (sash) body.add(mesh(new THREE.CylinderGeometry(0.163, 0.17, 0.055, 8), mat(sash), 0, top - 0.17, 0));
  if (sash2) body.add(mesh(new THREE.CylinderGeometry(0.168, 0.174, 0.03, 8), mat(sash2), 0, top - 0.21, 0));
  const hy = top + 0.18;
  body.add(mesh(new THREE.IcosahedronGeometry(0.14, 1), mat(skin), 0, hy, 0));
  for (const s of [-1, 1]) body.add(mesh(new THREE.BoxGeometry(0.03, lying ? 0.01 : 0.035, 0.02), mat(C.dark), s * 0.05, hy + 0.01, 0.13, false));
  if (head === 'turban') {
    body.add(mesh(new THREE.CylinderGeometry(0.137, 0.15, 0.12, 8), mat(headColor), 0, hy + 0.1, -0.01));
    body.add(mesh(new THREE.SphereGeometry(0.137, 8, 3, 0, Math.PI * 2, 0, Math.PI / 2), mat(headColor), 0, hy + 0.155, -0.01));
  } else if (head === 'wrap' || head === 'cap') {
    body.add(mesh(new THREE.CylinderGeometry(0.15, 0.145, head === 'cap' ? 0.08 : 0.12, 8), mat(headColor), 0, hy + 0.1, -0.01));
  } else if (head === 'helmet') {
    body.add(mesh(new THREE.SphereGeometry(0.155, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), mat(headColor, { metalness: 0.5, roughness: 0.45 }), 0, hy + 0.04, 0));
    body.add(mesh(new THREE.BoxGeometry(0.04, 0.12, 0.3), mat('#8a2b2b'), 0, hy + 0.2, -0.02));
  } else if (head === 'wreath') {
    body.add(mesh(new THREE.TorusGeometry(0.13, 0.025, 4, 10).rotateX(Math.PI / 2), mat('#7d9a4a'), 0, hy + 0.07, 0));
  }
  if (hair) {
    const h = mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.55, 7, 1, true), mat(hair, { side: THREE.DoubleSide }), 0, hy - 0.18, -0.04); body.add(h);
    body.add(mesh(new THREE.SphereGeometry(0.15, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), mat(hair), 0, hy + 0.04, -0.01));
    g.userData.hair = h;
  }
  if (beard) { const b = mesh(new THREE.ConeGeometry(0.11, 0.24, 6), mat(beard), 0, hy - 0.12, 0.09); b.rotation.x = Math.PI + 0.25; body.add(b); }
  const arms = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Group(); a.position.set(s * 0.18, top - 0.03, 0);
    a.add(mesh(new THREE.BoxGeometry(0.075, 0.32, 0.08), mat(robe), 0, -0.15, 0));
    a.add(mesh(new THREE.IcosahedronGeometry(0.045, 0), mat(skin), 0, -0.33, 0));
    if (seated) a.rotation.x = -0.9;
    body.add(a); arms.push(a);
  }
  if (prop === 'ledger') { body.add(mesh(new THREE.BoxGeometry(0.28, 0.025, 0.2), mat('#e8dcc0'), 0, baseY + 0.15 + (seated ? 0 : 0.35), 0.28)); }
  if (prop === 'staff') arms[1].add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 4), mat(C.woodDark), 0, -0.1, 0.05));
  if (prop === 'torch') { arms[1].add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.5, 4), mat(C.woodDark), 0, -0.25, 0.08)); arms[1].add(mesh(new THREE.ConeGeometry(0.06, 0.16, 5), basic('#ffb347'), 0, -0.02, 0.08, false)); arms[1].rotation.x = -0.6; }
  if (lying) { body.rotation.x = -Math.PI / 2; body.position.set(0, 0.17, -0.45); }
  g.scale.setScalar(scale);
  g.userData = { ...g.userData, body, arms, top: hy * scale };
  return g;
}
// Eli wears the Kohen's white tunic and turban and carries the bundle of spears
function buildEli() {
  const g = person({ sash: C.sashBlue, sash2: C.sashRed });
  const spears = K3.spearBundle(); spears.position.set(0, 0.55, -0.22); spears.rotation.z = 0.42;
  g.userData.body.add(spears); g.userData.spears = spears; spears.visible = false;
  const lamp = K3.lamp(true); lamp.position.set(0.05, -0.36, 0.05); lamp.visible = false; g.userData.arms[1].add(lamp); g.userData.lamp = lamp;
  const jug = K3.smallJug(); jug.scale.setScalar(0.7); jug.position.set(0, -0.42, 0.06); jug.visible = false; g.userData.arms[0].add(jug); g.userData.jug = jug;
  return g;
}
const CAST = {
  quartermaster: () => person({ robe: '#7b6a4e', head: 'cap', headColor: '#5a4632', beard: '#3a2a1e', prop: 'ledger' }),
  runner: () => person({ robe: '#a78a5a', head: 'wrap', headColor: '#8a6a4a', scale: 0.92 }),
  yehuda: () => person({ robe: '#ecdcc0', armor: '#8c7a5a', head: 'helmet', headColor: '#a88a4a', beard: '#2a1d14', scale: 1.08 }),
  avner: () => person({ robe: '#7a5a46', armor: '#6e6a62', head: 'wrap', headColor: '#4a3a2e', beard: '#5a3a22', scale: 1.32 }),
  philo: () => person({ robe: '#3d6fa3', sash: '#e2b04a', head: 'wreath', skin: '#d6a07a', scale: 1.0 }),
  levi: () => person({ robe: '#6a587c', head: 'wrap', headColor: '#8a6a4a', beard: C.beard, pose: 'sit', prop: 'ledger' }),
  guard: () => person({ robe: '#5d6e8a', head: 'wrap', headColor: '#3a4a66', beard: '#4a3a2e', pose: 'lie' }),
  gevini: () => person({ robe: '#a65b3a', head: 'cap', headColor: '#7a3a22', beard: '#2a1d14', scale: 1.15 }),
  officer: () => person({ robe: '#3a3a4a', head: 'wrap', headColor: '#222233', beard: '#555', prop: 'torch' }),
  nazir: () => person({ robe: '#cdbf9e', head: 'none', hair: '#4a2e1a', beard: '#4a2e1a' }),
  inspector: () => person({ robe: C.linen, sash: C.sashBlue, head: 'turban', beard: '#7a6a5a', pose: 'sit' }),
  yochanan: () => person({ robe: '#5a6a4a', head: 'cap', headColor: '#3a4a2a', beard: '#8a8070', prop: 'ledger' }),
  baker: () => person({ robe: '#e6d6b8', head: 'cap', headColor: '#cbb48a', scale: 0.9 }),
  shimi: () => person({ robe: '#6a587c', head: 'wrap', headColor: '#8a6a4a', beard: '#6a5a4a' }),
  keeper: () => person({ robe: '#6a587c', head: 'wrap', headColor: '#4a3a5a', beard: C.beard, prop: 'staff' }),
};

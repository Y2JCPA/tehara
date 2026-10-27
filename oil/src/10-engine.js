// ============================================================ shared text
const U = {
  title: ['The Last Jug', 'הכד האחרון'],
  tumahBtn: ['Tumah view', 'תצוגת טומאה'],
  nbBtn: ['Notebook', 'מחברת'],
  menuBtn: ['Menu', 'תפריט'],
  langBtn: ['עברית', 'English'],
  next: ['Continue ▸', 'המשך ◂'],
  duel: ['Pilpul duel', 'דו־קרב פלפול'],
  closeUp: ['Close-up', 'מקרוב'],
  sources: ['Sources:', 'מקורות:'],
  tagTitle: ['Tag', 'תיוג'], tagIt: ['Tag it…', 'תייג…'], tagged: ['Tagged', 'תויג'],
  neverMind: ['Never mind', 'עזוב'], look: ['Look', 'הסתכל'], talk: ['Talk', 'דבר'], push: ['Push', 'דחוף'], go: ['Go', 'לך'],
  eli: ['Eli', 'אלי'], tahor: ['Tahor', 'טהור'], carrying: ['Carrying', 'נושא'], nothing: ['nothing', 'כלום'],
  hands: ['Hands and feet', 'ידיים ורגליים'], washed: ['washed at the kiyor', 'קידש מהכיור'], notWashed: ['not washed yet', 'עוד לא קידש'],
  jugTitle: ['The small jug', 'הכד הקטן'], sealed: ['Sealed', 'חתום'], kgSeal: ["Kohen Gadol's seal", 'חותם כהן גדול'],
  neverMoved: ['Never moved', 'לא הוזז'], nothingAdded: ['Nothing added', 'לא הוסיפו לו'],
  cantGet: ["I can't get there from here.", 'אני לא יכול להגיע לשם מכאן.'],
  cantPush: ["It won't go that way.", 'זה לא זז לכיוון הזה.'],
  pushFrom: ['I need to stand right next to it, on the far side.', 'אני צריך לעמוד צמוד אליו, מהצד השני.'],
  begin: ['Begin', 'התחל'], act: ['Act', 'מערכה'], scene: ['Scene', 'סצנה'], finale: ['Finale', 'סיום'],
  newRule: ['New rule', 'כלל חדש'], gotIt: ['Got it', 'הבנתי'],
  newGame: ['New game', 'משחק חדש'], cont: ['Continue', 'המשך'], chapters: ['Chapters', 'פרקים'], back: ['Back', 'חזרה'],
  close: ['Close', 'סגור'], toTitle: ['Back to the title screen', 'חזרה למסך הפתיחה'],
  tipWalk: ['<b>Tip:</b> tap the floor to walk. Tap anything to look at it or use it.', '<b>טיפ:</b> הקישו על הרצפה כדי ללכת. הקישו על כל דבר כדי להסתכל עליו או להשתמש בו.'],
  tipTumah: ['<b>Tip:</b> Tumah view shows where Eli can’t go, and why.', '<b>טיפ:</b> תצוגת הטומאה מראה לאן אלי לא יכול ללכת, ולמה.'],
  ledger: ['Ledger', 'פנקס'],
};
const INV = {
  spears: ['spare spears', 'רמחים רזרביים'], plank: ['a plank', 'קרש'], lamp: ['a clay lamp', 'נר חרס'], lampLit: ['a lit lamp', 'נר דולק'],
  razor: ["the nazir's razor", 'התער של הנזיר'], wedge: ['a wedge stone', 'אבן טריז'], cup: ['a stone cup', 'כוס אבן'],
  jug: ['the small jug', 'הכד הקטן'], firepan: ['a fire pan with coals', 'מחתה עם גחלים'],
};
const LV = {
  av: { en: 'Av HaTumah', he: 'אב הטומאה', c: '#c25cff' },
  rishon: { en: 'Rishon', he: 'ראשון', c: '#a57dff' },
  sheni: { en: 'Sheni', he: 'שני', c: '#8f95ff' },
  shlishi: { en: 'Shlishi', he: 'שלישי', c: '#86b3ff' },
  revii: { en: "Revi'i", he: 'רביעי', c: '#93d0ff' },
  tahor: { en: 'Tahor', he: 'טהור', c: '#f6e3a0' },
  untrusted: { en: "Can't be trusted", he: 'אין לסמוך עליו', c: '#b9b1a3' },
};
const lvName = k => isHe() ? LV[k].he : LV[k].en;
const lvHTML = k => isHe() ? `<span>${LV[k].he}</span>` : `<span>${LV[k].en}</span><span class="he">${LV[k].he}</span>`;

// rules shown on "New rule" cards and collected in the notebook: key -> { title, body, src }
const RULES = {};
const SCENES = [];
const sceneById = id => SCENES.find(s => s.id === id);

// ============================================================ portraits
function portrait({ bg = '#2c3552', robe = C.linen, skin = C.skin, head = 'turban', headColor = '#f7f2e8', beard = null, hair = null, brows = 'calm', accent = null }) {
  const browPath = { calm: 'M37 48 h9 M54 48 h9', worried: 'M37 50 l9 -3 M54 47 l9 3', stern: 'M37 46 l9 3 M54 49 l9 -3', bushy: 'M34 45 l12 3 M54 48 l12 -3' }[brows];
  const browW = brows === 'bushy' ? 5 : 2.4;
  const headSvg = {
    turban: `<path d="M28 47 Q28 22 50 21 Q72 22 72 47 Q50 37 28 47Z" fill="${headColor}"/>`,
    wrap: `<path d="M29 42 Q30 22 50 22 Q70 22 71 42 Q50 34 29 42Z" fill="${headColor}"/>`,
    cap: `<path d="M31 40 Q32 26 50 26 Q68 26 69 40 Z" fill="${headColor}"/>`,
    helmet: `<path d="M27 46 Q27 18 50 18 Q73 18 73 46 Z" fill="${headColor}"/><rect x="47" y="8" width="6" height="14" fill="#8a2b2b"/>`,
    wreath: `<path d="M30 40 Q50 28 70 40" stroke="#7d9a4a" stroke-width="6" fill="none" stroke-dasharray="6 3"/>`,
    none: '',
  }[head];
  const hairSvg = hair ? `<path d="M26 50 Q24 20 50 20 Q76 20 74 50 L78 90 L22 90Z" fill="${hair}"/>` : '';
  const beardSvg = beard ? `<path d="M30 54 Q32 92 50 94 Q68 92 70 54 Q60 66 50 66 Q40 66 30 54Z" fill="${beard}"/>` : '';
  return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="${bg}"/>${hairSvg}<path d="M14 100 Q50 60 86 100Z" fill="${robe}"/>${accent ? `<path d="M40 80 h20 v6 h-20Z" fill="${accent}"/>` : ''}<circle cx="50" cy="50" r="21" fill="${skin}"/>${beardSvg}${headSvg}<path d="${browPath}" stroke="${brows === 'bushy' ? '#e8e2d6' : '#3a2618'}" stroke-width="${browW}" stroke-linecap="round"/><circle cx="42" cy="54" r="2.8" fill="#2a1d14"/><circle cx="58" cy="54" r="2.8" fill="#2a1d14"/><path d="M45 ${beard ? 62 : 64} Q50 61 55 ${beard ? 62 : 64}" stroke="#7a4a30" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
}
const PEOPLE = {
  eli: { name: ['Eli', 'אלי'], p: portrait({ brows: 'worried', accent: C.sashBlue }) },
  narr: { name: ['', ''], p: '' },
  quartermaster: { name: ['The quartermaster', 'האפסנאי'], p: portrait({ bg: '#3d3528', robe: '#7b6a4e', head: 'cap', headColor: '#5a4632', beard: '#3a2a1e', brows: 'stern' }) },
  runner: { name: ['The runner', 'השליח'], p: portrait({ bg: '#3a3a2a', robe: '#a78a5a', head: 'wrap', headColor: '#8a6a4a' }) },
  yehuda: { name: ['Yehuda HaMaccabi', 'יהודה המכבי'], p: portrait({ bg: '#3a2a22', robe: '#8c7a5a', head: 'helmet', headColor: '#a88a4a', beard: '#2a1d14', brows: 'stern' }) },
  avner: { name: ['Avner', 'אבנר'], p: portrait({ bg: '#2f3a2a', robe: '#6e6a62', head: 'wrap', headColor: '#4a3a2e', beard: '#5a3a22' }) },
  philo: { name: ['Philo the oil merchant', 'פילון סוחר השמן'], p: portrait({ bg: '#22344a', robe: '#3d6fa3', skin: '#d6a07a', head: 'wreath', accent: C.gold }) },
  guard: { name: ['The Levi guard', 'השומר הלוי'], p: portrait({ bg: '#26304a', robe: '#5d6e8a', head: 'wrap', headColor: '#3a4a66', beard: '#4a3a2e', brows: 'worried' }) },
  gevini: { name: ['Gevini the herald', 'גביני הכרוז'], p: portrait({ bg: '#40261a', robe: '#a65b3a', head: 'cap', headColor: '#7a3a22', beard: '#2a1d14' }) },
  officer: { name: ['The officer of the Temple Mount', 'איש הר הבית'], p: portrait({ bg: '#1e1e2a', robe: '#3a3a4a', head: 'wrap', headColor: '#222233', beard: '#555', brows: 'stern' }) },
  baker: { name: ['A baker’s apprentice', 'שוליית אופה'], p: portrait({ bg: '#3e3626', robe: '#e6d6b8', head: 'cap', headColor: '#cbb48a', brows: 'worried' }) },
  yochanan: { name: ['Yochanan of the seals', 'יוחנן שעל החותמות'], p: portrait({ bg: '#2e3626', robe: '#5a6a4a', head: 'cap', headColor: '#3a4a2a', beard: '#8a8070' }) },
  nazir: { name: ['The nazir', 'הנזיר'], p: portrait({ bg: '#3a2e22', robe: '#cdbf9e', head: 'none', hair: '#4a2e1a', beard: '#4a2e1a', brows: 'worried' }) },
  inspector: { name: ['The wood inspector', 'בודק העצים'], p: portrait({ bg: '#2c2a3a', robe: C.linen, accent: C.sashBlue, beard: '#7a6a5a', brows: 'stern' }) },
  levi: { name: ['Yoezer the Levi', 'יועזר הלוי'], p: portrait({ bg: '#3a2f45', robe: '#6a587c', head: 'wrap', headColor: '#8a6a4a', beard: C.beard, brows: 'bushy' }) },
  shimi: { name: ['Shimi the Levi', 'שמעי הלוי'], p: portrait({ bg: '#2f2a40', robe: '#6a587c', head: 'wrap', headColor: '#8a6a4a', beard: '#6a5a4a' }) },
  keeper1: { name: ['The keeper of the Nikanor Gate', 'שומר שער ניקנור'], p: portrait({ bg: '#2a2438', robe: '#6a587c', head: 'wrap', headColor: '#4a3a5a', beard: C.beard, brows: 'stern' }) },
  farmer: { name: ['Gidi the ploughman', 'גידי החורש'], p: portrait({ bg: '#3a3222', robe: '#8a7048', head: 'wrap', headColor: '#c9b48a', beard: '#6a4a2e', brows: 'worried' }) },
  tuvia: { name: ['Tuvia the Kohen', 'טוביה הכהן'], p: portrait({ bg: '#2e3440', robe: C.linen, head: 'turban', beard: '#5a3a22', brows: 'worried' }) },
  keeper2: { name: ['The keeper of the Kohanim’s court', 'שומר עזרת הכהנים'], p: portrait({ bg: '#2a2438', robe: C.linen, head: 'turban', beard: '#9a8a7a', accent: C.sashBlue }) },
};

// ============================================================ progress (saved on this device)
const SAVE_KEY = 'tehara.oil.save.v1';
const freshProgress = () => ({ v: 1, scene: null, done: [], inv: [], flags: {}, rules: [], comebacks: [], tags: {} });
let P = freshProgress();
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s && s.v === 1) P = { ...freshProgress(), ...s }; } catch (e) { /* storage blocked */ }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(P)); } catch (e) { /* storage blocked */ } }
const has = k => P.inv.includes(k);
function give(k) { if (!has(k)) P.inv.push(k); save(); renderStatus(); dressEli(); }
function take(k) { P.inv = P.inv.filter(x => x !== k); save(); renderStatus(); dressEli(); }
function flag(k, v = true) { P.flags[k] = v; save(); }
const fl = k => !!P.flags[k];

// ============================================================ the current scene
const G = { sc: null, cols: 8, rows: 6, blocked: new Set(), haz: new Map(), objs: {}, st: {}, started: false, loading: false, screen: 'title' };
let ST = {};   // per-scene state, reset whenever a scene loads
const wx = c => c - (G.cols - 1) / 2;
const wz = r => r - (G.rows - 1) / 2;
const K = (c, r) => c + ',' + r;
const inGrid = (c, r) => c >= 0 && r >= 0 && c < G.cols && r < G.rows;
const occupied = (c, r) => G.blocked.has(K(c, r));
const walkable = (c, r) => inGrid(c, r) && !occupied(c, r) && !G.haz.has(K(c, r));
const room = new THREE.Group(); scene.add(room);

function bfs(start, goal, ok = walkable) {
  const prev = new Map([[K(...start), null]]);
  const q = [start];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === goal[0] && cur[1] === goal[1]) {
      const path = []; let node = cur;
      while (node) { path.unshift(node); node = prev.get(K(...node)); }
      return path;
    }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = [cur[0] + dc, cur[1] + dr];
      if (!ok(...n) || prev.has(K(...n))) continue;
      prev.set(K(...n), cur); q.push(n);
    }
  }
  return null;
}

// ---------- floors, walls, the floating base
function buildGround(theme) {
  const r = rng(G.cols * 31 + G.rows * 7 + theme.length);
  const pal = { stone: [C.floorA, C.floorB], pave: [C.paveA, C.paveB], grass: [C.grassA, C.grassB], dirt: [C.dirtA, C.dirtB], heichal: ['#b89a6a', '#ad8f60'] }[theme] || [C.floorA, C.floorB];
  const tiles = [];
  for (let c = 0; c < G.cols; c++) for (let rr = 0; rr < G.rows; rr++) {
    const col = new THREE.Color((c + rr) % 2 ? pal[0] : pal[1]).offsetHSL(0, 0, (r() - 0.5) * 0.05);
    const gap = theme === 'grass' || theme === 'dirt' ? 0.99 : 0.95;
    const t = mesh(new THREE.BoxGeometry(gap, 0.12, gap), mat('#' + col.getHexString()), wx(c), -0.06 + (theme === 'grass' ? (r() - 0.5) * 0.03 : 0), wz(rr), false);
    t.userData.tile = [c, rr]; room.add(t); tiles.push(t);
  }
  const slabColor = theme === 'grass' || theme === 'dirt' ? '#6e5a3e' : C.slab;
  room.add(mesh(new THREE.BoxGeometry(G.cols + 0.95, 0.5, G.rows + 0.95), mat(slabColor), -0.24, -0.3, -0.24, false));
  const rad = Math.max(G.cols, G.rows) * 0.62;
  const base = mesh(new THREE.CylinderGeometry(rad, 1.2, 3.6, 7), mat(C.rock), -0.2, -2.35, -0.3, false);
  base.rotation.y = 0.3; base.scale.z = 0.8; room.add(base);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2, d = rad * 0.5 + r() * 1.2;
    const rock = mesh(new THREE.DodecahedronGeometry(0.5 + r() * 0.5, 0), mat(r() > 0.5 ? C.rock : C.rock2), Math.cos(a) * d - 0.2, -2.0 - r() * 1.2, Math.sin(a) * d * 0.7 - 0.3, false);
    rock.rotation.set(r() * 3, r() * 3, r() * 3); room.add(rock);
  }
  return tiles;
}
// a wall along one side of the grid. from/to are in tile units; gaps leave doorways.
function buildWall({ side = 'back', from = -0.5, to = null, courses = 7, gaps = [], color = null, seed = 3, at = null }) {
  const r = rng(seed + courses * 13);
  const course = 0.34;
  const horizontal = side === 'back' || side === 'front' || side === 'row';
  const len = horizontal ? G.cols : G.rows;
  to = to == null ? len - 0.5 : to;
  const fixed = at != null ? at : side === 'back' ? wz(0) - 0.76 : side === 'left' ? wx(0) - 0.76 : side === 'right' ? wx(G.cols - 1) + 0.76 : wz(G.rows - 1) + 0.76;
  const toWorld = p => horizontal ? wx(0) + p : wz(0) + p;
  for (let k = 0; k < courses; k++) {
    let p = from - (k % 2) * 0.35 - 0.26;
    while (p < to + 0.26) {
      const l = Math.min(0.55 + r() * 0.6, to + 0.26 - p);
      const mid = p + l / 2;
      const ruin = courses - 1 - Math.floor(Math.max(0, Math.sin(mid * 1.7 + seed) * 1.6 + r() * 1.2));
      const inGap = gaps.some(g => k < (g.courses ?? courses) && mid > g.from - 0.55 && mid < g.to + 0.55);
      if (l > 0.12 && k <= ruin && !inGap) {
        const col = new THREE.Color(color || (r() > 0.35 ? C.stone : C.stoneMid)).offsetHSL(0, 0, (r() - 0.5) * 0.05);
        const depth = 0.5 + (r() - 0.5) * 0.06;
        const wm = mat('#' + col.getHexString());
        room.add(horizontal
          ? mesh(new THREE.BoxGeometry(l - 0.04, course - 0.03, depth), wm, toWorld(mid), k * course + course / 2, fixed)
          : mesh(new THREE.BoxGeometry(depth, course - 0.03, l - 0.04), wm, fixed, k * course + course / 2, toWorld(mid)));
      }
      p += l;
    }
  }
  for (const g of gaps) if (g.lintel !== false && (g.courses ?? courses) < courses) {
    const w = g.to - g.from + 1.2, y = (g.courses ?? courses) * course + course / 2;
    room.add(horizontal
      ? mesh(new THREE.BoxGeometry(w, course, 0.56), mat(C.stoneDark), toWorld((g.from + g.to) / 2), y, fixed)
      : mesh(new THREE.BoxGeometry(0.56, course, w), mat(C.stoneDark), fixed, y, toWorld((g.from + g.to) / 2)));
  }
}

// ---------- scene objects
// def: { name, tiles, at:[c,r,dx,dz,ry], y, group, anchorY, near, range, actions(), answer, why, wrong, exit, push, npc, hidden }
function addObj(id, def) {
  const o = { id, ...def };
  if (o.group) {
    // thin things (a sword, a rope, the menorah) get an invisible box so they are easy to tap
    if (o.hit) { const [w, h, d] = o.hit; o.group.add(mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, h / 2, 0, false)); }
    if (o.at) { const [c, r, dx = 0, dz = 0, ry = 0] = o.at; o.group.position.set(wx(c) + dx, o.y || 0, wz(r) + dz); o.group.rotation.y = ry; }
    o.group.traverse(m => { if (m.isMesh) m.userData.oid = id; });
    room.add(o.group);
  }
  if (!o.anchor) {
    const p = o.group ? o.group.position : new THREE.Vector3(wx(o.tiles[0][0]), 0, wz(o.tiles[0][1]));
    o.anchor = new THREE.Vector3(p.x, (o.anchorY ?? 1.2), p.z);
  }
  if (!o.exit && o.solid !== false) for (const t of o.tiles || []) G.blocked.add(K(...t));
  if (o.answer) {
    o.label = el('div', 'tag unknown', '?'); $('#labels').append(o.label);
    if (o.group) { o.ring = mesh(new THREE.RingGeometry(0.34, 0.46, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#8a8597', transparent: true, opacity: 0, depthWrite: false }), o.group.position.x, 0.012 + (o.ringY || 0), o.group.position.z, false); room.add(o.ring); }
    const t = (P.tags[G.sc.id] || {})[id]; if (t) setTimeout(() => updateLabel(id), 0);
  }
  if (o.exit) {
    o.exitLabel = el('div', 'exitlab', ''); $('#labels').append(o.exitLabel);
    const arrow = mesh(new THREE.ConeGeometry(0.16, 0.34, 4), basic('#ffd67a', { transparent: true, opacity: 0.9 }), 0, 0.5, 0, false);
    arrow.rotation.x = Math.PI; o.arrow = arrow;
    const ring = mesh(new THREE.RingGeometry(0.26, 0.36, 4).rotateX(-Math.PI / 2), basic('#ffd67a', { transparent: true, opacity: 0.55 }), 0, 0.01, 0, false);
    const pad = mesh(new THREE.BoxGeometry(0.9, 0.7, 0.9), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), 0, 0.35, 0, false);   // a generous tap target
    const eg = group(arrow, ring, pad); const [c, r] = o.tiles[0]; eg.position.set(wx(c), 0, wz(r));
    eg.traverse(m => { if (m.isMesh) m.userData.oid = id; }); room.add(eg); o.exitGroup = eg;
    o.anchor = new THREE.Vector3(wx(c), 1.1, wz(r));
  }
  G.objs[id] = o;
  return o;
}
function removeObj(id) {
  const o = G.objs[id]; if (!o) return;
  if (o.group) room.remove(o.group);
  if (o.ring) room.remove(o.ring);
  o.label?.remove(); o.exitLabel?.remove();
  for (const t of o.tiles || []) G.blocked.delete(K(...t));
  delete G.objs[id];
  refresh();
}
function moveObjTiles(id, tiles) {
  const o = G.objs[id];
  for (const t of o.tiles || []) G.blocked.delete(K(...t));
  o.tiles = tiles; for (const t of tiles) G.blocked.add(K(...t));
}
const nm = id => tx(G.objs[id]?.name);

// ---------- tumah zones (hazards)
const hazGroup = new THREE.Group(); room.add(hazGroup);
function refresh() {
  G.haz = new Map();
  for (const h of (G.sc?.hazards?.(ST) || [])) for (const t of h.tiles) if (inGrid(...t)) G.haz.set(K(...t), h);
  hazGroup.clear();
  const geo = new THREE.BoxGeometry(0.94, 0.02, 0.94);
  for (const [k, h] of G.haz) {
    const [c, r] = k.split(',').map(Number);
    const m = mesh(geo, new THREE.MeshBasicMaterial({ color: h.kind === 'keep' ? '#e2b04a' : '#9b5cff', transparent: true, opacity: 0, depthWrite: false }), wx(c), 0.02, wz(r), false);
    m.userData.haz = true; hazGroup.add(m);
  }
  room.add(hazGroup);
  rebuildDots(); objective();
}
const dots = new THREE.Group();
function rebuildDots() {
  dots.clear();
  const g = new THREE.CircleGeometry(0.06, 4).rotateX(-Math.PI / 2);
  const m = new THREE.MeshBasicMaterial({ color: '#fff4dc', transparent: true, opacity: 0.32 });
  for (let c = 0; c < G.cols; c++) for (let r = 0; r < G.rows; r++) if (walkable(c, r)) dots.add(mesh(g, m, wx(c), 0.006, wz(r), false));
  room.add(dots);
}
let hazFlash = 0;

// ============================================================ Eli
const eli = { c: 0, r: 0, seg: null, path: [], onArrive: null, face: 0, faceTo: 0, model: buildEli() };
eli.model.traverse(m => { if (m.isMesh) m.userData.oid = 'eli'; });
function dressEli() {
  const u = eli.model.userData;
  u.spears.visible = has('spears');
  u.lamp.visible = has('lampLit');
  u.jug.visible = has('jug');
  eliLight.intensity = has('lampLit') && G.sc?.dark ? 6 : 0;
}
function placeEli(c, r, face = Math.PI / 2) {
  eli.c = c; eli.r = r; eli.seg = null; eli.path = []; eli.onArrive = null;
  eli.model.position.set(wx(c), 0, wz(r)); eli.face = eli.faceTo = face;
  room.add(eli.model);
}
function faceEliTo(v) { eli.faceTo = Math.atan2(v.x - eli.model.position.x, v.z - eli.model.position.z); }
const startOf = () => eli.seg ? eli.seg.to : [eli.c, eli.r];
function walkPath(path) {
  return new Promise(res => {
    if (eli.onArrive) eli.onArrive(false);
    eli.path = path.slice(1); eli.onArrive = res;
    if (!eli.seg && !eli.path.length) { eli.onArrive = null; res(true); }
  });
}
const dist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
// find the shortest walk to a tile within `range` of any target tile (orth: only straight neighbours)
function pathNear(targets, range = 1, orth = false) {
  const start = startOf();
  let best = null;
  for (let c = 0; c < G.cols; c++) for (let r = 0; r < G.rows; r++) {
    if (!walkable(c, r) && !(c === start[0] && r === start[1])) continue;
    const okT = targets.some(t => orth ? (Math.abs(t[0] - c) + Math.abs(t[1] - r) === 1) : dist(t, [c, r]) <= range);
    if (!okT) continue;
    const p = bfs(start, [c, r]);
    if (p && (!best || p.length < best.length)) best = p;
  }
  return best;
}
// when a walk is impossible, say which tumah is in the way (the first one on a path that ignores tumah)
async function explainBlocked(goalTiles) {
  const start = startOf();
  for (const g of goalTiles) {
    const p = bfs(start, g, (c, r) => inGrid(c, r) && (!occupied(c, r) || (c === g[0] && r === g[1])));
    if (!p) continue;
    const hit = p.find(t => G.haz.has(K(...t)));
    if (hit) { await refuse(G.haz.get(K(...hit)), hit); return; }
  }
  await speak('eli', U.cantGet);
}
async function refuse(h, tile) {
  hazFlash = 1.6; flashTile = tile;
  await speak('eli', h.why);
  if (h.lesson) await lesson(h.lesson);
}
let flashTile = null;
async function goTo(id) {
  const o = G.objs[id];
  if (!o) return false;
  if (o.exit) {
    const t = o.tiles[0];
    if (eli.c === t[0] && eli.r === t[1] && !eli.seg) return true;
    const p = bfs(startOf(), t);
    if (!p) { await busy(() => explainBlocked([t])); return false; }
    return walkPath(p);
  }
  const targets = o.near || o.tiles;
  if (!targets || !targets.length || o.free) { faceEliTo(o.anchor); return true; }
  const range = o.range || 1, start = startOf();
  const close = !eli.seg && targets.some(t => o.push ? Math.abs(t[0] - start[0]) + Math.abs(t[1] - start[1]) === 1 : dist(t, start) <= range);
  if (!close) {
    const p = pathNear(targets, range, !!o.push);
    if (!p) { await busy(() => explainBlocked(targets.flatMap(t => [[t[0] - 1, t[1]], [t[0] + 1, t[1]], [t[0], t[1] - 1], [t[0], t[1] + 1]]).filter(t => inGrid(...t) && !occupied(...t)))); return false; }
    const ok = await walkPath(p);
    if (!ok) return false;
  }
  faceEliTo(o.anchor);
  return true;
}

// ============================================================ UI: dialogue, menus, modals, toasts
const dlg = $('#dlg');
let keyboardUser = false;
addEventListener('keydown', e => { if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') keyboardUser = true; }, true);
addEventListener('pointerdown', () => { keyboardUser = false; }, true);
const focusIf = b => { if (b && keyboardUser) b.focus({ preventScroll: true }); };
let dlgNext = null, cur = null;
function setTalking(on) { document.body.classList.toggle('talking', on); }
function renderSpeak() {
  const { who, html, choices, duel, res } = cur;
  const pp = PEOPLE[who] || PEOPLE.narr;
  dlg.hidden = false; setTalking(true);
  dlg.classList.toggle('narr', who === 'narr');
  $('.portrait', dlg).innerHTML = pp.p;
  $('.who', dlg).textContent = tx(pp.name);
  $('.text', dlg).innerHTML = tx(html);
  const ch = $('.choices', dlg); ch.innerHTML = '';
  const d = $('.duel', dlg);
  d.hidden = !duel;
  if (duel) d.innerHTML = tx(U.duel) + ' ' + Array.from({ length: duel.of }, (_, i) => `<i class="${i < duel.won ? 'won' : ''}"></i>`).join('');
  const nextBtn = $('.next', dlg);
  if (choices) {
    nextBtn.hidden = true; dlgNext = null;
    choices.forEach((c, i) => {
      const isObj = c && !Array.isArray(c) && c.t;
      const b = el('button', 'choice', tx(isObj ? c.t : c)); b.type = 'button';
      if (isObj && c.ok) b.dataset.ok = '1';
      b.onclick = () => res(i); ch.append(b);
    });
    focusIf(ch.firstChild);
  } else {
    nextBtn.hidden = false; dlgNext = () => { dlgNext = null; res(-1); };
    focusIf(nextBtn);
  }
}
// `done` marks a line that has been answered, so a card opened over an unanswered line can bring it back
function speak(who, html, choices, duel) {
  return new Promise(res => { const c = { who, html, choices, duel }; c.res = v => { c.done = true; res(v); }; cur = c; renderSpeak(); });
}
$('.next', dlg).onclick = () => dlgNext && dlgNext();
$('.text', dlg).onclick = () => dlgNext && dlgNext();
function endTalk() { dlg.hidden = true; setTalking(false); }
async function lines(...ls) { for (const [who, t] of ls) await speak(who, t); }
// ask(): a choice whose options are {t, ok?, then?}. Returns the index.
async function ask(who, q, opts) { return speak(who, q, opts); }

const modal = $('#modal');
let curModal = null;
// build() returns the card's HTML; it runs again if the language changes while the card is open
function openModal(build, wire) {
  endTalk(); caption.classList.remove('on'); closeMenu();
  return new Promise(res => { curModal = { build, wire, res }; renderModal(); });
}
function renderModal() {
  const { build, wire, res } = curModal;
  modal.innerHTML = `<div class="card" role="dialog" aria-modal="true">${build()}</div>`;
  modal.hidden = false;
  const close = v => {
    modal.hidden = true; modal.innerHTML = ''; curModal = null; res(v);
    // the notebook or menu was opened in the middle of a conversation: put the line back
    if (cur && !cur.done && dlg.hidden) renderSpeak();
  };
  modal.querySelectorAll('[data-v]').forEach(b => b.onclick = () => close(b.dataset.v));
  modal.querySelectorAll('[data-lang]').forEach(b => b.onclick = toggleLang);
  if (wire) wire(modal, close);
  (modal.querySelector('.primary') || modal.querySelector('button'))?.focus({ preventScroll: true });
}
function card(eyebrow, title, body, buttons) {
  return `<div class="eyebrow">${tx(eyebrow)}</div><h2>${tx(title)}</h2>${body}<div class="actions">${buttons}</div>`;
}
const btn = (v, label, primary = false, ok = false) => `<button class="btn${primary ? ' primary' : ''}" type="button" data-v="${v}"${ok ? ' data-ok="1"' : ''}>${tx(label)}</button>`;

const toastEl = $('#toast'); let toastT;
function toast(html) { toastEl.innerHTML = tx(html); toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2800); }

function objective() {
  const t = G.screen !== 'game' || !G.started ? '' : tx(G.sc?.objective?.(ST) || '');
  $('#objective').textContent = t; $('#objective').hidden = !t;
}
function renderStatus() {
  const row = (k, v, cls = '') => `<div class="row"><span class="k">${tx(k)}</span><span class="v ${cls}">${v}</span></div>`;
  const items = P.inv.filter(k => k !== 'jug').map(k => tx(INV[k]));
  const jug = has('jug') ? `<div class="jug"><b>${tx(U.jugTitle)}</b>${row(U.sealed, fl('jugOpened') ? '—' : '✓', 'ok')}${row(U.kgSeal, '✓', 'ok')}${row(U.neverMoved, '✓', 'ok')}${row(U.nothingAdded, '✓', 'ok')}</div>` : '';
  const hands = 'washed' in P.flags ? row(U.hands, tx(fl('washed') ? U.washed : U.notWashed), fl('washed') ? 'ok' : '') : '';
  $('#status').innerHTML = row(U.eli, tx(U.tahor), 'ok') + hands + row(U.carrying, items.length ? items.join(', ') : tx(U.nothing)) + jug;
  $('#status').hidden = G.screen !== 'game';
}
function applyStatic() {
  const sc = G.sc;
  $('.place .eyebrow').textContent = sc && G.screen === 'game' ? `${tx(U.title)} · ${tx(actLabel(sc))}` : tx(U.title);
  $('.place h1').hidden = !(sc && G.screen === 'game');
  $('.place h1').innerHTML = sc ? tx(sc.title) : '';
  $('#btn-tumah').innerHTML = `<span class="dot"></span>${tx(U.tumahBtn)}`;
  $('#btn-notebook').textContent = tx(U.nbBtn);
  $('#btn-menu').textContent = tx(U.menuBtn);
  const lb = $('#btn-lang'); lb.textContent = tx(U.langBtn); lb.lang = isHe() ? 'en' : 'he';
  $('.next', dlg).textContent = tx(U.next);
  document.title = tx(U.title);
}

// ---------- the action menu
const menu = $('#menu');
let menuFor = null;
function closeMenu() { menu.hidden = true; menuFor = null; }
function placeMenu(o) {
  const p = screenPos(o.anchor);
  const w = menu.offsetWidth, h = menu.offsetHeight;
  menu.style.left = Math.max(12, Math.min(innerWidth - w - 12, p.x + 18)) + 'px';
  menu.style.top = Math.max(70, Math.min(innerHeight - h - 12, p.y - h / 2)) + 'px';
}
function showMenu(id, items) {
  const o = G.objs[id]; menuFor = id;
  menu.innerHTML = `<div class="title">${nm(id)}</div>`;
  for (const [key, label, fn, disabled] of items) {
    const b = el('button', '', tx(label)); b.type = 'button'; b.disabled = !!disabled; b.dataset.key = key;
    b.onclick = () => { closeMenu(); fn(); }; menu.append(b);
  }
  menu.hidden = false; placeMenu(o);
  focusIf(menu.querySelector('button:not([disabled])'));
}
function showTagPicker(id) {
  const o = G.objs[id]; menuFor = id;
  menu.innerHTML = `<div class="title">${tx(U.tagTitle)}: ${nm(id)}</div><div class="tags"></div>`;
  const box = $('.tags', menu);
  for (const k of Object.keys(LV)) {
    const b = el('button', k === 'untrusted' ? 'wide' : '', lvHTML(k)); b.type = 'button'; b.dataset.key = k;
    b.onclick = () => { closeMenu(); checkTag(id, k); }; box.append(b);
  }
  const back = el('button', '', tx(U.neverMind)); back.type = 'button'; back.dataset.key = 'cancel'; back.onclick = closeMenu; menu.append(back);
  menu.hidden = false; placeMenu(o);
  focusIf(box.querySelector('button'));
}

// ============================================================ shared actions
const busyN = { n: 0 };
const busy = async fn => { busyN.n++; closeMenu(); try { await fn(); } finally { busyN.n = Math.max(0, busyN.n - 1); if (!busyN.n) endTalk(); } };
// leaving a scene abandons whatever conversation was running in it
function dropConversation() { busyN.n = 0; cur = null; dlgNext = null; endTalk(); }
// menu items: [key, label, fn, disabled]
const A = {
  look: (text, then) => ['look', U.look, () => busy(async () => { await speak('eli', text); if (then) await then(); })],
  talk: fn => ['talk', U.talk, () => busy(fn)],
  tag: id => {
    const t = (P.tags[G.sc.id] || {})[id];
    return ['tag', t ? [`${U.tagged[0]}: ${LV[t].en} ✓`, `${U.tagged[1]}: ${LV[t].he} ✓`] : U.tagIt, () => showTagPicker(id), !!t];
  },
  act: (key, label, fn, disabled) => [key, label, () => busy(fn), disabled],
  say: (key, label, ...ls) => [key, label, () => busy(() => lines(...ls))],
};
async function lesson(key) {
  if (P.rules.includes(key)) return;
  const r = RULES[key];
  P.rules.push(key); save();
  await openModal(() => card(U.newRule, r.title, `<p>${tx(r.body)}</p><div class="sources">${tx(U.sources)} ${r.src.map(tx).join(' · ')}</div>`, btn('ok', U.gotIt, true)));
}
async function checkTag(id, t) {
  const o = G.objs[id];
  await busy(async () => {
    if (t === o.answer) {
      (P.tags[G.sc.id] ||= {})[id] = t; save();
      updateLabel(id, true);
      const r = RULES[o.why];
      if (!P.rules.includes(o.why)) P.rules.push(o.why);
      save();
      await openModal(() => card(['Ledger entry', 'רישום בפנקס'], [`${tx(r.title)}: <span class="lvl" style="--c:${LV[t].c}">${LV[t].en}</span>`, `${tx(r.title)}: <span class="lvl" style="--c:${LV[t].c}">${LV[t].he}</span>`],
        `<p>${tx(r.body)}</p><div class="sources">${tx(U.sources)} ${r.src.map(tx).join(' · ')}</div>`, btn('ok', ['Write it down', 'לרשום'], true)));
      toast([`<b>${U.ledger[0]}:</b> ${o.name[0]}, ${LV[t].en}`, `<b>${U.ledger[1]}:</b> ${o.name[1]}, ${LV[t].he}`]);
      objective();
      await G.sc.onTag?.(id, t);
    } else {
      const set = o.wrong || {};
      const [who, text] = set[t] || set._ || ['eli', ['Hm. That doesn’t sound right.', 'הממ. זה לא נשמע נכון.']];
      await speak(who, text);
    }
  });
}
const tagsDone = ids => ids.every(id => (P.tags[G.sc.id] || {})[id]);
// a pilpul duel: rounds of { say, opts: [{t, ok, back: [[who, text]...]}], rule }
async function duel(who, rounds) {
  let won = 0;
  for (const r of rounds) {
    while (true) {
      const i = await speak(who, r.say, r.opts.map(o => ({ t: o.t, ok: o.ok })), { won, of: rounds.length });
      const o = r.opts[i];
      if (o.ok) {
        won++;
        if (!P.comebacks.some(c => c[0] === r.rule[0])) P.comebacks.push(r.rule);
        save();
        await speak(who, r.win || [['Hmph.', 'הממף.'], ['Hmph!', 'הממף!'], ['...Hmph.', '...הממף.'], ['Fine.', 'נו, טוב.']][won - 1], null, { won, of: rounds.length });
        break;
      }
      await lines(...o.back);
    }
  }
}

// ============================================================ labels, bubbles, small animations
function screenPos(v) {
  const p = v.clone().project(camera);
  return { x: (p.x + 1) / 2 * stage.clientWidth, y: (1 - p.y) / 2 * stage.clientHeight, behind: p.z > 1 };
}
function updateLabel(id, flash) {
  const o = G.objs[id]; if (!o?.label) return;
  const t = (P.tags[G.sc.id] || {})[id];
  if (t) {
    o.label.className = 'tag'; o.label.style.setProperty('--c', LV[t].c);
    o.label.innerHTML = lvHTML(t);
    o.ring?.material.color.set(LV[t].c);
  }
  if (flash) { o.label.classList.add('flash'); setTimeout(() => o.label.classList.remove('flash'), 3000); }
}
function bubble(text, anchor) {
  const b = el('div', 'bubble', tx(text)); $('#labels').append(b);
  const p = screenPos(anchor); b.style.left = p.x + 'px'; b.style.top = p.y + 'px';
  setTimeout(() => b.remove(), 1700);
}
const anims = [];
function animate(ms, fn) { return new Promise(res => anims.push({ t: 0, ms: REDUCED ? 1 : ms, fn, res })); }
// move an object's group from where it is to (c, r) over ms
function slideTo(g, c, r, ms = 600, y = null) {
  const from = g.position.clone(), to = new THREE.Vector3(wx(c), y ?? from.y, wz(r));
  return animate(ms, k => g.position.lerpVectors(from, to, k));
}

// ============================================================ camera framing
function frame() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  const aspect = w / h; camera.aspect = aspect;
  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const portrait = aspect < 0.8;
  const needW = G.cols + (portrait ? 1.4 : 3.8), needH = G.rows + 3.2;
  const d = Math.max(needH / (2 * t), needW / (2 * t * aspect));
  const az = THREE.MathUtils.degToRad(32), el_ = THREE.MathUtils.degToRad(portrait ? 50 : 44);
  camTarget.set(0.1, portrait ? -0.9 : 0.1, portrait ? 0.3 : 0.1);
  scene.fog.near = d + 2; scene.fog.far = d + 26;
  camera.position.set(camTarget.x + d * Math.cos(el_) * Math.sin(az), camTarget.y + d * Math.sin(el_), camTarget.z + d * Math.cos(el_) * Math.cos(az));
  camera.lookAt(camTarget);
  camera.updateProjectionMatrix();
}
addEventListener('resize', frame);

// ============================================================ input
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const isShown = o => { while (o) { if (!o.visible) return false; o = o.parent; } return true; };
function pick(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  for (const h of ray.intersectObjects(room.children, true)) {
    if (!isShown(h.object) || h.object.userData.haz) continue;
    if (h.object.userData.oid && G.objs[h.object.userData.oid] || h.object.userData.oid === 'eli') return { oid: h.object.userData.oid };
    if (h.object.userData.tile) return { tile: h.object.userData.tile };
  }
  return null;
}
const caption = $('#caption');
const canAct = () => G.screen === 'game' && G.started && !G.loading && !busyN.n && modal.hidden;
renderer.domElement.addEventListener('pointermove', ev => {
  if (ev.pointerType !== 'mouse') return;
  const h = canAct() ? pick(ev) : null;
  const name = h?.oid ? (h.oid === 'eli' ? tx(U.eli) : nm(h.oid)) : null;
  caption.textContent = name || ''; caption.classList.toggle('on', !!name);
  stage.classList.toggle('pointing', !!h);
});
async function clickObj(id) {
  closeMenu();
  if (id === 'eli') { showMenu('eli', eliActions()); return; }
  const o = G.objs[id];
  if (!o) return;
  if (!(await goTo(id))) return;
  if (busyN.n || !G.objs[id]) return;
  if (o.exit) { await tryExit(id); return; }
  const items = o.actions ? o.actions() : [A.look(o.look || o.name)];
  if (o.push) items.splice(1, 0, ['push', U.push, () => busy(() => pushObj(id))]);
  if (o.answer && !items.some(i => i[0] === 'tag')) items.push(A.tag(id));
  showMenu(id, items);
}
async function tryExit(id) {
  const o = G.objs[id];
  const res = o.exit.can ? o.exit.can() : true;
  if (res !== true) { await busy(() => lines(...(Array.isArray(res[0]) ? res : [res]))); return; }
  await busy(async () => { if (o.exit.before) await o.exit.before(); });
  await complete(o.exit.to, o.exit.from);
}
renderer.domElement.addEventListener('click', async ev => {
  if (!canAct()) return;
  const h = pick(ev);
  if (!h) { closeMenu(); return; }
  if (h.oid) { await clickObj(h.oid); return; }
  closeMenu();
  const [c, r] = h.tile;
  if (G.haz.has(K(c, r))) { await busy(() => refuse(G.haz.get(K(c, r)), [c, r])); return; }
  if (!walkable(c, r)) return;
  const p = bfs(startOf(), [c, r]);
  if (!p) { await busy(() => explainBlocked([[c, r]])); return; }
  marker.position.set(wx(c), 0.01, wz(r)); marker.material.opacity = 0.9;
  const arrived = await walkPath(p);
  if (arrived) { const ex = Object.values(G.objs).find(o => o.exit && o.tiles[0][0] === c && o.tiles[0][1] === r); if (ex) await tryExit(ex.id); }
});
addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { if (!menu.hidden) closeMenu(); }
});
const marker = mesh(new THREE.RingGeometry(0.2, 0.27, 4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffe3a1', transparent: true, opacity: 0 }), 0, 0.01, 0, false);

function eliActions() {
  const items = [['look', ['Look at Eli', 'הסתכל על אלי'], () => busy(() => lines(['eli', G.sc.eliLook || ['Eli. Kohen. Tahor. Trying to stay that way.', 'אלי. כהן. טהור. משתדל להישאר ככה.']]))]];
  if (G.sc.eliUp) items.push(['up', ['Look up', 'הסתכל למעלה'], () => busy(() => lines(...G.sc.eliUp))]);
  return items;
}

// ---------- pushing crates
async function pushObj(id) {
  const o = G.objs[id];
  const [oc, or] = o.tiles[0];
  const dc = oc - eli.c, dr = or - eli.r;
  if (Math.abs(dc) + Math.abs(dr) !== 1) { await speak('eli', U.pushFrom); return; }
  const to = [oc + dc, or + dr];
  const why = G.sc.canPush?.(id, to);
  if (why) { await lines(...why); return; }
  if (!inGrid(...to) || occupied(...to)) { await speak('eli', U.cantPush); return; }
  moveObjTiles(id, [to]);
  faceEliTo(o.group.position);
  await slideTo(o.group, to[0], to[1], 450);
  o.anchor.set(wx(to[0]), o.anchor.y, wz(to[1]));
  if (o.ring) o.ring.position.set(wx(to[0]), o.ring.position.y, wz(to[1]));
  refresh();
  if (walkable(oc, or)) await walkPath([[eli.c, eli.r], [oc, or]]);
  await G.sc.onPush?.(id, to);
}

// ============================================================ live mice
const mice = [];
function addMouse(c, r) {
  const g = K3.mouse(); g.traverse(m => { if (m.isMesh) m.userData.oid = 'mouse'; });
  g.position.set(wx(c), 0, wz(r)); room.add(g);
  const m = { g, from: [c, r], to: [c, r], t: 1, wait: 1, goal: null };
  mice.push(m);
  addObj('mouse', { name: ['Mouse (alive)', 'עכבר (חי)'], group: null, tiles: [], free: true, anchor: g.position, actions: () => [A.look(['MOUSE! ...It’s alive. Phew. A live mouse doesn’t make anything tamei; only a dead one does.', 'עכבר! ...הוא חי. פיו. עכבר חי לא מטמא כלום; רק עכבר מת מטמא.'], () => lesson('liveMouse'))] });
  return m;
}
function stepMouse(m, dt, t) {
  if (m.t < 1) {
    m.t = Math.min(1, m.t + dt * 2.6);
    m.g.position.set(THREE.MathUtils.lerp(wx(m.from[0]), wx(m.to[0]), m.t), 0, THREE.MathUtils.lerp(wz(m.from[1]), wz(m.to[1]), m.t));
    m.g.rotation.y = Math.atan2(wx(m.to[0]) - wx(m.from[0]), wz(m.to[1]) - wz(m.from[1]));
    return;
  }
  m.wait -= dt; if (m.wait > 0) return;
  const here = m.to;
  const ns = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [here[0] + a, here[1] + b]);
  let next;
  if (m.goal) {
    if (here[0] === m.goal[0] && here[1] === m.goal[1]) { m.wait = 0.4; m.g.rotation.y += Math.sin(t * 20) * 0.3; return; }
    const opts = ns.filter(([c, r]) => inGrid(c, r) && (walkable(c, r) || (c === m.goal[0] && r === m.goal[1])) && !(c === eli.c && r === eli.r));
    opts.sort((a, b) => (Math.abs(a[0] - m.goal[0]) + Math.abs(a[1] - m.goal[1])) - (Math.abs(b[0] - m.goal[0]) + Math.abs(b[1] - m.goal[1])));
    next = opts[0]; m.wait = 0.05;
  } else {
    const opts = ns.filter(([c, r]) => walkable(c, r) && !(c === eli.c && r === eli.r));
    next = opts[Math.floor(Math.random() * opts.length)]; m.wait = 0.6 + Math.random() * 2.2;
  }
  if (next) { m.from = here; m.to = next; m.t = 0; }
}

// ============================================================ scenes: loading, finishing, the title screen
const fade = $('#fade');
const actLabel = sc => sc.act === 4 ? U.finale : [`${U.act[0]} ${['', 'I', 'II', 'III'][sc.act]}`, `${U.act[1]} ${['', 'א׳', 'ב׳', 'ג׳'][sc.act]}`];
async function loadScene(id, opts = {}) {
  const sc = sceneById(id);
  G.loading = true; G.started = false; closeMenu(); dropConversation();
  fade.classList.add('on'); await wait(REDUCED ? 0 : 380);
  for (const o of Object.values(G.objs)) { o.label?.remove(); o.exitLabel?.remove(); }
  room.clear(); mice.length = 0; anims.length = 0;
  G.sc = sc; G.cols = sc.cols; G.rows = sc.rows; G.blocked = new Set(); G.haz = new Map(); G.objs = {}; ST = { from: opts.from };
  sc.pre?.();
  const L = LIGHTS[sc.light || 'dusk'];
  stage.style.setProperty('--sky-top', L[0]); stage.style.setProperty('--sky-bottom', L[1]);
  scene.fog.color.set(L[2]); hemi.color.set(L[3]); hemi.groundColor.set(L[4]); hemi.intensity = L[5];
  sun.color.set(L[6]); sun.intensity = L[7]; sun.userData.base = L[7]; hemi.userData.base = L[3]; renderer.toneMappingExposure = L[8];
  sun.position.set(6.5, 11, 6);
  buildGround(sc.theme || 'stone');
  for (const w of sc.walls || []) buildWall(w);
  sc.build();
  const [c, r, face] = typeof sc.start === 'function' ? sc.start(ST) : sc.start;
  placeEli(c, r, face ?? Math.PI / 2);
  room.add(marker, dots, hazGroup);
  dressEli();
  frame(); refresh(); applyStatic(); renderStatus();
  if (!opts.backdrop) { P.scene = id; save(); }
  await wait(60);
  fade.classList.remove('on');
  if (opts.backdrop) { G.loading = false; return; }
  G.screen = 'game'; renderStatus(); applyStatic();
  if (!opts.quiet) await openModal(() => `<div class="scenecard"><div class="eyebrow">${tx(actLabel(sc))} · ${tx(U.scene)} ${SCENES.indexOf(sc) + 1}</div><h2>${tx(sc.title)}</h2><p class="lede">${tx(sc.blurb)}</p><div class="actions">${btn('go', U.begin, true)}</div></div>`);
  G.loading = false; G.started = true;
  objective();
  if (sc.intro && !(sc.introOnce && fl('seen:' + id))) { flag('seen:' + id); await busy(sc.intro); }
  objective();
}
async function complete(next, from) {
  if (!P.done.includes(G.sc.id)) P.done.push(G.sc.id);
  save();
  if (next === 'END') { await theEnd(); return; }
  await loadScene(next, { from: from || G.sc.id, quiet: sceneById(next)?.hub && P.done.includes(next) });
}
async function theEnd() {
  G.started = false;
  const v = await openModal(() => `<div class="splash"><div class="eyebrow">${tx(['The end', 'סוף'])}</div><h2>${tx(['Eight nights', 'שמונה לילות'])}</h2>
    <p class="lede">${tx(['One small jug, enough for one night. It burned for eight, until new pure oil could be pressed and brought.', 'כד קטן אחד, מספיק ללילה אחד. הוא דלק שמונה לילות, עד שאפשר היה לכתוש זיתים ולהביא שמן טהור חדש.'])}</p>
    <p>${tx(['The next year the Sages made these days a holiday, with Hallel and thanks.', 'לשנה אחרת קבעום ועשאום ימים טובים בהלל והודאה.'])} ${tx(SRC.shabbat21b)}</p>
    <div class="actions">${btn('nb', ['Open the notebook', 'פתח את המחברת'])}${btn('title', U.toTitle, true, true)}</div></div>`);
  if (v === 'nb') await notebook();
  // leave the busy action that finished the game before showing the title screen
  setTimeout(() => titleScreen(), 50);
}

async function titleScreen() {
  G.screen = 'title'; G.started = false; dropConversation(); renderStatus(); objective();
  if (!G.sc) await loadScene('camp', { backdrop: true });
  applyStatic();
  while (true) {
    const canContinue = P.scene && P.scene !== 'camp' || P.done.length;
    const v = await openModal(() => `<div class="splash title"><div class="eyebrow">${tx(['A Chanukah adventure about tumah and taharah', 'הרפתקת חנוכה על טומאה וטהרה'])}</div><h2>${tx(U.title)}</h2>
      <p class="lede">${tx(['The battle is over. The Mikdash is a mess. Somewhere in it there may be one jug of oil nobody has touched. Eli, a young Kohen, has to find it and carry it to the menorah without anyone, or anything, getting in the way.', 'הקרב נגמר. המקדש הפוך. אולי יש בו איפשהו כד שמן אחד שאף אחד לא נגע בו. אלי, כהן צעיר, צריך למצוא אותו ולהביא אותו למנורה, בלי שאף אחד, ושום דבר, יפריעו בדרך.'])}</p>
      <p class="note">${tx(['Ages 12 and up. About an hour. Sources are linked throughout; the halacha still needs a rav’s review.', 'מגיל 12. בערך שעה. המקורות מקושרים לאורך כל הדרך; ההלכה עדיין צריכה בדיקה של רב.'])}</p>
      <div class="actions"><button class="btn" type="button" data-lang lang="${isHe() ? 'en' : 'he'}">${tx(U.langBtn)}</button>${canContinue ? btn('chapters', U.chapters) : ''}${canContinue ? btn('continue', U.cont) : ''}${btn('new', U.newGame, !canContinue, true)}</div></div>`);
    if (v === 'new') { newGame(); await loadScene('camp'); return; }
    if (v === 'continue') { await loadScene(P.scene || 'camp'); return; }
    if (v === 'chapters') { const id = await chapters(); if (id) { await jumpTo(id); return; } }
  }
}
function newGame() { const lang = LANG; P = freshProgress(); save(); LANG = lang; }
async function chapters() {
  const open = id => P.done.includes(id) || P.scene === id;
  const v = await openModal(() => `<div class="eyebrow">${tx(U.chapters)}</div><h2>${tx(U.title)}</h2><ol class="chapters">${SCENES.map((s, i) => `<li><button type="button" class="chap" data-v="${s.id}" ${open(s.id) ? '' : 'disabled'}><span>${i + 1}</span>${tx(s.title)}${P.done.includes(s.id) ? ' ✓' : ''}</button></li>`).join('')}</ol><div class="actions">${btn('back', U.back, true)}</div>`);
  return v === 'back' ? null : v;
}
// jump to a scene from the chapter list, giving Eli what he would have picked up on the way
async function jumpTo(id) {
  const i = SCENES.findIndex(s => s.id === id);
  for (const s of SCENES.slice(0, i)) s.carry?.();
  save();
  await loadScene(id);
}

async function notebook() {
  closeMenu();
  await openModal(() => {
    const rules = P.rules.length ? P.rules.filter(k => RULES[k]).map(k => `<div class="rule"><b>${tx(RULES[k].title)}</b><p>${tx(RULES[k].body)}</p><div class="src">${RULES[k].src.map(tx).join(' · ')}</div></div>`).join('')
      : `<p class="empty">${tx(['Nothing yet. Every rule Eli works out goes here, with its sources.', 'עדיין כלום. כל כלל שאלי מגלה נכנס לכאן, עם המקורות שלו.'])}</p>`;
    const cb = P.comebacks.length ? `<ul>${P.comebacks.map(c => `<li>${tx(c)}</li>`).join('')}</ul>` : `<p class="empty">${tx(['Win an argument to collect comebacks.', 'נצחו בוויכוח כדי לאסוף תשובות ניצחות.'])}</p>`;
    const about = [
      ['The 3D art is built in code from simple shapes: no textures, no downloaded models.', 'האמנות התלת־ממדית בנויה בקוד מצורות פשוטות: בלי טקסטורות ובלי מודלים מוכנים.'],
      ['Eli, Avner, Philo, Yoezer, Shimi, the quartermaster, the nazir and the wood inspector are invented. Yochanan of the seals, Gevini the herald and Ben Katin’s kiyor machine are real, from a later generation of the Second Temple; we borrowed them on purpose.', 'אלי, אבנר, פילון, יועזר, שמעי, האפסנאי, הנזיר ובודק העצים בדויים. יוחנן שעל החותמות, גביני הכרוז והמוכני של בן קטין אמיתיים, מדור מאוחר יותר של בית שני; שאלנו אותם בכוונה.'],
      ['The game treats oil set aside for the menorah as kodesh. That is a working assumption awaiting a rav’s review, as is all the halacha here.', 'המשחק מתייחס לשמן שהופרש למנורה כקודש. זו הנחת עבודה שממתינה לבדיקה של רב, כמו כל ההלכה כאן.'],
    ];
    return `<div class="nb"><div class="eyebrow">${tx(["Eli's notebook", 'המחברת של אלי'])}</div><h2>${tx(['Sefer Taharah', 'ספר טהרה'])}</h2>
    <h3>${tx(['The ladder', 'הסולם'])}</h3><p>${tx(["Whatever touches an Av becomes a Rishon; whatever touches a Rishon becomes a Sheni, and so on. Only an Av makes a person or a vessel tamei. Chullin stops at Sheni, terumah at Shlishi, kodesh at Revi'i. Liquids always jump back to Rishon.", 'מה שנוגע באב הטומאה נעשה ראשון; מה שנוגע בראשון נעשה שני, וכן הלאה. רק אב הטומאה מטמא אדם וכלים. חולין נעצרים בשני, תרומה בשלישי, קודש ברביעי. משקים תמיד קופצים חזרה לראשון.'])}</p>
    <h3>${tx(["Rules you've worked out", 'כללים שגיליתם'])} (${P.rules.filter(k => RULES[k]).length})</h3>${rules}
    <h3>${tx(['Comebacks', 'תשובות ניצחות'])}</h3>${cb}
    <h3>${tx(['About this game', 'על המשחק'])}</h3><ul>${about.map(a => `<li>${tx(a)}</li>`).join('')}</ul></div>
    <div class="actions">${btn('ok', U.close, true)}</div>`;
  });
}
async function gameMenu() {
  if (!modal.hidden || G.loading) return;
  const v = await openModal(() => card(U.menuBtn, U.title, '', `${btn('title', U.toTitle)}${btn('restart', ['Restart this scene', 'התחל את הסצנה מחדש'])}${btn('ok', U.close, true)}`));
  if (v === 'title') await titleScreen();
  if (v === 'restart') { await loadScene(G.sc.id, { from: ST.from, quiet: true }); }
}

// ============================================================ switching language
function setLang(l) {
  LANG = l;
  try { localStorage.setItem('tehara.oil.lang', l); } catch (e) { /* storage blocked */ }
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
  applyStatic(); objective(); renderStatus();
  for (const id of Object.keys(G.objs)) updateLabel(id);
  closeMenu(); caption.classList.remove('on');
  if (cur && !dlg.hidden) renderSpeak();
  if (curModal) renderModal();
}
function toggleLang() { setLang(isHe() ? 'en' : 'he'); }

$('#btn-tumah').onclick = () => {
  const on = !document.body.classList.contains('tumah');
  $('#btn-tumah').setAttribute('aria-pressed', String(on));
  document.body.classList.toggle('tumah', on);
};
$('#btn-notebook').onclick = () => { if (modal.hidden) notebook(); };
$('#btn-lang').onclick = toggleLang;
$('#btn-menu').onclick = gameMenu;

// ============================================================ the loop
const clock = new THREE.Clock();
const skyTint = new THREE.Color();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  const tumah = document.body.classList.contains('tumah');
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
  eliLight.position.set(m.position.x, 1.3, m.position.z + 0.2);
  // people turn toward Eli and breathe
  for (const o of Object.values(G.objs)) {
    if (!o.npc || !o.group) continue;
    if (o.faceEli !== false) {
      const want = Math.atan2(m.position.x - o.group.position.x, m.position.z - o.group.position.z);
      let dl = want - o.group.rotation.y; dl = Math.atan2(Math.sin(dl), Math.cos(dl)); o.group.rotation.y += dl * Math.min(1, dt * 2.5);
    }
    if (o.group.userData.body && !REDUCED) o.group.userData.body.rotation.z = Math.sin(t * 1.3 + o.id.length) * 0.015;
  }
  for (const mm of mice) stepMouse(mm, dt, t);
  room.traverse(o => { if (o.userData.flicker) o.scale.y = (o.userData.flickerBase || 1) * (1 + Math.sin(t * 17 + o.id) * 0.12 + Math.sin(t * 7.3) * 0.08); });
  marker.material.opacity *= 0.96;
  // tumah view
  const sb = sun.userData.base ?? 3.1;
  sun.intensity += ((tumah ? sb * 0.45 : sb) - sun.intensity) * Math.min(1, dt * 4);
  skyTint.set(tumah ? '#a58cf0' : (hemi.userData.base || '#a4b6e6'));
  hemi.color.lerp(skyTint, Math.min(1, dt * 4));
  hazFlash = Math.max(0, hazFlash - dt);
  for (const h of hazGroup.children) {
    const target = tumah ? 0.38 : (hazFlash > 0 ? 0.3 * Math.min(1, hazFlash) : 0);
    h.material.opacity += (target - h.material.opacity) * Math.min(1, dt * 6);
  }
  for (const o of Object.values(G.objs)) {
    if (o.ring) {
      const tg = (P.tags[G.sc.id] || {})[o.id];
      const target = tumah ? (tg ? (tg === 'tahor' ? 0.75 : tg === 'untrusted' ? 0.45 : 0.85) : 0.25) : 0;
      o.ring.material.opacity += (target - o.ring.material.opacity) * Math.min(1, dt * 5);
      o.ring.scale.setScalar(tg === 'av' || tg === 'rishon' ? 1 + Math.sin(t * 4) * 0.08 : 1);
    }
    if (o.label) {
      if (o.hiddenLabel && !o.hiddenLabel()) { o.label.classList.add('offscreen'); continue; }
      const p = screenPos(o.anchor);
      o.label.classList.toggle('offscreen', p.behind);
      o.label.style.left = p.x + 'px'; o.label.style.top = p.y + 'px';
    }
    if (o.exitLabel) {
      const p = screenPos(o.anchor);
      o.exitLabel.textContent = (isHe() ? '◂ ' : '▸ ') + tx(o.exit.label);
      o.exitLabel.style.left = p.x + 'px'; o.exitLabel.style.top = p.y + 'px';
      o.exitLabel.classList.toggle('offscreen', p.behind || G.screen !== 'game');
      if (o.arrow) o.arrow.position.y = 0.55 + Math.sin(t * 3) * 0.08;
    }
  }
  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i]; a.t += dt * 1000; const kk = Math.min(1, a.t / a.ms);
    a.fn(kk < 0.5 ? 2 * kk * kk : 1 - Math.pow(-2 * kk + 2, 2) / 2);
    if (kk >= 1) { anims.splice(i, 1); a.res(); }
  }
  if (menuFor && !menu.hidden && G.objs[menuFor] && innerWidth > 640) placeMenu(G.objs[menuFor]);
  G.sc?.tick?.(dt, t);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

// ============================================================ close-up art
function sealArt(kind) {
  if (kind === 'kg') return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#9c2f28"/><circle cx="60" cy="60" r="46" fill="none" stroke="#c9574c" stroke-width="2"/><path d="M60 38 l-6 -10 l6 5 l6 -5 Z" fill="#e7a196"/><circle cx="60" cy="56" r="16" fill="#c9574c"/><path d="M60 40 v32" stroke="#9c2f28" stroke-width="2"/><text x="60" y="94" text-anchor="middle" font-family="Frank Ruhl Libre, serif" font-size="15" fill="#f1c7bf">לכהן גדול</text></svg>`;
  if (kind === 'calf') return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#8c6a3c"/><circle cx="60" cy="60" r="46" fill="none" stroke="#b48e58" stroke-width="2"/><text x="60" y="72" text-anchor="middle" font-family="Frank Ruhl Libre, serif" font-size="34" fill="#f0dcb4">עגל</text></svg>`;
  return `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#3d6fa3"/><circle cx="60" cy="60" r="46" fill="none" stroke="#8796a8" stroke-width="2"/><ellipse cx="60" cy="64" rx="18" ry="24" fill="#8796a8"/><circle cx="52" cy="54" r="6" fill="#e9eef4"/><circle cx="68" cy="54" r="6" fill="#e9eef4"/><circle cx="52" cy="54" r="2.5" fill="#2a2f38"/><circle cx="68" cy="54" r="2.5" fill="#2a2f38"/><path d="M57 62 l3 5 l3 -5Z" fill="#e2b04a"/><path d="M44 42 l6 8 M76 42 l-6 8" stroke="#8796a8" stroke-width="4"/></svg>`;
}
const svgFont = () => isHe() ? 'Frank Ruhl Libre, David, serif' : 'Alegreya, serif';
const ART = {
  jugInside: () => `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#191421"/><ellipse cx="160" cy="104" rx="132" ry="88" fill="#8b4428"/><ellipse cx="160" cy="100" rx="114" ry="74" fill="#5a2a18"/><ellipse cx="160" cy="112" rx="98" ry="58" fill="#b8880f"/><ellipse cx="128" cy="98" rx="44" ry="9" fill="#efcb62" opacity=".5"/><g transform="translate(170 118) rotate(-8)"><path d="M-46 4 q-30 -2 -40 -20" stroke="#c99f9a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="34" ry="19" fill="#9a958f"/><ellipse cx="2" cy="4" rx="24" ry="11" fill="#d8d2c9"/><circle cx="36" cy="-4" r="14" fill="#9a958f"/><circle cx="34" cy="-18" r="8" fill="#d9a7a2"/><circle cx="46" cy="-13" r="7" fill="#d9a7a2"/><path d="M36 -6 l6 6 M42 -6 l-6 6" stroke="#2a1d14" stroke-width="2.2"/><path d="M-16 -16 v-14 M-4 -18 v-14 M12 -18 v-14 M22 -16 v-12" stroke="#c99f9a" stroke-width="3" stroke-linecap="round"/></g><text x="160" y="190" text-anchor="middle" font-family="${svgFont()}" font-style="${isHe() ? 'normal' : 'italic'}" font-size="14" fill="#c9bfae">${tx(['Looking in. Not touching. Definitely not touching.', 'מציץ. לא נוגע. בטוח לא נוגע.'])}</text></svg>`,
  sealC: () => `<svg viewBox="0 0 320 170"><rect width="320" height="170" fill="#191421"/><g transform="translate(82 82)"><circle r="62" fill="#8b4428"/><circle r="50" fill="#a65a36"/><circle r="26" fill="#9c2f28"/><path d="M0 -14 v28 M-10 -6 q10 -10 20 0 M-10 4 q10 -10 20 0" stroke="#d26a5e" stroke-width="3" fill="none"/><text y="80" text-anchor="middle" font-family="${svgFont()}" font-size="12" fill="#c9bfae">${tx(['The seal: perfect', 'החותם: שלם'])}</text></g><g transform="translate(232 82)"><rect x="-70" y="-62" width="140" height="124" rx="8" fill="#c9a677"/><g fill="#b39066" opacity=".9"><circle cx="-40" cy="-30" r="3"/><circle cx="30" cy="-40" r="2"/><circle cx="44" cy="20" r="3"/><circle cx="-50" cy="34" r="2"/><circle cx="10" cy="44" r="2.5"/></g><circle r="34" fill="none" stroke="#efe0bf" stroke-width="10"/><path d="M-10 34 v40 M10 34 v40" stroke="#efe0bf" stroke-width="4" opacity=".8"/><text y="80" text-anchor="middle" font-family="${svgFont()}" font-size="12" fill="#c9bfae">${tx(['The floor next to it', 'הרצפה לידו'])}</text></g></svg>`,
};

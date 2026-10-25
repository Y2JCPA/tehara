/* 1-6 · The Leaf-Blower Field ⭐
   Room 1: three pins, one right order, for a soft landing.
   Room 2: blow on the ground before each step (Berakhot 19b; Rambam Eruvin 6:17;
   Korban Pesach 6:8). Some white things are harmless twigs, some are bones.
   Air is tight: blow only where you mean to walk. */
/* A sloping ground for the map-style rooms (1-6 to 1-10).
   The logic of these rooms is laid out as if seen from above. In 3D the ground
   is a real slope rising away from the camera, and each logical point goes
   where the camera's ray through it meets the slope, so taps and labels still
   line up exactly. Things are scaled by their distance so they keep their
   logical size. (The camera numbers match CAM_D / CAM_RISE in js3d/r3.js.) */
W1.ground = (K, { front = 960, tilt = 0.85 } = {}) => {
  const T3 = K.THREE, U = K.U;
  const E = new T3.Vector3(270 / U, -480 / U + 7.5, 34);
  const n = new T3.Vector3(0, Math.sin(tilt), Math.cos(tilt)), k0 = n.dot(K.P(0, front, 0)) - n.dot(E);
  const flatQ = new T3.Quaternion().setFromAxisAngle(new T3.Vector3(1, 0, 0), -tilt);
  const tOf = (x, y) => k0 / n.dot(K.P(x, y, 0).sub(E));
  const at = (x, y, lift = 0) => { const t = tOf(x, y); return E.clone().add(K.P(x, y, 0).sub(E).multiplyScalar(t)).addScaledVector(n, lift); };
  const G3 = {
    tOf, at, n, flatQ,
    // lay an object flat on the slope (its local x/y on the ground); rot is clockwise on screen
    lay(o, x, y, { lift = 0, rot = 0, s = 1 } = {}) { o.position.copy(at(x, y, lift)); o.quaternion.copy(flatQ); if (rot) o.rotateZ(-rot); o.scale.setScalar(s * tOf(x, y)); return o; },
    // stand an upright object (a tree, a wall, a sign) on the slope at its foot point
    // (keeps the object's own scale, so call it once per object)
    stand(o, x, y, { lift = 0, s = 1 } = {}) { o.position.copy(at(x, y, lift)); o.scale.multiplyScalar(s * tOf(x, y)); return o; },
    // a slab lying on the slope that covers the logical rectangle exactly (top surface at the ground + lift)
    sheet(x, y, w, h, mat, { thick = 0.14, bevel = 0.03, lift = 0, cast = false } = {}) {
      const o = at(x + w / 2, y + h), dY = new T3.Vector3(0, Math.cos(tilt), -Math.sin(tilt));
      const loc = (px, py) => { const v = at(px, py).sub(o); return new T3.Vector2(v.x, v.dot(dY)); };
      const sh = new T3.Shape([loc(x, y + h), loc(x + w, y + h), loc(x + w, y), loc(x, y)]);
      const geo = new T3.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 1 });
      const pos = geo.attributes.position, nrm = geo.attributes.normal, uv = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) { const nz = Math.abs(nrm.getZ(i)); uv.setXY(i, nz > 0.7 ? pos.getX(i) / 2.5 : pos.getX(i) / 2.5 + pos.getZ(i), nz > 0.7 ? pos.getY(i) / 2.5 : pos.getY(i) / 2.5); }
      const m = K.mesh(geo, mat, 0, 0, -thick, cast, true);
      const g = new T3.Group(); g.add(m); g.position.copy(o).addScaledVector(n, lift); g.quaternion.copy(flatQ);
      K.scene.add(g); return g;
    },
    // a flat ring (a lime mark) on the ground: centre, radii in px, line width in px
    ring(x, y, rx, ry, mat, { width = 9, lift = 0.03 } = {}) {
      const tor = K.mesh(new T3.TorusGeometry(1, width / 2 / Math.max(rx, ry), 6, 48), mat, 0, 0, 0, false, true);
      tor.scale.set(rx / U, ry / U, 0.5);
      const g = new T3.Group(); g.add(tor); K.scene.add(g);
      g.userData.place = (rx2, ry2) => tor.scale.set(rx2 / U, ry2 / U, 0.5);
      return G3.lay(g, x, y, { lift });
    },
    // an upright block (a low wall, a headstone) standing on the slope: w, h in px, d in units
    upright(x, y, w, h, mat, { d = 0.4, r = 0.03, lift = 0 } = {}) {
      const m = K.mesh(K.slab(w / U, h / U, d, r, 0.02), mat, -w / U / 2, 0, -d / 2);
      const g = new T3.Group(); g.add(m); K.scene.add(g); return G3.stand(g, x, y, { lift });
    },
    // a round rod between two logical points, lifted above the ground (a branch, a pole)
    rod(x1, y1, x2, y2, { r = 0.07, lift = 0.5, mat } = {}) {
      const a = at(x1, y1, lift), b = at(x2, y2, lift), L = a.distanceTo(b);
      const m = K.mesh(new T3.CylinderGeometry(r * 0.7, r, L, 9), mat || K.MAT.trunk);
      m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      K.scene.add(m); return m;
    },
    // a flat ribbon (a path) along logical points, width in px
    ribbon(pts, width, mat, { lift = 0.05 } = {}) {
      const pos = [], uv = [], idx = [];
      pts.forEach((p, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
        for (const sd of [-1, 1]) { const v = at(p[0] - dy * sd * width / 2, p[1] + dx * sd * width / 2, lift); pos.push(v.x, v.y, v.z); uv.push((p[0] + sd * width / 2) / U / 2.5, p[1] / U / 2.5); }
        if (i) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
      });
      const geo = new T3.BufferGeometry();
      geo.setAttribute('position', new T3.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T3.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx); geo.computeVertexNormals();
      const m = K.mesh(geo, mat, 0, 0, 0, false, true); K.scene.add(m); return m;
    },
    // keep the actors standing on the slope (call from sync)
    follow(ctx, actors) {
      for (const a of actors) { const c = ctx.actors.get(a); if (c) { c.group.position.copy(at(a.x, a.y, 0.02)); c.group.scale.multiplyScalar(tOf(a.x, a.y)); } }
    },
  };
  return G3;
};

W1.cartDrop = api => {
  const tw = new Kit.Tweens();
  const pCart = new Kit.Pin('cart', 104, 400, 312, 400);
  const pCrate = new Kit.Pin('crate', 300, 560, 300, 660);
  const pHay = new Kit.Pin('hay', 480, 470, 480, 560);
  const cart = { y: 380, a: 0 }, hay = { x: 430, y: 560, lost: false }, crate = { x: 320, y: 640, gone: false };
  const eli = new Chars.Actor('eli', 470, 800, { dir: -1 }), gad = new Chars.Actor('gad', 70, 800);
  let cushion = false, done = false;
  return {
    intro: { en: 'Gad\'s leaf blower is up in his cart. Make a soft landing before it drops!', he: 'המפוח של גד בעגלה למעלה. הכינו נחיתה רכה לפני שהיא נופלת!' },
    update(dt) { tw.update(dt); pCart.update(dt); pCrate.update(dt); pHay.update(dt); eli.update(dt); gad.update(dt); },
    down(p) {
      if (pCrate.hit(p)) { pCrate.pull(() => tw.to(crate, { x: 380, y: 920 }, 0.5, () => { crate.gone = true; api.sfx('thunk'); })); return; }
      if (pHay.hit(p)) {
        pHay.pull(() => {
          if (!crate.gone) { tw.to(hay, { x: 360, y: 600 }, 0.4, () => { hay.lost = true; api.sfx('thunk'); api.say({ en: 'The hay got stuck behind the crate and spilled over the side…', he: 'החציר נתקע מאחורי הארגז ונשפך הצידה…' }); tw.to(hay, { x: 520, y: 1000 }, 0.8); }); return; }
          tw.to(hay, { x: 210, y: 800 }, 0.7, () => { cushion = true; api.sfx('thunk'); });
        });
        return;
      }
      if (pCart.hit(p)) pCart.pull(() => tw.to(cart, { y: cushion ? 752 : 784 }, 0.45, () => {
        if (!cushion) { cart.a = 0.3; api.fail({ en: 'Crash! The cart hit the hard floor. Get the hay underneath it first, but the crate is in the way!', he: 'בום! העגלה נחבטה ברצפה. קודם הביאו את החציר מתחתיה, אבל הארגז חוסם!' }); return; }
        api.sfx('thunk'); if (done) return; done = true;
        gad.walk([[150, 800]], () => {
          gad.hold = 'blower'; gad.mood = 'happy';
          gad.talk(api.L({ en: 'Here, Eli. Check the ground yourself: that\'s how the Sages said to do it!', he: 'קח, אלי. תבדוק את הקרקע בעצמך, כך אמרו חכמים!' }), 3200);
          setTimeout(() => { gad.hold = null; eli.hold = 'blower'; eli.mood = 'happy'; }, 1800);
          setTimeout(() => api.complete(), 3300);
        });
      }));
    },
    hot() { return { cart: pCart.ring, crate: pCrate.ring, hay: pHay.ring }; },
    scene: { mode: 'day', seed: 31 },
    build(K) {
      const T3 = K.THREE;
      K.block(-10, 808, 560, 160, {});
      K.wall(112, 230, 22, 578, {}); K.wall(300, 230, 22, 340, {});
      // the rock chute from the hay shelf down under the cart
      K.beam(322, 573, 530, 513, { h: 26, d: 1.1, mat: K.MAT.rock });
      K.bush(30, 808, 0.8); K.tree(520, 808, 0.75, 'olive', 3);
      const cr = K.crate(44, 44), hy = K.hay(0.9);
      // the cart with the leaf blower in it (origin at the bottom of the wheels)
      const ct = new T3.Group(); ct.add(K.cart(0.85));
      const bl = K.blower(0.8); bl.position.set(-6 / K.U, 52 / K.U, 0.1); bl.rotation.z = 0.3; ct.add(bl);
      K.scene.add(ct);
      this.sync = () => {
        cr.visible = !crate.gone || crate.y < 900; K.place(cr, crate.x, crate.y - 38, 0.75);
        hy.visible = hay.y < 990; K.place(hy, hay.x, hay.y - 22, 0.8);
        K.place(ct, 218, cart.y + 17, 0.1, cart.a);
      };
    },
    draw(g, t) {
      pCart.draw(g); pCrate.draw(g); pHay.draw(g);
      gad.draw(g, t); eli.draw(g, t); gad.drawBubble(g);
    },
  };
};

W1.FIELD = {
  cols: 6, rows: 9, size: 64, x0: 78, y0: 196, air: 10,
  bones: ['8,1', '8,4', '7,2', '6,0', '6,4', '5,2', '4,1', '4,5', '3,3', '2,0', '2,4', '1,2', '0,1', '0,4', '5,5', '3,0'],
  twigs: ['8,3', '6,3', '4,3', '2,2', '7,5', '1,3'],
  big: ['5,4', '2,1'],
};
W1.blowerField = api => {
  const T = api.T, F = W1.FIELD;
  const eli = new Chars.Actor('eli', 270, 880, { hold: 'blower' });
  const key = (r, c) => r + ',' + c;
  const revealed = new Set(F.big);
  const bones = new Set(F.bones), twigs = new Set(F.twigs), big = new Set(F.big);
  let mode = 'blow', air = F.air, path = [], going = false, gust = null;
  const cx = c => F.x0 + c * F.size + F.size / 2, cy = r => F.y0 + r * F.size + F.size / 2;
  const isBone = k => bones.has(k) || big.has(k);
  const cell = p => { const c = Math.floor((p.x - F.x0) / F.size), r = Math.floor((p.y - F.y0) / F.size); return (r >= 0 && r < F.rows && c >= 0 && c < F.cols) ? [r, c] : null; };
  function frontier(r, c) {
    if (r === F.rows - 1) return true;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const k = key(r + dr, c + dc); if (revealed.has(k) && !big.has(k)) return true; }
    return false;
  }
  function blow(r, c) {
    if (air <= 0) { api.say({ en: 'Out of air! Press ↻ to start again, and blow only where you mean to walk.', he: 'נגמר האוויר! לחצו ↻ והתחילו שוב, ונשפו רק איפה שתלכו.' }); return; }
    if (!frontier(r, c)) { api.say({ en: 'Blow a little at a time, starting next to Eli.', he: 'נשפו מעט מעט, החל מליד אלי.' }); return; }
    air--; api.sfx('blow'); gust = { r, c, t: 0.5 };
    for (const dc of [-1, 0, 1]) if (c + dc >= 0 && c + dc < F.cols) revealed.add(key(r, c + dc));
  }
  function addPath(r, c) {
    const k = key(r, c);
    if (path.length && path[path.length - 1] === k) { path.pop(); return; }
    if (path.includes(k)) return;
    if (revealed.has(k) && isBone(k)) { api.say({ en: 'That\'s a bone! Go around it.', he: 'זו עצם! עקפו אותה.' }); return; }
    if (!path.length) { if (r !== F.rows - 1) { api.say({ en: 'Start the path from the bottom row, next to Eli.', he: 'התחילו את השביל מהשורה התחתונה, ליד אלי.' }); return; } path.push(k); return; }
    const [lr, lc] = path[path.length - 1].split(',').map(Number);
    if (Math.abs(lr - r) + Math.abs(lc - c) === 1) path.push(k);
  }
  const buttons = () => [
    { id: 'blow', label: { en: `💨 Blow (${air})`, he: `💨 נשיפה (${air})` }, cls: 'btn-navy', on: mode === 'blow', onClick: () => { mode = 'blow'; api.setButtons(buttons()); } },
    { id: 'path', label: { en: '✏️ Path', he: '✏️ שביל' }, cls: 'btn-navy', on: mode === 'path', onClick: () => { mode = 'path'; api.setButtons(buttons()); } },
    Kit.go(walk),
  ];
  function walk() {
    if (going) return;
    const last = path[path.length - 1];
    if (!last || Number(last.split(',')[0]) !== 0) { api.say({ en: 'Draw a path all the way to the top.', he: 'ציירו שביל עד למעלה.' }); return; }
    going = true; api.setButtons([]);
    const seq = path.slice();
    const step = () => {
      const k = seq.shift();
      if (!k) { eli.walk([[eli.x, 170]], () => { eli.mood = 'happy'; api.complete(); }); return; }
      const [r, c] = k.split(',').map(Number);
      eli.walk([[cx(c), cy(r) + 20]], () => {
        if (!revealed.has(k)) {
          eli.mood = 'oh'; if (bones.has(k)) { revealed.add(k); eli.glow = 'tm'; }
          api.fail({ en: 'You didn\'t check that square! The Sages said: blow on the ground before each step.', he: 'לא בדקתם את המשבצת הזאת! חכמים אמרו: מנפח את הקרקע לפני כל צעד.' });
          return;
        }
        if (!T.crossField({ field: 'plowed', method: 'blow', purpose: 'pesach' }).tahor) { api.fail('?'); return; }
        step();
      });
    };
    step();
  }
  return {
    intro: { en: 'Eli is going to bring the Korban Pesach [קרבן פסח]. Blow on the dirt to find the tiny bones. Careful: not everything white is a bone!', he: 'אלי בדרך להקריב קרבן פסח. נשפו על העפר כדי למצוא עצמות קטנות. זהירות: לא כל דבר לבן הוא עצם!' },
    buttons: buttons(),
    update(dt) { eli.update(dt); if (gust) { gust.t -= dt; if (gust.t <= 0) gust = null; } },
    down(p) {
      if (going) return;
      const rc = cell(p); if (!rc) return;
      if (mode === 'blow') { blow(rc[0], rc[1]); api.setButtons(buttons()); } else addPath(rc[0], rc[1]);
    },
    hot() { const h = {}; for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) h['t' + r + '_' + c] = [cx(c), cy(r)]; return h; },
    scene: { mode: 'day', seed: 41 },
    build(K, ctx) {
      const T3 = K.THREE, G3 = W1.ground(K, { front: 960 });
      G3.sheet(-300, 120, 1140, 900, K.MAT.grass, { thick: 0.3, bevel: 0.05 });
      G3.sheet(F.x0 - 8, F.y0 - 6, F.cols * F.size + 16, F.rows * F.size + 12, K.MAT.earth, { lift: 0.1, thick: 0.2 });
      const dirt = K.std(0x8a5e33, { roughness: 1, map: K.TEX.earth }), clean = K.std(0xf0d9a8, { roughness: 0.9, map: K.TEX.path }), clod = K.std(0x6e4a28, { roughness: 1 });
      const cells = {};
      for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) {
        const k = key(r, c), x = F.x0 + c * F.size, y = F.y0 + r * F.size;
        const tile = G3.sheet(x + 4, y + 4, F.size - 8, F.size - 8, dirt, { lift: 0.18, thick: 0.1, bevel: 0.04 });
        const clods = new T3.Group(), rr = Math.sin(r * 9 + c * 7) * 1000;
        for (let i = 0; i < 5; i++) { const f = n => (Math.sin(rr + i * 3.1 + n) + 1) / 2; const m = K.mesh(K.lumpy(0.05 + f(1) * 0.04, 0, 0.2, i), clod, (f(2) - 0.5) * 0.6, (f(3) - 0.5) * 0.6, 0.02); m.scale.z = 0.6; clods.add(m); }
        K.scene.add(clods); G3.lay(clods, x + F.size / 2, y + F.size / 2, { lift: 0.2 });
        let item = null;
        if (bones.has(k) || big.has(k)) item = G3.lay(K.bone(big.has(k) ? 1.45 : 0.9), x + F.size / 2, y + F.size / 2, { lift: 0.26, rot: big.has(k) ? -0.3 : 0.5 });
        else if (twigs.has(k)) item = G3.lay(K.twig(1.5), x + F.size / 2, y + F.size / 2, { lift: 0.25, rot: -0.4 });
        cells[k] = { tile, clods, item };
      }
      // Eli finishes on the meadow above the field; a few bushes and a tree around it
      G3.stand(K.tree(0, 0, 0.7, 'olive', 2), 40, 150); G3.stand(K.bush(0, 0, 0.7), 500, 160);
      G3.stand(K.bush(0, 0, 0.8), 30, 820); G3.stand(K.bush(0, 0, 0.7), 515, 800);
      this.sync = () => {
        for (const k in cells) {
          const cl = cells[k], rev = revealed.has(k);
          cl.tile.children[0].material = rev ? clean : dirt; cl.clods.visible = !rev;
          if (cl.item) cl.item.visible = rev;
        }
        G3.follow(ctx, [eli]);
      };
    },
    draw(g, t) {
      G.sign(g, 270, 186, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 290, size: 13, post: false });
      for (const k of revealed) if (isBone(k)) { const [r, c] = k.split(',').map(Number); G.tumahGlow(g, cx(c), cy(r), big.has(k) ? 36 : 24, 1, t); }
      if (path.length) {
        G.path(g, path.map(k => { const [r, c] = k.split(',').map(Number); return [cx(c), cy(r)]; }));
        g.lineWidth = 10; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
        g.lineWidth = 4; g.strokeStyle = G.C.gold; g.stroke();
      }
      if (gust) { const gx = cx(gust.c), gy = cy(gust.r); for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(gx, gy, 20 + i * 14 + (0.5 - gust.t) * 40, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = `rgba(255,255,255,${gust.t * 1.6})`; g.stroke(); } }
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-6', pack: 'w1', title: { en: 'The Leaf-Blower Field', he: 'שדה המפוח' },
  stages: [W1.cartDrop, W1.blowerField],
  hints: [
    { en: 'The hay has to land under the cart, but the crate is blocking the chute. Crate, then hay, then cart.', he: 'החציר צריך לנחות מתחת לעגלה, אבל הארגז חוסם. ארגז, חציר, עגלה.' },
    { en: 'Blow a square to see it and its neighbours. Bones have round knobs at both ends; twigs don\'t, and you can step on them. You have just enough air: plan a path up the middle.', he: 'נשיפה מגלה משבצת ושכנותיה. לעצמות יש פקעות עגולות בשני הקצוות; לזרדים אין, ומותר לדרוך עליהם. יש בדיוק מספיק אוויר: תכננו שביל באמצע.' },
  ],
  why: {
    text: {
      en: 'In a Beit HaPeras [בית הפרס], a bone the size of a barley grain only makes you impure [טמא] if you **touch it or move it**. It doesn\'t spread under a roof [אהל]. And the whole Beit HaPeras rule is from the Sages [מדרבנן].\n\nSo the Sages said: **blow on the ground in front of you as you walk**. Any tiny bone shows up, and you step around it. Even a Kohen [כהן] may do this, and someone on his way to the Korban Pesach [קרבן פסח] may then bring it.\n\nBut this check isn\'t relied on for terumah [תרומה].',
      he: 'בבית הפרס, עצם כשעורה מטמאה רק **במגע ובמשא**, ולא באוהל, וכל דין בית הפרס מדרבנן.\n\nלכן אמרו חכמים: **מנפח אדם בית הפרס והולך**. אם יש עצם קטנה היא מתגלה, והוא עוקף אותה. גם כהן רשאי לעשות כך, ומי שהולך לעשות פסח שוחט ואוכל את פסחו.\n\nאבל לתרומה אין סומכים על בדיקה זו.',
    },
    sources: [
      S('מְנַפֵּחַ אָדָם בֵּית הַפְּרָס וְהוֹלֵךְ', 'Berakhot 19b', 'ברכות יט ע"ב', 'Berakhot.19b.5'),
      S('נְתָנוֹ בְּבֵית הַפְּרָס הֲרֵי זֶה עֵרוּב וַאֲפִלּוּ הָיָה כֹּהֵן... אוֹ שֶׁיְּנַפֵּחַ וְהוֹלֵךְ', 'Rambam, Hilchot Eruvin 6:17', 'רמב"ם, הלכות עירובין ו, יז', 'Mishneh_Torah,_Eruvin.6.17'),
      S('מִי שֶׁבָּא בְּבֵית הַפְּרָס הֲרֵי זֶה מְנַפֵּחַ וְהוֹלֵךְ... שׁוֹחֵט וְאוֹכֵל פִּסְחוֹ', 'Rambam, Hilchot Korban Pesach 6:8', 'רמב"ם, הלכות קרבן פסח ו, ח', 'Mishneh_Torah,_Paschal_Offering.6.8'),
      S('בּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה', 'Mishnah Oholot 18:4', 'משנה אהלות יח, ד', 'Mishnah_Oholot.18.4'),
    ],
  },
});

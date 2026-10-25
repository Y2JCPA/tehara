/* 1-2 · The Barn
   Room 1: a dead mouse (sheretz) on a beam, a dead fox (nevelah) in a covered
   bridge, and a burial cave. Only a met spreads tumah under a roof, so the
   covered bridge is safe; touching the mouse is allowed for a Kohen.
   Room 2: two pools (rainwater vs drawn water), then wait for three stars. */
// a burial cave in a rock outcrop, its doorway closed by a rolling stone (golel); (x, y, w, h) is its box
W1.cave3d = (K, x, y, w, h, { closed = true, seed = 9 } = {}) => {
  const T3 = K.THREE, U = K.U, g = new T3.Group();
  const hill = K.mesh(K.lumpy(1, 2, 0.08, seed), K.MAT.rock); hill.scale.set(w / U * 0.55, h / U * 0.6, 0.8);
  hill.position.set(w / U / 2, -h * 0.47 / U, -0.55); g.add(hill);
  const r = h * 0.3 / U;
  g.add(K.mesh(new T3.CircleGeometry(r, 24, 0, Math.PI), K.MAT.dark, w / U / 2 - r * 0.4, -h / U + r * 0.9, 0.3, false));
  g.add(K.mesh(new T3.PlaneGeometry(r * 2, r * 0.9), K.MAT.dark, w / U / 2 - r * 0.4, -h / U + r * 0.45, 0.3, false));
  if (closed) { const st = K.mesh(new T3.CylinderGeometry(r * 1.02, r * 1.02, 0.18, 28), K.MAT.rock, w / U / 2 + r * 0.55, -h / U + r * 1.02, 0.42); st.rotation.x = Math.PI / 2; g.add(st); }
  g.position.copy(K.P(x, y)); K.scene.add(g); return g;
};

// a far-off meadow behind the scene whose top edge appears at logical y (fills the gap under the far hills)
W1.meadow = (K, y, { z = -6, color = 0x7fb35a } = {}) => {
  const T3 = K.THREE, U = K.U, H = 960 / U, eye = -H / 2 + 7.5, sc = (34 - z) / 34;
  const top = eye + (-y / U - eye) * sc, bot = eye + (-1000 / U - eye) * sc;
  const m = new T3.Mesh(new T3.PlaneGeometry(40, top - bot), K.std(color, { roughness: 1 }));
  m.position.set(540 / U / 2, (top + bot) / 2, z); m.receiveShadow = true; K.scene.add(m);
  return m;
};


// where to put something at depth z so that it appears at logical (x, y) on screen
W1.unproj = (x, y, z) => { const k = (34 - z) / 34; return [270 + (x - 270) * k, -45 + (y + 45) * k]; };

W1.barn = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 60, 568);
  const pStick = new Kit.Pin('stick', 190, 470, 300, 470);
  const pDoor = new Kit.Pin('door', 200, 330, 200, 420);
  const stick = { x: 284, y: 470, a: 0 };
  const mouse = { x: 270, y: 560, a: 0, on: true };
  const door = { open: 0 };
  const routes = new Kit.Routes([
    { id: 'beam', box: [150, 520, 240, 70], glow: [[60, 568], [400, 568], [470, 568]] },
    { id: 'bridge', box: [150, 300, 240, 130], glow: [[60, 568], [100, 440], [180, 420], [370, 420], [440, 568]] },
  ]);
  let going = false;
  api.needBonus(); api.state.eli = 'tahor';

  function arrive() { if (api.state.eli === 'tahor') api.bonus(); api.complete(); }
  function goNow() {
    if (going) return;
    if (!routes.sel) { api.say({ en: 'Tap a way to the barn first: the low beam or the covered bridge.', he: 'הקישו קודם על דרך לאורווה: הקורה הנמוכה או הגשר המקורה.' }); return; }
    if (routes.sel === 'bridge' && door.open < 1) { eli.talk(api.L({ en: 'The door is locked!', he: 'הדלת נעולה!' })); return; }
    going = true; api.setButtons([]);
    if (routes.sel === 'bridge') {
      eli.walk([[100, 440], [180, 420], [262, 420]], () => {
        const r = T.passOver('nevelah');
        if (!r.result) api.say({ en: 'Eli is under one roof with a dead fox, but that\'s fine! Only a dead person [מת] spreads tumah under a roof [אהל]. A dead animal [נבלה] only makes you impure if you touch it or carry it.', he: 'אלי תחת גג אחד עם שועל מת, וזה בסדר! רק מת מטמא באוהל. נבלה מטמאה רק במגע ובמשא.' }, 'good', 5200);
        eli.walk([[370, 420], [440, 568], [470, 568]], arrive);
      });
      return;
    }
    if (!mouse.on) { eli.walk([[150, 568], [400, 568], [470, 568]], arrive); return; }
    eli.walk([[150, 568], [256, 568]], () => {
      const r = T.personTouches('sheretz'), k = T.kohenMay('sheretz');
      api.state.eli = r.status; eli.glow = 1; eli.badge = 1; eli.mood = 'oh';
      api.say({ en: 'Eli touched the dead mouse, a sheretz [שרץ]. Now he\'s impure [טמא] until evening. That\'s allowed for a Kohen!', he: 'אלי נגע בעכבר המת, שרץ. עכשיו הוא טמא עד הערב, וזה מותר לכהן!' }, k.ok ? 'info' : 'warn', 4200);
      setTimeout(() => { eli.mood = 'idle'; eli.walk([[400, 568], [470, 568]], arrive); }, 1400);
    });
  }
  return {
    intro: { en: 'Eli needs the donkey from the barn. Which way should he go?', he: 'אלי צריך את החמור מהאורווה. באיזו דרך ללכת?' },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pStick.update(dt); pDoor.update(dt); eli.update(dt); },
    down(p) {
      if (going) return;
      if (pStick.hit(p)) {
        pStick.pull(() => tw.to(stick, { y: 520, a: 0.5 }, 0.3, () => {
          api.sfx('thunk');
          if (T.personMovesWithStick('sheretz').status === 'tahor') mouse.on = false;
          tw.to(mouse, { x: 300, y: 900, a: 3 }, 0.6); tw.to(stick, { x: 330, y: 900, a: 1.5 }, 0.7);
        }));
        return;
      }
      if (pDoor.hit(p)) { pDoor.pull(() => tw.to(door, { open: 1 }, 0.4)); return; }
      if (Kit.inRect(p, 0, 150, 150, 150)) { eli.mood = 'no'; eli.talk(api.L({ en: 'A burial cave? Not for a Kohen!', he: 'מערת קבורה? לא לכהן!' })); setTimeout(() => { eli.mood = 'idle'; }, 1600); return; }
      routes.hit(p);
    },
    hot() { return { stick: pStick.ring, door: pDoor.ring, cave: [70, 230], ...routes.hot() }; },
    scene: { mode: 'day', seed: 5 },
    build(K) {
      const T3 = K.THREE, U = K.U;
      // the burial cave up on a rock ledge, the two banks and the ravine between them
      K.block(-10, 290, 160, 30, { face: 'rock' });
      W1.cave3d(K, 6, 160, 140, 130);
      K.block(-10, 568, 160, 400);
      K.block(390, 568, 160, 400);
      K.recess(150, 568, 240, 700, { z: -2.2 });
      // the covered bridge, with stairs at each end
      K.stairs(150, 420, 5, { stepW: 14, stepH: 29, dir: -1, thick: 16 });
      K.stairs(390, 420, 5, { stepW: 12, stepH: 29, dir: 1, thick: 16 });
      K.wall(150, 410, 240, 18, { mat: K.MAT.plank, z0: -0.7, z1: 0.6 });
      K.wall(150, 334, 240, 76, { mat: K.std(0x4a3220, { roughness: 1 }), z0: -0.9, z1: -0.7 });
      const roof = new T3.Shape(); roof.moveTo(-10 / U, 0); roof.lineTo(250 / U, 0); roof.lineTo(230 / U, 30 / U); roof.lineTo(10 / U, 30 / U); roof.closePath();
      const rm = K.mesh(new T3.ExtrudeGeometry(roof, { depth: 1.7, bevelEnabled: false }), K.std(0xb85c34, { roughness: 0.85 }));
      rm.position.copy(K.P(150, 334, -0.95)); K.scene.add(rm);
      for (const px of [154, 386]) K.wall(px - 5, 330, 10, 82, { mat: K.MAT.wood, z0: 0.3, z1: 0.6 });
      // the dead fox on its shelf inside the bridge
      K.wall(290, 384, 70, 8, { mat: K.MAT.plank, z0: -0.85, z1: -0.2 });
      const fox = K.fox(0.62); fox.rotation.y = 0; K.place(fox, 326, 374, -0.5);
      // the bridge door, hinged on the left
      const doorH = new T3.Group(); doorH.position.copy(K.P(158, 330, 0.35));
      const dm = K.mesh(new T3.BoxGeometry(14 / U, 82 / U, 0.6), K.MAT.plank); dm.position.set(7 / U, -41 / U, 0); doorH.add(dm); K.scene.add(doorH);
      // the barn, with the donkey in its doorway
      K.house(420, 430, 112, 138, { door: false });
      K.recess(448, 500, 56, 68, { z: 0.22, mat: K.MAT.dark });
      const dk = K.donkey({ s: 0.48 }); K.place(dk, 480, 566, 0.35); dk.rotation.y = -Math.PI + 0.5;
      // the low beam with the dead mouse, and the stick that hangs over it
      K.place(K.plank(250, 16, 0.9), 270, 576, 0.05);
      const ms = K.mouse(1.4);
      const stickH = new T3.Group(); const sm = K.mesh(new T3.CylinderGeometry(6 / U, 6 / U, 80 / U, 10), K.MAT.wood); sm.position.y = -40 / U; stickH.add(sm); K.scene.add(stickH);
      this.sync = () => {
        doorH.rotation.y = door.open * 1.4;
        ms.visible = mouse.y < 950; K.place(ms, mouse.x, mouse.y + 8, 0.25, mouse.a);
        K.place(stickH, stick.x, stick.y, 0.3, stick.a);
      };
    },
    draw(g, t) {
      routes.draw(g, t);
      pStick.draw(g); pDoor.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

W1.dinner = api => {
  const T = api.T, tw = new Kit.Tweens();
  const st = { status: api.state.eli || 'tahor', immersed: false };
  const eli = new Chars.Actor('eli', 300, 700);
  if (st.status !== 'tahor') { eli.glow = 1; eli.badge = 1; }
  const miriam = new Chars.Actor('miriam', 492, 700, { dir: -1 });
  const pools = { rain: { x: 40, w: 140, drawn: false }, bucket: { x: 190, w: 130, drawn: true } };
  let v = 0, dragging = false, busy = false, calledEarly = false;
  const track = { x1: 90, x2: 450, y: 862 };
  const stars = () => v >= 0.98 ? 3 : v >= 0.9 ? 2 : v >= 0.82 ? 1 : 0;

  function dip(key) {
    if (busy || st.status === 'tahor' || st.immersed) return;
    busy = true; const P = pools[key];
    eli.walk([[P.x + P.w / 2, 700], [P.x + P.w / 2, 752]], () => {
      api.sfx('splash');
      if (!T.mikveh({ drawn: P.drawn }).valid) {
        api.mistake({ en: 'That pool was filled with buckets. Drawn water [מים שאובים] doesn\'t make a kosher mikveh (a Rabbinic rule). Use the pool the rain fills by itself.', he: 'הבריכה הזאת מולאה בדליים. מים שאובים פסולים לטבילה מדברי סופרים. טבלו בבריכה שהגשם ממלא מעצמו.' });
        eli.walk([[P.x + P.w / 2, 700], [300, 700]], () => { busy = false; });
        return;
      }
      st.immersed = true; eli.glow = null; eli.badge = '✓';
      api.say({ en: 'Eli dipped in the mikveh [טבילה]. Now he waits for evening.', he: 'אלי טבל במקווה. עכשיו הוא מחכה לערב.' });
      eli.walk([[P.x + P.w / 2, 700], [300, 700]], () => { busy = false; });
    });
  }
  function eat() {
    if (busy) return;
    const r = T.canEatTerumah({ status: st.status, immersed: st.immersed, starsOut: stars() >= 3 });
    if (r.ok) { busy = true; eli.mood = 'happy'; eli.walk([[392, 700]], () => { api.say({ en: 'Eli is pure [טהור]. He may eat terumah [תרומה]!', he: 'אלי טהור, ומותר לו לאכול תרומה!' }, 'good'); setTimeout(() => api.complete(), 900); }); return; }
    if (r.need === 'mikveh') api.mistake({ en: 'Not yet! First Eli must dip in a kosher mikveh [מקווה].', he: 'עוד לא! קודם אלי צריך לטבול במקווה כשר.' });
    else api.mistake({ en: 'Not yet! It\'s getting dark, but a Kohen waits until three medium stars [שלושה כוכבים] come out before eating terumah.', he: 'עוד לא! מחשיך, אבל הכהן מחכה לצאת שלושה כוכבים בינוניים לפני שאוכל תרומה.' });
  }
  return {
    intro: st.status === 'tahor'
      ? { en: 'Eli stayed pure! Tap the terumah [תרומה] for dinner.', he: 'אלי נשאר טהור! הקישו על התרומה לארוחת הערב.' }
      : { en: 'Dinner is terumah [תרומה]. What does Eli need to do first?', he: 'לארוחת הערב יש תרומה. מה אלי צריך לעשות קודם?' },
    update(dt) { tw.update(dt); eli.update(dt); miriam.update(dt); },
    down(p) {
      const hx = Kit.lerp(track.x1, track.x2, v);
      if (Kit.near(p, hx, track.y, 40)) { dragging = true; return; }
      for (const k of ['rain', 'bucket']) { const P = pools[k]; if (Kit.inRect(p, P.x, 690, P.w, 90)) { dip(k); return; } }
      if (Kit.inRect(p, 350, 630, 130, 70)) eat();
    },
    move(p) {
      if (!dragging) return;
      v = Math.max(0, Math.min(1, (p.x - track.x1) / (track.x2 - track.x1)));
      if (stars() === 2 && !calledEarly) { calledEarly = true; miriam.talk(api.L({ en: 'Eli! Dinner\'s ready! It\'s dark already!', he: 'אלי! ארוחת ערב! כבר חושך!' }), 2600); }
      if (stars() >= 3) api.say({ en: 'Three stars are out!', he: 'יצאו שלושה כוכבים!' }, 'good', 1500);
    },
    up() { dragging = false; },
    hot() { return { rain: [110, 730], bucket: [255, 730], plate: [414, 660], dial: [Kit.lerp(track.x1, track.x2, v), track.y], dialEnd: [track.x2, track.y] }; },
    scene: { mode: 'day', seed: 3 },
    build(K) {
      const T3 = K.THREE, U = K.U;
      W1.meadow(K, 560);
      // the ground, cut away for the two pools
      K.block(-10, 708, 50, 300); K.block(180, 708, 10, 300, { top: 'stone' }); K.block(320, 708, 230, 300);
      K.block(40, 780, 140, 230, { face: 'rock', top: 'none' }); K.block(190, 780, 130, 230, { face: 'rock', top: 'none' });
      // the mikveh house behind them
      K.wall(20, 470, 320, 238, { z0: -2.0, z1: -1.2 });
      K.wall(10, 440, 340, 34, { mat: K.MAT.plaster, z0: -2.1, z1: -0.9 });
      const waterM = K.std(0x4aa8de, { transparent: true, opacity: 0.62, roughness: 0.08, metalness: 0.1 });
      for (const k of ['rain', 'bucket']) {
        const P0 = pools[k];
        K.recess(P0.x, 690, P0.w, 90, { z: -1.15, mat: K.MAT.stone });
        const w = K.mesh(new T3.BoxGeometry(P0.w / U, 78 / U, 1.9), waterM, 0, 0, 0, false, true);
        w.position.copy(K.P(P0.x + P0.w / 2, 741, -0.2)); K.scene.add(w);
        if (k === 'bucket') {   // a fancy polished rim with gold studs
          K.wall(P0.x - 4, 684, P0.w + 8, 10, { mat: K.std(0xe9eef2, { roughness: 0.3 }), z0: 0.6, z1: 0.8 });
          for (let i = 0; i < 3; i++) { const st = K.mesh(new T3.SphereGeometry(0.05, 10, 8), K.MAT.goldBright); st.position.copy(K.P(P0.x + 20 + i * 45, 688, 0.85)); K.scene.add(st); }
        } else K.wall(P0.x - 4, 686, P0.w + 8, 8, { mat: K.MAT.stoneSmooth, z0: 0.6, z1: 0.8 });
      }
      // the rain gutter from the roof into the rain pool
      const pipe = K.std(0x8a7a62, { roughness: 0.6, metalness: 0.3 });
      K.beam(30, 450, 30, 560, { h: 9, d: 0.14, z: -0.9, mat: pipe }); K.beam(30, 560, 100, 640, { h: 9, d: 0.14, z: -0.9, mat: pipe });
      K.beam(100, 640, 100, 690, { h: 7, d: 0.12, z: -0.9, mat: pipe });
      // a servant pouring buckets into the fancy pool
      const hp = K.char('helper'); hp.group.scale.setScalar(0.8);
      const bk = K.bucket(0.8); K.scene.remove(bk); hp.setHeld(bk);
      K.place(hp.group, 250, 690, -1.0);
      // the table with the terumah
      K.wall(350, 676, 130, 14, { mat: K.MAT.plank, z0: -0.4, z1: 0.4 });
      for (const lx of [364, 462]) K.wall(lx, 690, 6, 18, { mat: K.MAT.wood, z0: -0.1, z1: 0.1 });
      const plate = K.mesh(new T3.CylinderGeometry(38 / U, 30 / U, 0.05, 28), K.std(0xffffff, { roughness: 0.4 }));
      plate.position.copy(K.P(414, 672, 0)); K.scene.add(plate);
      K.place(K.loaf(0.75), 414, 670, 0);
      // evening: the sky darkens and the light goes warm, then blue
      const hemi = [], suns = [], bgs = [], clouds = [];
      K.scene.traverse(o => { if (o.isHemisphereLight) hemi.push([o, o.intensity]); if (o.isDirectionalLight) suns.push([o, o.intensity]); if (o.isMesh && o.material.isMeshBasicMaterial) bgs.push(o.material); if (o.isMesh && o.material.emissiveIntensity > 0.3) { o.material = o.material.clone(); o.material.userData.own = true; clouds.push(o.material); } });
      const sky0 = K.scene.background;
      const cDay = new T3.Color(0x8fd0f6), cSun = new T3.Color(0xe5876e), cNight = new T3.Color(0x1f2c66), c = new T3.Color(), dim = new T3.Color();
      this.sync = (t, dt) => {
        hp.update(dt || 0.016, {});
        if (v < 0.05) { K.scene.background = sky0; } else {
          if (v < 0.6) c.copy(cDay).lerp(cSun, Math.min(1, (v - 0.05) / 0.5)); else c.copy(cSun).lerp(cNight, Math.min(1, (v - 0.6) / 0.35));
          K.scene.background = c;
        }
        const k = 1 - 0.75 * Math.max(0, Math.min(1, (v - 0.3) / 0.6));
        for (const [l, i0] of hemi) l.intensity = i0 * (0.45 + 0.55 * k);
        for (const [l, i0] of suns) { l.intensity = i0 * k; l.color.setHex(v > 0.65 ? 0xaab8ff : v > 0.3 ? 0xffb080 : 0xfff1d6); }
        dim.setScalar(0.2 + 0.8 * k); for (const m of bgs) m.color.copy(dim);
        for (const m of clouds) m.emissiveIntensity = 0.35 * k;
      };
    },
    draw(g, t) {
      if (v > 0.65) {   // night: stars, and the three that count
        g.save(); g.globalAlpha = Math.min(1, (v - 0.65) / 0.3); const r = G.rng(4); g.fillStyle = 'rgba(255,255,255,0.7)';
        for (let i = 0; i < 40; i++) { const sz = r() * 1.6 + 0.6; g.fillRect(r() * 540, r() * 380, sz, sz); }
        const pts = [[120, 90], [300, 64], [440, 120]];
        for (let i = 0; i < Math.min(stars(), 3); i++) G.star(g, pts[i][0], pts[i][1], 11, '#fff3a0', true);
        g.restore();
      }
      G.tag(g, api.L({ en: 'Mikveh', he: 'מקווה' }), 180, 500, { size: 15 });
      if (stars() >= 2) G.sparkle(g, 440, 640, t);
      G.tag(g, api.L({ en: 'Terumah', he: 'תרומה' }), 414, 618, { size: 13 });
      miriam.draw(g, t); eli.draw(g, t); eli.drawBubble(g); miriam.drawBubble(g);
      // time-of-day slider
      G.rr(g, 40, 812, 460, 100, 20, 'rgba(255,250,240,0.94)', 2.5);
      G.rr(g, track.x1, track.y - 6, track.x2 - track.x1, 12, 6, G.lin(g, track.x1, 0, track.x2, 0, [[0, '#ffd66b'], [0.6, '#f08a5d'], [1, '#2f3f80']]), 2);
      G.text(g, '☀', track.x1 - 26, track.y, { size: 22, color: '#f5a623' }); G.text(g, '★', track.x2 + 26, track.y, { size: 22, color: '#5b6fc4' });
      const hx = Kit.lerp(track.x1, track.x2, v);
      G.circ(g, hx, track.y, 19, G.rad(g, hx - 5, track.y - 5, 2, 20, [[0, '#fff'], [1, v > 0.65 ? '#cdd6ff' : '#ffcf3f']]), 2.5);
      G.text(g, api.L({ en: 'Drag to make it evening', he: 'גררו כדי שיגיע הערב' }), 270, 834, { size: 14 });
    },
  };
};

WORLD1.push({
  id: '1-2', pack: 'w1', title: { en: 'The Barn', he: 'האורווה' },
  stages: [W1.barn, W1.dinner],
  hints: [
    { en: 'Does a dead animal spread tumah under a roof, like a dead person does? And can you get the mouse off the beam without touching it?', he: 'האם נבלה מטמאה באוהל כמו מת? ואפשר להעיף את העכבר מהקורה בלי לגעת בו?' },
    { en: 'A mikveh must be gathered rainwater, not water poured in with buckets. Then wait for THREE stars.', he: 'מקווה צריך להיות מי גשמים שנקוו מעצמם, לא מים שנשפכו בדליים. ואז לחכות לשלושה כוכבים.' },
  ],
  why: {
    text: {
      en: 'A dead mouse is a sheretz [שרץ]: touching it makes you impure [טמא] until evening. A dead fox is a nevelah [נבלה]: touching or carrying it makes you impure. A Kohen **may** become impure from these. The Torah only forbids him tumah from a dead person [מת].\n\nAnd only a met spreads tumah under a roof [אהל]. So the covered bridge with the fox inside was safe! Knocking the mouse off with a stick was safe too, because a sheretz doesn\'t make you impure by moving it.\n\nA mikveh is water gathered by itself, like rain; drawn water [שאובים] is invalid (a Rabbinic rule). After dipping, a Kohen waits for three stars before eating terumah [תרומה].',
      he: 'עכבר מת הוא שרץ: הנוגע בו טמא עד הערב. שועל מת הוא נבלה: מטמאה במגע ובמשא. לכהן **מותר** להיטמא בהם; התורה אסרה עליו רק טומאת מת.\n\nורק מת מטמא באוהל. לכן הגשר המקורה עם השועל היה בטוח! גם הפלת העכבר במקל הייתה בטוחה, כי שרץ אינו מטמא במשא.\n\nמקווה הוא מים שנקוו מעצמם, כמו גשם; מים שאובים פסולים מדברי סופרים. אחרי הטבילה הכהן מחכה לשלושה כוכבים ואז אוכל תרומה.',
    },
    sources: [
      S('טֻמְאַת אֹהֶל אֵינָהּ בִּשְׁאָר טֻמְאוֹת אֶלָּא בְּמֵת בִּלְבַד', 'Rambam, Hilchot Tumat Met 1:10', 'רמב"ם, הלכות טומאת מת א, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.10'),
      S('הַשֶּׁרֶץ... מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע... וְאֵינוֹ מְטַמֵּא בְּמַשָּׂא', 'Rambam, Hilchot She\'ar Avot HaTumot 4:2', 'רמב"ם, הלכות שאר אבות הטומאות ד, ב', 'Mishneh_Torah,_Other_Sources_of_Defilement.4.2'),
      S('הַנְּבֵלָה אָב מֵאֲבוֹת הַטֻּמְאוֹת... מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע... וּמְטַמֵּא אֶת הָאָדָם בְּמַשָּׂא', 'Rambam, Hilchot She\'ar Avot HaTumot 1:1', 'רמב"ם, הלכות שאר אבות הטומאות א, א', 'Mishneh_Torah,_Other_Sources_of_Defilement.1.1'),
      S('וְשֶׁאַף כֹּהֲנִים וּנְזִירִים מֻתָּרִין לְהִתְטַמֵּא בִּשְׁאָר טֻמְאוֹת חוּץ מִטְּמֵא מֵת', 'Rambam, Hilchot Tumat Okhalin 16:9', 'רמב"ם, הלכות טומאת אוכלין טז, ט', 'Mishneh_Torah,_Defilement_of_Foods.16.9'),
      S('מִדִּבְרֵי סוֹפְרִים שֶׁהַמַּיִם הַשְּׁאוּבִין פְּסוּלִין לִטְבִילָה', 'Rambam, Hilchot Mikvaot 4:2', 'רמב"ם, הלכות מקוואות ד, ב', 'Mishneh_Torah,_Immersion_Pools.4.2'),
      S('אֵין הַטְּמֵאִים אוֹכְלִין בִּתְרוּמָה עַד שֶׁיַּעֲרִיב שִׁמְשָׁן וְיֵצְאוּ שְׁלֹשָׁה כּוֹכָבִים בֵּינוֹנִיִּים', 'Rambam, Hilchot Terumot 7:2', 'רמב"ם, הלכות תרומות ז, ב', 'Mishneh_Torah,_Heave_Offerings.7.2'),
    ],
  },
});

/* 1-4 · The Gardener's Tree
   Room 1: three pins, one right order. Room 2: a tree over a grave and the
   road. Thick branches and thin twigs both bring tumah (13:2); a rope thinner
   than a tefach does not (12:1); a board held up by a person doesn't block it
   (Oholot 6:1). Only two cuts. */
W1.gardenerShed = api => {
  const tw = new Kit.Tweens();
  const gad = new Chars.Actor('gad', 240, 660);
  const pBoard = new Kit.Pin('board', 330, 420, 470, 420);
  const pBarrel = new Kit.Pin('barrel', 330, 352, 520, 352);
  const pDoor = new Kit.Pin('door', 500, 610, 404, 610);
  const barrel = { y: 314, a: 0, vis: true }, door = { a: 0 }, board = { y: 0, gone: false };
  let wet = false, wasted = false, splash = 0, bees = 0;
  return {
    intro: { en: 'Gad the gardener [גד הגנן] is stuck in his shed. Three pins: pull them in the right order!', he: 'גד הגנן תקוע בצריף. שלוש יתדות: משכו אותן בסדר הנכון!' },
    update(dt) { tw.update(dt); pBoard.update(dt); pBarrel.update(dt); pDoor.update(dt); gad.update(dt); if (splash > 0) splash -= dt; if (bees > 0) bees += dt; },
    down(p) {
      if (pBoard.hit(p)) { pBoard.pull(() => tw.to(board, { y: 500 }, 0.5, () => { board.gone = true; api.sfx('thunk'); })); return; }
      if (pBarrel.hit(p)) {
        pBarrel.pull(() => tw.to(barrel, { y: 400, a: 1.4 }, 0.35, () => {
          api.sfx('splash'); splash = 1.2;
          if (!board.gone) { wasted = true; api.fail({ en: 'The water ran down the board and away from the hive. Now there\'s no water left! Move the board first.', he: 'המים זרמו על הקרש והרחק מהכוורת. עכשיו אין מים! קודם הזיזו את הקרש.' }); return; }
          wet = true; api.say({ en: 'Splash! The bees are calm and sleepy now.', he: 'שפריץ! הדבורים רגועות ומנומנמות.' }, 'good');
          tw.to(barrel, { y: 760, a: 2 }, 0.5, () => { barrel.vis = false; });
        }));
        return;
      }
      if (pDoor.hit(p)) {
        pDoor.pull(() => tw.to(door, { a: 1 }, 0.4, () => {
          if (!wet) { bees = 0.01; gad.mood = 'oh'; api.fail({ en: 'Bzzz! Opening the door shook the hive. Calm the bees first!', he: 'בזזז! פתיחת הדלת טלטלה את הכוורת. קודם הרגיעו את הדבורים!' }); return; }
          gad.mood = 'happy'; gad.walk([[420, 660], [505, 660]], () => api.complete());
        }));
      }
    },
    hot() { return { board: pBoard.ring, barrel: pBarrel.ring, door: pDoor.ring }; },
    scene: { mode: 'day', seed: 12 },
    build(K) {
      const T3 = K.THREE, U = K.U;
      W1.meadow(K, 600);
      K.block(-10, 668, 560, 300);
      // the shed, cut away so we can see Gad inside
      K.wall(100, 400, 300, 258, { mat: K.std(0x5a4128, { roughness: 1, map: K.MAT.plank.map }), z0: -1.6, z1: -1.3 });
      K.wall(80, 380, 20, 288, { z0: -1.6, z1: 0.5 }); K.wall(400, 380, 20, 180, { z0: -1.6, z1: 0.5 });
      K.wall(80, 380, 340, 20, { z0: -1.6, z1: 0.5 });
      const roof = new T3.Shape(); [[60, 382], [440, 382], [400, 320], [100, 320]].forEach(([x, y], i) => i ? roof.lineTo(x / U, -y / U) : roof.moveTo(x / U, -y / U)); roof.closePath();
      const rm = K.mesh(new T3.ExtrudeGeometry(roof, { depth: 1.95, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1 }), K.std(0x9a6a46, { roughness: 0.9 })); rm.position.z = -1.75; K.scene.add(rm);
      K.place(K.crate(56, 58), 148, 629, -0.8); K.place(K.crate(40, 38), 196, 639, -0.3);
      const pot = K.cup('clay', 1.1); K.place(pot, 150, 600, -0.8); K.place(K.bush(150, 590, 0.7), 150, 594, -0.8);
      const doorH = new T3.Group(); doorH.position.copy(K.P(404, 560, 0.3));
      const dm = K.mesh(new T3.BoxGeometry(18 / U, 100 / U, 0.7), K.MAT.plank); dm.position.set(9 / U, -50 / U, 0); doorH.add(dm); K.scene.add(doorH);
      // the barrel, the board under it, the string and the hive
      const brl = K.barrel(1.15);
      const bd = K.plank(120, 12, 0.8);
      const strg = K.mesh(new T3.CylinderGeometry(0.015, 0.015, 58 / U, 6), K.std(0x6b4a22), 0, 0, 0); strg.position.copy(K.P(470, 411, 0.2)); K.scene.add(strg);
      const hive = K.hive(1.15); K.place(hive, 470, 446, 0.2);
      const wetM = K.std(0xa77a32, { roughness: 0.4 });
      const bee = n => Array.from({ length: n }, () => K.bee());
      const calm = bee(3), angry = bee(10);
      const drops = Array.from({ length: 10 }, () => { const d = K.mesh(new T3.SphereGeometry(0.07, 8, 6), K.MAT.water); K.scene.add(d); return d; });
      let wetDone = false;
      this.sync = (t) => {
        doorH.rotation.y = door.a * 1.4;
        bd.visible = !board.gone || board.y < 500; K.place(bd, 470, 432 + board.y, 0.15, 0.35);
        brl.visible = barrel.vis; K.place(brl, 470, barrel.y, 0.2, barrel.a);
        if (wet && !wetDone) { wetDone = true; hive.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHex() === 0xf2b84b) o.material = wetM; }); }
        calm.forEach((b, i) => { b.visible = !wet; K.place(b, 470 + Math.sin(t / 300 + i * 2) * 28, 460 + Math.cos(t / 260 + i) * 14, 0.6); });
        angry.forEach((b, i) => { b.visible = bees > 0; K.place(b, 380 + Math.sin(t / 120 + i) * 70, 590 + Math.cos(t / 150 + i * 1.3) * 50, 0.7); });
        drops.forEach((d, i) => { d.visible = splash > 0; if (splash > 0) d.position.copy(K.P((wasted ? 500 : 455) + Math.sin(i * 7) * 26 + (wasted ? i * 4 : 0), 430 + (1.2 - splash) * 70 + i * 6, 0.5)); });
      };
    },
    draw(g, t) {
      pBoard.draw(g); pBarrel.draw(g); pDoor.draw(g);
      gad.draw(g, t); gad.drawBubble(g);
    },
  };
};

W1.pruneTree = (hero = 'eli', prunerKind = 'gad') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor(hero, 40, 830);
  const pruner = new Chars.Actor(prunerKind, 252, 556, { dir: -1 });
  // branches from the trunk top (200,400)
  const br = {
    grave: { to: [92, 310], leaf: [84, 290, 64], kind: 'thick', cut: 0 },
    road:  { to: [360, 450], leaf: [396, 452, 62], kind: 'thick', cut: 0 },
    twigs: { to: [470, 560], leaf: [480, 572, 38], kind: 'thin', cut: 0 },
    rope:  { to: [522, 640], leaf: [380, 520, 22], kind: 'rope', cut: 0 },
  };
  let going = false, cuts = 2, busy = false;
  api.needBonus();
  const graveCovered = () => !br.grave.cut;
  function roadTamei() {
    if (!graveCovered()) return false;
    const thick = T.underSameOhel(!br.road.cut, true, { sturdy: true }).result;
    const thin = T.underSameOhel(!br.twigs.cut, true, { sturdy: false }).result;   // thin twigs still bring tumah (Rabbinic)
    T.underSameOhel(!br.rope.cut, true, { widthTefach: 0.3 });                     // a rope is not an ohel at all
    return thick || thin;
  }
  function cut(key) {
    if (busy || br[key].cut || going) return;
    if (cuts <= 0) { api.say({ en: 'Gad\'s saw is too dull to cut any more!', he: 'המסור של גד קהה מדי!' }); return; }
    busy = true; cuts--; api.sfx('whoosh');
    tw.to(br[key], { cut: 1 }, 0.7, () => {
      busy = false;
      if (key === 'rope') api.say({ en: `Gad cut the rope. (${cuts} cut${cuts === 1 ? '' : 's'} left)`, he: `גד חתך את החבל. (נשארו ${cuts})` });
      else api.say({ en: `Snip! (${cuts} cut${cuts === 1 ? '' : 's'} left)`, he: `נגזם! (נשארו ${cuts})` });
    });
  }
  function boardOffer() {
    if (going) return; going = true; api.setButtons([]);
    if (!roadTamei()) { api.say({ en: 'The road is already pure, no board needed!', he: 'הדרך כבר טהורה, אין צורך בקרש!' }); going = false; api.setButtons(btns()); return; }
    pruner.walk([[200, 830]], () => { pruner.hold = null;
      eli.walk([[300, 830]], () => {
        const b = T.coverBlocks('person');
        Kit.reveal(api, 'tree'); eli.glow = 'tm'; eli.mood = 'oh';
        if (!b.blocks) api.fail({ en: 'A board held up by a person doesn\'t block tumah! People and vessels can bring tumah, but they can\'t block it [אדם וכלים אינם חוצצים].', he: 'קרש שאדם מחזיק אינו חוצץ בפני הטומאה! אדם וכלים מביאים את הטומאה, אבל אינם חוצצים.' });
      });
    });
  }
  function goNow() {
    if (going) return; going = true; api.setButtons([]);
    if (roadTamei()) {
      eli.walk([[290, 830]], () => {
        Kit.reveal(api, 'tree'); eli.mood = 'no'; eli.glow = 'tm';
        const thinOnly = br.road.cut && !br.twigs.cut;
        api.fail(thinOnly
          ? { en: 'Even thin twigs over a grave bring tumah to what\'s under them (a Rabbinic rule). The road is still impure [טמא]!', he: 'גם ענפים דקים מעל קבר מביאים את הטומאה מדברי סופרים. הדרך עדיין טמאה!' }
          : { en: 'The branches are one roof [אהל] over the grave AND the road. Everything under them is impure [טמא]!', he: 'הענפים הם אוהל אחד מעל הקבר ומעל הדרך. כל מה שתחתיהם טמא!' });
      });
      return;
    }
    if (br.grave.cut && cuts === 1) api.bonus();
    eli.walk([[505, 830]], () => { eli.mood = 'happy'; api.complete(); });
  }
  const btns = () => [Kit.go(goNow), { id: 'board', label: { en: 'Gad holds a board over Eli', he: 'גד מחזיק קרש מעל אלי' }, cls: 'btn-navy', onClick: boardOffer }];
  function hitBranch(p, b) { const [x, y, r] = b.leaf; return !b.cut && Kit.near(p, x, y, r); }
  return {
    intro: { en: 'This tree grows by a grave. Gad can cut only TWO branches. Which ones? (Tap a branch to cut it.)', he: 'העץ הזה גדל ליד קבר. גד יכול לגזום רק שני ענפים. אילו? (הקישו על ענף כדי לגזום.)' },
    buttons: btns(),
    update(dt) { tw.update(dt); eli.update(dt); pruner.update(dt); },
    down(p) { for (const k of ['rope', 'twigs', 'road', 'grave']) if (hitBranch(p, br[k])) { cut(k); return; } },
    hot() { const h = {}; for (const k in br) h[k] = br[k].leaf.slice(0, 2); return h; },
    scene: { mode: 'day', seed: 14 },
    build(K) {
      const T3 = K.THREE, U = K.U;
      W1.meadow(K, 560);
      K.block(-10, 838, 560, 140, { top: 'path' });
      K.block(-10, 560, 310, 280);
      K.grave(84, 566, 1);
      K.wall(516, 600, 12, 238, { mat: K.MAT.wood, z0: -0.1, z1: 0.1 });
      // the trunk
      const tr = K.mesh(new T3.CylinderGeometry(9 / U, 15 / U, 162 / U, 12), K.MAT.trunk); tr.position.copy(K.P(201, 481, 0)); K.scene.add(tr);
      // the branches: each is a group we can drop when it's cut
      const parts = {};
      for (const k of ['grave', 'road', 'twigs', 'rope']) {
        const b = br[k], grp = new T3.Group(); K.scene.add(grp); parts[k] = grp;
        const mats = [];
        const own = m => { const c = m.clone(); c.transparent = true; c.userData.own = true; mats.push(c); return c; };
        const limb = (x1, y1, x2, y2, r) => { const L = Math.hypot(x2 - x1, y2 - y1) / U; const m = K.mesh(new T3.CylinderGeometry(r * 0.7, r, L, 8), own(K.MAT.trunk)); m.position.copy(K.P((x1 + x2) / 2, (y1 + y2) / 2, 0)); m.rotation.z = Math.atan2(x2 - x1, y2 - y1); grp.add(m); };
        if (k === 'rope') {
          const a = K.P(206, 470, 0.1), c = K.P(522, 640, 0.1), m = a.clone().lerp(c, 0.5); m.y -= 30 / U;
          grp.add(K.mesh(new T3.TubeGeometry(new T3.QuadraticBezierCurve3(a, m, c), 24, 0.03, 6), own(K.std(0xc8a36a, { roughness: 1 }))));
        } else {
          const thin = b.kind === 'thin';
          limb(201, 410, b.to[0], b.to[1], thin ? 0.04 : 0.1);
          const [lx, ly, r] = b.leaf;
          if (thin) for (let i = 0; i < 9; i++) {
            const a = i * 0.7, ex = lx + Math.cos(a) * r, ey = ly + Math.sin(a) * r * 0.7;
            limb(b.to[0], b.to[1], ex, ey, 0.02);
            const lf = K.mesh(new T3.SphereGeometry(0.09, 8, 6), own(K.MAT.leaf)); lf.scale.set(1, 0.6, 0.6); lf.position.copy(K.P(ex, ey, 0)); grp.add(lf);
          } else {
            const crown = K.mesh(K.lumpy(r / U, 2, 0.1, lx), own(K.MAT.leaf)); crown.scale.set(1, 0.85, 0.75); crown.position.copy(K.P(lx, ly, 0)); grp.add(crown);
            for (let i = 0; i < 3; i++) { const p = K.mesh(K.lumpy(r * 0.5 / U, 1, 0.12, i + lx), own(i ? K.MAT.leafDark : K.MAT.leaf)); p.position.copy(K.P(lx + (i - 1) * r * 0.55, ly + r * 0.3 - i * 6, 0.25)); grp.add(p); }
          }
        }
        grp.userData.mats = mats;
      }
      this.sync = () => {
        for (const k in parts) {
          const c = br[k].cut, grp = parts[k];
          grp.visible = c < 1; grp.position.y = -c * 300 / U;
          for (const m of grp.userData.mats) m.opacity = 1 - c;
        }
      };
    },
    draw(g, t) {
      if (Kit.revealed(api, 'tree') && roadTamei()) G.ohelTint(g, [[300, 470], [520, 470], [530, 838], [290, 838]]);
      G.tag(g, api.L({ en: `✂ ${cuts} cut${cuts === 1 ? '' : 's'} left`, he: `✂ נשארו ${cuts}` }), 440, 150, { size: 15 });
      G.tag(g, api.L({ en: 'The road', he: 'הדרך' }), 400, 900, { size: 15 });
      pruner.draw(g, t); eli.draw(g, t); eli.drawBubble(g); pruner.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-4', pack: 'w1', title: { en: 'The Gardener\'s Tree', he: 'העץ של הגנן' },
  stages: [W1.gardenerShed, W1.pruneTree('eli', 'gad')],
  hints: [
    { en: 'Water calms bees, but the board under the barrel sends the water the wrong way. Think: board, barrel, door?', he: 'מים מרגיעים דבורים, אבל הקרש שמתחת לחבית מטה את המים הצידה. חשבו: קרש, חבית, דלת?' },
    { en: 'What makes the road impure is that one roof covers both the grave and the road. One cut can fix it. A rope is too thin to be a roof; thin twigs still count.', he: 'הדרך טמאה כי אוהל אחד מכסה גם את הקבר וגם את הדרך. גזימה אחת יכולה לתקן. חבל דק מדי מלהיות אוהל; ענפים דקים עדיין נחשבים.' },
  ],
  why: {
    text: {
      en: 'A dead person [מת] spreads impurity to everything under the same roof [אהל], and **strong branches are a roof** (Torah law). **Thin twigs** that couldn\'t hold up plaster still bring the tumah by Rabbinic law. A **rope** is thinner than a tefach [טפח], so it isn\'t a roof at all.\n\nA board held up by a person doesn\'t protect: people and vessels can bring tumah, but they can\'t block it.\n\nThe cleverest fix was one cut: the branch over the **grave**. Then nothing covers both the grave and the road.',
      he: 'מת מטמא כל מה שתחת אותו אוהל, **וענפים חזקים הם אוהל** מן התורה. **ענפים דקים** שאינם יכולים לקבל מעזיבה מביאים את הטומאה מדבריהם. **חבל** דק מטפח, ולכן אינו אוהל כלל.\n\nקרש שאדם מחזיק אינו מגן: אדם וכלים מביאים את הטומאה, אבל אינם חוצצים.\n\nהפתרון החכם ביותר היה גזימה אחת: הענף שמעל **הקבר**. ואז שום דבר אינו מכסה גם את הקבר וגם את הדרך.',
    },
    sources: [
      S('שָׂרִיגֵי הָאִילָנוֹת הַסּוֹכְכִים עַל הָאָרֶץ... אִם יְכוֹלִין לְקַבֵּל מַעֲזִיבָה בֵּינוֹנִית... מְבִיאִין וְחוֹצְצִין מִן הַתּוֹרָה. וְאִם אֵינָן רְאוּיִין... מְבִיאִין מִדִּבְרֵיהֶם וְאֵינָן חוֹצְצִין', 'Rambam, Hilchot Tumat Met 13:2', 'רמב"ם, הלכות טומאת מת יג, ב', 'Mishneh_Torah,_Defilement_by_a_Corpse.13.2'),
      S('שֶׁאֵין קָרוּי אֹהֶל אֶלָּא טֶפַח עַל טֶפַח בְּרוּם טֶפַח אוֹ יֶתֶר עַל זֶה', 'Rambam, Hilchot Tumat Met 12:1', 'רמב"ם, הלכות טומאת מת יב, א', 'Mishneh_Torah,_Defilement_by_a_Corpse.12.1'),
      S('אָדָם וְכֵלִים נַעֲשִׂין אֹהָלִין לְטַמֵּא, אֲבָל לֹא לְטַהֵר', 'Mishnah Oholot 6:1', 'משנה אהלות ו, א', 'Mishnah_Oholot.6.1'),
    ],
  },
});

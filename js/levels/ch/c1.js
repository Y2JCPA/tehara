/* C-1 · The Stones of the Altar (Mishnah Middot 1:6)
   Roll the stones the Greek kings defiled into the chamber of the Beit HaMoked.
   Two flaps: one must be switched, the other is a trap. */
CH.altarStones = api => {
  const tw = new Kit.Tweens();
  const pShelf = new Kit.Pin('shelf', 262, 236, 262, 330);
  const pA = new Kit.Pin('flapA', 470, 470, 350, 500);
  const pB = new Kit.Pin('flapB', 470, 610, 350, 636);
  const pDoor = new Kit.Pin('door', 238, 652, 238, 724);
  const stones = [0, 1, 2].map(i => ({ x: 80 + i * 56, y: 306, a: 0 }));
  const flapA = { a: 0, on: true }, flapB = { a: 0, on: true }, door = { open: 0 };
  const yehuda = new Chars.Actor('yehuda', 300, 860, { dir: -1 }), elder = new Chars.Actor('kohen', 360, 860, { dir: -1 });
  function release() {
    const toAltar = flapA.on, toFloor = !flapA.on && !flapB.on, doorOpen = pDoor.out;
    stones.forEach((s, i) => {
      const legs = [[262, 306], [330, 505]];
      if (toAltar) legs.push([420, 690], [470 - i * 12, 820 - i * 4]);
      else if (toFloor) legs.push([330, 640], [430, 760], [470 + i * 24, 838]);
      else { legs.push([330, 640], [222, 776]); if (doorOpen) legs.push([84 + i * 32, 814]); }
      let k = 0;
      const next = () => {
        const L = legs[k++];
        if (!L) {
          if (i < stones.length - 1) return;
          if (toAltar) { api.fail({ en: 'Those stones were defiled by the Greek kings [שקצום מלכי יון]. They can\'t go into the new Mizbeach [מזבח]!', he: 'את האבנים האלה שיקצו מלכי יוון. אי אפשר להשתמש בהן במזבח החדש!' }); return; }
          if (toFloor) { api.fail({ en: 'Now the stones are lying around the Mikdash! They have to be stored away [נגנזו] in the chamber.', he: 'עכשיו האבנים מפוזרות במקדש! צריך לגנוז אותן בלשכה.' }); return; }
          if (!doorOpen) { api.fail({ en: 'The chamber door is closed! Open it before the stones roll down.', he: 'דלת הלשכה סגורה! פתחו אותה לפני שהאבנים מתגלגלות.' }); return; }
          tw.to(door, { open: 0 }, 0.4, () => { yehuda.mood = 'happy'; api.say({ en: 'The old stones are stored away. Now we can build a new Mizbeach!', he: 'האבנים הישנות גנוזות. עכשיו אפשר לבנות מזבח חדש!' }, 'good'); setTimeout(() => api.complete(), 1200); });
          return;
        }
        tw.to(s, { x: L[0], y: L[1], a: s.a + 2 }, 0.33, next);
      };
      setTimeout(next, i * 380);
    });
  }
  return {
    intro: { en: 'The Greek kings defiled the stones of the Mizbeach [מזבח]. Roll them into the chamber of the Beit HaMoked [בית המוקד]. Not onto the new altar, and not onto the floor!', he: 'מלכי יוון שיקצו את אבני המזבח. גלגלו אותן ללשכה שבבית המוקד. לא למזבח החדש, ולא לרצפה!' },
    update(dt) { tw.update(dt); for (const p of [pShelf, pA, pB, pDoor]) p.update(dt); yehuda.update(dt); elder.update(dt); },
    down(p) {
      if (pA.hit(p)) { pA.pull(() => { flapA.on = false; tw.to(flapA, { a: 1.4 }, 0.4); }); return; }
      if (pB.hit(p)) { pB.pull(() => { flapB.on = false; tw.to(flapB, { a: -1.4 }, 0.4); }); return; }
      if (pDoor.hit(p)) { pDoor.pull(() => tw.to(door, { open: 1 }, 0.4)); return; }
      if (pShelf.hit(p)) pShelf.pull(() => release());
    },
    hot() { return { shelf: pShelf.ring, flapA: pA.ring, flapB: pB.ring, door: pDoor.ring }; },
    scene: { mode: 'indoor' },
    build(K) {
      CH.temple3d(K, { floor: 860, seed: 7 });
      const T3 = K.THREE;
      // the shelf and the ramps
      K.wall(40, 330, 222, 18, { mat: K.MAT.plank, z0: -0.4, z1: 0.6 });
      for (const [x1, y1, x2, y2] of [[262, 340, 336, 520], [338, 540, 470, 836], [330, 650, 220, 790], [338, 660, 440, 780]]) K.beam(x1, y1, x2, y2, { h: 14, d: 0.9, z: 0.05 });
      // the two flaps, each on a hinge
      const flap = (x, y, len, a0) => { const h = new T3.Group(); h.position.copy(K.P(x, y, 0.15)); const b = K.mesh(new T3.BoxGeometry(12 / K.U, len / K.U, 0.95), K.MAT.wood); b.position.y = -len / K.U / 2; h.add(b); h.userData.a0 = a0; K.scene.add(h); return h; };
      const fA = flap(336, 520, 92, -0.5), fB = flap(334, 640, 80, 0.55);
      // the chamber of the Beit HaMoked, with its door
      K.wall(18, 694, 222, 14, { mat: K.MAT.stoneSmooth, z0: -1.4, z1: 0.8 });
      K.recess(24, 708, 210, 152, { z: -1.6, mat: K.MAT.dark });
      for (const px of [18, 226]) K.wall(px, 708, 14, 152, { mat: K.MAT.stone, z0: -1.4, z1: 0.8 });
      const doorH = new T3.Group(); doorH.position.copy(K.P(224, 712, 0.3)); const dm = K.mesh(new T3.BoxGeometry(14 / K.U, 148 / K.U, 0.9), K.MAT.plank); dm.position.set(7 / K.U, -74 / K.U, 0); doorH.add(dm); K.scene.add(doorH);
      // the new altar: fresh whole white stones
      for (let i = 0; i < 3; i++) K.wall(412 + i * 36, 830, 30, 26, { mat: K.MAT.lime, z0: -0.3, z1: 0.5 });
      // the old defiled stones
      const st = stones.map(() => K.stoneBlock(44));
      this.sync = () => {
        fA.rotation.z = -(fA.userData.a0 + flapA.a); fA.visible = flapA.a < 1.4;
        fB.rotation.z = -(fB.userData.a0 + flapB.a); fB.visible = flapB.a > -1.4;
        doorH.rotation.y = door.open * 1.4;
        stones.forEach((s, i) => K.place(st[i], s.x, s.y, 0.45, s.a));
      };
    },
    draw(g, t) {
      G.tag(g, api.L({ en: 'Chamber of the Beit HaMoked', he: 'לשכה בבית המוקד' }), 128, 684, { size: 12 });
      g.setLineDash([10, 8]); G.rr(g, 400, 800, 130, 60, 4, null, 3, '#c0392b'); g.setLineDash([]);
      G.tag(g, api.L({ en: 'New Mizbeach', he: 'מזבח חדש' }), 465, 784, { size: 12 });
      for (const p of [pShelf, pA, pB, pDoor]) p.draw(g);
      elder.draw(g, t); yehuda.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-1', pack: 'ch', title: { en: 'The Stones of the Altar', he: 'אבני המזבח' },
  stages: [CH.altarStones],
  hints: [{ en: 'Follow each ramp with your finger. Which flap sends the stones the wrong way, and which one is already right? Open the chamber before anything rolls.', he: 'עקבו אחרי כל מסילה. איזה דש שולח את האבנים לכיוון הלא נכון, ואיזה כבר נכון? פתחו את הלשכה לפני שמשהו מתגלגל.' }],
  why: {
    text: {
      en: 'The Greek kings used the Mizbeach [מזבח] for idol worship, so its stones could never be used again.\n\nThe Chashmona\'im [חשמונאים] stored them away in a special chamber in the Beit HaMoked [בית המוקד] and built a new Mizbeach.',
      he: 'מלכי יוון שיקצו את אבני המזבח, ולכן אי אפשר היה להשתמש בהן עוד.\n\nבני חשמונאי גנזו אותן בלשכה שבבית המוקד ובנו מזבח חדש.',
    },
    sources: [S('מִזְרָחִית צְפוֹנִית, בָּהּ גָּנְזוּ בְנֵי חַשְׁמוֹנַאי אֶת אַבְנֵי הַמִּזְבֵּחַ שֶׁשִּׁקְּצוּם מַלְכֵי יָוָן', 'Mishnah Middot 1:6', 'משנה מידות א, ו', 'Mishnah_Middot.1.6')],
  },
});

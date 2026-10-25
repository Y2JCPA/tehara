/* 1-3 · The Bone Bridge
   A seesaw with a bone on its end (moving the plank moves the bone = carrying),
   a high log right over the bone (no ohel for a single bone: safe), and a low
   rope bridge under an overhang that also shelters a tomb (ohel). */
W1.boneBridge = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 56, 600);
  const pRope = new Kit.Pin('rope', 20, 150, 92, 150);
  const pStop = new Kit.Pin('stop', 520, 330, 520, 418);
  const log = { a: -Math.PI / 2, x: 110, slide: 0, gone: false };     // pivots at (110,470)
  const see = { a: 0 };
  const stop = { y: 380, down: false };
  const routes = new Kit.Routes([
    { id: 'log', box: [110, 420, 330, 80], glow: [[56, 600], [100, 470], [440, 470], [480, 600]] },
    { id: 'seesaw', box: [150, 560, 240, 90], glow: [[56, 600], [390, 600], [480, 600]] },
    { id: 'rope', box: [150, 730, 240, 80], glow: [[56, 600], [70, 780], [430, 780], [480, 600]] },
  ]);
  let going = false;

  function goNow() {
    if (going) return;
    if (!routes.sel) { api.say({ en: 'Tap a way across first.', he: 'הקישו קודם על דרך לעבור.' }); return; }
    if (routes.sel === 'log' && (log.a < -0.05 || log.gone)) { eli.talk(api.L({ en: 'The log isn\'t across yet!', he: 'הבול עוד לא מעבר לנקיק!' })); return; }
    going = true; api.setButtons([]);
    if (routes.sel === 'log') {
      eli.walk([[86, 600], [100, 470], [440, 470]], () => {
        const r = T.passOver('bone');
        if (!r.result) api.say({ en: 'Right over the bone, and Eli is still pure! A single bone doesn\'t spread tumah under a roof [אהל].', he: 'בדיוק מעל העצם, ואלי טהור! עצם אחת אינה מטמאה באוהל.' }, 'good', 4000);
        eli.walk([[470, 600], [500, 600]], () => { eli.mood = 'happy'; api.complete(); });
      });
      return;
    }
    if (routes.sel === 'seesaw') {
      eli.walk([[160, 600], [176, 598]], () => tw.to(see, { a: 0.2 }, 0.35, () => {
        if (T.moveViaPlank('bone').result) {
          eli.glow = 'tm'; eli.mood = 'oh';
          api.fail({ en: 'The plank tipped and lifted the bone. Moving a bone, even through a plank, counts like carrying it [משא]!', he: 'הקרש נטה והרים את העצם. הזזת עצם, אפילו דרך קרש, היא כמו משא!' });
        }
      }));
      return;
    }
    eli.walk([[70, 600]], () => eli.walk([[70, 780], [150, 780], [330, 786]], () => {
      Kit.reveal(api, 'overhang'); eli.glow = 'tm'; eli.mood = 'oh';
      if (T.conveys('grave', 'ohel').result) api.fail({ en: 'That rock overhang also covers a tomb in the cliff! Under one roof [אהל] with a grave, Eli became impure.', he: 'בליטת הסלע מכסה גם קבר שבצוק! תחת אוהל אחד עם קבר, אלי נטמא.' });
    }, 110));
  }
  return {
    intro: { en: 'Someone found a bone in the ravine. Three ways across: which one keeps Eli pure?', he: 'מישהו מצא עצם בנקיק. שלוש דרכים לעבור: איזו משאירה את אלי טהור?' },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pRope.update(dt); pStop.update(dt); eli.update(dt); },
    down(p) {
      if (going) return;
      if (pStop.hit(p)) { pStop.pull(() => tw.to(stop, { y: 446 }, 0.25, () => { stop.down = true; api.sfx('thunk'); })); return; }
      if (pRope.hit(p)) {
        pRope.pull(() => tw.to(log, { a: 0 }, 0.6, () => {
          api.sfx('thunk');
          if (!stop.down) tw.to(log, { slide: 120 }, 0.4, () => tw.to(log, { a: 1.2 }, 0.5, () => { log.gone = true; api.fail({ en: 'The log slid right off the ledge! Drop the stopper first so it has something to land against.', he: 'הבול החליק מהמדף! קודם הורידו את המעצור.' }); }));
        }));
        return;
      }
      routes.hit(p);
    },
    hot() { return { rope: pRope.ring, stop: pStop.ring, ...routes.hot() }; },
    scene: { mode: 'day', seed: 8 },
    build(K) {
      const T3 = K.THREE, U = K.U;
      K.recess(150, 470, 240, 700, { z: -2.2 });
      // the right wall of the ravine, with a tomb cut into it and a rock overhang above
      K.block(390, 600, 160, 380, { face: 'rock' });
      K.block(316, 724, 80, 300, { face: 'rock', top: 'none', z0: -1.9, z1: -0.4 });
      K.recess(330, 740, 70, 66, { z: -0.3, mat: K.MAT.dark });
      const gl = K.mesh(new T3.CylinderGeometry(26 / U, 26 / U, 0.2, 28), K.std(0xe4d6b8, { roughness: 0.9, map: K.TEX.lime })); gl.rotation.x = Math.PI / 2; gl.position.copy(K.P(380, 776, 0.0)); K.scene.add(gl);
      const oh = new T3.Shape(); [[392, 690], [250, 700], [240, 716], [392, 724]].forEach(([x, y], i) => i ? oh.lineTo(x / U, -y / U) : oh.moveTo(x / U, -y / U)); oh.closePath();
      const ohm = K.mesh(new T3.ExtrudeGeometry(oh, { depth: 3.1, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }), K.MAT.rock); ohm.position.z = -1.8; K.scene.add(ohm);
      // the left wall and the two grassy banks, with stairs down to the low ledges
      K.block(-10, 600, 160, 380, { face: 'rock' });
      K.block(-10, 470, 120, 132, { z0: -1.8, z1: -0.55 });
      K.block(430, 470, 120, 132, { z0: -1.8, z1: -0.55 });
      K.stairs(110, 470, 4, { stepW: 10, stepH: 32, dir: 1, thick: 14 });
      K.stairs(430, 470, 4, { stepW: 10, stepH: 32, dir: -1, thick: 14 });
      // low ledges, ladders down the rock face, and the rope bridge
      K.wall(100, 786, 52, 14, { mat: K.MAT.rock, z0: 0.3, z1: 1.3 }); K.wall(390, 806, 44, 14, { mat: K.MAT.rock, z0: 0.3, z1: 1.3 });
      K.ladder(70, 600, 790, { w: 28, z: 0.85 }); K.ladder(470, 600, 806, { w: 28, z: 0.85 });
      for (const zz of [0.5, 1.25]) { K.rope(150, 776, 392, 776, { sag: 16, z: zz }); K.rope(150, 790, 392, 790, { sag: 16, z: zz }); }
      for (let x = 156; x < 390; x += 16) { const sl = K.mesh(new T3.BoxGeometry(12 / U, 6 / U, 0.8), K.MAT.plank); sl.position.copy(K.P(x + 6, 783 + Math.sin((x + 6 - 150) / 242 * Math.PI) * 13, 0.88)); K.scene.add(sl); }
      // the pivot rock and the seesaw, with the bone on its far end
      const pv = new T3.Shape(); [[244, 960], [296, 960], [282, 616], [258, 616]].forEach(([x, y], i) => i ? pv.lineTo(x / U, -y / U) : pv.moveTo(x / U, -y / U)); pv.closePath();
      const pvm = K.mesh(new T3.ExtrudeGeometry(pv, { depth: 1.0, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 }), K.MAT.rock); pvm.position.z = -0.5; K.scene.add(pvm);
      const saw = new T3.Group(); saw.position.copy(K.P(270, 610, 0.1)); K.scene.add(saw);
      const pl = K.plank(250, 14); K.scene.remove(pl); saw.add(pl);
      const bn = K.bone(1.7); K.scene.remove(bn); bn.position.set(104 / U, 16 / U, 0); bn.rotation.z = -0.2; saw.add(bn);
      // the sign by the place the bone fell
      const [sx, sy] = W1.unproj(470, 900, 0.95); const sg = K.signBoard(sx, sy, 120 * 0.97, 33 * 0.97); sg.position.z = 0.95;
      // the stopper, hanging on a string from the pin
      const stopper = K.mesh(K.slab(22 / U, 26 / U, 0.6, 0.04, 0.02), K.std(0xa99478, { roughness: 0.9, map: K.TEX.rock })); K.scene.add(stopper);
      const string = K.mesh(new T3.CylinderGeometry(0.015, 0.015, 1, 6), K.std(0x6b4a22)); K.scene.add(string);
      // the log on its pivot, and the rope from its top to the pin
      const lg = new T3.Group(); const lm = K.log(330); K.scene.remove(lm); lm.position.x = 165 / U; lg.add(lm); K.scene.add(lg);
      const rope = K.mesh(new T3.CylinderGeometry(0.03, 0.03, 1, 6), K.std(0xc8a36a, { roughness: 1 })); K.scene.add(rope);
      // a little flag on the far side
      const fl = new T3.Group(); fl.add(K.mesh(new T3.CylinderGeometry(0.025, 0.025, 1.1, 8), K.MAT.wood, 0, 0.55, 0));
      const tri = new T3.Shape(); tri.moveTo(0, 0); tri.lineTo(0.5, -0.16); tri.lineTo(0, -0.32); tri.closePath();
      fl.add(K.mesh(new T3.ExtrudeGeometry(tri, { depth: 0.02, bevelEnabled: false }), K.std(0xe5484d, { side: T3.DoubleSide }), 0.02, 1.08, 0));
      fl.position.copy(K.P(506, 600, -0.4)); K.scene.add(fl);
      const seg = (m, x1, y1, x2, y2, z) => { const L = Math.hypot(x2 - x1, y2 - y1) / U; m.scale.set(1, L, 1); m.position.copy(K.P((x1 + x2) / 2, (y1 + y2) / 2, z)); m.rotation.set(0, 0, Math.atan2(x2 - x1, y2 - y1)); };
      this.sync = (t) => {
        eli.z = eli.y > 602 ? 0.95 : 0.05;
        saw.rotation.z = -see.a;
        stopper.position.copy(K.P(448, stop.y + 26, 0.0));
        string.visible = !stop.down; if (!stop.down) seg(string, 459, 330, 459, stop.y, 0.3);
        lg.visible = !log.gone;
        const ang = log.a, px = 110 + log.slide;
        K.place(lg, px, 458, 0.2, ang);
        rope.visible = !log.gone && !pRope.out;
        if (rope.visible) seg(rope, 92, 150, px + Math.cos(ang) * 330, 470 + Math.sin(ang) * 330, 0.3);
        fl.rotation.y = Math.sin(t / 500) * 0.2;
      };
    },
    draw(g, t) {
      if (Kit.revealed(api, 'overhang')) G.ohelTint(g, [[240, 716], [392, 716], [392, 806], [240, 806]]);
      G.text(g, api.L({ en: 'A bone fell here', he: 'כאן נפלה עצם' }), 470, 900 - 33 + 10 + 8.5, { size: 13, color: '#3b2210' });
      routes.draw(g, t);
      pRope.draw(g); pStop.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-3', pack: 'w1', title: { en: 'The Bone Bridge', he: 'גשר העצם' },
  stages: [W1.boneBridge],
  hints: [{ en: 'Walking over a single bone is OK, but moving it is not. And what is hiding under that rock overhang? For the log: drop the stopper before you let the log fall.', he: 'מעבר מעל עצם אחת מותר, אבל הזזתה לא. ומה מסתתר מתחת לבליטת הסלע? ובבול: הורידו את המעצור לפני שמפילים את הבול.' }],
  why: {
    text: {
      en: 'A single bone from a person, even as small as a grain of barley [עצם כשעורה], makes you impure [טמא] if you **touch** it or **move** it. Pressing one end of a plank that the bone lies on moves it, so it counts as carrying [היסט].\n\nBut a single bone does **not** spread tumah under a roof [אהל], so walking right over it on the log is fine!\n\nThe rope bridge had no bones at all, but the rock overhang above it also covered a **tomb**. A grave does spread tumah under a roof.',
      he: 'עצם אחת של אדם, אפילו כשעורה, מטמאה **במגע ובמשא**. הנדת קרש שהעצם מונחת עליו היא כמו משא (היסט).\n\nאבל עצם אחת **אינה מטמאה באוהל**, ולכן מותר לעבור על הבול בדיוק מעליה!\n\nבגשר החבלים לא היו עצמות, אבל בליטת הסלע שמעליו מכסה גם **קבר**, וקבר מטמא באוהל.',
    },
    sources: [
      S('אֲפִלּוּ עֶצֶם כִּשְׂעוֹרָה מְטַמֵּא בְּמַגָּע וּבְמַשָּׂא... וְאֵינוֹ מְטַמֵּא בְּאֹהֶל', 'Rambam, Hilchot Tumat Met 2:10', 'רמב"ם, הלכות טומאת מת ב, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.2.10'),
      S('קוֹרָה שֶׁהִיא מֻנַּחַת עַל הַכֹּתֶל... וּבָא הַטָּהוֹר לִקְצֵה הַקּוֹרָה הַשֵּׁנִי וְהֵנִידוֹ... טָמֵא מִשּׁוּם נוֹשֵׂא', 'Rambam, Hilchot Tumat Met 1:7', 'רמב"ם, הלכות טומאת מת א, ז', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.7'),
      S('אֲבָנִים הַיּוֹצְאוֹת מִן הַגָּדֵר הַסּוֹכְכוֹת עַל הָאָרֶץ... הֲרֵי אֵלּוּ מְבִיאִין וְחוֹצְצִין מִן הַתּוֹרָה', 'Rambam, Hilchot Tumat Met 13:2', 'רמב"ם, הלכות טומאת מת יג, ב', 'Mishneh_Torah,_Defilement_by_a_Corpse.13.2'),
    ],
  },
});

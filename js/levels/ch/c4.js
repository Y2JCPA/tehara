/* C-4 · Oil Is a Liquid (Rambam She'ar Avot HaTumot 7:5, 8:1)
   A liquid that touches anything impure becomes a "first", even from a "second".
   Two gates to set, hands to wash. Decoys: a scary dead mouse on a shelf ABOVE
   one channel (fine: a sheretz doesn't spread under a roof) and an innocent
   puddle on the other (impure water makes the oil impure). */
CH.press = api => {
  const T = api.T;
  const p0 = new Kit.Pin('press', 340, 306, 286, 306);
  const g1 = new Kit.Pin('gate1', 196, 380, 256, 396);
  const g2 = new Kit.Pin('gate2', 470, 448, 400, 476);
  const worker = new Chars.Actor('helper', 336, 872, { dir: -1 }); worker.badge = 2;
  const yehuda = new Chars.Actor('yehuda', 120, 872);
  const R = {
    left: [[270, 300], [270, 400], [150, 500], [150, 700], [250, 800]],
    puddle: [[270, 300], [270, 400], [390, 480], [470, 580], [470, 720], [300, 800]],
    mouse: [[270, 300], [270, 400], [390, 480], [350, 580], [350, 720], [290, 800]],
  };
  const HAZ = { left: { k: 0.45, kind: 'loaf' }, puddle: { k: 0.55, kind: 'puddle' }, mouse: { k: 0.5, kind: 'mouse' } };
  let gate1 = 'left', gate2 = 'puddle', flow = null, washed = false, busy = false, saidMouse = false;
  const route = () => gate1 === 'left' ? 'left' : gate2;
  function along(pts, k) {
    const segs = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
    let want = k * tot; const out = [pts[0]];
    for (let i = 0; i < segs.length; i++) { if (want <= segs[i]) { const f = want / segs[i]; out.push([Kit.lerp(pts[i][0], pts[i + 1][0], f), Kit.lerp(pts[i][1], pts[i + 1][1], f)]); return out; } want -= segs[i]; out.push(pts[i + 1]); }
    return out;
  }
  function wash() {
    if (busy || washed) return; busy = true;
    worker.walk([[470, 872]], () => {
      api.sfx('splash'); washed = T.hands(true).level === 'tahor'; worker.badge = null;
      api.say({ en: 'Netilat yadayim [נטילת ידיים]: now his hands are pure.', he: 'נטילת ידיים: עכשיו ידיו טהורות.' }, 'good');
      worker.walk([[336, 872]], () => { busy = false; });
    });
  }
  return {
    intro: { en: 'Pure oil for the Menorah! Get it into the jar without touching anything impure [טמא]. Remember: oil is a liquid [משקה].', he: 'שמן טהור למנורה! הביאו אותו לכד בלי שייגע בשום דבר טמא. זכרו: שמן הוא משקה.' },
    update(dt) {
      for (const p of [p0, g1, g2]) p.update(dt); worker.update(dt); yehuda.update(dt);
      if (!flow || flow.done) return;
      flow.k = Math.min(1, flow.k + dt * 0.3);
      const hz = HAZ[flow.route];
      if (flow.k >= hz.k && !flow.passed) {
        flow.passed = true;
        if (hz.kind === 'loaf') { flow.level = T.liquidTouches(2).level; flow.done = true; api.fail({ en: 'The oil touched a loaf that is a "second" [שני]. Liquids always become a "first" [ראשון], even from a second!', he: 'השמן נגע בכיכר שהיא שני. משקין נעשים ראשון תמיד, אפילו משני!' }); return; }
        if (hz.kind === 'puddle') { flow.level = T.liquidTouches(1).level; flow.done = true; api.fail({ en: 'That puddle is impure water (a loaf that was a "second" fell into it). The oil mixed with it and became a "first" [ראשון]!', he: 'השלולית הזאת היא מים טמאים (כיכר שהייתה שני נפלה לתוכה). השמן נגע בהם ונעשה ראשון!' }); return; }
        if (hz.kind === 'mouse' && !saidMouse) { saidMouse = true; if (!T.passOver('sheretz').result) api.say({ en: 'The dead mouse is on a shelf above the oil, not touching it. A sheretz [שרץ] doesn\'t spread tumah under a roof, so the oil is fine!', he: 'העכבר המת על מדף מעל השמן ואינו נוגע בו. שרץ אינו מטמא באוהל, והשמן בסדר!' }, 'good', 4200); }
      }
      if (flow.k >= 1) {
        flow.done = true;
        if (!washed) { flow.level = T.liquidTouches(T.hands(false).level).level; api.fail({ en: 'The worker\'s hands touched the oil before he washed them. Unwashed hands are a "second" [שני], so the oil became a "first"!', he: 'ידי הפועל נגעו בשמן לפני נטילה. ידיים סתם שניות, והשמן נעשה ראשון!' }); return; }
        api.say({ en: 'The oil is in the jar, still pure!', he: 'השמן בכד, והוא טהור!' }, 'good'); setTimeout(() => api.complete(), 1100);
      }
    },
    down(p) {
      if (p0.hit(p)) { p0.pull(() => { flow = { k: 0, route: route(), level: 'tahor' }; }); return; }
      if (g1.hit(p)) { g1.pull(() => { gate1 = 'right'; api.sfx('thunk'); }); return; }
      if (g2.hit(p)) { g2.pull(() => { gate2 = 'mouse'; api.sfx('thunk'); }); return; }
      if (Kit.near(p, 470, 816, 46)) wash();
    },
    hot() { return { press: p0.ring, gate1: g1.ring, gate2: g2.ring, wash: [470, 816] }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 101, y: 200 });
      G.stoneWall(g, 0, 300, 540, 580, { block: 44, seed: 17 });
      G.rr(g, -4, 880, 548, 90, 0, G.lin(g, 0, 880, 0, 960, [[0, '#e6d3a6'], [1, '#bfa572']]), 2.5, G.C.mortar);
      // press
      G.rr(g, 180, 200, 180, 100, 14, G.lin(g, 0, 200, 0, 300, [[0, G.C.rockLight], [1, G.C.rockDark]]), 2.5, G.C.rockDark);
      G.rr(g, 196, 214, 148, 60, 10, G.lin(g, 0, 214, 0, 274, [[0, '#f2d36b'], [1, '#c99a20']]), 0);
      G.line(g, 150, 188, 400, 168, 18, G.C.woodDark); G.line(g, 150, 188, 400, 168, 12, G.C.wood);
      G.tag(g, api.L({ en: 'Olive press', he: 'בית הבד' }), 270, 150, { size: 14 });
      for (const k of ['left', 'puddle', 'mouse']) { G.path(g, R[k]); g.lineWidth = 24; g.strokeStyle = '#4f4436'; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); g.lineWidth = 16; g.strokeStyle = '#8e7f66'; g.stroke(); }
      // gates
      g.save(); g.translate(270, 400); g.rotate(gate1 === 'left' ? 0.7 : -0.7); G.rr(g, -5, 0, 10, 56, 3, G.C.wood, 2.5, G.C.woodDark); g.restore();
      g.save(); g.translate(390, 480); g.rotate(gate2 === 'puddle' ? -0.2 : 0.75); G.rr(g, -5, 0, 10, 56, 3, G.C.wood, 2.5, G.C.woodDark); g.restore();
      // hazards
      G.loaf(g, 150, 580, 0.8); G.badge(g, 178, 556, 2);
      G.ell(g, 470, 650, 30, 14, G.lin(g, 0, 636, 0, 664, [[0, G.C.waterLight], [1, G.C.water]]), 2, G.C.waterDark); G.badge(g, 500, 630, 1);
      G.rr(g, 310, 590, 90, 10, 2, G.C.woodLight, 2, G.C.woodDark); G.line(g, 316, 600, 316, 620, 3, G.C.woodDark); G.line(g, 394, 600, 394, 620, 3, G.C.woodDark); G.deadMouse(g, 356, 580, 0.8);
      // flowing oil
      if (flow) { const pts = along(R[flow.route], flow.k); G.path(g, pts); g.lineWidth = 10; g.strokeStyle = '#f2c94c'; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); if (flow.level === 1) { const e = pts[pts.length - 1]; G.tumahGlow(g, e[0], e[1], 50, 1, t); G.badge(g, e[0] + 22, e[1] - 22, 1); } }
      G.jar(g, 270, 852, 1.05, { oil: !!flow });
      G.rr(g, 440, 820, 60, 26, 8, G.lin(g, 0, 820, 0, 846, [[0, '#cfd6dd'], [1, '#7b8794']]), 2.5, '#3f4852'); G.cup(g, 470, 814, 0.55, 'stone');
      G.tag(g, api.L({ en: 'Wash', he: 'נטילה' }), 470, 776, { size: 12 });
      for (const p of [p0, g1, g2]) p.draw(g);
      yehuda.draw(g, t); worker.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-4', pack: 'ch', title: { en: 'Oil Is a Liquid', he: 'שמן הוא משקה' },
  stages: [CH.press],
  hints: [{ en: 'The oil must not touch the loaf or the puddle. The dead mouse is only above the channel: does a sheretz spread tumah under a roof? And wash the worker\'s hands before the oil comes.', he: 'השמן אסור שייגע בכיכר או בשלולית. העכבר המת רק מעל התעלה: האם שרץ מטמא באוהל? וטלו את ידי הפועל לפני שהשמן מגיע.' }],
  why: {
    text: {
      en: 'Oil is a liquid [משקה]. If a liquid touches anything impure [טמא], even something weak like a "second" [שני], the liquid becomes a strong "first" [ראשון]. That\'s why the loaf, the puddle and unwashed hands (a Rabbinic "second") were all dangerous.\n\nBut the dead mouse on the shelf was not: a sheretz [שרץ] only makes things impure by touching them. It doesn\'t spread under a roof.',
      he: 'שמן הוא משקה. משקין שנגעו בטומאה, **אפילו בשני**, נעשים ראשון. לכן הכיכר, השלולית וידיים שלא נטלו (שניות מדברי סופרים) היו מסוכנות.\n\nאבל העכבר המת על המדף לא: שרץ מטמא רק במגע, ואינו מטמא באוהל.',
    },
    sources: [
      S('אֲבָל הַמַּשְׁקִין אֶחָד מַשְׁקֶה שֶׁנָּגַע בְּאַב הַטֻּמְאָה אוֹ שֶׁנָּגַע בְּרִאשׁוֹן אוֹ בְשֵׁנִי... הֲרֵי הוּא רִאשׁוֹן', 'Rambam, Hilchot She\'ar Avot HaTumot 7:5', 'רמב"ם, הלכות שאר אבות הטומאות ז, ה', 'Mishneh_Torah,_Other_Sources_of_Defilement.7.5'),
      S('כָּל הַפּוֹסֵל אֶת הַתְּרוּמָה, מְטַמֵּא אֶת הַמַּשְׁקִין לִהְיוֹת תְּחִלָּה', 'Mishnah Parah 8:7', 'משנה פרה ח, ז', 'Mishnah_Parah.8.7'),
      S('וְטֻמְאַת הַיָּדָיִם מִדִּבְרֵי סוֹפְרִים', 'Rambam, Hilchot She\'ar Avot HaTumot 8:1', 'רמב"ם, הלכות שאר אבות הטומאות ח, א', 'Mishneh_Torah,_Other_Sources_of_Defilement.8.1'),
      S('טֻמְאַת אֹהֶל אֵינָהּ בִּשְׁאָר טֻמְאוֹת אֶלָּא בְּמֵת בִּלְבַד', 'Rambam, Hilchot Tumat Met 1:10', 'רמב"ם, הלכות טומאת מת א, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.10'),
    ],
  },
});

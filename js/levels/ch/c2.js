/* C-2 · They Searched (Shabbat 21b)
   Find the one jug sealed with the Kohen Gadol's seal, hidden and unmoved.
   Decoys: broken seals, drag marks in the dust, and a second hidden niche. */
CH.search = api => {
  const T = api.T, tw = new Kit.Tweens();
  const rooms = [{ y: 150, h: 230 }, { y: 400, h: 230 }, { y: 650, h: 230 }];
  const hA = new Kit.Pin('hatchA', 500, 392, 420, 392), hB = new Kit.Pin('hatchB', 500, 642, 420, 642);
  const open = [true, false, false];
  const jugs = [
    { id: 'j1', room: 0, x: 90, y: 360, smashed: true, props: { sealed: false } },
    { id: 'j2', room: 0, x: 200, y: 360, look: {}, props: { sealed: false } },
    { id: 'j3', room: 0, x: 310, y: 360, look: { seal: 'broken' }, props: { sealed: true, intact: false } },
    { id: 'j4', room: 1, x: 140, y: 610, look: { seal: 'kg' }, drag: true, props: { sealed: true, intact: true, moved: true } },
    { id: 'j5', room: 1, x: 300, y: 610, look: { loose: true }, props: { sealed: false } },
    { id: 'j6', room: 2, x: 120, y: 860, look: { seal: 'kg' }, hidden: 3, drag: true, props: { sealed: true, intact: true, moved: true } },
    { id: 'j7', room: 2, x: 390, y: 860, look: { seal: 'kg' }, hidden: 3, props: { sealed: true, intact: true, moved: false } },
  ];
  const yehuda = new Chars.Actor('yehuda', 430, 370, { dir: -1, hold: 'lamp' });
  let light = { x: 270, y: 260 }, sel = null, done = false;
  const REASON = {
    noSeal: { en: 'No seal at all, so nobody can know it wasn\'t touched. The Greeks made all the oil they touched impure [טמא].', he: 'אין חותם, ואין לדעת שלא נגעו בו. היוונים טימאו את כל השמנים שנגעו בהם.' },
    broken: { en: 'The seal is broken: someone opened this jug.', he: 'החותם שבור: מישהו פתח את הפך.' },
    moved: { en: 'Look at the drag marks in the dust: a soldier moved this jug. The Sages ruled that even moving it made it impure [טמא].', he: 'ראו את סימני הגרירה באבק: חייל הזיז את הפך הזה, וחכמים גזרו שגם הזזה מטמאה.' },
  };
  const DESC = {
    j1: { en: 'A smashed jug.', he: 'פך שבור.' },
    j2: { en: 'An open jug, no seal.', he: 'פך פתוח, בלי חותם.' },
    j3: { en: 'The Kohen Gadol\'s seal, but cracked.', he: 'חותם של כהן גדול, אבל סדוק.' },
    j4: { en: 'The Kohen Gadol\'s seal, whole… and there are long scrape marks in the dust beside it.', he: 'חותם של כהן גדול, שלם… ויש סימני גרירה ארוכים באבק לידו.' },
    j5: { en: 'A cloth tied on top. No seal.', he: 'בד קשור מלמעלה. אין חותם.' },
    j6: { en: 'A hidden niche! The Kohen Gadol\'s seal, whole. But the dust in the niche is scraped…', he: 'גומחה נסתרת! חותם של כהן גדול, שלם. אבל האבק בגומחה גרוף…' },
    j7: { en: 'A hidden niche! The Kohen Gadol\'s seal, whole, and the dust around it smooth and untouched.', he: 'גומחה נסתרת! חותם של כהן גדול, שלם, והאבק סביבו חלק ולא נגוע.' },
  };
  function inspect(j) {
    sel = j; api.sfx('tap'); api.say(DESC[j.id], 'info', 4200);
    api.setButtons([
      { id: 'bring', label: { en: 'Bring this jug', he: 'הביאו את הפך הזה' }, cls: 'btn-green', onClick: () => choose(j) },
      { id: 'keep', label: { en: 'Keep looking', he: 'להמשיך לחפש' }, cls: 'btn-navy', onClick: () => { sel = null; api.setButtons([]); } },
    ]);
  }
  function choose(j) {
    if (done) return; done = true; api.setButtons([]);
    const r = T.jugIsPure(j.props);
    if (!r.pure) { api.fail(REASON[r.reason]); return; }
    api.say({ en: 'Pure oil [שמן טהור]! But only enough for one day…', he: 'שמן טהור! אבל רק ליום אחד…' }, 'good');
    tw.to(j, { y: j.y - 40 }, 0.6, () => setTimeout(() => api.complete(), 900));
  }
  return {
    intro: { en: 'The Greeks made the oil impure [טמא]. Search the storerooms for a jug that is still pure! Tap to shine your lamp.', he: 'היוונים טימאו את השמנים. חפשו במחסנים פך שעדיין טהור! הקישו כדי להאיר.' },
    update(dt) { tw.update(dt); hA.update(dt); hB.update(dt); yehuda.update(dt); },
    down(p) {
      if (done) return;
      if (hA.hit(p)) { hA.pull(() => { open[1] = true; api.sfx('thunk'); }); return; }
      if (open[1] && hB.hit(p)) { hB.pull(() => { open[2] = true; api.sfx('thunk'); }); return; }
      const ri = rooms.findIndex(r => p.y >= r.y && p.y <= r.y + r.h);
      if (ri < 0 || !open[ri]) return;
      light = { x: p.x, y: p.y };
      for (const j of jugs) {
        if (j.room !== ri) continue;
        if (j.hidden && Kit.near(p, j.x, j.y - 30, 60)) { j.hidden--; api.sfx('thunk'); if (!j.hidden) api.say({ en: 'A hidden niche behind the stones!', he: 'גומחה נסתרת מאחורי האבנים!' }); return; }
        if (!j.hidden && Kit.near(p, j.x, j.y - 26, 40)) { inspect(j); return; }
      }
    },
    hot() { const h = { hatchA: hA.ring, hatchB: hB.ring }; for (const j of jugs) h[j.id] = [j.x, j.y - 26]; return h; },
    scene: { mode: 'indoor' },
    build(K) {
      const T3 = K.THREE, M = K.MAT;
      K.room({ floor: 900, seed: 13, lamps: false });
      // the storerooms: dark plastered cellars cut into the stone, one under the other
      const plaster = K.std(0x8a6a48, { roughness: 1, map: K.TEX.lime });
      const front = { mat: M.stone, z0: -0.7, z1: 0.8 };
      K.wall(-10, 0, 560, 150, front);
      K.wall(-10, 150, 34, 760, front); K.wall(516, 150, 34, 760, front);
      rooms.forEach((r, i) => {
        K.recess(24, r.y, 492, r.h, { z: -1.6, mat: plaster });
        for (const [x, w] of [[24, 14], [502, 14]]) K.wall(x, r.y, w, r.h, { mat: plaster, z0: -1.6, z1: -0.7 });
        K.wall(24, r.y, 492, 12, { mat: M.plank, z0: -1.6, z1: 0.4 });          // ceiling beams
        K.wall(24, r.y + r.h - 14, 492, i < 2 ? 34 : 70, { mat: M.floor, z0: -1.6, z1: 0.8 });   // floor
      });
      // the hatches down to the next room, and the ladders under them
      const hatch = [0, 1].map(i => { const r = rooms[i]; K.recess(410, r.y + r.h - 6, 100, 16, { z: 0.82, mat: M.dark }); return K.wall(408, r.y + r.h - 8, 104, 14, { mat: M.plank, z0: -1.4, z1: 0.95 }); });
      const ladders = [1, 2].map(i => K.ladder(460, rooms[i].y - 12, rooms[i].y + rooms[i].h - 14, { w: 26, z: 0.2 }));
      // the jugs, and the stones hiding the two niches
      const objs = jugs.map(j => {
        const o = j.smashed ? CH.shards(K, j.x, j.y) : K.place(CH.jar3d(K, j.look, 1.15), j.x, j.y, -0.2);
        const hide = [];
        if (j.hidden) for (let k = 0; k < j.hidden; k++) hide.push(K.wall(j.x - 48 + k * 30, j.y - 66 + (k % 2) * 20, 42, 66, { mat: K.std(0xcdbb92, { roughness: 0.9, map: K.TEX.lime }), z0: 0.1, z1: 0.7 }));
        return { j, o, hide };
      });
      // Yehuda's lamp lights the room where you tap
      const lamp = new T3.PointLight(0xffc070, 9, 7, 1.4); K.scene.add(lamp);
      this.sync = () => {
        hatch[0].visible = !hA.out; hatch[1].visible = !hB.out;
        ladders[0].visible = open[1]; ladders[1].visible = open[2];
        for (const { j, o, hide } of objs) { o.visible = open[j.room]; hide.forEach((h, k) => { h.visible = open[j.room] && k < j.hidden; }); if (!j.smashed) K.place(o, j.x, j.y, -0.2); }
        lamp.position.copy(K.P(light.x, light.y - 40, 1.2));
      };
    },
    draw(g, t) {
      G.tag(g, api.L({ en: 'Storerooms under the Heichal', he: 'מחסנים תחת ההיכל' }), 270, 128, { size: 14 });
      for (const j of jugs) {
        if (!open[j.room]) continue;
        if (j.drag) for (let k = 0; k < 5; k++) G.line(g, j.x + 34 + k * 16, j.y + 2 + (k % 2) * 4, j.x + 46 + k * 16, j.y + 2 + (k % 2) * 4, 3, 'rgba(250,230,190,0.75)');
        if (!j.drag && !j.smashed) for (let k = 0; k < 6; k++) G.circ(g, j.x - 30 + k * 12, j.y + 4, 1.5, 'rgba(250,230,190,0.35)', 0);
        if (sel === j) G.circ(g, j.x, j.y - 24, 46, null, 4, G.C.gold);
      }
      g.save(); g.beginPath(); g.rect(0, 0, 540, 960);
      for (let i = 0; i < 3; i++) if (open[i]) { const r = rooms[i]; g.rect(24, r.y, 492, r.h); }
      g.fillStyle = 'rgba(8,6,14,0.86)'; g.fill('evenodd'); g.restore();
      g.fillStyle = G.rad(g, light.x, light.y, 40, 280, [[0, 'rgba(255,220,140,0)'], [1, 'rgba(14,8,2,0.4)']]); g.fillRect(0, 140, 540, 760);
      hA.draw(g); if (open[1]) hB.draw(g);
      yehuda.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-2', pack: 'ch', title: { en: 'They Searched', he: 'בדקו' },
  stages: [CH.search],
  hints: [{ en: 'A whole Kohen Gadol\'s seal is not enough: look at the dust around each jug. Was it moved? There are two hidden niches in the lowest room.', he: 'חותם שלם של כהן גדול אינו מספיק: הסתכלו על האבק סביב כל פך. האם הזיזו אותו? בחדר התחתון יש שתי גומחות נסתרות.' }],
  why: {
    text: {
      en: 'When the Greeks entered the Heichal [היכל], they made all the oil impure [טמא].\n\nThe Chashmona\'im **searched** and found just one jug lying with the Kohen Gadol\'s seal [חותמו של כהן גדול]. It was hidden and sealed, so they knew nobody had touched it. (Tosafot explain it was hidden away so it hadn\'t even been moved.) It had enough oil for just one day.',
      he: 'כשנכנסו יוונים להיכל טימאו כל השמנים שבהיכל.\n\n**בדקו** ולא מצאו אלא פך אחד של שמן שהיה מונח בחותמו של כהן גדול, בהצנע, והכירו שלא נגעו בו. (ותוספות מבארים שהיה טמון, ולכן גם לא הוזז.) ולא היה בו אלא להדליק יום אחד.',
    },
    sources: [
      S('שֶׁכְּשֶׁנִּכְנְסוּ יְוָונִים לַהֵיכָל טִמְּאוּ כׇּל הַשְּׁמָנִים שֶׁבַּהֵיכָל... בָּדְקוּ וְלֹא מָצְאוּ אֶלָּא פַּךְ אֶחָד שֶׁל שֶׁמֶן שֶׁהָיָה מוּנָּח בְּחוֹתָמוֹ שֶׁל כֹּהֵן גָּדוֹל', 'Shabbat 21b', 'שבת כא ע"ב', 'Shabbat.21b.10'),
      S('בחותמו – בהצנע וחתום בטבעתו והכיר שלא נגעו בו', 'Rashi on Shabbat 21b', 'רש"י שבת כא ע"ב', 'Rashi_on_Shabbat.21b.10.2'),
      S(null, 'Tosafot on Shabbat 21b, on whether the soldiers moved the jug', 'תוספות שבת כא ע"ב, בעניין הזזת הפך', 'Tosafot_on_Shabbat.21b.10.1'),
    ],
  },
});

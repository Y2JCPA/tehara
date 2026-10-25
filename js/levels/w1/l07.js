/* 1-7 · The Washed-Away Mark
   Mark doubtful places with lime, a little wider than the tumah but not much.
   Don't mark a well-known cemetery or an exact k'zayit (Rambam Tumat Met 8:9). */
W1.limeMarks = api => {
  const T = api.T;
  const spots = [
    { id: 'field', kind: 'lostGrave', cx: 150, cy: 330, rx: 92, ry: 54, label: { en: 'A grave was lost here', he: 'כאן אבד קבר' } },
    { id: 'cemetery', kind: 'knownCemetery', cx: 405, cy: 330, rx: 96, ry: 56, label: { en: 'The village cemetery', he: 'בית הקברות של הכפר' } },
    { id: 'branch', kind: 'branches', cx: 400, cy: 566, rx: 68, ry: 30, label: { en: 'Branches over a grave', he: 'ענפים מעל קבר' } },
    { id: 'stone', kind: 'juttingStone', cx: 140, cy: 644, rx: 60, ry: 26, label: { en: 'A stone jutting over a grave', he: 'אבן בולטת מעל קבר' } },
    { id: 'kzayit', kind: 'kzayit', cx: 290, cy: 744, rx: 32, ry: 16, label: { en: 'An olive-sized bit [כזית] of a met', he: 'כזית מן המת' } },
  ].map(s => ({ ...s, on: false, s: 0.75 }));
  const batya = new Chars.Actor('batya', 300, 470, { hold: 'bucket', dir: -1 });
  const zev = new Chars.Actor('zevulun', 480, 470, { dir: -1 });
  const pilgrims = [new Chars.Actor('pilgrimA', -40, 880), new Chars.Actor('pilgrimB', -110, 880), new Chars.Actor('farmer', 34, 520)];
  let drag = null, going = false;
  const handle = s => [s.cx + s.rx * s.s, s.cy];
  const WHY = {
    known: { en: 'Don\'t mark the cemetery! Everyone knows where it is. Lime marks are only for places people might not know about.', he: 'אל תציינו את בית הקברות! הכול יודעים היכן הוא. מציינים רק על הספקות.' },
    shrinks: { en: 'Don\'t mark an exact k\'zayit [כזית]: it will shrink in the ground, and then the mark would be wrong.', he: 'אין מציינים על כזית מצומצם מן המת, שסופו לחסור בארץ.' },
    missing: s => ({ en: `"${s.label.en}" needs a lime mark, so travelers won't step there by accident.`, he: `"${s.label.he}" צריך ציון בסיד, כדי שעוברי דרכים לא ייטמאו.` }),
    tight: s => ({ en: `Too tight at "${s.label.en}"! A traveler could brush the tumah without knowing. Leave a little extra room.`, he: `צמוד מדי ב"${s.label.he}"! עובר דרך עלול לגעת בטומאה. השאירו קצת מקום.` }),
    wide: s => ({ en: `Too wide at "${s.label.en}"! The farmer says: "You painted half my field!"`, he: `רחב מדי ב"${s.label.he}"! החקלאי אומר: "צבעתם חצי שדה!"` }),
  };
  function check() {
    if (going) return;
    for (const s of spots) {
      const want = T.shouldMark(s.kind);
      if (!want.mark && s.on) { api.mistake(WHY[want.reason]); return; }
      if (want.mark && !s.on) { api.mistake(WHY.missing(s)); return; }
      if (s.on) { const r = T.limeMark(s.rx * s.s, s.rx).result; if (r !== 'ok') { api.mistake(r === 'tooTight' ? WHY.tight(s) : WHY.wide(s)); return; } }
    }
    going = true; api.setButtons([]);
    api.say({ en: 'Just right! The pilgrims can walk safely.', he: 'בדיוק! עולי הרגל יכולים לעבור בבטחה.' }, 'good');
    pilgrims[0].walk([[620, 880]]); pilgrims[1].walk([[620, 880]], () => api.complete(), 170);
  }
  return {
    intro: { en: 'The rain washed the lime marks away. Tap a place to mark it, then drag its ring: a little wider than the tumah, not much. Should every place be marked?', he: 'הגשם מחק את ציוני הסיד. הקישו על מקום כדי לציין אותו, וגררו את הטבעת: קצת יותר מהטומאה, לא הרבה. האם צריך לציין כל מקום?' },
    buttons: [{ id: 'check', label: { en: 'Let the pilgrims through', he: 'שחררו את עולי הרגל' }, cls: 'btn-green', onClick: check }],
    update(dt) { for (const a of [batya, zev, ...pilgrims]) a.update(dt); },
    down(p) {
      if (going) return;
      for (const s of spots) if (s.on) { const [hx, hy] = handle(s); if (Kit.near(p, hx, hy, 30)) { drag = s; return; } }
      for (const s of spots) if (Math.pow((p.x - s.cx) / s.rx, 2) + Math.pow((p.y - s.cy) / s.ry, 2) <= 1) { s.on = !s.on; api.sfx('tap'); api.say(s.label, 'info', 1600); return; }
    },
    move(p) { if (drag) drag.s = Math.max(0.5, Math.min(2.2, (p.x - drag.cx) / drag.rx)); },
    up() { drag = null; },
    hot() { const h = {}; for (const s of spots) { h[s.id] = handle(s); h[s.id + ':c'] = [s.cx, s.cy]; h[s.id + ':rx'] = [s.rx, 0]; } return h; },
    scene: { mode: 'day', seed: 51 },
    build(K, ctx) {
      const G3 = W1.ground(K, { front: 960 }), M = K.MAT;
      G3.sheet(-300, 250, 1140, 800, M.grass, { thick: 0.3, bevel: 0.05 });
      G3.sheet(-300, 840, 1140, 200, M.path, { lift: 0.08 });
      // the field where a grave was lost
      G3.sheet(50, 270, 200, 120, M.field, { lift: 0.1, thick: 0.12, bevel: 0.04 });
      // the walled cemetery everyone knows, with its headstones
      G3.upright(406, 284, 200, 22, M.stone, { d: 0.35 }); G3.upright(406, 390, 200, 22, M.stone, { d: 0.35 });
      for (let i = 0; i < 5; i++) G3.upright(334 + i * 36, 356, 22, 44, M.stoneSmooth, { d: 0.14, r: 0.1 });
      // a tree whose branch reaches over a grave
      G3.stand(K.tree(0, 0, 0.8, 'terebinth', 3), 470, 660);
      G3.stand(K.grave(0, 0, 0.55), 400, 590);
      G3.rod(462, 600, 340, 572, { r: 0.07, lift: 1.25 });
      const leaves = K.mesh(K.lumpy(0.42, 2, 0.12, 4), M.leaf); K.scene.add(leaves); leaves.position.copy(G3.at(340, 572, 1.45));
      // a wall with a stone jutting out over a grave
      G3.upright(75, 650, 110, 60, M.stone, { d: 0.6 });
      const jut = G3.upright(0, 0, 64, 22, M.stoneSmooth, { d: 0.5 }); jut.position.copy(G3.at(152, 650, 0.0)); jut.position.y += 30 / K.U;
      G3.stand(K.grave(0, 0, 0.5), 160, 662);
      // an olive-sized bit [כזית] lying by the road
      G3.lay(K.bone(0.45), 290, 744, { lift: 0.12, rot: 0.3 });
      G3.stand(K.bush(0, 0, 0.8), 520, 800); G3.stand(K.bush(0, 0, 0.7), 20, 780);
      // the lime rings Batya paints
      const rings = spots.map(s => G3.ring(s.cx, s.cy, s.rx, s.ry, M.lime, { width: 10, lift: 0.16 }));
      this.sync = () => {
        spots.forEach((s, i) => { rings[i].visible = s.on; rings[i].userData.place(s.rx * s.s, s.ry * s.s); });
        G3.follow(ctx, [batya, zev, ...pilgrims]);
      };
    },
    draw(g, t) {
      for (const s of spots) {
        g.setLineDash([7, 7]); G.ell(g, s.cx, s.cy, s.rx, s.ry, 'rgba(155,93,229,0.14)', 2.5, G.C.purple); g.setLineDash([]);
        if (s.on) {
          const [hx, hy] = handle(s); G.circ(g, hx, hy, 15, '#fff', 2.5); G.text(g, '↔', hx, hy, { size: 16 });
        }
        G.tag(g, api.L(s.label), s.cx, s.cy - s.ry - 16, { size: 12 });
      }
      for (const a of [zev, batya, ...pilgrims]) a.draw(g, t);
      G.tag(g, api.L({ en: 'The road to Yerushalayim', he: 'הדרך לירושלים' }), 270, 918, { size: 14 });
    },
  };
};

WORLD1.push({
  id: '1-7', pack: 'w1', title: { en: 'The Washed-Away Mark', he: 'הציון שנמחק' },
  stages: [W1.limeMarks],
  hints: [{ en: 'Mark only places people might not know about: the lost grave, the branches, the jutting stone. Not the cemetery everyone knows, and not an exact k\'zayit. Make each ring a bit wider than the dotted shape.', he: 'מציינים רק על הספקות: הקבר שאבד, הענפים והאבן הבולטת. לא את בית הקברות הידוע, ולא כזית מצומצם. כל טבעת קצת רחבה מהצורה המקווקוות.' }],
  why: {
    text: {
      en: 'Before the festivals, the Beit Din [בית דין] marked places of tumah with white lime [סיד], so travelers wouldn\'t become impure [טמא] by accident.\n\nThe mark goes a little **beyond** the tumah, so nobody\'s pure things get ruined, but **not too far**, so good land in Eretz Yisrael isn\'t wasted.\n\nThey mark only **doubtful** places: a field where a grave was lost, branches or jutting stones over a grave. They don\'t mark a known cemetery (everyone knows it), and they don\'t mark an exact k\'zayit [כזית], because it will shrink in the ground.',
      he: 'לפני הרגלים יצאו שלוחי בית דין לציין את מקומות הטומאה בסיד, כדי שעוברי דרכים לא ייטמאו.\n\nהציון **עודף מעט** על מקום הטומאה, כדי שלא להפסיד את הטהרות, ו**אין מרחיקים** אותו, כדי שלא להפסיד את ארץ ישראל.\n\nומציינים רק על **הספקות**: שדה שאבד בה קבר, סככות ופרעות. אין מציינים על הוודאות, שהכול יודעים אותן, ואין מציינים על כזית מצומצם, שסופו לחסור בארץ.',
    },
    sources: [
      S('אֵין מְצַיְּנִין עַל כְּזַיִת מְצֻמְצָם מִן הַמֵּת לְפִי שֶׁסּוֹפוֹ יֶחְסַר בָּאָרֶץ... יְהִי עוֹדֵף מִכָּאן וּמִכָּאן... וְאֵין מַרְחִיקִין... וְאֵין מְצַיְּנִין עַל הַוַּדָּאוֹת... אֶלָּא עַל הַסְּפֵקוֹת', 'Rambam, Hilchot Tumat Met 8:9', 'רמב"ם, הלכות טומאת מת ח, ט', 'Mishneh_Torah,_Defilement_by_a_Corpse.8.9'),
      S('וּמְצַיְּנִין אֶת הַקְּבָרוֹת', 'Mishnah Shekalim 1:1', 'משנה שקלים א, א', 'Mishnah_Shekalim.1.1'),
    ],
  },
});

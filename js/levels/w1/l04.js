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
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 12 });
      G.platform(g, -10, 668, 560, 300, { seed: 6 });
      G.stoneWall(g, 80, 380, 340, 288, { block: 30, seed: 4 });
      G.rr(g, 100, 400, 300, 258, 6, G.lin(g, 0, 400, 0, 658, [[0, '#6a4d30'], [1, '#3e2c1a']]), 2.5, '#2e1f10');
      G.poly(g, [[60, 382], [440, 382], [400, 320], [100, 320]], G.lin(g, 0, 320, 0, 382, [[0, '#b0805a'], [1, '#7a5034']]), 2.5, '#4e3020');
      G.crate(g, 120, 600, 56, 58); G.crate(g, 176, 620, 40, 38); G.text(g, '🪴', 150, 588, { size: 26 });
      g.save(); g.translate(404, 560); g.scale(1 - door.a * 0.85, 1); G.rr(g, 0, 0, 18, 100, 3, G.lin(g, 0, 0, 18, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark); g.restore();
      // board that would carry the water away from the hive
      if (!board.gone || board.y < 500) { g.save(); g.translate(0, board.y); G.plank(g, 470, 432, 120, 0.35, 12); g.restore(); }
      if (barrel.vis) { g.save(); g.translate(470, barrel.y); g.rotate(barrel.a); G.barrel(g, 0, 0, 0.9); g.restore(); }
      if (splash > 0) for (let i = 0; i < 10; i++) G.circ(g, (wasted ? 500 : 455) + Math.sin(i * 7) * 26 + (wasted ? i * 4 : 0), 430 + (1.2 - splash) * 70 + i * 6, 5, G.C.water, 2, G.C.waterDark);
      G.line(g, 470, 382, 470, 440, 3, '#6b4a22');
      G.hive(g, 470, 480, 1, wet);
      if (!wet) for (let i = 0; i < 3; i++) G.bee(g, 470 + Math.sin(t / 300 + i * 2) * 28, 460 + Math.cos(t / 260 + i) * 14);
      if (bees > 0) for (let i = 0; i < 10; i++) G.bee(g, 380 + Math.sin(t / 120 + i) * 70, 590 + Math.cos(t / 150 + i * 1.3) * 50);
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
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 14 });
      G.platform(g, -10, 838, 560, 140, { top: 'dirt', seed: 15 });
      G.platform(g, -10, 560, 310, 280, { seed: 16 });
      G.grave(g, 84, 566, 1);
      if (Kit.revealed(api, 'tree') && roadTamei()) G.ohelTint(g, [[300, 470], [520, 470], [530, 838], [290, 838]]);
      // pole for the rope
      G.rr(g, 516, 600, 12, 238, 3, G.lin(g, 516, 0, 528, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark);
      // trunk
      g.beginPath(); g.moveTo(186, 562); g.bezierCurveTo(192, 500, 186, 450, 192, 400); g.lineTo(210, 400); g.bezierCurveTo(214, 450, 208, 500, 216, 562); g.closePath();
      G.fillStroke(g, G.lin(g, 186, 0, 216, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark);
      for (const k of ['grave', 'road', 'twigs', 'rope']) {
        const b = br[k]; if (b.cut >= 1) continue;
        g.save(); g.globalAlpha = 1 - b.cut; const dy = b.cut * 300;
        if (k === 'rope') { G.rope(g, 206, 470 + dy, 522, 640 + dy, 30); }
        else {
          const w = b.kind === 'thin' ? 4 : 12;
          G.line(g, 201, 410 + dy, b.to[0], b.to[1] + dy, w + 4, G.C.woodDark); G.line(g, 201, 410 + dy, b.to[0], b.to[1] + dy, w, G.C.wood);
          const [lx, ly, r] = b.leaf;
          if (b.kind === 'thin') { for (let i = 0; i < 9; i++) { const a = i * 0.7; G.line(g, b.to[0], b.to[1] + dy, lx + Math.cos(a) * r, ly + dy + Math.sin(a) * r * 0.7, 2, G.C.woodDark); G.ell(g, lx + Math.cos(a) * r, ly + dy + Math.sin(a) * r * 0.7, 6, 3.5, G.C.leafLight, 1, G.C.leafDark); } }
          else { G.circ(g, lx, ly + 4 + dy, r, G.C.leafDark, 0); g.beginPath(); g.arc(lx, ly + dy, r, 0, 7); g.fillStyle = G.rad(g, lx - r * 0.3, ly + dy - r * 0.4, 4, r * 1.1, [[0, G.C.leafLight], [0.6, G.C.leaf], [1, G.C.leafDark]]); g.fill(); }
        }
        g.restore();
      }
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

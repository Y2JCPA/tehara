/* 1-1 · Three Ways Down
   Stairs carved over a tomb's roof (touching a grave's roof = touching the grave),
   a ladder that ends in a burial cave (ohel), and a bridge that needs the
   boulder cleared first. Also used in the Chanukah oil run with Yehuda. */
W1.threeWays = (hero = 'eli') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const NAME = hero === 'yehuda' ? YEHUDA : ELI;
  const eli = new Chars.Actor(hero, 110, 300);
  const pBridge = new Kit.Pin('bridge', 300, 196, 414, 196);
  const pRock = new Kit.Pin('boulder', 470, 186, 470, 296);
  const bridge = { a: -Math.PI / 2, broken: false };       // hinge at (400,300)
  const boulder = { x: 506, y: 274, a: 0, gone: false };
  const routes = new Kit.Routes([
    { id: 'ladder', box: [140, 290, 60, 420], glow: [[170, 300], [170, 836]] },
    { id: 'stairs', box: [200, 190, 180, 340], glow: [[200, 300], [236, 210], [344, 210], [380, 300], [362, 300], [236, 480], [362, 660], [236, 836]] },
    { id: 'bridge', box: [380, 180, 160, 150], glow: [[362, 300], [400, 300], [470, 300], [506, 300], [506, 836]] },
  ]);
  let going = false;

  function goNow() {
    if (going) return;
    if (!routes.sel) { api.say({ en: 'Tap a way down first: the ladder, the stairs or the bridge.', he: 'הקישו קודם על דרך: הסולם, המדרגות או הגשר.' }); return; }
    going = true; api.setButtons([]);
    if (routes.sel === 'ladder') {
      eli.walk([[170, 300]], () => eli.walk([[170, 836]], () => {
        const r = T.conveys('met', 'ohel');
        Kit.reveal(api, 'cave'); eli.glow = 'tm'; eli.mood = 'oh';
        if (r.result) api.fail({ en: 'The ladder ends inside a burial cave! An open tomb is in there. Everything under the same roof [אהל] as a met is impure [טמא].', he: 'הסולם נגמר בתוך מערת קבורה, ויש בה קבר פתוח! כל מה שתחת אוהל אחד עם המת טמא.' });
      }, 90));
      return;
    }
    if (routes.sel === 'stairs') {
      eli.walk([[200, 300], [218, 256], [236, 208], [290, 206]], () => {
        const r = T.conveys('grave', 'touch');
        Kit.reveal(api, 'tomb'); eli.glow = 'tm'; eli.mood = 'oh';
        if (r.result) api.fail({ en: 'These stairs are carved right on the roof of a tomb [קבר]. Touching a grave\'s roof is like touching the grave!', he: 'המדרגות חצובות על גג של קבר. הנוגע בגגו של קבר כנוגע בקבר!' });
      }, 120);
      return;
    }
    // the bridge
    if (bridge.broken || bridge.a < -0.1) { eli.walk([[388, 300]], () => { eli.mood = 'no'; eli.talk(api.L({ en: 'The bridge is up!', he: 'הגשר למעלה!' })); going = false; api.setButtons([Kit.go(goNow)]); }); return; }
    if (!boulder.gone) { eli.walk([[470, 300]], () => { eli.mood = 'no'; eli.talk(api.L({ en: 'A boulder is in the way!', he: 'סלע חוסם את הדרך!' })); going = false; api.setButtons([Kit.go(goNow)]); }); return; }
    eli.walk([[400, 300], [506, 300]], () => eli.walk([[506, 836]], () => eli.walk([[524, 836]], () => { eli.mood = 'happy'; api.complete(); }), 90));
  }

  return {
    intro: { en: `${NAME.en} is a Kohen [כהן]. Choose a way down to the road. Look carefully!`, he: `${NAME.he} הוא כהן. בחרו דרך למטה אל הכביש. הסתכלו היטב!` },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pBridge.update(dt); pRock.update(dt); eli.update(dt); },
    down(p) {
      if (going) return;
      if (pRock.hit(p)) {
        pRock.pull(() => {
          if (bridge.a > -0.1) { // bridge already down: the boulder rolls onto it and smashes it
            tw.to(boulder, { x: 440, y: 290, a: -3 }, 0.5, () => { bridge.broken = true; api.sfx('thunk'); tw.to(boulder, { y: 820, a: -6 }, 0.6); api.fail({ en: 'Crash! The boulder rolled onto the bridge and broke it. Clear the boulder first!', he: 'בום! הסלע התגלגל על הגשר ושבר אותו. קודם פנו את הסלע!' }); });
          } else tw.to(boulder, { x: 436, y: 300, a: -3 }, 0.45, () => tw.to(boulder, { y: 820, a: -6 }, 0.6, () => { boulder.gone = true; api.sfx('thunk'); }));
        });
        return;
      }
      if (pBridge.hit(p)) { pBridge.pull(() => tw.to(bridge, { a: 0 }, 0.5, () => api.sfx('thunk'))); return; }
      routes.hit(p);
    },
    hot() { return { bridge: pBridge.ring, boulder: pRock.ring, ...routes.hot() }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 2, y: 300 });
      G.platform(g, -10, 300, 410, 560, { face: 'rock', seed: 4 });
      // burial cave at the bottom left, reached by the ladder shaft
      G.rr(g, 14, 700, 200, 140, 18, G.lin(g, 0, 700, 0, 840, [[0, '#2c2016'], [1, '#140d07']]), 3, '#5e4c36');
      G.rr(g, 146, 300, 48, 410, 6, G.lin(g, 146, 0, 194, 0, [[0, '#2c2016'], [0.5, '#3a2b1c'], [1, '#140d07']]), 2.5, '#5e4c36');
      G.rr(g, 26, 760, 74, 52, 8, '#0b0704', 2, '#5e4c36');
      G.skull(g, 48, 790, 0.6); G.bone(g, 78, 800, 0.6, 0.2);
      if (Kit.revealed(api, 'cave')) G.ohelTint(g, [[14, 700], [214, 700], [214, 840], [14, 840]]);
      G.ladder(g, 170, 300, 840, { w: 30 });
      // the stair path: down through the rock in three flights
      G.stairs(g, 362, 300, 6, { stepW: 21, stepH: 30, dir: -1 });
      G.stairs(g, 236, 480, 6, { stepW: 21, stepH: 30, dir: 1 });
      G.stairs(g, 362, 660, 6, { stepW: 21, stepH: 30, dir: -1 });
      // a rock outcrop on top with a tomb cut into it; steps go up and over its roof
      G.tomb(g, 290, 300, 1);
      if (Kit.revealed(api, 'tomb')) G.tumahGlow(g, 290, 250, 90, 'tm', t);
      G.stairs(g, 236, 212, 4, { stepW: 9, stepH: 22, dir: -1, thick: 12 });
      G.stairs(g, 344, 212, 4, { stepW: 9, stepH: 22, dir: 1, thick: 12 });
      G.rr(g, 234, 206, 112, 10, 3, G.lin(g, 0, 206, 0, 216, [[0, '#fffbef'], [1, '#e6d3a6']]), 2, '#8a7148');
      // road, ravine and far cliff
      G.chasm(g, 400, 300, 70, 540);
      G.platform(g, 470, 300, 80, 560, { face: 'rock', seed: 7, top: 'grass' });
      G.ladder(g, 506, 300, 840, { w: 26 });
      G.platform(g, -10, 840, 560, 140, { top: 'dirt', seed: 9 });
      G.tag(g, api.L({ en: 'The road', he: 'הדרך' }), 270, 900, { size: 16 });
      G.house(g, 0, 200, 90, 100);
      routes.draw(g, t);
      // bridge
      if (!bridge.broken) { g.save(); g.translate(400, 300); g.rotate(bridge.a); G.plank(g, 35, -7, 72, 0, 14); g.restore(); }
      G.circ(g, 400, 300, 6, G.C.goldDark, 2);
      if (!boulder.gone) { g.save(); g.translate(boulder.x, boulder.y); g.rotate(boulder.a); G.rock(g, 0, 22, 54, 46, 5); g.restore(); }
      pBridge.draw(g); pRock.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-1', pack: 'w1', title: { en: 'Three Ways Down', he: 'שלוש דרכים למטה' },
  stages: [W1.threeWays('eli')],
  hints: [{ en: 'Look at what is under the stairs, and where the ladder ends. Then: which golden pin should you pull first?', he: 'הסתכלו מה יש מתחת למדרגות, ואיפה נגמר הסולם. ואז: איזו יתד למשוך קודם?' }],
  why: {
    text: {
      en: 'Eli is a Kohen [כהן]. The Torah tells a Kohen not to become impure [טמא] from a dead person [מת]: not by **touching**, not by **carrying**, and not by being under the same roof [אהל].\n\nThe stairs looked easy, but they were carved **on the roof of a tomb**, and touching a grave\'s roof is like touching the grave. The ladder looked like a shortcut, but it ended **inside a burial cave**, under one roof with the met. Only the bridge was safe.',
      he: 'אלי הוא כהן. התורה מצווה על הכהן שלא ייטמא למת: לא **במגע**, לא **במשא**, ולא **באוהל**.\n\nהמדרגות נראו קלות, אבל הן חצובות **על גגו של קבר**, והנוגע בגגו של קבר כנוגע בקבר. הסולם נראה כמו קיצור דרך, אבל הוא נגמר **בתוך מערת קבורה**, תחת אוהל אחד עם המת. רק הגשר היה בטוח.',
    },
    sources: [
      S('לְנֶפֶשׁ לֹא יִטַּמָּא בְּעַמָּיו', 'Vayikra 21:1', 'ויקרא כא, א', 'Leviticus.21.1'),
      S('וְאֶחָד הַנּוֹגֵעַ בְּמֵת אוֹ הַמַּאֲהִיל אוֹ הַנּוֹשֵׂא', 'Rambam, Hilchot Avel 3:1', 'רמב"ם, הלכות אבל ג, א', 'Mishneh_Torah,_Mourning.3.1'),
      S('הַקֶּבֶר... מְטַמֵּא בְּמַגָּע וּבְאֹהֶל כְּמֵת דִּין תּוֹרָה... וְאֶחָד הַנּוֹגֵעַ בְּגַגּוֹ שֶׁל קֶבֶר אוֹ הַנּוֹגֵעַ בִּכְתָלָיו', 'Rambam, Hilchot Tumat Met 2:15', 'רמב"ם, הלכות טומאת מת ב, טו', 'Mishneh_Torah,_Defilement_by_a_Corpse.2.15'),
      S('שֶׁהָיָה הַמֵּת עִם הָאָדָם אוֹ עִם הַכֵּלִים תַּחַת אֹהֶל אֶחָד הֲרֵי אֵלּוּ טְמֵאִים', 'Rambam, Hilchot Tumat Met 1:10', 'רמב"ם, הלכות טומאת מת א, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.10'),
    ],
  },
});

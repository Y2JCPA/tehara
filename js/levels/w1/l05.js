/* 1-5 · Stones That Don't Wobble
   Cross a Beit HaPeras without touching the dirt, carrying terumah.
   Only 4 stone tests; wobbly stones rest on pebbles (look closely). Three animals:
   the biggest one drops dung while ridden, which the Rambam counts as weak.
   Blowing is offered as a trap: it isn't relied on for terumah. */
W1.STONES = [
  [110, 740, 0], [230, 740, 1], [360, 740, 0], [462, 735, 0],
  [90, 630, 1], [200, 630, 0], [310, 630, 1], [430, 630, 0],
  [130, 520, 0], [250, 520, 1], [370, 520, 0], [470, 520, 1],
  [110, 410, 1], [230, 410, 0], [350, 410, 1], [450, 410, 0],
  [180, 300, 0], [300, 300, 1], [420, 300, 0],
].map(([x, y, solid], i) => ({ i, x, y, solid: !!solid, tested: false, wob: 0 }));

W1.stones = (hero = 'eli', mate = 'miriam', purpose = 'terumah') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const stones = W1.STONES.map(s => ({ ...s }));
  const START = { x: 270, y: 850 }, REACH = 160;
  const eli = new Chars.Actor(hero, 230, 868), mate1 = new Chars.Actor(mate, 300, 868);
  const animals = [
    { id: 'big', x: 84, y: 905, s: 0.74, strong: false, color: '#7a6250', plop: 0, tell: { en: 'A big, handsome donkey… oops, it drops dung as soon as you get on. The Rambam counts that as a weak animal!', he: 'חמור גדול ויפה… אופס, הוא מטיל גללים מיד כשעולים עליו. הרמב"ם מחשיב זאת כבהמה שכוחה רע!' } },
    { id: 'mule', x: 390, y: 915, s: 0.58, strong: false, color: '#b9ab9d', tell: { en: 'Its knees knock together when it carries someone. Weak!', he: 'הברכיים שלו נוקשות זו בזו כשהוא נושא מישהו. חלש!' } },
    { id: 'small', x: 486, y: 878, s: 0.48, strong: true, color: '#8c7663', tell: { en: 'Small, but steady as a rock. Its legs don\'t shake at all.', he: 'קטן, אבל יציב כמו סלע. הרגליים שלו לא רועדות בכלל.' } },
  ];
  let mode = 'path', tests = 4, going = false, riding = null, inspected = null;
  const path = [];
  const near = (a, b) => a === START ? b.y >= 690 : Math.hypot(a.x - b.x, a.y - b.y) <= REACH;
  const lastNode = () => path.length ? path[path.length - 1] : START;
  const reachesEnd = () => path.length && lastNode().y <= 310;

  function test(s) {
    if (s.tested) return;
    if (tests <= 0) { api.say({ en: 'No tests left! Look closely: what is under each stone?', he: 'נגמרו הבדיקות! הסתכלו היטב: מה יש מתחת לכל אבן?' }); return; }
    tests--; s.tested = true;
    if (s.solid) api.sfx('thunk'); else { api.sfx('wobble'); tw.to(s, { wob: 0.25 }, 0.12, () => tw.to(s, { wob: -0.25 }, 0.12, () => tw.to(s, { wob: 0 }, 0.12))); }
    api.setButtons(buttons());
  }
  function addPath(s) {
    if (path[path.length - 1] === s) { path.pop(); return; }
    if (path.includes(s)) return;
    if (near(lastNode(), s)) { path.push(s); api.sfx('tap'); }
    else api.say({ en: 'Too far to step. Choose a stone next to the last one.', he: 'רחוק מדי. בחרו אבן קרובה לאחרונה.' });
  }
  function hop() {
    if (going) return;
    if (!reachesEnd()) { api.say({ en: 'Make a path of stones all the way to the far side.', he: 'בנו שביל אבנים עד הצד השני.' }); return; }
    going = true; api.setButtons([]);
    const seq = path.slice();
    const step = () => {
      const s = seq.shift();
      if (!s) { eli.walk([[250, 200]], null); mate1.walk([[300, 200]], () => api.complete()); return; }
      eli.walk([[s.x, s.y - 6]], () => {
        const r = T.crossField({ field: 'plowed', method: 'stones', solid: s.solid, purpose });
        if (!r.tahor) { s.tested = true; tw.to(s, { wob: 0.2 }, 0.15); eli.glow = 'tm'; eli.mood = 'oh'; api.fail({ en: 'Eli didn\'t wobble at all, but a stone that wobbles counts like the dirt itself!', he: 'אלי לא התנדנד בכלל, אבל אבן שמתנדנדת היא כמו העפר עצמו!' }); return; }
        mate1.walk([[s.x + 24, s.y - 4]]); setTimeout(step, 300);
      }, 260);
    };
    step();
  }
  function blow() {
    if (going) return; going = true; api.setButtons([]);
    eli.hold = 'blower';
    eli.walk([[230, 700]], () => {
      const r = T.crossField({ field: 'plowed', method: 'blow', purpose });
      if (!r.tahor) { eli.mood = 'no'; api.fail({ en: 'Blowing on the dirt is only relied on for going to bring the Korban Pesach, not for terumah [אין בודקין לתרומה]. Miriam is carrying terumah!', he: 'על ניפוח סומכים רק לעושה פסח, ואין בודקין לתרומה. מרים נושאת תרומה!' }); }
    });
  }
  function inspect(a) {
    inspected = a; api.say(a.tell, a.strong ? 'good' : 'info', 4200);
    if (a.id === 'big') tw.to(a, { plop: 1 }, 0.4);
    a.shake = a.strong ? 0 : 1.5;
    api.setButtons(buttons());
  }
  function ride(a) {
    if (going) return; going = true; api.setButtons([]); riding = a; eli.visible = false; mate1.visible = false;
    tw.to(a, { x: 270, y: 870 }, 0.5, () => tw.to(a, { y: a.strong ? 200 : 540 }, a.strong ? 2.2 : 1.4, () => {
      const r = T.crossField({ field: 'plowed', method: 'ride', strong: a.strong, purpose });
      if (r.tahor) { api.complete(); return; }
      a.shake = 3; if (a.id === 'big') a.plop = 1;
      api.fail(a.id === 'big'
        ? { en: 'Plop! An animal that drops dung while you ride it counts as weak, as if Eli walked on his own feet!', he: 'בהמה שמטילה גללים בשעת רכיבה היא בהמה שכוחה רע, כאילו אלי הלך ברגליו!' }
        : { en: 'Its knees are knocking! Riding a weak animal counts like walking on your own feet.', he: 'הברכיים שלו נוקשות! רכיבה על בהמה שכוחה רע היא כמו הליכה ברגליים.' });
    }));
  }
  function buttons() {
    const b = [
      { id: 'test', label: { en: `🔍 Test (${tests})`, he: `🔍 בדיקה (${tests})` }, cls: 'btn-navy', on: mode === 'test', onClick: () => { mode = 'test'; api.setButtons(buttons()); } },
      { id: 'path', label: { en: '✏️ Path', he: '✏️ שביל' }, cls: 'btn-navy', on: mode === 'path', onClick: () => { mode = 'path'; api.setButtons(buttons()); } },
      Kit.go(hop, { en: 'Hop!', he: 'קפצו!' }),
    ];
    if (inspected) b.push({ id: 'ride', label: { en: '🐴 Ride it', he: '🐴 לרכוב' }, onClick: () => ride(inspected) });
    else b.push({ id: 'blow', label: { en: '💨 Blow', he: '💨 לנפח' }, onClick: blow });
    return b;
  }
  return {
    intro: { en: 'A Beit HaPeras [בית הפרס]! Miriam carries terumah [תרומה]. Cross without touching the dirt. You can only test 4 stones…', he: 'בית הפרס! מרים נושאת תרומה. עברו בלי לגעת בעפר. אפשר לבדוק רק 4 אבנים…' },
    buttons: buttons(),
    update(dt) { tw.update(dt); eli.update(dt); mate1.update(dt); for (const a of animals) if (a.shake > 0) a.shake -= dt; },
    down(p) {
      if (going) return;
      for (const a of animals) if (Kit.near(p, a.x, a.y - 20 * a.s / 0.6, 46)) { inspect(a); return; }
      for (const s of stones) if (Kit.near(p, s.x, s.y, 32)) { mode === 'test' ? test(s) : addPath(s); return; }
    },
    hot() { const h = {}; for (const a of animals) h['animal:' + a.id] = [a.x, a.y - 20 * a.s / 0.6]; for (const s of stones) h['s' + s.i] = [s.x, s.y]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 21, y: 230 });
      G.platform(g, -10, 160, 560, 90, { seed: 22 });
      G.river(g, -10, 250, 50, 560, t); G.river(g, 500, 250, 50, 560, t);
      G.rr(g, 40, 250, 460, 560, 0, G.lin(g, 0, 250, 0, 810, [[0, '#c49560'], [1, '#a27243']]), 2.5, G.C.dirtDark);
      G.rrPath(g, 40, 250, 460, 560, 0); G.texFill(g, 'dirt'); Kit.furrows(g, 40, 250, 460, 560);
      G.platform(g, -10, 818, 560, 160, { seed: 23 });
      G.sign(g, 270, 244, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 290, size: 13, post: false });
      if (path.length) { G.path(g, [[START.x, START.y], ...path.map(s => [s.x, s.y])]); g.setLineDash([10, 8]); g.lineWidth = 5; g.strokeStyle = '#fff'; g.stroke(); g.setLineDash([]); }
      for (const s of stones) G.stoneTile(g, s.x, s.y, s.solid ? 27 : 29, { wobbly: !s.solid, wob: s.wob, tested: s.tested });
      for (const s of path) G.circ(g, s.x, s.y, 6, G.C.gold, 2);
      for (const a of animals) {
        if (riding === a) continue;
        G.donkey(g, a.x, a.y, a.s, { strong: a.strong, color: a.color, phase: a.shake > 0 ? t / 50 : 0, plop: a.plop || 0, dir: a.id === 'big' ? 1 : -1 });
        if (inspected === a) G.circ(g, a.x, a.y - 10, 50 * a.s / 0.6, null, 3, G.C.gold);
      }
      if (riding) { G.donkey(g, riding.x, riding.y, riding.s, { strong: riding.strong, color: riding.color, phase: t / 70, plop: riding.plop || 0 }); Chars.draw(g, hero, riding.x - 4, riding.y - 30 * riding.s / 0.6, { s: 0.7 * riding.s / 0.6, t }); Chars.draw(g, mate, riding.x + 18, riding.y - 28 * riding.s / 0.6, { s: 0.65 * riding.s / 0.6, t }); }
      mate1.draw(g, t); eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-5', pack: 'w1', title: { en: 'Stones That Don\'t Wobble', he: 'אבנים שאינן מתנדנדות' },
  stages: [W1.stones('eli', 'miriam', 'terumah')],
  hints: [{ en: 'Wobbly stones sit on little pebbles; solid ones are sunk into the dirt. Tap an animal to see how it behaves before riding. And blowing doesn\'t count for terumah.', he: 'אבנים מתנדנדות יושבות על חלוקים קטנים; יציבות שקועות בעפר. הקישו על בהמה כדי לראות איך היא מתנהגת. וניפוח אינו מועיל לתרומה.' }],
  why: {
    text: {
      en: 'A Beit HaPeras [בית הפרס] is a field where a grave was plowed, so tiny bone pieces may be in the dirt.\n\nYou stay pure [טהור] if you cross on **stones that don\'t wobble**, or **riding a strong person or animal**. A stone that wobbles counts like the dirt itself, even if you didn\'t wobble. An animal is weak if its **knees knock**, or if it **drops dung** while you ride it.\n\nBlowing on the dirt isn\'t relied on for someone carrying **terumah** [תרומה].',
      he: 'בית הפרס הוא שדה שנחרש בו קבר, ועצמות קטנות אולי מפוזרות בעפר.\n\nהמהלך **על אבנים שאינן מתנדנדות**, או **רוכב על אדם או בהמה שכוחם יפה**, טהור. אבן שמזדעזעת היא כמו העפר, אף על פי שנשמר ולא נתנדנד. בהמה שכוחה רע היא שארכובותיה **נוקשות**, או **שמטילה גללים** בשעת רכיבה.\n\nואין בודקין **לתרומה** בניפוח.',
    },
    sources: [
      S('הַמְהַלֵּךְ בְּבֵית הַפְּרָס עַל גַּבֵּי אֲבָנִים שֶׁאֵין מִתְנַדְנְדִין... הֲרֵי זֶה טָהוֹר. אֲבָל אִם הָלַךְ עַל גַּבֵּי אֲבָנִים שֶׁמִּזְדַּעְזְעִין... אַף עַל פִּי שֶׁנִּשְׁמַר... הֲרֵי זֶה טָמֵא... אוֹ עַל גַּבֵּי בְּהֵמָה שֶׁכֹּחָהּ רַע עַד שֶׁתָּטִיל גְּלָלִים בִּשְׁעַת רְכִיבָה', 'Rambam, Hilchot Tumat Met 10:11', 'רמב"ם, הלכות טומאת מת י, יא', 'Mishneh_Torah,_Defilement_by_a_Corpse.10.11'),
      S('בּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה', 'Mishnah Oholot 18:4', 'משנה אהלות יח, ד', 'Mishnah_Oholot.18.4'),
    ],
  },
});

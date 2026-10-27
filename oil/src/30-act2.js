// ============================================================ rules for Act II
Object.assign(SRC, {
  shekalim53: sef('Mishnah_Shekalim.5.3', 'Mishnah Shekalim 5:3', 'משנה שקלים ה, ג'),
});
Object.assign(RULES, {
  hands: {
    title: ['Unwashed hands are a Sheni', 'ידיים סתם שניות'],
    body: ['By rabbinic decree, hands that haven’t been washed count as a <em>Sheni</em>, because hands are “busy”: they touch things without your noticing. Shlomo HaMelech’s court made the decree for kodesh, and later Sages extended it to terumah.', 'מדברי סופרים, ידיים שלא נטלו אותן הן <em>שניות</em>, מפני שהידיים עסקניות: הן נוגעות בדברים בלי ששמים לב. שלמה המלך ובית דינו גזרו על הקודש, וחכמים שאחריו הוסיפו גם על התרומה.'],
    src: [SRC.sat88],
  },
  handsChullin: {
    title: ['Ordinary bread and a Sheni', 'חולין ושני'],
    body: ['A Sheni touching ordinary bread does nothing. For chullin the chain stops at Sheni; there is no Shlishi. The apprentice’s lunch is fine.', 'שני שנוגע בלחם של חולין לא עושה כלום. בחולין השרשרת נעצרת בשני; אין שלישי. ארוחת הצהריים של השוליה בסדר.'],
    src: [SRC.sat112],
  },
  handsTerumah: {
    title: ['Terumah and a Sheni', 'תרומה ושני'],
    body: ['Terumah is holier than ordinary food, so a Sheni takes it one step further: it becomes a <em>Shlishi</em>. A Shlishi of terumah is pasul, unfit to eat, and stops there.', 'תרומה קדושה יותר מאוכל רגיל, ולכן שני מוריד אותה עוד דרגה: היא נעשית <em>שלישי</em>. שלישי בתרומה פסול לאכילה, ונעצר שם.'],
    src: [SRC.sat113, SRC.sat88],
  },
  handsLiquid: {
    title: ['Liquids jump to the top', 'משקים קופצים למעלה'],
    body: ['Anything that would disqualify terumah makes a liquid a <em>Rishon</em>, not one step lower. So unwashed hands make even plain chullin wine a Rishon. Liquids never count down.', 'כל הפוסל את התרומה מטמא משקין להיות <em>תחילה</em>, כלומר ראשון, ולא דרגה למטה. לכן ידיים סתם עושות אפילו יין של חולין ראשון. משקים אף פעם לא יורדים בדרגה.'],
    src: [SRC.parah87, SRC.tevulYom22],
  },
  tokens: {
    title: ['Tokens are not seals', 'אסימונים אינם חותמות'],
    body: ['The Mikdash had four token seals, marked calf, ram, kid and sinner. You bought one and exchanged it for the right wine and flour for your korban. They have nothing to do with sealing a jug.', 'במקדש היו ארבעה חותמות-אסימון, שכתוב עליהם עגל, זכר, גדי, חוטא. קונים אחד ומחליפים אותו ביין ובסולת המתאימים לקרבן. אין להם שום קשר לחתימת כד.'],
    src: [SRC.shekalim51, SRC.shekalim53],
  },
  nazirHair: {
    title: ['The nazir’s hair', 'שער הנזיר'],
    body: ['When a nazir finishes his nezirut in taharah, he shaves his head and throws the hair into the fire under the pot where his shelamim cook. The Nazirites’ chamber, in a corner of the Ezrat Nashim, was built for exactly this.', 'נזיר שמסיים את נזירותו בטהרה מגלח את ראשו ומשליך את השער תחת הדוד שבו מתבשלים השלמים שלו. לשכת הנזירים, בפינת עזרת הנשים, נבנתה בשביל זה בדיוק.'],
    src: [SRC.nazir68, SRC.middot25],
  },
  worms: {
    title: ['Wood with a worm', 'עץ שנמצא בו תולעת'],
    body: ['In the wood chamber, Kohanim with a blemish, who couldn’t serve at the mizbe’ach, checked every log for worms. A log with a worm in it is unfit for the mizbe’ach.', 'בלשכת העצים, כהנים בעלי מומים, שלא יכלו לעבוד על המזבח, היו בודקים כל עץ מתולעת. עץ שנמצא בו תולעת פסול לגבי המזבח.'],
    src: [SRC.middot25],
  },
  r_mouseDead: {
    title: ['The dead mouse', 'העכבר המת'],
    body: ['A dead sheretz (a mouse, a lizard, and six others in the Torah’s list) is an <em>Av HaTumah</em>. It makes people and vessels tamei by touch, and a clay vessel just by being inside its airspace. Unlike a met, it doesn’t spread by being carried or by sharing a roof.', 'שרץ מת (עכבר, לטאה ועוד שישה ברשימה שבתורה) הוא <em>אב הטומאה</em>. הוא מטמא אדם וכלים במגע, וכלי חרס רק בכך שהוא נמצא באוויר שלו. בניגוד למת, הוא לא מטמא במשא ולא באוהל.'],
    src: [SRC.kelim11, SRC.vayikra1131],
  },
  r_jugA: {
    title: ['The mouse jug', 'כד העכבר'],
    body: ['The mouse never touched the jug from the outside. It didn’t need to. A clay vessel becomes tamei only through its inside: an Av in its airspace makes it a <em>Rishon</em>. Touching a clay jug from the outside does nothing. Remember that; it matters later.', 'העכבר לא נגע בכד מבחוץ. הוא לא היה צריך. כלי חרס נטמא רק מתוכו: אב הטומאה באוויר שלו עושה אותו <em>ראשון</em>. נגיעה בכלי חרס מבחוץ לא עושה כלום. כדאי לזכור, זה יהיה חשוב בהמשך.'],
    src: [SRC.vayikra1133, SRC.kelim11],
  },
  r_puddle: {
    title: ['The spilled oil', 'השמן שנשפך'],
    body: ['This oil was inside the mouse jug, so it’s a <em>Rishon</em>. Oil is one of the seven liquids, and liquids are the most sensitive things there are.', 'השמן הזה היה בתוך כד העכבר, ולכן הוא <em>ראשון</em>. שמן הוא אחד משבעת המשקים, ומשקים הם הדבר הרגיש ביותר שיש.'],
    src: [SRC.parah87, SRC.tumatOkhalin12],
  },
  r_loaf: {
    title: ['Yoezer’s lunch', 'ארוחת הצהריים של יועזר'],
    body: ['The loaf touched a Rishon, so it’s one step down: a <em>Sheni</em>. For chullin that’s the end of the line: pasul, but it can’t make other chullin tamei. (It was baked from dough kneaded with water, so it was always able to become tamei.)', 'הכיכר נגעה בראשון, ולכן היא דרגה אחת למטה: <em>שני</em>. בחולין כאן הסוף: פסול, אבל לא מטמא חולין אחרים. (היא נאפתה מבצק שנלוש במים, ולכן הייתה מוכשרת לקבל טומאה.)'],
    src: [SRC.sat112],
  },
  r_cake: {
    title: ['The terumah cake', 'עוגת התרומה'],
    body: ['It touched Yoezer’s loaf, a Sheni. Ordinary food would be fine, but terumah is holier, so it goes one step further: <em>Shlishi</em>. A Shlishi of terumah is pasul and stops there, except against things holier still.', 'היא נגעה בכיכר של יועזר, שהיא שני. אוכל רגיל לא היה נפגע, אבל תרומה קדושה יותר, ולכן היא יורדת עוד דרגה: <em>שלישי</em>. שלישי בתרומה פסול ונעצר שם, חוץ מלגבי דברים קדושים עוד יותר.'],
    src: [SRC.sat113, SRC.sat117],
  },
  r_measure: {
    title: ['The menorah oil', 'שמן המנורה'],
    body: ['You’d expect one more step: kodesh goes down to <em>Revi’i</em>. For a solid, that would be right. But this is a liquid. Even a Shlishi of terumah makes kodesh liquid a <em>Rishon</em>. That’s why oil for the menorah is the easiest thing in the world to ruin.', 'הייתם מצפים לעוד דרגה: בקודש יורדים עד <em>רביעי</em>. באוכל זה היה נכון. אבל זה משקה. אפילו שלישי של תרומה עושה משקה של קודש <em>ראשון</em>. לכן שמן למנורה הוא הדבר הקל ביותר בעולם לקלקל.'],
    src: [SRC.sat118, SRC.parah87],
  },
  r_jugC: {
    title: ['The jug that was moved', 'הכד שהוזז'],
    body: ['The seal is perfect, but there’s a clean ring in the dust and drag marks: someone moved this jug. Tosafot ask how a jug could have stayed tahor if the Greeks had moved it, and answer that the one the Chashmona’im found must have been hidden in the ground. This one was moved, so we can’t rely on it.', 'החותם שלם, אבל יש עיגול נקי באבק וסימני גרירה: מישהו הזיז את הכד. התוספות שואלים איך כד יכול היה להישאר טהור אם היוונים הזיזו אותו, ועונים שהכד שהחשמונאים מצאו היה כנראה טמון בקרקע. את הכד הזה הזיזו, ולכן אי אפשר לסמוך עליו.'],
    src: [SRC.shabbat21b, SRC.tosafot],
  },
  r_jugsD: {
    title: ['The opened jugs', 'הכדים הפתוחים'],
    body: ['Once the seal is broken there’s no way to know who touched the oil. The Gemara says that when the Greeks came into the Heichal they made all the oils tamei, and the Chashmona’im searched for a jug whose seal proved no one had.', 'ברגע שהחותם נשבר, אין דרך לדעת מי נגע בשמן. הגמרא אומרת שכשנכנסו יוונים להיכל טמאו כל השמנים שבהיכל, והחשמונאים חיפשו כד שהחותם שלו מוכיח שאף אחד לא נגע בו.'],
    src: [SRC.shabbat21b],
  },
  r_cup: {
    title: ['The stone cup', 'כוס האבן'],
    body: ['Stone vessels can’t become tamei, ever: not by Torah law and not by rabbinic law, no matter what touches them. In a wrecked storeroom, it’s the one vessel you can be completely sure of.', 'כלי אבן אף פעם לא מקבלים טומאה: לא מן התורה ולא מדברי סופרים, לא משנה מה נוגע בהם. במחסן הרוס, זה הכלי היחיד שאפשר לסמוך עליו לגמרי.'],
    src: [SRC.kelimR16],
  },
});

// ============================================================ 8. The Ezrat Nashim (hub)
const HUB_TAGS = ['hands', 'loafC', 'loafT', 'wine'];
SCENES.push({
  id: 'hub', act: 2, hub: true, cols: 9, rows: 7, theme: 'pave', light: 'evening', introOnce: true,
  title: ['The Ezrat Nashim', 'עזרת הנשים'],
  blurb: ['The first courtyard inside the Cheil. Four chambers sit in its corners, open to the sky. One of them is Beit Shemaniya, the oil chamber.', 'העזרה הראשונה בתוך החיל. ארבע לשכות יושבות בפינותיה, פתוחות לשמיים. אחת מהן היא בית שמניה, לשכת השמנים.'],
  walls: [{ side: 'back', courses: 6, seed: 51, gaps: [{ from: 1, to: 1, courses: 5 }, { from: 7, to: 7, courses: 5 }] }, { side: 'left', courses: 6, seed: 52, gaps: [{ from: 2, to: 2, courses: 5 }, { from: 5, to: 5, courses: 5 }] }],
  start: st => ({ nazir: [1, 1, 0], wood: [7, 1, 0], oil: [1, 5, Math.PI / 2] }[st.from] || [4, 6, Math.PI]),
  build() {
    exitAt('nazirDoor', 1, 0, 'nazir', ['Chamber of the Nazirites', 'לשכת הנזירים']);
    exitAt('woodDoor', 7, 0, 'wood', ['The wood chamber', 'לשכת העצים']);
    exitAt('oilDoor', 0, 5, 'oil', ['Beit Shemaniya, the oil chamber', 'בית שמניה, לשכת השמנים'], () =>
      !fl('warmup') ? ['eli', ['First, that apprentice. He looks like he’s about to cry into his wine.', 'קודם, השוליה ההוא. נראה שהוא עומד לבכות לתוך היין שלו.']]
        : !has('lampLit') ? [['levi', ['(from inside) Who’s there? No light, no entry! It’s as dark as a sealed jug in here.', '(מבפנים) מי שם? בלי אור, אין כניסה! חשוך כאן כמו בתוך כד חתום.']], ['eli', ['I need a light.', 'אני צריך אור.']]] : true);
    const door = K3.door(1.5, '#5a3e26'); door.rotation.y = Math.PI / 2;
    thing('metzora', ['A closed door', 'דלת סגורה'], door, 0, 2, { dx: -0.62, look: ['The chamber of the metzora’im, where they immerse at the end of their purification. Closed. Nobody needs it tonight.', 'לשכת המצורעים, שבה הם טובלים בסוף טהרתם. סגורה. אף אחד לא צריך אותה הלילה.'] });
    // the lamp in its niche
    const niche = group(mesh(new THREE.BoxGeometry(0.6, 0.08, 0.4), mat(C.stoneDark), 0, 0.9, -0.1));
    const lampM = K3.lamp(false); lampM.position.set(0, 0.95, -0.1); niche.add(lampM); ST.lampM = lampM; lampM.visible = !has('lamp') && !has('lampLit');
    thing('niche', ['A lamp in a niche', 'נר בגומחה'], niche, 4, 0, { anchorY: 1.4, look: ['A small clay lamp with ordinary oil in it. Unlit. Nobody’s using it.', 'נר חרס קטן ובו שמן רגיל. כבוי. אף אחד לא משתמש בו.'],
      acts: [() => A.act('take', ['Take the lamp', 'לקחת את הנר'], async () => { give('lamp'); ST.lampM.visible = false; await speak('eli', ['A lamp. Now all I need is a flame.', 'נר. עכשיו רק חסרה לי להבה.']); objective(); }, has('lamp') || has('lampLit'))] });
    // Yochanan's booth
    deco(group(mesh(new THREE.BoxGeometry(0.9, 0.6, 0.5), mat(C.wood), 0, 0.3, 0), ...[0, 1, 2, 3].map(i => mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 8), mat(['#8c6a3c', '#7a5a4a', '#6a7a4a', '#7a4a4a'][i]), -0.3 + i * 0.2, 0.62, 0))), 5, 0);
    npc('yochanan', 'yochanan', 5, 1, { actions: () => [A.talk(talkYochanan), A.look(['Yochanan, in charge of the seals. He has four little piles of tokens and a very orderly beard.', 'יוחנן, האחראי על החותמות. יש לו ארבע ערימות קטנות של אסימונים וזקן מאוד מסודר.'])] });
    // the baker's apprentice and his tray
    deco(group(mesh(new THREE.BoxGeometry(2.6, 0.06, 0.6), mat(C.wood), 0, 0.6, 0), mesh(new THREE.BoxGeometry(0.08, 0.6, 0.5), mat(C.woodDark), -1.2, 0.3, 0), mesh(new THREE.BoxGeometry(0.08, 0.6, 0.5), mat(C.woodDark), 1.2, 0.3, 0)), 4, 4, { block: false });
    const loaf = (color = C.bread) => { const l = mesh(new THREE.IcosahedronGeometry(0.18, 1), mat(color)); l.scale.set(1.3, 0.6, 0.9); l.position.y = 0.72; return group(l); };
    const W = {
      loafC: { _: ['baker', ['So... it’s ruined?', 'אז... זה הרוס?']], sheni: ['eli', ['A Sheni can’t make ordinary bread a Shlishi. For chullin there’s no such thing.', 'שני לא יכול לעשות לחם רגיל שלישי. בחולין אין דבר כזה.']], rishon: ['eli', ['Hands are a Sheni. Bread touched by them can’t end up higher than that.', 'ידיים הן שני. לחם שנגעו בו לא יכול לצאת גבוה מזה.']] },
      loafT: { tahor: ['eli', ['For ordinary bread, yes. But terumah is holier. It feels things ordinary bread doesn’t.', 'ללחם רגיל, כן. אבל תרומה קדושה יותר. היא מרגישה דברים שלחם רגיל לא מרגיש.']], sheni: ['eli', ['The hands are the Sheni. What does a Sheni make terumah?', 'הידיים הן השני. מה שני עושה לתרומה?']], _: ['eli', ['Count from the hands. They’re a Sheni.', 'לספור מהידיים. הן שני.']] },
      wine: { shlishi: ['baker', ['One step down from my hands, so Shlishi? That’s what I thought!', 'דרגה אחת מתחת לידיים שלי, אז שלישי? ככה חשבתי!']], tahor: ['baker', ['It’s chullin wine. Ordinary. Surely ordinary is fine?', 'זה יין חולין. רגיל. בטח רגיל זה בסדר?']], sheni: ['eli', ['Liquids don’t just copy what touched them. They jump.', 'משקים לא סתם מעתיקים את מה שנגע בהם. הם קופצים.']], _: ['eli', ['It’s a liquid. Liquids are the odd ones out.', 'זה משקה. משקים הם יוצאי הדופן.']] },
      hands: { tahor: ['baker', ['I didn’t touch anything tamei! I don’t think. Did I?', 'לא נגעתי בשום דבר טמא! אני חושב. נגעתי?']], rishon: ['eli', ['Nothing tamei touched them. It’s a decree about unwashed hands.', 'שום דבר טמא לא נגע בהן. זו גזירה על ידיים שלא נטלו.']], _: ['eli', ['Unwashed hands have a level all of their own. By rabbinic decree.', 'לידיים שלא נטלו יש דרגה משלהן. מגזירת חכמים.']] },
    };
    addObj('loafC', { name: ['His own bread (chullin)', 'הלחם שלו (חולין)'], tiles: [[3, 4]], group: loaf(), at: [3, 4, 0.1], anchorY: 1.2, answer: 'tahor', why: 'handsChullin', wrong: W.loafC, ringY: 0.62, actions: () => [A.look(['His lunch. Ordinary bread, chullin. He touched it with unwashed hands.', 'ארוחת הצהריים שלו. לחם רגיל, חולין. הוא נגע בו בידיים שלא נטל.']), A.tag('loafC')] });
    addObj('loafT', { name: ['A terumah loaf', 'כיכר תרומה'], tiles: [[4, 4]], group: loaf('#d9a35e'), at: [4, 4], anchorY: 1.2, answer: 'shlishi', why: 'handsTerumah', wrong: W.loafT, ringY: 0.62, actions: () => [A.look(['A loaf of terumah, for a Kohen’s family. He touched this too.', 'כיכר תרומה, בשביל משפחה של כהן. גם בזה הוא נגע.']), A.tag('loafT')] });
    const cup = group(mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.16, 8), mat(C.clayLight), 0, 0.71, 0), mesh(new THREE.CircleGeometry(0.07, 8).rotateX(-Math.PI / 2), mat('#6a1f2a'), 0, 0.78, 0, false));
    addObj('wine', { name: ['A cup of wine (chullin)', 'כוס יין (חולין)'], tiles: [[5, 4]], group: cup, at: [5, 4, -0.1], anchorY: 1.2, answer: 'rishon', why: 'handsLiquid', wrong: W.wine, ringY: 0.62, actions: () => [A.look(['His wine. Plain chullin wine. He held the cup by the rim.', 'היין שלו. יין חולין פשוט. הוא החזיק את הכוס בשפה.']), A.tag('wine')] });
    npc('hands', 'baker', 4, 5, { name: ['The apprentice’s hands', 'הידיים של השוליה'], answer: 'sheni', why: 'hands', wrong: W.hands, anchorY: 1.5, actions: () => [A.talk(talkBaker), A.look(['A baker’s apprentice from the house of Garmu, who bake the lechem hapanim. His hands haven’t seen water since this morning.', 'שוליית אופה מבית גרמו, שאופים את לחם הפנים. הידיים שלו לא ראו מים מהבוקר.']), A.tag('hands')] });
    torchPost(2, 6, 0, 0.3); torchPost(6, 6, 0, 0.3);
  },
  onTag: async () => {
    if (fl('warmup') || !tagsDone(HUB_TAGS)) return;
    flag('warmup');
    await lines(['baker', ['So my bread is fine?', 'אז הלחם שלי בסדר?']], ['eli', ['Your bread’s fine. The terumah is unfit for a Kohen to eat. And your wine is a Rishon now.', 'הלחם שלך בסדר. התרומה פסולה לאכילה לכהן. והיין שלך ראשון עכשיו.']], ['baker', ['Can I still drink it?', 'אני עדיין יכול לשתות אותו?']], ['eli', ['You can. Just keep it well away from anything holy.', 'אתה יכול. רק תרחיק אותו מכל דבר קדוש.']], ['baker', ['Story of my life.', 'סיפור חיי.']]);
    objective();
  },
  objective: () => !fl('warmup') ? [`Work out what the apprentice’s hands did (${HUB_TAGS.filter(id => (P.tags.hub || {})[id]).length} of 4)`, `לברר מה עשו הידיים של השוליה (${HUB_TAGS.filter(id => (P.tags.hub || {})[id]).length} מתוך 4)`]
    : !has('lamp') && !has('lampLit') ? ['Find a lamp for the dark oil chamber', 'למצוא נר ללשכת השמנים החשוכה']
      : !has('lampLit') ? (fl('shaved') ? ['Ask the nazir for a flame for your lamp', 'לבקש מהנזיר להבה לנר'] : !fl('razorQuest') ? ['Find a flame for your lamp. The Nazirites’ chamber has a fire going.', 'למצוא להבה לנר. בלשכת הנזירים דולקת אש.'] : has('razor') ? ['Bring the nazir his razor', 'להביא לנזיר את התער שלו'] : ['Find the nazir’s razor in the wood chamber', 'למצוא את התער של הנזיר בלשכת העצים'])
        : ['Go into Beit Shemaniya, the oil chamber', 'להיכנס לבית שמניה, לשכת השמנים'],
  async intro() {
    await lines(['narr', ['The Ezrat Nashim. Four chambers sit in its corners, open to the sky: the Nazirites’, the wood chamber, the metzora’im’s, and Beit Shemaniya, the oil chamber.', 'עזרת הנשים. ארבע לשכות בפינותיה, פתוחות לשמיים: לשכת הנזירים, לשכת העצים, לשכת המצורעים, ובית שמניה, לשכת השמנים.']], ['eli', ['The oil chamber. If there’s pure oil anywhere, it’s there.', 'לשכת השמנים. אם יש שמן טהור איפשהו, הוא שם.']], ['baker', ['Kohen! Kohen, please! I carried everything up from the camp: my bread, the terumah, my wine. I touched everything. I didn’t wash my hands. There wasn’t any water! Is it all ruined?', 'כהן! כהן, בבקשה! סחבתי הכול מהמחנה: הלחם שלי, התרומה, היין שלי. נגעתי בהכול. לא נטלתי ידיים. לא היו מים! הכול הרוס?']], ['eli', ['Let’s work out exactly what your hands did.', 'בוא נברר בדיוק מה הידיים שלך עשו.']]);
  },
  carry() { flag('warmup'); },
  // one list per visit: from the Cheil, back from the nazir, back from the wood chamber, back from the nazir again
  solution: [
    [{ o: 'oilDoor' }, { o: 'hands', a: 'tag', t: 'rishon' }, { o: 'hands', a: 'tag', t: 'sheni' }, { o: 'loafC', a: 'tag', t: 'tahor' }, { o: 'loafT', a: 'tag', t: 'shlishi' }, { o: 'wine', a: 'tag', t: 'shlishi' }, { o: 'wine', a: 'tag', t: 'rishon' }, { o: 'yochanan', a: 'talk' }, { o: 'niche', a: 'take' }, { o: 'nazirDoor' }],
    [{ o: 'woodDoor' }],
    [{ o: 'nazirDoor' }],
    [{ o: 'oilDoor' }],
  ],
});
async function talkBaker() {
  await speak('baker', fl('warmup') ? ['Thank you, Kohen. I’m going to wash my hands. Repeatedly.', 'תודה, כהן. אני הולך ליטול ידיים. הרבה פעמים.'] : ['Is it ruined? Tell me it’s not ruined.', 'זה הרוס? תגיד לי שזה לא הרוס.']);
}
async function talkYochanan() {
  await speak('yochanan', ['Yochanan, in charge of the seals. Want wine and flour for your korban? Buy a token: calf, ram, kid or sinner. Four seals. Very simple system. Nobody understands it.', 'יוחנן, האחראי על החותמות. צריך יין וסולת לקרבן? קונים אסימון: עגל, זכר, גדי או חוטא. ארבעה חותמות. שיטה מאוד פשוטה. אף אחד לא מבין אותה.']);
  while (true) {
    const i = await ask('yochanan', ['Anything else?', 'עוד משהו?'], [{ t: ['Is a token a seal on a jug?', 'אסימון זה חותם על כד?'] }, { t: ['What does the Kohen Gadol’s seal look like?', 'איך נראה החותם של הכהן הגדול?'] }, { t: ['Thank you. That’s all.', 'תודה. זה הכול.'], ok: true }]);
    if (i === 0) { await speak('yochanan', ['A token? No! A token is a receipt. You hand it in and get your wine. It doesn’t seal anything.', 'אסימון? לא! אסימון זה קבלה. מוסרים אותו ומקבלים יין. הוא לא חותם שום דבר.']); await lesson('tokens'); }
    else if (i === 1) { await speak('yochanan', ['A pomegranate, with “for the Kohen Gadol” around it. If you ever find it on a jug, nobody has opened that jug.', 'רימון, ומסביבו "לכהן גדול". אם אי פעם תמצא אותו על כד, אף אחד לא פתח את הכד הזה.']); flag('yochanan'); }
    else break;
  }
}

// ============================================================ 9. The Nazirites' chamber
// The order is fixed: the nazir has to tell Eli about his razor (flag razorQuest) before the
// wood inspector will hand it over, and the nazir only offers a flame once Eli has a lamp.
SCENES.push({
  id: 'nazir', act: 2, cols: 7, rows: 5, theme: 'stone', light: 'evening',
  title: ['The Nazirites’ Chamber', 'לשכת הנזירים'],
  blurb: ['Where a nazir cooks his shelamim on the day his nezirut ends, shaves, and throws his hair into the fire.', 'כאן הנזיר מבשל את השלמים שלו ביום שנזירותו נגמרת, מגלח, ומשליך את שערו לאש.'],
  walls: [{ side: 'back', courses: 6, seed: 61 }, { side: 'left', courses: 6, seed: 62, gaps: [{ from: 3, to: 3, courses: 5 }] }],
  start: [1, 3, Math.PI / 2],
  build() {
    const fire = K3.fire(); fire.userData.flame.userData.flicker = true; const pot = K3.pot();
    thing('pot', ['The pot', 'הדוד'], group(fire, pot), 4, 1, { anchorY: 1.2, look: ['His shelamim, cooking. The fire under the pot is waiting for something.', 'השלמים שלו מתבשלים. האש מתחת לדוד מחכה למשהו.'] });
    const l = new THREE.PointLight('#ff9a40', 7, 5, 2); l.position.set(wx(4), 0.8, wz(1)); room.add(l);
    npc('nazir', 'nazir', 3, 1, { actions: () => [A.talk(talkNazir), A.look(fl('shaved') ? ['The former nazir. Bald, beaming, and slightly chilly.', 'הנזיר לשעבר. קירח, קורן, וקצת קר לו.'] : ['A nazir on the last day of his nezirut. Thirty days of hair. He keeps stroking it.', 'נזיר ביום האחרון של נזירותו. שלושים יום של שיער. הוא לא מפסיק ללטף אותו.']),
      ...(has('razor') && !fl('shaved') ? [A.act('give', ['Give him his razor', 'לתת לו את התער'], giveRazor)] : []),
      ...(fl('shaved') && has('lamp') ? [A.act('light', ['Ask him for a flame for your lamp', 'לבקש ממנו להבה לנר'], lightLamp)] : [])] });
    if (fl('shaved')) G.objs.nazir.group.userData.hair.visible = false;
    scatter(6, 3, r => K3.log(0.6), [[5, 0], [6, 0], [6, 1]]);
    exitAt('exit', 0, 3, 'hub', ['Back to the courtyard', 'חזרה לעזרה']);
  },
  objective: () => !fl('razorQuest') ? ['Talk to the nazir', 'לדבר עם הנזיר']
    : !fl('shaved') ? (has('razor') ? ['Give the nazir his razor', 'לתת לנזיר את התער שלו'] : ['Find the nazir’s razor. He thinks it’s in the wood chamber.', 'למצוא את התער של הנזיר. הוא חושב שהוא בלשכת העצים.'])
      : has('lamp') ? ['Ask the nazir for a flame', 'לבקש מהנזיר להבה'] : ['Back to the courtyard', 'חזרה לעזרה'],
  carry() { flag('razorQuest'); flag('shaved'); take('lamp'); give('lampLit'); },
  // one list per visit: first to hear about the razor, then to give it back
  solution: [
    [{ o: 'nazir', a: 'talk' }, { o: 'exit' }],
    [{ o: 'nazir', a: 'give' }, { o: 'exit' }],
  ],
});
async function talkNazir() {
  if (fl('shaved')) { await speak('nazir', has('lampLit') ? ['I feel so light. Is it cold in here, or is it me?', 'אני מרגיש כל כך קל. קר פה, או שזה אני?'] : ['Thirty days of hair, gone. I feel so light.', 'שלושים יום של שיער, ואין. אני מרגיש כל כך קל.']); return; }
  if (fl('razorQuest')) { await speak('nazir', has('razor') ? ['Is that... is that my razor?', 'זה... זה התער שלי?'] : ['Any sign of my razor? The wood chamber, I think. I think.', 'יש סימן לתער שלי? בלשכת העצים, נדמה לי. נדמה לי.']); return; }
  await lines(
    ['nazir', ['Thirty days. Thirty days of no wine, no grapes, no raisins, no haircuts. Today it ends! My shelamim are cooking, the fire’s going, and I have to shave and throw my hair under the pot.', 'שלושים יום. שלושים יום בלי יין, בלי ענבים, בלי צימוקים, בלי תספורת. היום זה נגמר! השלמים שלי מתבשלים, האש בוערת, ואני צריך לגלח ולהשליך את השער מתחת לדוד.']],
    ['nazir', ['Only... I can’t find my razor.', 'רק... אני לא מוצא את התער שלי.']],
  );
  await ask('nazir', ['Have you seen a razor?', 'ראית תער?'], [{ t: ['Where did you last have it?', 'איפה הוא היה בפעם האחרונה?'], ok: true }]);
  await speak('nazir', ['The wood chamber. I went to borrow kindling. I think. I don’t know. I haven’t been able to think since the grapes stopped.', 'לשכת העצים. הלכתי לשאול קיסמים. נדמה לי. אני לא יודע. אני לא מצליח לחשוב מאז שהענבים נגמרו.']);
  await speak('eli', ['I’ll look for it.', 'אני אחפש אותו.']);
  flag('razorQuest'); objective();
}
async function giveRazor() {
  if (!has('razor')) return;
  take('razor');
  await speak('nazir', ['MY RAZOR!', 'התער שלי!']);
  endTalk();
  const g = G.objs.nazir.group;
  await animate(800, k => { g.userData.hair.scale.y = 1 - k; });
  g.userData.hair.visible = false;
  flag('shaved');
  await speak('nazir', ['There. And into the fire under the pot it goes, just as the Mishnah says.', 'הנה. ולתוך האש שמתחת לדוד, בדיוק כמו שכתוב במשנה.']);
  await lesson('nazirHair');
  if (has('lamp')) {
    await lines(['eli', ['Could I take a flame from your fire? For my lamp. The oil chamber is pitch dark.', 'אפשר לקחת להבה מהאש שלך? בשביל הנר שלי. בלשכת השמנים חושך מצרים.']]);
    await lightLamp();
  } else await speak('nazir', ['Thank you, Kohen. I owe you one.', 'תודה, כהן. אני חייב לך.']);
  objective();
}
async function lightLamp() {
  take('lamp'); give('lampLit');
  await lines(['nazir', ['For the man who found my razor? One flame, from the fire of a very happy nazir.', 'בשביל מי שמצא לי את התער? להבה אחת, מהאש של נזיר מאוד שמח.']], ['eli', ['Thank you. And... it looks good. Very aerodynamic.', 'תודה. ו... זה נראה טוב. מאוד אווירודינמי.']]);
  objective();
}

// ============================================================ 10. The wood chamber
SCENES.push({
  id: 'wood', act: 2, cols: 7, rows: 5, theme: 'stone', light: 'evening',
  title: ['The Wood Chamber', 'לשכת העצים'],
  blurb: ['Every log for the mizbe’ach is checked here, one by one, for worms.', 'כל עץ למזבח נבדק כאן, אחד אחד, מתולעים.'],
  walls: [{ side: 'back', courses: 6, seed: 71 }, { side: 'left', courses: 6, seed: 72, gaps: [{ from: 3, to: 3, courses: 5 }] }],
  start: [1, 3, Math.PI / 2],
  build() {
    const pile = new THREE.Group(); const r = rng(8);
    for (let i = 0; i < 12; i++) { const l = K3.log(0.9, r() > 0.5 ? '#8c6440' : '#7a5636'); l.position.set((i % 4) * 0.25 - 0.4, Math.floor(i / 4) * 0.2, (r() - 0.5) * 0.3); l.rotation.y = 0.1 * (r() - 0.5); pile.add(l); }
    thing('pile', ['A pile of logs', 'ערימת עצים'], pile, 5, 0, { dx: -0.2, tiles: [[4, 0], [5, 0], [6, 0]], look: ['Four thousand logs, checked. Probably.', 'ארבעת אלפים עצים, בדוקים. כנראה.'] });
    npc('inspector', 'inspector', 2, 1, { actions: () => [A.talk(talkInspector), A.look(['A Kohen with a blemish, so he can’t serve at the mizbe’ach. Instead he checks every log that goes onto it. He takes this extremely seriously.', 'כהן בעל מום, ולכן הוא לא יכול לעבוד על המזבח. במקום זה הוא בודק כל עץ שעולה עליו. הוא לוקח את זה מאוד ברצינות.'])] });
    const razor = group(mesh(new THREE.BoxGeometry(0.22, 0.02, 0.06), mat('#b8bec6', { metalness: 0.6, roughness: 0.3 }), 0, 0.66, 0), mesh(new THREE.BoxGeometry(0.6, 0.05, 0.5), mat(C.wood), 0, 0.62, 0), mesh(new THREE.BoxGeometry(0.06, 0.6, 0.4), mat(C.woodDark), 0, 0.3, 0));
    ST.razorG = razor.children[0]; ST.razorG.visible = !has('razor') && !fl('shaved');
    addObj('table', { name: ['The inspector’s table', 'השולחן של הבודק'], group: razor, at: [1, 1], tiles: [[1, 1]], anchorY: 1,
      actions: () => [A.look(!ST.razorG.visible ? ['An empty table. Very tidy.', 'שולחן ריק. מאוד מסודר.'] : fl('razorQuest') ? ['A razor, covered in bark. The nazir’s, unless I’m very wrong.', 'תער, מכוסה קליפות עץ. של הנזיר, אלא אם כן אני ממש טועה.'] : ['A razor, covered in bark. Odd thing to find in a wood chamber.', 'תער, מכוסה קליפות עץ. דבר מוזר למצוא בלשכת העצים.']),
        ...(ST.razorG.visible ? [A.say('take', ['Take the razor', 'לקחת את התער'], ['inspector', ['That’s mine! I found it. Finders, keepers. Scrapers.', 'זה שלי! אני מצאתי אותו. מי שמוצא, שומר. ומגרד.']])] : [])] });
    const logs = { logA: ['Tiny holes all along it. Something lives in here.', 'חורים קטנטנים לכל אורכו. מישהו גר כאן.'], logB: ['Smooth. No holes, no sawdust, no tenants.', 'חלק. בלי חורים, בלי נסורת, בלי דיירים.'], logC: ['Looks fine... until I turn it over. A worm waves at me.', 'נראה בסדר... עד שאני הופך אותו. תולעת מנופפת אליי.'] };
    Object.entries(logs).forEach(([id, look], i) => {
      thing(id, [`Log ${['one', 'two', 'three'][i]}`, `עץ ${['ראשון', 'שני', 'שלישי'][i]}`], K3.log(0.8, ['#86603c', '#8c6a44', '#7e5a38'][i]), 3 + i, 3, { anchorY: 0.8, look,
        acts: [() => A.act('fit', ['Mark it fit for the mizbe’ach', 'לסמן אותו ככשר למזבח'], () => markLog(id), fl('logFound'))] });
    });
    exitAt('exit', 0, 3, 'hub', ['Back to the courtyard', 'חזרה לעזרה']);
  },
  objective: () => !fl('logFound') ? ['Help the inspector find a log without worms', 'לעזור לבודק למצוא עץ בלי תולעים']
    : fl('razorQuest') && !has('razor') && !fl('shaved') ? ['Ask the inspector for the nazir’s razor', 'לבקש מהבודק את התער של הנזיר'] : ['Back to the courtyard', 'חזרה לעזרה'],
  carry() { flag('logFound'); give('wedge'); },
  solution: [{ o: 'inspector', a: 'talk' }, { o: 'logC', a: 'fit' }, { o: 'logB', a: 'fit' }, { o: 'exit' }],
});
// the razor only changes hands once the nazir has said it's his, and once the inspector has his log
const razorOwed = () => fl('razorQuest') && fl('logFound') && !has('razor') && !fl('shaved');
async function handOverRazor() {
  give('razor'); if (ST.razorG) ST.razorG.visible = false;
  await speak('inspector', ['The nazir’s, you say? Then take it, with my blessing. I’ll scrape bark with my fingernails like everyone else.', 'של הנזיר, אתה אומר? אז קח אותו, בברכה. אני אגרד קליפות עם הציפורניים כמו כולם.']);
  objective();
}
async function talkInspector() {
  if (razorOwed()) { await speak('eli', ['That razor on your table. It belongs to the nazir next door. He can’t finish his nezirut without it.', 'התער הזה על השולחן שלך. הוא של הנזיר מהלשכה הסמוכה. הוא לא יכול לסיים את הנזירות בלעדיו.']); await handOverRazor(); return; }
  if (fl('logFound')) { await speak('inspector', ['One good log. I may weep.', 'עץ טוב אחד. אני עלול לבכות.']); return; }
  await speak('inspector', ['Every log for the mizbe’ach gets checked. A log with a worm in it is unfit. I have checked four thousand logs today. I can’t see straight. Find me one good log among these three and I’ll stop talking.', 'כל עץ למזבח נבדק. עץ שיש בו תולעת פסול. בדקתי היום ארבעת אלפים עצים. אני כבר לא רואה ישר. תמצא לי עץ טוב אחד מבין השלושה האלה ואני אפסיק לדבר.']);
  if (fl('razorQuest') && !has('razor') && !fl('shaved')) await lines(
    ['eli', ['Is that a razor on your table?', 'זה תער על השולחן שלך?']],
    ['inspector', ['This? I found it. It’s very good for scraping bark.', 'זה? מצאתי אותו. הוא מצוין לגירוד קליפות.']],
    ['eli', ['It’s the nazir’s.', 'הוא של הנזיר.']],
    ['inspector', ['Then he can have it back when I have a good log.', 'אז הוא יקבל אותו בחזרה כשיהיה לי עץ טוב.']],
  );
}
async function markLog(id) {
  if (id !== 'logB') { await lines(['inspector', ['A worm! Look! Right there! Waving!', 'תולעת! תסתכל! ממש שם! מנופפת!']], ['eli', ['...Hello, worm.', '...שלום, תולעת.']]); return; }
  flag('logFound'); give('wedge');
  await lines(['inspector', ['No holes. No sawdust. Fit for the mizbe’ach. Finally.', 'בלי חורים. בלי נסורת. כשר למזבח. סוף סוף.']], ['inspector', ['Take this stone. I use it to keep the door from slamming. It’s a very good stone. Don’t tell anyone I gave you a stone; they’ll all want one.', 'קח את האבן הזאת. אני משתמש בה כדי שהדלת לא תיטרק. זו אבן טובה מאוד. אל תספר לאף אחד שנתתי לך אבן; כולם ירצו אחת.']]);
  if (razorOwed()) { await speak('eli', ['And the razor? The nazir is waiting for it.', 'והתער? הנזיר מחכה לו.']); await handOverRazor(); }
  await lesson('worms');
  objective();
}

// ============================================================ 11. Beit Shemaniya, the oil chamber
const OIL_TAGS = ['mouseDead', 'jugA', 'puddle', 'loaf', 'cake', 'measure', 'jugC', 'jugsD', 'cup'];
SCENES.push({
  id: 'oil', act: 2, cols: 8, rows: 6, theme: 'stone', light: 'dark', dark: true,
  title: ['Beit Shemaniya', 'בית שמניה'],
  blurb: ['The oil chamber. Big jugs everywhere, every one of them opened, moved or worse. Somewhere in here there may be one that isn’t.', 'לשכת השמנים. כדים גדולים בכל מקום, כל אחד מהם נפתח, הוזז או גרוע מזה. אולי איפשהו כאן יש אחד שלא.'],
  walls: [{ side: 'back', courses: 7, seed: 3 }, { side: 'left', courses: 7, seed: 4, gaps: [{ from: 4, to: 4, courses: 5 }] }, { side: 'right', courses: 3, seed: 5, from: -0.5, to: 1.6 }],
  start: [1, 4, Math.PI / 2],
  pre() { ST.done = fl('oilDone'); },
  build() { buildOilChamber(); },
  objective: () => {
    const n = OIL_TAGS.filter(id => (P.tags.oil || {})[id]).length;
    if (!fl('ledgerDone')) return [`Tag everything for Yoezer’s ledger (${n} of ${OIL_TAGS.length})`, `לתייג הכול לפנקס של יועזר (${n} מתוך ${OIL_TAGS.length})`];
    if (!has('jug')) return ['The mouse is scratching at a loose tile', 'העכבר מגרד במרצפת רופפת'];
    if (!fl('oilDone')) return ['Win Yoezer’s argument', 'לנצח את יועזר בוויכוח'];
    return ['Out, and on toward the Heichal', 'החוצה, ובדרך להיכל'];
  },
  onTag: async () => { if (!fl('ledgerDone') && tagsDone(OIL_TAGS)) await ledgerDone(); },
  async intro() {
    await lines(
      ['levi', ['...four hundred and eleven... four hundred and twelve... A light! Finally! Four hundred and— who are you? Now I’ve lost count.', '...ארבע מאות ואחד עשר... ארבע מאות ושנים עשר... אור! סוף סוף! ארבע מאות ו— מי אתה? עכשיו התבלבלתי בספירה.']],
      ['eli', ['Eli. I’m a Kohen. Yehuda sent me. I need pure oil for the menorah.', 'אלי. אני כהן. יהודה שלח אותי. אני צריך שמן טהור למנורה.']],
      ['levi', ['Pure oil! In here? Young man, the Greeks opened every jug in this chamber. Then a mouse fell into the big one. Then my lunch fell into the oil. Nothing in Beit Shemaniya is fit for anything.', 'שמן טהור! כאן? בחור צעיר, היוונים פתחו כל כד בלשכה הזאת. אחר כך עכבר נפל לגדול. אחר כך ארוחת הצהריים שלי נפלה לשמן. שום דבר בבית שמניה לא כשר לכלום.']],
    );
    const i = await ask('levi', ['And what’s all that on your back?', 'ומה זה כל מה שיש לך על הגב?'], [{ t: ['Spears. The quartermaster made me sign for them.', 'רמחים. האפסנאי החתים אותי עליהם.'], ok: true }, { t: ['Spare spears. For spare emergencies.', 'רמחים רזרביים. למקרי חירום רזרביים.'] }, { t: ['What spears?', 'איזה רמחים?'] }]);
    if (i === 0) await speak('levi', ['Of course he did.', 'ברור שהוא החתים.']);
    if (i === 1) await speak('levi', ['...Right.', '...בסדר.']);
    if (i === 2) await lines(['levi', ['The three very large spears. On your back.', 'שלושת הרמחים הענקיים. על הגב שלך.']], ['eli', ['Oh. Those spears.', 'אה. הרמחים האלה.']]);
    await lines(
      ['levi', ['Well. If you want to look around, it’s my storeroom, so we do it properly. Everything gets written in my ledger: what it is, and how tamei it is. You tag it, I write it.', 'טוב. אם אתה רוצה להסתכל מסביב, זה המחסן שלי, אז עושים את זה כמו שצריך. כל דבר נרשם בפנקס שלי: מה הוא, וכמה הוא טמא. אתה מתייג, אני רושם.']],
      ['eli', ['And if I find something pure?', 'ואם אמצא משהו טהור?']],
      ['levi', ['Then I’ll eat my ledger.', 'אז אני אוכל את הפנקס שלי.']],
    );
  },
  carry() { flag('ledgerDone'); flag('oilDone'); give('jug'); },
  solution: [
    { o: 'jugA', a: 'peek', m: 'tag', t: 'av' },
    { o: 'jugA', a: 'tag', t: 'tahor' }, { o: 'jugA', a: 'tag', t: 'rishon' },
    { o: 'puddle', a: 'tag', t: 'rishon' }, { o: 'loaf', a: 'tag', t: 'sheni' }, { o: 'cake', a: 'tag', t: 'shlishi' },
    { o: 'measure', a: 'tag', t: 'revii' }, { o: 'measure', a: 'tag', t: 'rishon' },
    { o: 'jugC', a: 'tag', t: 'untrusted' }, { o: 'jugsD', a: 'tag', t: 'untrusted' },
    { o: 'cup', a: 'take' }, { o: 'cup', a: 'tag', t: 'tahor' }, { o: 'cup', a: 'take' },
    { o: 'tile', a: 'pry' }, { o: 'exit' },
  ],
});
function buildOilChamber() {
  const r = rng(7);
  // shelf along the back wall
  const shelf = new THREE.Group(), sx = wx(2), sz = wz(0) - 0.27;
  for (const y of [0.55, 1.12]) shelf.add(mesh(new THREE.BoxGeometry(2.85, 0.07, 0.44), mat(C.wood), sx, y, sz));
  for (const dx of [-1.35, 0, 1.35]) shelf.add(mesh(new THREE.BoxGeometry(0.08, 1.15, 0.4), mat(C.woodDark), sx + dx, 0.575, sz));
  for (const [dx, y, tipped] of [[-1.05, 0.59, false], [-0.7, 0.59, true], [0.65, 0.59, false], [-0.9, 1.16, false], [0.2, 1.16, true], [0.95, 1.16, false]]) {
    const j = mesh(jugGeo(0.28), mat(C.clayLight)); j.position.set(sx + dx, y, sz); if (tipped) { j.rotation.z = Math.PI / 2; j.position.y += 0.1; } shelf.add(j);
  }
  room.add(shelf);
  for (const [c, rr, cnt] of [[2, 1, 3], [6, 0, 6], [7, 0, 7], [3, 4, 2]]) for (let i = 0; i < cnt; i++) { const s = K3.shard(r); s.position.set(wx(c) + (r() - 0.5) * 0.8, 0.02, wz(rr) + (r() - 0.5) * 0.8); room.add(s); }
  const tipped = K3.jug({ s: 0.85, broken: true }); tipped.rotation.set(0, 0.8, Math.PI / 2.2); deco(tipped, 6, 0, { dx: 0.6, y: 0.32, block: [[6, 0], [7, 0]] });
  deco(K3.crate(0.72), 7, 5); deco(group(mesh(new THREE.DodecahedronGeometry(0.28, 0), mat('#b9a27a'))), 7, 4, { dx: 0.1, y: 0.2 });
  const flame = mesh(new THREE.ConeGeometry(0.07, 0.2, 5), basic('#ffb347'), wx(0) - 0.47, 1.58, wz(4) - 0.85, false); flame.userData.flicker = true; room.add(flame);
  const tl = new THREE.PointLight('#ff8c3a', 5, 5, 2); tl.position.set(wx(0) - 0.55, 1.45, wz(4) - 0.85); room.add(tl);

  const LOOKS = {
    jugA: ['A big clay jug, open at the top. It smells like oil and something else. Something that used to squeak.', 'כד חרס גדול, פתוח מלמעלה. יש בו ריח של שמן ועוד משהו. משהו שפעם צייץ.'],
    puddle: ['Oil from the big jug spilled when it tipped. It’s spreading toward everything Yoezer owns.', 'שמן מהכד הגדול נשפך כשהכד נטה. הוא מתפשט לכיוון כל מה ששייך ליועזר.'],
    loaf: ['A loaf of ordinary bread, half in the oil. Yoezer keeps looking at it the way you’d look at an old friend.', 'כיכר לחם רגיל, חציה בתוך השמן. יועזר מביט בה כמו שמביטים בחבר ותיק.'],
    cake: ['A terumah cake. A Kohen left it on a plate when the Greeks came. It slid off the plate, over the loaf, and into the bronze measure.', 'עוגת תרומה. כהן השאיר אותה על צלחת כשהיוונים הגיעו. היא החליקה מהצלחת, עברה על הכיכר ונפלה לתוך מידת הנחושת.'],
    measure: ['A bronze half-log measure: exactly enough for one lamp of the menorah. It’s full of oil set aside for the menorah. And a cake.', 'מידת נחושת של חצי לוג: בדיוק הכמות לנר אחד של המנורה. היא מלאה שמן שהופרש למנורה. ועוגה.'],
    jugC: ['A sealed jug. The seal is perfect! Finally, something in here that— hm. Why is the floor like that?', 'כד חתום. החותם שלם! סוף סוף משהו כאן ש... הממ. למה הרצפה נראית ככה?'],
    jugsD: ['Big jugs, opened and knocked over. Someone broke the seals and threw them on the floor. Then, apparently, kicked them.', 'כדים גדולים, פתוחים והפוכים. מישהו שבר את החותמות וזרק אותם על הרצפה. ואז, כנראה, גם בעט בהם.'],
    cup: ['A plain stone cup. The only thing in this chamber nobody bothered to smash.', 'כוס אבן פשוטה. הדבר היחיד בלשכה הזאת שאף אחד לא טרח לשבור.'],
  };
  const WR = {
    mouseDead: { rishon: ['eli', ['Rishon of what? Nothing made the mouse tamei. The chain starts with it.', 'ראשון למה? שום דבר לא טימא את העכבר. השרשרת מתחילה ממנו.']], tahor: ['levi', ['It was tahor when it was alive. That’s rather the point.', 'הוא היה טהור כשהיה חי. זה בדיוק העניין.']], _: ['levi', ['It’s not one step from anything. It’s where everything starts.', 'הוא לא דרגה אחת מתחת לשום דבר. ממנו הכול מתחיל.']] },
    jugA: { av: ['eli', ['The mouse is the Av. The jug only caught it from the mouse.', 'העכבר הוא האב. הכד רק נדבק ממנו.']], tahor: ['levi', ['Nobody touched it, you say? Clay doesn’t need touching. It’s the inside that counts.', 'אף אחד לא נגע בו, אתה אומר? כלי חרס לא צריך שיגעו בו. מה שבפנים קובע.']], _: ['eli', ['Count again. How many steps between the mouse and the jug it’s floating in?', 'צריך לספור שוב. כמה צעדים יש בין העכבר לבין הכד שהוא צף בו?']] },
    puddle: { sheni: ['levi', ['One step down from the jug, so Sheni? Not oil. Liquids don’t step down. They jump right back to the top.', 'דרגה אחת מתחת לכד, אז שני? לא בשמן. משקים לא יורדים בדרגה. הם קופצים ישר חזרה למעלה.']], tahor: ['levi', ['It came out of the mouse jug! Would you like some on your bread? Oh wait. I already have some on mine.', 'הוא יצא מכד העכבר! רוצה קצת על הלחם שלך? אה, רגע. כבר יש קצת על שלי.']], _: ['eli', ['Where did this oil come from, and what does that make it?', 'מאיפה בא השמן הזה, ומה זה עושה אותו?']] },
    loaf: { rishon: ['eli', ['Bread going one step down from a Rishon makes... not a Rishon. Only liquids jump back up.', 'לחם שיורד דרגה אחת מראשון הוא... לא ראשון. רק משקים קופצים חזרה למעלה.']], tahor: ['levi', ['It’s sitting IN the oil. Believe me, I’ve checked. Several times. With feeling.', 'היא יושבת בתוך השמן. תאמין לי, בדקתי. כמה פעמים. ברגש.']], _: ['eli', ['It touched the oil directly. One step down from the oil.', 'היא נגעה ישר בשמן. דרגה אחת מתחת לשמן.']] },
    cake: { tahor: ['levi', ['To ordinary bread, my loaf can’t do a thing anymore. But terumah is holier.', 'ללחם רגיל, הכיכר שלי כבר לא יכולה לעשות כלום. אבל תרומה קדושה יותר.']], sheni: ['eli', ['One more step: it touched a Sheni.', 'עוד דרגה אחת: היא נגעה בשני.']], revii: ['eli', ['Terumah doesn’t go that far. That’s kodesh.', 'תרומה לא מגיעה עד לשם. זה קודש.']], _: ['eli', ['It touched Yoezer’s loaf. What is the loaf, and how far down does terumah go?', 'היא נגעה בכיכר של יועזר. מה הכיכר, ועד כמה רחוק יורדת תרומה?']] },
    measure: { revii: ['levi', ['Ha! That’s what I said the first time. Revi’i would be right for a cake of kodesh. But oil is a liquid. Liquids jump.', 'הא! בדיוק מה שאני אמרתי בפעם הראשונה. רביעי היה נכון לעוגה של קודש. אבל שמן הוא משקה. משקים קופצים.']], shlishi: ['eli', ['That’s what the cake is. What does a Shlishi do to a liquid?', 'זה מה שהעוגה. מה עושה שלישי למשקה?']], tahor: ['levi', ['A terumah cake fell in it. It’s not tahor. I’m not even angry. I’m just sad.', 'עוגת תרומה נפלה לתוכו. הוא לא טהור. אני אפילו לא כועס. אני פשוט עצוב.']], _: ['eli', ['It’s kodesh, and it’s a liquid. Liquids don’t count down.', 'זה קודש, וזה משקה. משקים לא יורדים בדרגה.']] },
    jugC: { tahor: ['levi', ['Look at the floor, young man. The floor never lies. It just lies there.', 'תסתכל על הרצפה, בחור צעיר. רצפה לא משקרת. היא רק שוכבת שם כל היום.']], _: ['eli', ['The seal’s perfect. But look at the floor next to it. Can I rely on a jug that’s been moved?', 'החותם שלם. אבל תסתכל על הרצפה לידו. אפשר לסמוך על כד שהזיזו אותו?']] },
    jugsD: { tahor: ['levi', ['Would you bet the menorah on it?', 'היית מהמר על המנורה?']], _: ['eli', ['Broken seals. Who knows who touched them? That’s the problem, not a step on the ladder.', 'חותמות שבורים. מי יודע מי נגע בהם? זאת הבעיה, לא דרגה בסולם.']] },
    cup: { untrusted: ['eli', ['It’s stone. Stone doesn’t do tumah. You can trust it more than anything in here.', 'זאת אבן. אבן לא מקבלת טומאה. אפשר לסמוך עליה יותר מעל כל דבר אחר כאן.']], _: ['levi', ['Stone? Tamei? Ask any stone. It’ll tell you.', 'אבן? טמאה? תשאל כל אבן. היא תגיד לך.']] },
  };
  const tagged = id => (P.tags.oil || {})[id];
  const T = (id, def) => addObj(id, { why: 'r_' + id, wrong: WR[id], ...def, actions: () => [A.look(LOOKS[id], id === 'jugC' ? sealCloseup : null), ...(def.extra ? def.extra() : []), A.tag(id)] });
  { const g = K3.jug({ open: true }); g.rotation.z = 0.06; T('jugA', { name: ['Big open jug', 'כד גדול פתוח'], tiles: [[5, 0]], group: g, at: [5, 0, 0.05, -0.05], anchorY: 1.65, answer: 'rishon', extra: () => [A.act('peek', ['Peek inside', 'להציץ פנימה'], peekJug)] }); }
  { const p = mesh(new THREE.CircleGeometry(0.58, 10).rotateX(-Math.PI / 2), mat(C.oil, { roughness: 0.15, metalness: 0.15, emissive: '#5a3c00', emissiveIntensity: 0.35, flatShading: false }), 0, 0.008, 0, false); p.scale.set(1.15, 1, 0.8);
    T('puddle', { name: ['Spilled oil', 'שמן שנשפך'], tiles: [[5, 1]], group: group(p), at: [5, 1, 0.15, -0.05], anchorY: 0.45, answer: 'rishon', extra: () => [A.say('walk', ['Walk through it', 'לעבור דרכו'], ['eli', ['No. I’m not walking through oil from the mouse jug. Not today, not in these sandals.', 'לא. אני לא הולך דרך שמן מכד העכבר. לא היום, ולא בסנדלים האלה.']])] }); }
  { const l = mesh(new THREE.IcosahedronGeometry(0.2, 1), mat(C.bread)); l.scale.set(1.35, 0.6, 0.95); l.position.y = 0.1;
    T('loaf', { name: ['Yoezer’s lunch', 'ארוחת הצהריים של יועזר'], tiles: [[6, 1]], group: group(l), at: [6, 1, -0.28, 0.05], anchorY: 0.62, answer: 'sheni', extra: () => [['eat', ['Eat it', 'לאכול אותה'], () => busy(() => lines(['levi', ['That is my lunch.', 'זאת ארוחת הצהריים שלי.']], ['eli', ['Was.', 'הייתה.']], ['levi', ['...Was.', '...הייתה.']]))]] }); }
  { const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.24, 10, 1, true), mat(C.bronze, { metalness: 0.55, roughness: 0.45, side: THREE.DoubleSide }), 0, 0.12, 0));
    g.add(mesh(new THREE.CircleGeometry(0.16, 10).rotateX(-Math.PI / 2), mat(C.oil, { roughness: 0.12, emissive: '#5a3c00', emissiveIntensity: 0.4, flatShading: false }), 0, 0.2, 0, false));
    T('measure', { name: ['Half-log measure', 'מידת חצי לוג'], tiles: [[6, 2]], group: g, at: [6, 1, 0.33, 0.62], anchorY: 0.72, answer: 'rishon', extra: () => [A.say('fish', ['Fish the cake out', 'לשלוף את העוגה'], ['eli', ['Too late for that. The damage was done the moment it touched.', 'מאוחר מדי. הנזק נעשה ברגע שהיא נגעה.']])] });
    const cake = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 9), mat(C.cake), 0, 0.17, 0); cake.rotation.set(0.55, 0.6, -0.3);
    T('cake', { pickFirst: true, name: ['Terumah cake', 'עוגת תרומה'], tiles: [], near: [[6, 1], [6, 2]], group: group(cake), at: [6, 1, 0.05, 0.36], anchorY: 0.58, answer: 'shlishi', extra: () => [A.say('pick', ['Pick it up', 'להרים אותה'], ['eli', ['And make my hands a Sheni? I’ve got a jug to find. If there is one.', 'ולעשות את הידיים שלי שני? יש לי כד למצוא. אם יש כזה בכלל.']])] });
    const plate = mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.03, 9), mat(C.clayLight)); plate.rotation.z = 0.35; deco(group(plate), 6, 1, { dx: -0.4, dz: 0.31, y: 0.06, block: false }); }
  { const g = K3.jug({ open: false, sealed: true, s: 1.15 }); g.rotation.y = 0.4;
    room.add(mesh(new THREE.RingGeometry(0.3, 0.42, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: C.dust, transparent: true, opacity: 0.7 }), wx(1), 0.004, wz(2), false));
    for (const d of [-0.12, 0.12]) room.add(mesh(new THREE.BoxGeometry(0.035, 0.004, 0.62), new THREE.MeshBasicMaterial({ color: C.dust, transparent: true, opacity: 0.5 }), wx(1) + d, 0.005, wz(2) + 0.5, false));
    T('jugC', { name: ['Sealed jug', 'כד חתום'], tiles: [[1, 3]], group: g, at: [1, 3, 0.05, 0.05], anchorY: 1.7, answer: 'untrusted', extra: () => [A.act('seal', ['Inspect the seal', 'לבדוק את החותם'], sealCloseup)] }); }
  { const g = new THREE.Group();
    const a = K3.jug({ s: 1.1 }); a.rotation.set(0, 0.7, Math.PI / 2); a.position.set(wx(0) + 0.15, 0.4, wz(0) + 0.05); g.add(a);
    const b = K3.jug({ s: 1.15, broken: true }); b.position.set(wx(0) + 0.05, 0, wz(1)); b.rotation.y = 2.2; g.add(b);
    const c = K3.jug({ s: 1.2 }); c.position.set(wx(4), 0, wz(0) - 0.05); g.add(c);
    const lid = mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.08, 9), mat(C.clayDark), wx(4) + 0.45, 0.04, wz(0) + 0.42); lid.rotation.z = 0.15; g.add(lid);
    T('jugsD', { pickFirst: true, name: ['Opened jugs', 'כדים פתוחים'], tiles: [[0, 0], [0, 1], [4, 0]], group: g, anchor: new THREE.Vector3(wx(0) + 0.1, 1.55, wz(1)), answer: 'untrusted', extra: () => [A.say('check', ['Check for any oil left', 'לבדוק אם נשאר שמן'], ['eli', ['Plenty of oil. None of it with a seal anyone can vouch for.', 'המון שמן. אף טיפה עם חותם שמישהו יכול לערוב לו.']], ['levi', ['Four hundred and twelve jugs of it. Roughly.', 'ארבע מאות ושנים עשר כדים ממנו. בערך.']])] });
    G.objs.jugsD.ring.position.set(wx(0) + 0.1, 0.012, wz(1)); }
  { const g = group(mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.16, 7), mat(C.stoneCup), 0, 0.67, 0), mesh(new THREE.CircleGeometry(0.085, 7).rotateX(-Math.PI / 2), mat('#5e5a54'), 0, 0.752, 0, false));
    g.visible = !has('cup');
    T('cup', { name: ['Stone cup', 'כוס אבן'], tiles: [[1, 0], [2, 0], [3, 0]], near: [[2, 0]], group: g, anchor: new THREE.Vector3(wx(2) + 0.3, 1.0, wz(0) - 0.24), answer: 'tahor', ringY: 0.75, extra: () => [A.act('take', has('cup') ? ['Already taken', 'כבר לקחת'] : ['Take it', 'לקחת אותה'], takeCup, has('cup'))] });
    g.position.set(wx(2) + 0.3, 0, wz(0) - 0.24); G.objs.cup.ring.position.set(wx(2) + 0.3, 0.77, wz(0) - 0.24); }
  addObj('mouseDead', { name: ['Dead mouse', 'עכבר מת'], tiles: [], free: true, anchor: new THREE.Vector3(wx(5) + 0.05, 2.0, wz(0)), answer: 'av', why: 'r_mouseDead', wrong: WR.mouseDead, hiddenLabel: () => ST.peeked || tagged('mouseDead') });
  // the loose tile and what is under it
  const tile = mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), mat('#d8bc90'), 0, 0, 0, false); tile.rotation.set(0.05, 0.08, -0.04);
  const holeM = mesh(new THREE.BoxGeometry(0.8, 0.02, 0.8), mat('#20150e'), wx(3), -0.005, wz(2), false); room.add(holeM);
  const ft = room.children.find(m => m.userData.tile && m.userData.tile[0] === 3 && m.userData.tile[1] === 2); if (ft) ft.visible = false;
  addObj('tile', { name: ['Loose floor tile', 'מרצפת רופפת'], tiles: [[3, 2]], group: group(tile), at: [3, 2], y: -0.03, anchorY: 0.5,
    actions: () => [A.look(['One floor tile sits a finger’s width higher than the rest. Every floor has one.', 'מרצפת אחת בולטת ברוחב אצבע מעל השאר. בכל רצפה יש אחת כזאת.']), A.act('pry', ['Pry it up', 'לעקור אותה'], pryTile, has('jug'))] });
  if (has('jug')) { tile.position.set(0.7, 0.22, 0); tile.rotation.z = -0.5; }
  const pach = K3.smallJug(); pach.visible = false; pach.position.set(wx(3), -0.4, wz(2)); room.add(pach); ST.pach = pach;
  ST.glow = new THREE.PointLight('#ffc85a', 0, 3, 2); ST.glow.position.set(wx(3), 0.6, wz(2)); room.add(ST.glow);
  npc('levi', 'levi', 4, 4, { actions: () => [A.talk(talkYoezer), A.look(['Yoezer the Levi. In charge of this storeroom, and of a ledger he loves more than most people.', 'יועזר הלוי. אחראי על המחסן הזה, ועל פנקס שהוא אוהב יותר מרוב האנשים.'])] });
  const m = addMouse(2, 5); ST.mouse = m;
  if (fl('ledgerDone') && !has('jug')) m.goal = [3, 2];
  exitAt('exit', 0, 4, fl('oilDone') ? 'sealed' : 'hub', fl('oilDone') ? ['Out, toward the Heichal', 'החוצה, לכיוון ההיכל'] : ['Back to the courtyard', 'חזרה לעזרה'], () => has('jug') && !fl('oilDone') ? ['levi', ['Not so fast!', 'לא כל כך מהר!']] : true);
}
async function peekJug() {
  ST.peeked = true;
  const v = await openModal(() => card(U.closeUp, ['Inside the big jug', 'בתוך הכד הגדול'], `<div class="art">${ART.jugInside()}</div><p>${tx(['A mouse. A dead one. It fell in and never climbed out.', 'עכבר. מת. הוא נפל פנימה ולא יצא.'])}</p>`,
    btn('close', ['Back away', 'להתרחק'], false, true) + ((P.tags.oil || {}).mouseDead ? '' : btn('tag', ['Tag the mouse…', 'לתייג את העכבר…'], true))));
  if (v === 'tag') showTagPicker('mouseDead');
}
async function sealCloseup() {
  await openModal(() => card(U.closeUp, ['The sealed jug', 'הכד החתום'], `<div class="art">${ART.sealC()}</div><p>${tx(['The seal is unbroken. But on the floor beside the jug there’s a clean ring in the dust, the size of this jug’s base, and two drag marks leading here.', 'החותם לא שבור. אבל על הרצפה ליד הכד יש עיגול נקי באבק, בגודל הבסיס של הכד, ושני סימני גרירה שמובילים לכאן.'])}</p>`, btn('ok', ['Hm.', 'הממ.'], true)));
  await speak('eli', ['Someone moved it. Recently. Can I rely on a jug that’s been moved?', 'מישהו הזיז אותו. לאחרונה. אפשר לסמוך על כד שהזיזו אותו?']);
}
async function takeCup() {
  if (!(P.tags.oil || {}).cup) { await lines(['levi', ['Ledger first! Nothing leaves this storeroom until it’s written down.', 'קודם הפנקס! שום דבר לא יוצא מהמחסן הזה לפני שהוא רשום.']], ['eli', ['Even a cup?', 'אפילו כוס?']], ['levi', ['Especially a cup. Cups are sneaky.', 'במיוחד כוס. כוסות הן ערמומיות.']]); return; }
  give('cup'); G.objs.cup.group.visible = false;
  await lines(['eli', ['One stone cup. Whatever happens next, this cup will still be tahor.', 'כוס אבן אחת. לא משנה מה יקרה, הכוס הזאת תישאר טהורה.']], ['levi', ['Signed out. Bring it back. Eventually.', 'נרשמה ביציאה. תחזיר אותה. מתישהו.']]);
}
async function talkYoezer() {
  while (true) {
    const i = await ask('levi', fl('ledgerDone') ? ['Yes? Ledger’s done, you know.', 'כן? הפנקס גמור, אתה יודע.'] : ['Yes? Ledger’s open, young man.', 'כן? הפנקס פתוח, בחור צעיר.'], [{ t: ['What happened in here?', 'מה קרה כאן?'] }, { t: ['Any advice?', 'יש לך עצה?'] }, { t: ['Why the ledger?', 'למה הפנקס?'] }, { t: ['Nothing. Carry on counting.', 'כלום. תמשיך לספור.'], ok: true }]);
    if (i === 0) await lines(['levi', ['The Greeks came through, opened everything and threw the seals on the floor. Then a mouse fell into the big jug by the back wall. The jug tipped, the oil went everywhere, my lunch went into the oil, and some Kohen’s terumah cake slid off its plate into the half-log measure for the menorah.', 'היוונים עברו כאן, פתחו הכול וזרקו את החותמות על הרצפה. אחר כך עכבר נפל לכד הגדול ליד הקיר האחורי. הכד נטה, השמן נשפך לכל מקום, ארוחת הצהריים שלי נפלה לשמן, ועוגת תרומה של איזה כהן החליקה מהצלחת לתוך מידת חצי הלוג של המנורה.']], ['levi', ['So: a Tuesday.', 'כלומר: יום שלישי רגיל.']]);
    else if (i === 1) await speak('levi', oilHint());
    else if (i === 2) await speak('levi', ['Every jug in this chamber was counted in. Every jug gets counted out. If I don’t write it down, it didn’t happen. And if it didn’t happen, somebody will blame a Levi.', 'כל כד בלשכה הזאת נספר בכניסה. כל כד ייספר ביציאה. אם אני לא רושם, זה לא קרה. ואם זה לא קרה, מישהו יאשים לוי.']);
    else return;
  }
}
function oilHint() {
  const t = P.tags.oil || {};
  if (!ST.peeked && !t.mouseDead) return ['Start where it started. Look inside the big jug by the back wall. Look. Don’t touch.', 'תתחיל מאיפה שזה התחיל. תציץ לתוך הכד הגדול ליד הקיר האחורי. להציץ. לא לגעת.'];
  return ({
    mouseDead: ['The mouse in the big jug. Everything starts there. What’s a dead mouse?', 'העכבר בכד הגדול. הכול מתחיל שם. מה זה עכבר מת?'],
    jugA: ['What’s inside that jug, and what does that do to clay?', 'מה יש בתוך הכד הזה, ומה זה עושה לכלי חרס?'],
    puddle: ['The oil came out of the mouse jug. And oil is a liquid. Liquids are... sensitive.', 'השמן יצא מכד העכבר. ושמן הוא משקה. משקים הם... רגישים.'],
    loaf: ['My lunch touched the oil. One step down from whatever the oil is.', 'ארוחת הצהריים שלי נגעה בשמן. דרגה אחת מתחת למה שהשמן.'],
    cake: ['Terumah goes one step further than ordinary bread.', 'תרומה יורדת דרגה אחת יותר מלחם רגיל.'],
    measure: ['Menorah oil. A liquid. Liquids don’t count down the way bread does.', 'שמן המנורה. משקה. משקים לא יורדים בדרגה כמו לחם.'],
    jugC: ['That sealed one by the left wall? Look at the floor around it.', 'הכד החתום ליד הקיר השמאלי? תסתכל על הרצפה מסביבו.'],
    jugsD: ['The open ones. Would you light the menorah with oil anyone could have touched?', 'הפתוחים. היית מדליק את המנורה בשמן שכל אחד יכול היה לגעת בו?'],
    cup: ['Stone. Think about stone.', 'אבן. תחשוב על אבן.'],
  })[OIL_TAGS.find(id => !t[id])] || ['The ledger’s done. I’m going to have a nap.', 'הפנקס גמור. אני הולך לנמנם.'];
}
async function ledgerDone() {
  flag('ledgerDone'); objective();
  await lines(['levi', ['Nine items. All written. All tamei or useless, except one stone cup. As I said.', 'תשעה פריטים. כולם רשומים. כולם טמאים או חסרי תועלת, חוץ מכוס אבן אחת. כמו שאמרתי.']], ['narr', ['<em>Squeak.</em>', '<em>ציף.</em>']]);
  endTalk();
  ST.mouse.goal = [3, 2];
  await wait(1400);
  bubble(['squeak!', 'ציף!'], G.objs.tile.anchor);
  await lines(['eli', ['Look at the mouse. The live one. It’s scratching at that tile.', 'תסתכל על העכבר. החי. הוא מגרד במרצפת ההיא.']], ['levi', ['Mice. Always digging. That tile has been loose since my grandfather’s time.', 'עכברים. תמיד חופרים. המרצפת הזאת רופפת עוד מימי סבא שלי.']]);
  objective();
}
async function pryTile() {
  if (!fl('ledgerDone')) { await lines(['eli', ['That tile is definitely loose.', 'המרצפת הזאת בהחלט רופפת.']], ['levi', ['Nobody pries up my floor until the ledger’s done. Regulations.', 'אף אחד לא עוקר לי את הרצפה לפני שהפנקס גמור. תקנות.']]); return; }
  faceEliTo(G.objs.tile.anchor);
  await lines(['eli', ['I need something long and strong to lever it up. If only I had something long and strong.', 'אני צריך משהו ארוך וחזק כדי להרים אותה. אילו רק היה לי משהו ארוך וחזק.']], ['eli', ['...', '...']], ['eli', ['Oh. The spears.', 'אה. הרמחים.']], ['levi', ['Is that a regulation spear?', 'זה רומח תקני?']], ['eli', ['It’s a spare.', 'זה רזרבי.']]);
  endTalk();
  const sp = eli.model.userData.spears; sp.rotation.z = 1.2;
  const tile = G.objs.tile.group.children[0];
  await animate(900, k => { tile.position.set(k * 0.7, k * 0.25, 0); tile.rotation.z = -0.04 - k * 0.5; });
  sp.rotation.z = 0.42;
  ST.mouse.goal = [2, 2];
  ST.pach.visible = true;
  await animate(1100, k => { ST.pach.position.y = -0.4 + k * 0.42; ST.glow.intensity = k * 3; });
  await lines(['eli', ['A small jug. Sealed. Hidden under the floor, where nobody could move it.', 'כד קטן. חתום. מוסתר מתחת לרצפה, איפה שאף אחד לא יכול היה להזיז אותו.']], ['levi', ['That... was not in the ledger.', 'זה... לא היה בפנקס.']]);
  const order = ['calf', 'kg', 'owl'];
  const cap = { calf: ['A token marked “calf”', 'אסימון שכתוב עליו "עגל"'], kg: ['A pomegranate, “for the Kohen Gadol”', 'רימון, "לכהן גדול"'], owl: ['An owl', 'ינשוף'] };
  while (true) {
    const pick = await openModal(() => `<div class="eyebrow">${tx(U.closeUp)}</div><h2>${tx(['Whose seal is this?', 'של מי החותם הזה?'])}</h2>
      <p>${tx(['Yoezer opens his ledger to a page of seal impressions. One of them matches the seal on the small jug. Which one?', 'יועזר פותח את הפנקס בדף של טביעות חותם. אחת מהן תואמת את החותם על הכד הקטן. איזו?'])}</p>
      <div class="seals">${order.map(k => `<button type="button" data-v="${k}"${k === 'kg' ? ' data-ok="1"' : ''}>${sealArt(k)}<span>${tx(cap[k])}</span></button>`).join('')}</div>
      <p style="margin-top:12px">${tx(['On the jug:', 'על הכד:'])} <span style="display:inline-block;width:70px;vertical-align:middle">${sealArt('kg')}</span></p>`);
    if (pick === 'kg') break;
    await speak('levi', pick === 'calf' ? ['That’s one of the Temple’s tokens. You buy it to get the right wine and flour for a korban. It’s not anybody’s seal on a jug.', 'זה אחד האסימונים של המקדש. קונים אותו כדי לקבל את היין והסולת המתאימים לקרבן. זה לא חותם של אף אחד על כד.'] : ['An owl? That’s Greek. If you see an owl on a jug, run. Or at least don’t buy it.', 'ינשוף? זה יווני. אם אתה רואה ינשוף על כד, תברח. או לפחות אל תקנה.']);
    endTalk();
  }
  const items = [
    [['Sealed, and the seal is unbroken', 'חתום, והחותם שלם'], ['Shabbat 21b', 'שבת כא:']],
    [['The seal is the Kohen Gadol’s', 'החותם של הכהן הגדול'], ['Rashi: so they knew nobody had touched it', 'רש"י: כדי שיידעו שלא נגעו בו']],
    [['Never moved: hidden under the floor', 'לא הוזז מעולם: טמון מתחת לרצפה'], ['Tosafot', 'תוספות']],
    [['Clay, tightly sealed, so its inside never met the mouse', 'חרס, חתום היטב, כך שתוכו לא פגש את העכבר'], ['Vayikra 11:33', 'ויקרא יא, לג']],
    [['Enough for one night: seven lamps, half a log each', 'מספיק ללילה אחד: שבעה נרות, חצי לוג לכל אחד'], ['Mishnah Menachot 9:3', 'משנה מנחות ט, ג']],
  ];
  await openModal(() => `<div class="eyebrow">${tx(U.jugTitle)}</div><h2>${tx(['Is it fit for the menorah?', 'האם הוא כשר למנורה?'])}</h2>
    <ul class="check">${items.map(([a, b]) => `<li>${tx(a)} <small>${tx(b)}</small></li>`).join('')}</ul>
    <p>${tx(['For one night. The menorah needs it for eight.', 'ללילה אחד. המנורה צריכה אותו לשמונה.'])}</p><div class="actions">${btn('take', ['Take the jug', 'לקחת את הכד'], true)}</div>`,
  m => { m.querySelectorAll('.check li').forEach((li, i) => setTimeout(() => li.classList.add('on'), REDUCED ? 0 : 250 + i * 320)); });
  ST.pach.visible = false; ST.glow.intensity = 0; give('jug'); objective();
  await lines(['levi', ['Not so fast! Nobody walks out of my storeroom with a jug unless they can argue for it.', 'לא כל כך מהר! אף אחד לא יוצא מהמחסן שלי עם כד בלי להתווכח עליו.']], ['eli', ['Is that a real regulation?', 'זאת תקנה אמיתית?']], ['levi', ['It is now.', 'מעכשיו כן.']]);
  await duel('levi', [
    { say: ['You’ve been tramping around next to a puddle of tamei oil. You’re tamei yourself!', 'הסתובבת כל הזמן ליד שלולית של שמן טמא. גם אתה טמא!'],
      opts: [{ t: ['I’m wearing very clean sandals.', 'אני נועל סנדלים נקיים מאוד.'], back: [['levi', ['Your sandals are not the question.', 'הסנדלים שלך הם לא השאלה.']]] },
        { t: ['The puddle is a Rishon. Only an Av can make a person tamei. And I never touched it.', 'השלולית היא ראשון. רק אב הטומאה מטמא אדם. וחוץ מזה, לא נגעתי בה.'], ok: true },
        { t: ['Your lunch is tamei.', 'ארוחת הצהריים שלך טמאה.'], back: [['levi', ['I KNOW my lunch is tamei.', 'אני יודע שארוחת הצהריים שלי טמאה!']]] }],
      rule: ['Only an Av makes a person tamei. A Rishon can’t (Mishnah Kelim 1:1).', 'רק אב הטומאה מטמא אדם. ראשון לא יכול (משנה כלים א, א).'] },
    { say: ['That little jug sat in this room all week, a few steps from a dead mouse!', 'הכד הקטן הזה ישב בחדר הזה שבוע שלם, כמה צעדים מעכבר מת!'],
      opts: [{ t: ['Mice can’t count steps.', 'עכברים לא יודעים לספור צעדים.'], back: [['levi', ['Don’t get clever.', 'אל תתחכם.']]] },
        { t: ['It was under the floor. Hiding. Like you, from work.', 'הוא היה מתחת לרצפה. מתחבא. כמו שאתה מתחבא מעבודה.'], back: [['levi', ['I am AT work.', 'אני בעבודה!']]] },
        { t: ['The mouse was inside another jug. Clay only becomes tamei from its own inside, and this one is sealed tight.', 'העכבר היה בתוך כד אחר. כלי חרס נטמא רק מתוכו, והכד הזה חתום היטב.'], ok: true }],
      rule: ['Clay becomes tamei only through its own inside, and a tight seal protects it (Vayikra 11:33; Bamidbar 19:15).', 'כלי חרס נטמא רק מתוכו, וצמיד פתיל מגן עליו (ויקרא יא, לג; במדבר יט, טו).'] },
    { say: ['Fine. But it’s tiny! Top it up from my big jug. More oil, more light, everybody’s happy.', 'נו טוב. אבל הוא קטנטן! תמלא אותו מהכד הגדול שלי. יותר שמן, יותר אור, כולם מרוצים.'],
      opts: [{ t: ['Break the seal and pour in tamei oil? Then all of it is tamei. One small jug of pure oil beats a whole storeroom of tamei oil.', 'לשבור את החותם ולשפוך פנימה שמן טמא? אז הכול טמא. כד קטן אחד של שמן טהור שווה יותר ממחסן שלם של שמן טמא.'], ok: true },
        { t: ['Good idea. Pass the ladle.', 'רעיון טוב. תעביר את המצקת.'], back: [['eli', ['Wait. No. Absolutely not.', 'רגע. לא. בשום אופן לא.']], ['levi', ['Ha! Almost had you.', 'הא! כמעט תפסתי אותך.']]] },
        { t: ['Your big jug has a mouse in it.', 'בכד הגדול שלך יש עכבר.'], back: [['levi', ['Not THAT big jug. The other big jug.', 'לא הכד הגדול ההוא. הכד הגדול השני.']], ['eli', ['Every big jug in here is open.', 'כל הכדים הגדולים כאן פתוחים.']], ['levi', ['...Hm.', '...הממ.']]] }],
      rule: ['Tamei oil poured into pure oil makes all of it tamei. Liquids pass tumah on in any amount.', 'שמן טמא שנשפך לשמן טהור מטמא את כולו. משקים מטמאים בכל שהוא.'] },
  ]);
  await lines(['levi', ['Well argued. For a Kohen.', 'טיעון טוב. בשביל כהן.']], ['levi', ['Go on, then. And take your spears.', 'קדימה, לך. ותיקח את הרמחים שלך.']], ['eli', ['They’re not mine. They’re the quartermaster’s.', 'הם לא שלי. הם של האפסנאי.']], ['levi', ['Then take his spears.', 'אז תיקח את הרמחים שלו.']], ['eli', ['And, about eating your ledger...', 'ולגבי זה שתאכל את הפנקס...']], ['levi', ['Out.', 'החוצה.']]);
  flag('oilDone');
  const ex = G.objs.exit; ex.exit.to = 'sealed'; ex.exit.label = ['Out, toward the Heichal', 'החוצה, לכיוון ההיכל'];
  objective();
}

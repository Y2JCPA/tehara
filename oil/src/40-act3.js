// ============================================================ rules for Act III and the finale
Object.assign(RULES, {
  opening: {
    title: ['A tefach is enough', 'די בטפח'],
    body: ['Tumah passes from one room to the next through an opening of a tefach by a tefach. A smaller hole doesn’t let it through, and a closed shutter stops it. The fallen soldier is in the next room, but the open window brings the tumah into this one too.', 'טומאה עוברת מחדר לחדר דרך פתח של טפח על טפח. חור קטן יותר לא מעביר אותה, ותריס סגור עוצר אותה. החייל הנופל נמצא בחדר הסמוך, אבל החלון הפתוח מביא את הטומאה גם לחדר הזה.'],
    src: [SRC.tm141],
  },
  sealedSafe: {
    title: ['Sealed is safe, for the oil', 'צמיד פתיל, בשביל השמן'],
    body: ['A clay jug with a tight seal protects what is inside it, even under the same roof as a met. The oil would survive that room. Eli wouldn’t: a Kohen still mustn’t go in.', 'כלי חרס עם צמיד פתיל מגן על מה שבתוכו, אפילו תחת גג אחד עם מת. השמן היה שורד בחדר ההוא. אלי לא: כהן עדיין אסור לו להיכנס.'],
    src: [SRC.bamidbar1915],
  },
  personNoBlock: {
    title: ['A person can’t be a barrier', 'אדם אינו חוצץ'],
    body: ['People and vessels can form a roof that brings tumah along, but they can’t form a barrier that keeps it out. A door that Shimi holds shut is only as good as Shimi, and Shimi doesn’t count. A door wedged with a stone stands by itself.', 'אדם וכלים נעשים אוהלים לטמא, אבל לא לטהר. דלת ששמעי מחזיק סגורה טובה רק כמו שמעי, ושמעי לא נחשב. דלת שנתקעה באבן עומדת מעצמה.'],
    src: [SRC.oholot61],
  },
  anyAmount: {
    title: ['One drop is enough', 'די בטיפה'],
    body: ['Liquids become tamei, and pass it on, in any amount. Even a drop of tamei oil the size of a mustard seed makes everything it touches tamei.', 'משקים מיטמאים בכל שהוא ומטמאים בכל שהוא. אפילו טיפת שמן טמאה כחרדל מטמאת את כל מה שהיא נוגעת בו.'],
    src: [SRC.tumatOkhalin42],
  },
  courts: {
    title: ['The courtyards, one inside the other', 'העזרות, אחת בתוך השנייה'],
    body: ['Each courtyard is holier than the one outside it. A tevul yom, who has immersed but whose sun hasn’t set, may not enter the Ezrat Nashim. Someone still missing his korban may not enter the Ezrat Yisrael. A Yisrael enters the Ezrat Kohanim only for his korban. And nobody enters the Heichal without washing hands and feet.', 'כל עזרה מקודשת מזו שמחוץ לה. טבול יום, שטבל אבל השמש שלו עוד לא שקעה, לא נכנס לעזרת נשים. מחוסר כיפורים לא נכנס לעזרת ישראל. ישראל נכנס לעזרת כהנים רק לצורך הקרבן שלו. ואף אחד לא נכנס להיכל בלי לרחוץ ידיים ורגליים.'],
    src: [SRC.kelim18, SRC.kelim19],
  },
  lina: {
    title: ['Water that stood overnight', 'מים שלנו'],
    body: ['Water left in the kiyor overnight becomes unfit for washing. Ben Katin built a machine, a <em>muchani</em>, that lowered the whole kiyor into a well at night so its water never stood overnight.', 'מים שנשארו בכיור כל הלילה נפסלים לקידוש. בן קטין עשה מוכני, מכונה שהורידה את כל הכיור לבור בלילה, כדי שהמים שלו לא ייפסלו בלינה.'],
    src: [SRC.yoma310],
  },
  kiddush: {
    title: ['Washing at the kiyor', 'קידוש ידיים ורגליים'],
    body: ['Before serving, a Kohen washes his hands and his feet from the kiyor. Without it, he may not go into the Heichal.', 'לפני העבודה, כהן מקדש את ידיו ואת רגליו מן הכיור. בלי זה הוא לא נכנס להיכל.'],
    src: [SRC.shemot3019, SRC.kelim19],
  },
  altarFire: {
    title: ['Fire from the outer mizbe’ach', 'אש מהמזבח החיצון'],
    body: ['The menorah is lit only with fire taken from the outer mizbe’ach.', 'אין מדליקין את המנורה אלא מאש המזבח החיצון.'],
    src: [SRC.yoma45b],
  },
  spearsMenorah: {
    title: ['A menorah of iron spears', 'מנורה של שפודים'],
    body: ['The gold menorah was gone. The Gemara says the Chashmona’im made one from iron spits, overlaid with tin. When they grew richer they made it of silver, and later of gold.', 'מנורת הזהב לא הייתה. הגמרא אומרת שבית חשמונאי עשו מנורה משפודים של ברזל וחיפו אותם בבעץ. כשהעשירו עשו אותה מכסף, ואחר כך מזהב.'],
    src: [SRC.rh24b],
  },
  halfLog: {
    title: ['Half a log for each lamp', 'חצי לוג לכל נר'],
    body: ['Each lamp of the menorah gets half a log of oil, three and a half log in all: enough to burn through the longest night. The jug held exactly one night’s worth.', 'כל נר במנורה מקבל חצי לוג שמן, שלושה לוגים וחצי בסך הכול: מספיק כדי לדלוק גם בלילה הארוך ביותר. בכד היה בדיוק מספיק ללילה אחד.'],
    src: [SRC.menachot93, SRC.shemot2720],
  },
  eightDays: {
    title: ['Eight days', 'שמונה ימים'],
    body: ['“They found only one jug of oil lying with the seal of the Kohen Gadol, with enough to light for one day. A miracle happened, and they lit from it for eight days.” The Rambam adds: until they crushed olives and produced pure oil.', '"ולא מצאו אלא פך אחד של שמן שהיה מונח בחותמו של כהן גדול, ולא היה בו אלא להדליק יום אחד. נעשה בו נס והדליקו ממנו שמונה ימים." והרמב"ם מוסיף: עד שכתשו זיתים והוציאו שמן טהור.'],
    src: [SRC.shabbat21b, SRC.chanukah32],
  },
});

// ============================================================ 12. Sealed is safe
SCENES.push({
  id: 'sealed', act: 3, cols: 8, rows: 6, theme: 'stone', light: 'night',
  title: ['Sealed Is Safe', 'צמיד פתיל'],
  blurb: ['Night. A passage of small rooms on the way to the inner courts. In one of them lies a fallen Greek soldier.', 'לילה. מעבר של חדרים קטנים בדרך לעזרות הפנימיות. באחד מהם שוכב חייל יווני שנפל.'],
  walls: [{ side: 'back', courses: 6, seed: 81, gaps: [{ from: 4, to: 4, courses: 5 }] }, { side: 'left', courses: 6, seed: 82 }],
  start: [0, 4, Math.PI / 2],
  build() {
    const wallTile = (c, r) => { const b = mesh(new THREE.BoxGeometry(0.96, 0.85, 0.96), mat(C.stoneMid), 0, 0.425, 0); deco(group(b), c, r); };
    for (const [c, r] of [[0, 2], [1, 2], [2, 2], [2, 0], [3, 2], [5, 2], [6, 0], [6, 1], [6, 2]]) wallTile(c, r);
    // the window between the soldier's room and the passage room, with its shutter
    // a low wall with a window in it: sill, two jambs and a lintel around an opening bigger than a tefach
    const win = group(mesh(new THREE.BoxGeometry(0.98, 0.3, 0.98), mat(C.stoneMid), 0, 0.15, 0), mesh(new THREE.BoxGeometry(0.98, 0.12, 0.98), mat(C.stoneDark), 0, 0.92, 0),
      mesh(new THREE.BoxGeometry(0.98, 0.5, 0.14), mat(C.stoneMid), 0, 0.6, -0.42), mesh(new THREE.BoxGeometry(0.98, 0.5, 0.14), mat(C.stoneMid), 0, 0.6, 0.42));
    deco(win, 2, 1);
    ST.shutter = mesh(new THREE.BoxGeometry(0.06, 0.46, 0.7), mat('#6b4a2c'), 0.5, 0.6, 0.35); ST.shutter.rotation.y = -1.2; win.add(ST.shutter);
    thing('soldier', ['A fallen Greek soldier', 'חייל יווני שנפל'], K3.fallen('#7a6a5a'), 0, 0, { dx: 0.5, dz: 0.5, ry: 0.4, tiles: [[0, 0], [1, 0], [0, 1], [1, 1]], anchorY: 0.9, look: ['A Greek soldier, fallen in the fighting, in the little room behind the wall. Someone will bury him. A met is a met; burying him is a mitzvah too.', 'חייל יווני שנפל בקרב, בחדר הקטן שמאחורי הקיר. מישהו יקבור אותו. מת הוא מת; גם לקבור אותו זו מצווה.'] });
    const rope = group(mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 4), mat('#c9b48a'), 0.35, 0.9, 0.45), mesh(new THREE.TorusGeometry(0.06, 0.015, 4, 8), mat('#c9b48a'), 0.35, 0.3, 0.45));
    addObj('rope', { name: ['A rope by the window', 'חבל ליד החלון'], tiles: [[2, 2]], group: rope, at: [2, 2], anchorY: 1.4, hit: [0.5, 1.4, 0.5],
      actions: () => [A.look(['A rope runs from the window shutter, through the wall, to out here. It’s part of the building, not part of the room with the soldier.', 'חבל עובר מהתריס של החלון, דרך הקיר, עד לכאן. הוא חלק מהבניין, לא חלק מהחדר עם החייל.']),
        A.act('pull', ['Pull the rope', 'למשוך בחבל'], async () => {
          if (ST.closed) { await speak('eli', ['It’s shut.', 'הוא סגור.']); return; }
          await animate(500, k => { ST.shutter.rotation.y = -1.2 * (1 - k); ST.shutter.position.set(0.5 - 0.03 * k, 0.6, 0.35 * (1 - k)); });
          ST.closed = true; refresh();
          await speak('eli', ['Shut. No opening, no tumah coming through. The passage room is just a room again.', 'סגור. אין פתח, אין טומאה שעוברת. חדר המעבר שוב סתם חדר.']);
          await lesson('opening');
        }, ST.closed)] });
    torchPost(1, 5, 0, 0.2); torchPost(6, 5, 0, 0.2);
    exitAt('exit', 4, 0, 'door', ['Through to the next passage', 'למעבר הבא']);
  },
  hazards: () => [
    { tiles: rect(0, 1, 0, 1), why: ['That’s the soldier’s room. Under one roof with a met. No.', 'זה החדר של החייל. גג אחד עם מת. לא.'], lesson: 'ohel' },
    ...(ST.closed ? [] : [{ tiles: [...rect(3, 5, 0, 1), [4, 2]], why: ['The window between this room and the soldier’s is open, and it’s bigger than a tefach. The tumah comes right through it and fills this room too.', 'החלון בין החדר הזה לחדר של החייל פתוח, והוא גדול מטפח. הטומאה עוברת דרכו וממלאת גם את החדר הזה.'], lesson: 'opening' }]),
  ],
  objective: () => ST.closed ? ['Go through the passage room', 'לעבור דרך חדר המעבר'] : ['Find a way through the passage room', 'למצוא דרך לעבור את חדר המעבר'],
  async intro() {
    await lines(['eli', ['The way to the inner courts goes through that little room. And the room next to it has a fallen soldier in it.', 'הדרך לעזרות הפנימיות עוברת דרך החדר הקטן ההוא. ובחדר שלידו שוכב חייל שנפל.']], ['eli', ['The jug would be fine in there: it’s sealed tight. I wouldn’t.', 'לכד לא היה קורה כלום שם: הוא חתום היטב. לי כן.']]);
    await lesson('sealedSafe');
  },
  solution: [{ tile: [4, 1] }, { o: 'rope', a: 'pull' }, { o: 'exit' }],
});

// ============================================================ 13. The door that stands by itself
SCENES.push({
  id: 'door', act: 3, cols: 8, rows: 6, theme: 'stone', light: 'night',
  title: ['The Door That Stands by Itself', 'הדלת שעומדת מעצמה'],
  blurb: ['A covered passage. A storeroom opens onto it, and the storeroom has one of the fallen in it. Its door won’t stay shut.', 'מעבר מקורה. מחסן נפתח אליו, ובמחסן שוכב אחד הנופלים. הדלת שלו לא נשארת סגורה.'],
  walls: [{ side: 'back', courses: 6, seed: 91 }, { side: 'left', courses: 6, seed: 92 }],
  start: [0, 5, Math.PI / 2],
  build() {
    const wallTile = (c, r, h = 0.85) => deco(group(mesh(new THREE.BoxGeometry(0.96, h, 0.96), mat(C.stoneMid), 0, h / 2, 0)), c, r);
    for (const [c, r] of [[0, 2], [2, 2], [3, 2], [3, 1], [3, 0], [4, 2], [5, 2], [6, 2], [4, 0], [5, 0], [6, 0], [4, 1], [5, 1], [6, 1]]) wallTile(c, r);
    for (let c = 1; c < 8; c++) deco(c % 2 ? K3.crate(0.66) : K3.barrel(), c, 5);
    thing('fallen', ['One of the fallen', 'אחד הנופלים'], K3.fallen(), 0, 0, { dx: 0.5, dz: 0.4, tiles: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [2, 1]], anchorY: 0.9, look: ['In the storeroom, covered: one of the fallen, waiting to be carried out for burial.', 'במחסן, מכוסה: אחד הנופלים, מחכה שיוציאו אותו לקבורה.'] });
    // the corridor roof
    roofOver(0, 7, 3, 4, '#7a6a58', { h: 2.0, slope: 0, poles: false, opacity: 0.32 });
    ST.door = mesh(new THREE.BoxGeometry(0.85, 1.6, 0.08), mat('#6b4a2c'), -0.42, 0.8, 0); const pivot = group(ST.door); ST.door.position.x = 0.42;
    pivot.rotation.y = -1.1; ST.pivot = pivot;
    ST.wedgeM = mesh(new THREE.DodecahedronGeometry(0.11, 0), mat(C.stoneCup), 0.6, 0.1, 0.18); ST.wedgeM.visible = false;
    addObj('door', { name: ['The storeroom door', 'דלת המחסן'], tiles: [[1, 2]], group: group(pivot, ST.wedgeM), at: [1, 2, -0.42, 0.45], range: 3, anchorY: 1.9,
      actions: () => [A.look(ST.wedged ? ['Shut, with a stone against it. It stands by itself.', 'סגורה, ואבן נשענת עליה. היא עומדת מעצמה.'] : ['The door swings open every time the wind blows. Behind it is the storeroom with the fallen fighter.', 'הדלת נפתחת בכל פעם שהרוח נושבת. מאחוריה המחסן עם הלוחם שנפל.'])] });
    npc('shimi', 'shimi', 2, 4, { range: 3, actions: () => [A.talk(talkShimi), A.look(['Shimi, a Levi. He helped carry the fallen out this morning, so he is tamei met already.', 'שמעי, לוי. הוא עזר להוציא את הנופלים הבוקר, אז הוא כבר טמא מת.'])] });
    torchPost(7, 3, 0.3, 0);
    exitAt('exit', 7, 2, 'philo2', ['On toward the gates', 'הלאה, לכיוון השערים']);
  },
  hazards: () => ST.wedged ? [] : [{ tiles: without(rect(0, 7, 3, 4), [2, 4]), why: ST.held ? ['Shimi is holding the door shut, but a person can’t be a barrier against tumah. As far as tumah is concerned, that door is open.', 'שמעי מחזיק את הדלת סגורה, אבל אדם לא יכול לחצוץ בפני טומאה. מבחינת הטומאה, הדלת פתוחה.'] : ['That door is open, and behind it is a met. Under this roof, the whole passage is one tent with that storeroom.', 'הדלת הזאת פתוחה, ומאחוריה מת. תחת הגג הזה, כל המעבר הוא אוהל אחד עם המחסן.'], lesson: ST.held ? 'personNoBlock' : 'ohel' }],
  objective: () => ST.wedged ? ['Through the passage', 'לעבור את המעבר'] : ['Get the storeroom door to stay shut', 'לגרום לדלת המחסן להישאר סגורה'],
  async intro() { await lines(['shimi', ['That door won’t stay shut. Every time the wind blows: bang, open.', 'הדלת הזאת לא נשארת סגורה. בכל פעם שהרוח נושבת: בום, פתוחה.']]); },
  carry() { take('wedge'); },
  solution: [{ o: 'shimi', a: 'talk' }, { tile: [4, 3] }, { o: 'shimi', a: 'talk' }, { o: 'exit' }],
});
async function talkShimi() {
  if (ST.wedged) { await speak('shimi', ['Look at it. Standing there all by itself. I’m so proud.', 'תסתכל עליה. עומדת שם לבד. אני כל כך גאה.']); return; }
  const opts = [];
  if (!ST.held) opts.push({ t: ['Could you hold the door shut?', 'אתה יכול להחזיק את הדלת סגורה?'], ok: !has('wedge') || !ST.triedHold });
  if (has('wedge') && ST.held) opts.push({ t: ['Wedge it with this stone instead, and let go.', 'תתקע אותה עם האבן הזאת במקום, ותעזוב.'], ok: true });
  opts.push({ t: ['Never mind.', 'לא משנה.'] });
  const i = await ask('shimi', ['Want me to help?', 'רוצה שאעזור?'], opts);
  const pick = opts[i];
  if (pick.t[0].startsWith('Could')) {
    await speak('shimi', ['Of course! I’m already tamei, I helped carry the fallen out this morning.', 'בטח! אני כבר טמא, עזרתי להוציא את הנופלים הבוקר.']);
    endTalk();
    const s = G.objs.shimi.group;
    await slideTo(s, 1, 3, 600);
    await animate(400, k => { ST.pivot.rotation.y = -1.1 * (1 - k); });
    moveObjTiles('shimi', [[1, 3]]);
    ST.held = true; ST.triedHold = true; refresh();
    await speak('shimi', ['There! Shut. I’ve got it. Off you go!', 'הנה! סגורה. אני מחזיק. קדימה!']);
  } else if (pick.t[0].startsWith('Wedge')) {
    take('wedge');
    ST.wedgeM.visible = true; ST.wedged = true;
    await speak('shimi', ['A stone? From the wood inspector? He never gives anyone his stones!', 'אבן? מבודק העצים? הוא אף פעם לא נותן לאף אחד את האבנים שלו!']);
    endTalk();
    const s = G.objs.shimi.group;
    await slideTo(s, 2, 4, 600); moveObjTiles('shimi', [[2, 4]]);
    refresh();
    await lines(['shimi', ['Look: no hands! It stands by itself.', 'תראה: בלי ידיים! היא עומדת מעצמה.']], ['eli', ['That’s the point. Now it’s a door, not a Levi.', 'זה בדיוק העניין. עכשיו זו דלת, לא לוי.']]);
    await lesson('personNoBlock');
  }
}

// ============================================================ 14. Philo's last offer
SCENES.push({
  id: 'philo2', act: 3, cols: 7, rows: 5, theme: 'pave', light: 'night',
  title: ['Philo’s Last Offer', 'ההצעה האחרונה של פילון'],
  blurb: ['The last courtyard before the gates. Someone has parked an enormous jug right in the way.', 'העזרה האחרונה לפני השערים. מישהו החנה כד ענקי בדיוק באמצע הדרך.'],
  walls: [{ side: 'back', courses: 5, seed: 101 }],
  start: [0, 2, Math.PI / 2],
  build() {
    const big = K3.jug({ s: 2.0, sealed: true, color: '#c47a45' });
    thing('bigjug', ['An enormous jug', 'כד ענקי'], big, 5, 2, { tiles: [[5, 1], [5, 2], [5, 3]], anchorY: 2.6, look: ['The biggest jug in Yerushalayim, probably. Sealed with an owl. Of course it is.', 'הכד הכי גדול בירושלים, כנראה. חתום בינשוף. ברור.'] });
    for (const r of [0, 4]) deco(K3.crate(0.7), 5, r);
    npc('philo', 'philo', 4, 3, { range: 2, actions: () => [A.talk(talkPhilo2), A.look(['Philo. Again. He waves.', 'פילון. שוב. הוא מנופף.'])] });
    torchPost(2, 0, 0, -0.3); torchPost(6, 4, 0, 0.3);
    exitAt('exit', 6, 2, 'gates', ['To the gates', 'אל השערים'], () => ST.gone || ['philo', ['Ah ah ah! Not until we’ve talked business.', 'אה אה אה! לא לפני שנדבר עסקים.']]);
  },
  objective: () => ST.gone ? ['On to the gates', 'הלאה, אל השערים'] : ['Get past Philo, again', 'לעבור את פילון, שוב'],
  async intro() { await lines(['philo', ['Eli! My favourite Kohen! Look what I’ve brought you!', 'אלי! הכהן האהוב עליי! תראה מה הבאתי לך!']], ['eli', ['How did you even get past the Cheil?', 'איך בכלל עברת את החיל?']], ['philo', ['My cousin is a Levi.', 'הבן דוד שלי לוי.']]); },
  solution: [{ o: 'philo', a: 'talk' }, { o: 'exit' }],
});
async function talkPhilo2() {
  if (ST.gone) return;
  await speak('philo', ['The biggest jug in Yerushalayim. Your little jug lasts one night. Mine lasts a month! Let’s talk.', 'הכד הכי גדול בירושלים. הכד הקטן שלך מחזיק לילה אחד. שלי מחזיק חודש! בוא נדבר.']);
  await duel('philo', [
    { say: ['It’s sealed! Sealed is sealed. A seal is a seal is a seal.', 'הוא חתום! חתום זה חתום. חותם זה חותם זה חותם.'],
      opts: [{ t: ['Sealed with an owl. And it’s been bouncing around on your cart all week.', 'חתום בינשוף. והוא קפץ על העגלה שלך כל השבוע.'], ok: true },
        { t: ['It’s very shiny.', 'הוא מאוד מבריק.'], back: [['philo', ['Thank you! I polish it.', 'תודה! אני מבריק אותו.']]] },
        { t: ['A seal is a seal is an owl.', 'חותם זה חותם זה ינשוף.'], back: [['philo', ['Exactly! Wait.', 'בדיוק! רגע.']]] }],
      rule: ['A seal proves something only if it’s the right seal, on a jug nobody has moved.', 'חותם מוכיח משהו רק אם הוא החותם הנכון, על כד שאף אחד לא הזיז.'] },
    { say: ['Fine, compromise. Half and half! Half your oil, half mine. Half pure is still pretty pure!', 'טוב, פשרה. חצי-חצי! חצי מהשמן שלך, חצי משלי. חצי טהור זה עדיין די טהור!'],
      opts: [{ t: ['Which half is the pure half?', 'איזה חצי הוא החצי הטהור?'], back: [['philo', ['The top half. Probably.', 'החצי העליון. כנראה.']]] },
        { t: ['A liquid passes on tumah in any amount. One drop of yours and all of it is tamei.', 'משקה מטמא בכל שהוא. טיפה אחת משלך וכולו טמא.'], ok: true },
        { t: ['How about a quarter?', 'מה לגבי רבע?'], back: [['philo', ['Now you’re negotiating!', 'עכשיו אתה מתמקח!']], ['eli', ['No I’m not.', 'לא, אני לא.']]] }],
      rule: ['Liquids become tamei, and pass it on, in any amount: even a drop.', 'משקים מיטמאים ומטמאים בכל שהוא: אפילו טיפה.'] },
    { say: ['Then forget yours. Light it with mine! Everyone is tamei anyway. For the community, tumah is allowed!', 'אז תשכח מהשמן שלך. תדליק עם שלי! כולם טמאים בכל מקרה. בציבור, הטומאה מותרת!'],
      opts: [{ t: ['Everyone is tamei? Then I’m the exception.', 'כולם טמאים? אז אני היוצא מן הכלל.'], back: [['philo', ['Show-off.', 'שוויצר.']]] },
        { t: ['If it’s allowed, why are you selling it so hard?', 'אם זה מותר, למה אתה מתאמץ כל כך למכור?'], back: [['philo', ['...Rent.', '...שכר דירה.']]] },
        { t: ['Pushed aside, not allowed. When there’s pure oil, you use pure oil. And I have it.', 'דחויה, לא הותרה. כשיש שמן טהור, משתמשים בשמן טהור. ויש לי.'], ok: true }],
      rule: ['Tumah is only pushed aside for the community; if pure oil can be found, it must be used.', 'הטומאה רק דחויה בציבור; אם אפשר למצוא שמן טהור, צריך להשתמש בו.'] },
  ]);
  await lines(['philo', ['You would be a terrible merchant.', 'אתה היית סוחר נוראי.']], ['eli', ['Thank you.', 'תודה.']], ['philo', ['It wasn’t a compliment. ...Fine. It was a bit of a compliment.', 'זו לא הייתה מחמאה. ...טוב. זו הייתה קצת מחמאה.']]);
  endTalk();
  const ph = G.objs.philo.group, big = G.objs.bigjug.group;
  await animate(900, k => { ph.position.z = wz(3) + k * 5; big.position.z = wz(2) + k * 5; });
  removeObj('philo'); removeObj('bigjug');
  ST.gone = true; refresh();
  await lesson('anyAmount');
  if (isFresh('dechuya')) await lesson('dechuya');
}

// ============================================================ 15. The gates
SCENES.push({
  id: 'gates', act: 3, cols: 9, rows: 6, theme: 'pave', light: 'night',
  title: ['The Gates', 'השערים'],
  blurb: ['The Nikanor Gate into the Ezrat Yisrael, then the line into the Ezrat Kohanim. Each has a keeper, and each keeper has questions.', 'שער ניקנור אל עזרת ישראל, ואחריו הגבול של עזרת כהנים. לכל אחד יש שומר, ולכל שומר יש שאלות.'],
  start: [0, 2, Math.PI / 2],
  build() {
    for (let r = 0; r < 6; r++) if (r !== 2) deco(group(mesh(new THREE.BoxGeometry(0.96, 1.9, 0.96), mat(C.stone), 0, 0.95, 0)), 3, r);
    ST.g1 = K3.gate(0.9, 1.9, false); deco(ST.g1, 3, 2, { ry: Math.PI / 2, block: false }); G.blocked.add(K(3, 2));
    for (let r = 0; r < 6; r++) if (r !== 2) deco(K3.fence(1), 6, r, { ry: Math.PI / 2 });
    ST.g2 = K3.gate(0.9, 1.3, false); deco(ST.g2, 6, 2, { ry: Math.PI / 2, block: false }); G.blocked.add(K(6, 2));
    npc('keeper1', 'keeper', 2, 1, { name: PEOPLE.keeper1.name, actions: () => [A.talk(talkKeeper1), A.look(['The keeper of the Nikanor Gate. He looks like he has asked these questions ten thousand times and enjoyed every one.', 'שומר שער ניקנור. נראה שהוא שאל את השאלות האלה עשרת אלפים פעם ונהנה מכל אחת.'])] });
    npc('keeper2', 'keeper', 5, 1, { name: PEOPLE.keeper2.name, actions: () => [A.talk(talkKeeper2), A.look(['An old Kohen keeping the line of the Ezrat Kohanim.', 'כהן זקן ששומר על הגבול של עזרת כהנים.'])] });
    G.objs.keeper2.group.traverse(m => { if (m.isMesh && m.material.color.getHexString() === '6a587c') m.material = mat(C.linen); });
    torchPost(2, 3, 0.3, 0); torchPost(5, 3, 0.3, 0);
    exitAt('exit', 8, 2, 'kiyor', ['Into the Ezrat Kohanim', 'אל עזרת כהנים']);
  },
  objective: () => !ST.pass1 ? ['Answer the keeper of the Nikanor Gate', 'לענות לשומר שער ניקנור'] : !ST.pass2 ? ['Answer the keeper of the Kohanim’s court', 'לענות לשומר עזרת כהנים'] : ['Into the Ezrat Kohanim', 'אל עזרת כהנים'],
  solution: [{ o: 'keeper1', a: 'talk' }, { o: 'keeper2', a: 'talk' }, { o: 'exit' }],
});
async function openGate(g, tile) {
  const doors = g.userData.doors.children;
  await animate(600, k => doors.forEach((d, i) => { const s = i ? 1 : -1; d.rotation.y = s * 1.3 * k; d.position.x = s * (0.45 / 2 + k * 0.2); }));
  G.blocked.delete(K(...tile)); refresh();
}
async function talkKeeper1() {
  if (ST.pass1) { await speak('keeper1', ['Go on. And don’t hand anyone that jug.', 'קדימה. ואל תמסור את הכד לאף אחד.']); return; }
  await speak('keeper1', ['Halt. Questions first. Everyone gets questions.', 'עצור. קודם שאלות. כולם מקבלים שאלות.']);
  await duel('keeper1', [
    { say: ['Who may not come into the Ezrat Nashim, the courtyard you just left?', 'מי לא נכנס לעזרת נשים, העזרה שממנה יצאת הרגע?'],
      opts: [{ t: ['Someone who is tamei met.', 'מי שטמא מת.'], back: [['keeper1', ['True, but he was stopped further out, at the Cheil. Who else?', 'נכון, אבל הוא נעצר עוד קודם, בחיל. מי עוד?']]] },
        { t: ['A tevul yom: someone who immersed today but whose sun hasn’t set.', 'טבול יום: מי שטבל היום והשמש שלו עוד לא שקעה.'], ok: true },
        { t: ['Anyone who isn’t a Levi.', 'מי שאינו לוי.'], back: [['keeper1', ['Then it would be a very empty courtyard.', 'אז זו הייתה עזרה מאוד ריקה.']]] }],
      rule: ['A tevul yom may not enter the Ezrat Nashim (Mishnah Kelim 1:8).', 'טבול יום לא נכנס לעזרת נשים (משנה כלים א, ח).'] },
    { say: ['And who may not come in here, into the Ezrat Yisrael?', 'ומי לא נכנס לכאן, לעזרת ישראל?'],
      opts: [{ t: ['Anyone without shoes.', 'מי שאין לו נעליים.'], back: [['keeper1', ['Kohanim serve barefoot. Try again.', 'כהנים עובדים יחפים. עוד פעם.']]] },
        { t: ['A mechusar kippurim: someone who is tahor but still has to bring his korban.', 'מחוסר כיפורים: מי שטהור אבל עוד צריך להביא את הקרבן שלו.'], ok: true },
        { t: ['A tevul yom.', 'טבול יום.'], back: [['keeper1', ['He was already stopped at the last courtyard. Someone further along.', 'הוא כבר נעצר בעזרה הקודמת. מישהו רחוק יותר.']]] }],
      rule: ['A mechusar kippurim may not enter the Ezrat Yisrael (Mishnah Kelim 1:8).', 'מחוסר כיפורים לא נכנס לעזרת ישראל (משנה כלים א, ח).'] },
  ]);
  await lines(['keeper1', ['And the jug? Let me see the seal. ...Don’t hand it to me!', 'והכד? תראה לי את החותם. ...אל תמסור לי אותו!']], ['eli', ['I wasn’t going to.', 'לא התכוונתי.']], ['keeper1', ['Good. Pass.', 'טוב. עבור.']]);
  endTalk();
  await openGate(ST.g1, [3, 2]); ST.pass1 = true; objective();
}
async function talkKeeper2() {
  if (!ST.pass1) return;
  if (ST.pass2) { await speak('keeper2', ['The kiyor, then the Heichal. In that order.', 'קודם הכיור, אחר כך ההיכל. בסדר הזה.']); return; }
  await duel('keeper2', [
    { say: ['You’re a Kohen?', 'אתה כהן?'],
      opts: [{ t: ['Sometimes.', 'לפעמים.'], back: [['keeper2', ['That’s not how Kohanim work.', 'ככה כהנים לא עובדים.']]] }, { t: ['Yes. Eli, a Kohen.', 'כן. אלי, כהן.'], ok: true }, { t: ['Is that a trick question?', 'זו שאלה מכשילה?'], back: [['keeper2', ['Everything’s a trick question at my age.', 'בגיל שלי הכול שאלות מכשילות.']]] }],
      rule: ['Only Kohanim go about freely in the Ezrat Kohanim.', 'רק כהנים מסתובבים בחופשיות בעזרת כהנים.'] },
    { say: ['Who else may come in here?', 'מי עוד נכנס לכאן?'],
      opts: [{ t: ['Nobody, ever.', 'אף אחד, אף פעם.'], back: [['keeper2', ['Not quite. Think of a man with a korban.', 'לא בדיוק. תחשוב על אדם עם קרבן.']]] },
        { t: ['Anyone carrying oil.', 'כל מי שנושא שמן.'], back: [['keeper2', ['Then Philo would be in here by now.', 'אז פילון כבר היה פה.']]] },
        { t: ['A Yisrael, only when he needs to: to lean on his korban, slaughter it, or wave it.', 'ישראל, רק בשעת צורך: לסמיכה, לשחיטה ולתנופה.'], ok: true }],
      rule: ['A Yisrael enters the Ezrat Kohanim only for his korban (Mishnah Kelim 1:8).', 'ישראל נכנס לעזרת כהנים רק בשעת צרכיו, לסמיכה לשחיטה ולתנופה (משנה כלים א, ח).'] },
    { say: ['Last one. Before you go into the Heichal, what must you do?', 'אחרונה. לפני שאתה נכנס להיכל, מה אתה חייב לעשות?'],
      opts: [{ t: ['Wash my hands and feet from the kiyor.', 'לקדש ידיים ורגליים מן הכיור.'], ok: true }, { t: ['Say my name three times.', 'להגיד את השם שלי שלוש פעמים.'], back: [['keeper2', ['That’s for summoning quartermasters.', 'זה בשביל לזמן אפסנאים.']]] }, { t: ['Nothing. I’m tahor.', 'כלום. אני טהור.'], back: [['keeper2', ['Tahor and unwashed is still unwashed.', 'טהור ולא רחוץ זה עדיין לא רחוץ.']]] }],
      rule: ['Nobody enters the Heichal without washing hands and feet (Mishnah Kelim 1:9).', 'אין נכנסים להיכל שלא רחוצי ידיים ורגליים (משנה כלים א, ט).'] },
  ]);
  await speak('keeper2', ['Then go to the kiyor. Go on, young man.', 'אז לך לכיור. קדימה, בחור.']);
  endTalk();
  await openGate(ST.g2, [6, 2]); ST.pass2 = true; objective();
  await lesson('courts');
}

// ============================================================ 16. The kiyor
SCENES.push({
  id: 'kiyor', act: 4, cols: 8, rows: 6, theme: 'pave', light: 'night',
  title: ['The Kiyor', 'הכיור'],
  blurb: ['The Ezrat Kohanim, between the mizbe’ach and the Heichal. Before Eli can go in, he has to wash, and he needs fire.', 'עזרת כהנים, בין המזבח להיכל. לפני שאלי יכול להיכנס, הוא צריך לקדש ידיים ורגליים, והוא צריך אש.'],
  walls: [{ side: 'back', courses: 7, seed: 111, gaps: [{ from: 5, to: 5, courses: 6 }] }],
  start: [7, 4, -Math.PI / 2],
  pre() { if (!('washed' in P.flags)) flag('washed', false); },
  build() {
    const altar = K3.altar(); altar.userData.flame.userData.flicker = true;
    addObj('altar', { name: ['The outer mizbe’ach', 'המזבח החיצון'], group: altar, at: [1, 1], tiles: [...rect(0, 2, 0, 2), [1, 3]], anchorY: 2.6,
      actions: () => [A.look(['The mizbe’ach, rebuilt with new stones. The fire on it is going again.', 'המזבח, בנוי מחדש באבנים חדשות. האש עליו שוב בוערת.']),
        A.act('fire', ['Take fire for the menorah', 'לקחת אש למנורה'], async () => {
          if (!fl('washed')) { await speak('eli', ['I wash first. Then I serve.', 'קודם מקדשים. אחר כך עובדים.']); return; }
          if (has('firepan')) { await speak('eli', ['I have it.', 'יש לי.']); return; }
          give('firepan'); await speak('eli', ['Coals from the mizbe’ach, in a fire pan. The menorah is lit only from this fire.', 'גחלים מהמזבח, במחתה. את המנורה מדליקים רק מהאש הזאת.']);
          await lesson('altarFire'); objective();
        })] });
    const al = new THREE.PointLight('#ff9a40', 12, 7, 2); al.position.set(wx(1), 2.4, wz(1)); room.add(al);
    const k = K3.kiyor(); ST.kiyorG = k;
    addObj('kiyor', { name: ['The kiyor', 'הכיור'], group: k, at: [4, 2], tiles: [[4, 2]], anchorY: 1.6,
      actions: () => [A.look(ST.fresh ? ['Fresh water, straight up from the well.', 'מים טריים, ישר מהבור.'] : ['The kiyor. Its water stood here all night, through all the fighting.', 'הכיור. המים שלו עמדו כאן כל הלילה, לאורך כל הקרב.'], async () => { if (!ST.fresh) await lesson('lina'); }),
        A.act('wash', ['Wash hands and feet', 'לקדש ידיים ורגליים'], async () => {
          if (!ST.fresh) { await speak('eli', ['Not with water that stood overnight. It’s unfit.', 'לא במים שלנו. הם פסולים.']); await lesson('lina'); return; }
          if (fl('washed')) { await speak('eli', ['Done. Hands, then feet.', 'עשיתי. ידיים, ואז רגליים.']); return; }
          flag('washed', true); renderStatus();
          await speak('eli', ['Right hand on right foot, left hand on left foot, under the spout. Washed.', 'יד ימין על רגל ימין, יד שמאל על רגל שמאל, מתחת לדד. מקודש.']);
          await lesson('kiddush'); objective();
        })] });
    const w = K3.wheel(); ST.wheelG = w;
    addObj('wheel', { name: ['Ben Katin’s machine', 'המוכני של בן קטין'], group: w, at: [5, 2, 0, 0, Math.PI / 2], tiles: [[5, 2]], anchorY: 1.5,
      actions: () => [A.look(['A wheel and a chain. It lowers the whole kiyor down into a well, so its water never stands overnight.', 'גלגל ושרשרת. הוא מוריד את כל הכיור לתוך בור, כדי שהמים שלו לא ילינו.']),
        A.act('turn', ['Turn the wheel', 'לסובב את הגלגל'], async () => {
          if (ST.fresh) { await speak('eli', ['It’s fresh already.', 'הם כבר טריים.']); return; }
          const wh = ST.wheelG.userData.wheel, kg = ST.kiyorG;
          await animate(900, t => { wh.rotation.z = -t * 6; kg.position.y = -1.0 * Math.sin(t * Math.PI); });
          kg.userData.water.material = mat('#7fb4cf', { roughness: 0.1, flatShading: false });
          ST.fresh = true;
          await speak('eli', ['Down into the well, and up again. Fresh water.', 'למטה לבור, ושוב למעלה. מים טריים.']);
          objective();
        })] });
    deco(group(mesh(new THREE.BoxGeometry(3.2, 0.3, 1.0), mat(C.stone), 0, 0.15, 0), mesh(new THREE.BoxGeometry(2.6, 0.3, 0.8), mat(C.stoneMid), 0, 0.45, -0.1)), 5, 0, { block: [[4, 0], [6, 0]] });
    torchPost(7, 1, 0.3, 0); torchPost(3, 5, 0, 0.3);
    exitAt('exit', 5, 0, 'heichal', ['Into the Heichal', 'אל ההיכל'], () => !fl('washed') ? ['keeper2', ['(from the gate) Kiyor first!', '(מהשער) קודם הכיור!']] : !has('firepan') ? ['eli', ['I need fire from the mizbe’ach for the menorah.', 'אני צריך אש מהמזבח בשביל המנורה.']] : true);
  },
  objective: () => !fl('washed') ? (ST.fresh ? ['Wash at the kiyor', 'לקדש ידיים ורגליים מן הכיור'] : ['Wash at the kiyor', 'לקדש ידיים ורגליים מן הכיור']) : !has('firepan') ? ['Take fire from the mizbe’ach', 'לקחת אש מהמזבח'] : ['Into the Heichal', 'אל ההיכל'],
  carry() { flag('washed', true); give('firepan'); },
  solution: [{ o: 'kiyor', a: 'wash' }, { o: 'wheel', a: 'turn' }, { o: 'kiyor', a: 'wash' }, { o: 'altar', a: 'fire' }, { o: 'exit' }],
});

// ============================================================ 17. The Heichal
SCENES.push({
  id: 'heichal', act: 4, cols: 7, rows: 5, theme: 'heichal', light: 'heichal',
  title: ['Spears and Lamps', 'שפודים ונרות'],
  blurb: ['The Heichal. The golden mizbe’ach and the table are back in their places. Where the menorah stood, there is nothing.', 'ההיכל. מזבח הזהב והשולחן חזרו למקומם. במקום שבו עמדה המנורה, אין כלום.'],
  walls: [{ side: 'back', courses: 8, seed: 121, color: '#c9a46a' }, { side: 'left', courses: 8, seed: 122, color: '#c9a46a' }],
  start: [6, 3, -Math.PI / 2],
  build() {
    const curtain = mesh(new THREE.BoxGeometry(0.05, 2.6, 4.6), mat('#5a2a5e'), 0, 1.3, 0); deco(group(curtain), 0, 2, { dx: -0.3, block: false });
    thing('table', ['The shulchan', 'השולחן'], group(K3.goldBox(1.1, 0.75, 0.6), ...[0, 1].map(i => mesh(new THREE.BoxGeometry(0.4, 0.12, 0.5), mat(C.bread), -0.22 + i * 0.44, 0.84, 0))), 3, 0, { tiles: [[3, 0], [4, 0]], dx: 0.5, look: ['The shulchan, with the lechem hapanim on it.', 'השולחן, ועליו לחם הפנים.'] });
    thing('goldAltar', ['The golden mizbe’ach', 'מזבח הזהב'], K3.goldBox(0.6, 0.9, 0.6), 1, 2, { look: ['The golden mizbe’ach, for the ketoret.', 'מזבח הזהב, לקטורת.'] });
    const m = K3.menorah(); m.visible = !!fl('built'); ST.menorah = m;
    if (fl('filled')) m.userData.lamps.forEach(l => { l.scale.setScalar(0.9); });
    addObj('spot', { name: fl('built') ? ['The menorah', 'המנורה'] : ['Where the menorah stood', 'המקום של המנורה'], group: group(m, mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 12), mat('#8a7046'), 0, 0.01, 0, false)), at: [2, 4], tiles: [[2, 4]], anchorY: 2.2, hit: [1.0, 2.0, 1.0],
      actions: () => [A.look(fl('built') ? ['Seven iron spears, made into a menorah.', 'שבעה רמחים מברזל, שנעשו מנורה.'] : ['This is where the menorah stood. The Greeks took it.', 'כאן עמדה המנורה. היוונים לקחו אותה.']),
        A.act('build', ['Make a menorah', 'לעשות מנורה'], buildMenorah, fl('built')),
        A.act('fill', ['Fill the lamps', 'למלא את הנרות'], fillLamps, !fl('built') || fl('filled')),
        A.act('light', ['Light the lamps', 'להדליק את הנרות'], lightLamps, !fl('filled'))] });
    for (const [c, r] of [[5, 1], [6, 1]]) { const l = new THREE.PointLight('#ffcf8a', 3, 4, 2); l.position.set(wx(c), 2.2, wz(r)); room.add(l); }
  },
  objective: () => !fl('built') ? ['Make a menorah', 'לעשות מנורה'] : !fl('filled') ? ['Fill the lamps', 'למלא את הנרות'] : ['Light the menorah', 'להדליק את המנורה'],
  async intro() { await lines(['eli', ['No menorah. The Greeks took it.', 'אין מנורה. היוונים לקחו אותה.']], ['eli', ['We have pure oil and no menorah. That might be a first.', 'יש לנו שמן טהור ואין מנורה. זה אולי לראשונה.']]); },
  solution: [{ o: 'spot', a: 'build' }, { o: 'spot', a: 'fill' }, { o: 'spot', a: 'light' }],
});
async function buildMenorah() {
  if (!has('spears')) { await speak('eli', ['With what?', 'עם מה?']); return; }
  await lines(['eli', ['Iron spears. The Chashmona’im made a menorah of iron spears. I have three spears.', 'שפודים של ברזל. בית חשמונאי עשו מנורה משפודים של ברזל. יש לי שלושה רמחים.']], ['eli', ['A menorah needs seven branches. Three won’t—', 'מנורה צריכה שבעה קנים. שלושה לא—']], ['narr', ['Eli unties the bundle.', 'אלי מתיר את החבילה.']], ['eli', ['One, two, three, four, five, six... seven.', 'אחד, שניים, שלושה, ארבעה, חמישה, שישה... שבעה.']], ['eli', ['Seven. He said three. He made me sign for three.', 'שבעה. הוא אמר שלושה. הוא החתים אותי על שלושה.']]);
  endTalk();
  take('spears'); ST.menorah.visible = true; ST.menorah.scale.setScalar(0.01);
  await animate(1000, k => ST.menorah.scale.setScalar(0.01 + k * 0.99));
  flag('built'); G.objs.spot.name = ['The menorah', 'המנורה'];
  await lesson('spearsMenorah'); objective();
}
async function fillLamps() {
  if (!fl('built')) { await speak('eli', ['Fill what? There’s no menorah.', 'למלא מה? אין מנורה.']); return; }
  while (true) {
    const i = await ask('eli', ['How much oil does each lamp get?', 'כמה שמן מקבל כל נר?'], [{ t: ['A whole log.', 'לוג שלם.'] }, { t: ['Half a log.', 'חצי לוג.'], ok: true }, { t: ['As much as fits.', 'כמה שנכנס.'] }]);
    if (i === 0) await speak('eli', ['Then the jug runs out before the second lamp. No.', 'אז הכד נגמר לפני הנר השני. לא.']);
    else if (i === 2) await speak('eli', ['The Mishnah has a number for this. Think.', 'במשנה יש מספר בשביל זה. תחשוב.']);
    else break;
  }
  await lines(['eli', ['The first time this seal has been broken since the Kohen Gadol pressed it.', 'הפעם הראשונה שהחותם הזה נשבר מאז שהכהן הגדול טבע אותו.']], ['narr', ['Half a log in each of the seven lamps. The jug is empty.', 'חצי לוג בכל אחד משבעת הנרות. הכד ריק.']]);
  flag('jugOpened'); flag('filled'); renderStatus();
  await lesson('halfLog'); objective();
}
async function lightLamps() {
  if (!has('firepan')) { await speak('eli', ['I need fire from the outer mizbe’ach.', 'אני צריך אש מהמזבח החיצון.']); return; }
  endTalk();
  const lamps = ST.menorah.userData.lamps;
  for (const l of lamps) { l.userData.flame.visible = true; l.userData.flame.userData.flicker = true; await wait(REDUCED ? 0 : 220); }
  const glow = new THREE.PointLight('#ffd27a', 0, 6, 2); glow.position.set(wx(2), 2.2, wz(4)); room.add(glow);
  await animate(800, k => { glow.intensity = k * 10; });
  take('firepan'); flag('lit');
  await lines(['narr', ['Seven lamps, burning. Enough oil for one night.', 'שבעה נרות דולקים. שמן מספיק ללילה אחד.']]);
  await openModal(() => `<div class="splash nights"><div class="eyebrow">${tx(['The Heichal', 'ההיכל'])}</div><h2 id="nightN">${tx(['Night 1', 'לילה 1'])}</h2><div class="nightbar"><i></i></div><p class="lede" id="nightT">${tx(['The lamps burn through the night.', 'הנרות דולקים כל הלילה.'])}</p><div class="actions">${btn('ok', U.next, true)}</div></div>`, m => {
    const h = m.querySelector('#nightN'), p = m.querySelector('#nightT'), bar = m.querySelector('.nightbar i');
    let n = 1;
    const steps = [['The lamps burn through the night.', 'הנרות דולקים כל הלילה.'], ['Morning. The jug is empty, and the lamps are still burning.', 'בוקר. הכד ריק, והנרות עדיין דולקים.'], ['Far away, olives are being crushed for new pure oil.', 'רחוק מכאן, כותשים זיתים לשמן טהור חדש.'], ['Still burning.', 'עדיין דולקים.'], ['Still burning.', 'עדיין דולקים.'], ['Still burning. People have started coming just to look.', 'עדיין דולקים. אנשים התחילו לבוא רק כדי להסתכל.'], ['The new oil is on its way.', 'השמן החדש בדרך.'], ['The new pure oil arrives. The lamps have burned for eight days.', 'השמן הטהור החדש מגיע. הנרות דלקו שמונה ימים.']];
    const t = setInterval(() => {
      if (modal.hidden || n >= 8) { clearInterval(t); return; }
      n++; h.textContent = tx([`Night ${n}`, `לילה ${n}`]); p.textContent = tx(steps[n - 1]); bar.style.width = (n / 8 * 100) + '%';
    }, REDUCED ? 30 : 700);
    bar.style.width = '12.5%';
  });
  await lines(
    ['yehuda', ['(from the Ezrat Yisrael) Eli. They’re still burning.', '(מעזרת ישראל) אלי. הם עדיין דולקים.']],
    ['eli', ['Eight nights. One jug.', 'שמונה לילות. כד אחד.']],
    ['yehuda', ['Then we’ll remember it. Every year.', 'אז נזכור את זה. כל שנה.']],
    ['quartermaster', ['(from much further away) ELI! Are those MY SPEARS?', '(מהרבה יותר רחוק) אלי! אלה הרמחים שלי?']],
    ['eli', ['They’re a menorah now.', 'הם מנורה עכשיו.']],
    ['quartermaster', ['...I’ll need a form for that.', '...אני אצטרך טופס בשביל זה.']],
  );
  await lesson('eightDays');
  await complete('END');
}

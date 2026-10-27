// ============================================================ scene-building helpers
const rect = (c0, c1, r0, r1) => { const a = []; for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) a.push([c, r]); return a; };
const without = (tiles, ...drop) => tiles.filter(t => !drop.some(d => d[0] === t[0] && d[1] === t[1]));
function deco(g, c, r, { dx = 0, dz = 0, ry = 0, y = 0, block = true } = {}) {
  g.position.set(wx(c) + dx, y, wz(r) + dz); g.rotation.y = ry; room.add(g);
  if (block) for (const t of (block === true ? [[c, r]] : block)) G.blocked.add(K(...t));
  return g;
}
const block = tiles => tiles.forEach(t => G.blocked.add(K(...t)));
function npc(id, cast, c, r, def = {}) {
  const g = def.group || CAST[cast]();
  // every character gets a generous invisible box around them, so they're easy to tap
  return addObj(id, { npc: true, tiles: [[c, r]], at: [c, r, def.dx || 0, def.dz || 0], group: g, anchorY: (g.userData.top || 0.8) + 0.55, name: PEOPLE[id]?.name || PEOPLE[cast]?.name, hit: [0.8, (g.userData.top || 0.8) + 0.35, 0.8], ...def });
}
// a clickable prop: look text plus optional extra actions
function thing(id, name, g, c, r, { dx = 0, dz = 0, ry = 0, tiles = [[c, r]], look, acts = [], anchorY = 1, solid = true } = {}) {
  return addObj(id, { name, group: g, at: [c, r, dx, dz, ry], tiles, anchorY, solid, actions: () => [A.look(look), ...acts.map(f => f())] });
}
function exitAt(id, c, r, to, label, can, more = {}) { return addObj(id, { name: label, tiles: [[c, r]], exit: { to, label, can, ...more } }); }
// a cloth roof over a rectangle of tiles
function roofOver(c0, c1, r0, r1, color, opts = {}) {
  const g = K3.roof(c1 - c0 + 1, r1 - r0 + 1, opts.h || 1.55, color, opts);
  g.position.set((wx(c0) + wx(c1)) / 2, 0, (wz(r0) + wz(r1)) / 2); room.add(g); return g;
}
function scatter(seed, n, make, area) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const [c, rr] = area[Math.floor(r() * area.length)]; const g = make(r); g.position.set(wx(c) + (r() - 0.5) * 0.7, 0, wz(rr) + (r() - 0.5) * 0.7); g.rotation.y = r() * 6; room.add(g); }
}
const torchPost = (c, r, dx = 0, dz = 0) => {
  const g = group(mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.4, 5), mat(C.woodDark), 0, 0.7, 0));
  const f = mesh(new THREE.ConeGeometry(0.08, 0.24, 5), basic('#ffb347'), 0, 1.5, 0, false); f.userData.flicker = true; g.add(f);
  const l = new THREE.PointLight('#ff9a40', 6, 5, 2); l.position.y = 1.6; g.add(l);
  return deco(g, c, r, { dx, dz, block: false });
};
const isFresh = k => !P.rules.includes(k);

// ============================================================ rules for Act I
Object.assign(RULES, {
  ohel: {
    title: ['Under the same roof', 'תחת אותו גג'],
    body: ['A met makes everything under the same roof tamei: people, vessels, everything. That is called <em>tumat ohel</em>. A roof only needs to be a tefach by a tefach, a tefach off the ground: a tent, an awning or a cart’s canopy all count. A Kohen may not become tamei met, so Eli must never stand under a roof that is also over one of the fallen.',
      'מת מטמא את כל מה שנמצא איתו תחת אותו גג: אנשים, כלים, הכול. זו <em>טומאת אוהל</em>. גג צריך להיות רק טפח על טפח, ברום טפח מהקרקע: אוהל, סוכך או כיסוי של עגלה, כולם נחשבים. לכהן אסור להיטמא למת, ולכן אלי אף פעם לא יכול לעמוד תחת גג שנמצא גם מעל אחד הנופלים.'],
    src: [SRC.bamidbar1914, SRC.tm121],
  },
  chereb: {
    title: ['The sword is like the met', 'חרב הרי היא כחלל'],
    body: ['A sword, or any vessel, that touched a met becomes as tamei as the met itself. Whoever touches it becomes tamei for seven days, just as if he had touched the met.',
      'חרב, או כל כלי, שנגע במת נעשית טמאה כמו המת עצמו. מי שנוגע בה נטמא טומאת שבעה, כאילו נגע במת.'],
    src: [SRC.bamidbar1916, SRC.tm53],
  },
  dechuya: {
    title: ['Pushed aside, not permitted', 'דחויה, לא הותרה'],
    body: ['When the whole community is tamei, the avodah can go on anyway. But the Rambam rules that tumah is only <em>pushed aside</em> for the community, not permitted outright. So if there is any way to do it with taharah, you look for it first. That is why Yehuda wants pure oil.',
      'כשכל הציבור טמא, העבודה יכולה להימשך בכל זאת. אבל הרמב"ם פוסק שהטומאה רק <em>דחויה</em> בציבור, ולא הותרה לגמרי. לכן אם יש דרך כלשהי לעשות את זה בטהרה, מחפשים אותה קודם. בגלל זה יהודה רוצה שמן טהור.'],
    src: [SRC.yoma6b, SRC.biat415],
  },
  tameiMetPerson: {
    title: ['A tamei met person is an Av', 'טמא מת הוא אב הטומאה'],
    body: ['Someone who became tamei met is himself an <em>Av HaTumah</em>. If he touches Eli, Eli becomes tamei until evening, after immersing, and couldn’t go into the Mikdash today. Being near him is fine. Touching is not.',
      'מי שנטמא למת הוא עצמו <em>אב הטומאה</em>. אם הוא נוגע באלי, אלי נטמא עד הערב, אחרי טבילה, ולא יוכל להיכנס למקדש היום. להיות לידו זה בסדר. לגעת, לא.'],
    src: [SRC.kelim11],
  },
  joinedRoof: {
    title: ['One roof, all the way across', 'גג אחד לכל האורך'],
    body: ['A covering a tefach wide brings tumah along under it. When Avner’s tarp touches the awning over the fallen fighter, the covered space runs together, and the tumah spreads under all of it, right across the street.',
      'כיסוי ברוחב טפח מביא את הטומאה תחתיו. כשהברזנט של אבנר נוגע בסוכך שמעל הלוחם הנופל, השטח המכוסה מתחבר, והטומאה מתפשטת תחת כולו, לרוחב כל הרחוב.'],
    src: [SRC.tm121],
  },
  smallBone: {
    title: ['A bone the size of a barley grain', 'עצם כשעורה'],
    body: ['Even a single bone the size of a barley grain makes you tamei if you touch it or carry it. But it does not spread tumah by roof. Eli could step right over it. What he can’t do is move it, even by pushing a crate into it.',
      'אפילו עצם אחת כשעורה מטמאה במגע ובמשא. אבל היא לא מטמאה באוהל. אלי יכול לעבור ממש מעליה. מה שאסור לו זה להזיז אותה, אפילו על ידי דחיפת ארגז לתוכה.'],
    src: [SRC.tm210],
  },
  liveMouse: {
    title: ['Only a dead mouse', 'רק עכבר מת'],
    body: ['A sheretz, like a mouse, is an Av HaTumah only when it is dead: <span class="he">בְּמֹתָם</span>, “when they are dead.” A live one running past makes nothing tamei, however loudly Eli screams.',
      'שרץ, כמו עכבר, הוא אב הטומאה רק כשהוא מת: "בְּמֹתָם". עכבר חי שרץ ליד לא מטמא כלום, לא משנה כמה חזק אלי צועק.'],
    src: [SRC.vayikra1131],
  },
  sealProof: {
    title: ['What a seal proves', 'מה החותם מוכיח'],
    body: ['When the Chashmona’im searched, they found one jug “lying with the seal of the Kohen Gadol.” Rashi explains why that mattered: the seal showed nobody had touched the oil. A seal is only worth something if you know whose seal it is.',
      'כשהחשמונאים חיפשו, הם מצאו פך אחד "שהיה מונח בחותמו של כהן גדול". רש"י מסביר למה זה היה חשוב: החותם הראה שאף אחד לא נגע בשמן. חותם שווה משהו רק אם יודעים של מי הוא.'],
    src: [SRC.shabbat21b, SRC.rashi],
  },
  officer: {
    title: ['The officer’s rounds', 'סיבוב של איש הר הבית'],
    body: ['At night the officer of the Temple Mount went round every post with torches. A Levi he found asleep he struck with his stick, and he was allowed to burn his clothes.',
      'בלילה היה איש הר הבית מחזר על כל משמר ומשמר ואבוקות דולקות לפניו. לוי שמצא ישן, חובטו במקלו, ורשות היה לו לשרוף את כסותו.'],
    src: [SRC.middot12],
  },
  beitPras: {
    title: ['A ploughed-over grave', 'בית הפרס'],
    body: ['When a plough goes through a grave, it drags little bits of bone along the furrows. So the Rabbis made the field around it a <em>beit haperas</em>, a hundred amah of furrow: walking through it makes you tamei, because your feet might move a bone the size of a barley grain. It is a rabbinic decree, and it is real tumah. Graves were marked with lime, so that Kohanim would know to keep away.',
      'כשמחרשה עוברת בקבר, היא גוררת שברי עצמות לאורך התלמים. לכן חכמים עשו את השדה שסביבו <em>בית הפרס</em>, מאה אמה של מענה: מי שהולך בו נטמא, כי הרגליים שלו עלולות להזיז עצם כשעורה. זו גזירת חכמים, וזו טומאה של ממש. את הקברות היו מציינים בסיד, כדי שכהנים יידעו להתרחק.'],
    src: [SRC.oholot171, SRC.chagigah25b, SRC.maaserSheni51],
  },
  nofeach: {
    title: ['Blowing your way across', 'נופח והולך'],
    body: ['Shmuel says a person may blow on the ground of a beit haperas as he goes, to blow any bone out of his way, and that a beit haperas trodden flat by passers-by is tahor. But both are only for someone on his way to bring his korban Pesach: the Rabbis set aside their own decree so as not to stop a mitzvah that carries karet. For terumah, and for everything else, the decree stands.',
      'שמואל אומר שאדם נופח בית הפרס והולך, כדי להעיף עצם מדרכו, ושבית הפרס שנדש טהור. אבל שני אלה הם רק למי שהולך להקריב את קרבן הפסח שלו: חכמים לא העמידו את גזירתם במקום כרת. לתרומה, ולכל דבר אחר, הגזירה עומדת.'],
    src: [SRC.pesachim92b, SRC.chagigah25b],
  },
  firmFooting: {
    title: ['Stones that don’t move', 'אבנים שאינן מתנדנדות'],
    body: ['Someone who crosses a beit haperas on stones that don’t move, or riding on a person or an animal whose strength is good, stays tahor. On stones that rock, or on a beast whose strength is poor, he becomes tamei: what moves under him moves the earth, and whatever is in it.',
      'המהלך בבית הפרס על גבי אבנים שאינן מתנדנדות, או על גבי אדם ובהמה שכוחן יפה, טהור. על גבי אבנים המתנדנדות, או על גבי אדם ובהמה שכוחן רע, טמא: מה שזז תחתיו מזיז את האדמה, ואת מה שיש בה.'],
    src: [SRC.oholot186],
  },
  parasFix: {
    title: ['Mending the field', 'לטהר בית הפרס'],
    body: ['A beit haperas becomes tahor again if three tefachim of soil are taken off the top, or three tefachim of new soil are put on top of it, or if it is paved with stones that can’t move. Gidi chose the hard way first. Most people do.',
      'בית הפרס נטהר אם מורידים ממנו שלושה טפחים של עפר, או נותנים עליו שלושה טפחים של עפר חדש, או אם מרצפים אותו באבנים שאינן מתנדנדות. גידי בחר קודם בדרך הקשה. רוב האנשים בוחרים בה.'],
    src: [SRC.oholot185],
  },
  tevulYom: {
    title: ['Three steps back to tahor', 'שלוש מדרגות בחזרה לטהרה'],
    body: ['After immersing, a person is a <em>tevul yom</em> until sunset. He may eat chullin and ma’aser sheni straight away. Terumah waits for sunset (<em>he’erev shemesh</em>); touching it before then makes it pasul. Kodashim wait for sunset too, and someone who also owes a korban (a zav, a metzora, a woman after childbirth) waits for that as well: until then he is <em>mechusar kippurim</em>. Not everything waits for the sun: unwashed hands are fixed by washing them, at once. And a tevul yom may come as far as the Cheil, but not into the Ezrat Nashim.<br><br>Years later, the Mishnah tells, the Kohen who burned the Parah Adumah was made tamei on purpose and immersed first, to show the Tzedukim that a tevul yom may do it.',
      'אחרי טבילה, אדם הוא <em>טבול יום</em> עד השקיעה. חולין ומעשר שני מותר לו לאכול מיד. תרומה מחכה להערב שמש; אם יגע בה לפני כן, היא נפסלת. גם קדשים מחכים לשקיעה, ומי שחייב גם קרבן (זב, מצורע, יולדת) מחכה גם לו: עד אז הוא <em>מחוסר כיפורים</em>. לא הכול מחכה לשמש: ידיים שלא נטלו מתקנים בנטילה, מיד. וטבול יום יכול להגיע עד החיל, אבל לא לעזרת נשים.<br><br>שנים אחר כך, מספרת המשנה, את הכהן ששרף את הפרה האדומה היו מטמאים בכוונה ומטבילים, כדי להראות לצדוקים שטבול יום כשר לכך.'],
    src: [SRC.kelim15, SRC.negaim143, SRC.tevulYom22, SRC.parah37],
  },
  cheil: {
    title: ['The Cheil', 'החיל'],
    body: ['The Mikdash has rings of holiness, each holier than the one outside it. The Cheil, the low wall around the courtyards, is closed to anyone tamei met. Avner and Yehuda have to stop here. Eli can go on.',
      'במקדש יש מעגלים של קדושה, כל אחד מקודש מזה שמחוץ לו. החיל, החומה הנמוכה סביב העזרות, סגור בפני טמאי מת. אבנר ויהודה צריכים לעצור כאן. אלי יכול להמשיך.'],
    src: [SRC.kelim18],
  },
});

// ============================================================ 1. The supply camp
SCENES.push({
  id: 'camp', act: 1, cols: 8, rows: 5, theme: 'dirt', light: 'dusk',
  title: ['The Supply Camp', 'מחנה האספקה'],
  blurb: ['The battle for Yerushalayim is over. Eli stayed back with the supplies, which is why he is still tahor, and why he knows exactly how much flour there is.', 'הקרב על ירושלים נגמר. אלי נשאר מאחור עם האספקה, ובגלל זה הוא עדיין טהור, ובגלל זה הוא יודע בדיוק כמה קמח יש.'],
  start: [0, 2],
  build() {
    thing('tents', ['Tents', 'אוהלים'], K3.tent(1.9, 1.5), 0, 0, { dx: 0.5, tiles: [[0, 0], [1, 0]], look: ['Tents. Mostly holes, some tent.', 'אוהלים. בעיקר חורים, קצת אוהל.'] });
    deco(K3.tent(1.9, 1.5, '#b8a588'), 5, 0, { dx: 0.5, block: [[5, 0], [6, 0]] });
    deco(K3.olive(rng(2)), 7, 0);
    thing('fire', ['Campfire', 'מדורה'], K3.fire(), 1, 4, { anchorY: 0.8, look: ['A campfire. Someone is boiling something that used to be lentils.', 'מדורה. מישהו מבשל משהו שפעם היה עדשים.'] }).group.userData.flame.userData.flicker = true;
    thing('crates', ['Supply crates', 'ארגזי אספקה'], K3.crate(), 6, 4, { look: ['Flour, flour, flour, and one crate labelled “MISC.” I counted them all. Twice.', 'קמח, קמח, קמח, וארגז אחד שכתוב עליו "שונות". ספרתי את כולם. פעמיים.'] }); deco(K3.crate(0.6, '#8a6040'), 7, 4); deco(K3.barrel(), 7, 3, { dx: 0.1 });
    deco(group(mesh(new THREE.BoxGeometry(0.9, 0.08, 0.6), mat(C.wood), 0, 0.62, 0), mesh(new THREE.BoxGeometry(0.08, 0.6, 0.5), mat(C.woodDark), -0.35, 0.3, 0), mesh(new THREE.BoxGeometry(0.08, 0.6, 0.5), mat(C.woodDark), 0.35, 0.3, 0), mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), mat('#e8dcc0'), 0.1, 0.67, 0)), 3, 0);
    const rack = K3.spearBundle(); rack.rotation.z = 0.2; deco(group(rack), 4, 0, { y: 0.6, dx: 0.2 });
    npc('qm', 'quartermaster', 3, 1, {
      name: PEOPLE.quartermaster.name,
      actions: () => [A.talk(talkQM), A.look(['The quartermaster. He has a ledger, a stylus, and the expression of a man who has counted every spear twice.', 'האפסנאי. יש לו פנקס, חרט, ופרצוף של אדם שספר כל רומח פעמיים.'])],
    });
    if (fl('signed')) npc('runner', 'runner', 5, 3, { actions: () => [A.talk(() => speak('runner', ['Yehuda’s tent is across the field. Walk carefully, Kohen.', 'האוהל של יהודה מעבר לשדה. תלך בזהירות, כהן.']))] });
    exitAt('exit', 7, 2, 'field', ['To the battlefield', 'אל שדה הקרב'], () => fl('signed') || ['quartermaster', ['Oi! Nobody leaves this camp without signing for something.', 'היי! אף אחד לא יוצא מהמחנה בלי לחתום על משהו.']]);
  },
  objective: () => fl('signed') ? ['Cross the field to Yehuda’s tent', 'לחצות את השדה לאוהל של יהודה'] : ['Talk to the quartermaster', 'לדבר עם האפסנאי'],
  async intro() {
    await lines(
      ['narr', ['The Chashmona’im have taken back Yerushalayim. Many of the fighters became tamei met in the battle: they touched the fallen, carried them, or stood under the same roof with them.', 'החשמונאים כבשו מחדש את ירושלים. רבים מהלוחמים נטמאו טומאת מת בקרב: הם נגעו בנופלים, נשאו אותם, או עמדו איתם תחת אותו גג.']],
      ['eli', ['Not me. I stayed with the supplies. I’ve counted every sack of flour in this camp.', 'לא אני. אני נשארתי עם האספקה. ספרתי כל שק קמח במחנה הזה.']],
      ['eli', ['Twice.', 'פעמיים.']],
    );
    toast(U.tipWalk);
  },
  carry() { flag('signed'); give('spears'); },
  solution: [{ o: 'qm', a: 'talk' }, { o: 'exit' }],
});
async function talkQM() {
  if (fl('signed')) { await speak('quartermaster', ['Signed, sealed, issued. Off you go.', 'נחתם, נרשם, נמסר. לך כבר.']); return; }
  await lines(['quartermaster', ['Name?', 'שם?']], ['eli', ['Eli. Kohen.', 'אלי. כהן.']], ['quartermaster', ['Kohen, Kohen... Ah. Here. “Spare spears, three, for the use of one Kohen.” Sign here.', 'כהן, כהן... אה. הנה. "רמחים רזרביים, שלושה, לשימוש כהן אחד". תחתום כאן.']]);
  while (true) {
    const i = await ask('quartermaster', ['Well?', 'נו?'], [{ t: ['Why would I need spears?', 'למה אני צריך רמחים?'] }, { t: ['Can I sign for two?', 'אפשר לחתום על שניים?'] }, { t: ['Fine. I’ll sign.', 'טוב. אני חותם.'], ok: true }]);
    if (i === 0) await speak('quartermaster', ['Regulations.', 'תקנות.']);
    else if (i === 1) await speak('quartermaster', ['Spears are issued in threes. Regulations.', 'רמחים מונפקים בשלשות. תקנות.']);
    else break;
  }
  give('spears'); flag('signed');
  await lines(
    ['quartermaster', ['Lovely. Don’t lose them, don’t bend them, and don’t lend them to anyone called Avner.', 'יופי. לא לאבד, לא לכופף, ולא להשאיל לאף אחד שקוראים לו אבנר.']],
    ['eli', ['Who’s Avner?', 'מי זה אבנר?']],
    ['quartermaster', ['You’ll see.', 'תראה.']],
  );
  npc('runner', 'runner', 5, 3, { actions: () => [A.talk(() => speak('runner', ['Yehuda’s tent is across the field. Walk carefully, Kohen.', 'האוהל של יהודה מעבר לשדה. תלך בזהירות, כהן.']))] });
  refresh();
  await lines(
    ['runner', ['Eli? Eli the Kohen? Yehuda wants you. Now. His tent is across the field.', 'אלי? אלי הכהן? יהודה רוצה אותך. עכשיו. האוהל שלו מעבר לשדה.']],
    ['eli', ['Across the field. Where the fallen are.', 'מעבר לשדה. איפה שהנופלים.']],
    ['runner', ['Yes. So walk carefully. He says you’re the one Kohen in camp who’s still tahor.', 'כן. אז תלך בזהירות. הוא אומר שאתה הכהן היחיד במחנה שעדיין טהור.']],
  );
}

// ============================================================ 2. Across the battlefield
SCENES.push({
  id: 'field', act: 1, cols: 9, rows: 6, theme: 'grass', light: 'dusk',
  title: ['Across the Battlefield', 'לחצות את שדה הקרב'],
  blurb: ['Between the camp and Yehuda’s tent lies the field where the fighting was. The fallen still lie where they fell, covered.', 'בין המחנה לאוהל של יהודה נמצא השדה שבו היה הקרב. הנופלים עדיין שוכבים במקום שבו נפלו, מכוסים.'],
  start: [0, 3, Math.PI / 2],
  build() {
    // the ditch, with an old bridge under the torn tent
    room.children.forEach(m => { if (m.userData.tile && m.userData.tile[0] === 4) m.visible = false; });
    for (let r = 0; r < 6; r++) {
      if (r === 4) continue;
      room.add(mesh(new THREE.BoxGeometry(0.98, 0.1, 1.0), mat(C.water, { roughness: 0.2, flatShading: false }), wx(4), -0.1, wz(r), false));
      if (r !== 1) G.blocked.add(K(4, r));
    }
    deco(K3.plank(1.2), 4, 1, { ry: 0, y: 0.02, block: false }).rotation.y = Math.PI / 2;
    roofOver(3, 5, 0, 2, '#b9a98c', { torn: true, h: 1.5 });
    thing('fallen1', ['One of the fallen', 'אחד הנופלים'], K3.fallen(), 3, 0, { ry: 0.3, anchorY: 0.8, look: ['One of the fallen, covered. Someone will bury him; that’s a mitzvah, even for the ones who become tamei doing it. Just not me, not today.', 'אחד הנופלים, מכוסה. מישהו יקבור אותו; זו מצווה, גם למי שנטמא בגללה. רק לא אני, ולא היום.'] });
    // the cart, with its canopy over another of the fallen
    const cart = group(mesh(new THREE.BoxGeometry(1.8, 0.35, 0.85), mat(C.wood), 0, 0.45, 0));
    for (const s of [-1, 1]) cart.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 10), mat(C.woodDark), s * 0.55, 0.28, 0.45).rotateX(Math.PI / 2));
    const f2 = K3.fallen(); f2.position.y = 0.62; f2.scale.setScalar(0.9); cart.add(f2);
    roofOver(7, 8, 4, 5, '#8e7a62', { h: 1.45 });
    addObj('cart', { name: ['The cart', 'העגלה'], group: cart, at: [7, 5, 0.5], tiles: [[7, 5], [8, 5]], anchorY: 1.2, actions: () => [A.look(['A cart with a canopy. One of the fallen lies in it. Under that canopy is the same as under a roof with him.', 'עגלה עם כיסוי. אחד הנופלים שוכב בה. מתחת לכיסוי הזה זה כמו תחת גג אחד איתו.']), A.act('pushcart', ['Push the cart out of the way', 'לדחוף את העגלה הצידה'], () => lines(['eli', ['Moving a cart with a met in it is moving the met. That’s carrying. No.', 'להזיז עגלה שיש בה מת זה להזיז את המת. זה משא. לא.']]))] });
    addObj('sword', {
      name: ['A sword', 'חרב'], tiles: [[7, 3]], group: K3.sword(), at: [7, 3], anchorY: 0.6, hit: [0.8, 0.3, 0.8],
      actions: () => [A.look(['A sword from the battle. It touched the fallen, so it’s as tamei as they are. Touching it would be like touching a met.', 'חרב מהקרב. היא נגעה בנופלים, ולכן היא טמאה כמוהם. לגעת בה זה כמו לגעת במת.'], () => lesson('chereb')),
        A.say('take', ['Pick it up', 'להרים אותה'], ['eli', ['Absolutely not.', 'בשום אופן לא.']])],
    });
    addObj('crate', {
      name: ['A broken crate', 'ארגז שבור'], tiles: [[1, 5]], group: K3.crate(0.7, '#8a6644'), at: [1, 5, 0, 0, 0.3], anchorY: 1,
      actions: () => [A.look(['A supply crate that didn’t survive the battle. Its planks are loose.', 'ארגז אספקה שלא שרד את הקרב. הקרשים שלו רופפים.']),
        A.act('take', ['Take a plank', 'לקחת קרש'], async () => { give('plank'); ST.took = true; await speak('eli', ['One plank. Long enough to cross a ditch, if I’m brave and the ditch isn’t.', 'קרש אחד. ארוך מספיק כדי לחצות תעלה, אם אני אמיץ והתעלה לא.']); objective(); }, has('plank') || ST.bridged)],
    });
    addObj('ditch', {
      name: ['The ditch', 'התעלה'], tiles: [[4, 4]], group: group(mesh(new THREE.BoxGeometry(0.98, 0.1, 1.0), mat(C.water, { roughness: 0.2, flatShading: false }), 0, -0.1, 0, false)), at: [4, 4], anchorY: 0.6,
      actions: () => [A.look(['A muddy ditch. Too wide to jump, and I’m carrying spears. The only bridge is under that torn tent.', 'תעלה בוצית. רחבה מדי לקפוץ, ואני סוחב רמחים. הגשר היחיד נמצא מתחת לאוהל הקרוע.']),
        A.act('plank', ['Lay the plank across', 'להניח את הקרש מעבר לתעלה'], async () => {
          if (!has('plank')) { await speak('eli', ['With what? I need something long and flat.', 'עם מה? אני צריך משהו ארוך ושטוח.']); return; }
          take('plank'); ST.bridged = true; G.blocked.delete(K(4, 4));
          const p = K3.plank(1.25); p.rotation.y = Math.PI / 2; deco(p, 4, 4, { y: 0.02, block: false });
          refresh();
          await speak('eli', ['A bridge with no roof over it. My favourite kind.', 'גשר בלי גג מעליו. הסוג האהוב עליי.']);
        }, ST.bridged)],
    });
    scatter(9, 6, r => K3.bush(r), [[0, 0], [1, 1], [2, 5], [6, 5], [8, 2], [0, 5]]);
    const shield = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 10), mat('#8a3a2a')); shield.rotation.x = 1.4; deco(group(shield), 2, 2, { dx: 0.3, y: 0.06, block: false });
    deco(K3.tent(1.6, 1.4, '#cbb38c'), 8, 0, { dz: -1.2, block: false });
    exitAt('exit', 8, 0, 'pras', ['On toward Yehuda’s tent', 'הלאה, לכיוון האוהל של יהודה']);
  },
  hazards: () => [
    { tiles: rect(3, 5, 0, 2), why: ['That torn tent is spread over one of the fallen. Anywhere under the same roof, I’d become tamei met. Even on the bridge.', 'האוהל הקרוע פרוש מעל אחד הנופלים. בכל מקום תחת אותו גג אני נטמא טומאת מת. גם על הגשר.'], lesson: 'ohel' },
    { tiles: [[7, 4], [8, 4]], why: ['The cart’s canopy is over one of the fallen. Under it is the same as under a roof with him.', 'הכיסוי של העגלה נמצא מעל אחד הנופלים. מתחתיו זה כמו תחת גג אחד איתו.'], lesson: 'ohel' },
  ],
  objective: () => ST.bridged ? ['Go to Yehuda’s tent', 'ללכת לאוהל של יהודה'] : has('plank') ? ['Find a way across the ditch', 'למצוא דרך לחצות את התעלה'] : ['Find a safe way to Yehuda’s tent', 'למצוא דרך בטוחה לאוהל של יהודה'],
  async intro() {
    await lines(['eli', ['Don’t touch. Don’t carry. Don’t stand under the same roof. Three rules. I can do three rules.', 'לא לגעת. לא לשאת. לא לעמוד תחת אותו גג. שלושה כללים. אני יכול לעמוד בשלושה כללים.']]);
    toast(U.tipTumah);
  },
  solution: [{ tile: [3, 2] }, { o: 'crate', a: 'take' }, { o: 'ditch', a: 'plank' }, { o: 'sword', a: 'look' }, { o: 'exit' }],
});

// ============================================================ 2b. The ploughed field (beit haperas)
const PRAS_STONES = { s21: [2, 1, true], s22: [2, 2, false], s23: [2, 3, true], s24: [2, 4, false], s32: [3, 2, true], s34: [3, 4, false], s35: [3, 5, true] };   // id: [c, r, wobbly]
const PRAS_PATCH = rect(4, 5, 2, 4);   // the part Gidi has already paved
SCENES.push({
  id: 'pras', act: 1, cols: 9, rows: 6, theme: 'dirt', light: 'dusk',
  title: ['The Ploughed Field', 'בית הפרס'],
  blurb: ['Past the battlefield, the last field before Yehuda’s tent. Someone has been ploughing it today. Someone has had a very bad day.', 'אחרי שדה הקרב, השדה האחרון לפני האוהל של יהודה. מישהו חרש אותו היום. למישהו היה יום מאוד רע.'],
  start: [0, 3, Math.PI / 2],
  pre() { ST.tested = {}; },
  build() {
    const r = rng(77);
    // the ploughed part, with a trodden path along the back
    for (let c = 2; c <= 6; c++) for (let rr = 0; rr < 6; rr++) {
      if (PRAS_PATCH.some(t => t[0] === c && t[1] === rr)) continue;
      if (rr === 0) { deco(group(mesh(new THREE.BoxGeometry(0.98, 0.02, 0.6), mat('#cdb48a'), 0, 0.01, 0, false)), c, rr, { block: false }); continue; }
      deco(K3.furrows(r, 1 + Math.floor(r() * 3)), c, rr, { block: false });
    }
    // Gidi's paving, and his heap of stones
    for (const [c, rr] of PRAS_PATCH) deco(group(mesh(new THREE.BoxGeometry(0.96, 0.06, 0.96), mat(C.stoneMid), 0, 0.03, 0, false)), c, rr, { block: false });
    deco(group(...[0, 1, 2, 3, 4].map(i => mesh(new THREE.DodecahedronGeometry(0.16, 0), mat(i % 2 ? C.stone : C.stoneMid), (r() - 0.5) * 0.5, 0.12 + (i > 2 ? 0.14 : 0), (r() - 0.5) * 0.5))), 6, 5, { block: false });
    // the grave marker Gidi's plough turned up, with lime poured on it
    const marker = group(mesh(new THREE.BoxGeometry(0.42, 0.7, 0.16), mat('#efeae0'), 0, 0.35, 0), mesh(new THREE.BoxGeometry(0.5, 0.04, 0.3), mat('#f7f4ee'), 0, 0.01, 0.05, false));
    marker.children[0].rotation.z = 0.18;
    addObj('marker', { name: ['A broken gravestone, whitewashed', 'מצבה שבורה, מסוידת'], group: marker, at: [1, 1], tiles: [[1, 1]], anchorY: 1.1, actions: () => [A.look(['An old gravestone, cracked by a plough, with fresh lime poured all over it. That’s how graves are marked, so Kohanim keep away. Somebody ploughed right through a grave.', 'מצבה ישנה, סדוקה ממחרשה, ועליה סיד טרי שנשפך. ככה מציינים קברים, כדי שכהנים יתרחקו. מישהו חרש ממש דרך קבר.'], async () => {
      if (ST.knows) return;
      ST.knows = true; refresh();
      await lines(['eli', ['And a plough drags bits of bone along every furrow. This whole field is a beit haperas now.', 'ומחרשה גוררת שברי עצמות לאורך כל תלם. כל השדה הזה הוא בית הפרס עכשיו.']]);
      await lesson('beitPras');
    })] });
    // the stepping stones
    for (const [id, [c, rr, wob]] of Object.entries(PRAS_STONES)) {
      addObj(id, { name: ['A stepping stone', 'אבן דריכה'], tiles: [[c, rr]], solid: false, group: K3.stepStone(r, wob), at: [c, rr], anchorY: 0.5, hit: [0.7, 0.25, 0.7], range: 1,
        actions: () => [A.look(ST.tested[id] === 'firm' ? ['Firm. It doesn’t budge.', 'יציבה. לא זזה.'] : ST.tested[id] === 'wobbly' ? ['It rocks. Not stepping on that.', 'מתנדנדת. עליה אני לא דורך.'] : ['A flat stone in the furrows. Is it firm, or does it rock?', 'אבן שטוחה בין התלמים. היא יציבה, או מתנדנדת?']),
          A.act('test', ['Test it with a spear', 'לבדוק אותה עם רומח'], () => testStone(id, wob), !!ST.tested[id] || !ST.knows),
          A.act('step', ['Step onto it', 'לעלות עליה'], async () => { const p = bfs(startOf(), [c, rr]); if (p) await walkPath(p); else await speak('eli', U.cantGet); }, ST.tested[id] !== 'firm')] });
    }
    // Gidi, his donkey and his ox, on the paved part
    npc('farmer', 'farmer', 5, 2, { range: 1, actions: () => [A.talk(talkFarmer), A.look(['Gidi the ploughman. Mud to the knees, lime to the elbows, and the face of a man who has met a gravestone the hard way.', 'גידי החורש. בוץ עד הברכיים, סיד עד המרפקים, ופנים של אדם שפגש מצבה בדרך הקשה.'])] });
    addObj('donkey', { name: ['Tzipora the donkey', 'ציפורה החמורה'], tiles: [[5, 3]], group: K3.beast('donkey'), at: [5, 3, 0, 0, -Math.PI / 2], anchorY: 1.1, range: 1,
      actions: () => [A.look(['Tzipora. Small, grey, very old. Her knees knock when she stands still.', 'ציפורה. קטנה, אפורה, זקנה מאוד. הברכיים שלה נוקשות זו בזו גם כשהיא עומדת.']), A.act('ride', ['Ride her across', 'לרכוב עליה לצד השני'], rideDonkey)] });
    ST.ox = addObj('ox', { name: ['Shimshon the ox', 'שמשון השור'], tiles: [[5, 4]], group: K3.beast('ox'), at: [5, 4, 0, 0, -Math.PI / 2], anchorY: 1.3, range: 1,
      actions: () => [A.look(['Shimshon. An ox the size of a cart, standing on legs like pillars.', 'שמשון. שור בגודל של עגלה, עומד על רגליים כמו עמודים.']), A.act('ride', ['Ride him across', 'לרכוב עליו לצד השני'], rideOx)] });
    scatter(13, 3, r => K3.bush(r), [[0, 0], [8, 5], [7, 0]]);
    exitAt('exit', 8, 3, 'yehuda', ['Yehuda’s tent', 'האוהל של יהודה']);
  },
  hazards: s => {
    const field = [];
    for (let c = 2; c <= 6; c++) for (let rr = 1; rr < 6; rr++) if (!PRAS_PATCH.some(t => t[0] === c && t[1] === rr) && (s.tested || {})[Object.keys(PRAS_STONES).find(k => PRAS_STONES[k][0] === c && PRAS_STONES[k][1] === rr)] !== 'firm') field.push([c, rr]);
    const path = [2, 3, 4, 5, 6].map(c => [c, 0]);
    if (!s.knows) return [{ tiles: [...field, ...path], why: ['Fresh furrows, full of little white chips. And that stone by the edge looks like a grave marker. I should look at it before I take one step in there.', 'תלמים טריים, מלאים שבבים לבנים קטנים. והאבן ההיא בקצה נראית כמו ציון של קבר. כדאי שאסתכל עליה לפני שאני עושה צעד אחד לשם.'] }];
    return [
      { tiles: field, why: ['A beit haperas. If my foot shifts a chip of bone the size of a barley grain, I’m tamei, and I can’t go up to the Mikdash today.', 'בית הפרס. אם הרגל שלי תזיז שבב עצם בגודל גרגר שעורה, אני טמא, ולא אוכל לעלות למקדש היום.'], lesson: 'beitPras' },
      { tiles: path, why: ['A path trodden flat by everyone who cut across. A trodden beit haperas counts as tahor, but only for someone on his way to bring his korban Pesach. It’s Kislev.', 'שביל שנדרך על ידי כל מי שקיצר דרכו. בית הפרס שנדש טהור, אבל רק למי שבדרך להקריב את קרבן הפסח שלו. עכשיו כסלו.'], lesson: 'nofeach' },
    ];
  },
  objective: () => !ST.knows ? ['Find a way across the field to Yehuda’s tent', 'למצוא דרך לחצות את השדה לאוהל של יהודה']
    : !PRAS_PATCH.some(t => t[0] === eli.c && t[1] === eli.r) && !ST.crossed && !ST.fixed ? ['Find firm stones out to Gidi, the ploughman', 'למצוא אבנים יציבות עד גידי החורש']
      : !ST.fixed ? ['Talk to Gidi', 'לדבר עם גידי'] : !ST.crossed ? ['Ride across the rest of the field', 'לרכוב על פני שאר השדה'] : ['Go on to Yehuda’s tent', 'להמשיך לאוהל של יהודה'],
  async intro() {
    await lines(['farmer', ['(from the middle of the field) KOHEN! Don’t step in my field! I ploughed up a grave this morning!', '(מאמצע השדה) כהן! אל תדרוך לי בשדה! חרשתי היום בבוקר קבר!']], ['eli', ['You... ploughed up a grave.', 'חרשת... קבר.']], ['farmer', ['Didn’t know it was there! Nobody had marked it! I’ve marked it NOW.', 'לא ידעתי שהוא שם! אף אחד לא סימן אותו! עכשיו סימנתי.']]);
  },
  solution: [{ o: 'marker', a: 'look' }, { o: 's22', a: 'test' }, { o: 's24', a: 'test' }, { o: 's34', a: 'test' }, { tile: [4, 4] }, { o: 'farmer', a: 'talk' }, { o: 'donkey', a: 'ride' }, { o: 'ox', a: 'ride' }, { o: 'exit' }],
});
async function testStone(id, wob) {
  const g = G.objs[id].group;
  await animate(500, k => { g.rotation.z = wob ? Math.sin(k * Math.PI * 4) * 0.12 : 0; g.position.y = wob ? 0 : -Math.sin(k * Math.PI) * 0.01; });
  ST.tested[id] = wob ? 'wobbly' : 'firm';
  if (wob) await speak('eli', ['(tap) It rocks. Stand on that and the earth under it shifts, and whatever is in the earth. That’s as good as walking in the furrows.', '(טק) מתנדנדת. לעמוד עליה זה להזיז את האדמה שמתחתיה, וכל מה שיש בה. זה כמו ללכת בתלמים.']);
  else await speak('eli', ['(tap) Solid. A stone that doesn’t move doesn’t move anything under it.', '(טק) יציבה. אבן שלא זזה לא מזיזה שום דבר שמתחתיה.']);
  refresh();
  await lesson('firmFooting');
}
async function talkFarmer() {
  if (ST.crossed) { await speak('farmer', ['Three tefachim of soil! My back thanks you, Kohen.', 'שלושה טפחים של עפר! הגב שלי מודה לך, כהן.']); return; }
  if (!ST.met) {
    ST.met = true;
    await lines(['farmer', ['You got out here! On my stones! You’re cleverer than my cousin. He just walked across.', 'הגעת לכאן! על האבנים שלי! אתה חכם יותר מבן הדוד שלי. הוא פשוט הלך.']], ['eli', ['Your cousin’s not a Kohen on his way to the Mikdash.', 'בן הדוד שלך הוא לא כהן בדרך למקדש.']], ['farmer', ['He’s not on his way anywhere. He’s tamei and sulking.', 'הוא לא בדרך לשום מקום. הוא טמא ונעלב.']]);
  }
  while (true) {
    const opts = [{ t: ['How do I get the rest of the way across?', 'איך אני עובר את שאר הדרך?'] }];
    if (!ST.fixed) opts.push({ t: ['Why are you paving your own field?', 'למה אתה מרצף את השדה של עצמך?'], ok: true });
    else opts.push({ t: ['Could I ride one of your animals across?', 'אפשר לרכוב על אחת הבהמות שלך לצד השני?'], ok: true });
    const i = await ask('farmer', ['Well?', 'נו?'], opts);
    if (i === 0) {
      await lines(['farmer', ['Easy! Blow on the ground in front of you, every step. Blows the bits of bone out of your way. My grandfather did it every Pesach.', 'קל! נושפים על האדמה לפניך, בכל צעד. זה מעיף את שברי העצמות מהדרך. סבא שלי עשה את זה כל פסח.']],
        ['eli', ['Every Pesach. That’s exactly it. The Rabbis let you blow your way across only when you’re going up to bring the korban Pesach, because missing it is karet. They didn’t lift their decree for anything else.', 'כל פסח. זה בדיוק העניין. חכמים התירו לנשוף ולעבור רק למי שעולה להקריב את קרבן הפסח, כי מי שמפסיד אותו חייב כרת. לשום דבר אחר הם לא הורידו את הגזירה שלהם.']],
        ['farmer', ['So blow harder?', 'אז לנשוף חזק יותר?']], ['eli', ['No.', 'לא.']]);
      await lesson('nofeach');
    } else if (!ST.fixed) {
      await speak('farmer', ['My wife says the Rabbis say: pave it with stones that don’t move, and it’s tahor again. Every last stone! My back says the Rabbis never paved a field.', 'אשתי אומרת שחכמים אומרים: מרצפים באבנים שלא זזות, והוא שוב טהור. כל אבן ואבן! הגב שלי אומר שחכמים אף פעם לא ריצפו שדה.']);
      await duel('farmer', [
        { say: ['Is there any other way to make it tahor? Any way at all?', 'יש דרך אחרת לטהר אותו? כל דרך שהיא?'],
          opts: [{ t: ['Wait seven days.', 'לחכות שבעה ימים.'], back: [['farmer', ['That’s for people. My field doesn’t count days. It barely counts furrows.', 'זה לאנשים. השדה שלי לא סופר ימים. הוא בקושי סופר תלמים.']]] },
            { t: ['Take three tefachim of soil off the top, or pile three tefachim of new soil on top of it.', 'להוריד שלושה טפחים של עפר מלמעלה, או לשפוך עליו שלושה טפחים של עפר חדש.'], ok: true },
            { t: ['Blow on it. A lot.', 'לנשוף עליו. הרבה.'], back: [['farmer', ['You just told me blowing doesn’t work!', 'הרגע אמרת לי שנשיפה לא עובדת!']], ['eli', ['I did. I was testing you.', 'אמרתי. בדקתי אותך.']]] }],
          rule: ['A beit haperas becomes tahor if three tefachim of soil are taken off it or put on top of it, or if it is paved with stones that can’t move (Mishnah Oholot 18:5).', 'בית הפרס נטהר אם מורידים ממנו שלושה טפחים של עפר או נותנים עליו שלושה טפחים, או אם מרצפים אותו באבנים שאינן מתנדנדות (משנה אהלות יח, ה).'] },
      ]);
      await lines(['farmer', ['Three tefachim of soil? I have a whole hill of soil! Kohen, you’ve saved my back. Anything you need. Anything!', 'שלושה טפחים של עפר? יש לי גבעה שלמה של עפר! כהן, הצלת לי את הגב. כל מה שתצטרך. כל דבר!']]);
      ST.fixed = true; objective();
      await lesson('parasFix');
    } else {
      await lines(['farmer', ['Ride across? Of course! Take Tzipora, the donkey. She’s very sweet. She’s thirty-one.', 'לרכוב? בטח! קח את ציפורה, החמורה. היא מאוד מתוקה. היא בת שלושים ואחת.']], ['eli', ['Thirty-one.', 'שלושים ואחת.']], ['farmer', ['Shimshon the ox is busy. He hauls my stones.', 'שמשון השור עסוק. הוא סוחב לי את האבנים.']]);
      ST.lent = true; objective(); return;
    }
  }
}
async function rideDonkey() {
  if (!ST.lent) { await speak('eli', ['She’s Gidi’s. I should ask him first.', 'היא של גידי. כדאי שאשאל אותו קודם.']); return; }
  await lines(['eli', ['Look at her knees. Put me on her back and every step she takes will sink and scuff the furrows. Riding a beast whose strength is poor is like walking it myself.', 'תראה את הברכיים שלה. אם אשב על הגב שלה, כל צעד שלה ישקע וישפשף את התלמים. לרכוב על בהמה שכוחה רע זה כמו ללכת ברגל.']],
    ['farmer', ['Tzipora, he called you weak.', 'ציפורה, הוא קרא לך חלשה.']], ['eli', ['I said her strength was poor. It’s a technical term.', 'אמרתי שכוחה רע. זה מונח מקצועי.']],
    ['farmer', ['Fine. FINE. Take Shimshon. The stones can wait.', 'טוב. טוב! קח את שמשון. האבנים יחכו.']]);
  ST.oxOk = true; objective();
  await lesson('firmFooting');
}
async function rideOx() {
  if (!ST.oxOk) { await speak('farmer', [ST.lent ? 'Not Shimshon! He’s working. Take Tzipora.' : 'Oi! That’s my ox. Ask first.', ST.lent ? 'לא את שמשון! הוא עובד. קח את ציפורה.' : 'היי! זה השור שלי. קודם שואלים.']); return; }
  await speak('eli', ['Legs like pillars. A beast whose strength is good doesn’t shift the ground under him. Up we go.', 'רגליים כמו עמודים. בהמה שכוחה יפה לא מזיזה את האדמה שמתחתיה. עולים.']);
  endTalk();
  const ox = ST.ox.group, rider = eli.model;
  ox.rotation.y = Math.PI / 2; eli.face = eli.faceTo = Math.PI / 2;
  // up onto his back, across the last furrows, and down on the far side
  await animate(400, k => { rider.position.set(wx(eli.c) + (ox.position.x - wx(eli.c)) * k, 0.62 * k, wz(eli.r) + (ox.position.z - wz(eli.r)) * k); });
  for (const [c, r] of [[6, 4], [7, 4]]) {
    const from = ox.position.clone(), to = new THREE.Vector3(wx(c), 0, wz(r));
    await animate(700, k => { ox.position.lerpVectors(from, to, k); rider.position.set(ox.position.x, 0.62, ox.position.z); });
  }
  moveObjTiles('ox', [[7, 4]]);
  placeEli(7, 3);
  ST.crossed = true; refresh();
  await lines(['eli', ['Thank you, Shimshon.', 'תודה, שמשון.']], ['farmer', ['(from the middle of the field) Send him back when you’re done! And Kohen, three tefachim! I’ll remember!', '(מאמצע השדה) תשלח אותו בחזרה כשתסיים! וכהן, שלושה טפחים! אני אזכור!']]);
}

// ============================================================ 3. Yehuda's tent
SCENES.push({
  id: 'yehuda', act: 1, cols: 7, rows: 5, theme: 'grass', light: 'dusk',
  title: ['Yehuda’s Tent', 'האוהל של יהודה'],
  blurb: ['Yehuda HaMaccabi is a Kohen too. He fought, he carried the fallen, and now he can’t go into the Mikdash for seven days.', 'גם יהודה המכבי הוא כהן. הוא נלחם, הוא נשא את הנופלים, ועכשיו הוא לא יכול להיכנס למקדש שבעה ימים.'],
  start: [0, 3, Math.PI / 2],
  build() {
    deco(K3.tent(2.2, 1.7, '#d8c49a'), 4, 0, { dx: 0.5, dz: -0.3, block: [[4, 0], [5, 0]] });
    const flagPole = group(mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 5), mat(C.woodDark), 0, 1.1, 0), mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), mat('#3b5aa6'), 0.32, 1.9, 0));
    deco(flagPole, 6, 0);
    scatter(4, 4, r => K3.bush(r), [[0, 0], [1, 0], [6, 4], [0, 4]]);
    npc('yehuda', 'yehuda', 4, 1, { range: 2, actions: () => [A.talk(talkYehuda), A.look(['Yehuda HaMaccabi. Tired, dusty, and somehow still the most impressive person in any room. Or field.', 'יהודה המכבי. עייף, מאובק, ואיכשהו עדיין האדם הכי מרשים בכל חדר. או שדה.'])] });
    npc('avner', 'avner', 2, 4, { actions: () => [A.talk(talkAvner), A.look(['Avner. Enormous. Beaming. Already reaching out a hand.', 'אבנר. ענק. קורן. כבר מושיט יד.'])] });
    exitAt('exit', 6, 3, 'awning', ['Into the city', 'אל העיר'], () => !fl('mission') ? ['eli', ['I should hear what Yehuda wants first.', 'כדאי שאשמע קודם מה יהודה רוצה.']] : !fl('avnerMet') ? ['yehuda', ['Take Avner with you. Say hello. From a distance.', 'קח איתך את אבנר. תגיד שלום. מרחוק.']] : true);
  },
  hazards: () => [{ tiles: without(rect(3, 5, 0, 2), [4, 1], [4, 0], [5, 0]), kind: 'keep', why: ['Yehuda holds up a hand. “Not closer. I’m tamei met. One touch and you’re tamei until tonight.”', 'יהודה מרים יד. "לא יותר קרוב. אני טמא מת. נגיעה אחת ואתה טמא עד הערב."'], lesson: 'tameiMetPerson' }],
  objective: () => !fl('mission') ? ['Talk to Yehuda', 'לדבר עם יהודה'] : !fl('avnerMet') ? ['Meet Avner', 'להכיר את אבנר'] : ['Head into the city', 'לצאת אל העיר'],
  solution: [{ o: 'yehuda', a: 'talk' }, { o: 'avner', a: 'talk' }, { o: 'exit' }],
});
async function talkYehuda() {
  if (fl('mission')) { await speak('yehuda', ['Go. And Eli: if you find a jug, don’t let anyone touch it.', 'לך. ואלי: אם תמצא כד, אל תיתן לאף אחד לגעת בו.']); return; }
  await lines(
    ['yehuda', ['Eli. The Kohen who counted the flour.', 'אלי. הכהן שספר את הקמח.']],
    ['eli', ['Twice.', 'פעמיים.']],
    ['yehuda', ['Good. I need someone who counts carefully. The Mikdash is ours again, but the Greeks were in the Heichal. Every jug of oil they could reach is tamei. We are going to light the menorah, and I want pure oil.', 'טוב. אני צריך מישהו שסופר בזהירות. המקדש שוב שלנו, אבל היוונים היו בהיכל. כל כד שמן שהם יכלו להגיע אליו טמא. אנחנו הולכים להדליק את המנורה, ואני רוצה שמן טהור.']],
  );
  while (true) {
    const i = await ask('yehuda', ['Questions?', 'שאלות?'], [{ t: ['Why not you?', 'למה לא אתה?'] }, { t: ['If everyone’s tamei, isn’t tumah allowed for the whole community?', 'אם כולם טמאים, הטומאה לא מותרת לציבור?'] }, { t: ['I’ll find it.', 'אני אמצא אותו.'], ok: true }]);
    if (i === 0) await speak('yehuda', ['Look at me. I fought. I carried our fallen. I’m tamei met, and so is nearly every man here. Seven days, and the Parah Adumah water, before we can go in.', 'תסתכל עליי. נלחמתי. נשאתי את הנופלים שלנו. אני טמא מת, וכמעט כל איש כאן. שבעה ימים, ומי פרה אדומה, לפני שנוכל להיכנס.']);
    else if (i === 1) { await speak('yehuda', ['Pushed aside, not allowed. Tumah is set aside for the community only when there is no other way. If there is pure oil anywhere, we find it first.', 'דחויה, לא הותרה. הטומאה נדחית בציבור רק כשאין דרך אחרת. אם יש איפשהו שמן טהור, קודם מוצאים אותו.']); await lesson('dechuya'); }
    else break;
  }
  await lines(
    ['yehuda', ['Go up through the city to the Temple Mount. Avner goes with you as far as the Cheil. He can’t go further, and neither can I.', 'תעלה דרך העיר להר הבית. אבנר ילך איתך עד החיל. הוא לא יכול להמשיך משם, וגם אני לא.']],
    ['eli', ['Avner? The quartermaster mentioned an Avner.', 'אבנר? האפסנאי הזכיר איזה אבנר.']],
    ['yehuda', ['Then you’ve been warned.', 'אז הוזהרת.']],
  );
  flag('mission'); objective();
}
async function talkAvner() {
  if (fl('avnerMet')) { await speak('avner', ['Ready when you are! I’ll walk behind. Way behind.', 'מוכן מתי שתגיד! אני אלך מאחור. הרבה מאחור.']); return; }
  await speak('avner', ['You’re Eli! I’m Avner! Let me shake your—', 'אתה אלי! אני אבנר! תן לי ללחוץ לך את ה—']);
  while (true) {
    const i = await ask('avner', ['—hand?', '—יד?'], [{ t: ['Shake his hand', 'ללחוץ לו את היד'] }, { t: ['Wave instead', 'לנופף במקום'], ok: true }]);
    if (i === 0) {
      await lines(['eli', ['Wait! You’re tamei met. That makes you an Av. If you touch me, I’m tamei until tonight.', 'רגע! אתה טמא מת. זה עושה אותך אב. אם תיגע בי, אני טמא עד הערב.']], ['avner', ['An Av? I’m not even married!', 'אב? אני אפילו לא נשוי!']], ['eli', ['An Av HaTumah. A source of tumah.', 'אב הטומאה. מקור של טומאה.']], ['avner', ['Oh.', 'אה.']]);
      await lesson('tameiMetPerson');
    } else break;
  }
  await lines(['avner', ['A wave! Very Kohen-like. I like it.', 'נפנוף! מאוד כוהני. אני אוהב את זה.']], ['eli', ['Let’s go. You first. Not too close.', 'בוא נלך. אתה ראשון. לא קרוב מדי.']]);
  flag('avnerMet'); objective();
}

// ============================================================ 4. The market awning
SCENES.push({
  id: 'awning', act: 1, cols: 9, rows: 5, theme: 'pave', light: 'dusk',
  title: ['The Market Awning', 'הסוכך בשוק'],
  blurb: ['A street of shuttered stalls. Avner has decided to be helpful.', 'רחוב של דוכנים סגורים. אבנר החליט לעזור.'],
  start: [0, 3, Math.PI / 2],
  walls: [{ side: 'back', courses: 5, seed: 11 }],
  pre() { ST.tarp = true; },
  build() {
    roofOver(0, 4, 0, 1, '#a8573c', { h: 1.6, slope: 0 });
    deco(K3.stall('#a8573c'), 2, 0, { dx: 0.5, block: [[2, 0], [3, 0]] });
    thing('fallen', ['A fallen fighter', 'לוחם שנפל'], K3.fallen(), 1, 1, { ry: 0.2, anchorY: 0.8, look: ['A fallen fighter, covered, lying in the shade of the awning.', 'לוחם שנפל, מכוסה, שוכב בצל הסוכך.'] });
    ST.tarpG = roofOver(4, 7, 1, 3, '#c9c0a8', { h: 1.5, slope: 0 });
    for (const c of [4, 5, 6]) deco(c === 5 ? K3.barrel() : K3.crate(0.66, '#8c6a46'), c, 4);
    deco(K3.olive(rng(5)), 8, 0);
    npc('avner', 'avner', 7, 4, { range: 4, actions: () => [A.talk(talkAvnerTarp), A.look(['Avner, holding up one end of a tarp he found. He looks very proud.', 'אבנר, מחזיק קצה של ברזנט שמצא. הוא נראה גאה מאוד.'])] });
    exitAt('exit', 8, 2, 'rubble', ['Up the street', 'במעלה הרחוב']);
  },
  hazards: () => [
    { tiles: rect(0, 4, 0, 1), why: ['The awning is over a fallen fighter. Under it is under one roof with him.', 'הסוכך פרוש מעל לוחם שנפל. מתחתיו זה תחת גג אחד איתו.'], lesson: 'ohel' },
    ...(ST.tarp ? [{ tiles: rect(4, 7, 1, 3), why: ['Avner’s tarp is touching the awning over the fallen fighter. Now it’s one roof, all the way across the street.', 'הברזנט של אבנר נוגע בסוכך שמעל הלוחם שנפל. עכשיו זה גג אחד, לרוחב כל הרחוב.'], lesson: 'joinedRoof' }] : []),
  ],
  objective: () => ST.tarp ? ['Get past Avner’s helpful tarp', 'לעבור את הברזנט המועיל של אבנר'] : ['Go on up the street', 'להמשיך במעלה הרחוב'],
  async intro() {
    await lines(['avner', ['Eli! Shade! For you! Kohanim burn easily, I’ve heard.', 'אלי! צל! בשבילך! שמעתי שכהנים נשרפים בשמש בקלות.']], ['eli', ['Avner, what did you tie that tarp to?', 'אבנר, למה קשרת את הברזנט הזה?']], ['avner', ['That awning! It was right there.', 'לסוכך ההוא! הוא היה ממש שם.']]);
  },
  solution: [{ tile: [5, 2] }, { o: 'avner', a: 'talk' }, { o: 'exit' }],
});
async function talkAvnerTarp() {
  if (!ST.tarp) { await speak('avner', ['I’ll walk on the far side. Very far. Shouting distance.', 'אני אלך בצד השני. רחוק מאוד. מרחק צעקה.']); return; }
  while (true) {
    const i = await ask('avner', ['Lovely shade, isn’t it?', 'צל נהדר, לא?'], [
      { t: ['It’s evening, Avner.', 'זה ערב, אבנר.'] },
      { t: ['Thank you, very kind.', 'תודה, מאוד נחמד.'] },
      { t: ['Your tarp touches the awning over the fallen man. Now it’s all one roof, and I’d be under it.', 'הברזנט שלך נוגע בסוכך שמעל הנופל. עכשיו זה גג אחד, ואני אהיה מתחתיו.'], ok: true }]);
    if (i === 0) await speak('avner', ['Pre-emptive shade.', 'צל מונע.']);
    else if (i === 1) await lines(['avner', ['You’re welcome!', 'בכיף!']], ['eli', ['...That wasn’t the point.', '...זה לא היה העניין.']]);
    else break;
  }
  await speak('avner', ['One roof? Oh. Oh no. I made a tent. I’m taking it down. I’m tamei already, I can touch it.', 'גג אחד? אה. אוי לא. עשיתי אוהל. אני מוריד אותו. אני כבר טמא, אני יכול לגעת בו.']);
  endTalk();
  await animate(700, k => { ST.tarpG.position.y = -1.4 * k; ST.tarpG.scale.setScalar(1 - k * 0.9); });
  room.remove(ST.tarpG); ST.tarp = false; refresh();
  await lesson('joinedRoof');
}

// ============================================================ 5. Bones in the rubble
SCENES.push({
  id: 'rubble', act: 1, cols: 8, rows: 5, theme: 'pave', light: 'dusk',
  title: ['Bones in the Rubble', 'עצמות בין ההריסות'],
  blurb: ['A narrow alley, half full of fallen stones. The only way through is past a crate, and past something very small.', 'סמטה צרה, חצי מלאה אבנים שנפלו. הדרך היחידה עוברת ליד ארגז, וליד משהו קטן מאוד.'],
  start: [0, 2, Math.PI / 2],
  walls: [{ side: 'back', courses: 6, seed: 21 }, { side: 'left', courses: 6, seed: 22 }],
  build() {
    const r = rng(31);
    for (const [c, rr] of [[3, 0], [4, 0], [3, 1], [4, 1], [3, 3], [4, 3], [3, 4], [4, 4]]) {
      const g = new THREE.Group();
      for (let i = 0; i < 4; i++) { const s = mesh(new THREE.DodecahedronGeometry(0.22 + r() * 0.15, 0), mat(r() > 0.5 ? C.stone : C.stoneMid)); s.position.set((r() - 0.5) * 0.5, 0.15 + i * 0.12, (r() - 0.5) * 0.5); g.add(s); }
      deco(g, c, rr);
    }
    addObj('crate', { name: ['A heavy crate', 'ארגז כבד'], tiles: [[4, 2]], group: K3.crate(0.78), at: [4, 2], push: true, anchorY: 1.1, actions: () => [A.look(['A heavy crate, wedged between the rubble. It would slide if I pushed it.', 'ארגז כבד, תקוע בין ההריסות. הוא יחליק אם אדחוף אותו.'])] });
    addObj('bone', {
      name: ['A tiny bone', 'עצם קטנטנה'], tiles: [[5, 2]], group: K3.bone(), at: [5, 2], anchorY: 0.5, hit: [0.6, 0.3, 0.6],
      actions: () => [A.look(['A bone, no bigger than a grain of barley. A bone that small spreads tumah by touch or by carrying, never by roof. I could step right over it. I just can’t move it.', 'עצם, לא גדולה יותר מגרגר שעורה. עצם קטנה כזאת מטמאה במגע ובמשא, אף פעם לא באוהל. אני יכול לעבור ממש מעליה. אני רק לא יכול להזיז אותה.'], () => lesson('smallBone')),
        A.say('take', ['Pick it up', 'להרים אותה'], ['eli', ['That’s carrying. Carrying is the one thing I can’t do with it.', 'זה משא. משא זה בדיוק מה שאסור לי לעשות איתה.']])],
    });
    npc('avner', 'avner', 6, 4, { range: 4, actions: () => [A.talk(talkAvnerBone), A.look(['Avner, on the far side of the rubble. He climbed over it. Of course he did.', 'אבנר, בצד השני של ההריסות. הוא טיפס מעליהן. ברור.'])] });
    exitAt('exit', 7, 2, 'philo', ['On to the square', 'הלאה, אל הכיכר']);
  },
  canPush(id, to) {
    if (G.objs.bone && to[0] === 5 && to[1] === 2) return [['eli', ['If I push the crate, it rolls right over that little bone and shoves it along. Moving it, even with a crate, counts as carrying it.', 'אם אדחוף את הארגז, הוא יתגלגל ממש על העצם הקטנה וידחוף אותה. להזיז אותה, אפילו בעזרת ארגז, נחשב משא.']]];
    return null;
  },
  objective: () => G.objs.bone ? ['Get the crate out of the way', 'לפנות את הארגז מהדרך'] : ['Push the crate through and go on', 'לדחוף את הארגז ולהמשיך'],
  solution: [{ o: 'crate', a: 'push' }, { o: 'avner', a: 'talk' }, { o: 'crate', a: 'push' }, { o: 'crate', a: 'push' }, { o: 'exit' }],
});
async function talkAvnerBone() {
  if (!G.objs.bone) { await speak('avner', ['Buried properly. Now push away!', 'נקבר כמו שצריך. עכשיו תדחוף!']); return; }
  while (true) {
    const i = await ask('avner', ['Need a hand? Not that hand. A different kind of hand.', 'צריך יד? לא היד ההיא. סוג אחר של יד.'], [
      { t: ['Could you push the crate?', 'אתה יכול לדחוף את הארגז?'] },
      { t: ['There’s a tiny bone there. Could you take it and bury it properly?', 'יש שם עצם קטנטנה. אתה יכול לקחת אותה ולקבור אותה כמו שצריך?'], ok: true }]);
    if (i === 0) await speak('avner', ['From over here? I’m strong, not long.', 'מכאן? אני חזק, לא ארוך.']);
    else break;
  }
  await speak('avner', ['A bone! Poor soul. Of course. I’m already tamei; it can’t make me any more tamei.', 'עצם! מסכן. ברור. אני כבר טמא; היא לא יכולה לטמא אותי יותר.']);
  endTalk();
  const av = G.objs.avner.group, home = av.position.clone();
  await slideTo(av, 5, 3, 600);
  await animate(400, k => G.objs.bone.group.scale.setScalar(1 - k));
  removeObj('bone');
  await animate(600, k => av.position.lerpVectors(new THREE.Vector3(wx(5), 0, wz(3)), home, k));
  await speak('avner', ['I’ll see he’s buried properly. That’s a mitzvah.', 'אני אדאג שייקבר כמו שצריך. זו מצווה.']);
}

// ============================================================ 6. Philo's stall
SCENES.push({
  id: 'philo', act: 1, cols: 8, rows: 5, theme: 'pave', light: 'dusk',
  title: ['Philo’s Stall', 'הדוכן של פילון'],
  blurb: ['A little square below the Temple Mount. A merchant has parked his stall right across it.', 'כיכר קטנה מתחת להר הבית. סוחר החנה את הדוכן שלו בדיוק לרוחבה.'],
  start: [0, 2, Math.PI / 2],
  walls: [{ side: 'back', courses: 5, seed: 41 }],
  build() {
    const well = group(mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.5, 10), mat(C.stoneMid), 0, 0.25, 0), mesh(new THREE.CircleGeometry(0.38, 10).rotateX(-Math.PI / 2), mat(C.water), 0, 0.51, 0, false));
    deco(well, 3, 0, { dx: 0.5, block: [[3, 0], [4, 0]] });
    deco(K3.barrel(), 3, 4); deco(K3.crate(0.62), 4, 4);
    ST.stall = K3.stall('#3d6fa3'); ST.stall.add(K3.jug({ s: 1.0, sealed: true }).translateX(0.3).translateZ(-0.55));
    thing('stall', ['Philo’s stall', 'הדוכן של פילון'], ST.stall, 3, 2, { dx: 0.5, ry: Math.PI / 2, tiles: rect(3, 4, 1, 3), anchorY: 1.6, look: ['A stall full of jugs with very fancy seals. It blocks the whole square.', 'דוכן מלא כדים עם חותמות מפוארים מאוד. הוא חוסם את כל הכיכר.'] });
    npc('philo', 'philo', 5, 2, { range: 3, actions: () => [A.talk(talkPhilo), A.look(['Philo. Blue robe, gold sash, a wreath, and a smile that has sold a lot of oil.', 'פילון. גלימה כחולה, אבנט זהב, זר, וחיוך שמכר הרבה שמן.'])] });
    addMouse(1, 4);
    exitAt('exit', 7, 2, 'cheil', ['To the Temple Mount', 'אל הר הבית']);
  },
  objective: () => ST.gone ? ['Go on to the Temple Mount', 'להמשיך אל הר הבית'] : ['Get past Philo’s stall', 'לעבור את הדוכן של פילון'],
  async intro() {
    await lines(['philo', ['A Kohen! A Kohen in need of oil, if I’m any judge. And I am a judge. Of oil.', 'כהן! כהן שצריך שמן, אם אני מבין משהו. ואני מבין. בשמן.']]);
  },
  solution: [{ o: 'philo', a: 'talk' }, { o: 'exit' }],
});
async function talkPhilo() {
  if (ST.gone) return;
  await speak('philo', ['Pure olive oil, sealed with the seal of the Kohen Gadol himself! Practically holy. Very nearly holy. Holy-adjacent.', 'שמן זית טהור, חתום בחותמו של הכהן הגדול בעצמו! כמעט קדוש. ממש כמעט קדוש. בשכונה של קדוש.']);
  while (true) {
    const opts = [
      { t: ['Let me see the seal.', 'תראה לי את החותם.'] },
      { t: ['What do you want for it?', 'מה אתה רוצה בשבילו?'] },
      { t: ['What does the Kohen Gadol’s seal look like?', 'איך נראה החותם של הכהן הגדול?'] },
    ];
    if (ST.sawSeal) opts.push({ t: ['That’s an owl. The Kohen Gadol doesn’t seal his oil with an owl. And you can’t show me nobody has opened it.', 'זה ינשוף. הכהן הגדול לא חותם את השמן שלו בינשוף. ואתה לא יכול להראות לי שאף אחד לא פתח אותו.'], ok: true });
    const i = await ask('philo', ['So?', 'נו?'], opts);
    if (i === 0) {
      await openModal(() => card(U.closeUp, ['Philo’s seal', 'החותם של פילון'], `<div class="art seal-one">${sealArt('owl')}</div><p>${tx(['A very confident owl, pressed into blue wax.', 'ינשוף מאוד בטוח בעצמו, טבוע בשעווה כחולה.'])}</p>`, btn('ok', ['Hm.', 'הממ.'], true)));
      await lines(['eli', ['That’s an owl.', 'זה ינשוף.']], ['philo', ['It’s a very holy owl.', 'זה ינשוף מאוד קדוש.']]);
      ST.sawSeal = true;
    } else if (i === 1) await lines(['philo', ['For you? Those spears. Three fine spears.', 'בשבילך? הרמחים האלה. שלושה רמחים יפים.']], ['eli', ['They’re the quartermaster’s. I signed for them.', 'הם של האפסנאי. חתמתי עליהם.']], ['philo', ['Signed! Ugh. Paperwork.', 'חתמת! איכס. ניירת.']]);
    else if (i === 2) await speak('philo', ['A pomegranate? Probably? I’ve never actually seen one. That’s why I use owls.', 'רימון? כנראה? אף פעם לא ראיתי אחד באמת. בגלל זה אני משתמש בינשופים.']);
    else break;
  }
  await speak('philo', ['Shh! Not so loud! A Kohen who knows his seals is very bad for business. Fine. I’m moving. There are plenty of people in the lower market who don’t ask questions.', 'ששש! לא כל כך חזק! כהן שמכיר חותמות זה רע מאוד לעסקים. טוב. אני זז. יש מספיק אנשים בשוק התחתון שלא שואלים שאלות.']);
  endTalk();
  const ph = G.objs.philo.group;
  await animate(900, k => { ST.stall.position.z = wz(2) + k * 6; ph.position.z = wz(2) + k * 6; });
  removeObj('philo'); removeObj('stall');
  ST.gone = true; refresh();
  await lesson('sealProof');
}

// ============================================================ 7. The Cheil gate
SCENES.push({
  id: 'cheil', act: 1, cols: 8, rows: 6, theme: 'pave', light: 'evening',
  title: ['The Cheil Gate', 'שער החיל'],
  blurb: ['The low wall around the courtyards. Beyond it, nobody tamei met may go. The Levi guarding the gate is fast asleep, and the officer of the Temple Mount is making his rounds.', 'החומה הנמוכה סביב העזרות. מעבר לה, טמא מת לא נכנס. הלוי ששומר על השער ישן עמוק, ואיש הר הבית עושה את הסיבוב שלו.'],
  start: [0, 4, Math.PI / 2],
  build() {
    for (let c = 0; c < 8; c++) if (c !== 4) deco(K3.fence(1), c, 1, { block: [[c, 1]] });
    ST.gateG = K3.gate(0.9, 1.6, false); deco(ST.gateG, 4, 1, { block: false });
    G.blocked.add(K(4, 1));
    torchPost(3, 2, 0.3, -0.4); torchPost(5, 2, -0.3, -0.4);
    addObj('guard', {
      npc: true, faceEli: false, tiles: [[5, 3]], group: CAST.guard(), at: [5, 3, 0, 0, -Math.PI / 2], anchorY: 0.9, name: PEOPLE.guard.name, range: 1,
      actions: () => ST.awake ? [A.talk(talkGuard), A.look(['The Levi guard, very awake now, and very keen that everyone know it.', 'השומר הלוי, ער מאוד עכשיו, ומאוד רוצה שכולם יידעו את זה.'])]
        : [A.look(['The Levi guard. Asleep. Snoring in a very official way.', 'השומר הלוי. ישן. נוחר בצורה מאוד רשמית.']), A.act('wake', ['Wake him', 'להעיר אותו'], wakeGuard)],
    });
    npc('gevini', 'gevini', 1, 3, { range: 2, actions: () => [A.talk(talkGevini), A.look(['Gevini the herald. A chest like a barrel and a voice, they say, you can hear three parsaot away.', 'גביני הכרוז. חזה כמו חבית וקול שאומרים שנשמע שלוש פרסאות.'])] });
    npc('avner', 'avner', 2, 5, { actions: () => [A.talk(() => speak('avner', ['This is as far as I go. Look, there’s a sign. Well, there’s a wall. Same thing.', 'עד כאן אני הולך. תראה, יש שלט. טוב, יש חומה. אותו דבר.'])), A.look(['Avner, standing at a very respectful distance from the Cheil.', 'אבנר, עומד במרחק מאוד מכבד מהחיל.'])] });
    const [tc, tr] = ST.tuviaDone ? [3, 3] : [4, 2];
    npc('tuvia', 'tuvia', tc, tr, { actions: () => [A.talk(talkTuvia), A.look(ST.tuviaDone ? ['Tuvia, watching the sun as if he could push it down by staring.', 'טוביה, מסתכל על השמש כאילו הוא יכול להוריד אותה במבט.'] : ['A young Kohen with a basket, sitting right in the gateway. He looks hungry and very confused.', 'כהן צעיר עם סל, יושב בדיוק בפתח השער. הוא נראה רעב ומבולבל מאוד.'])] });
    const off = CAST.officer(); deco(off, 7, 0, { dz: -0.3, block: false }); ST.off = off;
    exitAt('exit', 4, 0, 'hub', ['Into the Ezrat Nashim', 'אל עזרת הנשים'], () => ST.open || ['eli', ['The gate is shut, and the guard is... asleep.', 'השער סגור, והשומר... ישן.']]);
  },
  pre() { ST.tuviaDone = !!fl('tuvia'); },
  objective: () => !ST.awake ? ['Wake the guard before the officer gets here', 'להעיר את השומר לפני שאיש הר הבית מגיע'] : !ST.passed ? ['Talk your way past the guard', 'לשכנע את השומר לתת לך לעבור'] : !ST.tuviaDone ? ['Help the Kohen sitting in the gateway', 'לעזור לכהן שיושב בשער'] : ['Go through the gate', 'לעבור בשער'],
  async intro() {
    await lines(['eli', ['Torches, coming this way. That’s the officer of the Temple Mount, doing his rounds.', 'לפידים, מתקרבים לכאן. זה איש הר הבית, בסיבוב שלו.']], ['eli', ['And that guard is asleep.', 'והשומר הזה ישן.']]);
  },
  tick(dt) { if (ST.off && !ST.open) ST.off.position.x = wx(7) - Math.min(1.2, (ST.t = (ST.t || 0) + dt * 0.01)); },
  carry() { flag('tuvia'); },
  solution: [{ o: 'guard', a: 'wake' }, { o: 'gevini', a: 'talk' }, { o: 'guard', a: 'talk' }, { o: 'tuvia', a: 'talk' }, { o: 'exit' }],
});
async function wakeGuard() {
  await lines(['eli', ['Excuse me? Sir?', 'סליחה? אדוני?']], ['guard', ['Zzz... five more minutes... zzz...', 'זזז... עוד חמש דקות... זזז...']], ['eli', ['If the officer finds a guard asleep, he can hit him with his stick and burn his clothes.', 'אם איש הר הבית מוצא שומר ישן, מותר לו להכות אותו במקל ולשרוף את בגדיו.']], ['guard', ['Zzz... let him... zzz...', 'זזז... שישרוף... זזז...']]);
  await lesson('officer');
  ST.tried = true;
}
async function talkGevini() {
  if (ST.awake) { await speak('gevini', ['That was a good one, wasn’t it?', 'זה היה טוב, נכון?']); return; }
  await speak('gevini', ['(whispering) I’m Gevini. The herald. I have the loudest voice in the Mikdash. I’m saving it.', '(בלחש) אני גביני. הכרוז. יש לי הקול הכי חזק במקדש. אני חוסך אותו.']);
  while (true) {
    const i = await ask('gevini', ['(whispering) Can I help you?', '(בלחש) אפשר לעזור?'], [{ t: ['Why are you whispering?', 'למה אתה לוחש?'] }, { t: ['Could you wake the guard?', 'אתה יכול להעיר את השומר?'], ok: true }]);
    if (i === 0) await speak('gevini', ['Saving it. I said.', 'חוסך אותו. אמרתי.']);
    else break;
  }
  await speak('gevini', ['I only make proper announcements. Give me something proper to announce.', 'אני מכריז רק הכרזות רשמיות. תן לי משהו רשמי להכריז.']);
  while (true) {
    const i = await ask('gevini', ['What shall I announce?', 'מה להכריז?'], [
      { t: ['“Fire!”', '"שריפה!"'] },
      { t: ['“Lunch!”', '"ארוחת צהריים!"'] },
      { t: ['The morning call: “Kohanim, to your service! Levi’im, to your platform! Yisraelim, to your post!”', 'הקריאה של הבוקר: "עמדו כהנים לעבודתכם, ולוים לדוכנכם, וישראל למעמדכם!"'], ok: true }]);
    if (i === 0) await lines(['gevini', ['I can’t announce a fire unless there is a fire. Is there a fire?', 'אני לא יכול להכריז על שריפה אם אין שריפה. יש שריפה?']], ['eli', ['...No.', '...לא.']]);
    else if (i === 1) await speak('gevini', ['I don’t do lunch.', 'ארוחות צהריים אני לא מכריז.']);
    else break;
  }
  await speak('gevini', ['Now THAT is an announcement.', 'עכשיו זאת הכרזה.']);
  await speak('narr', ['<span class="loud">' + '“KOHANIM, TO YOUR SERVICE! LEVI’IM, TO YOUR PLATFORM! YISRAELIM, TO YOUR POST!”</span>', '<span class="loud">"עִמְדוּ כֹּהֲנִים לַעֲבוֹדַתְכֶם, וּלְוִיִּם לְדוּכָנְכֶם, וְיִשְׂרָאֵל לְמַעֲמַדְכֶם!"</span>']);
  endTalk();
  const g = G.objs.guard.group;
  await animate(500, k => { g.userData.body.rotation.x = -Math.PI / 2 * (1 - k); g.userData.body.position.set(0, 0.17 * (1 - k), -0.45 * (1 - k)); });
  ST.awake = true; objective();
  await lines(['guard', ['I’M AWAKE! I was always awake! I was guarding with my eyes closed!', 'אני ער! תמיד הייתי ער! שמרתי בעיניים עצומות!']], ['narr', [`${SRC.yoma20b.en}: Gevini’s call could be heard three parsaot away.`, `${SRC.yoma20b.he}: קולו של גביני היה נשמע בשלוש פרסאות.`]]);
}
async function talkGuard() {
  if (ST.open) { await speak('guard', ['Go on, go on. I’m guarding. Very awake.', 'לך, לך. אני שומר. ער מאוד.']); return; }
  if (ST.passed) { await speak('guard', ['You may pass. Once he stops sitting in my gateway.', 'אתה רשאי לעבור. ברגע שהוא יפסיק לשבת לי בשער.']); return; }
  await speak('guard', ['Halt! Who goes there? State your business, and your status.', 'עצור! מי שם? מה העניין שלך, ומה המצב שלך?']);
  await duel('guard', [
    { say: ['You walked here across a battlefield! You’re tamei met! The Cheil is closed to anyone tamei met.', 'הלכת לכאן דרך שדה קרב! אתה טמא מת! החיל סגור בפני טמאי מת.'],
      opts: [{ t: ['I held my breath the whole way.', 'עצרתי את הנשימה כל הדרך.'], back: [['guard', ['That is not how tumah works.', 'ככה טומאה לא עובדת.']]] },
        { t: ['I never touched, carried, or stood under a roof with any of the fallen.', 'לא נגעתי, לא נשאתי ולא עמדתי תחת גג עם אף אחד מהנופלים.'], ok: true },
        { t: ['Avner carried me.', 'אבנר סחב אותי.'], back: [['guard', ['AVNER carried you? Then you’re definitely tamei.', 'אבנר סחב אותך? אז אתה בטוח טמא.']], ['eli', ['He didn’t. Forget I said that.', 'הוא לא. תשכח שאמרתי.']]] }],
      rule: ['Tumat met comes by touching, carrying, or being under the same roof as a met. Walking past is none of them.', 'טומאת מת באה במגע, במשא או באוהל. לעבור ליד זה לא אף אחד מהם.'] },
    { say: ['You’ve been walking around with Avner all day. He’s tamei met!', 'הסתובבת כל היום עם אבנר. הוא טמא מת!'],
      opts: [{ t: ['Avner is a very clean person.', 'אבנר אדם מאוד נקי.'], back: [['guard', ['I’m sure he is. He’s also an Av HaTumah.', 'אני בטוח. הוא גם אב הטומאה.']]] },
        { t: ['Who’s Avner?', 'מי זה אבנר?'], back: [['avner', ['HELLO!', 'שלום!']], ['eli', ['...Oh. That Avner.', '...אה. אבנר ההוא.']]] },
        { t: ['Walking next to him isn’t touching him. Only touching an Av would make me tamei.', 'ללכת לידו זה לא לגעת בו. רק נגיעה באב הטומאה הייתה מטמאה אותי.'], ok: true }],
      rule: ['A tamei met person is an Av: touching him makes you tamei. Standing near him doesn’t.', 'טמא מת הוא אב הטומאה: נגיעה בו מטמאה. לעמוד לידו לא.'] },
  ]);
  await lines(['guard', ['Fine. You may pass. Him,', 'טוב. אתה רשאי לעבור. הוא,']], ['guard', ['(pointing at Avner) may not.', '(מצביע על אבנר) לא.']], ['avner', ['I know. I’ll wait here. I’ll guard the guard.', 'אני יודע. אני אחכה כאן. אני אשמור על השומר.']]);
  ST.passed = true; objective();
  if (!ST.tuviaDone) await lines(['guard', ['Once HE moves, that is. He’s been sitting in my gateway since noon, asking everyone what he’s allowed to eat.', 'כלומר, ברגע שהוא יזוז. הוא יושב לי בשער מהצהריים ושואל את כולם מה מותר לו לאכול.']], ['tuvia', ['Nobody will TELL me!', 'אף אחד לא מוכן להגיד לי!']]);
  await openCheilGate();
}
// the gate opens once the guard is satisfied and Tuvia is out of the gateway
async function openCheilGate() {
  if (!ST.passed || !ST.tuviaDone || ST.open) return;
  endTalk();
  const doors = ST.gateG.userData.doors.children;
  await animate(600, k => doors.forEach((d, i) => { const s = i ? 1 : -1; d.rotation.y = s * 1.3 * k; d.position.x = s * (0.45 / 2 + k * 0.2); }));
  G.blocked.delete(K(4, 1)); ST.open = true; refresh();
  await lines(['officer', ['(arriving with torches) All well here?', '(מגיע עם לפידים) הכול בסדר כאן?']], ['guard', ['Never better, sir! Very awake, sir!', 'מעולם לא היה טוב יותר, אדוני! ער מאוד, אדוני!']], ['avner', ['Good luck, Eli. Find that jug. And if you ever need a hug—', 'בהצלחה, אלי. תמצא את הכד. ואם אי פעם תצטרך חיבוק—']], ['eli', ['I’ll write.', 'אני אכתוב.']]);
  await lesson('cheil');
}

// Tuvia, a Kohen who immersed this morning and is sitting in the Cheil gateway until sunset
const TUVIA_FOOD = [
  { id: 'figs', name: ['Dried figs of ma’aser sheni', 'דבלה של מעשר שני'], ok: 'now',
    no: { sunset: ['Ma’aser sheni doesn’t wait for the sun. Once you’ve immersed, you can eat it.', 'מעשר שני לא מחכה לשמש. מרגע שטבלת, מותר לך לאכול אותו.'], korban: ['A korban? For figs? No. You immersed; that’s enough for ma’aser sheni.', 'קרבן? בשביל דבלה? לא. טבלת; זה מספיק למעשר שני.'] } },
  { id: 'bread', name: ['A loaf of terumah', 'כיכר של תרומה'], ok: 'sunset',
    no: { now: ['Stop! Don’t even touch it. A tevul yom makes terumah pasul just by touching it. Wait for the sun to set.', 'עצור! אל תיגע בה בכלל. טבול יום פוסל תרומה רק בנגיעה. חכה לשקיעה.'], korban: ['No korban for a dead mouse. Just a mikveh and a sunset.', 'אין קרבן על עכבר מת. רק מקווה ושקיעה.'] } },
  { id: 'stew', name: ['A pot of lentil stew (chullin)', 'סיר תבשיל עדשים (חולין)'], ok: 'now',
    no: { sunset: ['It’s chullin. Chullin doesn’t care about your sunset. You can even stir it: a tevul yom doesn’t make chullin tamei.', 'זה חולין. לחולין לא אכפת מהשקיעה שלך. מותר לך אפילו לבחוש: טבול יום לא מטמא חולין.'], korban: ['For lentils? Tuvia.', 'בשביל עדשים? טוביה.'] } },
];
async function talkTuvia() {
  if (ST.tuviaDone) { await speak('tuvia', ['Figs now, stew now, terumah at sunset. I’m writing it on my hand. Not that hand.', 'דבלה עכשיו, תבשיל עכשיו, תרומה בשקיעה. אני כותב את זה על היד. לא היד ההיא.']); return; }
  await lines(
    ['tuvia', ['A Kohen! Finally, a Kohen! Sit, sit. Not too close. Actually, close is fine. Is close fine?', 'כהן! סוף סוף, כהן! שב, שב. לא קרוב מדי. בעצם, קרוב זה בסדר. קרוב זה בסדר?']],
    ['eli', ['Why are you sitting in the gateway?', 'למה אתה יושב בשער?']],
    ['tuvia', ['This morning a mouse fell on me in the storeroom. A DEAD mouse. I immersed straight away. And now everyone says I’m a tevul yom, and I can’t go in, and I’m starving, and nobody will tell me what I’m allowed to eat!', 'הבוקר נפל עליי עכבר במחסן. עכבר מת. טבלתי מיד. ועכשיו כולם אומרים שאני טבול יום, ושאסור לי להיכנס, ואני מת מרעב, ואף אחד לא מוכן להגיד לי מה מותר לי לאכול!']],
    ['eli', ['Show me your basket.', 'תראה לי את הסל שלך.']],
  );
  // sort the basket: now, after sunset, or only after a korban
  const done = {};
  const when = { now: ['Now', 'עכשיו'], sunset: ['After sunset', 'אחרי השקיעה'], korban: ['Only after a korban', 'רק אחרי קרבן'] };
  while (TUVIA_FOOD.some(f => !done[f.id])) {
    const v = await openModal(() => card(['Tuvia’s basket', 'הסל של טוביה'], ['When may a tevul yom eat it?', 'מתי טבול יום יכול לאכול את זה?'],
      `<div class="sortlist">${TUVIA_FOOD.map(f => `<div class="sortrow${done[f.id] ? ' done' : ''}"><b>${tx(f.name)}</b><span>${done[f.id] ? '✓ ' + tx(when[f.ok]) : Object.keys(when).map(k => btn(`${f.id}:${k}`, when[k], false, k === f.ok)).join('')}</span></div>`).join('')}</div>`, ''));
    const [id, k] = String(v).split(':'); const f = TUVIA_FOOD.find(x => x.id === id);
    if (!f) continue;
    if (k === f.ok) { done[id] = true; await speak('tuvia', f.ok === 'now' ? ['Now? Really? (eats) Oh, that’s good.', 'עכשיו? באמת? (אוכל) אוי, זה טוב.'] : ['After sunset. I can wait. I can probably wait.', 'אחרי השקיעה. אני יכול לחכות. אני כנראה יכול לחכות.']); }
    else await speak('eli', f.no[k]);
  }
  await duel('tuvia', [
    { say: ['What if I wash my hands really, really well? Then can I have the terumah now?', 'ואם אני אטול ידיים ממש, ממש טוב? אז אפשר את התרומה עכשיו?'],
      opts: [{ t: ['Yes, with plenty of water.', 'כן, עם הרבה מים.'], back: [['eli', ['Wait, no. Hold on.', 'רגע, לא. חכה.']]] },
        { t: ['No. Washing fixes hands that are tamei by decree, right away. You’re a tevul yom all over. You wait for the sun.', 'לא. נטילה מתקנת ידיים שטמאות מדרבנן, מיד. אתה טבול יום כולך. אתה מחכה לשמש.'], ok: true },
        { t: ['Only with soap.', 'רק עם סבון.'], back: [['tuvia', ['What’s soap?', 'מה זה סבון?']]] }],
      rule: ['Unwashed hands are fixed by washing, at once; a tevul yom waits for sunset (Mishnah Chagigah 2:5; Zavim 5:12).', 'ידיים מתקנים בנטילה, מיד; טבול יום מחכה להערב שמש (משנה חגיגה ב, ה; זבים ה, יב).'] },
    { say: ['And when the sun sets, do I have to bring a korban too, before I’m completely tahor?', 'וכשהשמש שוקעת, אני צריך להביא גם קרבן, לפני שאני טהור לגמרי?'],
      opts: [{ t: ['Two doves and a goat.', 'שתי יונים ותיש.'], back: [['tuvia', ['I don’t own a goat!', 'אין לי תיש!']]] },
        { t: ['No. A dead sheretz needs a mikveh and a sunset. A zav, a metzora, a woman after childbirth: they also need a korban before kodashim.', 'לא. שרץ מת צריך מקווה והערב שמש. זב, מצורע, יולדת: הם צריכים גם קרבן לפני קדשים.'], ok: true },
        { t: ['A sheep. Just to be safe.', 'כבש. ליתר ביטחון.'], back: [['eli', ['There’s no “to be safe” with korbanot. You don’t bring one you don’t owe.', 'אין "ליתר ביטחון" בקרבנות. לא מביאים קרבן שלא חייבים.']]] }],
      rule: ['Three steps: immersion (ma’aser sheni), sunset (terumah), a korban if one is owed (kodashim) (Mishnah Negaim 14:3).', 'שלוש מדרגות: טבילה (מעשר שני), הערב שמש (תרומה), כפרה אם צריך (קדשים) (משנה נגעים יד, ג).'] },
    { say: ['Last one. Can I come in with you now, into the Ezrat Nashim?', 'אחרונה. אפשר להיכנס איתך עכשיו, לעזרת נשים?'],
      opts: [{ t: ['Yes, if you walk behind me.', 'כן, אם תלך מאחוריי.'], back: [['eli', ['No, that’s Avner’s rule. A different rule entirely.', 'לא, זה הכלל של אבנר. כלל אחר לגמרי.']]] },
        { t: ['No. A tevul yom may come this far, into the Cheil, but not into the Ezrat Nashim.', 'לא. טבול יום יכול להגיע עד כאן, לחיל, אבל לא לעזרת נשים.'], ok: true },
        { t: ['Only on tiptoe.', 'רק על קצות האצבעות.'], back: [['tuvia', ['I’ve tried tiptoe. The guard noticed.', 'ניסיתי על קצות האצבעות. השומר שם לב.']]] }],
      rule: ['A tevul yom may not enter the Ezrat Nashim (Mishnah Kelim 1:8).', 'טבול יום לא נכנס לעזרת נשים (משנה כלים א, ח).'] },
  ]);
  await lines(['tuvia', ['Then I’ll sit over there and watch the sun go down. Slowly. Very slowly.', 'אז אני אשב שם ואסתכל על השמש שוקעת. לאט. מאוד לאט.']]);
  endTalk();
  const g = G.objs.tuvia.group;
  await slideTo(g, 3, 3, 600);
  moveObjTiles('tuvia', [[3, 3]]); G.objs.tuvia.anchor.set(wx(3), G.objs.tuvia.anchor.y, wz(3));
  ST.tuviaDone = true; flag('tuvia'); refresh();
  await lesson('tevulYom');
  await openCheilGate();
}

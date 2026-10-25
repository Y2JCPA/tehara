/* C-5 · Pure Oil Run: World 1's tricks, harder, with oil for the Mikdash.
   Blowing doesn't count for the Mikdash. A sealed clay jar carried by someone
   who is tamei is still pure inside: clay only becomes tamei from inside. */
CH.runHaperas = CH.choice({
  intro: { en: 'Day 3. A Beit HaPeras [בית הפרס] blocks the road. How should Yehuda carry the oil for the Mikdash across?', he: 'יום ג. בית הפרס חוסם את הדרך. איך יעביר יהודה את השמן למקדש?' },
  actors: [{ kind: 'yehuda', x: 200, y: 900 }, { kind: 'helper', x: 260, y: 900 }],
  scene: { mode: 'day', seed: 111 },
  build(K) {
    const M = K.MAT;
    K.block(-10, 270, 560, 34, { z1: 0.7 });
    K.block(-10, 304, 560, 600, { top: 'none', z0: -1.8, z1: -0.7 });
    K.wall(40, 300, 460, 480, { mat: M.field, z0: -0.7, z1: 0.4 });
    for (const [x, y, w] of [[150, 720, 0], [240, 620, 1], [170, 500, 0], [260, 390, 1]]) K.place(K.stepStone(40, !!w), x, y, 0.55);
    K.block(-10, 900, 560, 80, { top: 'path' });
    K.bush(30, 900, 0.8); K.tree(520, 270, 0.7, 'olive', 9);
    const d1 = K.place(K.donkey({ strong: false, color: 0x9a8270, s: 1.0 }), 400, 900, 0.1); d1.rotation.y = -0.5;
    const d2 = K.place(K.donkey({ strong: true, s: 0.66 }), 500, 860, -0.4); d2.rotation.y = -0.5;
    K.block(450, 860, 100, 40, { face: 'earth', top: 'grass', z0: -1.2, z1: -0.1 });
  },
  draw(g, t, api) {
    G.sign(g, 270, 296, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 290, size: 13, post: false });
  },
  options: [
    { id: 'blow', label: { en: '💨 Blow', he: '💨 לנפח' }, result: api => { const r = api.T.crossField({ field: 'plowed', method: 'blow', purpose: 'mikdash' }); return { ok: r.tahor, msg: { en: 'Blowing is only relied on for going to bring the Korban Pesach, not for terumah [תרומה] or things for the Mikdash!', he: 'על ניפוח סומכים רק לעושה פסח, לא לתרומה ולא לדברי המקדש!' } }; } },
    { id: 'stones', label: { en: 'The big stones', he: 'האבנים הגדולות' }, result: api => ({ ok: api.T.crossField({ field: 'plowed', method: 'stones', solid: false }).tahor, msg: { en: 'Half of those stones sit on pebbles: they wobble, and a wobbling stone counts like the dirt!', he: 'חצי מהאבנים יושבות על חלוקים: הן מתנדנדות, ואבן מתנדנדת היא כמו העפר!' } }) },
    { id: 'bigdonkey', label: { en: '🐴 Big donkey', he: '🐴 החמור הגדול' }, result: api => ({ ok: api.T.crossField({ field: 'plowed', method: 'ride', strong: false }).tahor, msg: { en: 'Plop! It drops dung as you ride, which counts as a weak animal!', he: 'בהמה שמטילה גללים בשעת רכיבה, כוחה רע!' } }) },
    { id: 'small', label: { en: '🐴 Small donkey', he: '🐴 החמור הקטן' }, result: api => ({ ok: api.T.crossField({ field: 'plowed', method: 'ride', strong: true }).tahor, msg: { en: 'Small but strong and steady: across, still pure!', he: 'קטן אבל חזק ויציב: עברו, וטהורים!' } }) },
  ],
});
CH.runArrive = CH.choice({
  intro: { en: 'Day 8. Three jars of new oil reached the Mikdash. Which one may go to the Menorah? Read the tags!', he: 'יום ח. שלושה כדים של שמן חדש הגיעו למקדש. איזה מהם מותר למנורה? קראו את התוויות!' },
  actors: [{ kind: 'kohen', x: 420, y: 690, opts: { dir: -1 } }, { kind: 'yehuda', x: 120, y: 690 }],
  scene: { mode: 'indoor' },
  build(K) {
    const M = K.MAT;
    CH.temple3d(K, { floor: 860 });
    // a raised floor to stand on, the Menorah on its stone, and a bench for the jars
    K.block(-10, 690, 560, 70, { face: 'stone', top: 'stone', z0: -2.2, z1: 0.2 });
    K.wall(222, 486, 96, 204, { mat: M.stoneSmooth, z0: -1.6, z1: -0.6 });
    const men = K.place(K.menorah(1.08), 270, 486, -1.1);
    for (const [f, gl] of men.children[0].userData.flames) { f.visible = true; gl.visible = true; }
    K.light(270, 330, { power: 6, dist: 7, z: -0.4 });
    K.wall(20, 770, 500, 20, { mat: M.stoneSmooth, z0: 0.15, z1: 0.95 });
    K.place(CH.jar3d(K, { material: 'clay', sealed: true }, 1.2), 100, 770, 0.55);
    K.place(CH.jar3d(K, { material: 'clay', loose: true }, 1.2), 270, 770, 0.55);
    K.place(CH.jar3d(K, { material: 'metal', flask: true, sealed: true }, 1.2), 440, 770, 0.55);
  },
  draw(g, t, api) {
    const card = (x, title, lines) => {
      G.rr(g, x - 82, 792, 164, 64, 10, 'rgba(255,250,238,0.95)', 2, 'rgba(59,42,32,0.6)');
      G.text(g, title, x, 806, { size: 13 });
      lines.forEach((l, i) => G.text(g, api.L(l), x, 824 + i * 15, { size: 11, bold: false }));
    };
    card(100, api.L({ en: 'Jar A', he: 'כד א' }), [{ en: 'Clay, sealed tight.', he: 'חרס, צמיד פתיל.' }, { en: 'Carried by someone tamei met.', he: 'נשא אותו טמא מת.' }]);
    card(270, api.L({ en: 'Jar B', he: 'כד ב' }), [{ en: 'Clay, cloth tied on top.', he: 'חרס, בד קשור מלמעלה.' }, { en: 'Rested in a tomb\'s doorway.', he: 'נח בפתח קבר.' }]);
    card(440, api.L({ en: 'Jar C', he: 'כד ג' }), [{ en: 'Metal flask, sealed.', he: 'מתכת, סגור.' }, { en: 'Rested in a tomb\'s doorway.', he: 'נח בפתח קבר.' }]);
  },
  options: [
    { id: 'A', label: { en: 'Jar A', he: 'כד א' }, result: api => ({ ok: api.T.clayTouchedOutside().tahor, msg: { en: 'Right! A clay jar only becomes impure from its inside. Touching the outside does nothing, and the seal kept the oil safe.', he: 'נכון! כלי חרס מיטמא רק מתוכו. נגיעה בגבו אינה מטמאה, והחותם שמר על השמן.' }, delay: 1800 }) },
    { id: 'B', soft: true, label: { en: 'Jar B', he: 'כד ב' }, result: api => ({ ok: api.T.itemInOhel({ item: 'oil', vessel: { material: 'clay', sealed: false } }).tahor, msg: { en: 'A cloth tied on top isn\'t a tight seal [צמיד פתיל]. In the tomb\'s doorway, under one roof with the met, the oil became impure.', he: 'בד קשור אינו צמיד פתיל. בפתח הקבר, באוהל המת, השמן נטמא.' } }) },
    { id: 'C', soft: true, label: { en: 'Jar C', he: 'כד ג' }, result: api => ({ ok: api.T.itemInOhel({ item: 'oil', vessel: { material: 'metal', sealed: true } }).tahor, msg: { en: 'A metal flask doesn\'t protect what\'s inside, even sealed. In a tomb\'s doorway, under one roof with the met, the oil became impure.', he: 'כלי מתכת אינו מציל, אפילו סגור. בפתח הקבר, באוהל המת, השמן נטמא.' } }) },
  ],
});

CHANUKAH.push({
  id: 'C-5', pack: 'ch', title: { en: 'Pure Oil Run', he: 'מסע השמן הטהור' },
  stages: [W1.threeWays('yehuda'), W1.pruneTree('yehuda', 'helper'), CH.runHaperas, W1.treesOrNot('yehuda', 'mikdash'), CH.runArrive],
  hints: [
    { en: 'Under the stairs, and at the bottom of the ladder: look! Then the boulder before the bridge.', he: 'מתחת למדרגות ובתחתית הסולם: הסתכלו! ואז הסלע לפני הגשר.' },
    { en: 'One cut can do it: the branch over the grave.', he: 'גזימה אחת מספיקה: הענף שמעל הקבר.' },
    { en: 'Blowing only works for the Korban Pesach. Check the stones and the donkeys carefully.', he: 'ניפוח מועיל רק לקרבן פסח. בדקו היטב את האבנים ואת החמורים.' },
    { en: 'Blowing doesn\'t count for the Mikdash here either. A strong donkey does, and so does a field marked on only one edge.', he: 'גם כאן ניפוח אינו מועיל למקדש. חמור חזק מועיל, וגם שדה שרק מצר אחד שלה מצוין.' },
    { en: 'A clay jar only becomes impure from its inside.', he: 'כלי חרס מיטמא רק מתוכו.' },
  ],
  why: {
    text: {
      en: 'The one jug had oil for just one day, but making new pure oil took eight days. One explanation: the closest pure oil was four days away, so four days there and four days back. And the little jug burned for all eight days!\n\nOn the way: blowing on a Beit HaPeras is only relied on for the Korban Pesach, not for things for the Mikdash. And a **sealed clay jar** stays pure even if someone tamei carries it, because clay only becomes impure from its **inside**.',
      he: 'בפך היה שמן ליום אחד בלבד, ולא היה אפשר לתקן שמן טהור עד שמונה ימים. כתב הר"ן שהשמן הטהור היה רחוק ארבעה ימים. ונעשה נס והדליקו ממנו שמונה ימים!\n\nובדרך: על ניפוח בבית הפרס סומכים רק לעושה פסח, לא לדברי המקדש. **וכלי חרס המוקף צמיד פתיל** נשאר טהור אפילו אם טמא נשא אותו, כי כלי חרס מיטמא רק **מתוכו**.',
    },
    sources: [
      S('וְהִדְלִיקוּ מִמֶּנּוּ נֵרוֹת הַמַּעֲרָכָה שְׁמוֹנָה יָמִים עַד שֶׁכָּתְשׁוּ זֵיתִים וְהוֹצִיאוּ שֶׁמֶן טָהוֹר', 'Rambam, Hilchot Megillah v\'Chanukah 3:2', 'רמב"ם, הלכות מגילה וחנוכה ג, ב', 'Mishneh_Torah,_Scroll_of_Esther_and_Hanukkah.3.2'),
      S('וכמ"ש הר"ן שהיה להם שמן רחוק ד\' ימים', 'Maharsha, Chidushei Agadot, Shabbat 21b', 'מהרש"א, חידושי אגדות, שבת כא ע"ב', 'Chidushei_Agadot_on_Shabbat.21b.3'),
      S('שֶׁאֵין כְּלִי חֶרֶס מִתְטַמֵּא אֶלָּא מֵאֲוִירוֹ אוֹ בְּהֶסֵּט הַזָּב', 'Rambam, Hilchot Kelim 13:1', 'רמב"ם, הלכות כלים יג, א', 'Mishneh_Torah,_Vessels.13.1'),
      S('בּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה', 'Mishnah Oholot 18:4', 'משנה אהלות יח, ד', 'Mishnah_Oholot.18.4'),
    ],
  },
});

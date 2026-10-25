/* C-5 · Pure Oil Run: World 1's tricks, harder, with oil for the Mikdash.
   Blowing doesn't count for the Mikdash. A sealed clay jar carried by someone
   who is tamei is still pure inside: clay only becomes tamei from inside. */
CH.runHaperas = CH.choice({
  intro: { en: 'Day 3. A Beit HaPeras [בית הפרס] blocks the road. How should Yehuda carry the oil for the Mikdash across?', he: 'יום ג. בית הפרס חוסם את הדרך. איך יעביר יהודה את השמן למקדש?' },
  actors: [{ kind: 'yehuda', x: 200, y: 900 }, { kind: 'helper', x: 260, y: 900 }],
  draw(g, t, api) {
    Kit.outdoor(g, t, { seed: 111, y: 260 });
    G.platform(g, -10, 270, 560, 700, { seed: 112 });
    G.rr(g, 40, 300, 460, 480, 6, G.lin(g, 0, 300, 0, 780, [[0, '#c49560'], [1, '#a27243']]), 2.5, G.C.dirtDark); Kit.furrows(g, 40, 300, 460, 480);
    for (const [x, y, w] of [[150, 720, 0], [240, 620, 1], [170, 500, 0], [260, 390, 1]]) G.stoneTile(g, x, y, 28, { wobbly: !!w });
    G.donkey(g, 400, 900, 0.72, { color: '#7a6250', strong: false });
    G.donkey(g, 500, 860, 0.5, { strong: true });
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
  draw(g, t, api) {
    CH.temple(g, t, { floor: 860 });
    G.menorah(g, 270, 470, 0.9, [1, 1, 1, 1, 1, 1, 1], t);
    const card = (x, title, lines) => {
      G.rr(g, x - 82, 792, 164, 64, 10, 'rgba(255,250,238,0.95)', 2, 'rgba(59,42,32,0.6)');
      G.text(g, title, x, 806, { size: 13 });
      lines.forEach((l, i) => G.text(g, api.L(l), x, 824 + i * 15, { size: 11, bold: false }));
    };
    G.jar(g, 100, 770, 0.9, { material: 'clay', sealed: true });
    G.jar(g, 270, 770, 0.9, { material: 'clay', loose: true });
    G.jar(g, 440, 770, 0.9, { material: 'metal', flask: true, sealed: true });
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

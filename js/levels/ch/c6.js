/* C-6 · Eight Nights (Rambam Bi'at HaMikdash 4:15; Hilchot Chanukah 3:2)
   Why search for pure oil if tumah is set aside for the community? Because for
   the Rambam it is only pushed aside (דחויה): first look for a pure way. */
CH.whatToDo = CH.choice({
  intro: { en: 'All the oil the Greeks touched is impure [טמא], and the whole people is impure too. What should we do?', he: 'כל השמן שנגעו בו היוונים טמא, וגם כל העם טמא. מה נעשה?' },
  actors: [{ kind: 'kohen', x: 390, y: 860, opts: { dir: -1 } }, { kind: 'yehuda', x: 170, y: 860 }],
  draw(g, t) {
    CH.temple(g, t, { floor: 860, seed: 19 });
    G.menorah(g, 270, 560, 1.05, [], t);
    for (const x of [44, 92, 452, 500]) G.jar(g, x, 850, 0.75, { material: 'clay', seal: 'broken' });
  },
  options: [
    { id: 'impure', soft: true, label: { en: 'Use the impure oil', he: 'להשתמש בשמן הטמא' }, result: api => { const r = api.T.communityTumah(); return { ok: !r.mustSearchFirst, msg: { en: 'Not so fast! For the whole community, tumah is only pushed aside [דחויה] when there is no other way. First we must search for a pure way.', he: 'לא כל כך מהר! טומאה דחויה בציבור רק במקום שאי אפשר. קודם צריך לחפש דרך טהורה.' } }; } },
    { id: 'search', label: { en: 'Search for pure oil first', he: 'קודם לחפש שמן טהור' }, result: () => ({ ok: true, msg: { en: 'They searched, and found the one sealed jug!', he: 'בדקו, ומצאו את הפך האחד החתום!' } }) },
  ],
});
CH.nights = api => {
  const lit = [0, 0, 0, 0, 0, 0, 0];
  let night = 1;
  const yehuda = new Chars.Actor('yehuda', 110, 860), kohen = new Chars.Actor('kohen', 440, 860, { dir: -1 });
  const LX = [-90, -60, -30, 0, 30, 60, 90].map(x => 270 + x), LY = 600 - 140;
  function nextNight() {
    if (lit.some(v => !v)) { api.say({ en: 'Light all seven lamps first.', he: 'קודם הדליקו את כל שבעת הנרות.' }); return; }
    if (night >= 8) return;
    night++; api.sfx('step');
    if (night === 8) { api.setButtons([]); api.say({ en: 'Eight nights, and the little jug is still full!', he: 'שמונה לילות, והפך הקטן עדיין מלא!' }, 'good'); setTimeout(() => api.complete(), 1600); }
    else api.say({ en: `Night ${night}: the jug is still full!`, he: `לילה ${night}: הפך עדיין מלא!` }, 'good');
  }
  return {
    intro: { en: 'Light the seven lamps of the Menorah. Tap each one!', he: 'הדליקו את שבעת נרות המנורה. הקישו על כל אחד!' },
    buttons: [{ id: 'next', label: { en: 'Next night ➜', he: 'הלילה הבא ➜' }, cls: 'btn-green', onClick: nextNight }],
    update(dt) { yehuda.update(dt); kohen.update(dt); },
    down(p) { for (let i = 0; i < 7; i++) if (Kit.near(p, LX[i], LY, 26) && !lit[i]) { lit[i] = 1; api.sfx('tap'); return; } },
    hot() { const h = {}; for (let i = 0; i < 7; i++) h['lamp' + i] = [LX[i], LY]; return h; },
    draw(g, t) {
      CH.temple(g, t, { floor: 860, seed: 23, dim: 0.35 });
      G.menorah(g, 270, 600, 1, lit, t);
      for (let i = 0; i < 7; i++) if (!lit[i]) G.sparkle(g, LX[i] + 12, LY - 14, t + i * 300, 0.8);
      G.jar(g, 460, 760, 1, { material: 'clay', seal: 'kg' });
      G.rr(g, 500, 640, 18, 120, 9, '#fff', 2.5); G.rr(g, 503, 643, 12, 114, 6, G.lin(g, 0, 643, 0, 757, [[0, '#ffe08a'], [1, '#d9a520']]), 0);
      G.star(g, 509 + Math.sin(t / 200) * 3, 628, 8, '#fff6b0', true);
      G.rr(g, 30, 140, 236, 74, 14, 'rgba(255,250,240,0.94)', 2.5);
      for (let i = 0; i < 8; i++) { G.rr(g, 44 + i * 26, 184, 14, 18, 3, G.C.gold, 2, G.C.goldDark); if (i < night) G.flame(g, 51 + i * 26, 180, 0.55, t); }
      G.text(g, api.L({ en: `Night ${night}`, he: `לילה ${night}` }), 148, 160, { size: 15 });
      yehuda.draw(g, t); kohen.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-6', pack: 'ch', title: { en: 'Eight Nights', he: 'שמונה לילות' },
  stages: [CH.whatToDo, CH.nights],
  hints: [
    { en: 'According to the Rambam, tumah for the community is only pushed aside when there\'s no other way. So, first…', he: 'לפי הרמב"ם, טומאה דחויה בציבור רק במקום שאי אפשר. לכן קודם…' },
    { en: 'Tap each of the seven lamps, then press "Next night".', he: 'הקישו על כל אחד משבעת הנרות, ואז על "הלילה הבא".' },
  ],
  why: {
    text: {
      en: 'When the whole Jewish people [ציבור] is impure [טמא], the Avodah can still be done in impurity. But according to the Rambam, impurity is only **pushed aside** [דחויה] then, not truly permitted, so you must first **search** for a pure way.\n\nThat\'s why the Chashmona\'im searched for pure oil. And Hashem showed His love by making the one little jug last for eight days.',
      he: 'טומאה **דחויה** בציבור ואינה הותרה. לכן צריך לחזר תחילה אחר דרך טהורה, ורק במקום שאי אפשר דוחים.\n\nלכן בדקו החשמונאים אחר שמן טהור, והקב"ה הראה את חיבתו לישראל ועשה נס, והדליקו ממנו שמונה ימים.',
    },
    sources: [
      S('שֶׁהַטֻּמְאָה לֹא הֻתְּרָה בַּצִּבּוּר אֶלָּא בְּאִסּוּרָהּ עוֹמֶדֶת וּדְחוּיָה הִיא עַתָּה מִפְּנֵי הַדְּחָק. וְאֵין דּוֹחִין כָּל דָּבָר הַנִּדְחֶה אֶלָּא בְּמָקוֹם שֶׁאִי אֶפְשָׁר', 'Rambam, Hilchot Bi\'at HaMikdash 4:15', 'רמב"ם, הלכות ביאת המקדש ד, טו', 'Mishneh_Torah,_Admission_into_the_Sanctuary.4.15'),
      S('רב נחמן אמר: היתר היא בציבור... ורב ששת אמר: דחויה היא בציבור', 'Yoma 6b', 'יומא ו ע"ב', 'Yoma.6b'),
      S(null, 'Pnei Yehoshua on Shabbat 21b: the miracle showed Hashem\'s love', 'פני יהושע שבת כא ע"ב: הנס להראות חיבה', 'Penei_Yehoshua_on_Shabbat.21b'),
    ],
  },
});

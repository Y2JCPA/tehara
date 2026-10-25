/* 1-9 · Trees or No Trees?
   Three marked fields. With trees: a plowed grave (blowing or a strong donkey
   works). Bare: a lost grave (nothing works, it spreads by ohel). Marked on one
   edge only: that edge is impure and the field is pure (Rambam Tumat Met 8:11, 10:10). */
W1.treesOrNot = (hero = 'eli', purpose = 'pesach') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor(hero, 270, 890, { hold: purpose === 'pesach' ? 'blower' : null });
  const zev = new Chars.Actor('zevulun', 500, 890, { dir: -1 });
  const F = {
    L: { x: 22, y: 360, w: 152, h: 400, kind: 'trees' },
    M: { x: 194, y: 360, w: 152, h: 400, kind: 'bare' },
    R: { x: 366, y: 360, w: 152, h: 400, kind: 'oneEdge' },
  };
  let pick = null, going = false;
  const donkey = { x: 70, y: 905, on: false };
  function result(f, method) {
    if (f.kind === 'oneEdge') { const r = T.readMarks('oneEdge', { edge: 3 }); return { tahor: r.tamei.length === 0, src: r.src }; }
    const field = T.markedFieldKind(f.kind === 'trees').field;
    return T.crossField({ field, method, strong: true, purpose });
  }
  function choose(k) {
    pick = k; api.sfx('tap');
    api.setButtons([
      { id: 'blow', label: { en: '💨 Blow & walk', he: '💨 לנפח וללכת' }, onClick: () => cross('blow') },
      { id: 'ride', label: { en: '🐴 Strong donkey', he: '🐴 חמור חזק' }, onClick: () => cross('ride') },
      { id: 'walk', label: { en: '🚶 Just walk', he: '🚶 סתם ללכת' }, onClick: () => cross('walk') },
    ]);
  }
  function cross(method) {
    if (going || !pick) return; going = true; api.setButtons([]);
    const f = F[pick], r = result(f, method), mx = f.x + f.w / 2 + (pick === 'R' ? 14 : 0), midY = f.y + f.h / 2;
    if (method === 'ride') { donkey.on = true; eli.visible = false; }
    const after = () => {
      if (r.tahor) {
        const done = () => { eli.mood = 'happy'; api.complete(); };
        if (method === 'ride') tw.to(donkey, { y: 330 }, 1, done); else eli.walk([[mx, 320]], done);
        return;
      }
      eli.glow = 'tm'; eli.mood = 'oh';
      if (r.reason === 'ohel') api.fail({ en: 'No trees: a whole grave was lost in this field! It spreads tumah by roof [אהל], so blowing, stones and donkeys don\'t help.', he: 'אין אילנות: אבד בשדה הזה קבר שלם! הוא מטמא באוהל, ולכן ניפוח, אבנים וחמור אינם מועילים.' });
      else if (r.reason === 'notForTerumah') api.fail({ en: 'Blowing is only relied on for the Korban Pesach, not for things for the Mikdash.', he: 'על ניפוח סומכים רק לעושה פסח, לא לדברי המקדש.' });
      else api.fail({ en: 'Walking right on a Beit HaPeras [בית הפרס] without checking: the tiny bones count by touch!', he: 'הליכה בבית הפרס בלי בדיקה: עצם כשעורה מטמאה במגע!' });
    };
    if (method === 'ride') tw.to(donkey, { x: mx }, 0.5, () => tw.to(donkey, { y: midY + 40 }, 1, after));
    else eli.walk([[mx, 790], [mx, midY]], after);
  }
  return {
    intro: { en: 'Three marked fields. Which can a Kohen [כהן] cross, and how? Tap a field. (Grandpa Zevulun knows the area.)', he: 'שלושה שדות מצוינים. באיזה כהן יכול לעבור, ואיך? הקישו על שדה. (סבא זבולון מכיר את המקום.)' },
    update(dt) { tw.update(dt); eli.update(dt); zev.update(dt); },
    down(p) {
      if (going) return;
      for (const k of ['L', 'M', 'R']) { const f = F[k]; if (Kit.inRect(p, f.x, f.y, f.w, f.h)) { choose(k); return; } }
      if (Kit.near(p, zev.x, zev.y - 50, 50)) zev.talk(api.L({ en: 'When a field is marked, look for trees! And see which edges are painted.', he: 'כשיש שדה מצוינת, חפשו אילנות! וראו אילו מצרים צבועים.' }), 2800);
    },
    hot() { return { L: [F.L.x + 76, F.L.y + 200], M: [F.M.x + 76, F.M.y + 200], R: [F.R.x + 90, F.R.y + 200], zev: [zev.x, zev.y - 50] }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 71, y: 250 });
      G.platform(g, -10, 270, 560, 700, { seed: 72 });
      Kit.trail(g, [[0, 310], [540, 310]], 46);
      G.tag(g, api.L({ en: 'to Yerushalayim ➜', he: 'לירושלים ➜' }), 420, 310, { size: 14 });
      for (const k of ['L', 'M', 'R']) {
        const f = F[k];
        G.rr(g, f.x, f.y, f.w, f.h, 8, G.lin(g, 0, f.y, 0, f.y + f.h, [[0, '#d4b06e'], [1, '#b98f50']]), 2.5, G.C.dirtDark);
        Kit.furrows(g, f.x, f.y, f.w, f.h);
        if (f.kind === 'oneEdge') G.line(g, f.x - 6, f.y - 4, f.x - 6, f.y + f.h + 4, 9, G.C.lime);
        else G.rr(g, f.x - 6, f.y - 6, f.w + 12, f.h + 12, 10, null, 8, G.C.lime);
        if (f.kind === 'trees') { G.tree(g, f.x + 46, f.y + 150, 0.48, 'olive', 1); G.tree(g, f.x + 110, f.y + 260, 0.48, 'olive', 2); G.tree(g, f.x + 48, f.y + 370, 0.44, 'olive', 3); }
        if (pick === k) { const a = 0.6 + Math.sin(t / 200) * 0.3; G.rr(g, f.x - 12, f.y - 12, f.w + 24, f.h + 24, 14, null, 5, `rgba(247,200,68,${a})`); }
      }
      G.platform(g, -10, 800, 560, 180, { top: 'dirt', seed: 73 });
      if (donkey.on) { G.donkey(g, donkey.x, donkey.y, 0.6, { phase: t / 80 }); Chars.draw(g, hero, donkey.x, donkey.y - 26, { s: 0.75, t }); }
      zev.draw(g, t); eli.draw(g, t); zev.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-9', pack: 'w1', title: { en: 'Trees or No Trees?', he: 'יש אילנות או אין?' },
  stages: [W1.treesOrNot('eli', 'pesach')],
  hints: [{ en: 'Trees: a plowed grave, so blowing or a strong donkey works. No trees: a lost grave, nothing works. Only one edge painted: only that edge is impure.', he: 'אילנות: נחרש קבר, וניפוח או חמור חזק מועילים. אין אילנות: אבד קבר, ושום דבר לא מועיל. מצר אחד צבוע: רק הוא טמא.' }],
  why: {
    text: {
      en: 'A marked field you don\'t know about: if it **has trees**, a grave was plowed there [בית הפרס], since planting is allowed in such a field. If it has **no trees**, a **whole grave was lost** there, and it spreads tumah by touch, carrying **and roof** [אהל]. Nothing helps; a Kohen goes around. (The Rambam adds that this is relied on where an elder or Torah scholar is there, like Grandpa Zevulun.)\n\nA field marked on **only one edge**: that edge is impure [טמא] and the field is pure [טהור]. Eli could just walk across it!',
      he: 'מצא שדה מצוינת ואין יודע מה טיבה: **יש בה אילן**, בידוע שנחרש קבר בתוכה. **אין בה אילן**, בידוע שאבד קבר בתוכה, והיא מטמאה במגע ובמשא **ובאוהל**, ואין עצה; הכהן מקיף. (והרמב"ם מוסיף: והוא שיהיה שם זקן או תלמיד חכם, כמו סבא זבולון.)\n\nשדה ש**מצר אחד** שלה מצוין: המצר טמא וכל השדה טהורה. אלי יכול פשוט ללכת בה!',
    },
    sources: [
      S('מָצָא שָׂדֶה מְצֻיֶּנֶת וְאֵין יוֹדֵעַ מַה טִּיבָהּ. אִם יֵשׁ בָּהּ אִילָן בְּיָדוּעַ שֶׁנֶּחְרַשׁ קֶבֶר בְּתוֹכָהּ. אֵין בָּהּ אִילָן בְּיָדוּעַ שֶׁאָבַד קֶבֶר בְּתוֹכָהּ... וְהוּא שֶׁיִּהְיֶה בְּאוֹתוֹ מָקוֹם זָקֵן אוֹ תַּלְמִיד חָכָם', 'Rambam, Hilchot Tumat Met 10:10', 'רמב"ם, הלכות טומאת מת י, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.10.10'),
      S('מָצָא מֵצָר אֶחָד מְצֻיָּן. הוּא טָמֵא וְכָל הַשָּׂדֶה טְהוֹרָה', 'Rambam, Hilchot Tumat Met 8:11', 'רמב"ם, הלכות טומאת מת ח, יא', 'Mishneh_Torah,_Defilement_by_a_Corpse.8.11'),
      S('וּמְטַמֵּא בְמַגָּע וּבְמַשָּׂא וּבְאֹהֶל', 'Mishnah Oholot 18:3', 'משנה אהלות יח, ג', 'Mishnah_Oholot.18.3'),
    ],
  },
});

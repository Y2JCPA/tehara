/* 1-2 · The Barn
   Room 1: a dead mouse (sheretz) on a beam, a dead fox (nevelah) in a covered
   bridge, and a burial cave. Only a met spreads tumah under a roof, so the
   covered bridge is safe; touching the mouse is allowed for a Kohen.
   Room 2: two pools (rainwater vs drawn water), then wait for three stars. */
W1.barn = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 60, 568);
  const pStick = new Kit.Pin('stick', 190, 470, 300, 470);
  const pDoor = new Kit.Pin('door', 200, 330, 200, 420);
  const stick = { x: 284, y: 470, a: 0 };
  const mouse = { x: 270, y: 560, a: 0, on: true };
  const door = { open: 0 };
  const routes = new Kit.Routes([
    { id: 'beam', box: [150, 520, 240, 70], glow: [[60, 568], [400, 568], [470, 568]] },
    { id: 'bridge', box: [150, 300, 240, 130], glow: [[60, 568], [100, 440], [180, 420], [370, 420], [440, 568]] },
  ]);
  let going = false;
  api.needBonus(); api.state.eli = 'tahor';

  function arrive() { if (api.state.eli === 'tahor') api.bonus(); api.complete(); }
  function goNow() {
    if (going) return;
    if (!routes.sel) { api.say({ en: 'Tap a way to the barn first: the low beam or the covered bridge.', he: 'הקישו קודם על דרך לאורווה: הקורה הנמוכה או הגשר המקורה.' }); return; }
    if (routes.sel === 'bridge' && door.open < 1) { eli.talk(api.L({ en: 'The door is locked!', he: 'הדלת נעולה!' })); return; }
    going = true; api.setButtons([]);
    if (routes.sel === 'bridge') {
      eli.walk([[100, 440], [180, 420], [262, 420]], () => {
        const r = T.passOver('nevelah');
        if (!r.result) api.say({ en: 'Eli is under one roof with a dead fox, but that\'s fine! Only a dead person [מת] spreads tumah under a roof [אהל]. A dead animal [נבלה] only makes you impure if you touch it or carry it.', he: 'אלי תחת גג אחד עם שועל מת, וזה בסדר! רק מת מטמא באוהל. נבלה מטמאה רק במגע ובמשא.' }, 'good', 5200);
        eli.walk([[370, 420], [440, 568], [470, 568]], arrive);
      });
      return;
    }
    if (!mouse.on) { eli.walk([[150, 568], [400, 568], [470, 568]], arrive); return; }
    eli.walk([[150, 568], [256, 568]], () => {
      const r = T.personTouches('sheretz'), k = T.kohenMay('sheretz');
      api.state.eli = r.status; eli.glow = 1; eli.badge = 1; eli.mood = 'oh';
      api.say({ en: 'Eli touched the dead mouse, a sheretz [שרץ]. Now he\'s impure [טמא] until evening. That\'s allowed for a Kohen!', he: 'אלי נגע בעכבר המת, שרץ. עכשיו הוא טמא עד הערב, וזה מותר לכהן!' }, k.ok ? 'info' : 'warn', 4200);
      setTimeout(() => { eli.mood = 'idle'; eli.walk([[400, 568], [470, 568]], arrive); }, 1400);
    });
  }
  return {
    intro: { en: 'Eli needs the donkey from the barn. Which way should he go?', he: 'אלי צריך את החמור מהאורווה. באיזו דרך ללכת?' },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pStick.update(dt); pDoor.update(dt); eli.update(dt); },
    down(p) {
      if (going) return;
      if (pStick.hit(p)) {
        pStick.pull(() => tw.to(stick, { y: 520, a: 0.5 }, 0.3, () => {
          api.sfx('thunk');
          if (T.personMovesWithStick('sheretz').status === 'tahor') mouse.on = false;
          tw.to(mouse, { x: 300, y: 900, a: 3 }, 0.6); tw.to(stick, { x: 330, y: 900, a: 1.5 }, 0.7);
        }));
        return;
      }
      if (pDoor.hit(p)) { pDoor.pull(() => tw.to(door, { open: 1 }, 0.4)); return; }
      if (Kit.inRect(p, 0, 150, 150, 150)) { eli.mood = 'no'; eli.talk(api.L({ en: 'A burial cave? Not for a Kohen!', he: 'מערת קבורה? לא לכהן!' })); setTimeout(() => { eli.mood = 'idle'; }, 1600); return; }
      routes.hit(p);
    },
    hot() { return { stick: pStick.ring, door: pDoor.ring, cave: [70, 230], ...routes.hot() }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 5, y: 300 });
      G.cave(g, 6, 160, 140, 130, { closed: true });
      G.platform(g, -10, 568, 160, 400, { seed: 11 });
      G.platform(g, 390, 568, 160, 400, { seed: 12 });
      G.chasm(g, 150, 568, 240, 400);
      G.platform(g, -10, 290, 160, 30, { face: 'rock', seed: 13 });
      // covered bridge high up, with stairs at each end
      G.stairs(g, 150, 420, 5, { stepW: 14, stepH: 29, dir: -1, thick: 16 });
      G.stairs(g, 390, 420, 5, { stepW: 12, stepH: 29, dir: 1, thick: 16 });
      G.rr(g, 150, 410, 240, 18, 3, G.lin(g, 0, 410, 0, 428, [[0, G.C.woodLight], [1, G.C.wood]]), 2.5, G.C.woodDark);
      G.rr(g, 150, 330, 240, 82, 4, 'rgba(60,40,20,0.55)', 0);
      G.poly(g, [[140, 334], [400, 334], [380, 304], [160, 304]], G.lin(g, 0, 304, 0, 334, [[0, '#c56a3e'], [1, '#8f4424']]), 2.5, '#5e2a14');
      for (const px of [154, 386]) G.rr(g, px - 5, 330, 10, 82, 2, G.C.wood, 2, G.C.woodDark);
      G.rr(g, 290, 384, 70, 8, 2, G.C.woodLight, 2, G.C.woodDark); G.deadFox(g, 326, 376, 0.62);
      g.save(); g.translate(158, 330); g.scale(1 - door.open * 0.85, 1); G.rr(g, 0, 0, 14, 82, 3, G.lin(g, 0, 0, 14, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark); g.restore();
      // barn
      G.house(g, 420, 430, 112, 138, { door: false });
      G.rr(g, 448, 500, 56, 68, 4, '#2c2016', 2.5, G.C.woodDark); G.donkey(g, 476, 560, 0.42, { dir: -1 });
      // beam with the mouse, and the hanging stick
      G.plank(g, 270, 576, 250, 0, 16);
      if (mouse.y < 950) { g.save(); g.translate(mouse.x, mouse.y); g.rotate(mouse.a); G.deadMouse(g, 0, 0, 0.9); g.restore(); }
      g.save(); g.translate(stick.x, stick.y); g.rotate(stick.a); G.rr(g, -6, 0, 12, 80, 6, G.lin(g, -6, 0, 6, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark); g.restore();
      routes.draw(g, t);
      pStick.draw(g); pDoor.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

W1.dinner = api => {
  const T = api.T, tw = new Kit.Tweens();
  const st = { status: api.state.eli || 'tahor', immersed: false };
  const eli = new Chars.Actor('eli', 300, 700);
  if (st.status !== 'tahor') { eli.glow = 1; eli.badge = 1; }
  const miriam = new Chars.Actor('miriam', 492, 700, { dir: -1 });
  const pools = { rain: { x: 40, w: 140, drawn: false }, bucket: { x: 190, w: 130, drawn: true } };
  let v = 0, dragging = false, busy = false, calledEarly = false;
  const track = { x1: 90, x2: 450, y: 862 };
  const stars = () => v >= 0.98 ? 3 : v >= 0.9 ? 2 : v >= 0.82 ? 1 : 0;

  function dip(key) {
    if (busy || st.status === 'tahor' || st.immersed) return;
    busy = true; const P = pools[key];
    eli.walk([[P.x + P.w / 2, 700], [P.x + P.w / 2, 752]], () => {
      api.sfx('splash');
      if (!T.mikveh({ drawn: P.drawn }).valid) {
        api.mistake({ en: 'That pool was filled with buckets. Drawn water [מים שאובים] doesn\'t make a kosher mikveh (a Rabbinic rule). Use the pool the rain fills by itself.', he: 'הבריכה הזאת מולאה בדליים. מים שאובים פסולים לטבילה מדברי סופרים. טבלו בבריכה שהגשם ממלא מעצמו.' });
        eli.walk([[P.x + P.w / 2, 700], [300, 700]], () => { busy = false; });
        return;
      }
      st.immersed = true; eli.glow = null; eli.badge = '✓';
      api.say({ en: 'Eli dipped in the mikveh [טבילה]. Now he waits for evening.', he: 'אלי טבל במקווה. עכשיו הוא מחכה לערב.' });
      eli.walk([[P.x + P.w / 2, 700], [300, 700]], () => { busy = false; });
    });
  }
  function eat() {
    if (busy) return;
    const r = T.canEatTerumah({ status: st.status, immersed: st.immersed, starsOut: stars() >= 3 });
    if (r.ok) { busy = true; eli.mood = 'happy'; eli.walk([[392, 700]], () => { api.say({ en: 'Eli is pure [טהור]. He may eat terumah [תרומה]!', he: 'אלי טהור, ומותר לו לאכול תרומה!' }, 'good'); setTimeout(() => api.complete(), 900); }); return; }
    if (r.need === 'mikveh') api.mistake({ en: 'Not yet! First Eli must dip in a kosher mikveh [מקווה].', he: 'עוד לא! קודם אלי צריך לטבול במקווה כשר.' });
    else api.mistake({ en: 'Not yet! It\'s getting dark, but a Kohen waits until three medium stars [שלושה כוכבים] come out before eating terumah.', he: 'עוד לא! מחשיך, אבל הכהן מחכה לצאת שלושה כוכבים בינוניים לפני שאוכל תרומה.' });
  }
  return {
    intro: st.status === 'tahor'
      ? { en: 'Eli stayed pure! Tap the terumah [תרומה] for dinner.', he: 'אלי נשאר טהור! הקישו על התרומה לארוחת הערב.' }
      : { en: 'Dinner is terumah [תרומה]. What does Eli need to do first?', he: 'לארוחת הערב יש תרומה. מה אלי צריך לעשות קודם?' },
    update(dt) { tw.update(dt); eli.update(dt); miriam.update(dt); },
    down(p) {
      const hx = Kit.lerp(track.x1, track.x2, v);
      if (Kit.near(p, hx, track.y, 40)) { dragging = true; return; }
      for (const k of ['rain', 'bucket']) { const P = pools[k]; if (Kit.inRect(p, P.x, 690, P.w, 90)) { dip(k); return; } }
      if (Kit.inRect(p, 350, 630, 130, 70)) eat();
    },
    move(p) {
      if (!dragging) return;
      v = Math.max(0, Math.min(1, (p.x - track.x1) / (track.x2 - track.x1)));
      if (stars() === 2 && !calledEarly) { calledEarly = true; miriam.talk(api.L({ en: 'Eli! Dinner\'s ready! It\'s dark already!', he: 'אלי! ארוחת ערב! כבר חושך!' }), 2600); }
      if (stars() >= 3) api.say({ en: 'Three stars are out!', he: 'יצאו שלושה כוכבים!' }, 'good', 1500);
    },
    up() { dragging = false; },
    hot() { return { rain: [110, 730], bucket: [255, 730], plate: [414, 660], dial: [Kit.lerp(track.x1, track.x2, v), track.y], dialEnd: [track.x2, track.y] }; },
    draw(g, t) {
      G.sky(g, 'day', t);
      if (v > 0.3) { g.globalAlpha = Math.min(1, (v - 0.3) / 0.35); G.sky(g, 'sunset', t); g.globalAlpha = 1; }
      if (v > 0.65) { g.globalAlpha = Math.min(1, (v - 0.65) / 0.3); G.sky(g, 'night', t, stars()); g.globalAlpha = 1; }
      G.distance(g, t, { seed: 3, y: 420, night: v > 0.7 });
      G.platform(g, -10, 708, 560, 300, { seed: 21 });
      // the mikveh house: two pools, a rain gutter feeding one, buckets feeding the other
      G.stoneWall(g, 20, 470, 320, 238, { block: 30, seed: 11 });
      G.poly(g, [[10, 474], [350, 474], [330, 440], [30, 440]], G.lin(g, 0, 440, 0, 474, [[0, '#d8c39a'], [1, '#a8925f']]), 2.5, G.C.mortar);
      G.tag(g, api.L({ en: 'Mikveh', he: 'מקווה' }), 180, 500, { size: 15 });
      for (const k of ['rain', 'bucket']) {
        const P = pools[k];
        G.rr(g, P.x, 690, P.w, 90, 8, G.lin(g, 0, 690, 0, 780, [[0, G.C.waterLight], [1, G.C.waterDark]]), 3, k === 'bucket' ? '#9aa7b3' : G.C.mortar);
        if (k === 'bucket') { G.rr(g, P.x - 4, 684, P.w + 8, 10, 4, '#e9eef2', 2, '#9aa7b3'); for (let i = 0; i < 3; i++) G.circ(g, P.x + 20 + i * 45, 688, 3, G.C.gold, 0); }
      }
      // gutter from the roof down into the rain pool
      G.line(g, 30, 450, 30, 560, 8, '#7a6a52'); G.line(g, 30, 560, 100, 640, 8, '#7a6a52'); G.line(g, 30, 450, 30, 560, 4, '#a89a82'); G.line(g, 30, 560, 100, 640, 4, '#a89a82');
      // a servant with buckets at the fancy pool
      Chars.draw(g, 'helper', 250, 660, { s: 0.7, hold: 'bucket', t });
      // table with terumah
      G.rr(g, 350, 676, 130, 14, 4, G.C.woodLight, 2.5, G.C.woodDark); G.line(g, 366, 690, 366, 708, 4, G.C.woodDark); G.line(g, 464, 690, 464, 708, 4, G.C.woodDark);
      G.ell(g, 414, 670, 38, 9, '#fff', 2.5, '#999'); G.ell(g, 414, 670, 32, 6, null, 2, G.C.gold);
      G.loaf(g, 414, 663, 0.75);
      if (stars() >= 2) G.sparkle(g, 440, 640, t);
      G.tag(g, api.L({ en: 'Terumah', he: 'תרומה' }), 414, 618, { size: 13 });
      miriam.draw(g, t); eli.draw(g, t); eli.drawBubble(g); miriam.drawBubble(g);
      // time-of-day slider
      G.rr(g, 40, 812, 460, 100, 20, 'rgba(255,250,240,0.94)', 2.5);
      G.rr(g, track.x1, track.y - 6, track.x2 - track.x1, 12, 6, G.lin(g, track.x1, 0, track.x2, 0, [[0, '#ffd66b'], [0.6, '#f08a5d'], [1, '#2f3f80']]), 2);
      G.text(g, '☀', track.x1 - 26, track.y, { size: 22, color: '#f5a623' }); G.text(g, '★', track.x2 + 26, track.y, { size: 22, color: '#5b6fc4' });
      const hx = Kit.lerp(track.x1, track.x2, v);
      G.circ(g, hx, track.y, 19, G.rad(g, hx - 5, track.y - 5, 2, 20, [[0, '#fff'], [1, v > 0.65 ? '#cdd6ff' : '#ffcf3f']]), 2.5);
      G.text(g, api.L({ en: 'Drag to make it evening', he: 'גררו כדי שיגיע הערב' }), 270, 834, { size: 14 });
    },
  };
};

WORLD1.push({
  id: '1-2', pack: 'w1', title: { en: 'The Barn', he: 'האורווה' },
  stages: [W1.barn, W1.dinner],
  hints: [
    { en: 'Does a dead animal spread tumah under a roof, like a dead person does? And can you get the mouse off the beam without touching it?', he: 'האם נבלה מטמאה באוהל כמו מת? ואפשר להעיף את העכבר מהקורה בלי לגעת בו?' },
    { en: 'A mikveh must be gathered rainwater, not water poured in with buckets. Then wait for THREE stars.', he: 'מקווה צריך להיות מי גשמים שנקוו מעצמם, לא מים שנשפכו בדליים. ואז לחכות לשלושה כוכבים.' },
  ],
  why: {
    text: {
      en: 'A dead mouse is a sheretz [שרץ]: touching it makes you impure [טמא] until evening. A dead fox is a nevelah [נבלה]: touching or carrying it makes you impure. A Kohen **may** become impure from these. The Torah only forbids him tumah from a dead person [מת].\n\nAnd only a met spreads tumah under a roof [אהל]. So the covered bridge with the fox inside was safe! Knocking the mouse off with a stick was safe too, because a sheretz doesn\'t make you impure by moving it.\n\nA mikveh is water gathered by itself, like rain; drawn water [שאובים] is invalid (a Rabbinic rule). After dipping, a Kohen waits for three stars before eating terumah [תרומה].',
      he: 'עכבר מת הוא שרץ: הנוגע בו טמא עד הערב. שועל מת הוא נבלה: מטמאה במגע ובמשא. לכהן **מותר** להיטמא בהם; התורה אסרה עליו רק טומאת מת.\n\nורק מת מטמא באוהל. לכן הגשר המקורה עם השועל היה בטוח! גם הפלת העכבר במקל הייתה בטוחה, כי שרץ אינו מטמא במשא.\n\nמקווה הוא מים שנקוו מעצמם, כמו גשם; מים שאובים פסולים מדברי סופרים. אחרי הטבילה הכהן מחכה לשלושה כוכבים ואז אוכל תרומה.',
    },
    sources: [
      S('טֻמְאַת אֹהֶל אֵינָהּ בִּשְׁאָר טֻמְאוֹת אֶלָּא בְּמֵת בִּלְבַד', 'Rambam, Hilchot Tumat Met 1:10', 'רמב"ם, הלכות טומאת מת א, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.10'),
      S('הַשֶּׁרֶץ... מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע... וְאֵינוֹ מְטַמֵּא בְּמַשָּׂא', 'Rambam, Hilchot She\'ar Avot HaTumot 4:2', 'רמב"ם, הלכות שאר אבות הטומאות ד, ב', 'Mishneh_Torah,_Other_Sources_of_Defilement.4.2'),
      S('הַנְּבֵלָה אָב מֵאֲבוֹת הַטֻּמְאוֹת... מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע... וּמְטַמֵּא אֶת הָאָדָם בְּמַשָּׂא', 'Rambam, Hilchot She\'ar Avot HaTumot 1:1', 'רמב"ם, הלכות שאר אבות הטומאות א, א', 'Mishneh_Torah,_Other_Sources_of_Defilement.1.1'),
      S('וְשֶׁאַף כֹּהֲנִים וּנְזִירִים מֻתָּרִין לְהִתְטַמֵּא בִּשְׁאָר טֻמְאוֹת חוּץ מִטְּמֵא מֵת', 'Rambam, Hilchot Tumat Okhalin 16:9', 'רמב"ם, הלכות טומאת אוכלין טז, ט', 'Mishneh_Torah,_Defilement_of_Foods.16.9'),
      S('מִדִּבְרֵי סוֹפְרִים שֶׁהַמַּיִם הַשְּׁאוּבִין פְּסוּלִין לִטְבִילָה', 'Rambam, Hilchot Mikvaot 4:2', 'רמב"ם, הלכות מקוואות ד, ב', 'Mishneh_Torah,_Immersion_Pools.4.2'),
      S('אֵין הַטְּמֵאִים אוֹכְלִין בִּתְרוּמָה עַד שֶׁיַּעֲרִיב שִׁמְשָׁן וְיֵצְאוּ שְׁלֹשָׁה כּוֹכָבִים בֵּינוֹנִיִּים', 'Rambam, Hilchot Terumot 7:2', 'רמב"ם, הלכות תרומות ז, ב', 'Mishneh_Torah,_Heave_Offerings.7.2'),
    ],
  },
});

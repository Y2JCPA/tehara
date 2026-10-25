/* 1-6 · The Leaf-Blower Field ⭐
   Room 1: three pins, one right order, for a soft landing.
   Room 2: blow on the ground before each step (Berakhot 19b; Rambam Eruvin 6:17;
   Korban Pesach 6:8). Some white things are harmless twigs, some are bones.
   Air is tight: blow only where you mean to walk. */
W1.cartDrop = api => {
  const tw = new Kit.Tweens();
  const pCart = new Kit.Pin('cart', 104, 400, 312, 400);
  const pCrate = new Kit.Pin('crate', 300, 560, 300, 660);
  const pHay = new Kit.Pin('hay', 480, 470, 480, 560);
  const cart = { y: 380, a: 0 }, hay = { x: 430, y: 560, lost: false }, crate = { x: 320, y: 640, gone: false };
  const eli = new Chars.Actor('eli', 470, 800, { dir: -1 }), gad = new Chars.Actor('gad', 70, 800);
  let cushion = false, done = false;
  return {
    intro: { en: 'Gad\'s leaf blower is up in his cart. Make a soft landing before it drops!', he: 'המפוח של גד בעגלה למעלה. הכינו נחיתה רכה לפני שהיא נופלת!' },
    update(dt) { tw.update(dt); pCart.update(dt); pCrate.update(dt); pHay.update(dt); eli.update(dt); gad.update(dt); },
    down(p) {
      if (pCrate.hit(p)) { pCrate.pull(() => tw.to(crate, { x: 380, y: 920 }, 0.5, () => { crate.gone = true; api.sfx('thunk'); })); return; }
      if (pHay.hit(p)) {
        pHay.pull(() => {
          if (!crate.gone) { tw.to(hay, { x: 360, y: 600 }, 0.4, () => { hay.lost = true; api.sfx('thunk'); api.say({ en: 'The hay got stuck behind the crate and spilled over the side…', he: 'החציר נתקע מאחורי הארגז ונשפך הצידה…' }); tw.to(hay, { x: 520, y: 1000 }, 0.8); }); return; }
          tw.to(hay, { x: 210, y: 800 }, 0.7, () => { cushion = true; api.sfx('thunk'); });
        });
        return;
      }
      if (pCart.hit(p)) pCart.pull(() => tw.to(cart, { y: cushion ? 752 : 784 }, 0.45, () => {
        if (!cushion) { cart.a = 0.3; api.fail({ en: 'Crash! The cart hit the hard floor. Get the hay underneath it first, but the crate is in the way!', he: 'בום! העגלה נחבטה ברצפה. קודם הביאו את החציר מתחתיה, אבל הארגז חוסם!' }); return; }
        api.sfx('thunk'); if (done) return; done = true;
        gad.walk([[150, 800]], () => {
          gad.hold = 'blower'; gad.mood = 'happy';
          gad.talk(api.L({ en: 'Here, Eli. Check the ground yourself: that\'s how the Sages said to do it!', he: 'קח, אלי. תבדוק את הקרקע בעצמך, כך אמרו חכמים!' }), 3200);
          setTimeout(() => { gad.hold = null; eli.hold = 'blower'; eli.mood = 'happy'; }, 1800);
          setTimeout(() => api.complete(), 3300);
        });
      }));
    },
    hot() { return { cart: pCart.ring, crate: pCrate.ring, hay: pHay.ring }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 31 });
      G.platform(g, -10, 808, 560, 160, { seed: 32 });
      G.stoneWall(g, 112, 230, 22, 578, { block: 22, seed: 2 }); G.stoneWall(g, 300, 230, 22, 340, { block: 22, seed: 3 });
      G.poly(g, [[322, 560], [520, 500], [520, 526], [322, 586]], G.lin(g, 0, 500, 0, 586, [[0, G.C.rockLight], [1, G.C.rockDark]]), 2.5, G.C.rockDark);
      if (!crate.gone || crate.y < 900) G.crate(g, crate.x - 22, crate.y - 60, 44, 44);
      if (hay.y < 990) G.hay(g, hay.x, hay.y, 0.75);
      g.save(); g.translate(218, cart.y); g.rotate(cart.a); G.cart(g, 0, 0, 0.8); G.blower(g, -6, -38, 0.8, -0.3); g.restore();
      pCart.draw(g); pCrate.draw(g); pHay.draw(g);
      gad.draw(g, t); eli.draw(g, t); gad.drawBubble(g);
    },
  };
};

W1.FIELD = {
  cols: 6, rows: 9, size: 64, x0: 78, y0: 196, air: 10,
  bones: ['8,1', '8,4', '7,2', '6,0', '6,4', '5,2', '4,1', '4,5', '3,3', '2,0', '2,4', '1,2', '0,1', '0,4', '5,5', '3,0'],
  twigs: ['8,3', '6,3', '4,3', '2,2', '7,5', '1,3'],
  big: ['5,4', '2,1'],
};
W1.blowerField = api => {
  const T = api.T, F = W1.FIELD;
  const eli = new Chars.Actor('eli', 270, 880, { hold: 'blower' });
  const key = (r, c) => r + ',' + c;
  const revealed = new Set(F.big);
  const bones = new Set(F.bones), twigs = new Set(F.twigs), big = new Set(F.big);
  let mode = 'blow', air = F.air, path = [], going = false, gust = null;
  const cx = c => F.x0 + c * F.size + F.size / 2, cy = r => F.y0 + r * F.size + F.size / 2;
  const isBone = k => bones.has(k) || big.has(k);
  const cell = p => { const c = Math.floor((p.x - F.x0) / F.size), r = Math.floor((p.y - F.y0) / F.size); return (r >= 0 && r < F.rows && c >= 0 && c < F.cols) ? [r, c] : null; };
  function frontier(r, c) {
    if (r === F.rows - 1) return true;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const k = key(r + dr, c + dc); if (revealed.has(k) && !big.has(k)) return true; }
    return false;
  }
  function blow(r, c) {
    if (air <= 0) { api.say({ en: 'Out of air! Press ↻ to start again, and blow only where you mean to walk.', he: 'נגמר האוויר! לחצו ↻ והתחילו שוב, ונשפו רק איפה שתלכו.' }); return; }
    if (!frontier(r, c)) { api.say({ en: 'Blow a little at a time, starting next to Eli.', he: 'נשפו מעט מעט, החל מליד אלי.' }); return; }
    air--; api.sfx('blow'); gust = { r, c, t: 0.5 };
    for (const dc of [-1, 0, 1]) if (c + dc >= 0 && c + dc < F.cols) revealed.add(key(r, c + dc));
  }
  function addPath(r, c) {
    const k = key(r, c);
    if (path.length && path[path.length - 1] === k) { path.pop(); return; }
    if (path.includes(k)) return;
    if (revealed.has(k) && isBone(k)) { api.say({ en: 'That\'s a bone! Go around it.', he: 'זו עצם! עקפו אותה.' }); return; }
    if (!path.length) { if (r !== F.rows - 1) { api.say({ en: 'Start the path from the bottom row, next to Eli.', he: 'התחילו את השביל מהשורה התחתונה, ליד אלי.' }); return; } path.push(k); return; }
    const [lr, lc] = path[path.length - 1].split(',').map(Number);
    if (Math.abs(lr - r) + Math.abs(lc - c) === 1) path.push(k);
  }
  const buttons = () => [
    { id: 'blow', label: { en: `💨 Blow (${air})`, he: `💨 נשיפה (${air})` }, cls: 'btn-navy', on: mode === 'blow', onClick: () => { mode = 'blow'; api.setButtons(buttons()); } },
    { id: 'path', label: { en: '✏️ Path', he: '✏️ שביל' }, cls: 'btn-navy', on: mode === 'path', onClick: () => { mode = 'path'; api.setButtons(buttons()); } },
    Kit.go(walk),
  ];
  function walk() {
    if (going) return;
    const last = path[path.length - 1];
    if (!last || Number(last.split(',')[0]) !== 0) { api.say({ en: 'Draw a path all the way to the top.', he: 'ציירו שביל עד למעלה.' }); return; }
    going = true; api.setButtons([]);
    const seq = path.slice();
    const step = () => {
      const k = seq.shift();
      if (!k) { eli.walk([[eli.x, 170]], () => { eli.mood = 'happy'; api.complete(); }); return; }
      const [r, c] = k.split(',').map(Number);
      eli.walk([[cx(c), cy(r) + 20]], () => {
        if (!revealed.has(k)) {
          eli.mood = 'oh'; if (bones.has(k)) { revealed.add(k); eli.glow = 'tm'; }
          api.fail({ en: 'You didn\'t check that square! The Sages said: blow on the ground before each step.', he: 'לא בדקתם את המשבצת הזאת! חכמים אמרו: מנפח את הקרקע לפני כל צעד.' });
          return;
        }
        if (!T.crossField({ field: 'plowed', method: 'blow', purpose: 'pesach' }).tahor) { api.fail('?'); return; }
        step();
      });
    };
    step();
  }
  return {
    intro: { en: 'Eli is going to bring the Korban Pesach [קרבן פסח]. Blow on the dirt to find the tiny bones. Careful: not everything white is a bone!', he: 'אלי בדרך להקריב קרבן פסח. נשפו על העפר כדי למצוא עצמות קטנות. זהירות: לא כל דבר לבן הוא עצם!' },
    buttons: buttons(),
    update(dt) { eli.update(dt); if (gust) { gust.t -= dt; if (gust.t <= 0) gust = null; } },
    down(p) {
      if (going) return;
      const rc = cell(p); if (!rc) return;
      if (mode === 'blow') { blow(rc[0], rc[1]); api.setButtons(buttons()); } else addPath(rc[0], rc[1]);
    },
    hot() { const h = {}; for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) h['t' + r + '_' + c] = [cx(c), cy(r)]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 41, y: 160 });
      G.platform(g, -10, 120, 560, 76, { seed: 42 });
      G.sign(g, 270, 186, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 290, size: 13, post: false });
      G.platform(g, -10, 776, 560, 200, { seed: 43 });
      G.rr(g, F.x0 - 8, F.y0 - 6, F.cols * F.size + 16, F.rows * F.size + 12, 8, '#8a5e33', 2.5, G.C.dirtDark);
      for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) {
        const k = key(r, c), x = F.x0 + c * F.size, y = F.y0 + r * F.size;
        const rev = revealed.has(k);
        G.rr(g, x + 2, y + 2, F.size - 4, F.size - 4, 7, rev ? G.lin(g, 0, y, 0, y + F.size, [[0, '#ecd3a2'], [1, '#d7b783']]) : G.lin(g, 0, y, 0, y + F.size, [[0, '#a8794a'], [1, '#8a5e33']]), 2, '#6e4a24');
        G.rrPath(g, x + 2, y + 2, F.size - 4, F.size - 4, 7); G.texFill(g, 'dirt');
        if (!rev) { const r2 = G.rng(r * 9 + c); for (let i = 0; i < 5; i++) G.ell(g, x + 10 + r2() * 44, y + 10 + r2() * 44, 3 + r2() * 4, 2.5 + r2() * 3, '#7a5530', 0); }
        if (rev && bones.has(k)) G.bone(g, x + F.size / 2, y + F.size / 2, 0.62, 0.5, true, t);
        if (rev && twigs.has(k)) G.twig(g, x + F.size / 2, y + F.size / 2, 0.85, -0.4);
        if (big.has(k)) G.bone(g, x + F.size / 2, y + F.size / 2, 1.05, -0.3, true, t);
      }
      if (path.length) {
        G.path(g, path.map(k => { const [r, c] = k.split(',').map(Number); return [cx(c), cy(r)]; }));
        g.lineWidth = 10; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
        g.lineWidth = 4; g.strokeStyle = G.C.gold; g.stroke();
      }
      if (gust) { const gx = cx(gust.c), gy = cy(gust.r); for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(gx, gy, 20 + i * 14 + (0.5 - gust.t) * 40, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = `rgba(255,255,255,${gust.t * 1.6})`; g.stroke(); } }
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-6', pack: 'w1', title: { en: 'The Leaf-Blower Field', he: 'שדה המפוח' },
  stages: [W1.cartDrop, W1.blowerField],
  hints: [
    { en: 'The hay has to land under the cart, but the crate is blocking the chute. Crate, then hay, then cart.', he: 'החציר צריך לנחות מתחת לעגלה, אבל הארגז חוסם. ארגז, חציר, עגלה.' },
    { en: 'Blow a square to see it and its neighbours. Bones have round knobs at both ends; twigs don\'t, and you can step on them. You have just enough air: plan a path up the middle.', he: 'נשיפה מגלה משבצת ושכנותיה. לעצמות יש פקעות עגולות בשני הקצוות; לזרדים אין, ומותר לדרוך עליהם. יש בדיוק מספיק אוויר: תכננו שביל באמצע.' },
  ],
  why: {
    text: {
      en: 'In a Beit HaPeras [בית הפרס], a bone the size of a barley grain only makes you impure [טמא] if you **touch it or move it**. It doesn\'t spread under a roof [אהל]. And the whole Beit HaPeras rule is from the Sages [מדרבנן].\n\nSo the Sages said: **blow on the ground in front of you as you walk**. Any tiny bone shows up, and you step around it. Even a Kohen [כהן] may do this, and someone on his way to the Korban Pesach [קרבן פסח] may then bring it.\n\nBut this check isn\'t relied on for terumah [תרומה].',
      he: 'בבית הפרס, עצם כשעורה מטמאה רק **במגע ובמשא**, ולא באוהל, וכל דין בית הפרס מדרבנן.\n\nלכן אמרו חכמים: **מנפח אדם בית הפרס והולך**. אם יש עצם קטנה היא מתגלה, והוא עוקף אותה. גם כהן רשאי לעשות כך, ומי שהולך לעשות פסח שוחט ואוכל את פסחו.\n\nאבל לתרומה אין סומכים על בדיקה זו.',
    },
    sources: [
      S('מְנַפֵּחַ אָדָם בֵּית הַפְּרָס וְהוֹלֵךְ', 'Berakhot 19b', 'ברכות יט ע"ב', 'Berakhot.19b.5'),
      S('נְתָנוֹ בְּבֵית הַפְּרָס הֲרֵי זֶה עֵרוּב וַאֲפִלּוּ הָיָה כֹּהֵן... אוֹ שֶׁיְּנַפֵּחַ וְהוֹלֵךְ', 'Rambam, Hilchot Eruvin 6:17', 'רמב"ם, הלכות עירובין ו, יז', 'Mishneh_Torah,_Eruvin.6.17'),
      S('מִי שֶׁבָּא בְּבֵית הַפְּרָס הֲרֵי זֶה מְנַפֵּחַ וְהוֹלֵךְ... שׁוֹחֵט וְאוֹכֵל פִּסְחוֹ', 'Rambam, Hilchot Korban Pesach 6:8', 'רמב"ם, הלכות קרבן פסח ו, ח', 'Mishneh_Torah,_Paschal_Offering.6.8'),
      S('בּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה', 'Mishnah Oholot 18:4', 'משנה אהלות יח, ד', 'Mishnah_Oholot.18.4'),
    ],
  },
});

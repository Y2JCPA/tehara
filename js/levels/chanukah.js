/* ============================================
   TEHARA: Chanukah pack, The Sealed Jug
   Hero: Yehuda, a young Kohen in the days of the Chashmona'im.
   Design: docs/LEVELS.md, Part B
   ============================================ */
const CH = {};

// Inside the Mikdash: Jerusalem-stone walls and a floor
CH.temple = (g, t, { floor = 860, seed = 5 } = {}) => {
  G.sky(g, 'indoor', t);
  G.stoneWall(g, 0, 0, 540, floor, { block: 44, seed });
  G.rr(g, -4, floor, 548, 110, 0, '#cdbb92', 3);
  for (let x = 0; x < 540; x += 60) G.line(g, x, floor + 2, x - 20, 960, 2, 'rgba(120,90,50,0.3)');
};

// A generic "choose what to do" room: options are DOM buttons.
// opt.result() returns { ok, msg } ; ok → complete, otherwise fail (or mistake if opt.soft)
CH.choice = ({ intro, draw, options, actors = [] }) => api => {
  let done = false;
  const pick = o => {
    if (done) return;
    const r = o.result(api);
    if (r.ok) { done = true; api.setButtons([]); if (r.msg) api.say(r.msg, 'good'); setTimeout(() => api.complete(), r.delay || 1000); return; }
    if (o.soft) api.mistake(r.msg); else { done = true; api.setButtons([]); api.fail(r.msg); }
  };
  const acts = actors.map(a => new Chars.Actor(a.kind, a.x, a.y, a.opts || {}));
  return {
    intro,
    buttons: options.map(o => ({ id: o.id, label: o.label, cls: o.cls || 'btn-gold', onClick: () => pick(o) })),
    update(dt) { for (const a of acts) a.update(dt); },
    draw(g, t) { draw(g, t, api); for (const a of acts) { a.draw(g, t); a.drawBubble(g); } },
    hot() { return {}; },
  };
};

// ---------------------------------------------------------------
// C-1 · The Stones of the Altar (Mishnah Middot 1:6)
// ---------------------------------------------------------------
CH.altarStones = api => {
  const tw = new Kit.Tweens();
  const p1 = new Kit.Pin('shelf', 262, 236, 262, 330);
  const p2 = new Kit.Pin('flap', 470, 470, 350, 500);
  const p3 = new Kit.Pin('door', 236, 640, 236, 712);
  const stones = [0, 1, 2].map(i => ({ x: 80 + i * 56, y: 306, a: 0, done: false }));
  const flap = { a: 0, on: true }, door = { open: 0 };
  const yehuda = new Chars.Actor('yehuda', 290, 860, { dir: -1 }), elder = new Chars.Actor('kohen', 350, 860, { dir: -1 });
  let released = false;

  function release() {
    released = true;
    const toAltar = flap.on, doorOpen = !p3.pulling && p3.out;
    stones.forEach((s, i) => {
      const legs = [[262, 306], [330, 505]];
      if (toAltar) legs.push([420, 690], [470 - i * 10, 820 - i * 4]);
      else { legs.push([330, 600], [222, 770]); if (doorOpen) legs.push([90 + i * 30, 810]); }
      let k = 0;
      const next = () => {
        const L = legs[k++];
        if (!L) {
          s.done = true;
          if (i < stones.length - 1) return;
          if (toAltar) { api.fail({ en: 'Those stones were defiled by the Greek kings [שקצום מלכי יון]. They can\'t go into the new Mizbeach [מזבח]!', he: 'את האבנים האלה שיקצו מלכי יוון. אי אפשר להשתמש בהן במזבח החדש!' }); return; }
          if (!doorOpen) { api.fail({ en: 'The chamber door is closed! Open it before the stones roll down.', he: 'דלת הלשכה סגורה! פתחו אותה לפני שהאבנים מתגלגלות.' }); return; }
          tw.to(door, { open: 0 }, 0.4, () => { yehuda.mood = 'happy'; api.say({ en: 'The old stones are stored away. Now we can build a new Mizbeach!', he: 'האבנים הישנות גנוזות. עכשיו אפשר לבנות מזבח חדש!' }, 'good'); setTimeout(() => api.complete(), 1200); });
          return;
        }
        tw.to(s, { x: L[0], y: L[1], a: s.a + 2 }, 0.35, next);
      };
      setTimeout(next, i * 380);
    });
  }
  return {
    intro: { en: 'The Greek kings defiled the stones of the Mizbeach [מזבח]. Roll them into the chamber of the Beit HaMoked [בית המוקד], not onto the new altar\'s spot!', he: 'מלכי יוון שיקצו את אבני המזבח. גלגלו אותן ללשכה שבבית המוקד, ולא למקום המזבח החדש!' },
    update(dt) { tw.update(dt); p1.update(dt); p2.update(dt); p3.update(dt); yehuda.update(dt); elder.update(dt); },
    down(p) {
      if (p2.hit(p)) { p2.pull(() => { flap.on = false; tw.to(flap, { a: 1.4 }, 0.4); }); return; }
      if (p3.hit(p)) { p3.pull(() => tw.to(door, { open: 1 }, 0.4)); return; }
      if (p1.hit(p)) p1.pull(() => release());
    },
    hot() { return { shelf: p1.ring, flap: p2.ring, door: p3.ring }; },
    draw(g, t) {
      CH.temple(g, t, { floor: 860, seed: 7 });
      // shelf and ramps
      G.rr(g, 40, 330, 222, 18, 3, G.C.woodLight, 3);
      G.line(g, 262, 340, 336, 520, 14, G.C.ink); G.line(g, 262, 340, 336, 520, 9, G.C.woodLight);
      G.line(g, 336, 540, 470, 836, 14, G.C.ink); G.line(g, 336, 540, 470, 836, 9, G.C.woodLight);      // to the altar site
      G.line(g, 330, 610, 220, 790, 14, G.C.ink); G.line(g, 330, 610, 220, 790, 9, G.C.woodLight);      // to the chamber
      // flap at the junction
      if (flap.a < 1.4) { g.save(); g.translate(336, 520); g.rotate(-0.5 + flap.a); G.rr(g, -6, 0, 12, 90, 3, G.C.wood, 3); g.restore(); }
      // chamber
      G.rr(g, 30, 690, 200, 170, 6, '#4a3a28', 3);
      G.text(g, api.L({ en: 'Chamber', he: 'לשכה' }), 120, 712, { size: 15, color: '#fff' });
      g.save(); g.translate(222, 700); g.scale(1 - door.open * 0.85, 1); G.rr(g, 0, 0, 14, 160, 3, G.C.woodDark, 3); g.restore();
      // new altar site
      g.setLineDash([10, 8]); G.rr(g, 400, 800, 130, 60, 4, 'rgba(255,255,255,0.35)', 3, '#c0392b'); g.setLineDash([]);
      G.text(g, api.L({ en: 'New Mizbeach', he: 'מזבח חדש' }), 465, 784, { size: 14, color: '#fff', outline: 4, outlineColor: G.C.ink });
      for (const s of stones) { g.save(); g.translate(s.x, s.y); g.rotate(s.a); G.rr(g, -22, -22, 44, 44, 6, '#a7a39b', 3); G.line(g, -12, -14, 4, 2, 2.5); G.line(g, 4, 2, 0, 16, 2.5); g.restore(); }
      p1.draw(g); p2.draw(g); p3.draw(g);
      elder.draw(g, t); yehuda.draw(g, t);
    },
  };
};

// ---------------------------------------------------------------
// C-2 · They Searched (Shabbat 21b)
// ---------------------------------------------------------------
CH.search = api => {
  const T = api.T, tw = new Kit.Tweens();
  const rooms = [{ y: 150, h: 230 }, { y: 400, h: 230 }, { y: 650, h: 230 }];
  const hA = new Kit.Pin('hatchA', 500, 392, 420, 392), hB = new Kit.Pin('hatchB', 500, 642, 420, 642);
  const open = [true, false, false];
  const jugs = [
    { id: 'j1', room: 0, x: 120, y: 360, look: { material: 'clay' }, smashed: true, props: { sealed: false } },
    { id: 'j2', room: 0, x: 260, y: 360, look: { material: 'clay' }, props: { sealed: false } },
    { id: 'j3', room: 1, x: 120, y: 610, look: { material: 'clay', seal: 'broken' }, props: { sealed: true, intact: false } },
    { id: 'j4', room: 1, x: 290, y: 610, look: { material: 'clay', seal: 'kg' }, drag: true, props: { sealed: true, intact: true, moved: true } },
    { id: 'j5', room: 2, x: 150, y: 860, look: { material: 'clay' }, props: { sealed: false } },
    { id: 'j6', room: 2, x: 400, y: 860, look: { material: 'clay', seal: 'kg' }, hidden: 3, props: { sealed: true, intact: true, moved: false } },
  ];
  const yehuda = new Chars.Actor('yehuda', 420, 370, { dir: -1, hold: 'lamp' });
  let light = { x: 270, y: 260 }, sel = null, done = false;
  const REASON = {
    noSeal: { en: 'No seal at all, so we can\'t know that nobody touched it. The Greeks made all the oil they touched impure [טמא].', he: 'אין חותם, ואי אפשר לדעת שלא נגעו בו. היוונים טימאו את כל השמנים שנגעו בהם.' },
    broken: { en: 'The seal is broken: someone opened this jug.', he: 'החותם שבור: מישהו פתח את הפך.' },
    moved: { en: 'See the drag marks in the dust? A soldier moved this jug. The Sages ruled that even moving it made it impure [טמא].', he: 'רואים את סימני הגרירה באבק? חייל הזיז את הפך הזה, וחכמים גזרו שגם הזזה מטמאה.' },
  };
  const DESC = {
    j1: { en: 'A smashed jug.', he: 'פך שבור.' },
    j2: { en: 'An open jug with no seal.', he: 'פך פתוח, בלי חותם.' },
    j3: { en: 'The Kohen Gadol\'s seal, but cracked open.', he: 'חותם של כהן גדול, אבל שבור.' },
    j4: { en: 'The Kohen Gadol\'s seal, whole. But there are drag marks in the dust…', he: 'חותם של כהן גדול, שלם. אבל יש סימני גרירה באבק…' },
    j5: { en: 'An open jug with no seal.', he: 'פך פתוח, בלי חותם.' },
    j6: { en: 'Hidden behind the stones: the Kohen Gadol\'s seal, whole, and the dust around it untouched!', he: 'מוסתר מאחורי האבנים: חותם של כהן גדול, שלם, והאבק סביבו לא נגוע!' },
  };
  function inspect(j) {
    sel = j; api.sfx('tap');
    api.say(DESC[j.id], 'info', 4000);
    api.setButtons([
      { id: 'bring', label: { en: 'Bring this jug', he: 'הביאו את הפך הזה' }, cls: 'btn-green', onClick: () => choose(j) },
      { id: 'keep', label: { en: 'Keep looking', he: 'להמשיך לחפש' }, cls: 'btn-navy', onClick: () => { sel = null; api.setButtons([]); } },
    ]);
  }
  function choose(j) {
    if (done) return;
    const r = T.jugIsPure(j.props);
    if (!r.pure) { done = true; api.setButtons([]); api.fail(REASON[r.reason]); return; }
    done = true; api.setButtons([]);
    api.say({ en: 'Pure oil [שמן טהור]! But only enough for one day…', he: 'שמן טהור! אבל רק ליום אחד…' }, 'good');
    tw.to(j, { y: j.y - 40 }, 0.6, () => setTimeout(() => api.complete(), 900));
  }
  return {
    intro: { en: 'The Greeks made the oil impure [טמא]. Search the storerooms for a jug that is still pure! Tap to shine your lamp.', he: 'היוונים טימאו את השמנים. חפשו במחסנים פך שעדיין טהור! הקישו כדי להאיר.' },
    update(dt) { tw.update(dt); hA.update(dt); hB.update(dt); yehuda.update(dt); },
    down(p) {
      if (done) return;
      if (hA.hit(p)) { hA.pull(() => { open[1] = true; api.sfx('thunk'); }); return; }
      if (hB.hit(p) && open[1]) { hB.pull(() => { open[2] = true; api.sfx('thunk'); }); return; }
      const ri = rooms.findIndex(r => p.y >= r.y && p.y <= r.y + r.h);
      if (ri < 0 || !open[ri]) return;
      light = { x: p.x, y: p.y };
      for (const j of jugs) {
        if (j.room !== ri) continue;
        if (j.hidden && Kit.near(p, j.x, j.y - 30, 60)) { j.hidden--; api.sfx('thunk'); if (!j.hidden) api.say({ en: 'There\'s a hidden niche behind the stones!', he: 'יש גומחה נסתרת מאחורי האבנים!' }); return; }
        if (!j.hidden && Kit.near(p, j.x, j.y - 26, 40)) { inspect(j); return; }
      }
    },
    hot() { const h = { hatchA: hA.ring, hatchB: hB.ring }; for (const j of jugs) h[j.id] = [j.x, j.y - 26]; return h; },
    draw(g, t) {
      CH.temple(g, t, { floor: 900, seed: 13 });
      G.text(g, api.L({ en: 'Storerooms under the Heichal', he: 'מחסנים תחת ההיכל' }), 270, 130, { size: 17, color: '#fff', outline: 5, outlineColor: G.C.ink });
      rooms.forEach((r, i) => {
        G.rr(g, 24, r.y, 492, r.h, 8, '#6b5236', 3);
        G.rr(g, 24, r.y + r.h - 12, 492, 12, 0, '#5a4630', 0);
        if (i < 2) { G.rr(g, 410, r.y + r.h - 4, 100, 12, 3, (i === 0 ? hA : hB).out ? '#2a2018' : G.C.woodDark, 2.5); }
      });
      for (const j of jugs) {
        if (!open[j.room]) continue;
        if (j.drag) for (let k = 0; k < 4; k++) G.line(g, j.x + 40 + k * 18, j.y + 2 + (k % 2) * 4, j.x + 52 + k * 18, j.y + 2 + (k % 2) * 4, 3, 'rgba(240,220,180,0.7)');
        if (j.smashed) { G.poly(g, [[j.x - 26, j.y], [j.x - 10, j.y - 26], [j.x, j.y]], G.C.clay, 3); G.poly(g, [[j.x + 4, j.y], [j.x + 18, j.y - 18], [j.x + 28, j.y]], G.C.clay, 3); }
        else G.jar(g, j.x, j.y, 0.9, j.look);
        if (j.hidden) for (let k = 0; k < j.hidden; k++) G.rr(g, j.x - 46 + k * 30, j.y - 64 + (k % 2) * 20, 40, 64, 6, '#b8a682', 3);
        if (sel === j) G.circ(g, j.x, j.y - 24, 44, null, 4, G.C.gold);
      }
      // darkness, with the lamp's light
      g.save();
      g.beginPath(); g.rect(0, 0, 540, 960);
      for (let i = 0; i < 3; i++) if (open[i]) { const r = rooms[i]; g.rect(24, r.y, 492, r.h); }
      g.fillStyle = 'rgba(10,8,20,0.82)'; g.fill('evenodd'); g.restore();
      const grd = g.createRadialGradient(light.x, light.y, 30, light.x, light.y, 260);
      grd.addColorStop(0, 'rgba(255,220,140,0)'); grd.addColorStop(1, 'rgba(20,12,4,0.55)');
      g.fillStyle = grd; g.fillRect(0, 140, 540, 760);
      hA.draw(g); if (open[1]) hB.draw(g);
      yehuda.draw(g, t);
    },
  };
};

// ---------------------------------------------------------------
// C-3 · Sealed Tight (Bamidbar 19:15; Mishnah Kelim 10:1)
// ---------------------------------------------------------------
CH.ITEMS = [
  { label: { en: 'Open clay jar of oil', he: 'כד חרס פתוח עם שמן' }, look: { material: 'clay' }, vessel: { material: 'clay', sealed: false }, item: 'oil' },
  { label: { en: 'Clay jar, cloth tied loosely', he: 'כד חרס, בד קשור ברפיון' }, look: { material: 'clay', loose: true }, vessel: { material: 'clay', sealed: false }, item: 'oil' },
  { label: { en: 'Clay jar sealed tight, with oil', he: 'כד חרס מוקף צמיד פתיל, עם שמן' }, look: { material: 'clay', sealed: true }, vessel: { material: 'clay', sealed: true }, item: 'oil' },
  { label: { en: 'Clay jar sealed tight, with a metal ladle inside', he: 'כד חרס מוקף צמיד פתיל, ובתוכו מצקת מתכת' }, look: { material: 'clay', sealed: true }, vessel: { material: 'clay', sealed: true }, item: 'metal', ladle: true },
  { label: { en: 'Stone jar sealed tight, with a metal ladle inside', he: 'כד אבן מוקף צמיד פתיל, ובתוכו מצקת מתכת' }, look: { material: 'stone', sealed: true }, vessel: { material: 'stone', sealed: true }, item: 'metal', ladle: true },
  { label: { en: 'Metal flask of oil, sealed', he: 'בקבוק מתכת סגור עם שמן' }, look: { material: 'metal', sealed: true, flask: true }, vessel: { material: 'metal', sealed: true }, item: 'oil' },
  { label: { en: 'Empty stone cup', he: 'כוס אבן ריקה' }, cup: true, vessel: null, item: 'stone' },
];
CH.sealed = api => {
  const T = api.T;
  const items = CH.ITEMS.map((it, i) => ({ ...it, i, home: [48 + i * 74, 470], x: 48 + i * 74, y: 470, place: null }));
  const zones = { take: { x: 16, y: 560, w: 250, h: 300 }, leave: { x: 274, y: 560, w: 250, h: 300 } };
  const yehuda = new Chars.Actor('yehuda', 470, 360, { dir: -1 }), helper = new Chars.Actor('helper', 240, 360);
  let drag = null, off = [0, 0];
  const usable = it => it.cup ? T.vesselInOhel({ material: 'stone' }).tahor : T.itemInOhel({ item: it.item, vessel: it.vessel }).tahor;
  const WHY = it => {
    if (it.cup) return { en: 'A stone [אבן] cup can never become impure!', he: 'כלי אבנים אינו מקבל טומאה לעולם!' };
    if (it.vessel.material === 'metal') return { en: 'A metal [מתכת] vessel doesn\'t protect what\'s inside, even when it\'s sealed.', he: 'כלי מתכת אינו מציל על מה שבתוכו, אפילו כשהוא סגור.' };
    if (!it.vessel.sealed) return { en: 'In a cave with a grave, an open or loosely covered clay jar lets the impurity in. Only a tight seal [צמיד פתיל] protects.', he: 'במערה שיש בה קבר, כלי חרס פתוח או מכוסה ברפיון נטמא. רק צמיד פתיל מציל.' };
    if (it.vessel.material === 'stone') return { en: 'A sealed stone jar protects everything inside it, even a metal ladle!', he: 'כלי אבנים מוקף צמיד פתיל מציל על הכול, אפילו על מצקת מתכת!' };
    if (it.item === 'metal') return { en: 'A sealed clay jar only protects food, drinks and clay. The metal ladle inside isn\'t protected.', he: 'כלי חרס מוקף צמיד פתיל מציל רק על אוכלים, משקים וכלי חרס. מצקת המתכת שבתוכו אינה ניצלת.' };
    return { en: 'A clay jar sealed tight keeps the oil inside pure.', he: 'כלי חרס המוקף צמיד פתיל מציל על השמן שבתוכו.' };
  };
  function layout() {
    for (const z of ['take', 'leave']) {
      const inZ = items.filter(it => it.place === z);
      inZ.forEach((it, k) => { it.x = zones[z].x + 50 + (k % 3) * 75; it.y = zones[z].y + 120 + Math.floor(k / 3) * 120; });
    }
    for (const it of items) if (!it.place) { it.x = it.home[0]; it.y = it.home[1]; }
  }
  function check() {
    if (items.some(it => !it.place)) { api.say({ en: 'Sort every item first.', he: 'קודם מיינו את כל הכלים.' }); return; }
    for (const it of items) {
      const want = usable(it) ? 'take' : 'leave';
      if (it.place !== want) { api.mistake(WHY(it)); return; }
    }
    api.setButtons([]); api.say({ en: 'All sorted correctly!', he: 'הכול ממוין נכון!' }, 'good');
    setTimeout(() => api.complete(), 900);
  }
  return {
    intro: { en: 'A family hid their things in an old burial cave. Which ones are still pure [טהור]? Drag each one to a shelf.', he: 'משפחה הסתירה חפצים במערת קבורה ישנה. אילו מהם עדיין טהורים? גררו כל אחד למדף.' },
    buttons: [{ id: 'check', label: { en: 'Check', he: 'בדיקה' }, cls: 'btn-green', onClick: check }],
    update(dt) { yehuda.update(dt); helper.update(dt); },
    down(p) { for (const it of items.slice().reverse()) if (Kit.near(p, it.x, it.y - 24, 36)) { drag = it; off = [p.x - it.x, p.y - it.y]; api.say(it.label, 'info', 2200); return; } },
    move(p) { if (drag) { drag.x = p.x - off[0]; drag.y = p.y - off[1]; } },
    up(p) {
      if (!drag) return;
      const z = Object.keys(zones).find(k => Kit.inRect(p, zones[k].x, zones[k].y, zones[k].w, zones[k].h));
      drag.place = z || null; drag = null; api.sfx('tap'); layout();
    },
    hot() { const h = { take: [140, 700], leave: [400, 700] }; for (const it of items) h['i' + it.i] = [it.x, it.y - 24]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 91 });
      G.ground(g, 0, 380, 540, 600, 'grass');
      G.cave(g, 30, 200, 180, 170, { closed: false });
      G.sign(g, 120, 168, api.L({ en: 'Burial cave', he: 'מערת קבורה' }), { w: 120, size: 13, post: false });
      G.rr(g, 10, 470, 520, 16, 4, G.C.woodLight, 3);
      for (const z of ['take', 'leave']) {
        const Z = zones[z];
        G.rr(g, Z.x, Z.y, Z.w, Z.h, 16, z === 'take' ? 'rgba(63,191,106,0.25)' : 'rgba(120,110,100,0.25)', 3);
        G.text(g, api.L(z === 'take' ? { en: 'To the Mikdash ✓', he: 'למקדש ✓' } : { en: 'Leave here ✗', he: 'להשאיר ✗' }), Z.x + Z.w / 2, Z.y + 28, { size: 18 });
      }
      for (const it of items) {
        if (it.cup) G.cup(g, it.x, it.y, 1, 'stone'); else G.jar(g, it.x, it.y, 0.8, it.look);
        if (it.ladle) { G.circ(g, it.x + 20, it.y - 52, 13, '#fff', 2.5); G.ladle(g, it.x + 20, it.y - 48, 0.3); }
      }
      helper.draw(g, t); yehuda.draw(g, t);
    },
  };
};

// ---------------------------------------------------------------
// C-4 · Oil Is a Liquid (Rambam She'ar Avot HaTumot 7:5, 8)
// ---------------------------------------------------------------
CH.press = api => {
  const T = api.T, tw = new Kit.Tweens();
  const p0 = new Kit.Pin('press', 330, 300, 280, 300);
  const g1 = new Kit.Pin('gate', 360, 452, 290, 452);
  const worker = new Chars.Actor('helper', 330, 860, { dir: -1 });
  worker.badge = 2;
  const yehuda = new Chars.Actor('yehuda', 470, 860, { dir: -1 });
  const left = [[270, 330], [270, 440], [150, 560], [150, 700], [250, 790]];
  const right = [[270, 330], [270, 440], [390, 560], [390, 700], [290, 790]];
  const LOAF = [150, 600];
  let route = 'left', flow = null, washed = false, busy = false;

  function poly(pts, k) { // point at fraction k along a polyline, and the visited part
    const segs = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
    let want = k * tot; const out = [pts[0]];
    for (let i = 0; i < segs.length; i++) {
      if (want <= segs[i]) { const f = want / segs[i]; out.push([Kit.lerp(pts[i][0], pts[i + 1][0], f), Kit.lerp(pts[i][1], pts[i + 1][1], f)]); return out; }
      want -= segs[i]; out.push(pts[i + 1]);
    }
    return out;
  }
  function wash() {
    if (busy || washed) return; busy = true;
    worker.walk([[460, 860]], () => {
      api.sfx('splash'); washed = T.hands(true).level === 'tahor'; worker.badge = null;
      api.say({ en: 'Netilat yadayim [נטילת ידיים]: now his hands are pure.', he: 'נטילת ידיים: עכשיו ידיו טהורות.' }, 'good');
      worker.walk([[330, 860]], () => { busy = false; });
    });
  }
  function start() {
    flow = { k: 0, pts: route === 'left' ? left : right, level: 'tahor', stop: route === 'left' ? 0.42 : 1 };
  }
  return {
    intro: { en: 'Pure oil for the Menorah! Get it into the jar without touching anything impure [טמא]. Remember: oil is a liquid [משקה].', he: 'שמן טהור למנורה! הביאו אותו לכד בלי שייגע בשום דבר טמא. זכרו: שמן הוא משקה.' },
    update(dt) {
      tw.update(dt); p0.update(dt); g1.update(dt); worker.update(dt); yehuda.update(dt);
      if (flow && flow.k < flow.stop) {
        flow.k = Math.min(flow.stop, flow.k + dt * 0.35);
        if (flow.k >= flow.stop) {
          if (route === 'left') {
            flow.level = T.liquidTouches(2).level;
            api.fail({ en: 'The oil touched a loaf that is a "second" [שני]. Liquids always become a "first" [ראשון], even from a second!', he: 'השמן נגע בכיכר שהיא שני. משקין נעשים ראשון תמיד, אפילו משני!' });
          } else if (!washed) {
            flow.level = T.liquidTouches(T.hands(false).level).level;
            api.fail({ en: 'His hands touched the oil before he washed them. Unwashed hands are a "second" [שני], and the oil becomes a "first"!', he: 'ידיו נגעו בשמן לפני נטילה. ידיים סתם הן שניות, והשמן נעשה ראשון!' });
          } else {
            api.say({ en: 'The oil is in the jar, still pure!', he: 'השמן בכד, והוא טהור!' }, 'good');
            setTimeout(() => api.complete(), 1100);
          }
        }
      }
    },
    down(p) {
      if (p0.hit(p)) { p0.pull(() => start()); return; }
      if (g1.hit(p)) { g1.pull(() => { route = 'right'; api.sfx('thunk'); }); return; }
      if (Kit.near(p, 470, 800, 50)) wash();
    },
    hot() { return { press: p0.ring, gate: g1.ring, wash: [470, 800] }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 101 });
      G.ground(g, 0, 868, 540, 100, 'grass');
      G.stoneWall(g, 0, 300, 540, 568, { block: 40, seed: 17 });
      // press basin
      G.rr(g, 180, 200, 180, 100, 14, '#9c8b6e', 3); G.rr(g, 196, 214, 148, 60, 10, '#c9a227', 0);
      G.line(g, 150, 190, 400, 170, 16, G.C.ink); G.line(g, 150, 190, 400, 170, 10, G.C.wood);
      G.text(g, api.L({ en: 'Olive press', he: 'בית הבד' }), 270, 150, { size: 17, color: '#fff', outline: 5, outlineColor: G.C.ink });
      // channels
      for (const pts of [left, right]) { G.path(g, pts); g.lineWidth = 22; g.strokeStyle = G.C.ink; g.lineJoin = 'round'; g.stroke(); g.lineWidth = 15; g.strokeStyle = '#8a7a5c'; g.stroke(); }
      // gate at the junction
      g.save(); g.translate(270, 440); g.rotate(route === 'left' ? 0.75 : -0.75); G.rr(g, -5, 0, 10, 60, 3, G.C.wood, 3); g.restore();
      // the loaf in the left channel
      G.loaf(g, LOAF[0], LOAF[1], 0.8); G.badge(g, LOAF[0] + 26, LOAF[1] - 26, 2);
      // flowing oil
      if (flow) { const pts = poly(flow.pts, flow.k); G.path(g, pts); g.lineWidth = 10; g.strokeStyle = '#f2c94c'; g.lineCap = 'round'; g.stroke(); if (flow.level === 1) { const e = pts[pts.length - 1]; G.tumahGlow(g, e[0], e[1], 50, 1, t); G.badge(g, e[0] + 20, e[1] - 20, 1); } }
      G.jar(g, 270, 840, 1.1, { material: 'clay' });
      // washing station
      G.rr(g, 440, 800, 60, 30, 8, '#9aa7b3', 3); G.cup(g, 470, 790, 0.6, 'stone');
      G.text(g, api.L({ en: 'Wash', he: 'נטילה' }), 470, 760, { size: 14, color: '#fff', outline: 4, outlineColor: G.C.ink });
      p0.draw(g); g1.draw(g);
      yehuda.draw(g, t); worker.draw(g, t);
    },
  };
};

// ---------------------------------------------------------------
// C-5 · Pure Oil Run: a review of World 1
// ---------------------------------------------------------------
CH.runHaperas = CH.choice({
  intro: { en: 'Day 3. A Beit HaPeras [בית הפרס] blocks the road. How should Yehuda carry the oil for the Mikdash across?', he: 'יום ג. בית הפרס חוסם את הדרך. איך יעביר יהודה את השמן למקדש?' },
  actors: [{ kind: 'yehuda', x: 230, y: 880 }, { kind: 'helper', x: 300, y: 880 }],
  draw(g, t, api) {
    Kit.outdoor(g, t, { seed: 111 });
    G.ground(g, 0, 250, 540, 720, 'grass');
    G.rr(g, 40, 300, 460, 480, 0, '#b88d58', 3); Kit.furrows(g, 40, 300, 460, 480);
    for (const [x, y] of [[150, 720], [240, 620], [170, 500], [250, 390]]) G.stoneTile(g, x, y, 30);
    G.donkey(g, 420, 880, 0.7);
    G.sign(g, 270, 290, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 300, size: 14, post: false });
  },
  options: [
    { id: 'blow', label: { en: '💨 Blow & walk', he: '💨 לנפח וללכת' }, result: api => { const r = api.T.crossField({ field: 'plowed', method: 'blow', purpose: 'mikdash' }); return { ok: r.tahor, msg: { en: 'Blowing is only relied on for going to bring the Korban Pesach, not for terumah [תרומה] or things for the Mikdash. Cross without touching the dirt!', he: 'על ניפוח סומכים רק לעושה פסח, לא לתרומה ולא לדברי המקדש. עברו בלי לגעת בעפר!' } }; } },
    { id: 'stones', label: { en: '🪨 Solid stones', he: '🪨 אבנים יציבות' }, result: api => ({ ok: api.T.crossField({ field: 'plowed', method: 'stones', solid: true }).tahor, msg: { en: 'Across on solid stones: still pure!', he: 'עברו על אבנים יציבות: טהורים!' } }) },
    { id: 'ride', label: { en: '🫏 Strong donkey', he: '🫏 חמור חזק' }, result: api => ({ ok: api.T.crossField({ field: 'plowed', method: 'ride', strong: true }).tahor, msg: { en: 'Across on a strong donkey: still pure!', he: 'עברו על חמור חזק: טהורים!' } }) },
  ],
});
CH.runField = CH.choice({
  intro: { en: 'Day 4. A marked field with no trees is in the way. Cross it, or take the long road?', he: 'יום ד. שדה מצוינת בלי אילנות בדרך. לחצות או ללכת בדרך הארוכה?' },
  actors: [{ kind: 'yehuda', x: 270, y: 880 }],
  draw(g, t, api) {
    Kit.outdoor(g, t, { seed: 121 });
    G.ground(g, 0, 250, 540, 720, 'grass');
    G.rr(g, 120, 330, 300, 430, 10, '#c9a368', 3); Kit.furrows(g, 120, 330, 300, 430); G.rr(g, 115, 325, 310, 440, 12, null, 8, G.C.lime);
    Kit.trail(g, [[270, 860], [40, 760], [40, 320], [270, 280]], 30);
  },
  options: [
    { id: 'cross', label: { en: 'Cross the field', he: 'לחצות את השדה' }, result: api => { const k = api.T.markedFieldKind(false).field; const r = api.T.crossField({ field: k, method: 'blow', purpose: 'mikdash' }); return { ok: r.tahor, msg: { en: 'No trees: a whole grave was lost here, and it spreads tumah by roof [אהל]. Go around!', he: 'אין אילנות: אבד כאן קבר שלם, והוא מטמא באוהל. הקיפו!' } }; } },
    { id: 'around', label: { en: 'Take the long road', he: 'בדרך הארוכה' }, result: () => ({ ok: true, msg: { en: 'The long road is safe.', he: 'הדרך הארוכה בטוחה.' } }) },
  ],
});
CH.runArrive = CH.choice({
  intro: { en: 'Day 8. The new oil reached the Mikdash! Which jar goes to the Menorah?', he: 'יום ח. השמן החדש הגיע למקדש! איזה כד הולך למנורה?' },
  actors: [{ kind: 'kohen', x: 400, y: 860, opts: { dir: -1 } }, { kind: 'yehuda', x: 160, y: 860 }],
  draw(g, t, api) {
    CH.temple(g, t, { floor: 860 });
    G.menorah(g, 270, 520, 1, [1, 1, 1, 1, 1, 1, 1]);
    G.jar(g, 230, 760, 1, { material: 'clay', sealed: true });
    G.jar(g, 320, 760, 1, { material: 'clay', loose: true });
    G.text(g, api.L({ en: 'sealed', he: 'סגור' }), 230, 790, { size: 14, color: '#fff', outline: 4, outlineColor: G.C.ink });
    G.text(g, api.L({ en: 'cloth on top', he: 'בד מלמעלה' }), 320, 790, { size: 14, color: '#fff', outline: 4, outlineColor: G.C.ink });
  },
  options: [
    { id: 'sealed', label: { en: 'The sealed jar', he: 'הכד הסגור' }, result: () => ({ ok: true, msg: { en: 'Sealed all the way, guarded all the way: pure oil for the Menorah!', he: 'סגור ושמור לאורך כל הדרך: שמן טהור למנורה!' } }) },
    { id: 'cloth', soft: true, label: { en: 'The jar with cloth on top', he: 'הכד עם הבד' }, result: () => ({ ok: false, msg: { en: 'A loose cloth isn\'t a seal. Bring the jar that was sealed tight [צמיד פתיל] the whole way.', he: 'בד רפוי אינו חותם. הביאו את הכד שהיה מוקף צמיד פתיל כל הדרך.' } }) },
  ],
});

// ---------------------------------------------------------------
// C-6 · Eight Nights (Rambam Bi'at HaMikdash 4:15; Chanukah 3:2)
// ---------------------------------------------------------------
CH.whatToDo = CH.choice({
  intro: { en: 'All the oil the Greeks touched is impure [טמא]. The whole people is impure too. What should we do?', he: 'כל השמן שנגעו בו היוונים טמא, וגם כל העם טמא. מה נעשה?' },
  actors: [{ kind: 'kohen', x: 380, y: 860, opts: { dir: -1 } }, { kind: 'yehuda', x: 180, y: 860 }],
  draw(g, t) {
    CH.temple(g, t, { floor: 860, seed: 19 });
    G.menorah(g, 270, 600, 1.1, []);
    for (const x of [50, 95, 455, 500]) G.jar(g, x, 850, 0.8, { material: 'clay', seal: 'broken' });
  },
  options: [
    { id: 'impure', soft: true, label: { en: 'Use the impure oil', he: 'להשתמש בשמן הטמא' }, result: api => { const r = api.T.communityTumah(); return { ok: !r.mustSearchFirst, msg: { en: 'Not so fast! For the whole community, tumah is only pushed aside [דחויה] when there is no choice. First we must search for a pure way.', he: 'לא כל כך מהר! טומאה דחויה בציבור רק במקום שאי אפשר. קודם צריך לחפש דרך טהורה.' } }; } },
    { id: 'search', label: { en: 'Search for pure oil first', he: 'קודם לחפש שמן טהור' }, result: () => ({ ok: true, msg: { en: 'They searched, and found the one sealed jug!', he: 'בדקו, ומצאו את הפך האחד החתום!' } }) },
  ],
});
CH.nights = api => {
  const lit = [0, 0, 0, 0, 0, 0, 0];
  let night = 1, going = false;
  const yehuda = new Chars.Actor('yehuda', 120, 860), kohen = new Chars.Actor('kohen', 430, 860, { dir: -1 });
  const LX = [-90, -60, -30, 0, 30, 60, 90].map(x => 270 + x), LY = 600 - 140;
  function nextNight() {
    if (lit.some(v => !v)) { api.say({ en: 'Light all seven lamps first.', he: 'קודם הדליקו את כל שבעת הנרות.' }); return; }
    if (night >= 8) return;
    night++; api.sfx('step');
    if (night === 8) {
      api.setButtons([]);
      api.say({ en: 'Eight nights, and the little jug is still full!', he: 'שמונה לילות, והפך הקטן עדיין מלא!' }, 'good');
      setTimeout(() => api.complete(), 1600);
    } else api.say({ en: `Night ${night}: the jug is still full!`, he: `לילה ${night}: הפך עדיין מלא!` }, 'good');
  }
  return {
    intro: { en: 'Light the seven lamps of the Menorah. Tap each one!', he: 'הדליקו את שבעת נרות המנורה. הקישו על כל אחד!' },
    buttons: [{ id: 'next', label: { en: 'Next night ➜', he: 'הלילה הבא ➜' }, cls: 'btn-green', onClick: nextNight }],
    update(dt) { yehuda.update(dt); kohen.update(dt); },
    down(p) { for (let i = 0; i < 7; i++) if (Kit.near(p, LX[i], LY, 26) && !lit[i]) { lit[i] = 1; api.sfx('tap'); return; } },
    hot() { const h = {}; for (let i = 0; i < 7; i++) h['lamp' + i] = [LX[i], LY]; return h; },
    draw(g, t) {
      CH.temple(g, t, { floor: 860, seed: 23 });
      G.rr(g, 0, 0, 540, 860, 0, 'rgba(20,15,40,0.35)', 0);
      G.menorah(g, 270, 600, 1, lit);
      // the jug and its oil gauge, never going down
      G.jar(g, 460, 760, 1, { material: 'clay', seal: 'kg' });
      G.rr(g, 500, 640, 18, 120, 9, '#fff', 3); G.rr(g, 503, 643, 12, 114, 6, '#f2c94c', 0);
      G.star(g, 509 + Math.sin(t / 200) * 3, 630, 8, '#fff6b0');
      // a little chanukiah counting the nights
      G.rr(g, 30, 140, 230, 70, 14, 'rgba(255,250,240,0.9)', 3);
      for (let i = 0; i < 8; i++) { G.rr(g, 44 + i * 26, 182, 14, 18, 3, G.C.gold, 2); if (i < night) G.flame(g, 51 + i * 26, 178, 0.55, t); }
      G.text(g, api.L({ en: `Night ${night}`, he: `לילה ${night}` }), 145, 158, { size: 15 });
      yehuda.draw(g, t); kohen.draw(g, t);
    },
  };
};

// ---------------------------------------------------------------
// The level list
// ---------------------------------------------------------------
const CHANUKAH = [
  {
    id: 'C-1', pack: 'ch', title: { en: 'The Stones of the Altar', he: 'אבני המזבח' },
    stages: [CH.altarStones],
    hints: [{ en: 'First open the chamber door, then move the flap at the middle, and only then let the stones roll.', he: 'קודם פתחו את דלת הלשכה, אחר כך הזיזו את הדש באמצע, ורק אז שחררו את האבנים.' }],
    why: {
      text: {
        en: 'The Greek kings used the Mizbeach [מזבח] for idol worship, so its stones could never be used again.\n\nThe Chashmona\'im [חשמונאים] stored them away in a special chamber in the Beit HaMoked [בית המוקד] and built a new Mizbeach.',
        he: 'מלכי יוון שיקצו את אבני המזבח, ולכן אי אפשר היה להשתמש בהן עוד.\n\nבני חשמונאי גנזו אותן בלשכה שבבית המוקד ובנו מזבח חדש.',
      },
      sources: [
        S('מִזְרָחִית צְפוֹנִית, בָּהּ גָּנְזוּ בְנֵי חַשְׁמוֹנַאי אֶת אַבְנֵי הַמִּזְבֵּחַ שֶׁשִּׁקְּצוּם מַלְכֵי יָוָן', 'Mishnah Middot 1:6', 'משנה מידות א, ו', 'Mishnah_Middot.1.6'),
      ],
    },
  },
  {
    id: 'C-2', pack: 'ch', title: { en: 'They Searched', he: 'בדקו' },
    stages: [CH.search],
    hints: [{ en: 'Open the hatches with the pins to go down. In the lowest room, tap the loose stones: something is hidden behind them!', he: 'פתחו את הפתחים עם היתדות כדי לרדת. בחדר התחתון הקישו על האבנים הרופפות: משהו מוסתר מאחוריהן!' }],
    why: {
      text: {
        en: 'When the Greeks entered the Heichal [היכל], they made all the oil impure [טמא].\n\nThe Chashmona\'im **searched** and found just one jug lying with the Kohen Gadol\'s seal [חותמו של כהן גדול]. It was hidden and sealed, so they knew nobody had touched it, and it was pure [טהור]. It only had enough oil for one day.',
        he: 'כשנכנסו יוונים להיכל טימאו כל השמנים שבהיכל.\n\n**בדקו** ולא מצאו אלא פך אחד של שמן שהיה מונח בחותמו של כהן גדול, בהצנע, והכירו שלא נגעו בו. ולא היה בו אלא להדליק יום אחד.',
      },
      sources: [
        S('שֶׁכְּשֶׁנִּכְנְסוּ יְוָונִים לַהֵיכָל טִמְּאוּ כׇּל הַשְּׁמָנִים שֶׁבַּהֵיכָל... בָּדְקוּ וְלֹא מָצְאוּ אֶלָּא פַּךְ אֶחָד שֶׁל שֶׁמֶן שֶׁהָיָה מוּנָּח בְּחוֹתָמוֹ שֶׁל כֹּהֵן גָּדוֹל', 'Shabbat 21b', 'שבת כא ע"ב', 'Shabbat.21b.10'),
        S('בחותמו – בהצנע וחתום בטבעתו והכיר שלא נגעו בו', 'Rashi on Shabbat 21b', 'רש"י שבת כא ע"ב', 'Rashi_on_Shabbat.21b.10.2'),
        S(null, 'Tosafot on Shabbat 21b, on whether the soldiers moved the jug', 'תוספות שבת כא ע"ב, בעניין הזזת הפך', 'Tosafot_on_Shabbat.21b.10.1'),
      ],
    },
  },
  {
    id: 'C-3', pack: 'ch', title: { en: 'Sealed Tight', he: 'צמיד פתיל' },
    stages: [CH.sealed],
    hints: [{ en: 'Stone never becomes impure. A sealed clay jar protects food and drinks. A sealed stone jar protects everything. Metal protects nothing.', he: 'אבן לעולם אינה נטמאת. חרס סגור מציל על אוכלים ומשקים. אבן סגורה מצילה על הכול. מתכת אינה מצילה.' }],
    why: {
      text: {
        en: 'In a room with a dead person [אהל המת], everything becomes impure [טמא]. But a clay [חרס] vessel that is **sealed tight** [צמיד פתיל] keeps the food and drink inside it pure [טהור].\n\nA sealed **stone** [אבן] vessel protects everything inside, even metal. A metal vessel doesn\'t protect at all.',
        he: 'באוהל המת הכול נטמא. אבל כלי חרס **המוקף צמיד פתיל** מציל על האוכלים והמשקים שבתוכו.\n\nכלי **אבנים** מציל על הכול, אפילו על כלי מתכת. כלי מתכת אינו מציל.',
      },
      sources: [
        S('וְכֹל כְּלִי פָתוּחַ אֲשֶׁר אֵין־צָמִיד פָּתִיל עָלָיו טָמֵא הוּא', 'Bamidbar 19:15', 'במדבר יט, טו', 'Numbers.19.15'),
        S('אֵלּוּ כֵלִים מַצִּילִין בְּצָמִיד פָּתִיל... כְּלֵי אֲבָנִים... כְּלֵי חֶרֶס... עַל הַכֹּל מַצִּילִין, חוּץ מִכְּלֵי חֶרֶס, שֶׁאֵינוֹ מַצִּיל אֶלָּא עַל הָאֳכָלִים וְעַל הַמַּשְׁקִין וְעַל כְּלֵי חָרֶס', 'Mishnah Kelim 10:1', 'משנה כלים י, א', 'Mishnah_Kelim.10.1'),
        S('לְפִיכָךְ אִם הָיָה פִּתְחוֹ סָתוּם וּמֻקָּף צָמִיד פָּתִיל הִצִּיל עַל כָּל שֶׁבְּתוֹכוֹ', 'Rambam, Hilchot Tumat Met 21:1', 'רמב"ם, הלכות טומאת מת כא, א', 'Mishneh_Torah,_Defilement_by_a_Corpse.21.1'),
      ],
    },
  },
  {
    id: 'C-4', pack: 'ch', title: { en: 'Oil Is a Liquid', he: 'שמן הוא משקה' },
    stages: [CH.press],
    hints: [{ en: 'Switch the gate so the oil goes the right way, away from the loaf. Send the worker to wash his hands. Then pull the press pin.', he: 'הזיזו את השער כדי שהשמן יזרום ימינה, הרחק מהכיכר. שלחו את הפועל ליטול ידיים. ואז משכו את היתד של הבית בד.' }],
    why: {
      text: {
        en: 'Oil is a liquid [משקה]. Liquids are special: if a liquid touches anything impure [טמא], even something weak like a "second" [שני], the liquid becomes a strong "first" [ראשון].\n\nThat\'s why workers wash their hands [נטילת ידיים] before touching pure oil. Unwashed hands count as a "second" (a Rabbinic rule).',
        he: 'שמן הוא משקה. משקין שנגעו בטומאה, **אפילו בשני**, נעשים ראשון.\n\nלכן הפועלים נוטלים ידיים לפני שנוגעים בשמן טהור, כי ידיים סתם הן שניות (מדברי סופרים).',
      },
      sources: [
        S('אֲבָל הַמַּשְׁקִין אֶחָד מַשְׁקֶה שֶׁנָּגַע בְּאַב הַטֻּמְאָה אוֹ שֶׁנָּגַע בְּרִאשׁוֹן אוֹ בְשֵׁנִי... הֲרֵי הוּא רִאשׁוֹן', 'Rambam, Hilchot She\'ar Avot HaTumot 7:5', 'רמב"ם, הלכות שאר אבות הטומאות ז, ה', 'Mishneh_Torah,_Other_Sources_of_Defilement.7.5'),
        S('כָּל הַפּוֹסֵל אֶת הַתְּרוּמָה, מְטַמֵּא אֶת הַמַּשְׁקִין לִהְיוֹת תְּחִלָּה', 'Mishnah Parah 8:7', 'משנה פרה ח, ז', 'Mishnah_Parah.8.7'),
        S('וְטֻמְאַת הַיָּדָיִם מִדִּבְרֵי סוֹפְרִים', 'Rambam, Hilchot She\'ar Avot HaTumot 8:1', 'רמב"ם, הלכות שאר אבות הטומאות ח, א', 'Mishneh_Torah,_Other_Sources_of_Defilement.8.1'),
      ],
    },
  },
  {
    id: 'C-5', pack: 'ch', title: { en: 'Pure Oil Run', he: 'מסע השמן הטהור' },
    stages: [W1.twoPaths('yehuda'), W1.pruneTree('yehuda', 'helper'), CH.runHaperas, CH.runField, CH.runArrive],
    hints: [
      { en: 'Pull the pin to lower the bridge on the long path.', he: 'משכו את היתד כדי להוריד את הגשר בדרך הארוכה.' },
      { en: 'Cut the branch over the road (or the one over the grave).', he: 'גזמו את הענף שמעל הדרך (או את זה שמעל הקבר).' },
      { en: 'Blowing only works for the Korban Pesach. Use solid stones or a strong donkey.', he: 'ניפוח מועיל רק לקרבן פסח. השתמשו באבנים יציבות או בחמור חזק.' },
      { en: 'No trees means a lost grave. Take the long road.', he: 'אין אילנות: אבד שם קבר. לכו בדרך הארוכה.' },
      { en: 'Only a tight seal [צמיד פתיל] counts.', he: 'רק צמיד פתיל נחשב.' },
    ],
    why: {
      text: {
        en: 'The one jug had oil for just one day, but making new pure oil took eight days.\n\nOne explanation: the closest pure oil was four days away, so four days there and four days back. And the little jug burned for all eight days!',
        he: 'בפך היה שמן ליום אחד בלבד, ולא היה אפשר לתקן שמן טהור עד שמונה ימים.\n\nכתב הר"ן שהשמן הטהור היה רחוק ארבעה ימים. ונעשה נס והדליקו ממנו שמונה ימים!',
      },
      sources: [
        S('וְהִדְלִיקוּ מִמֶּנּוּ נֵרוֹת הַמַּעֲרָכָה שְׁמוֹנָה יָמִים עַד שֶׁכָּתְשׁוּ זֵיתִים וְהוֹצִיאוּ שֶׁמֶן טָהוֹר', 'Rambam, Hilchot Megillah v\'Chanukah 3:2', 'רמב"ם, הלכות מגילה וחנוכה ג, ב', 'Mishneh_Torah,_Scroll_of_Esther_and_Hanukkah.3.2'),
        S('וכמ"ש הר"ן שהיה להם שמן רחוק ד\' ימים', 'Maharsha, Chidushei Agadot, Shabbat 21b', 'מהרש"א, חידושי אגדות, שבת כא ע"ב', 'Chidushei_Agadot_on_Shabbat.21b.3'),
      ],
    },
  },
  {
    id: 'C-6', pack: 'ch', title: { en: 'Eight Nights', he: 'שמונה לילות' },
    stages: [CH.whatToDo, CH.nights],
    hints: [
      { en: 'According to the Rambam, tumah for the community is only pushed aside when there\'s no other way. So, first…', he: 'לפי הרמב"ם, טומאה דחויה בציבור רק במקום שאי אפשר. לכן קודם…' },
      { en: 'Tap each of the seven lamps, then press "Next night".', he: 'הקישו על כל אחד משבעת הנרות, ואז על "הלילה הבא".' },
    ],
    why: {
      text: {
        en: 'When the whole Jewish people [ציבור] is impure [טמא], the Avodah can still be done with impurity. But according to the Rambam, impurity is only **pushed aside** [דחויה] then, not truly permitted, so you must first **search** for a pure way.\n\nThat\'s why the Chashmona\'im searched for pure oil. And Hashem showed His love by making the one little jug last for eight days.',
        he: 'טומאה **דחויה** בציבור ואינה הותרה. לכן צריך לחזר תחילה אחר דרך טהורה, ורק במקום שאי אפשר דוחים.\n\nלכן בדקו החשמונאים אחר שמן טהור, והקב"ה הראה את חיבתו לישראל ועשה נס, והדליקו ממנו שמונה ימים.',
      },
      sources: [
        S('שֶׁהַטֻּמְאָה לֹא הֻתְּרָה בַּצִּבּוּר אֶלָּא בְּאִסּוּרָהּ עוֹמֶדֶת וּדְחוּיָה הִיא עַתָּה מִפְּנֵי הַדְּחָק. וְאֵין דּוֹחִין כָּל דָּבָר הַנִּדְחֶה אֶלָּא בְּמָקוֹם שֶׁאִי אֶפְשָׁר', 'Rambam, Hilchot Bi\'at HaMikdash 4:15', 'רמב"ם, הלכות ביאת המקדש ד, טו', 'Mishneh_Torah,_Admission_into_the_Sanctuary.4.15'),
        S('רב נחמן אמר: היתר היא בציבור... ורב ששת אמר: דחויה היא בציבור', 'Yoma 6b', 'יומא ו ע"ב', 'Yoma.6b'),
        S(null, 'Pnei Yehoshua on Shabbat 21b: the miracle showed Hashem\'s love', 'פני יהושע שבת כא ע"ב: הנס להראות חיבה', 'Penei_Yehoshua_on_Shabbat.21b'),
      ],
    },
  },
];

/* C-3 · Sealed Tight (Bamidbar 19:15; Mishnah Kelim 10:1)
   Things hidden in a burial cave: which are still pure? A sealed clay jar saves
   food, drink and clay; a sealed stone jar saves everything; metal saves nothing;
   an OPEN stone bowl stays pure itself, but the oil in it doesn't. */
CH.ITEMS = [
  { label: { en: 'Open clay jar of oil', he: 'כד חרס פתוח עם שמן' }, look: { oil: true }, vessel: { material: 'clay', sealed: false }, item: 'oil' },
  { label: { en: 'Clay jar of oil, cloth tied loosely on top', he: 'כד חרס עם שמן, בד קשור ברפיון' }, look: { loose: true }, vessel: { material: 'clay', sealed: false }, item: 'oil' },
  { label: { en: 'Clay jar of oil, sealed tight', he: 'כד חרס עם שמן, מוקף צמיד פתיל' }, look: { sealed: true }, vessel: { material: 'clay', sealed: true }, item: 'oil' },
  { label: { en: 'Clay jar sealed tight, a metal ladle inside', he: 'כד חרס מוקף צמיד פתיל, ובו מצקת מתכת' }, look: { sealed: true }, vessel: { material: 'clay', sealed: true }, item: 'metal', inside: 'ladle' },
  { label: { en: 'Stone jar sealed tight, a metal ladle inside', he: 'כד אבן מוקף צמיד פתיל, ובו מצקת מתכת' }, look: { material: 'stone', sealed: true }, vessel: { material: 'stone', sealed: true }, item: 'metal', inside: 'ladle' },
  { label: { en: 'Metal flask of oil, sealed', he: 'בקבוק מתכת סגור עם שמן' }, look: { material: 'metal', sealed: true, flask: true }, vessel: { material: 'metal', sealed: true }, item: 'oil' },
  { label: { en: 'Empty stone cup', he: 'כוס אבן ריקה' }, cup: true, vessel: null, item: 'stone' },
  { label: { en: 'Open stone bowl of oil', he: 'קערת אבן פתוחה עם שמן' }, look: { material: 'stone', bowl: true, oil: true }, vessel: { material: 'stone', sealed: false }, item: 'oil' },
  { label: { en: 'Clay jar sealed tight, a little clay cup inside', he: 'כד חרס מוקף צמיד פתיל, ובו כוס חרס קטנה' }, look: { sealed: true }, vessel: { material: 'clay', sealed: true }, item: 'clay', inside: 'claycup' },
  { label: { en: 'A metal ladle', he: 'מצקת מתכת' }, loneLadle: true, vessel: null, item: 'metal' },
];
CH.sealed = api => {
  const T = api.T;
  const items = CH.ITEMS.map((it, i) => ({ ...it, i, home: [56 + (i % 5) * 107, i < 5 ? 430 : 540], place: null }));
  items.forEach(it => { it.x = it.home[0]; it.y = it.home[1]; });
  const zones = { take: { x: 12, y: 600, w: 254, h: 290 }, leave: { x: 274, y: 600, w: 254, h: 290 } };
  const yehuda = new Chars.Actor('yehuda', 470, 330, { dir: -1 }), helper = new Chars.Actor('helper', 236, 330);
  let drag = null, off = [0, 0];
  const usable = it => it.cup ? T.vesselInOhel({ material: 'stone' }).tahor : T.itemInOhel({ item: it.item, vessel: it.vessel }).tahor;
  const WHY = it => {
    if (it.cup) return { en: 'A stone [אבן] cup can never become impure!', he: 'כלי אבנים אינו מקבל טומאה לעולם!' };
    if (it.loneLadle) return { en: 'A metal ladle lying in a cave with a grave became impure [טמא].', he: 'מצקת מתכת שהייתה במערה עם קבר נטמאה.' };
    if (it.vessel.material === 'metal') return { en: 'A metal [מתכת] vessel doesn\'t protect what\'s inside, even when it\'s sealed.', he: 'כלי מתכת אינו מציל על מה שבתוכו, אפילו כשהוא סגור.' };
    if (it.vessel.material === 'stone' && !it.vessel.sealed) return { en: 'The stone bowl itself can\'t become impure, but it\'s open, so the oil in it is not protected!', he: 'קערת האבן עצמה אינה מקבלת טומאה, אבל היא פתוחה, ולכן השמן שבה אינו ניצל!' };
    if (!it.vessel.sealed) return { en: 'In a cave with a grave, an open or loosely covered jar doesn\'t protect. Only a tight seal [צמיד פתיל] does.', he: 'במערה שיש בה קבר, כלי פתוח או מכוסה ברפיון אינו מציל. רק צמיד פתיל.' };
    if (it.vessel.material === 'stone') return { en: 'A sealed stone jar protects everything inside it, even a metal ladle!', he: 'כלי אבנים מוקף צמיד פתיל מציל על הכול, אפילו על מצקת מתכת!' };
    if (it.item === 'metal') return { en: 'A sealed clay jar only protects food, drinks and clay vessels. The metal ladle inside isn\'t protected.', he: 'כלי חרס מוקף צמיד פתיל מציל רק על אוכלים, משקים וכלי חרס. מצקת המתכת שבתוכו אינה ניצלת.' };
    if (it.item === 'clay') return { en: 'A sealed clay jar does protect a clay cup inside it.', he: 'כלי חרס מוקף צמיד פתיל מציל על כלי חרס שבתוכו.' };
    return { en: 'A clay jar sealed tight keeps the oil inside pure.', he: 'כלי חרס המוקף צמיד פתיל מציל על השמן שבתוכו.' };
  };
  function layout() {
    for (const z of ['take', 'leave']) items.filter(it => it.place === z).forEach((it, k) => { it.x = zones[z].x + 44 + (k % 3) * 84; it.y = zones[z].y + 100 + Math.floor(k / 3) * 92; });
    for (const it of items) if (!it.place) { it.x = it.home[0]; it.y = it.home[1]; }
  }
  function check() {
    if (items.some(it => !it.place)) { api.say({ en: 'Sort every item first.', he: 'קודם מיינו את כל הכלים.' }); return; }
    for (const it of items) if (it.place !== (usable(it) ? 'take' : 'leave')) { api.mistake(WHY(it)); return; }
    api.setButtons([]); api.say({ en: 'All sorted correctly!', he: 'הכול ממוין נכון!' }, 'good');
    setTimeout(() => api.complete(), 900);
  }
  function drawItem(g, it) {
    if (it.cup) G.cup(g, it.x, it.y, 0.95, 'stone');
    else if (it.loneLadle) G.ladle(g, it.x, it.y - 6, 0.85);
    else G.jar(g, it.x, it.y, 0.72, it.look);
    if (it.inside) { G.circ(g, it.x + 24, it.y - 52, 14, '#fff', 2); if (it.inside === 'ladle') G.ladle(g, it.x + 24, it.y - 47, 0.3); else G.cup(g, it.x + 24, it.y - 46, 0.4, 'clay'); }
  }
  return {
    intro: { en: 'A family hid their things in an old burial cave. Which are still pure [טהור]? Drag each one to a shelf. Tap to read what it is.', he: 'משפחה הסתירה חפצים במערת קבורה ישנה. אילו עדיין טהורים? גררו כל אחד למדף. הקישו כדי לקרוא מה הוא.' },
    buttons: [{ id: 'check', label: { en: 'Check', he: 'בדיקה' }, cls: 'btn-green', onClick: check }],
    update(dt) { yehuda.update(dt); helper.update(dt); },
    down(p) { for (const it of items.slice().reverse()) if (Kit.near(p, it.x, it.y - 22, 36)) { drag = it; off = [p.x - it.x, p.y - it.y]; api.say(it.label, 'info', 2400); return; } },
    move(p) { if (drag) { drag.x = p.x - off[0]; drag.y = p.y - off[1]; } },
    up(p) { if (!drag) return; const z = Object.keys(zones).find(k => Kit.inRect(p, zones[k].x, zones[k].y, zones[k].w, zones[k].h)); drag.place = z || null; drag = null; api.sfx('tap'); layout(); },
    hot() { const h = { take: [139, 760], leave: [401, 760] }; for (const it of items) h['i' + it.i] = [it.x, it.y - 22]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 91, y: 200 });
      G.platform(g, -10, 340, 560, 640, { seed: 92 });
      G.cave(g, 24, 200, 160, 140, { closed: false });
      G.tag(g, api.L({ en: 'Burial cave', he: 'מערת קבורה' }), 104, 186, { size: 12 });
      for (const ry of [440, 550]) G.rr(g, 6, ry, 528, 14, 4, G.lin(g, 0, ry, 0, ry + 14, [[0, G.C.woodLight], [1, G.C.wood]]), 2.5, G.C.woodDark);
      for (const z of ['take', 'leave']) {
        const Z = zones[z];
        G.rr(g, Z.x, Z.y, Z.w, Z.h, 16, z === 'take' ? 'rgba(51,184,100,0.22)' : 'rgba(110,100,90,0.22)', 2.5, z === 'take' ? '#2a8a4a' : '#6e645a');
        G.tag(g, api.L(z === 'take' ? { en: 'To the Mikdash ✓', he: 'למקדש ✓' } : { en: 'Leave here ✗', he: 'להשאיר ✗' }), Z.x + Z.w / 2, Z.y + 26, { size: 15 });
      }
      for (const it of items) if (it !== drag) drawItem(g, it);
      if (drag) drawItem(g, drag);
      helper.draw(g, t); yehuda.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-3', pack: 'ch', title: { en: 'Sealed Tight', he: 'צמיד פתיל' },
  stages: [CH.sealed],
  hints: [{ en: 'Stone never becomes impure, but an OPEN stone bowl doesn\'t protect its oil. Sealed clay protects food, drinks and clay. Sealed stone protects everything. Metal protects nothing.', he: 'אבן אינה נטמאת, אבל קערת אבן פתוחה אינה מצילה על השמן. חרס סגור מציל על אוכלים, משקים וחרס. אבן סגורה מצילה על הכול. מתכת אינה מצילה.' }],
  why: {
    text: {
      en: 'In a room with a dead person [אהל המת], everything becomes impure [טמא]. But a clay [חרס] vessel that is **sealed tight** [צמיד פתיל] keeps the food, drink and clay vessels inside it pure [טהור].\n\nA sealed **stone** [אבן] vessel protects everything inside, even metal. A metal vessel doesn\'t protect at all. And an **open** stone bowl stays pure itself, but the oil in it is not protected.',
      he: 'באוהל המת הכול נטמא. אבל כלי חרס **המוקף צמיד פתיל** מציל על האוכלים, המשקים וכלי החרס שבתוכו.\n\nכלי **אבנים** מוקף צמיד פתיל מציל על הכול, אפילו על כלי מתכת. כלי מתכת אינו מציל. וקערת אבן **פתוחה** טהורה בעצמה, אבל השמן שבה אינו ניצל.',
    },
    sources: [
      S('וְכֹל כְּלִי פָתוּחַ אֲשֶׁר אֵין־צָמִיד פָּתִיל עָלָיו טָמֵא הוּא', 'Bamidbar 19:15', 'במדבר יט, טו', 'Numbers.19.15'),
      S('אֵלּוּ כֵלִים מַצִּילִין בְּצָמִיד פָּתִיל... כְּלֵי אֲבָנִים... כְּלֵי חֶרֶס... עַל הַכֹּל מַצִּילִין, חוּץ מִכְּלֵי חֶרֶס, שֶׁאֵינוֹ מַצִּיל אֶלָּא עַל הָאֳכָלִים וְעַל הַמַּשְׁקִין וְעַל כְּלֵי חָרֶס', 'Mishnah Kelim 10:1', 'משנה כלים י, א', 'Mishnah_Kelim.10.1'),
      S('לְפִיכָךְ אִם הָיָה פִּתְחוֹ סָתוּם וּמֻקָּף צָמִיד פָּתִיל הִצִּיל עַל כָּל שֶׁבְּתוֹכוֹ', 'Rambam, Hilchot Tumat Met 21:1', 'רמב"ם, הלכות טומאת מת כא, א', 'Mishneh_Torah,_Defilement_by_a_Corpse.21.1'),
    ],
  },
});

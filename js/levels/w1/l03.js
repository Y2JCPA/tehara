/* 1-3 · The Bone Bridge
   A seesaw with a bone on its end (moving the plank moves the bone = carrying),
   a high log right over the bone (no ohel for a single bone: safe), and a low
   rope bridge under an overhang that also shelters a tomb (ohel). */
W1.boneBridge = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 56, 600);
  const pRope = new Kit.Pin('rope', 20, 150, 92, 150);
  const pStop = new Kit.Pin('stop', 520, 330, 520, 418);
  const log = { a: -Math.PI / 2, x: 110, slide: 0, gone: false };     // pivots at (110,470)
  const see = { a: 0 };
  const stop = { y: 380, down: false };
  const routes = new Kit.Routes([
    { id: 'log', box: [110, 420, 330, 80], glow: [[56, 600], [100, 470], [440, 470], [480, 600]] },
    { id: 'seesaw', box: [150, 560, 240, 90], glow: [[56, 600], [390, 600], [480, 600]] },
    { id: 'rope', box: [150, 730, 240, 80], glow: [[56, 600], [70, 780], [430, 780], [480, 600]] },
  ]);
  let going = false;

  function goNow() {
    if (going) return;
    if (!routes.sel) { api.say({ en: 'Tap a way across first.', he: 'הקישו קודם על דרך לעבור.' }); return; }
    if (routes.sel === 'log' && (log.a < -0.05 || log.gone)) { eli.talk(api.L({ en: 'The log isn\'t across yet!', he: 'הבול עוד לא מעבר לנקיק!' })); return; }
    going = true; api.setButtons([]);
    if (routes.sel === 'log') {
      eli.walk([[86, 600], [100, 470], [440, 470]], () => {
        const r = T.passOver('bone');
        if (!r.result) api.say({ en: 'Right over the bone, and Eli is still pure! A single bone doesn\'t spread tumah under a roof [אהל].', he: 'בדיוק מעל העצם, ואלי טהור! עצם אחת אינה מטמאה באוהל.' }, 'good', 4000);
        eli.walk([[470, 600], [500, 600]], () => { eli.mood = 'happy'; api.complete(); });
      });
      return;
    }
    if (routes.sel === 'seesaw') {
      eli.walk([[160, 600], [176, 598]], () => tw.to(see, { a: 0.2 }, 0.35, () => {
        if (T.moveViaPlank('bone').result) {
          eli.glow = 'tm'; eli.mood = 'oh';
          api.fail({ en: 'The plank tipped and lifted the bone. Moving a bone, even through a plank, counts like carrying it [משא]!', he: 'הקרש נטה והרים את העצם. הזזת עצם, אפילו דרך קרש, היא כמו משא!' });
        }
      }));
      return;
    }
    eli.walk([[70, 600]], () => eli.walk([[70, 780], [150, 780], [330, 786]], () => {
      Kit.reveal(api, 'overhang'); eli.glow = 'tm'; eli.mood = 'oh';
      if (T.conveys('grave', 'ohel').result) api.fail({ en: 'That rock overhang also covers a tomb in the cliff! Under one roof [אהל] with a grave, Eli became impure.', he: 'בליטת הסלע מכסה גם קבר שבצוק! תחת אוהל אחד עם קבר, אלי נטמא.' });
    }, 110));
  }
  return {
    intro: { en: 'Someone found a bone in the ravine. Three ways across: which one keeps Eli pure?', he: 'מישהו מצא עצם בנקיק. שלוש דרכים לעבור: איזו משאירה את אלי טהור?' },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pRope.update(dt); pStop.update(dt); eli.update(dt); },
    down(p) {
      if (going) return;
      if (pStop.hit(p)) { pStop.pull(() => tw.to(stop, { y: 446 }, 0.25, () => { stop.down = true; api.sfx('thunk'); })); return; }
      if (pRope.hit(p)) {
        pRope.pull(() => tw.to(log, { a: 0 }, 0.6, () => {
          api.sfx('thunk');
          if (!stop.down) tw.to(log, { slide: 120 }, 0.4, () => tw.to(log, { a: 1.2 }, 0.5, () => { log.gone = true; api.fail({ en: 'The log slid right off the ledge! Drop the stopper first so it has something to land against.', he: 'הבול החליק מהמדף! קודם הורידו את המעצור.' }); }));
        }));
        return;
      }
      routes.hit(p);
    },
    hot() { return { rope: pRope.ring, stop: pStop.ring, ...routes.hot() }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 8, y: 320 });
      G.chasm(g, 150, 470, 240, 500);
      // overhang and the tomb under it, on the right wall of the ravine
      G.platform(g, 390, 600, 160, 380, { face: 'rock', seed: 2 });
      G.rr(g, 330, 740, 70, 66, 8, G.lin(g, 0, 740, 0, 806, [[0, '#3a2a1a'], [1, '#1a110a']]), 3, '#5e4c36');
      g.beginPath(); g.arc(380, 776, 26, 0, 7); g.fillStyle = G.rad(g, 372, 768, 3, 28, [[0, '#d3c4a6'], [1, '#8f7d62']]); g.fill(); g.lineWidth = 2.5; g.strokeStyle = G.C.rockDark; g.stroke();
      G.poly(g, [[392, 690], [250, 700], [240, 716], [392, 724]], G.lin(g, 0, 690, 0, 724, [[0, G.C.rockLight], [1, G.C.rockDark]]), 2.5, G.C.rockDark);
      if (Kit.revealed(api, 'overhang')) G.ohelTint(g, [[240, 716], [392, 716], [392, 806], [240, 806]]);
      G.platform(g, -10, 600, 160, 380, { face: 'rock', seed: 3 });
      G.platform(g, -10, 470, 120, 132, { seed: 4, edgeR: true });
      G.platform(g, 430, 470, 120, 132, { seed: 5 });
      G.stairs(g, 110, 470, 4, { stepW: 10, stepH: 32, dir: 1, thick: 14 });
      G.stairs(g, 430, 470, 4, { stepW: 10, stepH: 32, dir: -1, thick: 14 });
      // low ledges with ladders and the rope bridge
      G.rr(g, 100, 786, 52, 14, 3, G.C.rockLight, 2.5, G.C.rockDark); G.rr(g, 390, 806, 44, 14, 3, G.C.rockLight, 2.5, G.C.rockDark);
      G.ladder(g, 70, 600, 790, { w: 28 }); G.ladder(g, 470, 600, 806, { w: 28 });
      G.rope(g, 150, 776, 392, 776, 16); for (let x = 156; x < 390; x += 16) G.rr(g, x, 780 + Math.sin((x - 150) / 242 * Math.PI) * 13, 12, 6, 2, G.C.woodLight, 1.5, G.C.woodDark);
      G.rope(g, 150, 790, 392, 790, 16);
      // pivot rock and seesaw, with the bone on its far end
      G.poly(g, [[244, 960], [296, 960], [282, 616], [258, 616]], G.lin(g, 244, 0, 296, 0, [[0, G.C.rockLight], [1, G.C.rockDark]]), 2.5, G.C.rockDark);
      g.save(); g.translate(270, 610); g.rotate(see.a); G.plank(g, 0, 0, 250, 0, 14); G.bone(g, 104, -14, 0.9, 0.2, false); g.restore();
      G.sign(g, 470, 900, api.L({ en: 'A bone fell here', he: 'כאן נפלה עצם' }), { w: 120, size: 13 });
      // the stopper on the right ledge
      G.rr(g, 448, stop.y, 22, 26, 3, G.lin(g, 0, stop.y, 0, stop.y + 26, [[0, G.C.rockLight], [1, G.C.rockDark]]), 2.5, G.C.rockDark);
      if (!stop.down) G.line(g, 459, 330, 459, stop.y, 3, '#6b4a22');
      // the log (rope from its top to the pin)
      if (!log.gone) {
        const ang = log.a, px = 110 + log.slide;
        const lx = px + Math.cos(ang) * 330, ly = 470 + Math.sin(ang) * 330;
        if (!pRope.out) G.rope(g, 92, 150, lx, ly);
        g.save(); g.translate(px, 458); g.rotate(ang); G.log(g, 165, 0, 330, 0); g.restore();
      }
      routes.draw(g, t);
      pRope.draw(g); pStop.draw(g);
      G.text(g, '🚩', 512, 560, { size: 30 });
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-3', pack: 'w1', title: { en: 'The Bone Bridge', he: 'גשר העצם' },
  stages: [W1.boneBridge],
  hints: [{ en: 'Walking over a single bone is OK, but moving it is not. And what is hiding under that rock overhang? For the log: drop the stopper before you let the log fall.', he: 'מעבר מעל עצם אחת מותר, אבל הזזתה לא. ומה מסתתר מתחת לבליטת הסלע? ובבול: הורידו את המעצור לפני שמפילים את הבול.' }],
  why: {
    text: {
      en: 'A single bone from a person, even as small as a grain of barley [עצם כשעורה], makes you impure [טמא] if you **touch** it or **move** it. Pressing one end of a plank that the bone lies on moves it, so it counts as carrying [היסט].\n\nBut a single bone does **not** spread tumah under a roof [אהל], so walking right over it on the log is fine!\n\nThe rope bridge had no bones at all, but the rock overhang above it also covered a **tomb**. A grave does spread tumah under a roof.',
      he: 'עצם אחת של אדם, אפילו כשעורה, מטמאה **במגע ובמשא**. הנדת קרש שהעצם מונחת עליו היא כמו משא (היסט).\n\nאבל עצם אחת **אינה מטמאה באוהל**, ולכן מותר לעבור על הבול בדיוק מעליה!\n\nבגשר החבלים לא היו עצמות, אבל בליטת הסלע שמעליו מכסה גם **קבר**, וקבר מטמא באוהל.',
    },
    sources: [
      S('אֲפִלּוּ עֶצֶם כִּשְׂעוֹרָה מְטַמֵּא בְּמַגָּע וּבְמַשָּׂא... וְאֵינוֹ מְטַמֵּא בְּאֹהֶל', 'Rambam, Hilchot Tumat Met 2:10', 'רמב"ם, הלכות טומאת מת ב, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.2.10'),
      S('קוֹרָה שֶׁהִיא מֻנַּחַת עַל הַכֹּתֶל... וּבָא הַטָּהוֹר לִקְצֵה הַקּוֹרָה הַשֵּׁנִי וְהֵנִידוֹ... טָמֵא מִשּׁוּם נוֹשֵׂא', 'Rambam, Hilchot Tumat Met 1:7', 'רמב"ם, הלכות טומאת מת א, ז', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.7'),
      S('אֲבָנִים הַיּוֹצְאוֹת מִן הַגָּדֵר הַסּוֹכְכוֹת עַל הָאָרֶץ... הֲרֵי אֵלּוּ מְבִיאִין וְחוֹצְצִין מִן הַתּוֹרָה', 'Rambam, Hilchot Tumat Met 13:2', 'רמב"ם, הלכות טומאת מת יג, ב', 'Mishneh_Torah,_Defilement_by_a_Corpse.13.2'),
    ],
  },
});

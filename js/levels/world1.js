/* ============================================
   TEHARA: World 1, The Road to Pesach
   Design: docs/LEVELS.md, Part B
   ============================================ */
const W1 = {};

// ---------------------------------------------------------------
// 1-1 · Two Paths. A Kohen doesn't touch a grave or stand over it.
// Also used (with hero 'yehuda') in the Chanukah oil run.
// ---------------------------------------------------------------
W1.twoPaths = (hero = 'eli') => api => {
  const tw = new Kit.Tweens();
  const eli = new Chars.Actor(hero, 90, 372);
  const pin = new Kit.Pin('pin', 300, 250, 405, 250);
  const bridge = { a: -Math.PI / 2 }; // hinge at (380,380); -90° = up, 0 = down across the gap
  let down = false, going = false;
  const shortPath = [[90, 372], [190, 470], [270, 560], [340, 700], [350, 860]];
  const longPath = [[90, 372], [380, 372], [478, 372], [508, 470], [508, 800], [470, 868]];
  const T = api.T;
  const NAME = hero === 'yehuda' ? { en: 'Yehuda', he: 'יהודה' } : { en: 'Eli', he: 'אלי' };

  function goNow() {
    if (going) return; going = true; api.setButtons([]);
    if (down) {
      eli.walk(longPath.slice(1), () => { eli.mood = 'happy'; api.complete(); });
    } else {
      // heads down the short path and stops before the grave (4 amot away)
      eli.walk([[190, 470]], () => {
        eli.mood = 'no'; eli.talk(api.L({ en: 'A grave! I\'m a Kohen [כהן]!', he: 'קבר! אני כהן!' }));
        const k = T.kohenMay('grave');
        if (!k.ok) api.fail({ en: 'A Kohen [כהן] may not touch a grave [קבר] or stand over it. Find another way!', he: 'כהן אסור לגעת בקבר או לעמוד מעליו. מצאו דרך אחרת!' });
      });
    }
  }

  return {
    intro: { en: `Help ${NAME.en} reach the road. ${NAME.en} is a Kohen [כהן]!`, he: `עזרו ל${NAME.he} להגיע לדרך. ${NAME.he} הוא כהן!` },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); pin.update(dt); eli.update(dt); },
    down(p) {
      if (pin.hit(p)) pin.pull(() => { tw.to(bridge, { a: 0 }, 0.5, () => { down = true; api.sfx('thunk'); }); });
    },
    hot() { return { pin: pin.ring }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 2 });
      G.ground(g, 0, 392, 380, 600, 'grass');            // top-left plateau and slope
      G.ground(g, 478, 392, 62, 600, 'grass');           // right cliff
      G.ground(g, 0, 840, 540, 120, 'dirt');             // the road
      G.text(g, api.L({ en: 'The road', he: 'הדרך' }), 270, 905, { size: 20, color: '#fff', outline: 5, outlineColor: G.C.ink });
      // the ravine between the plateau and the right cliff
      G.rr(g, 380, 392, 98, 448, 0, '#6b4a2b', 3); G.text(g, '⇣', 429, 600, { size: 40, color: 'rgba(0,0,0,0.25)' });
      Kit.trail(g, shortPath);
      Kit.trail(g, [[90, 372], [380, 372]]); Kit.trail(g, [[478, 372], [508, 470], [508, 800], [470, 860]], 26);
      G.house(g, 20, 250, 110, 120);
      G.grave(g, 270, 575, 1.1);
      G.sign(g, 180, 600, api.L({ en: 'Grave', he: 'קבר' }), { w: 90, size: 15 });
      // drawbridge
      g.save(); g.translate(380, 380); g.rotate(bridge.a); G.plank(g, 49, 0, 98, 0, 16); g.restore();
      G.rr(g, 372, 372, 16, 16, 4, G.C.goldDark, 2.5);
      pin.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};


// ---------------------------------------------------------------
// 1-2a · The Mouse on the Beam. A Kohen may become tamei from a
// sheretz; knocking it away with a stick isn't tumah at all.
// ---------------------------------------------------------------
W1.mouseBeam = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 70, 536);
  const pin = new Kit.Pin('stick', 190, 300, 310, 300);
  const stick = { x: 292, y: 300, a: 0, vis: true };
  const mouse = { x: 270, y: 528, a: 0, on: true };
  let going = false;
  api.needBonus();
  api.state.eli = 'tahor';

  function cross() {
    if (going) return; going = true; api.setButtons([]);
    if (!mouse.on) { eli.walk([[150, 536], [400, 536], [470, 540]], arrive); return; }
    eli.walk([[150, 536], [256, 536]], () => {
      const r = T.personTouches('sheretz');          // Rishon until evening
      const k = T.kohenMay('sheretz');               // allowed for a Kohen
      api.state.eli = r.status; eli.glow = 1; eli.badge = 1; eli.mood = 'oh';
      api.say({ en: 'Eli stepped on the dead mouse, a sheretz [שרץ]. Now he\'s impure [טמא] until evening. That\'s allowed for a Kohen!', he: 'אלי דרך על העכבר המת, שרץ. עכשיו הוא טמא עד הערב, וזה מותר לכהן!' }, k.ok ? 'info' : 'warn', 4200);
      setTimeout(() => { eli.mood = 'idle'; eli.walk([[400, 536], [470, 540]], arrive); }, 1400);
    });
  }
  function arrive() { api.complete(); }

  return {
    intro: { en: 'Eli needs the donkey from the barn. Which way should he go?', he: 'אלי צריך את החמור מהאורווה. באיזו דרך ללכת?' },
    buttons: [Kit.go(cross)],
    update(dt) { tw.update(dt); pin.update(dt); eli.update(dt); },
    down(p) {
      if (pin.hit(p)) {
        pin.pull(() => {
          // the stick drops and knocks the mouse off the beam
          tw.to(stick, { y: 470, a: 0.4 }, 0.35, () => {
            api.sfx('thunk');
            const k = T.personMovesWithStick('sheretz');
            if (k.status === 'tahor') { mouse.on = false; api.bonus(); }
            tw.to(mouse, { x: 300, y: 760, a: 3 }, 0.6);
            tw.to(stick, { x: 330, y: 780, a: 1.5 }, 0.7);
          });
        });
        return;
      }
      if (Kit.inRect(p, 10, 170, 220, 140)) {
        eli.mood = 'no'; eli.talk(api.L({ en: 'A burial cave? Not for a Kohen!', he: 'מערת קבורה? לא לכהן!' }));
        setTimeout(() => { eli.mood = 'idle'; }, 1600);
      }
    },
    hot() { return { pin: pin.ring, cave: [110, 250], mouse: [mouse.x, mouse.y] }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 5 });
      G.cave(g, 30, 170, 160, 130, { closed: true });
      G.sign(g, 230, 250, api.L({ en: 'Burial cave\nNo Kohanim', he: 'מערת קבורה\nלא לכהנים' }), { w: 120, size: 13 });
      G.ground(g, 0, 544, 150, 420, 'grass');
      G.ground(g, 390, 544, 150, 420, 'grass');
      G.rr(g, 150, 544, 240, 420, 0, '#5d4029', 3);
      G.house(g, 410, 400, 120, 144, { roof: '#8d6e63' });
      G.donkey(g, 470, 540, 0.45, { dir: -1 });
      G.plank(g, 270, 552, 270, 0, 16);
      if (mouse.on || mouse.y < 900) { g.save(); g.translate(mouse.x, mouse.y); g.rotate(mouse.a); G.deadMouse(g, 0, 0, 0.9); g.restore(); }
      // stick hanging from the pin
      if (stick.vis) { g.save(); g.translate(stick.x, stick.y); g.rotate(stick.a); G.rr(g, -6, 0, 12, 150, 6, G.C.wood, 3); g.restore(); }
      pin.draw(g);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-2b · Dinner. Terumah after a sheretz: mikveh, then three stars.
// ---------------------------------------------------------------
W1.dinner = api => {
  const T = api.T, tw = new Kit.Tweens();
  const st = { status: api.state.eli || 'tahor', immersed: false, starsOut: false };
  const eli = new Chars.Actor('eli', 300, 660);
  if (st.status !== 'tahor') { eli.glow = 1; eli.badge = 1; }
  const miriam = new Chars.Actor('miriam', 490, 660, { dir: -1 });
  const pin = new Kit.Pin('door', 262, 600, 186, 600);
  const door = { open: 0 };
  let v = 0, dragging = false, busy = false;
  const track = { x1: 90, x2: 450, y: 850 };

  function stars() { return v >= 0.98 ? 3 : v >= 0.92 ? 2 : v >= 0.85 ? 1 : 0; }

  function eat() {
    if (busy) return;
    const r = T.canEatTerumah({ status: st.status, immersed: st.immersed, starsOut: stars() >= 3 });
    if (r.ok) {
      busy = true; eli.mood = 'happy';
      eli.walk([[380, 660]], () => { api.say({ en: 'Eli is pure [טהור]. He may eat terumah [תרומה]!', he: 'אלי טהור, ומותר לו לאכול תרומה!' }, 'good'); setTimeout(() => api.complete(), 900); });
      return;
    }
    if (r.need === 'mikveh') api.mistake({ en: 'Not yet! First Eli must dip in the mikveh [מקווה].', he: 'עוד לא! קודם אלי צריך לטבול במקווה.' });
    else if (r.need === 'stars') api.mistake({ en: 'Not yet! After the mikveh, a Kohen waits until three stars come out [צאת הכוכבים] before eating terumah.', he: 'עוד לא! אחרי הטבילה מחכים לצאת שלושה כוכבים לפני שאוכלים תרומה.' });
  }

  return {
    intro: st.status === 'tahor'
      ? { en: 'Eli stayed pure! Tap the terumah [תרומה] for dinner.', he: 'אלי נשאר טהור! הקישו על התרומה לארוחת הערב.' }
      : { en: 'Dinner is terumah [תרומה]. Can Eli eat it now?', he: 'לארוחת הערב יש תרומה. האם אלי יכול לאכול עכשיו?' },
    update(dt) { tw.update(dt); pin.update(dt); eli.update(dt); miriam.update(dt); },
    down(p) {
      if (pin.hit(p)) {
        pin.pull(() => tw.to(door, { open: 1 }, 0.4, () => {
          if (st.status === 'tahor') return;
          busy = true;
          eli.walk([[205, 660], [120, 660], [110, 720]], () => {
            api.sfx('splash'); st.immersed = true; eli.glow = null; eli.badge = '✓';
            api.say({ en: 'Eli dipped in the mikveh [טבילה]. Now he waits for evening.', he: 'אלי טבל במקווה. עכשיו הוא מחכה לערב.' }, 'info');
            setTimeout(() => eli.walk([[120, 660], [300, 660]], () => { busy = false; }), 700);
          });
        }));
        return;
      }
      const hx = Kit.lerp(track.x1, track.x2, v);
      if (Kit.near(p, hx, track.y, 40)) { dragging = true; return; }
      if (Kit.inRect(p, 350, 590, 120, 60)) eat();
    },
    move(p) {
      if (!dragging) return;
      v = Math.max(0, Math.min(1, (p.x - track.x1) / (track.x2 - track.x1)));
      if (stars() >= 3 && !st.starsOut) { st.starsOut = true; api.say({ en: 'Three stars are out!', he: 'יצאו שלושה כוכבים!' }, 'good'); }
    },
    up() { dragging = false; },
    hot() { return { pin: pin.ring, plate: [410, 620], dial: [Kit.lerp(track.x1, track.x2, v), track.y], dialEnd: [track.x2, track.y] }; },
    draw(g, t) {
      // sky from afternoon to night
      G.sky(g, 'day', t);
      if (v > 0.3) { g.globalAlpha = Math.min(1, (v - 0.3) / 0.35); G.sky(g, 'sunset', t); g.globalAlpha = 1; }
      if (v > 0.65) { g.globalAlpha = Math.min(1, (v - 0.65) / 0.3); G.sky(g, 'night', t, stars()); g.globalAlpha = 1; }
      if (stars()) { const pts = [[120, 80], [300, 60], [440, 110]]; for (let i = 0; i < stars(); i++) G.star(g, pts[i][0], pts[i][1], 12, '#fff6b0'); }
      G.hills(g, 360, v > 0.65 ? '#3d4a6e' : G.C.hill2, 3, 40);
      G.ground(g, 0, 668, 540, 300, 'grass');
      // mikveh: a stone room with a pool
      G.stoneWall(g, 20, 470, 190, 198, { block: 30, seed: 11 });
      G.rr(g, 40, 690, 150, 70, 8, G.C.water, 3);
      G.text(g, api.L({ en: 'Mikveh', he: 'מקווה' }), 115, 500, { size: 18, color: '#fff', outline: 5, outlineColor: G.C.ink });
      G.rr(g, 186, 560 + door.open * 0, 18, 100, 3, G.C.woodDark, 3);
      if (door.open > 0) { g.save(); g.globalAlpha = door.open; G.rr(g, 186, 560, 18, 100, 3, '#2a2018', 3); g.restore(); }
      pin.draw(g);
      // table with terumah
      G.rr(g, 340, 640, 140, 16, 4, G.C.woodLight, 3); G.line(g, 360, 656, 360, 668, 4); G.line(g, 460, 656, 460, 668, 4);
      G.ell(g, 410, 634, 40, 10, '#fff', 3); G.ell(g, 410, 634, 34, 7, null, 2, G.C.gold);
      G.loaf(g, 410, 626, 0.8);
      G.text(g, api.L({ en: 'Terumah', he: 'תרומה' }), 410, 596, { size: 15, color: '#fff', outline: 5, outlineColor: G.C.ink });
      miriam.draw(g, t); eli.draw(g, t); eli.drawBubble(g);
      // time-of-day slider
      G.rr(g, 40, 800, 460, 100, 20, 'rgba(255,250,240,0.92)', 3);
      G.rr(g, track.x1, track.y - 6, track.x2 - track.x1, 12, 6, '#e6d6b0', 2.5);
      G.text(g, '☀', track.x1 - 26, track.y, { size: 22, color: '#f5a623' }); G.text(g, '★', track.x2 + 26, track.y, { size: 22, color: '#5b6fc4' });
      const hx = Kit.lerp(track.x1, track.x2, v);
      G.circ(g, hx, track.y, 20, v > 0.65 ? '#fff6b0' : '#ffcf3f', 3);
      G.text(g, api.L({ en: 'Drag to make it evening', he: 'גררו כדי שיגיע הערב' }), 270, 822, { size: 14 });
    },
  };
};

// ---------------------------------------------------------------
// 1-3 · The Bone Bridge. Over a bone is fine; moving it is not.
// ---------------------------------------------------------------
W1.boneBridge = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 60, 640);
  const pin = new Kit.Pin('rope', 40, 300, 120, 300);
  const log = { a: -Math.PI / 2 };            // pivots at (150,520); 0 = lying across
  const see = { a: 0 };                       // seesaw tilt (pivot 270,648)
  let going = false, logDown = false;

  function cross() {
    if (going) return; going = true; api.setButtons([]);
    if (logDown) {
      eli.walk([[110, 640], [130, 600], [150, 516], [390, 516], [430, 600], [450, 640], [505, 640]], () => { eli.mood = 'happy'; api.complete(); });
      return;
    }
    eli.walk([[110, 640], [168, 632]], () => {
      tw.to(see, { a: 0.2 }, 0.35, () => {
        const r = T.moveViaPlank('bone');
        if (r.result) {
          eli.glow = 'tm'; eli.mood = 'oh';
          api.fail({ en: 'The plank tipped and lifted the bone. Moving a bone counts like carrying it [משא]!', he: 'הקרש נטה והרים את העצם. הזזת עצם היא כמו משא!' });
        }
      });
    });
  }

  return {
    intro: { en: 'A bone fell in the ravine. Help Eli cross!', he: 'עצם נפלה לנקיק. עזרו לאלי לעבור!' },
    buttons: [Kit.go(cross)],
    update(dt) { tw.update(dt); pin.update(dt); eli.update(dt); },
    down(p) {
      if (pin.hit(p)) pin.pull(() => tw.to(log, { a: 0 }, 0.6, () => { logDown = true; api.sfx('thunk'); }));
    },
    hot() { return { pin: pin.ring }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 8 });
      G.rr(g, 150, 520, 240, 440, 0, '#5d4029', 3);
      G.ground(g, 0, 648, 160, 320, 'grass'); G.ground(g, 0, 524, 110, 130, 'grass');
      G.rr(g, 108, 560, 44, 90, 0, '#b7a079', 3); G.line(g, 110, 600, 150, 600, 2.5); G.line(g, 110, 620, 150, 620, 2.5); // steps
      G.ground(g, 380, 648, 160, 320, 'grass'); G.ground(g, 430, 524, 110, 130, 'grass');
      G.rr(g, 388, 560, 44, 90, 0, '#b7a079', 3); G.line(g, 390, 600, 430, 600, 2.5); G.line(g, 390, 620, 430, 620, 2.5);
      // pivot rock and seesaw with the bone on its far end
      G.poly(g, [[240, 820], [300, 820], [285, 652], [255, 652]], '#9c8b6e', 3);
      g.save(); g.translate(270, 648); g.rotate(see.a);
      G.plank(g, 0, 0, 240, 0, 14);
      G.bone(g, 100, -14, 0.9, 0.2, true);
      g.restore();
      G.sign(g, 470, 760, api.L({ en: 'A bone fell here', he: 'כאן נפלה עצם' }), { w: 120, size: 13 });
      // the log (rope from its top to the pin)
      const lx = 150 + Math.cos(log.a) * 250, ly = 520 + Math.sin(log.a) * 250;
      if (!pin.out) G.rope(g, 120, 300, lx, ly);
      g.save(); g.translate(150, 520); g.rotate(log.a); G.log(g, 125, -12, 250, 0); g.restore();
      pin.draw(g);
      G.text(g, '🚩', 505, 600, { size: 30 });
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-4a · Free the Gardener (pin puzzle)
// ---------------------------------------------------------------
W1.gardenerShed = api => {
  const tw = new Kit.Tweens();
  const gad = new Chars.Actor('gad', 250, 640);
  const pBarrel = new Kit.Pin('barrel', 340, 352, 520, 352);
  const pDoor = new Kit.Pin('door', 500, 600, 404, 600);
  const barrel = { y: 314, a: 0, vis: true }, door = { a: 0 };
  let wet = false, splash = 0, bees = 0;

  return {
    intro: { en: 'Gad the gardener [גד הגנן] is stuck in his shed. Pull the pins in the right order!', he: 'גד הגנן תקוע בצריף. משכו את היתדות בסדר הנכון!' },
    update(dt) {
      tw.update(dt); pBarrel.update(dt); pDoor.update(dt); gad.update(dt);
      if (splash > 0) splash -= dt; if (bees > 0) bees += dt;
    },
    down(p) {
      if (pBarrel.hit(p)) {
        pBarrel.pull(() => tw.to(barrel, { y: 420, a: 1.4 }, 0.4, () => {
          api.sfx('splash'); wet = true; splash = 1.2;
          api.say({ en: 'Splash! The bees are calm and sleepy now.', he: 'שפריץ! הדבורים רגועות ומנומנמות.' }, 'good');
          tw.to(barrel, { y: 700, a: 2 }, 0.5, () => { barrel.vis = false; });
        }));
        return;
      }
      if (pDoor.hit(p)) {
        pDoor.pull(() => tw.to(door, { a: 1 }, 0.4, () => {
          if (!wet) {
            bees = 0.01; gad.mood = 'oh';
            api.fail({ en: 'Bzzz! Opening the door shook the hive. Calm the bees first!', he: 'בזזז! פתיחת הדלת טלטלה את הכוורת. קודם צריך להרגיע את הדבורים!' });
            return;
          }
          gad.mood = 'happy'; gad.walk([[420, 640], [505, 640]], () => api.complete());
        }));
      }
    },
    hot() { return { barrel: pBarrel.ring, door: pDoor.ring }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 12 });
      G.ground(g, 0, 648, 540, 320, 'grass');
      G.stoneWall(g, 80, 360, 340, 288, { block: 30, seed: 4 });
      G.rr(g, 100, 380, 300, 258, 6, '#7a5a3a', 3);                   // inside
      G.poly(g, [[60, 362], [440, 362], [400, 300], [100, 300]], '#8d6e63', 3);
      G.rr(g, 130, 560, 60, 70, 4, G.C.woodLight, 2.5); G.text(g, '🪴', 160, 545, { size: 26 });
      // door
      g.save(); g.translate(404, 540); g.scale(1 - door.a * 0.8, 1); G.rr(g, 0, 0, 18, 100, 3, G.C.woodDark, 3); g.restore();
      // shelf for the barrel
      if (barrel.vis) { g.save(); g.translate(470, barrel.y); g.rotate(barrel.a); G.barrel(g, 0, 0, 0.9); g.restore(); }
      if (splash > 0) for (let i = 0; i < 8; i++) G.circ(g, 450 + Math.sin(i * 7) * 30, 420 + (1.2 - splash) * 60 + i * 6, 5, G.C.water, 2);
      G.line(g, 470, 362, 470, 410, 3);
      G.hive(g, 470, 450, 1, wet);
      if (!wet) for (let i = 0; i < 3; i++) G.bee(g, 470 + Math.sin(t / 300 + i * 2) * 26, 430 + Math.cos(t / 260 + i) * 14);
      if (bees > 0) for (let i = 0; i < 9; i++) G.bee(g, 380 + Math.sin(t / 120 + i) * 60, 560 + Math.cos(t / 150 + i * 1.3) * 50);
      pBarrel.draw(g); pDoor.draw(g);
      gad.draw(g, t); gad.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-4b · Prune the branch. A tree's branches over a grave are an ohel.
// Also used in the Chanukah oil run (hero 'yehuda', pruner 'helper').
// ---------------------------------------------------------------
W1.pruneTree = (hero = 'eli', prunerKind = 'gad') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor(hero, 40, 808);
  const pruner = new Chars.Actor(prunerKind, 262, 556, { dir: -1 });
  // branches: from the trunk top (200,400)
  const br = {
    grave: { to: [90, 320], leaf: [80, 300, 70], over: 'grave', cut: 0 },
    road:  { to: [370, 470], leaf: [410, 470, 70], over: 'road', cut: 0 },
    up:    { to: [210, 250], leaf: [210, 220, 60], over: 'none', cut: 0 },
  };
  let going = false, cutting = false;

  function roadTamei() {
    const reachesRoad = !br.road.cut, reachesGrave = !br.grave.cut;
    return T.underSameOhel(reachesRoad, reachesGrave, { sturdy: true }).result;
  }
  function cut(key) {
    if (cutting || br[key].cut) return; cutting = true;
    pruner.mood = 'happy'; api.sfx('whoosh');
    tw.to(br[key], { cut: 1 }, 0.7, () => {
      cutting = false;
      if (key === 'up') api.say({ en: 'That branch wasn\'t over the road or the grave, so nothing changed.', he: 'הענף הזה לא היה מעל הדרך או הקבר, ולכן לא השתנה כלום.' });
      else if (!roadTamei()) api.say({ en: 'Now no single roof [אהל] covers both the grave and the road!', he: 'עכשיו אין אוהל אחד מעל הקבר ומעל הדרך!' }, 'good');
    });
  }
  function goNow() {
    if (going) return; going = true; api.setButtons([]);
    if (roadTamei()) {
      eli.walk([[250, 808]], () => {
        eli.mood = 'no';
        api.fail({ en: 'The branch is one roof [אהל] over the grave AND the road. Everything under it is impure [טמא]!', he: 'הענף הוא אוהל אחד מעל הקבר ומעל הדרך. כל מה שתחתיו טמא!' });
      });
      return;
    }
    eli.walk([[505, 808]], () => { eli.mood = 'happy'; api.complete(); });
  }

  function hitBranch(p, b) { const [x, y, r] = b.leaf; return !b.cut && Kit.near(p, x, y, r); }
  return {
    intro: { en: 'This tree spreads over a grave and over the road. Tap a branch to cut it.', he: 'העץ מסכך על קבר ועל הדרך. הקישו על ענף כדי לגזום אותו.' },
    buttons: [Kit.go(goNow)],
    update(dt) { tw.update(dt); eli.update(dt); pruner.update(dt); },
    down(p) { for (const k of ['road', 'grave', 'up']) if (hitBranch(p, br[k])) { cut(k); return; } },
    hot() { return { road: br.road.leaf.slice(0, 2), grave: br.grave.leaf.slice(0, 2), up: br.up.leaf.slice(0, 2) }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 14 });
      G.ground(g, 0, 816, 540, 160, 'dirt');
      G.ground(g, 0, 560, 300, 260, 'grass');
      G.grave(g, 80, 566, 1);
      // ohel tint over the road while the road branch connects to the grave
      if (roadTamei()) G.ohelTint(g, [[330, 480], [490, 480], [520, 816], [300, 816]]);
      // trunk and branches
      G.poly(g, [[188, 562], [214, 562], [208, 400], [194, 400]], G.C.wood, 3);
      for (const k of ['grave', 'road', 'up']) {
        const b = br[k]; if (b.cut >= 1) continue;
        g.save(); g.globalAlpha = 1 - b.cut;
        const dy = b.cut * 300;
        G.line(g, 201, 400 + dy, b.to[0], b.to[1] + dy, 14, G.C.ink); G.line(g, 201, 400 + dy, b.to[0], b.to[1] + dy, 9, G.C.wood);
        const [lx, ly, r] = b.leaf; G.circ(g, lx, ly + dy, r, G.C.leafDark, 3); G.circ(g, lx - 8, ly - 8 + dy, r * 0.7, G.C.leaf, 0);
        g.restore();
      }
      G.text(g, api.L({ en: 'The road', he: 'הדרך' }), 400, 900, { size: 18, color: '#fff', outline: 5, outlineColor: G.C.ink });
      G.text(g, '✂', 410, 470, { size: 26, color: '#fff', outline: 4, outlineColor: G.C.ink });
      pruner.draw(g, t); eli.draw(g, t); eli.drawBubble(g); pruner.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-5 · Stones That Don't Wobble. Cross a Beit HaPeras on solid
// stones or a strong animal. Also used (purpose 'mikdash') in C-5.
// ---------------------------------------------------------------
W1.STONES = [
  [150, 730, 1], [300, 740, 0], [420, 720, 1],
  [110, 610, 0], [240, 620, 1], [380, 600, 0],
  [170, 500, 1], [310, 490, 0], [440, 480, 1],
  [100, 380, 0], [240, 380, 1], [400, 360, 1],
  [180, 270, 0], [330, 260, 1],
].map(([x, y, solid], i) => ({ i, x, y, solid: !!solid, tested: false, wob: 0 }));

W1.stones = (hero = 'eli', mate = 'miriam', purpose = 'terumah') => api => {
  const T = api.T, tw = new Kit.Tweens();
  const stones = W1.STONES.map(s => ({ ...s }));
  const START = { x: 270, y: 850 }, REACH = 160;
  const eli = new Chars.Actor(hero, 240, 860), mate1 = new Chars.Actor(mate, 300, 860);
  const dStrong = { x: 90, y: 900 }, dWeak = { x: 450, y: 900, wob: 0 };
  const path = []; let going = false, riding = null;
  const near = (a, b) => a === START ? b.y >= 690 : Math.hypot(a.x - b.x, a.y - b.y) <= REACH;
  const lastNode = () => path.length ? path[path.length - 1] : START;
  const reachesEnd = () => path.length && lastNode().y <= 300;

  function tap(s) {
    // tapping tests the stone, and adds it to the path if it's next in line
    s.tested = true;
    if (s.solid) api.sfx('thunk'); else { api.sfx('wobble'); tw.to(s, { wob: 0.25 }, 0.12, () => tw.to(s, { wob: -0.25 }, 0.12, () => tw.to(s, { wob: 0 }, 0.12))); }
    if (path[path.length - 1] === s) { path.pop(); return; }
    if (path.includes(s)) return;
    if (near(lastNode(), s)) path.push(s);
  }
  function hop() {
    if (going) return;
    if (!reachesEnd()) { api.say({ en: 'Make a path of stones all the way to the far side.', he: 'בנו שביל אבנים עד הצד השני.' }); return; }
    going = true; api.setButtons([]);
    const seq = path.slice();
    const step = () => {
      const s = seq.shift();
      if (!s) { eli.walk([[250, 200]], null); mate1.walk([[300, 200]], () => api.complete()); return; }
      eli.walk([[s.x, s.y - 6]], () => {
        const r = T.crossField({ field: 'plowed', method: 'stones', solid: s.solid, purpose });
        if (!r.tahor) {
          eli.glow = 'tm'; eli.mood = 'oh';
          api.fail({ en: 'Eli didn\'t wobble at all, but a wobbly stone counts like the dirt itself!', he: 'אלי לא התנדנד בכלל, אבל אבן שמתנדנדת היא כמו העפר עצמו!' });
          return;
        }
        mate1.walk([[s.x + 24, s.y - 4]]); setTimeout(step, 320);
      }, 260);
    };
    step();
  }
  function ride(strong) {
    if (going) return; going = true; api.setButtons([]);
    riding = strong ? dStrong : dWeak; eli.visible = false; mate1.visible = false;
    const target = { y: 200 };
    tw.to(riding, { x: 270 }, 0.4, () => {
      tw.to(riding, { y: strong ? 200 : 520 }, strong ? 2.2 : 1.4, () => {
        const r = T.crossField({ field: 'plowed', method: 'ride', strong, purpose });
        if (r.tahor) { api.complete(); return; }
        tw.to(dWeak, { wob: 1 }, 0.6);
        api.fail({ en: 'This donkey is weak, its knees are knocking! Riding a weak animal counts like walking on your own feet.', he: 'החמור הזה חלש, הברכיים שלו נוקשות! רכיבה על בהמה שכוחה רע היא כמו הליכה ברגליים.' });
      });
    });
  }
  return {
    intro: { en: 'A Beit HaPeras [בית הפרס]: tiny bones might be in the dirt. Miriam has terumah [תרומה]. Cross without touching the dirt!', he: 'בית הפרס: אולי יש עצמות קטנות בעפר. מרים נושאת תרומה. עברו בלי לגעת בעפר!' },
    buttons: [Kit.go(hop, { en: 'Hop across!', he: 'קפצו!' })],
    update(dt) { tw.update(dt); eli.update(dt); mate1.update(dt); },
    down(p) {
      if (going) return;
      for (const s of stones) if (Kit.near(p, s.x, s.y, 34)) { tap(s); return; }
      if (Kit.near(p, dStrong.x, dStrong.y - 20, 50)) { ride(true); return; }
      if (Kit.near(p, dWeak.x, dWeak.y - 20, 50)) { ride(false); return; }
    },
    hot() { const h = { donkeyStrong: [dStrong.x, dStrong.y - 20], donkeyWeak: [dWeak.x, dWeak.y - 20] }; for (const s of stones) h['s' + s.i] = [s.x, s.y]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 21 });
      G.ground(g, 0, 140, 540, 120, 'grass');
      G.river(g, -10, 250, 50, 560, t); G.river(g, 500, 250, 50, 560, t);
      G.rr(g, 40, 250, 460, 560, 0, '#b88d58', 3);
      Kit.furrows(g, 40, 250, 460, 560);
      G.ground(g, 0, 810, 540, 160, 'grass');
      G.sign(g, 270, 236, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 300, size: 14, post: false });
      // path line
      if (path.length) { G.path(g, [[START.x, START.y], ...path.map(s => [s.x, s.y])]); g.setLineDash([10, 8]); g.lineWidth = 5; g.strokeStyle = '#fff'; g.stroke(); g.setLineDash([]); }
      for (const s of stones) G.stoneTile(g, s.x, s.y, s.solid ? 30 : 24, { wobbly: !s.solid, wob: s.wob, tested: s.tested });
      for (const s of path) G.circ(g, s.x, s.y, 6, G.C.gold, 2);
      G.donkey(g, dStrong.x, dStrong.y, 0.7, { strong: true, phase: riding === dStrong ? t / 80 : 0 });
      G.donkey(g, dWeak.x, dWeak.y, 0.6, { strong: false, phase: riding === dWeak || dWeak.wob ? t / 60 : 0 });
      if (riding) { Chars.draw(g, hero, riding.x - 4, riding.y - 26, { s: 0.75 }); Chars.draw(g, mate, riding.x + 18, riding.y - 24, { s: 0.7 }); }
      if (!going) { G.text(g, api.L({ en: 'strong', he: 'חזק' }), dStrong.x, 942, { size: 13 }); G.text(g, api.L({ en: 'tired', he: 'עייף' }), dWeak.x, 942, { size: 13 }); }
      mate1.draw(g, t); eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-6a · Gad's cart: make a soft landing, then get the blower
// ---------------------------------------------------------------
W1.cartDrop = api => {
  const tw = new Kit.Tweens();
  const pCart = new Kit.Pin('cart', 110, 420, 310, 420);
  const pHay = new Kit.Pin('hay', 316, 500, 316, 650);
  const cart = { y: 400, a: 0 }, hay = { x: 400, y: 600 };
  const eli = new Chars.Actor('eli', 450, 780, { dir: -1 }), gad = new Chars.Actor('gad', 80, 780);
  let hayDown = false, done = false;
  return {
    intro: { en: 'Gad\'s leaf blower is up in his cart. Bring it down without breaking it!', he: 'המפוח של גד נמצא בעגלה למעלה. הורידו אותו בלי לשבור!' },
    update(dt) { tw.update(dt); pCart.update(dt); pHay.update(dt); eli.update(dt); gad.update(dt); },
    down(p) {
      if (pHay.hit(p)) { pHay.pull(() => tw.to(hay, { x: 220, y: 780 }, 0.6, () => { hayDown = true; api.sfx('thunk'); })); return; }
      if (pCart.hit(p)) pCart.pull(() => tw.to(cart, { y: hayDown ? 730 : 760 }, 0.45, () => {
        if (!hayDown) { cart.a = 0.3; api.sfx('fail'); api.fail({ en: 'Crash! The cart hit the hard floor. Make a soft landing first!', he: 'בום! העגלה נחבטה ברצפה. קודם הכינו נחיתה רכה!' }); return; }
        api.sfx('thunk'); if (done) return; done = true;
        gad.walk([[190, 780]], () => {
          gad.hold = 'blower'; gad.mood = 'happy';
          gad.talk(api.L({ en: 'Here, Eli. You check the ground yourself: that\'s how the Sages said to do it!', he: 'קח, אלי. תבדוק את הקרקע בעצמך, כך אמרו חכמים!' }), 3200);
          setTimeout(() => { gad.hold = null; eli.hold = 'blower'; eli.mood = 'happy'; }, 1800);
          setTimeout(() => api.complete(), 3300);
        });
      }));
    },
    hot() { return { cart: pCart.ring, hay: pHay.ring }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 31 });
      G.ground(g, 0, 788, 540, 180, 'grass');
      G.stoneWall(g, 120, 250, 20, 538, { block: 20, seed: 2 }); G.stoneWall(g, 300, 250, 20, 400, { block: 20, seed: 3 });
      G.poly(g, [[320, 560], [500, 520], [500, 540], [320, 650]], '#a58b62', 3);   // hay ledge
      G.hay(g, hay.x, hay.y, 0.8);
      g.save(); g.translate(220, cart.y); g.rotate(cart.a); G.cart(g, 0, 0, 0.8); G.blower(g, -6, -36, 0.8, -0.3); g.restore();
      pCart.draw(g); pHay.draw(g);
      gad.draw(g, t); eli.draw(g, t); gad.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-6b · The Leaf-Blower Field ⭐ (Berakhot 19b; Rambam Eruvin 6:17;
// Korban Pesach 6:8)
// ---------------------------------------------------------------
W1.FIELD = {
  cols: 6, rows: 8, size: 70, x0: 60, y0: 230, air: 14,
  chips: ['7,1', '7,4', '6,2', '5,0', '5,4', '4,2', '3,1', '3,5', '2,3', '1,0', '1,4', '0,2'],
  big: ['4,4', '2,0'],
};
W1.blowerField = api => {
  const T = api.T, F = W1.FIELD;
  const eli = new Chars.Actor('eli', 270, 870, { hold: 'blower' });
  const key = (r, c) => r + ',' + c;
  const revealed = new Set(F.big);
  const chips = new Set(F.chips), big = new Set(F.big);
  let mode = 'blow', air = F.air, path = [], going = false, gust = null;
  const cx = c => F.x0 + c * F.size + F.size / 2, cy = r => F.y0 + r * F.size + F.size / 2;
  const isBone = k => chips.has(k) || big.has(k);
  const cell = p => { const c = Math.floor((p.x - F.x0) / F.size), r = Math.floor((p.y - F.y0) / F.size); return (r >= 0 && r < F.rows && c >= 0 && c < F.cols) ? [r, c] : null; };
  function frontier(r, c) {
    if (r === F.rows - 1) return true;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (revealed.has(key(r + dr, c + dc)) && !big.has(key(r + dr, c + dc))) return true;
    return false;
  }
  function blow(r, c) {
    if (air <= 0) { api.say({ en: 'Out of air! Press ↻ to start again, and blow only where you mean to walk.', he: 'נגמר האוויר! לחצו ↻ והתחילו שוב, ונשפו רק איפה שתלכו.' }); return; }
    if (!frontier(r, c)) { api.say({ en: 'Blow a little at a time, starting near Eli.', he: 'נשפו מעט מעט, החל מליד אלי.' }); return; }
    air--; api.sfx('blow'); gust = { r, c, t: 0.5 };
    let found = false;
    for (const dc of [-1, 0, 1]) { const k = key(r, c + dc); if (c + dc >= 0 && c + dc < F.cols) { if (!revealed.has(k) && chips.has(k)) found = true; revealed.add(k); } }
    if (found) api.say({ en: 'A tiny bone [עצם כשעורה]! Don\'t step on it, and don\'t kick it.', he: 'עצם קטנה כשעורה! אל תדרכו עליה ואל תזיזו אותה.' }, 'info');
  }
  function addPath(r, c) {
    const k = key(r, c);
    if (path.length && path[path.length - 1] === k) { path.pop(); return; }
    if (path.includes(k)) return;
    if (revealed.has(k) && isBone(k)) { api.say({ en: 'There\'s a bone there. Go around it!', he: 'יש שם עצם. עקפו אותה!' }); return; }
    if (!path.length) { if (r !== F.rows - 1) { api.say({ en: 'Start the path from the bottom row, next to Eli.', he: 'התחילו את השביל מהשורה התחתונה, ליד אלי.' }); return; } path.push(k); return; }
    const [lr, lc] = path[path.length - 1].split(',').map(Number);
    if (Math.abs(lr - r) + Math.abs(lc - c) === 1) path.push(k);
  }
  function setMode(m) { mode = m; api.setButtons(buttons()); }
  function buttons() {
    return [
      { id: 'blow', label: { en: '💨 Blow', he: '💨 נשיפה' }, cls: 'btn-navy', on: mode === 'blow', onClick: () => setMode('blow') },
      { id: 'path', label: { en: '✏️ Path', he: '✏️ שביל' }, cls: 'btn-navy', on: mode === 'path', onClick: () => setMode('path') },
      Kit.go(walk),
    ];
  }
  function walk() {
    if (going) return;
    const last = path[path.length - 1];
    if (!last || Number(last.split(',')[0]) !== 0) { api.say({ en: 'Draw a path all the way to the top.', he: 'ציירו שביל עד למעלה.' }); return; }
    going = true; api.setButtons([]);
    const seq = path.slice();
    const step = () => {
      const k = seq.shift();
      if (!k) { eli.walk([[eli.x, 190]], () => { eli.mood = 'happy'; api.complete(); }); return; }
      const [r, c] = k.split(',').map(Number);
      eli.walk([[cx(c), cy(r) + 20]], () => {
        if (!revealed.has(k)) {
          eli.mood = 'oh';
          if (chips.has(k)) { revealed.add(k); eli.glow = 'tm'; }
          api.fail({ en: 'You didn\'t check that tile! The Sages said: blow on the ground before each step.', he: 'לא בדקתם את המשבצת הזאת! חכמים אמרו: מנפח את הקרקע לפני כל צעד.' });
          return;
        }
        const ok = T.crossField({ field: 'plowed', method: 'blow', purpose: 'pesach' }).tahor;
        if (!ok) { api.fail('?'); return; }
        step();
      });
    };
    step();
  }
  return {
    intro: { en: 'Eli is on his way to bring the Korban Pesach [קרבן פסח]. Blow on the dirt to find the tiny bones, then draw a path around them.', he: 'אלי בדרך להקריב קרבן פסח. נשפו על העפר כדי למצוא עצמות קטנות, וציירו שביל שעוקף אותן.' },
    buttons: buttons(),
    update(dt) { eli.update(dt); if (gust) { gust.t -= dt; if (gust.t <= 0) gust = null; } },
    down(p) {
      if (going) return;
      const rc = cell(p); if (!rc) return;
      if (mode === 'blow') blow(rc[0], rc[1]); else addPath(rc[0], rc[1]);
    },
    hot() { const h = {}; for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) h['t' + r + '_' + c] = [cx(c), cy(r)]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 41 });
      G.ground(g, 0, 140, 540, 90, 'grass');
      G.sign(g, 270, 222, api.L({ en: 'Beit HaPeras: a grave was plowed here', he: 'בית הפרס: נחרש כאן קבר' }), { w: 300, size: 14, post: false });
      G.ground(g, 0, 790, 540, 180, 'grass');
      for (let r = 0; r < F.rows; r++) for (let c = 0; c < F.cols; c++) {
        const k = key(r, c), x = F.x0 + c * F.size, y = F.y0 + r * F.size;
        const rev = revealed.has(k);
        G.rr(g, x + 2, y + 2, F.size - 4, F.size - 4, 8, rev ? '#e6c995' : '#a97a45', 2.5);
        if (!rev) { const rr2 = G.rng(r * 9 + c); for (let i = 0; i < 5; i++) G.circ(g, x + 10 + rr2() * 50, y + 10 + rr2() * 50, 3 + rr2() * 3, '#8a5f33', 0); }
        if (rev && chips.has(k)) G.bone(g, x + F.size / 2, y + F.size / 2, 0.6, 0.5, true);
        if (big.has(k)) G.bone(g, x + F.size / 2, y + F.size / 2, 1.1, -0.3, true);
      }
      if (path.length) {
        G.path(g, path.map(k => { const [r, c] = k.split(',').map(Number); return [cx(c), cy(r)]; }));
        g.lineWidth = 9; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
      }
      if (gust) { const gx = cx(gust.c), gy = cy(gust.r); for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(gx, gy, 20 + i * 14 + (0.5 - gust.t) * 40, 0, Math.PI * 2); g.lineWidth = 3; g.strokeStyle = `rgba(255,255,255,${gust.t})`; g.stroke(); } }
      // air meter
      G.rr(g, 14, 800, 120, 34, 17, '#fff', 3); G.text(g, '💨 ' + air, 74, 818, { size: 18 });
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-7 · The Washed-Away Mark. Lime a little wider than the tumah,
// not much wider (Rambam Tumat Met 8:9).
// ---------------------------------------------------------------
W1.limeMarks = api => {
  const T = api.T, tw = new Kit.Tweens();
  const spots = [
    { id: 'field', cx: 160, cy: 340, rx: 95, ry: 58, s: 0.7, label: { en: 'A lost grave', he: 'קבר שאבד' } },
    { id: 'branch', cx: 390, cy: 560, rx: 72, ry: 34, s: 0.7, label: { en: 'Branch over a grave', he: 'ענף מעל קבר' } },
    { id: 'stone', cx: 150, cy: 640, rx: 62, ry: 28, s: 0.7, label: { en: 'Jutting stone', he: 'אבן בולטת' } },
  ];
  const batya = new Chars.Actor('batya', 300, 400, { hold: 'bucket', dir: -1 });
  const zev = new Chars.Actor('zevulun', 470, 400, { dir: -1 });
  const pilgrims = [new Chars.Actor('pilgrimA', -40, 860), new Chars.Actor('pilgrimB', -100, 860), new Chars.Actor('farmer', 60, 540)];
  let drag = null, going = false;
  const handle = s => [s.cx + s.rx * s.s, s.cy];

  function check() {
    if (going) return;
    for (const s of spots) {
      const r = T.limeMark(s.rx * s.s, s.rx);
      if (r.result === 'tooTight') {
        api.mistake({ en: `Too tight at "${s.label.en}"! A traveler could brush the tumah [טומאה] without knowing. Leave some extra room.`, he: `צמוד מדי ב"${s.label.he}"! עובר דרך עלול לגעת בטומאה בלי לדעת. השאירו קצת מקום.` });
        return;
      }
      if (r.result === 'tooWide') {
        api.mistake({ en: `Too wide at "${s.label.en}"! The farmer says: "You painted half my field!" Don't waste good land.`, he: `רחב מדי ב"${s.label.he}"! החקלאי אומר: "צבעתם חצי שדה!" אל תפסידו את ארץ ישראל.` });
        return;
      }
    }
    going = true; api.setButtons([]);
    api.say({ en: 'Just right! The pilgrims can walk safely.', he: 'בדיוק! עולי הרגל יכולים לעבור בבטחה.' }, 'good');
    pilgrims[0].walk([[600, 860]]); pilgrims[1].walk([[600, 860]], () => api.complete(), 170);
  }
  return {
    intro: { en: 'The rain washed the lime marks away. Drag each white ring so it covers the tumah, a little wider but not too much.', he: 'הגשם מחק את ציוני הסיד. גררו כל טבעת לבנה כך שתכסה את הטומאה, קצת יותר, אבל לא הרבה.' },
    buttons: [{ id: 'check', label: { en: 'Let the pilgrims through', he: 'שחררו את עולי הרגל' }, cls: 'btn-green', onClick: check }],
    update(dt) { tw.update(dt); for (const a of [batya, zev, ...pilgrims]) a.update(dt); },
    down(p) { for (const s of spots) { const [hx, hy] = handle(s); if (Kit.near(p, hx, hy, 34)) { drag = s; return; } } },
    move(p) { if (drag) drag.s = Math.max(0.5, Math.min(2.2, (p.x - drag.cx) / drag.rx)); },
    up() { drag = null; },
    hot() { const h = {}; for (const s of spots) { h[s.id] = handle(s); h[s.id + ':c'] = [s.cx, s.cy]; h[s.id + ':rx'] = [s.rx, 0]; } return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 51 });
      G.ground(g, 0, 260, 540, 700, 'grass');
      G.ground(g, 0, 820, 540, 140, 'dirt');
      G.rr(g, 40, 270, 240, 150, 12, '#d8b56f', 3);                     // field
      G.tree(g, 420, 640, 0.9);                                          // tree with a branch out left
      G.line(g, 410, 540, 330, 540, 12, G.C.ink); G.line(g, 410, 540, 330, 540, 7, G.C.wood); G.circ(g, 330, 530, 34, G.C.leafDark, 3);
      G.stoneWall(g, 30, 560, 110, 60, { block: 26, seed: 6 }); G.rr(g, 130, 584, 60, 22, 5, '#e3d2a8', 3);  // wall with a jutting stone
      for (const s of spots) {
        g.setLineDash([8, 8]); G.ell(g, s.cx, s.cy, s.rx, s.ry, 'rgba(155,93,229,0.18)', 3, G.C.purple); g.setLineDash([]);
        G.ell(g, s.cx, s.cy, s.rx * s.s, s.ry * s.s, null, 9, G.C.lime); G.ell(g, s.cx, s.cy, s.rx * s.s, s.ry * s.s, null, 2, '#bdb59a');
        const [hx, hy] = handle(s); G.circ(g, hx, hy, 15, '#fff', 3); G.text(g, '↔', hx, hy, { size: 16 });
        G.text(g, api.L(s.label), s.cx, s.cy - s.ry - 18, { size: 13, color: '#fff', outline: 4, outlineColor: G.C.ink });
      }
      for (const a of [zev, batya, ...pilgrims]) a.draw(g, t);
      G.text(g, api.L({ en: 'The road to Yerushalayim', he: 'הדרך לירושלים' }), 270, 920, { size: 16, color: '#fff', outline: 5, outlineColor: G.C.ink });
    },
  };
};

// ---------------------------------------------------------------
// 1-8 · Read the White Marks (Rambam Tumat Met 8:11)
// ---------------------------------------------------------------
W1.readMarks = api => {
  const T = api.T, TILE = 62;
  const fields = [
    { id: 'A', x: 40, y: 230, pattern: 'oneStone', opts: { cell: 4 } },
    { id: 'B', x: 300, y: 230, pattern: 'twoStonesLimeBetween', opts: { row: 1 } },
    { id: 'C', x: 40, y: 540, pattern: 'twoStonesSherdsBetween', opts: {} },
    { id: 'D', x: 300, y: 540, pattern: 'fourEdges', opts: {} },
  ].map(f => ({ ...f, marked: new Set() }));
  const TIPS = {
    A: { en: 'Field A: one marked stone means the tumah is under it.', he: 'שדה א: אבן אחת מצוינת, הטומאה תחתיה.' },
    B: { en: 'Field B: two stones with lime between them: the tumah is between them.', he: 'שדה ב: שתי אבנים וסיד ביניהן: ביניהן טמא.' },
    C: { en: 'Field C: lime only on top, and broken pottery between: that\'s just a building. It\'s pure!', he: 'שדה ג: סיד רק על ראשיהן וחרס ביניהן: אין זה אלא בניין, וטהור!' },
    D: { en: 'Field D: all four edges are marked, so the whole field is impure [טמא]. A mark is never put far from the tumah.', he: 'שדה ד: ארבעת המצרים מצוינים, ולכן כל השדה טמאה, שאין מרחיקים את הציון מן הטומאה.' },
  };
  function check() {
    for (const f of fields) {
      const want = new Set(T.readMarks(f.pattern, f.opts).tamei);
      const same = want.size === f.marked.size && [...want].every(c => f.marked.has(c));
      if (!same) { api.mistake(TIPS[f.id]); return; }
    }
    api.setButtons([]); api.say({ en: 'You read every mark correctly!', he: 'קראתם את כל הסימנים נכון!' }, 'good');
    setTimeout(() => api.complete(), 900);
  }
  const cellAt = (f, p) => { const c = Math.floor((p.x - f.x) / TILE), r = Math.floor((p.y - f.y) / TILE); return (r >= 0 && r < 3 && c >= 0 && c < 3) ? r * 3 + c : -1; };
  return {
    intro: { en: 'Tap the squares that are impure [טמא]. Look closely at the lime marks!', he: 'הקישו על המשבצות הטמאות. הסתכלו היטב על סימני הסיד!' },
    buttons: [{ id: 'check', label: { en: 'Check', he: 'בדיקה' }, cls: 'btn-green', onClick: check }],
    down(p) {
      for (const f of fields) { const c = cellAt(f, p); if (c >= 0) { api.sfx('tap'); f.marked.has(c) ? f.marked.delete(c) : f.marked.add(c); return; } }
    },
    hot() { const h = {}; for (const f of fields) for (let c = 0; c < 9; c++) h[f.id + c] = [f.x + (c % 3) * TILE + TILE / 2, f.y + Math.floor(c / 3) * TILE + TILE / 2]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 61, far: false });
      G.ground(g, 0, 170, 540, 800, 'grass');
      for (const f of fields) {
        const S = TILE * 3;
        G.text(g, f.id, f.x + S / 2, f.y - 22, { size: 22, color: '#fff', outline: 5, outlineColor: G.C.ink });
        for (let c = 0; c < 9; c++) {
          const x = f.x + (c % 3) * TILE, y = f.y + Math.floor(c / 3) * TILE;
          G.rr(g, x + 2, y + 2, TILE - 4, TILE - 4, 6, f.marked.has(c) ? '#c9a3f2' : '#d8b56f', 2.5);
          if (f.marked.has(c)) G.text(g, api.L({ en: 'tamei', he: 'טמא' }), x + TILE / 2, y + TILE / 2 + 18, { size: 11, color: G.C.purple });
        }
        const midY = f.y + TILE * 1.5;
        if (f.pattern === 'oneStone') { G.ell(g, f.x + S / 2, f.y + S / 2, 22, 16, '#b7b0a1', 3); G.ell(g, f.x + S / 2, f.y + S / 2 - 6, 16, 8, G.C.lime, 2); }
        if (f.pattern === 'twoStonesLimeBetween' || f.pattern === 'twoStonesSherdsBetween') {
          for (const sx of [f.x - 16, f.x + S + 16]) { G.ell(g, sx, midY, 16, 22, '#b7b0a1', 3); G.ell(g, sx, midY - 12, 12, 7, G.C.lime, 2); }
          if (f.pattern === 'twoStonesLimeBetween') { g.globalAlpha = 0.8; G.rr(g, f.x + 4, midY - 8, S - 8, 16, 8, G.C.lime, 0); g.globalAlpha = 1; }
          else for (let i = 0; i < 6; i++) G.poly(g, [[f.x + 20 + i * 28, midY + 6], [f.x + 34 + i * 28, midY - 4], [f.x + 38 + i * 28, midY + 8]], G.C.clay, 2);
        }
        if (f.pattern === 'fourEdges') { G.rr(g, f.x - 8, f.y - 8, S + 16, S + 16, 10, null, 10, G.C.lime); G.rr(g, f.x - 8, f.y - 8, S + 16, S + 16, 10, null, 2, '#bdb59a'); }
      }
      G.text(g, api.L({ en: 'Lime [סיד] marks show where tumah might be', he: 'ציוני סיד מראים איפה יש טומאה' }), 270, 880, { size: 15, color: '#fff', outline: 5, outlineColor: G.C.ink });
    },
  };
};

// ---------------------------------------------------------------
// 1-9 · Trees or No Trees? (Rambam Tumat Met 10:10; Oholot 18:3)
// ---------------------------------------------------------------
W1.treesOrNot = api => {
  const T = api.T, tw = new Kit.Tweens();
  const eli = new Chars.Actor('eli', 270, 880, { hold: 'blower' });
  const zev = new Chars.Actor('zevulun', 460, 880, { dir: -1 });
  const F = { L: { x: 30, y: 360, w: 225, h: 400, trees: true }, R: { x: 285, y: 360, w: 225, h: 400, trees: false } };
  let pick = null, going = false;
  const donkey = { x: 80, y: 900, on: false };

  function choose(side) {
    pick = side; api.sfx('tap');
    api.setButtons([
      { id: 'blow', label: { en: '💨 Blow & walk', he: '💨 לנפח וללכת' }, onClick: () => cross('blow') },
      { id: 'ride', label: { en: '🫏 Strong donkey', he: '🫏 חמור חזק' }, onClick: () => cross('ride') },
      { id: 'walk', label: { en: '🚶 Just walk', he: '🚶 סתם ללכת' }, onClick: () => cross('walk') },
    ]);
  }
  function cross(method) {
    if (going || !pick) return; going = true; api.setButtons([]);
    const f = F[pick], kind = T.markedFieldKind(f.trees).field;
    const r = T.crossField({ field: kind, method, strong: true, purpose: 'pesach' });
    const mx = f.x + f.w / 2;
    if (method === 'ride') { donkey.on = true; eli.visible = false; tw.to(donkey, { x: mx }, 0.5); }
    const mover = method === 'ride' ? null : eli;
    const midY = f.y + f.h / 2;
    const after = () => {
      if (r.tahor) {
        const done = () => { eli.mood = 'happy'; api.complete(); };
        if (mover) mover.walk([[mx, 300]], done); else tw.to(donkey, { y: 330 }, 1, done);
        return;
      }
      eli.glow = 'tm'; eli.mood = 'oh';
      if (r.reason === 'ohel') api.fail({ en: 'No trees: a whole grave was lost in this field! It spreads tumah by roof [אהל], so blowing, stones and donkeys don\'t help. Go around!', he: 'אין אילנות: אבד בשדה הזה קבר שלם! הוא מטמא באוהל, ולכן ניפוח, אבנים וחמור אינם מועילים.' });
      else api.fail({ en: 'Walking right on a Beit HaPeras [בית הפרס] without checking: the tiny bones count by touch!', he: 'הליכה בבית הפרס בלי בדיקה: עצם כשעורה מטמאה במגע!' });
    };
    if (mover) mover.walk([[mx, 790], [mx, midY]], after); else setTimeout(() => tw.to(donkey, { y: midY + 40 }, 1, after), 500);
  }
  return {
    intro: { en: 'Two marked fields. Which one can a Kohen [כהן] cross, and how? Tap a field.', he: 'שני שדות מצוינים. באיזה מהם כהן יכול לעבור, ואיך? הקישו על שדה.' },
    update(dt) { tw.update(dt); eli.update(dt); zev.update(dt); },
    down(p) {
      if (going) return;
      for (const k of ['L', 'R']) { const f = F[k]; if (Kit.inRect(p, f.x, f.y, f.w, f.h)) { choose(k); return; } }
      if (Kit.near(p, zev.x, zev.y - 50, 50)) zev.talk(api.L({ en: 'When a field is marked, look for trees!', he: 'כשיש שדה מצוינת, חפשו אילנות!' }), 2500);
    },
    hot() { return { L: [F.L.x + 110, F.L.y + 200], R: [F.R.x + 110, F.R.y + 200], zev: [zev.x, zev.y - 50] }; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 71 });
      G.ground(g, 0, 270, 540, 700, 'grass');
      G.rr(g, -10, 270, 560, 70, 0, G.C.dirtLight, 3);
      G.text(g, api.L({ en: 'to Yerushalayim ➜', he: 'לירושלים ➜' }), 400, 304, { size: 16 });
      for (const k of ['L', 'R']) {
        const f = F[k];
        G.rr(g, f.x, f.y, f.w, f.h, 10, '#c9a368', 3);
        Kit.furrows(g, f.x, f.y, f.w, f.h);
        G.rr(g, f.x - 5, f.y - 5, f.w + 10, f.h + 10, 12, null, 8, G.C.lime);
        if (f.trees) { G.tree(g, f.x + 60, f.y + 170, 0.55, 'olive'); G.tree(g, f.x + 160, f.y + 270, 0.55, 'olive'); G.tree(g, f.x + 70, f.y + 370, 0.5, 'olive'); }
        if (pick === k) G.rr(g, f.x - 10, f.y - 10, f.w + 20, f.h + 20, 14, null, 5, G.C.gold);
      }
      G.ground(g, 0, 800, 540, 160, 'dirt');
      if (donkey.on) { G.donkey(g, donkey.x, donkey.y, 0.6, { phase: t / 80 }); Chars.draw(g, 'eli', donkey.x, donkey.y - 22, { s: 0.75 }); }
      zev.draw(g, t); eli.draw(g, t); zev.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// 1-10 · The Pilgrims' Path (Rambam Korban Pesach 6:8)
// ---------------------------------------------------------------
W1.pilgrimsPath = api => {
  const T = api.T;
  const eli = new Chars.Actor('eli', 270, 910);
  const paths = [
    { id: 'furrow', pts: [[270, 900], [90, 700], [80, 450], [210, 300]], kind: 'furrow' },
    { id: 'trodden', pts: [[270, 900], [200, 700], [240, 480], [262, 300]], kind: 'trodden' },
    { id: 'goat', pts: [[270, 900], [360, 700], [330, 480], [290, 300]], kind: 'goat' },
    { id: 'grass', pts: [[270, 900], [470, 720], [460, 460], [320, 300]], kind: 'grass' },
  ];
  const crowd = [new Chars.Actor('pilgrimA', 228, 560, { s: 0.6 }), new Chars.Actor('pilgrimB', 250, 420, { s: 0.55 }), new Chars.Actor('pilgrimC', 214, 650, { s: 0.65 })];
  for (const c of crowd) c.walk([[258, 320]], null, 22);
  let going = false;
  function distSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1]; const k = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p.x - a[0] - k * dx, p.y - a[1] - k * dy); }
  function choose(pa) {
    if (going) return; going = true;
    const trodden = pa.kind === 'trodden';
    const r = T.crossField({ field: 'plowed', method: trodden ? 'trodden' : 'walk', purpose: 'pesach' });
    if (r.tahor) { eli.walk(pa.pts.slice(1), () => { eli.mood = 'happy'; api.complete(); }, 170); return; }
    eli.walk(pa.pts.slice(1, 2), () => {
      eli.mood = 'oh';
      api.fail({ en: 'Not trodden enough! A tiny bone might still be hiding here. Look for the path that thousands of feet have pressed down.', he: 'לא מספיק דרוך! אולי עוד מסתתרת כאן עצם קטנה. חפשו את השביל שאלפי רגליים דרכו עליו.' });
    });
  }
  return {
    intro: { en: 'The last field before Yerushalayim is a Beit HaPeras [בית הפרס]. Which path should Eli take? Tap it.', he: 'השדה האחרון לפני ירושלים הוא בית הפרס. באיזה שביל ילך אלי? הקישו עליו.' },
    update(dt) { eli.update(dt); for (const c of crowd) { c.update(dt); if (!c.walking) { c.y = 700; c.walk([[258, 320]], null, 22); } } },
    down(p) {
      let best = null, bd = 30;
      for (const pa of paths) for (let i = 1; i < pa.pts.length; i++) { const d = distSeg(p, pa.pts[i - 1], pa.pts[i]); if (d < bd && p.y < 860) { bd = d; best = pa; } }
      if (best) choose(best);
    },
    hot() { const h = {}; for (const pa of paths) h[pa.id] = pa.pts[2]; return h; },
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 81, far: false });
      G.hills(g, 280, G.C.hill1, 8, 40);
      G.walls(g, 60, 140, 420, 150);
      G.ground(g, 0, 300, 540, 660, 'field');
      for (const pa of paths) {
        const col = pa.kind === 'trodden' ? '#ead2a4' : pa.kind === 'grass' ? '#9ccc65' : pa.kind === 'goat' ? '#cfae7c' : '#b58a52';
        Kit.trail(g, pa.pts, pa.kind === 'trodden' ? 40 : 30, col);
        if (pa.kind === 'furrow') { for (let i = 1; i < pa.pts.length; i++) { const [a, b] = [pa.pts[i - 1], pa.pts[i]]; for (let k = 0.1; k < 1; k += 0.15) G.line(g, Kit.lerp(a[0], b[0], k) - 10, Kit.lerp(a[1], b[1], k), Kit.lerp(a[0], b[0], k) + 10, Kit.lerp(a[1], b[1], k) - 4, 3, '#7a5530'); } }
        if (pa.kind === 'trodden') { for (let i = 1; i < pa.pts.length; i++) { const [a, b] = [pa.pts[i - 1], pa.pts[i]]; for (let k = 0; k < 1; k += 0.06) G.footprint(g, Kit.lerp(a[0], b[0], k) + (k * 100 % 2 > 1 ? 6 : -6), Kit.lerp(a[1], b[1], k), 0, 0.45); } }
        if (pa.kind === 'goat') { const [a, b] = [pa.pts[1], pa.pts[2]]; for (let k = 0.2; k < 1; k += 0.3) G.text(g, '‥', Kit.lerp(a[0], b[0], k), Kit.lerp(a[1], b[1], k), { size: 14, color: '#6b4a2b' }); }
      }
      G.sign(g, 450, 860, api.L({ en: 'Beit HaPeras', he: 'בית הפרס' }), { w: 120, size: 14 });
      for (const c of crowd) c.draw(g, t);
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

// ---------------------------------------------------------------
// The level list
// ---------------------------------------------------------------
const S = Kit.src;
const WORLD1 = [
  {
    id: '1-1', pack: 'w1', title: { en: 'Two Paths', he: 'שתי דרכים' },
    stages: [W1.twoPaths('eli')],
    hints: [{ en: 'The bridge on the long path is held by a golden pin. Tap the pin, then press Go!', he: 'הגשר בדרך הארוכה מוחזק ביתד זהב. הקישו על היתד ואז על "קדימה!"' }],
    why: {
      text: {
        en: 'Eli is a Kohen [כהן]. The Torah tells a Kohen not to become impure [טמא] from a dead person [מת].\n\nThat means not **touching** a grave [קבר], not **carrying** anything from a met, and not being **over** it or under the same roof [אהל] as it. So Eli takes the long way around.',
        he: 'אלי הוא כהן. התורה מצווה על הכהן שלא ייטמא למת.\n\nכלומר: לא **לגעת** בקבר, לא **לשאת**, ולא **להאהיל** עליו או להיות איתו תחת אותו גג. לכן אלי הולך בדרך הארוכה.',
      },
      sources: [
        S('לְנֶפֶשׁ לֹא יִטַּמָּא בְּעַמָּיו', 'Vayikra 21:1', 'ויקרא כא, א', 'Leviticus.21.1'),
        S('וְאֶחָד הַנּוֹגֵעַ בְּמֵת אוֹ הַמַּאֲהִיל אוֹ הַנּוֹשֵׂא', 'Rambam, Hilchot Avel 3:1', 'רמב"ם, הלכות אבל ג, א', 'Mishneh_Torah,_Mourning.3.1'),
        S('הַקֶּבֶר כָּל זְמַן שֶׁהַטֻּמְאָה בְּתוֹכוֹ מְטַמֵּא בְּמַגָּע וּבְאֹהֶל כְּמֵת דִּין תּוֹרָה', 'Rambam, Hilchot Tumat Met 2:15', 'רמב"ם, הלכות טומאת מת ב, טו', 'Mishneh_Torah,_Defilement_by_a_Corpse.2.15'),
      ],
    },
  },
  {
    id: '1-2', pack: 'w1', title: { en: 'The Mouse on the Beam', he: 'העכבר שעל הקורה' },
    stages: [W1.mouseBeam, W1.dinner],
    hints: [
      { en: 'A Kohen may go the mouse way. But can you get the mouse off the beam without anyone touching it? Look at the stick!', he: 'כהן רשאי ללכת בדרך של העכבר. אבל אולי אפשר להעיף את העכבר בלי לגעת בו? הסתכלו על המקל!' },
      { en: 'If Eli is impure: open the mikveh door (pin), then drag the sun to night until three stars come out, then tap the terumah.', he: 'אם אלי טמא: פתחו את דלת המקווה (יתד), גררו את השמש עד שיצאו שלושה כוכבים, ואז הקישו על התרומה.' },
    ],
    why: {
      text: {
        en: 'A dead mouse or lizard is a sheretz [שרץ]. If you **touch** it, you become impure [טמא] until evening. A Kohen **is allowed** to become impure this way. The Torah only forbids him tumah from a dead person [מת].\n\nAfter a mikveh [מקווה], he waits until three stars come out before eating terumah [תרומה].\n\nBonus: a sheretz makes you impure by **touch** only, not by moving it. So knocking it away with a stick keeps you pure [טהור]!',
        he: 'עכבר מת הוא שרץ. הנוגע בו נטמא עד הערב. לכהן **מותר** להיטמא בשרץ, כי התורה אסרה עליו רק טומאת מת.\n\nאחרי טבילה במקווה הוא מחכה לצאת שלושה כוכבים, ואז אוכל תרומה.\n\nועוד: שרץ מטמא **במגע** ולא במשא, ולכן אם מזיזים אותו במקל, נשארים טהורים!',
      },
      sources: [
        S('כׇּל־הַנֹּגֵעַ בָּהֶם בְּמֹתָם יִטְמָא עַד־הָעָרֶב', 'Vayikra 11:31', 'ויקרא יא, לא', 'Leviticus.11.31'),
        S('הַשֶּׁרֶץ... מְטַמֵּא אָדָם וְכֵלִים בְּמַגָּע... וְאֵינוֹ מְטַמֵּא בְּמַשָּׂא', 'Rambam, Hilchot She\'ar Avot HaTumot 4:2', 'רמב"ם, הלכות שאר אבות הטומאות ד, ב', 'Mishneh_Torah,_Other_Sources_of_Defilement.4.2'),
        S('וְשֶׁאַף כֹּהֲנִים וּנְזִירִים מֻתָּרִין לְהִתְטַמֵּא בִּשְׁאָר טֻמְאוֹת חוּץ מִטְּמֵא מֵת', 'Rambam, Hilchot Tumat Okhalin 16:9', 'רמב"ם, הלכות טומאת אוכלין טז, ט', 'Mishneh_Torah,_Defilement_of_Foods.16.9'),
        S('אֵין הַטְּמֵאִים אוֹכְלִין בִּתְרוּמָה עַד שֶׁיַּעֲרִיב שִׁמְשָׁן וְיֵצְאוּ שְׁלֹשָׁה כּוֹכָבִים בֵּינוֹנִיִּים', 'Rambam, Hilchot Terumot 7:2', 'רמב"ם, הלכות תרומות ז, ב', 'Mishneh_Torah,_Heave_Offerings.7.2'),
      ],
    },
  },
  {
    id: '1-3', pack: 'w1', title: { en: 'The Bone Bridge', he: 'גשר העצם' },
    stages: [W1.boneBridge],
    hints: [{ en: 'Don\'t step on the seesaw: it would move the bone. The log up high goes right over the bone. Is that OK?', he: 'אל תעלו על הנדנדה: היא תזיז את העצם. הבול למעלה עובר בדיוק מעל העצם. האם זה בסדר?' }],
    why: {
      text: {
        en: 'A single bone from a person, even as small as a grain of barley [עצם כשעורה], makes you impure [טמא] if you **touch** it or **move** it. Even pushing down one end of a plank that the bone is lying on counts as moving it [היסט].\n\nBut a bone does **not** spread impurity under a roof [אהל], so walking **over** it is fine!',
        he: 'עצם אחת של אדם, אפילו כשעורה, מטמאה **במגע ובמשא**. גם הנדת קורה שהעצם מונחת עליה היא כמו משא (היסט).\n\nאבל עצם אחת **אינה מטמאה באוהל**, ולכן מותר לעבור מעליה!',
      },
      sources: [
        S('אֲפִלּוּ עֶצֶם כִּשְׂעוֹרָה מְטַמֵּא בְּמַגָּע וּבְמַשָּׂא... וְאֵינוֹ מְטַמֵּא בְּאֹהֶל', 'Rambam, Hilchot Tumat Met 2:10', 'רמב"ם, הלכות טומאת מת ב, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.2.10'),
        S('קוֹרָה שֶׁהִיא מֻנַּחַת עַל הַכֹּתֶל... וּבָא הַטָּהוֹר לִקְצֵה הַקּוֹרָה הַשֵּׁנִי וְהֵנִידוֹ... טָמֵא מִשּׁוּם נוֹשֵׂא', 'Rambam, Hilchot Tumat Met 1:7', 'רמב"ם, הלכות טומאת מת א, ז', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.7'),
      ],
    },
  },
  {
    id: '1-4', pack: 'w1', title: { en: 'The Gardener\'s Tree', he: 'העץ של הגנן' },
    stages: [W1.gardenerShed, W1.pruneTree('eli', 'gad')],
    hints: [
      { en: 'The bees will get angry when the door opens. What could calm them first? Look at the barrel of water.', he: 'הדבורים יכעסו כשהדלת תיפתח. מה ירגיע אותן קודם? הסתכלו על חבית המים.' },
      { en: 'Cut the branch that reaches over the road. (Cutting the one over the grave works too!)', he: 'גזמו את הענף שמגיע מעל הדרך. (גם גזימת הענף שמעל הקבר עובדת!)' },
    ],
    why: {
      text: {
        en: 'A dead person [מת] spreads impurity to everything under the same roof [אהל]. A roof doesn\'t have to be a house: **strong tree branches count too!**\n\nWhen the branches of one tree cover both a grave [קבר] and the road, a Kohen [כהן] may not walk under them. Cutting off the branch over the road (or the one over the grave) fixes it.',
        he: 'מת מטמא כל מה שתחת אותו אוהל. אוהל אינו רק בית: **גם ענפי אילן חזקים הם אוהל!**\n\nאם ענפי אילן אחד מסככים גם על קבר וגם על הדרך, אסור לכהן לעבור תחתיהם. כשגוזמים את הענף שמעל הדרך (או זה שמעל הקבר), הדרך טהורה.',
      },
      sources: [
        S('שָׂרִיגֵי הָאִילָנוֹת הַסּוֹכְכִים עַל הָאָרֶץ... אִם יְכוֹלִין לְקַבֵּל מַעֲזִיבָה בֵּינוֹנִית... הֲרֵי אֵלּוּ מְבִיאִין וְחוֹצְצִין מִן הַתּוֹרָה', 'Rambam, Hilchot Tumat Met 13:2', 'רמב"ם, הלכות טומאת מת יג, ב', 'Mishneh_Torah,_Defilement_by_a_Corpse.13.2'),
        S('טֻמְאַת אֹהֶל אֵינָהּ בִּשְׁאָר טֻמְאוֹת אֶלָּא בְּמֵת בִּלְבַד', 'Rambam, Hilchot Tumat Met 1:10', 'רמב"ם, הלכות טומאת מת א, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.1.10'),
      ],
    },
  },
  {
    id: '1-5', pack: 'w1', title: { en: 'Stones That Don\'t Wobble', he: 'אבנים שאינן מתנדנדות' },
    stages: [W1.stones('eli', 'miriam', 'terumah')],
    hints: [{ en: 'Tap a stone to test it: ✓ is solid, ✗ wobbles. Build a path of ✓ stones only, or ride the strong donkey.', he: 'הקישו על אבן כדי לבדוק: ✓ יציבה, ✗ מתנדנדת. בנו שביל רק מאבני ✓, או רכבו על החמור החזק.' }],
    why: {
      text: {
        en: 'A Beit HaPeras [בית הפרס] is a field where a grave was plowed by mistake, so tiny bone pieces might be scattered in the dirt.\n\nYou stay pure [טהור] if you cross on **stones that don\'t wobble**, or **riding a strong person or animal**, so your feet never touch the dirt. But if the stones wobble, or the animal is weak, it\'s as if you walked on the dirt yourself.',
        he: 'בית הפרס הוא שדה שנחרש בו קבר, ועצמות קטנות אולי מפוזרות בעפר.\n\nהמהלך **על אבנים שאינן מתנדנדות**, או **רוכב על אדם או בהמה שכוחם יפה**, טהור. אבל אם האבנים מזדעזעות, או שהבהמה חלשה, הרי זה כאילו הלך ברגליו.',
      },
      sources: [
        S('הַמְהַלֵּךְ בְּבֵית הַפְּרָס עַל גַּבֵּי אֲבָנִים שֶׁאֵין מִתְנַדְנְדִין... אוֹ שֶׁנִּכְנַס לָהּ וְהוּא רוֹכֵב עַל גַּבֵּי אָדָם וּבְהֵמָה שֶׁכֹּחָן יָפֶה. הֲרֵי זֶה טָהוֹר', 'Rambam, Hilchot Tumat Met 10:11', 'רמב"ם, הלכות טומאת מת י, יא', 'Mishneh_Torah,_Defilement_by_a_Corpse.10.11'),
        S('הַמְהַלֵּךְ בְּבֵית הַפְּרָס עַל אֲבָנִים שֶׁאֵינוֹ יָכוֹל לַהֲסִיטָן... טָהוֹר', 'Mishnah Oholot 18:6', 'משנה אהלות יח, ו', 'Mishnah_Oholot.18.6'),
      ],
    },
  },
  {
    id: '1-6', pack: 'w1', title: { en: 'The Leaf-Blower Field', he: 'שדה המפוח' },
    stages: [W1.cartDrop, W1.blowerField],
    hints: [
      { en: 'If the cart falls first it will crash. Make a soft landing with the hay first!', he: 'אם העגלה תיפול קודם, היא תתרסק. קודם הכינו נחיתה רכה עם החציר!' },
      { en: 'Blow on a tile to reveal it (and its neighbors). Then switch to ✏️ Path and tap tiles from the bottom to the top, only on checked tiles with no bone.', he: 'נשפו על משבצת כדי לגלות אותה ואת שכנותיה. ואז עברו ל✏️ שביל והקישו על משבצות מלמטה למעלה, רק על משבצות בדוקות בלי עצם.' },
    ],
    why: {
      text: {
        en: 'In a Beit HaPeras [בית הפרס], a bone the size of a barley grain only makes you impure [טמא] if you **touch it or move it**. It doesn\'t spread under a roof [אהל]. And the whole Beit HaPeras rule is from the Sages [מדרבנן].\n\nSo the Sages said: **blow on the ground in front of you as you walk**. Any tiny bone will show, and you step around it. Even a Kohen [כהן] may do this, and someone on his way to bring the Korban Pesach [קרבן פסח] may then bring it.\n\nBut this check isn\'t good enough for eating terumah [תרומה]. That\'s why Miriam took the terumah around the long way.',
        he: 'בבית הפרס, עצם כשעורה מטמאה רק **במגע ובמשא**, ולא באוהל, וכל דין בית הפרס מדרבנן.\n\nלכן אמרו חכמים: **מנפח אדם בית הפרס והולך**. אם יש עצם קטנה, היא מתגלה, והוא עוקף אותה. גם כהן רשאי לעשות כך, ומי שהולך לעשות פסח שוחט ואוכל את פסחו.\n\nאבל לתרומה אין סומכים על בדיקה זו, ולכן מרים הקיפה עם התרומה.',
      },
      sources: [
        S('מְנַפֵּחַ אָדָם בֵּית הַפְּרָס וְהוֹלֵךְ', 'Berakhot 19b', 'ברכות יט ע"ב', 'Berakhot.19b.5'),
        S('נְתָנוֹ בְּבֵית הַפְּרָס הֲרֵי זֶה עֵרוּב וַאֲפִלּוּ הָיָה כֹּהֵן... אוֹ שֶׁיְּנַפֵּחַ וְהוֹלֵךְ', 'Rambam, Hilchot Eruvin 6:17', 'רמב"ם, הלכות עירובין ו, יז', 'Mishneh_Torah,_Eruvin.6.17'),
        S('מִי שֶׁבָּא בְּבֵית הַפְּרָס הֲרֵי זֶה מְנַפֵּחַ וְהוֹלֵךְ... שׁוֹחֵט וְאוֹכֵל פִּסְחוֹ', 'Rambam, Hilchot Korban Pesach 6:8', 'רמב"ם, הלכות קרבן פסח ו, ח', 'Mishneh_Torah,_Paschal_Offering.6.8'),
        S('בּוֹדְקִים לְעוֹשֶׂה פֶסַח, וְאֵין בּוֹדְקִין לִתְרוּמָה', 'Mishnah Oholot 18:4', 'משנה אהלות יח, ד', 'Mishnah_Oholot.18.4'),
      ],
    },
  },
  {
    id: '1-7', pack: 'w1', title: { en: 'The Washed-Away Mark', he: 'הציון שנמחק' },
    stages: [W1.limeMarks],
    hints: [{ en: 'Drag the ↔ knob on each ring. Make each white ring just a little bigger than the purple dotted shape, not much bigger.', he: 'גררו את הכפתור ↔ בכל טבעת. כל טבעת לבנה צריכה להיות קצת יותר גדולה מהצורה הסגולה המקווקוות, אבל לא הרבה.' }],
    why: {
      text: {
        en: 'Before the festivals, the Beit Din [בית דין] marked places of tumah with white lime [סיד], so travelers wouldn\'t become impure [טמא] by accident.\n\nThe mark goes a little **beyond** the tumah, so nobody\'s pure things get ruined, but **not too far**, so good land in Eretz Yisrael isn\'t wasted. And anyone who finds a grave must mark it.',
        he: 'לפני הרגלים יצאו שלוחי בית דין לציין את מקומות הטומאה בסיד, כדי שעוברי דרכים לא ייטמאו.\n\nהציון **עודף מעט** על מקום הטומאה, כדי שלא להפסיד את הטהרות, אבל **אין מרחיקים** אותו, כדי שלא להפסיד את ארץ ישראל. וכל המוצא קבר חייב לציין עליו.',
      },
      sources: [
        S('כָּל הַמּוֹצֵא קֶבֶר... חַיָּב לְצַיֵּן עָלָיו... וּבַמֶּה מְצַיְּנִין, בְּסִיד... יְהִי עוֹדֵף מִכָּאן וּמִכָּאן... שֶׁלֹּא לְהַפְסִיד אֶת הַטָּהֳרוֹת. וְאֵין מַרְחִיקִין... שֶׁלֹּא לְהַפְסִיד אֶת אֶרֶץ יִשְׂרָאֵל', 'Rambam, Hilchot Tumat Met 8:9', 'רמב"ם, הלכות טומאת מת ח, ט', 'Mishneh_Torah,_Defilement_by_a_Corpse.8.9'),
        S('וּמְצַיְּנִין אֶת הַקְּבָרוֹת', 'Mishnah Shekalim 1:1', 'משנה שקלים א, א', 'Mishnah_Shekalim.1.1'),
      ],
    },
  },
  {
    id: '1-8', pack: 'w1', title: { en: 'Read the White Marks', he: 'קרא את הסימנים' },
    stages: [W1.readMarks],
    hints: [{ en: 'A: under the stone. B: between the stones. C: broken pottery means a building. D: when all four edges are marked, the whole inside is impure.', he: 'א: תחת האבן. ב: בין האבנים. ג: חרס ביניהן, זה בניין. ד: כשכל ארבעת המצרים מצוינים, כל השדה טמאה.' }],
    why: {
      text: {
        en: 'One marked stone: the tumah [טומאה] is under it. Two stones with lime between them: the tumah is between them. Lime only on top of two stones with broken pottery between: that\'s just a building, it\'s pure [טהור].\n\nAll four edges of a field marked: the edges are pure and **the whole field** is impure [טמא], because a mark is never put far from the tumah.',
        he: 'אבן אחת מצוינת: תחתיה טמא. שתיים וסיד ביניהן: ביניהן טמא. סיד על ראשיהן וחרס ביניהן: אין זה אלא בניין, וטהור.\n\nארבעה מצרי השדה מצוינים: המצרים טהורים **וכל השדה טמאה**, שאין מרחיקים את הציון ממקום הטומאה.',
      },
      sources: [
        S('מָצָא אֶבֶן מְצֻיֶּנֶת תַּחְתֶּיהָ טָמֵא... מָצָא אַרְבָּעָה מְצָרֶיהָ מְצֻיָּנִין. הֵן טְהוֹרִין וְכָל הַשָּׂדֶה כֻּלָּהּ טְמֵאָה', 'Rambam, Hilchot Tumat Met 8:11', 'רמב"ם, הלכות טומאת מת ח, יא', 'Mishneh_Torah,_Defilement_by_a_Corpse.8.11'),
      ],
    },
  },
  {
    id: '1-9', pack: 'w1', title: { en: 'Trees or No Trees?', he: 'יש אילנות או אין?' },
    stages: [W1.treesOrNot],
    hints: [{ en: 'A marked field with trees is a plowed grave, so blowing works. A marked field with no trees has a lost grave, and nothing helps there.', he: 'שדה מצוינת עם אילנות: נחרש בה קבר, וניפוח מועיל. בלי אילנות: אבד בה קבר, ושום דבר לא מועיל.' }],
    why: {
      text: {
        en: 'When you find a marked field and don\'t know why it was marked: if it **has trees**, it\'s a field where a grave was plowed [בית הפרס], since you\'re allowed to plant there. If it has **no trees**, it\'s a field where a **whole grave was lost**.\n\nA lost grave spreads impurity by touch, carrying **and roof** [אהל], so blowing, stones and donkeys don\'t help. A Kohen must go around. (The Rambam adds that this rule is used where an elder or Torah scholar is there to say so, like Grandpa Zevulun.)',
        he: 'מצא שדה מצוינת ואין יודע מה טיבה: אם **יש בה אילן**, בידוע שנחרש קבר בתוכה. **אין בה אילן**, בידוע שאבד קבר בתוכה.\n\nשדה שאבד בה קבר מטמאה במגע ובמשא **ובאוהל**, ולכן ניפוח, אבנים וחמור אינם מועילים, והכהן מקיף. (והרמב"ם מוסיף: והוא שיהיה באותו מקום זקן או תלמיד חכם, כמו סבא זבולון.)',
      },
      sources: [
        S('מָצָא שָׂדֶה מְצֻיֶּנֶת וְאֵין יוֹדֵעַ מַה טִּיבָהּ. אִם יֵשׁ בָּהּ אִילָן בְּיָדוּעַ שֶׁנֶּחְרַשׁ קֶבֶר בְּתוֹכָהּ. אֵין בָּהּ אִילָן בְּיָדוּעַ שֶׁאָבַד קֶבֶר בְּתוֹכָהּ', 'Rambam, Hilchot Tumat Met 10:10', 'רמב"ם, הלכות טומאת מת י, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.10.10'),
        S('וּמְטַמֵּא בְמַגָּע וּבְמַשָּׂא וּבְאֹהֶל', 'Mishnah Oholot 18:3', 'משנה אהלות יח, ג', 'Mishnah_Oholot.18.3'),
      ],
    },
  },
  {
    id: '1-10', pack: 'w1', title: { en: 'The Pilgrims\' Path', he: 'שביל העולים' },
    stages: [W1.pilgrimsPath],
    hints: [{ en: 'Look for the path covered with footprints, where the crowds walk.', he: 'חפשו את השביל המלא עקבות, שבו הולכים ההמונים.' }],
    why: {
      text: {
        en: 'When thousands of people have walked on a path in a Beit HaPeras [בית הפרס], any tiny bone there has surely been crushed to dust.\n\nSo a well-trodden path is pure [טהור] for someone going to bring the Korban Pesach [קרבן פסח]. Eli made it to Yerushalayim, pure and ready for Pesach!',
        he: 'בית הפרס שנדוש, שעברו עליו רבים, טהור לעושה פסח, כי אי אפשר שעצם כשעורה לא נשחקה תחת הרגליים.\n\nאלי הגיע לירושלים, טהור ומוכן לפסח!',
      },
      sources: [
        S('וְכֵן בֵּית הַפְּרָס שֶׁנִּדּוֹשׁ טָהוֹר לָעוֹשֶׂה פֶּסַח', 'Rambam, Hilchot Korban Pesach 6:8', 'רמב"ם, הלכות קרבן פסח ו, ח', 'Mishneh_Torah,_Paschal_Offering.6.8'),
        S('בֵּית הַפְּרָס שֶׁנִּדַּשׁ טָהוֹר', 'Berakhot 19b', 'ברכות יט ע"ב', 'Berakhot.19b.5'),
      ],
    },
  },
];

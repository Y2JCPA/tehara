/* C-1 · The Stones of the Altar (Mishnah Middot 1:6)
   Roll the stones the Greek kings defiled into the chamber of the Beit HaMoked.
   Two flaps: one must be switched, the other is a trap. */
CH.altarStones = api => {
  const tw = new Kit.Tweens();
  const pShelf = new Kit.Pin('shelf', 262, 236, 262, 330);
  const pA = new Kit.Pin('flapA', 470, 470, 350, 500);
  const pB = new Kit.Pin('flapB', 470, 610, 350, 636);
  const pDoor = new Kit.Pin('door', 238, 652, 238, 724);
  const stones = [0, 1, 2].map(i => ({ x: 80 + i * 56, y: 306, a: 0 }));
  const flapA = { a: 0, on: true }, flapB = { a: 0, on: true }, door = { open: 0 };
  const yehuda = new Chars.Actor('yehuda', 300, 860, { dir: -1 }), elder = new Chars.Actor('kohen', 360, 860, { dir: -1 });
  function release() {
    const toAltar = flapA.on, toFloor = !flapA.on && !flapB.on, doorOpen = pDoor.out;
    stones.forEach((s, i) => {
      const legs = [[262, 306], [330, 505]];
      if (toAltar) legs.push([420, 690], [470 - i * 12, 820 - i * 4]);
      else if (toFloor) legs.push([330, 640], [430, 760], [470 + i * 24, 838]);
      else { legs.push([330, 640], [222, 776]); if (doorOpen) legs.push([84 + i * 32, 814]); }
      let k = 0;
      const next = () => {
        const L = legs[k++];
        if (!L) {
          if (i < stones.length - 1) return;
          if (toAltar) { api.fail({ en: 'Those stones were defiled by the Greek kings [שקצום מלכי יון]. They can\'t go into the new Mizbeach [מזבח]!', he: 'את האבנים האלה שיקצו מלכי יוון. אי אפשר להשתמש בהן במזבח החדש!' }); return; }
          if (toFloor) { api.fail({ en: 'Now the stones are lying around the Mikdash! They have to be stored away [נגנזו] in the chamber.', he: 'עכשיו האבנים מפוזרות במקדש! צריך לגנוז אותן בלשכה.' }); return; }
          if (!doorOpen) { api.fail({ en: 'The chamber door is closed! Open it before the stones roll down.', he: 'דלת הלשכה סגורה! פתחו אותה לפני שהאבנים מתגלגלות.' }); return; }
          tw.to(door, { open: 0 }, 0.4, () => { yehuda.mood = 'happy'; api.say({ en: 'The old stones are stored away. Now we can build a new Mizbeach!', he: 'האבנים הישנות גנוזות. עכשיו אפשר לבנות מזבח חדש!' }, 'good'); setTimeout(() => api.complete(), 1200); });
          return;
        }
        tw.to(s, { x: L[0], y: L[1], a: s.a + 2 }, 0.33, next);
      };
      setTimeout(next, i * 380);
    });
  }
  return {
    intro: { en: 'The Greek kings defiled the stones of the Mizbeach [מזבח]. Roll them into the chamber of the Beit HaMoked [בית המוקד]. Not onto the new altar, and not onto the floor!', he: 'מלכי יוון שיקצו את אבני המזבח. גלגלו אותן ללשכה שבבית המוקד. לא למזבח החדש, ולא לרצפה!' },
    update(dt) { tw.update(dt); for (const p of [pShelf, pA, pB, pDoor]) p.update(dt); yehuda.update(dt); elder.update(dt); },
    down(p) {
      if (pA.hit(p)) { pA.pull(() => { flapA.on = false; tw.to(flapA, { a: 1.4 }, 0.4); }); return; }
      if (pB.hit(p)) { pB.pull(() => { flapB.on = false; tw.to(flapB, { a: -1.4 }, 0.4); }); return; }
      if (pDoor.hit(p)) { pDoor.pull(() => tw.to(door, { open: 1 }, 0.4)); return; }
      if (pShelf.hit(p)) pShelf.pull(() => release());
    },
    hot() { return { shelf: pShelf.ring, flapA: pA.ring, flapB: pB.ring, door: pDoor.ring }; },
    draw(g, t) {
      CH.temple(g, t, { floor: 860, seed: 7 });
      const ramp = (x1, y1, x2, y2) => { G.line(g, x1, y1, x2, y2, 16, G.C.woodDark); G.line(g, x1, y1, x2, y2, 11, G.C.woodLight); };
      G.rr(g, 40, 330, 222, 18, 3, G.lin(g, 0, 330, 0, 348, [[0, G.C.woodLight], [1, G.C.wood]]), 2.5, G.C.woodDark);
      ramp(262, 340, 336, 520); ramp(338, 540, 470, 836); ramp(330, 650, 220, 790); ramp(338, 660, 440, 780);
      if (flapA.a < 1.4) { g.save(); g.translate(336, 520); g.rotate(-0.5 + flapA.a); G.rr(g, -6, 0, 12, 92, 3, G.C.wood, 2.5, G.C.woodDark); g.restore(); }
      if (flapB.a > -1.4) { g.save(); g.translate(334, 640); g.rotate(0.55 + flapB.a); G.rr(g, -6, 0, 12, 80, 3, G.C.wood, 2.5, G.C.woodDark); g.restore(); }
      // chamber
      G.rr(g, 24, 700, 210, 160, 6, G.lin(g, 0, 700, 0, 860, [[0, '#3a2a1a'], [1, '#1c130a']]), 3, G.C.mortar);
      G.tag(g, api.L({ en: 'Chamber of the Beit HaMoked', he: 'לשכה בבית המוקד' }), 128, 684, { size: 12 });
      g.save(); g.translate(224, 712); g.scale(1 - door.open * 0.85, 1); G.rr(g, 0, 0, 14, 148, 3, G.lin(g, 0, 0, 14, 0, [[0, G.C.woodLight], [1, G.C.woodDark]]), 2.5, G.C.woodDark); g.restore();
      // the new altar site
      g.setLineDash([10, 8]); G.rr(g, 400, 800, 130, 60, 4, 'rgba(255,255,255,0.3)', 3, '#c0392b'); g.setLineDash([]);
      for (let i = 0; i < 3; i++) G.rr(g, 412 + i * 36, 830, 30, 26, 3, G.lin(g, 0, 830, 0, 856, [[0, '#fffaf0'], [1, '#ddd2b8']]), 2, '#a89a7a');
      G.tag(g, api.L({ en: 'New Mizbeach', he: 'מזבח חדש' }), 465, 784, { size: 12 });
      for (const s of stones) { g.save(); g.translate(s.x, s.y); g.rotate(s.a); G.rr(g, -22, -22, 44, 44, 6, G.lin(g, -22, -22, 22, 22, [[0, '#c4bfb4'], [1, '#7f7a70']]), 2.5, '#4f4a40'); G.line(g, -12, -14, 4, 2, 2.5, '#4f4a40'); G.line(g, 4, 2, 0, 16, 2.5, '#4f4a40'); g.restore(); }
      for (const p of [pShelf, pA, pB, pDoor]) p.draw(g);
      elder.draw(g, t); yehuda.draw(g, t);
    },
  };
};

CHANUKAH.push({
  id: 'C-1', pack: 'ch', title: { en: 'The Stones of the Altar', he: 'אבני המזבח' },
  stages: [CH.altarStones],
  hints: [{ en: 'Follow each ramp with your finger. Which flap sends the stones the wrong way, and which one is already right? Open the chamber before anything rolls.', he: 'עקבו אחרי כל מסילה. איזה דש שולח את האבנים לכיוון הלא נכון, ואיזה כבר נכון? פתחו את הלשכה לפני שמשהו מתגלגל.' }],
  why: {
    text: {
      en: 'The Greek kings used the Mizbeach [מזבח] for idol worship, so its stones could never be used again.\n\nThe Chashmona\'im [חשמונאים] stored them away in a special chamber in the Beit HaMoked [בית המוקד] and built a new Mizbeach.',
      he: 'מלכי יוון שיקצו את אבני המזבח, ולכן אי אפשר היה להשתמש בהן עוד.\n\nבני חשמונאי גנזו אותן בלשכה שבבית המוקד ובנו מזבח חדש.',
    },
    sources: [S('מִזְרָחִית צְפוֹנִית, בָּהּ גָּנְזוּ בְנֵי חַשְׁמוֹנַאי אֶת אַבְנֵי הַמִּזְבֵּחַ שֶׁשִּׁקְּצוּם מַלְכֵי יָוָן', 'Mishnah Middot 1:6', 'משנה מידות א, ו', 'Mishnah_Middot.1.6')],
  },
});

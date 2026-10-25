/* 1-10 · The Pilgrims' Path
   A trodden path through a Beit HaPeras is pure for the Pesach (Rambam Korban
   Pesach 6:8). But the most trodden path runs through a bare field: a lost
   grave, where treading doesn't help. */
W1.pilgrimsPath = api => {
  const T = api.T;
  const eli = new Chars.Actor('eli', 270, 912);
  const paths = [
    { id: 'goat', field: 'bare', kind: 'goat', pts: [[270, 900], [80, 760], [70, 500], [200, 320]] },
    { id: 'busy', field: 'bare', kind: 'trodden', pts: [[270, 900], [170, 720], [180, 480], [245, 320]] },
    { id: 'trodden', field: 'trees', kind: 'trodden', pts: [[270, 900], [350, 720], [330, 480], [290, 320]] },
    { id: 'light', field: 'trees', kind: 'light', pts: [[270, 900], [410, 760], [430, 520], [320, 320]] },
    { id: 'furrow', field: 'trees', kind: 'furrow', pts: [[270, 900], [490, 780], [500, 500], [350, 320]] },
  ];
  const sheep = [0, 1, 2].map(i => ({ k: (i * 0.33) % 1 }));
  let going = false;
  function distSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1]; const k = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p.x - a[0] - k * dx, p.y - a[1] - k * dy); }
  function along(pts, k) { const i = Math.min(pts.length - 2, Math.floor(k * (pts.length - 1))), f = k * (pts.length - 1) - i; return [Kit.lerp(pts[i][0], pts[i + 1][0], f), Kit.lerp(pts[i][1], pts[i + 1][1], f)]; }
  function choose(pa) {
    if (going) return; going = true;
    const field = T.markedFieldKind(pa.field === 'trees').field;
    const r = T.crossField({ field, method: pa.kind === 'trodden' ? 'trodden' : 'walk', purpose: 'pesach' });
    if (r.tahor) { eli.walk(pa.pts.slice(1), () => { eli.mood = 'happy'; api.complete(); }, 170); return; }
    eli.walk(pa.pts.slice(1, 2), () => {
      eli.mood = 'oh'; eli.glow = 'tm';
      if (r.reason === 'ohel') api.fail({ en: 'This path is trodden hard, but look: the field has no trees. A whole grave was lost here, and it spreads tumah by roof [אהל]. Treading only helps in a Beit HaPeras!', he: 'השביל הזה דרוך היטב, אבל לשדה אין אילנות. אבד כאן קבר שלם, והוא מטמא באוהל. דריסה מועילה רק בבית הפרס!' });
      else api.fail({ en: 'Not trodden enough! A tiny bone might still be hiding here. Look for the path that thousands of feet have pressed down.', he: 'לא דרוך מספיק! אולי עוד מסתתרת כאן עצם קטנה. חפשו את השביל שאלפי רגליים דרכו עליו.' });
    });
  }
  return {
    intro: { en: 'The last fields before Yerushalayim are marked. Which path should Eli take? Tap it.', he: 'השדות האחרונים לפני ירושלים מצוינים. באיזה שביל ילך אלי? הקישו עליו.' },
    update(dt) { eli.update(dt); for (const s of sheep) s.k = (s.k + dt * 0.04) % 1; },
    down(p) {
      let best = null, bd = 26;
      for (const pa of paths) for (let i = 1; i < pa.pts.length; i++) { const d = distSeg(p, pa.pts[i - 1], pa.pts[i]); if (d < bd && p.y < 870) { bd = d; best = pa; } }
      if (best) choose(best);
    },
    hot() { const h = {}; for (const pa of paths) h[pa.id] = pa.pts[2]; return h; },
    scene: { mode: 'day', seed: 81 },
    build(K, ctx) {
      const T3 = K.THREE, G3 = W1.ground(K, { front: 960 }), M = K.MAT;
      G3.sheet(-300, 300, 1140, 720, M.grass, { thick: 0.3, bevel: 0.05 });
      // the walls of Yerushalayim beyond the fields
      const wall = new T3.Group(), cw = K.cityWall(0, 0, 420, 150); wall.add(cw); cw.position.set(-210 / K.U, 150 / K.U, 0); K.scene.add(wall); G3.stand(wall, 270, 292);
      // two marked fields: the left one bare, the right one with trees
      for (const fx of [14, 276]) {
        G3.sheet(fx, 340, 250, 520, M.field, { lift: 0.1, thick: 0.12, bevel: 0.04 });
        for (const [x, y, w, h] of [[fx - 9, 331, 268, 8], [fx - 9, 861, 268, 8], [fx - 9, 331, 8, 538], [fx + 251, 331, 8, 538]]) G3.sheet(x, y, w, h, M.lime, { lift: 0.12, thick: 0.03, bevel: 0.02 });
      }
      [[470, 450, 1], [500, 640, 2], [300, 840, 3]].forEach(([x, y, sd]) => G3.stand(K.tree(0, 0, 0.48, 'olive', sd), x, y));
      // the paths: how worn each one is shows in its width and colour
      const look = { trodden: [38, 0xf4e2b8], light: [26, 0xd9bf8c], goat: [22, 0xc9a876], furrow: [22, 0xa47a44] };
      for (const pa of paths) { const [w, c] = look[pa.kind]; G3.ribbon(pa.pts, w, K.std(c, { roughness: 1, map: K.TEX.path, side: T3.DoubleSide }), { lift: 0.24 }); }
      G3.stand(K.bush(0, 0, 0.7), 20, 900); G3.stand(K.bush(0, 0, 0.7), 520, 910);
      const flock = sheep.map(() => K.sheep(0.6));
      this.sync = () => {
        sheep.forEach((s, i) => { const [x, y] = along(paths[1].pts, 1 - s.k); flock[i].position.copy(G3.at(x, y, 0.2)); flock[i].scale.setScalar(G3.tOf(x, y)); });
        G3.follow(ctx, [eli]);
      };
    },
    draw(g, t) {
      for (const pa of paths) for (let i = 1; i < pa.pts.length; i++) {
        const [a, b] = [pa.pts[i - 1], pa.pts[i]];
        if (pa.kind === 'trodden') for (let k = i === 1 ? 0.3 : 0; k < 1; k += 0.05) G.footprint(g, Kit.lerp(a[0], b[0], k) + ((k * 20 | 0) % 2 ? 7 : -7), Kit.lerp(a[1], b[1], k), 0, 0.5);
        if (pa.kind === 'light') for (let k = 0.2; k < 1; k += 0.35) G.footprint(g, Kit.lerp(a[0], b[0], k), Kit.lerp(a[1], b[1], k), 0, 0.4);
        if (pa.kind === 'furrow') for (let k = 0.1; k < 1; k += 0.15) G.line(g, Kit.lerp(a[0], b[0], k) - 9, Kit.lerp(a[1], b[1], k), Kit.lerp(a[0], b[0], k) + 9, Kit.lerp(a[1], b[1], k) - 4, 3, '#6b4a26');
        if (pa.kind === 'goat') for (let k = 0.15; k < 1; k += 0.3) G.text(g, '‥', Kit.lerp(a[0], b[0], k), Kit.lerp(a[1], b[1], k), { size: 14, color: '#6b4a2b' });
      }
      G.sign(g, 270, 956, api.L({ en: 'Beit HaPeras', he: 'בית הפרס' }), { w: 110, size: 13, post: false });
      eli.draw(g, t); eli.drawBubble(g);
    },
  };
};

WORLD1.push({
  id: '1-10', pack: 'w1', title: { en: 'The Pilgrims\' Path', he: 'שביל העולים' },
  stages: [W1.pilgrimsPath],
  hints: [{ en: 'A well-trodden path is pure for the Pesach, but only in a Beit HaPeras. Which field has trees?', he: 'שביל דרוך טהור לעושה פסח, אבל רק בבית הפרס. לאיזה שדה יש אילנות?' }],
  why: {
    text: {
      en: 'When thousands of people have walked a path in a Beit HaPeras [בית הפרס], any tiny bone there has surely been crushed. So a well-trodden path is pure [טהור] for someone going to bring the Korban Pesach [קרבן פסח].\n\nBut the busiest path ran through a field with **no trees**: a field where a whole grave was lost. Treading doesn\'t help there, because a grave spreads tumah by roof [אהל].\n\nEli made it to Yerushalayim, pure and ready for Pesach!',
      he: 'בית הפרס שנדוש, שעברו עליו רבים, טהור לעושה פסח, כי אין עצם כשעורה שלא נשחקה.\n\nאבל השביל העמוס ביותר עבר בשדה **בלי אילנות**: שדה שאבד בה קבר. שם דריסה אינה מועילה, כי הקבר מטמא באוהל.\n\nאלי הגיע לירושלים, טהור ומוכן לפסח!',
    },
    sources: [
      S('וְכֵן בֵּית הַפְּרָס שֶׁנִּדּוֹשׁ טָהוֹר לָעוֹשֶׂה פֶּסַח', 'Rambam, Hilchot Korban Pesach 6:8', 'רמב"ם, הלכות קרבן פסח ו, ח', 'Mishneh_Torah,_Paschal_Offering.6.8'),
      S('בֵּית הַפְּרָס שֶׁנִּדַּשׁ טָהוֹר', 'Berakhot 19b', 'ברכות יט ע"ב', 'Berakhot.19b.5'),
      S('אֵין בָּהּ אִילָן בְּיָדוּעַ שֶׁאָבַד קֶבֶר בְּתוֹכָהּ', 'Rambam, Hilchot Tumat Met 10:10', 'רמב"ם, הלכות טומאת מת י, י', 'Mishneh_Torah,_Defilement_by_a_Corpse.10.10'),
    ],
  },
});

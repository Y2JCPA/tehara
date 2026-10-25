/* 1-8 · Read the White Marks (Rambam Tumat Met 8:11)
   Six fields; tap squares AND edges that are impure. C and F look almost the
   same: only the broken pottery between the stones tells them apart. */
W1.readMarks = api => {
  const T = api.T, TILE = 48, E = 9;
  const fields = [
    { id: 'A', x: 52, y: 218, pattern: 'oneStone', opts: { cell: 4 } },
    { id: 'B', x: 330, y: 218, pattern: 'twoStonesLimeBetween', opts: { row: 1 } },
    { id: 'C', x: 52, y: 452, pattern: 'twoStonesSherdsBetween', opts: { row: 1 } },
    { id: 'D', x: 330, y: 452, pattern: 'fourEdges', opts: {} },
    { id: 'E', x: 52, y: 686, pattern: 'oneEdge', opts: { edge: 3 } },
    { id: 'F', x: 330, y: 686, pattern: 'twoStonesLimeOnTop', opts: { row: 1 } },
  ].map(f => ({ ...f, cells: new Set(), edges: new Set() }));
  const NAME = { en: 'Field', he: 'שדה' };
  const TIPS = {
    A: { en: 'Field A: one marked stone means the tumah is under it.', he: 'שדה א: אבן אחת מצוינת, תחתיה טמא.' },
    B: { en: 'Field B: two stones with lime between them: the tumah is between them.', he: 'שדה ב: שתי אבנים וסיד ביניהן: ביניהן טמא.' },
    C: { en: 'Field C: lime only on the tops, and broken pottery between: that\'s just an old building. It\'s pure!', he: 'שדה ג: סיד על ראשיהן וחרס ביניהן: אין זה אלא בניין, וטהור!' },
    D: { en: 'Field D: all four edges are marked, so the whole field is impure, and the edges themselves are pure. A mark is never put far from the tumah.', he: 'שדה ד: ארבעה מצרים מצוינים: המצרים טהורים וכל השדה טמאה, שאין מרחיקים את הציון.' },
    E: { en: 'Field E: only one edge is marked. That edge is impure, and the field is pure.', he: 'שדה ה: מצר אחד מצוין: הוא טמא וכל השדה טהורה.' },
    F: { en: 'Field F: lime spread on top of both stones with no pottery between: that IS a marker, so between them is impure.', he: 'שדה ו: הסיד מרודד על ראשיהן ואין חרס ביניהן: הרי זה ציון, וביניהן טמא.' },
  };
  const S3 = TILE * 3;
  function check() {
    for (const f of fields) {
      const want = T.readMarks(f.pattern, f.opts);
      const same = (a, b) => a.size === b.length && b.every(c => a.has(c));
      if (!same(f.cells, want.tamei) || !same(f.edges, want.edges)) { api.mistake(TIPS[f.id]); return; }
    }
    api.setButtons([]); api.say({ en: 'You read every mark correctly!', he: 'קראתם את כל הסימנים נכון!' }, 'good');
    setTimeout(() => api.complete(), 900);
  }
  const edgeRect = (f, e) => [[f.x, f.y - E - 3, S3, E], [f.x + S3 + 3, f.y, E, S3], [f.x, f.y + S3 + 3, S3, E], [f.x - E - 3, f.y, E, S3]][e];
  function hitField(p) {
    for (const f of fields) {
      for (let e = 0; e < 4; e++) { const [x, y, w, h] = edgeRect(f, e); if (Kit.inRect(p, x - 4, y - 4, w + 8, h + 8)) return [f, 'e', e]; }
      const c = Math.floor((p.x - f.x) / TILE), r = Math.floor((p.y - f.y) / TILE);
      if (r >= 0 && r < 3 && c >= 0 && c < 3) return [f, 'c', r * 3 + c];
    }
    return null;
  }
  return {
    intro: { en: 'Tap every square AND every edge that is impure [טמא]. Look closely at each field!', he: 'הקישו על כל משבצת וכל מצר שהם טמאים. הסתכלו היטב על כל שדה!' },
    buttons: [{ id: 'check', label: { en: 'Check', he: 'בדיקה' }, cls: 'btn-green', onClick: check }],
    down(p) { const h = hitField(p); if (!h) return; const [f, k, i] = h; const set = k === 'e' ? f.edges : f.cells; set.has(i) ? set.delete(i) : set.add(i); api.sfx('tap'); },
    hot() {
      const h = {};
      for (const f of fields) {
        for (let c = 0; c < 9; c++) h[f.id + c] = [f.x + (c % 3) * TILE + TILE / 2, f.y + Math.floor(c / 3) * TILE + TILE / 2];
        for (let e = 0; e < 4; e++) { const [x, y, w, hh] = edgeRect(f, e); h[f.id + 'e' + e] = [x + w / 2, y + hh / 2]; }
      }
      return h;
    },
    scene: { mode: 'day', seed: 61 },
    build(K, ctx) {
      const T3 = K.THREE, G3 = W1.ground(K, { front: 960 }), M = K.MAT;
      G3.sheet(-300, 180, 1140, 860, M.grass, { thick: 0.3, bevel: 0.05 });
      const soil = K.std(0xd9bb7c, { roughness: 1, map: K.TEX.path }), picked = K.std(0xb28ae6, { roughness: 0.7 });
      const edgeM = K.std(0xf6eedb, { roughness: 1, transparent: true, opacity: 0.6 }), sherd = K.std(0xc9693a, { roughness: 0.8 });
      const stone = (x, y, cap) => {   // an upright field stone, with a dab (or a spread) of lime on top
        const gr = new T3.Group();
        const st = K.mesh(K.lumpy(0.5, 1, 0.12, x + y), M.rock); st.scale.set(32 / K.U, 42 / K.U, 26 / K.U); st.position.y = 18 / K.U; gr.add(st);
        if (cap) { const c = K.mesh(new T3.CylinderGeometry(1, 1, 0.05, 20), M.lime, 0, 38 / K.U, 0); c.scale.set(cap / K.U, 1, cap * 0.8 / K.U); gr.add(c); }
        K.scene.add(gr); return G3.stand(gr, x, y);
      };
      const tiles = [];
      for (const f of fields) {
        G3.sheet(f.x - 6, f.y - 6, S3 + 12, S3 + 12, M.earth, { lift: 0.1, thick: 0.16 });
        const cells = [], edges = [];
        for (let c = 0; c < 9; c++) cells.push(G3.sheet(f.x + (c % 3) * TILE + 3, f.y + Math.floor(c / 3) * TILE + 3, TILE - 6, TILE - 6, soil, { lift: 0.18, thick: 0.08, bevel: 0.03 }));
        for (let e = 0; e < 4; e++) { const [x, y, w, h] = edgeRect(f, e); edges.push(G3.sheet(x, y, w, h, edgeM, { lift: 0.16, thick: 0.05, bevel: 0.01 })); }
        tiles.push({ f, cells, edges });
        const midY = f.y + TILE * 1.5;
        if (f.pattern === 'oneStone') stone(f.x + S3 / 2, f.y + S3 / 2 + 14, 13);
        if (['twoStonesLimeBetween', 'twoStonesSherdsBetween', 'twoStonesLimeOnTop'].includes(f.pattern)) {
          for (const sx of [f.x - 24, f.x + S3 + 24]) stone(sx, midY + 18, f.pattern === 'twoStonesLimeOnTop' ? 19 : 10);
          if (f.pattern === 'twoStonesLimeBetween') G3.sheet(f.x + 4, midY - 7, S3 - 8, 14, M.lime, { lift: 0.28, thick: 0.03, bevel: 0.02 });
          if (f.pattern === 'twoStonesSherdsBetween') for (let i = 0; i < 5; i++) {
            const sh = new T3.Shape([new T3.Vector2(-0.1, -0.06), new T3.Vector2(0.06, -0.1), new T3.Vector2(0.11, 0.08), new T3.Vector2(-0.04, 0.09)]);
            const m = K.mesh(new T3.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false }), sherd); const gp = new T3.Group(); gp.add(m); K.scene.add(gp);
            G3.lay(gp, f.x + 24 + i * 26, midY + 2, { lift: 0.27, rot: i * 1.3 });
          }
        }
        if (f.pattern === 'fourEdges') {
          for (const [x, y, w, h] of [[f.x - 22, f.y - 22, S3 + 44, 7], [f.x - 22, f.y + S3 + 15, S3 + 44, 7], [f.x - 22, f.y - 22, 7, S3 + 44], [f.x + S3 + 15, f.y - 22, 7, S3 + 44]]) G3.sheet(x, y, w, h, M.lime, { lift: 0.14, thick: 0.03, bevel: 0.02 });
        }
        if (f.pattern === 'oneEdge') G3.sheet(f.x - 22, f.y - 10, 8, S3 + 20, M.lime, { lift: 0.14, thick: 0.03, bevel: 0.02 });
      }
      G3.stand(K.bush(0, 0, 0.6), 268, 200); G3.stand(K.bush(0, 0, 0.7), 268, 640); G3.stand(K.bush(0, 0, 0.6), 268, 870);
      this.sync = () => {
        for (const { f, cells, edges } of tiles) {
          cells.forEach((m, c) => { m.children[0].material = f.cells.has(c) ? picked : soil; });
          edges.forEach((m, e) => { m.children[0].material = f.edges.has(e) ? picked : edgeM; });
        }
      };
    },
    draw(g, t) {
      for (const f of fields) {
        G.tag(g, `${api.L(NAME)} ${api.lang === 'he' ? 'אבגדהו'['ABCDEF'.indexOf(f.id)] : f.id}`, f.x + S3 / 2, f.y - 30, { size: 13 });
        for (let c = 0; c < 9; c++) if (f.cells.has(c)) G.text(g, '✕', f.x + (c % 3) * TILE + TILE / 2, f.y + Math.floor(c / 3) * TILE + TILE / 2, { size: 18, color: G.C.purpleDeep });
      }
    },
  };
};

WORLD1.push({
  id: '1-8', pack: 'w1', title: { en: 'Read the White Marks', he: 'קרא את הסימנים' },
  stages: [W1.readMarks],
  hints: [{ en: 'A: under the stone. B: between the stones. C vs F: is there broken pottery between the stones? D: four edges marked means the whole inside. E: one edge marked means only that edge.', he: 'א: תחת האבן. ב: בין האבנים. ג מול ו: יש חרס בין האבנים? ד: ארבעה מצרים, כל השדה. ה: מצר אחד, רק הוא.' }],
  why: {
    text: {
      en: 'One marked stone: the tumah [טומאה] is under it. Two stones with lime between them: the tumah is between them.\n\nLime on top of two stones: if there\'s **broken pottery** between them, it\'s just an old building and it\'s pure [טהור]. With **no pottery**, it\'s a real marker, and between them is impure [טמא].\n\nAll four edges of a field marked: the edges are pure and the **whole field** is impure, because a mark is never put far from the tumah. Only **one** edge marked: that edge is impure and the field is pure.',
      he: 'אבן אחת מצוינת: תחתיה טמא. שתיים וסיד ביניהן: ביניהן טמא.\n\nסיד על ראשי שתי אבנים: אם יש **חרס** ביניהן, אין זה אלא בניין וטהור. **אין חרס** ביניהן, הרי זה ציון וטמא.\n\nארבעה מצרים מצוינים: הם טהורים **וכל השדה טמאה**, שאין מרחיקים את הציון. מצר **אחד** מצוין: הוא טמא וכל השדה טהורה.',
    },
    sources: [
      S('מָצָא אֶבֶן מְצֻיֶּנֶת תַּחְתֶּיהָ טָמֵא. הָיוּ שְׁתַּיִם אִם יֵשׁ סִיד בֵּינֵיהֶם בֵּינֵיהֶם טָמֵא... אִם יֵשׁ חֶרֶשׂ בֵּינֵיהֶן טָהוֹר שֶׁאֵין זֶה אֶלָּא בִּנְיָן. וְאִם אֵין חֶרֶשׂ בֵּינֵיהֶן... הֲרֵי זֶה צִיּוּן וְטָמֵא. מָצָא מֵצָר אֶחָד מְצֻיָּן. הוּא טָמֵא וְכָל הַשָּׂדֶה טְהוֹרָה... מָצָא אַרְבָּעָה מְצָרֶיהָ מְצֻיָּנִין. הֵן טְהוֹרִין וְכָל הַשָּׂדֶה כֻּלָּהּ טְמֵאָה', 'Rambam, Hilchot Tumat Met 8:11', 'רמב"ם, הלכות טומאת מת ח, יא', 'Mishneh_Torah,_Defilement_by_a_Corpse.8.11'),
    ],
  },
});

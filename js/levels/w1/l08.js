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
    draw(g, t) {
      Kit.outdoor(g, t, { seed: 61, y: 200 });
      G.platform(g, -10, 180, 560, 800, { seed: 62 });
      for (const f of fields) {
        G.tag(g, `${api.L(NAME)} ${api.lang === 'he' ? 'אבגדהו'['ABCDEF'.indexOf(f.id)] : f.id}`, f.x + S3 / 2, f.y - 30, { size: 13 });
        G.rr(g, f.x - 4, f.y - 4, S3 + 8, S3 + 8, 6, '#a77b45', 2, G.C.dirtDark);
        for (let c = 0; c < 9; c++) {
          const x = f.x + (c % 3) * TILE, y = f.y + Math.floor(c / 3) * TILE, on = f.cells.has(c);
          G.rr(g, x + 2, y + 2, TILE - 4, TILE - 4, 5, on ? G.lin(g, 0, y, 0, y + TILE, [[0, '#d6b8f7'], [1, '#b28ae6']]) : G.lin(g, 0, y, 0, y + TILE, [[0, '#e4c88e'], [1, '#cfae6e']]), 2, on ? G.C.purpleDeep : '#9a7a44');
          if (on) G.text(g, '✕', x + TILE / 2, y + TILE / 2, { size: 16, color: G.C.purpleDeep });
        }
        for (let e = 0; e < 4; e++) { const [x, y, w, h] = edgeRect(f, e); const on = f.edges.has(e); G.rr(g, x, y, w, h, 4, on ? '#b28ae6' : 'rgba(255,255,255,0.35)', 1.5, on ? G.C.purpleDeep : 'rgba(80,60,30,0.4)'); }
        const midY = f.y + TILE * 1.5;
        const stoneAt = (sx, lime) => { G.ell(g, sx, midY + 4, 15, 20, G.lin(g, 0, midY - 16, 0, midY + 24, [[0, '#cfc8b8'], [1, '#8d8678']]), 2.5, '#5e574b'); if (lime) G.ell(g, sx, midY - 9, 12, 8, G.C.lime, 2, '#bdb59a'); };
        if (f.pattern === 'oneStone') { G.ell(g, f.x + S3 / 2, f.y + S3 / 2 + 4, 20, 14, G.lin(g, 0, f.y, 0, f.y + S3, [[0, '#cfc8b8'], [1, '#8d8678']]), 2.5, '#5e574b'); G.ell(g, f.x + S3 / 2, f.y + S3 / 2 - 2, 14, 7, G.C.lime, 2, '#bdb59a'); }
        if (['twoStonesLimeBetween', 'twoStonesSherdsBetween', 'twoStonesLimeOnTop'].includes(f.pattern)) {
          stoneAt(f.x - 24, true); stoneAt(f.x + S3 + 24, true);
          if (f.pattern === 'twoStonesLimeBetween') { g.globalAlpha = 0.85; G.rr(g, f.x + 4, midY - 7, S3 - 8, 14, 7, G.C.lime, 0); g.globalAlpha = 1; }
          if (f.pattern === 'twoStonesSherdsBetween') for (let i = 0; i < 5; i++) G.poly(g, [[f.x + 14 + i * 26, midY + 7], [f.x + 26 + i * 26, midY - 5], [f.x + 32 + i * 26, midY + 8]], G.C.clay, 2, G.C.clayDark);
          if (f.pattern === 'twoStonesLimeOnTop') { for (const sx of [f.x - 24, f.x + S3 + 24]) G.rr(g, sx - 15, midY - 18, 30, 10, 5, G.C.lime, 2, '#bdb59a'); }
        }
        if (f.pattern === 'fourEdges') { G.rr(g, f.x - 18, f.y - 18, S3 + 36, S3 + 36, 8, null, 7, G.C.lime); }
        if (f.pattern === 'oneEdge') { G.line(g, f.x - 18, f.y - 10, f.x - 18, f.y + S3 + 10, 8, G.C.lime); }
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

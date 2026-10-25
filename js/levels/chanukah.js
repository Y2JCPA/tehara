/* ============================================
   TEHARA: Chanukah pack, The Sealed Jug
   Hero: Yehuda, a young Kohen in the days of the Chashmona'im.
   Each level lives in js/levels/ch/ and adds itself to CHANUKAH.
   ============================================ */
const CH = {};
const CHANUKAH = [];

// Inside the Mikdash: Jerusalem-stone walls and a floor
CH.temple = (g, t, { floor = 860, seed = 5, dim = 0 } = {}) => {
  G.sky(g, 'indoor', t);
  G.stoneWall(g, 0, 0, 540, floor, { block: 48, seed, tone: dim });
  G.rr(g, -4, floor, 548, 110, 0, G.lin(g, 0, floor, 0, 960, [[0, '#e6d3a6'], [1, '#bfa572']]), 2.5, G.C.mortar);
  for (let x = -40; x < 560; x += 64) G.line(g, x, floor + 2, x - 30, 960, 1.5, 'rgba(120,90,50,0.3)');
  G.line(g, 0, floor + 40, 540, floor + 40, 1.5, 'rgba(120,90,50,0.25)');
  G.vignette(g, 0.3);
};

// A "choose what to do" room: options are buttons. opt.result(api) returns
// { ok, msg }: ok → next room; otherwise fail (or a mistake if opt.soft).
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

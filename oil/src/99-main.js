// ============================================================ start
// a small hook for automated tests and console poking
window.__oil = {
  get P() { return P; },
  state: () => ({ screen: G.screen, scene: G.sc?.id, busy: busyN.n, loading: G.loading, started: G.started, walking: !!(eli.seg || eli.path.length), modal: !modal.hidden, dlg: !dlg.hidden, menu: !menu.hidden, eli: [eli.c, eli.r], inv: [...P.inv] }),
  screenOf(id) {
    const o = G.objs[id]; if (!o) return null;
    const g = o.exit ? o.exitGroup : o.group;
    let v;
    if (g) {
      const box = new THREE.Box3(); let first = null;
      g.traverse(m => { if (m.isMesh && isShown(m)) { if (!first) first = m; if (!o.pickFirst) box.expandByObject(m); } });
      if (o.pickFirst) box.setFromObject(first);
      v = box.getCenter(new THREE.Vector3()); if (o.exit) v.y = 0.4;
    }
    else v = o.anchor.clone();
    const p = screenPos(v); return [p.x, p.y];
  },
  tileAt: (c, r) => { const p = screenPos(new THREE.Vector3(wx(c), 0, wz(r))); return [p.x, p.y]; },
  hitAt: (x, y) => { const h = pick({ clientX: x, clientY: y }); return h && (h.oid || h.tile); },
  solution: id => sceneById(id)?.solution,
  scenes: () => SCENES.map(s => s.id),
};
setLang(LANG);
requestAnimationFrame(tick);
titleScreen();

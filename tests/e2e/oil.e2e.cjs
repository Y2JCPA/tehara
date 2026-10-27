// Plays The Last Jug from the title screen to the end, through the real UI, using each
// scene's `solution` (including a few deliberate wrong answers). Run with a local server:
//   python3 -m http.server 8765 &   node tests/e2e/oil.e2e.cjs [en|he] [width] [height] [shots-dir]
const { chromium } = require('playwright');
const LANG = process.argv[2] || 'en';
const W = +process.argv[3] || 1280, H = +process.argv[4] || 800;
const SHOTS = process.argv[5] || null;
const URL = process.env.OIL_URL || 'http://localhost:8765/oil/';

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(lang => { try { localStorage.removeItem('tehara.oil.save.v1'); localStorage.setItem('tehara.oil.lang', lang); } catch (e) {} }, LANG);
  await page.goto(URL);
  const st = () => page.evaluate(() => window.__oil.state());
  const sleep = ms => page.waitForTimeout(ms);
  const fail = async msg => {
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${LANG}-FAIL.png` });
    console.log('FAIL:', msg, JSON.stringify(await st()));
    console.log(errors.join('\n'));
    await browser.close(); process.exit(1);
  };
  const check = async () => { if (errors.length) await fail('page error'); };

  // In every scene, once: open the notebook in the middle of a conversation, close it, and
  // check the conversation is still there (it used to vanish and freeze the game).
  const notebookChecked = new Set();
  async function notebookMidConversation() {
    const s = await st();
    if (notebookChecked.has(s.scene) || !s.dlg || s.modal) return;
    notebookChecked.add(s.scene);
    await page.click('#btn-notebook');
    if (!(await waitFor(s2 => s2.modal, 5000))) await fail('notebook did not open');
    await page.locator('#modal .primary').click();
    if (!(await waitFor(s2 => s2.dlg && !s2.modal, 5000))) await fail('conversation did not come back after closing the notebook');
  }

  // advance dialogue and close cards until the game is idle (or back on the title screen)
  async function settle(limit = 600) {
    for (let i = 0; i < limit; i++) {
      await check();
      const s = await st();
      if (s.modal) {
        if (s.screen === 'title') return 'title';
        const ok = page.locator('#modal [data-ok]');
        if (await ok.count()) await ok.first().click();
        else if (await page.locator('#modal .primary').count()) await page.locator('#modal .primary').first().click();
        else await page.locator('#modal [data-v]').first().click();
      } else if (s.dlg) {
        await notebookMidConversation();
        const ok = page.locator('#dlg .choice[data-ok]');
        if (await ok.count()) await ok.first().click();
        else if (await page.locator('#dlg .choice').count()) await page.locator('#dlg .choice').first().click();
        else await page.locator('#dlg .next').click();
      } else if (!s.busy && !s.loading && !s.walking) return 'idle';
      await sleep(90);
    }
    await fail('did not settle');
  }
  async function waitFor(fn, ms = 20000) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { await check(); if (await fn(await st())) return true; await sleep(80); }
    return false;
  }

  // title screen: new game
  await waitFor(s => s.screen === 'title' && s.modal);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${LANG}-00-title.png` });
  await page.locator('#modal [data-v="new"]').click();
  await settle();

  const visits = {};
  let n = 0, prev = null;
  while (true) {
    const s = await st();
    if (s.screen === 'title') break;
    const id = s.scene;
    if (id === prev) await fail(`stuck in scene ${id}`);
    prev = id;
    visits[id] = (visits[id] || 0) + 1;
    let sol = await page.evaluate(id => window.__oil.solution(id), id);
    if (Array.isArray(sol[0])) sol = sol[visits[id] - 1];
    n++;
    if (id === 'hub' && visits[id] === 1) {   // restart from the menu in the middle of a conversation: the scene must still respond
      const [qx, qy] = await page.evaluate(() => window.__oil.screenOf('yochanan'));
      await page.mouse.click(qx, qy);
      if (!(await waitFor(s2 => s2.menu, 20000))) await fail('no menu for Yochanan');
      await page.locator('#menu [data-key="talk"]').click();
      if (!(await waitFor(s2 => s2.dlg, 5000))) await fail('Yochanan did not talk');
      await page.click('#btn-menu');
      if (!(await waitFor(s2 => s2.modal, 5000))) await fail('menu did not open');
      await page.locator('#modal [data-v="restart"]').click();
      await waitFor(s2 => s2.scene === 'hub' && !s2.loading, 10000);
      await settle();
      const [x, y] = await page.evaluate(() => window.__oil.tileAt(2, 5));
      await page.mouse.click(x, y);
      if (!(await waitFor(s2 => s2.walking || (s2.eli[0] === 2 && s2.eli[1] === 5), 5000))) await fail('frozen after restarting the scene from the menu');
      await settle();
    }
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${LANG}-${String(n).padStart(2, '0')}-${id}.png` });
    console.log(`scene ${n}: ${id}${visits[id] > 1 ? ' (visit ' + visits[id] + ')' : ''}`);
    for (const step of sol) {
      await settle();
      if (step.tile) {
        const [x, y] = await page.evaluate(t => window.__oil.tileAt(...t), step.tile);
        await page.mouse.click(x, y);
        await settle(); continue;
      }
      const pos = await page.evaluate(o => window.__oil.screenOf(o), step.o);
      if (!pos) await fail(`no object ${step.o} in ${id}`);
      await page.mouse.click(pos[0], pos[1]);
      if (!step.a) {   // an exit: wait for the scene to change, or for the refusal to be read
        await waitFor(s2 => s2.loading || s2.scene !== id || s2.dlg || s2.modal || (!s2.walking && !s2.busy), 30000);
        await settle(); continue;
      }
      if (!(await waitFor(s2 => s2.menu || s2.dlg || s2.modal, 30000))) await fail(`no menu for ${step.o}`);
      if (!(await st()).menu) await fail(`clicked ${step.o} but something else opened`);
      const b = page.locator(`#menu button[data-key="${step.a}"]`);
      if (!(await b.count())) await fail(`no action ${step.a} on ${step.o}`);
      await b.click();
      if (step.m) {
        if (!(await waitFor(s2 => s2.modal))) await fail('no close-up');
        await page.locator(`#modal [data-v="${step.m}"]`).click();
      }
      if (step.t) {
        if (!(await waitFor(s2 => s2.menu))) await fail('no tag picker');
        await page.locator(`#menu button[data-key="${step.t}"]`).click();
      }
      await settle();
    }
    // the last step should have moved us on
    await waitFor(s2 => s2.scene !== id || s2.screen === 'title', 30000);
    await settle();
  }
  const P = await page.evaluate(() => window.__oil.P);
  console.log(`PASS ${LANG} ${W}x${H}: ${n} scene visits, ${P.done.length} scenes done, ${P.rules.length} rules, ${P.comebacks.length} comebacks`);
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.log('FAIL', e.message); process.exit(1); });

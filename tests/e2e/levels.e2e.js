// Plays every level in a real browser: the right solution must win,
// and each wrong move must fail.
// Run: node tests/e2e/levels.e2e.js   (needs Playwright + Chromium)
//      ONLY=1-6 node tests/e2e/levels.e2e.js   to run one level
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 8000 + Math.floor(Math.random() * 900);
const ROOT = path.join(__dirname, '..', '..');

// ---------- scripts ----------
// steps: ['tap', hot] | ['btn', id] | ['wait', ms] | ['stage', n] | ['drag', hot, [x,y]] | ['dragTo', hot, fn(info)->[x,y]]
const tap = h => ['tap', h], btn = b => ['btn', b], wait = ms => ['wait', ms], stage = n => ['stage', n];
const SCRIPTS = {
  '1-1': {
    win: [tap('boulder'), wait(1500), tap('bridge'), wait(800), tap('route:bridge'), btn('go')],
    fails: [[tap('route:stairs'), btn('go')], [tap('route:ladder'), btn('go')], [tap('bridge'), wait(800), tap('boulder')]],
  },
  '1-2': {
    win: [tap('door'), wait(600), tap('route:bridge'), btn('go'), stage(1), wait(600), tap('plate')], stars: 3,
    alt: [tap('stick'), wait(1500), tap('route:beam'), btn('go'), stage(1), wait(600), tap('plate')],
    alt2: [tap('route:beam'), btn('go'), stage(1), wait(600), tap('bucket'), wait(3500), tap('rain'), wait(3500), ['drag', 'dial', [450, 862]], wait(300), tap('plate')],
    mistakes: [[tap('route:beam'), btn('go'), stage(1), wait(600), tap('plate')]],
  },
  '1-3': {
    win: [tap('stop'), wait(600), tap('rope'), wait(1200), tap('route:log'), btn('go')],
    fails: [[tap('route:seesaw'), btn('go')], [tap('route:rope'), btn('go')], [tap('rope')]],
  },
  '1-4': {
    win: [tap('board'), wait(700), tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), tap('grave'), wait(1100), btn('go')], stars: 3,
    alt: [tap('board'), wait(700), tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), tap('road'), wait(1100), tap('twigs'), wait(1100), btn('go')],
    fails: [[tap('door')], [tap('barrel')], [tap('board'), wait(700), tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), tap('road'), wait(1100), btn('go')],
      [tap('board'), wait(700), tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), btn('board')]],
  },
  '1-5': {
    win: [tap('s1'), tap('s6'), tap('s9'), tap('s14'), tap('s17'), btn('go')],
    alt: [tap('animal:small'), btn('ride')],
    fails: [[tap('s1'), tap('s5'), tap('s9'), tap('s14'), tap('s17'), btn('go')], [tap('animal:big'), btn('ride')], [tap('animal:mule'), btn('ride')], [btn('blow')]],
  },
  '1-6': {
    win: [tap('crate'), wait(900), tap('hay'), wait(1000), tap('cart'), stage(1), wait(600),
      tap('t8_3'), tap('t7_3'), tap('t6_3'), tap('t5_3'), tap('t4_3'), tap('t3_2'), tap('t2_3'), tap('t1_3'), tap('t0_3'),
      btn('path'), ...['8_3', '7_3', '6_3', '5_3', '4_3', '4_2', '3_2', '2_2', '2_3', '1_3', '0_3'].map(k => tap('t' + k)), btn('go')],
    fails: [[tap('cart')], [tap('hay'), wait(1500), tap('cart')],
      [tap('crate'), wait(900), tap('hay'), wait(1000), tap('cart'), stage(1), wait(600), btn('path'), ...['8_3', '7_3', '6_3', '5_3', '4_3', '3_3', '2_3', '1_3', '0_3'].map(k => tap('t' + k)), btn('go')]],
  },
  '1-7': {
    win: [tap('field:c'), ['scale', 'field', 1.2], tap('branch:c'), ['scale', 'branch', 1.2], tap('stone:c'), ['scale', 'stone', 1.2], btn('check')],
    mistakes: [[btn('check')], [tap('field:c'), ['scale', 'field', 1.2], tap('branch:c'), ['scale', 'branch', 1.2], tap('stone:c'), ['scale', 'stone', 1.2], tap('cemetery:c'), ['scale', 'cemetery', 1.2], btn('check')],
      [tap('field:c'), ['scale', 'field', 2.0], tap('branch:c'), ['scale', 'branch', 1.2], tap('stone:c'), ['scale', 'stone', 1.2], btn('check')]],
  },
  '1-8': {
    win: [tap('A4'), tap('B3'), tap('B4'), tap('B5'), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => tap('D' + i)), tap('Ee3'), tap('F3'), tap('F4'), tap('F5'), btn('check')],
    mistakes: [[tap('A4'), tap('B3'), tap('B4'), tap('B5'), tap('C3'), tap('C4'), tap('C5'), btn('check')]],
  },
  '1-9': {
    win: [tap('L'), btn('blow')],
    alt: [tap('R'), btn('walk')],
    fails: [[tap('M'), btn('blow')], [tap('M'), btn('ride')], [tap('L'), btn('walk')]],
  },
  '1-10': { win: [tap('trodden')], fails: [[tap('busy')], [tap('light')], [tap('furrow')]] },
  'C-1': {
    win: [tap('door'), wait(700), tap('flapA'), wait(700), tap('shelf')],
    fails: [[tap('shelf')], [tap('flapA'), wait(700), tap('shelf')], [tap('door'), wait(700), tap('flapA'), wait(700), tap('flapB'), wait(700), tap('shelf')]],
  },
  'C-2': {
    win: [tap('hatchA'), wait(700), tap('hatchB'), wait(700), tap('j7'), tap('j7'), tap('j7'), tap('j7'), btn('bring')],
    fails: [[tap('j2'), btn('bring')], [tap('j3'), btn('bring')], [tap('hatchA'), wait(700), tap('j4'), btn('bring')],
      [tap('hatchA'), wait(700), tap('hatchB'), wait(700), tap('j6'), tap('j6'), tap('j6'), tap('j6'), btn('bring')]],
  },
  'C-3': {
    win: [...[[0, 'leave'], [1, 'leave'], [2, 'take'], [3, 'leave'], [4, 'take'], [5, 'leave'], [6, 'take'], [7, 'leave'], [8, 'take'], [9, 'leave']]
      .map(([i, z]) => ['drag', 'i' + i, z === 'take' ? [139, 760] : [401, 760]]), btn('check')],
    mistakes: [[...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ['drag', 'i' + i, [139, 760]]), btn('check')],
      [...[[0, 'leave'], [1, 'leave'], [2, 'take'], [3, 'leave'], [4, 'take'], [5, 'leave'], [6, 'take'], [7, 'take'], [8, 'take'], [9, 'leave']]
        .map(([i, z]) => ['drag', 'i' + i, z === 'take' ? [139, 760] : [401, 760]]), btn('check')]],
  },
  'C-4': {
    win: [tap('gate1'), wait(600), tap('gate2'), wait(600), tap('wash'), wait(3800), tap('press')],
    fails: [[tap('press')], [tap('gate1'), wait(600), tap('press')], [tap('gate1'), wait(600), tap('gate2'), wait(600), tap('press')]],
  },
  'C-5': {
    win: [tap('boulder'), wait(1500), tap('bridge'), wait(800), tap('route:bridge'), btn('go'), stage(1), wait(500), tap('grave'), wait(1100), btn('go'),
      stage(2), btn('small'), stage(3), tap('L'), btn('ride'), stage(4), btn('A')],
    fails: [[tap('boulder'), wait(1500), tap('bridge'), wait(800), tap('route:bridge'), btn('go'), stage(1), wait(500), tap('grave'), wait(1100), btn('go'), stage(2), btn('blow')],
      [tap('boulder'), wait(1500), tap('bridge'), wait(800), tap('route:bridge'), btn('go'), stage(1), wait(500), tap('grave'), wait(1100), btn('go'), stage(2), btn('small'), stage(3), tap('L'), btn('blow')]],
    mistakes: [[tap('boulder'), wait(1500), tap('bridge'), wait(800), tap('route:bridge'), btn('go'), stage(1), wait(500), tap('grave'), wait(1100), btn('go'), stage(2), btn('small'), stage(3), tap('R'), btn('walk'), stage(4), btn('B')]],
  },
  'C-6': {
    win: [btn('search'), stage(1), ...[0, 1, 2, 3, 4, 5, 6].map(i => tap('lamp' + i)), ...Array(7).fill(btn('next'))], stars: 3,
    mistakes: [[btn('impure')]],
  },
};

// ---------- runner ----------
async function run() {
  const server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const browser = await chromium.launch();
  let failures = 0, passes = 0;
  const only = process.env.ONLY;
  for (const [id, sc] of Object.entries(SCRIPTS)) {
    if (only && only !== id) continue;
    const cases = [['win', sc.win, 'win']];
    if (sc.alt) cases.push(['alt', sc.alt, 'win']);
    if (sc.alt2) cases.push(['alt2', sc.alt2, 'win']);
    (sc.fails || []).forEach((f, i) => cases.push(['fail' + (i + 1), f, 'fail']));
    (sc.mistakes || []).forEach((f, i) => cases.push(['mistake' + (i + 1), f, 'fail']));
    for (const [name, steps, expect] of cases) {
      const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
      const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      try {
        await page.goto(`http://localhost:${PORT}/?gfx=low#level=${id}`);
        await page.waitForFunction(() => window.__tehara, null, { timeout: 15000 });
        await page.waitForTimeout(500);
        await page.evaluate(() => { window.__teharaWon = null; });
        for (const st of steps) await doStep(page, st);
        if (expect === 'win') {
          await page.waitForFunction(() => window.__teharaWon, null, { timeout: 15000 });
          const won = await page.evaluate(() => window.__teharaWon);
          if (sc.stars && name === 'win' && won.stars !== sc.stars) throw new Error(`expected ${sc.stars} stars, got ${won.stars}`);
        } else {
          await page.waitForFunction(() => window.__tehara.info().fails > 0, null, { timeout: 10000 });
        }
        if (errs.length) throw new Error('page errors: ' + errs.join(' | '));
        passes++; console.log(`  ok  ${id} ${name}`);
      } catch (e) {
        failures++; console.log(`FAIL  ${id} ${name}: ${e.message.split('\n')[0]}`);
        await page.screenshot({ path: path.join(ROOT, `tests/e2e/fail-${id}-${name}.png`) }).catch(() => {});
      }
      await page.close();
    }
  }
  await browser.close(); server.kill();
  console.log(`\n${passes} passed, ${failures} failed`);
  process.exit(failures ? 1 : 0);
}

async function toPage(page, x, y) {
  const box = await page.locator('#game').boundingBox();
  return [box.x + x / 540 * box.width, box.y + y / 960 * box.height];
}
async function waitUnlocked(page) {
  await page.waitForFunction(() => !window.__tehara.info().locked, null, { timeout: 10000 });
}
async function doStep(page, st) {
  const [kind, a, b] = st;
  if (kind === 'wait') return page.waitForTimeout(a);
  if (kind === 'stage') {
    await page.waitForFunction(n => window.__tehara.info().stage === n && !window.__tehara.info().locked, a, { timeout: 15000 });
    return;
  }
  if (kind === 'btn') {
    await page.waitForSelector(`#actions [data-btn="${a}"]`, { timeout: 8000 });
    await page.click(`#actions [data-btn="${a}"]`);
    return page.waitForTimeout(150);
  }
  await waitUnlocked(page);
  const hot = await page.evaluate(() => window.__tehara.info().hot);
  if (kind === 'tap') {
    if (!hot[a]) throw new Error('no hotspot ' + a);
    const [x, y] = await toPage(page, ...hot[a]);
    await page.mouse.click(x, y);
    return page.waitForTimeout(120);
  }
  if (kind === 'drag' || kind === 'scale') {
    let from = hot[a], to = b;
    if (kind === 'scale') { const [cx, cy] = hot[a + ':c'], [rx] = hot[a + ':rx']; to = [cx + rx * b, cy]; }
    const [x1, y1] = await toPage(page, ...from), [x2, y2] = await toPage(page, ...to);
    await page.mouse.move(x1, y1); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(x1 + (x2 - x1) * i / 8, y1 + (y2 - y1) * i / 8);
    await page.mouse.up();
    return page.waitForTimeout(150);
  }
  throw new Error('unknown step ' + kind);
}

run();

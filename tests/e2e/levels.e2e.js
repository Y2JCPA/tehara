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
    win: [tap('pin'), wait(1000), btn('go')],
    fails: [[btn('go')]],
  },
  '1-2': {
    win: [tap('pin'), wait(1500), btn('go'), stage(1), wait(600), tap('plate')], stars: 3,
    alt: [btn('go'), stage(1), wait(600), tap('plate'), wait(300), tap('pin'), wait(4500), ['drag', 'dial', [450, 850]], wait(300), tap('plate')],
  },
  '1-3': { win: [tap('pin'), wait(1100), btn('go')], fails: [[btn('go')]] },
  '1-4': {
    win: [tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), tap('road'), wait(1200), btn('go')],
    fails: [[tap('door')], [tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), btn('go')]],
    alt: [tap('barrel'), wait(1600), tap('door'), stage(1), wait(600), tap('grave'), wait(1200), btn('go')],
  },
  '1-5': {
    win: [tap('s0'), tap('s4'), tap('s6'), tap('s10'), tap('s13'), btn('go')],
    fails: [[tap('s0'), tap('s4'), tap('s7'), tap('s11'), tap('s13'), btn('go')], [tap('donkeyWeak')]],
    alt: [tap('donkeyStrong')],
  },
  '1-6': {
    win: [tap('hay'), wait(1000), tap('cart'), stage(1), wait(600),
      tap('t7_3'), tap('t6_3'), tap('t5_3'), tap('t4_3'), tap('t3_2'), tap('t2_2'), tap('t1_1'), tap('t0_1'),
      btn('path'), tap('t7_3'), tap('t6_3'), tap('t5_3'), tap('t4_3'), tap('t3_3'), tap('t3_2'), tap('t2_2'), tap('t1_2'), tap('t1_1'), tap('t0_1'), btn('go')],
    fails: [[tap('cart')], [tap('hay'), wait(1000), tap('cart'), stage(1), wait(600), btn('path'),
      tap('t7_3'), tap('t6_3'), tap('t5_3'), tap('t4_3'), tap('t3_3'), tap('t2_3'), tap('t1_3'), tap('t0_3'), btn('go')]],
  },
  '1-7': {
    win: [['scale', 'field', 1.2], ['scale', 'branch', 1.2], ['scale', 'stone', 1.2], btn('check')],
    mistakes: [[btn('check')], [['scale', 'field', 2.0], ['scale', 'branch', 1.2], ['scale', 'stone', 1.2], btn('check')]],
  },
  '1-8': {
    win: [tap('A4'), tap('B3'), tap('B4'), tap('B5'), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => tap('D' + i)), btn('check')],
    mistakes: [[tap('A4'), btn('check')]],
  },
  '1-9': {
    win: [tap('L'), btn('blow')],
    fails: [[tap('R'), btn('blow')], [tap('R'), btn('ride')], [tap('L'), btn('walk')]],
    alt: [tap('L'), btn('ride')],
  },
  '1-10': { win: [tap('trodden')], fails: [[tap('furrow')], [tap('goat')]] },
  'C-1': {
    win: [tap('door'), wait(700), tap('flap'), wait(700), tap('shelf')],
    fails: [[tap('shelf')], [tap('flap'), wait(700), tap('shelf')]],
  },
  'C-2': {
    win: [tap('hatchA'), wait(700), tap('hatchB'), wait(700), tap('j6'), tap('j6'), tap('j6'), tap('j6'), btn('bring')],
    fails: [[tap('j2'), btn('bring')], [tap('hatchA'), wait(700), tap('j4'), btn('bring')], [tap('hatchA'), wait(700), tap('j3'), btn('bring')]],
  },
  'C-3': {
    win: [['drag', 'i0', [400, 700]], ['drag', 'i1', [400, 700]], ['drag', 'i2', [140, 700]], ['drag', 'i3', [400, 700]],
      ['drag', 'i4', [140, 700]], ['drag', 'i5', [400, 700]], ['drag', 'i6', [140, 700]], btn('check')],
    mistakes: [[0, 1, 2, 3, 4, 5, 6].map(i => ['drag', 'i' + i, [140, 700]]).concat([btn('check')])],
  },
  'C-4': {
    win: [tap('gate'), wait(600), tap('wash'), wait(3600), tap('press')],
    fails: [[tap('press')], [tap('gate'), wait(600), tap('press')]],
  },
  'C-5': {
    win: [tap('pin'), wait(1000), btn('go'), stage(1), wait(500), tap('road'), wait(1200), btn('go'), stage(2), btn('stones'), stage(3), btn('around'), stage(4), btn('sealed')],
    fails: [[tap('pin'), wait(1000), btn('go'), stage(1), wait(500), tap('road'), wait(1200), btn('go'), stage(2), btn('blow')]],
    mistakes: [[tap('pin'), wait(1000), btn('go'), stage(1), wait(500), tap('road'), wait(1200), btn('go'), stage(2), btn('ride'), stage(3), btn('around'), stage(4), btn('cloth')]],
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
    (sc.fails || []).forEach((f, i) => cases.push(['fail' + (i + 1), f, 'fail']));
    (sc.mistakes || []).forEach((f, i) => cases.push(['mistake' + (i + 1), f, 'fail']));
    for (const [name, steps, expect] of cases) {
      const page = await browser.newPage({ viewport: { width: 420, height: 860 } });
      const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      try {
        await page.goto(`http://localhost:${PORT}/#level=${id}`);
        await page.waitForTimeout(700);
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

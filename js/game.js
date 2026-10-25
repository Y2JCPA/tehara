/* ============================================
   TEHARA: the level runtime
   A level is a list of stages (rooms). Each stage is made by a factory
   function (api) => stage, where stage may have:
     draw(g, t), update(dt, t), down(p), move(p), up(p),
     buttons: [{ id, label: {en,he}, onClick }],
     hot(): { name: [x, y] }   (tap targets, used by the browser tests)
   The stage calls api.complete() to move on, or api.fail(msg) to rewind.
   ============================================ */
const Game = (function () {
  const W = 540, H = 960;
  let canvas, g, dpr = 1;
  let level = null, stageIdx = 0, stage = null, hooks = {};
  let raf = 0, last = 0, locked = false, fade = 0, fadeDir = 0, onFadeMid = null;
  let confetti = [];
  let gen = 0;                       // which room is current; timers from an old room are ignored
  const run = { hint: false, fails: 0, bonusNeeded: false, bonus: false, state: {} };

  function init(cv) {
    canvas = cv; g = canvas.getContext('2d');
    const p = e => toLogical(e);
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); if (!locked && stage && stage.down) stage.down(p(e)); });
    canvas.addEventListener('pointermove', e => { if (!locked && stage && stage.move) stage.move(p(e)); });
    canvas.addEventListener('pointerup', e => { if (!locked && stage && stage.up) stage.up(p(e)); });
    window.addEventListener('resize', resize); resize();
  }
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
  }
  function toLogical(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  }

  // ---------- the api a stage gets ----------
  const api = {
    W, H,
    get lang() { return I18N.lang; },
    L: o => I18N.L(o),
    T: Tumah,
    get state() { return run.state; },
    say(msg, kind = 'info', ms = 2600) { if (this.stale) return; hooks.toast && hooks.toast(I18N.L(msg), kind, ms); },
    fail(msg) {
      if (locked || this.stale) return;
      locked = true; run.fails++;
      Sound.play('fail');
      api.say(msg, 'warn', 3200);
      const g0 = gen; setTimeout(() => { if (g0 !== gen) return; startFade(() => { buildStage(); locked = false; }); }, 1900);
    },
    complete() {
      if (locked || this.stale) return;
      locked = true;
      if (stageIdx < level.stages.length - 1) {
        Sound.play('step');
        const g0 = gen; setTimeout(() => { if (g0 !== gen) return; startFade(() => { stageIdx++; buildStage(); locked = false; }); }, 700);
      } else win();
    },
    // a wrong answer that doesn't rewind the room (counts against ★★★)
    mistake(msg) { if (this.stale) return; run.fails++; Sound.play('fail'); api.say(msg, 'warn', 3600); },
    needBonus() { run.bonusNeeded = true; },    // this level has a clever ★★★ solution
    bonus() { run.bonus = true; },
    sfx(n) { Sound.play(n); },
    setButtons(btns) { if (this.stale) return; hooks.buttons && hooks.buttons(btns || []); },
    // true when this api belongs to a room that is no longer on screen
    get stale() { return !level || (this._gen !== undefined && this._gen !== gen); },
    get locked() { return locked; },
  };

  function startFade(mid) { fadeDir = 1; fade = 0; onFadeMid = mid; }

  function buildStage() {
    const factory = level.stages[stageIdx];
    const roomApi = Object.create(api); roomApi._gen = ++gen;
    stage = factory(roomApi);
    roomApi.setButtons(stage.buttons || []);
    if (stage.intro) roomApi.say(stage.intro, 'info', 3600);
  }

  function start(levelDef, h) {
    level = levelDef; hooks = h || {}; stageIdx = 0; locked = false; confetti = [];
    run.hint = false; run.fails = 0; run.bonusNeeded = false; run.bonus = false; run.state = {};
    buildStage();
    cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
  }
  function stop() { cancelAnimationFrame(raf); stage = null; level = null; gen++; fadeDir = 0; fade = 0; onFadeMid = null; }
  function restart() { if (!level) return; const lv = level; start(lv, hooks); }

  function hint() {
    if (!level) return;
    const hs = level.hints && level.hints[stageIdx];
    if (!hs) { api.say(I18N.t('noHint')); return; }
    run.hint = true; api.say(hs, 'hint', 5200);
  }

  function stars() {
    if (run.hint) return 1;
    if (run.fails > 0) return 2;
    if (run.bonusNeeded && !run.bonus) return 2;
    return 3;
  }

  function win() {
    Sound.play('win');
    for (let i = 0; i < 90; i++) confetti.push({ x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.45, vx: (Math.random() - 0.5) * 520, vy: -300 - Math.random() * 480, a: Math.random() * 6, c: ['#f5c542', '#e5484d', '#3fbf6a', '#4fb3e8', '#9b5de5'][i % 5] });
    const st = stars(), lv = level, g0 = gen;
    setTimeout(() => { if (g0 === gen && hooks.win) hooks.win(lv, st); }, 1500);
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (stage && stage.update) stage.update(dt, now);
    for (const c of confetti) { c.vy += 900 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.a += dt * 8; }
    confetti = confetti.filter(c => c.y < H + 40);
    if (fadeDir) {
      fade += dt * 4 * fadeDir;
      if (fadeDir > 0 && fade >= 1) { fade = 1; fadeDir = -1; const m = onFadeMid; onFadeMid = null; m && m(); }
      if (fadeDir < 0 && fade <= 0) { fade = 0; fadeDir = 0; }
    }
    render(now);
    raf = requestAnimationFrame(loop);
  }

  function render(now) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    if (stage && stage.draw) { g.save(); stage.draw(g, now); g.restore(); }
    for (const c of confetti) { g.save(); g.translate(c.x, c.y); g.rotate(c.a); g.fillStyle = c.c; g.fillRect(-5, -3, 10, 6); g.restore(); }
    if (fade > 0) { g.fillStyle = `rgba(255,250,235,${fade})`; g.fillRect(0, 0, W, H); }
  }

  // for the browser tests
  function testInfo() {
    return {
      level: level && level.id, stage: stageIdx, stages: level ? level.stages.length : 0,
      locked, hot: stage && stage.hot ? stage.hot() : {}, state: run.state, fails: run.fails,
    };
  }

  return { init, start, stop, restart, hint, api, testInfo, W, H };
})();

// ---------- tiny synth sounds (no files) ----------
const Sound = (function () {
  let ctx = null, on = true;
  try { on = localStorage.getItem('tehara.sound') !== 'off'; } catch (e) {}
  function ac() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return ctx; }
  function tone(f, d, type = 'sine', vol = 0.12, when = 0, slide = 0) {
    const a = ac(); if (!a || !on) return;
    const o = a.createOscillator(), gn = a.createGain(), t0 = a.currentTime + when;
    o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + d);
    gn.gain.setValueAtTime(vol, t0); gn.gain.exponentialRampToValueAtTime(0.001, t0 + d);
    o.connect(gn); gn.connect(a.destination); o.start(t0); o.stop(t0 + d + 0.02);
  }
  const SFX = {
    pin: () => tone(660, 0.12, 'triangle', 0.12, 0, 990),
    tap: () => tone(520, 0.06, 'square', 0.05),
    thunk: () => tone(140, 0.12, 'sine', 0.2),
    wobble: () => { tone(300, 0.08, 'triangle', 0.08); tone(260, 0.08, 'triangle', 0.08, 0.08); tone(300, 0.08, 'triangle', 0.08, 0.16); },
    whoosh: () => tone(900, 0.35, 'sawtooth', 0.04, 0, 200),
    step: () => tone(440, 0.1, 'sine', 0.1, 0, 660),
    fail: () => { tone(392, 0.18, 'triangle', 0.12); tone(311, 0.3, 'triangle', 0.12, 0.16); },
    win: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, i * 0.11)); },
    splash: () => tone(500, 0.3, 'sawtooth', 0.05, 0, 120),
    blow: () => tone(1200, 0.25, 'sawtooth', 0.03, 0, 300),
  };
  function play(n) { if (!on) return; ac(); SFX[n] && SFX[n](); }
  function toggle() { on = !on; try { localStorage.setItem('tehara.sound', on ? 'on' : 'off'); } catch (e) {} return on; }
  return { play, toggle, get on() { return on; } };
})();

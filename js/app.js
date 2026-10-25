/* ============================================
   TEHARA: screens (title, map, game, Why? card) and progress
   ============================================ */
(function () {
  const $ = s => document.querySelector(s);
  const LEVELS = [...WORLD1, ...CHANUKAH];
  const PACKS = [
    { id: 'w1', cls: 'w1', title: 'world1', sub: 'world1Sub', levels: WORLD1 },
    { id: 'ch', cls: 'ch', title: 'chanukah', sub: 'chanukahSub', levels: CHANUKAH },
  ];
  const unlockAll = /[?&]unlock=all\b/.test(location.search);

  // ---------- progress ----------
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem('tehara.stars') || '{}') || {}; } catch (e) { progress = {}; }
  function saveStars(id, n) {
    progress[id] = Math.max(progress[id] || 0, n);
    try { localStorage.setItem('tehara.stars', JSON.stringify(progress)); } catch (e) {}
  }
  function unlocked(pack, i) { return unlockAll || i === 0 || !!progress[pack.levels[i - 1].id]; }

  // ---------- text ----------
  function applyText() {
    document.querySelectorAll('[data-t]').forEach(el => { el.textContent = I18N.t(el.dataset.t); });
    $('#t-lang').textContent = I18N.t('language'); $('#m-lang').textContent = I18N.t('language');
    $('#t-sound').textContent = (Sound.on ? '🔊 ' : '🔇 ') + I18N.t('sound');
  }
  function toggleLang() { I18N.setLang(I18N.lang === 'en' ? 'he' : 'en'); applyText(); renderMap(); drawTitle(); }

  // ---------- screens ----------
  function show(id) {
    for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
    if (id !== 'scr-game') Game.stop();
  }

  // ---------- title ----------
  function drawTitle() {
    const cv = $('#title-art'), g = cv.getContext('2d');
    const t = performance.now();
    g.clearRect(0, 0, 540, 520);
    g.save(); g.beginPath(); g.arc(270, 270, 250, 0, Math.PI * 2); g.clip();
    G.sky(g, 'day', t);
    G.hills(g, 330, G.C.hill1, 4, 50); G.hills(g, 380, G.C.hill2, 7, 30);
    G.walls(g, 300, 250, 200, 110);
    G.tree(g, 90, 420, 0.8, 'olive');
    G.ground(g, 0, 430, 540, 120, 'grass');
    Chars.draw(g, 'gad', 160, 470, { s: 1.15, hold: 'blower', mood: 'happy' });
    Chars.draw(g, 'eli', 300, 480, { s: 1.6, mood: 'happy' });
    Chars.draw(g, 'miriam', 410, 470, { s: 1.15, dir: -1 });
    g.restore();
    g.beginPath(); g.arc(270, 270, 250, 0, Math.PI * 2); g.lineWidth = 6; g.strokeStyle = G.C.ink; g.stroke();
  }

  // ---------- map ----------
  function renderMap() {
    const box = $('#worlds'); box.innerHTML = '';
    for (const pack of PACKS) {
      const sec = document.createElement('section'); sec.className = 'world ' + pack.cls;
      sec.innerHTML = `<h2>${I18N.t(pack.title)}</h2><p>${I18N.t(pack.sub)}</p>`;
      const grid = document.createElement('div'); grid.className = 'lvls';
      pack.levels.forEach((lv, i) => {
        const b = document.createElement('button'); b.className = 'lvl'; b.type = 'button';
        const st = progress[lv.id] || 0;
        b.innerHTML = `<span>${lv.id}</span><span class="nm">${I18N.L(lv.title)}</span><small>${'★'.repeat(st)}${'☆'.repeat(3 - st)}</small>`;
        b.dataset.level = lv.id;
        if (!unlocked(pack, i)) { b.disabled = true; b.title = I18N.t('locked'); }
        b.addEventListener('click', () => startLevel(lv.id));
        grid.appendChild(b);
      });
      sec.appendChild(grid); box.appendChild(sec);
    }
  }

  // ---------- game ----------
  let current = null, toastTimer = 0;
  function toast(msg, kind, ms) {
    const el = $('#toast'); el.textContent = msg; el.className = 'show ' + (kind || '');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.className = ''; }, ms || 2600);
    el.dataset.last = msg;
  }
  function buttons(list) {
    const bar = $('#actions'); bar.innerHTML = '';
    for (const b of list) {
      const el = document.createElement('button'); el.type = 'button';
      el.className = 'btn ' + (b.cls || 'btn-gold') + (b.on ? ' on' : '');
      el.textContent = b.label ? I18N.L(b.label) : I18N.t('go');
      el.dataset.btn = b.id;
      el.addEventListener('click', () => { if (!Game.api.locked) b.onClick(); });
      bar.appendChild(el);
    }
  }
  function startLevel(id) {
    current = LEVELS.find(l => l.id === id); if (!current) return;
    show('scr-game'); $('#why').hidden = true;
    $('#g-title').textContent = `${current.id} · ${I18N.L(current.title)}`;
    $('#toast').className = '';
    Game.start(current, { toast, buttons, win: onWin });
  }
  function onWin(lv, stars) {
    saveStars(lv.id, stars);
    window.__teharaWon = { id: lv.id, stars };
    $('#why-stars').innerHTML = [1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'off'}">★</span>`).join('');
    $('#why-level').textContent = '· ' + I18N.L(lv.title);
    $('#why-text').innerHTML = I18N.L(lv.why.text).split('\n\n').map(p => `<p>${p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('');
    $('#why-sources').innerHTML = lv.why.sources.map(s =>
      `<li>${s.q ? `<span class="q">${s.q}</span>` : ''}${I18N.L(s.ref)}${s.url ? ` · <a href="${s.url}" target="_blank" rel="noopener">${I18N.t('readSefaria')}</a>` : ''}</li>`).join('');
    const idx = LEVELS.indexOf(lv); const nxt = LEVELS[idx + 1];
    const samePack = nxt && nxt.pack === lv.pack;
    $('#why-next').hidden = !samePack;
    $('#why').hidden = false;
    $('#why .why-card').scrollTop = 0;
  }

  // ---------- wiring ----------
  $('#t-play').addEventListener('click', () => { renderMap(); show('scr-map'); });
  $('#t-lang').addEventListener('click', toggleLang);
  $('#m-lang').addEventListener('click', toggleLang);
  $('#t-sound').addEventListener('click', () => { Sound.toggle(); applyText(); });
  $('#m-back').addEventListener('click', () => show('scr-title'));
  $('#g-map').addEventListener('click', () => { renderMap(); show('scr-map'); });
  $('#g-hint').addEventListener('click', () => Game.hint());
  $('#g-restart').addEventListener('click', () => Game.restart());
  $('#why-replay').addEventListener('click', () => startLevel(current.id));
  $('#why-next').addEventListener('click', () => { const i = LEVELS.indexOf(current); startLevel(LEVELS[i + 1].id); });
  $('#why').addEventListener('click', e => { if (e.target.id === 'why') { $('#why').hidden = true; renderMap(); show('scr-map'); } });

  Game.init($('#game'));
  I18N.setLang(I18N.lang);
  applyText();
  drawTitle();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawTitle);

  // deep link for testing and play-testers: #level=1-6
  const m = location.hash.match(/level=([\w-]+)/);
  if (m) startLevel(m[1]);

  // hooks for the browser tests
  window.__tehara = { startLevel, info: () => Game.testInfo(), levels: LEVELS.map(l => l.id) };

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();

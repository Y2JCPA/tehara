// Offline support: network first, falling back to the cached copy.
const CACHE = 'tehara-v1';
const FILES = ['./', 'index.html', 'css/style.css', 'manifest.json', 'icon.svg',
  'js/i18n.js', 'js/engine/tumah.js', 'js/gfx.js', 'js/chars.js', 'js/game.js',
  'js/levels/kit.js', 'js/levels/world1.js', 'js/levels/chanukah.js', 'js/app.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});

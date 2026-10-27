/* Atomic offline shell. An updated worker replaces the previous WebGL cache. */
const CACHE='tehara-illustrated-v3';
const SHELL=['./classic.html','./css/rebuild.css','./js/engine/tumah.js','./js/rebuild/levels.js','./js/rebuild/art.js','./js/rebuild/app.js','./icon.svg','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('tehara')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./classic.html')));return}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)))});

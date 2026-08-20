const CACHE = 'titans-cc-brand-2026-v22';
const SHELL = [
  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/source-activity.css', '/stats-hub.css', '/market-hub.css',
  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/fan-polish.js', '/team-room.js', '/source-activity.js', '/stats-hub.js', '/market-hub.js', '/accessibility-runtime.js',
  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
  '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/oilers-derrick.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'
];
const SHELL_PATHS=new Set(SHELL.map(path=>new URL(path,self.location.origin).pathname));
const NETWORK_FIRST=/\.(?:js|mjs|css|webmanifest)$/i;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));
    return;
  }
  if(!SHELL_PATHS.has(url.pathname))return;
  if(NETWORK_FIRST.test(url.pathname)){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));
    return response;
  })));
});

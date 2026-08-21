const CACHE = 'titans-cc-brand-2026-v38';
const SHELL = [
  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css', '/fan-experience-v09.css', '/fan-platform-v10.css', '/fan-enrichment-v13.css', '/fan-enrichment-addons-v13.css', '/media-center-v14.css', '/media-timecodes-v14.css', '/media-interaction-hotfix-v14.css', '/premium-experience-v14.css', '/market-fast-v14.css',
  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js', '/fan-experience-v09.js', '/fan-platform-v10.js', '/fan-enrichment-v13.js', '/fan-enrichment-addons-v13.js', '/fan-enrichment-tabfix-v13.js', '/ios-home-screen.js', '/media-center-v14.js', '/media-timecodes-v14.js', '/media-search-v14.js', '/premium-experience-v14.js', '/market-fast-v14.js',
  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
  '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'
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
self.addEventListener('push',event=>{
  let payload={};
  try{payload=event.data?.json?.()||{body:event.data?.text?.()||''}}catch{payload={body:event.data?.text?.()||''}}
  const title=String(payload.title||'Titans Command Center');
  const options={body:String(payload.body||'A Titans update is available.'),tag:String(payload.tag||'titans-update'),icon:'/assets/icon-192.png',badge:'/assets/icon-192.png',data:{url:String(payload.url||'/#home')},renotify:Boolean(payload.renotify)};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'/#home',self.location.origin).href;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{
    for(const client of clients){if('navigate'in client)client.navigate(target);if('focus'in client)return client.focus();}
    return self.clients.openWindow?self.clients.openWindow(target):undefined;
  }));
});
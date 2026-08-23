# Cloudflare deployment status

- Status: **quality gate failed before Cloudflare deploy**
- Source commit: `319f03e19af5dab9d4920388c09a1bf9fbe0a2da`
- Quality gate: failure
- Cloudflare credentials available: true
- DATABASE_URL GitHub secret supplied: true
- Deploy outcome: skipped
- Production regression: skipped
- Browser navigation regression: skipped
- Listen Watch browser regression: skipped
- Command Intelligence browser regression: skipped
- Player Intelligence / Game Day browser regression: skipped
- Ask Titans browser regression: skipped
- Change Intelligence browser regression: skipped
- Runtime / 365 Mode browser regression: skipped
- Data freshness browser regression: skipped
- Account / Guest browser regression: skipped
- Advanced analytics browser regression: skipped
- Player headshot browser regression: skipped
- Worker URL: existing deployment remains unchanged
- Recorded: 2026-08-23T02:25:29Z

## Quality gate failure context

```text
not ok 1 - v1.16 backup restore is loaded through the stable account module and packaged offline
  ---
  duration_ms: 4.948714
  location: '/home/runner/work/titans-command-center/titans-command-center/tests/account-import-v116.test.mjs:6:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /titans-cc-brand-2026-v59/. Input:
    
    "const CACHE = 'titans-cc-brand-2026-v60';\n" +
      'const SHELL = [\n' +
      "  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/smart-search-v111.css', '/mobile-navigation-v112.css', '/account-v112.css', '/account-import-v116.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css', '/fan-experience-v09.css', '/fan-platform-v10.css', '/fan-enrichment-v13.css', '/fan-enrichment-addons-v13.css', '/ask-titans-v17.css', '/media-center-v14.css', '/media-timecodes-v14.css', '/media-interaction-hotfix-v14.css', '/media-alternatives-v14.css', '/media-custom-links-v14.css', '/premium-experience-v14.css', '/market-fast-v14.css', '/command-intelligence-v15.css', '/command-intelligence-addons-v15.css', '/change-intelligence-v18.css', '/player-intelligence-v16.css', '/gameday-v16.css', '/mode-365-v19.css',\n" +
      "  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/runtime-v19.js', '/team-time-v21.js', '/mode-365-v19.js', '/smart-search-v111.js', '/mobile-navigation-v112.js', '/account-sync-v112.js', '/account-v112.js', '/account-import-v116.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js', '/fan-experience-v09.js', '/fan-platform-v10.js', '/fan-enrichment-v13.js', '/fan-enrichment-addons-v13.js', '/ask-titans-v17.js', '/fan-enrichment-tabfix-v13.js', '/ios-home-screen.js', '/media-center-v14.js', '/media-timecodes-v14.js', '/media-alternatives-v14.js', '/media-custom-links-v14.js', '/media-search-v14.js', '/premium-experience-v14.js', '/market-fast-v14.js', '/command-intelligence-v15.js', '/command-intelligence-addons-v15.js', '/change-intelligence-v18.js', '/change-intelligence-loadfix-v18.js', '/command-search-v15.js', '/command-route-guard-v15.js', '/player-intelligence-v16.js', '/gameday-v16.js',\n" +
      "  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/src/roster-audit-20260822.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',\n" +
      "  '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'\n" +
      '];\n' +
      'const SHELL_PATHS=new Set(SHELL.map(path=>new URL(path,self.location.origin).pathname));\n' +
      'const NETWORK_FIRST=/\\.(?:js|mjs|css|webmanifest)$/i;\n' +
      "self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});\n" +
      "self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\n" +
      "self.addEventListener('fetch',event=>{\n" +
      "  if(event.request.method!=='GET')return;\n" +
      '  const url=new URL(event.request.url);\n' +
      '  if(url.origin!==self.location.origin)return;\n' +
      "  if(url.pathname.startsWith('/api/'))return;\n" +
      "  if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;}\n" +
      '  if(!SHELL_PATHS.has(url.pathname))return;\n' +
      '  if(NETWORK_FIRST.test(url.pathname)){event.respondWith(fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));return;}\n' +
      '  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;})));\n' +
      '});\n' +
      "self.addEventListener('push',event=>{let payload={};try{payload=event.data?.json?.()||{body:event.data?.text?.()||''}}catch{payload={body:event.data?.text?.()||''}}const title=String(payload.title||'Titans Command Center');const options={body:String(payload.body||'A Titans update is available.'),tag:String(payload.tag||'titans-update'),icon:'/assets/icon-192.png',badge:'/assets/icon-192.png',data:{url:String(payload.url||'/#home')},renotify:Boolean(payload.renotify)};event.waitUntil(self.registration.showNotification(title,options));});\n" +
      "self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/#home',self.location.origin).href;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('navigate'in client)client.navigate(target);if('focus'in client)return client.focus();}return self.clients.openWindow?self.clients.openWindow(target):undefined;}));});\n"
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    const CACHE = 'titans-cc-brand-2026-v60';
    const SHELL = [
      '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/smart-search-v111.css', '/mobile-navigation-v112.css', '/account-v112.css', '/account-import-v116.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css', '/fan-experience-v09.css', '/fan-platform-v10.css', '/fan-enrichment-v13.css', '/fan-enrichment-addons-v13.css', '/ask-titans-v17.css', '/media-center-v14.css', '/media-timecodes-v14.css', '/media-interaction-hotfix-v14.css', '/media-alternatives-v14.css', '/media-custom-links-v14.css', '/premium-experience-v14.css', '/market-fast-v14.css', '/command-intelligence-v15.css', '/command-intelligence-addons-v15.css', '/change-intelligence-v18.css', '/player-intelligence-v16.css', '/gameday-v16.css', '/mode-365-v19.css',
      '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/runtime-v19.js', '/team-time-v21.js', '/mode-365-v19.js', '/smart-search-v111.js', '/mobile-navigation-v112.js', '/account-sync-v112.js', '/account-v112.js', '/account-import-v116.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js', '/fan-experience-v09.js', '/fan-platform-v10.js', '/fan-enrichment-v13.js', '/fan-enrichment-addons-v13.js', '/ask-titans-v17.js', '/fan-enrichment-tabfix-v13.js', '/ios-home-screen.js', '/media-center-v14.js', '/media-timecodes-v14.js', '/media-alternatives-v14.js', '/media-custom-links-v14.js', '/media-search-v14.js', '/premium-experience-v14.js', '/market-fast-v14.js', '/command-intelligence-v15.js', '/command-intelligence-addons-v15.js', '/change-intelligence-v18.js', '/change-intelligence-loadfix-v18.js', '/command-search-v15.js', '/command-route-guard-v15.js', '/player-intelligence-v16.js', '/gameday-v16.js',
      '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/src/roster-audit-20260822.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
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
      if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;}
      if(!SHELL_PATHS.has(url.pathname))return;
      if(NETWORK_FIRST.test(url.pathname)){event.respondWith(fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));return;}
      event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;})));
    });
    self.addEventListener('push',event=>{let payload={};try{payload=event.data?.json?.()||{body:event.data?.text?.()||''}}catch{payload={body:event.data?.text?.()||''}}const title=String(payload.title||'Titans Command Center');const options={body:String(payload.body||'A Titans update is available.'),tag:String(payload.tag||'titans-update'),icon:'/assets/icon-192.png',badge:'/assets/icon-192.png',data:{url:String(payload.url||'/#home')},renotify:Boolean(payload.renotify)};event.waitUntil(self.registration.showNotification(title,options));});
    self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/#home',self.location.origin).href;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('navigate'in client)client.navigate(target);if('focus'in client)return client.focus();}return self.clients.openWindow?self.clients.openWindow(target):undefined;}));});
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/account-import-v116.test.mjs:9:97)
    Test.runInAsyncScope (node:async_hooks:206:9)
    Test.run (node:internal/test_runner/test:796:25)
    Test.processPendingSubtests (node:internal/test_runner/test:526:18)
    node:internal/test_runner/harness:255:12
    node:internal/process/task_queues:140:7
    AsyncResource.runInAsyncScope (node:async_hooks:206:9)
    AsyncResource.runMicrotask (node:internal/process/task_queues:137:8)
not ok 19 - account layer is explicitly loaded and packaged offline
  ---
  duration_ms: 4.696655
  location: '/home/runner/work/titans-command-center/titans-command-center/tests/account-v112.test.mjs:6:1'
  failureType: 'testCodeFailure'
  error: |-
    The input did not match the regular expression /titans-cc-brand-2026-v59/. Input:
    
    "const CACHE = 'titans-cc-brand-2026-v60';\n" +
      'const SHELL = [\n' +
      "  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/smart-search-v111.css', '/mobile-navigation-v112.css', '/account-v112.css', '/account-import-v116.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css', '/fan-experience-v09.css', '/fan-platform-v10.css', '/fan-enrichment-v13.css', '/fan-enrichment-addons-v13.css', '/ask-titans-v17.css', '/media-center-v14.css', '/media-timecodes-v14.css', '/media-interaction-hotfix-v14.css', '/media-alternatives-v14.css', '/media-custom-links-v14.css', '/premium-experience-v14.css', '/market-fast-v14.css', '/command-intelligence-v15.css', '/command-intelligence-addons-v15.css', '/change-intelligence-v18.css', '/player-intelligence-v16.css', '/gameday-v16.css', '/mode-365-v19.css',\n" +
      "  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/runtime-v19.js', '/team-time-v21.js', '/mode-365-v19.js', '/smart-search-v111.js', '/mobile-navigation-v112.js', '/account-sync-v112.js', '/account-v112.js', '/account-import-v116.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js', '/fan-experience-v09.js', '/fan-platform-v10.js', '/fan-enrichment-v13.js', '/fan-enrichment-addons-v13.js', '/ask-titans-v17.js', '/fan-enrichment-tabfix-v13.js', '/ios-home-screen.js', '/media-center-v14.js', '/media-timecodes-v14.js', '/media-alternatives-v14.js', '/media-custom-links-v14.js', '/media-search-v14.js', '/premium-experience-v14.js', '/market-fast-v14.js', '/command-intelligence-v15.js', '/command-intelligence-addons-v15.js', '/change-intelligence-v18.js', '/change-intelligence-loadfix-v18.js', '/command-search-v15.js', '/command-route-guard-v15.js', '/player-intelligence-v16.js', '/gameday-v16.js',\n" +
      "  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/src/roster-audit-20260822.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',\n" +
      "  '/assets/brand/current-lockup.webp', '/assets/archive/current-shield-primary.webp', '/assets/archive/logo-transition-shield-fireball.webp', '/assets/archive/fireball-wordmark.webp', '/assets/archive/fireball-on-navy.webp'\n" +
      '];\n' +
      'const SHELL_PATHS=new Set(SHELL.map(path=>new URL(path,self.location.origin).pathname));\n' +
      'const NETWORK_FIRST=/\\.(?:js|mjs|css|webmanifest)$/i;\n' +
      "self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});\n" +
      "self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\n" +
      "self.addEventListener('fetch',event=>{\n" +
      "  if(event.request.method!=='GET')return;\n" +
      '  const url=new URL(event.request.url);\n' +
      '  if(url.origin!==self.location.origin)return;\n' +
      "  if(url.pathname.startsWith('/api/'))return;\n" +
      "  if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;}\n" +
      '  if(!SHELL_PATHS.has(url.pathname))return;\n' +
      '  if(NETWORK_FIRST.test(url.pathname)){event.respondWith(fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));return;}\n' +
      '  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;})));\n' +
      '});\n' +
      "self.addEventListener('push',event=>{let payload={};try{payload=event.data?.json?.()||{body:event.data?.text?.()||''}}catch{payload={body:event.data?.text?.()||''}}const title=String(payload.title||'Titans Command Center');const options={body:String(payload.body||'A Titans update is available.'),tag:String(payload.tag||'titans-update'),icon:'/assets/icon-192.png',badge:'/assets/icon-192.png',data:{url:String(payload.url||'/#home')},renotify:Boolean(payload.renotify)};event.waitUntil(self.registration.showNotification(title,options));});\n" +
      "self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/#home',self.location.origin).href;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('navigate'in client)client.navigate(target);if('focus'in client)return client.focus();}return self.clients.openWindow?self.clients.openWindow(target):undefined;}));});\n"
    
  code: 'ERR_ASSERTION'
  name: 'AssertionError'
  expected:
  actual: |-
    const CACHE = 'titans-cc-brand-2026-v60';
    const SHELL = [
      '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css', '/player-polish.css', '/headshot-polish.css', '/fan-polish.css', '/team-room.css', '/audit-responsive.css', '/usability-runtime.css', '/smart-search-v111.css', '/mobile-navigation-v112.css', '/account-v112.css', '/account-import-v116.css', '/source-activity.css', '/stats-hub.css', '/analytics-hub.css', '/market-hub.css', '/fan-experience-v09.css', '/fan-platform-v10.css', '/fan-enrichment-v13.css', '/fan-enrichment-addons-v13.css', '/ask-titans-v17.css', '/media-center-v14.css', '/media-timecodes-v14.css', '/media-interaction-hotfix-v14.css', '/media-alternatives-v14.css', '/media-custom-links-v14.css', '/premium-experience-v14.css', '/market-fast-v14.css', '/command-intelligence-v15.css', '/command-intelligence-addons-v15.css', '/change-intelligence-v18.css', '/player-intelligence-v16.css', '/gameday-v16.css', '/mode-365-v19.css',
      '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js', '/player-polish.js', '/headshot-polish.js', '/fan-polish.js', '/team-room.js', '/usability-runtime.js', '/runtime-v19.js', '/team-time-v21.js', '/mode-365-v19.js', '/smart-search-v111.js', '/mobile-navigation-v112.js', '/account-sync-v112.js', '/account-v112.js', '/account-import-v116.js', '/source-activity.js', '/transactions-hub.js', '/stats-hub.js', '/analytics-hub.js', '/market-hub.js', '/accessibility-runtime.js', '/fan-experience-v09.js', '/fan-platform-v10.js', '/fan-enrichment-v13.js', '/fan-enrichment-addons-v13.js', '/ask-titans-v17.js', '/fan-enrichment-tabfix-v13.js', '/ios-home-screen.js', '/media-center-v14.js', '/media-timecodes-v14.js', '/media-alternatives-v14.js', '/media-custom-links-v14.js', '/media-search-v14.js', '/premium-experience-v14.js', '/market-fast-v14.js', '/command-intelligence-v15.js', '/command-intelligence-addons-v15.js', '/change-intelligence-v18.js', '/change-intelligence-loadfix-v18.js', '/command-search-v15.js', '/command-route-guard-v15.js', '/player-intelligence-v16.js', '/gameday-v16.js',
      '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs', '/src/visual-audit.mjs', '/src/roster-audit-20260819.mjs', '/src/roster-audit-20260822.mjs', '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
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
      if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('/index.html')));return;}
      if(!SHELL_PATHS.has(url.pathname))return;
      if(NETWORK_FIRST.test(url.pathname)){event.respondWith(fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(url.pathname))));return;}
      event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response;})));
    });
    self.addEventListener('push',event=>{let payload={};try{payload=event.data?.json?.()||{body:event.data?.text?.()||''}}catch{payload={body:event.data?.text?.()||''}}const title=String(payload.title||'Titans Command Center');const options={body:String(payload.body||'A Titans update is available.'),tag:String(payload.tag||'titans-update'),icon:'/assets/icon-192.png',badge:'/assets/icon-192.png',data:{url:String(payload.url||'/#home')},renotify:Boolean(payload.renotify)};event.waitUntil(self.registration.showNotification(title,options));});
    self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/#home',self.location.origin).href;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('navigate'in client)client.navigate(target);if('focus'in client)return client.focus();}return self.clients.openWindow?self.clients.openWindow(target):undefined;}));});
    
  operator: 'match'
  stack: |-
    TestContext.<anonymous> (file:///home/runner/work/titans-command-center/titans-command-center/tests/account-v112.test.mjs:8:257)
    Test.runInAsyncScope (node:async_hooks:206:9)
    Test.run (node:internal/test_runner/test:796:25)
    Test.processPendingSubtests (node:internal/test_runner/test:526:18)
    node:internal/test_runner/harness:255:12
    node:internal/process/task_queues:140:7
    AsyncResource.runInAsyncScope (node:async_hooks:206:9)
    AsyncResource.runMicrotask (node:internal/process/task_queues:137:8)

--- tail ---
  ...
# Subtest: fan-facing base pages prefer live/backup language over storage implementation jargon
ok 291 - fan-facing base pages prefer live/backup language over storage implementation jargon
  ---
  duration_ms: 0.255913
  ...
# Subtest: roster team-room switcher has plain button semantics, keyboard cycling and safe source links
ok 292 - roster team-room switcher has plain button semantics, keyboard cycling and safe source links
  ---
  duration_ms: 0.402351
  ...
# Subtest: rich player pages use the server player endpoint
ok 293 - rich player pages use the server player endpoint
  ---
  duration_ms: 0.296042
  ...
# Subtest: fan status UI uses reader-friendly coverage language instead of implementation jargon
ok 294 - fan status UI uses reader-friendly coverage language instead of implementation jargon
  ---
  duration_ms: 0.245567
  ...
# Subtest: source activity distinguishes checked rows from new rows in fan-readable language
ok 295 - source activity distinguishes checked rows from new rows in fan-readable language
  ---
  duration_ms: 0.296593
  ...
# Subtest: v0.6 database adapter uses current live schema columns
ok 296 - v0.6 database adapter uses current live schema columns
  ---
  duration_ms: 0.372747
  ...
# Subtest: visual archive uses audited metadata instead of ambiguous legacy aliases
ok 297 - visual archive uses audited metadata instead of ambiguous legacy aliases
  ---
  duration_ms: 0.296493
  ...
# Subtest: responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
ok 298 - responsive layer covers phone, tablet and wide desktop and hides unverified legacy first paint
  ---
  duration_ms: 0.264185
  ...
# Subtest: visual source registry includes official, specialist and Wikipedia cross-checks
ok 299 - visual source registry includes official, specialist and Wikipedia cross-checks
  ---
  duration_ms: 1.226221
  ...
# Subtest: active visual catalog never uses quarantined legacy aliases
ok 300 - active visual catalog never uses quarantined legacy aliases
  ---
  duration_ms: 0.324204
  ...
# Subtest: representative and composite art cannot masquerade as exact official logos
ok 301 - representative and composite art cannot masquerade as exact official logos
  ---
  duration_ms: 0.677542
  ...
# Subtest: 2018 is treated as a uniform and wordmark change, not a new primary logo
ok 302 - 2018 is treated as a uniform and wordmark change, not a new primary logo
  ---
  duration_ms: 1.013824
  ...
# Subtest: Tennessee Oilers transition preserves alternate-logo nuance
ok 303 - Tennessee Oilers transition preserves alternate-logo nuance
  ---
  duration_ms: 0.288732
  ...
# Subtest: current Shield receives exact current-brand treatment
ok 304 - current Shield receives exact current-brand treatment
  ---
  duration_ms: 0.203204
  ...
1..304
# tests 304
# suites 0
# pass 302
# fail 2
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1438.642032
```

Generated automatically by `.github/workflows/cloudflare-deploy.yml`.

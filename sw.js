const CACHE = 'titans-cc-brand-2026-v5';
const SHELL = [
  '/', '/index.html', '/styles.css', '/brand.css', '/legacy-polish.css', '/fact-polish.css', '/ux-polish.css',
  '/app.js', '/legacy-polish.js', '/fact-polish.js', '/ux-polish.js',
  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs',
  '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
  '/assets/brand/current-lockup.webp'
];
const SHELL_PATHS = new Set(SHELL.map(path => new URL(path, self.location.origin).pathname));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API/auth responses. This prevents stale 401/403/5xx responses
  // and authenticated payloads from entering the PWA cache.
  if (url.pathname.startsWith('/api/')) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  if (!SHELL_PATHS.has(url.pathname)) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});

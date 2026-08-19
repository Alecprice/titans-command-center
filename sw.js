const CACHE = 'titans-cc-brand-2026-v1';
const SHELL = [
  '/', '/index.html', '/styles.css', '/brand.css', '/app.js',
  '/src/core.mjs', '/src/data.mjs', '/src/odds.mjs',
  '/manifest.webmanifest', '/assets/icon-192.png', '/assets/icon-512.png',
  '/assets/brand/current-lockup.webp',
  '/assets/legacy/legacy-derrick.webp',
  '/assets/legacy/legacy-fireball.webp',
  '/assets/legacy/legacy-sword.webp',
  '/assets/legacy/legacy-logo-evolution.webp',
  '/assets/legacy/legacy-wordmark-fireball.webp',
  '/assets/legacy/legacy-banner.webp'
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

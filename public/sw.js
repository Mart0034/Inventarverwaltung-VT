const CACHE = 'fundus-shell-v2';
const SHELL_FILES = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.json',
  '/fonts/oswald-700.woff2', '/fonts/plexsans-400.woff2', '/fonts/plexsans-600.woff2',
  '/fonts/plexmono-400.woff2', '/fonts/plexmono-600.woff2',
  '/icons/icon-192.png', '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for everything: this app is under active development and
// deploys often, so always prefer the latest version when online. The
// cache exists purely as an offline fallback, not to save a network round
// trip -- a stale-but-cached app shell is worse than a slightly slower load.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request).then((res) => {
      if (res.ok) caches.open(CACHE).then((c) => c.put(event.request, res.clone()));
      return res;
    }).catch(() => caches.match(event.request))
  );
});

// Keeps a copy of the whole board on the iPad/phone, so it works at daycare without Wi-Fi.
// Serves the saved copy at once and refreshes it in the background, so a change
// shows up the second time the board is opened. tools/build.mjs bumps VERSION,
// which throws the old copy away.
const VERSION = '202610071537';
const CACHE = 'i-can-say-' + VERSION;
const SHELL = [
  './', 'index.html', 'style.css', 'app.js', 'words.js', 'audio-data.js', 'manifest.webmanifest',
  'fonts/andika-400.woff2', 'fonts/andika-700.woff2',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    const src = await (await cache.match('words.js')).text();
    const words = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));
    await cache.addAll(words.flatMap(w => [
      typeof w.picture === 'number' ? `pictures/${w.id}.png` : `pictures/${w.picture}`,
      `audio/zh/${w.id}.m4a`,
      `audio/en/${w.id}.m4a`,
    ]));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('i-can-say-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req).then(res => {
      if (res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    });
    if (saved) {
      event.waitUntil(fresh.catch(() => {}));
      return saved;
    }
    return fresh;
  })());
});

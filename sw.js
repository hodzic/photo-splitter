// Bump VERSION when you change icons or manifest so phones pick up the new files.
const VERSION = 'splitter-v4';
const SHELL = ['/photo-splitter/', '/photo-splitter/index.html', '/photo-splitter/manifest.json', '/photo-splitter/icons/icon-192.png', '/photo-splitter/icons/icon-512.png', '/photo-splitter/icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'share-target').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Receive images shared from other apps (Android share sheet)
  if (e.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    e.respondWith((async () => {
      const form = await e.request.formData();
      const file = form.get('image');
      if (file) {
        const cache = await caches.open('share-target');
        await cache.put('shared-image', new Response(file, {
          headers: { 'Content-Type': file.type || 'image/jpeg', 'X-Filename': encodeURIComponent(file.name || 'shared.jpg') }
        }));
      }
      return Response.redirect('/photo-splitter/?shared=1', 303);
    })());
    return;
  }

  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // Page: network first so updates show up, cache when offline
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('/photo-splitter/index.html', copy)); return r; })
        .catch(() => caches.match('/photo-splitter/index.html'))
    );
    return;
  }

  // Everything else: cache first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

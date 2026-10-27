// Run `npm run bump` for every release: VERSION carries the app version (date plus a letter), so installed copies get the update.
const VERSION = 'splitter-2026-10-27a';
const SHELL = ['/photo-splitter/', '/photo-splitter/index.html', '/photo-splitter/manifest.json', '/photo-splitter/icons/icon-192.png', '/photo-splitter/icons/icon-512.png', '/photo-splitter/icons/icon-maskable-512.png'];

// A new version installs and waits until the page asks it to take over (Update available, tap to reload).
// Versions named splitter-vN had no such prompt, so an update over one of those still takes over by itself.
self.addEventListener('install', e => {
  // bypass the HTTP cache: GitHub Pages lets browsers keep files for 10 minutes, which would fill the new cache with old files
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => caches.keys()).then(keys => { if(keys.some(k => /^splitter-v\d+$/.test(k))) self.skipWaiting(); }));
});
self.addEventListener('message', e => { if(e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });

// Only this app's own old caches: the other apps on hodzic.github.io share this origin's storage.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('splitter-') && k !== VERSION).map(k => caches.delete(k))))
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

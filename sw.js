// Run `npm run bump` for every release: VERSION carries the app version (date plus a letter), so installed copies get the update.
// The shared part (install, update, cache cleanup, serving the app's files from the cache and refreshing them in the background)
// is /shared/sw-core.js on hodzic.github.io, used by all the apps there.
importScripts('/shared/sw-core.js');
const VERSION = 'splitter-2026-10-30b';

// Receive images shared from other apps (Android share sheet)
function shareTarget(e, url){
  if (e.request.method !== 'POST' || !url.pathname.endsWith('/share-target')) return false;
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
  return true;
}

appWorker({
  cache: VERSION,
  own: k => k.startsWith('splitter-'), // only this app's own old caches: the other apps on hodzic.github.io share this origin's storage
  shell: ['/photo-splitter/', '/photo-splitter/index.html', '/photo-splitter/manifest.json', '/photo-splitter/icons/icon-192.png', '/photo-splitter/icons/icon-512.png', '/photo-splitter/icons/icon-maskable-512.png'],
  index: '/photo-splitter/index.html',
  legacy: k => /^splitter-v\d+$/.test(k), // versions named splitter-vN had no update prompt: an update over one takes over by itself
  route: shareTarget,
});

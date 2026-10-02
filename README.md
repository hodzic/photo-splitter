# Panorama Splitter

Splits a wide photo into slides that line up seamlessly in an Instagram carousel. Runs entirely in the browser; photos never leave the device. Installable as a PWA with offline support.

Live: [hodzic.github.io/photo-splitter](https://hodzic.github.io/photo-splitter/)

## Features
- 2–20 slides, auto-picked from the photo's aspect ratio
- Square 1:1 or portrait 4:5 slides at 1080 px wide (Instagram's native size)
- Crop (with position slider) or fit the whole photo with white/black bars
- Swipeable carousel preview to check seams
- Share sheet on mobile (send straight to Instagram), ZIP download on desktop, tap a slide to save it alone
- Android: once installed, appears in the share sheet for images
- Correct orientation for rotated phone photos

## Files
- `index.html` – the app
- `manifest.json` – PWA manifest and share target
- `sw.js` – service worker (offline cache, share target)
- `icons/` – app icons

## Updating
Edit and push. The page itself is fetched network-first, so changes show on next open. If you change icons or the manifest, bump `VERSION` in `sw.js`.

# Panorama Splitter

Splits a wide photo into slides that line up seamlessly in an Instagram carousel. Runs entirely in the browser; photos never leave the device. Installable as a PWA with offline support.

Live: [hodzic.github.io/photo-splitter](https://hodzic.github.io/photo-splitter/)

## Features
- 2–20 slides, auto-picked from the photo's aspect ratio
- Square 1:1 or portrait 4:5 slides at 1080 px wide (Instagram's native size)
- Trim the left and right edges by dragging handles on the photo
- Crop (drag the slides on the photo to position them) or fit the whole photo with white/black bars
- Swipeable carousel preview to check seams
- Share sheet on mobile (send straight to Instagram), ZIP download on desktop, tap a slide to save it alone
- Android: once installed, appears in the share sheet for images
- Correct orientation for rotated phone photos

## Files
- `index.html` – the app
- `manifest.json` – PWA manifest and share target
- `sw.js` – service worker (offline cache, share target)
- `icons/` – app icons
- `tools/bump.js` – sets the version (`npm run bump`)

## Updating
Edit, run `npm run bump`, and push. The version is the release date (US Pacific) plus a letter per release that day, e.g. `2026-10-27a`; the bump sets `APP_VERSION` in `index.html` (shown at the bottom of the page) and `VERSION` in `sw.js`. The page itself is fetched network-first, so changes show on next open; the rest (icons, manifest) arrives with the new service worker, which waits until you tap *Update available* or *Check for updates*.

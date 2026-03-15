const CACHE_NAME = 'uds-field-v1';
const urlsToCache = [
  '/',
  '/fse.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => console.log('Cache addAll error:', err));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(err => console.log('Fetch error:', err));
    })
  );
});

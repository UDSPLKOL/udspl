const CACHE_NAME = 'uds-field-v2'; // Incremented version to force update
const urlsToCache = [
  '/',
  '/fse.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Forces this new service worker to become the active one immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching new assets');
      return cache.addAll(urlsToCache).catch(err => console.log('Cache addAll error:', err));
    })
  );
});

// Cleans up old caches (like v1) to save phone storage
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version, or fetch from network if not in cache
      return response || fetch(event.request).catch(err => console.log('Fetch error:', err));
    })
  );
});

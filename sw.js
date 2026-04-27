const CACHE_NAME = 'pixelstudio-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install the service worker and cache main files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch files from the cache first, or get them from the internet and save them
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        return response; // Return the saved file
      }
      return fetch(event.request).then(
        function(response) {
          // Save new files (like your fonts and Tailwind CSS) to the cache
          if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });
          return response;
        }
      );
    })
  );
});
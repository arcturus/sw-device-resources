importScripts('lib/localforage.min.js');

var RESOURCES = {
  'desktop': ['/desktop/style.css'],
  'phone': ['/phone/style.css'],
  'tablet': ['/tablet/style.css'],
  'tv': ['/tv/style.css']
};

self.addEventListener('install', (event) => {
  // Check what device type was detected, or default to desktop
  function checkDevice() {
    localforage.config({
      driver: localforage.INDEXEDDB,
      name: 'device_type'
    });

    return localforage.getItem('type').then((type) => {
      if (!type) {
        type = 'desktop';
      }

      // Cache <device_type>/index.html as our index
      return fetch(type + '/index.html').then((response) => {
        // Cache the response
        return getCache().then((cache) => {
          var request = new Request('index.html');
          return cache.put(request, response).then(() => {
            // And now cache the specific resources
            return cache.addAll(RESOURCES[type]);
          })
        });
      });
    });
  }
  event.waitUntil(checkDevice());
});

self.addEventListener('activate', (event) => {
  // Claim the document, will produce a reload of the page
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Use the typical strategy cache first, if not, network
  event.respondWith(getCache().then((cache) => {
    return cache.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  }));
});

var cachedPromise = null;
function getCache() {
  if (cachedPromise !== null) {
    return cachedPromise;
  }

  cachedPromise = caches.open('resources');
  return cachedPromise;
}

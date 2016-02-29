//From http://www.html5rocks.com/en/tutorials/service-worker/introduction/

var CACHE_NAME = 'offline-first-cache-v1';
var urlsToCache = [
    '/',
    '/css/index.css',
    '/js/app.js',
    '/js/pouchdb.js'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache', urlsToCache);
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    return fetch(event.request);
                }
            )
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
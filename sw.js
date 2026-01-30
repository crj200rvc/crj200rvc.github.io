self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('manual-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/styles.css',
        '/js/app.js',
        '/js/tree.js',
        '/js/viewer.js',
        '/js/search.js',
        '/js/data.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});

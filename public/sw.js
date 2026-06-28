// Service worker minimal pour Rubriques.
// Sa portée est le dossier où il est servi (ex. /Rubriques/), donc pas de chemin absolu.
const CACHE = 'rubriques-v1';

// Pré-cache l'index pour permettre le démarrage hors-ligne (app shell).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html'])).catch(() => {})
  );
  self.skipWaiting();
});

// Nettoyage des anciens caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Navigations (routes SPA) : réseau d'abord, repli sur l'index en cache.
// Autres ressources : cache d'abord, puis réseau (et mise en cache).
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

// Ce fichier sera injecté dans le service worker généré automatiquement
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// Utiliser les modules Workbox
workbox.setConfig({
  debug: false,
});

// Ces options étaient auparavant dans workbox-config.js
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({
  prefix: "temp-converter",
  suffix: "v1",
});

// Active le nettoyage des anciens caches
workbox.precaching.cleanupOutdatedCaches();

// Précache les ressources définies dans workbox-config.js
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Stratégies de mise en cache déplacées depuis workbox-config.js
// Stratégie pour les pages HTML
workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.NetworkFirst({
    cacheName: "html-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24, // 1 jour
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Stratégie pour les ressources statiques (images, CSS, JS)
workbox.routing.registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
      }),
    ],
  })
);

// Stratégie pour la navigation (pages web)
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: "navigations",
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24, // 1 jour
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Gestion de la page offline
workbox.routing.setCatchHandler(async ({ event }) => {
  // Vérifier si la requête est une navigation (page HTML)
  if (event.request.mode === "navigate") {
    return caches.match("offline.html");
  }
  return Response.error();
});

// Log des événements du SW
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation en cours");
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activation en cours");
  // Nettoyer les anciens caches non gérés par Workbox
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith("temp-converter-") &&
              !cacheName.includes("temp-converter-v1")
          )
          .map((cacheName) => {
            console.log(
              "[Service Worker] Suppression de l'ancien cache:",
              cacheName
            );
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Log des récupérations de ressources
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Récupération:", event.request.url);
});

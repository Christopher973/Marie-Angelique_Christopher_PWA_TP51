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
workbox.precaching.precacheAndRoute([{"revision":"ef6bc10d7318d1db927d56e2a05a3a84","url":"debug-install.js"},{"revision":"cc1e9d3eb6a72b06b0e4b441675ef83c","url":"generate-cert.js"},{"revision":"1b7e6db05199f0276d407485806b8133","url":"index.html"},{"revision":"53d4f42474134ae650511e2e6a9fb159","url":"offline.html"},{"revision":"2ce1afe5c12b7b3770e7240837cfc0b6","url":"script.js"},{"revision":"cd0a120f9b21c059cb5d818cc286cf8d","url":"style.css"},{"revision":"ce4a58d3243519dbb5157c68b262dfd3","url":"manifest.json"},{"revision":"06487c6cf1e49efae33a8ea99faf712f","url":"img/icon-192x192.png"},{"revision":"35b66987f70c081e8e9eb9a14284618b","url":"img/icon-512x512.png"},{"revision":"35b66987f70c081e8e9eb9a14284618b","url":"img/maskable-icon.png"},{"revision":"35b66987f70c081e8e9eb9a14284618b","url":"img/screenshot.png"}]);

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

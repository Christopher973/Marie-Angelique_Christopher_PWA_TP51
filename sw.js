// Nom du cache pour la stratégie "Cache and Update"
const CACHE_NAME = "temp-converter-v1";

// Liste des ressources à mettre en cache lors de l'installation
const RESOURCES_TO_CACHE = [
  "./",
  "./index.html",
  "./offline.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./img/icon-192x192.png",
  "./img/icon-512x512.png",
  "./img/maskable-icon.png",
];

// Événement d'installation du Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation en cours");

  // Attendre que la mise en cache soit terminée avant de finir l'installation
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Mise en cache des ressources statiques");
        return cache.addAll(RESOURCES_TO_CACHE);
      })
      .then(() => {
        // Force l'activation immédiate du Service Worker sans attendre la fermeture de l'onglet
        return self.skipWaiting();
      })
  );
});

// Événement d'activation du Service Worker (se produit après l'installation)
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activation en cours");

  // Nettoyage des anciens caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log(
                "[Service Worker] Suppression de l'ancien cache:",
                cacheName
              );
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Assure que le Service Worker contrôle immédiatement toutes les pages clientes
        return self.clients.claim();
      })
  );
});

// Événement de récupération des ressources (implémentes la stratégie "Cache and Update")
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Récupération:", event.request.url);

  // Implémentation de la stratégie "Cache and Update"
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si la ressource est dans le cache, la retourner immédiatement
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Si la requête réseau réussit, mettre à jour le cache
          if (networkResponse.ok && event.request.method === "GET") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
              console.log(
                "[Service Worker] Mise à jour du cache:",
                event.request.url
              );
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.log("[Service Worker] Échec de récupération:", error);

          // Si la ressource est une page HTML et que nous sommes hors ligne,
          // retourner la page offline.html
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./offline.html");
          }

          // Pour les autres types de ressources, si elles ne sont pas dans le cache,
          // retourner une erreur ou une réponse par défaut appropriée
          return new Response("Ressource non disponible hors ligne", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });

      // Renvoyer la ressource mise en cache si elle existe, sinon faire la requête réseau
      return cachedResponse || fetchPromise;
    })
  );
});

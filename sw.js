/**
 * Service Worker — vidux.sh PWA
 * Fornisce supporto offline, caching delle risorse e criteri di installabilità PWA.
 */

const CACHE_NAME = "viduxsh-v1";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/script.js",
  "./assets/js/i18n.js",
  "./assets/js/app.js",
  "./assets/images/viduxsh_icon.png",
  "./assets/images/viduxsh_logo_full.png",
  "./assets/images/icons/icon-192.png",
  "./assets/images/icons/icon-512.png",
  "./assets/i18n/index.json"
];

// Install: pre-cache asset essenziali
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Pre-caching warning:", err);
      });
    })
  );
});

// Activate: rimuovi vecchie cache e prendi il controllo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first con fallback su cache
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Gestisci solo richieste GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Non memorizzare in cache chiamate analytics esterne
  if (url.origin.includes("goatcounter.com") || url.origin.includes("zgo.at")) {
    return;
  }

  // Rispondi con Network-First (navigazione e risorse)
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // Se la risposta è valida, clonala e aggiorna la cache
        if (networkRes && networkRes.status === 200 && networkRes.type === "basic") {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        // Se offline o errore di rete, prova a recuperare dalla cache
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          // Se la navigazione HTML fallisce ed è offline, restituisci index.html
          if (req.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
      })
  );
});

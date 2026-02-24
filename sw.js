// sw.js — Service Worker para Churrería PWA
const CACHE_NAME = "churreria-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/db.js",
  "./js/app.js",
  "./js/ui.js",
  "./js/calendar.js",
  "./manifest.json",
  "./icons/icon-512.svg",
  "./icons/icon-192.svg",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then(
        (cached) =>
          cached || fetch(e.request).catch(() => caches.match("./index.html")),
      ),
  );
});

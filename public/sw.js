// Basic service worker for PWA caching (placeholder)
const CACHE_NAME = "borrower-verification-cache-v1"
const urlsToCache = [
  "/",
  // Add other important assets and routes here
  // e.g., '/logo.svg', '/styles.css', '/app.js'
  // Routes for offline access:
  // '/verify/[token]', // This is tricky with dynamic routes, needs careful handling
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response // Serve from cache
      }
      return fetch(event.request) // Fetch from network
    }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

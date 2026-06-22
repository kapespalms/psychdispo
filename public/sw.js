/* PsychDispo service worker — Phase 1: shell + static assets + crisis resource data.
 * Bump CACHE_VERSION when psychdispo.html, psychdispo-data.js, or cssrs-screener.js change. */
var CACHE_VERSION = "psychdispo-p1-2026-06";
var STATIC_CACHE = CACHE_VERSION + "-static";
var DATA_CACHE = CACHE_VERSION + "-data";

var SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/psychdispo.html",
  "/psychdispo-data.js",
  "/cssrs-screener.js",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/og-image.png",
  "/robots.txt",
  "/sitemap.xml",
];

var AUTH_PREFIXES = ["/sign-in", "/sign-up", "/auth/", "/settings", "/plans"];

function isAuthPath(url) {
  var path = new URL(url).pathname;
  return AUTH_PREFIXES.some(function (p) {
    return path === p || path.indexOf(p) === 0;
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(function (cache) {
        return cache.addAll(SHELL_URLS.map(function (u) {
          return new Request(u, { credentials: "same-origin" });
        }));
      })
      .catch(function () {
        /* Partial install OK — offline guest mode still gets cached responses */
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k.indexOf("psychdispo-p1-") === 0 && k !== STATIC_CACHE && k !== DATA_CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isAuthPath(req.url)) {
    event.respondWith(networkFirst(req));
    return;
  }

  if (url.pathname === "/psychdispo-data.js" || url.pathname.indexOf("/psychdispo-data") >= 0) {
    event.respondWith(staleWhileRevalidate(req, DATA_CACHE));
    return;
  }

  if (
    url.pathname === "/psychdispo.html" ||
    url.pathname === "/cssrs-screener.js" ||
    url.pathname === "/manifest.webmanifest" ||
    SHELL_URLS.indexOf(url.pathname) >= 0
  ) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, STATIC_CACHE));
    return;
  }
});

function cacheFirst(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      });
    });
  });
}

function networkFirst(req, fallbackCache) {
  return fetch(req)
    .then(function (res) {
      if (fallbackCache && res && res.ok) {
        caches.open(fallbackCache).then(function (cache) {
          cache.put(req, res.clone());
        });
      }
      return res;
    })
    .catch(function () {
      if (!fallbackCache) return caches.match(req);
      return caches.open(fallbackCache).then(function (cache) {
        return cache.match(req);
      });
    });
}

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(req).then(function (hit) {
      var network = fetch(req)
        .then(function (res) {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(function () {
          return hit;
        });
      return hit || network;
    });
  });
}

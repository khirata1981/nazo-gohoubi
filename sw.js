// Service Worker - なぞって ごほうび！
const CACHE_NAME = "nazo-gohoubi-v3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./css/character.css",
  "./js/app.js",
  "./js/canvas.js",
  "./js/hiragana.js",
  "./js/youtube.js",
  "./js/zukan.js",
  "./js/settings.js",
  "./js/animation.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./manifest.json",
];

// インストール時にアセットをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ネットワーク優先、失敗時にキャッシュを使用
// YouTube関連のリクエストはキャッシュしない
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // YouTube API や外部リクエストはそのまま通す
  if (
    url.hostname.includes("youtube.com") ||
    url.hostname.includes("ytimg.com") ||
    url.hostname.includes("googlevideo.com") ||
    url.hostname.includes("googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // レスポンスをキャッシュに保存
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // オフライン時はキャッシュから返す
        return caches.match(event.request);
      })
  );
});

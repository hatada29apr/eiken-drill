// オフライン用。版を上げると、次回オンラインで開いたときに新しいファイルへ入れ替わる。
const VERSION = '20261114-4a13c01d';
const FILES = ["./","./index.html","./data-2.js","./data-p1.js","./manifest.webmanifest","./logo.png","./mascot.png","./icon-180.png","./chara/standard/1.webp","./chara/standard/2.webp","./chara/standard/3.webp","./chara/standard/4.webp","./chara/standard/5.webp","./chara/c2/1.webp","./chara/c2/2.webp","./chara/c2/3.webp","./chara/c2/4.webp","./chara/c2/5.webp","./chara/c3/1.webp","./chara/c3/2.webp","./chara/c3/3.webp","./chara/c3/4.webp","./chara/c3/5.webp","./chara/c4/1.webp","./chara/c4/2.webp","./chara/c4/3.webp","./chara/c4/4.webp","./chara/c4/5.webp"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// まずネットから取り、つながらなければ保存した版を返す（更新がすぐ届くように）
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});

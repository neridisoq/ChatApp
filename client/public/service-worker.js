// 간단한 예시: create-react-app으로 생성된 service-worker 등록 로직.
// 실제 프로덕션에선 Workbox 등을 사용해 캐싱 정책을 정교하게 구성.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open('chat-pwa-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

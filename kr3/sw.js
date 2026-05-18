// ============================================
// Service Worker для PWA приложения "Заметки"
// Практические занятия №13-14
// ============================================

const CACHE_NAME = 'notes-cache-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-48x48.png',
    '/icons/favicon-64x64.png',
    '/icons/favicon-128x128.png',
    '/icons/favicon-256x256.png',
    '/icons/favicon-512x512.png'
];

// ============================================
// УСТАНОВКА (install) - кэшируем все статические ресурсы
// ============================================
self.addEventListener('install', event => {
    console.log('[SW] Установка Service Worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Кэширование ресурсов');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================
// АКТИВАЦИЯ (activate) - удаляем старые кэши
// ============================================
self.addEventListener('activate', event => {
    console.log('[SW] Активация Service Worker');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Удаление старого кэша:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// ============================================
// ЗАПРОСЫ (fetch) - сначала кэш, потом сеть
// ============================================
self.addEventListener('fetch', event => {
    // Пропускаем запросы к другим источникам (например, CDN)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) {
        console.log('[SW] Пропускаем внешний запрос:', url.href);
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[SW] Ответ из кэша:', event.request.url);
                    return cachedResponse;
                }
                console.log('[SW] Запрос в сеть:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Кэшируем новые ресурсы (динамические)
                        if (response && response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('[SW] Ошибка загрузки:', error);
                        // Можно вернуть fallback-страницу, но для простоты просто ошибку
                        return new Response('Офлайн режим: ресурс не найден в кэше', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
            })
    );
});
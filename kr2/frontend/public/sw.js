const CACHE_NAME = 'cosmetics-v1';
const FILES = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener('push', e => {
    let data = { title: 'Новое уведомление', body: '' };
    if (e.data) data = e.data.json();
    e.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/icons/favicon-128x128.png' }));
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.openWindow('/'));
});

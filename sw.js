'use strict';
// O site deixou de usar service worker. Esta versão limpa caches antigos e desativa-se sozinha.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    windows.forEach(client => client.navigate(client.url));
  })());
});

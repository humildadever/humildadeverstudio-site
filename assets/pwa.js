'use strict';
// Remove registos antigos do service worker (o site já não funciona offline).
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(registrations => registrations.forEach(registration => registration.unregister()))
    .catch(() => {});
}

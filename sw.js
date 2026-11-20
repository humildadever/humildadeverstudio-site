'use strict';

const base = self.registration.scope;
const prefix = 'humildadever-site:';
const version = prefix + '13';
const pages = [
  'index.html', 'apps.html', 'universe.html', 'academia.html', 'academia-sql.html',
  'academia-web.html', 'academia-web-preview.html', 'o-curioso.html',
  'o-curioso-en.html', 'novidades.html', 'novidades-en.html', 'offline.html'
];
const assets = [
  'manifest.webmanifest', 'assets/pwa.js', 'assets/v31-premium.js',
  'assets/home.css', 'assets/v31-premium.css', 'assets/v17-premium.css',
  'assets/portal.css', 'assets/oficina-web.css', 'assets/oficina-web.js', 'assets/catalogo.js', 'assets/academia.js',
  'assets/logotipo-192.webp', 'assets/hero-castle-premium.webp', 'assets/hero-castle-premium-480.webp',
  'assets/curioso-card-premium.webp',
  ...Array.from({ length: 6 }, (_, index) => index + 1)
    .flatMap(world => [`assets/mundo-0${world}.webp`, `assets/mundo-0${world}-360.webp`])
];
const urls = new Set(assets.map(path => new URL(path, base).href));
const routes = new Map(pages.map(path => [new URL(path, base).pathname, new URL(path, base).href]));
const home = new URL('index.html', base).href;
routes.set(new URL(base).pathname, home);
const offline = new URL('offline.html', base).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(version)
    .then(cache => cache.addAll([...new Set(routes.values()), ...urls])));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(prefix) && key !== version)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

async function navigation(request, fallback) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(version);
    return (fallback && await cache.match(fallback)) || await cache.match(offline) || Response.error();
  }
}

async function asset(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(version);
    return await cache.match(request) || Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (!url.href.startsWith(base)) return;

  if (request.mode === 'navigate') {
    // Infraestrutura, APIs e ficheiros técnicos são sempre pedidos à rede.
    const inSite = url.pathname.slice(new URL(base).pathname.length);
    if (routes.has(url.pathname) || /^[^/]+\.html$/.test(inSite)) {
      event.respondWith(navigation(request, routes.get(url.pathname)));
    }
  } else if (urls.has(url.href)) {
    event.respondWith(asset(request));
  }
});

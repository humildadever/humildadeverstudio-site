'use strict';
// Verificações sem dependências: node --test tests/site.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const SITE = 'https://humildadeverstudio.com/';

function htmlFiles(dir = root, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'content'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(path.relative(root, full));
  }
  return out;
}

const languages = fs.readdirSync(path.join(root, 'i18n')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
const homes = languages.map(code => (code === 'pt' ? 'index.html' : `${code}/index.html`));

test('ficheiros técnicos mantêm o conteúdo e o endereço', () => {
  assert.equal(read('CNAME').trim(), 'humildadeverstudio.com');
  assert.match(read('app-ads.txt'), /^google\.com, pub-9708843708955934, DIRECT, f08c47fec0942fa0\s*$/);
  assert.match(read('robots.txt'), /Sitemap: https:\/\/humildadeverstudio\.com\/sitemap\.xml/);
  for (const page of ['jogo-privacidade.html', 'jogo-termos.html', 'privacidade.html']) {
    assert.match(read(page), /id="english"/, `${page} sem secção em inglês`);
  }
});

test('todas as línguas têm os mesmos textos', () => {
  const base = JSON.parse(read('i18n/pt.json'));
  for (const code of languages) {
    const t = JSON.parse(read(`i18n/${code}.json`));
    assert.deepEqual(Object.keys(t).sort(), Object.keys(base).sort(), code);
    for (const [key, value] of Object.entries(base)) {
      if (Array.isArray(value)) assert.equal(t[key].length, value.length, `${code}.${key}`);
    }
  }
});

test('cada página de língua liga a todas as outras (hreflang)', () => {
  assert.ok(homes.length >= 16);
  for (const home of homes) {
    const html = read(home);
    const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    assert.equal(links.length, homes.length + 1, `${home}: número de hreflang`);
    assert.ok(links.some(([, lang]) => lang === 'x-default'), `${home}: falta x-default`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)[1];
    const folder = home === 'index.html' ? '' : home.replace('index.html', '');
    assert.equal(canonical, SITE + folder, `${home}: canonical`);
    assert.ok(links.some(([, , href]) => href === canonical), `${home}: não se inclui a si própria`);
  }
});

test('todas as ligações e recursos locais existem', () => {
  for (const file of htmlFiles()) {
    const html = read(file);
    const base = path.dirname(path.join(root, file));
    for (const [, attr] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|#|data:)/.test(attr)) continue;
      const clean = decodeURI(attr.split('#')[0].split('?')[0]);
      if (!clean) continue;
      let target = path.resolve(base, clean);
      if (clean.endsWith('/') || clean === '.' || clean === './') target = path.join(target, 'index.html');
      assert.ok(fs.existsSync(target), `${file}: ligação partida para ${attr}`);
    }
    for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const part of set.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        assert.ok(fs.existsSync(path.resolve(base, url)), `${file}: imagem em falta ${url}`);
      }
    }
  }
});

test('páginas novas sem scripts embutidos (CSP)', () => {
  for (const file of [...homes, 'jogo-privacidade.html', 'jogo-termos.html', 'privacidade.html']) {
    const html = read(file);
    for (const [tag] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>/g)) {
      assert.match(tag, /application\/ld\+json/, `${file}: script embutido`);
    }
    assert.match(html, /<html lang="[^"]+" dir="(ltr|rtl)">/);
  }
});

test('sitemap inclui todas as línguas', () => {
  const sitemap = read('sitemap.xml');
  for (const home of homes) {
    const folder = home === 'index.html' ? '' : home.replace('index.html', '');
    assert.ok(sitemap.includes(`<loc>${SITE}${folder}</loc>`), `sitemap sem ${folder || '/'}`);
  }
});

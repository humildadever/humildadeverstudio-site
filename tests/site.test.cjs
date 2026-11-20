const assert = require('node:assert/strict');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');
const parse5 = require('parse5');
const css = require('css-tree');

const root = path.resolve(__dirname, '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
const files = directory => readdirSync(path.join(root, directory))
  .map(file => path.posix.join(directory, file));
const siteFiles = [...files('.'), ...files('assets')];
const pages = files('.').filter(file => file.endsWith('.html'));
const origin = 'https://humildadeverstudio.com';
const parsePage = file => new JSDOM(read(file), { url: origin + '/' + file });

test('HTML: sintaxe, idioma, título e IDs únicos em todas as páginas', () => {
  for (const file of pages) {
    const html = read(file);
    const errors = [];
    parse5.parse(html, { onParseError: error => errors.push(error.code) });
    assert.deepEqual(errors, [], file);
    const dom = parsePage(file);
    const document = dom.window.document;
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    assert.equal(ids.length, new Set(ids).size, file);
    assert.ok(document.documentElement.lang && document.title, file);
    dom.window.close();
  }
});

test('CSS e JavaScript: verificação de sintaxe', () => {
  const checkCss = (source, file) => css.parse(source, {
    filename: file, onParseError: error => { throw error; }
  });
  for (const file of siteFiles.filter(file => file.endsWith('.css'))) checkCss(read(file), file);
  for (const file of siteFiles.filter(file => file.endsWith('.js'))) {
    execFileSync(process.execPath, ['--check', path.join(root, file)]);
  }
  for (const file of pages) {
    const dom = parsePage(file);
    for (const style of dom.window.document.querySelectorAll('style')) checkCss(style.textContent, file);
    dom.window.close();
  }
});

test('Ligações e recursos locais: destinos existem e âncoras resolvem', () => {
  for (const file of pages) {
    const dom = parsePage(file);
    for (const element of dom.window.document.querySelectorAll('[href], [src], [poster]')) {
      for (const name of ['href', 'src', 'poster']) {
        if (!element.hasAttribute(name)) continue;
        const url = new URL(element.getAttribute(name), dom.window.location);
        if (url.origin !== origin) continue;
        const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
        assert.ok(existsSync(path.join(root, relative)), `${file}: ${url.href}`);
        if (!url.hash || !relative.endsWith('.html')) continue;
        const target = relative === file ? dom : parsePage(relative);
        assert.ok(target.window.document.getElementById(decodeURIComponent(url.hash.slice(1))), `${file}: ${url.href}`);
        if (target !== dom) target.window.close();
      }
    }
    dom.window.close();
  }
});

test('Publicação: app-ads.txt e CNAME na raiz com os valores confirmados', () => {
  assert.equal(read('app-ads.txt').trimEnd(), 'google.com, pub-9708843708955934, DIRECT, f08c47fec0942fa0');
  assert.equal(read('CNAME').trimEnd(), 'humildadeverstudio.com');
});

test('Portal: seis mundos, idiomas, material promocional e imprensa', () => {
  for (const [file, language, other] of [
    ['o-curioso.html', 'pt-PT', 'o-curioso-en.html'],
    ['o-curioso-en.html', 'en', 'o-curioso.html']
  ]) {
    const dom = parsePage(file);
    const document = dom.window.document;
    assert.equal(document.documentElement.lang, language);
    assert.equal(document.querySelectorAll('.world summary').length, 6);
    assert.ok(document.querySelector(`nav a[hreflang][href="${other}"]`));
    assert.ok(document.querySelector('video[controls][preload="none"]:not([autoplay])'));
    assert.ok(document.querySelector('a[download][href="press-kit.zip"]'));
    assert.ok(document.querySelector('a[download][href="press-kit-curioso.zip"]'));
    assert.equal(document.querySelector('.portal-hero + section').id, 'capturas');
    const order = [...document.querySelectorAll('#capturas figure a')].map(link => link.getAttribute('href'));
    assert.deepEqual(order, [2, 1, 4, 3, 5].map(i => `assets/captura-curioso-${i}.webp`));
    assert.equal(document.querySelectorAll('#capturas figure img[loading="lazy"]').length, 5);
    assert.ok(document.querySelector('#versoes time[datetime="2026-11-05"]'));
    dom.window.close();
  }
});

function loadInteractive(file, script, options = {}) {
  const dom = new JSDOM(read(file), { url: origin + '/' + file, runScripts: 'outside-only' });
  Object.defineProperty(dom.window, 'matchMedia', {
    value: query => ({
      matches: query.includes('max-width') ? Boolean(options.mobile) : Boolean(options.reduced),
      addEventListener() {}
    })
  });
  for (const [key, value] of Object.entries(options.storage || {})) dom.window.localStorage.setItem(key, value);
  dom.window.eval(read(script));
  return dom;
}

test('Navegação móvel: toggle, Escape, foco e seleção de uma âncora', () => {
  const { window } = loadInteractive('index.html', 'assets/v31-premium.js', { mobile: true });
  const { document } = window;
  const toggle = document.querySelector('.v31-menu');
  const links = document.getElementById('menu-principal');
  assert.equal(links.hidden, true);
  toggle.click();
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(links.hidden, false);
  const link = links.querySelector('a[href="#mundos"]');
  link.focus();
  link.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(links.hidden, true);
  assert.equal(document.activeElement, toggle);
  toggle.click();
  link.click();
  assert.equal(links.hidden, true);
  assert.equal(document.activeElement.id, 'mundos');
  window.close();
});

test('Preferências: tema persistido, redução do sistema e menu desktop', () => {
  const { window } = loadInteractive('index.html', 'assets/v31-premium.js', {
    reduced: true, storage: { 'hv-theme': 'light' }
  });
  const { document } = window;
  const [theme, motion] = document.querySelectorAll('.v31-tools button');
  assert.equal(document.querySelector('.v31-menu').hidden, true);
  assert.equal(document.getElementById('menu-principal').hidden, false);
  assert.ok(document.body.classList.contains('v31-light'));
  theme.click();
  assert.equal(window.localStorage.getItem('hv-theme'), 'dark');
  assert.equal(theme.getAttribute('aria-pressed'), 'false');
  motion.click();
  assert.equal(motion.getAttribute('aria-pressed'), 'true');
  assert.equal(motion.getAttribute('aria-disabled'), 'true');
  assert.ok(document.body.classList.contains('v31-reduced'));
  window.close();

  const normal = loadInteractive('index.html', 'assets/v31-premium.js');
  normal.window.document.querySelector('.v31-tools button:nth-child(2)').click();
  assert.equal(normal.window.localStorage.getItem('hv-motion'), 'reduce');
  normal.window.close();
});

test('Catálogo: pesquisa sem acentos, filtros combinados e favoritos locais', () => {
  const { window } = loadInteractive('apps.html', 'assets/catalogo.js', {
    storage: { 'hv-catalog-favorites': '["universe"]' }
  });
  const { document } = window;
  const visible = () => [...document.querySelectorAll('[data-project]:not([hidden])')].map(card => card.dataset.project);
  const search = document.getElementById('pesquisa');
  search.value = 'APLICAÇÕES';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.deepEqual(visible(), ['universe']);
  const status = document.getElementById('estado');
  const platform = document.getElementById('plataforma');
  platform.value = 'android';
  platform.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.deepEqual(visible(), []);
  platform.value = 'web';
  platform.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.deepEqual(visible(), ['universe']);
  status.value = 'publicado';
  status.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.deepEqual(visible(), []);
  document.getElementById('limpar').click();
  assert.equal(platform.value, '');
  assert.deepEqual(visible(), ['o-curioso', 'universe']);
  document.getElementById('so-favoritos').click();
  assert.deepEqual(visible(), ['universe']);
  document.querySelector('[data-project="universe"] button').click();
  assert.deepEqual(visible(), []);
  assert.equal(window.localStorage.getItem('hv-catalog-favorites'), '[]');
  window.close();
});

test('Academia: resumo e retoma a partir dos dados existentes', () => {
  const { window } = loadInteractive('academia-cursos.html', 'assets/academia-cursos.js', {
    storage: {
      'hv-academia-web-progresso-v1': '["html","html","css","extra"]',
      'hv-academia-python-basico-v1': '9',
      'hv-academia-sql-basico-v1': '3'
    }
  });
  try {
    const { document } = window;
    const curso = id => document.querySelector(`[data-curso="${id}"]`);
    const link = id => curso(id).querySelector('a');
    assert.equal(curso('web').querySelector('progress').value, 2);
    assert.equal(curso('python').querySelector('progress').value, 0);
    assert.equal(link('web').textContent, 'Retomar a Oficina Web');
    assert.equal(link('web').getAttribute('href'), 'academia-web.html#desafios');
    assert.equal(link('python').getAttribute('href'), 'academia.html');
    assert.equal(link('sql').textContent, 'Rever SQL');
    assert.equal(link('sql').getAttribute('href'), 'academia-sql.html#quiz');
    assert.match(document.querySelector('#progresso-cursos').textContent, /^1 de 3 /);

    window.localStorage.setItem('hv-academia-python-basico-v1', '2');
    window.localStorage.setItem('hv-academia-web-progresso-v1', 'não é JSON');
    window.localStorage.setItem('hv-academia-web-v1', '{"html":"<p>rascunho</p>","css":"","js":""}');
    window.dispatchEvent(new window.Event('pageshow'));
    assert.equal(curso('web').querySelector('progress').value, 0);
    assert.equal(link('web').textContent, 'Retomar a Oficina Web');
    assert.equal(link('python').textContent, 'Retomar Python');
    assert.equal(link('python').getAttribute('href'), 'academia.html#quiz');
  } finally {
    window.close();
  }
});

test('Academia: correção dos dois questionários e progresso independente', () => {
  const pythonKey = 'hv-academia-python-basico-v1';
  const sqlKey = 'hv-academia-sql-basico-v1';
  for (const [file, key, correct, incorrect] of [
    ['academia.html', pythonKey, ['7', 'inclusive', '3'], 'exclusive'],
    ['academia-sql.html', sqlKey, ['where', 'desc', 'having'], 'asc']
  ]) {
    const otherKey = key === pythonKey ? sqlKey : pythonKey;
    const { window } = loadInteractive(file, 'assets/academia.js', { storage: { [otherKey]: '2' } });
    const { document } = window;
    const form = document.getElementById('avaliacao');
    assert.equal(form.checkValidity(), false);
    assert.match(document.getElementById('progresso').textContent, /^Melhor resultado 0\/3/);
    for (const value of correct) form.querySelector(`[value="${value}"]`).checked = true;
    assert.equal(form.checkValidity(), true);
    form.requestSubmit();
    assert.match(document.getElementById('nota').textContent, /^3\/3/);
    assert.equal(window.localStorage.getItem(key), '3');
    form.querySelector(`[value="${incorrect}"]`).checked = true;
    form.requestSubmit();
    assert.match(document.getElementById('nota').textContent, /^2\/3/);
    assert.equal(window.localStorage.getItem(key), '3');
    assert.equal(window.localStorage.getItem(otherKey), '2');
    window.close();
  }
});

test('Oficina Web: o hash CSP corresponde ao script do quadro isolado', () => {
  const { createHash } = require('node:crypto');
  const { Script } = require('node:vm');
  const dom = parsePage('academia-web-preview.html');
  const doc = dom.window.document;
  const source = doc.querySelector('script').textContent;
  assert.doesNotThrow(() => new Script(source));
  const hash = createHash('sha256').update(source).digest('base64');
  const policy = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').content;
  assert.ok(policy.includes(`script-src 'sha256-${hash}' blob:`));
  dom.window.close();
});

test('PWA: cache público, fallback offline e exclusão de ficheiros técnicos', async () => {
  const vm = require('node:vm');
  const scope = origin + '/preview/';
  const listeners = new Map();
  let cached = [];
  const cache = {
    addAll: async urls => { cached = urls; },
    match: async request => {
      const href = typeof request === 'string' ? request : request.url;
      return cached.includes(href) ? href : undefined;
    }
  };
  vm.runInNewContext(read('sw.js'), {
    URL, Response, caches: { open: async () => cache },
    self: { registration: { scope }, addEventListener: (event, handler) => listeners.set(event, handler) },
    fetch: async () => { throw new Error('Offline'); }
  });
  let installation;
  listeners.get('install')({ waitUntil: promise => { installation = promise; } });
  await installation;
  assert.ok(cached.includes(scope + 'offline.html'));
  for (const url of cached) {
    assert.ok(url.startsWith(scope));
    assert.ok(existsSync(path.join(root, url.slice(scope.length))), url);
  }

  function intercept(url, mode = 'navigate', method = 'GET', headers = {}) {
    let response;
    listeners.get('fetch')({
      request: { url, mode, method, headers: new Headers(headers) },
      respondWith: promise => { response = promise; }
    });
    return response;
  }
  assert.equal(await intercept(scope + 'academia.html?ref=offline'), scope + 'academia.html');
  assert.equal(await intercept(scope + 'academia-sql.html'), scope + 'academia-sql.html');
  assert.equal(await intercept(scope + 'privacidade.html'), scope + 'offline.html');
  assert.equal(await intercept(scope + 'assets/portal.css', 'cors'), scope + 'assets/portal.css');
  for (const file of ['app-ads.txt', 'CNAME', 'api/v1/me', 'press-kit.zip', 'press-kit-curioso.zip', 'assets/trailer-curioso.mp4']) {
    assert.equal(intercept(scope + file), undefined, file);
  }
  assert.equal(intercept(scope + 'academia.html', 'navigate', 'POST'), undefined);
  assert.equal(intercept(scope + 'assets/portal.css', 'cors', 'GET', { range: 'bytes=0-99' }), undefined);
  assert.equal(intercept('https://hits.sh/humildadeverstudio.com.svg', 'cors'), undefined);

  const manifest = JSON.parse(read('manifest.webmanifest'));
  for (const icon of manifest.icons) assert.ok(existsSync(path.join(root, icon.src)), icon.src);
});

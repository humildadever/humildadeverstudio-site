const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile, mkdtemp, rm } = require('node:fs/promises');
const { execFileSync } = require('node:child_process');
const { createServer: createSecureServer } = require('node:https');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { chromium, webkit, devices } = require('playwright');
const engines = { chromium, webkit };
const engine = process.env.SITE_TEST_BROWSER ?? 'chromium';
assert.ok(Object.hasOwn(engines, engine), 'Motor de navegador inválido');
const { AxeBuilder } = require('@axe-core/playwright');

const pages = ['', 'o-curioso.html', 'o-curioso-en.html', 'apps.html', 'academia.html',
  'academia-cursos.html', 'academia-sql.html', 'academia-web.html', 'novidades.html', 'novidades-en.html', 'universe.html'];

const site = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css',
  '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png',
  '.zip': 'application/zip', '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json'
};

test(`${engine}: navegação, acessibilidade e offline`, async t => {
  const serveSite = async (request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    const file = path.resolve(site, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(site + path.sep)) {
      response.writeHead(404).end();
      return;
    }
    try {
      const content = await readFile(file);
      response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      response.end(content);
    } catch {
      response.writeHead(404).end();
    }
  };
  const server = createServer(serveSite);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await engines[engine].launch({
    executablePath: engine === 'chromium' ? process.env.CHROMIUM_PATH : undefined
  });
  t.after(() => browser.close());

  await t.test('Navegação offline após instalação do service worker', async () => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.route('https://**/*', route => route.abort());
      await page.goto(origin);
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 10000 });
      await context.setOffline(true);
      for (const { file, fallback, title, nextTitle } of [
        { file: 'o-curioso.html', fallback: 'Imagem original indisponível. A mostrar a versão reduzida.',
          title: 'Nível 1', nextTitle: 'Nível 33' },
        { file: 'o-curioso-en.html', fallback: 'Full-size image unavailable. Showing the smaller version.',
          title: 'Level 1', nextTitle: 'Level 33' }
      ]) {
        await page.goto(origin + '/' + file);
        const link = page.locator('#capturas figure a').first();
        await link.click();
        const dialog = page.getByRole('dialog');
        await dialog.getByRole('heading', { name: title, exact: true }).waitFor();
        await dialog.getByText(fallback, { exact: true }).waitFor();
        assert.equal(await dialog.locator('.galeria-imagem img').evaluate(img => img.naturalWidth), 320);
        assert.equal(await dialog.locator('[data-galeria-original]').isVisible(), false);
        await page.keyboard.press('ArrowRight');
        await dialog.getByRole('heading', { name: nextTitle, exact: true }).waitFor();
        await dialog.getByText(fallback, { exact: true }).waitFor();
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(() => document.activeElement === document.querySelector('#capturas figure a'));
      }
      await page.goto(origin + '/academia-cursos.html');
      assert.equal(await page.locator('#percursos article').count(), 3);
      await page.getByRole('link', { name: 'Iniciar o curso de Python' }).click();
      assert.equal(await page.getByRole('heading', { name: 'Academia Humildadever' }).isVisible(), true);
      await page.getByRole('link', { name: 'Curso de SQL' }).click();
      assert.equal(await page.getByRole('heading', { name: 'SQL para jogos' }).isVisible(), true);
      for (const value of ['where', 'desc', 'having']) {
        await page.locator(`#avaliacao input[value="${value}"]`).check();
      }
      await page.getByRole('button', { name: 'Ver resultado' }).click();
      assert.match(await page.locator('#nota').textContent(), /^3\/3/);
      await page.reload();
      assert.match(await page.locator('#progresso').textContent(), /Melhor resultado 3\/3/);
      await page.getByRole('link', { name: 'Todos os percursos' }).click();
      assert.match(await page.locator('#progresso-cursos').textContent(), /^1 de 3 /);
      await page.getByRole('link', { name: 'Rever SQL' }).click();
      await page.waitForURL(origin + '/academia-sql.html#quiz');
      await page.goto(origin + '/apps.html?q=academia+sql&categoria=educacao&plataforma=web');
      assert.equal(await page.locator('[data-project]:not([hidden])').count(), 1);
      await page.getByText('Partilhar filtros do catálogo', { exact: true }).click();
      assert.match(await page.getByLabel('Ligação do catálogo').inputValue(), /q=academia\+sql/);
      await page.getByRole('link', { name: 'Escolher um percurso' }).click();
      await page.waitForURL(origin + '/academia-cursos.html');
      await page.goto(origin + '/novidades-en.html');
      await page.getByRole('link', { name: 'Português' }).click();
      assert.equal(await page.getByRole('heading', { name: 'Novidades do estúdio' }).isVisible(), true);
      await page.goto(origin + '/privacidade.html');
      assert.equal(await page.getByRole('heading', { name: 'Sem ligação à internet' }).isVisible(), true);
    } finally {
      await context.close();
    }
  });

  await t.test('Pré-produção HTTPS: início, galeria e Google Play em ecrã móvel', async t => {
    const directory = await mkdtemp(path.join(tmpdir(), 'humildadever-tls-'));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const keyPath = path.join(directory, 'key.pem');
    const certPath = path.join(directory, 'cert.pem');
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
      '-subj', '/CN=localhost', '-addext', 'subjectAltName=IP:127.0.0.1',
      '-keyout', keyPath, '-out', certPath], { stdio: 'ignore' });
    const secureServer = createSecureServer({
      key: await readFile(keyPath), cert: await readFile(certPath)
    }, serveSite);
    await new Promise(resolve => secureServer.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => secureServer.close(resolve)));

    const model = engine === 'chromium' ? 'Pixel 7' : 'iPhone 13';
    const context = await browser.newContext({ ...devices[model], ignoreHTTPSErrors: true });
    try {
      const secureOrigin = 'https://127.0.0.1:' + secureServer.address().port;
      const play = 'https://play.google.com/store/apps/details?id=com.humildadever.ocurioso';
      const page = await context.newPage();
      await page.route('**/*', route => {
        const url = route.request().url();
        if (url.startsWith(secureOrigin + '/')) return route.continue();
        if (url === play) return route.fulfill({ contentType: 'text/html', body: '<h1>Ficha Google Play</h1>' });
        return route.abort();
      });
      await page.goto(secureOrigin);
      const protagonist = page.locator('.hero-image');
      await page.waitForFunction(() => document.querySelector('.hero-image').naturalWidth > 0);
      assert.match(await protagonist.evaluate(image => image.currentSrc), /banner-telemovel\.webp$/);
      assert.equal(await page.locator('.hero h1').textContent(), 'O Curioso e o Reino das Gargalhadas');
      await page.getByRole('link', { name: 'Conhecer o jogo', exact: true }).tap();
      await page.waitForURL(secureOrigin + '/o-curioso.html');
      const firstImage = page.locator('#capturas img').first();
      await firstImage.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('#capturas img').naturalWidth > 0);
      await firstImage.tap();
      const viewer = page.locator('dialog[open] .galeria-imagem');
      async function swipe(start, end) {
        await viewer.evaluate((element, [initial, final]) => {
          for (const [type, field, x] of [['touchstart', 'touches', initial], ['touchend', 'changedTouches', final]]) {
            const event = new Event(type, { bubbles: true });
            Object.defineProperty(event, field, { value: [{ identifier: 1, clientX: x, clientY: 50 }] });
            element.dispatchEvent(event);
          }
        }, [start, end]);
      }
      await swipe(130, 50);
      await page.getByRole('dialog', { name: 'Nível 33', exact: true }).waitFor();
      assert.equal(await page.locator('dialog[open] .galeria-posicao').textContent(), '2 / 5');
      await swipe(50, 130);
      const dialog = page.getByRole('dialog', { name: 'Nível 1', exact: true });
      const original = dialog.getByRole('link', { name: 'Abrir imagem original', exact: true });
      await original.waitFor();
      assert.ok(await dialog.locator('.galeria-imagem img').evaluate(img => img.naturalWidth > 320));
      await original.tap();
      await page.waitForURL(secureOrigin + '/assets/captura-curioso-2.webp');
      await page.goBack();
      const close = page.getByRole('button', { name: 'Fechar', exact: true });
      if (await close.isVisible()) await close.tap();
      const archive = await context.request.get(secureOrigin + '/press-kit-curioso.zip');
      assert.ok(archive.ok());
      assert.equal((await archive.body()).subarray(0, 2).toString(), 'PK');
      await page.locator('header a.action.primary').tap();
      await page.waitForURL(play);
      assert.equal(await page.getByRole('heading', { name: 'Ficha Google Play' }).isVisible(), true);
    } finally {
      await context.close();
    }
  });

  await t.test('Oficina Web: execução isolada, edição e exportação', async () => {
    const context = await browser.newContext({ acceptDownloads: true });
    try {
      const page = await context.newPage();
      await page.goto(origin + '/academia-web.html');
      const iframe = page.locator('#resultado-oficina iframe');
      assert.equal(await iframe.getAttribute('sandbox'), 'allow-scripts');
      const preview = page.frameLocator('#resultado-oficina iframe');
      const botao = preview.getByRole('button', { name: 'Apanhar estrela' });
      await botao.click();
      assert.equal(await preview.locator('#placar').textContent(), '1');

      await page.getByRole('button', { name: 'Validar HTML', exact: true }).click();
      await page.getByText(/Altera o título e o texto do botão, mantém/).waitFor();
      const html = page.getByLabel('Código HTML');
      await html.fill((await html.inputValue()).replace('Caça às estrelas', 'Apanha cometas')
        .replace('Apanhar estrela', 'Apanhar cometa'));
      await page.getByRole('button', { name: 'Validar HTML', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#progresso-oficina').textContent.startsWith('1/3'));

      await page.locator('summary').filter({ hasText: /^CSS$/ }).click();
      const css = page.getByLabel('Código CSS');
      await css.fill((await css.inputValue()).replace('#10253c', '#083824').replace('#ffdc68', '#d7ff7b'));
      await page.getByRole('button', { name: 'Validar CSS', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#progresso-oficina').textContent.startsWith('2/3'));

      await page.locator('summary').filter({ hasText: /^JavaScript$/ }).click();
      const source = page.getByLabel('Código JavaScript');
      await source.fill((await source.inputValue()).replace('pontos += 1', 'pontos += 5'));
      await page.getByRole('button', { name: 'Validar JavaScript', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#progresso-oficina').textContent.startsWith('3/3'));
      assert.equal(await preview.locator('#placar').textContent(), '10');
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#progresso-oficina').textContent.startsWith('3/3'));
      await page.locator('summary').filter({ hasText: /^JavaScript$/ }).click();
      assert.match(await page.getByLabel('Código JavaScript').inputValue(), /pontos \+= 5/);
      const download = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Descarregar HTML' }).click();
      const file = await download;
      assert.equal(file.suggestedFilename(), 'o-meu-minijogo.html');
      assert.match(await readFile(await file.path(), 'utf8'), /pontos \+= 5/);
      page.once('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Carregar projeto no editor' }).click();
      await source.fill((await source.inputValue()).replace('duracao = 15', 'duracao = 2'));
      await page.getByRole('button', { name: 'Executar pré-visualização' }).click();
      await botao.click();
      assert.equal(await preview.locator('#placar').textContent(), '2');
      await preview.getByText('Tempo esgotado!', { exact: true }).waitFor();
      assert.equal(await botao.isDisabled(), true);
      await preview.getByRole('button', { name: 'Recomeçar' }).click();
      assert.equal(await preview.locator('#placar').textContent(), '0');
      assert.equal(await botao.isEnabled(), true);
    } finally {
      await context.close();
    }
  });

  if (engine === 'chromium') {
    await t.test('Peso inicial das páginas em ecrã móvel', async () => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 }, serviceWorkers: 'block'
      });
      try {
        const page = await context.newPage();
        await page.route('**/*', route => route.request().url().startsWith(origin + '/')
          ? route.continue() : route.abort());
        for (const [pagePath, budget] of [['/', 300_000], ['/o-curioso.html', 250_000]]) {
          await page.goto(origin + pagePath);
          await page.waitForLoadState('networkidle');
          const resources = await page.evaluate(() => [
            ...performance.getEntriesByType('navigation'),
            ...performance.getEntriesByType('resource')
          ].filter(entry => new URL(entry.name).origin === location.origin)
            .map(entry => [new URL(entry.name).pathname, entry.encodedBodySize]));
          const bytes = resources.reduce((total, [, size]) => total + size, 0);
          t.diagnostic(`${pagePath}: ${bytes} bytes de recursos locais após estabilizar os pedidos iniciais`);
          assert.ok(bytes > 0 && bytes <= budget, `${pagePath}: ${bytes} / ${budget} bytes`);
          assert.ok(!resources.some(([url]) => /\.(mp4|zip)$/.test(url)), pagePath);

        }
      } finally {
        await context.close();
      }
    });
  }

  await t.test('Acessibilidade automática nas páginas principais', async () => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.route('https://**/*', route => route.abort());
      const findings = [];
      const capture = async label => {
        const report = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        for (const violation of report.violations) {
          findings.push({ page: label, id: violation.id, targets: violation.nodes.map(node => node.target) });
        }
      };
      for (const file of pages) {
        await page.goto(origin + '/' + file);
        await capture(file || 'index.html');
        if (!file) {
          await page.getByRole('button', { name: 'Modo claro', exact: true }).click();
          await capture('index.html — modo claro');
        }
      }
      assert.deepEqual(findings, []);
    } finally {
      await context.close();
    }
  });

  for (const width of [320, 390, 768, 1366]) {
    await t.test(`${width}px`, async () => {
      const page = await browser.newPage({
        viewport: { width, height: 800 }, reducedMotion: 'reduce'
      });
      const errors = [];
      await page.addInitScript(() => {
        window.sitePolicyViolations = [];
        document.addEventListener('securitypolicyviolation', event => {
          window.sitePolicyViolations.push(event.effectiveDirective + ' ' + event.blockedURI);
        });
      });
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://**/*', route => route.abort());
      try {
        await page.goto(origin);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.className), 'v31-skip');
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'conteudo');
        assert.equal(await page.locator('h1').isVisible(), true);
        const menu = page.getByRole('button', { name: 'Menu', exact: true });
        if (width <= 760) {
          await menu.click();
          assert.equal(await page.locator('#menu-principal').evaluate(el => getComputedStyle(el).position), 'absolute');
          assert.equal(await menu.getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await menu.getAttribute('aria-expanded'), 'false');
          assert.equal(await menu.evaluate(el => el === document.activeElement), true);
          await page.setViewportSize({ width: 1051, height: 800 });
          await page.waitForFunction(() => document.querySelector('.v31-menu').hidden);
          assert.equal(await page.evaluate(() => document.activeElement.textContent), 'O Jogo');
          await page.setViewportSize({ width, height: 800 });
          await page.waitForFunction(() => !document.querySelector('.v31-menu').hidden);
          assert.equal(await menu.evaluate(el => el === document.activeElement), true);
        } else {
          assert.equal(await page.getByRole('navigation').getByRole('link', { name: 'Mundos', exact: true }).isVisible(), true);
          assert.equal(await menu.isVisible(), false);
        }
        const theme = page.getByRole('button', { name: 'Modo claro', exact: true });
        await theme.click();
        await page.reload();
        assert.equal(await theme.getAttribute('aria-pressed'), 'true');
        assert.equal(await page.getByRole('button', { name: 'Reduzir movimento' }).getAttribute('aria-pressed'), 'true');

        for (const file of pages) {
          await page.goto(origin + '/' + file);
          const overflow = await page.evaluate(() => {
            if (document.documentElement.scrollWidth <= innerWidth) return [];
            const elements = [...document.querySelectorAll('body *')]
              .filter(el => el.getBoundingClientRect().right > innerWidth)
              .map(el => el.id || el.className || el.getAttribute('src') || el.tagName).slice(0, 12);
            return [document.documentElement.scrollWidth, ...elements];
          });
          assert.deepEqual(overflow, [], file || 'index.html');
          if (!file) {
            await page.waitForFunction(() => document.querySelector('.hero-image').naturalWidth > 0);
            const banner = width <= 900 ? 'banner-telemovel.webp' : 'banner-computador.webp';
            const current = await page.locator('.hero-image').evaluate(image => image.currentSrc);
            assert.equal(new URL(current).pathname, '/assets/curioso-arte/' + banner);
          }
          assert.deepEqual(await page.evaluate(() => window.sitePolicyViolations), [], file || 'index.html');
        }
        await page.goto(origin + '/o-curioso.html');
        await page.locator('.world summary').first().click();
        assert.equal(await page.locator('.world[open] img').isVisible(), true);
        assert.deepEqual(errors, []);
      } finally {
        await page.close();
      }
    });
  }
});

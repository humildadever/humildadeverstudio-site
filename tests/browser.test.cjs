const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const site = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css',
  '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png',
  '.webmanifest': 'application/manifest+json'
};

test('Chromium: navegação por teclado, largura e preferências', async t => {
  const server = createServer(async (request, response) => {
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
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  t.after(() => browser.close());

  await t.test('Navegação offline após instalação do service worker', async () => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.route('https://**/*', route => route.abort());
      await page.goto(origin);
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 10000 });
      await context.setOffline(true);
      await page.goto(origin + '/academia.html');
      assert.equal(await page.getByRole('heading', { name: 'Academia Humildadever' }).isVisible(), true);
      await page.goto(origin + '/privacidade.html');
      assert.equal(await page.getByRole('heading', { name: 'Sem ligação à internet' }).isVisible(), true);
    } finally {
      await context.close();
    }
  });

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
      for (const file of ['', 'o-curioso.html', 'o-curioso-en.html', 'apps.html', 'academia.html', 'novidades.html']) {
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
          assert.equal(await menu.getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await menu.getAttribute('aria-expanded'), 'false');
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

        for (const file of ['', 'o-curioso.html', 'o-curioso-en.html', 'apps.html', 'academia.html', 'novidades.html']) {
          await page.goto(origin + '/' + file);
          const overflow = await page.evaluate(() => {
            if (document.documentElement.scrollWidth <= innerWidth) return [];
            const elements = [...document.querySelectorAll('body *')]
              .filter(el => el.getBoundingClientRect().right > innerWidth)
              .map(el => el.id || el.className || el.tagName).slice(0, 12);
            return [document.documentElement.scrollWidth, ...elements];
          });
          assert.deepEqual(overflow, [], file || 'index.html');
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

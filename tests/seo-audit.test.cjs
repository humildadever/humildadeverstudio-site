const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('auditoria SEO gera inventário JSON de todas as páginas HTML da raiz', () => {
  const root = path.resolve(__dirname, '..');
  const output = execFileSync(process.execPath, [path.join(root, 'scripts/seo-audit.cjs')], { cwd: root, encoding: 'utf8' });
  const report = JSON.parse(output);
  assert.ok(Number.isInteger(report.summary.pages));
  assert.ok(report.summary.pages > 0);
  assert.equal(report.summary.pages, report.checks.length);
  assert.equal(report.summary.pagesWithIssues, report.checks.filter(p => p.issues.length > 0).length);
  assert.equal(report.summary.issueCount, report.checks.reduce((sum, p) => sum + p.issues.length, 0));
  assert.ok(report.checks.some(p => p.file === 'index.html'));
  for (const page of report.checks) {
    assert.match(page.file, /^[^/]+\.html$/);
    assert.ok(Array.isArray(page.alternates));
    assert.ok(Array.isArray(page.issues));
    assert.equal(typeof page.description === 'string' || page.description === null, true);
  }
});

test('páginas internacionais de O Curioso e Notícias mantêm alternates recíprocos', () => {
  const fs = require('node:fs');
  const root = path.resolve(__dirname, '..');
  const pairs = [['o-curioso.html', 'o-curioso-en.html'], ['novidades.html', 'novidades-en.html']];
  for (const [pt, en] of pairs) {
    for (const file of [pt, en]) {
      const html = fs.readFileSync(path.join(root, file), 'utf8');
      assert.match(html, /<link\\s+rel="canonical"\\s+href="https:\/\/humildadeverstudio\\.com\//);
      for (const [lang, target] of [['pt-PT', pt], ['en', en], ['x-default', pt]]) {
        assert.ok(html.includes('hreflang="' + lang + '" href="https://humildadeverstudio.com/' + target + '"'), file + ': missing ' + lang);
      }
    }
  }
});

test('sitemap declara alternates recíprocos para páginas internacionais', () => {
  const fs = require('node:fs');
  const root = path.resolve(__dirname, '..');
  const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.ok(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  for (const [pt, en] of [['o-curioso.html', 'o-curioso-en.html'], ['novidades.html', 'novidades-en.html']]) {
    for (const file of [pt, en]) {
      const start = xml.indexOf('<loc>https://humildadeverstudio.com/' + file + '</loc>');
      assert.ok(start >= 0, 'sitemap missing ' + file);
      const end = xml.indexOf('</url>', start);
      assert.ok(end > start, 'sitemap malformed ' + file);
      const block = xml.slice(start, end);
      for (const [lang, target] of [['pt-PT', pt], ['en', en], ['x-default', pt]]) {
        assert.ok(block.includes('hreflang="' + lang + '" href="https://humildadeverstudio.com/' + target + '"'), file + ': missing ' + lang);
      }
    }
  }
});

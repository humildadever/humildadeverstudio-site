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

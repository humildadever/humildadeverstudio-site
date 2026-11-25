#!/usr/bin/env node
// Auditoria informativa de SEO internacional. Não altera ficheiros nem publica conteúdo.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const origin = 'https://humildadeverstudio.com';
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html')).sort();
const checks = [];
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] || null;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || null;
  const canonical = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["']/i)?.[1] || null;
  const description = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=["']([^"']+)["']/i)?.[1] || null;
  const alternates = [...html.matchAll(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*\bhreflang=["']([^"']+)["'][^>]*\bhref=["']([^"']+)["']/gi)].map(match => ({ lang: match[1], href: match[2] }));
  const issues = [];
  if (!lang) issues.push('missing-html-lang');
  if (!title) issues.push('missing-title');
  if (!description) issues.push('missing-description');
  if (!canonical) issues.push('missing-canonical');
  if (canonical && !canonical.startsWith(origin + '/')) issues.push('unexpected-canonical-origin');
  for (const alternate of alternates) {
    if (!alternate.href.startsWith(origin + '/')) issues.push('unexpected-hreflang-origin');
  }
  checks.push({ file, lang, title, canonical, alternates, issues });
}
const summary = { pages: checks.length, pagesWithIssues: checks.filter(p => p.issues.length).length, issueCount: checks.reduce((n,p) => n + p.issues.length, 0) };
process.stdout.write(JSON.stringify({ summary, checks }, null, 2) + '\n');
// Informative by design: existing legacy pages are not a release blocker.

#!/usr/bin/env node
// Inventário de SEO internacional (apenas leitura; não publica nem altera páginas).
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const origin = 'https://humildadeverstudio.com';
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html')).sort();
const attr = (tag, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp('(?:^|\\s)' + escaped + '\\s*=\\s*(?:"([^"]*)"|\\x27([^\\x27]*)\\x27|([^\\s>]+))', 'i'));
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
};
const tags = (html, tag) => [...html.matchAll(new RegExp('<' + tag + '\\b[^>]*>', 'gi'))].map(m => m[0]);
const checks = [];
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const lang = attr(tags(html, 'html')[0] || '', 'lang');
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() || null;
  const metas = tags(html, 'meta');
  const links = tags(html, 'link');
  const description = metas.filter(tag => attr(tag, 'name')?.toLowerCase() === 'description').map(tag => attr(tag, 'content')).find(Boolean) || null;
  const canonical = links.filter(tag => attr(tag, 'rel')?.toLowerCase().split(/\s+/).includes('canonical')).map(tag => attr(tag, 'href')).find(Boolean) || null;
  const alternates = links.filter(tag => attr(tag, 'rel')?.toLowerCase().split(/\s+/).includes('alternate') && attr(tag, 'hreflang')).map(tag => ({ lang: attr(tag, 'hreflang'), href: attr(tag, 'href') }));
  const issues = [];
  if (!lang) issues.push('missing-html-lang');
  if (!title) issues.push('missing-title');
  if (!description) issues.push('missing-description');
  if (!canonical) issues.push('missing-canonical');
  const sameOrigin = value => { try { return new URL(value).origin === origin; } catch { return false; } };
  if (canonical && !sameOrigin(canonical)) issues.push('unexpected-canonical-origin');
  for (const alternate of alternates) if (!alternate.href || !sameOrigin(alternate.href)) issues.push('unexpected-hreflang-origin');
  checks.push({ file, lang, title, description, canonical, alternates, issues });
}
const summary = { pages: checks.length, pagesWithIssues: checks.filter(p => p.issues.length).length, issueCount: checks.reduce((n,p) => n + p.issues.length, 0) };
process.stdout.write(JSON.stringify({ summary, checks }, null, 2) + '\n');
// Relatório informativo: páginas legadas não bloqueiam o build.

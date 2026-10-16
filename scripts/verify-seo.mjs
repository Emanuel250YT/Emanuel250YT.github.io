#!/usr/bin/env node
/**
 * Static SEO and accessibility checks over dist/ (runs after the build).
 * Exits with code 1 when any page breaks a rule; see CLAUDE.md.
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const SITE = 'https://emanuel250.dev.ar';
/** Google Search Console HTML-file verification: must stay deployed, is not a page. */
const SEARCH_CONSOLE_FILE = 'google4180448db7220be0.html';

// Keep in sync with src/i18n/locales.ts.
const LOCALES = {
  es: { hreflang: 'es-AR', prefix: '' },
  en: { hreflang: 'en', prefix: 'en/' },
  pt: { hreflang: 'pt-BR', prefix: 'pt/' },
  fr: { hreflang: 'fr', prefix: 'fr/' },
  de: { hreflang: 'de', prefix: 'de/' },
  zh: { hreflang: 'zh-CN', prefix: 'zh/' },
  hi: { hreflang: 'hi', prefix: 'hi/' },
};
const ROUTES = ['', 'privacy/'];
/** CV PDF uploaded by the owner (never generated); other languages fall back to it. */
const CV_PDF = 'cv/emanuel-guzman-cv.pdf';

const errors = [];
const warnings = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith('.html') && entry.name !== SEARCH_CONSOLE_FILE ? [full] : [];
    }),
  );
  return files.flat();
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const metaContent = (html, key, value) => {
  const tag = html.match(new RegExp(`<meta[^>]*${key}="${value}"[^>]*>`))?.[0];
  return tag ? attr(tag, 'content') : undefined;
};
const text = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** Approximate rendered width: CJK characters take about two Latin ones in a SERP. */
const visualLength = (value) => [...value].reduce((sum, char) => sum + (/[　-鿿＀-￯]/.test(char) ? 2 : 1), 0);

/** JSON-LD references ({ "@id": ... } with nothing else) whose node is not in the graph. */
function danglingIds(data) {
  const defined = new Set();
  const referenced = new Set();
  const walk = (value) => {
    if (Array.isArray(value)) return value.forEach(walk);
    if (!value || typeof value !== 'object') return;
    const keys = Object.keys(value);
    if (typeof value['@id'] === 'string') (keys.length === 1 ? referenced : defined).add(value['@id']);
    keys.forEach((key) => walk(value[key]));
  };
  walk(data);
  return [...referenced].filter((id) => !defined.has(id));
}

if (!existsSync(dist)) {
  console.error('dist/ does not exist. Run `npm run build` first.');
  process.exit(1);
}

const files = await htmlFiles(dist);
const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const rel = path.relative(dist, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // Document
  if (!/^<!DOCTYPE html>/i.test(html)) fail(rel, 'missing <!doctype html>');
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  if (!lang) fail(rel, '<html> has no lang');
  if (!/<meta name="viewport"/.test(html)) fail(rel, 'missing meta viewport');
  // House style: no em/en dashes in copy, titles or structured data (they read as machine-written).
  const dash = html.match(/.{0,40}[—–].{0,40}/)?.[0];
  if (dash) fail(rel, `contains an em/en dash: "${dash}"`);

  // Title + description
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(rel, 'missing <title>');
  else {
    if (visualLength(title) > 72) warn(rel, `long title (${visualLength(title)} chars)`);
    if (!noindex) {
      if (titles.has(title)) fail(rel, `title duplicated in ${titles.get(title)}`);
      titles.set(title, rel);
    }
  }
  const description = metaContent(html, 'name', 'description');
  if (!description) fail(rel, 'missing meta description');
  else {
    const length = visualLength(description);
    if (!noindex && (length < 70 || length > 175)) warn(rel, `description is ${length} chars (aim for 120-160)`);
    if (!noindex) {
      if (descriptions.has(description)) fail(rel, `description duplicated in ${descriptions.get(description)}`);
      descriptions.set(description, rel);
    }
  }

  // Headings
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(rel, `has ${h1s.length} <h1> (must be 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
  levels.forEach((level, index) => {
    if (index > 0 && level > levels[index - 1] + 1) fail(rel, `heading level jumps h${levels[index - 1]} -> h${level}`);
  });

  // Images and links
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    // An empty alt (alt / alt="") is valid for decorative images.
    if (!/\salt(="|\s|>|\/)/.test(img)) fail(rel, `<img> without alt: ${img.slice(0, 80)}`);
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img)) fail(rel, `<img> without width/height (CLS): ${img.slice(0, 80)}`);
  }
  for (const link of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? []) {
    const open = link.match(/<a\b[^>]*>/)[0];
    const label = attr(open, 'aria-label') ?? text(link);
    if (!label) fail(rel, `link without accessible text: ${open.slice(0, 80)}`);
    if (attr(open, 'target') === '_blank' && !/noopener/.test(attr(open, 'rel') ?? ''))
      fail(rel, `target=_blank without rel=noopener: ${open.slice(0, 80)}`);
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const dupes = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (dupes.length) fail(rel, `duplicate ids: ${[...new Set(dupes)].join(', ')}`);
  if (!/class="skip-link"/.test(html)) fail(rel, 'missing skip link');
  if (!/<main\b/.test(html)) fail(rel, 'missing <main>');

  if (noindex) continue;

  // Canonical, hreflang, Open Graph
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) fail(rel, 'missing canonical');
  else {
    if (!canonical.startsWith(SITE)) fail(rel, `canonical outside the domain: ${canonical}`);
    if (!canonical.endsWith('/')) fail(rel, `canonical without trailing slash: ${canonical}`);
    const expected = `${SITE}/${rel.replace(/index\.html$/, '')}`;
    if (canonical !== expected) fail(rel, `canonical ${canonical} does not match the route ${expected}`);
  }
  for (const { hreflang } of Object.values(LOCALES)) {
    if (!html.includes(`hreflang="${hreflang}"`)) fail(rel, `missing hreflang ${hreflang}`);
  }
  if (!html.includes('hreflang="x-default"')) fail(rel, 'missing hreflang x-default');
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale']) {
    if (!metaContent(html, 'property', property)) fail(rel, `missing ${property}`);
  }
  const alternates = html.match(/property="og:locale:alternate"/g) ?? [];
  if (alternates.length !== Object.keys(LOCALES).length - 1) fail(rel, `expected ${Object.keys(LOCALES).length - 1} og:locale:alternate`);
  const ogImage = metaContent(html, 'property', 'og:image');
  if (ogImage) {
    const local = path.join(dist, new URL(ogImage).pathname);
    if (!existsSync(local)) fail(rel, `og:image missing from dist: ${ogImage}`);
  }
  if (!metaContent(html, 'name', 'twitter:card')) fail(rel, 'missing twitter:card');

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(rel, 'missing JSON-LD');
  for (const [, json] of blocks) {
    try {
      const data = JSON.parse(json);
      const types = (data['@graph'] ?? [data]).map((node) => node['@type']);
      if (!types.includes('Person')) fail(rel, 'JSON-LD without Person');
      for (const id of danglingIds(data)) fail(rel, `JSON-LD references ${id}, which is not in the graph`);
    } catch (error) {
      fail(rel, `invalid JSON-LD: ${error.message}`);
    }
  }
}

// Site-level files
for (const required of ['CNAME', 'robots.txt', 'sitemap-index.xml', 'favicon.ico', 'favicon.svg', 'site.webmanifest', '404.html', 'llms.txt', SEARCH_CONSOLE_FILE, CV_PDF]) {
  if (!existsSync(path.join(dist, required))) fail('dist', `missing ${required}`);
}
for (const [locale, { prefix }] of Object.entries(LOCALES)) {
  for (const route of ROUTES) {
    if (!existsSync(path.join(dist, prefix, route, 'index.html'))) fail('dist', `missing /${prefix}${route}`);
  }
  if (!existsSync(path.join(dist, `og/og-${locale}.png`))) fail('dist', `missing og/og-${locale}.png (npm run assets)`);
}
for (const text of ['llms.txt', 'site.webmanifest']) {
  const file = path.join(dist, text);
  if (existsSync(file) && /[—–]/.test(await readFile(file, 'utf8'))) fail(text, 'contains an em/en dash');
}
if (existsSync(path.join(dist, 'CNAME'))) {
  const cname = (await readFile(path.join(dist, 'CNAME'), 'utf8')).trim();
  if (`https://${cname}` !== SITE) fail('CNAME', `"${cname}" does not match ${SITE}`);
}
const robots = existsSync(path.join(dist, 'robots.txt')) ? await readFile(path.join(dist, 'robots.txt'), 'utf8') : '';
if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) fail('robots.txt', 'does not declare the sitemap');
const sitemap = existsSync(path.join(dist, 'sitemap-0.xml')) ? await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8') : '';
for (const { prefix } of Object.values(LOCALES)) {
  for (const route of ROUTES) {
    if (!sitemap.includes(`<loc>${SITE}/${prefix}${route}</loc>`)) fail('sitemap-0.xml', `missing /${prefix}${route}`);
  }
}
if (sitemap.includes('404')) fail('sitemap-0.xml', 'includes the 404 page');
const sitemapUrls = sitemap.match(/<url>/g)?.length ?? 0;
// <lastmod> is the page's last content commit (astro.config.mjs): it needs the git history.
if ((sitemap.match(/<lastmod>/g)?.length ?? 0) !== sitemapUrls) fail('sitemap-0.xml', 'every URL needs a <lastmod> (is this a git checkout?)');
if ((sitemap.match(/hreflang="x-default"/g)?.length ?? 0) !== sitemapUrls) fail('sitemap-0.xml', 'every URL needs an x-default alternate');

// Conversion essentials on every home page
for (const { prefix } of Object.values(LOCALES)) {
  const file = path.join(dist, prefix, 'index.html');
  if (!existsSync(file)) continue;
  const html = await readFile(file, 'utf8');
  for (const id of ['services', 'process', 'about', 'projects', 'achievements', 'contact']) {
    if (!html.includes(`id="${id}"`)) fail(`/${prefix}`, `missing section #${id}`);
  }
  if (!/<form[^>]*data-contact-form/.test(html)) fail(`/${prefix}`, 'missing contact form');
  // The npm stat is fetched at build time: a page without the number means the API failed.
  const npmStat = html.match(/<span[^>]*data-npm-total[^>]*>([^<]*)</)?.[1];
  if (!npmStat || !/\d/.test(npmStat)) fail(`/${prefix}`, 'hero npm downloads stat has no number (npm API unreachable at build time?)');
  for (const field of ['name', 'email', 'service', 'message']) {
    const control = html.match(new RegExp(`<(input|select|textarea)[^>]*name="${field}"[^>]*>`))?.[0];
    if (!control) fail(`/${prefix}`, `contact form has no "${field}" field`);
    else {
      const id = attr(control, 'id');
      if (!id || !html.includes(`for="${id}"`)) fail(`/${prefix}`, `field "${field}" has no <label for>`);
    }
  }
}

for (const message of warnings) console.warn(`⚠ ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`✗ ${message}`);
  console.error(`\n${errors.length} SEO/a11y problem(s).`);
  process.exit(1);
}
console.log(`✓ SEO/a11y OK on ${files.length} pages`);

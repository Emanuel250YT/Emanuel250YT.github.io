#!/usr/bin/env node
/**
 * Verificacion estatica de SEO y accesibilidad sobre dist/ (corre despues del build).
 * Falla (exit 1) si alguna pagina indexable rompe una regla; ver CLAUDE.md.
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const SITE = 'https://emanuel250.dev.ar';

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
      return entry.name.endsWith('.html') ? [full] : [];
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

if (!existsSync(dist)) {
  console.error('No existe dist/. Corre `npm run build` primero.');
  process.exit(1);
}

const files = await htmlFiles(dist);
const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const rel = path.relative(dist, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // Documento
  if (!/^<!DOCTYPE html>/i.test(html)) fail(rel, 'falta <!doctype html>');
  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  if (!lang) fail(rel, '<html> sin lang');
  if (!/<meta name="viewport"/.test(html)) fail(rel, 'falta meta viewport');

  // Title + description
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(rel, 'falta <title>');
  else {
    if (title.length > 70) warn(rel, `title largo (${title.length} caracteres)`);
    if (!noindex) {
      if (titles.has(title)) fail(rel, `title duplicado con ${titles.get(title)}`);
      titles.set(title, rel);
    }
  }
  const description = metaContent(html, 'name', 'description');
  if (!description) fail(rel, 'falta meta description');
  else {
    if (!noindex && (description.length < 70 || description.length > 170))
      warn(rel, `description de ${description.length} caracteres (ideal 120-160)`);
    if (!noindex) {
      if (descriptions.has(description)) fail(rel, `description duplicada con ${descriptions.get(description)}`);
      descriptions.set(description, rel);
    }
  }

  // Encabezados
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(rel, `tiene ${h1s.length} <h1> (debe ser 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
  levels.forEach((level, index) => {
    if (index > 0 && level > levels[index - 1] + 1) fail(rel, `salto de encabezado h${levels[index - 1]} -> h${level}`);
  });

  // Imagenes y enlaces
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    // alt vacio (alt / alt="") es valido para imagenes decorativas.
    if (!/\salt(="|\s|>|\/)/.test(img)) fail(rel, `<img> sin alt: ${img.slice(0, 80)}`);
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img)) fail(rel, `<img> sin width/height (CLS): ${img.slice(0, 80)}`);
  }
  for (const link of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? []) {
    const open = link.match(/<a\b[^>]*>/)[0];
    const label = attr(open, 'aria-label') ?? text(link);
    if (!label) fail(rel, `enlace sin texto accesible: ${open.slice(0, 80)}`);
    if (attr(open, 'target') === '_blank' && !/noopener/.test(attr(open, 'rel') ?? ''))
      fail(rel, `target=_blank sin rel=noopener: ${open.slice(0, 80)}`);
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const dupes = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (dupes.length) fail(rel, `ids duplicados: ${[...new Set(dupes)].join(', ')}`);
  if (!/class="skip-link"/.test(html)) fail(rel, 'falta el skip link');
  if (!/<main\b/.test(html)) fail(rel, 'falta <main>');

  if (noindex) continue;

  // Canonical, hreflang, Open Graph
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) fail(rel, 'falta canonical');
  else {
    if (!canonical.startsWith(SITE)) fail(rel, `canonical fuera del dominio: ${canonical}`);
    if (!canonical.endsWith('/')) fail(rel, `canonical sin barra final: ${canonical}`);
    const expected = `${SITE}/${rel.replace(/index\.html$/, '')}`;
    if (canonical !== expected) fail(rel, `canonical ${canonical} no coincide con la ruta ${expected}`);
  }
  for (const hreflang of ['es-AR', 'en', 'x-default']) {
    if (!html.includes(`hreflang="${hreflang}"`)) fail(rel, `falta hreflang ${hreflang}`);
  }
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale']) {
    if (!metaContent(html, 'property', property)) fail(rel, `falta ${property}`);
  }
  const ogImage = metaContent(html, 'property', 'og:image');
  if (ogImage) {
    const local = path.join(dist, new URL(ogImage).pathname);
    if (!existsSync(local)) fail(rel, `og:image no existe en dist: ${ogImage}`);
  }
  if (!metaContent(html, 'name', 'twitter:card')) fail(rel, 'falta twitter:card');

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(rel, 'falta JSON-LD');
  for (const [, json] of blocks) {
    try {
      const data = JSON.parse(json);
      const types = (data['@graph'] ?? [data]).map((node) => node['@type']);
      if (!types.includes('Person')) fail(rel, 'JSON-LD sin Person');
    } catch (error) {
      fail(rel, `JSON-LD invalido: ${error.message}`);
    }
  }
}

// Archivos del sitio
for (const required of ['CNAME', 'robots.txt', 'sitemap-index.xml', 'favicon.ico', 'favicon.svg', 'site.webmanifest', '404.html', 'llms.txt']) {
  if (!existsSync(path.join(dist, required))) fail('dist', `falta ${required}`);
}
for (const pdf of ['cv/emanuel-guzman-cv.pdf', 'en/cv/emanuel-guzman-cv.pdf']) {
  if (!existsSync(path.join(dist, pdf))) fail('dist', `falta ${pdf} (npm run assets)`);
}
if (existsSync(path.join(dist, 'CNAME'))) {
  const cname = (await readFile(path.join(dist, 'CNAME'), 'utf8')).trim();
  if (`https://${cname}` !== SITE) fail('CNAME', `"${cname}" no coincide con ${SITE}`);
}
const robots = existsSync(path.join(dist, 'robots.txt')) ? await readFile(path.join(dist, 'robots.txt'), 'utf8') : '';
if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) fail('robots.txt', 'no declara el sitemap');
const sitemap = existsSync(path.join(dist, 'sitemap-0.xml')) ? await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8') : '';
for (const url of ['/', '/en/', '/cv/', '/en/cv/']) {
  if (!sitemap.includes(`<loc>${SITE}${url}</loc>`)) fail('sitemap-0.xml', `falta ${url}`);
}
if (sitemap.includes('404')) fail('sitemap-0.xml', 'incluye la pagina 404');

for (const message of warnings) console.warn(`⚠ ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`✗ ${message}`);
  console.error(`\n${errors.length} problema(s) de SEO/a11y.`);
  process.exit(1);
}
console.log(`✓ SEO/a11y OK en ${files.length} paginas`);

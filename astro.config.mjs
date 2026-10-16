// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// Keep in sync with src/i18n/locales.ts (Astro config cannot import TS sources).
const locales = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi'];
const sitemapLocales = {
  es: 'es-AR',
  en: 'en',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  zh: 'zh-CN',
  hi: 'hi',
};

// Every URL in the sitemap carries the build date as <lastmod>.
const buildDate = new Date().toISOString();

// Public domain (dev.ar -> GitHub Pages). Must match public/CNAME.
// The rest of the code reads it through Astro.site / src/config/site.ts.
export default defineConfig({
  site: 'https://emanuel250.dev.ar',
  // GitHub Pages serves /en/ from /en/index.html: every canonical URL ends in "/".
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  i18n: {
    defaultLocale: 'es',
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: sitemapLocales,
      },
      filter: (page) => !page.includes('/404'),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.8,
      serialize(item) {
        const path = new URL(item.url).pathname;
        const isHome = path === '/' || locales.some((locale) => path === `/${locale}/`);
        const withDate = { ...item, lastmod: buildDate };
        if (isHome) return { ...withDate, priority: 1, changefreq: ChangeFreqEnum.WEEKLY };
        if (path.endsWith('/privacy/')) return { ...withDate, priority: 0.3, changefreq: ChangeFreqEnum.YEARLY };
        return withDate;
      },
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});

// @ts-check
import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// Public domain (dev.ar -> GitHub Pages). Must match public/CNAME.
// The rest of the code reads it through Astro.site / src/config/site.ts.
const SITE = 'https://emanuel250.dev.ar';

// Keep in sync with src/i18n/locales.ts (Astro config cannot import TS sources).
const locales = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi'];
const defaultLocale = 'es';
/** hreflang -> x-default, as BaseLayout does. */
const xDefaultLocale = 'en';
const sitemapLocales = {
  es: 'es-AR',
  en: 'en',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  zh: 'zh-CN',
  hi: 'hi',
};

/**
 * Commit dates (ISO 8601) of the files that hold a page's content. Freshness comes from
 * git, not from the build clock: a deploy that changes nothing keeps every date. Returns
 * {} outside a git checkout (CI checks out the full history, see deploy.yml).
 * @param {string[]} paths
 * @returns {{ created?: string, modified?: string }}
 */
function commitDates(paths) {
  try {
    const dates = execFileSync('git', ['log', '--format=%cI', '--', ...paths], { encoding: 'utf8' }).trim().split('\n');
    return dates[0] ? { modified: dates[0], created: dates.at(-1) } : {};
  } catch {
    return {};
  }
}

/**
 * Sources of each route; privacy only changes with its policy (PrivacyPage.astro holds `UPDATED`).
 * @type {Record<string, (locale: string) => string[]>}
 */
const routeSources = {
  '': (locale) => [
    `src/i18n/${locale}.ts`,
    'src/data',
    'src/components/pages/HomePage.astro',
    'src/components/sections',
    'src/components/contact',
  ],
  privacy: () => ['src/components/pages/PrivacyPage.astro'],
};

/** `${locale}:${route}` -> { created, modified }: read by the sitemap below and by src/lib/schema.ts. */
const contentDates = Object.fromEntries(
  locales.flatMap((locale) =>
    Object.entries(routeSources).map(([route, sources]) => {
      const dates = commitDates(sources(locale));
      // A locale's home page is created with its dictionary.
      if (route === '') dates.created = commitDates([`src/i18n/${locale}.ts`]).created ?? dates.created;
      return [`${locale}:${route}`, dates];
    }),
  ),
);

/**
 * Splits a sitemap URL into its locale and route ('' or 'privacy').
 * @param {string} url
 */
function routeOf(url) {
  const [first = '', ...rest] = new URL(url).pathname.split('/').filter(Boolean);
  return locales.includes(first) && first !== defaultLocale
    ? { locale: first, route: rest.join('/') }
    : { locale: defaultLocale, route: [first, ...rest].filter(Boolean).join('/') };
}

export default defineConfig({
  site: SITE,
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
        const { locale, route } = routeOf(item.url);
        const lastmod = contentDates[`${locale}:${route}`]?.modified;
        // The integration emits one alternate per locale; x-default mirrors BaseLayout.
        const xDefault = `${SITE}/${xDefaultLocale}/${route ? `${route}/` : ''}`;
        const entry = {
          ...item,
          ...(lastmod ? { lastmod } : {}),
          ...(item.links ? { links: [...item.links, { lang: 'x-default', url: xDefault }] } : {}),
        };
        if (route === '') return { ...entry, priority: 1, changefreq: ChangeFreqEnum.WEEKLY };
        if (route === 'privacy') return { ...entry, priority: 0.3, changefreq: ChangeFreqEnum.YEARLY };
        return entry;
      },
    }),
  ],
  vite: {
    define: {
      __CONTENT_DATES__: JSON.stringify(contentDates),
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});

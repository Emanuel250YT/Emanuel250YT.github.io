// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// Dominio publico (dev.ar -> GitHub Pages). Debe coincidir con public/CNAME.
// El resto del codigo lo lee con import.meta.env.SITE / Astro.site.
export default defineConfig({
  site: 'https://emanuel250.dev.ar',
  // GitHub Pages sirve /en/ desde /en/index.html: todas las URLs canonicas terminan en "/".
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
          en: 'en',
        },
      },
      filter: (page) => !page.includes('/404'),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.8,
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/' || path === '/en/') {
          return { ...item, priority: 1, changefreq: ChangeFreqEnum.WEEKLY };
        }
        return item;
      },
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});

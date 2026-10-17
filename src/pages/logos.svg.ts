import type { APIRoute } from 'astro';
import { ecosystems } from '@/data/ecosystems';
import { technologies } from '@/data/technologies';

/**
 * SVG sprite with every vector logo of the carousels (one <symbol> per icon id), built
 * from src/data/technologies.ts and src/data/ecosystems.ts. The carousels reference it
 * with <use href>, so the logos are one cached request for every page and locale.
 */
const symbols = new Map<string, { viewBox: string; path: string }>();
for (const logo of [...technologies, ...ecosystems]) {
  if ('path' in logo && logo.path && !symbols.has(logo.icon)) {
    symbols.set(logo.icon, { viewBox: logo.viewBox ?? '0 0 24 24', path: logo.path });
  }
}

export const GET: APIRoute = () =>
  new Response(
    `<svg xmlns="http://www.w3.org/2000/svg">${[...symbols]
      .map(([id, { viewBox, path }]) => `<symbol id="${id}" viewBox="${viewBox}"><path d="${path}"/></symbol>`)
      .join('')}</svg>`,
    { headers: { 'Content-Type': 'image/svg+xml' } },
  );

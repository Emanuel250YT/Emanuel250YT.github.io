/**
 * npm packages Emanuel publishes or collaborates on. Download counts are never typed
 * by hand: they come from npm's public downloads API (api.npmjs.org), at build time
 * and again live in the browser (see src/lib/npm.ts).
 */
export interface NpmPackage {
  name: string;
  /** First publish (YYYY-MM-DD): downloads are counted from this day. */
  since: string;
}

/** Packages listed one by one (published under his own npm user, or no longer listed anywhere). */
export const npmPackages: NpmPackage[] = [
  // Unpublished on 2026-03-10; npm keeps its download history.
  { name: 'macroclickjs', since: '2025-10-18' },
  { name: 'arka-cdn', since: '2026-03-05' },
  { name: '@emanuel250dev/aside', since: '2026-03-06' },
];

/**
 * npm organisations he collaborates on: every package they publish counts, including
 * new ones. They are listed from the registry at build time (the daily deploy picks
 * up new packages), with their first publish date as `since`.
 */
export const npmOrgs = ['cosmosapp'];

/** Public chart of npm's own numbers, linked as the source of a download claim. */
export const npmStatUrl = (packages: string[], from: string, to: string) =>
  `https://npm-stat.com/charts.html?${packages.map((name) => `package=${encodeURIComponent(name)}`).join('&')}&from=${from}&to=${to}`;

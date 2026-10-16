import { npmPackages, type NpmPackage } from '@/data/npm';

/**
 * Real npm download counts from the public API (CORS-enabled, no key). Used at
 * build time for the static number and in the browser to refresh it live.
 */

/** Marks the hero stat whose value is the live npm total (see `hero.stats`). */
export const NPM_DOWNLOADS_TOKEN = '{npmDownloads}';

const API = 'https://api.npmjs.org/downloads/point';
/** The API answers ranges of up to 18 months; longer spans are split. */
const MAX_DAYS = 500;
const DAY_MS = 86_400_000;

const isoDay = (time: number) => new Date(time).toISOString().slice(0, 10);

function ranges(since: string, until: number): [string, string][] {
  const result: [string, string][] = [];
  for (let start = Date.parse(`${since}T00:00:00Z`); start <= until; start += MAX_DAYS * DAY_MS) {
    result.push([isoDay(start), isoDay(Math.min(start + (MAX_DAYS - 1) * DAY_MS, until))]);
  }
  return result;
}

async function packageDownloads(pkg: NpmPackage, until: number): Promise<number> {
  let total = 0;
  for (const [start, end] of ranges(pkg.since, until)) {
    const response = await fetch(`${API}/${start}:${end}/${pkg.name}`);
    if (!response.ok) throw new Error(`npm downloads API answered ${response.status} for ${pkg.name}`);
    const data = (await response.json()) as { downloads?: number };
    total += data.downloads ?? 0;
  }
  return total;
}

/** Downloads of every package in src/data/npm.ts, from its first publish until today. */
export async function totalDownloads(): Promise<number> {
  const until = Date.now();
  const counts = await Promise.all(npmPackages.map((pkg) => packageDownloads(pkg, until)));
  return counts.reduce((sum, count) => sum + count, 0);
}

let buildTotal: Promise<number> | undefined;

/** Same total, fetched once per build and shared by every locale. */
export function buildTotalDownloads(): Promise<number> {
  buildTotal ??= totalDownloads().catch((error: unknown) => {
    buildTotal = undefined;
    throw error;
  });
  return buildTotal;
}

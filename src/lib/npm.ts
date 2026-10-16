import { npmOrgs, npmPackages, type NpmPackage } from '@/data/npm';

/**
 * Real npm download counts from the public API (CORS-enabled, no key). Used at
 * build time for the static number and in the browser to refresh it live.
 */

/** Marks the hero stat whose value is the live npm total (see `hero.stats`). */
export const NPM_DOWNLOADS_TOKEN = '{npmDownloads}';

const API = 'https://api.npmjs.org/downloads/point';
const REGISTRY = 'https://registry.npmjs.org';
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

/** Downloads of the given packages, each from its first publish until today. */
export async function totalDownloads(packages: NpmPackage[]): Promise<number> {
  const until = Date.now();
  const counts = await Promise.all(packages.map((pkg) => packageDownloads(pkg, until)));
  return counts.reduce((sum, count) => sum + count, 0);
}

async function registryJson<T>(path: string): Promise<T> {
  const response = await fetch(`${REGISTRY}/${path}`);
  if (!response.ok) throw new Error(`npm registry answered ${response.status} for /${path}`);
  return (await response.json()) as T;
}

/** Every package an npm organisation publishes, dated by its first publish. */
async function orgPackages(org: string): Promise<NpmPackage[]> {
  // Build time only: the registry sends no CORS headers for this endpoint.
  const names = Object.keys(await registryJson<Record<string, string>>(`-/org/${org}/package`));
  return Promise.all(
    names.map(async (name) => {
      const document = await registryJson<{ time?: { created?: string } }>(name.replace('/', '%2f'));
      const created = document.time?.created;
      if (!created) throw new Error(`npm registry has no publish date for ${name}`);
      return { name, since: created.slice(0, 10) };
    }),
  );
}

/** The packages of src/data/npm.ts plus every package of its organisations, without duplicates. */
async function resolvePackages(): Promise<NpmPackage[]> {
  const fromOrgs = (await Promise.all(npmOrgs.map(orgPackages))).flat();
  const byName = new Map([...npmPackages, ...fromOrgs].map((pkg) => [pkg.name, pkg]));
  return [...byName.values()];
}

export interface DownloadsSnapshot {
  /** Packages counted, embedded in the page so the browser refreshes the same set. */
  packages: NpmPackage[];
  total: number;
}

let buildSnapshot: Promise<DownloadsSnapshot> | undefined;

/** Packages and total, fetched once per build and shared by every locale. */
export function buildDownloads(): Promise<DownloadsSnapshot> {
  buildSnapshot ??= resolvePackages()
    .then(async (packages) => ({ packages, total: await totalDownloads(packages) }))
    .catch((error: unknown) => {
      buildSnapshot = undefined;
      throw error;
    });
  return buildSnapshot;
}

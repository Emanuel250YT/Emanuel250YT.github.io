import achievementsData from '@/data/achievements.json';
import certificationsData from '@/data/certifications.json';
import communityData from '@/data/community.json';
import type { Locale, Localized } from '@/i18n/locales';
import { byFileName } from '@/lib/images';

/**
 * Cards of the achievements section, kept in three JSON files with the same shape so
 * each kind of fact lives in one place and is easy to update by hand:
 * - src/data/achievements.json: milestones (selections, npm download records).
 * - src/data/certifications.json: certificates (also the JSON-LD `hasCredential`).
 * - src/data/community.json: talks, hackathons, bootcamps and sponsorships.
 * The types below check every file (`npm run check` fails on a missing field or language).
 */
export interface HighlightEntry {
  id: string;
  /** ISO date (YYYY-MM, or YYYY when the month is unknown) for <time datetime> and sorting. */
  date: string;
  /** Localized, or one string for a proper name (a certificate keeps its official name). */
  title: Localized | string;
  /** One line under the title; a certificate without one reads "Certification". */
  detail?: Localized;
  org: string;
  /** Initials drawn on the card's cover. */
  mark: string;
  /**
   * Public source that proves it, shown as a link on its card: an npm-stat chart for
   * downloads, the issuer's credential page for a certificate.
   */
  url?: string;
  /**
   * One card for several credentials of the same issuer (Talently): each name links to
   * its own credential page and the card itself opens the first one. Replaces `url`.
   */
  credentials?: { name: string; url: string }[];
}

/** The file a highlight comes from; it picks the illustration of its cover. */
export type HighlightKind = 'achievement' | 'certification' | 'community';

export interface Highlight extends HighlightEntry {
  kind: HighlightKind;
  /** Real image of the card, from src/assets/<kind folder>/ (see below). */
  image?: ImageMetadata | undefined;
}

/**
 * Real images of the cards, picked up by file name; a card without one keeps its drawn
 * cover.
 * - src/assets/certifications/<id>.png|jpg: the issuer's badge (transparent PNG) or the
 *   certificate itself (JPG), from the credential page the card links to.
 * - src/assets/community/<id>.jpg: a photo of the event (his LinkedIn posts, the organisers'
 *   pages) or, for a virtual one, its official flyer; 4:3.
 */
const images: Partial<Record<HighlightKind, Record<string, ImageMetadata>>> = {
  certification: byFileName(
    import.meta.glob<ImageMetadata>('/src/assets/certifications/*.{png,jpg}', { eager: true, import: 'default' }),
  ),
  community: byFileName(import.meta.glob<ImageMetadata>('/src/assets/community/*.jpg', { eager: true, import: 'default' })),
};

/** Most recent first. */
const byDate = (items: Highlight[]) => [...items].sort((a, b) => b.date.localeCompare(a.date));
const load = (entries: HighlightEntry[], kind: HighlightKind) =>
  byDate(entries.map((entry) => ({ ...entry, kind, image: images[kind]?.[entry.id] })));

export const achievements: Highlight[] = load(achievementsData, 'achievement');
export const certifications: Highlight[] = load(certificationsData, 'certification');
export const community: Highlight[] = load(communityData, 'community');

/** Achievements and certifications share the first grid of the section, newest first. */
export const achievementsAndCertifications: Highlight[] = byDate([...achievements, ...certifications]);

export const localize = (value: Localized | string, locale: Locale) => (typeof value === 'string' ? value : value[locale]);

/** Where the card leads: its source, or the first of its credentials. */
export const highlightUrl = (item: HighlightEntry) => item.url ?? item.credentials?.[0]?.url;

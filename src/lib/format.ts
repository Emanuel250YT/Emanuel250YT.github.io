import { localeMeta, type Locale } from '@/i18n/locales';

/**
 * "2025-09" -> "sept 2025" / "Sep 2025" / "2025年9月"; "2025" -> "2025".
 * Formatted in UTC so the build output does not depend on the machine's time zone.
 */
export function formatMonth(iso: string, locale: Locale): string {
  const [year, month] = iso.split('-');
  if (!month) return year ?? iso;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  const formatted = new Intl.DateTimeFormat(localeMeta[locale].dateLocale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  // Spanish and Portuguese render "sept. de 2025": keep it compact ("sept 2025").
  return formatted.replace('.', '').replace(' de ', ' ');
}

export function formatRange(start: string, end: string | undefined, locale: Locale, present: string): string {
  return `${formatMonth(start, locale)} – ${end ? formatMonth(end, locale) : present}`;
}

/** Strips the protocol and trailing slash for display. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

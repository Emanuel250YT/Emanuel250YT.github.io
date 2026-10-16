import { localeMeta, type Locale } from '@/i18n/locales';

/**
 * "2025-09" -> "sept 2025" / "Sep 2025"; "2025" -> "2025".
 * Se formatea en UTC para que el build no dependa de la zona horaria.
 */
export function formatMonth(iso: string, locale: Locale): string {
  const [year, month] = iso.split('-');
  if (!month) return year ?? iso;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat(localeMeta[locale].dateLocale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '')
    .replace(' de ', ' ');
}

export function formatRange(start: string, end: string | undefined, locale: Locale, present: string): string {
  return `${formatMonth(start, locale)} – ${end ? formatMonth(end, locale) : present}`;
}

/** Quita protocolo y barra final para mostrar URLs. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

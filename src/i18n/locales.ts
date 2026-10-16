export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/** Texto que existe en los dos idiomas. */
export type Localized<T = string> = Record<Locale, T>;

export const localeMeta: Record<
  Locale,
  { htmlLang: string; hreflang: string; ogLocale: string; label: string; dateLocale: string }
> = {
  es: { htmlLang: 'es-AR', hreflang: 'es-AR', ogLocale: 'es_AR', label: 'Español', dateLocale: 'es-AR' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', label: 'English', dateLocale: 'en-US' },
};

/** Prefijo de URL de cada idioma: el espanol vive en la raiz. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/** Arma una ruta interna con barra final, p. ej. localePath('en', 'cv') -> /en/cv/ */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${localePrefix(locale)}${clean}/` : localePrefix(locale);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

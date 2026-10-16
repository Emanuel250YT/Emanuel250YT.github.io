export const locales = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/** Locale served to users whose language matches none of ours (hreflang x-default). */
export const fallbackLocale: Locale = 'en';

/** Text that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

export type FlagId = 'ar' | 'us' | 'br' | 'fr' | 'de' | 'cn' | 'in';

export interface LocaleMeta {
  /** BCP 47 tag for <html lang> and for content in this language. */
  htmlLang: string;
  /** hreflang value used in <link rel="alternate"> and the sitemap. */
  hreflang: string;
  ogLocale: string;
  /** Intl locale used to format dates. */
  dateLocale: string;
  /** Language name written in that language (endonym). */
  nativeName: string;
  /** Short label shown on the language switcher button. */
  short: string;
  flag: FlagId;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  es: { htmlLang: 'es-AR', hreflang: 'es-AR', ogLocale: 'es_AR', dateLocale: 'es-AR', nativeName: 'Español', short: 'ES', flag: 'ar' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', dateLocale: 'en-US', nativeName: 'English', short: 'EN', flag: 'us' },
  pt: { htmlLang: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR', dateLocale: 'pt-BR', nativeName: 'Português', short: 'PT', flag: 'br' },
  fr: { htmlLang: 'fr', hreflang: 'fr', ogLocale: 'fr_FR', dateLocale: 'fr-FR', nativeName: 'Français', short: 'FR', flag: 'fr' },
  de: { htmlLang: 'de', hreflang: 'de', ogLocale: 'de_DE', dateLocale: 'de-DE', nativeName: 'Deutsch', short: 'DE', flag: 'de' },
  zh: { htmlLang: 'zh-CN', hreflang: 'zh-CN', ogLocale: 'zh_CN', dateLocale: 'zh-CN', nativeName: '中文', short: 'ZH', flag: 'cn' },
  hi: { htmlLang: 'hi', hreflang: 'hi', ogLocale: 'hi_IN', dateLocale: 'hi-IN', nativeName: 'हिन्दी', short: 'HI', flag: 'in' },
};

/** Locales that live under a URL prefix (everything except the default). */
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** URL prefix of a locale: the default locale lives at the root. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/** Builds an internal path with a trailing slash, e.g. localePath('en', 'cv') -> /en/cv/ */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${localePrefix(locale)}${clean}/` : localePrefix(locale);
}

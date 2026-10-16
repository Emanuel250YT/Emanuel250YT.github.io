import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import type { Locale } from '@/i18n/locales';
import type { Dictionary } from '@/i18n/types';

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from '@/i18n/locales';
export type * from '@/i18n/types';

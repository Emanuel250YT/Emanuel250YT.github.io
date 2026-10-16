import { de } from '@/i18n/de';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { fr } from '@/i18n/fr';
import { hi } from '@/i18n/hi';
import type { Locale } from '@/i18n/locales';
import { pt } from '@/i18n/pt';
import type { Dictionary } from '@/i18n/types';
import { zh } from '@/i18n/zh';

const dictionaries: Record<Locale, Dictionary> = { es, en, pt, fr, de, zh, hi };

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from '@/i18n/locales';
export type * from '@/i18n/types';

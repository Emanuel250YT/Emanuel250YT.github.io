import { existsSync } from 'node:fs';
import path from 'node:path';
import { defaultLocale, localePath, type Locale } from '@/i18n/locales';

/**
 * The CV PDFs are uploaded by hand, never generated, so they keep stable URLs
 * that other sites can link to or fetch:
 *   public/cv/emanuel-guzman-cv.pdf            default locale, required
 *   public/<locale>/cv/emanuel-guzman-cv.pdf   optional, one per language
 * A language without its own PDF links to the default one.
 */
export const CV_PDF_NAME = 'emanuel-guzman-cv.pdf';

const urlPath = (locale: Locale) => `${localePath(locale, 'cv')}${CV_PDF_NAME}`;

/** Builds run from the project root, where public/ lives. */
const isUploaded = (locale: Locale) => existsSync(path.join(process.cwd(), 'public', urlPath(locale)));

export function cvPdfPath(locale: Locale): string {
  return urlPath(isUploaded(locale) ? locale : defaultLocale);
}

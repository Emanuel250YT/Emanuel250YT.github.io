import { localePath, type Locale } from '@/i18n/locales';

/** PDF del CV generado por `npm run assets` en public/<idioma>/cv/. */
export const CV_PDF_NAME = 'emanuel-guzman-cv.pdf';

export function cvPdfPath(locale: Locale): string {
  return `${localePath(locale, 'cv')}${CV_PDF_NAME}`;
}

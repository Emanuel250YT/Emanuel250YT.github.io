/**
 * User-perceived characters (grapheme clusters), so typing effects never cut a
 * Devanagari conjunct, an accent or an emoji in half. Falls back to code points
 * where Intl.Segmenter is missing.
 */
export interface Grapheme {
  /** Offset of the character inside the text. */
  start: number;
  end: number;
  segment: string;
}

const segmenters = new Map<string, Intl.Segmenter>();

export function graphemes(text: string, locale = document.documentElement.lang): Grapheme[] {
  if (typeof Intl.Segmenter !== 'function') {
    let offset = 0;
    return Array.from(text, (segment) => {
      const start = offset;
      offset += segment.length;
      return { start, end: offset, segment };
    });
  }
  let segmenter = segmenters.get(locale);
  if (!segmenter) {
    segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    segmenters.set(locale, segmenter);
  }
  return Array.from(segmenter.segment(text), ({ segment, index }) => ({ start: index, end: index + segment.length, segment }));
}

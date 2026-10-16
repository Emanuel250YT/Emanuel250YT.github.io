import { getImage } from 'astro:assets';
import portrait from '@/assets/portrait.png';
import { site } from '@/config/site';
import type { ImageRef } from '@/lib/schema';

/** The 744 px WebP portrait the JSON-LD points to (Person image, primaryImageOfPage). */
export async function portraitRef(): Promise<ImageRef> {
  const image = await getImage({ src: portrait, width: 744, format: 'webp' });
  return {
    url: new URL(image.src, site.url).href,
    width: Number(image.attributes.width),
    height: Number(image.attributes.height),
  };
}

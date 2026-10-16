import { site } from '@/config/site';

/** wa.me link to the owner's WhatsApp, optionally with a prefilled message. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

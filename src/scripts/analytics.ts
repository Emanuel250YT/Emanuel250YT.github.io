/**
 * Google Analytics 4 + Google Tag Manager with explicit consent ("basic" consent mode).
 *
 * - Nothing from Google loads until the visitor accepts; the choice is kept in
 *   localStorage and can be changed from any `[data-consent-open]` button.
 * - GA4 is loaded directly with gtag.js. GTM is loaded for extra tags only:
 *   do NOT add a Google tag / GA4 tag for the same measurement ID inside GTM, or
 *   every page view and event would be counted twice.
 * - Conversions are reported through `track()` (or an `analytics:event`
 *   CustomEvent) and through `[data-track]` attributes on links/buttons:
 *   `data-track="cta_click" data-track-location="hero"`. Each event goes to GA4
 *   (`gtag('event')`) and, when GTM is present, to the dataLayer as
 *   `{ event: name, ...params }` so GTM triggers can use it.
 */

type Params = Record<string, string | number | boolean>;
type Choice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'consent.analytics';
let measurementId = '';
let containerId = '';
let loaded = false;

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function storeChoice(choice: Choice): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts this page view.
  }
}

function injectScript(src: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.append(script);
}

function loadGoogleTags(): void {
  if (loaded || (!measurementId && !containerId)) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    window.dataLayer!.push(arguments);
  };
  // Consent state first, so every Google tag (gtag.js or GTM) starts from it.
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (measurementId) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { page_title: document.title, language: document.documentElement.lang });
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`);
  }

  if (containerId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`);
  }
}

function revokeGoogleTags(): void {
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  // Remove the GA cookies set for this domain.
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (name && (name === '_ga' || name.startsWith('_ga_'))) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  }
}

/** Sends an event to GA4 and GTM when the visitor accepted analytics; a no-op otherwise. */
export function track(name: string, params: Params = {}): void {
  if (!loaded || readChoice() !== 'granted') return;
  if (measurementId) window.gtag?.('event', name, params);
  if (containerId) window.dataLayer?.push({ event: name, ...params });
}

function trackFromAttributes(element: HTMLElement): void {
  const name = element.dataset.track;
  if (!name) return;
  const params: Params = { page_language: document.documentElement.lang };
  for (const [key, value] of Object.entries(element.dataset)) {
    if (key.startsWith('track') && key !== 'track' && value) {
      const param = key.slice(5).replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
      params[param] = value;
    }
  }
  if (element instanceof HTMLAnchorElement) params.link_url = element.href;
  track(name, params);
}

export function initAnalytics(): void {
  const banner = document.querySelector<HTMLElement>('[data-consent]');
  measurementId = banner?.dataset.gaId ?? '';
  containerId = banner?.dataset.gtmId ?? '';
  if (!banner || (!measurementId && !containerId)) return;

  const choice = readChoice();
  if (choice === 'granted') loadGoogleTags();
  if (choice === null) banner.hidden = false;

  banner.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-consent-choice]');
    if (!button) return;
    const next = button.dataset.consentChoice as Choice;
    storeChoice(next);
    banner.hidden = true;
    if (next === 'granted') loadGoogleTags();
    else revokeGoogleTags();
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-consent-open]')) {
      banner.hidden = false;
      banner.querySelector<HTMLButtonElement>('[data-consent-choice="granted"]')?.focus();
      return;
    }
    const tracked = target.closest<HTMLElement>('[data-track]');
    if (tracked) trackFromAttributes(tracked);
  });

  document.addEventListener('analytics:event', (event) => {
    const { name, params } = (event as CustomEvent<{ name: string; params?: Params }>).detail;
    track(name, params);
  });
}

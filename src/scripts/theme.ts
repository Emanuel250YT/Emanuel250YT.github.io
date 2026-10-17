/**
 * Light / dark theme. Without a choice the page follows the system
 * (`prefers-color-scheme`, in global.css); the header toggle stores an explicit
 * choice in localStorage (`theme`) and sets `data-theme` on <html>, which the inline
 * script in BaseLayout re-applies before the first paint on every page.
 *
 * Toggle buttons: `[data-theme-toggle]`, hidden without JS. They are toggle buttons
 * (`aria-pressed` = dark theme on) named by a visually hidden label.
 */

const STORAGE_KEY = 'theme';
const COLORS = { light: '#f3f3f3', dark: '#121212' } as const;
type Theme = keyof typeof COLORS;

const system = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;

function stored(): Theme | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : undefined;
  } catch {
    return undefined;
  }
}

const current = (): Theme => stored() ?? (system.matches ? 'dark' : 'light');

function sync(): void {
  const theme = current();
  for (const toggle of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  // The browser UI (address bar on mobile) follows the page, not only the system.
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[data-theme-color]')) {
    meta.content = stored() ? COLORS[theme] : meta.media.includes('dark') ? COLORS.dark : COLORS.light;
  }
}

function choose(theme: Theme): void {
  const apply = () => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private mode: the choice lasts for this page only.
    }
    sync();
  };
  // A plain cross-fade between themes where the browser supports it (`html.theme-switching`
  // swaps the page-navigation animation for a fade in global.css); it moves nothing, so
  // it also suits reduced motion.
  if (typeof document.startViewTransition !== 'function') return apply();
  root.classList.add('theme-switching');
  document.startViewTransition(apply).finished.finally(() => root.classList.remove('theme-switching'));
}

for (const toggle of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => choose(current() === 'dark' ? 'light' : 'dark'));
}
system.addEventListener('change', sync);
sync();

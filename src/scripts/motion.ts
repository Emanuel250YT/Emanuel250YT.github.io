/**
 * Page-wide motion: reveal-on-scroll and number count-up.
 *
 * - `[data-reveal]` elements start hidden via CSS (only under `html.js`) and get
 *   `.is-revealed` once visible: they slide in, or only fade with reduced motion.
 * - Children of `[data-reveal-stagger]` receive an increasing `--reveal-index`.
 * - `[data-count]` elements animate the number inside their text when revealed.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function staggerChildren(): void {
  for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-stagger]')) {
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((element, index) => {
      element.style.setProperty('--reveal-index', String(index));
    });
  }
}

/**
 * Counts up to the integer in `data-count-value`, formatted for the page language
 * ("4.320", "4,320"). The target is read on every frame, so a live update that lands
 * mid-count (the npm stat) is honoured; `data-counting` is set while it runs.
 */
function countUpValue(element: HTMLElement): void {
  const format = new Intl.NumberFormat(document.documentElement.lang);
  const duration = 1400;
  const start = performance.now();
  element.dataset.counting = '';
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = format.format(Math.round(Number(element.dataset.countValue) * eased));
    if (progress < 1) requestAnimationFrame(step);
    else delete element.dataset.counting;
  };
  requestAnimationFrame(step);
}

/** Animates "8+" as 0+ → 8+, keeping prefix/suffix and the final text intact. */
function countUp(element: HTMLElement): void {
  if (element.dataset.countValue) {
    countUpValue(element);
    return;
  }
  const finalText = element.textContent ?? '';
  const match = finalText.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return;
  const [, prefix, numberText, suffix] = match;
  const target = Number(numberText!.replace(',', '.'));
  const duration = 1400;
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = finalText;
  };
  requestAnimationFrame(step);
}

function reveal(element: HTMLElement): void {
  element.classList.add('is-revealed');
  // Counting numbers is movement for the eye: skipped with reduced motion.
  if (!reducedMotion.matches) {
    element.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
    if (element.hasAttribute('data-count')) countUp(element);
  }
}

function init(): void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-count-group]')];
  if (!('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-revealed'));
    return;
  }

  staggerChildren();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  targets.forEach((element) => observer.observe(element));
}

init();

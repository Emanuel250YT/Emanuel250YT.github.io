import { graphemes } from '@/lib/graphemes';

/**
 * Typewriter reveal: `[data-type]` headings and copy type themselves in, character by
 * character, when they scroll into view, with a square caret after the last character.
 *
 * The DOM is never touched. The part still to type is a live Range in a CSS highlight
 * painted transparent (`::highlight(type-pending)` in global.css), so screen readers,
 * search engines, find-in-page and copy always get the whole text, and the layout is
 * final from the first paint (CLS 0).
 *
 * - `data-type-delay="<ms>"` holds the start (used in the hero to sequence the copy).
 * - Typing changes text in place and nothing moves, so it also runs with
 *   prefers-reduced-motion; only the caret's farewell blink is skipped (CSS).
 * - Browsers without the Highlight API show the text as is.
 */

const HIGHLIGHT_NAME = 'type-pending';
/** Headings type slower than copy; long blocks speed up so none takes longer than the cap. */
const HEADING = { perChar: 34, max: 1400 };
const COPY = { perChar: 11, max: 1100 };
/** Elements entering the viewport together start one after another. */
const STAGGER = 110;

interface Stop {
  node: Text;
  start: number;
  end: number;
}

interface Typer {
  element: HTMLElement;
  range: Range;
  stops: Stop[];
  startAt: number;
  perChar: number;
  shown: number;
  caret?: HTMLElement;
  caretNode?: Text;
}

const highlight = 'highlights' in CSS ? new Highlight() : undefined;
const pending = new Map<HTMLElement, Range>();
const active = new Set<Typer>();
const measure = document.createRange();
let frame = 0;

/** Every visible character of the element in document order; whitespace types along with the next one. */
function collectStops(element: HTMLElement): Stop[] {
  const stops: Stop[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement?.closest('.visually-hidden') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    for (const { start, end, segment } of graphemes(node.data)) {
      if (segment.trim()) stops.push({ node, start, end });
    }
  }
  return stops;
}

function placeCaret(typer: Typer): void {
  const stop = typer.stops[Math.max(typer.shown - 1, 0)]!;
  measure.setStart(stop.node, stop.start);
  measure.setEnd(stop.node, stop.end);
  const rects = measure.getClientRects();
  const rect = rects[rects.length - 1];
  if (!rect) return;

  if (!typer.caret) {
    typer.caret = document.createElement('span');
    typer.caret.className = 'type-caret';
    typer.caret.setAttribute('aria-hidden', 'true');
    document.body.append(typer.caret);
  }
  if (typer.caretNode !== stop.node) {
    typer.caretNode = stop.node;
    typer.caret.style.color = getComputedStyle(stop.node.parentElement ?? typer.element).color;
  }
  const height = rect.height * 0.82;
  const x = typer.shown === 0 ? rect.left : rect.right;
  typer.caret.style.width = `${Math.max(2, Math.round(rect.height * 0.06))}px`;
  typer.caret.style.height = `${height}px`;
  typer.caret.style.transform = `translate(${x + 1}px, ${rect.top + (rect.height - height) / 2}px)`;
}

function finish(typer: Typer): void {
  active.delete(typer);
  highlight?.delete(typer.range);
  typer.element.dataset.typed = '';
  const caret = typer.caret;
  if (!caret) return;
  caret.classList.add('is-done');
  window.setTimeout(() => caret.remove(), 1000);
}

function tick(now: number): void {
  for (const typer of active) {
    if (now < typer.startAt) continue;
    const shown = Math.min(typer.stops.length, Math.floor((now - typer.startAt) / typer.perChar) + 1);
    if (shown !== typer.shown) {
      typer.shown = shown;
      const stop = typer.stops[shown - 1]!;
      typer.range.setStart(stop.node, stop.end);
    }
    placeCaret(typer);
    if (shown === typer.stops.length) finish(typer);
  }
  frame = active.size ? requestAnimationFrame(tick) : 0;
}

function start(element: HTMLElement, delay: number): void {
  const range = pending.get(element);
  if (!range) return;
  pending.delete(element);
  const stops = collectStops(element);
  if (!stops.length) {
    highlight?.delete(range);
    return;
  }
  const speed = /^H[1-6]$/.test(element.tagName) ? HEADING : COPY;
  active.add({
    element,
    range,
    stops,
    startAt: performance.now() + delay + Number(element.dataset.typeDelay ?? 0),
    perChar: Math.min(speed.perChar, speed.max / stops.length),
    shown: 0,
  });
  frame ||= requestAnimationFrame(tick);
}

/** Printing never waits for typing: every pending character shows at once. */
function typeEverything(): void {
  for (const typer of active) finish(typer);
  for (const range of pending.values()) highlight?.delete(range);
  pending.clear();
}

function init(): void {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-type]')];
  if (!highlight || !('IntersectionObserver' in window)) {
    elements.forEach((element) => (element.dataset.typeReady = ''));
    return;
  }

  CSS.highlights.set(HIGHLIGHT_NAME, highlight);
  for (const element of elements) {
    const range = document.createRange();
    range.selectNodeContents(element);
    highlight.add(range);
    pending.set(element, range);
    element.dataset.typeReady = '';
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        start(entry.target as HTMLElement, order++ * STAGGER);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );
  elements.forEach((element) => observer.observe(element));
  window.addEventListener('beforeprint', typeEverything);
}

init();

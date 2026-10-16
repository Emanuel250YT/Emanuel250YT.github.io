/**
 * Animated cursor for precise pointers (mouse, trackpad).
 *
 * The native cursor is replaced by an element that follows the pointer 1:1 and
 * animates every change: the arrow inverts and shows a square mark over
 * interactive elements, shrinks while pressed, leaves a square pulse where a
 * click lands and spins its mark over busy controls ([aria-busy="true"]).
 * Text fields keep the native I-beam: the custom cursor fades out over them.
 *
 * Touch screens, pens, forced-colors mode and visitors without JavaScript keep
 * the CSS cursor from global.css. With prefers-reduced-motion every change
 * cross-fades instead of scaling (CSS).
 */

const INTERACTIVE =
  'a[href], button:not(:disabled), summary, select, label[for], [role="button"], input[type="checkbox"], input[type="radio"], input[type="submit"]';
const TEXT =
  'input:not([type="checkbox"], [type="radio"], [type="submit"], [type="button"], [type="hidden"]), textarea, [contenteditable="true"]';
const BUSY = '[aria-busy="true"]';
const PULSE_MS = 600;

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const forcedColors = window.matchMedia('(forced-colors: active)');

function createCursor(): HTMLElement {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML =
    '<span class="cursor-body">' +
    '<svg class="cursor-arrow" viewBox="0 0 24 24" width="24" height="24" focusable="false"><path d="M3 3 20 10 12 12 10 20Z"/></svg>' +
    '<span class="cursor-mark"></span>' +
    '</span>';
  document.body.append(cursor);
  return cursor;
}

function pulse(x: number, y: number): void {
  const element = document.createElement('span');
  element.className = 'cursor-pulse';
  element.setAttribute('aria-hidden', 'true');
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  document.body.append(element);
  window.setTimeout(() => element.remove(), PULSE_MS);
}

function initCursor(): void {
  if (!finePointer.matches || forcedColors.matches) return;

  const root = document.documentElement;
  const cursor = createCursor();
  let x = 0;
  let y = 0;
  let target: Element | null = null;
  let frame = 0;

  const render = () => {
    frame = 0;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const isText = Boolean(target?.closest(TEXT));
    cursor.classList.toggle('is-text', isText);
    cursor.classList.toggle('is-link', !isText && Boolean(target?.closest(INTERACTIVE)));
    cursor.classList.toggle('is-busy', Boolean(target?.closest(BUSY)));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const show = (visible: boolean) => {
    cursor.classList.toggle('is-visible', visible);
    root.classList.toggle('has-cursor', visible);
    if (!visible) cursor.classList.remove('is-down');
  };

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') {
        show(false);
        return;
      }
      x = event.clientX;
      y = event.clientY;
      target = event.target as Element;
      if (cursor.classList.contains('is-visible')) {
        schedule();
      } else {
        // Place it before fading in, so it never slides in from the last spot.
        render();
        show(true);
      }
    },
    { passive: true },
  );

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    cursor.classList.add('is-down');
    // Native <select> popups receive no pointer events: hide until the next move.
    if ((event.target as Element).closest('select')) show(false);
  });
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  document.addEventListener('click', (event) => {
    // detail is 0 for clicks triggered from the keyboard.
    if (event.detail > 0 && cursor.classList.contains('is-visible')) pulse(event.clientX, event.clientY);
    // A click can start work (e.g. sending the form): refresh the busy state.
    schedule();
  });

  root.addEventListener('mouseleave', () => show(false));
  window.addEventListener('blur', () => show(false));

  forcedColors.addEventListener('change', () => {
    if (forcedColors.matches) show(false);
  });
}

initCursor();

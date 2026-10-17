/**
 * Images of a src/assets folder keyed by file name without its extension, from an
 * `import.meta.glob(..., { eager: true, import: 'default' })` result. The glob has to stay
 * in the calling module (Vite needs a literal pattern there).
 */
export const byFileName = (modules: Record<string, ImageMetadata>): Record<string, ImageMetadata> =>
  Object.fromEntries(Object.entries(modules).map(([file, image]) => [file.replace(/^.*\/|\.\w+$/g, ''), image]));

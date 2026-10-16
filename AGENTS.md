# AGENTS.md — Portfolio de Emanuel Guzman

Sitio personal de Emanuel Guzman (founder de Cosmos / Cosmos Pay, desarrollador
full stack, Salta, Argentina). Publicado en **https://emanuel250.dev.ar** con
**GitHub Pages** desde el repo `Emanuel250YT/Emanuel250YT.github.io`.

Astro 7 en modo 100 % estático, TypeScript estricto, CSS propio (sin framework
de UI ni de CSS) y casi nada de JavaScript en el cliente. `README.md` explica cómo
usarlo; este archivo es la lista de decisiones que es fácil romper sin querer.
**Copia de `CLAUDE.md` para otros agentes (Codex, etc.): si cambiás uno, cambiá el otro.**

## Comandos

```bash
npm run dev       # servidor de desarrollo (http://localhost:4321)
npm run build     # build estático en dist/
npm run preview   # sirve dist/ tal cual lo publica GitHub Pages
npm run check     # astro check (tipos de .astro y .ts)
npm run verify    # check + build + scripts/verify-seo.mjs  ← correr antes de cada commit
npm run assets    # regenera favicons, imágenes OG y los PDFs del CV (necesita Chrome)
```

## Mapa del código

```
src/
  config/site.ts          identidad: nombre, email, redes, dominio, verificación de buscadores
  i18n/                   es.ts / en.ts (diccionarios tipados), locales.ts (rutas e idiomas)
  data/                   projects.ts, achievements.ts, resume.ts (experiencia, educación, skills)
  lib/                    schema.ts (JSON-LD), format.ts (fechas), cv.ts (rutas del PDF)
  layouts/BaseLayout.astro  <head> completo: SEO, hreflang, OG/Twitter, JSON-LD, iconos
  components/
    sections/             Header, Hero, About, Projects, Achievements, Contact, Footer
    projects/ProjectCover.astro  portadas ilustradas en HTML/CSS (decorativas)
    pages/                HomePage, CvPage: la página real, parametrizada por idioma
    ui/                   Icon (SVG inline), RichHeading (títulos de dos tonos)
  pages/                  envoltorios finos: index, cv, 404 y en/index, en/cv
  styles/global.css       tokens de diseño, reset, botones, utilidades
public/                   CNAME, robots.txt, llms.txt, humans.txt, manifest, iconos, og/, cv/*.pdf
scripts/                  generate-assets.mjs, verify-seo.mjs
.github/                  workflows/deploy.yml (build + verify + Pages), dependabot.yml
```

## 1 · Imports: siempre `@/`

Nunca rutas relativas (`./`, `../`). `@/` apunta a `src/` (tsconfig `paths`, que
Astro/Vite respetan). Vale también para tipos: `import type { Locale } from '@/i18n/locales'`.

## 2 · El contenido tiene una sola fuente de verdad

- **Textos de interfaz** → `src/i18n/es.ts` y `src/i18n/en.ts`. Los dos cumplen la
  interfaz `Dictionary` (`src/i18n/types.ts`): si falta una clave en un idioma,
  `npm run check` falla. No hay texto visible hardcodeado en los componentes.
- **Datos** (proyectos, logros, experiencia, educación, certificaciones, skills) →
  `src/data/*.ts`, con campos `Localized` (`{ es, en }`). La home, el CV, el
  JSON-LD y `llms.txt` salen de ahí: actualizar en un lugar, no en cuatro.
- **Identidad** (nombre, email, redes, dominio) → `src/config/site.ts`.
- **Nada inventado.** Todo dato sale de fuentes reales del dueño (LinkedIn, GitHub,
  cosmospay.lat, posts). Ante la duda, menos precisión (solo el año) antes que una
  fecha falsa. **Nunca** publicar teléfono ni dirección (están en LinkedIn: no copiarlos).
- Si cambia algo del CV: editar `src/data/`, correr `npm run assets` (regenera los
  PDFs en `public/cv/` y `public/en/cv/`) y commitear los PDFs.
- Si cambian proyectos o roles: actualizar también `public/llms.txt`.

## 3 · Idiomas y URLs

- Español en la raíz (`/`, `/cv/`), inglés bajo `/en/` (`/en/`, `/en/cv/`).
  `prefixDefaultLocale: false`.
- **Toda página existe en los dos idiomas.** El patrón: la página real vive en
  `src/components/pages/XPage.astro` y recibe `locale`; `src/pages/x.astro` y
  `src/pages/en/x.astro` solo la renderizan.
- URLs siempre con barra final (`trailingSlash: 'always'`, `build.format: 'directory'`):
  GitHub Pages sirve `/en/` desde `/en/index.html`.
- Los anclajes de sección (`#home`, `#about`, `#projects`, `#achievements`,
  `#contact`) son iguales en los dos idiomas; el Header y el script de sección
  activa dependen de esos ids.
- `hreflang` (`es-AR`, `en`, `x-default` → español) lo emite `BaseLayout`; el
  sitemap lo genera `@astrojs/sitemap` con la misma config de i18n. No duplicarlo a mano.

## 4 · SEO (no negociable)

Cada página indexable tiene, y `scripts/verify-seo.mjs` lo exige:

- `<title>` único de ≤ 65 caracteres con el nombre primero.
- `meta description` única de 120–160 caracteres.
- `canonical` absoluto al dominio, con barra final, igual a la ruta real.
- `hreflang` de los dos idiomas + `x-default`.
- Open Graph completo (`og:image` 1200×630 por idioma en `public/og/`) y Twitter card.
- JSON-LD: un solo `@graph` (de `src/lib/schema.ts`) con `Person`, `Organization`,
  `WebSite`, `ProfilePage` y, en la home, `ItemList` de proyectos. Los `@id` son
  estables (`/#person`, `/#website`, `/#cosmos-pay`…): no cambiarlos.
- Exactamente un `<h1>` y sin saltos de nivel (h2 → h4 está prohibido).
- Imágenes con `alt` y `width`/`height` (las de `astro:assets` ya los traen).

Además:

- Todo el contenido es HTML estático en el build. Nada de contenido renderizado
  solo en el cliente.
- La 404 es `noindex` y queda fuera del sitemap.
- Verificación de Google Search Console / Bing: método **meta tag**, pegando el
  valor en `site.googleSiteVerification` / `site.bingSiteVerification`. No hace
  falta tocar el DNS de dev.ar para eso.
- Las imágenes OG, los favicons y los PDFs se regeneran con `npm run assets`.

## 5 · Accesibilidad (WCAG 2.2 AA, también no negociable)

- **Landmarks**: `header` > `nav` (con `aria-label`), `main#main`, `footer`. Cada
  `section` tiene `aria-labelledby` apuntando a su título.
- **Skip link** como primer elemento enfocable (`.skip-link` → `#main`).
- **Foco visible** en todo lo interactivo (`:focus-visible` global). No quitar un
  outline sin dar un reemplazo igual de visible (ej. tarjetas: `:has(.stretched:focus-visible)`).
- **Contraste**: ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande (≥ 24 px) y
  bordes de UI. `--muted` (#858585) es **solo** para palabras de títulos grandes;
  para texto chico usar `--ink-soft` (#555). El texto dentro de ilustraciones
  decorativas también cuenta (axe lo mide aunque esté en `aria-hidden`).
- **Nombre accesible = texto visible** (2.5.3): no pisar con `aria-label` un enlace
  que tiene texto; sumar contexto con `.visually-hidden` (ej. selector de idioma).
- **Enlaces externos** con `target="_blank"`: siempre `rel="noopener"` y el aviso
  `t.a11y.newTab` en `.visually-hidden`.
- **Imágenes**: informativas con `alt` descriptivo; decorativas con `alt=""`; SVG
  decorativos con `aria-hidden="true"` (lo hace `Icon` si no recibe `label`).
- **Tarjetas clicables**: patrón *stretched link* (el `<a>` está en el `h3` y su
  `::after` cubre la tarjeta). No meter contenido interactivo dentro de un `<a>`.
- **Regiones con scroll horizontal** (rail de logros): `tabindex="0"`,
  `role="region"` y `aria-label`. Si se puede, evitar el scroll horizontal (el
  código del editor usa `pre-wrap` por eso).
- **Menú móvil**: `aria-expanded` + `aria-controls`, Escape lo cierra y devuelve el
  foco al botón; sin JS el menú queda visible (`<noscript>`).
- **Tamaño de objetivo** ≥ 24 px; botones y enlaces principales ≥ 44 px de alto.
- **Movimiento**: todo respeta `prefers-reduced-motion` (regla global en `global.css`).
- **Idioma**: `<html lang>` correcto por página; un fragmento en otro idioma lleva `lang`.

## 6 · Diseño

Basado en el diseño de referencia (portfolio monocromo): hero con cuadrícula,
insignia con cursor estilo Figma, títulos de dos tonos, sección oscura "Construyendo
con claridad e intención", grilla de 6 proyectos, rail de logros con bordes
difuminados, CTA con terminal y footer negro con halo de luz.

- **Tokens** en `:root` de `global.css` (colores, tipografía, contenedor, radios,
  sombras, easing). Los componentes usan tokens; los únicos colores sueltos están
  en `ProjectCover.astro` (ilustraciones).
- **Tipografía**: Space Grotesk Variable autoalojada (`@fontsource-variable`), con
  preload del subset latino. Monoespaciada del sistema para código.
- **Títulos de dos tonos**: siempre con `RichHeading` y un `RichText` en el
  diccionario (`{ text, muted }` y `{ br: true }`; el corte solo aplica en escritorio).
- **Botones**: `.btn` + `.btn--frame` (contorno con esquinas, como el diseño) o
  `.btn--solid` (negro).
- **Estilos con scope y componentes hijos**: Astro no pasa el scope del padre a
  lo que renderiza un componente hijo (`RichHeading`, `Icon`, `<Image>`). Para
  estilizarlos desde la sección usar `.seccion :global(.clase)`. (El h1 salió
  diminuto por esto: no repetirlo.)
- **Azul de marca Cosmos** (`--cosmic` #000877, `--navy`) solo en ilustraciones; la
  interfaz es blanco y negro.
- **Responsive**: contenedor de 1200 px + `--gutter` fluido; menú hamburguesa
  < 860 px; grilla de proyectos 3 → 2 (≤ 960) → 1 (≤ 600); stats en lista ≤ 480.
  Probar en 1440, 390 y 320 px.
- **JS**: solo el script del Header (menú + sección activa). Antes de sumar JS,
  preguntarse si se puede con HTML/CSS. Nada de frameworks de UI.

## 7 · Rendimiento

- Línea de base: **Lighthouse 100/100/100/100** (mobile y desktop) en `/`, `/en/` y `/cv/`.
- El LCP es la foto del hero: `loading="eager"` + `fetchpriority="high"`, servida
  por `astro:assets` en WebP con `srcset`. Cambiar la foto = reemplazar
  `src/assets/emanuel.jpg` (idealmente ≥ 900 px de lado) y correr `npm run assets`.
- CLS 0: toda imagen con dimensiones; las portadas usan `aspect-ratio`.
- Sin scripts de terceros ni trackers. Si se agrega analítica: sin cookies,
  asíncrona y declarada en el README.

## 8 · Deploy y dominio (dev.ar → GitHub Pages)

- El workflow `.github/workflows/deploy.yml` corre `npm ci`, `npm audit
  signatures`, `npm audit`, `astro check`, `build` y `verify-seo.mjs` en cada PR
  y push; en `main` además publica `dist/` en Pages (fuente: **GitHub Actions**).
- **Dominio**: `emanuel250.dev.ar`, administrado en https://home.dev.ar (Pragmore).
  - Campo **DNS**: `emanuel250yt.github.io` → crea un CNAME. Sin `https://`, sin
    barras, sin rutas.
  - Campo **Redirección**: vacío. dev.ar admite **una sola** configuración activa
    (Redirección **o** DNS); para cambiar, primero vaciar la actual.
  - No se usan servidores NS. La propagación puede tardar hasta 48 h.
  - Registros TXT (p. ej. verificar el dominio en GitHub): solo pidiéndolos por
    mail a albo@pragmore.com con TYPE, NAME y CONTENT. Lo hace el dueño, no un agente.
- `public/CNAME` contiene `emanuel250.dev.ar` y **debe coincidir** con `site` en
  `astro.config.mjs`, `site.url` en `src/config/site.ts`, `robots.txt`, `llms.txt`
  y `SITE` en `scripts/verify-seo.mjs`. Para cambiar de dominio, cambiar todos y
  regenerar los assets.
- Con el DNS propagado: Settings → Pages → **Enforce HTTPS**.

## 9 · Supply chain

- Dependencias con versión exacta (`save-exact`) y publicadas hace ≥ 7 días.
- `.npmrc` con `ignore-scripts=true`: ninguna dependencia ejecuta scripts al instalar.
- Acciones de GitHub fijadas por SHA con el tag en comentario; Dependabot con
  `cooldown` de 7 días las actualiza.
- CI corre `npm audit signatures` y `npm audit --omit=dev`.

## 10 · Antes de dar algo por terminado

1. `npm run verify` sin errores (tipos, build, SEO/a11y estático).
2. Revisión visual en 1440, 390 y 320 px. Chrome no achica la ventana por debajo de
   ~500 px: para móvil, cargar el sitio dentro de `<iframe>` de 390/320 px.
3. Lighthouse mobile en `/`, `/en/` y `/cv/`, todo en 100:
   `npx lighthouse@13.5.0 http://127.0.0.1:4321/ --form-factor=mobile` (con `npm run preview`).
4. Si cambió el CV o la identidad: `npm run assets` y commitear `public/`.
5. Nada de datos privados (teléfono, dirección) ni datos sin fuente.

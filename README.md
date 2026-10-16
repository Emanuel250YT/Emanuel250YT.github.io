# emanuel250.dev.ar

Portfolio de **Emanuel Guzman**, founder de [Cosmos Pay](https://cosmospay.lat) y
desarrollador full stack en Salta, Argentina.

- Sitio: **https://emanuel250.dev.ar** (español) · **https://emanuel250.dev.ar/en/** (English)
- CV: [/cv/](https://emanuel250.dev.ar/cv/) · [PDF](https://emanuel250.dev.ar/cv/emanuel-guzman-cv.pdf)

Hecho con [Astro](https://astro.build) como sitio 100 % estático y publicado con
GitHub Pages. Sin frameworks de UI ni de CSS, casi sin JavaScript, bilingüe
(es/en) y con SEO y accesibilidad verificados en CI.

| Lighthouse (mobile) | `/` | `/en/` | `/cv/` |
| --- | --- | --- | --- |
| Performance · Accesibilidad · Buenas prácticas · SEO | 100 · 100 · 100 · 100 | 100 · 100 · 100 · 100 | 100 · 100 · 100 · 100 |

## Desarrollo

Requiere Node ≥ 22.12 (CI usa la versión de `.nvmrc`).

```bash
npm ci            # instala exactamente lo del lockfile (sin scripts de instalación)
npm run dev       # http://localhost:4321
npm run verify    # tipos + build + verificación de SEO/accesibilidad
npm run preview   # sirve dist/ como en producción
npm run assets    # regenera favicons, imágenes Open Graph y PDFs del CV (necesita Chrome)
```

## Cómo editar el contenido

| Quiero cambiar… | Archivo |
| --- | --- |
| Textos de la interfaz (es / en) | `src/i18n/es.ts`, `src/i18n/en.ts` |
| Proyectos | `src/data/projects.ts` |
| Logros | `src/data/achievements.ts` |
| Experiencia, educación, certificaciones, skills | `src/data/resume.ts` |
| Nombre, email, redes, dominio, verificación de Google/Bing | `src/config/site.ts` |
| Foto | `src/assets/emanuel.jpg` (cuadrada, idealmente ≥ 900 px) |

Después de cambiar el CV, la foto o la identidad: `npm run assets` y commitear
`public/` (PDFs, imágenes OG e iconos). Si cambian proyectos o roles, actualizar
también `public/llms.txt`.

Las reglas de diseño, accesibilidad y SEO están en [`CLAUDE.md`](./CLAUDE.md).

## Publicación (GitHub Pages + dev.ar)

Cada push a `main` corre `.github/workflows/deploy.yml`: instala, audita, verifica
tipos, construye, valida SEO/accesibilidad y publica `dist/` en GitHub Pages.

### 1 · GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Custom domain:** `emanuel250.dev.ar` (el archivo `public/CNAME` ya lo declara).

### 2 · dev.ar (https://home.dev.ar)

En el panel de `emanuel250.dev.ar`:

| Campo | Valor |
| --- | --- |
| **Redirección** | *(vacío)* |
| **DNS** | `emanuel250yt.github.io` |

- En **DNS** va solo el dominio: **sin** `https://`, **sin** barras ni rutas. dev.ar
  crea un registro **CNAME** hacia GitHub Pages.
- Solo puede haber **una** configuración activa: Redirección **o** DNS. Si la
  redirección tuviera algo, primero vaciarla.
- No hay que tocar servidores NS. La propagación puede tardar hasta **48 h**.

Comprobar la propagación:

```bash
nslookup -type=CNAME emanuel250.dev.ar   # debe responder emanuel250yt.github.io
```

### 3 · HTTPS

Cuando el DNS propague, GitHub emite el certificado solo. Después: **Settings →
Pages → Enforce HTTPS**.

### Opcional

- **Verificar el dominio en GitHub** (protege contra que otro repo lo tome):
  Settings de la cuenta → Pages → *Add a domain*. GitHub pide un registro TXT
  `_github-pages-challenge-Emanuel250YT.emanuel250.dev.ar`; en dev.ar los TXT se
  piden por mail a albo@pragmore.com indicando TYPE, NAME y CONTENT.
- **Google Search Console / Bing Webmaster Tools**: usar el método *meta tag* y
  pegar el valor en `src/config/site.ts` (no requiere DNS). Después, enviar
  `https://emanuel250.dev.ar/sitemap-index.xml`.

## SEO incluido

- HTML estático, un `<h1>` por página, jerarquía de encabezados validada.
- `title`, `description` y `canonical` únicos por página; `hreflang` es-AR / en / x-default.
- Open Graph y Twitter Card con imágenes 1200×630 por idioma.
- JSON-LD (`Person`, `Organization`, `WebSite`, `ProfilePage`, `BreadcrumbList`,
  `ItemList` de proyectos).
- `sitemap-index.xml` con alternates de idioma, `robots.txt`, `llms.txt`, `humans.txt`,
  manifest e iconos.
- Fuente autoalojada con preload, imágenes WebP responsivas con dimensiones (CLS 0).

## Seguridad de dependencias

Versiones exactas y con ≥ 7 días publicadas, `ignore-scripts=true`, acciones de
GitHub fijadas por SHA, Dependabot con cooldown y `npm audit signatures` en CI.

# emanuel250.dev.ar

Portfolio of **Emanuel Guzman**, founder of [Cosmos Pay](https://cosmospay.lat)
and full stack developer from Salta, Argentina.

- Site: **https://emanuel250.dev.ar** — available in Español, English, Português,
  Français, Deutsch, 中文 and हिन्दी (`/`, `/en/`, `/pt/`, `/fr/`, `/de/`, `/zh/`, `/hi/`)
- CV: [/en/cv/](https://emanuel250.dev.ar/en/cv/) · [PDF](https://emanuel250.dev.ar/en/cv/emanuel-guzman-cv.pdf)
  (one HTML page and one PDF per language)

Built with [Astro](https://astro.build) as a fully static site and published with
GitHub Pages. No UI or CSS framework, almost no JavaScript, seven languages, and
SEO + accessibility checks in CI.

| Lighthouse (mobile) | `/` | `/zh/` | `/hi/` | `/fr/cv/` |
| --- | --- | --- | --- | --- |
| Performance · Accessibility · Best practices · SEO | 100 · 100 · 100 · 100 | 99 · 100 · 100 · 100 | 98 · 100 · 100 · 100 | 100 · 100 · 100 · 100 |

## Development

Requires Node ≥ 22.12 (CI uses the version in `.nvmrc`).

```bash
npm ci            # installs exactly what the lockfile says (no install scripts)
npm run dev       # http://localhost:4321
npm run verify    # types + build + static SEO/accessibility checks
npm run preview   # serves dist/ as production does
npm run assets    # regenerates portraits, icons, Open Graph images and CV PDFs (needs Chrome)
```

## Editing content

| To change… | Edit |
| --- | --- |
| Interface copy (per language) | `src/i18n/<locale>.ts` (`es`, `en`, `pt`, `fr`, `de`, `zh`, `hi`) |
| Projects | `src/data/projects.ts` |
| Achievements | `src/data/achievements.ts` |
| Experience, education, certifications, skills | `src/data/resume.ts` |
| Name, email, socials, domain, Google/Bing verification | `src/config/site.ts` |
| Portrait | `assets-src/portrait.png` (colour cut-out with transparent background) |

Every translatable field is typed as `Record<Locale, …>`, so `npm run check` fails
if a language is missing. After changing the CV, the portrait or the identity, run
`npm run assets` and commit `public/` and `src/assets/` (the portrait is converted to
black & white automatically). If projects or roles change, update `public/llms.txt` too.

Design, accessibility, SEO and i18n rules live in [`CLAUDE.md`](./CLAUDE.md).

## Language switcher

A native `<details>` dropdown with flags (Argentina for Spanish, Brazil for
Portuguese, United States for English, France, Germany, China and India) and one
real link per language. It works without JavaScript; with it, Escape, arrow keys
and click-outside behave like a regular menu. Every page declares its translations
with `hreflang` (plus `x-default` → English), and the sitemap carries the same alternates.

## Publishing (GitHub Pages + dev.ar)

Every push to `main` runs `.github/workflows/deploy.yml`: install, audit, type
check, build, SEO/accessibility checks, and publish `dist/` to GitHub Pages.

### 1 · GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Custom domain:** `emanuel250.dev.ar` (already declared by `public/CNAME`).
3. **Settings → Environments → github-pages:** the `main` branch must be allowed to deploy.

### 2 · dev.ar (https://home.dev.ar)

In the `emanuel250.dev.ar` panel:

| Field | Value |
| --- | --- |
| **Redirección** (redirect) | *(empty)* |
| **DNS** | `emanuel250yt.github.io` |

- The **DNS** field takes only the domain: **no** `https://`, **no** slashes or paths.
  dev.ar creates a **CNAME** record pointing to GitHub Pages.
- Only **one** setting can be active: redirect **or** DNS. Clear the redirect first if it has a value.
- No NS records are involved. Propagation can take up to **48 h**.

Check propagation:

```bash
nslookup -type=CNAME emanuel250.dev.ar   # should answer emanuel250yt.github.io
```

### 3 · HTTPS

Once DNS resolves, GitHub issues the certificate automatically. Then: **Settings →
Pages → Enforce HTTPS**.

### Optional

- **Verify the domain on GitHub** (prevents another repository from claiming it):
  account Settings → Pages → *Add a domain*. GitHub asks for a TXT record
  `_github-pages-challenge-Emanuel250YT.emanuel250.dev.ar`; on dev.ar, TXT records are
  requested by email to albo@pragmore.com with TYPE, NAME and CONTENT.
- **Google Search Console / Bing Webmaster Tools**: use the *meta tag* method and paste
  the value into `src/config/site.ts` (no DNS needed). Then submit
  `https://emanuel250.dev.ar/sitemap-index.xml`.

## SEO included

- Static HTML, one `<h1>` per page, validated heading hierarchy.
- Unique `title`, `description` and `canonical` per page and language; `hreflang`
  for all seven languages + `x-default`.
- Open Graph and Twitter cards with a 1200×630 image per language.
- JSON-LD (`Person`, `Organization`, `WebSite`, `ProfilePage`, `BreadcrumbList`,
  `ItemList` of projects).
- `sitemap-index.xml` with language alternates, `robots.txt`, `llms.txt`, `humans.txt`,
  web manifest and icons.
- Self-hosted font with preload (system fonts for Chinese and Devanagari),
  responsive WebP images with dimensions (CLS 0).

## Dependency security

Exact versions published at least 7 days ago, `ignore-scripts=true`, GitHub Actions
pinned by SHA, Dependabot with a cooldown, and `npm audit signatures` in CI.

# emanuel250.dev.ar

Portfolio of **Emanuel Guzman** — full stack developer, product manager and founder of
[Cosmos Pay](https://cosmospay.lat), from Salta, Argentina.

- Site: **https://emanuel250.dev.ar** — in Español, English, Português, Français,
  Deutsch, 中文 and हिन्दी (`/`, `/en/`, `/pt/`, `/fr/`, `/de/`, `/zh/`, `/hi/`)
- CV: [/en/cv/](https://emanuel250.dev.ar/en/cv/) · [PDF](https://emanuel250.dev.ar/en/cv/emanuel-guzman-cv.pdf)
  (one HTML page and one PDF per language)

Built with [Astro](https://astro.build) as a fully static site on GitHub Pages and
designed to turn visitors into leads: services with their own calls to action, a
clear process, proof (projects and achievements) and a short contact form. No UI or
CSS framework, seven languages, motion that respects reduced-motion preferences, and
SEO + accessibility checks in CI.

| Lighthouse (mobile) | `/` | `/zh/` | `/hi/` | `/en/cv/` | `/privacy/` |
| --- | --- | --- | --- | --- | --- |
| Performance · Accessibility · Best practices · SEO | 99 · 100 · 100 · 100 | 99 · 100 · 100 · 100 | 98 · 100 · 100 · 100 | 100 · 100 · 100 · 100 | 100 · 100 · 100 · 100 |

## Development

Requires Node ≥ 22.12 (CI uses the version in `.nvmrc`).

```bash
npm ci            # installs exactly what the lockfile says (no install scripts)
npm run dev       # http://localhost:4321
npm run verify    # types + build + static SEO/accessibility checks
npm run preview   # serves dist/ as production does
npm run assets    # regenerates portraits, icons, Open Graph images and CV PDFs (needs Chrome)
```

## Page structure

Hero (rotating roles, primary CTA) → About → Services (4, each with its own CTA that
preselects the service in the form) → Process (4 steps) → Projects → Achievements and
ecosystems → Contact (form + what happens next + direct channels) → Footer.

## Editing content

| To change… | Edit |
| --- | --- |
| Interface copy (per language) | `src/i18n/<locale>.ts` (`es`, `en`, `pt`, `fr`, `de`, `zh`, `hi`) |
| Rotating roles in the hero | `hero.roles` in each dictionary |
| Services | `src/data/services.ts` |
| Projects / achievements | `src/data/projects.ts`, `src/data/achievements.ts` |
| Experience, education, certifications, skills | `src/data/resume.ts` |
| Form options (budget ranges, extra services), ecosystems strip | `src/data/contact.ts` |
| Name, email, socials, domain, form endpoint, GA4, search-console tokens | `src/config/site.ts` |
| Portrait | `assets-src/portrait.png` (colour cut-out, transparent background) |

Every translatable field is typed as `Record<Locale, …>`, so `npm run check` fails if a
language is missing. After changing the CV, the portrait or the identity, run
`npm run assets` and commit `public/` and `src/assets/`. Rules for design,
accessibility, SEO, motion, i18n and analytics live in [`CLAUDE.md`](./CLAUDE.md).

## Owner setup (one-time)

### 1 · Activate the contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards every message to
`emanuel@cloudycoding.com` (`site.contactForm` in `src/config/site.ts`).

1. Send one test message from the live site.
2. Open the activation email FormSubmit sends to that inbox and click **Activate Form**.
3. Optional: replace the email in both URLs of `site.contactForm` with the random alias
   FormSubmit shows after activation (hides the address from scrapers).

### 2 · Google Analytics 4

1. In [analytics.google.com](https://analytics.google.com) create a property and a
   **Web** data stream for `https://emanuel250.dev.ar`.
2. Copy the **Measurement ID** (`G-…`) into `site.googleAnalyticsId` and push. The
   consent banner appears automatically; GA4 only loads after a visitor accepts.
3. In GA4 → Admin → Events, mark **`generate_lead`** as a key event (conversion).
   Other events sent: `cta_click`, `select_service`, `contact_click`, `cv_download`.

### 3 · Google Search Console (and Bing)

1. Add the URL-prefix property `https://emanuel250.dev.ar/` and choose the **HTML tag**
   method. Paste only the `content` value into `site.googleSiteVerification` and push.
2. After verifying, submit `https://emanuel250.dev.ar/sitemap-index.xml`.
3. Optional: link Search Console with GA4 (Admin → Product links).
4. Bing Webmaster Tools: same idea with `site.bingSiteVerification` (or import from Search Console).

## Publishing (GitHub Pages + dev.ar)

Every push to `main` runs `.github/workflows/deploy.yml`: install, audit, type check,
build, SEO/accessibility checks, and publish `dist/` to GitHub Pages.

- **GitHub Pages**: Settings → Pages → Source **GitHub Actions**, custom domain
  `emanuel250.dev.ar` (declared by `public/CNAME`), **Enforce HTTPS** on. Settings →
  Environments → `github-pages` must allow the `main` branch.
- **dev.ar** (https://home.dev.ar): **DNS** = `emanuel250yt.github.io` (no `https://`,
  no slashes), **Redirección** empty — only one of them can be active. Propagation can
  take up to 48 h; check with `nslookup -type=CNAME emanuel250.dev.ar`.
- **Optional domain verification on GitHub**: GitHub asks for a TXT record
  `_github-pages-challenge-Emanuel250YT.emanuel250.dev.ar`; on dev.ar, TXT records are
  requested by email to albo@pragmore.com with TYPE, NAME and CONTENT.

## SEO included

- Static HTML, one `<h1>` per page, validated heading hierarchy, labelled form controls.
- Unique `title`, `description` and `canonical` per page and language; `hreflang` for
  all seven languages + `x-default`.
- Open Graph and Twitter cards with a 1200×630 image per language.
- JSON-LD: `Person` (with contact point and offers), `Organization`, `WebSite`,
  `ProfilePage`, `BreadcrumbList`, `ItemList` of projects, `OfferCatalog` of services.
- `sitemap-index.xml` with language alternates and `lastmod`, `robots.txt`, `llms.txt`,
  `humans.txt`, web manifest, icons and a privacy policy per language.

## Dependency security

Exact versions, `ignore-scripts=true`, GitHub Actions pinned by SHA, Dependabot with a
7-day cooldown, and `npm audit signatures` in CI.

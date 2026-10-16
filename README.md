# emanuel250.dev.ar

Portfolio of **Emanuel Guzman**: full stack developer, product manager and founder of
[Cosmos Pay](https://cosmospay.lat), from Salta, Argentina.

- Site: **https://emanuel250.dev.ar**, in Español, English, Português, Français,
  Deutsch, 中文 and हिन्दी (`/`, `/en/`, `/pt/`, `/fr/`, `/de/`, `/zh/`, `/hi/`)
- CV: [PDF](https://emanuel250.dev.ar/cv/emanuel-guzman-cv.pdf) (`/<locale>/cv/emanuel-guzman-cv.pdf`
  per language), uploaded by hand at stable URLs that other sites can link to or fetch

Built with [Astro](https://astro.build) as a fully static site on GitHub Pages and
designed to turn visitors into leads: services with their own calls to action, a
clear process, proof (projects and achievements) and a short contact form. No UI or
CSS framework, seven languages, typed headings and count-up numbers, motion that respects
reduced-motion preferences, and
SEO + accessibility checks in CI.

| Lighthouse (mobile) | `/` | `/zh/` | `/hi/` | `/privacy/` |
| --- | --- | --- | --- | --- |
| Performance · Accessibility · Best practices · SEO | 99-100 · 100 · 100 · 100 | 95-97 · 100 · 100 · 100 | 93-98 · 100 · 100 · 100 | 100 · 100 · 100 · 100 |

Lab runs with Lighthouse 13.5.0 and the Chrome flags listed in `CLAUDE.md` §15 (without
them, headless Chrome on Windows inflates the score). Desktop: 100 on every page.

## Development

Requires Node ≥ 22.12 (CI uses the version in `.nvmrc`).

```bash
npm ci            # installs exactly what the lockfile says (no install scripts)
npm run dev       # http://localhost:4321
npm run verify    # types + build + static SEO/accessibility checks
npm run preview   # serves dist/ as production does
npm run assets    # regenerates portraits, icons and Open Graph images (needs Chrome)
```

## Page structure

Hero (typed rotating roles, primary CTA) → About → Services (4, each with its own CTA that
preselects the service in the form) → Process (4 steps) → Projects → Achievements and
ecosystems → Contact (form by email or WhatsApp + what happens next + direct channels) →
Footer. Every page has floating WhatsApp and back-to-top buttons at the bottom right.

## Editing content

| To change… | Edit |
| --- | --- |
| Interface copy (per language) | `src/i18n/<locale>.ts` (`es`, `en`, `pt`, `fr`, `de`, `zh`, `hi`) |
| Rotating roles in the hero | `hero.roles` in each dictionary |
| Services | `src/data/services.ts` |
| Projects / achievements | `src/data/projects.ts`, `src/data/achievements.ts` |
| Work experience (About section + JSON-LD) | `src/data/experience.json` |
| Education, certifications, skills (JSON-LD) | `src/data/resume.ts` |
| npm packages and organisations counted in the downloads stat | `src/data/npm.ts` |
| CV PDF | upload `public/cv/emanuel-guzman-cv.pdf` (required) and, optionally, `public/<locale>/cv/emanuel-guzman-cv.pdf` |
| Form options (budget ranges, extra services), ecosystems strip | `src/data/contact.ts` |
| Name, email, WhatsApp, socials, domain, form endpoint, GA4, search-console tokens | `src/config/site.ts` |
| Portrait | `assets-src/portrait.png` (colour cut-out, transparent background) |

Every translatable field is typed as `Record<Locale, …>`, so `npm run check` fails if a
language is missing. After changing the portrait or the identity, run
`npm run assets` and commit `public/` and `src/assets/`. The CV PDFs are never
generated: replace the files above (a language without its own PDF links to the
Spanish one). Rules for design,
accessibility, SEO, motion, i18n and analytics live in [`CLAUDE.md`](./CLAUDE.md).

## Owner setup (one-time)

### 1 · Activate the contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards every message to
`emanuel@cloudycoding.com` (`site.contactForm` in `src/config/site.ts`).

1. Send one test message from the live site.
2. Open the activation email FormSubmit sends to that inbox and click **Activate Form**.
3. Optional: replace the email in both URLs of `site.contactForm` with the random alias
   FormSubmit shows after activation (hides the address from scrapers).

### 2 · Google Analytics 4 and Google Tag Manager

Already configured in `src/config/site.ts`: GA4 `G-GJVKXV08PC` and GTM `GTM-5BT3SKXR`.
Both load only after a visitor accepts analytics cookies.

1. In GA4 → Admin → Events, mark **`generate_lead`** as a key event (conversion) once
   it appears; its `method` parameter says whether the lead came by `email` or
   `whatsapp` (the WhatsApp one fires when the chat opens with the message ready).
   Other events sent: `cta_click`, `select_service`, `contact_click` (with `method`),
   `cv_download`.
2. In GTM, **do not add a Google tag / GA4 tag for `G-GJVKXV08PC`**: GA4 is already
   loaded directly and would count everything twice. Use GTM for other tags; the events
   above arrive in the `dataLayer` as `{ event: "<name>", ...params }` to use as triggers.

### 3 · Google Search Console (and Bing)

1. The URL-prefix property `https://emanuel250.dev.ar/` is verified with the HTML file
   `public/google4180448db7220be0.html`, served at the site root. Never delete it.
2. After verifying, submit `https://emanuel250.dev.ar/sitemap-index.xml`.
3. Optional: link Search Console with GA4 (Admin → Product links).
4. Bing Webmaster Tools: same idea with `site.bingSiteVerification` (or import from Search Console).

## Publishing (GitHub Pages + dev.ar)

Every push to `main` runs `.github/workflows/deploy.yml`: install, audit, type check,
build, SEO/accessibility checks, and publish `dist/` to GitHub Pages. It also runs once a
day, so the npm download count baked into the HTML stays current.

- **GitHub Pages**: Settings → Pages → Source **GitHub Actions**, custom domain
  `emanuel250.dev.ar` (declared by `public/CNAME`), **Enforce HTTPS** on. Settings →
  Environments → `github-pages` must allow the `main` branch.
- **dev.ar** (https://home.dev.ar): **DNS** = `emanuel250yt.github.io` (no `https://`,
  no slashes), **Redirección** empty: only one of them can be active. Propagation can
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

# Emanuel Guzman's portfolio — working rules

Personal site of Emanuel Guzman (full stack developer, product manager, founder of
Cosmos / Cosmos Pay, Salta, Argentina). Published at **https://emanuel250.dev.ar**
with **GitHub Pages** from `Emanuel250YT/Emanuel250YT.github.io`, in **7 languages**.
Its job is to **convert visitors into leads** (contact form) while staying fast,
accessible and SEO-complete.

Astro 7, 100 % static output, strict TypeScript, hand-written CSS (no UI or CSS
framework) and a few small client scripts. `README.md` explains how to use the
project; this file lists the decisions that are easy to break by accident.
**`AGENTS.md` mirrors this file: when you change one, change the other.**

## Commands

```bash
npm run dev       # dev server (http://localhost:4321)
npm run build     # static build into dist/
npm run preview   # serves dist/ exactly as GitHub Pages will
npm run check     # astro check (types in .astro and .ts files)
npm run verify    # check + build + scripts/verify-seo.mjs  <- run before every commit
npm run assets    # regenerates portraits, icons, OG images and CV PDFs (needs Chrome)
```

## Code map

```
assets-src/portrait.png   colour cut-out photo (source of truth for every portrait)
src/
  config/site.ts          identity, contact form endpoint, GA4 ID, search-engine verification
  i18n/                   locales.ts (languages, URLs, flags), types.ts (Dictionary), one file per locale
  data/                   services.ts, projects.ts, achievements.ts, resume.ts, contact.ts (form values, ecosystems)
  lib/                    schema.ts (JSON-LD), format.ts (dates), cv.ts (PDF paths)
  scripts/                motion.ts (reveal + count-up), analytics.ts (consent + GA4 events)
  layouts/BaseLayout.astro  full <head>, js flag, header/footer, consent banner, motion script
  components/
    sections/             Header, Hero, About, Services, Process, Projects, Achievements, Contact, Footer
    contact/ContactForm.astro    the lead form (validation, AJAX, no-JS fallback)
    analytics/ConsentBanner.astro GA4 consent banner (rendered only when an ID is set)
    projects/ProjectCover.astro  HTML/CSS illustrated covers (decorative)
    pages/                HomePage, CvPage, PrivacyPage: real pages, parameterised by locale
    ui/                   Icon, Flag, LanguageSwitcher, RichHeading, SectionHeader
  pages/                  index, cv, privacy, 404 (default locale) and [lang]/{index,cv,privacy}
  styles/global.css       tokens, reset, buttons, motion, cursor, per-script typography
public/                   CNAME, robots.txt, llms.txt, humans.txt, manifest, icons, cursors/, og/, [locale/]cv/*.pdf
scripts/                  generate-assets.mjs, verify-seo.mjs
.github/                  workflows/deploy.yml (build + verify + Pages), dependabot.yml
```

## 1 · Everything technical is in English

Code, identifiers, comments, log/CLI/error messages, scripts, CI/CD workflow and
step names, commit messages, PR descriptions, README and this file: **English
only**. Other languages appear **only as end-user content**: the dictionaries in
`src/i18n/<locale>.ts`, the localized fields in `src/data/`, and the localized
copy of the OG cards in `scripts/generate-assets.mjs`.

## 2 · Imports: always `@/`

Never relative paths (`./`, `../`). `@/` points to `src/` (tsconfig `paths`,
honoured by Astro/Vite). Type imports too: `import type { Locale } from '@/i18n/locales'`.

## 3 · Content has a single source of truth

- **UI copy** lives in `src/i18n/<locale>.ts`. Every file implements the
  `Dictionary` interface (`src/i18n/types.ts`): a key missing in any language makes
  `npm run check` fail. Components never hard-code visible text, including the
  words drawn inside the project covers (`projects.cover`).
- **Data** (services, projects, achievements, experience, education, certifications,
  skills) lives in `src/data/*.ts` as `Localized` fields (`Record<Locale, T>`), so every
  translation is mandatory. The home page, the CV, the JSON-LD and `llms.txt` derive
  from it: update it once.
- **Identity and integrations** (name, email, socials, domain, form endpoint, GA4 ID,
  verification tokens) live in `src/config/site.ts`.
- **Nothing made up.** Facts come from the owner's real sources (LinkedIn, GitHub,
  cosmospay.lat, posts). When unsure, prefer less precision (year only) over a false
  date. **Never** publish the phone number or the home address. Commitments in the
  copy (48 h reply, 30-minute call, written proposal, weekly deliveries) were approved
  as marketing promises: change them only together with the owner.
- The hero badge never shows a single fixed title: `hero.roles` rotates (full stack
  developer, product manager, blockchain developer, founder, CEO). Do not put
  "Founder of Cosmos Pay" back as the main title; it lives in the description.
- After changing CV data: `npm run assets` (regenerates the 7 PDFs) and commit `public/`.
- After changing services, projects or roles: update `public/llms.txt` as well.

## 4 · Page structure and conversion

Home sections, in this order (the number feeds the `01 —` eyebrow):
**Hero → 01 About → 02 Services → 03 Process → 04 Projects → 05 Achievements → 06 Contact**.
About stays right after the hero because the cut-out portrait "stands" on its dark band.

- Every section ends with (or contains) a call to action to `#contact`; the header
  always shows the "Let's talk" button.
- Service cards link to `#contact` with `data-service="<id>"`: the form preselects that
  service. Keep `ServiceId` and the form's `data-service-id` in sync.
- The contact section pairs the form with "what happens next" (3 steps) and direct
  channels (email, LinkedIn, CV) to reduce friction.
- Keep the form short: name, email, service and message are required; company,
  website and budget are optional. Do not add required fields without a reason.

## 5 · Contact form

- Backend: **FormSubmit** (`site.contactForm`). The first submission ever sends an
  activation email to the address in the URL; until the owner clicks it, nothing is
  delivered. After activation the address can be replaced by FormSubmit's alias.
- With JavaScript: inline validation (`aria-invalid`, messages linked through
  `aria-describedby`, focus on the first invalid field), JSON POST to the AJAX
  endpoint, in-place success panel that receives focus, error message with a
  mailto fallback, `generate_lead` analytics event.
- Without JavaScript: native validation and a classic POST; FormSubmit redirects to
  `#contact-sent`, where a `:target` success panel appears.
- Spam: `_honey` honeypot (hidden off-screen, `tabindex="-1"`). Values sent for
  service/budget are English constants (`src/data/contact.ts`, `formValue`) so every
  inquiry reads the same whatever the visitor's language; `language` carries the locale.
- Never submit the real form while testing: stub `window.fetch` in the page instead.

## 6 · Analytics and consent

- GA4 loads **only after the visitor accepts** (consent "basic" mode). The banner
  renders only when `site.googleAnalyticsId` is set; reject and accept weigh the same;
  the choice lives in `localStorage` (`consent.analytics`); "Cookie preferences" in the
  footer reopens it. Declining removes `_ga*` cookies.
- Events: `cta_click` (with `location`), `select_service`, `contact_click`,
  `cv_download`, `generate_lead`. Add events declaratively with
  `data-track="<event>" data-track-<param>="<value>"`, or dispatch
  `new CustomEvent('analytics:event', { detail: { name, params } })`.
- Mark `generate_lead` as a key event (conversion) in GA4.
- The privacy page (`/privacy/` per locale) documents the form processor and GA4.
  Update it (and its `UPDATED` date) whenever data handling changes.

## 7 · Languages and URLs

- Locales: `es` (default, served at `/`), `en`, `pt`, `fr`, `de`, `zh`, `hi`
  (served at `/<locale>/`). Defined in `src/i18n/locales.ts`; also listed in
  `astro.config.mjs`, `scripts/generate-assets.mjs` and `scripts/verify-seo.mjs`
  (plain JS cannot import TS) — keep the four in sync.
- `localeMeta` holds, per locale: `htmlLang`, `hreflang`, `ogLocale`, `dateLocale`,
  `nativeName`, `short` and `flag` (es → Argentina, pt → Brazil, en → United States,
  fr, de, zh → China, hi → India).
- **Every page exists in every language**: the real page lives in
  `src/components/pages/XPage.astro`; `src/pages/x.astro` renders it for `es` and
  `src/pages/[lang]/x.astro` generates the rest with `getStaticPaths`.
- URLs always end with a slash. Section anchors (`#home`, `#about`, `#services`,
  `#process`, `#projects`, `#achievements`, `#contact`) are identical in every language.
- `hreflang` for all 7 locales plus `x-default` (→ English) comes from `BaseLayout`;
  the sitemap gets the same alternates. Never add them by hand. No automatic language redirects.
- Adding a language: `locales`/`localeMeta`, a dictionary, every `Localized` field
  (TypeScript lists the gaps), a flag in `Flag.astro`, the three plain-JS lists, its
  OG copy, then `npm run assets` and `npm run verify`.
- Language switcher: native `<details>` with one real `<a hreflang lang>` per language
  (crawlable, works without JS); the script adds Escape/arrows/Home/End/click-outside.

## 8 · SEO (non-negotiable)

Every indexable page has, and `scripts/verify-seo.mjs` enforces:

- A unique `<title>` (≈ 65 characters; CJK counts double) with the name first, and a
  unique meta description of 120–160 characters.
- An absolute `canonical` with trailing slash equal to the route; `hreflang` for the 7
  locales + `x-default`; 6 `og:locale:alternate`; complete Open Graph (1200×630 per
  locale) and a Twitter card.
- JSON-LD: one `@graph` from `src/lib/schema.ts` — `Person` (with `contactPoint` and
  `makesOffer`), `Organization`s, `WebSite`, `ProfilePage`/`WebPage`, `BreadcrumbList`,
  an `ItemList` of projects and an `OfferCatalog` of services. `@id`s are stable.
- Exactly one `<h1>`, no skipped heading levels, images with `alt` and dimensions,
  every form control with a `<label for>`, and on each home page all sections + the form.
- Sitemap: every URL with `<lastmod>` (build date), alternates per language, home
  pages at priority 1, privacy at 0.3; the 404 is `noindex` and excluded.
- Search Console / Bing verification via meta tag (`site.ts`), no DNS change needed.
  Submit `https://emanuel250.dev.ar/sitemap-index.xml` once verified.

## 9 · Accessibility (WCAG 2.2 AA, also non-negotiable)

- Landmarks (`header` > `nav`, `main#main`, `footer`), `aria-labelledby` on sections,
  skip link first, visible `:focus-visible` everywhere, contrast ≥ 4.5:1 for text
  (≥ 3:1 for large text and UI). `--muted` is only for large heading words.
- Accessible name contains the visible label (2.5.3); external links get
  `rel="noopener"` and the `t.a11y.newTab` notice; decorative SVGs are `aria-hidden`.
- Cards use the stretched-link pattern; scrollable regions get `tabindex="0"`,
  `role="region"` and a label; target size ≥ 24 px (≥ 44 px for primary actions).
- Mobile menu: `aria-expanded`/`aria-controls`, Escape closes and returns focus.
- **Auto-updating content (2.2.2)**: the rotating role pauses on hover and while
  off-screen and stops after three cycles; screen readers get the whole list once
  (`.visually-hidden`), the animated copy is `aria-hidden`. Moving strips are
  scroll-linked (never autoplay).

## 10 · Motion

- Reveal on scroll: add `data-reveal` (`""` slide up, `"fade"`, `"scale"`); wrap lists
  in `data-reveal-stagger` to cascade. Hidden state exists only under `html.js` (set
  inline in `<head>` before paint), so nothing disappears without JavaScript.
- Reveals are CSS **animations** with `fill-mode: backwards`, not transitions, so they
  never fight component hover transitions. For hover lifts use the `translate`
  property, not `transform`.
- **`prefers-reduced-motion: reduce` means fade, not frozen**: reveals, the hero
  entrance and the role rotator cross-fade; slides, drifts, count-ups and the
  scroll-linked strip are disabled. Wrap any new movement in
  `@media (prefers-reduced-motion: no-preference)` and give it a fade fallback.
  (The owner's machine has reduced motion enabled: test both modes.)
- Hero entrance animations start at `opacity: 0.01`, not 0, so LCP is not delayed.
- Cross-page navigation uses native view transitions (`@view-transition`); the header
  keeps `view-transition-name: site-header`.
- Print and the CV PDFs force every reveal visible and hide the consent banner.

## 11 · Design

- Tokens in `:root` of `global.css`; components use tokens (loose colours only in
  `ProjectCover.astro` and the flags). Space Grotesk Variable (Latin subset preloaded);
  Chinese and Devanagari use platform fonts via `:lang()`, which also reset the display
  tracking/leading tokens (`var(--tracking-*)`, `var(--leading-*)`).
- Section headers use `SectionHeader` (numbered eyebrow + `RichHeading` + intro);
  two-tone headings always come from a `RichText` in the dictionary
  (`{ br: true, space: false }` for languages without spaces).
- Buttons: `.btn` + `.btn--solid` (primary), `.btn--frame` (secondary, corner frame),
  `.btn--light` (on dark), `.btn--sm`; trailing arrows use `.btn-arrow`. Text links
  with an arrow use `.link-arrow`.
- **Cursor**: on fine pointers the site uses the Figma-style arrow from the hero
  (`public/cursors/arrow.svg`, hotspot 4 4) and its inverted variant for interactive
  elements. Use `cursor: var(--cursor-pointer)`, never a literal `pointer`; text
  fields keep the I-beam.
- Scoped styles do not reach child components (`RichHeading`, `Icon`, `Flag`,
  `<Image>`): style them with `.section :global(.class)`.
- Portrait: every portrait derives from `assets-src/portrait.png` through
  `npm run assets` (black & white). Replace the source, never the derived files.
- Responsive: 1200 px container; hamburger menu < 1024 px; services 2 → 1 columns
  (≤ 760); process 4 → 2 → 1; projects 3 → 2 → 1; contact 2 → 1 (≤ 960).
  Test 1440, 390 and 320 px.

## 12 · Performance

- Baseline: **Lighthouse ≥ 98 / 100 / 100 / 100** (mobile and desktop) on `/`, `/zh/`,
  `/hi/`, a CV page and a privacy page. CLS 0, TBT 0.
- The LCP is the hero portrait (`fetchpriority="high"`, WebP `srcset` 340/460/600/744).
- No third-party script runs before consent; GA4 is the only one, loaded async.

## 13 · Deploy and domain (dev.ar → GitHub Pages)

- `.github/workflows/deploy.yml` runs `npm ci`, `npm audit signatures`, `npm audit`,
  `astro check`, the build and `verify-seo.mjs` on every PR and push; on `main` it also
  publishes `dist/` to Pages. The `github-pages` environment must allow `main`.
- Domain `emanuel250.dev.ar` (panel https://home.dev.ar, Pragmore): **DNS** field =
  `emanuel250yt.github.io` (CNAME; no `https://`, no slashes), **Redirect** empty — only
  one may be active. TXT records only by email to albo@pragmore.com, done by the owner.
- `public/CNAME`, `site` in `astro.config.mjs`, `site.url`, `robots.txt`, `llms.txt`
  and `SITE` in `verify-seo.mjs` must all match. HTTPS is enforced.

## 14 · Supply chain

- Exact dependency versions (`save-exact`); `.npmrc` sets `ignore-scripts=true`.
- Default policy: adopt versions at least 7 days old (Dependabot `cooldown`). When the
  owner explicitly asks to upgrade "to the latest", newer releases are fine — record it
  in the commit message.
- TypeScript stays on 6.x until `astro check` supports 7 (Dependabot ignores TS majors).
- GitHub Actions pinned by SHA; CI runs `npm audit signatures` and `npm audit --omit=dev`.

## 15 · Definition of done

1. `npm run verify` passes (types, build, static SEO/a11y on all 22 pages).
2. Visual review at 1440, 390 and 320 px in at least `es`, `zh` and `hi`, with and
   without reduced motion. Chrome will not shrink a window below ~500 px: use
   390/320 px `<iframe>`s.
3. Lighthouse mobile on the pages listed in §12:
   `npx lighthouse@13.5.0 http://127.0.0.1:4321/ --form-factor=mobile` (with `npm run preview`).
4. Form flow tested with a stubbed `fetch` (validation, preselected service, success, event).
5. If the CV, the portrait or the identity changed: `npm run assets` and commit `public/` and `src/assets/`.
6. No private data and no unsourced facts.

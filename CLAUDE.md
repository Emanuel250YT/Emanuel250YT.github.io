# Emanuel Guzman's portfolio — working rules

Personal site of Emanuel Guzman (founder of Cosmos / Cosmos Pay, full stack
developer, Salta, Argentina). Published at **https://emanuel250.dev.ar** with
**GitHub Pages** from `Emanuel250YT/Emanuel250YT.github.io`, in **7 languages**.

Astro 7, 100 % static output, strict TypeScript, hand-written CSS (no UI or CSS
framework) and almost no client-side JavaScript. `README.md` explains how to use
the project; this file lists the decisions that are easy to break by accident.
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
  config/site.ts          identity: name, email, socials, domain, search-engine verification
  i18n/                   locales.ts (languages, URLs, flags), types.ts (Dictionary), one file per locale
  data/                   projects.ts, achievements.ts, resume.ts (experience, education, skills)
  lib/                    schema.ts (JSON-LD), format.ts (dates), cv.ts (PDF paths)
  layouts/BaseLayout.astro  full <head>: SEO, hreflang, OG/Twitter, JSON-LD, icons
  components/
    sections/             Header, Hero, About, Projects, Achievements, Contact, Footer
    projects/ProjectCover.astro  HTML/CSS illustrated covers (decorative)
    pages/                HomePage, CvPage: the real pages, parameterised by locale
    ui/                   Icon, Flag, LanguageSwitcher, RichHeading
  pages/                  index, cv, 404 (default locale) and [lang]/index, [lang]/cv (the rest)
  styles/global.css       design tokens, reset, buttons, per-script typography
public/                   CNAME, robots.txt, llms.txt, humans.txt, manifest, icons, og/, [locale/]cv/*.pdf
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
- **Data** (projects, achievements, experience, education, certifications, skills)
  lives in `src/data/*.ts` as `Localized` fields (`Record<Locale, T>`), so every
  translation is mandatory. The home page, the CV, the JSON-LD and `llms.txt`
  derive from it: update it once, not four times.
- **Identity** (name, email, socials, domain) lives in `src/config/site.ts`.
- **Nothing made up.** Facts come from the owner's real sources (LinkedIn, GitHub,
  cosmospay.lat, posts). When unsure, prefer less precision (year only) over a
  false date. **Never** publish the phone number or the home address (both are
  on LinkedIn: do not copy them).
- After changing CV data: `npm run assets` (regenerates the 7 PDFs) and commit `public/`.
- After changing projects or roles: update `public/llms.txt` as well.

## 4 · Languages and URLs

- Locales: `es` (default, served at `/`), `en`, `pt`, `fr`, `de`, `zh`, `hi`
  (served at `/<locale>/`). Defined in `src/i18n/locales.ts`; also listed in
  `astro.config.mjs`, `scripts/generate-assets.mjs` and `scripts/verify-seo.mjs`
  (plain JS cannot import TS) — keep the four in sync.
- `localeMeta` holds, per locale: `htmlLang`, `hreflang`, `ogLocale`,
  `dateLocale`, `nativeName` (endonym), `short` (switcher label) and `flag`.
  Flags: es → Argentina, pt → Brazil, en → United States, fr, de, zh → China, hi → India.
- **Every page exists in every language.** The real page lives in
  `src/components/pages/XPage.astro` and receives `locale`; `src/pages/x.astro`
  renders it for `es` and `src/pages/[lang]/x.astro` generates the others with
  `getStaticPaths` over `prefixedLocales`.
- URLs always end with a slash (`trailingSlash: 'always'`, `build.format: 'directory'`).
- Section anchors (`#home`, `#about`, `#projects`, `#achievements`, `#contact`) are
  identical in every language; the Header and its active-section script rely on them.
- `hreflang` for all 7 locales plus `x-default` (→ English, the best fallback for
  visitors whose language we do not have) is emitted by `BaseLayout`; the sitemap
  gets the same alternates from `@astrojs/sitemap`. Never add them by hand.
- Adding a language: add it to `locales`/`localeMeta`, create its dictionary,
  fill every `Localized` field (TypeScript lists the gaps), add a flag to
  `Flag.astro`, update the three plain-JS lists, add its OG copy, run
  `npm run assets` and `npm run verify`.
- No automatic language redirects: they hurt crawling. Visitors choose with the switcher.

## 5 · Language switcher

`src/components/ui/LanguageSwitcher.astro` is a native `<details>`/`<summary>`
disclosure holding one real `<a hreflang lang>` per language, so it works without
JavaScript and every translation is crawlable. The script only adds dropdown
ergonomics: Escape closes and returns focus, ArrowUp/Down/Home/End move between
options, clicking outside or tabbing away closes it. Inside the mobile menu the list
renders in place as a two-column grid. The trigger shows flag + code; its
accessible name starts with the visible code (WCAG 2.5.3). Flags are decorative
inline SVGs (`Flag.astro`); the language name is the accessible text.

## 6 · SEO (non-negotiable)

Every indexable page has, and `scripts/verify-seo.mjs` enforces:

- A unique `<title>` (≈ 65 characters; CJK counts double) with the name first.
- A unique meta description of 120–160 characters.
- An absolute `canonical` on the domain, with trailing slash, equal to the real route.
- `hreflang` for all 7 locales + `x-default`, and 6 `og:locale:alternate`.
- Complete Open Graph (`og:image` 1200×630, one per locale in `public/og/`) and a Twitter card.
- JSON-LD: one `@graph` (from `src/lib/schema.ts`) with `Person`, `Organization`,
  `WebSite`, `ProfilePage` and, on home, an `ItemList` of projects. `@id`s are stable
  (`/#person`, `/#website`, `/#cosmos-pay`…): never change them.
- Exactly one `<h1>` and no skipped heading levels.
- Images with `alt` and `width`/`height` (`astro:assets` provides them).

Also: all content is static HTML; the 404 is `noindex` and out of the sitemap;
search-console verification uses the **meta tag** method via `site.ts` (no DNS change).

## 7 · Accessibility (WCAG 2.2 AA, also non-negotiable)

- **Landmarks**: `header` > `nav` (with `aria-label`), `main#main`, `footer`. Each
  `section` has `aria-labelledby` pointing to its heading.
- **Skip link** is the first focusable element (`.skip-link` → `#main`).
- **Visible focus** on everything interactive (global `:focus-visible`). Never remove
  an outline without an equally visible replacement (cards use `:has(.stretched:focus-visible)`).
- **Contrast**: ≥ 4.5:1 for normal text, ≥ 3:1 for large text (≥ 24 px) and UI
  borders. `--muted` (#858585) is **only** for words in large headings; small text
  uses `--ink-soft` (#555). Text inside decorative illustrations counts too (axe
  measures it even under `aria-hidden`).
- **Accessible name contains the visible label** (2.5.3): never override a link that
  has text with `aria-label`; add context with `.visually-hidden`.
- **External links** with `target="_blank"`: always `rel="noopener"` plus the
  `t.a11y.newTab` notice in `.visually-hidden`.
- **Images**: meaningful ones get a descriptive `alt`; decorative ones `alt=""`;
  decorative SVGs `aria-hidden="true"` (`Icon` and `Flag` do it by default).
- **Clickable cards**: stretched-link pattern (the `<a>` sits in the `h3` and its
  `::after` covers the card). No interactive content nested inside an `<a>`.
- **Horizontally scrollable regions** (achievements rail): `tabindex="0"`,
  `role="region"` and `aria-label`. Avoid horizontal scroll where possible.
- **Mobile menu**: `aria-expanded` + `aria-controls`; Escape closes it and returns
  focus (unless the language switcher already handled that Escape); without JS the
  menu stays visible (`<noscript>`).
- **Target size** ≥ 24 px; primary buttons and links ≥ 44 px tall.
- **Motion**: everything honours `prefers-reduced-motion` (global rule in `global.css`).
- **Language**: correct `<html lang>` per page; any fragment in another language gets `lang`.

## 8 · Design

Based on the reference design (monochrome portfolio): grid hero with a black &
white cut-out portrait standing on the dark section, Figma-style badge and cursor,
two-tone headings, dark "Building with clarity and intention" section, grid of six
projects, achievements rail with faded edges, CTA with a terminal, black footer with
a light halo.

- **Tokens** live in `:root` of `global.css` (colours, type, container, radii,
  shadows, easing, display tracking/leading). Components use tokens; the only loose
  colours are the illustrations in `ProjectCover.astro` and the flags.
- **Type**: self-hosted Space Grotesk Variable (`@fontsource-variable`) with the Latin
  subset preloaded. Chinese and Devanagari fall back to platform fonts via `:lang(zh)`
  / `:lang(hi)`, which also reset the display tracking/leading tokens (negative
  tracking only suits Latin display type). Use `var(--tracking-*)` / `var(--leading-*)`
  in headings, never hard-coded negative letter-spacing on translated text.
- **Two-tone headings**: always `RichHeading` with a `RichText` from the dictionary
  (`{ text, muted }`, `{ br: true }`; use `{ br: true, space: false }` for languages
  written without spaces, such as Chinese).
- **Buttons**: `.btn` + `.btn--frame` (corner-framed outline, as in the design) or
  `.btn--solid` (black).
- **Scoped styles and child components**: Astro does not pass the parent's scope to
  what a child component renders (`RichHeading`, `Icon`, `Flag`, `<Image>`). Style
  them from the section with `.section :global(.class)`.
- **Portrait**: the hero, the footer avatar, the OG cards and the JSON-LD image all
  derive from `assets-src/portrait.png` (colour cut-out with transparency).
  `npm run assets` turns it into `src/assets/portrait.png` and `src/assets/avatar.png`
  in black & white. Replace the source, never the derived files.
- **Cosmos brand blue** (`--cosmic` #000877, `--navy`) only inside illustrations.
- **Responsive**: 1200 px container + fluid `--gutter`; hamburger menu < 860 px;
  project grid 3 → 2 (≤ 960) → 1 (≤ 600); stats become a list ≤ 480. Test 1440, 390 and 320 px.
- **JavaScript**: only the Header script (menu + active section) and the language
  switcher enhancement. Before adding JS, ask whether HTML/CSS can do it.

## 9 · Performance

- Baseline: **Lighthouse ≥ 98 / 100 / 100 / 100** (mobile and desktop) on `/`, a
  CJK page (`/zh/`), a Devanagari page (`/hi/`) and `/cv/`.
- The LCP is the hero portrait: `loading="eager"` + `fetchpriority="high"`, WebP
  with a `srcset` (340/460/600/744) and `sizes` that match the layout.
- CLS 0: every image has dimensions; covers use `aspect-ratio`.
- No third-party scripts or trackers. If analytics are ever added: cookie-less,
  async, and documented in the README.

## 10 · Deploy and domain (dev.ar → GitHub Pages)

- `.github/workflows/deploy.yml` runs `npm ci`, `npm audit signatures`,
  `npm audit`, `astro check`, the build and `verify-seo.mjs` on every PR and push;
  on `main` it also publishes `dist/` to Pages (source: **GitHub Actions**). The
  `github-pages` environment must allow the `main` branch.
- **Domain**: `emanuel250.dev.ar`, managed at https://home.dev.ar (Pragmore).
  - **DNS** field: `emanuel250yt.github.io` → creates a CNAME. No `https://`, no
    slashes, no paths.
  - **Redirect** field: empty. dev.ar allows **one** active setting (redirect **or**
    DNS); to switch, clear the current one first.
  - No NS records are used. Propagation can take up to 48 h.
  - TXT records (e.g. GitHub domain verification) can only be requested by email to
    albo@pragmore.com with TYPE, NAME and CONTENT. The owner does that, not an agent.
- `public/CNAME` contains `emanuel250.dev.ar` and **must match** `site` in
  `astro.config.mjs`, `site.url` in `src/config/site.ts`, `robots.txt`, `llms.txt`
  and `SITE` in `scripts/verify-seo.mjs`. To change the domain, change all of them
  and regenerate the assets.
- Once DNS resolves and the certificate is issued: Settings → Pages → **Enforce HTTPS**.

## 11 · Supply chain

- Exact dependency versions (`save-exact`), published at least 7 days ago.
- `.npmrc` sets `ignore-scripts=true`: no dependency runs install scripts.
- GitHub Actions pinned by commit SHA with the tag in a comment; Dependabot (7-day
  `cooldown`) keeps them current. TypeScript majors are ignored until
  `@astrojs/check` supports them.
- CI runs `npm audit signatures` and `npm audit --omit=dev`.

## 12 · Definition of done

1. `npm run verify` passes (types, build, static SEO/a11y on all 15 pages).
2. Visual review at 1440, 390 and 320 px, in at least `es`, `zh` and `hi`. Chrome
   will not shrink a window below ~500 px: load the site inside 390/320 px `<iframe>`s.
3. Lighthouse mobile on `/`, `/zh/`, `/hi/` and `/cv/`:
   `npx lighthouse@13.5.0 http://127.0.0.1:4321/ --form-factor=mobile` (with `npm run preview`).
4. If the CV, the portrait or the identity changed: `npm run assets` and commit `public/` and `src/assets/`.
5. No private data (phone, address) and no unsourced facts.

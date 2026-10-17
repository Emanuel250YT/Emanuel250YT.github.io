# AGENTS.md — Emanuel Guzman's portfolio

Personal site of Emanuel Guzman (full stack developer, product manager, founder of
Cosmos / Cosmos Pay, Salta, Argentina). Published at **https://emanuel250.dev.ar**
with **GitHub Pages** from `Emanuel250YT/Emanuel250YT.github.io`, in **7 languages**.
Its job is to **convert visitors into leads** (contact form) while staying fast,
accessible and SEO-complete.

Astro 7, 100 % static output, strict TypeScript, hand-written CSS (no UI or CSS
framework) and a few small client scripts. `README.md` explains how to use the
project; this file lists the decisions that are easy to break by accident.
**Mirror of `CLAUDE.md` for other agents (Codex, etc.): when you change one, change the other.**

## Commands

```bash
npm run dev       # dev server (http://localhost:4321)
npm run build     # static build into dist/
npm run preview   # serves dist/ exactly as GitHub Pages will
npm run check     # astro check (types in .astro and .ts files)
npm run verify    # check + build + scripts/verify-seo.mjs  <- run before every commit
npm run assets    # regenerates portraits, icons and OG images (needs Chrome)
```

## Code map

```
assets-src/portrait.png   colour cut-out photo (source of truth for every portrait)
assets-src/logos/         official PNG logos without a vector version (Trustless Work, SaltaDev)
assets-src/process/       the four process photos (generated with Higgsfield; prompts in its README.md)
src/
  config/site.ts          identity, WhatsApp, contact form endpoint, GA4/GTM IDs, search-engine verification
  i18n/                   locales.ts (languages, URLs, flags), types.ts (Dictionary), one file per locale
  assets/certifications/  official badge or certificate image per certification (<id>.png|jpg)
  assets/community/       event photo or official flyer per community card (<id>.jpg, 4:3)
  assets/projects/        screenshot of each project's live site (<id>.jpg, 4:3)
  data/                   services.ts, projects.ts, resume.ts, contact.ts (form values),
                          achievements.json, certifications.json, community.json (typed by highlights.ts),
                          technologies.ts (carousel: names + logo paths from Simple Icons / Devicon),
                          ecosystems.ts (ecosystems strip: names + logos),
                          npm.ts (packages and npm orgs whose downloads are counted),
                          experience.json (work experience, read through resume.ts)
  lib/                    schema.ts (JSON-LD), portrait.ts (JSON-LD image), npm.ts (npm registry + downloads API), fonts.ts (@font-face), format.ts (dates),
                          cv.ts (uploaded PDF paths), images.ts (asset images by file name), whatsapp.ts (wa.me links), graphemes.ts (character splitting for typing)
  scripts/                motion.ts (reveal + count-up), typing.ts (typed headings), theme.ts (dark mode toggle),
                          cursor.ts (animated cursor), analytics.ts (consent + GA4 events)
  layouts/BaseLayout.astro  full <head>, js flag, header/footer, floating actions, consent banner, motion + typing + cursor scripts
  components/
    sections/             Header, Hero, About, Services, Process, Projects, Achievements, Contact, Footer
    contact/ContactForm.astro    the lead form (email or WhatsApp, validation, AJAX, no-JS fallback)
    analytics/ConsentBanner.astro GA4 consent banner (rendered only when an ID is set)
    projects/ProjectCover.astro  HTML/CSS illustrated covers (decorative), for a project without a screenshot
    achievements/HighlightGrid.astro  labelled grid of highlight cards, laid out like the project cards
    achievements/HighlightCover.astro HTML/CSS covers of those cards, one drawing per kind (decorative)
    pages/                HomePage, PrivacyPage: real pages, parameterised by locale
    ui/                   Icon, Flag, LanguageSwitcher, RichHeading, SectionHeader, FloatingActions,
                          Marquee (infinite carousel), TechCarousel, BrandLogo (sprite symbol or PNG mask),
                          ThemeToggle (dark mode switch, sun and moon icons)
  pages/                  index, privacy, 404 (default locale), [lang]/{index,privacy} and logos.svg.ts
                          (logo sprite built from technologies.ts + ecosystems.ts)
  styles/global.css       tokens, reset, buttons, motion, cursor, per-script typography
public/                   CNAME, robots.txt, llms.txt, humans.txt, manifest, icons, cursors/, og/, logos/ (generated masks),
                          [locale/]cv/*.pdf (uploaded)
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
  skills) lives in `src/data/` as `Localized` fields (`Record<Locale, T>`), so every
  translation is mandatory. Work experience is `src/data/experience.json` (easy to edit by
  hand; `resume.ts` types it as `Role[]`, so a missing field or language fails
  `npm run check`); give every company its `companyUrl` when it has a site. The home page, the JSON-LD and `llms.txt` derive from it:
  update it once.
- **Highlights are split by kind**, three JSON files with one shape (`Highlight` in
  `src/data/highlights.ts`: id, date, title, detail, org, mark, url, credentials):
  `achievements.json` (milestones; empty since October 2026: the owner removed the npm
  download records and moved the Scale Track selection to community), `certifications.json`
  (certificates; a certificate keeps its official name as one string and reads
  "Certification" without a detail; also the JSON-LD `hasCredential`) and `community.json`
  (selections, talks, hackathons, bootcamps, sponsorships). The achievements section, laid
  out like Projects, shows a grid of achievements + certifications (labelled
  "Certifications" while `achievements.json` is empty; 4 → 2 columns, compact rows with
  a square thumbnail ≤ 600 px), then the ecosystems strip, then the "Community" grid. Each
  card has an HTML/CSS cover drawn from its kind (plate, certificate, event pass) and its
  `mark`; a card with a `url` links to it as "See source" and is clickable as a whole.
  **Certificates show their official image, never a drawn or generated one when it
  exists**, saved as `src/assets/certifications/<id>.png|jpg` (picked up by file name): a
  transparent PNG is the issuer's badge (Credly, the Mercado Pago badge kit), a JPG is the
  certificate itself (a capture of its credential page when the issuer offers no image
  file, or the owner's PDF). It is grey like the photos and takes its colours when the card
  is pointed at or focused. Every certificate links to its credential page (`url`; the
  Mercado Pago one asks for a login); one card for several credentials of the same issuer
  (Talently) lists them in `credentials`, one link each, the first being the card's own
  link, and the JSON-LD gets one `hasCredential` per credential. A certificate with no
  public page links to its own copy in `public/certifications/<id>.jpg` (Java: the PDF
  the owner sent, rendered). **Never publish a document with the DNI or any other ID
  number**: remove that line from the PDF (true redaction, not a box over the image) before
  rendering it. A certificate without an image keeps its drawn cover. **Community cards
  show a real image of the event** (`src/assets/community/<id>.jpg`, 4:3, filling the
  cover): his own LinkedIn posts first, then the organisers' pages (the SaltaDev event
  page for Blockchain Salta); a virtual event shows its official flyer (Hackathon del
  Milagro). The card links (`url`) to the page that proves his part: his post, the Luma
  agenda that lists his talk, the official rules page. Never a generated image.
  The strip has no visible label (owner's decision: it blurred the message); its name is
  visually hidden for screen readers. Never mix the kinds in one file.
- **Identity and integrations** (name, email, WhatsApp, socials, domain, form endpoint,
  GA4 ID, verification tokens) live in `src/config/site.ts`.
- **Nothing made up.** Facts come from the owner's real sources (LinkedIn, GitHub,
  cosmospay.lat, posts). When unsure, prefer less precision (year only) over a false
  date. **Never** publish the home address. The only phone number on the site is the
  WhatsApp in `site.whatsapp`, published on purpose by the owner (October 2026): do not
  add any other. Commitments in the copy (48 h reply, 30-minute call, written proposal,
  weekly deliveries) were approved as marketing promises: change them only together
  with the owner.
- The hero badge never shows a single fixed title: `hero.roles` rotates, typed and erased
  one after another (full stack developer, product manager, blockchain developer, founder, CEO). Do not put
  "Founder of Cosmos Pay" back as the main title; it lives in the description.
- **The CV is a PDF the owner uploads, never generated**: `public/cv/emanuel-guzman-cv.pdf`
  (default locale, required: `verify-seo.mjs` fails without it) and optionally
  `public/<locale>/cv/emanuel-guzman-cv.pdf`; a language without its own file links to the
  default one (`src/lib/cv.ts`, resolved at build time). Keep those URLs stable: other
  sites link to and fetch them. There is no HTML CV page; `src/data/resume.ts` only
  feeds the JSON-LD and the About section.
- **Download numbers come from npm, never by hand.** The hero stat whose value is
  `{npmDownloads}` shows the total of every project he publishes or collaborates on: the
  packages listed in `src/data/npm.ts` plus every package of the npm organisations in
  `npmOrgs` (today `cosmosapp`), listed from the registry at build time. The total comes
  from npm's public API at build time (the daily deploy refreshes it) and again in the
  browser for the same package list, embedded in the page (`src/lib/npm.ts`); the
  registry's org endpoint has no CORS, so the browser never lists orgs. Its detail line
  says "every project I collaborate on", never a single package name. A past claim ("2,586
  downloads in its first week") quotes npm's own numbers and links its npm-stat chart
  through the highlight's `url`. A new package under a listed org is picked up by itself; any
  other new package → add it to `npmPackages`.
- After changing services, projects or roles: update `public/llms.txt` as well.
- **No em or en dashes (— –)** in any copy, title, alt, structured data, `llms.txt` or the
  manifest: they read as machine-written. Use a comma, colon, period or "·" (titles:
  `Name · Role`), and words for ranges ("USD 1.000 a 5.000"). `verify-seo.mjs` fails on them.

## 4 · Page structure and conversion

Home sections, in this order (the number feeds the `01` eyebrow):
**Hero → 01 About → 02 Services → 03 Process → 04 Projects → 05 Achievements → 06 Contact**.
If `src/data/projects.ts` is ever empty, the Projects section, its menu link and its
JSON-LD `ItemList` stay out and Achievements and Contact become 04 and 05
(`HomePage.astro`); `verify-seo.mjs` checks that every same-page link (`href="#…"`) has
its target. Projects today (owner, October 2026): Stellar Snap, Cosmos Pay (the payment
gateway) and Cosmos Pay Wallet, each linking to its live site. A project card shows a
screenshot of that site (`src/assets/projects/<id>.jpg`, 4:3, picked up by id), grey like
the photos and in colour under the pointer; without one it keeps its drawn cover.
About stays right after the hero because the cut-out portrait "stands" on its dark band.

- Every section ends with (or contains) a call to action to `#contact`; the header
  always shows the "Let's talk" button (below 1024 px it sits in the bar, next to the
  burger; the copy inside the menu is hidden).
- **Process = four views** (diagnosis, proposal, build, launch), each with a photo, its
  number, title, description, three actions (`process.steps[].actions`, under
  `process.actionsLabel`) and its own "book the diagnosis" button (`cta_click`, location
  `process_<step>`). The photos are generated with Higgsfield (GPT Image 2.5) in one
  black & white series: sources and prompts in `assets-src/process/`, `npm run assets`
  derives `src/assets/process/`; regenerate with the same style, never mix in other looks. On screens ≥ 900 px wide and ≥ 700 px tall, with JS,
  the stage (section title and intro included, so they stay on screen through the four
  views) is `position: sticky`, centred under the header while pinned (the script sets
  `--pin-top` from its height; on the way in it follows the title), and the page scrolls through it: the
  active view follows the scroll (equal share each, `60svh` of runway), a 4-step indicator on top
  shows where you are and the active view has `aria-current="step"`; tabbing to the
  button of a hidden view scrolls to that view. Otherwise (no JS,
  narrow or short screens, print) the views stack. Never hijack the scroll. The actions
  only restate commitments the site already makes (30-minute call, written proposal,
  weekly deliveries, deploy, docs, support).
- Service cards link to `#contact` with `data-service="<id>"`: the form preselects that
  service. Keep `ServiceId` and the form's `data-service-id` in sync.
- The contact section pairs the form with "what happens next" (3 steps) and direct
  channels (email, WhatsApp, LinkedIn, CV) to reduce friction.
- Floating actions on every page, bottom right (`ui/FloatingActions.astro`): WhatsApp and
  back to top (shown after scrolling, `href="#top"` so it works without JS). They step
  aside while they would cover the form's buttons (narrow screens), while the mobile menu
  is open and, under 540 px, while the consent banner waits for an answer.
- Keep the form short: name, email, service and message are required; company,
  website and budget are optional. Do not add required fields without a reason.

## 5 · Contact form

- Backend: **FormSubmit** (`site.contactForm`). The first submission ever sends an
  activation email to the address in the URL; until the owner clicks it, nothing is
  delivered. After activation the address can be replaced by FormSubmit's alias.
- Two channels. **Send by email** is the first submit button in the DOM, so Enter in a
  field always submits by email. **Send via WhatsApp** exists only with JavaScript: same
  validation except that the email becomes optional (a typed one must be valid), then it
  opens `wa.me` with a message composed in the visitor's language from the fields and
  leaves a status with a link to open it again.
- With JavaScript: inline validation (`aria-invalid`, messages linked through
  `aria-describedby`, focus on the first invalid field), JSON POST to the AJAX
  endpoint, in-place success panel that receives focus, error message with a
  mailto fallback, `generate_lead` analytics event with `method` (`email` / `whatsapp`).
- Without JavaScript: native validation and a classic POST; FormSubmit redirects to
  `#contact-sent`, where a `:target` success panel appears.
- Spam: `_honey` honeypot (hidden off-screen, `tabindex="-1"`). Values sent for
  service/budget are English constants (`src/data/contact.ts`, `formValue`) so every
  inquiry reads the same whatever the visitor's language; `language` carries the locale.
- Never submit the real form while testing: stub `window.fetch` (and `window.open` for
  WhatsApp) in the page instead.

## 6 · Analytics and consent

- IDs in `site.ts`: GA4 `G-GJVKXV08PC` (loaded directly with gtag.js) and GTM
  `GTM-5BT3SKXR` (for any extra tags). **Never add a Google tag / GA4 tag for the
  same measurement ID inside GTM**: page views and events would be counted twice.
  GTM receives every event in the `dataLayer` as `{ event, ...params }` for its triggers.
- Never paste Google's install snippets into `<head>`: they load before consent.
  No GTM `<noscript>` iframe either (no consent is possible without JS).
- GA4 and GTM load **only after the visitor accepts** (consent "basic" mode), with
  `consent default` pushed first. The banner renders only when an ID is set; reject and accept weigh the same;
  the choice lives in `localStorage` (`consent.analytics`, next to the `theme` preference,
  which the privacy page also mentions); "Cookie preferences" in the
  footer reopens it. Declining removes `_ga*` cookies.
- Events: `cta_click` (with `location`), `select_service`, `contact_click` (with `method`:
  `email`, `whatsapp`, `linkedin`, `email_footer`, `whatsapp_footer`, `whatsapp_floating`),
  `cv_download` (with `location`), `generate_lead` (with `method`). Add events declaratively with
  `data-track="<event>" data-track-<param>="<value>"`, or dispatch
  `new CustomEvent('analytics:event', { detail: { name, params } })`.
- Mark `generate_lead` as a key event (conversion) in GA4.
- Test consent locally by stubbing `HTMLHeadElement.prototype.append`: accepting on
  localhost with the real IDs would send test traffic to the live property.
- The privacy page (`/privacy/` per locale) documents the form processor, WhatsApp, GA4
  and the npm API request behind the live download counter.
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
- JSON-LD: one `@graph` from `src/lib/schema.ts` — `Person` (with `contactPoint`,
  `disambiguatingDescription` and, on home pages, `hasOfferCatalog`), `Organization`s,
  `WebSite`, `ProfilePage`/`WebPage` (with `dateCreated`/`dateModified` from git),
  `BreadcrumbList`, an `ItemList` of projects (while there are any) and an `OfferCatalog` of services. `@id`s
  are stable, and every `{ "@id" }` reference must be defined in the same graph.
- Exactly one `<h1>`, no skipped heading levels, images with `alt` and dimensions,
  every form control with a `<label for>`, and on each home page all sections + the form.
- Sitemap: every URL with `<lastmod>` = the last commit that touched the page's content
  (`astro.config.mjs` reads git; never the build clock, so a deploy that changes nothing
  keeps every date), alternates per language plus `x-default`, home pages at priority 1,
  privacy at 0.3; the 404 is `noindex` and excluded.
- Google Search Console is verified with the **HTML file**
  `public/google4180448db7220be0.html`: never delete or rename it (Google re-checks it);
  `verify-seo.mjs` fails if it is missing. Bing: import the site from Search Console in
  Bing Webmaster Tools (no tag needed), or paste its meta token in `site.ts`.
- `robots.txt` allows everything and says so for AI too (`Content-Signal: search=yes,
  ai-input=yes, ai-train=yes`): change that only with the owner.
  The sitemap to submit is `https://emanuel250.dev.ar/sitemap-index.xml`.

## 9 · Accessibility (WCAG 2.2 AA, also non-negotiable)

- Landmarks (`header` > `nav`, `main#main`, `footer`), `aria-labelledby` on sections,
  skip link first, visible `:focus-visible` everywhere, contrast ≥ 4.5:1 for text
  (≥ 3:1 for large text and UI). `--muted` is only for large heading words.
- Accessible name contains the visible label (2.5.3); external links get
  `rel="noopener"` and the `t.a11y.newTab` notice; decorative SVGs are `aria-hidden`.
- Cards use the stretched-link pattern; scrollable regions get `tabindex="0"`,
  `role="region"` and a label; target size ≥ 24 px (≥ 44 px for primary actions).
- Mobile menu: `aria-expanded`/`aria-controls`, Escape closes and returns focus.
- **Auto-updating content (2.2.2)**: the rotating role pauses on hover, while off-screen
  and while the tab is hidden, and stops on the first role after three cycles; screen
  readers get the whole list once (`.visually-hidden`), the typed copy is `aria-hidden`.
  The two autoplaying strips, technologies (About) and ecosystems and communities
  (Achievements), share `ui/Marquee.astro`, by the owner's decision: infinite and
  continuous, no visible play/pause button (he removed it). They pause while an item is
  pointed at (`:has(li:hover)`, also a tap on touch screens) and while the strip has
  keyboard focus (`tabindex="0"` region). Items rest dimmed (`--marquee-rest`: 0.5 on
  `--dark`, 0.7 on `--bg`, both 5:1; do not go lower) and light up to 1 under the
  pointer. The copy of the list is `aria-hidden`. Keep both at the same speed: tune
  `duration` to the length of the list (about 76 px/s).

## 10 · Motion

- Reveal on scroll: add `data-reveal` (`""` slide up, `"fade"`, `"scale"`); wrap lists
  in `data-reveal-stagger` to cascade. Hidden state exists only under `html.js` (set
  inline in `<head>` before paint), so nothing disappears without JavaScript.
- Reveals are CSS **animations** with `fill-mode: backwards`, not transitions, so they
  never fight component hover transitions. For hover lifts use the `translate`
  property, not `transform`.
- **Typed headings**: every `RichHeading` (hero `<h1>`, section titles) and the privacy and
  404 headings carry `data-type` and type themselves in when they scroll into view
  (`src/scripts/typing.ts`). Only key headings type, never body copy, cards or labels
  (owner's decision). The DOM is never changed: the untyped part is a CSS highlight
  (`::highlight(type-pending)`) painted transparent, so screen readers, crawlers and
  copy get the full text and nothing reflows. Before the script runs the heading is at
  `opacity: 0.01` (LCP), with a CSS failsafe that shows it after 3 s.
- **Typing and count-ups change text in place and move nothing**, so they run with
  and without reduced motion (the owner's machine has it on and wants to see them).
- **`prefers-reduced-motion: reduce` means fade, not frozen**: reveals and the hero
  entrance cross-fade; slides, drifts and caret blinks are disabled. Exception, the
  owner's decision: both Marquee strips always slide continuously, reduced motion
  included (he wants them to move, never step by step). Wrap any new movement in
  `@media (prefers-reduced-motion: no-preference)` and give it a fade fallback.
  (The owner's machine has reduced motion enabled: test both modes.)
- Hero entrance animations start at `opacity: 0.01`, not 0, so LCP is not delayed.
- Cross-page navigation uses native view transitions (`@view-transition`); the header
  keeps `view-transition-name: site-header`.
- **Cursor** (`src/scripts/cursor.ts`) animates every change: hover on interactive
  elements (inverted arrow + square mark), press, a square pulse where a click lands, a
  spinning mark over `[aria-busy="true"]`, fade-out over text fields. With reduced motion
  these cross-fade (no scaling, spinning or growing pulse).
- Print forces every reveal visible and hides the fixed overlays (consent banner,
  floating actions, cursor).

## 11 · Design

- **Square design**: no `border-radius`, no circles, no radial "halo" shapes anywhere,
  covers and icons included (stroke icons use square caps and miter joins). Only flags,
  letterforms and third-party logos (WhatsApp, GitHub, the technology logos…) keep their
  own curves, and so does the moon of the theme toggle (owner's request; its sun keeps a
  square core). Technology and ecosystem logos are the official marks in one colour, in
  the text colour (`ui/BrandLogo.astro`): vector paths in the /logos.svg sprite, taken
  from Simple Icons, Devicon (Java is the cup, never the OpenJDK mark) or the
  organisation's own site; logos that only exist as PNG go to `assets-src/logos/` and
  `npm run assets` turns them into masks in `public/logos/`. Every ecosystem in the
  strip has its logo. DESAFIA is not in the strip (owner's decision). No decorative glows or gradient bands either: the footer is plain black.
- **No bars as separators**: no dashes, slashes or rules between items. Use a small
  filled square (hero badge, between name and role, the process indicator) or plain
  spacing.
- **Logo**: "Emanuel." with a capital E (it is his name), in `site.logo`; the favicon
  and app icons draw a square "E." from straight strokes (`public/favicon.svg` and
  `scripts/generate-assets.mjs`, same drawing; `npm run assets` after changing it).
- Tokens in `:root` of `global.css`; components use tokens (loose colours only in
  `ProjectCover.astro` and the flags).
- **Dark mode**: every token has a dark value, in two identical blocks of `global.css`
  (`prefers-color-scheme: dark` when the visitor made no choice, and
  `:root[data-theme="dark"]`). The header toggle (`ui/ThemeToggle.astro`,
  `src/scripts/theme.ts`, `aria-pressed`) shows the current theme (sun in light, moon in
  dark; they cross-fade, and also turn without reduced motion) and stores `theme` in `localStorage`; an inline
  script in `BaseLayout` applies it before the first paint, and both `theme-color` metas
  follow it. Rules that keep it working: text on an `--ink` background uses `--on-ink`
  (never `#fff`); translucent ink is `color-mix(in srgb, var(--ink) N%, transparent)`
  (never `rgb(17 17 17 / a)`); bands that stay dark in both themes (about, footer, consent
  banner) use `--dark` and the `--on-dark*` tokens, and only there may `#fff`/`#000` appear.
  Photos dim a little in dark (`--photo-filter`). The switch cross-fades
  (`html.theme-switching` view transition) and moves nothing. Check both themes.
- Footer channels: the email shows the mail icon (no photo), WhatsApp its logo. Space Grotesk Variable (Latin subset preloaded);
  Chinese and Devanagari use platform fonts via `:lang()`, which also reset the display
  tracking/leading tokens (`var(--tracking-*)`, `var(--leading-*)`).
- Section headers use `SectionHeader` (numbered eyebrow "01 Services", with no line or
  dash between number and label, + `RichHeading` + intro); the hero badge has no mark
  above it;
  two-tone headings always come from a `RichText` in the dictionary
  (`{ br: true, space: false }` for languages without spaces).
- Buttons: `.btn` + `.btn--solid` (primary), `.btn--frame` (secondary, corner frame),
  `.btn--light` (on dark), `.btn--sm`; trailing arrows use `.btn-arrow`. Text links
  with an arrow use `.link-arrow`. Under 400 px a label that does not fit wraps to a
  second line instead of overflowing.
- **Cursor**: on fine pointers `src/scripts/cursor.ts` replaces the native cursor with a
  square-cornered arrow (see §10) and adds `html.has-cursor`. Without JS, on touch
  screens and in forced-colors mode the CSS cursors apply (`public/cursors/arrow.svg` and
  its inverted `pointer.svg`, hotspot 3 3). Still use `cursor: var(--cursor-pointer)`,
  never a literal `pointer`; text fields keep the I-beam. No decorative "example"
  cursors drawn in the page.
- Scoped styles do not reach child components (`RichHeading`, `Icon`, `Flag`,
  `<Image>`): style them with `.section :global(.class)`.
- Portrait: every portrait derives from `assets-src/portrait.png` through
  `npm run assets` (black & white). Replace the source, never the derived files. In the
  hero it stands on a square `--backdrop` block (the head rises above it) with a short
  drop shadow, for contrast against the light grid.
- Responsive: 1200 px container; hamburger menu < 1024 px; services 2 → 1 columns
  (≤ 760); process pinned views → stacked (< 900 px wide or < 700 px tall); projects
  3 → 2 → 1; contact 2 → 1 (≤ 960).
  Test 1440, 390 and 320 px.

## 12 · Performance

- Baseline: **Lighthouse ≥ 98 / 100 / 100 / 100** (mobile and desktop) on `/`, `/zh/`,
  `/hi/` and a privacy page. CLS 0, TBT 0. Measured as §15 says (October 2026): `/` and
  privacy 99–100, desktop 100; `/zh/` and `/hi/` 93–98 (TBT 140–300 ms, laying out
  CJK/Devanagari text).
- LCP: the hero portrait on desktop and `/zh/` (`fetchpriority="high"`, WebP `srcset`
  340/460/600/744); on mobile `es`/`hi` it is the hero lead paragraph, painted with FCP.
- Space Grotesk loads with `font-display: optional` (`src/lib/fonts.ts`, same files and
  ranges as fontsource): with `swap` the late font forced a second full layout (~300 ms
  of blocking on phones). Off-screen project and highlight covers use `content-visibility: auto`; never
  whole sections (anchor landings such as `#contact` end up in the wrong place).
- No third-party script runs before consent; GA4 and GTM load async afterwards.

## 13 · Deploy and domain (dev.ar → GitHub Pages)

- `.github/workflows/deploy.yml` runs `npm ci`, `npm audit signatures`, `npm audit`,
  `astro check`, the build and `verify-seo.mjs` on every PR and push; on `main` it also
  publishes `dist/` to Pages, and again every day at 09:17 UTC (fresh npm count). It
  checks out the full history (`fetch-depth: 0`): the page dates come from git. The
  `github-pages` environment must allow `main`.
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

1. `npm run verify` passes (types, build, static SEO/a11y on all 15 pages).
2. Visual review at 1440, 390 and 320 px in at least `es`, `zh` and `hi`, with and
   without reduced motion. Chrome will not shrink a window below ~500 px: use
   390/320 px `<iframe>`s.
3. Lighthouse mobile on the pages listed in §12 (with `npm run preview`):
   `npx lighthouse@13.5.0 http://127.0.0.1:4321/ --form-factor=mobile --chrome-flags="--headless=new --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --disable-features=CalculateNativeWinOcclusion"`.
   Without those flags headless Chrome on Windows throttles frames to 1 Hz: FCP jumps to
   ~2.4 s and the score is inflated (the long task lands before FCP, outside TBT).
4. Form flow tested with stubbed `fetch` and `window.open` (validation, preselected service,
   email success, WhatsApp message, events).
5. If the portrait or the identity changed: `npm run assets` and commit `public/` and
   `src/assets/`. If the CV changed: upload the PDFs to `public/[<locale>/]cv/`.
6. No private data and no unsourced facts.

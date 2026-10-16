/**
 * Two-tone heading, as in the design: "muted" words (grey, light weight) and
 * strong words. `br` breaks the line on wide screens only; on narrow screens
 * it collapses into a space, or into nothing when `space` is false (languages
 * written without spaces between words, such as Chinese).
 */
export type RichPart = { text: string; muted?: boolean } | { br: true; space?: boolean };
export type RichText = RichPart[];

export interface Stat {
  value: string;
  label: string;
  detail: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    /** Job title used in structured data and on the CV. */
    jobTitle: string;
    keywords: string[];
  };
  a11y: {
    skip: string;
    menu: string;
    closeMenu: string;
    primaryNav: string;
    /** Label of the language switcher ("Language"). */
    language: string;
    newTab: string;
    scrollHint: string;
    /** Prefix read before the list of rotating roles ("Roles"). */
    rolesLabel: string;
  };
  nav: {
    services: string;
    process: string;
    about: string;
    projects: string;
    achievements: string;
    contact: string;
    /** Header call to action that jumps to the contact form. */
    cta: string;
  };
  hero: {
    /** Roles that rotate inside the hero badge; the first one is the static fallback. */
    roles: string[];
    title: RichText;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Stat[];
    photoAlt: string;
  };
  services: {
    eyebrow: string;
    title: RichText;
    intro: string;
    /** Call to action on every service card. */
    cta: string;
  };
  process: {
    eyebrow: string;
    title: RichText;
    intro: string;
    steps: Step[];
    cta: string;
  };
  about: {
    eyebrow: string;
    title: RichText;
    body: string[];
    rolesLabel: string;
    skillsLabel: string;
    editorFile: string;
    editorComment: string;
    editorResult: string;
    editorCaption: string;
    cvCta: string;
  };
  projects: {
    eyebrow: string;
    title: RichText;
    visit: string;
    code: string;
    private: string;
    /** Name of the project ItemList in structured data. */
    listName: string;
    /** Words drawn inside the decorative project covers. */
    cover: {
      total: string;
      pay: string;
      balance: string;
      files: [string, string, string];
    };
    ctaTitle: string;
  };
  achievements: {
    eyebrow: string;
    title: RichText;
    ecosystemsLabel: string;
  };
  contact: {
    eyebrow: string;
    title: RichText;
    body: string;
    nextTitle: string;
    nextSteps: string[];
    directTitle: string;
    ctaCv: string;
    mailSubject: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      website: string;
      websitePlaceholder: string;
      service: string;
      servicePlaceholder: string;
      serviceCosmos: string;
      serviceOther: string;
      budget: string;
      budgetPlaceholder: string;
      /** Five ranges, in the order of BUDGET_VALUES in src/data/contact.ts. */
      budgetOptions: [string, string, string, string, string];
      message: string;
      messagePlaceholder: string;
      optional: string;
      privacy: string;
      submit: string;
      sending: string;
      successTitle: string;
      successBody: string;
      error: string;
      errorRequired: string;
      errorEmail: string;
    };
  };
  footer: {
    tagline: string;
    ctaTitle: string;
    rights: string;
    builtWith: string;
    /** Button that reopens the analytics consent banner. */
    cookies: string;
  };
  /** Analytics consent banner (only rendered when Google Analytics is configured). */
  consent: {
    text: string;
    accept: string;
    reject: string;
  };
  privacy: {
    title: string;
    description: string;
    heading: string;
    updated: string;
    /** `{email}` inside a body is replaced with the contact email link. */
    sections: Step[];
  };
  cv: {
    title: string;
    description: string;
    heading: string;
    download: string;
    back: string;
    summaryTitle: string;
    summary: string;
    experienceTitle: string;
    projectsTitle: string;
    achievementsTitle: string;
    educationTitle: string;
    certificationsTitle: string;
    skillsTitle: string;
    contactTitle: string;
    present: string;
    inProgress: string;
  };
  notFound: {
    title: string;
    description: string;
    heading: string;
    body: string;
    back: string;
  };
}

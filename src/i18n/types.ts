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
    /** Job title used in structured data. */
    jobTitle: string;
    /** One line that tells this Emanuel Guzman apart from namesakes (JSON-LD disambiguatingDescription). */
    disambiguation: string;
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
    /** Floating button that scrolls back to the top. */
    backToTop: string;
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
    /** Opens the uploaded CV PDF. */
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
    /** Link to the public source that proves an achievement. */
    source: string;
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
    /** Label of the floating WhatsApp button. */
    whatsappCta: string;
    /** Message prefilled when a WhatsApp link opens the chat. */
    whatsappMessage: string;
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
      /** Default submit: sends the form by email (FormSubmit). */
      submit: string;
      submitWhatsapp: string;
      sending: string;
      successTitle: string;
      successBody: string;
      error: string;
      errorRequired: string;
      errorEmail: string;
      /** First line of the WhatsApp message composed from the form. */
      whatsappIntro: string;
      /** Short label for the service line of that message (the field label is a question). */
      whatsappService: string;
      /** Shown after WhatsApp opens, followed by a link (`whatsappRetry`) to open it again. */
      whatsappOpened: string;
      whatsappRetry: string;
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
    back: string;
    /** `{email}` inside a body is replaced with the contact email link. */
    sections: Step[];
  };
  notFound: {
    title: string;
    description: string;
    heading: string;
    body: string;
    back: string;
  };
}

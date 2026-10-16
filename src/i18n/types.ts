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
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    achievements: string;
    contact: string;
  };
  hero: {
    badgeRole: string;
    title: RichText;
    lead: string;
    ctaTalk: string;
    ctaWork: string;
    stats: Stat[];
    photoAlt: string;
    available: string;
    basedIn: string;
  };
  about: {
    title: RichText;
    body: string[];
    rolesLabel: string;
    skillsLabel: string;
    editorFile: string;
    editorComment: string;
    editorResult: string;
    editorCaption: string;
  };
  projects: {
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
  };
  achievements: {
    title: RichText;
  };
  contact: {
    title: RichText;
    body: string;
    ctaTalk: string;
    ctaCv: string;
    terminalTitle: string;
    terminalLines: { prompt?: boolean; text: string }[];
    mailSubject: string;
  };
  footer: {
    tagline: string;
    open: string;
    rights: string;
    builtWith: string;
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

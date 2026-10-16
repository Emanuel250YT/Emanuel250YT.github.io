/**
 * Titulo con dos tonos, como en el diseno: palabras "apagadas" (gris, peso
 * liviano) y palabras fuertes. `br` corta la linea solo en pantallas anchas.
 */
export type RichPart = { text: string; muted?: boolean } | { br: true };
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
    keywords: string[];
  };
  a11y: {
    skip: string;
    menu: string;
    closeMenu: string;
    primaryNav: string;
    switchLanguage: string;
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
  };
  projects: {
    title: RichText;
    visit: string;
    code: string;
    private: string;
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

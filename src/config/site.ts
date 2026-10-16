/**
 * Site identity. Everything that belongs to Emanuel (name, email, socials) is
 * changed here and flows into the UI, the SEO tags and the JSON-LD.
 */
export const site = {
  /** Must match `site` in astro.config.mjs and public/CNAME. */
  url: 'https://emanuel250.dev.ar',
  domain: 'emanuel250.dev.ar',
  /** GitHub Pages host: the CNAME target configured in dev.ar. */
  githubPagesHost: 'emanuel250yt.github.io',
  repository: 'https://github.com/Emanuel250YT/Emanuel250YT.github.io',

  name: 'Emanuel Guzman',
  fullName: 'Emanuel Eduardo Guzman',
  givenName: 'Emanuel',
  familyName: 'Guzman',
  logo: 'emanuel.',
  email: 'emanuel@cloudycoding.com',

  location: {
    city: 'Salta',
    region: 'Salta',
    country: 'AR',
  },

  company: {
    name: 'Cosmos Pay',
    url: 'https://cosmospay.lat',
    ecosystemName: 'Cosmos',
    ecosystemUrl: 'https://cosmosapp.lat',
  },

  socials: {
    github: 'https://github.com/Emanuel250YT',
    linkedin: 'https://www.linkedin.com/in/emanuel250/',
    npm: 'https://www.npmjs.com/~emanuel250dev',
    cosmosGithub: 'https://github.com/CosmosPay',
  },

  /**
   * Google Search Console: paste the `content` of the verification meta tag
   * ("HTML tag" method). No DNS change in dev.ar is needed.
   */
  googleSiteVerification: '',
  /** Bing Webmaster Tools: same idea, "Meta tag" method. */
  bingSiteVerification: '',
} as const;

export type Site = typeof site;

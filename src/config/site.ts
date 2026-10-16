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

  /**
   * WhatsApp, published on purpose by the owner (floating button, contact
   * section, footer and the form's "send via WhatsApp" option).
   */
  whatsapp: {
    /** Country code + number, digits only, as wa.me expects. */
    number: '5493874732727',
    display: '+54 9 387 473-2727',
  },

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
   * Contact form backend. FormSubmit forwards every submission to the email in
   * the URL. The first submission triggers a one-time activation email: click
   * the link in it and the form starts delivering. After activating, you can
   * replace the address with the random alias FormSubmit gives you.
   */
  contactForm: {
    /** JSON endpoint used by the enhanced (JavaScript) form. */
    ajaxEndpoint: 'https://formsubmit.co/ajax/emanuel@cloudycoding.com',
    /** Classic endpoint used when JavaScript is unavailable. */
    action: 'https://formsubmit.co/emanuel@cloudycoding.com',
  },

  /**
   * Google Analytics 4 measurement ID, loaded directly with gtag.js. Empty IDs
   * here and in googleTagManagerId = no consent banner and no Google scripts.
   * Both only load after the visitor accepts analytics cookies.
   */
  googleAnalyticsId: 'G-GJVKXV08PC',
  /**
   * Google Tag Manager container for additional tags. Never add a GA4 / Google
   * tag for the measurement ID above inside it: GA4 is already loaded directly.
   */
  googleTagManagerId: 'GTM-5BT3SKXR',

  /**
   * Google Search Console: paste the `content` of the verification meta tag
   * ("HTML tag" method). No DNS change in dev.ar is needed.
   */
  googleSiteVerification: '',
  /** Bing Webmaster Tools: same idea, "Meta tag" method. */
  bingSiteVerification: '',
} as const;

export type Site = typeof site;

/**
 * Datos de identidad del sitio. Todo lo que es "de Emanuel" (nombre, mail,
 * redes) se cambia aca y se propaga a la UI, al SEO y al JSON-LD.
 */
export const site = {
  /** Debe coincidir con `site` en astro.config.mjs y con public/CNAME. */
  url: 'https://emanuel250.dev.ar',
  domain: 'emanuel250.dev.ar',
  /** Repositorio de GitHub Pages y destino del registro CNAME en dev.ar. */
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
   * Google Search Console: pega aca el "content" del meta tag de verificacion
   * (metodo "Etiqueta HTML"), no hace falta tocar el DNS de dev.ar.
   */
  googleSiteVerification: '',
  /** Bing Webmaster Tools: idem, metodo "Meta tag". */
  bingSiteVerification: '',
} as const;

export type Site = typeof site;

import { site } from '@/config/site';
import { achievements, certifications, community, localize } from '@/data/highlights';
import { projects } from '@/data/projects';
import { education, roles, skillGroups } from '@/data/resume';
import { services } from '@/data/services';
import { useTranslations } from '@/i18n';
import { localeMeta, localePath, locales, type Locale } from '@/i18n/locales';

/**
 * Structured data (schema.org JSON-LD). One @graph per page with stable @ids
 * (#person, #website...) so search engines merge the person, the site and the
 * projects into a single entity across every language.
 */

export type JsonLd = Record<string, unknown>;

/** A rendered image, with the size schema.org consumers expect. */
export interface ImageRef {
  url: string;
  width: number;
  height: number;
}

const abs = (path: string) => new URL(path, site.url).href;

const imageObject = (image: ImageRef, caption?: string): JsonLd => ({
  '@type': 'ImageObject',
  url: image.url,
  width: image.width,
  height: image.height,
  ...(caption ? { caption } : {}),
});

/** `programmingLanguage` only takes languages; frameworks and platforms go to `keywords`. */
const LANGUAGES = new Set(['TypeScript', 'JavaScript', 'Rust', 'Kotlin', 'Solidity', 'Python', 'Go', 'Java', 'Swift', 'SQL']);

export const ids = {
  person: abs('/#person'),
  website: abs('/#website'),
  cosmos: abs('/#cosmos-pay'),
  cloudycoding: abs('/#cloudycoding'),
};

const serviceCatalogId = (locale: Locale) => abs(`${localePath(locale)}#services`);

interface PersonOptions {
  /** Link the service catalog: only on pages whose graph includes `serviceCatalogNode`. */
  offers?: boolean;
}

export function personNode(locale: Locale, image: ImageRef, { offers = false }: PersonOptions = {}): JsonLd {
  const t = useTranslations(locale);

  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    alternateName: [site.fullName, 'Emanuel250'],
    givenName: site.givenName,
    familyName: site.familyName,
    url: abs('/'),
    image: imageObject(image, t.hero.photoAlt),
    email: site.email,
    jobTitle: t.meta.jobTitle,
    description: t.meta.description,
    disambiguatingDescription: t.meta.disambiguation,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    nationality: { '@type': 'Country', name: 'Argentina' },
    worksFor: [{ '@id': ids.cosmos }, { '@id': ids.cloudycoding }],
    alumniOf: education.map((item) => ({
      '@type': item.id === 'ucasal' ? 'CollegeOrUniversity' : 'EducationalOrganization',
      name: item.school,
    })),
    hasOccupation: roles.map((role) => ({
      '@type': 'Occupation',
      name: role.title[locale],
      description: role.summary[locale],
    })),
    // One credential per verifiable page: a card with several (Talently) yields one each.
    hasCredential: certifications.flatMap((cert) => {
      const title = localize(cert.title, locale);
      return (cert.credentials ?? [{ name: '', url: cert.url }]).map((credential) => ({
        '@type': 'EducationalOccupationalCredential',
        name: credential.name ? `${credential.name} · ${title}` : title,
        credentialCategory: 'certificate',
        recognizedBy: { '@type': 'Organization', name: cert.org },
        dateCreated: cert.date,
        ...(credential.url && { url: abs(credential.url) }),
      }));
    }),
    award: [...achievements, ...community].map(
      (item) => `${localize(item.title, locale)}${item.detail ? `: ${item.detail[locale]}` : ''}`,
    ),
    knowsAbout: [...new Set(skillGroups.flatMap((group) => group.items))],
    knowsLanguage: ['es', 'en'],
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.npm],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      // The WhatsApp number, published on purpose by the owner.
      telephone: `+${site.whatsapp.number}`,
      url: abs(`${localePath(locale)}#contact`),
      availableLanguage: ['es', 'en'],
    },
    ...(offers ? { hasOfferCatalog: { '@id': serviceCatalogId(locale) } } : {}),
  };
}

/** The services on the home page, as an OfferCatalog the person provides (no area limit: remote, any country). */
export function serviceCatalogNode(locale: Locale): JsonLd {
  return {
    '@type': 'OfferCatalog',
    '@id': serviceCatalogId(locale),
    name: useTranslations(locale).services.eyebrow,
    inLanguage: localeMeta[locale].htmlLang,
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title[locale],
        description: service.description[locale],
        serviceType: service.formValue,
        provider: { '@id': ids.person },
      },
    })),
  };
}

export function organizationNodes(locale: Locale): JsonLd[] {
  const cosmosPay = projects.find((project) => project.id === 'cosmos-pay');

  return [
    {
      '@type': 'Organization',
      '@id': ids.cosmos,
      name: site.company.name,
      url: site.company.url,
      ...(cosmosPay ? { description: cosmosPay.description[locale] } : {}),
      founder: { '@id': ids.person },
      sameAs: [site.socials.cosmosGithub, site.company.ecosystemUrl],
    },
    {
      '@type': 'Organization',
      '@id': ids.cloudycoding,
      name: 'CloudyCoding',
      url: 'https://cloudycoding.com',
      employee: { '@id': ids.person },
    },
  ];
}

export function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: site.name,
    alternateName: site.domain,
    inLanguage: locales.map((locale) => localeMeta[locale].htmlLang),
    publisher: { '@id': ids.person },
    author: { '@id': ids.person },
  };
}

export function projectListNode(locale: Locale): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': abs(`${localePath(locale)}#projects`),
    name: useTranslations(locale).projects.listName,
    inLanguage: localeMeta[locale].htmlLang,
    itemListElement: projects.map((project, index) => {
      const languages = project.tech.filter((tech) => LANGUAGES.has(tech));
      const platforms = project.tech.filter((tech) => !LANGUAGES.has(tech));
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareSourceCode',
          name: project.name,
          description: project.description[locale],
          ...(project.url ? { url: project.url } : {}),
          ...(project.repo ? { codeRepository: project.repo } : {}),
          ...(languages.length ? { programmingLanguage: languages } : {}),
          ...(platforms.length ? { keywords: platforms.join(', ') } : {}),
          dateCreated: project.year,
          author: { '@id': ids.person },
          creator: { '@id': ids.person },
        },
      };
    }),
  };
}

interface PageNodeOptions {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type: 'ProfilePage' | 'WebPage';
  image: ImageRef;
  breadcrumb?: { name: string; path: string }[];
}

export function pageNode({ locale, path, title, description, type, image, breadcrumb }: PageNodeOptions): JsonLd[] {
  const url = abs(localePath(locale, path));
  // From the git history of the page's content (astro.config.mjs): stable across deploys
  // that change nothing, absent outside a git checkout.
  const dates = __CONTENT_DATES__[`${locale}:${path}`];
  const nodes: JsonLd[] = [
    {
      '@type': type,
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: localeMeta[locale].htmlLang,
      isPartOf: { '@id': ids.website },
      about: { '@id': ids.person },
      ...(type === 'ProfilePage' ? { mainEntity: { '@id': ids.person } } : {}),
      primaryImageOfPage: imageObject(image),
      ...(dates?.created ? { dateCreated: dates.created } : {}),
      ...(dates?.modified ? { dateModified: dates.modified } : {}),
      ...(breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    },
  ];

  if (breadcrumb) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumb.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: abs(localePath(locale, crumb.path)),
      })),
    });
  }

  return nodes;
}

export function graph(nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

import { site } from '@/config/site';
import { achievements } from '@/data/achievements';
import { projects } from '@/data/projects';
import { certifications, education, roles, skillGroups } from '@/data/resume';
import { services } from '@/data/services';
import { useTranslations } from '@/i18n';
import { localeMeta, localePath, locales, type Locale } from '@/i18n/locales';

/**
 * Structured data (schema.org JSON-LD). One @graph per page with stable @ids
 * (#person, #website...) so search engines merge the person, the site and the
 * projects into a single entity across every language.
 */

export type JsonLd = Record<string, unknown>;

const abs = (path: string) => new URL(path, site.url).href;

export const ids = {
  person: abs('/#person'),
  website: abs('/#website'),
  cosmos: abs('/#cosmos-pay'),
  cloudycoding: abs('/#cloudycoding'),
};

export function personNode(locale: Locale, imageUrl: string): JsonLd {
  const t = useTranslations(locale);

  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    alternateName: [site.fullName, 'Emanuel250'],
    givenName: site.givenName,
    familyName: site.familyName,
    url: site.url,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: t.hero.photoAlt,
    },
    email: `mailto:${site.email}`,
    jobTitle: t.meta.jobTitle,
    description: t.meta.description,
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
      name: `${role.title[locale]} · ${role.company}`,
      description: role.summary[locale],
    })),
    hasCredential: certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
      dateCreated: cert.date,
    })),
    award: achievements.map((item) => `${item.title[locale]} — ${item.detail[locale]}`),
    knowsAbout: [...new Set(skillGroups.flatMap((group) => group.items))],
    knowsLanguage: ['es', 'en'],
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.npm],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      url: abs(`${localePath(locale)}#contact`),
      availableLanguage: ['es', 'en'],
    },
    makesOffer: { '@id': abs(`${localePath(locale)}#services`) },
  };
}

/** The services on the home page, as an OfferCatalog the person provides. */
export function serviceCatalogNode(locale: Locale): JsonLd {
  return {
    '@type': 'OfferCatalog',
    '@id': abs(`${localePath(locale)}#services`),
    name: useTranslations(locale).services.eyebrow,
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title[locale],
        description: service.description[locale],
        serviceType: service.formValue,
        provider: { '@id': ids.person },
        areaServed: [{ '@type': 'Place', name: 'Latin America' }, { '@type': 'Place', name: 'Worldwide' }],
      },
    })),
  };
}

export function organizationNodes(): JsonLd[] {
  return [
    {
      '@type': 'Organization',
      '@id': ids.cosmos,
      name: site.company.name,
      url: site.company.url,
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
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description[locale],
        ...(project.url ? { url: project.url } : {}),
        ...(project.repo ? { codeRepository: project.repo } : {}),
        programmingLanguage: project.tech,
        dateCreated: project.year,
        author: { '@id': ids.person },
        creator: { '@id': ids.person },
      },
    })),
  };
}

interface PageNodeOptions {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type: 'ProfilePage' | 'WebPage';
  imageUrl: string;
  breadcrumb?: { name: string; path: string }[];
}

export function pageNode({ locale, path, title, description, type, imageUrl, breadcrumb }: PageNodeOptions): JsonLd[] {
  const url = abs(localePath(locale, path));
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
      primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
      dateModified: new Date().toISOString(),
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

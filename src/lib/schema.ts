import { site } from '@/config/site';
import { achievements } from '@/data/achievements';
import { projects } from '@/data/projects';
import { certifications, education, roles, skillGroups } from '@/data/resume';
import { useTranslations } from '@/i18n';
import { localeMeta, localePath, type Locale } from '@/i18n/locales';

/**
 * Datos estructurados (schema.org, JSON-LD). Un solo @graph por pagina con
 * identificadores estables (#person, #website...) para que Google relacione
 * la persona, el sitio y sus proyectos como una sola entidad.
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
  const jobTitle = locale === 'es' ? 'Founder de Cosmos Pay y desarrollador full stack' : 'Founder of Cosmos Pay & Full Stack Developer';

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
    jobTitle,
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
    inLanguage: ['es-AR', 'en'],
    publisher: { '@id': ids.person },
    author: { '@id': ids.person },
  };
}

export function projectListNode(locale: Locale): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': abs(`${localePath(locale)}#projects`),
    name: locale === 'es' ? 'Proyectos de Emanuel Guzman' : 'Projects by Emanuel Guzman',
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

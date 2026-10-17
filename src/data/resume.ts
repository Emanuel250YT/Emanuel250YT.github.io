import experience from '@/data/experience.json';
import type { Localized } from '@/i18n/locales';

/**
 * Work experience, newest roles first. It lives in src/data/experience.json so it can be
 * updated without touching code; this type keeps every entry complete (a missing field or
 * translation makes `npm run check` fail). Roles without `end` are ongoing; the About
 * section lists them (except freelance) with a link to `companyUrl`.
 */
export interface Role {
  id: string;
  company: string;
  companyUrl?: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; omitted while the role is ongoing. */
  end?: string;
  title: Localized;
  location: Localized;
  summary: Localized;
}

export const roles: Role[] = experience;

export interface Education {
  id: string;
  school: string;
  degree: Localized;
  start: string;
  end: string;
  inProgress?: boolean;
}

export const education: Education[] = [
  {
    id: 'ucasal',
    school: 'Universidad Católica de Salta (UCASAL)',
    degree: {
      es: 'Ingeniería, Ciencias de la Computación',
      en: 'Engineering, Computer Science',
      pt: 'Engenharia, Ciência da Computação',
      fr: 'Ingénierie, informatique',
      de: 'Ingenieurwesen, Informatik',
      zh: '工程学（计算机科学）',
      hi: 'इंजीनियरिंग, कंप्यूटर साइंस',
    },
    start: '2023',
    end: '2028',
    inProgress: true,
  },
  {
    id: 'argentina-programa',
    school: 'Argentina Programa',
    degree: {
      es: 'Java Developer',
      en: 'Java Developer',
      pt: 'Java Developer',
      fr: 'Java Developer',
      de: 'Java Developer',
      zh: 'Java 开发者',
      hi: 'Java डेवलपर',
    },
    start: '2023',
    end: '2023',
  },
];

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export const certifications: Certification[] = [
  { name: 'Checkout Pro', issuer: 'Mercado Libre', date: '2025-06' },
  { name: 'TypeScript, JavaScript, Node.js, Express.js, React, Python', issuer: 'Talently', date: '2025-02' },
  { name: 'NASA Open Science', issuer: 'NASA', date: '2024-10' },
  { name: 'Taller Alta Ciencia Abierta', issuer: 'MetaDocencia', date: '2024-08' },
  { name: 'Full Modern React', issuer: 'MindLuster', date: '2023-07' },
  { name: 'Python Essentials 1', issuer: 'Cisco Networking Academy', date: '2023-07' },
  { name: 'Java Developer Junior', issuer: 'Argentina Programa', date: '2023-03' },
];

export interface SkillGroup {
  label: Localized;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { es: 'Lenguajes', en: 'Languages', pt: 'Linguagens', fr: 'Langages', de: 'Sprachen', zh: '编程语言', hi: 'भाषाएँ' },
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'Go', 'Rust', 'Solidity'],
  },
  {
    label: { es: 'Backend', en: 'Backend', pt: 'Backend', fr: 'Backend', de: 'Backend', zh: '后端', hi: 'बैकएंड' },
    items: ['Node.js', 'Express', 'NestJS', 'Prisma', 'PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    label: { es: 'Frontend', en: 'Frontend', pt: 'Frontend', fr: 'Frontend', de: 'Frontend', zh: '前端', hi: 'फ्रंटएंड' },
    items: ['Astro', 'React', 'Next.js', 'HTML', 'CSS'],
  },
  {
    label: { es: 'Blockchain', en: 'Blockchain', pt: 'Blockchain', fr: 'Blockchain', de: 'Blockchain', zh: '区块链', hi: 'ब्लॉकचेन' },
    items: ['Stellar (SEPs, Soroban)', 'Solana', 'Monad / EVM', 'Arkiv', 'x402'],
  },
  {
    label: {
      es: 'Infraestructura',
      en: 'Infrastructure',
      pt: 'Infraestrutura',
      fr: 'Infrastructure',
      de: 'Infrastruktur',
      zh: '基础设施',
      hi: 'इंफ्रास्ट्रक्चर',
    },
    items: ['Docker', 'Cloudflare', 'APISIX', 'GitHub Actions', 'Git'],
  },
];

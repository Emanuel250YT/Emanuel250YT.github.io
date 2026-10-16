import type { Localized } from '@/i18n/locales';

export interface Role {
  id: string;
  title: Localized;
  company: string;
  companyUrl?: string;
  /** AAAA-MM */
  start: string;
  /** AAAA-MM; sin valor = actualidad. */
  end?: string;
  location: Localized;
  summary: Localized;
}

export const roles: Role[] = [
  {
    id: 'cosmos',
    title: { es: 'Founder', en: 'Founder' },
    company: 'Cosmos · Cosmos Pay',
    companyUrl: 'https://cosmospay.lat',
    start: '2026-02',
    location: { es: 'Salta, Argentina', en: 'Salta, Argentina' },
    summary: {
      es: 'Ecosistema multichain de pagos y comercio para Latinoamérica. Lidero producto y desarrollo de Cosmos Pay: Payments API, wallet no custodial, SDK en TypeScript y plataforma para desarrolladores sobre Stellar, Solana y Monad.',
      en: 'A multichain payments and commerce ecosystem for Latin America. I lead product and engineering for Cosmos Pay: the Payments API, a non-custodial wallet, a TypeScript SDK and a developer platform on Stellar, Solana and Monad.',
    },
  },
  {
    id: 'cloudycoding',
    title: { es: 'CEO', en: 'CEO' },
    company: 'CloudyCoding',
    start: '2018-02',
    location: { es: 'Argentina', en: 'Argentina' },
    summary: {
      es: 'Estudio de software: sitios, aplicaciones y backends a medida para clientes, librerías open source y apoyo a la comunidad tech local con infraestructura gratuita.',
      en: 'A software studio: custom websites, apps and backends for clients, open source libraries, and free infrastructure for the local tech community.',
    },
  },
  {
    id: 'saltadev',
    title: { es: 'Full Stack Developer', en: 'Full Stack Developer' },
    company: 'SaltaDev',
    companyUrl: 'https://salta.dev.ar',
    start: '2025-02',
    location: { es: 'Salta, Argentina · remoto', en: 'Salta, Argentina · remote' },
    summary: {
      es: 'Desarrollo front end y full stack para la comunidad SaltaDev, y participación en hackathons y eventos tech de la región.',
      en: 'Front end and full stack development for the SaltaDev community, plus hackathons and tech events across the region.',
    },
  },
  {
    id: 'freelance',
    title: { es: 'Programador independiente', en: 'Independent developer' },
    company: 'Freelance',
    start: '2018-11',
    location: { es: 'Remoto', en: 'Remote' },
    summary: {
      es: 'Proyectos web y backend para terceros con Node.js, Java, Go y MongoDB: e-commerce, plataformas en tiempo real con WebSockets, bots y dashboards.',
      en: 'Web and backend projects for clients with Node.js, Java, Go and MongoDB: e-commerce, real-time platforms with WebSockets, bots and dashboards.',
    },
  },
];

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
    degree: { es: 'Ingeniería, Ciencias de la Computación', en: 'Engineering, Computer Science' },
    start: '2023',
    end: '2028',
    inProgress: true,
  },
  {
    id: 'argentina-programa',
    school: 'Argentina Programa',
    degree: { es: 'Java Developer', en: 'Java Developer' },
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
  { name: 'TypeScript, JavaScript, Node.js, Express.js, React, Python', issuer: 'Talently (verified)', date: '2025-02' },
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
    label: { es: 'Lenguajes', en: 'Languages' },
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'Go', 'Rust', 'Solidity'],
  },
  {
    label: { es: 'Backend', en: 'Backend' },
    items: ['Node.js', 'Express', 'NestJS', 'Prisma', 'PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    label: { es: 'Frontend', en: 'Frontend' },
    items: ['Astro', 'React', 'Next.js', 'HTML', 'CSS'],
  },
  {
    label: { es: 'Blockchain', en: 'Blockchain' },
    items: ['Stellar (SEPs, Soroban)', 'Solana', 'Monad / EVM', 'Arkiv', 'x402'],
  },
  {
    label: { es: 'Infraestructura', en: 'Infrastructure' },
    items: ['Docker', 'Cloudflare', 'APISIX', 'GitHub Actions', 'Git'],
  },
];

/** Las etiquetas subrayadas al pie de la seccion oscura, como en el diseno. */
export const coreStack = ['TypeScript', 'Node.js', 'Stellar · Soroban', 'Solidity', 'Rust', 'Go'];

import type { Localized } from '@/i18n/locales';

export interface Achievement {
  id: string;
  /** ISO (AAAA-MM, o AAAA si no se conoce el mes) para <time datetime> y para ordenar. */
  date: string;
  title: Localized;
  detail: Localized;
  org: string;
  /** Sigla del emblema circular de la tarjeta. */
  mark: string;
  url?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'codigo-alebrije',
    date: '2026-03',
    title: { es: 'Seleccionado · Scale Track', en: 'Selected · Scale Track' },
    detail: {
      es: 'Código Alebrije 2026, Ciudad de México, con Cosmos',
      en: 'Código Alebrije 2026, Mexico City, with Cosmos',
    },
    org: 'Stellar Development Foundation · BAF',
    mark: 'SDF',
  },
  {
    id: 'arkiv-sdks',
    date: '2026-03',
    title: { es: '1.000+ descargas en 3 días', en: '1,000+ downloads in 3 days' },
    detail: {
      es: 'ArkaCDN y ASide, SDKs open source para Arkiv',
      en: 'ArkaCDN and ASide, open source SDKs for Arkiv',
    },
    org: 'npm · Arkiv Network',
    mark: 'npm',
    url: 'https://github.com/Emanuel250YT/arka-cdn',
  },
  {
    id: 'impacta-bootcamp',
    date: '2026-02',
    title: { es: 'Builder · ImpactaBootcamp', en: 'Builder · ImpactaBootcamp' },
    detail: {
      es: 'Soroban, escrow trustless y product mindset',
      en: 'Soroban, trustless escrow and product mindset',
    },
    org: 'Trustless Work · BAF',
    mark: 'TW',
  },
  {
    id: 'macroclickjs',
    date: '2025-10',
    title: { es: '15.000+ descargas en una semana', en: '15,000+ downloads in one week' },
    detail: {
      es: 'MacroClickJS, integración con la pasarela de Banco Macro',
      en: 'MacroClickJS, an integration for Banco Macro’s gateway',
    },
    org: 'npm · Open source',
    mark: 'JS',
  },
  {
    id: 'blockchain-salta',
    date: '2025-09',
    title: { es: 'Speaker · Blockchain Salta', en: 'Speaker · Blockchain Salta' },
    detail: {
      es: 'Conferencia con repercusión en radio y TV',
      en: 'A conference covered on local radio and TV',
    },
    org: 'DESAFIA · SaltaDev',
    mark: 'BS',
  },
  {
    id: 'hackathon-milagro',
    date: '2025-09',
    title: { es: 'Sponsor · Hackathon del Milagro', en: 'Sponsor · Hackathon del Milagro' },
    detail: {
      es: 'Hosting gratuito para los proyectos ganadores',
      en: 'Free hosting for the winning projects',
    },
    org: 'CloudyCoding · SaltaDev',
    mark: 'CC',
  },
  {
    id: 'eth-hackathons',
    date: '2025',
    title: { es: 'Hacker · Ethereum 2025', en: 'Hacker · Ethereum 2025' },
    detail: {
      es: 'Hackathon global de Ethereum y ETH Argentina: 96 h de código',
      en: 'A global Ethereum hackathon and ETH Argentina: 96 h of code',
    },
    org: 'Ethereum',
    mark: 'ETH',
  },
  {
    id: 'nasa-open-science',
    date: '2024-10',
    title: { es: 'Certificación NASA Open Science', en: 'NASA Open Science certificate' },
    detail: {
      es: 'Principios y prácticas de ciencia abierta',
      en: 'Open science principles and practices',
    },
    org: 'NASA',
    mark: 'NASA',
  },
];

/** Mas recientes primero. */
export const sortedAchievements = [...achievements].sort((a, b) => b.date.localeCompare(a.date));

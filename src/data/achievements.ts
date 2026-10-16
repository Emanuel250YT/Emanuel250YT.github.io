import type { Localized } from '@/i18n/locales';

export interface Achievement {
  id: string;
  /** ISO date (YYYY-MM, or YYYY when the month is unknown) for <time datetime> and sorting. */
  date: string;
  title: Localized;
  detail: Localized;
  org: string;
  /** Initials shown in the card's round badge. */
  mark: string;
  url?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'codigo-alebrije',
    date: '2026-03',
    title: {
      es: 'Seleccionado · Scale Track',
      en: 'Selected · Scale Track',
      pt: 'Selecionado · Scale Track',
      fr: 'Sélectionné · Scale Track',
      de: 'Ausgewählt · Scale Track',
      zh: '入选 · Scale Track',
      hi: 'चयनित · Scale Track',
    },
    detail: {
      es: 'Código Alebrije 2026, Ciudad de México, con Cosmos',
      en: 'Código Alebrije 2026, Mexico City, with Cosmos',
      pt: 'Código Alebrije 2026, Cidade do México, com a Cosmos',
      fr: 'Código Alebrije 2026, Mexico, avec Cosmos',
      de: 'Código Alebrije 2026, Mexiko-Stadt, mit Cosmos',
      zh: 'Código Alebrije 2026，墨西哥城，携 Cosmos 参加',
      hi: 'Código Alebrije 2026, मेक्सिको सिटी, Cosmos के साथ',
    },
    org: 'Stellar Development Foundation · BAF',
    mark: 'SDF',
  },
  {
    id: 'arkiv-sdks',
    date: '2026-03',
    title: {
      es: '1.000+ descargas en 3 días',
      en: '1,000+ downloads in 3 days',
      pt: '1.000+ downloads em 3 dias',
      fr: '1 000+ téléchargements en 3 jours',
      de: '1.000+ Downloads in 3 Tagen',
      zh: '3 天下载量破 1,000',
      hi: '3 दिनों में 1,000+ डाउनलोड',
    },
    detail: {
      es: 'ArkaCDN y ASide, SDKs open source para Arkiv',
      en: 'ArkaCDN and ASide, open source SDKs for Arkiv',
      pt: 'ArkaCDN e ASide, SDKs open source para a Arkiv',
      fr: 'ArkaCDN et ASide, des SDK open source pour Arkiv',
      de: 'ArkaCDN und ASide, Open-Source-SDKs für Arkiv',
      zh: 'ArkaCDN 与 ASide，面向 Arkiv 的开源 SDK',
      hi: 'ArkaCDN और ASide, Arkiv के लिए ओपन सोर्स SDK',
    },
    org: 'npm · Arkiv Network',
    mark: 'npm',
    url: 'https://github.com/Emanuel250YT/arka-cdn',
  },
  {
    id: 'impacta-bootcamp',
    date: '2026-02',
    title: {
      es: 'Builder · ImpactaBootcamp',
      en: 'Builder · ImpactaBootcamp',
      pt: 'Builder · ImpactaBootcamp',
      fr: 'Builder · ImpactaBootcamp',
      de: 'Builder · ImpactaBootcamp',
      zh: '建设者 · ImpactaBootcamp',
      hi: 'बिल्डर · ImpactaBootcamp',
    },
    detail: {
      es: 'Soroban, escrow trustless y product mindset',
      en: 'Soroban, trustless escrow and product mindset',
      pt: 'Soroban, escrow trustless e product mindset',
      fr: 'Soroban, séquestre trustless et product mindset',
      de: 'Soroban, Trustless Escrow und Product Mindset',
      zh: 'Soroban、去信任托管与产品思维',
      hi: 'Soroban, ट्रस्टलेस एस्क्रो और प्रोडक्ट माइंडसेट',
    },
    org: 'Trustless Work · BAF',
    mark: 'TW',
  },
  {
    id: 'macroclickjs',
    date: '2025-10',
    title: {
      es: '15.000+ descargas en una semana',
      en: '15,000+ downloads in one week',
      pt: '15.000+ downloads em uma semana',
      fr: '15 000+ téléchargements en une semaine',
      de: '15.000+ Downloads in einer Woche',
      zh: '一周下载量破 15,000',
      hi: 'एक हफ़्ते में 15,000+ डाउनलोड',
    },
    detail: {
      es: 'MacroClickJS, integración con la pasarela de Banco Macro',
      en: 'MacroClickJS, an integration for Banco Macro’s gateway',
      pt: 'MacroClickJS, integração com o gateway do Banco Macro',
      fr: 'MacroClickJS, intégration de la passerelle de Banco Macro',
      de: 'MacroClickJS, Integration für das Gateway der Banco Macro',
      zh: 'MacroClickJS，对接 Banco Macro 支付网关',
      hi: 'MacroClickJS, Banco Macro के गेटवे के लिए इंटीग्रेशन',
    },
    org: 'npm · Open source',
    mark: 'JS',
  },
  {
    id: 'blockchain-salta',
    date: '2025-09',
    title: {
      es: 'Speaker · Blockchain Salta',
      en: 'Speaker · Blockchain Salta',
      pt: 'Palestrante · Blockchain Salta',
      fr: 'Intervenant · Blockchain Salta',
      de: 'Speaker · Blockchain Salta',
      zh: '演讲嘉宾 · Blockchain Salta',
      hi: 'स्पीकर · Blockchain Salta',
    },
    detail: {
      es: 'Conferencia con repercusión en radio y TV',
      en: 'A conference covered on local radio and TV',
      pt: 'Conferência com repercussão no rádio e na TV',
      fr: 'Une conférence relayée à la radio et à la télévision',
      de: 'Eine Konferenz mit Echo in Radio und TV',
      zh: '获得当地广播和电视报道的大会',
      hi: 'रेडियो और टीवी पर चर्चित कॉन्फ़्रेंस',
    },
    org: 'DESAFIA · SaltaDev',
    mark: 'BS',
  },
  {
    id: 'hackathon-milagro',
    date: '2025-09',
    title: {
      es: 'Sponsor · Hackathon del Milagro',
      en: 'Sponsor · Hackathon del Milagro',
      pt: 'Patrocinador · Hackathon del Milagro',
      fr: 'Sponsor · Hackathon del Milagro',
      de: 'Sponsor · Hackathon del Milagro',
      zh: '赞助商 · Hackathon del Milagro',
      hi: 'प्रायोजक · Hackathon del Milagro',
    },
    detail: {
      es: 'Hosting gratuito para los proyectos ganadores',
      en: 'Free hosting for the winning projects',
      pt: 'Hospedagem gratuita para os projetos vencedores',
      fr: 'Hébergement gratuit pour les projets lauréats',
      de: 'Kostenloses Hosting für die Gewinnerprojekte',
      zh: '为获奖项目提供免费托管',
      hi: 'विजेता प्रोजेक्ट्स के लिए मुफ़्त होस्टिंग',
    },
    org: 'CloudyCoding · SaltaDev',
    mark: 'CC',
  },
  {
    id: 'eth-hackathons',
    date: '2025',
    title: {
      es: 'Hacker · Ethereum 2025',
      en: 'Hacker · Ethereum 2025',
      pt: 'Hacker · Ethereum 2025',
      fr: 'Hacker · Ethereum 2025',
      de: 'Hacker · Ethereum 2025',
      zh: '黑客松选手 · Ethereum 2025',
      hi: 'हैकर · Ethereum 2025',
    },
    detail: {
      es: 'Hackathon global de Ethereum y ETH Argentina: 96 h de código',
      en: 'A global Ethereum hackathon and ETH Argentina: 96 h of code',
      pt: 'Hackathon global de Ethereum e ETH Argentina: 96 h de código',
      fr: 'Un hackathon Ethereum mondial et ETH Argentina : 96 h de code',
      de: 'Ein globaler Ethereum-Hackathon und ETH Argentina: 96 h Code',
      zh: '全球以太坊黑客松与 ETH Argentina：96 小时编码',
      hi: 'एक ग्लोबल Ethereum हैकाथॉन और ETH Argentina: 96 घंटे कोडिंग',
    },
    org: 'Ethereum',
    mark: 'ETH',
  },
  {
    id: 'nasa-open-science',
    date: '2024-10',
    title: {
      es: 'Certificación NASA Open Science',
      en: 'NASA Open Science certificate',
      pt: 'Certificação NASA Open Science',
      fr: 'Certification NASA Open Science',
      de: 'Zertifikat NASA Open Science',
      zh: 'NASA 开放科学认证',
      hi: 'NASA Open Science प्रमाणपत्र',
    },
    detail: {
      es: 'Principios y prácticas de ciencia abierta',
      en: 'Open science principles and practices',
      pt: 'Princípios e práticas de ciência aberta',
      fr: 'Principes et pratiques de la science ouverte',
      de: 'Prinzipien und Praxis offener Wissenschaft',
      zh: '开放科学的原则与实践',
      hi: 'ओपन साइंस के सिद्धांत और तरीके',
    },
    org: 'NASA',
    mark: 'NASA',
  },
];

/** Most recent first. */
export const sortedAchievements = [...achievements].sort((a, b) => b.date.localeCompare(a.date));

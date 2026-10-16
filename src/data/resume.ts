import type { Localized } from '@/i18n/locales';

export interface Role {
  id: string;
  title: Localized;
  company: string;
  companyUrl?: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; omitted while the role is ongoing. */
  end?: string;
  location: Localized;
  summary: Localized;
}

const saltaArgentina: Localized = {
  es: 'Salta, Argentina',
  en: 'Salta, Argentina',
  pt: 'Salta, Argentina',
  fr: 'Salta, Argentine',
  de: 'Salta, Argentinien',
  zh: '阿根廷萨尔塔',
  hi: 'साल्टा, अर्जेंटीना',
};

export const roles: Role[] = [
  {
    id: 'cosmos',
    title: { es: 'Founder', en: 'Founder', pt: 'Founder', fr: 'Fondateur', de: 'Gründer', zh: '创始人', hi: 'फाउंडर' },
    company: 'Cosmos · Cosmos Pay',
    companyUrl: 'https://cosmospay.lat',
    start: '2026-02',
    location: saltaArgentina,
    summary: {
      es: 'Ecosistema multichain de pagos y comercio para Latinoamérica. Lidero producto y desarrollo de Cosmos Pay: Payments API, wallet no custodial, SDK en TypeScript y plataforma para desarrolladores sobre Stellar, Solana y Monad.',
      en: 'A multichain payments and commerce ecosystem for Latin America. I lead product and engineering for Cosmos Pay: the Payments API, a non-custodial wallet, a TypeScript SDK and a developer platform on Stellar, Solana and Monad.',
      pt: 'Ecossistema multichain de pagamentos e comércio para a América Latina. Lidero produto e desenvolvimento da Cosmos Pay: Payments API, wallet não custodial, SDK em TypeScript e plataforma para desenvolvedores em Stellar, Solana e Monad.',
      fr: 'Un écosystème multichain de paiements et de commerce pour l’Amérique latine. Je dirige le produit et le développement de Cosmos Pay : Payments API, wallet non custodial, SDK TypeScript et plateforme pour développeurs sur Stellar, Solana et Monad.',
      de: 'Ein Multichain-Ökosystem für Zahlungen und Handel in Lateinamerika. Ich leite Produkt und Entwicklung von Cosmos Pay: Payments API, Non-Custodial-Wallet, TypeScript-SDK und Entwicklerplattform auf Stellar, Solana und Monad.',
      zh: '面向拉丁美洲的多链支付与商业生态系统。我负责 Cosmos Pay 的产品与研发：Payments API、非托管钱包、TypeScript SDK，以及基于 Stellar、Solana 和 Monad 的开发者平台。',
      hi: 'लैटिन अमेरिका के लिए मल्टीचेन पेमेंट्स और कॉमर्स इकोसिस्टम। मैं Cosmos Pay के प्रोडक्ट और डेवलपमेंट का नेतृत्व करता हूँ: Payments API, नॉन-कस्टोडियल वॉलेट, TypeScript SDK और Stellar, Solana व Monad पर डेवलपर प्लेटफ़ॉर्म।',
    },
  },
  {
    id: 'cloudycoding',
    title: { es: 'CEO', en: 'CEO', pt: 'CEO', fr: 'CEO', de: 'CEO', zh: 'CEO', hi: 'CEO' },
    company: 'CloudyCoding',
    start: '2018-02',
    location: { es: 'Argentina', en: 'Argentina', pt: 'Argentina', fr: 'Argentine', de: 'Argentinien', zh: '阿根廷', hi: 'अर्जेंटीना' },
    summary: {
      es: 'Estudio de software: sitios, aplicaciones y backends a medida para clientes, librerías open source y apoyo a la comunidad tech local con infraestructura gratuita.',
      en: 'A software studio: custom websites, apps and backends for clients, open source libraries, and free infrastructure for the local tech community.',
      pt: 'Estúdio de software: sites, aplicativos e backends sob medida para clientes, bibliotecas open source e apoio à comunidade tech local com infraestrutura gratuita.',
      fr: 'Un studio logiciel : sites, applications et backends sur mesure pour des clients, bibliothèques open source et infrastructure gratuite pour la communauté tech locale.',
      de: 'Ein Softwarestudio: maßgeschneiderte Websites, Apps und Backends für Kunden, Open-Source-Bibliotheken und kostenlose Infrastruktur für die lokale Tech-Community.',
      zh: '软件工作室：为客户定制网站、应用和后端，维护开源库，并为本地技术社区提供免费基础设施。',
      hi: 'एक सॉफ़्टवेयर स्टूडियो: क्लाइंट्स के लिए कस्टम वेबसाइट्स, ऐप्स और बैकएंड, ओपन सोर्स लाइब्रेरीज़ और स्थानीय टेक कम्युनिटी के लिए मुफ़्त इंफ्रास्ट्रक्चर।',
    },
  },
  {
    id: 'saltadev',
    title: {
      es: 'Full Stack Developer',
      en: 'Full Stack Developer',
      pt: 'Desenvolvedor Full Stack',
      fr: 'Développeur full stack',
      de: 'Full-Stack-Entwickler',
      zh: '全栈开发者',
      hi: 'फुल स्टैक डेवलपर',
    },
    company: 'SaltaDev',
    companyUrl: 'https://salta.dev.ar',
    start: '2025-02',
    location: {
      es: 'Salta, Argentina · remoto',
      en: 'Salta, Argentina · remote',
      pt: 'Salta, Argentina · remoto',
      fr: 'Salta, Argentine · à distance',
      de: 'Salta, Argentinien · remote',
      zh: '阿根廷萨尔塔 · 远程',
      hi: 'साल्टा, अर्जेंटीना · रिमोट',
    },
    summary: {
      es: 'Desarrollo front end y full stack para la comunidad SaltaDev, y participación en hackathons y eventos tech de la región.',
      en: 'Front end and full stack development for the SaltaDev community, plus hackathons and tech events across the region.',
      pt: 'Desenvolvimento front end e full stack para a comunidade SaltaDev, além de participação em hackathons e eventos de tecnologia da região.',
      fr: 'Développement front end et full stack pour la communauté SaltaDev, ainsi que hackathons et événements tech dans la région.',
      de: 'Frontend- und Full-Stack-Entwicklung für die SaltaDev-Community sowie Hackathons und Tech-Events in der Region.',
      zh: '为 SaltaDev 社区进行前端和全栈开发，并参与本地区的黑客松和技术活动。',
      hi: 'SaltaDev कम्युनिटी के लिए फ्रंट एंड और फुल स्टैक डेवलपमेंट, साथ ही क्षेत्र के हैकाथॉन और टेक इवेंट्स में भागीदारी।',
    },
  },
  {
    id: 'freelance',
    title: {
      es: 'Programador independiente',
      en: 'Independent developer',
      pt: 'Desenvolvedor independente',
      fr: 'Développeur indépendant',
      de: 'Freiberuflicher Entwickler',
      zh: '独立开发者',
      hi: 'स्वतंत्र डेवलपर',
    },
    company: 'Freelance',
    start: '2018-11',
    location: { es: 'Remoto', en: 'Remote', pt: 'Remoto', fr: 'À distance', de: 'Remote', zh: '远程', hi: 'रिमोट' },
    summary: {
      es: 'Proyectos web y backend para terceros con Node.js, Java, Go y MongoDB: e-commerce, plataformas en tiempo real con WebSockets, bots y dashboards.',
      en: 'Web and backend projects for clients with Node.js, Java, Go and MongoDB: e-commerce, real-time platforms with WebSockets, bots and dashboards.',
      pt: 'Projetos web e backend para clientes com Node.js, Java, Go e MongoDB: e-commerce, plataformas em tempo real com WebSockets, bots e dashboards.',
      fr: 'Projets web et backend pour des clients avec Node.js, Java, Go et MongoDB : e-commerce, plateformes temps réel avec WebSockets, bots et tableaux de bord.',
      de: 'Web- und Backend-Projekte für Kunden mit Node.js, Java, Go und MongoDB: E-Commerce, Echtzeitplattformen mit WebSockets, Bots und Dashboards.',
      zh: '使用 Node.js、Java、Go 和 MongoDB 为客户开发 Web 与后端项目：电商、基于 WebSocket 的实时平台、机器人和数据看板。',
      hi: 'Node.js, Java, Go और MongoDB के साथ क्लाइंट्स के लिए वेब और बैकएंड प्रोजेक्ट्स: ई-कॉमर्स, WebSockets वाले रियल-टाइम प्लेटफ़ॉर्म, बॉट्स और डैशबोर्ड।',
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

/** Underlined labels at the bottom of the dark section, as in the design. */
export const coreStack = ['TypeScript', 'Node.js', 'Stellar · Soroban', 'Solidity', 'Rust', 'Go'];

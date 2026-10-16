import type { Localized } from '@/i18n/locales';

export type ServiceId = 'custom-software' | 'payments' | 'blockchain' | 'sdk-api';

export interface Service {
  id: ServiceId;
  title: Localized;
  description: Localized;
  tags: string[];
  /** Value sent by the contact form (English, so every inquiry reads the same). */
  formValue: string;
}

export const services: Service[] = [
  {
    id: 'custom-software',
    title: {
      es: 'Software a medida',
      en: 'Custom software',
      pt: 'Software sob medida',
      fr: 'Logiciel sur mesure',
      de: 'Individuelle Software',
      zh: '定制软件',
      hi: 'कस्टम सॉफ़्टवेयर',
    },
    description: {
      es: 'Plataformas web, dashboards, APIs y backends hechos para tu operación, listos para producción y para escalar.',
      en: 'Web platforms, dashboards, APIs and backends built around your operation, production-ready and made to scale.',
      pt: 'Plataformas web, dashboards, APIs e backends feitos para a sua operação, prontos para produção e para escalar.',
      fr: 'Plateformes web, tableaux de bord, API et backends pensés pour votre activité, prêts pour la production et pour grandir.',
      de: 'Webplattformen, Dashboards, APIs und Backends, zugeschnitten auf dein Geschäft – produktionsreif und skalierbar.',
      zh: '围绕你的业务打造的 Web 平台、数据看板、API 和后端，可直接上线并随业务扩展。',
      hi: 'आपके काम के हिसाब से बने वेब प्लेटफ़ॉर्म, डैशबोर्ड, API और बैकएंड — प्रोडक्शन के लिए तैयार और स्केल करने लायक।',
    },
    tags: ['TypeScript', 'Node.js', 'Astro / React', 'PostgreSQL'],
    formValue: 'Custom software',
  },
  {
    id: 'payments',
    title: {
      es: 'Integración de pagos',
      en: 'Payment integrations',
      pt: 'Integração de pagamentos',
      fr: 'Intégration de paiements',
      de: 'Zahlungsintegration',
      zh: '支付集成',
      hi: 'पेमेंट इंटीग्रेशन',
    },
    description: {
      es: 'Cobros con pasarelas locales, bancos y stablecoins: checkout, links de pago, webhooks y conciliación. Desde Mercado Pago hasta USDC con Cosmos Pay.',
      en: 'Get paid through local gateways, banks and stablecoins: checkout, payment links, webhooks and reconciliation. From Mercado Pago to USDC with Cosmos Pay.',
      pt: 'Receba com gateways locais, bancos e stablecoins: checkout, links de pagamento, webhooks e conciliação. Do Mercado Pago ao USDC com a Cosmos Pay.',
      fr: 'Encaissez via des passerelles locales, des banques et des stablecoins : checkout, liens de paiement, webhooks et rapprochement. De Mercado Pago à l’USDC avec Cosmos Pay.',
      de: 'Zahlungen über lokale Gateways, Banken und Stablecoins: Checkout, Zahlungslinks, Webhooks und Abgleich. Von Mercado Pago bis USDC mit Cosmos Pay.',
      zh: '通过本地支付网关、银行和稳定币收款：结账、支付链接、Webhook 与对账。从 Mercado Pago 到使用 Cosmos Pay 的 USDC。',
      hi: 'लोकल गेटवे, बैंक और स्टेबलकॉइन्स से भुगतान लें: चेकआउट, पेमेंट लिंक, वेबहुक और रिकंसिलिएशन। Mercado Pago से लेकर Cosmos Pay के साथ USDC तक।',
    },
    tags: ['Cosmos Pay', 'Mercado Pago', 'USDC', 'Webhooks'],
    formValue: 'Payment integration',
  },
  {
    id: 'blockchain',
    title: {
      es: 'Productos blockchain',
      en: 'Blockchain products',
      pt: 'Produtos blockchain',
      fr: 'Produits blockchain',
      de: 'Blockchain-Produkte',
      zh: '区块链产品',
      hi: 'ब्लॉकचेन प्रोडक्ट्स',
    },
    description: {
      es: 'Wallets, smart contracts y dApps sobre Stellar, Solana y redes EVM, con foco en seguridad y en una experiencia que cualquiera pueda usar.',
      en: 'Wallets, smart contracts and dApps on Stellar, Solana and EVM chains, focused on security and an experience anyone can use.',
      pt: 'Wallets, smart contracts e dApps em Stellar, Solana e redes EVM, com foco em segurança e numa experiência que qualquer pessoa consiga usar.',
      fr: 'Wallets, smart contracts et dApps sur Stellar, Solana et les réseaux EVM, axés sur la sécurité et une expérience accessible à tous.',
      de: 'Wallets, Smart Contracts und dApps auf Stellar, Solana und EVM-Chains – mit Fokus auf Sicherheit und einer Erfahrung, die jeder nutzen kann.',
      zh: '基于 Stellar、Solana 和 EVM 链的钱包、智能合约和 dApp，注重安全性和人人都能上手的体验。',
      hi: 'Stellar, Solana और EVM चेन पर वॉलेट, स्मार्ट कॉन्ट्रैक्ट्स और dApps — सुरक्षा और ऐसे अनुभव पर फ़ोकस जिसे कोई भी इस्तेमाल कर सके।',
    },
    tags: ['Soroban', 'Solidity', 'Rust', 'Stellar SDK'],
    formValue: 'Blockchain product',
  },
  {
    id: 'sdk-api',
    title: {
      es: 'SDKs y APIs para developers',
      en: 'SDKs & APIs for developers',
      pt: 'SDKs e APIs para devs',
      fr: 'SDK et API pour développeurs',
      de: 'SDKs & APIs für Entwickler',
      zh: '面向开发者的 SDK 与 API',
      hi: 'डेवलपर्स के लिए SDK और API',
    },
    description: {
      es: 'Librerías, documentación y plataformas para que otros equipos integren tu producto en minutos. Como MacroClickJS: 15.000 descargas en una semana.',
      en: 'Libraries, docs and developer platforms so other teams can integrate your product in minutes. Like MacroClickJS: 15,000 downloads in one week.',
      pt: 'Bibliotecas, documentação e plataformas para que outros times integrem seu produto em minutos. Como o MacroClickJS: 15.000 downloads em uma semana.',
      fr: 'Bibliothèques, documentation et plateformes pour que d’autres équipes intègrent votre produit en quelques minutes. Comme MacroClickJS : 15 000 téléchargements en une semaine.',
      de: 'Bibliotheken, Dokumentation und Plattformen, mit denen andere Teams dein Produkt in Minuten integrieren. Wie MacroClickJS: 15.000 Downloads in einer Woche.',
      zh: '提供库、文档和开发者平台，让其他团队几分钟内就能集成你的产品。比如 MacroClickJS：一周 15,000 次下载。',
      hi: 'लाइब्रेरी, डॉक्यूमेंटेशन और डेवलपर प्लेटफ़ॉर्म, ताकि दूसरी टीमें मिनटों में आपका प्रोडक्ट इंटीग्रेट कर सकें। जैसे MacroClickJS: एक हफ़्ते में 15,000 डाउनलोड।',
    },
    tags: ['npm', 'OpenAPI', 'Docs', 'CI/CD'],
    formValue: 'SDK / API',
  },
];

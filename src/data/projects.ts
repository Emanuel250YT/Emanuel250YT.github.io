import type { Localized } from '@/i18n/locales';
import { byFileName } from '@/lib/images';

/** Drawn cover (HTML/CSS, see ProjectCover.astro) of a project without a screenshot. */
export type CoverKind = 'checkout' | 'wallet' | 'code' | 'storage' | 'social' | 'terminal';

export interface Project {
  id: string;
  name: string;
  tagline: Localized;
  description: Localized;
  tags: Localized<[string, string, string]>;
  /** Main link of the card (site or repository). */
  url?: string;
  repo?: string;
  year: string;
  tech: string[];
  cover: CoverKind;
  /** Screenshot of the live site, from src/assets/projects/ (see below). */
  image?: ImageMetadata | undefined;
}

/**
 * Screenshots of the live sites, picked up by id: src/assets/projects/<id>.jpg (4:3, taken
 * from the page the card links to). A project without one keeps its drawn cover. While
 * the list is empty the Projects section, its menu link and its JSON-LD list stay out of
 * the home page and the next sections renumber.
 */
const screenshots = byFileName(import.meta.glob<ImageMetadata>('/src/assets/projects/*.jpg', { eager: true, import: 'default' }));

const entries: Project[] = [
  {
    id: 'stellar-snap',
    name: 'Stellar Snap',
    tagline: {
      es: 'Stellar y Soroban dentro de MetaMask',
      en: 'Stellar and Soroban inside MetaMask',
      pt: 'Stellar e Soroban dentro do MetaMask',
      fr: 'Stellar et Soroban dans MetaMask',
      de: 'Stellar und Soroban in MetaMask',
      zh: '在 MetaMask 中使用 Stellar 与 Soroban',
      hi: 'MetaMask के अंदर Stellar और Soroban',
    },
    description: {
      es: 'MetaMask Snap open source que suma cuentas de Stellar y Soroban a MetaMask: enviar, recibir, hacer swaps y firmar sin instalar otra wallet, con una API estándar SEP-43 para dApps.',
      en: 'An open source MetaMask Snap that adds Stellar and Soroban accounts to MetaMask: send, receive, swap and sign without installing another wallet, with a standard SEP-43 API for dApps.',
      pt: 'Um MetaMask Snap open source que adiciona contas Stellar e Soroban ao MetaMask: enviar, receber, fazer swaps e assinar sem instalar outra wallet, com uma API padrão SEP-43 para dApps.',
      fr: 'Un MetaMask Snap open source qui ajoute des comptes Stellar et Soroban à MetaMask : envoyer, recevoir, échanger et signer sans installer d’autre wallet, avec une API standard SEP-43 pour les dApps.',
      de: 'Ein Open-Source-MetaMask-Snap, der MetaMask Stellar- und Soroban-Konten hinzufügt: senden, empfangen, tauschen und signieren ohne weitere Wallet, mit einer Standard-API nach SEP-43 für dApps.',
      zh: '开源 MetaMask Snap，为 MetaMask 添加 Stellar 与 Soroban 账户：无需安装其他钱包即可转账、收款、兑换和签名，并为 dApp 提供标准 SEP-43 API。',
      hi: 'एक ओपन सोर्स MetaMask Snap जो MetaMask में Stellar और Soroban अकाउंट जोड़ता है: दूसरा वॉलेट इंस्टॉल किए बिना भेजें, पाएं, स्वैप करें और साइन करें, dApps के लिए मानक SEP-43 API के साथ।',
    },
    tags: {
      es: ['MetaMask Snap', 'Open source', 'SEP-43'],
      en: ['MetaMask Snap', 'Open source', 'SEP-43'],
      pt: ['MetaMask Snap', 'Open source', 'SEP-43'],
      fr: ['MetaMask Snap', 'Open source', 'SEP-43'],
      de: ['MetaMask Snap', 'Open Source', 'SEP-43'],
      zh: ['MetaMask Snap', '开源', 'SEP-43'],
      hi: ['MetaMask Snap', 'ओपन सोर्स', 'SEP-43'],
    },
    url: 'https://snap.cosmospay.lat/',
    repo: 'https://github.com/CosmosPay/Stellar-Snap',
    year: '2026',
    tech: ['TypeScript', 'MetaMask Snaps', 'Stellar', 'Soroban'],
    cover: 'wallet',
  },
  {
    id: 'cosmos-pay',
    name: 'Cosmos Pay',
    tagline: {
      es: 'Pasarela de pagos para LATAM',
      en: 'Payment gateway for LATAM',
      pt: 'Gateway de pagamentos para a LATAM',
      fr: 'Passerelle de paiement pour la LATAM',
      de: 'Zahlungs-Gateway für LATAM',
      zh: '面向拉美的支付网关',
      hi: 'LATAM के लिए पेमेंट गेटवे',
    },
    description: {
      es: 'Infraestructura de pagos para desarrolladores: payment intents, webhooks, stablecoins y rampas fiat, con liquidación en segundos y comisiones de fracciones de centavo.',
      en: 'Payments infrastructure for developers: payment intents, webhooks, stablecoins and fiat ramps, settling in seconds for fractions of a cent.',
      pt: 'Infraestrutura de pagamentos para desenvolvedores: payment intents, webhooks, stablecoins e rampas fiat, com liquidação em segundos e taxas de frações de centavo.',
      fr: 'Une infrastructure de paiement pour les développeurs : payment intents, webhooks, stablecoins et rampes fiat, avec un règlement en quelques secondes pour une fraction de centime.',
      de: 'Zahlungsinfrastruktur für Entwickler: Payment Intents, Webhooks, Stablecoins und Fiat-Rampen, mit Abwicklung in Sekunden für Bruchteile eines Cents.',
      zh: '面向开发者的支付基础设施：支付意图、Webhook、稳定币和法币出入金通道，数秒内完成结算，手续费不到一美分。',
      hi: 'डेवलपर्स के लिए पेमेंट इंफ्रास्ट्रक्चर: पेमेंट इंटेंट्स, वेबहुक्स, स्टेबलकॉइन्स और फ़िएट रैंप्स, सेकंडों में सेटलमेंट और एक सेंट से भी कम फ़ीस।',
    },
    tags: {
      es: ['Founder', 'Producto', 'Stellar · Solana · Monad'],
      en: ['Founder', 'Product', 'Stellar · Solana · Monad'],
      pt: ['Founder', 'Produto', 'Stellar · Solana · Monad'],
      fr: ['Fondateur', 'Produit', 'Stellar · Solana · Monad'],
      de: ['Gründer', 'Produkt', 'Stellar · Solana · Monad'],
      zh: ['创始人', '产品', 'Stellar · Solana · Monad'],
      hi: ['फाउंडर', 'प्रोडक्ट', 'Stellar · Solana · Monad'],
    },
    url: 'https://cosmospay.lat',
    repo: 'https://github.com/CosmosPay',
    year: '2026',
    tech: ['TypeScript', 'NestJS', 'Astro', 'PostgreSQL', 'Stellar', 'APISIX'],
    cover: 'checkout',
  },
  {
    id: 'cosmos-pay-wallet',
    name: 'Cosmos Pay Wallet',
    tagline: {
      es: 'Wallet no custodial multiplataforma',
      en: 'Cross-platform non-custodial wallet',
      pt: 'Wallet não custodial multiplataforma',
      fr: 'Wallet non custodial multiplateforme',
      de: 'Plattformübergreifende Non-Custodial-Wallet',
      zh: '跨平台非托管钱包',
      hi: 'क्रॉस-प्लेटफ़ॉर्म नॉन-कस्टोडियल वॉलेट',
    },
    description: {
      es: 'Wallet de Stellar como extensión de navegador, app Android, web y desktop: enviar, hacer swaps y seguir tu actividad, con tus 12 palabras como única llave.',
      en: 'A Stellar wallet shipped as a browser extension, Android app, web and desktop: send, swap and track activity, with your 12 words as the only key.',
      pt: 'Wallet Stellar como extensão de navegador, app Android, web e desktop: enviar, fazer swaps e acompanhar sua atividade, com suas 12 palavras como única chave.',
      fr: 'Un wallet Stellar en extension de navigateur, app Android, web et desktop : envoyer, échanger et suivre son activité, avec ses 12 mots comme seule clé.',
      de: 'Eine Stellar-Wallet als Browser-Erweiterung, Android-App, Web- und Desktop-App: senden, tauschen und Aktivitäten verfolgen, mit deinen 12 Wörtern als einzigem Schlüssel.',
      zh: 'Stellar 钱包，提供浏览器扩展、Android 应用、网页版和桌面版：转账、兑换、查看动态，你的 12 个助记词就是唯一的钥匙。',
      hi: 'ब्राउज़र एक्सटेंशन, Android ऐप, वेब और डेस्कटॉप के रूप में Stellar वॉलेट: भेजें, स्वैप करें और अपनी गतिविधि देखें। आपके 12 शब्द ही एकमात्र चाबी हैं।',
    },
    tags: {
      es: ['Extensión', 'Android', 'Desktop'],
      en: ['Extension', 'Android', 'Desktop'],
      pt: ['Extensão', 'Android', 'Desktop'],
      fr: ['Extension', 'Android', 'Desktop'],
      de: ['Erweiterung', 'Android', 'Desktop'],
      zh: ['浏览器扩展', 'Android', '桌面端'],
      hi: ['एक्सटेंशन', 'Android', 'डेस्कटॉप'],
    },
    url: 'https://cosmospay.lat/wallet/',
    repo: 'https://github.com/CosmosPay/CosmosPay-Wallet',
    year: '2026',
    tech: ['TypeScript', 'Astro', 'Rust', 'Kotlin', 'Stellar'],
    cover: 'wallet',
  },

];

export const projects: Project[] = entries.map((project) => ({ ...project, image: screenshots[project.id] }));

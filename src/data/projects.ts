import type { Localized } from '@/i18n/locales';

/** Cada portada se dibuja en HTML/CSS (sin imagenes): ver ProjectCover.astro. */
export type CoverKind = 'checkout' | 'wallet' | 'code' | 'storage' | 'social' | 'terminal';

export interface Project {
  id: string;
  name: string;
  tagline: Localized;
  description: Localized;
  tags: Localized<[string, string, string]>;
  /** Enlace principal de la tarjeta (sitio o repo). */
  url?: string;
  repo?: string;
  year: string;
  tech: string[];
  cover: CoverKind;
}

export const projects: Project[] = [
  {
    id: 'cosmos-pay',
    name: 'Cosmos Pay',
    tagline: { es: 'Pasarela de pagos para LATAM', en: 'Payment gateway for LATAM' },
    description: {
      es: 'Infraestructura de pagos para desarrolladores: payment intents, webhooks, stablecoins y rampas fiat, con liquidación en segundos y comisiones de fracciones de centavo.',
      en: 'Payments infrastructure for developers: payment intents, webhooks, stablecoins and fiat ramps, settling in seconds for fractions of a cent.',
    },
    tags: {
      es: ['Founder', 'Producto', 'Stellar · Solana · Monad'],
      en: ['Founder', 'Product', 'Stellar · Solana · Monad'],
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
    tagline: { es: 'Wallet no custodial multiplataforma', en: 'Cross-platform non-custodial wallet' },
    description: {
      es: 'Wallet de Stellar como extensión de navegador, app Android, web y desktop: enviar, hacer swaps y seguir tu actividad, con tus 12 palabras como única llave.',
      en: 'A Stellar wallet shipped as a browser extension, Android app, web and desktop: send, swap and track activity, with your 12 words as the only key.',
    },
    tags: {
      es: ['Extensión', 'Android', 'Desktop'],
      en: ['Extension', 'Android', 'Desktop'],
    },
    url: 'https://github.com/CosmosPay/CosmosPay-Wallet',
    repo: 'https://github.com/CosmosPay/CosmosPay-Wallet',
    year: '2026',
    tech: ['TypeScript', 'Astro', 'Rust', 'Kotlin', 'Stellar'],
    cover: 'wallet',
  },
  {
    id: 'bancasdk',
    name: 'BancaSDK',
    tagline: { es: 'SDK multi-banco en TypeScript', en: 'Multi-bank TypeScript SDK' },
    description: {
      es: 'Evolución de MacroClickJS, la librería para integrar la pasarela de Banco Macro que superó las 15.000 descargas en su primera semana. Un cliente unificado para integraciones bancarias.',
      en: 'The evolution of MacroClickJS, the library for Banco Macro’s payment gateway that passed 15,000 downloads in its first week. One client for banking integrations.',
    },
    tags: {
      es: ['Open source', 'npm', '15k+ descargas'],
      en: ['Open source', 'npm', '15k+ downloads'],
    },
    year: '2026',
    tech: ['TypeScript', 'Zod', 'Vitest'],
    cover: 'code',
  },
  {
    id: 'soladb-monadb',
    name: 'SolaDB & MonaDB',
    tagline: { es: 'Storage privado y replicado on-chain', en: 'Private, replicated on-chain storage' },
    description: {
      es: 'Archivos cifrados en el navegador, fragmentados con Reed-Solomon y guardados por nodos que cobran por cada copia, verificada con pruebas de almacenamiento on-chain.',
      en: 'Files encrypted in the browser, sharded with Reed-Solomon and kept by nodes paid for every copy, checked with on-chain storage proofs.',
    },
    tags: {
      es: ['Protocolo', 'Solana', 'Monad'],
      en: ['Protocol', 'Solana', 'Monad'],
    },
    url: 'https://github.com/Emanuel250YT/SolaDB',
    repo: 'https://github.com/Emanuel250YT/SolaDB',
    year: '2026',
    tech: ['Rust', 'Solidity', 'TypeScript'],
    cover: 'storage',
  },
  {
    id: 'aside-arkacdn',
    name: 'ASide & ArkaCDN',
    tagline: { es: 'SDKs para construir sobre Arkiv', en: 'SDKs to build on Arkiv' },
    description: {
      es: 'ArkaCDN convierte a Arkiv en una capa de distribución de contenido; ASide suma perfiles, grafo social, feed, eventos y más de 70 features. Más de 1.000 descargas en 3 días.',
      en: 'ArkaCDN turns Arkiv into a content distribution layer; ASide adds profiles, a social graph, feeds, events and 70+ features. Over 1,000 downloads in 3 days.',
    },
    tags: {
      es: ['Open source', 'npm', 'Arkiv'],
      en: ['Open source', 'npm', 'Arkiv'],
    },
    url: 'https://aside.cloudycoding.com',
    repo: 'https://github.com/Emanuel250YT/ASide',
    year: '2026',
    tech: ['TypeScript', 'WebCrypto', 'Arkiv'],
    cover: 'social',
  },
  {
    id: 'stellar-orchestra',
    name: 'StellarOrchestra',
    tagline: { es: 'Agentes de IA que cobran con x402', en: 'AI agents that get paid via x402' },
    description: {
      es: 'Orquestador self-hosted de agentes de IA: registrás tus agentes, compartís API keys y cobrás por tarea con pagos x402 sobre Stellar.',
      en: 'A self-hosted AI agent orchestrator: register your agents, share API keys and charge per task with x402 payments on Stellar.',
    },
    tags: {
      es: ['IA', 'Stellar', 'x402'],
      en: ['AI', 'Stellar', 'x402'],
    },
    url: 'https://github.com/Emanuel250YT/StellarOrchestra',
    repo: 'https://github.com/Emanuel250YT/StellarOrchestra',
    year: '2026',
    tech: ['TypeScript', 'Node.js', 'Stellar', 'Cloudflare Tunnel'],
    cover: 'terminal',
  },
];

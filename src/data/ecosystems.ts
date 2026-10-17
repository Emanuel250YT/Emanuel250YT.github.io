/**
 * Ecosystems and communities of the strip in the achievements section, in order, each
 * with its official logo drawn in one colour:
 * - `icon` alone reuses a symbol of the /logos.svg sprite (Stellar, Solana and Ethereum
 *   come from src/data/technologies.ts; the Stellar Development Foundation uses the
 *   Stellar mark, as it does itself).
 * - `icon` + `path` adds a symbol to the sprite, from the organisation's own site:
 *   Monad (monad.xyz logomark), Arkiv (arkiv.network icon), BAF (the BAF wordmark of
 *   blockchainacceleration.org). `ratio` (width / height) marks a logo wider than tall.
 * - `mask` is a monochrome PNG made by `npm run assets` from assets-src/logos/
 *   (official PNGs of Trustless Work and SaltaDev, which publish no vector logo).
 */
export type Ecosystem = { name: string } & (
  | { icon: string; viewBox?: string; path?: string; ratio?: number }
  | { mask: string }
);

export const ecosystems: Ecosystem[] = [
  { name: 'Stellar', icon: 'stellar' },
  { name: 'Solana', icon: 'solana' },
  { name: 'Monad', icon: 'monad', viewBox: '0 0 23.57 24', path: 'M11.782 0C8.37963 0 0 8.53443 0 11.9999C0 15.4654 8.37963 24 11.782 24C15.1844 24 23.5642 15.4653 23.5642 11.9999C23.5642 8.53458 15.1845 0 11.782 0ZM9.94598 18.8619C8.51124 18.4637 4.65378 11.5912 5.04481 10.1299C5.43584 8.66856 12.1834 4.73984 13.6181 5.1381C15.0529 5.5363 18.9104 12.4087 18.5194 13.87C18.1283 15.3314 11.3807 19.2602 9.94598 18.8619Z' },
  { name: 'Ethereum', icon: 'ethereum' },
  { name: 'Arkiv', icon: 'arkiv', viewBox: '0 0 54 30.24', path: 'M47.1367 0H53.9847V30.24H47.1367V25.664H49.4407V4.576H47.1367V0Z M37.1357 25.1202H31.9837L30.4157 20.2882H23.3117L21.7117 25.1202H16.8477V23.3282L24.2717 2.72021H29.6797L37.1357 23.3282V25.1202ZM28.8797 15.6802L26.8957 9.56822L24.8477 15.6802H28.8797Z M6.848 30.24H0V0H6.848V4.576H4.544V25.664H6.848V30.24Z' },
  { name: 'Stellar Development Foundation', icon: 'stellar' },
  { name: 'Blockchain Acceleration Foundation', icon: 'baf', viewBox: '0.43 0 84.57 25.24', path: 'M40.2403 15.9121L31.022 25.1317L29.6125 23.7222L38.8519 14.4828C39.176 15.0756 39.6581 15.5709 40.239 15.9121H40.2403Z M54.7411 1.73622V25.2311H52.7481V3.40257L45.3411 10.8109C44.9986 10.2274 44.5046 9.74525 43.9105 9.42383L53.1683 0.166031H53.1723L54.7411 1.73622Z M85 1.99417V0.00244904H60.4934V11.6432V13.6362V25.2309H62.4864V13.6362H77.3124V11.6432H62.4864V1.99417H85Z M23.6138 1.57964C22.7233 0.566655 21.4284 0.000228882 20.0795 0.000228882H0.492981V25.23H20.0795C21.4284 25.23 22.7246 24.6635 23.6138 23.6506C27.1019 19.679 25.9453 14.7418 22.4559 12.6158C25.9453 10.4897 27.1019 5.55122 23.6138 1.58096V1.57964ZM20.0901 11.6186H2.4847V1.99195H18.9164C22.8142 1.99195 25.6437 6.64851 22.1371 10.6899C21.6234 11.2814 20.8752 11.6186 20.0914 11.6186H20.0901ZM20.0901 23.2369H2.4847V13.6116H18.9164C22.8142 13.6116 25.6437 18.2682 22.1358 22.3096C21.6221 22.901 20.8738 23.2383 20.0901 23.2383V23.2369Z M49.2915 0.997402C49.2915 1.33594 49.3297 1.66921 49.4035 1.99326H33.8135V0.000228882H49.4061C49.3297 0.320326 49.2915 0.653596 49.2915 0.996088V0.997402Z M44.5386 11.6147C44.258 10.9876 43.7377 10.491 43.0962 10.2394C42.8446 10.138 42.5732 10.0761 42.29 10.0603C42.236 10.0563 42.1807 10.055 42.1267 10.055C40.6671 10.055 39.4816 11.2379 39.4816 12.6975C39.4816 13.04 39.5474 13.368 39.666 13.6683C39.9202 14.3098 40.4182 14.8275 41.0439 15.1081C41.3732 15.2582 41.7394 15.3399 42.1253 15.3399H42.1741C43.6099 15.3123 44.7678 14.1412 44.7678 12.6975C44.7678 12.3115 44.6848 11.944 44.536 11.6147H44.5386Z', ratio: 3.35 },
  { name: 'Trustless Work', mask: '/logos/trustless-work.png' },
  { name: 'SaltaDev', mask: '/logos/saltadev.png' },
];

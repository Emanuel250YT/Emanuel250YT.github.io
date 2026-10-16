#!/usr/bin/env node
/**
 * Generates the binary assets that are committed to the repository:
 *   - src/assets/portrait.png, src/assets/avatar.png  (black & white, from assets-src/portrait.png)
 *   - public/favicon.ico, apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png
 *   - public/og/og-<locale>.png                        (1200x630, one per locale)
 *   - public/[<locale>/]cv/emanuel-guzman-cv.pdf        (printed from /cv/, one per locale)
 *
 * Usage: npm run assets              (everything)
 *        npm run assets -- --no-cv   (skip the PDFs, no build needed)
 *
 * Requires Google Chrome / Chromium / Edge (set CHROME_PATH to force one).
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const withCv = !process.argv.includes('--no-cv');

// Keep in sync with src/i18n/locales.ts (plain Node cannot import TS sources).
const LOCALES = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi'];
const DEFAULT_LOCALE = 'es';
const localePrefix = (locale) => (locale === DEFAULT_LOCALE ? '' : `${locale}/`);

const BRAND_BG = '#111111';
const glyph = (scale = 1) => {
  // The "e." of the logo, centred on a 64x64 canvas.
  const t = (64 - 64 * scale) / 2;
  return `<g transform="translate(${t} ${t}) scale(${scale})"><path d="M17 33h23a11.5 11.5 0 1 0-3.4 8.2" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="43.5" r="3.8" fill="#fff"/></g>`;
};
const iconSvg = ({ radius = 14, scale = 1 } = {}) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${radius}" fill="${BRAND_BG}"/>${glyph(scale)}</svg>`,
  );

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error('Chrome/Chromium not found. Set CHROME_PATH.');
  return found;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve(output) : reject(new Error(`${command} exited with ${code}\n${output}`))));
  });
}

/** Black & white hero portrait and footer avatar, both keeping the transparent background. */
async function portraits() {
  const source = path.join(root, 'assets-src', 'portrait.png');
  const bw = (image) => image.grayscale().linear(1.06, -6);
  const trimmed = await sharp(source).trim({ threshold: 1 }).toBuffer();
  await bw(sharp(trimmed)).png({ compressionLevel: 9 }).toFile(path.join(root, 'src/assets/portrait.png'));
  await bw(sharp(source).extract({ left: 240, top: 35, width: 300, height: 300 }))
    .resize(160, 160)
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'src/assets/avatar.png'));
  console.log('✓ portraits');
}

/** ICO with embedded PNGs (supported since Windows Vista and by every browser). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((png) => png.data)]);
}

async function icons() {
  const png = (svg, size) => sharp(svg, { density: 512 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(path.join(pub, 'icon-192.png'), await png(iconSvg(), 192));
  await writeFile(path.join(pub, 'icon-512.png'), await png(iconSvg(), 512));
  // iOS rounds the corners itself: full background, no transparent corners.
  await writeFile(path.join(pub, 'apple-touch-icon.png'), await png(iconSvg({ radius: 0, scale: 0.86 }), 180));
  // Maskable: the glyph stays inside the 80 % safe zone.
  await writeFile(path.join(pub, 'icon-maskable-512.png'), await png(iconSvg({ radius: 0, scale: 0.7 }), 512));
  const ico = buildIco([
    { size: 32, data: await png(iconSvg(), 32) },
    { size: 48, data: await png(iconSvg(), 48) },
  ]);
  await writeFile(path.join(pub, 'favicon.ico'), ico);
  console.log('✓ icons');
}

/** End-user copy of the Open Graph cards (this is content, hence localized). */
const OG_COPY = {
  es: {
    lang: 'es-AR',
    role: 'DESARROLLADOR FULL STACK',
    title: '<span class="m">De</span> ideas complejas<br><span class="m">a</span> productos reales.',
    sub: 'Software a medida · Integración de pagos · Productos blockchain',
  },
  en: {
    lang: 'en',
    role: 'FULL STACK DEVELOPER',
    title: '<span class="m">Turning</span> complex ideas<br><span class="m">into</span> real products.',
    sub: 'Custom software · Payment integrations · Blockchain products',
  },
  pt: {
    lang: 'pt-BR',
    role: 'DESENVOLVEDOR FULL STACK',
    title: '<span class="m">De</span> ideias complexas<br><span class="m">a</span> produtos reais.',
    sub: 'Software sob medida · Integração de pagamentos · Produtos blockchain',
  },
  fr: {
    lang: 'fr',
    role: 'DÉVELOPPEUR FULL STACK',
    title: '<span class="m">Des</span> idées complexes<br><span class="m">aux</span> produits réels.',
    sub: 'Logiciel sur mesure · Intégration de paiements · Produits blockchain',
  },
  de: {
    lang: 'de',
    role: 'FULL-STACK-ENTWICKLER',
    title: '<span class="m">Von</span> komplexen Ideen<br><span class="m">zu</span> echten Produkten.',
    sub: 'Individuelle Software · Zahlungsintegration · Blockchain-Produkte',
  },
  zh: {
    lang: 'zh-CN',
    role: '全栈开发者',
    title: '<span class="m">从</span>复杂的想法<br><span class="m">到</span>真实的产品。',
    sub: '定制软件 · 支付集成 · 区块链产品',
  },
  hi: {
    lang: 'hi',
    role: 'फुल स्टैक डेवलपर',
    title: 'जटिल विचारों<span class="m"> से</span><br>असली प्रोडक्ट्स<span class="m"> तक।</span>',
    sub: 'कस्टम सॉफ़्टवेयर · पेमेंट इंटीग्रेशन · ब्लॉकचेन प्रोडक्ट्स',
  },
};

async function ogImages(chrome) {
  const fontUrl = pathToFileURL(
    path.join(root, 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'),
  ).href;
  const photo = await sharp(path.join(root, 'src/assets/portrait.png')).resize({ height: 640 }).png().toBuffer();
  const photoUrl = `data:image/png;base64,${photo.toString('base64')}`;
  const work = await mkdtemp(path.join(tmpdir(), 'og-'));
  await mkdir(path.join(pub, 'og'), { recursive: true });

  for (const locale of LOCALES) {
    const copy = OG_COPY[locale];
    const html = `<!doctype html><html lang="${copy.lang}"><head><meta charset="utf-8"><style>
      @font-face{font-family:SG;src:url('${fontUrl}') format('woff2');font-weight:300 700}
      *{box-sizing:border-box;margin:0}
      html,body{width:1200px;height:630px;overflow:hidden}
      body{font-family:SG,'Microsoft YaHei','PingFang SC','Noto Sans SC','Nirmala UI','Noto Sans Devanagari',sans-serif;color:#111;background:#f3f3f3;
        background-image:linear-gradient(rgb(17 17 17/.06) 1px,transparent 1px),linear-gradient(90deg,rgb(17 17 17/.06) 1px,transparent 1px);
        background-size:28px 28px;display:flex;align-items:stretch;padding:0 0 0 72px;position:relative}
      .copy{flex:1;display:flex;flex-direction:column;justify-content:center;padding:56px 0;position:relative;z-index:1}
      .badge{display:inline-flex;align-self:flex-start;gap:8px;align-items:center;padding:9px 20px;border:2px solid #111;border-radius:999px;background:#fff;font-size:20px}
      .badge b{font-weight:600}.badge span{color:#555;font-size:16px;letter-spacing:.06em}
      h1{margin-top:30px;font-size:66px;line-height:1.1;font-weight:400;letter-spacing:-.03em}
      :lang(zh) h1,:lang(hi) h1{letter-spacing:0;line-height:1.3}
      .m{color:#858585;font-weight:300}
      p{margin-top:26px;font-size:24px;color:#444;max-width:640px;line-height:1.4}
      .url{margin-top:auto;font-size:22px;font-weight:600;letter-spacing:-.01em}
      .photo{position:absolute;right:56px;bottom:10px;height:600px}
      .bar{position:absolute;left:0;right:0;bottom:0;height:10px;background:#111}
    </style></head><body>
      <div class="copy">
        <div class="badge"><b>Emanuel Guzman</b><span>/ ${copy.role}</span></div>
        <h1>${copy.title}</h1>
        <p>${copy.sub}</p>
        <div class="url">emanuel250.dev.ar</div>
      </div>
      <img class="photo" src="${photoUrl}" alt="">
      <div class="bar"></div>
    </body></html>`;
    const htmlPath = path.join(work, `og-${locale}.html`);
    const shotPath = path.join(work, `og-${locale}.png`);
    await writeFile(htmlPath, html);
    await run(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      '--virtual-time-budget=3000',
      '--window-size=1200,630',
      `--screenshot=${shotPath}`,
      pathToFileURL(htmlPath).href,
    ]);
    const out = await sharp(await readFile(shotPath))
      .extract({ left: 0, top: 0, width: 1200, height: 630 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(path.join(pub, 'og', `og-${locale}.png`), out);
  }
  await rm(work, { recursive: true, force: true });
  console.log(`✓ Open Graph images (${LOCALES.length})`);
}

async function waitFor(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // the server is not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function cvPdfs(chrome) {
  const astro = path.join(root, 'node_modules/astro/bin/astro.mjs');
  console.log('… building the site to print the CV');
  await run(process.execPath, [astro, 'build'], { cwd: root });

  const port = 4399;
  const preview = spawn(process.execPath, [astro, 'preview', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore',
  });
  try {
    await waitFor(`http://127.0.0.1:${port}/cv/`);
    for (const locale of LOCALES) {
      const prefix = localePrefix(locale);
      const outDir = path.join(pub, prefix, 'cv');
      await mkdir(outDir, { recursive: true });
      await run(chrome, [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--virtual-time-budget=4000',
        `--print-to-pdf=${path.join(outDir, 'emanuel-guzman-cv.pdf')}`,
        `http://127.0.0.1:${port}/${prefix}cv/`,
      ]);
    }
  } finally {
    preview.kill();
  }
  console.log(`✓ CV PDFs (${LOCALES.length}) — run \`npm run build\` to include them in dist/`);
}

const chrome = findChrome();
await portraits();
await icons();
await ogImages(chrome);
if (withCv) await cvPdfs(chrome);

// Hi-DPI screenshot capture for promo videos (sharp when the camera pushes in).
// usage: node scripts/capture.mjs <url> <out.png> [cssWidth=1280] [cssHeight=900] [scale=2] [waitMs=2500] [fullPage=0]
// Needs `npm i puppeteer-core` here and Chrome (set CHROME_PATH, default /usr/bin/google-chrome).
// Pass pageW/pageH = the CSS size (not the pixel size) to <TiltScreen>.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let puppeteer;
puppeteer = require('puppeteer-core');
const [url, out, w = 1280, h = 900, scale = 2, wait = 2500, full = 0] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars'] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: +scale });
await p.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, +wait));
await p.screenshot({ path: out, fullPage: !!+full });
await b.close();
console.log('saved', out, `${w}x${h} css @${scale}x`);

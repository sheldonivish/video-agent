#!/usr/bin/env node
/**
 * Headless renderer. Serves the engine, seeks each frame in Chromium, writes PNGs, encodes mp4.
 *
 *   node render.mjs --script ../examples/pumps_vs_dca.js --out ../output/reel.mp4
 *   node render.mjs --script ../examples/pumps_vs_dca.js --preview --outdir ../output/preview
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
function flag(name, fallback) {
  const i = args.indexOf('--' + name);
  if (i === -1) return fallback;
  if (i === args.length - 1 || args[i + 1].startsWith('--')) return true;
  return args[i + 1];
}

const scriptRel = flag('script', '../examples/pumps_vs_dca.js');
const outMp4 = flag('out', path.join(ROOT, 'output', 'reel.mp4'));
const outdir = flag('outdir', path.join(ROOT, 'output', 'frames_raw'));
const preview = !!flag('preview', false);
const previewList = (flag('frames', '') || '').split(',').filter(Boolean).map(Number);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://127.0.0.1');
      let rel = decodeURIComponent(url.pathname);
      if (rel === '/') rel = '/engine/index.html';
      const fp = path.join(ROOT, rel);
      if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found ' + rel); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function main() {
  const { chromium } = await import('playwright');
  const { server, port } = await startServer();
  fs.mkdirSync(outdir, { recursive: true });

  const scriptUrl = scriptRel.startsWith('/')
    ? scriptRel
    : '/' + path.relative(ROOT, path.resolve(__dirname, scriptRel)).replaceAll('\\', '/');
  const pageUrl = `http://127.0.0.1:${port}/engine/index.html?script=${encodeURIComponent(scriptUrl)}`;
  console.log('page', pageUrl);

  const chrome =
    process.env.CHROME_PATH ||
    [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ].find((p) => fs.existsSync(p));
  const launchOpts = {
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--disable-dev-shm-usage',
    ],
  };
  if (chrome) launchOpts.executablePath = chrome;
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });
  page.on('pageerror', (e) => console.error('PAGEERROR', e));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('CONSOLE', m.text());
  });
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForFunction(() => window.NV_ready === true, { timeout: 20000 });
  const info = await page.evaluate(() => window.NV_info());
  console.log('info', info);
  const total = Math.round(info.duration * info.fps);
  let frames;
  if (preview) {
    frames = previewList.length
      ? previewList
      : [0, 30, 90, 150, 210, 270, 300, 330, 350];
  } else {
    frames = Array.from({ length: total }, (_, i) => i);
  }
  console.log('capturing', frames.length, 'frames');

  const t0 = Date.now();
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    await page.evaluate((frame) => window.NV_seek(frame), f);
    // let GL present
    await page.waitForTimeout(8);
    const file = path.join(outdir, `f${String(f).padStart(4, '0')}.png`);
    await page.locator('#stage').screenshot({ path: file, type: 'png' });
    if (i % 30 === 0 || preview) console.log('  frame', f, file);
  }
  const captureMs = Date.now() - t0;
  console.log('capture_ms', captureMs);
  await browser.close();
  server.close();

  if (preview) {
    console.log('preview written to', outdir);
    return;
  }

  // Encoding happens in the caller / a follow-up ffmpeg command so audio
  // can be mixed separately. Write a concat-friendly note.
  fs.writeFileSync(
    path.join(outdir, 'meta.json'),
    JSON.stringify({ ...info, total, captureMs, outdir }, null, 2)
  );
  console.log('raw frames ready', outdir);
}

main().catch((e) => { console.error(e); process.exit(1); });

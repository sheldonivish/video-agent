#!/usr/bin/env python3
"""Headless frame capture for the NV engine."""
import argparse, http.server, json, os, shutil, socketserver, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent

def find_chrome():
    env = os.environ.get("CHROME_PATH")
    if env and Path(env).exists():
        return env
    for candidate in (
        "google-chrome",
        "google-chrome-stable",
        "chromium",
        "chromium-browser",
    ):
        found = shutil.which(candidate)
        if found:
            return found
    for path in (
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ):
        if Path(path).exists():
            return path
    return None

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)
    def log_message(self, fmt, *args):
        pass
    def guess_type(self, path):
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'text/javascript'
        return super().guess_type(path)

def serve():
    httpd = socketserver.TCPServer(('127.0.0.1', 0), Handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd, httpd.server_address[1]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--script', default='../examples/pumps_vs_dca.js')
    ap.add_argument('--outdir', default=str(ROOT / 'output' / 'frames_raw'))
    ap.add_argument('--out', default='')
    ap.add_argument('--preview', action='store_true')
    ap.add_argument('--frames', default='')
    args = ap.parse_args()

    script = args.script
    if not script.startswith('/'):
        script = '/' + os.path.relpath(Path(__file__).parent / script, ROOT)
    # normalize
    script = '/' + script.lstrip('/')

    httpd, port = serve()
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    url = f'http://127.0.0.1:{port}/engine/index.html?script={script}'
    print('page', url)

    with sync_playwright() as p:
        chrome = find_chrome()
        launch_kw = dict(
            headless=True,
            args=['--use-gl=angle', '--use-angle=swiftshader-webgl',
                  '--ignore-gpu-blocklist', '--no-sandbox', '--disable-dev-shm-usage'],
        )
        if chrome:
            launch_kw['executable_path'] = chrome
        browser = p.chromium.launch(**launch_kw)
        page = browser.new_page(viewport={'width': 1080, 'height': 1920}, device_scale_factor=1)
        page.on('pageerror', lambda e: print('PAGEERROR', e))
        page.on('console', lambda m: print('CONSOLE', m.type, m.text) if m.type == 'error' else None)
        page.goto(url, wait_until='networkidle', timeout=30000)
        page.wait_for_function('window.NV_ready === true', timeout=20000)
        info = page.evaluate('window.NV_info()')
        print('info', info)
        total = int(round(info['duration'] * info['fps']))
        if args.preview:
            frames = [int(x) for x in args.frames.split(',') if x.strip()] or [0, 30, 90, 150, 210, 270, 300, 330, 350]
        else:
            frames = list(range(total))
        print('capturing', len(frames), 'frames')
        t0 = time.time()
        for i, f in enumerate(frames):
            page.evaluate('(frame) => window.NV_seek(frame)', f)
            page.wait_for_timeout(10)
            dest = outdir / f'f{f:04d}.png'
            page.locator('#stage').screenshot(path=str(dest), type='png')
            if args.preview or i % 30 == 0:
                print('  frame', f, dest)
        capture_s = time.time() - t0
        print('capture_s', round(capture_s, 2))
        (outdir / 'meta.json').write_text(json.dumps({**info, 'total': total, 'capture_s': capture_s}, indent=2))
        browser.close()
    httpd.shutdown()
    print('raw frames ready', outdir)

if __name__ == '__main__':
    main()

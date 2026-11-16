#!/usr/bin/env python3
"""Render a canvas-reel project with headless Chromium.

usage: render.py <projdir> preview t1,t2,...   -> <proj>/build/preview/tNNNNN.jpg
       render.py <projdir> full DUR            -> <proj>/build/frames/fNNNNN.jpg (30 fps)
       render.py <projdir> cover 1x1|4x5|9x16  -> <proj>/cover_<k>.png (needs window.COVER)
       render.py <projdir> mtest DUR           -> quick motion test on 80 sampled frames

<projdir> must sit inside this kit folder (it loads ../core.js and ../fonts).
Set CHROME_PATH to use a system Chrome; otherwise Playwright's bundled Chromium is used."""
import sys, os, io, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright

KIT = os.path.dirname(os.path.abspath(__file__))
proj = os.path.abspath(sys.argv[1]); mode = sys.argv[2]
rel = os.path.relpath(proj, KIT)
if rel.startswith(".."):
    sys.exit("project folder must be inside the kit folder: " + KIT)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=KIT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}/{rel}/index.html"

launch = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
if os.environ.get("CHROME_PATH"):
    launch["executable_path"] = os.environ["CHROME_PATH"]

with sync_playwright() as p:
    b = p.chromium.launch(**launch)
    if mode == "cover":
        k = sys.argv[3]; h = {"1x1": 1080, "4x5": 1350, "9x16": 1920}[k]
        pg = b.new_page(viewport={"width": 1080, "height": h})
        pg.goto(BASE + f"?cover={k}"); pg.evaluate("()=>window.ready"); pg.evaluate("()=>window.drawCover()")
        pg.screenshot(path=f"{proj}/cover_{k}.png"); b.close(); sys.exit()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto(BASE); pg.evaluate("()=>window.ready")
    if mode == "preview":
        os.makedirs(proj + "/build/preview", exist_ok=True)
        for t in [float(x) for x in sys.argv[3].split(",")]:
            pg.evaluate(f"()=>window.setTime({t})")
            pg.screenshot(path=f"{proj}/build/preview/t{int(round(t*100)):05d}.jpg", type="jpeg", quality=90)
    elif mode == "mtest":
        import numpy as np
        from PIL import Image
        D = float(sys.argv[3]); ts = [0.3 + i * (D - 0.6) / 79 for i in range(80)]
        def g(t):
            pg.evaluate(f"()=>window.setTime({t})")
            return np.asarray(Image.open(io.BytesIO(pg.screenshot(type="jpeg", quality=93))).convert("L").resize((270, 480))).astype(int)
        r = [(np.abs(g(t + 1 / 30) - g(t)) > 10).mean() * 100 for t in ts]
        print("moving %.0f%%" % (100 * np.mean(np.array(r) >= 1)), " ".join("%.0f:%.1f" % (t, x) for t, x in zip(ts, r) if x < 1.3))
    else:
        D = float(sys.argv[3]); os.makedirs(proj + "/build/frames", exist_ok=True); n = int(round(D * 30))
        for i in range(n):
            pg.evaluate(f"()=>window.setTime({i/30})")
            pg.screenshot(path=f"{proj}/build/frames/f{i:05d}.jpg", type="jpeg", quality=93)
    b.close()
srv.shutdown()

"""Render a compiled scene to PNG frames (parallel pages, one browser).

Supersampled: the page is screenshotted at device_scale_factor=SS, so PNGs come
out at SS× the delivery frame (2160×3840 for a 1080×1920 reel). The encode step
downsamples them with lanczos. Every line, candle edge and glyph is therefore
rasterised with 4× the sampling and integrated down, instead of being aliased
at one device pixel.
"""
import asyncio, json, sys, pathlib, time, os
from playwright.async_api import async_playwright

SS = int(os.environ.get("SS", "2"))          # supersample factor; must match engine.js
RESUME = os.environ.get("RESUME", "1") != "0"
W, H = 1080, 1920

async def main(scene_dir, outdir, workers=6, start=0, end=None):
    scene_dir = pathlib.Path(scene_dir).resolve()
    ENGINE = pathlib.Path(__file__).resolve().parent.parent
    outdir = pathlib.Path(outdir); outdir.mkdir(parents=True, exist_ok=True)
    scene = json.load(open(scene_dir / "scene.resolved.json"))
    dur, fps = scene["meta"]["duration"], scene["meta"]["fps"]
    n_total = int(round(dur * fps))
    end = end or n_total
    frames = list(range(start, end))
    # Resume: skip frames already on disk. A long render that loses one page to a
    # screenshot timeout can be finished in seconds instead of starting over, and a
    # re-run after an engine edit is a no-op. Pass --no-resume to force everything.
    if RESUME:
        have = {int(p.stem[1:]) for p in outdir.glob("f*.png")}
        skipped = len(frames) - len([f for f in frames if f not in have])
        frames = [f for f in frames if f not in have]
        if skipped:
            print(f"    resuming: {skipped} frames already on disk, {len(frames)} to render")
        if not frames:
            print("    nothing to do"); return
    # engine is selectable so a scene can be pinned to the revision it was built
    # for; the default (engine.js) keeps existing scenes working untouched
    ENGINE_FILE = os.environ.get("ENGINE_FILE", "engine.js")
    page_url = (ENGINE / "renderer" / "index.html").as_uri() + f"?engine={ENGINE_FILE}"

    t0 = time.time()
    done = [0]
    lock = asyncio.Lock()

    async with async_playwright() as pw:
        launch = {"executable_path": os.environ["CHROME_PATH"]} if os.environ.get("CHROME_PATH") else {}
        browser = await pw.chromium.launch(**launch, args=[
            "--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none",
            "--hide-scrollbars", "--disable-gpu-vsync", "--allow-file-access-from-files"])

        async def worker(wid, chunk):
            page = await browser.new_page(viewport={"width": W, "height": H},
                                          device_scale_factor=SS)
            await page.goto(page_url)
            await page.evaluate("([s,f])=>window.boot(s,f)", [
                (scene_dir / "scene.resolved.json").as_uri(),
                (ENGINE / "assets" / "Inter.ttf").as_uri()])
            await page.wait_for_function("window.__ready === true", timeout=60000)
            await page.evaluate("()=>document.fonts.ready")
            # the canvas backing store must be SS× the CSS box, or the screenshot
            # is an upscale of a soft backing store and buys nothing
            got = await page.evaluate("()=>window.__canvas")
            if got != [W * SS, H * SS]:
                raise SystemExit(f"canvas backing store {got}, expected {[W*SS, H*SS]}")
            for f in chunk:
                await page.evaluate("t=>window.renderAt(t)", f / fps)
                await page.screenshot(path=str(outdir / f"f{f:05d}.png"), type="png",
                                      clip={"x": 0, "y": 0, "width": W, "height": H})
                async with lock:
                    done[0] += 1
                    if done[0] % 90 == 0:
                        el = time.time() - t0
                        rate = done[0] / el
                        eta = (len(frames) - done[0]) / max(rate, 1e-6)
                        print(f"    {done[0]}/{len(frames)}  {rate:.1f} fps  eta {eta:.0f}s", flush=True)
            await page.close()

        per = (len(frames) + workers - 1) // workers
        chunks = [frames[i * per:(i + 1) * per] for i in range(workers)]
        await asyncio.gather(*[worker(i, c) for i, c in enumerate(chunks) if c])
        await browser.close()

    # prove the frames really are supersampled rather than assume it
    from PIL import Image
    probe = sorted(outdir.glob("f*.png"))[0]
    pw_, ph_ = Image.open(probe).size
    if (pw_, ph_) != (W * SS, H * SS):
        raise SystemExit(f"frame size {pw_}x{ph_}, expected {W*SS}x{H*SS}: supersampling is off")
    print(f"  rendered {done[0]} frames at {pw_}x{ph_} (scale {SS}x, {ENGINE_FILE}) in {time.time()-t0:.1f}s")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("scene_dir"); ap.add_argument("outdir")
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--start", type=int, default=0); ap.add_argument("--end", type=int, default=None)
    ap.add_argument("--no-resume", action="store_true")
    a = ap.parse_args()
    if a.no_resume: RESUME = False
    asyncio.run(main(a.scene_dir, a.outdir, a.workers, a.start, a.end))

# chart-reel: chart-first lesson reel renderer

Renders a 1080x1920, 30 fps trading-education reel from a **scene JSON**. Adding a video means adding a JSON file, never new code. The format rules are in `skills/chart-first-lesson-reels`.

```bash
pip install playwright numpy && python3 -m playwright install chromium   # or set CHROME_PATH
python3 tools/fetch_klines.py BTCUSDT 1h 2023-09-08 2023-10-06 -o data/btc_1h_spot.json
BRAND_TEXT=yourbrand python3 verify/lint_scene.py scenes/example_lesson.json
./render.sh scenes/example_lesson.json --check    # compile and verify every pivot against the real bar
./render.sh scenes/example_lesson.json            # -> out/<id>.mp4 + out/<id>_still.png
python3 ../../pipeline/motion_audit.py out/lesson01.mp4   # must print >= 85%
```

| Stage | File | What it does |
|---|---|---|
| 1 audio | `renderer/audio_build.py` | ElevenLabs TTS per line (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` or `audio.voice_id`), placed with numpy onto a silent bed of exact length, loudness-normalised, with character alignment kept. Skipped for `meta.silent` scenes. |
| 2 compile | `renderer/compile_scene.py` | Resamples candles, checks every pivot price against its bar (the build fails otherwise), resolves `anchor` phrases to seconds, and builds caption cues. |
| 3 frames | `renderer/render_frames.py` | Headless Chromium calls `renderAt(t)` per frame at `device_scale_factor=2` across N parallel pages. It resumes from frames already on disk. |
| 4 encode | `render.sh` | Lanczos downscale to 1080x1920, H.264 CRF 17, AAC 192k, faststart. Fails if the downscale would be a no-op. |

Visual language (in `renderer/engine.js`): paper white, muted up/down candles, horizontal grid only, ink `#111827`, one amber accent, Inter headlines. A Catmull-Rom camera runs through `camera` keys, so velocity never drops to zero on a knot. Annotation marks drop in and resolve to exactly zero offset, so a level is always drawn on its bar at its price.

Scene keys: `meta`, `data`, `price`, `layout`, `draw` (t0 < 0 so the chart is live on frame 1), `camera`, `pivots`, `levels`, `tags`, `polylines`, `staircase`, `bos`, `measures`, `highlights`, `title` (lands late), `endcard`, `audio`, `captions`. Any `at` can be `anchor: {line, phrase}` resolved against the voice alignment.

Checks: `verify/lint_scene.py` (house rules R1-R5), `verify/motion.py` (longest freeze), `verify/sharpness.py` (variance of Laplacian), `verify/audio_sync.py` (cross-correlation sync on the delivered mp4).

Data: `tools/fetch_klines.py` pulls public Binance spot klines. No market data is bundled.

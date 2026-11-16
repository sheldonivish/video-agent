---
name: chart-first-lesson-reels
description: Use when making short trading or market-education reels drawn from real price data (market structure, breaks of structure, swing failures, liquidity sweeps). 9:16, 15-18 s, chart live on frame 1 with a mark already landing, continuous Catmull-Rom camera, status pills, one accent colour, at least 85% moving frames. Scene JSON in, MP4 out.
---

# Chart-first lesson reels

One concept per reel, taught on a real chart. Speed and continuous motion come from the best chart channels. Design discipline comes from clean paper-style lesson channels. Do not blend their pacing.

## Format rules
- 9:16, 1080x1920, 30 fps, 15-18 s. Nothing over 23 s.
- **Chart first, no opener.** Frame 1 is a live chart that is already drawing, with a mark landing on it. No title card, no question card, no 2-3 word label. The rule or title lands near the end as the payoff.
- One continuous take: no cuts. The camera is always moving, on a Catmull-Rom spline through keyframes so velocity never drops to zero on a knot. Marks are always drawing.
- Off-white paper look, thin ink, **exactly one accent** for the thing being taught. Up and down candle colours stay muted.
- Devices: circles (pivots) on the one or two candles that matter, numbered badges, dashed level lines with a caption underneath, price tags, ladders (staircase or polylines), a BOS line, measures and highlights. These are all built into the engine. Status pills that change as the lesson advances (WAIT, SWEPT, FAILED, COUNTS) and a timeframe pill are strong additions. Add them to `engine.js` as a new scene key, the same way `tags` work.
- Labels sit on the chart. No caption band.
- Voice is optional. A silent, music-ready cut is legal when the scene says `meta.silent: true`. With voice: about 40 words for 16 s, no line over 8 words, normal speed.

## The recipe for a 16 s lesson
```
0.0 s   chart already moving, level line drawn, status pill WAIT lit
0.3 s   circle snaps onto the candle that matters
3.5 s   the event (pierce, sweep), pill changes, the wick highlighted
7.5 s   the confirmation or failure, pill changes again
10.5 s  the rule lands as short centred type, chart keeps drifting under it
14.0 s  the real break, accent moves to the confirming close
16.0 s  end card
```

## Pipeline (code in `kits/chart-reel/`)
1. Data: `tools/fetch_klines.py BTCUSDT 1h 2023-09-08 2023-10-06 -o data/btc.json` (real public candles). Never draw a chart by eye.
2. Scene: copy `scenes/example_lesson.json`. Set pivots by bar timestamp and price, the camera keys, tags, title (late) and end card. Any `at` can be an `anchor` {line, phrase}, which resolves against the voice alignment, so marks land on the spoken word.
3. Lint: `BRAND_TEXT=yourbrand python3 verify/lint_scene.py scene.json`. This fails on a title up on frame 1, an empty first frame, a wrong voice, a non-normal speed, or SS<2.
4. Check: `./render.sh scene.json --check`. It compiles and verifies every pivot against the real bar, and the build fails if a price is not on its candle.
5. Render: `./render.sh scene.json`. Headless Chrome at 2x supersampling, Lanczos downscale, H.264 CRF 17.
6. Gate: `python3 ../../pipeline/motion_audit.py out/<id>.mp4` must print at least 85% moving frames. Read a contact sheet too, because motion that games the metric (idle wobble) is a fail.

## Fact rules
- Every price, date and level on screen must exist in the data, and the compiler enforces it.
- Name the instrument, timeframe and data source in the eyebrow (for example "BTCUSDT · 4H · SPOT").
- Teaching only. No signals, no "buy here", no promised outcomes.

## Series tips
- Keep one scene JSON per lesson. Adding a video means adding a JSON file, never new code.
- Pin the engine revision a scene was designed on (`"engine": "engine.js"`) so later engine edits don't silently change old lessons.
- Batch renders delete their frames after a successful encode. Keep frames only while iterating (`KEEP_FRAMES=1`).

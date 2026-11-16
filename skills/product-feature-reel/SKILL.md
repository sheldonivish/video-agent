---
name: product-feature-reel
description: Use when making a recurring series of short 9:16 reels that each explain one product feature on the live product (an order flow, a route finder, an AI co-pilot answer), with a calm voiceover, a rounded screen card on a dark brand canvas, pills and money/score overlays, and a shared animated end card. Captures the real product, never mocks it.
---

# Product feature reel (series)

Each episode covers one feature, one user question and one payoff. All episodes share a canvas, overlays and an end card, so the series reads as one show.

## Format
- 9:16, 1080x1920, 30 fps, 25-40 s plus a 2.5 s end card (cross-faded about 0.5 s).
- Layout: a dark brand canvas, the product screen in a rounded card with a soft shadow, status pills above it, and small captions below. Overlays sit inside the vertical safe zone (about y 250-1600).
- Overlays from `kits/series-kit`: timer, money up and down (semantic colours), scoreboard (A vs B), caption bar. Real numbers only.
- Voice: calm clone at normal speed, plain words ("You can trade options without even knowing what a strike price is."). A quiet licensed bed. No SFX unless the brand wants them.

## Episode structure
1. Hook (0-3 s): the user's problem or a surprising capability, in their words.
2. Name it (3-5 s): "Meet <feature>."
3. Do it (5-25 s): the real flow on the live product. Type the example, press the button, show the result. Each VO sentence matches what the screen is doing at that moment.
4. Why it matters (25-32 s): the one safety or value fact. Keep it exact and sourced (for example "your maximum loss is what you put in").
5. End card with a directional line.

## Capture rules
- Record or screenshot the live product (Playwright at 2x). Note the capture time. Features that need a signed-in state or a real position wait until the owner provides that session. Never fake a logged-in screen.
- Compare-across-venues claims must show the product's own comparison screen, captured at the same moment.
- Don't show personal balances, addresses or account ids, and blur them if they appear.

## Build
- The shared renderer pattern is PIL frames piped to ffmpeg. Each episode's spec module gives SHOTS (capture, time range, camera keys) and PILLS (time, text), and an eased interpolation helper drives the card's position and scale.
- `kits/series-kit/make_endcard.py --line "..." --out endcard.mp4` builds the end card once per series (variant CTAs per episode are fine).
- Assemble the frames, VO, bed and end card with an xfade. Master to -14 LUFS (`pipeline/master_audio.py`). Run `pipeline/qa_report.py`.

## Series hygiene
- Keep an approved-scripts list with the date and episode status (built, needs a signed-in run, and so on).
- Make 3 thumbnail sizes per episode (9:16, 4:5, 16:9) from one design.

---
name: canvas-explainer-series
description: Use when making a numbered series of 30-45 s 9:16 brand explainers, each teaching one idea about a product (how a draw is picked, where fees go, what happens when markets close, who integrates it), told with glowing faceless figures, lines, coins and status pills in an HTML Canvas world with a moving camera. Fixed story arc with a caveat beat, ASR pronunciation check, -14 LUFS, at least 85% moving frames.
---

# Canvas explainer series

Each episode is a tiny parable. A figure lives in a dark world, something happens to him, and the product changes the outcome. A fixed arc makes episodes quick to write and keeps them honest.

## The arc (every episode)
1. **Hook (0-3 s):** a surprising true line ("This prize draw's winning number isn't picked by anyone.").
2. **Common belief:** "Most people think / compare / judge..."
3. **Imagine:** the figure in a concrete scenario (holding into the weekend, dropping a coin into a box).
4. **On <product>:** how it works, with numbers from the product's own docs or official posts, attributed ("<product> says...", "In its docs...").
5. **Of course:** the honest caveat ("a ticket is a chance, not a payout", "backing doesn't make any trade a good one").
6. **Close:** a two-line contrast that pays off the hook. Then the end card (logo, tagline, URL).

Aim for about 110-170 words in 35-45 s, with short sentences.

## Visual language (`kits/canvas-reel`)
- A near-black world with a dot grid, drifting particles, a dashed ground line and a vignette. Figures are faceless rounded shapes with a soft glow. Brand primary for lines and accents, plus semantic colours for up, down and danger.
- The camera is a monotone-cubic path through keys `[t, x, y, zoom]` (`setCam`), so it never stops dead. The world is laid out left to right and the camera travels through it.
- Status pills at the top change with the story (`PILLS = [[t, 'TEXT', y], ...]`). Bursts, arrows, polylines, coins, dials and chips are helpers in `core.js`.
- Every frame is a pure function of `t` (`window.setTime(t)`), so previews, full renders and covers are deterministic.
- Covers: `render.py <proj> cover 1x1|4x5|9x16` uses `window.COVER` (headline lines and camera). For the main cover, use a 9:16 canvas with the design as a centred 1:1 square.

## Pipeline
1. Script each episode in the house format, with sources for every number. Wait for approval of the whole batch or each episode.
2. Voice (`pipeline/voice.py`). Then run an **ASR check**: `pipeline/asr_check.py build/vo.raw.mp3` transcribes the take. Compare it with the script, and look hard at the brand name, tickers and partner names, because TTS often mispronounces them. Fix with spelling hints or phonetic respelling and re-voice.
3. Copy `example/` to a new project folder inside the kit. Edit `pre.js` (brand, images) and `scene.js` (camera, pills, `WORLD(t)`), and time beats from the voice word timings.
4. `render.py <proj> preview 0.5,3,8,...` to get a sheet, then `render.py <proj> mtest DUR` for a quick motion check.
5. `render.py <proj> full DUR`, then `finish.sh <proj> DUR [licensed_bed.wav]`. That gives a -14 LUFS master, the encode, motion audit, loudness and a contact sheet.
6. Gate: at least 85% moving frames, loudness on target, and an ASR transcript that matches the script. Deliver for approval.

## Claim hygiene
- Numbers that change (pool sizes, TVL, volume) carry "right now" or "as of <date>" and are re-checked on the day of delivery.
- Partner and investor claims link to the partner's or company's own announcement.

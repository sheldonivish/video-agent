---
name: remotion-launch-film
description: Use when a product, exchange or app needs a launch or promo film (30-60 s) built from its real product screens in Remotion, delivered in 9:16 first and then 16:9 from the same timeline. Scene-per-feature structure, camera moves over hi-DPI captures, cursor, kinetic captions, counters, beat-grid timing, end card. Brand comes from a brand kit.
---

# Remotion launch film

One film, one promise, one scene per feature, all on real captured screens. Technique details (camera, cursor, transitions, SFX, loudness) are in `remotion-product-promo-video`. This skill is the structure and the rules for launch pieces.

## Structure (about 50-55 s at 30 fps)
| Scene | Share | Job |
|---|---|---|
| Open | 3-4 s | The promise in 2-4 words over the product already moving. No logo intro. |
| Feature 1..N | 7-9 s each | One feature per scene: the real screen pushes in, the cursor does the action, one kinetic caption, one proof number (counter). |
| Proof / live | 5-8 s | A live-state screen (markets, volume, users), with each number captured and timestamped. |
| End card | 2.5-3 s | Logo, one directional line, URL. Use the brand's end-card component. |

The same scene components drive the 9:16 and 16:9 cuts through a layout context (`VERT` and `WIDE` in `kits/remotion-kit/src/kit/layout.ts`). Captions re-wrap, and they are never just scaled.

## Rules
- **Real screens only.** Capture at 2-3x device scale (`scripts/capture.mjs`) so push-ins stay sharp. Put every capture path and its `CAPTURED_AT` time in one config file, so a fresh capture re-issues the film without touching scenes.
- **Facts of record.** Every number on screen is read from a capture (for example a payout chip equals the "You get" value on that screen) and noted in the config with its source. If a value changes hourly (rates, prices), either refresh it or obscure it (`OBSCURE_RATES = true`) so the film never shows a stale number as live.
- **Brand from the kit.** Colours, fonts, wordmark casing and gradient use come from `brand.ts`, filled from the brand kit (see brand-motion-kit). Composite the official logo file. Never redraw, recolour or add glows to it.
- **Sound.** Launch films may use light SFX (whoosh, pop, click, ticks) on a shared cue list at low volume, if the brand allows it. Use a licensed or code-synthesized music bed (`scripts/music.py`) and master to -14 LUFS. Explainer formats stay SFX-free.
- **Copy.** All on-screen copy and timing live in one file (`copy.ts`) on a BPM grid, so the script owner can edit words without touching animation.
- **No competitor UI** unless it's a fair, sourced comparison the brand approved.

## Workflow
1. Script in the house format (hooks, timed VO or a caption-only beat sheet, fact check, style note). Wait for approval.
2. Capture screens and fill `config.ts` with paths, capture times and facts of record.
3. Build the scenes on `kits/remotion-kit`, then `npx tsc && npx eslint src`.
4. Render 9:16, read a contact sheet (`scripts/sheet.sh`), check loudness (`scripts/loudness.py`), then render 16:9.
5. Deliver both cuts plus a 9:16 cover. Do not post.

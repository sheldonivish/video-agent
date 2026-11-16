---
name: image-led-explainer
description: Use when making a voiceover explainer built from real screenshots, quote cards and illustrations (a hack, a viral post, a launch, a news claim) in 1:1 or 9:16. Static sharp stills, hard cuts, a fast image-packed first 10 seconds, small captions, licensed music bed, -14 LUFS. Covers script, shot list, render, QA and delivery.
---

# Image-led explainer

A calm, fact-checked voiceover over a fast stack of real visuals: the original post, app screens, logos, quote cards and simple illustrations. It works for "this person says X happened, here is how, here is what to do" stories.

## Format
- 1:1 (1080x1080) for feeds, or 9:16 (1080x1920). 30 fps. 45-90 s.
- Background: one dark base, one ink colour, exactly one accent (for example red for danger).
- Hard cuts only. No whooshes, no transition SFX, no Ken Burns drift on screenshots.
- Stills are static and sharp. A screenshot is never upscaled past 100% and never cropped so that meaning is lost; contain-fit it with margins.
- Captions: tiny white text at the bottom, 3-4 words per chunk, from the voice's word timings.

## Structure and timing
| Time | Beat | Rule |
|---|---|---|
| 0-10 s | Hook | Image-packed: aim for 8-12 hard cuts. The claim in the person's own words (quote card), the number that hurts, the app or logo, the object (file, wallet, chart). |
| ~8 s | Provenance | Show the real source post or document in full, uncropped, so the viewer knows the hook was real. |
| 10-70 s | How it works | One visual per spoken idea, cut when the idea changes (about every 1-2 s). Real screenshots first, illustrations only where no real image exists. |
| last 15 s | What to do / payoff | Practical steps on real settings screens, then the CTA (see video-publish-kit). |

Quote cards repeat the source's exact words. Label recreated quotes and illustrations small in a corner ("Quote, recreated", "Illustration"). Never invent a quote, a screen, a number or a victim detail.

## Workflow
1. Script in the house format (video-script-package): 3 hooks with a pick, timed VO with a visual note under each part, fact check, one-line style note. Wait for approval.
2. Gather assets: the source post at native resolution, official screenshots, logos from official sources. Keep a sources list for the caption or a self-reply.
3. Voice: `pipeline/voice.py script.txt vo/` (word timings come back with the audio).
4. Shot list: take every shot boundary from `vo/voice.alignment.json`, never from guesses. Table: time, VO words, visual, why it's there.
5. Render: write `timeline.json` (types: image, quote, title, counter) and run `pipeline/stills_render.py timeline.json silent.mp4`. For custom art, a PIL renderer at 2x supersampling, downscaled with Lanczos, is the proven path.
6. Music: a licensed bed only. `pipeline/master_audio.py --voice vo/voice.wav --music bed.mp3 --dur D --out mix.wav --bed-out bed.wav` puts it about 20 dB under speech, ducks it, and masters to -14 LUFS with a -1.5 dBTP ceiling.
7. Mux and QA: `pipeline/qa_report.py final.mp4 --min-cuts-10s 8`, then `pipeline/contact_sheet.py final.mp4 sheet.jpg --every 1` and read the sheet frame by frame (frame-review-loop).
8. Cover: 9:16 with the design as a centred 1:1 square (`pipeline/cover.py`).
9. Deliver the MP4, cover, captions and sources for approval. Do not post.

## QA gates
- First 10 s: at least 8 hard cuts, and the real source on screen by about 8 s.
- Every claim traced to a named source. Contested claims are attributed ("he says", "reportedly").
- No upscaled or blurry screenshots, no cropped-away context, no text in platform UI zones.
- Loudness -14 LUFS ±1, true peak at or below -1 dBTP. Music clearly under the voice.
- Frame-by-frame sheet read before delivery. A numeric pass is not creative approval.

## Moving-frame note
Image-led explainers are exempt from the 85% moving-frame gate (that gate is for chart and motion formats). If the brief asks for more motion, add short "settle" moves and highlight reveals, never a slow zoom on a screenshot.

---
name: keyframe-motion-explainer
description: Use when a story needs a fully animated, deterministic motion-graphics explainer instead of real footage. Typical cases are security threats (exploit chains, malware, scams), how-a-protocol-works pieces, and "could a hacker take your money" questions. Phone or device-led illustrations, keyframed camera and objects, calm voice, no SFX, at least 85% moving frames. Works in 9:16 and 1:1, and in other languages.
---

# Keyframe motion explainer

Original editorial illustrations (a phone, a laptop, a wallet card, data cards, exploit layers, flow arrows) move on deterministic keyframes that follow the voice. Nothing is filmed and nothing is screenshotted from a victim. Use it when real visuals don't exist or would be unsafe to show.

## Format
- 9:16 (1080x1920) or 1:1 (1080x1080), 30 fps, 35-60 s. A pure black base with one accent.
- One hero object (usually a phone) stays on screen and changes state: browsing, infected, data leaving, updated, safe. The camera pushes, orbits and reframes it. Supporting cards enter and exit on purpose.
- Strong action from frame 1. No flat floating cards, idle phone rotations, dot filler, grids or haze sweeps. Each spoken line gets an image that explains it.
- No whooshes, ticks or transition noise. The voice is calm, at normal speed, with music optional and low.
- Overlay words: 2-4 per beat. The visuals carry the meaning.
- The end card is the brand mark on black with the CTA. Keep it proportional (about 1.5-2.5 s, no 4 s static hold).

## Truth rules
- Write a short production note alongside the cut with three labels. FACT is what the primary source (for example the security researcher's write-up) documents. INTERPRETATION is a reasonable conclusion. NOT ESTABLISHED is what you must not imply, such as "this exploit caused that viral loss".
- Say the limits out loud in the VO ("This isn't proof of that viral story. And it's not every phone.").
- All screens are original illustrations. Never show a real seed phrase, a real victim's screen or explicit content, even abstracted.
- Use the official brand file unchanged on the end card.
- For product pieces, show only the subject's own product, with no competitor names, logos or table rows. Crop third-party tables so only the subject's row shows, and credit the table's author.

## Workflow
1. Script in the house format and wait for approval. Include a "what to do" beat: update, keep recovery phrases offline, and so on.
2. Voice with word timings (`pipeline/voice.py`). Derive scene bounds from phrases in the alignment, for example `at("Once inside")`. Retimed voice then means retimed picture automatically.
3. Renderer: Python with PIL and numpy (optionally OpenCV for perspective warps). Draw each texture as a function, map it onto the device with a homography, and drive everything from keyframes interpolated with smoothstep or monotone cubic. Supersample 2x, then downscale with Lanczos. The HTML Canvas route (`kits/canvas-reel`) also works when the world is glowing figures and lines.
4. Gate: `pipeline/motion_audit.py` must print at least 85%. Read the per-second line too, because a long run of 1-2% seconds means a dead stretch to rework.
5. Review: a contact sheet every second, a framing check (nothing in platform UI zones), and an end-card check.
6. Other languages: re-voice with the same clone in the target language and keep captions very small. Rebuild timing from the new alignment rather than stretching the old one. Fix any weak opening seconds with stronger visuals, not more text.
7. Deliver the cut plus the production note. Do not post.

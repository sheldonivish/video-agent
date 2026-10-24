---
name: awesome-opus5-5-videos
description: >-
  Use this when making a short viral-style motion graphic, explainer, 3D scene
  or interactive clip as code (HTML, Canvas, SVG, GSAP, Three.js, GLSL). It is a
  library of 700+ prompts from viral Opus 5.5 videos. Pick a matching prompt,
  adapt it, render as a single HTML file, then record to video.
---
# Awesome Opus 5.5 videos

Source: [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos). Browse remakes at [skillry.dev/ai-videos/opus-5-5](https://skillry.dev/ai-videos/opus-5-5).

Helper files are not bundled here. Clone the upstream repo next to this skill (`git clone https://github.com/yihui-dev/awesome-opus5-5-videos`) to get:
- `data/videos.json` — 703 entries with slug, category, tech_tags, prompt, post_url, skillry_url
- `prompts/<slug>.md` — one file per prompt
- `README.md` — curated galleries by category

## When to use
Someone wants a short animated video made as **code** (not filmed footage): motion graphics, explainers, 3D scenes, particle loops, logo reveals, recipe/process animations, or "make something like that Opus / Claude viral video".

## Steps
1. Decide the category: `motion-graphics`, `explainer`, `3d-scenes`, or `games-interactive`.
2. Search the library for a close match:
   ```bash
   python3 -c "import json; d=json.load(open('awesome-opus5-5-videos/data/videos.json'));
   [print(v['slug'], v['category'], v['tech_tags'], v['prompt'][:120]) for v in d if 'KEYWORD' in v['prompt'].lower() or 'KEYWORD' in v['category']]"
   ```
   Or open `prompts/<slug>.md` after picking a slug from the README galleries.
3. Prefer entries with `prompt_partial: false` and a full **Prompt** block. Partial prompts still help for style and tech stack.
4. Adapt the prompt to the user's brief (topic, brand colors, length, aspect ratio). Keep the structure that made it work: single HTML deliverable, clear scene beats, tech hints (Canvas / SVG+GSAP / Three.js / GLSL).
5. Produce **one self-contained HTML file** that plays the animation. Prefer requestAnimationFrame, Canvas, SVG+GSAP, or Three.js as the prompt suggests.
6. Record to video when the user wants an mp4/gif (headless browser + ffmpeg, or screen capture). Match 9:16 or 16:9 to the brief.
7. Credit the original creator's post URL when the result is clearly derived from a specific prompt.

## Categories in the library
- Motion graphics — logo loops, abstract canvases, particle systems, music-video style overlays
- Explainers — step-by-step recipes, concepts, process animations with on-screen labels
- 3D scenes — Three.js / WebGL environments
- Games & interactive — small playable or clickable pieces

## Do not
- Do not dump hundreds of prompts into chat; pick 1–3 matches and build.
- Do not treat this as a Remotion or filmed-footage skill; this path is code-rendered animation.
- Do not claim Opus 5.5 made the result; use the prompts as creative recipes for your own render.

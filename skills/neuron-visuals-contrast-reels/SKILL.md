---
name: neuron-visuals-contrast-reels
description: Use when making a short (10-13s) 9:16 silent-story contrast reel in a faceless-figure style - white clay figures on a black mirror floor, two habits side by side, storytelling through easing, one accent color, no voiceover.
---
# Contrast reels (Neuron Visuals-style figure grammar)

Build short, silent-story 9:16 explainers that use a faceless white figure on a black mirror floor to stage one contrast. The public grammar this skill reproduces is the split-screen figure method popularized by Instagram [@neuronvisuals](https://www.instagram.com/neuronvisuals/): one idea, two habits, storytelling through easing, a single accent color, and a clear final state that fades to black. There is no affiliation with that channel, and this pack does not copy its assets, concepts, captions, watermark, or audio.

Use this skill when the brief is a finance, habit, or decision contrast that should feel like a 10–13 second contemplative reel, not a chart-first edit, not a talking-head, and not a kinetic-typography dump.

Do not use this skill for voiceover explainers, chart breakdowns that need an 85% motion-audit gate, meme formats, or anything that needs a face, hands, or realistic anatomy.

## When to use

- The story is a pair: a costly habit versus a calm habit, played in the same market or the same span of time.
- The moral can be shown with bodies and props (jumping late, stacking coins, filling a house, missing a brick) rather than spoken.
- Target length is 10–13 seconds, 1080×1920, 30 fps, no loop.
- The channel already has (or will add) a small bottom-center wordmark. This style's watermark lives in that slot; never copy someone else's. Place your own file at `engine/assets/wordmark.png` (not bundled).

## Dependencies

- Python 3, [Playwright](https://playwright.dev/python/) (`pip install -r engine/requirements.txt`), and Chrome or Chromium (or set `CHROME_PATH`).
- ffmpeg on `PATH`, for `encode.py`.
- Optional: Node 18+ if you prefer `engine/render.mjs` over `engine/render.py`.

Run commands from this skill folder (`skills/neuron-visuals-contrast-reels/`).

## Format rules

These rules combine a public study of the figure-method reels with corrections from a close visual read of top posts.

### Figure
- Matte white / light gray, untextured. Default body color `#F7F7F7`, roughness ~0.34, metalness 0.
- Large spherical head, thick cylindrical torso, thick cylindrical limbs that bend like rubber hoses.
- No visible joint spheres, no face, no hands, no feet.
- About one quarter of the full frame height in a single-scene layout; smaller (roughly one fifth) is correct in a top/bottom split so labels and props can breathe.
- Faceless clay mannequin, not a stick figure and not a realistic human.

### Storytelling through easing
The plot is the easing, not the dialogue.
- The "right" character is snappy: near-zero easing, stop-motion-like, fast starts and hard holds. Actions land in 4–8 frames.
- The "wrong" character is smooth: slow, over-interpolated, hesitant, late to the thing they are chasing.
- Never give both characters the same easing. If the moral flips, the easing flips with it.

### Layouts
Camera is locked unless the layout itself is a split that dissolves into a pan.
1. Left/right with no divider. Labels sit above (or left-aligned over) each figure.
2. Top/bottom with a thin horizontal line and a center counter (Year / Day / timer) in a small pill that interrupts the line.
3. Single isometric scene (for example a herd or a shared floor) — one camera, both figures in the same world.
4. A split that dissolves into a camera pan. Use sparingly; the locked camera is the default.

### Lighting and stage
- True black void (`#000000`).
- Top-down spotlight, soft contact shadows, high-gloss mirror floor that fades to black, vignette.
- No visible floor quad edges. The floor must read as an infinite dark glass, or (in the flatter top/bottom shelf layout) as a thin horizontal ground line, never as a perspective trapezoid.
- Wireframe props get a subtle glow (a house, a car, a candle outline).
- Assets can fill from the bottom like liquid.
- Reflections are visible white-ish mirrored copies of the figures and gold props, fading before they hit the wordmark.

### Color
- Exactly one accent color per video.
- Gold (`#E3B322`) for money, coins, compounding.
- Red (keep it darker and desaturated, e.g. `#6E2C2C`) for the bad or delay object: a late candle, a warning bar, a missed brick.
- If a video needs both a pump-candle and a gold stack, gold is the dominant accent and red stays supporting and diegetic so it does not read as a second brand color.
- Do not add a third accent. Do not use a client's brand color as the in-scene money metal — keep brand color on the wordmark only.

### Type and overlay
- Small white all-caps labels from frame 0, left-aligned or sitting above the figures.
- Labels: Inter 600, roughly 26 px at 1080, letter-spacing ~0.16 em, color `#F3F3F3`.
- Punchline (optional): Inter Tight 800, roughly 40 px, letter-spacing ~0.08 em. Only some videos use one. If it occupies the same band as a label, hide that label.
- Counters tick fast and stay silent. No tick sound.
- Wordmark: the client's verified mark, small, bottom center, treated as a watermark. Never a third-party mark, never an unverified logo file.

### Ending
- No loops. End on a clear final state (empty versus full, slumped versus standing) and fade to black.
- House length is about 10–13 seconds. 12 seconds is the default.

### Audio
- Music bed plus physical foley mixed clearly, no voiceover.
- Foley only for real physical actions (a coin landing, a chisel hitting a brick, a splash). Keep it tasteful.
- No whooshes, no counter ticks, no transition noise.
- Music must be CC BY (for example Kevin MacLeod / incompetech) or otherwise royalty-free. Log the attribution next to the render. Credit the track in a YouTube description, never inside the on-screen captions.
- Music and foley files are not bundled. Supply your own licensed bed and hits.

## Concept-writing formula

Write the reel as a contrast pair before touching the rig.

1. Name the two habits in three to five words each, all caps, parallel grammar.
   `WRONG HABIT` vs `RIGHT HABIT`
2. Put them in the same arena (the same market, the same years, the same house). The arena is what makes the ending fair.
3. Give the wrong side smooth, late motion and a prop that spikes then fails.
4. Give the right side snappy, on-the-beat motion and a prop that accumulates.
5. Pick one accent. Gold if the moral is compounding or saving; red if the moral is delay, danger, or a missed object.
6. Decide the layout. Top/bottom plus a Year/Day counter when time is the joke. Left/right when the two lives sit side by side. Single scene when they share a floor.
7. Optional punchline at about 9 seconds: one sentence, all caps, no numbers unless they are real and sourced. Illustrative stacks do not need figures on them.
8. End in a still that a stranger can understand with the sound off.

Do not invent return percentages, past performance, or "this coin did 40x" unless the number is real and cited. An unlabeled gold tower is enough.

### Ten finance pair examples

These are original finance examples. Do not substitute a copied concept from another channel in their place.

1. CHASES PUMPS vs BUYS EVERY MONTH — top/bottom, YEAR counter, late jumps onto red candles versus a snappy gold coin every beat.
2. TIMES THE MARKET vs STAYS INVESTED — left/right, the timer on one side keeps resetting; the other side never stops walking.
3. WAITS FOR THE PERFECT DIP vs STARTS TODAY — a hovering figure that never drops the coin; a figure that drops the first coin on frame 0.
4. ALL IN ON A TIP vs DIVERSIFIES — one figure dumps a whole bag onto a single crumbling block; the other places small coins on several quiet blocks.
5. CHECKS THE CHART HOURLY vs REVIEWS ONCE A QUARTER — frantic smooth pacing around a spiking candle versus four snappy glances across the same years.
6. SELLS THE CRASH vs BUYS THE DIP — both see the same red drop; one tosses the stack away, the other adds a coin at the bottom.
7. LIFESTYLE CREEP vs RAISES THE BUY — a wireframe car/house filling on the wrong side; a gold stack stepping up on the right side.
8. ONE LUCKY COIN vs A BORING INDEX — a single leaping figure chasing one glowing coin; a calm figure feeding a dull, growing pile.
9. FOLLOWS THE CROWD vs FOLLOWS A PLAN — isometric herd running toward a spike; one figure walking the other way on the same floor.
10. QUITS AFTER A LOSS vs STICKS TO THE SCHEDULE — the wrong figure slumps and walks off after the first red candle; the right figure keeps the toss rhythm through the dip.

## Layout options

| Layout | Divider | Counter | Best for |
|---|---|---|---|
| `top-bottom` | Thin horizontal line at mid-frame | Center pill (YEAR / DAY / timer) | Time-lapse morals |
| `left-right` | None | Optional, small, top-center | Two lives, same moment |
| single scene | None | Optional | Shared-floor stories (herd, race, one prop) |
| split-to-pan | Starts as a split, then the camera moves | Optional | Reveals that the two sides shared a world |

Default camera for top/bottom (per panel): perspective 30°, position `(0.12, originY + 1.18, 9.2)`, lookAt `(0.12, originY + 0.82, 0)`, aspect 1080/960. Do not point both cameras at the same world origin — each panel is its own stage, offset on Y (top at `0`, bottom at `-30`) so lights and meshes do not leak.

## Rig usage

The reusable engine lives at `engine/` (relative to this skill folder).

```
engine/
  index.html            # 1080×1920 overlay (labels, YEAR pill, punchline, wordmark, vignette, fade)
  render.py             # headless Chrome + SwiftShader capture
  render.mjs            # optional Node/Playwright capture
  encode.py             # frames + optional music + foley → mp4, loudnorm, contact sheet, cover
  vendor/three.module.js
  src/nv.js             # createApp: panels, figures, props, dual scissor viewports
  src/figure.js         # parametric faceless figure + named poses
  src/stage.js          # black mirror floor, lights, camera
  src/props.js          # coin, coin stack, candle, liquid fill, wire props
  src/easing.js         # snappy / smooth
  assets/fonts/Inter.ttf
  assets/fonts/InterTight.ttf
  assets/fonts/OFL.txt
  assets/wordmark.png    # not bundled; add your own mark here
```

A reel is a small ES module that exports `script`:

```js
export const script = {
  layout: 'top-bottom', // or 'left-right'
  duration: 12,
  fps: 30,
  labels: { top: 'WRONG HABIT', bottom: 'RIGHT HABIT' },
  build(api) {
    const wrong = api.addFigure({ panel: 'top', easing: 'smooth' });
    const right = api.addFigure({ panel: 'bottom', easing: 'snappy' });
    // api.addCoinStack / addCandle / addLiquidFill / addWireProp
    return function seek(t, frame) {
      // deterministic. seek(t) must be safe to call out of order.
    };
  },
};
```

Named poses on the figure: `idle`, `walk`, `run`, `jump`, `hammer`, `slump`, `look`, `toss`. Mix them with `figure.evaluate(name, phase)` and `figure.setPose(pose)`. Set `pose.yaw = Math.PI / 2` for a profile facing +X.

Preview nine keyframes:

```
python3 engine/render.py \
  --script ../examples/pumps_vs_dca.js \
  --preview --outdir output/preview
```

Capture every frame (12 s × 30 fps = 360 PNG files):

```
python3 engine/render.py \
  --script ../examples/pumps_vs_dca.js \
  --outdir output/frames_raw
```

Encode to an uploadable reel (optional music bed + physical foley, two-pass loudnorm, contact sheet at 1 frame per 0.5 s, cover frame):

```
python3 engine/encode.py \
  --frames output/frames_raw \
  --out output/reel.mp4 \
  --music /path/to/your-licensed-bed.mp3 \
  --foley-dir /path/to/coin-hits
```

`--music` and `--foley-dir` are optional. If you pass `--foley-dir`, it should contain `coin_*.wav` files. For the worked example, default coin-landing times match `examples/pumps_vs_dca.js` (override with `--hits`).

Render target: 1080×1920, 30 fps, true `#000` clear color, ACES filmic tone mapping. The renderer launches Chrome or Chromium with `--use-gl=angle --use-angle=swiftshader-webgl` so WebGL 2 works headless. Set `CHROME_PATH` if the binary is not on a standard path.

`seek(t)` must stay deterministic. Reuse flyer meshes instead of spawning on crossings, so previewing frame 300 and then frame 30 cannot leak leftover coins.

## Easing and timing numbers

At 30 fps:

- Snappy (`src/easing.js` `snappy`): mix of a short ease-out (`1 - (1 - t)^1.2`) and 5-step quantization, 55% toward the stepped value. Use this on the right character's actions.
- Smooth (`smooth`): double-smoothstep, `s = smoothstep(t); return smoothstep(s)`. Use this on the wrong character's actions.
- Right-side action length: 0.13–0.27 s (4–8 frames). The worked example's toss is 0.20 s, with the coin in the air for 0.24 s after a 0.09 s hand-off.
- Wrong-side action length: 0.55–0.80 s, and late. In the worked example the candle peaks at localT = 0.20 and the jump does not start until 0.30, lasting 0.68 s.
- Year / day counter: advance in under 2 frames when the value changes. The worked example steps YEAR from 2020 to 2026 every 1.32 s starting at t = 0.30.
- Punchline fade-in, when used: ~0.45 s starting near t = 9.0.
- Final hold, then fade to black: start the fade around t = duration − 1.0 s and finish on black. The worked example fades from 11.05 s over 0.9 s.
- Do not ease the camera. Do not ease the labels on or off except the optional punchline.

## Lighting values

These are the working stage defaults in `src/stage.js` and `src/nv.js`. Tune them together; raising exposure without raising the spot washes the black void.

- Renderer: `ACESFilmicToneMapping`, exposure `1.32`, `PCFSoftShadowMap`, clear `#000000`.
- Spot: color white, intensity `125`, distance `24`, angle `0.48` rad, penumbra `0.62`, decay `1.05`, position `(0.12, 9.2, 1.55)`, target `(0.2, 0, 0)`, shadow map 1024, bias `-0.00025`.
- Fill: directional white, intensity `0.42`, position `(0.35, 5.2, 5.8)`.
- Hemisphere: sky `#888888`, ground `#000000`, intensity `0.32`.
- Floor: `MeshPhysicalMaterial` color `#050505`, roughness `0.12`, metalness `0.72`, opacity `0.42`, large enough (default 28 × 18) that its edges leave the frame.
- Fade: a transparent black plane at y = 0.002 (opacity 0.35) plus a deeper fade at y = −0.78 (opacity 0.62). Opaque under-plane at y = −1.35 so the void stays `#000` and reflections die before the wordmark.
- Contact shadow: disc radius `0.42`, opacity `0.45`, just above the floor.
- Vignette (CSS): radial ellipse, transparent in the center, about 0.42 black at the edges.
- Figure ghost (the mirrored clone): color `#C8C8C8`, opacity `0.58`, roughness `0.50`. Parent it to a group with `scale.y = -1`.
- Gold money metal: `#E3B322`, roughness `0.28`, metalness `0.82`, emissive `#E3B322` at ~0.18.
- Supporting candle red: `#6E2C2C`, opacity ~0.78, plus a light wireframe edge.

## Type spec

- Labels: Inter, weight 600, all caps, ~26 px, letter-spacing 0.16 em, `#F3F3F3`, left 88 px. Top label around y = 172; bottom label around y = 992 in a top/bottom frame.
- Counter: Inter 600, ~18 px, letter-spacing 0.18 em, `#F0F0F0`, inside a black pill with a 1 px `#2A2A2A` stroke, centered on the divider.
- Divider: 1 px `#2C2C2C`, inset 90 px from each side, at y = 959.
- Punchline: Inter Tight, weight 800, all caps, ~40 px, letter-spacing 0.08 em, `#F5F5F5`, centered near y = 92. Hide the overlapping label while it is on.
- Wordmark: verified client mark only, ~236 px wide, bottom center, opacity ~0.78, sitting on black (not on a bright reflection). Add it at `engine/assets/wordmark.png`.
- No emojis anywhere: not in labels, not in the punchline, not in the caption, not in hashtags.

## Audio rules

- Bed: CC BY or royalty-free instrumental. Log title, artist, license, and file path beside the render.
- Foley: only events that exist in the picture (coin land, chisel, splash). Synthesize or source them cleanly. Mix them so they are audible but not harsh.
- Forbidden: whooshes, risers, UI ticks synced to the year counter, transition whooms, voiceover, or a cloned/personal voice unless the user asked for it on this specific video.
- Loudness: integrated −14 LUFS, true peak under −1 dBTP. `encode.py` runs a two-pass `loudnorm=I=-14:TP=-1.0:LRA=11`.
- Credit the music track in the YouTube description. Do not burn the credit into the captions or the on-screen type.

## Caption pattern

One sharp sentence that a muted scroller can understand. Then a comment CTA. Then at most five hashtags. No emojis.

```
Same market. Two habits. Two very different stacks.
Comment DCA
#investing #longterm #dca #bitcoin #compounding
```

Rules:
- The sentence restates the contrast; it does not explain the animation.
- `Comment KEYWORD` is the CTA. Pick one word that matches the moral (DCA, PLAN, WAIT, START). Do not copy another channel's keyword.
- Maximum five hashtags. No emoji hashtags, no stacked emoji lines, no "follow for more" spam.
- Do not put performance numbers in the caption unless they are real and sourced.

## QA checklist

An 85% moving-frames motion gate does not apply here. A small white figure on a black frame rarely moves 1% of the pixels even when the acting is correct, so that gate will false-fail almost every honest reel in this style.

Use this gate instead — call it the contrast-and-beat gate. A reel passes when all of the following are true:

1. Readability at frame 0. Both labels (or the single-scene labels) are on, in all caps, and do not cover a chest or a head.
2. Figure grammar. Each body is a faceless matte mannequin: spherical head, cylindrical torso, hose limbs, no face, no hands, no feet, no joint balls. Height is in the 15–30% of full-frame range (smaller is fine in a split).
3. Easing contrast. Sample the two figures' silhouette centroids every frame during an action. The right figure's speed should be bursty (a few hot frames, then a hold). The wrong figure's speed should stay non-zero across a longer window. If both curves look the same, the story is broken.
4. Action beats. Something physical happens on a rhythm (a toss, a jump, a brick, a fill) at least every 0.5–1.4 s during the body of the reel. Holds between right-side actions are a feature, not a freeze-frame bug.
5. Counter discipline. If a YEAR/DAY pill exists, it advances cleanly and makes no sound.
6. One accent. A palette histogram of non-black, non-white pixels should be dominated by a single hue (gold or red). A supporting diegetic color is allowed only if it stays darker and less saturated than the accent.
7. Floor and light. Reflections read, the void stays `#000`, no floor-quad edges, no pelvic lighting hole, the wordmark sits on near-black.
8. Final state. The last fully-visible frame (before the fade crosses ~0.3) shows an opposite outcome a stranger can name in one clause: "he has nothing / she has a tower."
9. No loop. The last 12–15 frames fade to black or hold the end state. Frame 0 and the last frame are not the same picture.
10. Type and brand. Inter / Inter Tight as specified. No emojis. Verified client wordmark only, small, bottom center.
11. Audio. Music is licensed and logged. Foley matches visible physical events only. Integrated loudness is −14 LUFS ±0.5 and true peak is under −1 dBTP.
12. Numbers. Any figure printed on screen (returns, dollar amounts, percentages) is real and sourced. Illustrative stacks stay unlabeled.

Fail the reel if any of 2, 3, 6, 8, 9, 10, or 12 is off, even if the motion looks lively.

After a render, always look at the contact sheet (1 frame every 0.5 s) next to a reference contact sheet from a comparable layout (top/bottom with a YEAR pill, or a single-scene mirror-floor figure film). Check figure silhouette, floor reflection, lighting, and whether the two panels actually tell different stories.

## What not to copy

This skill reproduces a public visual grammar. It does not reproduce another artist's catalog.

- Do not copy Neuron Visuals concepts beat for beat. Luxury vs Assets, Perfectionist vs Action Taker, the brick-laying pair, and their herd films are theirs. Write a new pair using the formula above.
- Do not copy or redraw their watermark, their end card, or the word `NEURONVISUALS` anywhere on the frame.
- Do not copy their captions or their `Comment ANIMATE` CTA. Write a new sentence and a new keyword.
- Do not copy on-screen numbers, dollar labels, or props arranged the same way as a specific post.
- Do not trace their figure mesh. Use the parametric rig in `engine/src/figure.js`.
- Do not scrape, rip, or re-upload their audio. License a CC BY or royalty-free bed and log it.
- Do not claim the style is original to this pack, and do not claim affiliation.

The worked example at `examples/pumps_vs_dca.js` (`CHASES PUMPS` vs `BUYS EVERY MONTH`) is an original pair, not a template to clone for every post. Change the habits, the props, and the rhythm each time.

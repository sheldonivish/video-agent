---
name: Remotion product promo video
description: >-
  Use when making a short, premium animated promo or feature video for a
  product, website or app from its screenshots (launch teasers, "banger"
  X/TikTok clips, 9:16 and 16:9). It's built in Remotion with 3D screenshot
  camera moves, kinetic captions, counters and synthesized audio.
---
# Screenshot-driven product promo (Remotion)

Worked examples (structure to copy in your own project):
- A 60-second feature launch: a hook composition, `src/launch/*.tsx` scenes plus `common.tsx` helpers, a 9:16 and a 16:9 composition, and a Python script that synthesizes the SFX.
- A 20-second viral promo: `src/copy.ts` for all copy, `src/ui.tsx` + `src/scenes.tsx` for components and scenes, `scripts/audio.py` for the full music and SFX mix, 9:16 and 16:9 compositions.

Reusable template: a `video-kit/` Remotion project (set one up in your workspace). It's a compiling Remotion 4 project with `src/kit/*` building blocks and audio and capture scripts. Read its README. Remotion plugin skills (rules for animations, audio, fonts, sequencing and transitions) come from the official Remotion agent skills / plugin.

## 1. Intake (before any code)
1. **Brand rules first.** Load the brand guide or brand skill: colours, fonts, logo files, voice, and do's and don'ts. Composite the official logo files as they are; never redraw or recolour them. If you have to bend a rule (a non-brand font for numbers on screenshots, extra caption copy), tell the user.
2. **Screenshots.** Get the product screens. If they're 1x or blurry, recapture the public pages at 2x/3x:
   `node video-kit/scripts/capture.mjs <url> public/shots/home.png 1280 900 2`. Keep the CSS size, because it's what you pass as `pageW`/`pageH`. Mobile views: 390x844 @3x. Check that recaptured numbers match the originals, and keep sensitive or negative UI rows out of frame.
3. **Script owner.** Agree on who owns the hook, script and caption. If another agent or the user writes it, take their timed lines word for word, so there's one cut, not two.
4. Ask for length, formats (9:16 first, then 16:9) and music preference. The default is an original synthesized bed.

## 2. Structure
- **Hook in 1–2 s.** Start with the boldest claim or a visual punch on frame 0: big kinetic type, a strike-through, or a fast push into the hero screen. No logo intro.
- **Beats on a BPM grid.** 120 BPM means 0.5 s per beat (15 frames at 30 fps). Cut every 1–2 bars and land text pops on beats. Use `grid(bpm,fps)` from the kit.
- One idea per beat:
  - feature → screen → proof number.
  - A beat of silence before the payoff line hits harder: hard stop, then a slam SFX.
- End card: logo, URL, a three-word tagline, and an optional small handle line.
- **All copy in one file** (`src/copy.ts`): beat ids, start/end seconds, lines, accent words, optional `wide` re-wraps and counter numbers. Scenes read from it, so copy edits never touch scene code.

## 3. Motion vocabulary (kit components)
- **3D card tilt + camera push/pan** (`TiltScreen` `cam` keys `{f,x,y,z,rx,ry}`).
  - Start tilted (rx 10–15°, ry −10°), settle flat as you push in, then pan to the feature.
  - Zoom is interpolated in log space.
- **Focus pull** (`focus`). Blur and dim the base screenshot while the hero element stays sharp or lifts out.
- **Cards lifting out of the screenshot** (`pops`). Crop a rect of the screenshot and spring it forward with a scale of about 1.12, translateZ, shadow and an accent glow. Drop it back with `until`.
- **Pixel-matched overlays.** Children of `TiltScreen` are positioned in page CSS px.
  - Measure the number or control in the screenshot.
  - Cover it with a `Patch` filled with the sampled background colour.
  - Render the live value on top in the product's own font: monospace for prices and odds.
  - This lets numbers tick, toggles flip and charts draw in sync with the camera.
- **Counter roll-ups** (`Counter`). Ease-out from 0 to the value over about 1–1.2 s with tabular numbers, then a small land pop. Add a tick SFX roll during the count and a ding on the land.
- **Realistic cursor** (`Cursor`). Arced, eased moves, a squash on click, holds for drags. Map the keys through the screenshot camera so the cursor stays glued to UI as the camera moves.
- **Word-by-word kinetic captions** (`KineticCaption`).
  - Each word slides up out of a mask with a 2-frame stagger and exits upward.
  - Exactly one accent word per line goes in the brand colour or gradient.
  - Captions are short and directional.
- **Transitions** (`SceneFx`):
  - zoom-through exit (scale + blur)
  - diagonal wipe enter with a light edge line (`wipeUR`/`wipeDR`)
  - paper-tear exit (jagged diagonal split, halves fly apart)
  - plus `CutFlash` streaks on hard cuts
  - Overlap sequences by 14–20 frames so the next scene shows through.
- Finishing layers: drifting accent `Backdrop` glow, `Vignette` and film `Grain`. Use line icons only (Lucide paths) and no emojis unless the brand uses them.
- More effects: see the Flowsites UI library skill for components that can be screen-recorded or ported into scenes.

## 4. Audio
- **SFX synthesized in code.** `python3 video-kit/scripts/sfx.py public/sfx` writes whoosh, click, pop, ticks and boom. They're royalty-free by construction. Keep one cue list `[frame, file, volume]` shared by both aspect ratios (`SfxTrack`).
- **Music bed.** Prefer an original bed synthesized in code: `python3 video-kit/scripts/music.py --bpm 120 --dur 20 --stop 17.0 17.8`. A fully arranged promo's `scripts/audio.py` can hold a fully arranged, cue-synced version.
  - Avoid tracks registered with Content ID (many "free" trailer tracks are), because they get claimed on YouTube and X.
  - If the user picks a licensed stock track: Pixabay blocks curl (403), so download it through the browser on the box desktop and keep the licence page URL.
- **Ducking.** `MusicBed` dips the music about 60% under each SFX hit, fades in over 0.5 s and out over 1 s, and can start at an offset into the track.
- **Speed prop.** Author on a fixed timeline and wrap scenes in `SpeedScene speed={1.2}`. Set `calculateMetadata` duration to `round(authored/speed)` and schedule SFX at `at/speed`. Never resample the music.
- **Loudness.** Target −14 LUFS integrated with peaks ≤ −1 dBFS: `python3 video-kit/scripts/loudness.py out/video.mp4`. You can't listen to the audio, so say that and ask the user to give the sound a listen.

## 5. Formats
- Build **9:16 (1080x1920) first**. Then add a **16:9 (1920x1080)** composition that renders the same scenes through a different `Layout`: text column on the left, screen on the right.
- Headlines auto-shrink with `fitSize` (measured with the loaded font) and can use per-beat `wide` re-wraps.
- Register both compositions in `Root.tsx` with shared `defaultProps` (music, volume, offset, speed).

## 6. QA and delivery
1. `npx tsc && npx eslint src` must pass.
2. Spot-check stills with `npx remotion still <Comp> out/f120.png --frame=120`, then render with `npx remotion render <Comp> out/<name>-vertical.mp4`.
3. Make a contact sheet: `bash video-kit/scripts/sheet.sh out/v.mp4 out/contact.png 8 270 0.4 0.9 ...`. Read it.
   - Check text legibility per beat (each line should be readable for at least about 0.6 s at final speed).
   - Check safe areas: keep text out of the top and bottom ~200 px on 9:16 for platform UI.
   - Check for clipped words, off-brand colours, and stray UI.
4. Run the loudness check.
5. Deliver both files in chat for review with a short note on brand compromises and anything you couldn't verify.
6. **Never post or send the video anywhere yourself.** The user posts it. Offer caption or post drafts on request.

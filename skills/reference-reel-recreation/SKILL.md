---
name: reference-reel-recreation
description: Use when the owner sends a reference reel and says "make ours like this", whether the reference is a split-layout talking-head edit, a beat-synced photo story (a save-the-date, an anniversary, a product drop) or any style to match. Measures the reference (beats, cut rate, layout, type, motion) into a written recipe, then rebuilds the style with the owner's own content and never copies the reference's assets.
---

# Reference reel recreation

You copy the grammar, not the content. Measure first, write the recipe, get it approved, then build.

## 1. Measure the reference
- Download the reel. Extract the audio, a contact sheet (`pipeline/contact_sheet.py ref.mp4 sheet.jpg --every 0.5`) and frame diffs (hard cuts and moving-frame share, from `pipeline/qa_report.py ref.mp4`).
- Beat grid: detect onsets and BPM on the reference track (librosa `beat_track`). Save `beats.json` with the first beat time and every beat after it.
- Write `analysis.json` covering duration, aspect, cut times, cuts per 10 s, moving %, palette, type (family feel, weight, case, size, position), caption style, layout zones, transition types, audio (music genre and level, SFX or none) and the CTA style.

## 2. Write the recipe (example shape)
```
# Reel style recipe (<ref id>, 34 s, 9:16)
- Background: light-grey textured paper.
- Split layout: B-roll in a browser-window frame on top; talking head in a rounded-rect mask with a soft shadow below.
- Captions: ONE word at a time, bold black serif, lowercase, centred between halves; hard swaps.
- Cuts: mostly hard, about 4-5 visual changes per 10 s; one vertical blur swipe; a subtle punch-in on the face.
- Audio: quiet lo-fi bed, no SFX.
- Hook: start mid-sentence with the result shown on top.
- CTA: face full screen over blurred B-roll, italic serif CTA word ("comment <WORD>").
```
Send the recipe for approval. Save it next to the project so later videos can reuse it.

## 3. Rebuild
- **Beat-synced photo story** (Remotion): put the beat grid in `beats.ts` and lock every event to a beat (`T = {titleIn: 0, nameIn: BEATS[0], ...}`). Fades are already at full opacity on the beat (they start about 0.2 s early). Close any gap longer than about 1.5 s. Use the owner's photos and names, a palette sampled from their invite or brand, and a licensed track, or the owner's own track if they supply it and have the rights.
- **Split talking-head:** the owner's own recorded footage plus B-roll. Captions follow the word timings from transcription (WhisperX or faster-whisper).
- Any other style: use the closest kit (`kits/remotion-kit`, `kits/canvas-reel`, `pipeline/stills_render.py`).

## 4. Compare
- Put a contact sheet of ours next to the reference's at the same timestamps. Check cut rate, moving %, caption size and position, and beat alignment (events within 1 frame of their beat).
- Report what matches and what was deliberately changed.

## Never copy
The reference's footage, photos, music, captions, logos, watermark or exact copy. When the owner's footage includes other people (a couple, guests, staff), use it only for the owner's video and never publish it as a template or example.

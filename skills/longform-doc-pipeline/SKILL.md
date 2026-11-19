---
name: longform-doc-pipeline
description: >-
  Use when producing a long-form (12-20 min, 16:9) faceless money or story
  documentary end to end: research, script, cloned-voice VO demo, full VO, frame
  board, animation, review and packaging, with an owner approval gate at each
  step.
---
# Long-form documentary pipeline

Pairs with the documentary-visual-style skill (look and structure), brand-motion-kit (brand), youtube-banger-titles (title) and frame-review-loop (QA).

## 1. Research
- Open at least 20 sources; at least 3 independent sources for every key number. Save research.md with URLs, dates and quotes.
- Note figures that are still moving (live prices, valuations) and when to recheck them.

## 2. Script (gate: owner approves)
- 2,300-3,000 words (about 165-170 wpm after speed-up). Cold open, then named chapters, climax, aftermath and a debate question.
- Fact-check labels per line: SOURCED, OUR MATHS, ILLUSTRATIVE.
- Save script.md plus a clean vo.txt for narration.

## 3. VO demo (gate)
- Use the owner's cloned voice and their saved settings. Generate the cold open plus Part 1 only.
- If the TTS model ignores speed, speed it up afterwards with pitch kept (atempo about 1.1). Normalize to about -16 LUFS.
- Transcribe it with STT and diff against the text to catch mispronunciations, especially names.

## 4. Full VO
- Generate chapter by chapter with the same settings and flow, add 0.8s gaps, normalize, and save word timestamps plus chapter timings (chapters.json).

## 5. Frame board (gate)
- 20-25 key 16:9 frames covering every chapter, mixing about 40% cinematic AI plates, 30% real-source collages (screenshots shown in full), 20% charts and maps, and 10% chapter cards.
- No AI faces of real people (use silhouettes, backs and details). Label AI plates DRAMATIZED RECONSTRUCTION. Source tag every stat. No mock headlines: use real article screenshots.
- Build a contact sheet plus a notes table (frame, chapter, type, VO line, source) and report credits used.

## 6. Animate
- 1920x1080 at 30fps, synced to the word timestamps. Keyframe everything: push-ins, parallax, chart builds, counters, screenshot pans and word-synced callouts. Use a few image-to-video hero shots for the cold open.
- Nothing static for more than about 6s; at least 85% moving frames (measure it).
- Audio: soft, low whooshes; smooth crossfades; music bed 20-22 dB under the VO; master at about -14 LUFS.
- Run frame-review-loop at least twice and fix anything below 8/10.
- Deliver the master plus a lighter review encode and a contact sheet.

## 7. Package (gate: owner approves the post draft)
- Title, 16:9 thumbnail, description with chapters and a numbered SOURCES list, and the line 'Educational story, not financial advice'.
- Nothing posts without the owner's yes.

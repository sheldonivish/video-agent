---
name: frame-review-loop
description: Critique and improve a rendered animation or video by sampling frames into a contact sheet and scoring it like a strict creative director. Use after any code-rendered video render, or when the user asks to review, polish or fix a motion piece.
---

# Frame Review Loop

1. Sample 20 frames evenly across the video with ffmpeg:
   `ffmpeg -i in.mp4 -vf "select='not(mod(n\,N))',scale=480:-1,tile=5x4" -frames:v 1 sheet.png` (pick N = total_frames / 20).
2. Look at the sheet and the first and last 2 seconds at full size.
3. Score 1 to 10:
   - Readability: every word legible on a phone.
   - Continuity: each scene hands off to the next with intent.
   - Timing: key moments land on beats; nothing lingers or flashes.
   - Polish: nothing looks templated, default-eased or clipped.
4. List the three biggest weaknesses with timestamps ("0:03 headline enters too fast").
5. Say explicitly what must not change.
6. Hand the list back to the builder, re-render, repeat until all scores are 8 or more (max 4 rounds).

---
name: frame-review-loop
description: Critique and improve a rendered animation or video by sampling frames into a contact sheet and scoring it like a strict creative director.
---
# Frame Review Loop

1. Sample 20 frames evenly with ffmpeg: ffmpeg -i in.mp4 -vf "select='not(mod(n\,N))',scale=480:-1,tile=5x4" -frames:v 1 sheet.png (N = total_frames / 20).
2. Look at the sheet and the first and last 2 seconds at full size.
3. Score 1-10 on readability, continuity, timing and polish.
4. List the three biggest weaknesses with timestamps.
5. Say explicitly what must not change.
6. Fix, re-render, repeat until every score is 8+ (max 4 rounds).

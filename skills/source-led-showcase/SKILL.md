---
name: source-led-showcase
description: Use when the video is about something a creator built or did (an AI-made game, an AI character account, a workflow thread), and the creator's own clips, screenshots and step list are the visuals. 1:1 or 9:16, uncropped source footage, bold centred STEP chapters, calm voice, creator credited, no invented footage.
---

# Source-led showcase

The creator's thread is the script's spine and their media is the picture. The job is to retell their method faithfully, faster and clearer, while crediting them.

## Format
- 1:1 (1080x1080) or 9:16. 30 fps. 45-90 s. Playback up to about 1.2x only if the owner approves speed for that video.
- Hook (0-10 s): 4-5 hard cuts across the most striking moments of the source clips, with one bold word in the margin per cut (for example 24 HOURS, PLAYABLE, the project name).
- Then the creator intro (name, what they made, the tools they say they used), then STEP 01, 02 and so on as bold centred chapter cards (about 0.5 s), each followed by its proof clip.
- Source frames stay complete and big when settled. No digital zoom or crop into someone else's footage. Movement comes from whole-card entries, exits and handoffs.
- Captions small (about 28 px). Chapter text in one bold display face. Voice only, or a quiet licensed bed. No SFX.
- Close the gaps: no dead time between steps.

## Faithfulness rules
- Download every attachment at the highest available quality and paginate the full author thread. Keep a source manifest of post id, media file and what it shows.
- Attribute claims to the creator ("He says he built it in 24 hours", "he says he used ..."). Do not independently validate tools or timings you didn't test.
- Keep the step order the creator used. Do not move content between steps to suit the script.
- Tool and model names must match the source exactly.
- Never invent footage. If the creator says a feature (for example fights) is not in the demo, don't imply it is.
- If the video is about an AI character or account, say it is AI. Never show a real person's face without consent.
- Credit the creator on screen and in the caption, and credit the breakdown author when the method came from someone else's thread.

## Workflow
1. Read the full thread and save the media and the manifest. Have a video model (or a frame-by-frame read) describe each clip with timestamps, so every VO beat maps to a real moment.
2. Script in the house format with a fact-check section listing the exact creator wording. Wait for approval.
3. Build a timeline table (output time, asset and source time range, VO topic, what moves, exit) before writing the renderer.
4. Render (PIL/ffmpeg or Remotion), then QA every script beat against the source footage, not just the numbers.
5. A comment-to-DM CTA is a good fit ("comment GAME for the link"). See video-publish-kit.

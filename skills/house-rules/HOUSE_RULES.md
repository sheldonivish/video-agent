# Video Agent house rules (Ivish's standing preferences)

## Scripts and facts
- Write every script with the video-script-package skill. Label each claim FACT, COMPANY CLAIM, INTERPRETATION or SPECULATION.
- Never make up numbers. Every stat on screen must come from a source opened in the same session and needs a small source tag on screen.
- Claims in a post that the footage doesn't show stay out of the hook and the on-screen text. Point them out to Ivish instead.
- For promos, use the owner's script word for word: clean, no fluff and no invented wording.

## Motion and visuals
- Open with motion from frame 1, with no static title card. At least 85% of frames should be moving; measure this before delivering.
- Never repeat the same image or clip.
- Keep photos and screenshots static: no drift, zoom or Ken Burns. Put the motion in purpose-built graphics and kinetic text that clearly show what happened.
- Show source screens and screenshots in full and clearly visible. Never crop them or cut them off.
- When a video names a company or project, show its official logo in its brand colours, centred and never tucked at the edges.
- Every format needs equal left and right safe gaps (about 90px on a 1080-wide frame) so nothing gets cut off by Instagram or YouTube crops or curved phone screens.

## Process, review and delivery
- For promos, get Ivish's approval on mockups or a frame board before animating. Remotion is the promo tool; offer to install its plugin if it's missing.
- Run the frame-review-loop skill (a contact sheet plus scores) on every render before delivering.
- Deliver files in chat for review, encoded for playback compatibility: ffmpeg -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -c:a aac -ar 48000 -ac 2 -movflags +faststart
- Captions and posts use short lines, a blank line between beats, key words in bold, and hashtags on their own line after a gap.
- Telegram posts have no emojis, stay short and always include the content link.
- Nothing ever posts without Ivish's explicit yes on the exact draft (video, caption, and target platforms and accounts).
- Never print API keys or secrets.

## Reference script
- /workspace/ivish10x/make_clip.py is the clipping template for the @ivish10x account (PIL plus ffmpeg, 1080x1920). It's specific to ivish10x branding, but you can use it as a pattern for overlay layout.

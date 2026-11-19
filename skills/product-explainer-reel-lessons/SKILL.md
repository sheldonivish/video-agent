---
name: product-explainer-reel-lessons
description: >-
  Use when making a 35-50s product or founder explainer reel ("Someone just
  built...") with a cloned-voice VO: voice, edit, script and QA lessons from
  owner feedback on real reel tests.
---
# Product explainer reel lessons

These lessons come from owner feedback on explainer reel tests. A specific instruction from the owner on a video (for example an approved VO speed-up on a long-form doc) overrides them.

## Voice
- Write to fit the time: natural pace is about 2.5 words per second, so a 45s reel is about 115-120 words. Don't speed the VO up in post by default, and keep TTS speed at or below about 1.05. Heavy speed-ups make the voice sound weak.
- Spell out numbers and symbols in the TTS text ("two thousand three hundred", "terabytes") and check that product names don't split ("Lastbook" coming out as "Last Book").
- Use the owner's saved voice settings. Pick the model that sounds fullest for that voice (eleven_v4 with light tags like [confident], [serious] or [excited] has worked best; multilingual_v2 can sound thin and quiet).
- Voice chain: a gentle lift around 180 Hz, a small cut around 450 Hz, about +3.5 dB at 4 kHz, light 3:1 compression, and a final mix at -14 LUFS.
- Use the with-timestamps TTS endpoint so captions line up with the words. Send the VO for approval before building the video.

## Edit and sound
- Almost no whooshes or SFX.
- Very smooth transitions: soft 6-10 frame crossfades and slow eased push-ins. Shots of about 2-3s.
- Slow ambient music at about 70-80 BPM, about 20 dB under the voice.
- 1:1 (1080x1080) is preferred for this kind of explainer, with captions about 76-80% down the frame.

## Script and brand
- Open with a hook like "Someone just built..." and cut the fluff.
- End with a CTA: Comment "KEYWORD" and I'll send you the link, with the link also in the caption.
- Use only real visuals: the founder's posts and website screenshots. Never reuse another creator's footage or branding.
- Confirm which brand the video is for before branding it. Nothing posts or gets scheduled without an explicit yes from the owner.

## QA
- Make a contact sheet of frames, check loudness with ffmpeg loudnorm, check the captions against the voice timestamps, and fact-check every number against its source post.

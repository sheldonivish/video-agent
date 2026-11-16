---
name: video-agent-getting-started
description: Use for the very first conversation between this imported Video Agent bot and its new owner, before making any video. Introduces the bot in one line, asks setup questions one at a time (brand, voice, posting tool, music, formats), saves the answers as memories, then offers to start.
---

# Getting started (first chat with a new owner)

Open with one line, then ask the first question:
"I make short, fact-checked videos for your brand: image-led explainers, chart-first lessons, news stories, motion explainers, product launch films, feature series and silent contrast reels. Each one is scripted, voiced, rendered and QA'd, and nothing posts without your yes."

Ask these **one at a time**, waiting for each answer. Accept "skip" and move on.
1. **Brand:** what is the brand called (exact casing), and what are its handles? Do you have a brand guide? I need colours (hex), fonts, logo files (on dark, on light, mark only) and any logos you've rejected. Send files or a link.
2. **Voice:** should videos be voiced? Which provider (for example ElevenLabs), and do you have a cloned voice? If yes, add the API key and voice id to my environment yourself (don't paste keys in chat). How should it sound: calm, natural accent, normal speed?
3. **Posting:** where do you post (X, Instagram, TikTok, YouTube, LinkedIn, Facebook, Telegram), and through which tool (a scheduler like Postiz, native apps, or manual)? Do you want comment-to-DM keyword automations, and in which tool?
4. **Music:** licensed tracks you provide, CC BY tracks (for example Kevin MacLeod, credited in the YouTube description only), or beds synthesized in code?
5. **Formats:** which formats do you want by default, and in which aspect (9:16, 1:1, 16:9)? Offer the list: image-led explainer, chart-first lesson reels, news story reel, keyframe motion explainer, source-led showcase, Remotion launch film, product feature series, canvas explainer series, campaign promo, contrast reels, or recreate a reference reel you send.
6. **Rules:** any house rules? Defaults I'll follow unless you change them: no emojis in captions or DMs, at most 5 hashtags, a 9:16 cover with a centred 1:1 design, music credit only in YouTube descriptions, every claim fact-checked, and nothing posted without approval.

## Then
- Save memories: one brand kit per brand (fill `brand-motion-kit` with confirmed fields only and leave the rest TODO), voice provider and settings (never the key itself), posting tool and platforms, music source, default formats and aspects, and house rules.
- Set up the code on your box: clone this repo, then install ffmpeg, Python 3 with numpy, Pillow, Playwright and faster-whisper, plus Node 20+ for the Remotion kit. Run one smoke test, such as the chart-reel `--check` or a canvas-reel preview.
- Confirm in one short message what you saved and what is still TODO.
- Offer to start: "Send me a topic, a link or a post, and I'll write the script in the approval format: 3 hooks, a timed voiceover with visuals, a fact check and a style note."
- Never post or send anything without the owner's explicit approval of that exact post.

---
name: video-pipeline
description: Use when building or checking any voiced short video. It covers voicing a script with word timings, mastering voice and a licensed music bed to -14 LUFS, rendering an image-led timeline, contact sheets, the 85% moving-frame audit, the ASR pronunciation check and the one-shot QA report. These are the shared scripts in pipeline/ that every format skill calls.
---

# Video pipeline (shared tools)

All the scripts live in `pipeline/` and need Python 3, numpy, Pillow and ffmpeg. Keys come from the environment and are never written in files you share.

| Step | Command | Output |
|---|---|---|
| Voice | `voice.py script.txt vo/` | `voice.wav`, `voice.alignment.json` (characters and words with times) |
| Pronunciation | `asr_check.py vo/voice.raw.mp3 script.txt` | a diff of heard words against the script |
| Image-led render | `stills_render.py timeline.json silent.mp4 --audio mix.wav --final final.mp4` | hard-cut still edit with small captions |
| Master | `master_audio.py --voice vo/voice.wav [--music bed.mp3] --dur D --out mix.wav [--bed-out bed.wav]` | a -14 LUFS master with a -1.5 dBTP ceiling, music about 20 dB under speech and ducked |
| Motion gate | `motion_audit.py final.mp4` | moving-frame %; exit 0 at 85% or more |
| Sheet | `contact_sheet.py final.mp4 sheet.jpg --every 1` | timestamped frames for review |
| QA | `qa_report.py final.mp4 [--min-motion 85] [--min-cuts-10s 8]` | size, fps, duration, loudness, cuts, motion; PASS or FAIL |
| Cover | `cover.py square.png cover.jpg [--blur]` | 9:16 with a centred 1:1 design |

## Environment
```
ELEVENLABS_API_KEY=...        # keep in a local .env, never commit
ELEVENLABS_VOICE_ID=...       # the owner's cloned voice
ELEVENLABS_VOICE_NAME=...     # optional guard: refuse to voice with the wrong voice
ELEVENLABS_MODEL=...          # optional
```

## House audio defaults
- Clone settings: stability 0.50, similarity 0.50, style 0.05-0.10, speaker boost on, speed 1.0, natural accent. Change speed only when the owner asks for it on that video.
- Music must be licensed: CC BY tracks (for example Kevin MacLeod at incompetech.com, credited per the licence), a paid library, or a bed synthesized in code. Never rip music from another video.
- No whooshes or transition SFX in explainers. Promos may use light SFX if the brand allows.
- Loudness -14 LUFS integrated (±1), true peak at or below -1 dBTP.

## Timing discipline
- Take every shot boundary from the word alignment, or resolve phrases to times (`at("Once inside")`). Never hand-type times you guessed.
- Regenerated voice means regenerated timeline. Don't stretch the old cut.

## Review loop
A numeric pass is not approval. After QA, read the contact sheet like a strict creative director (frame-review-loop). Check sharpness, cropping, text collisions, empty stretches and whether each frame illustrates its line. Fix the issues, render again and re-check, then deliver.

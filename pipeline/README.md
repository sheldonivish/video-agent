# pipeline: shared tools for every format

See `skills/video-pipeline` for the full table. Requirements: Python 3, numpy, Pillow, ffmpeg; `faster-whisper` for `asr_check.py`.
Keys come from the environment (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`). Keep them in a local `.env`, which is gitignored.

| Script | Purpose |
|---|---|
| `voice.py` | TTS with word timings |
| `asr_check.py` | transcribe the take and diff against the script (mispronunciations) |
| `stills_render.py` | image-led explainer renderer from a timeline JSON (hard cuts, sharp stills, small captions) |
| `master_audio.py` | voice master or voice + licensed bed ducked about 20 dB under speech, -14 LUFS, -1.5 dBTP |
| `motion_audit.py` | moving-frame % gate (>= 85% for motion formats) |
| `contact_sheet.py` | timestamped frame sheet for review |
| `qa_report.py` | size, fps, duration, loudness, cuts in the first 10 s, motion; PASS or FAIL |
| `cover.py` | 9:16 cover with a centred 1:1 design |

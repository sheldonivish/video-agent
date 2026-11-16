#!/usr/bin/env python3
"""Voiceover with word timings (ElevenLabs text-to-speech with-timestamps).

usage: voice.py script.txt outdir/ [--model eleven_multilingual_v2] [--speed 1.0]
env:   ELEVENLABS_API_KEY   your key (never commit it; keep it in a local .env)
       ELEVENLABS_VOICE_ID  your cloned or chosen voice
       ELEVENLABS_VOICE_NAME optional: refuse to run unless the voice id resolves to this name
writes outdir/voice.raw.mp3, outdir/voice.wav (mono 44.1k) and outdir/voice.alignment.json

Defaults match the house read: calm, natural accent, normal speed.
stability 0.50, similarity 0.50, style 0.07, speaker boost on. Override with flags."""
import argparse, base64, json, os, re, subprocess, sys, urllib.error, urllib.request
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("script"); ap.add_argument("outdir")
ap.add_argument("--model", default=os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"))
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--stability", type=float, default=0.50)
ap.add_argument("--similarity", type=float, default=0.50)
ap.add_argument("--style", type=float, default=0.07)
a = ap.parse_args()

key = os.environ.get("ELEVENLABS_API_KEY"); vid = os.environ.get("ELEVENLABS_VOICE_ID")
if not key or not vid:
    sys.exit("set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in your environment")
H = {"xi-api-key": key, "Content-Type": "application/json"}
out = Path(a.outdir); out.mkdir(parents=True, exist_ok=True)
text = re.sub(r"\s*\n\s*", " ", Path(a.script).read_text().strip())

want = os.environ.get("ELEVENLABS_VOICE_NAME")
if want:  # guard against voicing a whole video with the wrong voice
    voices = json.load(urllib.request.urlopen(urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers=H), timeout=60))["voices"]
    meta = next((v for v in voices if v.get("voice_id") == vid), None)
    if not meta or meta.get("name", "").lower() != want.lower():
        sys.exit(f"voice id does not resolve to {want!r}; refusing to voice")

vs = {"speed": a.speed, "stability": a.stability, "similarity_boost": a.similarity, "style": a.style, "use_speaker_boost": True}
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps?output_format=mp3_44100_192",
    data=json.dumps({"text": text, "model_id": a.model, "voice_settings": vs}).encode(), headers=H)
try:
    res = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f"{e.code} {e.read()[:300]!r}")
(out / "voice.raw.mp3").write_bytes(base64.b64decode(res["audio_base64"]))
al = res["alignment"]
# word list from character alignment: [{w, s, e}]
words, cur, s0 = [], "", None
for ch, cs, ce in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
    if ch.isspace():
        if cur: words.append({"w": cur, "s": s0, "e": pe}); cur = ""
        continue
    if not cur: s0 = cs
    cur += ch; pe = ce
if cur: words.append({"w": cur, "s": s0, "e": pe})
json.dump({"model": a.model, "voice_settings": vs, "text": text, "alignment": al, "words": words},
          open(out / "voice.alignment.json", "w"), ensure_ascii=False)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(out / "voice.raw.mp3"), "-ar", "44100", "-ac", "1", str(out / "voice.wav")], check=True)
print(f"ok  {al['character_end_times_seconds'][-1]:.2f}s  {len(words)} words  -> {out}")

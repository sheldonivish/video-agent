#!/usr/bin/env python3
"""Transcribe a voiceover take and diff it against the script, to catch TTS mispronunciations
(brand names, tickers, partner names) before you build picture on top of it.

usage: asr_check.py voice.mp3 [script.txt] [--model small]
needs: pip install faster-whisper"""
import argparse, difflib, re, subprocess, numpy as np
from faster_whisper import WhisperModel
ap = argparse.ArgumentParser(); ap.add_argument("audio"); ap.add_argument("script", nargs="?"); ap.add_argument("--model", default="small")
a = ap.parse_args()
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segs, _ = WhisperModel(a.model, device="cpu", compute_type="int8").transcribe(x)
heard = " ".join(s.text.strip() for s in segs); print("HEARD:", heard)
if a.script:
    norm = lambda t: re.sub(r"[^a-z0-9$%' ]", " ", t.lower()).split()
    want, got = norm(open(a.script).read()), norm(heard)
    sm = difflib.SequenceMatcher(None, want, got)
    print(f"match {sm.ratio():.0%}")
    for op, i0, i1, j0, j1 in sm.get_opcodes():
        if op != "equal":
            print(f"  {op:8s} script: {' '.join(want[i0:i1])!r:40s} heard: {' '.join(got[j0:j1])!r}")

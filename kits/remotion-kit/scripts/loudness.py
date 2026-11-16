"""Loudness check of a rendered video/audio file. usage: python3 scripts/loudness.py out/video.mp4  (target about -14 LUFS, peak <= -1 dBFS)"""
import sys, subprocess, tempfile, os, wave
import numpy as np, pyloudnorm as pyln
src = sys.argv[1]; tmp = tempfile.mktemp(suffix='.wav')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-vn', '-ac', '2', '-ar', '48000', tmp], check=True)
with wave.open(tmp) as w: d = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2) / 32768
os.remove(tmp)
print(src, 'integrated LUFS', round(pyln.Meter(48000).integrated_loudness(d), 2), 'peak dBFS', round(20 * np.log10(np.max(np.abs(d)) + 1e-12), 2))

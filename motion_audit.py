#!/usr/bin/env python3
"""Measure how alive a video is. Usage: motion_audit.py file.mp4 [fps]
MOVING = share of frames where >1% of pixels changed by >10 grey levels.
PASS = MOVING >= 85%. The graphinsight reference reels score 93-96%.
Exit 0 pass, 1 fail on motion, 2 file missing/empty."""
import subprocess, sys, os, numpy as np
f = sys.argv[1]
fps = int(sys.argv[2]) if len(sys.argv) > 2 else 30
if not os.path.exists(f) or os.path.getsize(f) == 0:
    print("file missing or empty:", f); sys.exit(2)
w, h = 270, 480
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"scale={w}:{h}",
                      "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
n = len(raw) // (w * h)
if n < 3:
    print("could not decode any frames:", f); sys.exit(2)
a = np.frombuffer(raw, dtype=np.uint8)[:n * w * h].reshape(n, h, w).astype(np.int16)
changed = (np.abs(np.diff(a, axis=0)) > 10).mean(axis=(1, 2))
moving = 100 * (changed >= 0.01).mean()
per = [changed[i:i + fps].mean() * 100 for i in range(0, len(changed), fps)]
print("file      :", f)
print("duration  : %.2fs  frames=%d" % (n / fps, n))
print("MOVING    : %.0f%% of frames  (PASS >=85%%, reference reels were 93-96%%)" % moving)
print("per-second:", " ".join("%.0f" % x for x in per))
sys.exit(0 if moving >= 85 else 1)

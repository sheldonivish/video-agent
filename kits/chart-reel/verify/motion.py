#!/usr/bin/env python3
"""Honest motion audit. Decodes to tiny gray frames and measures
mean absolute difference between consecutive frames.

  moving  = frames whose delta clears 0.1/255
  static  = everything else
Reports the longest run of near-identical frames so a 6-second
freeze can never hide behind an average again.
"""
import subprocess, sys, numpy as np

def sample(path, w=135, h=240, fps=10):
    p = subprocess.run(["ffmpeg","-v","error","-i",path,"-vf",
        f"fps={fps},scale={w}:{h}:flags=area,format=gray","-f","rawvideo","-"],
        capture_output=True, check=True)
    a = np.frombuffer(p.stdout, np.uint8)
    n = len(a)//(w*h)
    return a[:n*w*h].reshape(n, h, w).astype(np.float32)

def main(path):
    f = sample(path)
    d = np.abs(np.diff(f, axis=0)).mean(axis=(1,2))
    thr = 0.1
    moving = d > thr
    # longest static run
    best = cur = 0; bstart = cstart = 0
    for i, m in enumerate(moving):
        if m: cur = 0
        else:
            if cur == 0: cstart = i
            cur += 1
            if cur > best: best, bstart = cur, cstart
    fps = 10
    print(f"{path}")
    print(f"  frames sampled      {len(d)+1}  ({len(d)/fps:.1f}s at {fps}fps)")
    print(f"  moving frames       {moving.mean()*100:5.1f}%   (> {thr} mean abs delta)")
    print(f"  median delta        {np.median(d):.4f}")
    print(f"  p90 delta           {np.percentile(d,90):.4f}")
    print(f"  longest static run  {best/fps:.1f}s  starting {bstart/fps:.1f}s")
    # per-5s breakdown so a flat stretch is visible in the output itself
    print("  per 5s window (% moving):")
    for s in range(0, int(len(d)/fps)+1, 5):
        w = moving[s*fps:(s+5)*fps]
        if len(w): print(f"    {s:2d}-{s+5:2d}s  {w.mean()*100:5.1f}%")
    return moving.mean()

if __name__ == "__main__":
    sys.exit(0 if main(sys.argv[1]) else 1)

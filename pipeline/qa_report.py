#!/usr/bin/env python3
"""One-shot QA numbers for a delivered file. A pass here is not creative approval; watch it too.

usage: qa_report.py final.mp4 [--min-motion 85] [--min-cuts-10s 0] [--lufs -14] [--tp -1.0]
prints: size, fps, duration, integrated loudness + true peak, hard cuts (all / first 10 s),
moving-frame share; exits 1 when a gate fails."""
import argparse, subprocess, sys, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument("f")
ap.add_argument("--min-motion", type=float, default=0); ap.add_argument("--min-cuts-10s", type=int, default=0)
ap.add_argument("--lufs", type=float, default=-14.0); ap.add_argument("--tp", type=float, default=-1.0); a = ap.parse_args()
pr = lambda *k: subprocess.check_output(["ffprobe", "-v", "error", *k, a.f], text=True).strip()
w, h, fr = pr("-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "csv=p=0").split(",")
dur = float(pr("-show_entries", "format=duration", "-of", "csv=p=0")); num, den = map(int, fr.split("/")); fps = num / den
e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.f, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
s = e[e.rfind("Summary:"):]; I = float(s.split("I:")[1].split("LUFS")[0]); TP = float(s.split("Peak:")[1].split("dBFS")[0])
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.f, "-vf", "scale=270:480", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
n = len(raw) // (270 * 480); fr_ = np.frombuffer(raw, np.uint8)[:n * 270 * 480].reshape(n, 480, 270).astype(np.int16)
ch = (np.abs(np.diff(fr_, axis=0)) > 10).mean(axis=(1, 2))
moving = 100 * (ch >= 0.01).mean()
d_ = np.abs(np.diff(fr_, axis=0)).mean(axis=(1, 2))
cuts = [(i + 1) / fps for i in range(len(d_)) if d_[i] > max(2.0, 4 * np.median(d_[max(0, i - 15):i + 15]))]  # hard cut = sudden whole-frame jump
c10 = sum(1 for t in cuts if t < 10)
print(f"size {w}x{h}  fps {fps:.2f}  duration {dur:.2f}s")
print(f"loudness {I} LUFS  true peak {TP} dBFS   (target {a.lufs} +/-1, peak <= {a.tp})")
print(f"cuts {len(cuts)} total, {c10} in first 10 s")
print(f"moving frames {moving:.0f}%")
bad = []
if abs(I - a.lufs) > 1.0: bad.append("loudness")
if TP > a.tp: bad.append("true peak")
if moving < a.min_motion: bad.append(f"motion < {a.min_motion}%")
if c10 < a.min_cuts_10s: bad.append(f"cuts in first 10 s < {a.min_cuts_10s}")
print("PASS" if not bad else "FAIL: " + ", ".join(bad)); sys.exit(1 if bad else 0)

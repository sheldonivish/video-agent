#!/usr/bin/env python3
"""Contact sheet: one frame every N seconds, labelled with its timestamp, for frame review.
usage: contact_sheet.py video.mp4 sheet.jpg [--every 1.0] [--cols 8] [--w 240]"""
import argparse, json, subprocess, io
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--every", type=float, default=1.0); ap.add_argument("--cols", type=int, default=8); ap.add_argument("--w", type=int, default=240)
a = ap.parse_args()
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.video]))
tiles = []; t = 0.0
while t < dur:
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", a.video, "-frames:v", "1", "-vf", f"scale={a.w}:-1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    if png: tiles.append((t, Image.open(io.BytesIO(png)).convert("RGB")))
    t += a.every
tw, th = tiles[0][1].size; rows = (len(tiles) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (tw * a.cols, (th + 22) * rows), (30, 30, 30)); d = ImageDraw.Draw(sheet)
for i, (t, im) in enumerate(tiles):
    x, y = (i % a.cols) * tw, (i // a.cols) * (th + 22); sheet.paste(im, (x, y + 22)); d.text((x + 4, y + 4), f"{t:.1f}s", fill="white")
sheet.save(a.out, quality=90); print(f"{len(tiles)} frames -> {a.out}")

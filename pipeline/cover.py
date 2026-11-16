#!/usr/bin/env python3
"""9:16 cover with the design as a centred 1:1 square.

usage: cover.py square_design.png cover_9x16.png [--bg "#000000"] [--blur]
The square (your 1:1 cover art) is placed dead centre on a 1080x1920 canvas, so the
same art reads on square grids and full-screen vertical feeds. --blur fills the top and
bottom bands with a darkened, blurred copy instead of a flat colour. No logo is added."""
import argparse
from PIL import Image, ImageFilter, ImageEnhance
ap = argparse.ArgumentParser(); ap.add_argument("square"); ap.add_argument("out")
ap.add_argument("--bg", default="#000000"); ap.add_argument("--blur", action="store_true"); a = ap.parse_args()
sq = Image.open(a.square).convert("RGB")
if sq.width != sq.height: raise SystemExit(f"design must be square, got {sq.size}")
sq = sq.resize((1080, 1080), Image.Resampling.LANCZOS)
if a.blur:
    bg = sq.resize((1920, 1920)).crop((420, 0, 1500, 1920)).filter(ImageFilter.GaussianBlur(60))
    bg = ImageEnhance.Brightness(bg).enhance(0.35)
else:
    bg = Image.new("RGB", (1080, 1920), a.bg)
bg.paste(sq, (0, 420)); bg.save(a.out, quality=95); print("cover ->", a.out)

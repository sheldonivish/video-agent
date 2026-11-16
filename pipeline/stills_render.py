#!/usr/bin/env python3
"""Image-led explainer renderer: sharp static stills, hard cuts, small captions.

usage: stills_render.py timeline.json out_silent.mp4 [--audio mix.wav --final final.mp4]

Timeline JSON (times in seconds; take them from the voice alignment, never guess):
{
  "size": [1080, 1080], "fps": 30, "duration": 60.0,
  "bg": "#000000", "ink": "#F5F5F5", "muted": "#78787E", "accent": "#E63434",
  "font_bold": "fonts/InterTight.ttf", "font_body": "fonts/InterTight.ttf",
  "words": "vo/voice.alignment.json",                 # optional: small captions from word timings
  "captions": {"size": 30, "y": 0.94, "max_words": 4},
  "shots": [
    {"start": 0.0, "end": 0.8, "type": "quote", "text": "Exact words from the post.", "highlight": "Exact words",
     "author": "Name", "meta": "@handle · 13 Nov", "label": "Quote, recreated"},
    {"start": 0.8, "end": 1.6, "type": "image", "src": "assets/screenshot.png", "label": "Source: example.com"},
    {"start": 1.6, "end": 2.4, "type": "title", "text": "FIVE DAYS", "sub": "before anything moved"},
    {"start": 2.4, "end": 3.4, "type": "counter", "from": 1, "to": 5, "prefix": "DAY "}
  ]
}
Rules this renderer enforces: images are never upscaled (max_scale defaults to 1.0) and never
cropped (contain-fit with margins); cuts are hard; the only in-shot motion is a short settle
(8 px over 0.4 s) and the reveal of a highlight, so stills stay sharp. A shot "label" prints
small at the top left, which is where "Illustration" or "Recreated" disclosures go."""
import argparse, json, subprocess
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser(); ap.add_argument("timeline"); ap.add_argument("out")
ap.add_argument("--audio"); ap.add_argument("--final"); a = ap.parse_args()
T = json.load(open(a.timeline)); W, H = T.get("size", [1080, 1080]); FPS = T.get("fps", 30); DUR = T["duration"]
hexrgb = lambda h: tuple(int(h.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))
BG, INK, MUT, ACC = (hexrgb(T.get(k, d)) for k, d in (("bg", "#000000"), ("ink", "#F5F5F5"), ("muted", "#78787E"), ("accent", "#E63434")))
_fc = {}
def F(size, bold=True):
    k = (size, bold)
    if k not in _fc: _fc[k] = ImageFont.truetype(T["font_bold" if bold else "font_body"], size)
    return _fc[k]
eo = lambda u: 1 - (1 - max(0, min(1, u))) ** 3
_ic = {}
def img(p):
    if p not in _ic: _ic[p] = Image.open(p).convert("RGBA")
    return _ic[p]

def wrap(d, text, f, maxw):
    lines, cur = [], []
    for w in text.split():
        if cur and d.textlength(" ".join(cur + [w]), font=f) > maxw: lines.append(" ".join(cur)); cur = [w]
        else: cur.append(w)
    if cur: lines.append(" ".join(cur))
    return lines

def draw_shot(im, d, s, l):
    settle = (1 - eo(l / 0.4)) * 8
    k = s["type"]
    if k == "image":
        src = img(s["src"]); m = s.get("margin", 60)
        sc = min((W - 2 * m) / src.width, (H - 2 * m) / src.height, s.get("max_scale", 1.0))
        r = src.resize((max(1, int(src.width * sc)), max(1, int(src.height * sc))), Image.Resampling.LANCZOS)
        im.paste(r, ((W - r.width) // 2, int((H - r.height) // 2 + settle)), r)
    elif k == "quote":
        f = F(s.get("size", 50), False); lh = int(f.size * 1.42); lines = wrap(d, s["text"], f, W - 240)
        top = int(H / 2 - (86 + lh * len(lines)) / 2 + settle)
        d.rounded_rectangle((60, top - 40, W - 60, top + 86 + lh * len(lines) + 30), 30, fill=(12, 12, 14), outline=(48, 48, 54), width=2)
        d.text((110, top + 8), s.get("author", ""), font=F(34), fill=INK)
        d.text((110 + d.textlength(s.get("author", ""), font=F(34)) + 18, top + 16), s.get("meta", ""), font=F(26, False), fill=MUT)
        hl = s.get("highlight", ""); u = eo((l - 0.15) / 0.35)
        for i, ln in enumerate(lines):
            y = top + 86 + i * lh; d.text((110, y), ln, font=f, fill=INK)
            if hl and u > 0:
                for part in hl.split():
                    j = ln.find(part)
                    if j >= 0:
                        x0 = 110 + d.textlength(ln[:j], font=f); x1 = x0 + d.textlength(part, font=f)
                        d.rectangle((x0, y + f.size + 8, x0 + (x1 - x0) * u, y + f.size + 14), fill=ACC)
    elif k == "title":
        f = F(s.get("size", 110)); y = H / 2 - (40 if s.get("sub") else 0) + settle
        d.text((W / 2, y), s["text"], font=f, fill=ACC if s.get("accent") else INK, anchor="mm")
        if s.get("sub"): d.text((W / 2, y + f.size * 0.85), s["sub"], font=F(40, False), fill=MUT, anchor="mm")
    elif k == "counter":
        n0, n1 = s.get("from", 0), s["to"]; u = eo(l / max(0.01, (s["end"] - s["start"]) * 0.7))
        v = round(n0 + (n1 - n0) * u); d.text((W / 2, H / 2 + settle), f"{s.get('prefix', '')}{v:,}{s.get('suffix', '')}", font=F(s.get("size", 150)), fill=INK, anchor="mm")
    if s.get("label"):
        d.text((40, 36), s["label"], font=F(24, False), fill=MUT)

words = []
if T.get("words"):
    words = json.load(open(T["words"])).get("words", [])
C = T.get("captions", {}); CW = C.get("max_words", 4)
chunks = [words[i:i + CW] for i in range(0, len(words), CW)]
def caption(d, t):
    for ch in chunks:
        if ch[0]["s"] <= t < (ch[-1]["e"] + 0.05):
            d.text((W / 2, H * C.get("y", 0.94)), " ".join(w["w"] for w in ch), font=F(C.get("size", 30)), fill=INK, anchor="mm",
                   stroke_width=3, stroke_fill=BG)
            return

shots = sorted(T["shots"], key=lambda s: s["start"])
p = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out], stdin=subprocess.PIPE)
for fi in range(int(round(DUR * FPS))):
    t = fi / FPS; im = Image.new("RGBA", (W, H), BG + (255,)); d = ImageDraw.Draw(im, "RGBA")
    cur = next((s for s in reversed(shots) if s["start"] <= t), None)
    if cur and t < cur["end"]: draw_shot(im, d, cur, t - cur["start"])
    if words: caption(d, t)
    p.stdin.write(im.convert("RGB").tobytes())
p.stdin.close(); p.wait()
print("silent ->", a.out)
if a.audio and a.final:
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.out, "-i", a.audio, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", "-movflags", "+faststart", a.final], check=True)
    print("final ->", a.final)

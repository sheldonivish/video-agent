"""Brand constants for the series kit, loaded from brand.json (copy brand.example.json).
Nothing brand-specific is hard-coded here; every value comes from your brand kit."""
import json, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
_p = os.environ.get("BRAND_JSON", os.path.join(HERE, "brand.json"))
if not os.path.exists(_p):
    _p = os.path.join(HERE, "brand.example.json")
B = json.load(open(_p))
hexrgb = lambda h: tuple(int(h.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))
FONT = B["font_path"]
GREEN = hexrgb(B["colors"]["up"]); CYAN = hexrgb(B["colors"]["down"])          # up / down semantic colours
BLACK = hexrgb(B["colors"]["base"]); GRAPHITE = hexrgb(B["colors"]["surface"])
GREY = hexrgb(B["colors"]["muted"]); WHITE = hexrgb(B["colors"]["text"])
W, H = 1080, 1920
def font(size, weight=700):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_axes([weight])
    except Exception: pass
    return f
def logo(dark=True, width=600):
    path = B["logo_dark"] if dark else B["logo_light"]
    if not path or not os.path.exists(path):
        return Image.new("RGBA", (width, 1), (0, 0, 0, 0))   # no logo supplied: draw nothing, never fake one
    im = Image.open(path).convert("RGBA")
    im = im.crop(im.getbbox()); return im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
def gradient(w, h):
    a, b = hexrgb(B["colors"]["gradient_from"]), hexrgb(B["colors"]["gradient_to"])
    g = Image.new("RGB", (w, h)); d = ImageDraw.Draw(g)
    for x in range(w):
        t = x / max(1, w - 1); d.line([(x, 0), (x, h)], fill=tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    return g
def ctext(d, y, text, f, fill, cx=W // 2):
    bb = d.textbbox((0, 0), text, font=f); d.text((cx - (bb[2] - bb[0]) // 2 - bb[0], y), text, font=f, fill=fill)

# canvas-reel: HTML Canvas explainer kit (glowing figures, world camera, pills)

Each project is a folder inside this kit with `index.html` (copy of `template.html`), `pre.js` (brand and images) and `scene.js` (camera keys, pills, `WORLD(t, view)`). Every frame is a pure function of `t`.

```bash
pip install playwright numpy pillow && python3 -m playwright install chromium   # or set CHROME_PATH
python3 render.py example preview 0.5,3.5,6.5,9.5   # -> example/build/preview/*.jpg
python3 sheet.py example                             # -> example/build/sheet.png
python3 render.py example mtest 10                   # quick moving-frame estimate
python3 render.py example full 10                    # -> example/build/frames
# put your voice at example/build/vo.mp3, then:
./finish.sh example 10 [licensed_bed.wav]            # -> example/final.mp4 (-14 LUFS) + review/contact_sheet.png
python3 render.py example cover 9x16                 # needs window.COVER
```

`core.js` helpers: `setCam([[t,x,y,zoom],...])` (monotone cubic), `figure`, `seatedFigure`, `polyline`, `arrow`, `dashed`, `line`, `text`, `box`, `disc`, `ring`, `burst`, `spot`, `coin`, `dial`, `chip`, `img`, `PILLS`, `endCard(t, x, t0)`, and easings `eo`, `eio`, `back`, `pr`, `win`.
Brand values come from `window.BRAND`. Put your own logo PNGs in `brand/` (none are bundled). Fonts: Inter Tight (OFL, see `fonts/OFL.txt`).

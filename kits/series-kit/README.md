# series-kit: end cards and overlays for a recurring short-form series

Brand values come from `brand.json` (copy `brand.example.json`, or point `BRAND_JSON` at your file).
No logos or fonts are bundled. If a logo path is missing the card is drawn without one; it is never faked.

    python3 make_endcard.py --line "your line." --sub yourbrand.com --out endcard.mp4 --png endcard.png --dur 2.5
    python3 make_overlay.py timer   --text "22 min left" --out t.png
    python3 make_overlay.py money   --text "+$18" --out m.png     # leading -/− switches to the "down" colour
    python3 make_overlay.py score   --a THEM --b ME --sa 3 --sb 2 --out s.png
    python3 make_overlay.py caption --text "paid." --out c.png

Overlay onto footage: `ffmpeg -i clip.mp4 -i t.png -filter_complex "overlay=(W-w)/2:(H-h)/2" out.mp4`.
Keep overlays inside the vertical safe zone (about y 250-1600 on 1080x1920). Append the end card with the ffmpeg concat demuxer.

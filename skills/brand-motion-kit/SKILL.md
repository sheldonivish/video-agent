---
name: brand-motion-kit
description: Read before any video, reel, animation, cover or social graphic for one of the owner's brands. It is a fill-in brand kit (logo files, colours, type, casing, voice, layout, motion, audio and end card) plus the rules for using it. One copy per brand; never invent a brand detail the owner hasn't confirmed.
---

# Brand motion kit (template, one per brand)

Fill this in during onboarding from the owner's brand guide and logo files, and save it per brand. A field you can't confirm stays `TODO`. **Unconfirmed details are never invented**, and a colour found in an old render or a generic kit is not evidence of a brand colour.

```yaml
brand: <name as it should be written, e.g. lowercase "acme">
channels: {x: "@...", instagram: "@...", youtube: "...", site: "..."}
logo:
  primary: <path to the approved file, used unchanged>
  on_dark: <path>
  on_light: <path>
  mark_only: <path, if a symbol exists>
  rejected: [<paths the owner rejected; never use them>]
colors:            # hex, from the guide
  base: "#..."     # main background
  surface: "#..."  # cards
  text: "#..."
  muted: "#..."
  accent: "#..."   # one accent per piece unless the guide says otherwise
  up: "#..."       # semantic colours, if the brand uses them (e.g. green up / cyan down)
  down: "#..."
  gradient: ["#...", "#..."]   # and how often it may appear (e.g. one accent per piece)
ratio: "about 80% neutral, 20% brand"   # if the guide gives one
type:
  display: <family + weights>   # max two families
  body: <family + weights>
  avoid: [Thin, ExtraLight]
casing: <e.g. wordmark always lowercase; never all caps>
voice: [<3-6 adjectives from the guide>]
end_card: {mark: <file>, line: "<CTA, e.g. Follow @...>", hold_s: 2.0}
covers: {format: "9:16 with centred 1:1 design", logo_on_cover: false}
captions: {size: small, font: <family>, never_over_faces: true}
audio: {music: licensed only, sfx: none | light, voice: <clone name or provider>}
```

## Rules that apply to every brand
- **Logos:** composite the approved file exactly. Never redraw, recolour, stretch, crop into, or add shadows, strokes or glows. Keep it centred with clear space. If two brands share a mark, the handle and CTA still follow the video's channel.
- **Colour discipline:** keep to the base, text and one accent. Do not put the brand colour into in-scene objects (money, charts) when the format uses its own semantic colours.
- **Layout:** safe margins on every side (about 60-80 px on 1080 wide). Keep key content out of platform UI zones (top status, right rail, bottom caption area). Real screenshots are shown whole and never cropped so that meaning is lost.
- **Motion:** strong action from frame 1, purposeful camera moves and script-matched imagery. Generic floating cards, flat phone spins and dot filler don't count as visuals. Motion formats must pass the 85% moving-frame audit without idle wobble.
- **Audio:** licensed music only, and calm voice at normal speed unless the owner asks otherwise for that video. Explainers carry no transition SFX.
- **End card:** the approved mark on the brand base with the CTA, proportional to the video's length.
- **Approval:** never post a cut the owner hasn't approved.

## Brand graphics (headers, banners, social cards)
1. Confirm the size and platform (for example an X header at 1500x500, exported at 2x).
2. Offer 2-3 concept directions with copy options, and wait for a pick unless told to draft.
3. For X headers, keep critical content mid-frame (the avatar covers bottom-left, and mobile crops the top). If the avatar is already the mark, prefer headline-only.
4. Compose with the real logo PNGs and the brand font. Show the full banner and a mobile-crop preview, then deliver upload-ready PNGs.

Code that reads this kit: `kits/series-kit/brand.example.json`, `kits/remotion-kit/src/kit/brand.ts`, and `window.BRAND` in `kits/canvas-reel/example/pre.js`.

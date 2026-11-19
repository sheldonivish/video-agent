---
name: premium-tech-news-reel
description: >-
  Use when making a vertical 30-60s tech/robotics/business news reel (Instagram
  Reels, YouTube Shorts, TikTok) with an AI avatar or presenter in the premium
  'Manav Podcast' editing style: split-screen hook, b-roll-led storytelling,
  kinetic titles, maps, count-ups and branded end card.
---
# Premium tech-news reel (Manav Podcast style)

Reverse-engineered from 52 reels of @manavpod / youtube.com/@manavgolecha (Aug-Nov 2026 template), measured with scene detection, OCR, Whisper and loudness analysis, plus frame-by-frame review of the six top performers (Bombardier Global 8000 1.5M plays, Dyson HushJet 1.0M, US military robot kitchen 0.9M, US bans Chinese robots, Nokia AI pivot, Bill Gates' Codex Leicester). Copy the *editing grammar*, never their footage, logo, wordmark or end-card copy: swap in the user's own brand.

Core insight: the premium feel does NOT come from transitions (they are ~100% hard cuts). It comes from (1) relentless b-roll every ~1.8 s, (2) one animated graphic module every 5-8 s, (3) spring-physics entries with motion blur, (4) small, tasteful captions, (5) dense, loud, consistent audio with a music bed and SFX tied to graphics.

## 1. Hard specs
| Spec | Value |
|---|---|
| Canvas | 1080x1920, 30 fps |
| Length | 35-50 s (median 41.8 s; never over ~70 s) |
| Voice | starts on frame 1, no intro/logo sting; 160-170 WPM (median 168) |
| Cuts | hard cuts, ~0.55 cuts/s, median shot 1.6-1.8 s, longest shot <=4.5 s, first cut at ~1.1 s |
| Cut placement | on caption-phrase boundaries (every 1-2 caption chunks) |
| Presenter screen time | ~10%. Never full-screen. B-roll/graphics carry ~90% |
| Graphic module | one every 5-8 s (on top of the cuts) |
| Loudness | master -14 LUFS integrated, LRA ~2 LU (heavily compressed), true peak -1 dBTP |
| Music | continuous bed, never silent, ducked 12-15 dB (~-24 dBFS RMS in gaps) under voice, ducked harder under interview clips |

## 2. Script structure (~40 s, ~110-120 words)
1. **0-3 s Hook**: one declarative sentence. Formulas: "[Big name] just [did surprising thing]"; "This [thing] [superlative/paradox]"; superlative/record ("the fastest private jet since the Concorde"); curiosity question ("How does a 20-metre jet look as small as a bird on radar?"); money up front ("An American startup just raised $50 million...").
2. **3-8 s Name it**: "It's called X." -> kinetic title card or brand-colour logo card.
3. **8-30 s Proof & mechanism**: 3-5 facts, each = one visual module. Every number is visualised.
4. **60-75% mark Pivot**: "But...", "one big problem", "which is why..." -> presenter re-enters (split or card).
5. **Last 5 s**: payoff stat (price, units, record) -> one-line spoken CTA ("Follow for more on the future of robotics" / "Send this to someone who..." / opinion question "Brilliant invention or expensive gadget?") -> 2-3 s branded end card.

Social caption: 3 short factual sentences on separate lines + 3 hashtags. Title formulas: "This [Thing] [Does Surprising Thing]", "Why [Brand] Is So Expensive", "How [X]...", "[Company] Built A [Thing]".

## 3. Layouts
- **Split-screen hook (shot 1, 0-~1.1 s, used in 72%)**: top 50% = most striking hero shot; bottom 50% = avatar waist-up, talking, hands moving, on a flat dark-grey backdrop (black crew-neck) or a warm home interior (white/cream shirt). Caption sits exactly on the seam (y=50%). Round country-flag sticker (~10% width) top-right of the top panel, pops in.
- **Cold-open alternative**: full-screen hero visual + flag sticker, no presenter.
- **Full-screen b-roll**: default for everything after the hook. 16:9 sources are letterboxed in the middle on black, never stretched.
- **Presenter card (pivot beat, 1-6x per video)**: avatar inside a rounded rectangle (~55-60% width, ~40 px radius at 1080, thin light border, soft shadow) on black/dark grey; enters scale 0->60% of frame with spring bounce in 0.4 s + swoosh; caption moves under the card. Variant: slow scale 95->100% over 2 s.
- **Floating card over its own blur**: shrink the shot into a rounded card with thin white border; behind it a blurred, enlarged copy fills the frame.
- **Stacked multi-split**: 2-3 b-roll panels stacked vertically when listing items ("SpaceX / Tesla").

## 4. Captions
- Clean geometric/grotesk sans (Inter / SF Pro / Montserrat / Proxima class), semi-bold to bold, white, **sentence case**, original punctuation.
- Small: cap height ~2.6-3.1% of frame (~55 px at 1920). Max width ~70%.
- Soft dark drop shadow only (black, ~40% opacity, small y-offset, blur). **No box, no thick stroke, no keyword colour, no emoji.**
- 1 line, ~3 words per chunk, each chunk on screen 0.5-1.0 s.
- Animation: words build in cumulatively, frame-accurate to the voice ("Canada" -> "Canada just" -> "Canada just delivered"), instant appearance (no scale/fade). Acceptable variant: show the whole chunk with unspoken words at 40% opacity and the active word at 100%.
- Position: x 50%; y 65-70% on full-screen; y 50% during split; nudge 52-74% to dodge graphics; under the card when the presenter card is up.
- **Hide captions while a big kinetic title or number is on screen.**

## 5. Persistent overlays (use the user's brand)
- Top-left: "Source: [platform glyph] [channel/brand]" credit, small white, y~7%; changes per segment (newsroom credibility).
- Top-right: channel wordmark, small stacked caps, y~5-10%.
- Bottom-right (or left): small white monogram bug, subtle slow pulse.

## 6. Motion-graphics module library (rotate through these)
Universal motion rules: entries use spring physics with 10-15% overshoot (Remotion `spring({fps, frame, config:{damping:10, mass:1, stiffness:100}})`; AE overshoot amp 0.15, freq 3, decay 5) **plus directional motion blur**; settle in ~0.4-0.6 s. Exits are usually just the cut. Each entry gets a subtle SFX (pop, swoosh, hit).
1. **Kinetic title card**: product/proper name, bold white sans ~10-12% frame height, 1-2 lines, upper third; slides up from below (Y spring, motion blur, ~0.5 s); second line lighter grey. Often **text-behind-subject** (rotoscope/segment the object so it overlaps the title). Can build word-by-word.
2. **Script/serif write-on** for historical or artsy topics (elegant italic serif, stroke reveal 1-1.5 s + pencil SFX).
3. **Flag sticker pop**: circular flag, scale 0->115->100% over ~15 frames, slight Y drop, motion blur, whoosh/pop.
4. **3D globe route**: dark satellite globe rotates, glowing blue line draws origin->destination (trim path, ease-in-out), plane/vehicle icon auto-oriented along it, red pin + label + distance ("Hong Kong - 15,182 km - without a single stop"), label flies up with overshoot.
5. **Country highlight map**: camera zooms with exponential ease (slow then rushes in, ~1 s, riser), country fills red/brand colour or its flag texture, flag sticker pops, country name scales in with overshoot, then a counting stat ("90%  Global robot market share"). Pan to a second country for contrast (fills blue). Zoom further to a city outline in yellow.
6. **Callout cards + dashed connectors**: company/industry cards pop in sequentially (0.3 s each, 3-5 frame stagger) with dashed lines drawing to the map (trim path 0->100% in 0.4 s), a pop SFX each.
7. **Number count-up**: big white bold figure + small unit line below; roll 0->target (or prev->next) in 15-22 frames with ease-out, rapid tick SFX ending in a ding; chain them ("$30.8 Million" -> "$65 Million"). Price pill variant: dark translucent rounded pill with white "$78 million" placed on the product.
8. **Year roller / odometer**: years scroll horizontally, current one bright and centred, neighbours faded; tick SFX.
9. **Article proof on iPad**: news article screenshot on an iPad lying on a dark wooden desk; drops in (scale 250->85%, X-rot 45->0 deg, cubic-bezier(0.1,0.9,0.2,1), 0.6 s, paper whoosh), then slow push 85->110% over 2 s while a **yellow highlighter wipes left->right** across the key sentence (multiply blend, 0.3 s, marker SFX). Source credit "Source: BBC x Firstpost" style.
10. **3D object toss-in**: hero object (book, device) flies in from the side with Y-rot 180->0 and scale 150->80%, 0.8 s ease-out, plus a hand-drawn curved arrow writing on toward it.
11. **Brand-colour logo card**: full-screen solid brand colour (or pastel) with the company logo scaling 50->110->100% (heavy spring) and the product render isolated on it.
12. **Name tags**: lower-third (white name, grey role, coloured accent bar) or two-tier (bold white name over a white box with black role) or 3D tilted glass person card with glow edge (cut-out portrait, big name, small "Founder @X"). Name card slides in L->R.
13. **Sticker labels on archive**: white box, black heavy ALL-CAPS text, wipe/scale-pop on desaturated B&W archival ("PAPER MILL" -> "RUBBER BOOT MAKER" -> "PHONE COMPANY"), whoosh each.
14. **2.5D parallax collage**: cut-out people/buildings slide up from below over a sky/plate, staggered 3-5 frames; big figure ("$1 B") drops from the top with bounce + cha-ching.
15. **Founder row**: 2-3 portrait tiles with names on black + amount ("$30 MILLION").
16. **Arrows & flow FX**: thin white hand-drawn curved arrows to the object; straight block arrows or blue streaks for airflow; glowing cyan radar rings; shockwave rings.
17. **Fake UI moment**: subscribe/follow pill with the channel avatar slides up; a cursor moves on a bezier path, clicks (button 100->90->100% in 3 frames), state flips to "Subscribed", click + bell SFX.
18. **3D CG infographic**: white extruded slabs on black with dotted leader lines ("100,000,000 ft2"), then tiled to show scale ("50x the Pentagon").
19. **Concept overlays**: looping 2D smoke/particles or white sketch overlay (opacity 0->100, scale 100->105) on top of b-roll.

Grading: keep each source's native grade; desaturate archival/history beats to B&W. Graphics palette: black backgrounds, white type, grey secondary type, accents only from flags/brands, yellow for highlights.

## 7. Audio
- Narration crisp, close-miked, compressed; voice is king.
- Music per topic, ~115-120 BPM: driving synth-bass/synthwave for tech/politics, retro synthwave for history, orchestral strings + trap for art/heritage. Royalty-free/licensed only.
- SFX are tied to graphics, not to every cut: whoosh on flag/card/title entries, pops for callouts, marker swipe on highlights, ticking + ding on counters, riser into map zooms, paper/leather whoosh on object tosses, cha-ching on money, click + bell on UI, sub-bass hit/boom on the end card. A few quick whooshes on fast b-roll montages only.
- Never a silent beat.

## 8. End card (2-3 s, ~40% of videos; abrupt end on last b-roll is also fine)
Black, wordmark, heavy white caps headline (write the user's own line, e.g. "JOIN THE NEXT ERA OF [NICHE]"), small sub-line, white pill button ("Follow now ..." + tick) that spring-pops 0->100%. Background options: (a) perspective-tilted wall of past-video thumbnails flying in on Z and drifting toward camera; (b) rotating particle Earth with a ring of video screens orbiting; (c) 3D laptop/phone on a glossy reflective floor showing the channel page with slow push-in. Riser -> sub-bass hit on reveal.

## 9. Production pipeline (avatar automation)
1. **Research & script**: pick a story with a hero visual and 2+ numbers; verify facts from 2+ sources; write ~110-120 words in the 5-beat structure. Mark each sentence with the visual module it gets.
2. **Voice + avatar**: generate the voice first, then the avatar (HeyGen/Synthesia/Hedra or similar) on a plain dark-grey backdrop, waist-up, natural hand gestures, 1080x1920. Get word-level timestamps (Whisper or the TTS alignment).
3. **Shot list**: one row per ~1.8 s with source (press video, brand site, news, archival, generated 3D/AI render), credit text, and module. Only use footage you have rights to or that is fair-use commentary; always credit.
4. **Build in Remotion (preferred for automation) or After Effects**: compositions for split hook, presenter card, captions (driven by word timestamps), each module above as a reusable component with props (text, numbers, coordinates, colours, flag code), persistent overlays, end card. Use `spring()` + motion blur (`@remotion/motion-blur` CameraMotionBlur/Trail) for every entry.
5. **Edit pass**: hard cuts on phrase boundaries, check pace (0.5-0.6 cuts/s), a module every 5-8 s, captions hidden under titles, presenter only at hook and pivot.
6. **Audio pass**: music bed + SFX map from section 7, duck under voice, master to -14 LUFS.
7. **QA checklist** before delivery: voice on frame 1; first cut <=1.5 s; no shot >4.5 s; every number animated; captions small, white, sentence case, correct y; source credit on every b-roll shot; no other creator's logos/branding; loudness -14 +/-1 LUFS; length 35-50 s; ending has payoff + CTA.

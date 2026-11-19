---
name: manavpod-e5-reel-playbook
description: >-
  Use when scripting, editing or QA-ing a 35-50 s vertical
  tech/defence/robotics/business news Short or Reel in the current Manav Podcast
  (E5) template: measured targets, visual specs, hooks, QA list.
---
# Manav Podcast reel playbook (E5 template, v1.0, evidence-based)

Builds on `premium-tech-news-reel` (read it first for the module library, motion rules and the Remotion pipeline). This playbook replaces its numeric targets where they differ. Numbers come from the **full-archive study** (`/workspace/manavpod/archive/full_archive_report.md`, v1.0, 17 Nov 2026): 1,103 analysed YouTube Shorts of 1,107 downloaded / 1,256 listed (Apr 2023-Nov 2026), of which **568 are non-collab E5 videos (10 Sep-16 Nov 2026)**, plus 98 analysed IG reels. Visual specs come from a **frame-by-frame expert review of 8 key videos** (`archive/review/video_review_A.md`, `_B.md`). Copy the editing grammar, never the footage, logo, wordmark or end-card copy: swap in the user's own brand and credit every clip.

**Honesty notes.** Pipeline features are OCR/vision heuristics, and the review showed where they drift (see §9). Performance = view percentile within ±45 days (`vpct`). Formatting is only weakly related to performance (|Spearman| <= ~0.17 in E5), so topic and hook decide more than polish. "Median" = E5 non-collab median. Items tagged **[UNVERIFIED]** were not confirmed by the review (static frames cannot show easing, exact font name, SFX levels). The review is n=8, one reviewer.

## 1. Measured targets (E5, non-collab, n=568)
| Spec | Median | P10-P90 | Note |
|---|---|---|---|
| Length | **40.5 s** | 32-52 s | Rising: 38 s (Sep) -> 42 s (Oct) -> 47 s (Nov). vpct flat by length. Aim 36-48 s, never >60 s |
| Words | 124 | 102-156 | ~120-130 words |
| Narration | **185 WPM** | 164-208 | vpct by WPM: <=174 0.51, 174-185 0.54, **185-195 0.60**, >195 0.47. Sweet spot 175-195 |
| Voice start | frame 1 | | Confirmed by review (all 4 narrated E5/E4 videos). No intro/logo sting. Tail after last word 0.57 s |
| Cuts per second | **0.50** | 0.23-0.69 | Slowest quartile (<0.39/s) is the weak group (vpct 0.41 vs 0.51-0.57). Keep >=0.40/s |
| Median shot | 1.6 s | 1.1-2.9 s | Longest shot median 5.1 s; aim <=5 s |
| **First cut** | **1.08 s** | 0.6-2.5 s | First cut >2 s: vpct 0.35 (n=78) vs 0.52. Target <=1.3 s |
| Loudness | **-13.5 LUFS**, LRA 2.2 | -14.9 to -11.8 | Master -13.5 +/-1, TP <= -1 dBTP |
| Presenter on screen | review: **only the 0.5-1.0 s split hook** in E5 top videos | | Pipeline's 14% median over-counts (other faces in footage). Treat the presenter as hook-only |
| Count-up/number graphics | 32% of videos have >=1 (25% Sep -> 44% Nov) | | vpct 0.57 with vs 0.48 without (n=183/385). Pipeline also flags static price pop-ups |
| Source tag | 69% of videos (>=20% of frames) | | Top decile 84% vs group 69% |
| Wordmark | 81% (**lower bound**: OCR missed it on bright CGI) | | Top 82% vs 81% |

## 2. Verified visual specs (frame-by-frame review)
**Captions (E5 top videos `3Awb4INFxBE`, `XW-SPoG7h1o`)**: bold sans-serif, white, **drop shadow only (no outline, no box)**, ~4-5% of frame height by eye (OCR box says ~3%), **sentence case**, built in **chunks of 2-4 words** (not strict word-by-word), y ~71% of height (lower third). Hidden while a title graphic is up (e.g. "HushJet Purifier" at ~6 s, centered at y 45-50%). **Case mix**: sentence case by default; ALL CAPS only on key dramatic phrases ("ALL THREE", "AI-guided robots"), ~20% of caption frames in `XW-SPoG7h1o`, 0% in `3Awb4INFxBE`. Exact font family, weight and pixel size: **[UNVERIFIED]**.
**Caption variants seen**: E4 top (`px6LL6cDQRA`): sentence case, shadow only, y ~50-53% (mid-frame). E3 IG (`DXVQFN1jxZM`): large, y ~52%, shadow, **keyword highlight** (yellow block with black text, or cursive/italic on the key word, e.g. "humanoid"). E5 median-contrast (`g49MFzGIqUM`): y ~75%, **thick black outline** (no shadow), plain white, no highlights. So stroke style varies; the top E5 videos use shadow-only.
**Overlay layout (E5)**: top-left Source tag; top-right stacked "THE MANAV PODCAST" wordmark; bottom-right "m" monogram. All **static** (no pulse/animation). Sizes small ("standard"); exact px/opacity **[UNVERIFIED]**. Variants: E4 top has a **pill-shaped wordmark and no monogram**; E3 has none of them; original/CGI content swaps the Source tag for an **"@manavpod" watermark top-left** (`RbdWCOcL42M`).
**Source tag behaviour**: format "Source: name" with the uploader's **own logo/typeface in a small box** (EPFL red box; dvidS red/white box; goodBytz magenta logo font). It **changes per shot when the footage owner changes** and **disappears on non-sourced shots** (map, bird, graphics). With a single source it stays constant (`3Awb4INFxBE`: "dyson" throughout).
**Split-hook mechanics**: top half = hero footage (product/robot/drone/soldier), bottom half = presenter waist-up in black polo on dark grey; caption sits **on the seam (y~50%)**; ends with a **hard cut to full-screen b-roll** at **0.5 s (Dyson), 1.0 s (Kitchen), 2.25 s (E4 Drone)**. No flag sticker. Presenter does not return in these E5/E4 videos (E3 `DXVQFN1jxZM` returned at 0:17, 0:33, 0:42). Spoken hook starts on frame 1.
**Transitions/B-roll**: **100% hard cuts**, no speed ramps or zooms; b-roll matches the spoken noun (Unitree mention -> Unitree tweet). Modules seen: map zooms (Hamburg ~0:08; Switzerland), 3D airflow diagrams, text-behind-subject (~0:28 "quieter than a library"), black/particle backgrounds for stat or fan-blade beats, count-ups.
**Count-up / number graphics**: odometer/slot-machine flip, yellow block "$4" -> "$4,000"; vertical height line "109 cm" -> "123 cm TALL"; "5,500" counter; static price pop-ups ($50,000/$150,000, "OVER 90%"); E4 "0 km total" text. Easing and font **[UNVERIFIED]**.
**Subscribe pill**: lower-third "Manav · Subscribe" slides in ~0:10, out ~0:12; a cursor clicks it, it turns **"Subscribed" + bell**, with a pop/click SFX. Seen **once in the two E5 videos** (Dyson, not Kitchen). Optional module, not standard.
**End-card variants** (all dark/black, cursor-click animation where it's a button):
| Variant | Era | Length | Look |
|---|---|---|---|
| Globe + floating device screens ("JOIN THE NEXT ERA…" card) | E5 | 3 s (0:34-0:37) | dark particle globe; button static; **audio hit/riser on the cut** |
| 3D laptop mockup of the channel's YouTube page | E5 | ~4 s (0:44-0:48), spoken CTA over it | |
| 2D YouTube mobile-app mockup, cursor clicks black Subscribe | E4 | ~2 s | grey bg |
| Follow-profile card: photo, "Manav", Follow -> Following; "FOLLOW SO YOU DON'T MISS THE NEXT ONE" | E3 IG | ~3 s | black bg |
| None: abrupt cut / loop / fade (Tesla POV, trash CGI) | E5 | | |
**SFX/audio sync**: voice + upbeat electronic bed + SFX (whooshes, pops, dings) tied to text/graphic entries and many cuts; deep hit on the end card; pop/click on the pill. SFX density, levels and exact sync offsets **[UNVERIFIED]**. Contrast: the trash CGI video had soft ambient SFX only; the Tesla POV has a loud compressed music track only (-9.5 LUFS); the podcast clip has raw dialogue.

## 3. End card decision (E5 non-collab)
None 53% (29% Sep -> 65% Oct -> 81% Nov), vpct **0.58**; JOIN card 41%, vpct 0.43 (confounded by the weak early-Sep window); generic follow 3% (0.25). **Default: no end card, end on a payoff plus a one-line spoken CTA.** Use a card only for brand reinforcement, with the user's own copy.

## 4. Era-evolution note
E1 (2023-24): faceless repost clips, hashtag titles, ~1K views. E2 (2025): guest/podcast clips; split layout with guest on top, presenter bottom, third-party logos, no music bed, raw audio (-17 LUFS). E3 (Mar-May 2026, IG only): large centre captions with yellow keyword highlights, split hook from April, YT-page/follow end card, first cut ~2.1 s, no wordmark. E4 (Jun-Aug 2026): ALL-CAPS captions (June), split hook ~89%, long split holds (to 2.25 s), pill wordmark, YT-app end card, wordmark/Source tag from July. E5 (Sep-Nov 2026): sentence case lower-third captions, no highlights, 0.5-1.0 s split, wordmark + monogram + Source tag, JOIN card fading out, split hook 86% -> 56% (Sep -> Nov), length 38 -> 47 s, count-ups rising.

## 5. What wins vs median (non-collab, ±45-d percentile)
E5 top decile n=57 (median 82K views vs 9.6K group).
1. **Topic and entity beat formatting.** Lift (E4+E5): China 1.4x, military/defence 1.4-1.5x, aviation/space 1.3x, energy/climate 1.2-1.4x, Elon Musk ~2x (small n). Under-index: history 0.5x, AI/chips 0.8x, robots ~1.0x (most frequent, not where breakouts come from).
2. **Hook = concrete "who did what" + number/superlative.** vpct: "[Actor] just [did X]" 0.53, other declarative 0.54, money/number first 0.60 (n=11). **Weak: questions 0.36, curiosity openers ("Did you know/imagine") 0.37.** The weakest reviewed video (10K) opens "Do you know how much trash…".
3. **Pace**: no slow quartile, first cut <=1.3 s. The 10K median-contrast video had 0.13 cuts/s (one continuous CGI move), no split, no modules, no end card, soft SFX; the 1.03M video had 0.64 cuts/s, 0.5 s split, Source tag, SFX on graphics.
4. **Source tag + wordmark** on top decile 84%/82% vs 69%/81%; count-ups help (0.57 vs 0.48).
5. **Closers**: closing number/fact 0.59, question to viewer 0.64 (n=24), forward-looking 0.58; **Follow-only closers 0.46**. Fact/question last, CTA as a <=1 s extra line.
6. **Not separating winners**: length, split hook (72% vs 71%), presenter share, end-card use.
7. **Atypical hits exist**: a silent-narration POV CGI montage with a loud hip-hop track and no CTA reached 477K (27 s, loops). Do not generalise from n=1.
8. A Hindi-narrated E5 Short (`36JzrPVSjjA`) reached 386K; localisation is worth testing (n=1).

## 6. Hook pattern library (real E4/E5 examples, first spoken sentence from YouTube ASR)
Each pattern: formula - example - views.
- **"[Nationality/Company] [just] built/launched [specific thing] [paradox or number]"**: "Dyson built an air purifier inspired by jet engines and it cost $349." (`3Awb4INFxBE`, 1.03M); "A Turkish company just built a gun that doesn't need to actually hit a drone to kill it." (`30aCJK9PMx8`, 375K); "A German company built this robot bee that can spy on places humans can't reach." (294K); "Shift Robotics just launched AI-powered shoes that can boost your normal walking speed all the way up to 7 mph." (127K).
- **Biggest/only/world's-first** (superlative): "Elon Musk is building the largest facility on planet Earth and it is not a rocket." (540K); "Bill Gates owns the most expensive notebook in the world and every single word in it is written backwards." (86K); "Jeff Bezos owns the world's largest sailing yacht, and it is so big that most exclusive ports cannot even fit." (81K).
- **"This [thing] can [surprising capability]"**: "This drone can stop other drones by literally slamming into them." (135K); "This container can produce 50 drones a day from literally anywhere on Earth." (104K); "This helicopter was designed to rescue people." (171K).
- **Short punchy one-liner**: "Apple just turned sound into a logo." (229K); "ASUS put a massive gaming screen inside a pair of glasses." (72K).
- **Money / compounding number**: "If you'd put $1,000 into AMD the day Lisa Su took over, you'd have over $200,000 today." (128K); "A Chinese robotics company just hit $1.4 million in pre-orders for a humanoid robot designed to live with you." (154K).
- **Underdog person**: "The man taking on SpaceX never went to university." (100K).
- **Avoid**: "Do you know how much trash humanity throws away in a single day?" (10K, `g49MFzGIqUM`) and other "do you know / imagine / what if" openers.
Title mirror: titles are usually the same idea in ≤8 words ("This Drone Flies Like a Bird!", "Dyson Built An Air Purifier Inspired By Jet Engines"); titles with a $ figure median vpct 0.59 (n=62), "This …" 0.53 (n=231), "Why …" 0.56 (n=26), "How …" 0.38 (n=63), E4+E5.

## 7. Closer pattern library
- **Closing number/fact (best-evidenced)**: "In 1994, Bill Gates bought it at Christie's New York for $30.8 million, equivalent to about $65 million in today's money…" (86K); "It's priced at $349.99, the exact price Beats previous flagship used to sell for." (82K); "The first batch of 200 pairs start shipping October 12th, priced at just $1,199 a pair." (127K).
- **Forward-looking stakes line**: "Storms and salt water will be huge challenges, but this could literally change the future of AI." (195K); "And NASA, which he hoped would hire him in 2006, is now one of Rocket Lab's customers." (100K); "…all because one CEO refused to play it safe." (128K).
- **Question to viewer**: "Do you think this is a great invention or just an expensive gadget?" (my translation of the Hindi ASR line, `36JzrPVSjjA`, 386K); "So, would you actually replace your gaming monitor with these glasses?" (72K); "Send this to the friend who'd notice a logo like this." (229K, share prompt).
- **Follow CTA (the most common closer, 361 of 663 E4/E5 videos with a transcript, but median vpct 0.45)**: "Follow us for more crazy tech like this." (`3Awb4INFxBE`, a top hit despite the CTA); "Comment below and follow so you don't miss what comes next." (E4); "And if you're not following, you're going to miss what comes next." Use it as a **second** closing line after a fact, ≤1 s.

## 8. Step-by-step build checklist
1. **Pick the story**: a named company/person + one hero visual that exists as owner-uploaded footage + 2 numbers. Prefer defence, aviation/space, energy, China, Elon-linked, or an "unexpected product from a famous brand" story. Skip pure "AI model news" and history unless the number angle is strong.
2. **Write the hook** (≤ 20 words, one declarative sentence, who + did what + number/superlative). Write 3 and pick the one that fits a ≤8-word title.
3. **Write the body** (~125 words total, 175-195 WPM): beats = hook → name it → 3-4 proof facts (each with a number) → pivot/"but" → payoff fact or question → ≤1 s CTA line. Mark which visual each sentence gets.
4. **Voice** (TTS/avatar) with word timestamps; confirm first word at 0.00 s and ≥175 WPM (use a slower/faster voice rate rather than trimming words).
5. **Shot list** at ~1.7 s median shot (0.45-0.55 cuts/s), first cut ≤1.1 s, longest shot ≤5 s. Source each clip from the owner's own channel where possible and record the credit text for the Source tag.
6. **Build** in Remotion/AE: hook (split or cold open - pick by asset quality, not habit), 2-4-word chunk sentence-case captions, shadow only, y≈71% (y≈50% on the split seam), ALL CAPS only for 1-2 emphasis phrases, wordmark top-right, "m" monogram bottom-right, Source tag top-left updating per source, 1-2 count-ups where there is a number worth showing (money, speed, count), black-bg stat cards sparingly.
7. **Audio**: music bed under voice (never silent), SFX on graphic/text entries and key cuts, deep hit on an end card if used, master -13.5 ±1 LUFS, LRA ~2, TP ≤ -1 dBTP.
8. **End**: payoff fact → short CTA over the last b-roll; no end card by default.
9. **Packaging**: title ≤ 8 words in the hook's wording (include the $ figure if it is the story); description = 3 short factual lines + 3 hashtags (the channel's YT descriptions are 3 short paragraphs + hashtags).
10. **Post** to YT Shorts and IG at the same minute (cross-post cadence observed: ~7-9/day on IG, every ~3 h).


## 9. Pipeline vs review: what the measurements get wrong (use when reading the stats)
- **Presenter share over-counts** (Kitchen 16% measured vs ~2% real; faces in b-roll count). Real E5 presenter time = hook split only.
- **Wordmark is under-counted** on bright/CGI frames (trash video 23% measured vs ~78% by eye). Treat 81% as a floor.
- **Count-up flag over-fires** on static price/number graphics (Heli price pop-up, podcast clip: 2 flagged, 0 real). No missed count-ups were found in the E4/E5 videos; real counters: Robot $4 -> $4,000, 109 -> 123 cm, 5,500.
- **End-card label** "JOIN NEXT ERA" lumps visually different cards (globe/devices vs laptop mockup); the E3 "follow_generic" is a profile-follow card.
- **Source tag** is per-owner, not constant, and carries the owner's logo; OCR text only sees the name.
- **Caption stroke/case** are not measurable by OCR: shadow vs outline and highlight-word boxes were seen only by eye.
- Confirmed by review: split-hook timing, seam caption, hard-cuts-only, voice on frame 1, caption y positions, "[Actor] just [did X]" hook, ALL-CAPS only for emphasis, no Source tag/end card on original content, 0 count-ups in the Kitchen video.

## 10. Pre-publish QA checklist
- [ ] Voice starts on frame 1; no intro sting; hook = one declarative sentence (who + did what + number/superlative), not a question.
- [ ] Length 36-48 s (max ~60); 110-140 words; 175-195 WPM.
- [ ] First cut <=1.3 s; >=0.40 cuts/s; no shot >5 s (<=2 exceptions); hard cuts only.
- [ ] Split hook (optional): hero on top, presenter bottom, caption on the seam, hard cut at 0.5-1.0 s. Cold open is fine.
- [ ] Captions: sentence case, white, shadow only, 2-4-word chunks, y≈71% (≈50% on the split), hidden under big titles; ALL CAPS only on 1-2 emphasis phrases.
- [ ] Wordmark top-right + monogram bottom-right static; Source tag top-left names each clip's original uploader, changes with the clip, absent on graphics; no one else's logo; rights checked.
- [ ] Every number shown on screen; >=1 count-up for a money/size/speed stat; text-behind-subject or map module where the story allows.
- [ ] SFX on graphic entries/key cuts; music never silent; -13.5 +/-1 LUFS, LRA <=3, TP <= -1 dBTP.
- [ ] Closer ends on a fact/question/stakes line; CTA <=1 s. End card none by default; if used, 2-4 s, the user's own copy, audio hit on the cut.
- [ ] Title <=8 words mirroring the hook; description 3 short lines + 3 hashtags.
- [ ] Compare against two of the key reference reels in `/workspace/manavpod/archive/review/key_videos.md`.

## 11. Still unverified (do not treat as rules)
- Exact font family/weight/pixel sizes, shadow parameters, overlay sizes and opacity, motion easing, SFX density/levels and sync offsets, count-up animation curve.
- Causal effect of any feature (observational, era-confounded; review n=8).
- Hook/closer statistics exclude ~290 downloaded videos still missing YouTube ASR captions (HTTP 429 backlog), and 149 Shorts (~25 Aug-10 Sep 2026) not yet downloaded.
- IG collab/co-author status of ~1,298 reels is unknown (anonymous access does not expose co-authors).

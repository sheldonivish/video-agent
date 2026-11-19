---
name: Ledger Noir
description: >-
  Use whenever making a short-form news-style explainer or reel for Lighter
  (lighter.xyz) or any market/finance brand in The London Letter's editorial
  style: one-breath hook, ~45s wire-service VO, near-monochrome collage with one
  accent colour, quotable closer.
---
# Ledger Noir

The London Letter's editorial short-form formula (reverse-engineered from all 336 of its videos), rebuilt for Lighter and bound by Ivish's video house rules. Full reference: `/workspace/shared/ledger-noir/style-bible.md` (read sections 2–4, 9–11 and 14 before scripting), contact sheets in `/workspace/shared/ledger-noir/contact-sheets/`, saved Lighter sources in `/workspace/shared/ledger-noir/lighter/`. House rules: `/workspace/shared/video-agent-skills/house-rules/HOUSE_RULES.md`. When the house rules and this style disagree, the house rules win.

## The formula
One hard fact said in the first breath, over a picture that *is* the fact. Then ~45 s of calm, number-dense voice-over cut on every sentence, rendered as a near-monochrome editorial collage with exactly ONE accent colour marking the word or number that matters. It ends on a short quotable line that reframes the story. No presenter, no CTA, no emojis on screen. The authority comes from restraint.

## Steps
1. **Story.** Pick one fact, one real number and one famous name or brand. For Lighter, use ~70% market story, 20% mechanism and 10% Lighter. Lighter is the instrument or the proof, not an ad. Use only facts from pages opened this session, and re-check the live docs.
2. **Script** with the `video-script-package` skill, labelling every claim FACT / COMPANY CLAIM / INTERPRETATION / SPECULATION. Constraints:
   - The VO starts at 0.0 s, and the first sentence is the whole story (patterns: breaking verb + "just", number first, "for the first time", scale comparison, "This is…", vivid present-tense image, time-compressed drama, then-vs-now, paradox setup).
   - 100–120 words, ~150 wpm, so 42–48 s. Sentences average ~9 words, with a punch line of 5 words or fewer every 3–4 sentences. Use 3–4 hard numbers, roughly one every ~10 s.
   - Beats: hook 0–3 s, then context 3–12 s, then mechanism/escalation 12–30 s, then a TURN card at ~60% ("One catch." / "But…" / "Worse."), then stakes, then a closer of 4–10 words (antithesis, ironic sting, what-next, understatement). No follow or comment ask.
   - The tone is wire-service neutral with dry wit. No hype words or exclamation marks, and keep attribution ("according to…").
3. **Look (Lighter theme).** Background #06060C with grain and vignette. B&W cut-outs, maps, docs and UI mocks. Periwinkle #9EB6FF is the single accent, with mint #5FE0AC and red #FF6072 used only for up/down numbers. Type: Inter Display Black caps for headlines (tight tracking and leading), Inter Bold + Bold Italic for emphasis, Geist Mono for HUD/data labels and source tags. Use at most 2 typefaces and 2 accents. Alternate templates per topic: Noir Dossier (hacks, liquidations, investigations), Swiss Poster statement cards (high energy), Black-Grid Terminal (data and tokenomics), relief-map editorial (RWAs and regions).
4. **Frame board.** One visual per sentence, 16–22 beats, ASL ~2.2–2.4 s, cuts on VO pauses. Get Ivish's approval on the frame board or mockups before animating (Remotion).
5. **Animate** (house rules override the reference):
   - Motion from frame 1, with ≥85% of frames moving (measure it). Statement and end cards animate too (type-on, tape or highlighter sweep, counters, ring pulses, line draws, chart builds, HUD leader lines).
   - Photos, cut-outs and screenshots stay STATIC (no Ken Burns or drift). Show screenshots and docs in full and uncropped, with highlights animated over them.
   - Every on-screen number gets a small Geist Mono source tag. Never invent numbers.
   - Official logos appear centred in brand colours. Never repeat an image or clip. Keep symmetric ~90 px left and right gutters, with nothing key below y≈1500.
   - Headlines type on word by word in sync with the VO. Transitions are mostly hard cuts, plus at most 2–3 negative flashes or light leaks.
6. **Audio.** The VO runs from 0.0 s to ~1 s before the end. Use a tense, minimal ambient bed about 4–9 dB under the voice and sparse SFX (typing ticks, one low hit on the closer). Target −14 to −16 LUFS.
7. **End card** ≤1 s, animated: the Lighter wordmark centred on #06060C. No "download now".
8. **Review** with `frame-review-loop` until every score is 8+. Deliver with the house ffmpeg encode (H.264 high 4.1, yuv420p, 30 fps, AAC 48 kHz, faststart).
9. **Caption** in house format: short lines, a blank line between beats, bold key words, hashtags (`#Lighter` + ticker) on their own line, and "not financial advice" where needed. Nothing posts without Ivish's explicit yes on the exact video, caption and accounts.

## Reach play (optional)
Raw-clip format: 10–25 s of undeniable market-moving footage (a Fed line, a CEO quote, a liquidation cascade on a chart) with a burned-in quote headline and a small Lighter masthead. Every one of the reference channel's top-25 videos was this format. The hook states only what the footage shows.

## Final check
The hook works muted at 0.0 s. One idea. A real, tagged number every ~10 s. One accent. The turn card lands at ~60%. The closer has ≤10 words. ≥85% of frames are moving. No cropped screenshots, Ken Burns or repeats. Symmetric gutters.

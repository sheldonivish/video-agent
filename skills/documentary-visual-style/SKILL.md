---
name: documentary-visual-style
description: >-
  Use when planning, scripting, generating visuals for, editing or packaging a
  long-form (12-25 min) faceless story documentary in the Arven/Lume style (true
  stories of people, money, heists, history): cold open, archival paper-collage
  explainer system, cinematic AI reconstructions, hook/title/thumbnail formulas
  and the production pipeline.
---
# Documentary visual style (Arven / Lume-derived)

A style and production guide for long-form faceless story docs, based on a study (19 Nov 2026) of Arven (9 docs, 2.9M views in ~25 days), Lume (361K subs, 125 docs, median 325K views), ago. and True Crime Vault. Full data: `/workspace/beinginvested/arven_study/report.md`.

## Non-negotiables
- **True stories only.** At least 3 independent sources per key number; numbered SOURCES list in the description. Never invent people or events ("fictional true crime" is the anti-model).
- **Label AI recreations** "DRAMATIZED RECONSTRUCTION" (small, bottom-left) whenever a real person or event is shown.
- **Accuracy in AI visuals**: right era, uniforms, logos, currency, architecture. Viewers call out "AI slop".
- **No financial advice**: "Educational story, not financial advice" in the description and once on screen if investing is discussed.
- **Approval gates**: script, VO demo, board/animatic, final cut, post draft. The owner approves each step.
- **Motion from frame 1**; nothing static for more than ~4s.

## 1. Format
- 14-20 min; at 170 wpm about 2,400-3,300 words. One conversational narrator, present tense for action.
- Structure (chapters named as story beats):
  1. **Cold open** (60-120s): the climax moment, 2-3 open-loop questions, a bridge line.
  2. **Origins** (2-3 min): humble, relatable start.
  3. **Set pieces x3-6** (2-3 min each): mini-hook, escalation, cliff-hanger line.
  4. **Climax resolved**: answer the cold-open question with the promised detail.
  5. **Aftermath**: what happened to them and the money, with dates.
  6. **Reflection + specific debate question + subscribe.**
- Optional early subscribe ask at 1:00-2:00; test with and without.

## 2. Script template
```
COLD OPEN
[Date]. [Place]. [One concrete sensory detail.]
[Name], [age], a [ordinary job]. [Why he/she shouldn't matter.]
[The impossible situation, 3-5 short sentences, present tense.]
[The unexpected act: "So he does the one thing nobody expects."]
[The number/payoff stated flatly.]
[Question 1?] [Question 2?] [Question 3?]
To understand that, we have to go back to [year], because [teaser twist].

PART 1 - [Story-beat title]
...each chapter ends with an open line: "But that wasn't the real problem."

ENDING
[Death/legacy fact]. [Callback to opening image]. [Moral in one line.]
[Specific debate question]? Tell me in the comments. And subscribe.
```
Sentence rules: average 10-12 words, at least 20% of sentences 5 words or fewer; 8-14 rhetorical questions per video; 5-10 "Imagine..." lines; a number or concrete object every 2-3 sentences; gloss any jargon instantly.

### Hook formulas (money versions)
- **Secret fortune**: "[Date]. A [job] dies in [town]. Then his lawyer opens a safe deposit box."
- **Impossible odds**: "[N] people tried to stop one [ordinary person]. [Short time] later, [payoff]."
- **Loophole**: "By every word of [institution]'s own rules, [person] had just legally [absurd outcome]."
- **Reversal**: "Everyone who [did X] lost everything. One man made $[N]."
- **Precise object**: "[Date]. A mailroom clerk opens an envelope. Inside, a check for $[exact amount]."

## 3. Titles and thumbnails
- Title formulas, always with a number: "The [ordinary person] Who [impossible money act]"; "[Setup]. Then [twist]."; "How One [person] [verb] $[N] in [time]"; "They Laughed at His [thing] - Until [payoff]". Use the youtube-banger-titles skill; Test & Compare 3 thumbnails.
- Lean human, not object (human-emotion premises did 1.1-1.4M; object premises 29-60K on Arven).
- Thumbnail: one hero subject (person or a signature faceless figure in brand colour vs a dark authority figure); 1-3 words in heavy condensed caps with outline; one red arrow, money pile or key object; dark high-contrast background; readable on mobile. Shorts covers: 9:16 with content centred in a 1:1 square.

## 4. Visual system
Mix per video: ~25% cinematic, 55% collage/infographic, 20% maps and charts.

### A. Cinematic reconstructions (cold open + key set pieces)
- Photoreal 35mm film still, shallow depth of field, period-accurate. Grade by era: pre-1950 desaturated/B&W with grain; 1960s-90s warm teal-orange with halation; modern cool with neon accents.
- Yellow date/place tag top-left ("MARCH 28, 1996 · SEATTLE"); small handwritten in-scene labels (red antagonist, blue protagonist).
- Shots: establishing wide, hands on an object (letter, cheque, certificate), reaction close-up, document POV, over-the-shoulder at a desk, low angle of the institution.
- Same character across shots: build a reference sheet first and pass it as image refs every time.

### B. Archival paper-collage explainer (the body)
- Backgrounds: cream graph paper (#EFE9DD-ish, faint grid) or charcoal textured paper (#2B2B2B).
- Real archival/public-domain photos, greyscale, white or torn border, typed caption and credit ("Photo: Library of Congress (PD)").
- B&W cut-outs on simple side-view silhouettes.
- Label blocks: black bold condensed caps on a yellow highlight (brand yellow); big numbers in highlight blocks with count-ups.
- Blue ballpoint handwritten notes with arrows; white handwritten numbers on charcoal.
- Red dashed lines for money flows; stopwatch/calendar icons for time; money-stack icons to scale amounts; crowds as repeated icons.
- Maps: 3D relief, cream land on pale blue-grey sea, red outline on the key area, white paper-tag labels, arrow drawing on.
- Charts: hand-inked price lines on graph paper, red marker on the key day.
- Chapter cards: "PART N" in white bold italic caps on charcoal, title on a yellow label.

### Motion and pacing
- New visual beat every 2-4s.
- Slow push-in (102-108% over the shot), lateral parallax on cut-outs, map fly-ins.
- Mostly straight cuts and quick slides; smooth crossfades between chapters; soft, low whooshes only.

## 5. Higgsfield prompt templates (MCP `user-Higgsfield`)
Models seen 19 Nov 2026 (re-check with GetDynamicTools). Always estimate cost before batching.
- Stills: `nano_banana_2_1` (up to 14 refs, character consistency), `gpt_image_2` (text, labels, collage plates), `soul_cinematic` / `cinematic_studio_2_5` (film stills), `kling_image_4_0` (up to 8k).
- Video: `kling3_0` (3-15s, start+end frame, sound off is cheaper; ~20 credits per 10s pro, 7.5 per 5s silent), `kling4_0` (3-30s, keyframes, reference-to-video), `kling3_0_turbo` (cheap i2v), `kling_o3_image_reference` (multi-shot, up to 7 refs), `wan2_7`, `cinematic_studio_3_0`.

**Cinematic still (period)**
> Photoreal 35mm film still, [year] [place], [character from reference: age, clothing], [action], [period props], shallow depth of field, [grade], natural film grain, 16:9, no text, historically accurate details.

**Hands-on-object insert**
> Extreme close-up, weathered hands of a [age] man holding [object], [setting], 35mm, macro detail, 16:9, no readable logos.

**Paper-collage plate (`gpt_image_2`)**
> Flat top-down archival collage on cream graph paper with faint grid: one greyscale vintage photo of [subject] with white torn border and typed caption '[caption]'; a yellow highlighter label block reading '[LABEL]' in black bold condensed caps; blue ballpoint note '[note]' with an arrow; subtle paper texture and soft shadow; 16:9; clean negative space on the right for animation.

**Relief map plate**
> 3D relief map, cream landmass on pale blue-grey sea, soft top-left light, [region] centred, thin red outline around [area], small white paper tag '[PLACE]', minimal, documentary style, 16:9, no other text.

**Image-to-video (`kling3_0`, sound off, 5s)**
> Slow cinematic push-in, subtle parallax, [one small action], camera steady, no morphing, keep faces and objects identical to the first frame.

**Thumbnail base**
> Hyperreal high-contrast thumbnail image, [hero subject] centre-left looking at [key object], dark background, cinematic rim light, empty space top-right for 2-word text, 16:9. Add text and arrow in post.

## 6. Audio
- VO: the owner's house voice flow (cloned voice, settings from memory); 165-175 wpm; send the VO demo before animating.
- Music: continuous cinematic bed changing by chapter mood, 20-22 dB under the VO, ducked under dense lines.
- SFX: soft, low whooshes well under the VO; paper rustle and pen scratch on collage moves; ambience on cinematic shots.
- Master: -14 LUFS integrated, -1 dBTP.

## 7. Production pipeline
1. **Pick the story**: person + money act + number + twist. Check YouTube demand (top existing video views) and the gap.
2. **Research pack**: timeline, key numbers with 3 sources each, archival/PD image list, "can't verify" list (soften to "reportedly").
3. **Script** in the template; cold open written last; titles via youtube-banger-titles. Owner approves.
4. **VO** with the house flow; owner OKs the demo; export word timestamps.
5. **Beat sheet**: split VO into 2-4s beats tagged CINE / COLLAGE / MAP / CHART / CARD (~350-450 beats in 18 min).
6. **Assets**: character reference sheet first; cinematic stills, then animate hero shots with Kling (sound off); collage, map and chart plates; PD photos (LoC, Wikimedia Commons, National Archives) with credits logged.
7. **Edit**: lay VO, cut beats to timestamps, motion on every still, chapter cards, labels, music and SFX, reconstruction labels; run a frame review.
8. **Package**: 3 thumbnails, title, description (teaser paragraphs ending in questions, chapters, SOURCES, debate question, ~9 hashtags), 15-30 tags; pinned comment with the debate question; 2-3 vertical cut-downs.
9. **Owner approval** of video, title, thumbnail, description and platforms, then schedule.
10. **Review** CTR and average view duration at 48h and 7 days; double down on outliers.

## 8. Cadence and growth
- 1 a week, then 2 a week once the pipeline holds.
- YouTube Collaborations (co-credits) with friendly channels in the same space were Arven's main launch lever.
- Every 10 videos, review which premise types win and adjust.

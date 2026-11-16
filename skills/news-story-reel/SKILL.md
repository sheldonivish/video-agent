---
name: news-story-reel
description: Use when turning a fast-moving news story (a scandal, investigation, breach, lawsuit, market shock) into a 45-70 s vertical reel with a timeline structure, real headlines and documents, and strict attribution of reported versus confirmed claims. Black base, bold titles, visual-only transitions, calm voice.
---

# News story reel

A "here's how it happened" short: the hook, then a dated timeline built from real headlines, documents, statements and posts. It ends on where things stand now. Credibility is the product, so attribution rules are hard rules.

## Format
- 9:16, 1080x1920, 30 fps. 45-70 s delivered. A raw voice can be tightened to 1.1-1.15x only if the owner approves speed for that video. The default is normal speed.
- Black base, one bold display face (for example Inter Tight 800) for titles, small captions.
- Transitions are visual only: zoom-punch, whip-pan blur, mask wipe, light-leak flash, split-screen slam. No whooshes or SFX. Music is optional, licensed, and well under the voice.
- About 4-5 visual changes per 10 s. Hold on documents only while the highlighted line is being read.

## Structure
| Part | Time | Content |
|---|---|---|
| Hook | 0-3 s | The single most surprising confirmed fact, plus the reported twist ("US intelligence believes..."). |
| Turn | 3-10 s | "Here's how it happened." A title card such as THE TIMELINE. |
| Timeline | 10-50 s | Dated beats, each with a real artifact: headline (rebuilt cleanly, source named), official letter or PDF scroll with the key line highlighted, statement quote, map or counter for numbers. |
| Now | last 10 s | Where it stands (dates ahead, who said what), then the CTA. |

## Attribution rules (non-negotiable)
- Label every claim in the fact check: FACT, REPORTED (who reported it, and whether sources are anonymous), COMPANY CLAIM, DENIAL, EXCLUDED.
- Spoken language matches the label: "according to reports", "the Times reports", "the company says", "China calls it groundless".
- Never imply guilt the evidence does not show. Put the missing evidence in the fact check ("No public evidence that...").
- Drop any number you cannot confirm in a primary or major outlet before the build. Note which number was dropped and why.
- Exclude state-media clips, politically loaded side claims and personal details (such as family members) that don't serve the story.
- No AI images of real people that look like photos. Any reconstruction is labelled "Illustration".
- Check time-sensitive superlatives ("world's most valuable") on the day of the build, or swap them for safe wording.

## Workflow
1. Script package (video-script-package) with 5 hooks, a timed table (time, VO, visual, source), the full VO, the fact check with labels, caption, 5 titles and 5 thumbnail texts. Wait for approval.
2. Collect artifacts at native resolution and keep a source list.
3. Voice, then the alignment-timed edit. Remotion (`kits/remotion-kit`) or a PIL/ffmpeg renderer both work.
4. QA: `pipeline/qa_report.py`, a contact sheet read, and every on-screen date and number re-checked against the source list.
5. Cover: 9:16 with the design as a centred square. Deliver for approval. Credits for music go only in the YouTube description.

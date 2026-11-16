---
name: campaign-promo-storyboard
description: Use when making a fast 40-50 s 9:16 promo for a time-boxed campaign (a prize pool, rewards round, airdrop phase, launch week) packed with real numbers, where every line needs a matching shot and a sourced figure. Builds a line-by-line storyboard (time, exact line, shot source, animation), then HTML/CSS shots rendered to video. Brisk voice pacing.
---

# Campaign promo storyboard

Campaign promos live or die on numbers, so the storyboard is the contract. Each spoken line has one shot, one animation and one source.

## Pacing
- Target 40-50 s. A dense script needs a brisk read (about 3.5-3.9 words/s). Count words first: at a normal 2.6 words/s, 184 words runs about 71 s, so cut words before you speed up the voice. Speed changes need the owner's approval.
- 15-20 shots. Something lands in every shot: a counter roll, a card tilt, a step pop, a ticket ball drop, a highlight sweep.

## Storyboard table (write this before any code)
| # | Time | Script line (exact) | Shot / source | Animation |
|---|---|---|---|---|
| 1 | 00.00-03.13 | "<pool> up for grabs this week." | app screen (nav cropped) + counter | card tilts in, counter rolls to the on-screen figure, headline slams |

Rules for the table:
- Times come from the voice alignment.
- **Counters roll to the exact figure on the source card**, not to a rounded marketing number. If the line says "over $150,000", the counter still lands on what the card shows.
- Each stat names its source: the app screen, the official post, an analytics card (for example DefiLlama), or the docs. Crop analytics cards to the one relevant row.
- Funding, investor and partner claims show the official post or the partner's logo strip from the product's own site.
- "Nearly", "over" and "around" tags appear on screen when the VO uses them.

## Structure
1. The prize (0-3 s), with the biggest real number.
2. How to take part (3-12 s), as 3 steps. Show the real order panel and ticket screens.
3. "But here's what makes this interesting" (pattern interrupt).
4. Credibility (12-28 s): raise and lead investor, partner integration, TVL and volume, track record of past rounds.
5. What's new this round (28-40 s).
6. CTA and end card, plus the campaign dates and the "terms apply / not financial advice" line where required.

## Build
- Generate each shot as an HTML page (a Python `gen.py` that writes shots from a list of tuples: headline pieces, accent index, caption, accent word, visual HTML, source). Share a `style.css` (3D tilt cards, counters, chips, balls).
- Render with Playwright (`shot.mjs` or a Python equivalent) at 30 fps, seeking a CSS/JS timeline per shot. Join with hard cuts or quick whip transitions.
- Mix the voice with a licensed bed and master to -14 LUFS (`pipeline/master_audio.py`). Run `pipeline/qa_report.py`.
- Make mock boards (a still per shot) for approval before rendering motion when the brand team reviews.

## Never
- Never show eligibility, prize or odds language that differs from the official terms.
- Never imply guaranteed winnings. A ticket is a chance.
- Never use another campaign's numbers or old-round screenshots as current.

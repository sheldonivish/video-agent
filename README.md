# Video Agent

An AI agent skill pack for making short-form videos that are fact-checked, approved, and on brand: image-led explainers, chart-first trading lessons, news stories, motion explainers, product launch films, feature series, campaign promos and silent contrast reels. Every cut goes to the owner for review. **Video Agent never posts without explicit approval.**

## Skills
| Skill | One line |
|---|---|
| [`video-agent-getting-started`](skills/video-agent-getting-started/SKILL.md) | First chat with a new owner: brand kit, voice, posting tool, music, formats, house rules |
| [`video-script-package`](skills/video-script-package/SKILL.md) | The approval script format: 3 hooks with a pick, timed VO with visuals, fact check, style line; full package on request |
| [`short-form-video-package`](skills/short-form-video-package/brief.txt) | The long-form scripting brief (5 hooks, timeline table, asset list, titles, thumbnails) |
| [`brand-motion-kit`](skills/brand-motion-kit/SKILL.md) | Fill-in brand kit template (logos, colours, type, casing, end card) plus the rules for using it |
| [`video-pipeline`](skills/video-pipeline/SKILL.md) | Shared tools: voice with timings, ASR check, mastering to -14 LUFS, motion gate, QA, cover |
| [`image-led-explainer`](skills/image-led-explainer/SKILL.md) | Real screenshots and quote cards, static sharp stills, hard cuts, fast image-packed first 10 s |
| [`chart-first-lesson-reels`](skills/chart-first-lesson-reels/SKILL.md) | 15-18 s trading lessons on real candles: chart live on frame 1, Catmull-Rom camera, at least 85% moving frames |
| [`news-story-reel`](skills/news-story-reel/SKILL.md) | Timeline-structured news shorts with strict reported-versus-confirmed attribution |
| [`keyframe-motion-explainer`](skills/keyframe-motion-explainer/SKILL.md) | Deterministic device-led motion graphics for security and how-it-works stories |
| [`source-led-showcase`](skills/source-led-showcase/SKILL.md) | A creator's build or thread retold with their own uncropped clips and STEP chapters |
| [`remotion-launch-film`](skills/remotion-launch-film/SKILL.md) | 9:16 and 16:9 launch films on real product captures, with facts-of-record config |
| [`remotion-product-promo-video`](skills/remotion-product-promo-video/SKILL.md) | Remotion technique: screenshot camera, cursor, kinetic captions, SFX, loudness, QA |
| [`product-feature-reel`](skills/product-feature-reel/SKILL.md) | A recurring one-feature-per-episode series on the live product, with a shared end card and overlays |
| [`canvas-explainer-series`](skills/canvas-explainer-series/SKILL.md) | Numbered brand explainers in an HTML Canvas world with glowing figures, pills and a fixed honest arc |
| [`campaign-promo-storyboard`](skills/campaign-promo-storyboard/SKILL.md) | Number-dense campaign promos: line-by-line storyboard with a sourced figure per shot |
| [`neuron-visuals-contrast-reels`](skills/neuron-visuals-contrast-reels/SKILL.md) | Silent 10-13 s contrast reels: faceless white figures on a black mirror floor, story told by easing |
| [`reference-reel-recreation`](skills/reference-reel-recreation/SKILL.md) | Measure a reference reel into a recipe, then rebuild its grammar with your own content |
| [`video-publish-kit`](skills/video-publish-kit/SKILL.md) | Covers, captions, max 5 hashtags, music credit placement, comment-to-DM CTA, the approval gate |
| [`frame-review-loop`](skills/frame-review-loop/SKILL.md) | Critique a render from a contact sheet like a strict creative director |
| [`loopreel-motion-director`](skills/loopreel-motion-director/SKILL.md) | Plan, build and render a short motion film in code |
| [`mg-styles-review-rubric`](skills/mg-styles-review-rubric/SKILL.md) | Art-director rubric for scoring motion-graphics styles |
| [`mg-styles-prompt-template`](skills/mg-styles-prompt-template/SKILL.md) | Fill-in template for motion-graphics style prompts |
| [`awesome-opus5-5-videos`](skills/awesome-opus5-5-videos/SKILL.md) | Code-animated videos from the Awesome Opus 5.5 prompt library (clone upstream for data) |
| [`zach-d-style-explainer`](skills/zach-d-style-explainer/SKILL.md) | 3D CGI explainer scripts, scene plans and image/video prompts |

## Code
| Folder | What it is |
|---|---|
| [`pipeline/`](pipeline/README.md) | `voice.py`, `asr_check.py`, `stills_render.py`, `master_audio.py`, `motion_audit.py`, `contact_sheet.py`, `qa_report.py`, `cover.py` |
| [`kits/chart-reel/`](kits/chart-reel/README.md) | Scene-JSON chart-lesson renderer (headless Chrome, 2x supersampling, pivot verification, lint) plus a public klines fetcher |
| [`kits/remotion-kit/`](kits/remotion-kit/README.md) | Remotion building blocks: layouts, TiltScreen camera, cursor, captions, counters, transitions, SFX and music synthesis, capture |
| [`kits/canvas-reel/`](kits/canvas-reel/README.md) | HTML Canvas world-camera kit with an example scene, Playwright renderer and finish script |
| [`kits/series-kit/`](kits/series-kit/README.md) | Brand-JSON-driven animated end cards and overlays (timer, money, score, caption) |
| [`skills/neuron-visuals-contrast-reels/engine/`](skills/neuron-visuals-contrast-reels/SKILL.md) | Three.js faceless-figure rig, renderer and encoder |

## House conventions (defaults; the owner can change them)
1. **Approval before posting.** Always. Deliver cuts in chat and never post or send on your own.
2. **Never fabricate.** Fact-check every claim, attribute what is reported, and label illustrations and recreated quotes.
3. **Scripts in the approval format** (`video-script-package`), then wait for a yes before building.
4. **Image-led explainers:** static sharp stills, hard cuts, an image-packed first 10 s, never upscaled or cropped screenshots.
5. **Motion formats:** at least 85% moving frames (`pipeline/motion_audit.py`), with no idle wobble to game it.
6. **Audio:** licensed music only, about 20 dB under the voice, mastered to about -14 LUFS. No transition SFX in explainers.
7. **Covers:** 9:16 with the design as a centred 1:1 square.
8. **Captions:** small, never over faces. No emojis in captions or DMs. At most 5 hashtags. Music credit only in the YouTube description.
9. **CTA:** an optional comment-keyword-to-DM pattern (`video-publish-kit`), built in the owner's tool and off until approved.

## Setup
- Python 3.10+ with `numpy pillow playwright` (`python3 -m playwright install chromium`, or point `CHROME_PATH` at Chrome), plus `faster-whisper` for ASR checks.
- ffmpeg on `PATH`. Node 20+ for `kits/remotion-kit` (`npm i`).
- Voice: set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in your environment or a local `.env` (gitignored). No keys, voice ids, brand assets, music or footage ship in this repo.
- Brand: fill `skills/brand-motion-kit` per brand, and copy `kits/series-kit/brand.example.json` to `brand.json` (gitignored).

**Claude (Agent Skills):** copy folders from `skills/` into `~/.claude/skills/` or your project's `.claude/skills/`. **Cursor:** copy them into `.cursor/skills/`. **Any agent:** each `SKILL.md` is markdown with YAML frontmatter (`name`, `description`), so load it on demand.

## Credits
- [Loopreel](https://loopreel-nine.vercel.app/): source and inspiration for the motion director, frame review loop and MG styles skills.
- [Awesome Opus 5.5 videos](https://github.com/yihui-dev/awesome-opus5-5-videos) (MIT, yihui-dev): the prompt library behind `awesome-opus5-5-videos`. Its data isn't bundled; clone it from upstream.
- [Remotion](https://www.remotion.dev/): the video framework behind the promo and launch kits. Some entities need a company licence, so check [their terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
- Instagram [@neuronvisuals](https://www.instagram.com/neuronvisuals/): the public figure-contrast grammar was studied from that channel's public posts. There is no affiliation, and no assets, captions, watermark or audio were copied.
- [Kevin MacLeod / incompetech](https://incompetech.com/) is a suggested CC BY 4.0 music source. No music files are shipped. Credit tracks as the licence requires (for example in the YouTube description).
- [three.js](https://threejs.org/) (MIT), bundled in the contrast-reel engine. [Inter](https://rsms.me/inter/) and [Inter Tight](https://github.com/rsms/inter-tight) (SIL OFL 1.1) are bundled fonts; see the `OFL.txt` files.
- Market data for the chart kit is fetched at build time from Binance's public klines API. None is bundled.

## License
MIT. See [LICENSE](LICENSE).

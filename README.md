# Video Agent

Skills for Video Agent: premium short-form reels, documentary long-form, case studies and clipping.

An AI agent skill pack for making short-form videos: **news clips, explainer reels, and premium Remotion product promos**. Every cut is delivered for review and approval. **Video Agent never auto-posts.**

## Skills library

| Name | Description | Folder |
|---|---|---|
| brand-motion-kit | Use before any video, cover, end card, lower third, caption overlay or motion graphic for BeingInvested or ivish.studio: colours, type, logo files and rules, tone, and cover specs. | [brand-motion-kit](skills/brand-motion-kit/) |
| creator-case-study-short | Use when making a 9:16 or 1:1 case-study reel about a creator, account or project that blew up (how they did it, the numbers, the format), with real profile walkthroughs and a call to action. | [creator-case-study-short](skills/creator-case-study-short/) |
| documentary-visual-style | Use when planning, scripting, generating visuals for, editing or packaging a long-form (12-25 min) faceless story documentary in the Arven/Lume style (true stories of people, money, heists, history): cold open, archival paper-collage explainer system, cinematic AI reconstructions, hook/title/thumbnail formulas and the production pipeline. | [documentary-visual-style](skills/documentary-visual-style/) |
| Ledger Noir | Use whenever making a short-form news-style explainer or reel for Lighter (lighter.xyz) or any market/finance brand in The London Letter's editorial style: one-breath hook, ~45s wire-service VO, near-monochrome collage with one accent colour, quotable closer. | [ledger-noir](skills/ledger-noir/) |
| longform-doc-pipeline | Use when producing a long-form (12-20 min, 16:9) faceless money or story documentary end to end: research, script, cloned-voice VO demo, full VO, frame board, animation, review and packaging, with an owner approval gate at each step. | [longform-doc-pipeline](skills/longform-doc-pipeline/) |
| manavpod-e5-reel-playbook | Use when scripting, editing or QA-ing a 35-50 s vertical tech/defence/robotics/business news Short or Reel in the current Manav Podcast (E5) template: measured targets, visual specs, hooks, QA list. | [manavpod-e5-reel-playbook](skills/manavpod-e5-reel-playbook/) |
| premium-tech-news-reel | Use when making a vertical 30-60s tech/robotics/business news reel (Instagram Reels, YouTube Shorts, TikTok) with an AI avatar or presenter in the premium 'Manav Podcast' editing style: split-screen hook, b-roll-led storytelling, kinetic titles, maps, count-ups and branded end card. | [premium-tech-news-reel](skills/premium-tech-news-reel/) |
| product-explainer-reel-lessons | Use when making a 35-50s product or founder explainer reel ("Someone just built...") with a cloned-voice VO: voice, edit, script and QA lessons from owner feedback on real reel tests. | [product-explainer-reel-lessons](skills/product-explainer-reel-lessons/) |
| trending-topic-scout | Use when picking the next video topic or asked 'what's trending / what can blow up': combines vidIQ trend and outlier data with Google Trends and YouTube/X signals to rank topics by urgency and fit. | [trending-topic-scout](skills/trending-topic-scout/) |
| x-post-clip-template | Use when turning an X post's video or images into a vertical 9:16 repost clip for a creator page: black background, profile row, short factual hook, uncropped media, source credit, plus caption and prompt. | [x-post-clip-template](skills/x-post-clip-template/) |
| youtube-banger-titles | Use whenever writing a YouTube (or Shorts) title for an upload. It picks from 100 proven viral title formats and writes a truthful, curiosity-driven title. | [youtube-banger-titles](skills/youtube-banger-titles/) |

## What it does
- **Premium short-form reels**: tech, robotics and finance news cuts, brand motion, and title and topic scouting.
- **Documentary long-form**: faceless story documentaries, from research and voiceover through frame boards and packaging.
- **Case studies and clipping**: creator case-study reels and vertical clips cut from X posts.
- **News clips**: 9:16 vertical cuts from source footage with B-roll, a title bar and clean captions.
- **Explainer reels**: Zach D-style 3D CGI explainer scripts, scene plans and image/video prompts.
- **Product promos**: screenshot-driven, animation-heavy Remotion videos (9:16 first, then 16:9) with SFX and music synthesized in code.
- **Code-animated motion graphics**: self-contained HTML/Canvas/Three.js animations, reviewed frame by frame.
- **Post packs**: one approval pack per video with copy for X, YouTube, TikTok and LinkedIn.

## Skills
| Skill | Purpose |
|---|---|
| [`video-agent-getting-started`](skills/video-agent-getting-started/SKILL.md) | First chat with a new owner: brands, formats, music, who writes scripts |
| [`remotion-product-promo-video`](skills/remotion-product-promo-video/SKILL.md) | Screenshot-driven Remotion promos: camera moves, cursor, transitions, SFX, loudness, QA |
| [`zach-d-style-explainer`](skills/zach-d-style-explainer/SKILL.md) | Zach D Films-style 3D explainer workflow |
| [`awesome-opus5-5-videos`](skills/awesome-opus5-5-videos/SKILL.md) | Make code-animated videos using the Awesome Opus 5.5 prompt library (clone upstream for data) |
| [`frame-review-loop`](skills/frame-review-loop/SKILL.md) | Critique and improve a render by sampling frames |
| [`loopreel-motion-director`](skills/loopreel-motion-director/SKILL.md) | Plan, build and render a short motion film in code |
| [`mg-styles-review-rubric`](skills/mg-styles-review-rubric/SKILL.md) | Art-director rubric for scoring motion-graphics styles |
| [`mg-styles-prompt-template`](skills/mg-styles-prompt-template/SKILL.md) | Fill-in template for motion-graphics style prompts |

## Video conventions
1. **Captions small**, and **never over a face**.
2. **Open on B-roll**, not a talking head or a title card.
3. **Screenshots are never cropped**; show them whole.
4. **16:9 sources go in a B-roll layout inside 9:16**, not stretched or centre-cropped.
5. Keep **safe side margins** so platform UI never covers text.
6. **One white rounded title bar for ~3 seconds**, then it goes.
7. **Music low**, under the voice and the content.
8. **Approval before posting**. Always. Deliver cuts in chat; never post on your own.
9. **Per-platform post pack**: X first, then YouTube, TikTok and LinkedIn copy.
10. **Shorts thumbnail as the first 0.3s**: prepend the 9:16 thumbnail frame to the clip.

## How to use
**Claude (Claude Code / Agent Skills):** copy any folder from `skills/` into `~/.claude/skills/` (or your project's `.claude/skills/`). Claude loads a skill when its `description` matches the task.

**Cursor:** copy the folders into your project's `.cursor/skills/` (or reference the `SKILL.md` files from your rules), and the agent will pick them up the same way.

**Any agent:** each `SKILL.md` is plain markdown with YAML frontmatter (`name`, `description`). Paste it into the system prompt or load it on demand.

Remotion skills assume Node 18+, ffmpeg and Python 3. Install the official Remotion agent skills for API rules.

## Credits
- [Loopreel](https://loopreel-nine.vercel.app/): source and inspiration for the motion director, frame review loop and MG styles skills.
- [Awesome Opus 5.5 videos](https://github.com/yihui-dev/awesome-opus5-5-videos) (MIT, yihui-dev): the prompt library behind the `awesome-opus5-5-videos` skill. The data isn't bundled here; clone it from upstream.
- [Remotion](https://www.remotion.dev/): the video framework behind the promos.

## License
MIT. See [LICENSE](LICENSE).

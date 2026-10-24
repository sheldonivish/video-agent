# Video Agent

An AI agent skill pack for making short-form videos: **news clips, explainer reels, and premium Remotion product promos**. Every cut is delivered for review and approval. **Video Agent never auto-posts.**

## What it does
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

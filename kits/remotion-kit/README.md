# remotion-kit: reusable Remotion building blocks for screenshot-driven promo and launch films

Setup: `npm i`, then `python3 scripts/sfx.py` (writes public/sfx) and optionally `python3 scripts/music.py` (an original synthesized draft bed in public/audio; use a licensed track for delivery).
`public/shots/demo.png` is a placeholder; capture your own product screens with `scripts/capture.mjs`.

Start a new promo: copy this folder to `<name>-video`, then edit
`src/kit/brand.ts` (brand tokens), `src/copy.ts` (all copy + timing), and replace `src/Demo.tsx` with your scenes.

| File | What it gives you |
|---|---|
| `src/kit/brand.ts` | colour / font tokens (6-digit hex for `accent`) |
| `src/kit/layout.ts` | `VERT` (1080x1920) and `WIDE` (1920x1080) layouts + `useLayout()` |
| `src/kit/motion.ts` | easings, spring preset, `grid(bpm,fps)` beat helper |
| `src/kit/Counter.tsx` | counter roll-up with land pop, `fmtCompact` ($1.3M) |
| `src/kit/Caption.tsx` | `KineticCaption` (word-by-word mask reveal, one accent word, auto-shrink via `fitSize`), `Strike` |
| `src/kit/TiltScreen.tsx` | screenshot world: keyframed camera push/pan + 3D tilt, focus pull (blur+dim), pixel-matched overlays in page px, `pops` (cards lifting out), `Patch` |
| `src/kit/Cursor.tsx` | realistic cursor: arc moves, click squash, drag holds |
| `src/kit/Transitions.tsx` | `SceneFx` enter zoom / diagonal wipe, exit zoom / paper tear; `CutFlash` |
| `src/kit/Speed.tsx` | `SpeedScene`: global speed prop without resampling audio |
| `src/kit/Audio.tsx` | `SfxTrack` cue list + `MusicBed` (offset, fades, ducking under SFX) |
| `src/kit/Finish.tsx` | `Backdrop` glow, `Grain`, `Vignette` |
| `scripts/sfx.py` | synthesize whoosh/click/pop/ticks/boom into public/sfx |
| `scripts/music.py` | synthesize an original BPM music bed (optional stop+drop), mastered to -14 LUFS |
| `scripts/loudness.py` | LUFS/peak check of a render |
| `scripts/sheet.sh` | contact sheet of frames at given times |
| `scripts/capture.mjs` | 2x/3x hi-DPI page screenshots with puppeteer |

Check: `npx tsc && npx eslint src`. Render: `npx remotion render KitDemo out/v.mp4`, `npx remotion render KitDemoWide out/w.mp4 --props='{"speed":1.2,"music":"audio/music.wav","musicVolume":0.8}'`.
See `skills/remotion-launch-film` for the launch-film structure (hook, problem, product beats on real screens, proof numbers, end card) built on this kit.

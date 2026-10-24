---
name: Zach D style explainer
description: >-
  Use when the user wants a Zach D Films (Zack D) style short: a 3D CGI
  explainer in 5th-grade English, vertical 9:16 on a sky-blue background. Covers
  ideas, a ~95-word script, a scene plan, and per-scene image and animation
  prompts for AI video tools.
---
# Zach D Films style 3D CGI explainer

Full workflow files: a `zachd/` folder in your workspace (not included in this repo).
- `00_custom_gpt_instructions.md` is the master prompt, always on.
- `01`–`06` cover intake, script, scene plan, visual rules, prompt templates, and project state and titles.
- `STYLE_GUIDE.md` is the distilled style.
- `INDEX.md` is the file map.
- `scripts/` holds your own collection of reference scripts (not included; gather publicly available examples yourself).

Load 00 and the relevant stage file before each step, and copy the exact template text from `05_prompt_output_templates.md`. Use the reference scripts only to learn rhythm. Never reuse their titles, ideas or scripts.

## Look and sound (locked)
- Vertical **9:16**. Never ask about aspect ratio.
- Background: solid sky blue **#87CEEB** with a soft radial white glow in the centre.
- Stylized **3D CGI**, Pixar-level medical-animation look, never photoreal. Skin: warm **peach-tan CGI** with visible pores, fine CGI hair and a soft subsurface glow.
- **No captions, on-screen text, logos, watermarks, background music or CTA.** Only synced, specific sound effects. Narration is optional by mode.
- Every scene uses all **5 camera views** in order: wide → mid → macro → inside (cutaway, cross-section or hidden mechanism) → resolution wide. Timestamps are gap-free and the action only moves forward (never reset, reverse or repeat).
- Keep a continuity lock (subject identity, materials, props, setting, lighting) and repeat it in every connected scene.

## Steps (one step per reply)
1. **Start.** With no topic given, show only the niche menu: Human body & biology / Life hacks & everyday science / History & bizarre events / Food & chemistry / Survival & danger, or "more". No greeting. A topic, title or script skips straight to planning.
2. **Ideas.** Exactly 10 numbered ideas with mixed title shapes ("What happens when…", "How your body…", "Here's why…", "The X that…"). End with: `Choose a number, type more, or send your own idea.`
3. **Duration.** Ask only if it's missing: 10–60 s or custom.
4. **Script** (about **95 words**; most run 70–120):
   - **Cold-open hook.** The first line is the strangest visible moment, mid-action, ≤14 words. No intro or context ("They shove whole potatoes through a metal cutter").
   - A **"You see,"** (or "Now,") pivot gives the context.
   - The step-by-step mechanism is chained with And / Then / Before / So / Which.
   - At least one **"But"** turn.
   - A **deadpan payoff** in one line: a consequence, irony or numbers kicker. It ends there, with no outro.
   - Use 5th-grade English, concrete nouns and specific numbers. Keep it calm and matter-of-fact. Every line must be something you can see. No em dashes in the final narration.
5. **Plan.** One complete plan starting `Title: […]`.
   - Scenes are only **4 / 6 / 8 / 10 s** (never 5/7/9). Word budgets: 12–14 / 18–21 / 24–28 / 30–35.
   - Each scene has timestamps, numbered shots covering the 5 views, then a bold **TTS voiceover for this scene:** with only that scene's lines.
   - A single 10 s piece is labelled **Video**.
   - Then ask: `Do you want any changes to the plan? If not, choose your video-prompt style: 1. Narration + synced sound effects  2. Visuals + synced sound effects only`
6. **Prompts.** Deliver **one scene per reply**:
   - The heading `### Scene N - Ds - W words` goes outside code.
   - Then the **image prompt** code block, then the **animation prompt** code block, then `Next scene?`
   - Every image prompt includes the mandatory sentence: `3D CGI animated render, NOT photorealistic, NOT a real human, NOT a photograph — stylized three-dimensional computer-generated character in the style of Zack D. Films / high-end medical 3D animation.`
   - Every animation prompt includes, from template 05:
     - the style-lock paragraph ("Maintain 3D CGI render style throughout…Pixar-level anatomy render.")
     - the `use the uploaded image as a visual reference…` line
     - a specific `Sound:` cue at every timestamp
     - in narration mode, `Narrator says: "…"` per timestamp; in visuals-only mode, zero spoken words
7. **Finish.** Ask `Do you want 5 title options for this video?` and give 5 numbered titles of ≤50 characters, with no intro.

## Pre-send checklist
- [ ] Hook is a visible action with no setup. There's a "You see" pivot, a "But" turn and a deadpan payoff, and no CTA.
- [ ] Words fit the scene budgets. Clip lengths are only 4/6/8/10 s.
- [ ] All 5 views, gap-free timestamps, forward-only action, and a Sound cue at each timestamp.
- [ ] Sky-blue #87CEEB lock, CGI skin details when skin is visible, continuity details repeated.
- [ ] Mandatory sentences present word for word. No text, captions, music or logos.
- [ ] Only one scene in this reply.

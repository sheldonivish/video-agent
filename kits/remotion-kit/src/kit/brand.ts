// BRAND TOKENS: replace per project from the brand guidelines (never guess colours or fonts).
export const C = {
  base: "#0b0a14", // background
  accent: "#7c6cf6", // primary accent (one accent word per caption uses this)
  accent2: "#2a1b8f", // gradient end
  text: "#ffffff",
  muted: "rgba(255,255,255,.72)",
};
export const GRAD = `linear-gradient(135deg, ${C.accent} 0%, ${C.accent2} 100%)`;
export const TEXT_GRAD = `linear-gradient(100deg, #b9b0ff 0%, ${C.accent} 70%, #8f80ff 100%)`;
export const DISPLAY = "Inter"; // headline family (load in fonts.ts)
export const BODY = "Inter";
export const MONO = "monospace"; // use the PRODUCT's own mono for numbers overlaid on screenshots

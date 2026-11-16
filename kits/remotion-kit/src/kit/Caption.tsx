import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, DISPLAY } from "./brand";
import { CL, OUT } from "./motion";
// measure with the loaded font so long lines auto-shrink to fit their column (needed for 16:9 re-wraps)
let ctx: CanvasRenderingContext2D | null = null;
export const measure = (text: string, size: number, font = DISPLAY, weight = 800) => {
  if (typeof document === "undefined") return text.length * size * 0.55;
  ctx = ctx ?? document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * size * 0.55;
  ctx.font = `${weight} ${size}px "${font}"`;
  return ctx.measureText(text).width;
};
export const fitSize = (lines: string[], size: number, maxW: number, font = DISPLAY, weight = 800) => {
  const worst = Math.max(...lines.map((l) => measure(l, 100, font, weight)));
  return Math.min(size, Math.floor((maxW / Math.max(1, worst)) * 100));
};
/**
 * Word-by-word kinetic caption: each word slides up out of a mask (2-frame stagger),
 * one accent word in the brand colour, words exit upward at `end`.
 */
export const KineticCaption: React.FC<{
  lines: string[];
  accent?: string[];
  start: number;
  end: number;
  size: number;
  maxW: number;
  align?: "center" | "left";
  stagger?: number;
  font?: string;
  style?: React.CSSProperties;
}> = ({ lines, accent = [], start, end, size: size0, maxW, align = "center", stagger = 2, font = DISPLAY, style }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end + 14) return null;
  const size = fitSize(lines, size0, maxW, font);
  let k = 0;
  return (
    <div style={{ width: maxW, textAlign: align, fontFamily: font, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.04em", ...style }}>
      {lines.map((ln, li) => (
        <div key={li}>
          {ln.split(" ").map((w, i) => {
            const n = k++;
            const y =
              frame < end
                ? interpolate(frame, [start + n * stagger, start + n * stagger + 14], [110, 0], { ...CL, easing: OUT })
                : interpolate(frame, [end + n, end + n + 9], [0, -110], { ...CL, easing: Easing.bezier(0.7, 0, 0.84, 0) });
            return (
              <React.Fragment key={i}>
                <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", verticalAlign: "top" }}>
                  <span style={{ display: "inline-block", translate: `0px ${y}%`, color: accent.includes(w) ? C.accent : C.text }}>{w}</span>
                </span>
                {i < ln.split(" ").length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
/** Animated strike-through bar for a hook word ("Stop paying" -> strike "paying"). Render inside a relative inline span. */
export const Strike: React.FC<{ at: number; dur?: number; thickness: number; color?: string }> = ({ at, dur = 6, thickness, color = C.accent }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return <span style={{ position: "absolute", left: "-4%", top: "52%", width: "108%", height: thickness, borderRadius: thickness / 2, background: color, boxShadow: `0 0 30px ${color}`, transform: `scaleX(${p}) rotate(-3deg)`, transformOrigin: "left center" }} />;
};

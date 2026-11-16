import { Easing, spring } from "remotion";
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
export const SOFT = Easing.bezier(0.45, 0, 0.2, 1);
export const SPR = { damping: 12, stiffness: 180, mass: 0.9 };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const springAt = (f: number, at: number, fps: number, cfg = SPR) => spring({ frame: f - at, fps, config: cfg });
/** BPM grid helpers: beat(n) -> frame of the n-th beat */
export const grid = (bpm: number, fps: number) => {
  const spb = (60 / bpm) * fps;
  return { spb, beat: (n: number) => Math.round(n * spb), bar: (n: number) => Math.round(n * 4 * spb) };
};

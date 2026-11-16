import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, springAt } from "./motion";
import { DISPLAY } from "./brand";
// Counter roll-up: eases from `from` to `to` between frames t0..t1, then does a small spring "land" pop.
export const fmtCompact = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${Math.round(v)}`;
export const Counter: React.FC<{
  to: number;
  from?: number;
  t0?: number;
  t1?: number;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
  size?: number;
  font?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ to, from = 0, t0 = 0, t1 = 36, prefix = "", suffix = "", format = (v) => Math.round(v).toLocaleString("en-US"), size = 200, font = DISPLAY, color = "#fff", style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(f, [t0, t1], [from, to], { ...CL, easing: Easing.out(Easing.cubic) });
  const p = springAt(f, t1, fps, { damping: 9, stiffness: 220, mass: 0.8 });
  const land = f >= t1 ? 1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI) * (1 - Math.min(1, (f - t1) / 14)) : 1;
  return (
    <div style={{ fontFamily: font, fontWeight: 800, fontSize: size, color, fontVariantNumeric: "tabular-nums", transform: `scale(${land})`, lineHeight: 1, ...style }}>
      {prefix}
      {format(v)}
      {suffix}
    </div>
  );
};

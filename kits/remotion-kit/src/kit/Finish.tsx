import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./brand";
/** Slowly drifting radial glow in the accent colour. */
export const Backdrop: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const x = 50 + 12 * Math.sin(f / 40);
  const y = 30 + 8 * Math.cos(f / 55);
  return (
    <AbsoluteFill style={{ background: C.base }}>
      <AbsoluteFill style={{ background: `radial-gradient(${Math.max(W, H) * 0.7}px ${Math.max(W, H) * 0.55}px at ${x}% ${y}%, ${C.accent}${Math.round(0x52 * glow).toString(16).padStart(2, "0")}, transparent 75%)` }} />
    </AbsoluteFill>
  );
};
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const seed = Math.floor(useCurrentFrame() / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
export const Vignette: React.FC<{ s?: number }> = ({ s = 0.5 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${s}) 100%)` }} />
);

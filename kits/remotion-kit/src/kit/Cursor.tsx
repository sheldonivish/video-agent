import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CL, lerp, SOFT } from "./motion";
/**
 * Realistic cursor: eased moves along a slight arc, press-squash on clicks, hold for drags,
 * fade in/out. Keys are in SCREEN px; to follow a moving screenshot camera pass `map`
 * (e.g. page px -> screen px using the same camAt() the TiltScreen uses).
 */
export type CK = { f: number; x: number; y: number; drag?: boolean };
export const Cursor: React.FC<{ keys: CK[]; clicks?: number[]; holds?: [number, number][]; map?: (x: number, y: number, f: number) => { x: number; y: number }; size?: number }> = ({
  keys,
  clicks = [],
  holds = [],
  map = (x, y) => ({ x, y }),
  size = 60,
}) => {
  const frame = useCurrentFrame();
  const f0 = keys[0].f;
  const f1 = keys[keys.length - 1].f + 20;
  if (frame < f0 || frame > f1 || keys.length < 2) return null;
  let i = 0;
  while (i < keys.length - 2 && frame > keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const raw = interpolate(frame, [a.f, b.f], [0, 1], CL);
  const t = b.drag ? SOFT(raw) : Easing.bezier(0.35, 0, 0.15, 1)(raw);
  const A = map(a.x, a.y, frame);
  const B = map(b.x, b.y, frame);
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const arc = b.drag ? 0 : Math.sin(Math.PI * t) * Math.min(70, len * 0.12);
  const x = lerp(A.x, B.x, t) + (-dy / len) * arc;
  const y = lerp(A.y, B.y, t) + (dx / len) * arc;
  let press = 1;
  for (const c of clicks) press = Math.min(press, interpolate(frame, [c, c + 3, c + 9], [1, 0.84, 1], CL));
  for (const [h0, h1] of holds) press = Math.min(press, interpolate(frame, [h0 - 2, h0 + 1, h1, h1 + 5], [1, 0.9, 0.9, 1], CL));
  const opacity = Math.min(interpolate(frame, [f0, f0 + 6], [0, 1], CL), interpolate(frame, [f1 - 6, f1], [1, 0], CL));
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24" style={{ position: "absolute", left: x - 3, top: y - 2, opacity, scale: String(press), transformOrigin: "3px 2px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))" }}>
      <path d="M1.5 1.2 L1.5 19.2 L6.1 15 L9.2 22 L12.4 20.6 L9.4 13.8 L15.6 13.6 Z" fill="#FFFFFF" stroke="#0B0C0E" strokeWidth={1.3} strokeLinejoin="round" />
    </svg>
  );
};

import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./brand";
import { Layout, useLayout } from "./layout";
import { CL, lerp, OUT } from "./motion";
/**
 * Wrap a scene: enter = none | zoom | wipeUR | wipeDR (diagonal wipe with a light edge line),
 * exit = none | zoom | tear (paper tear: jagged diagonal split, halves fly apart).
 * Overlap the next Sequence by ~14-20 frames so the incoming scene shows through the exit.
 */
export const SceneDur = React.createContext<number | null>(null);
export type Enter = "none" | "zoom" | "wipeUR" | "wipeDR";
export type Exit = "none" | "zoom" | "tear";
const TAN = Math.tan((24 * Math.PI) / 180);
const tearFor = (L: Layout) => {
  const cx = L.W / 2;
  const cy = L.H / 2;
  const pts: [number, number][] = [];
  for (let x = -120; x <= L.W + 120; x += 16) {
    const j = (random(`lt-${x}`) - 0.5) * 12 + (random(`lt2-${x}`) > 0.85 ? (random(`lt3-${x}`) - 0.5) * 22 : 0);
    pts.push([x, cy - TAN * (x - cx) + j]);
  }
  const X1 = L.W + 120;
  return {
    TOP: `polygon(-120px -1400px, ${X1}px -1400px, ${[...pts].reverse().map(([x, y]) => `${x}px ${y}px`).join(", ")})`,
    BOT: `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")}, ${X1}px ${L.H + 1400}px, -120px ${L.H + 1400}px)`,
    line: pts.map(([x, y]) => `${x},${y}`).join(" "),
  };
};
const wipePoly = (p: number, deg: number, W: number, H: number) => {
  const a = (deg * Math.PI) / 180;
  const d = { x: Math.cos(a), y: Math.sin(a) };
  const proj = [[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => x * d.x + y * d.y);
  const front = lerp(Math.min(...proj) - 40, Math.max(...proj) + 40, p);
  const B = { x: d.x * front, y: d.y * front };
  const n = { x: -d.y, y: d.x };
  const M = 4000;
  const pts = [
    [B.x + n.x * M, B.y + n.y * M],
    [B.x - n.x * M, B.y - n.y * M],
    [B.x - n.x * M - d.x * 6000, B.y - n.y * M - d.y * 6000],
    [B.x + n.x * M - d.x * 6000, B.y + n.y * M - d.y * 6000],
  ];
  return { clip: `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`, line: [B.x - n.x * M, B.y - n.y * M, B.x + n.x * M, B.y + n.y * M], d };
};
export const SceneFx: React.FC<{ enter?: Enter; exit?: Exit; inDur?: number; outDur?: number; children: React.ReactNode }> = ({ enter = "none", exit = "none", inDur = 14, outDur = 14, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seqDur } = useVideoConfig();
  const dur = React.useContext(SceneDur) ?? seqDur;
  const L = useLayout();
  const outStart = dur - outDur;
  let content: React.ReactNode = <AbsoluteFill style={{ backgroundColor: C.base }}>{children}</AbsoluteFill>;
  if (exit === "zoom" && frame >= outStart) {
    const q = interpolate(frame, [outStart, dur], [0, 1], { ...CL, easing: Easing.bezier(0.6, 0, 0.9, 0.4) });
    content = <AbsoluteFill style={{ scale: String(1 + 0.6 * q), opacity: interpolate(q, [0.55, 1], [1, 0], CL), filter: `blur(${q * 14}px)` }}>{content}</AbsoluteFill>;
  }
  if (exit === "tear" && frame >= outStart) {
    const tear = tearFor(L);
    const dist = interpolate(frame, [outStart, dur], [0, 1], { ...CL, easing: Easing.bezier(0.7, 0, 0.3, 1) }) * 1500;
    const half = (clip: string, vx: number, vy: number) => (
      <AbsoluteFill style={{ translate: `${vx * dist}px ${vy * dist}px` }}>
        <AbsoluteFill style={{ clipPath: clip }}>{content}</AbsoluteFill>
        <svg width={L.W} height={L.H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <polyline points={tear.line} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={2.5} />
        </svg>
      </AbsoluteFill>
    );
    content = (
      <AbsoluteFill>
        {half(tear.TOP, 0.55, -1)}
        {half(tear.BOT, 0.55, 1)}
      </AbsoluteFill>
    );
  }
  if (enter === "zoom" && frame < inDur) {
    const q = interpolate(frame, [0, inDur], [0, 1], { ...CL, easing: OUT });
    content = <AbsoluteFill style={{ scale: String(1.3 - 0.3 * q), opacity: interpolate(frame, [0, 6], [0, 1], CL), filter: `blur(${(1 - q) * 14}px)` }}>{content}</AbsoluteFill>;
  }
  if ((enter === "wipeUR" || enter === "wipeDR") && frame < inDur) {
    const p = interpolate(frame, [0, inDur], [0, 1], { ...CL, easing: Easing.bezier(0.7, 0, 0.25, 1) });
    const w = wipePoly(p, enter === "wipeUR" ? -66 : 66, L.W, L.H);
    content = (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: w.clip }}>
          <AbsoluteFill style={{ translate: `${-w.d.x * 140 * (1 - p)}px ${-w.d.y * 140 * (1 - p)}px` }}>{content}</AbsoluteFill>
        </AbsoluteFill>
        <svg width={L.W} height={L.H} style={{ position: "absolute", inset: 0 }}>
          <line x1={w.line[0]} y1={w.line[1]} x2={w.line[2]} y2={w.line[3]} stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
        </svg>
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill>{content}</AbsoluteFill>;
};
/** Light streak flashed on a hard cut. */
export const CutFlash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame() - at;
  const { width: W, height: H } = useVideoConfig();
  if (f < 0 || f > 6) return null;
  const o = interpolate(f, [0, 1, 6], [0, 0.55, 0], CL);
  const x = interpolate(f, [0, 6], [-0.3, 1.2]) * W;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x - W * 0.25, top: -H * 0.2, width: W * 0.5, height: H * 1.4, transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.5), rgba(255,255,255,0))", opacity: o, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

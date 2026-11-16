import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./brand";
import { Box, useLayout } from "./layout";
import { CL, springAt } from "./motion";

/**
 * Screenshot "world" with a keyframed camera, 3D tilt, focus pull (blur + dim),
 * pixel-matched overlays (children are positioned in PAGE css px, so an overlay at the
 * same x/y/size as a number in the screenshot sits exactly on top of it) and cards that
 * lift out of the screenshot (pops).
 *
 * Capture screenshots at 2x/3x (deviceScaleFactor) and pass the CSS size as pageW/pageH.
 */
export type Rect = [number, number, number, number]; // page css px: x0, y0, x1, y1
export type CamKey = { f: number; x: number; y: number; z: number; rx?: number; ry?: number; rz?: number };
export const camAt = (keys: CamKey[], f: number): Required<CamKey> => {
  const k = keys.map((q) => ({ rx: 0, ry: 0, rz: 0, ...q }));
  if (f <= k[0].f) return k[0];
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i];
    const b = k[i + 1];
    if (f <= b.f) {
      const t = Easing.inOut(Easing.cubic)((f - a.f) / Math.max(1e-6, b.f - a.f));
      const m = (u: number, v: number) => u + (v - u) * t;
      // zoom interpolates in log space so pushes feel linear
      return { f, x: m(a.x, b.x), y: m(a.y, b.y), z: Math.exp(m(Math.log(a.z), Math.log(b.z))), rx: m(a.rx, b.rx), ry: m(a.ry, b.ry), rz: m(a.rz, b.rz) };
    }
  }
  return k[k.length - 1];
};
export type Pop = { r: Rect; at: number; until?: number; s?: number; dx?: number; dy?: number; z?: number; rad?: number };
export type Focus = { at: number; until?: number; blur?: number; dim?: number }; // focus pull on the base layer

export const TiltScreen: React.FC<{
  src: string;
  pageW: number;
  pageH: number;
  cam: CamKey[];
  box?: Box;
  pops?: Pop[];
  focus?: Focus[];
  radius?: number;
  children?: React.ReactNode; // overlays in page px
}> = ({ src, pageW, pageH, cam, box: boxIn, pops = [], focus = [], radius = 28, children }) => {
  const L = useLayout();
  const box = boxIn ?? L.box;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = camAt(cam, f);
  const url = staticFile(src);
  let blur = 0;
  let dim = 0;
  for (const q of focus) {
    const on = interpolate(f, [q.at, q.at + 8], [0, 1], CL) * (q.until !== undefined ? interpolate(f, [q.until, q.until + 8], [1, 0], CL) : 1);
    blur = Math.max(blur, (q.blur ?? 8) * on);
    dim = Math.max(dim, (q.dim ?? 0.45) * on);
  }
  const toScr = (r: Rect) => ({ x: box.w / 2 + (r[0] - c.x) * c.z, y: box.h / 2 + (r[1] - c.y) * c.z, w: (r[2] - r[0]) * c.z, h: (r[3] - r[1]) * c.z });
  const page: React.CSSProperties = { position: "absolute", left: box.w / 2 - c.x * c.z, top: box.h / 2 - c.y * c.z, width: pageW, height: pageH, transformOrigin: "0 0", transform: `scale(${c.z})` };
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, perspective: 1800 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", boxShadow: `0 30px 80px rgba(0,0,0,.5)`, background: C.base }}>
          <div style={{ ...page, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
            <Img src={url} style={{ position: "absolute", left: 0, top: 0, width: pageW, height: pageH, maxWidth: "none" }} />
            {children}
          </div>
          {dim ? <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${dim})` }} /> : null}
        </div>
        {pops.map((p, i) => {
          const s = springAt(f, p.at, fps);
          const back = p.until !== undefined ? 1 - springAt(f, p.until, fps, { damping: 16, stiffness: 160, mass: 1 }) : 1;
          const k = s * back;
          if (k < 0.001) return null;
          const r = toScr(p.r);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                borderRadius: (p.rad ?? 16) * c.z,
                overflow: "hidden",
                transform: `translate(${(p.dx ?? 0) * k}px, ${(p.dy ?? -20) * k}px) translateZ(${(p.z ?? 40) * k}px) scale(${1 + ((p.s ?? 1.12) - 1) * k})`,
                boxShadow: `0 ${30 * k}px ${80 * k}px rgba(0,0,0,${0.55 * k}), 0 0 ${60 * k}px ${C.accent}88`,
              }}
            >
              <Img src={url} style={{ position: "absolute", left: -p.r[0] * c.z, top: -p.r[1] * c.z, width: pageW * c.z, height: pageH * c.z, maxWidth: "none" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
/** Opaque patch to hide the original pixels under a pixel-matched overlay (sample the bg colour from the screenshot). */
export const Patch: React.FC<{ r: Rect; bg: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ r, bg, children, style }) => (
  <div style={{ position: "absolute", left: r[0], top: r[1], width: r[2] - r[0], height: r[3] - r[1], background: bg, display: "flex", alignItems: "center", ...style }}>{children}</div>
);

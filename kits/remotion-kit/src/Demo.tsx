import React from "react";
import { AbsoluteFill } from "remotion";
import { beat, NUMBERS, SCRIPT } from "./copy";
import {
  Backdrop, CamKey, CutFlash, Counter, Cue, Cursor, fmtCompact, Grain, KineticCaption, Layout, LayoutCtx, MusicBed,
  Patch, SceneFx, SfxTrack, SpeedScene, TiltScreen, useLayout, VERT, Vignette, WIDE,
} from "./kit";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);
export const AUTHORED = fr(SCRIPT[SCRIPT.length - 1].end); // authored length before speed
const CUES: Cue[] = [[0, "boom", 0.4], [fr(1.5) - 4, "whoosh", 0.3], [fr(1.5) + 4, "ticks", 0.2], [fr(3.5), "pop", 0.3], [fr(4.6), "click", 0.4], [fr(6), "boom", 0.35]];

const Cap: React.FC<{ id: string; at?: number }> = ({ id }) => {
  const L = useLayout();
  const b = beat(id);
  const dur = fr(b.end - b.start);
  return (
    <div style={{ position: "absolute", left: L.text.x, top: L.wide ? L.H / 2 - 120 : L.text.y }}>
      <KineticCaption lines={(L.wide && b.wide) || b.lines} accent={b.accent} start={0} end={dur - 6} size={L.head} maxW={L.text.w} align={L.wide ? "left" : "center"} />
    </div>
  );
};
const Hook = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Cap id="hook" />
    </AbsoluteFill>
  </AbsoluteFill>
);
const Stat = () => {
  const L = useLayout();
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <Counter to={NUMBERS.stat} prefix="$" suffix="+" t0={3} t1={36} format={fmtCompact} size={L.wide ? 260 : 220} />
      <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 64, color: "rgba(255,255,255,.8)" }}>{beat("stat").lines[0]}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Screen = () => {
  const L = useLayout();
  const cam: CamKey[] = [
    { f: 0, x: 640, y: 450, z: 0.7, rx: 14, ry: -10 },
    { f: 40, x: 640, y: 420, z: 0.9, rx: 4, ry: -3 },
    { f: 75, x: 420, y: 330, z: 1.4 },
  ];
  return (
    <AbsoluteFill>
      <Backdrop glow={0.6} />
      <TiltScreen src="shots/demo.png" pageW={1280} pageH={900} cam={cam} pops={[{ r: [300, 260, 560, 420], at: 45 }]} focus={[{ at: 45, blur: 6, dim: 0.4 }]}>
        <Patch r={[40, 40, 260, 90]} bg="rgba(11,10,20,.85)" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 30, color: "#fff", paddingLeft: 12 }}>
          overlay in page px
        </Patch>
      </TiltScreen>
      <Cursor keys={[{ f: 10, x: L.W * 0.8, y: L.H * 0.85 }, { f: 32, x: L.W * 0.45, y: L.H * 0.6 }, { f: 60, x: L.W * 0.5, y: L.H * 0.55 }]} clicks={[33]} />
      <Cap id="screen" />
    </AbsoluteFill>
  );
};
const End = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Backdrop glow={1.2} />
    <Cap id="end" />
  </AbsoluteFill>
);
const SCENES: Record<string, { C: React.FC; enter: "none" | "zoom" | "wipeUR" | "wipeDR"; exit: "none" | "zoom" | "tear" }> = {
  hook: { C: Hook, enter: "none", exit: "zoom" },
  stat: { C: Stat, enter: "wipeUR", exit: "tear" },
  screen: { C: Screen, enter: "zoom", exit: "none" },
  end: { C: End, enter: "wipeDR", exit: "none" },
};
export type DemoProps = { speed: number; music: string | null; musicVolume: number };
const Film: React.FC<DemoProps & { layout: Layout }> = ({ layout, speed, music, musicVolume }) => (
  <LayoutCtx.Provider value={layout}>
    <AbsoluteFill style={{ background: "#0b0a14" }}>
      {SCRIPT.map((b, i) => {
        const s = SCENES[b.id];
        const from = fr(b.start);
        const overlap = i < SCRIPT.length - 1 ? 14 : 0; // scene keeps rendering under the next one's enter
        return (
          <SpeedScene key={b.id} from={from} dur={fr(b.end) - from + overlap} speed={speed}>
            <SceneFx enter={s.enter} exit={s.exit}>
              <s.C />
            </SceneFx>
          </SpeedScene>
        );
      })}
      <CutFlash at={Math.round(fr(3.5) / speed)} />
      <Vignette />
      <Grain />
      <SfxTrack cues={CUES} speed={speed} />
      {music ? <MusicBed src={music} volume={musicVolume} cues={CUES} speed={speed} /> : null}
    </AbsoluteFill>
  </LayoutCtx.Provider>
);
export const Demo: React.FC<DemoProps> = (p) => <Film {...p} layout={VERT} />;
export const DemoWide: React.FC<DemoProps> = (p) => <Film {...p} layout={WIDE} />;

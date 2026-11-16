import React from "react";
import { Freeze, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneDur } from "./Transitions";
/**
 * Speed prop: author every scene on a fixed timeline, then place it with <SpeedScene speed={1.2}>.
 * Picture is sampled at real_frame*speed (smooth fractional frames). Audio is NOT resampled:
 * schedule SFX at Math.round(at / speed) and set composition duration = round(authored / speed)
 * via calculateMetadata.
 */
export const SpeedScene: React.FC<{ from: number; dur: number; speed: number; children: React.ReactNode }> = ({ from, dur, speed, children }) => {
  const { fps } = useVideoConfig();
  const sFrom = Math.round(from / speed);
  const sDur = Math.ceil((from + dur) / speed) - sFrom;
  return (
    <Sequence from={sFrom} durationInFrames={sDur} premountFor={fps}>
      <Warp speed={speed} offset={sFrom * speed - from} total={dur}>
        {children}
      </Warp>
    </Sequence>
  );
};
const Warp: React.FC<{ speed: number; offset: number; total: number; children: React.ReactNode }> = ({ speed, offset, total, children }) => {
  const f = useCurrentFrame();
  return (
    <SceneDur.Provider value={total}>
      <Freeze frame={Math.max(0, f * speed + offset)}>{children}</Freeze>
    </SceneDur.Provider>
  );
};

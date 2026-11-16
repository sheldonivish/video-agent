import React from "react";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
/** SFX cue list shared by every aspect ratio: [frame, file in public/sfx without .wav, volume]. */
export type Cue = [number, string, number];
export const SfxTrack: React.FC<{ cues: Cue[]; speed?: number }> = ({ cues, speed = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map(([at, file, v], i) => (
        <Sequence key={i} from={Math.round(at / speed)} durationInFrames={2 * fps} layout="none">
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={v} />
        </Sequence>
      ))}
    </>
  );
};
const duckAt = (f: number, cues: Cue[], speed: number, depth: number) => {
  let d = 0;
  for (const [at0, , v] of cues) {
    const at = at0 / speed;
    if (f < at - 2 || f > at + 20) continue;
    const env = f < at ? (f - (at - 2)) / 2 : 1 - (f - at) / 20;
    d = Math.max(d, env * Math.min(1, v * 3));
  }
  return 1 - depth * d;
};
/** Music bed: optional start offset into the track, 0.5s fade-in, 1s fade-out, ducked under every SFX cue. Never sped up. */
export const MusicBed: React.FC<{ src: string; volume: number; offset?: number; cues?: Cue[]; speed?: number; duck?: number }> = ({ src, volume, offset = 0, cues = [], speed = 1, duck = 0.6 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const url = /^https?:/.test(src) ? src : staticFile(src);
  return (
    <Audio
      src={url}
      trimBefore={Math.round(offset * fps)}
      volume={(f) => volume * duckAt(f, cues, speed, duck) * interpolate(f, [0, 0.5 * fps, durationInFrames - 1 - fps, durationInFrames - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  );
};

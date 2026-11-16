import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { AUTHORED, Demo, DemoProps, DemoWide } from "./Demo";
const meta: CalculateMetadataFunction<DemoProps> = ({ props }) => ({ durationInFrames: Math.round(AUTHORED / props.speed) });
const defaults: DemoProps = { speed: 1, music: "audio/music.wav", musicVolume: 0.8 };
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="KitDemo" component={Demo} calculateMetadata={meta} durationInFrames={AUTHORED} fps={30} width={1080} height={1920} defaultProps={defaults} />
    <Composition id="KitDemoWide" component={DemoWide} calculateMetadata={meta} durationInFrames={AUTHORED} fps={30} width={1920} height={1080} defaultProps={defaults} />
  </>
);

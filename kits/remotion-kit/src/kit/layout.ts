import React, { useContext } from "react";
// One Layout per aspect ratio. Author scenes against useLayout() so 9:16 and 16:9 share code.
export type Box = { x: number; y: number; w: number; h: number };
export type Layout = {
  W: number;
  H: number;
  wide: boolean;
  head: number; // base headline px (auto-shrunk by fitSize)
  text: { x: number; y: number; w: number }; // headline column
  box: Box; // default screenshot viewport
};
export const VERT: Layout = { W: 1080, H: 1920, wide: false, head: 140, text: { x: 90, y: 250, w: 900 }, box: { x: 80, y: 690, w: 920, h: 900 } };
export const WIDE: Layout = { W: 1920, H: 1080, wide: true, head: 118, text: { x: 120, y: 0, w: 700 }, box: { x: 860, y: 110, w: 960, h: 860 } };
export const LayoutCtx = React.createContext<Layout>(VERT);
export const useLayout = () => useContext(LayoutCtx);

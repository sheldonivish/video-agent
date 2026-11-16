// ALL ON-SCREEN COPY + TIMING LIVES HERE (one file the script owner can edit).
// Times in seconds on a BPM grid (120 BPM = 0.5 s per beat). `wide` = optional 16:9 re-wrap.
export type Beat = { id: string; start: number; end: number; lines: string[]; accent?: string[]; wide?: string[] };
export const BPM = 120;
export const SCRIPT: Beat[] = [
  { id: "hook", start: 0, end: 1.5, lines: ["Stop paying", "for this."], accent: ["this."] },
  { id: "stat", start: 1.5, end: 3.5, lines: ["in example value"] },
  { id: "screen", start: 3.5, end: 6, lines: ["every one", "verified"], accent: ["verified"], wide: ["every one verified"] },
  { id: "end", start: 6, end: 8, lines: ["example.com"], accent: ["example.com"] },
];
export const NUMBERS = { stat: 1_300_000 };
export const beat = (id: string) => {
  const b = SCRIPT.find((x) => x.id === id);
  if (!b) throw new Error(`missing beat ${id}`);
  return b;
};

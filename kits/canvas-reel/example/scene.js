// Example 10 s scene: one figure, a price line that draws, two status pills, end card.
// Every visual is a pure function of t, so preview/full renders are deterministic.
const DUR = 10;
// camera keys: [t, x, y, zoom]; monotone cubic, so the camera never stops dead on a key
setCam([[0, 540, 1000, 1.25], [3, 620, 980, 1.15], [6.5, 820, 900, 1.05], [8.4, 1640, 960, 1.0], [10, 1640, 960, 1.02]]);
PILLS = [[0.2, 'WAIT', 260], [3.4, 'BREAKOUT', 260], [6.2, 'CONFIRMED', 260]];
const PTS = [[200, 1250], [320, 1180], [440, 1230], [560, 1060], [680, 1120], [800, 900], [920, 960], [1040, 720]];
WORLD = function (t, V, isCover) {
  figure(300, GROUND, 1.0, '#ffffff', pr(t, 0, 0.4, eo));
  spot(300, pr(t, 0, 0.6));
  const p = pr(t, 0.3, 6.0, eio);
  const tip = polyline(PTS, p, PL, 10, 1);
  if (tip) disc(tip[0], tip[1], 14, '#fff', 1, 24);
  dashed(150, 1100, 1060, 'rgba(255,255,255,0.5)', 3, pr(t, 1.2, 1.8));
  text('LEVEL', 1000, 1030, 30, '#bbb', pr(t, 1.2, 1.8), 'right');
  burst(560, 1060, cl((t - 3.4) / 0.6), GN);
  coin(1040, 640, 40, pr(t, 6.2, 6.8, back), '#fff');
  endCard(t, 1640, 8.4);
};
window.COVER = { t: 6.5, x: 700, y: 950, z1: 1.0, z4: 1.0, dy1: 0, dy4: 0, lines: ['ONE LINE', 'HEADLINE'], px: 92 };

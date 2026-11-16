/* Chart-first lesson reel render engine, v2 (camera).
   renderAt(t) is a pure function of time: no timers, no randomness, no CSS animation.

   Supersampling: the canvas backing store is SS× the logical 1080×1920 frame and
   Chrome is screenshotted at device_scale_factor=SS, so every stroke, candle edge
   and glyph is rasterised at 2160×3840 and downsampled with lanczos in the encode
   step. Drawing coordinates stay in logical (CSS) pixels.

   v2 adds a CAMERA. One optional list of {at, zoom, cx, cy} keys, smoothstepped,
   applied as a single transform that wraps the chart plane AND the annotation
   plane together — so a mark can never slide off the bar it names. Annotations
   are anchored in chart space but drawn at screen size (atScreenScale), the way a
   real charting app keeps its labels legible while you zoom.
   A permanent drift (0.35 px/s pan, 0.15 %/s zoom) rides on top of the keys. */

const W = 1080, H = 1920;
const SS = 2;
const C = {
  bg: '#FFFFFF', grid: '#EAECEF', up: '#0E9F6E', dn: '#EF4444',
  ink: '#111827', muted: '#9CA3AF', acc: '#F59E0B', body: '#6B7280',
  rule: '#111827'
};
let PLOT = { x0: 88, x1: 912, y0: 466, y1: 1496 };   // overridden by layout.plot
let AXIS_X = 1008;
const FONT = 'Inter';

let S = null, scale = {}, ctx, canvas;
let PL = { alpha: 1 };

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = e => e * e * (3 - 2 * e);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const prog = (t, at, dur) => clamp((t - at) / Math.max(dur, 1e-6));
const A = a => a * PL.alpha;

/* ---------- camera ---------- */
const CAM = { zoom: 1, cx: 0, cy: 0, dx: 0, dy: 0, live: false };
const DRIFT = { px: 0.35, zoom: 0.0015 };          // per second, per the brief
const PLOTC = () => ({ x: (PLOT.x0 + PLOT.x1) / 2, y: (PLOT.y0 + PLOT.y1) / 2 });

function cameraAt(t) {
  const k = S.camera, pc = PLOTC();
  if (!k || !k.length) return { zoom: 1, cx: pc.x, cy: pc.y, dx: 0, dy: 0, live: false };

  // Catmull-Rom through the keys, not smoothstep between them.
  // Smoothstep has ZERO VELOCITY at both ends of every segment, so a keyed
  // camera stops dead on every knot — measured as 24 near-frozen frames landing
  // exactly on the keys. Catmull-Rom keeps the velocity continuous through each
  // key (tangent = finite difference of its neighbours), so the camera passes
  // through a key instead of parking on it.
  const n = k.length;
  const at = i => k[Math.max(0, Math.min(n - 1, i))];
  let i = 0;
  while (i < n - 2 && t > k[i + 1].at) i++;
  const k0 = at(i - 1), k1 = at(i), k2 = at(i + 1), k3 = at(i + 2);
  const span = Math.max(k2.at - k1.at, 1e-6);
  const u = clamp((t - k1.at) / span);
  const cr = (p0, p1, p2, p3) => {
    const u2 = u * u, u3 = u2 * u;
    return 0.5 * ((2 * p1) + (-p0 + p2) * u +
                  (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
                  (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
  };
  const zoom = Math.max(0.35, cr(k0.zoom, k1.zoom, k2.zoom, k3.zoom));
  const cxr = cr(k0.cx, k1.cx, k2.cx, k3.cx);
  const cyr = cr(k0.cy, k1.cy, k2.cy, k3.cy);

  // keep the visible window inside the drawn chart at all times
  const ox = (S.layout && S.layout.overscanX) || 0;
  const halfW = (PLOT.x1 - PLOT.x0) / 2 / zoom;
  const halfH = (PLOT.y1 - PLOT.y0) / 2 / zoom;
  const xMin = PLOT.x0 - ox + halfW, xMax = PLOT.x1 + ox - halfW;
  const yMin = PLOT.y0 + halfH, yMax = PLOT.y1 - halfH;
  const cx = halfW * 2 >= (PLOT.x1 - PLOT.x0 + 2 * ox)
    ? pc.x : clamp(cxr, Math.min(xMin, xMax), Math.max(xMin, xMax));
  const cy = halfH * 2 >= (PLOT.y1 - PLOT.y0)
    ? pc.y : clamp(cyr, Math.min(yMin, yMax), Math.max(yMin, yMax));

  // A slow two-axis Lissajous ride on top, so even the flattest stretch of the
  // spline (or a deliberate hold) is still changing pixels at every frame.
  const BP = 3.7;
  const bx = Math.sin(t * 2 * Math.PI / BP) * 9.0;
  const by = Math.sin(t * 2 * Math.PI / (BP * 1.618) + 1.1) * 6.0;
  const bz = 1 + 0.0062 * Math.sin(t * 2 * Math.PI / (BP * 1.27) + 0.4);

  return { zoom: zoom * (1 + DRIFT.zoom * t) * bz, cx: cx + bx, cy: cy + by,
           dx: DRIFT.px * t, dy: DRIFT.px * 0.37 * t, live: true };
}

function applyCamera() {
  const pc = PLOTC();
  ctx.translate(pc.x + CAM.dx, pc.y + CAM.dy);
  ctx.scale(CAM.zoom, CAM.zoom);
  ctx.translate(-CAM.cx, -CAM.cy);
}

const toScreen = (x, y) => [
  (x - CAM.cx) * CAM.zoom + PLOTC().x + CAM.dx,
  (y - CAM.cy) * CAM.zoom + PLOTC().y + CAM.dy
];
const LW = v => v / CAM.zoom;                 // constant screen weight inside the camera

/* anchor at a chart point, draw in screen pixels: labels keep their size and
   their leader while the bar they name moves under them */
function atScreenScale(x, y, fn) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 / CAM.zoom, 1 / CAM.zoom);
  fn();
  ctx.restore();
}

function setFont(size, weight, spacing = 0) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = spacing + 'px';
}
function measure(str, size, weight, spacing = 0) {
  ctx.save(); setFont(size, weight, spacing);
  const w = ctx.measureText(str).width; ctx.restore(); return w;
}
function text(str, x, y, o = {}) {
  const alpha = (o.alpha ?? 1) * PL.alpha;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  setFont(o.size ?? 32, o.weight ?? 500, o.spacing ?? 0);
  ctx.fillStyle = o.color ?? C.ink;
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = o.baseline ?? 'alphabetic';
  ctx.fillText(str, x, y);
  ctx.restore();
}
const shadowOn = () => { ctx.shadowColor = 'rgba(255,255,255,0.92)'; ctx.shadowBlur = 7; ctx.shadowOffsetY = 0; };
const shadowOff = () => { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; };

function buildScales() {
  const L = S.layout || {};
  if (L.plot) PLOT = { ...PLOT, ...L.plot };
  const bars = S.bars;
  const pad = (S.price.max - S.price.min) * (L.pad ?? 0.045);
  const lo = S.price.min - pad, hi = S.price.max + pad;
  const band = L.band || [PLOT.y0, PLOT.y1];
  const ov = L.overscanX ?? 0;
  const slot = (PLOT.x1 - PLOT.x0 + 2 * ov) / bars.length;
  const k = (band[1] - band[0]) / (hi - lo);
  scale = {
    slot, lo, hi, band, ov, k,
    x: i => PLOT.x0 - ov + (i + 0.5) * slot,
    y: p => band[1] - (p - lo) * k,
    priceAt: y => hi - (y - band[0]) / k,
    bodyW: Math.max(3.2, slot * 0.66)
  };
}

/* ---------- chart plane (under the camera) ---------- */
function drawGrid() {
  ctx.save();
  ctx.globalAlpha = 0.62;
  ctx.strokeStyle = C.grid; ctx.lineWidth = LW(1.1);
  for (const p of S.price.grid) {
    const y = scale.y(p);
    if (y < PLOT.y0 - 4 || y > PLOT.y1 + 4) continue;
    const yy = Math.round(scale.y(p) * CAM.zoom) / CAM.zoom;
    ctx.beginPath();
    ctx.moveTo(PLOT.x0 - scale.ov, yy); ctx.lineTo(PLOT.x1 + scale.ov, yy); ctx.stroke();
  }
  ctx.restore();
}

function drawCandles(t) {
  const { t0, dur } = S.draw;
  const n = S.bars.length;
  const grow = S.draw.grow ?? 0.30;
  for (let i = 0; i < n; i++) {
    const born = t0 + (i / n) * Math.max(0.1, dur - grow);
    if (t < born) break;
    const [, o, h, l, c] = S.bars[i];
    const p = clamp((t - born) / grow);
    const e = easeOut(p);
    const col = c >= o ? C.up : C.dn;
    const x = scale.x(i);
    const yo = scale.y(o), yc = scale.y(c), yh = scale.y(h), yl = scale.y(l);
    const bodyTop = Math.min(yo, yc), bodyBot = Math.max(yo, yc);

    ctx.globalAlpha = A(clamp(p * 2.2) * 0.94);
    ctx.strokeStyle = col;
    ctx.lineWidth = LW(Math.min(2.0, Math.max(1.05, scale.slot * 0.20)));
    ctx.beginPath();
    ctx.moveTo(x, lerp(bodyTop, yh, e));
    ctx.lineTo(x, lerp(bodyBot, yl, e));
    ctx.stroke();

    ctx.fillStyle = col;
    const bt = lerp(yo, bodyTop, e), bb = lerp(yo, bodyBot, e);
    ctx.fillRect(x - scale.bodyW / 2, bt, scale.bodyW, Math.max(1.2, bb - bt));
    ctx.globalAlpha = 1;
  }
}

/* ---------- screen-fixed chrome ---------- */
function drawPriceGutter() {
  for (const p of S.price.grid) {
    const [, sy] = toScreen(0, scale.y(p));
    if (sy < 190 || sy > 1830) continue;
    const label = Math.round(p).toLocaleString('en-US');
    const w = measure(label, 24, 600);
    ctx.save();
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.beginPath();
    ctx.roundRect(AXIS_X - w - 16, sy - 17, w + 22, 34, 8);
    ctx.fill();
    ctx.restore();
    text(label, AXIS_X - 4, sy + 8, { size: 24, weight: 600, color: C.muted, align: 'right' });
  }
}

function drawTopBar() {
  // chrome sits at fixed frame margins, NOT at the plot box: the plot is
  // full-bleed so a camera can pan under it, and PLOT.x0 is 0 there.
  const L = 44, R = W - 44;
  text(S.meta.eyebrow, L, 84, { size: 21, weight: 700, color: C.muted, spacing: 3.0 });
  if (S.meta.chartTag) text(S.meta.chartTag, R, 84,
    { size: 21, weight: 700, color: C.ink, align: 'right', spacing: 2.4 });
}

function drawDateTicks() {
  for (const d of S.dateTicks || []) {
    const [sx] = toScreen(scale.x(d.i), 0);
    if (sx < 70 || sx > W - 70) continue;
    // sit just under the plot floor; the end card owns the bottom 30px, so the
    // ticks stay off it (they collided with it in the first cut)
    text(d.text, sx, PLOT.y1 + 44,
         { size: 21, weight: 600, color: C.muted, align: 'center', spacing: 1.7 });
  }
}

/* ---------- annotation plane (anchored in chart space, drawn at screen size) ---------- */
function drawLevel(t, L) {
  const p0 = prog(t, L.at, L.dur ?? 0.45);
  if (p0 <= 0) return;
  const x0 = scale.x(L.i0);
  let x1 = scale.x(L.i1);
  if (L.extendTo != null) {
    const pe = easeInOut(prog(t, L.extendAt, L.extendDur ?? 0.7));
    x1 = lerp(x1, scale.x(L.extendTo), pe);
  }
  const xDraw = lerp(x0, x1, easeOut(p0));
  const y = scale.y(L.price);
  ctx.save();
  ctx.globalAlpha = A(L.alpha ?? 0.95);
  ctx.strokeStyle = L.color || C.acc;
  ctx.lineWidth = LW(L.width ?? 2.6);
  ctx.lineCap = 'round';
  if (L.dash !== false) ctx.setLineDash([LW(13), LW(9)]);
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xDraw, y); ctx.stroke();
  ctx.restore();
}

function drawAxisTag(t, a) {
  const p = easeOut(prog(t, a.at, a.dur ?? 0.3));
  if (p <= 0) return;
  const [, sy] = toScreen(0, scale.y(a.price));
  if (sy < 150 || sy > 1800) return;
  const label = a.text;
  const w = measure(label, 25, 800, 0.4);
  const bg = a.color === 'up' ? C.up : a.color === 'acc' ? C.acc : C.ink;
  ctx.save();
  ctx.globalAlpha = A(p);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(AXIS_X - w - 24, sy - 21, w + 30, 42, 9);
  ctx.fill();
  ctx.restore();
  text(label, AXIS_X - 9, sy + 1, { size: 25, weight: 800, color: '#FFFFFF', align: 'right', baseline: 'middle', spacing: 0.4, alpha: p });
}

function drawRing(t, pv) {
  const pr = prog(t, pv.at, pv.dur ?? 0.5);
  if (pr <= 0) return;
  const e = easeOut(pr);
  const x = scale.x(pv.i), y = scale.y(pv.price_drawn ?? pv.price);
  const r = pv.r ?? 30;
  const col = pv.color === 'amber' ? C.acc : (pv.color === 'up' ? C.up : C.ink);
  atScreenScale(x, y, () => {
    ctx.save();
    shadowOn();
    ctx.strokeStyle = col; ctx.lineWidth = pv.w ?? 3.0; ctx.globalAlpha = A(0.97);
    ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + e * Math.PI * 2); ctx.stroke();
    ctx.restore();
    if (pv.badge) {
      const bb = easeOut(prog(t, pv.at + 0.10, 0.30));
      if (bb > 0) {
        const bx = pv.badge.dx ?? -(r + 34), by = pv.badge.dy ?? -(r + 30);
        const br = (pv.badge.r ?? 27) * bb;
        ctx.save();
        ctx.globalAlpha = A(bb);
        // badge colour follows the LADDER, not the ring: highs get the accent,
        // lows stay black ink, so the two dashed lines and the badges agree.
        const bcol = pv.badge.color === 'ink' ? C.ink
                   : pv.badge.color === 'up' ? C.up
                   : pv.color === 'up' ? C.up
                   : pv.color === 'ink' ? C.ink : C.acc;
        ctx.fillStyle = bcol;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        setFont(30 * bb + 1, 800, 0);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(pv.badge.text, bx, by + 1);
        ctx.restore();
      }
    }
    // legacy label block: a pivot from the v1 schema names itself
    if (pv.label) {
      const la = easeOut(prog(t, pv.at + 0.16, 0.5));
      if (la > 0) {
        const align = pv.align ?? 'left';
        const lx = pv.lx ?? (r + 42);
        const w1 = measure(pv.label, 31, 780, -0.5);
        const w2 = pv.tag ? measure(pv.tag, 19, 600, 1.5) : 0;
        const bw = Math.max(w1, w2);
        let ax = align === 'right' ? Math.max(lx, 42 + bw + 6) : Math.min(lx, W - 26 - bw);
        // keep a high's block above and a low's below, flipping when it would
        // run out of plot — the v1 behaviour, preserved
        const BLOCK_H = 66, PAD = 10;
        let ay = pv.kind === 'high' ? -50 : 54;
        const sy = toScreen(0, scale.y(pv.price_drawn ?? pv.price))[1];
        if (sy + ay - BLOCK_H / 2 < 120) ay = 54;
        else if (sy + ay + BLOCK_H / 2 > H - 90) ay = -50;
        ctx.save();
        ctx.globalAlpha = A(la);
        text(pv.label, ax, ay, { size: 31, weight: 780, color: C.ink, align,
             baseline: 'middle', spacing: -0.5, alpha: la });
        if (pv.tag) text(pv.tag, ax, ay + (ay < 0 ? -33 : 32),
             { size: 19, weight: 600, color: C.muted, align, baseline: 'middle', spacing: 1.5, alpha: la });
        ctx.restore();
      }
    }
    const pp = prog(t, pv.at + 0.22, 0.9);
    if (pp > 0 && pp < 1) {
      ctx.save();
      ctx.strokeStyle = col; ctx.globalAlpha = A(0.34 * (1 - pp)); ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(0, 0, r + 26 * easeOut(pp), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  });
}

/* on-chart label: bold caps + optional sub, small colour tick, optional leader */
function drawTag(t, g) {
  const p = easeOut(prog(t, g.at, g.dur ?? 0.32));
  if (p <= 0) return;
  // optional exit: a label that has made its point leaves before the payoff,
  // so the last beat is the rule alone rather than five stacked callouts
  const outP = g.out != null ? prog(t, g.out, g.outDur ?? 0.30) : 0;
  if (outP >= 1) return;
  const vis = p * (1 - easeInOut(outP));

  // Anchor in chart space, place in screen space. Everything below — side
  // choice, clamping, text metrics — is screen pixels, so the camera can pull
  // the bar anywhere and the label still lands fully inside the frame.
  const x = scale.x(g.i != null ? g.i : 0);
  const y = g.price != null ? scale.y(g.price) : g.y;
  const [sx, sy0] = toScreen(x, y);

  const size = g.size ?? 38, weight = g.weight ?? 800;
  const sub = g.sub || '';
  const subSize = g.subSize ?? 22;
  const gap = g.gap ?? 26;
  const col = g.color === 'amber' ? C.acc : g.color === 'up' ? C.up
            : g.color === 'muted' ? C.muted : C.ink;
  const bw = Math.max(measure(g.text, size, weight, 0.8),
                      sub ? measure(sub, subSize, 600, 0.6) : 0);

  let side = g.side ?? 'auto';
  if (side === 'auto') side = sx > W * 0.5 ? 'left' : 'right';

  const M = 34, TOP = 128, BOT = H - 96;
  const blockH = sub ? size + subSize * 1.05 : size;
  let ax = side === 'right' ? sx + gap : sx - gap;
  // pull the block back inside the margins without moving its anchor
  // Clamp on BOTH edges for either side. A left-side label used to be clamped
  // only against the left margin, so a mark near the right edge of the plot put
  // its text out past the frame boundary (the BOS label shipped off-screen once).
  if (side === 'right') {
    if (ax + bw > W - M) ax = W - M - bw;
    if (ax < M) ax = M;
  } else {
    if (ax - bw < M) ax = M + bw;
    if (ax > W - M) ax = W - M;
  }
  const align = side === 'right' ? 'left' : 'right';

  let ay = sy0 + (g.dy ?? 0);
  ay = clamp(ay, TOP + size * 0.6, BOT - blockH * 0.7);

  const rise = (1 - p) * 10;
  ctx.save();
  ctx.globalAlpha = A(vis);

  // leader: only when the label actually sits beside its mark, so a clamped
  // label never draws a line across the chart
  const near = Math.abs(ay - sy0) < size * 0.85 && Math.abs(ax - sx) < bw + gap + 4;
  if (g.leader !== false && near) {
    ctx.strokeStyle = col; ctx.lineWidth = 2.3; ctx.globalAlpha = A(vis * 0.9);
    ctx.beginPath();
    ctx.moveTo(sx, sy0);
    ctx.lineTo(side === 'right' ? ax - 9 : ax + 9, ay + rise);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(sx, sy0, 4.4, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  }

  // colour tick above the first line
  ctx.globalAlpha = A(vis);
  ctx.fillStyle = col;
  const tw = 32 * p;
  ctx.fillRect(align === 'left' ? ax : ax - tw, ay - size * 0.94 + rise, tw, 3.5);

  text(g.text, ax, ay + rise, { size, weight, color: C.ink, align, baseline: 'middle', spacing: 0.8, alpha: vis });
  if (sub) text(sub, ax, ay + size * 0.60 + subSize * 0.52 + rise,
    { size: subSize, weight: 600, color: C.muted, align, baseline: 'middle', spacing: 0.5, alpha: vis });
  ctx.restore();
}

/* a tinted band on one candle's slot, e.g. the part of the body that closed
   above a level. Anchored in chart space so it stays on its candle. */
function drawHighlight(t, h) {
  const p = easeOut(prog(t, h.at, h.dur ?? 0.45));
  if (p <= 0) return;
  const x = scale.x(h.i);
  const w = Math.max(scale.bodyW * 1.5, 26);
  const y0 = scale.y(h.p0), y1 = scale.y(h.p1);
  const top = Math.min(y0, y1), bot = Math.max(y0, y1);
  ctx.save();
  ctx.globalAlpha = A(p) * (h.alpha ?? 0.30);
  ctx.fillStyle = h.color === 'up' ? C.up : h.color === 'dn' ? C.dn : C.acc;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, top, w, Math.max(2, bot - top), Math.min(8, w / 2));
  ctx.fill();
  ctx.restore();
}

/* vertical measurement bracket between two prices at a bar */
function drawMeasure(t, m) {
  const p = easeOut(prog(t, m.at, m.dur ?? 0.5));
  if (p <= 0) return;
  const x = scale.x(m.i);
  const y0 = scale.y(m.p0), y1 = scale.y(m.p1);
  const yy1 = lerp(y0, y1, p);
  ctx.save();
  ctx.strokeStyle = m.color === 'up' ? C.up : C.ink;
  ctx.globalAlpha = A(0.85);
  ctx.lineWidth = LW(2.2);
  ctx.setLineDash([LW(7), LW(6)]);
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, yy1); ctx.stroke();
  ctx.restore();
  atScreenScale(x, (y0 + yy1) / 2, () => {
    const lab = m.label;
    const w = measure(lab, 30, 800, 0.6);
    ctx.save(); ctx.globalAlpha = A(p);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.roundRect(38, -20, w + 26, 40, 8); ctx.fill();
    ctx.restore();
    text(lab, 51, 0, { size: 30, weight: 800, color: m.color === 'up' ? C.up : C.ink, baseline: 'middle', spacing: 0.6, alpha: p });
  });
}

function drawPolyline(t, g) {
  const p = prog(t, g.at, g.dur ?? 1.0);
  if (p <= 0) return;
  const e = easeInOut(p);
  const pts = g.points.map(([i, price]) => [scale.x(i), scale.y(price)]);
  const segs = []; let total = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const dx = pts[k + 1][0] - pts[k][0], dy = pts[k + 1][1] - pts[k][1];
    const len = Math.hypot(dx, dy);
    segs.push({ a: pts[k], b: pts[k + 1], len, s: total }); total += len;
  }
  const target = total * e;
  ctx.save();
  ctx.strokeStyle = g.color === 'up' ? C.up : g.color === 'amber' ? C.acc
                  : g.color === 'muted' ? C.muted : C.ink;
  ctx.globalAlpha = A(g.alpha ?? 0.92);
  ctx.lineWidth = LW(g.width ?? 3.0);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (g.dash) ctx.setLineDash([LW(12), LW(8)]);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (const s of segs) {
    if (target >= s.s + s.len) { ctx.lineTo(s.b[0], s.b[1]); continue; }
    const f = clamp((target - s.s) / s.len);
    ctx.lineTo(lerp(s.a[0], s.b[0], f), lerp(s.a[1], s.b[1], f));
    break;
  }
  ctx.stroke();
  ctx.restore();
  if (p >= 1 && g.endDot !== false) {
    const [ex, ey] = pts[pts.length - 1];
    atScreenScale(ex, ey, () => {
      ctx.save(); ctx.fillStyle = g.color === 'up' ? C.up : g.color === 'amber' ? C.acc : C.ink; ctx.globalAlpha = A(0.95);
      ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  }
}

function drawStaircase(t) { drawPolyline(t, S.staircase); }

/* Several ladders at once. A higher-highs/higher-lows lesson needs TWO lines
   climbing side by side and the single `staircase` slot cannot hold both.
   Same code as renderer/engine.pilot2.js otherwise, so pilot2_fast is untouched. */
function drawPolylines(t) { for (const pl of S.polylines || []) drawPolyline(t, pl); }

function drawBos(t) {
  const b = S.bos; if (!b) return;
  const p = prog(t, b.at, b.dur);
  if (p <= 0) return;
  const xA = scale.x(S.pivots[b.fromPivot].i);
  const y = scale.y(b.price);
  drawPolyline(t + 0, { ...b, points: [[S.pivots[b.fromPivot].i, b.price], [b.toI, b.price]], dash: true, endDot: false });
  drawTag(t, { at: b.at + b.dur * 0.5, i: b.toI, price: b.price, text: b.label, sub: b.sub, side: 'left', color: 'amber' });
}

/* ---------- type plane (screen space, not under the camera) ---------- */
function drawTitle(t) {
  const T = S.title; if (!T) return;
  const fi = T.fadeIn ?? 0.4;
  const inP = fi <= 0 ? 1 : easeOut(prog(t, T.at, fi));
  const outP = T.out != null ? prog(t, T.out, 0.5) : 0;
  if (outP >= 1) return;
  const a = inP * (1 - easeInOut(outP));
  if (a <= 0) return;

  // one or two lines; both are auto-fitted so a long rule never clips
  const lines = [T.text, T.line2].filter(Boolean);
  let size = T.size ?? 104;
  for (;;) {
    setFont(size, 800, -3.0);
    const widest = Math.max(...lines.map(l => ctx.measureText(l).width));
    if (widest <= W - 120 || size <= 44) break;
    size -= 2;
  }
  const lh = size * 1.06;
  const blockH = lines.length * lh;

  const cy = T.cy ?? (PLOT.y0 + PLOT.y1) / 2;
  const dy = (1 - inP) * 26 - easeInOut(outP) * 30;
  ctx.save();
  ctx.globalAlpha = a * PL.alpha;
  if (T.halo !== false) { ctx.shadowColor = 'rgba(255,255,255,0.98)'; ctx.shadowBlur = 22; }
  const rw = (T.rule ?? 92) * inP;
  ctx.fillStyle = T.ruleColor === 'ink' ? C.ink : C.acc;
  ctx.fillRect(W / 2 - rw / 2, cy - blockH / 2 - 44 + dy, rw, 6);
  setFont(size, 800, -3.0);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, cy - blockH / 2 + lh * (i + 0.5) + dy));
  if (T.sub) {
    ctx.globalAlpha = a * easeOut(prog(t, T.at + 0.20, 0.35)) * PL.alpha;
    setFont(40, 500, -0.3); ctx.fillStyle = C.body;
    ctx.fillText(T.sub, W / 2, cy + blockH / 2 + 46 + dy);
  }
  ctx.restore();
}

function drawEndcard(t) {
  const E = S.endcard; if (!E) return;
  const p = easeOut(prog(t, E.at, 0.7)); if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p * 0.92;
  const y = H - 30;
  const label = E.text.toUpperCase();
  setFont(23, 700, 3.2);
  const wt = ctx.measureText(label).width, dot = 11, gap = 15;
  const x0 = W / 2 - (dot + gap + wt) / 2;
  ctx.fillStyle = C.acc; ctx.fillRect(x0, y - 8, dot, dot);
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x0 + dot + gap, y);
  ctx.restore();
}

/* ---------- main ---------- */
function renderAt(t) {
  ctx.setTransform(SS, 0, 0, SS, 0, 0);
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  PL.alpha = 1;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  Object.assign(CAM, cameraAt(t));

  // 1. chart, under the camera
  ctx.save(); applyCamera();
  drawGrid(); drawCandles(t);
  ctx.restore();

  // 2. screen-fixed chrome
  drawPriceGutter(); drawDateTicks(); drawTopBar();

  // 3. marks that live in chart space (they convert to screen themselves where
  //    they need to: atScreenScale re-divides by zoom so type stays screen-sized)
  ctx.save(); applyCamera();
  for (const h of S.highlights || []) drawHighlight(t, h);
  for (const L of S.levels || []) drawLevel(t, L);
  for (const pv of S.pivots || []) drawRing(t, pv);
  if (S.extension) drawPolyline(t, S.extension);
  if (S.staircase) drawStaircase(t);
  drawPolylines(t);
  if (S.bos) drawBos(t);
  for (const m of S.measures || []) drawMeasure(t, m);
  ctx.restore();

  // 3b. labels: these resolve their own absolute screen position through
  //     toScreen(), so they MUST be drawn outside the camera transform — inside
  //     it they would be transformed a second time and land off-frame.
  //     Axis tags read their price off the live camera for the same reason.
  for (const a of S.axisTags || []) drawAxisTag(t, a);
  for (const g of S.tags || []) drawTag(t, g);
  for (const g of S.tagsScreen || []) drawTagScreen(t, g);

  // 4. type
  drawTitle(t);
  drawEndcard(t);
  return true;
}

/* a tag pinned to the frame rather than the chart (used for the closing rule) */
function drawTagScreen(t, g) {
  const p = easeOut(prog(t, g.at, g.dur ?? 0.34));
  if (p <= 0) return;
  const x = g.x ?? W / 2, y = g.y ?? 0;
  if (g.scrim) {
    // no caption BAND — just enough white lift under the words that the chart
    // behind cannot fight the rule. Soft-edged, so it reads as depth, not a bar.
    ctx.save();
    ctx.globalAlpha = A(p) * (g.scrimAlpha ?? 0.88);
    const grd = ctx.createRadialGradient(x, y, 30, x, y, 470);
    grd.addColorStop(0, '#FFFFFF');
    grd.addColorStop(0.55, 'rgba(255,255,255,0.96)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, y - 470, W, 940);
    ctx.restore();
  }
  atScreenScale(x, y, () => {
    const size = g.size ?? 38, weight = g.weight ?? 800;
    const col = g.color === 'amber' ? C.acc : g.color === 'up' ? C.up : C.ink;
    ctx.save(); ctx.globalAlpha = A(p);
    ctx.fillStyle = col; ctx.fillRect(0, -size * 0.95, 30 * p, 3);
    ctx.restore();
    text(g.text, 0, 0, { size, weight, color: C.ink, baseline: 'middle', spacing: 0.8, alpha: p });
    if (g.sub) text(g.sub, 0, size * 0.72, { size: g.subSize ?? 23, weight: 600, color: C.muted, baseline: 'middle', spacing: 0.5, alpha: p });
  });
}

async function boot(sceneUrl, fontUrl) {
  canvas = document.getElementById('c');
  canvas.width = W * SS; canvas.height = H * SS;
  ctx = canvas.getContext('2d');
  const ff = new FontFace(FONT, `url(${fontUrl})`);
  document.fonts.add(ff);
  await ff.load();
  await Promise.all([400, 500, 600, 700, 750, 780, 800].map(w => document.fonts.load(`${w} 40px Inter`)));
  S = await (await fetch(sceneUrl)).json();
  buildScales();
  renderAt(0);
  window.__ready = true;
  window.__duration = S.meta.duration;
  window.__fps = S.meta.fps;
  window.__ss = SS;
  window.__canvas = [canvas.width, canvas.height];
  return true;
}
window.boot = boot;
window.renderAt = renderAt;
window.__cam = t => cameraAt(t);

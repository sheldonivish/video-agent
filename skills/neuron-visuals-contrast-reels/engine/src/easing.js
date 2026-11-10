/** Easing presets matching Neuron Visuals contrast grammar.
 *  snappy: near-zero easing, stop-motion, finishes fast
 *  smooth: over-interpolated, hesitant, late
 */

export function clamp01(t) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpPose(a, b, t) {
  const out = {};
  for (const k of Object.keys(b)) {
    if (typeof b[k] === 'object' && b[k] !== null) out[k] = lerpPose(a[k] || {}, b[k], t);
    else out[k] = lerp(a[k] ?? b[k], b[k], t);
  }
  return out;
}

/** Almost linear, slightly overshoots then lands. Use over 4–8 frames. */
export function snappy(t) {
  t = clamp01(t);
  if (t >= 1) return 1;
  // tiny ease-out + snap into place; no long tail
  const stepped = Math.ceil(t * 5) / 5;
  const linear = 1 - Math.pow(1 - t, 1.2);
  return lerp(linear, stepped, 0.55);
}

/** Double-smoothstep: slow to start, slow to arrive, over-interpolated. */
export function smooth(t) {
  t = clamp01(t);
  const s = t * t * (3 - 2 * t);
  return s * s * (3 - 2 * s);
}

export function getEasing(name) {
  if (name === 'snappy') return snappy;
  return smooth;
}

/** Map a local time window to 0–1. */
export function windowT(t, start, dur) {
  if (dur <= 0) return t >= start ? 1 : 0;
  return clamp01((t - start) / dur);
}

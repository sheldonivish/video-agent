/** CHASES PUMPS vs BUYS EVERY MONTH
 *  Dominant accent: gold (the compounding stack).
 *  Supporting candle color: dark desaturated red so a pump reads without
 *  becoming a second saturated accent.
 *
 *  The engine overlay draws the wordmark from engine/assets/wordmark.png.
 *  Add your own mark at that path; it is not bundled.
 */
import { lerp, clamp01, windowT } from '../engine/src/easing.js';
import * as THREE from '../engine/vendor/three.module.js';

const GOLD = 0xe3b322;
const CANDLE_RED = 0x6e2c2c;

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const YEAR0 = 0.30;
const YEAR_LEN = 1.32;
const TOSS0 = 0.46;
const TOSS_EVERY = 0.30;
const TOSS_ANIM = 0.20;
const FLY_DELAY = 0.09;
const FLY_DUR = 0.24;
const MAX_COINS = 31;

function yearIndex(t) {
  if (t < YEAR0) return 0;
  return Math.min(YEARS.length - 1, Math.floor((t - YEAR0) / YEAR_LEN));
}
function yearLocal(t) {
  if (t < YEAR0) return 0;
  const i = yearIndex(t);
  return clamp01((t - (YEAR0 + i * YEAR_LEN)) / YEAR_LEN);
}

function candleHeight(localT) {
  // Spike finishes at 0.20 — the chaser has not even jumped yet
  if (localT < 0.20) return lerp(0.16, 1.95, localT / 0.20);
  const u = clamp01((localT - 0.20) / 0.80);
  return lerp(1.95, 0.10, u * u); // ease-in crash
}

function landedCoins(t) {
  let n = 0;
  for (let i = 0; i < MAX_COINS; i++) {
    if (t >= TOSS0 + i * TOSS_EVERY + FLY_DELAY + FLY_DUR) n++;
  }
  return n;
}

function activeToss(t) {
  for (let i = 0; i < MAX_COINS; i++) {
    const start = TOSS0 + i * TOSS_EVERY;
    if (t >= start && t < start + TOSS_ANIM) {
      return { i, phase: clamp01((t - start) / TOSS_ANIM) };
    }
  }
  return null;
}

function activeFlight(t) {
  for (let i = 0; i < MAX_COINS; i++) {
    const start = TOSS0 + i * TOSS_EVERY + FLY_DELAY;
    if (t >= start && t < start + FLY_DUR) {
      return { i, u: clamp01((t - start) / FLY_DUR) };
    }
  }
  return null;
}

export const script = {
  layout: 'top-bottom',
  duration: 12,
  fps: 30,
  labels: {
    top: 'CHASES PUMPS',
    bottom: 'BUYS EVERY MONTH',
  },
  build(api) {
    const chaser = api.addFigure({ panel: 'top', easing: 'smooth' });
    const buyer = api.addFigure({ panel: 'bottom', easing: 'snappy' });
    const candle = api.addCandle({ panel: 'top', x: 0.72, z: 0.05, accent: CANDLE_RED });
    const stack = api.addCoinStack({
      panel: 'bottom',
      x: 0.78,
      z: 0.02,
      color: GOLD,
      coinHeight: 0.068,
      coinRadius: 0.168,
    });

    // One reused flyer coin (deterministic; seek() can jump)
    const flyer = api.THREE ? null : null;
    const coinMesh = (() => {
      const THREE = api.THREE;
      const geo = new THREE.CylinderGeometry(0.168, 0.168, 0.068, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: GOLD, roughness: 0.28, metalness: 0.82,
        emissive: GOLD, emissiveIntensity: 0.18,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.visible = false;
      api.panels.bottom.root.add(mesh);
      return mesh;
    })();

    chaser.setPosition(-1.05, 0, 0);
    buyer.setPosition(-1.05, 0, 0);

    const smooth = chaser.ease;
    const snappy = buyer.ease;

    return function seek(t) {
      const yi = yearIndex(t);
      const yl = yearLocal(t);
      api.setLabel('top', 'CHASES PUMPS');
      api.setLabel('bottom', 'BUYS EVERY MONTH');
      api.setCounter('YEAR  ' + YEARS[yi]);

      // --- top: late jump onto a candle that already peaked ---
      candle.setHeight(candleHeight(yl));
      const jumpStart = 0.30;
      const jumpDur = 0.68;
      let jumpPhase = 0;
      if (yl > jumpStart) jumpPhase = smooth(clamp01((yl - jumpStart) / jumpDur));

      const yearsIn = yi + yl;
      const fatigue = clamp01(yearsIn / 7);
      if (t < YEAR0) {
        const idle = chaser.evaluate('idle', t * 0.4);
        idle.yaw = Math.PI / 2;
        chaser.setPose(idle);
        chaser.setPosition(-1.05, 0, 0);
      } else if (yl < 0.98) {
        const jp = chaser.evaluate('jump', jumpPhase);
        // lean their landing more desperate as years pass
        jp.torsoBend += fatigue * 0.15;
        jp.headNod += fatigue * 0.12;
        // keep them facing +X (profile, toward the candle)
        jp.yaw = Math.PI / 2;
        chaser.setPose(jp);
        // slide slightly toward the candle during the late jump
        const x = lerp(-1.05, -0.35, jumpPhase * 0.85);
        chaser.setPosition(x, 0, 0);
      } else {
        const slump = chaser.evaluate('slump', 0, 0.25 + fatigue * 0.6);
        slump.yaw = Math.PI / 2;
        chaser.setPose(slump);
        chaser.setPosition(-0.45, 0, 0);
      }
      if (t >= YEAR0 + 6 * YEAR_LEN + YEAR_LEN * 0.92) {
        const slump = chaser.evaluate('slump', 0, 0.92);
        slump.yaw = Math.PI / 2;
        chaser.setPose(slump);
        chaser.setPosition(-0.4, 0, 0);
      }

      // --- bottom: snappy monthly toss into a growing gold tower ---
      const toss = activeToss(t);
      const idleP = buyer.evaluate('idle', t * 0.7);
      idleP.yaw = Math.PI / 2;
      if (toss) {
        const tp = buyer.evaluate('toss', snappy(toss.phase));
        tp.yaw = Math.PI / 2;
        buyer.setPose(tp);
      } else {
        buyer.setPose(idleP);
      }
      buyer.setPosition(-1.05, 0, 0);

      const nLanded = landedCoins(t);
      stack.setCount(nLanded);

      const flight = activeFlight(t);
      if (flight) {
        const from = new THREE.Vector3(-0.62, 1.28, 0.08);
        const toY = 0.034 + nLanded * 0.068;
        const to = new THREE.Vector3(0.78, toY, 0.02);
        const u = flight.u;
        coinMesh.visible = true;
        coinMesh.position.lerpVectors(from, to, u);
        coinMesh.position.y += Math.sin(u * Math.PI) * 0.58;
        coinMesh.rotation.x = u * Math.PI * 1.7;
        coinMesh.rotation.z = u * 0.6;
      } else {
        coinMesh.visible = false;
      }

      // punchline at ~9s, optional in the grammar, used here
      const punch = windowT(t, 9.0, 0.45);
      api.setPunchline('SAME MARKET. DIFFERENT RESULT.', punch);
      if (punch > 0.22) api.setLabel('top', '');

      // clear final hold, then fade to black — no loop
      if (t >= 11.05) api.setFade(clamp01((t - 11.05) / 0.9));
      else api.setFade(0);
    };
  },
};

export default script;

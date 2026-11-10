import { lerp, lerpPose } from './easing.js';

const DEFAULTS = {
  headR: 0.32,
  torsoLen: 0.62,
  torsoR: 0.215,
  neck: 0.03,
  upperArm: 0.42,
  lowerArm: 0.40,
  armR: 0.092,
  upperLeg: 0.50,
  lowerLeg: 0.48,
  legR: 0.10,
  hipSep: 0.10,
  shoulderSep: 0.22,
};

function restPose() {
  return {
    hipY: 0.94,
    airborne: 0,
    crouch: 0,
    yaw: 0,
    torsoBend: 0.04,
    torsoSide: 0,
    torsoTwist: 0,
    headNod: 0,
    headYaw: 0,
    headTilt: 0,
    lArm: { fwd: 0.05, out: 0.18, bend: 0.18 },
    rArm: { fwd: 0.05, out: 0.18, bend: 0.18 },
    lLeg: { fwd: 0.04, out: 0.04, bend: 0.16 },
    rLeg: { fwd: -0.02, out: 0.04, bend: 0.16 },
  };
}

export function namedPose(name, phase = 0, amp = 1) {
  const p = restPose();
  const t = phase;
  if (name === 'idle') {
    const wob = Math.sin(t * Math.PI * 2) * 0.01;
    p.hipY += wob;
    p.lArm.fwd += wob;
    p.rArm.fwd -= wob;
    return p;
  }
  if (name === 'walk' || name === 'run') {
    const k = name === 'run' ? 1.45 : 1;
    const swing = Math.sin(t * Math.PI * 2);
    const lift = Math.sin(t * Math.PI * 2);
    p.lLeg.fwd = swing * 0.55 * k;
    p.rLeg.fwd = -swing * 0.55 * k;
    p.lLeg.bend = 0.16 + Math.max(0, -swing) * 0.55 * k;
    p.rLeg.bend = 0.16 + Math.max(0, swing) * 0.55 * k;
    p.lArm.fwd = -swing * 0.5 * k;
    p.rArm.fwd = swing * 0.5 * k;
    p.lArm.bend = 0.25 * k;
    p.rArm.bend = 0.25 * k;
    p.torsoBend = name === 'run' ? 0.22 : 0.08;
    p.hipY += Math.abs(lift) * 0.035 * k;
    p.airborne = name === 'run' ? Math.max(0, Math.abs(swing) - 0.7) * 0.06 : 0;
    return p;
  }
  if (name === 'jump') {
    // 0-0.18 crouch, 0.18-0.4 launch, 0.4-0.75 hang, 0.75-1 land
    if (t < 0.18) {
      const u = t / 0.18;
      p.crouch = u;
      p.lLeg.bend = 0.16 + u * 1.05;
      p.rLeg.bend = 0.16 + u * 1.05;
      p.hipY = 0.94 - u * 0.22;
      p.lArm.fwd = -0.3 * u;
      p.rArm.fwd = -0.35 * u;
      p.torsoBend = 0.15 + u * 0.25;
    } else if (t < 0.4) {
      const u = (t - 0.18) / 0.22;
      p.lLeg.bend = 1.21 * (1 - u) + 0.1 * u;
      p.rLeg.bend = 1.21 * (1 - u) + 0.1 * u;
      p.airborne = u * 0.38;
      p.hipY = 0.72 + u * 0.28;
      p.lArm.fwd = lerp(-0.3, 0.85, u);
      p.rArm.fwd = lerp(-0.35, 0.9, u);
      p.lArm.out = 0.18 + u * 0.15;
      p.rArm.out = 0.18 + u * 0.15;
      p.torsoBend = lerp(0.4, -0.05, u);
    } else if (t < 0.75) {
      const u = (t - 0.4) / 0.35;
      p.airborne = 0.38 - u * 0.10;
      p.hipY = 1.00 - u * 0.08;
      p.lLeg.fwd = 0.25;
      p.rLeg.fwd = -0.05;
      p.lLeg.bend = 0.35 + u * 0.2;
      p.rLeg.bend = 0.2;
      p.lArm.fwd = 0.7;
      p.rArm.fwd = 0.55;
      p.torsoBend = 0.05;
    } else {
      const u = (t - 0.75) / 0.25;
      p.airborne = Math.max(0, 0.28 - u * 0.28);
      p.hipY = lerp(0.92, 0.82, u);
      p.lLeg.bend = lerp(0.55, 0.7, u);
      p.rLeg.bend = lerp(0.2, 0.65, u);
      p.lArm.fwd = lerp(0.7, 0.15, u);
      p.rArm.fwd = lerp(0.55, 0.1, u);
      p.torsoBend = 0.05 + u * 0.2;
      p.crouch = u * 0.4;
    }
    return p;
  }
  if (name === 'hammer') {
    const up = t < 0.45 ? t / 0.45 : 1 - (t - 0.45) / 0.55;
    const slam = t < 0.45 ? 0 : (t - 0.45) / 0.55;
    p.rArm.fwd = lerp(-0.2, 1.4, t < 0.45 ? t / 0.45 : 1 - slam * 1.6);
    p.rArm.bend = lerp(0.4, 0.05, slam);
    p.lArm.fwd = 0.2;
    p.torsoBend = 0.1 + slam * 0.25;
    p.hipY = 0.94 - slam * 0.06;
    return p;
  }
  if (name === 'slump') {
    const a = amp;
    p.torsoBend = 0.85 * a;
    p.headNod = 0.55 * a;
    p.lArm.fwd = 0.15;
    p.rArm.fwd = 0.2;
    p.lArm.bend = 0.15 + 0.25 * a;
    p.rArm.bend = 0.15 + 0.3 * a;
    p.lLeg.bend = 0.16 + 0.55 * a;
    p.rLeg.bend = 0.16 + 0.5 * a;
    p.hipY = 0.94 - 0.2 * a;
    p.lArm.out = 0.12;
    p.rArm.out = 0.12;
    return p;
  }
  if (name === 'look') {
    p.headYaw = phase;
    p.headNod = amp;
    return p;
  }
  if (name === 'toss') {
    if (t < 0.35) {
      const u = t / 0.35;
      p.rArm.fwd = lerp(0.05, -0.55, u);
      p.rArm.out = 0.22;
      p.rArm.bend = 0.35;
      p.torsoTwist = -0.15 * u;
      p.torsoBend = 0.08;
    } else if (t < 0.58) {
      const u = (t - 0.35) / 0.23;
      p.rArm.fwd = lerp(-0.55, 1.05, u);
      p.rArm.out = lerp(0.22, 0.35, u);
      p.rArm.bend = lerp(0.35, 0.12, u);
      p.torsoTwist = lerp(-0.15, 0.12, u);
      p.torsoBend = 0.04;
    } else {
      const u = (t - 0.58) / 0.42;
      p.rArm.fwd = lerp(1.05, 0.05, u);
      p.rArm.out = lerp(0.35, 0.18, u);
      p.rArm.bend = lerp(0.12, 0.18, u);
      p.torsoTwist = lerp(0.12, 0, u);
    }
    return p;
  }
  return p;
}

function matteMaterial(THREE, color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.62,
    metalness: 0,
    emissive: 0x000000,
    flatShading: false,
    ...opts,
  });
}

function makeTube(THREE, radius, mat) {
  const dummy = new THREE.TubeGeometry(new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.1, 0)
  ), 2, radius, 8, false);
  const mesh = new THREE.Mesh(dummy, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  return mesh;
}

function setTube(THREE, mesh, a, b, c, radius) {
  const pa = a.clone();
  const pb = b.clone();
  const pc = c.clone();
  if (pa.distanceTo(pc) < 0.04) pc.add(new THREE.Vector3(0, -0.05, 0));
  // keep mid from collapsing onto ends
  if (pa.distanceTo(pb) < 0.02) pb.lerpVectors(pa, pc, 0.5);
  const curve = new THREE.CatmullRomCurve3([pa, pb, pc]);
  curve.tension = 0.35;
  const geo = new THREE.TubeGeometry(curve, 18, radius, 10, false);
  if (mesh.geometry) mesh.geometry.dispose();
  mesh.geometry = geo;
}

function setCylinder(THREE, mesh, a, b, radius) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = Math.max(0.02, dir.length());
  const geo = new THREE.CylinderGeometry(radius, radius, len, 18);
  if (mesh.geometry) mesh.geometry.dispose();
  mesh.geometry = geo;
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
}

export function createFigure(THREE, options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  const color = options.color ?? 0xe6e6e6;
  const ghost = !!options.ghost;
  const mat = matteMaterial(THREE, color, {
    roughness: ghost ? 0.50 : 0.34,
    transparent: ghost,
    opacity: ghost ? 0.58 : 1,
    depthWrite: !ghost,
  });
  if (ghost) mat.color.setHex(0xc8c8c8);

  const group = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(cfg.headR, 28, 20), mat);
  head.castShadow = !ghost;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(cfg.torsoR, cfg.torsoR, cfg.torsoLen, 18), mat);
  torso.castShadow = !ghost;
  const lArm = makeTube(THREE, cfg.armR, mat);
  const rArm = makeTube(THREE, cfg.armR, mat);
  const lLeg = makeTube(THREE, cfg.legR, mat);
  const rLeg = makeTube(THREE, cfg.legR, mat);
  group.add(head, torso, lArm, rArm, lLeg, rLeg);

  const inner = new THREE.Group();
  inner.add(group);

  const root = new THREE.Group();
  root.add(inner);

  let pose = restPose();

  function apply(p) {
    pose = p;
    const hipY = p.hipY + (p.airborne || 0);
    const hips = new THREE.Vector3(0, hipY, 0);

    const torsoDir = new THREE.Vector3(0, 1, 0);
    torsoDir.applyEuler(new THREE.Euler(p.torsoBend, p.torsoTwist, p.torsoSide, 'YXZ'));
    const shoulderC = hips.clone().addScaledVector(torsoDir, cfg.torsoLen);
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(new THREE.Euler(0, p.torsoTwist + p.yaw, 0, 'YXZ'));
    // local right without extra yaw — figure group itself is rotated
    const localRight = new THREE.Vector3(1, 0, 0).applyEuler(
      new THREE.Euler(p.torsoBend * 0.15, p.torsoTwist, p.torsoSide, 'YXZ')
    );

    const lShoulder = shoulderC.clone().addScaledVector(localRight, -cfg.shoulderSep);
    const rShoulder = shoulderC.clone().addScaledVector(localRight, cfg.shoulderSep);
    const lHip = hips.clone().add(new THREE.Vector3(-cfg.hipSep, 0.02, 0.03));
    const rHip = hips.clone().add(new THREE.Vector3(cfg.hipSep, 0.02, 0.03));

    function armPoints(shoulder, arm, side) {
      const upper = new THREE.Vector3(0, -1, 0);
      upper.applyEuler(new THREE.Euler(-arm.fwd, 0, arm.out * side, 'XYZ'));
      const elbow = shoulder.clone().addScaledVector(upper, cfg.upperArm);
      const lower = new THREE.Vector3(0, -1, 0);
      lower.applyEuler(new THREE.Euler(-arm.fwd - arm.bend, 0, arm.out * side * 0.7, 'XYZ'));
      const wrist = elbow.clone().addScaledVector(lower, cfg.lowerArm);
      return [shoulder, elbow, wrist];
    }
    function legPoints(hip, leg, side) {
      const thigh = new THREE.Vector3(0, -1, 0);
      thigh.applyEuler(new THREE.Euler(-leg.fwd, 0, -leg.out * side, 'XYZ'));
      const knee = hip.clone().addScaledVector(thigh, cfg.upperLeg);
      const shin = new THREE.Vector3(0, -1, 0);
      shin.applyEuler(new THREE.Euler(-leg.fwd + leg.bend, 0, -leg.out * side * 0.4, 'XYZ'));
      const ankle = knee.clone().addScaledVector(shin, cfg.lowerLeg);
      return [hip, knee, ankle];
    }

    const [ls, le, lw] = armPoints(lShoulder, p.lArm, -1);
    const [rs, re, rw] = armPoints(rShoulder, p.rArm, 1);
    const [lh, lk, la] = legPoints(lHip, p.lLeg, -1);
    const [rh, rk, ra] = legPoints(rHip, p.rLeg, 1);

    setTube(THREE, lArm, ls, le, lw, cfg.armR);
    setTube(THREE, rArm, rs, re, rw, cfg.armR);
    setTube(THREE, lLeg, lh, lk, la, cfg.legR);
    setTube(THREE, rLeg, rh, rk, ra, cfg.legR);
    const overlap = 0.08 + Math.abs(p.torsoBend) * 0.16 + (p.crouch || 0) * 0.06;
    const torsoBase = hips.clone().addScaledVector(torsoDir, -overlap);
    setCylinder(THREE, torso, torsoBase, shoulderC, cfg.torsoR);

    const headDir = torsoDir.clone();
    headDir.applyEuler(new THREE.Euler(p.headNod, p.headYaw, p.headTilt, 'YXZ'));
    head.position.copy(shoulderC).addScaledVector(headDir, cfg.neck + cfg.headR);
    inner.rotation.y = p.yaw;
  }

  apply(pose);

  return {
    root,
    inner,
    group,
    cfg,
    get pose() { return pose; },
    restPose,
    setPose(p) { apply(p); },
    mixPose(a, b, t) { apply(lerpPose(a, b, t)); },
    evaluate(name, phase = 0, amp = 1) { return namedPose(name, phase, amp); },
    applyNamed(name, phase = 0, amp = 1) { apply(namedPose(name, phase, amp)); },
    setPosition(x, y, z) { root.position.set(x, y, z); },
    setFacing(yaw) { /* baked into pose.yaw so reflections stay consistent */ },
    height() {
      return pose.hipY + cfg.torsoLen + cfg.neck + cfg.headR * 2;
    },
  };
}

export { restPose, DEFAULTS };

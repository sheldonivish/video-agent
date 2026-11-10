/** Wireframe glowing props, liquid fill, coin stack, candles. */

export function createCoin(THREE, options = {}) {
  const r = options.radius ?? 0.16;
  const h = options.height ?? 0.075;
  const color = options.color ?? 0xe3b322;
  const geo = new THREE.CylinderGeometry(r, r, h, 24);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.82,
    emissive: color,
    emissiveIntensity: 0.18,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return { mesh, height: h, radius: r };
}

export function createCoinStack(THREE, options = {}) {
  const group = new THREE.Group();
  const color = options.color ?? 0xe3b322;
  const coinH = options.coinHeight ?? 0.075;
  const coinR = options.coinRadius ?? 0.165;
  const coins = [];
  const flying = []; // {mesh, from, to, t}

  function ensure(n) {
    while (coins.length < n) {
      const c = createCoin(THREE, { color, height: coinH, radius: coinR });
      c.mesh.position.y = coinH * 0.5 + coins.length * coinH;
      // tiny irregularity so it doesn't look like one extruded cylinder
      c.mesh.rotation.y = (coins.length * 0.37) % Math.PI;
      c.mesh.position.x = ((coins.length * 17) % 5 - 2) * 0.006;
      c.mesh.position.z = ((coins.length * 13) % 5 - 2) * 0.006;
      group.add(c.mesh);
      coins.push(c);
    }
    for (let i = 0; i < coins.length; i++) {
      coins[i].mesh.visible = i < n;
    }
  }

  function setCount(n) { ensure(Math.max(0, Math.floor(n))); }

  function heightOf(n) { return Math.max(0, n) * coinH; }

  return {
    group,
    setCount,
    count: () => coins.filter((c) => c.mesh.visible).length,
    heightOf,
    coinH,
  };
}

export function createCandle(THREE, options = {}) {
  const group = new THREE.Group();
  const accent = options.accent ?? 0x6e2c2c;
  const wick = new THREE.Mesh(
    new THREE.BoxGeometry(0.028, 0.28, 0.028),
    new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.45, metalness: 0.15 })
  );
  const bodyMat = new THREE.MeshStandardMaterial({
    color: accent,
    roughness: 0.5,
    metalness: 0.08,
    emissive: accent,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 0.78,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1, 0.14), bodyMat);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.18, 1, 0.14)),
    new THREE.LineBasicMaterial({ color: 0xe8e8e8, transparent: true, opacity: 0.85 })
  );
  const holder = new THREE.Group();
  holder.add(body, edges);
  group.add(holder, wick);
  group.userData.body = body;
  group.userData.edges = edges;
  group.userData.wick = wick;
  group.userData.holder = holder;

  function setHeight(h) {
    const height = Math.max(0.02, h);
    holder.scale.y = height;
    holder.position.y = height * 0.5;
    wick.position.y = height + 0.1;
    wick.scale.y = 0.6 + Math.min(0.8, height * 0.15);
  }
  setHeight(0.15);

  return { group, setHeight };
}

/** A wireframe prop that fills from the bottom like liquid (house, vault, bar). */
export function createLiquidFill(THREE, options = {}) {
  const w = options.width ?? 1.2;
  const h = options.height ?? 1.6;
  const d = options.depth ?? 0.8;
  const color = options.color ?? 0xe3b322;
  const group = new THREE.Group();

  const shellGeo = new THREE.BoxGeometry(w, h, d);
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: 0xcecece, transparent: true, opacity: 0.75 })
  );
  shell.position.y = h / 2;
  group.add(shell);

  const fillMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.35,
    emissive: color,
    emissiveIntensity: 0.22,
    transparent: true,
    opacity: 0.85,
  });
  const fill = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 1, d * 0.92), fillMat);
  group.add(fill);

  function setFill(amount) {
    const a = Math.max(0, Math.min(1, amount));
    const fh = Math.max(0.001, a * h);
    fill.scale.y = fh;
    fill.position.y = fh / 2;
    fill.visible = a > 0.002;
  }
  setFill(0);

  return { group, setFill, height: h };
}

export function createWireProp(THREE, kind = 'box', options = {}) {
  const color = options.lineColor ?? 0xcfcfcf;
  let geo;
  if (kind === 'house') {
    // simple gabled house outline built from a box + roof
    const g = new THREE.Group();
    const body = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 1.2, 1.1)),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
    );
    body.position.y = 0.6;
    const roof = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.ConeGeometry(1.25, 0.7, 4)),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
    );
    roof.position.y = 1.55;
    roof.rotation.y = Math.PI / 4;
    g.add(body, roof);
    return { group: g };
  }
  geo = new THREE.BoxGeometry(1, 1, 1);
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
  );
  const group = new THREE.Group();
  group.add(lines);
  return { group };
}

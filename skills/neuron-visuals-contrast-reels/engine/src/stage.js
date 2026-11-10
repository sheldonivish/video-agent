/** Black void, top-down spot, soft contact shadows, high-gloss mirror floor fading to black, vignette. */

export function createStage(THREE, options = {}) {
  const group = new THREE.Group();
  const width = options.width ?? 28;
  const depth = options.depth ?? 18;

  // High-gloss floor. Slightly transparent so a y-flipped reflection group shows through.
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floorMat = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    roughness: 0.12,
    metalness: 0.72,
    transparent: true,
    opacity: 0.42,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  // Visible shelf edge (Luxury-vs-Assets ground line) — horizontal, not a perspective quad edge
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(10.5, 0.025, 1.6),
    new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0a, roughness: 0.18, metalness: 0.65,
      transparent: true, opacity: 0.85,
    })
  );
  shelf.position.set(0, -0.012, 0.15);
  shelf.receiveShadow = true;
  group.add(shelf);


  // Opaque black under-plane so the void stays #000 past the fade
  const under = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 2.4, depth * 2.2),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  under.rotation.x = -Math.PI / 2;
  under.position.y = -1.35;
  group.add(under);

  // Gradient fade: black at the near/far edges of the floor so the reflection dies out
  const fadeCanvas = options._fadeTex;
  const fade = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  );
  fade.rotation.x = -Math.PI / 2;
  fade.position.y = 0.002;
  group.add(fade);

  const fadeDeep = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.62, depthWrite: false })
  );
  fadeDeep.rotation.x = -Math.PI / 2;
  fadeDeep.position.y = -0.78;
  group.add(fadeDeep);


  // Top-down spotlight
  const spot = new THREE.SpotLight(0xffffff, 125, 24, 0.48, 0.62, 1.05);
  spot.position.set(0.12, 9.2, 1.55);
  spot.target.position.set(0.2, 0, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.00025;
  spot.shadow.normalBias = 0.02;
  spot.shadow.camera.near = 1;
  spot.shadow.camera.far = 16;
  group.add(spot, spot.target);

  const fill = new THREE.DirectionalLight(0xffffff, 0.42);
  fill.position.set(0.35, 5.2, 5.8);
  group.add(fill);

  const hemi = new THREE.HemisphereLight(0x888888, 0x000000, 0.32);
  group.add(hemi);

  // Soft disc contact shadow that rides under a figure (caller can move it)
  function makeContactShadow() {
    const g = new THREE.CircleGeometry(0.42, 24);
    const m = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.004;
    group.add(mesh);
    return mesh;
  }

  return {
    group,
    floor,
    spot,
    makeContactShadow,
    width,
    depth,
  };
}

export function createCamera(THREE, layout = 'top-bottom', options = {}) {
  const originY = options.originY ?? 0;
  const cam = new THREE.PerspectiveCamera(30, 1080 / 960, 0.1, 50);
  // Slight 3/4, pulled back so the mirror floor sits in the foreground
  cam.position.set(0.12, originY + 1.18, 9.2);
  cam.lookAt(0.12, originY + 0.82, 0);
  cam.userData.layout = layout;
  return cam;
}

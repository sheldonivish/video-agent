import { createFigure } from './figure.js';
import { createStage, createCamera } from './stage.js';
import { createCoinStack, createCandle, createLiquidFill, createWireProp, createCoin } from './props.js';
import { getEasing, lerp, windowT, clamp01 } from './easing.js';

export { getEasing, lerp, windowT, clamp01, createFigure, createStage, createCoinStack, createCandle, createLiquidFill, createWireProp };

export async function createApp(THREE, canvas, script = {}) {
  const W = 1080;
  const H = 1920;
  const layout = script.layout || 'top-bottom';

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  function makePanel(name, offsetY) {
    const root = new THREE.Group();
    root.position.y = offsetY;
    const stage = createStage(THREE);
    root.add(stage.group);
    const reflect = new THREE.Group();
    reflect.scale.y = -1;
    reflect.position.y = -0.001;
    root.add(reflect);
    const cam = createCamera(THREE, layout, { originY: offsetY });
    scene.add(root);
    return { name, root, stage, reflect, cam, figures: [], shadows: [] };
  }

  // Separate worlds so lights/shadows don't leak
  const panelTop = makePanel('top', 0);
  const panelBottom = makePanel('bottom', -30);
  const panelLeft = panelTop;
  const panelRight = panelBottom;

  const panels = layout === 'left-right'
    ? { left: panelLeft, right: panelRight, top: panelTop, bottom: panelBottom }
    : { top: panelTop, bottom: panelBottom, left: panelLeft, right: panelRight };

  function panelOf(name) {
    return panels[name] || panels.top;
  }

  function addFigure(opts = {}) {
    const p = panelOf(opts.panel || 'top');
    const fig = createFigure(THREE, { color: 0xf7f7f7 });
    const ghost = createFigure(THREE, { color: 0x8a8a8a, ghost: true });
    p.root.add(fig.root);
    p.reflect.add(ghost.root);
    const shadow = p.stage.makeContactShadow();
    p.figures.push({ fig, ghost, shadow, easing: opts.easing || 'smooth' });

    const api = {
      fig,
      easing: opts.easing || 'smooth',
      setPosition(x, y, z) {
        fig.root.position.set(x, y, z);
        ghost.root.position.set(x, y, z);
        shadow.position.x = x;
        shadow.position.z = z;
      },
      setPose(pose) {
        fig.setPose(pose);
        ghost.setPose(pose);
      },
      applyNamed(name, phase = 0, amp = 1) {
        const pose = fig.evaluate(name, phase, amp);
        fig.setPose(pose);
        ghost.setPose(pose);
      },
      evaluate: fig.evaluate,
      ease: getEasing(opts.easing || 'smooth'),
    };
    return api;
  }

  function addCoinStack(opts = {}) {
    const p = panelOf(opts.panel || 'bottom');
    const stack = createCoinStack(THREE, opts);
    p.root.add(stack.group);
    const ghost = createCoinStack(THREE, { ...opts });
    // darker reflection
    ghost.group.traverse((o) => {
      if (o.material) {
        o.material = o.material.clone();
        o.material.transparent = true;
        o.material.opacity = 0.42;
        o.material.roughness = 0.55;
      }
    });
    p.reflect.add(ghost.group);
    stack.group.position.set(opts.x || 0, 0, opts.z || 0);
    ghost.group.position.set(opts.x || 0, 0, opts.z || 0);
    const orig = stack.setCount;
    stack.setCount = (n) => { orig(n); ghost.setCount(n); };
    return stack;
  }

  function addCandle(opts = {}) {
    const p = panelOf(opts.panel || 'top');
    const c = createCandle(THREE, opts);
    p.root.add(c.group);
    c.group.position.set(opts.x || 0, 0, opts.z || 0);
    const orig = c.setHeight;
    c.setHeight = (h) => orig(h);
    return c;
  }

  function addLiquidFill(opts = {}) {
    const p = panelOf(opts.panel || 'bottom');
    const lf = createLiquidFill(THREE, opts);
    p.root.add(lf.group);
    lf.group.position.set(opts.x || 0, 0, opts.z || 0);
    return lf;
  }

  function addWireProp(kind, opts = {}) {
    const p = panelOf(opts.panel || 'top');
    const prop = createWireProp(THREE, kind, opts);
    p.root.add(prop.group);
    prop.group.position.set(opts.x || 0, 0, opts.z || 0);
    return prop;
  }

  // Flying coin helper used by tosses
  const flyers = [];
  function flyCoin(opts) {
    const p = panelOf(opts.panel || 'bottom');
    const coin = createCoin(THREE, { color: opts.color ?? 0xe3b322 });
    p.root.add(coin.mesh);
    flyers.push({
      mesh: coin.mesh,
      from: opts.from.clone(),
      to: opts.to.clone(),
      start: opts.start,
      dur: opts.dur ?? 0.28,
      dead: false,
    });
    return coin;
  }

  function updateFlyers(t) {
    for (const f of flyers) {
      if (f.dead) continue;
      const u = clamp01((t - f.start) / f.dur);
      if (u <= 0) { f.mesh.visible = false; continue; }
      f.mesh.visible = true;
      const yArc = Math.sin(u * Math.PI) * 0.55;
      f.mesh.position.lerpVectors(f.from, f.to, u);
      f.mesh.position.y += yArc;
      f.mesh.rotation.x = u * Math.PI * 1.6;
      if (u >= 1) {
        f.dead = true;
        f.mesh.visible = false;
        if (f.mesh.parent) f.mesh.parent.remove(f.mesh);
      }
    }
  }

  const overlay = {
    topLabel: script.labels?.top || '',
    bottomLabel: script.labels?.bottom || '',
    leftLabel: script.labels?.left || '',
    rightLabel: script.labels?.right || '',
    counter: '',
    punchline: '',
    punchlineOpacity: 0,
    fade: 0,
  };

  function renderLayout() {
    renderer.setScissorTest(true);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    if (layout === 'left-right') {
      renderer.setViewport(0, 0, 540, 1920);
      renderer.setScissor(0, 0, 540, 1920);
      panelLeft.cam.aspect = 540 / 1920;
      panelLeft.cam.updateProjectionMatrix();
      renderer.render(scene, panelLeft.cam);
      renderer.setViewport(540, 0, 540, 1920);
      renderer.setScissor(540, 0, 540, 1920);
      panelRight.cam.aspect = 540 / 1920;
      panelRight.cam.updateProjectionMatrix();
      renderer.render(scene, panelRight.cam);
    } else {
      // top half of screen = higher viewport y in WebGL
      renderer.setViewport(0, 960, 1080, 960);
      renderer.setScissor(0, 960, 1080, 960);
      panelTop.cam.aspect = 1080 / 960;
      panelTop.cam.updateProjectionMatrix();
      renderer.render(scene, panelTop.cam);
      renderer.setViewport(0, 0, 1080, 960);
      renderer.setScissor(0, 0, 1080, 960);
      panelBottom.cam.aspect = 1080 / 960;
      panelBottom.cam.updateProjectionMatrix();
      renderer.render(scene, panelBottom.cam);
    }
    renderer.setScissorTest(false);
  }

  const api = {
    THREE,
    layout,
    addFigure,
    addCoinStack,
    addCandle,
    addLiquidFill,
    addWireProp,
    flyCoin,
    updateFlyers,
    overlay,
    panels,
    renderer,
    render: renderLayout,
    setLabel(which, text) { overlay[which + 'Label'] = text; },
    setCounter(text) { overlay.counter = text; },
    setPunchline(text, opacity = 1) {
      overlay.punchline = text;
      overlay.punchlineOpacity = opacity;
    },
    setFade(v) { overlay.fade = clamp01(v); },
  };

  let seeker = null;
  if (typeof script.build === 'function') {
    seeker = script.build(api);
  }

  function applyOverlayDOM() {
    const set = (id, value, prop = 'textContent') => {
      const el = document.getElementById(id);
      if (!el) return;
      if (prop === 'textContent') el.textContent = value ?? '';
      else el.style[prop] = value;
    };
    set('label-top', overlay.topLabel);
    set('label-bottom', overlay.bottomLabel);
    set('label-left', overlay.leftLabel);
    set('label-right', overlay.rightLabel);
    set('counter', overlay.counter);
    const counterWrap = document.getElementById('counter-wrap');
    if (counterWrap) counterWrap.style.opacity = overlay.counter ? '1' : '0';
    set('punchline', overlay.punchline);
    const punch = document.getElementById('punchline');
    if (punch) punch.style.opacity = String(overlay.punchlineOpacity || 0);
    const fade = document.getElementById('fade');
    if (fade) fade.style.opacity = String(overlay.fade || 0);
    document.body.className = 'layout-' + layout;
  }

  const info = {
    fps: script.fps || 30,
    duration: script.duration || 12,
    layout,
  };

  function seek(frame) {
    const t = frame / info.fps;
    if (typeof seeker === 'function') seeker(t, frame, api);
    updateFlyers(t);
    renderLayout();
    applyOverlayDOM();
  }

  return { seek, info, api, render: renderLayout };
}

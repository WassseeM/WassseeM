/* ==========================================================================
   THREE.JS — GLOWING CODE SPHERE (DEVELOPER ARTIFACT)
   A neon "code globe": floating syntax tokens orbit a glowing wireframe
   planet core. Built with pure emissive materials (zero lights) and
   auto-optimized per device for buttery-smooth mobile performance.
   ========================================================================== */

class DeveloperCodeSphere {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.isMobile = window.innerWidth < 768;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Independent groups: tilt (mouse + drag) vs. spin (continuous rotation)
    this.tiltGroup = null;
    this.spinGroup = null;

    // 3D Components
    this.coreGlow = null;
    this.coreWire = null;
    this.sphereMesh = null;
    this.rings = [];
    this.nodes = null;
    this.tokens = [];

    // Physics & Interaction (Smooth lerp momentum)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.dragRotation = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevTouch = { x: 0, y: 0 };
    this.pulseEnergy = 0;
    this.isVisible = true;
    this.isTabActive = true;

    // Frame limiter + adaptive performance governor
    this.clock = new THREE.Clock();
    this.lastRender = 0;
    this.baseTarget = this.isMobile ? 30 : 60;
    this.maxTier = 2;
    this.tier = this.maxTier;
    this.targetInterval = 1000 / this.baseTarget;
    this.perfFrames = 0;
    this.perfTime = 0;
    this.totalTime = 0;
    this.badWindows = 0;
    this.goodWindows = 0;
    this.lastRaf = 0;
    this.calibrated = false;

    // Floating syntax tokens for the code globe
    this.tokenLabels = [
      '</>', '{ }', '( )', '=>', '[ ]', ';', '&&', '||',
      '0x1F', 'fn()', 'int', 'var', 'if', 'for', '++', '#',
      'git', 'npm', 'py', 'js', 'null', 'void', 'async', 'await',
      'return', 'class', 'new', '<div>', '0x00', '<='
    ];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 520;

    // Camera perspective (z is set by fitCamera so the artifact always fits)
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    this.fitRadius = 2.7;
    this.fitCamera();

    // Locked pixel ratio on mobile to eliminate GPU thermal load / micro-stutter
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hero-3d-canvas'),
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: this.isMobile ? 'default' : 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(width, height);
    this.applyTier();

    this.tiltGroup = new THREE.Group();
    this.spinGroup = new THREE.Group();
    this.tiltGroup.add(this.spinGroup);
    this.scene.add(this.tiltGroup);

    this.bindEvents();

    // Wait for the mono font so the code tokens render crisp (with a safety timeout)
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      this.buildScene();
      this.animate();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
      setTimeout(start, 1200);
    } else {
      start();
    }
  }

  // --- Pull the camera back just enough so the whole sphere always fits ------
  fitCamera() {
    if (!this.camera) return;
    const halfFov = (this.camera.fov * Math.PI) / 180 / 2;
    const half = this.fitRadius * 1.05;
    const zVertical = half / Math.tan(halfFov);
    const zHorizontal = half / (Math.tan(halfFov) * this.camera.aspect);
    this.camera.position.set(0, 0, Math.max(zVertical, zHorizontal));
  }

  // --- Apply the current quality tier (adaptive performance) ----------------
  applyTier() {
    if (!this.renderer) return;
    const nativeDpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.0 : 1.5);

    let ratio, fps;
    if (this.tier >= 2) {
      ratio = nativeDpr;
      fps = this.baseTarget;
    } else if (this.tier === 1) {
      ratio = Math.min(nativeDpr, this.isMobile ? 0.9 : 1.0);
      fps = this.isMobile ? 30 : 45;
    } else {
      ratio = this.isMobile ? 0.75 : 0.85;
      fps = 30;
    }

    this.renderer.setPixelRatio(ratio);
    this.targetInterval = 1000 / fps;
    if (this.nodes) this.nodes.visible = this.tier > 0;
  }

  // --- Watch real frame pacing and adjust quality so it never lags ----------
  evaluatePerformance(fps) {
    const target = this.baseTarget;

    // One-time calibration: match high-refresh desktop displays (up to 120Hz)
    if (!this.calibrated) {
      this.calibrated = true;
      if (!this.isMobile && fps > 75) {
        const refresh = Math.min(120, Math.max(60, Math.round(fps / 10) * 10));
        if (refresh > this.baseTarget) {
          this.baseTarget = refresh;
          this.applyTier();
        }
      }
    }

    if (fps < target * 0.65) {
      this.goodWindows = 0;
      this.badWindows++;
      if (this.badWindows >= 2 && this.tier > 0) {
        this.tier--;
        this.applyTier();
        this.badWindows = 0;
      }
    } else if (fps > target * 0.92) {
      this.badWindows = 0;
      this.goodWindows++;
      if (this.goodWindows >= 4 && this.tier < this.maxTier) {
        this.tier++;
        this.applyTier();
        this.goodWindows = 0;
      }
    } else {
      this.badWindows = 0;
      this.goodWindows = 0;
    }
  }

  // --- Soft radial glow used as a luminous backdrop behind the sphere -------
  createGlowTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(0,255,136,0.55)');
    g.addColorStop(0.35, 'rgba(0,255,136,0.22)');
    g.addColorStop(0.7, 'rgba(0,255,136,0.07)');
    g.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }

  // --- Build a glowing text texture for a single code token -----------------
  createCodeTexture(text, color) {
    const dpr = 2;
    const fontSize = 46;
    const pad = 18;
    const fontFamily = '"JetBrains Mono", monospace';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    const textWidth = Math.ceil(ctx.measureText(text).width);

    canvas.width = (textWidth + pad * 2) * dpr;
    canvas.height = (fontSize + pad * 2) * dpr;

    ctx.scale(dpr, dpr);
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = (textWidth + pad * 2) / 2;
    const cy = (fontSize + pad * 2) / 2;

    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
    ctx.fillText(text, cx, cy);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    return { tex, aspect: canvas.width / canvas.height };
  }

  buildScene() {
    const isMobile = this.isMobile;

    // 0. Luminous halo behind the sphere so it never reads as a black blob
    this.halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.createGlowTexture(),
        transparent: true,
        opacity: isMobile ? 0.9 : 0.7,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.halo.scale.set(5.4, 5.4, 1);
    this.halo.renderOrder = -1;
    this.spinGroup.add(this.halo);

    // 1. Glowing wireframe "code globe"
    const sphereGeo = new THREE.SphereGeometry(
      1.6,
      isMobile ? 14 : 20,
      isMobile ? 10 : 14
    );
    const globeGeo = new THREE.WireframeGeometry(sphereGeo);
    const globeMat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: isMobile ? 0.42 : 0.3
    });
    this.sphereMesh = new THREE.LineSegments(globeGeo, globeMat);
    this.spinGroup.add(this.sphereMesh);

    // 2. Glowing energy core (soft additive shell + crisp wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(0.62, 1);
    this.coreGlow = new THREE.Mesh(
      coreGeo,
      new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: isMobile ? 0.28 : 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.spinGroup.add(this.coreGlow);

    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    this.coreWire = new THREE.LineSegments(
      coreEdges,
      new THREE.LineBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.85
      })
    );
    this.spinGroup.add(this.coreWire);

    // 3. Orbital gyroscope rings (emerald + platinum)
    const ringDefs = [
      { r: 2.3, t: 0.012, color: 0x00ff88, op: 0.5, rx: Math.PI / 3, ry: 0 },
      { r: 2.55, t: 0.01, color: 0xcbd5e1, op: 0.28, rx: 0, ry: Math.PI / 3.5 }
    ];
    ringDefs.forEach(def => {
      const g = new THREE.TorusGeometry(def.r, def.t, 6, isMobile ? 40 : 64);
      const m = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: def.op
      });
      const ring = new THREE.Mesh(g, m);
      ring.rotation.x = def.rx;
      ring.rotation.y = def.ry;
      this.rings.push(ring);
      this.spinGroup.add(ring);
    });

    // 4. Orbiting data nodes (binary dust on the globe shell)
    const nodeCount = isMobile ? 22 : 60;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const r = 1.9 + Math.random() * 0.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      nodePos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      nodePos[i * 3 + 1] = r * Math.cos(ph);
      nodePos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    this.nodes = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({
        color: 0x00ff88,
        size: isMobile ? 0.07 : 0.06,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );
    this.spinGroup.add(this.nodes);

    // 5. Floating code tokens around the globe (Fibonacci sphere distribution)
    const labels = isMobile
      ? this.tokenLabels.filter((_, i) => i % 2 === 0)
      : this.tokenLabels;
    const count = labels.length;
    const tokenH = isMobile ? 0.34 : 0.36;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const text = labels[i];
      const isAccent = i % 3 === 0;
      const color = isAccent ? '#00ff88' : '#e2e8f0';
      const { tex, aspect } = this.createCodeTexture(text, color);

      const material = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: isAccent ? 1.0 : 0.85,
        depthWrite: false,
        blending: isAccent ? THREE.AdditiveBlending : THREE.NormalBlending
      });
      const sprite = new THREE.Sprite(material);

      const h = tokenH * (0.85 + Math.random() * 0.4);
      sprite.scale.set(h * aspect, h, 1);

      // Even spherical distribution
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * goldenAngle;
      const dirX = Math.cos(theta) * radius;
      const dirZ = Math.sin(theta) * radius;

      const baseR = 1.95 + Math.random() * 0.35;
      sprite.position.set(dirX * baseR, y * baseR, dirZ * baseR);
      this.spinGroup.add(sprite);

      this.tokens.push({
        sprite,
        dirX,
        dirY: y,
        dirZ,
        baseR,
        phase: Math.random() * Math.PI * 2,
        bobAmp: 0.08 + Math.random() * 0.1
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Subtle mouse parallax on desktop
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = x * 0.28;
      this.mouse.targetY = y * 0.18;
    }, { passive: true });

    const canvas = this.renderer.domElement;

    // Desktop Mouse Drag
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevTouch = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevTouch.x;
        const dy = e.clientY - this.prevTouch.y;

        this.dragRotation.targetY += dx * 0.007;
        this.dragRotation.targetX = Math.max(-0.65, Math.min(0.65, this.dragRotation.targetX + dy * 0.007));

        this.prevTouch = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch Support for Mobile (horizontal drag rotate + vertical page scroll)
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchScroll = false;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        this.prevTouch = { x: touchStartX, y: touchStartY };
        this.isDragging = true;
        isTouchScroll = false;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const totalDx = Math.abs(currentX - touchStartX);
      const totalDy = Math.abs(currentY - touchStartY);

      // If user is scrolling vertically, yield to browser scrolling immediately
      if (!isTouchScroll && totalDy > totalDx && totalDy > 7) {
        isTouchScroll = true;
        this.isDragging = false;
        return;
      }

      if (isTouchScroll) return;

      const dx = currentX - this.prevTouch.x;
      const dy = currentY - this.prevTouch.y;

      this.dragRotation.targetY += dx * 0.008;
      this.dragRotation.targetX = Math.max(-0.65, Math.min(0.65, this.dragRotation.targetX + dy * 0.008));

      this.prevTouch = { x: currentX, y: currentY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      isTouchScroll = false;
    }, { passive: true });

    // Click / Tap to pulse energy
    canvas.addEventListener('click', () => {
      if (isTouchScroll) return;
      this.pulseEnergy = 0.8;
      if (window.showToast) {
        window.showToast("⚡ Ahmed Waseem: Code Sphere Pulse Active");
      }
    });

    // IntersectionObserver (sleeps when offscreen)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    observer.observe(this.container);

    // Sleep when tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
    });
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.fitCamera();

    this.renderer.setSize(width, height);
    this.applyTier();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const rafDelta = this.lastRaf ? Math.min(now - this.lastRaf, 100) : 16.7;
    this.lastRaf = now;

    if (!this.isVisible || !this.isTabActive) return;

    // Adaptive performance: sample real (native) frame pacing
    this.totalTime += rafDelta;
    this.perfFrames++;
    this.perfTime += rafDelta;
    if (this.perfTime >= 1000) {
      if (this.totalTime > 3000) {
        this.evaluatePerformance((this.perfFrames * 1000) / this.perfTime);
      }
      this.perfFrames = 0;
      this.perfTime = 0;
    }

    // Frame limiter: keeps weak devices cool without visible stutter
    if (this.lastRender && now - this.lastRender < this.targetInterval - 1) return;
    this.lastRender = now;

    const delta = Math.min(this.clock.getDelta(), 0.06);
    const time = this.clock.getElapsedTime();

    // Smooth Lerp on Mouse Tilt
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Smooth Lerp on User Drag Rotation (Inertia damping)
    this.dragRotation.x += (this.dragRotation.targetX - this.dragRotation.x) * 0.08;
    this.dragRotation.y += (this.dragRotation.targetY - this.dragRotation.y) * 0.08;

    // Apply combined tilt + user drag to tiltGroup
    this.tiltGroup.rotation.x = -this.mouse.y + this.dragRotation.x;
    this.tiltGroup.rotation.y = this.mouse.x + this.dragRotation.y;

    // Pulse decay
    if (this.pulseEnergy > 0) {
      this.pulseEnergy *= 0.93;
      if (this.pulseEnergy < 0.005) this.pulseEnergy = 0;
    }

    const speedMult = 1.0 + this.pulseEnergy * 2.2;

    // Continuous rotation
    this.spinGroup.rotation.y += 0.12 * delta * speedMult;
    this.sphereMesh.rotation.y -= 0.05 * delta * speedMult;
    this.coreWire.rotation.y -= 0.3 * delta * speedMult;
    this.coreWire.rotation.x += 0.16 * delta * speedMult;
    this.coreGlow.rotation.copy(this.coreWire.rotation);
    this.nodes.rotation.y += 0.1 * delta * speedMult;

    if (this.rings[0]) this.rings[0].rotation.z += 0.26 * delta * speedMult;
    if (this.rings[1]) this.rings[1].rotation.z -= 0.18 * delta * speedMult;

    // Floating code tokens bob along their radial axis
    for (let i = 0; i < this.tokens.length; i++) {
      const t = this.tokens[i];
      const r = t.baseR + Math.sin(time * 1.4 + t.phase) * t.bobAmp;
      t.sprite.position.set(t.dirX * r, t.dirY * r, t.dirZ * r);
    }

    // Harmonic floating
    this.spinGroup.position.y = Math.sin(time * 1.1) * 0.08;

    // Pulse expansion + core glow breathing
    const pulseScale = 1.0 + this.pulseEnergy * 0.2;
    this.coreGlow.scale.set(pulseScale, pulseScale, pulseScale);
    const coreBase = this.isMobile ? 0.26 : 0.14;
    this.coreGlow.material.opacity = coreBase + Math.sin(time * 2) * 0.04 + this.pulseEnergy * 0.3;

    if (this.halo) {
      const hs = 5.4 + Math.sin(time * 1.6) * 0.18 + this.pulseEnergy * 0.6;
      this.halo.scale.set(hs, hs, 1);
    }

    this.rings.forEach(ring => {
      const s = 1.0 + this.pulseEnergy * 0.08;
      ring.scale.set(s, s, s);
    });

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeveloperCodeSphere('hero-3d-wrapper');
});

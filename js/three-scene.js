/* ==========================================================================
   THREE.JS 3D CYBER MATRIX ARTIFACT (ULTRA-SMOOTH MOBILE & HIGH PERFORMANCE)
   Engineered with smooth geodesic geometry, dual-directional cyber lighting,
   clamped pitch drag physics, and zero-flicker liquid reflections.
   ========================================================================== */

class DeveloperCyberMatrix {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Independent groups: tilt (mouse + drag) vs. spin (continuous rotation)
    this.tiltGroup = null;
    this.spinGroup = null;

    // 3D Components
    this.coreMesh = null;
    this.innerMesh = null;
    this.cageMesh = null;
    this.ringPrimary = null;
    this.ringSecondary = null;
    this.particles = null;
    this.greenLight = null;

    // Physics & Interaction (Smooth lerp momentum)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.dragRotation = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevTouch = { x: 0, y: 0 };
    this.pulseEnergy = 0;
    this.isVisible = true;
    this.isTabActive = true;

    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 520;

    // Camera perspective
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 40);
    this.camera.position.set(0, 0, 6.1);

    // Locked pixel ratio 1.0 on mobile to eliminate GPU thermal load and micro-stutter
    const dpr = window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio || 1.0, 1.5);
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hero-3d-canvas'),
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);

    this.setupLighting();
    this.buildCyberMatrixGeometry();
    this.bindEvents();
    this.animate();
  }

  setupLighting() {
    // 1. Soft Ambient Illumination
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    // 2. Primary Key Light (Crisp White sheen from top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(4.5, 6.0, 5.0);
    this.scene.add(keyLight);

    // 3. Electric Emerald Rim Light from behind-left (creates gorgeous cyber rim reflection)
    const rimLight = new THREE.DirectionalLight(0x00ff88, 1.3);
    rimLight.position.set(-5.0, 2.0, -3.5);
    this.scene.add(rimLight);

    // 4. Dynamic Point Light in front of the core for rich specular highlight
    this.greenLight = new THREE.PointLight(0x00ff88, 1.5, 12);
    this.greenLight.position.set(1.8, 1.5, 3.2);
    this.scene.add(this.greenLight);
  }

  buildCyberMatrixGeometry() {
    this.tiltGroup = new THREE.Group();
    this.spinGroup = new THREE.Group();
    this.tiltGroup.add(this.spinGroup);
    this.scene.add(this.tiltGroup);

    const isMobile = window.innerWidth < 768;

    // 1. Central Smooth Geodesic Dark Obsidian Core (Zero-flicker liquid cyber reflection)
    const coreGeo = new THREE.IcosahedronGeometry(1.38, isMobile ? 1 : 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0d1017,
      metalness: 0.88,
      roughness: 0.22,
      flatShading: false
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.spinGroup.add(this.coreMesh);

    // 2. Inner Glowing Energy Octahedron Core
    const innerGeo = new THREE.OctahedronGeometry(0.88, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.spinGroup.add(this.innerMesh);

    // 3. Outer Geodesic Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.98, 0);
    const edges = new THREE.EdgesGeometry(cageGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.7
    });
    this.cageMesh = new THREE.LineSegments(edges, lineMat);
    this.spinGroup.add(this.cageMesh);

    // 4. Primary Orbital Gyroscope Ring (Electric Emerald)
    const ring1Geo = new THREE.TorusGeometry(2.68, 0.02, 6, isMobile ? 30 : 48);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.75 });
    this.ringPrimary = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ringPrimary.rotation.x = Math.PI / 3;
    this.spinGroup.add(this.ringPrimary);

    // 5. Secondary Intersecting Gyroscope Ring (Platinum Light Silver)
    const ring2Geo = new THREE.TorusGeometry(3.02, 0.015, 6, isMobile ? 30 : 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.45 });
    this.ringSecondary = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ringSecondary.rotation.y = Math.PI / 3.5;
    this.spinGroup.add(this.ringSecondary);

    // 6. Data Constellation (Orbiting Data Points)
    const pCount = isMobile ? 18 : 32;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      const r = 2.4 + Math.random() * 0.9;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos((Math.random() * 2) - 1);

      pos[i] = r * Math.sin(ph) * Math.cos(th);
      pos[i + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i + 2] = r * Math.cos(ph);
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.065,
      transparent: true,
      opacity: 0.9
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.spinGroup.add(this.particles);
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

    // Touch Support for Mobile (Butter-smooth horizontal drag + instant vertical page scrolling)
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

      // If user is scrolling vertically down the page, yield to browser scrolling immediately
      if (!isTouchScroll && totalDy > totalDx && totalDy > 7) {
        isTouchScroll = true;
        this.isDragging = false;
        return;
      }

      if (isTouchScroll) return;

      const dx = currentX - this.prevTouch.x;
      const dy = currentY - this.prevTouch.y;

      // Smooth horizontal rotation + clamped pitch on mobile touch
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
        window.showToast("⚡ Ahmed Waseem: Cyber Matrix Pulse Active");
      }
    });

    // IntersectionObserver (Sleeps when offscreen)
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

    this.renderer.setSize(width, height);
    const dpr = window.innerWidth < 768 ? 1.0 : Math.min(window.devicePixelRatio || 1.0, 1.5);
    this.renderer.setPixelRatio(dpr);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible || !this.isTabActive) return;

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

    // Continuous dynamic rotation on components
    this.coreMesh.rotation.y += 0.25 * delta * speedMult;
    this.coreMesh.rotation.x += 0.12 * delta * speedMult;

    this.innerMesh.rotation.y -= 0.4 * delta * speedMult;
    this.cageMesh.rotation.y -= 0.18 * delta * speedMult;
    this.ringPrimary.rotation.z += 0.22 * delta * speedMult;
    this.ringSecondary.rotation.z -= 0.16 * delta * speedMult;
    this.particles.rotation.y += 0.12 * delta * speedMult;

    // Harmonic floating
    this.spinGroup.position.y = Math.sin(time * 1.2) * 0.08;

    // Pulse expansion
    const pulseScale = 1.0 + this.pulseEnergy * 0.12;
    this.cageMesh.scale.set(pulseScale, pulseScale, pulseScale);
    this.ringPrimary.scale.set(1.0 + this.pulseEnergy * 0.08, 1.0 + this.pulseEnergy * 0.08, 1.0 + this.pulseEnergy * 0.08);

    if (this.greenLight) {
      this.greenLight.intensity = 1.5 + this.pulseEnergy * 1.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeveloperCyberMatrix('hero-3d-wrapper');
});

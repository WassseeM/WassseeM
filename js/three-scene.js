/* ==========================================================================
   THREE.JS 3D CYBER MATRIX ARTIFACT (ULTRA-HIGH PERFORMANCE, LOCKED 60-120FPS)
   Engineered with pixel-ratio 1.0, separated tilt/spin hierarchy,
   low-poly faceted buffers, and offscreen/tab pause.
   ========================================================================== */

class DeveloperCyberMatrix {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Independent groups: tilt (mouse) vs. spin (continuous rotation)
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

    // Physics & Interaction
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.dragVelocity = { x: 0, y: 0 };
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

    // Camera placed closer at 6.1 for a prominent, bold Cyber Matrix
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 40);
    this.camera.position.set(0, 0, 6.1);

    // Locked pixel ratio 1.0 to eliminate GPU load and micro-stutter
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hero-3d-canvas'),
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1.0);

    this.setupLighting();
    this.buildCyberMatrixGeometry();
    this.bindEvents();
    this.animate();
  }

  setupLighting() {
    // Soft, balanced ambient light (no washed-out blowout)
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambient);

    // Subtle directional key light
    const keyLight = new THREE.DirectionalLight(0xe2fbf5, 0.85);
    keyLight.position.set(5, 7, 6);
    this.scene.add(keyLight);

    // Balanced Emerald Point Light (gentle glow, eliminates mobile WebGL glare error)
    this.greenLight = new THREE.PointLight(0x00ff88, 1.6, 14);
    this.greenLight.position.set(2.2, 1.8, 3.0);
    this.scene.add(this.greenLight);
  }

  buildCyberMatrixGeometry() {
    this.tiltGroup = new THREE.Group();
    this.spinGroup = new THREE.Group();
    this.tiltGroup.add(this.spinGroup);
    this.scene.add(this.tiltGroup);

    const isMobile = window.innerWidth < 768;

    // 1. Central Faceted Dark Obsidian Core (Metallic cyber surface without specular blowout)
    const coreGeo = new THREE.IcosahedronGeometry(1.42, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      metalness: 0.65,
      roughness: 0.45,
      flatShading: true
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.spinGroup.add(this.coreMesh);

    // 2. Inner Glowing Energy Core
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.spinGroup.add(this.innerMesh);

    // 3. Outer Geodesic Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(2.05, 0);
    const edges = new THREE.EdgesGeometry(cageGeo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.75
    });
    this.cageMesh = new THREE.LineSegments(edges, lineMat);
    this.spinGroup.add(this.cageMesh);

    // 4. Primary Orbital Gyroscope Ring (Electric Green)
    const ring1Geo = new THREE.TorusGeometry(2.75, 0.02, 5, isMobile ? 28 : 42);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.7 });
    this.ringPrimary = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ringPrimary.rotation.x = Math.PI / 3;
    this.spinGroup.add(this.ringPrimary);

    // 5. Secondary Intersecting Gyroscope Ring (Light Silver)
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.014, 5, isMobile ? 28 : 42);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.4 });
    this.ringSecondary = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ringSecondary.rotation.y = Math.PI / 3.5;
    this.spinGroup.add(this.ringSecondary);

    // 6. Data Constellation
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

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = x * 0.3;
      this.mouse.targetY = y * 0.2;
    }, { passive: true });

    const canvas = this.renderer.domElement;

    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      this.dragVelocity = { x: 0, y: 0 };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.spinGroup) {
        const dx = e.clientX - this.prevMouse.x;
        const dy = e.clientY - this.prevMouse.y;

        this.dragVelocity.x = dx * 0.006;
        this.dragVelocity.y = dy * 0.006;

        this.spinGroup.rotation.y += this.dragVelocity.x;
        this.spinGroup.rotation.x += this.dragVelocity.y;

        this.prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch Support for Mobile - smooth rotation without scroll lag/hijacking
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchScroll = false;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        this.prevMouse = { x: touchStartX, y: touchStartY };
        this.isDragging = true;
        isTouchScroll = false;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1 || !this.spinGroup) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const totalDx = Math.abs(currentX - touchStartX);
      const totalDy = Math.abs(currentY - touchStartY);

      // If user is scrolling vertically down the page, yield to browser scrolling immediately
      if (!isTouchScroll && totalDy > totalDx && totalDy > 8) {
        isTouchScroll = true;
        this.isDragging = false;
        return;
      }

      if (isTouchScroll) return;

      const dx = currentX - this.prevMouse.x;
      const dy = currentY - this.prevMouse.y;

      // Smooth damped rotation on horizontal touch gesture
      this.dragVelocity.x = dx * 0.0035;
      this.dragVelocity.y = dy * 0.0035;
      this.spinGroup.rotation.y += this.dragVelocity.x;
      this.spinGroup.rotation.x += this.dragVelocity.y;

      this.prevMouse = { x: currentX, y: currentY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      isTouchScroll = false;
    }, { passive: true });

    // Click to pulse
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
    this.renderer.setPixelRatio(1.0);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible || !this.isTabActive) return;

    const delta = Math.min(this.clock.getDelta(), 0.06);
    const time = this.clock.getElapsedTime();

    // Mouse Lerp on tilt group
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.tiltGroup.rotation.y = this.mouse.x;
    this.tiltGroup.rotation.x = -this.mouse.y;

    // Drag damping inertia
    if (!this.isDragging) {
      this.dragVelocity.x *= 0.94;
      this.dragVelocity.y *= 0.94;
      this.spinGroup.rotation.y += this.dragVelocity.x;
      this.spinGroup.rotation.x += this.dragVelocity.y;
    }

    // Pulse decay
    if (this.pulseEnergy > 0) {
      this.pulseEnergy *= 0.93;
      if (this.pulseEnergy < 0.005) this.pulseEnergy = 0;
    }

    const speedMult = 1.0 + this.pulseEnergy * 2.2;

    // Continuous dynamic rotation
    this.coreMesh.rotation.y += 0.3 * delta * speedMult;
    this.coreMesh.rotation.x += 0.18 * delta * speedMult;

    this.innerMesh.rotation.y -= 0.45 * delta * speedMult;
    this.cageMesh.rotation.y -= 0.2 * delta * speedMult;
    this.ringPrimary.rotation.z += 0.25 * delta * speedMult;
    this.ringSecondary.rotation.z -= 0.18 * delta * speedMult;
    this.particles.rotation.y += 0.14 * delta * speedMult;

    // Harmonic floating
    this.spinGroup.position.y = Math.sin(time * 1.2) * 0.1;

    // Pulse expansion
    const pulseScale = 1.0 + this.pulseEnergy * 0.15;
    this.cageMesh.scale.set(pulseScale, pulseScale, pulseScale);
    this.ringPrimary.scale.set(1.0 + this.pulseEnergy * 0.1, 1.0 + this.pulseEnergy * 0.1, 1.0 + this.pulseEnergy * 0.1);

    if (this.greenLight) {
      this.greenLight.intensity = 1.6 + this.pulseEnergy * 1.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeveloperCyberMatrix('hero-3d-wrapper');
});

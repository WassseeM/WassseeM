/* ==========================================================================
   FLYING CODE 3D MATRIX ENGINE (HYPER-OPTIMIZED 120 FPS)
   Engineered with low-overhead canvas drawing, integer rounding,
   minimal particle count (45 max), and tab-sleep listeners.
   ========================================================================== */

class FlyingCodeMatrix {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });

    // Streamlined high-impact programming tokens
    this.snippets = [
      { text: "int", isAccent: true },
      { text: "float", isAccent: false },
      { text: "char*", isAccent: false },
      { text: "bool", isAccent: false },
      { text: "void", isAccent: true },
      { text: "int* ptr = &val;", isAccent: true },
      { text: "NULL", isAccent: false },
      { text: "{ }", isAccent: true },
      { text: "</>", isAccent: true },
      { text: "=>", isAccent: true },
      { text: "return 0;", isAccent: true },
      { text: "if (valid)", isAccent: false },
      { text: "for (int i=0; i<n; i++)", isAccent: false },
      { text: "while (active)", isAccent: false },
      { text: "printf(\"AW\\n\");", isAccent: true },
      { text: "#include <stdio.h>", isAccent: true },
      { text: "async / await", isAccent: true },
      { text: "const ahmed = new Dev();", isAccent: true },
      { text: "0xDEADBEEF", isAccent: false },
      { text: "git push origin main", isAccent: false },
      { text: "npm run build", isAccent: false },
      { text: "gcc -O3 main.c", isAccent: false }
    ];

    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.fov = 400;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, rawX: -2000, rawY: -2000 };
    this.isWarpMode = false;
    this.warpMultiplier = 1.0;
    this.isTabActive = true;

    // Device-aware frame cap (30fps mobile / 60fps desktop)
    this.isMobile = window.innerWidth < 768;
    this.baseTarget = this.isMobile ? 30 : 60;
    this.targetInterval = 1000 / this.baseTarget;
    this.lastTime = performance.now();

    // Adaptive performance governor
    this.maxTier = 2;
    this.tier = this.maxTier;
    this.drawLimit = 1.0;
    this.perfFrames = 0;
    this.perfTime = 0;
    this.totalTime = 0;
    this.badWindows = 0;
    this.goodWindows = 0;
    this.lastRaf = 0;

    this.init();
  }

  // --- Auto-tune density + frame rate so the background never lags ----------
  applyTier() {
    if (this.tier >= 2) {
      this.drawLimit = 1.0;
      this.targetInterval = 1000 / this.baseTarget;
    } else if (this.tier === 1) {
      this.drawLimit = 0.7;
      this.targetInterval = 1000 / (this.isMobile ? 30 : 45);
    } else {
      this.drawLimit = 0.5;
      this.targetInterval = 1000 / 30;
    }
  }

  evaluatePerformance(fps) {
    const target = this.baseTarget;

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

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.rawX = e.clientX;
      this.mouse.rawY = e.clientY;
      this.mouse.targetX = (e.clientX - this.centerX) * 0.05;
      this.mouse.targetY = (e.clientY - this.centerY) * 0.05;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.rawX = -2000;
      this.mouse.rawY = -2000;
    });

    document.addEventListener('visibilitychange', () => {
      this.isTabActive = !document.hidden;
      if (this.isTabActive) {
        this.lastTime = performance.now();
        this.lastRaf = 0;
        requestAnimationFrame((t) => this.render(t));
      }
    });

    this.createParticles();
    requestAnimationFrame((t) => this.render(t));

    // Global Warp Toggle
    window.toggleCodeWarp = () => {
      this.isWarpMode = !this.isWarpMode;
      return this.isWarpMode;
    };
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.centerX = (this.width * 0.5) | 0;
    this.centerY = (this.height * 0.5) | 0;
  }

  createParticles() {
    this.particles = [];
    // Ultra-lightweight count on mobile (12) vs desktop (42) for locked smooth fps
    const count = this.width < 768 ? 12 : 42;

    for (let i = 0; i < count; i++) {
      const snippet = this.snippets[i % this.snippets.length];
      this.particles.push({
        text: snippet.text,
        isAccent: snippet.isAccent || (i % 4 === 0),
        x: (Math.random() - 0.5) * this.width * 2.0,
        y: (Math.random() - 0.5) * this.height * 2.0,
        z: (Math.random() * 700 - 350) | 0,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.35 - Math.random() * 0.4,
        vz: (Math.random() - 0.5) * 0.35
      });
    }
  }

  render(currentTime) {
    if (!this.isTabActive) return;

    const rafDelta = this.lastRaf ? Math.min(currentTime - this.lastRaf, 100) : 16.7;
    this.lastRaf = currentTime;

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

    // Frame limiter: skip draws to keep mobile GPU/battery cool
    if (currentTime - this.lastTime < this.targetInterval - 1) {
      requestAnimationFrame((t) => this.render(t));
      return;
    }

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.08);
    this.lastTime = currentTime;

    // Fast opaque background fill
    this.ctx.fillStyle = '#040406';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Smooth warp transition
    if (this.isWarpMode) {
      this.warpMultiplier = Math.min(this.warpMultiplier + 0.15, 4.5);
    } else if (this.warpMultiplier > 1.0) {
      this.warpMultiplier = Math.max(this.warpMultiplier - 0.12, 1.0);
    }

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const centerX = this.centerX + this.mouse.x;
    const centerY = this.centerY + this.mouse.y;
    const repulseDistSq = 130 * 130;
    const timeScale = dt * 60 * this.warpMultiplier;

    // Global font set once
    this.ctx.font = '600 12px "JetBrains Mono", monospace';
    this.ctx.textBaseline = 'middle';

    const pLen = Math.max(1, Math.round(this.particles.length * this.drawLimit));
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Update positions
      p.x += p.vx * timeScale;
      p.y += p.vy * timeScale;
      p.z += p.vz * timeScale;

      // 3D Bounds wrap
      if (p.y < -this.height) p.y = this.height;
      else if (p.y > this.height) p.y = -this.height;

      if (p.x < -this.width) p.x = this.width;
      else if (p.x > this.width) p.x = -this.width;

      if (p.z < -350) p.z = 350;
      else if (p.z > 350) p.z = -350;

      // Fast Perspective Projection
      const depth = this.fov + p.z;
      if (depth <= 10) continue;

      const scale = this.fov / depth;
      const screenX = (centerX + p.x * scale) | 0;
      const screenY = (centerY + p.y * scale) | 0;

      // Mouse Repulsion (squared math)
      const dx = this.mouse.rawX - screenX;
      const dy = this.mouse.rawY - screenY;
      const dSq = dx * dx + dy * dy;

      if (dSq < repulseDistSq && dSq > 0) {
        const force = (130 - Math.sqrt(dSq)) * 0.06;
        p.x -= (dx * 0.007) * force;
        p.y -= (dy * 0.007) * force;
      }

      // Fast text fill
      if (p.isAccent || this.isWarpMode) {
        this.ctx.fillStyle = 'rgba(0, 255, 136, 0.45)';
      } else {
        this.ctx.fillStyle = 'rgba(203, 213, 225, 0.2)';
      }

      this.ctx.fillText(p.text, screenX, screenY);
    }

    requestAnimationFrame((t) => this.render(t));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FlyingCodeMatrix('flying-code-canvas');
});

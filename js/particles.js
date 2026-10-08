/* ==========================================================================
   PARTICLE CANVAS SYSTEM
   Floating cyber pixels, glowing runes, and interactive mouse repulsion.
   ========================================================================== */

class ParticleMatrix {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.particleCount = Math.min(Math.floor((this.width * this.height) / 22000), 65);

    this.colors = [
      'rgba(0, 255, 102, 0.45)',  // Electric green
      'rgba(0, 240, 255, 0.45)',  // Neon cyan
      'rgba(138, 43, 226, 0.35)', // Purple
      'rgba(255, 255, 255, 0.25)' // White/glint
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() < 0.2 ? 3.5 : (Math.random() * 2 + 1),
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        isPixel: Math.random() > 0.4, // Square pixel vs circle node
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move particle
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= Math.cos(angle) * force * 3;
        p.y -= Math.sin(angle) * force * 3;
      }

      // Draw particle
      p.pulse += p.pulseSpeed;
      const opacity = 0.3 + Math.sin(p.pulse) * 0.3;

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0.1, opacity);

      if (p.isPixel) {
        // Pixel block
        this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      } else {
        // Smooth circular rune
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw subtle connecting cyber lines between close particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (pDist < 90) {
          this.ctx.strokeStyle = 'rgba(0, 255, 102, 0.08)';
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleMatrix('particle-canvas');
});

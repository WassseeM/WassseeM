/* ==========================================================================
   ENTER WORLD / BOOT SEQUENCE EXPERIENCE
   Interactive transition into Ahmed's digital universe.
   ========================================================================== */

class WorldBootSystem {
  constructor() {
    this.overlay = document.getElementById('boot-overlay');
    this.progressBar = document.getElementById('boot-progress-fill');
    this.logContainer = document.getElementById('boot-log-container');
    this.enterBtn = document.getElementById('btn-enter-world');
    this.isBooting = false;

    this.bootLogs = [
      { text: "ESTABLISHING SECURE PROTOCOL...", ok: "01", progress: 20 },
      { text: "LOADING PLAYER PROFILE: AHMED [B.TECH CS]...", ok: "02", progress: 45 },
      { text: "INITIALIZING TECH ARSENAL (16 INVENTORY SLOTS)...", ok: "03", progress: 70 },
      { text: "COMPILING QUEST LOGS & REPOSITORIES...", ok: "04", progress: 88 },
      { text: "CALIBRATING TELEMETRY & DEVELOPER STATS...", ok: "05", progress: 95 },
      { text: "SYSTEM READY. WELCOME TO AHMED.EXE!", ok: "✓", progress: 100 }
    ];

    this.init();
  }

  init() {
    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerBootSequence();
      });
    }
  }

  triggerBootSequence() {
    if (this.isBooting) return;
    this.isBooting = true;

    if (window.soundEngine) {
      window.soundEngine.playBootWarp();
    }

    if (!this.overlay || !this.logContainer || !this.progressBar) {
      // Fallback smooth scroll if elements missing
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Reset overlay
    this.logContainer.innerHTML = '';
    this.progressBar.style.width = '0%';
    this.overlay.classList.add('active');

    let currentStep = 0;

    const executeStep = () => {
      if (currentStep < this.bootLogs.length) {
        const item = this.bootLogs[currentStep];
        
        // Create log line
        const line = document.createElement('div');
        line.className = 'boot-log-line';
        line.innerHTML = `<span class="ok-tag">[${item.ok}]</span> <span>${item.text}</span>`;
        this.logContainer.appendChild(line);

        // Trigger reflow for transition
        setTimeout(() => {
          line.classList.add('show');
          if (window.soundEngine) window.soundEngine.playKeypress();
        }, 50);

        // Update progress bar
        this.progressBar.style.width = `${item.progress}%`;

        currentStep++;
        setTimeout(executeStep, 350);
      } else {
        // Boot complete!
        setTimeout(() => {
          if (window.soundEngine) window.soundEngine.playAchievement();

          // Fade out overlay
          this.overlay.classList.remove('active');
          this.isBooting = false;

          // Scroll to about section
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }

          // Trigger in-game toast
          if (window.showToast) {
            window.showToast('🚀', 'WORLD ENTERED', 'Welcome to Ahmed\'s Digital World (+100 XP)');
          }
        }, 600);
      }
    };

    setTimeout(executeStep, 200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.worldBoot = new WorldBootSystem();
});

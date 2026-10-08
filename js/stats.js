/* ==========================================================================
   DEVELOPER STATS & GITHUB CONTRIBUTION MATRIX
   Interactive heatmap generator, commit wave simulator, and metric counters.
   ========================================================================== */

class DeveloperStats {
  constructor() {
    this.heatmapGrid = document.getElementById('github-heatmap-grid');
    this.pulseBtn = document.getElementById('btn-pulse-grid');
    this.statNumbers = document.querySelectorAll('.stat-count');
    this.counted = false;

    this.init();
  }

  init() {
    this.buildContributionMatrix();
    this.initPulseButton();
    this.initScrollCounters();
  }

  buildContributionMatrix() {
    if (!this.heatmapGrid) return;
    this.heatmapGrid.innerHTML = '';

    const weeks = 52;
    const days = 7;
    const today = new Date();

    // Generate 52 weeks of commits
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';

        // Calculate a realistic distribution
        const rand = Math.random();
        let level = 0;
        let commits = 0;

        if (rand > 0.85) {
          level = 4;
          commits = Math.floor(Math.random() * 6) + 8;
        } else if (rand > 0.65) {
          level = 3;
          commits = Math.floor(Math.random() * 4) + 4;
        } else if (rand > 0.4) {
          level = 2;
          commits = Math.floor(Math.random() * 3) + 2;
        } else if (rand > 0.2) {
          level = 1;
          commits = 1;
        }

        cell.setAttribute('data-level', level);
        cell.setAttribute('data-commits', commits);

        // Calculate approximate date for tooltip
        const daysAgo = (weeks - 1 - w) * 7 + (6 - d);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - daysAgo);
        const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        cell.title = `${commits} contributions on ${dateStr}`;

        cell.addEventListener('mouseenter', () => {
          if (window.soundEngine) window.soundEngine.playKeypress();
        });

        this.heatmapGrid.appendChild(cell);
      }
    }
  }

  initPulseButton() {
    if (!this.pulseBtn) return;

    this.pulseBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playAchievement();
      const cells = this.heatmapGrid.querySelectorAll('.heatmap-cell');

      cells.forEach((cell, idx) => {
        setTimeout(() => {
          cell.style.transform = 'scale(1.5)';
          cell.style.boxShadow = '0 0 12px var(--accent-green)';
          cell.style.background = 'var(--accent-green)';

          setTimeout(() => {
            cell.style.transform = '';
            cell.style.boxShadow = '';
            cell.style.background = '';
          }, 250);
        }, idx * 1.8);
      });

      if (window.showToast) {
        window.showToast('⚡', 'ENERGY PULSE', 'Commit Matrix synchronized (+25 XP)');
      }
    });
  }

  initScrollCounters() {
    if (!this.statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.counted) {
          this.counted = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1500;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / totalSteps;
        // Ease out quadratic
        const easeVal = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        counter.textContent = easeVal + suffix;

        if (currentStep >= totalSteps) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        }
      }, stepTime);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeveloperStats();
});

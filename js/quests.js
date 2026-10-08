/* ==========================================================================
   QUESTS / PROJECTS MANAGER
   Filtering, 3D card tilt effect, and interactive quest log.
   ========================================================================== */

class QuestSystem {
  constructor() {
    this.filterBtns = document.querySelectorAll('.quest-filter-btn');
    this.questCards = document.querySelectorAll('.quest-card');
    this.init();
  }

  init() {
    this.initFilters();
    this.initTiltEffect();
  }

  initFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active class
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.soundEngine) window.soundEngine.playSelect();

        // Filter cards
        this.questCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // Smooth 3D tilt calculation for modern desktop viewports
  initTiltEffect() {
    if (window.innerWidth < 768) return; // Skip on mobile for performance

    this.questCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new QuestSystem();
});

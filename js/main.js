/* ==========================================================================
   MAIN APPLICATION CONTROLLER (AHMED WASEEM DEVELOPER PORTFOLIO)
   Features:
   1. Brand Logo Matrix Decrypt Hover
   2. Interactive Skills Inspector
   3. Developer Command HUD / Spotlight (Ctrl+K)
   4. Hyperspace Code Warp Mode
   5. Code Playground Tab Switcher
   6. 3D Perspective Card Tilt
   7. Scroll Spy & Reveal Observer
   8. Contact Transmission & Live Clock
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Global Minimal Toast Notification Helper
// --------------------------------------------------------------------------
window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'minimal-toast';
  toast.innerHTML = `
    <span class="toast-dot"></span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 15);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
};

// --------------------------------------------------------------------------
// 2. Main Portfolio Controller
// --------------------------------------------------------------------------
class PortfolioApp {
  constructor() {
    this.navToggle = document.getElementById('nav-toggle-btn');
    this.mobileDrawer = document.getElementById('mobile-drawer');
    this.contactForm = document.getElementById('contact-form');
    this.footerClock = document.getElementById('footer-clock');
    this.typewriterText = document.getElementById('typewriter-text');
    this.brandLogo = document.getElementById('brand-logo');

    // Code Snippets for Playground
    this.codeSnippets = {
      c: [
        { num: "01", html: '<span class="code-token-comment">// AhmedWaseem.c — Systems &amp; Data Structures</span>' },
        { num: "02", html: '<span class="code-token-kw">#include</span> <span class="code-token-str">&lt;stdio.h&gt;</span>' },
        { num: "03", html: '<span class="code-token-kw">#include</span> <span class="code-token-str">&lt;stdlib.h&gt;</span>' },
        { num: "04", html: '<span class="code-token-kw">typedef struct</span> {' },
        { num: "05", html: '  <span class="code-token-kw">char</span> name[20];' },
        { num: "06", html: '  <span class="code-token-kw">char</span> role[30];' },
        { num: "07", html: '} <span class="code-token-fn">Developer</span>;' },
        { num: "08", html: '<span class="code-token-kw">int</span> <span class="code-token-fn">main</span>(<span class="code-token-kw">void</span>) {' },
        { num: "09", html: '  <span class="code-token-fn">printf</span>(<span class="code-token-str">"Ahmed Waseem: Software Builder\\n"</span>);' },
        { num: "10", html: '  <span class="code-token-kw">return</span> 0;' },
        { num: "11", html: '}' }
      ],
      js: [
        { num: "01", html: '<span class="code-token-comment">// AhmedWaseem.js — Modern Frontend Architecture</span>' },
        { num: "02", html: '<span class="code-token-kw">const</span> developer = {' },
        { num: "03", html: '  name: <span class="code-token-str">"Ahmed Waseem"</span>,' },
        { num: "04", html: '  role: <span class="code-token-str">"B.Tech CS Student &amp; Builder"</span>,' },
        { num: "05", html: '  stack: [<span class="code-token-str">"JavaScript"</span>, <span class="code-token-str">"Three.js"</span>, <span class="code-token-str">"HTML/CSS"</span>],' },
        { num: "06", html: '  <span class="code-token-fn">build</span>: <span class="code-token-kw">async</span> () =&gt; {' },
        { num: "07", html: '    <span class="code-token-kw">await</span> createCleanExperiences();' },
        { num: "08", html: '    <span class="code-token-kw">return</span> <span class="code-token-str">"Production Ready"</span>;' },
        { num: "09", html: '  }' },
        { num: "10", html: '};' }
      ],
      py: [
        { num: "01", html: '<span class="code-token-comment"># AhmedWaseem.py — Algorithms & Logic</span>' },
        { num: "02", html: '<span class="code-token-kw">class</span> <span class="code-token-fn">AhmedWaseem</span>:' },
        { num: "03", html: '    <span class="code-token-kw">def</span> <span class="code-token-fn">__init__</span>(self):' },
        { num: "04", html: '        self.discipline = <span class="code-token-str">"Computer Science"</span>' },
        { num: "05", html: '        self.status = <span class="code-token-str">"Continuous Learner"</span>' },
        { num: "06", html: '    <span class="code-token-kw">def</span> <span class="code-token-fn">execute</span>(self):' },
        { num: "07", html: '        <span class="code-token-kw">return</span> {<span class="code-token-str">"code"</span>: <span class="code-token-str">"clean"</span>, <span class="code-token-str">"mindset"</span>: <span class="code-token-str">"curious"</span>}' }
      ]
    };

    this.init();
  }

  init() {
    this.initBrandScramble();
    this.initTypewriter();
    this.initMobileNav();
    this.initScrollSpy();
    this.initScrollReveal();
    this.initScrollEffects();
    this.initCodePlayground();
    this.init3DCardTilt();
    this.initSkillsInspector();
    this.initCommandHUD();
    this.initWarpButton();
    this.initCopyEmail();
    this.initContactForm();
    this.initLiveClock();
  }

  // 1. Logo Hover Matrix Decrypt Animation
  initBrandScramble() {
    if (!this.brandLogo) return;

    const chars = '01<>/_#%&*~=';
    const scrambleEl = (el, originalText) => {
      let iteration = 0;
      clearInterval(el._interval);

      el._interval = setInterval(() => {
        el.innerText = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(el._interval);
          el.innerText = originalText;
        }

        iteration += 1 / 2;
      }, 30);
    };

    this.brandLogo.addEventListener('mouseenter', () => {
      const first = this.brandLogo.querySelector('.bn-first');
      const last = this.brandLogo.querySelector('.bn-last');
      if (first) scrambleEl(first, 'AHMED');
      if (last) scrambleEl(last, 'WASEEM');
    });
  }

  // 2. Subtitle Typewriter
  initTypewriter() {
    if (!this.typewriterText) return;

    const words = [
      "B.Tech Computer Science Student",
      "Software & Web Developer",
      "Algorithmic Problem Solver",
      "Continuous Technology Learner"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = words[wordIdx];

      if (isDeleting) {
        this.typewriterText.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        this.typewriterText.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 35 : 75;

      if (!isDeleting && charIdx === currentWord.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      setTimeout(type, speed);
    };

    type();
  }

  // 3. Mobile Navigation
  initMobileNav() {
    if (!this.navToggle || !this.mobileDrawer) return;

    this.navToggle.addEventListener('click', () => {
      const isOpen = this.mobileDrawer.classList.toggle('open');
      this.navToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    const mobileLinks = this.mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileDrawer.classList.remove('open');
        this.navToggle.innerHTML = '☰';
      });
    });
  }

  // 4. Navigation Scroll Spy (rAF-throttled, offsets cached — no layout thrashing)
  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let sectionMetrics = [];
    let activeId = '';
    let ticking = false;

    const measure = () => {
      sectionMetrics = Array.from(sections).map(s => ({
        id: s.getAttribute('id'),
        top: s.offsetTop,
        bottom: s.offsetTop + s.offsetHeight
      }));
    };

    const update = () => {
      ticking = false;
      const scrollY = window.pageYOffset + 140;

      let currentId = '';
      for (let i = 0; i < sectionMetrics.length; i++) {
        const m = sectionMetrics[i];
        if (scrollY >= m.top && scrollY < m.bottom) {
          currentId = m.id;
          break;
        }
      }

      if (currentId && currentId !== activeId) {
        activeId = currentId;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
      }
    };

    measure();
    update();

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      measure();
      update();
    }, { passive: true });
  }

  // 5. Scroll Reveal & Slide Observer
  initScrollReveal() {
    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');

        // Staggered children: apply per-item delay, then clear it so hover
        // transitions stay snappy afterwards.
        if (el.classList.contains('stagger-children')) {
          const children = el.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const delay = i * 65;
            child.style.transitionDelay = `${delay}ms`;
            setTimeout(() => { child.style.transitionDelay = ''; }, delay + 900);
          }
        }

        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // 5b. Scroll Effects: progress bar, navbar shrink, hero parallax
  initScrollEffects() {
    const progress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');
    const hero3d = document.getElementById('hero-3d-wrapper');
    const heroContent = document.querySelector('.hero-content');
    const reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enableParallax = window.innerWidth >= 768 && !reducedMotion;

    let ticking = false;
    let docMax = 0;
    let lastPct = -1;
    let lastScrolled = null;
    let lastHeroY = -1;

    const measure = () => {
      docMax = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    const update = () => {
      ticking = false;
      const y = window.scrollY || window.pageYOffset || 0;

      // Top progress bar (skip write when unchanged)
      if (progress && docMax > 0) {
        const pct = Math.min((y / docMax) * 100, 100);
        if (Math.abs(pct - lastPct) > 0.05) {
          lastPct = pct;
          progress.style.width = `${pct}%`;
        }
      }

      // Navbar condensed state (only touch DOM on change)
      if (navbar) {
        const scrolled = y > 20;
        if (scrolled !== lastScrolled) {
          lastScrolled = scrolled;
          navbar.classList.toggle('scrolled', scrolled);
        }
      }

      // Hero parallax (desktop only, GPU transform + opacity)
      if (enableParallax) {
        const h = window.innerHeight;
        if (y < h) {
          // Quantize to 0.5px to skip sub-pixel writes
          const py = Math.round(y * 0.18 * 2) / 2;
          if (py !== lastHeroY) {
            lastHeroY = py;
            if (hero3d) hero3d.style.transform = `translateY(${py}px)`;
            if (heroContent) {
              heroContent.style.transform = `translateY(${Math.round(y * 0.05 * 2) / 2}px)`;
              heroContent.style.opacity = `${Math.max(0, 1 - (y / (h * 0.9)))}`;
            }
          }
        } else if (lastHeroY !== 0) {
          lastHeroY = 0;
          if (hero3d) hero3d.style.transform = '';
          if (heroContent) {
            heroContent.style.transform = '';
            heroContent.style.opacity = '';
          }
        }
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  // 6. Interactive Code Playground Window
  initCodePlayground() {
    const tabBtns = document.querySelectorAll('.code-tab-btn');
    const bodyContainer = document.getElementById('code-window-body');
    const copyBtn = document.getElementById('btn-copy-code');

    const renderSnippet = (lang) => {
      if (!bodyContainer || !this.codeSnippets[lang]) return;
      const lines = this.codeSnippets[lang];

      bodyContainer.innerHTML = lines.map(line => `
        <div class="code-line">
          <span class="code-line-num">${line.num}</span>
          <span>${line.html}</span>
        </div>
      `).join('');
    };

    renderSnippet('c');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSnippet(lang);
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const activeBtn = document.querySelector('.code-tab-btn.active');
        const lang = activeBtn ? activeBtn.getAttribute('data-lang') : 'c';
        const lines = this.codeSnippets[lang] || [];
        const plainText = lines.map(l => l.html.replace(/<[^>]*>?/gm, '')).join('\n');

        if (navigator.clipboard) {
          navigator.clipboard.writeText(plainText).then(() => {
            window.showToast("Ahmed Waseem code snippet copied");
          });
        }
      });
    }
  }

  // 7. Interactive Skills Inspector & Filter System
  initSkillsInspector() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillPills = document.querySelectorAll('.skill-name-pill');
    const inspectorIconBox = document.getElementById('inspector-icon-box');
    const inspectorTitle = document.getElementById('inspector-active-title');
    const inspectorBadge = document.getElementById('inspector-category-badge');
    const inspectorText = document.getElementById('skill-inspector-text');

    const activateSkill = (pill) => {
      if (!pill) return;
      skillPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const name = pill.getAttribute('data-skill') || '';
      const desc = pill.getAttribute('data-desc') || 'Core development technology in Ahmed Waseem\'s engineering stack.';
      const category = pill.getAttribute('data-category') || 'TECH';
      const brandColor = pill.getAttribute('data-color') || '#00ff88';
      const brandGlow = pill.getAttribute('data-glow') || 'rgba(0, 255, 136, 0.4)';

      // Update Inspector Icon
      const logoSvg = pill.querySelector('.skill-logo-svg');
      if (inspectorIconBox && logoSvg) {
        inspectorIconBox.innerHTML = logoSvg.outerHTML;
        inspectorIconBox.style.setProperty('--brand-color', brandColor);
        inspectorIconBox.style.setProperty('--brand-shadow', brandGlow);
        inspectorIconBox.style.borderColor = brandColor;
        inspectorIconBox.style.boxShadow = `0 12px 28px -4px ${brandGlow}, 0 4px 12px -2px rgba(0, 0, 0, 0.9), inset 0 1px 1.5px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.6)`;
      }

      // Update Inspector Title
      if (inspectorTitle) {
        inspectorTitle.textContent = name;
        inspectorTitle.style.color = brandColor === '#FFFFFF' ? '#FFFFFF' : brandColor;
      }

      // Update Inspector Category Badge
      if (inspectorBadge) {
        const catMap = {
          'lang': 'LANGUAGE',
          'frontend': 'FRONTEND & WEB',
          'backend': 'DATABASE / BACKEND',
          'cloud': 'CLOUD & DEVOPS',
          'design': 'DESIGN & UI'
        };
        inspectorBadge.textContent = catMap[category] || category.toUpperCase();
        inspectorBadge.style.borderColor = brandColor;
        inspectorBadge.style.color = brandColor;
      }

      // Update Inspector Text
      if (inspectorText) {
        inspectorText.textContent = desc;
      }
    };

    // Attach click and hover to each skill pill
    skillPills.forEach(pill => {
      pill.addEventListener('click', () => {
        activateSkill(pill);
        if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
          window.soundEngine.playClick();
        }
      });

      pill.addEventListener('mouseenter', () => {
        activateSkill(pill);
      });
    });

    // Category filter button tabs
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter') || 'all';
        let firstVisible = null;

        skillPills.forEach(pill => {
          const pillCat = pill.getAttribute('data-category');
          if (filter === 'all' || pillCat === filter) {
            pill.classList.remove('hidden');
            if (!firstVisible) firstVisible = pill;
          } else {
            pill.classList.add('hidden');
          }
        });

        // If the currently active pill is now hidden, activate first visible pill
        const currentActive = document.querySelector('.skill-name-pill.active');
        if (!currentActive || currentActive.classList.contains('hidden')) {
          if (firstVisible) activateSkill(firstVisible);
        }

        if (window.soundEngine && typeof window.soundEngine.playSelect === 'function') {
          window.soundEngine.playSelect();
        }
      });
    });

    // Initialize with first pill
    const initialActive = document.querySelector('.skill-name-pill.active') || skillPills[0];
    if (initialActive) {
      activateSkill(initialActive);
    }
  }

  // 8. Developer Command HUD / Spotlight (Ctrl+K / Cmd+K / Button)
  initCommandHUD() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const triggerBtn = document.getElementById('btn-cmd-trigger');
    const closeBtn = document.getElementById('cmd-close-btn');
    const input = document.getElementById('cmd-palette-input');
    const items = document.querySelectorAll('.cmd-item');

    if (!backdrop) return;

    const openHUD = () => {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 50);
      }
      this.filterCommands('');
    };

    const closeHUD = () => {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    };

    if (triggerBtn) triggerBtn.addEventListener('click', openHUD);
    if (closeBtn) closeBtn.addEventListener('click', closeHUD);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeHUD();
    });

    // Keyboard Shortcuts (Ctrl+K, Cmd+K, Esc)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        backdrop.classList.contains('open') ? closeHUD() : openHUD();
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeHUD();
      }
    });

    // Command Filtering
    if (input) {
      input.addEventListener('input', (e) => {
        this.filterCommands(e.target.value.toLowerCase().trim());
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const visibleItem = document.querySelector('.cmd-item:not([style*="display: none"])');
          if (visibleItem) {
            this.executeCommand(visibleItem.getAttribute('data-cmd'));
            closeHUD();
          }
        }
      });
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        const cmd = item.getAttribute('data-cmd');
        this.executeCommand(cmd);
        closeHUD();
      });
    });
  }

  filterCommands(query) {
    const items = document.querySelectorAll('.cmd-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  executeCommand(cmd) {
    if (cmd === 'skills') {
      const target = document.getElementById('skills');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd === 'projects') {
      const target = document.getElementById('projects');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd === 'warp') {
      const warpBtn = document.getElementById('btn-warp-mode');
      if (warpBtn) warpBtn.click();
    } else if (cmd === 'whoami') {
      window.showToast("Ahmed Waseem: B.Tech CS Student & Software/Web Developer.");
    } else if (cmd === 'contact') {
      const target = document.getElementById('contact');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd === 'sudo hire') {
      this.triggerEasterEgg();
    }
  }

  triggerEasterEgg() {
    window.showToast("🎉 ACCESS GRANTED: Ahmed Waseem is ready to build awesome projects!");

    // Confetti Rain
    const wrap = document.createElement('div');
    wrap.className = 'easter-confetti-wrap';
    document.body.appendChild(wrap);

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.backgroundColor = Math.random() > 0.3 ? '#00ff88' : '#ffffff';
      wrap.appendChild(piece);
    }

    setTimeout(() => wrap.remove(), 3500);
  }

  // 9. Warp Button
  initWarpButton() {
    const warpBtn = document.getElementById('btn-warp-mode');
    if (!warpBtn) return;

    warpBtn.addEventListener('click', () => {
      let isWarp = false;
      if (window.toggleCodeWarp) {
        isWarp = window.toggleCodeWarp();
      }

      warpBtn.classList.toggle('active', isWarp);
      if (isWarp) {
        window.showToast("⚡ Hyperspace Code Warp: ENGAGED");
      } else {
        window.showToast("Standard Code Flight: ACTIVE");
      }
    });
  }

  // 10. 3D Card Tilt (only on real pointer devices — no touch, no reduced motion)
  init3DCardTilt() {
    const finePointer = window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;

    const cards = document.querySelectorAll('.achievement-card, .about-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card._rect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card._rect || (card._rect = card.getBoundingClientRect());
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card._rect = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // 11. Copy Email
  initCopyEmail() {
    const copyBtns = document.querySelectorAll('[data-copy]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = btn.getAttribute('data-copy');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            window.showToast(`Copied ${text} to clipboard`);
          });
        }
      });
    });
  }

  // 12. Contact Form
  initContactForm() {
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = this.contactForm.querySelector('button[type="submit"]');
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const msg = document.getElementById('form-message').value;

      if (!name || !email || !msg) {
        window.showToast('Please fill out all fields');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting...';
      }

      setTimeout(() => {
        window.showToast('Message dispatched! Ahmed Waseem will reply shortly.');
        this.contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }, 700);
    });
  }

  // 13. Live Clock
  initLiveClock() {
    if (!this.footerClock) return;

    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false });
      this.footerClock.textContent = `Local Time: ${timeString}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

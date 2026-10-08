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
      cpp: [
        { num: "01", html: '<span class="code-token-comment">// AhmedWaseem.cpp — Core Systems & DSA</span>' },
        { num: "02", html: '<span class="code-token-kw">#include</span> <span class="code-token-str">&lt;iostream&gt;</span>' },
        { num: "03", html: '<span class="code-token-kw">#include</span> <span class="code-token-str">&lt;vector&gt;</span>' },
        { num: "04", html: '<span class="code-token-kw">class</span> SoftwareEngineer {' },
        { num: "05", html: '  <span class="code-token-kw">public</span>:' },
        { num: "06", html: '    std::string name = <span class="code-token-str">"Ahmed Waseem"</span>;' },
        { num: "07", html: '    std::string focus = <span class="code-token-str">"Software Development"</span>;' },
        { num: "08", html: '    <span class="code-token-kw">void</span> <span class="code-token-fn">solveProblem</span>() { <span class="code-token-comment">/* O(N log N) */</span> }' },
        { num: "09", html: '};' },
        { num: "10", html: '<span class="code-token-kw">int</span> <span class="code-token-fn">main</span>() { <span class="code-token-kw">return</span> 0; }' }
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
      const nameEl = this.brandLogo.querySelector('.brand-full-name');
      if (nameEl) scrambleEl(nameEl, 'AHMED WASEEM');
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

  // 4. Navigation Scroll Spy
  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset + 140;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  // 5. Scroll Reveal Observer
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
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

    renderSnippet('cpp');

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
        const lang = activeBtn ? activeBtn.getAttribute('data-lang') : 'cpp';
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

  // 7. Interactive Skills Inspector
  initSkillsInspector() {
    const skillPills = document.querySelectorAll('.skill-name-pill');
    const inspectorText = document.getElementById('skill-inspector-text');

    skillPills.forEach(pill => {
      const activate = () => {
        skillPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const name = pill.getAttribute('data-skill') || pill.textContent.replace('●', '').trim();
        const desc = pill.getAttribute('data-desc') || 'Core development technology in Ahmed Waseem\'s engineering stack.';

        if (inspectorText) {
          inspectorText.innerHTML = `<span class="skill-inspector-highlight">${name}</span>: ${desc}`;
        }
      };

      pill.addEventListener('click', activate);
      pill.addEventListener('mouseenter', activate);
    });
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

  // 10. 3D Card Tilt
  init3DCardTilt() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.achievement-card, .about-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
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

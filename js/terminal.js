/* ==========================================================================
   TERMINAL & CONTACT SYSTEM
   Interactive developer console CLI and futuristic message dispatcher.
   ========================================================================== */

class TerminalContactSystem {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.cliInput = document.getElementById('terminal-cli-input');
    this.contactForm = document.getElementById('terminal-contact-form');
    this.nameInput = document.getElementById('contact-name');
    this.emailInput = document.getElementById('contact-email');
    this.msgInput = document.getElementById('contact-msg');
    this.sendBtn = document.getElementById('btn-send-transmission');

    this.init();
  }

  init() {
    if (this.cliInput) {
      this.cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = this.cliInput.value.trim();
          if (cmd) {
            this.handleCommand(cmd);
            this.cliInput.value = '';
          }
        } else {
          if (window.soundEngine) window.soundEngine.playKeypress();
        }
      });
    }

    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  }

  printLine(promptText, text, isError = false) {
    if (!this.output) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (promptText) {
      line.innerHTML = `<span class="prompt">${promptText}</span> <span class="${isError ? 'error-text' : 'response'}">${text}</span>`;
    } else {
      line.innerHTML = `<span class="${isError ? 'error-text' : 'response'}">${text}</span>`;
    }
    
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  handleCommand(cmd) {
    const cleanCmd = cmd.toLowerCase().trim();
    this.printLine('ahmed@portfolio:~$', cmd);

    if (window.soundEngine) window.soundEngine.playClick();

    switch (cleanCmd) {
      case 'help':
        this.printLine('', 'Available CLI commands:');
        this.printLine('', '  about      - Display player profile & stats');
        this.printLine('', '  skills     - List current tech inventory');
        this.printLine('', '  projects   - Show completed & active quests');
        this.printLine('', '  stats      - Show developer telemetry');
        this.printLine('', '  sudo hire  - Recruiter authorization override');
        this.printLine('', '  clear      - Clear terminal screen');
        this.printLine('', '  date       - Print system server timestamp');
        break;

      case 'about':
        this.printLine('', 'PLAYER: Ahmed | LEVEL: Learning | CLASS: B.Tech CS');
        this.printLine('', 'FOCUS: Software Development & Frontend Engineering');
        this.printLine('', 'STATUS: Eager to build impactful web & software solutions.');
        break;

      case 'skills':
        this.printLine('', 'CORE: C, C++, Java, Python, SQL');
        this.printLine('', 'WEB: HTML5, CSS3, JavaScript, Supabase');
        this.printLine('', 'TOOLS & CLOUD: Git, GitHub, Vercel, Netlify, Render, Canva');
        break;

      case 'projects':
      case 'quests':
        this.printLine('', 'ACTIVE QUESTS:');
        this.printLine('', '  1. DevQuest RPG (Completed)');
        this.printLine('', '  2. CyberPulse Weather HUD (Completed)');
        this.printLine('', '  3. AlgoRealm Visualizer (In Progress)');
        this.printLine('', '  4. CampusHub Resource Vault (Completed)');
        this.printLine('', '  5. PixelCraft Canvas Engine (Experimental)');
        break;

      case 'sudo hire':
      case 'hire':
        this.printLine('', '🔓 [ACCESS GRANTED]: Candidate Profile Verified!');
        this.printLine('', '⭐ Recruiter perk unlocked: Ahmed is open for internships, freelance & collaborative builds!');
        this.printLine('', '👉 Scroll down or fill the contact form to initiate contact.');
        if (window.soundEngine) window.soundEngine.playAchievement();
        if (window.showToast) {
          window.showToast('🏆', 'RECRUITER OVERRIDE', 'Discovered the sudo hire easter egg (+50 XP)');
        }
        break;

      case 'stats':
        this.printLine('', 'TELEMETRY: Repos: 18+ | Commits: 450+ | Streak: 14 Days | Achievements: 8/10');
        break;

      case 'date':
        this.printLine('', `SYSTEM TIME: ${new Date().toUTCString()}`);
        break;

      case 'clear':
      case 'cls':
        this.output.innerHTML = '';
        break;

      default:
        this.printLine('', `Command not recognized: "${cmd}". Type "help" for a list of commands.`, true);
        break;
    }
  }

  handleFormSubmit() {
    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const msg = this.msgInput.value.trim();

    if (!name || !email || !msg) {
      this.printLine('!', 'ERROR: All fields (Name, Email, Message) are required.', true);
      return;
    }

    if (this.sendBtn) {
      this.sendBtn.disabled = true;
      this.sendBtn.textContent = 'TRANSMITTING...';
    }

    if (window.soundEngine) {
      window.soundEngine.playTransmission();
    }

    this.printLine('>', `ENCRYPTING PAYLOAD FROM [${name}] <${email}>...`);

    setTimeout(() => {
      this.printLine('>', `DISPATCHING DATA STREAM TO AHMED'S INBOX...`);

      setTimeout(() => {
        this.printLine('✓', `[200 OK] TRANSMISSION CONFIRMED! Thank you ${name}, Ahmed will review your message promptly.`);
        
        // Reset inputs
        this.nameInput.value = '';
        this.emailInput.value = '';
        this.msgInput.value = '';

        if (this.sendBtn) {
          this.sendBtn.disabled = false;
          this.sendBtn.textContent = 'SEND TRANSMISSION';
        }

        if (window.soundEngine) {
          window.soundEngine.playAchievement();
        }

        if (window.showToast) {
          window.showToast('📬', 'MESSAGE DISPATCHED', 'Transmission successfully sent to Ahmed (+50 XP)');
        }
      }, 700);
    }, 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TerminalContactSystem();
});

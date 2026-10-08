/* ==========================================================================
   AUDIO SYNTHESIZER (Web Audio API)
   Generates authentic retro 8-bit game sounds on the fly.
   Zero external audio files needed!
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('ahmed_portfolio_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('ahmed_portfolio_muted', this.isMuted);
    if (!this.isMuted) {
      this.init();
      this.playClick();
    }
    return !this.isMuted;
  }

  // Play a simple custom synthesized tone
  playTone(freq, type = 'square', duration = 0.08, volume = 0.05) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Button & link hover chirp
  playHover() {
    if (this.isMuted) return;
    this.playTone(520, 'sine', 0.04, 0.02);
  }

  // Crisp retro click sound
  playClick() {
    if (this.isMuted) return;
    this.playTone(880, 'triangle', 0.06, 0.04);
  }

  // Quest Select / Filter click
  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Quick two-tone arpeggio
    this.playTone(440, 'square', 0.05, 0.03);
    setTimeout(() => this.playTone(660, 'square', 0.08, 0.03), 40);
  }

  // Terminal Keypress tick
  playKeypress() {
    if (this.isMuted) return;
    this.playTone(320 + Math.random() * 80, 'triangle', 0.02, 0.015);
  }

  // Achievement Unlocked Fanfare
  playAchievement() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.15, 0.05);
      }, idx * 90);
    });
  }

  // Enter World Warp Sound
  playBootWarp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [220, 330, 440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.12, 0.04);
      }, idx * 70);
    });
  }

  // Transmission Sent Beep
  playTransmission() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.1, 0.04);
      }, idx * 60);
    });
  }
}

// Global instance
window.soundEngine = new SoundEngine();

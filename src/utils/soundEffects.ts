/**
 * Pure Web Audio API Synthesizer for tactile feedback
 * Zero external audio files, 100% offline, responsive and lightweight
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private lastActiveRoleId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pause ambient audio when tab is hidden, resume when visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          }
        } else {
          if (this.ctx && this.ctx.state === 'suspended' && this.isAmbienceActive && !this.ambienceMuted) {
            this.ctx.resume().catch(() => {});
          }
        }
      });

      // Unlock AudioContext on first touch / click for mobile Safari/Chrome
      const unlockAudio = () => {
        this.initCtx();
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft tactile click when tapping options
  public playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio failure silently
    }
  }

  // Ticking sound for countdown timer in blitz mode
  public playTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch {
      // Ignore
    }
  }

  // Dramatic impact when losing a life
  public playHeartBreak() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  // Pleasant chime on accurate analytical answer
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.22);
      });
    } catch {
      // Ignore
    }
  }

  // Quirky humorous bonk/pop when falling into the intuitive trap
  public playTrap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Mysterious door/portal opening sound (ambient drone + whispering resonance)
  public playDoorOpen() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Resonant deep portal stone sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(560, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.9);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.9);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);

      // Ethereal high whisper chime
      [587.33, 880, 1174.66].forEach((f, i) => {
        const chimeOsc = this.ctx!.createOscillator();
        const chimeGain = this.ctx!.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(f, now + 0.15 + i * 0.1);
        chimeGain.gain.setValueAtTime(0.001, now + 0.15 + i * 0.1);
        chimeGain.gain.linearRampToValueAtTime(0.04, now + 0.25 + i * 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75 + i * 0.1);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx!.destination);
        chimeOsc.start(now + 0.15 + i * 0.1);
        chimeOsc.stop(now + 0.8 + i * 0.1);
      });
    } catch {
      // Ignore
    }
  }

  // Level up or pattern discovery fanfare
  public playLevelUp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // --- ROLE-SPECIFIC AMBIENT SOUNDSCAPES ---
  private ambientGainNode: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientInterval: number | null = null;
  public isAmbienceActive: boolean = false;
  public ambienceMuted: boolean = false;

  public startRoleAmbience(roleId: string) {
    if (!this.enabled || this.ambienceMuted) return;
    this.stopRoleAmbience();

    try {
      this.initCtx();
      if (!this.ctx) return;

      this.ambientGainNode = this.ctx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGainNode.gain.linearRampToValueAtTime(0.035, this.ctx.currentTime + 1.2);
      // Gentle auto-fade down after 10 seconds to avoid headphone ear fatigue
      this.ambientGainNode.gain.setValueAtTime(0.035, this.ctx.currentTime + 8);
      this.ambientGainNode.gain.exponentialRampToValueAtTime(0.008, this.ctx.currentTime + 14);
      this.ambientGainNode.connect(this.ctx.destination);
      this.isAmbienceActive = true;

      if (roleId === 'judge') {
        // Courtroom: Deep acoustic resonance + gavel knock
        const lowDrone = this.ctx.createOscillator();
        lowDrone.type = 'sine';
        lowDrone.frequency.setValueAtTime(75, this.ctx.currentTime);
        lowDrone.connect(this.ambientGainNode);
        lowDrone.start();
        this.ambientOscillators.push(lowDrone);

        // Gavel knock every 7 seconds
        this.ambientInterval = window.setInterval(() => {
          if (!this.ctx || !this.isAmbienceActive || this.ambienceMuted) return;
          const now = this.ctx.currentTime;
          const gavelOsc = this.ctx.createOscillator();
          const gavelGain = this.ctx.createGain();
          gavelOsc.type = 'triangle';
          gavelOsc.frequency.setValueAtTime(140, now);
          gavelOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
          gavelGain.gain.setValueAtTime(0.12, now);
          gavelGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          gavelOsc.connect(gavelGain);
          gavelGain.connect(this.ctx.destination);
          gavelOsc.start(now);
          gavelOsc.stop(now + 0.15);
        }, 7000);
      } else if (roleId === 'sage') {
        // Sage: Serene nature breeze & pentatonic wind chimes
        const windDrone = this.ctx.createOscillator();
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
        windDrone.type = 'triangle';
        windDrone.frequency.setValueAtTime(110, this.ctx.currentTime);
        windDrone.connect(windFilter);
        windFilter.connect(this.ambientGainNode);
        windDrone.start();
        this.ambientOscillators.push(windDrone);

        // Gentle crystalline chimes every 4.5 seconds
        const chimePitches = [523.25, 659.25, 783.99, 1046.5];
        this.ambientInterval = window.setInterval(() => {
          if (!this.ctx || !this.isAmbienceActive || this.ambienceMuted) return;
          const now = this.ctx.currentTime;
          const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(pitch, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 1.4);
        }, 4500);
      } else if (roleId === 'detective') {
        // Detective: Noir suspense low cello-like drone
        const cello = this.ctx.createOscillator();
        cello.type = 'sawtooth';
        cello.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, this.ctx.currentTime);
        cello.connect(filter);
        filter.connect(this.ambientGainNode);
        cello.start();
        this.ambientOscillators.push(cello);
      } else if (roleId === 'police') {
        // Police: Tactical pulse & low surveillance tone
        const policeDrone = this.ctx.createOscillator();
        policeDrone.type = 'sine';
        policeDrone.frequency.setValueAtTime(95, this.ctx.currentTime);
        policeDrone.connect(this.ambientGainNode);
        policeDrone.start();
        this.ambientOscillators.push(policeDrone);
      } else if (roleId === 'herbalist') {
        // Herbalist: Bubbling elixir & water drops
        const brewDrone = this.ctx.createOscillator();
        brewDrone.type = 'sine';
        brewDrone.frequency.setValueAtTime(130, this.ctx.currentTime);
        brewDrone.connect(this.ambientGainNode);
        brewDrone.start();
        this.ambientOscillators.push(brewDrone);

        this.ambientInterval = window.setInterval(() => {
          if (!this.ctx || !this.isAmbienceActive || this.ambienceMuted) return;
          const now = this.ctx.currentTime;
          const drop = this.ctx.createOscillator();
          const dropGain = this.ctx.createGain();
          drop.type = 'sine';
          drop.frequency.setValueAtTime(350, now);
          drop.frequency.exponentialRampToValueAtTime(700, now + 0.08);
          dropGain.gain.setValueAtTime(0.03, now);
          dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          drop.connect(dropGain);
          dropGain.connect(this.ctx.destination);
          drop.start(now);
          drop.stop(now + 0.08);
        }, 3200);
      } else if (roleId === 'chef') {
        // Chef: Warm kitchen hum & culinary rhythm
        const kitchenDrone = this.ctx.createOscillator();
        kitchenDrone.type = 'triangle';
        kitchenDrone.frequency.setValueAtTime(120, this.ctx.currentTime);
        kitchenDrone.connect(this.ambientGainNode);
        kitchenDrone.start();
        this.ambientOscillators.push(kitchenDrone);
      }
    } catch {
      // Ignore audio failure
    }
  }

  public stopRoleAmbience() {
    this.isAmbienceActive = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientOscillators.length > 0) {
      this.ambientOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.ambientOscillators = [];
    }
    if (this.ambientGainNode) {
      try {
        this.ambientGainNode.disconnect();
      } catch {}
      this.ambientGainNode = null;
    }
  }

  public toggleAmbienceMute(): boolean {
    this.ambienceMuted = !this.ambienceMuted;
    if (this.ambienceMuted) {
      this.stopRoleAmbience();
    }
    return this.ambienceMuted;
  }
}

export const sounds = new SoundManager();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API synthesized sound generator - zero external audio assets required
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved audio preference
    const saved = localStorage.getItem('glass_calc_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('glass_calc_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playTap('number');
    }
    return this.isMuted;
  }

  public playTap(type: 'number' | 'operator' | 'action' | 'equal' | 'scientific' = 'number') {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'number') {
        // High, crisp subtle glass click (580Hz down to 220Hz very quickly)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'operator') {
        // Crisp resonant tick with dual overtone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.start(now);
        osc.stop(now + 0.065);
      } else if (type === 'action') {
        // Gentle soft alert / clear tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'scientific') {
        // Elegant crystal harmonic chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'equal') {
        // Rich harmonic resolve chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Soft haptic feedback when on supported devices
  public triggerHaptic(duration = 10) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignore vibration restrictions
      }
    }
  }
}

export const soundFx = new SoundManager();

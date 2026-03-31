// Web Audio API manager — procedural synth sounds + subtle ambient drone

const AudioManager = {
  ctx: null,
  enabled: true,
  ambientOscs: null,

  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },

  playTone(freq, duration, type = "sine", volume = 0.25, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.linearRampToValueAtTime(0, t + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  },

  playCorrect() {
    this.playTone(523, 0.15, "sine", 0.25, 0);
    this.playTone(659, 0.15, "sine", 0.25, 0.08);
    this.playTone(784, 0.2, "sine", 0.3, 0.16);
  },

  playWrong() {
    this.playTone(150, 0.3, "sawtooth", 0.15, 0);
    this.playTone(120, 0.25, "sawtooth", 0.1, 0.05);
  },

  playLevelComplete() {
    this.playTone(523, 0.15, "triangle", 0.25, 0);
    this.playTone(659, 0.15, "triangle", 0.25, 0.12);
    this.playTone(784, 0.15, "triangle", 0.25, 0.24);
    this.playTone(1047, 0.4, "triangle", 0.3, 0.36);
  },

  playPowerUp() {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.5);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(150, t);
    osc2.frequency.linearRampToValueAtTime(600, t + 0.5);
    gain2.gain.setValueAtTime(0.05, t);
    gain2.gain.linearRampToValueAtTime(0, t + 0.6);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.6);
  },

  playUnlock() {
    this.playTone(880, 0.12, "sine", 0.2, 0);
    this.playTone(1175, 0.12, "sine", 0.2, 0.1);
    this.playTone(1319, 0.25, "sine", 0.25, 0.2);
  },

  playLevelFailed() {
    this.playTone(400, 0.2, "triangle", 0.2, 0);
    this.playTone(300, 0.2, "triangle", 0.2, 0.15);
    this.playTone(200, 0.4, "triangle", 0.15, 0.3);
  },

  // ─── Subtle Space Ambient Drone ─────────────────────────
  startAmbient() {
    if (!this.enabled || !this.ctx || this.ambientOscs) return;

    // Low warm drone — two detuned sine waves for subtle movement
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.025, this.ctx.currentTime);
    gain1.connect(this.ctx.destination);

    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(75, this.ctx.currentTime);
    osc1.connect(gain1);
    osc1.start();

    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(113, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.018, this.ctx.currentTime);
    gain2.connect(this.ctx.destination);
    osc2.connect(gain2);
    osc2.start();

    // Very quiet high shimmer for spacey feel
    const osc3 = this.ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(440, this.ctx.currentTime);
    const gain3 = this.ctx.createGain();
    gain3.gain.setValueAtTime(0.006, this.ctx.currentTime);
    gain3.connect(this.ctx.destination);
    osc3.connect(gain3);
    osc3.start();

    this.ambientOscs = { osc1, osc2, osc3, gain1, gain2, gain3 };
  },

  stopAmbient() {
    if (!this.ambientOscs) return;
    const { osc1, osc2, osc3, gain1, gain2, gain3 } = this.ambientOscs;
    try { osc1.stop(); } catch {}
    try { osc2.stop(); } catch {}
    try { osc3.stop(); } catch {}
    try { gain1.disconnect(); } catch {}
    try { gain2.disconnect(); } catch {}
    try { gain3.disconnect(); } catch {}
    this.ambientOscs = null;
  },

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stopAmbient();
    return this.enabled;
  },
};

export default AudioManager;

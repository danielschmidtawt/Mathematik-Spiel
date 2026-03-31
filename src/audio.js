// Web Audio API manager — procedural synth sounds, no external assets

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
    // Ascending C5-E5-G5 chime
    this.playTone(523, 0.15, "sine", 0.25, 0);
    this.playTone(659, 0.15, "sine", 0.25, 0.08);
    this.playTone(784, 0.2, "sine", 0.3, 0.16);
  },

  playWrong() {
    // Low buzz
    this.playTone(150, 0.3, "sawtooth", 0.15, 0);
    this.playTone(120, 0.25, "sawtooth", 0.1, 0.05);
  },

  playLevelComplete() {
    // Victory fanfare: C5 E5 G5 C6 (held)
    this.playTone(523, 0.15, "triangle", 0.25, 0);
    this.playTone(659, 0.15, "triangle", 0.25, 0.12);
    this.playTone(784, 0.15, "triangle", 0.25, 0.24);
    this.playTone(1047, 0.4, "triangle", 0.3, 0.36);
  },

  playPowerUp() {
    // Ascending sweep
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
    // Layer a quiet square
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
    // Short bell chime for map unlock
    this.playTone(880, 0.12, "sine", 0.2, 0);
    this.playTone(1175, 0.12, "sine", 0.2, 0.1);
    this.playTone(1319, 0.25, "sine", 0.25, 0.2);
  },

  playLevelFailed() {
    // Descending sad tones
    this.playTone(400, 0.2, "triangle", 0.2, 0);
    this.playTone(300, 0.2, "triangle", 0.2, 0.15);
    this.playTone(200, 0.4, "triangle", 0.15, 0.3);
  },

  startAmbient() {
    if (!this.enabled || !this.ctx || this.ambientOscs) return;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.connect(this.ctx.destination);
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc1.connect(gain);
    osc1.start();
    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(120, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain2.connect(this.ctx.destination);
    osc2.connect(gain2);
    osc2.start();
    this.ambientOscs = { osc1, osc2, gain, gain2 };
  },

  stopAmbient() {
    if (!this.ambientOscs) return;
    const { osc1, osc2, gain, gain2 } = this.ambientOscs;
    try { osc1.stop(); } catch {}
    try { osc2.stop(); } catch {}
    try { gain.disconnect(); } catch {}
    try { gain2.disconnect(); } catch {}
    this.ambientOscs = null;
  },

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stopAmbient();
    return this.enabled;
  },
};

export default AudioManager;

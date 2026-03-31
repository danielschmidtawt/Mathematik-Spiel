// Web Audio API manager — procedural synth sounds + background melody

// ─── Musical Notes (Hz) ─────────────────────────────────
const N = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00,
  C5: 523.25, D5: 587.33, E5: 659.26, G5: 783.99, A5: 880.00,
};

// Chord progression: C → Am → F → G (each 4 seconds = 16s loop)
const CHORDS = [
  [N.C4, N.E4, N.G4],
  [N.A3, N.C4, N.E4],
  [N.F3, N.A3, N.C4],
  [N.G3, N.D4, N.G4],
];
const BASS_NOTES = [N.C2, N.A2, N.F2, N.G2];
const CHORD_DUR = 4.0; // seconds per chord

// Melody: gentle pentatonic, 16 notes at 0.6s each = 9.6s loop
const MELODY = [
  N.E4, N.G4, N.A4, N.G4,
  N.C5, N.A4, N.G4, N.E4,
  N.D4, N.E4, N.G4, N.A4,
  N.G4, N.E4, N.D4, N.C4,
];
const NOTE_DUR = 0.6;

const AudioManager = {
  ctx: null,
  enabled: true,
  ambientOscs: null,
  _timers: [],

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

  // ─── Background Melody ──────────────────────────────────

  _playMelodyNote(freq, masterGain) {
    if (!this.enabled || !this.ctx || !this.ambientOscs) return;
    const t = this.ctx.currentTime;
    const dur = NOTE_DUR * 0.85;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);
    // Soft envelope: fade in 40ms, sustain, fade out 80ms
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.04);
    gain.gain.setValueAtTime(0.07, t + dur - 0.08);
    gain.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _playChord(notes, bassNote, masterGain) {
    if (!this.enabled || !this.ctx || !this.ambientOscs) return;
    const t = this.ctx.currentTime;
    const dur = CHORD_DUR;

    // Pad: 3 soft sine oscillators for the chord
    notes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.5, t); // one octave lower for warmth
      // Gentle swell: 0.8s attack, hold, 0.5s release
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.035, t + 0.8);
      gain.gain.setValueAtTime(0.035, t + dur - 0.5);
      gain.gain.linearRampToValueAtTime(0, t + dur);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    });

    // Bass note
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = "sine";
    bassOsc.frequency.setValueAtTime(bassNote, t);
    bassGain.gain.setValueAtTime(0, t);
    bassGain.gain.linearRampToValueAtTime(0.025, t + 0.6);
    bassGain.gain.setValueAtTime(0.025, t + dur - 0.4);
    bassGain.gain.linearRampToValueAtTime(0, t + dur);
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start(t);
    bassOsc.stop(t + dur + 0.01);
  },

  startAmbient() {
    if (!this.enabled || !this.ctx || this.ambientOscs) return;

    // Master gain for the whole melody
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);

    this.ambientOscs = { masterGain };
    this._timers = [];

    // Melody loop
    let melodyIdx = 0;
    const melodyLoop = () => {
      if (!this.ambientOscs) return;
      this._playMelodyNote(MELODY[melodyIdx], masterGain);
      melodyIdx = (melodyIdx + 1) % MELODY.length;
      const tid = setTimeout(melodyLoop, NOTE_DUR * 1000);
      this._timers.push(tid);
    };

    // Chord + bass loop
    let chordIdx = 0;
    const chordLoop = () => {
      if (!this.ambientOscs) return;
      this._playChord(CHORDS[chordIdx], BASS_NOTES[chordIdx], masterGain);
      chordIdx = (chordIdx + 1) % CHORDS.length;
      const tid = setTimeout(chordLoop, CHORD_DUR * 1000);
      this._timers.push(tid);
    };

    // Start both loops (melody starts after a short delay for the pad to swell in)
    chordLoop();
    const startMelody = setTimeout(() => melodyLoop(), 800);
    this._timers.push(startMelody);
  },

  stopAmbient() {
    // Clear all scheduled timers
    this._timers.forEach((tid) => clearTimeout(tid));
    this._timers = [];

    if (!this.ambientOscs) return;
    try { this.ambientOscs.masterGain.disconnect(); } catch {}
    this.ambientOscs = null;
  },

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stopAmbient();
    return this.enabled;
  },
};

export default AudioManager;

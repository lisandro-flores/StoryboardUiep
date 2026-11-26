// Motor acústico generativo ligero (Web Audio API, 0 KB de archivos externos)
// Diseñado con tonos cálidos pentatónicos y brisa suave opcional para UX inmersiva

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private ambientNodes: {
    noiseSource?: AudioBufferSourceNode;
    droneOsc?: OscillatorNode;
    masterGain?: GainNode;
  } | null = null;
  private isAmbientPlaying = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Reproduce un micro-tono armónico cálido (escala pentatónica de Re mayor)
   * asociado a cada escena o nodo territorial (índice 0..7)
   */
  public playHarmonicNote(index = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    // D4, E4, F#4, A4, B4, D5, E5, F#5
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99];
    const freq = scale[Math.abs(index) % scale.length];

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.018, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.7);
    overtone.stop(now + 0.7);
  }

  /**
   * Activa o desactiva una atmósfera sutil de valle cálido (brisa filtrada + armónico suave)
   */
  public toggleAmbient(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    }

    const ctx = this.ensureContext();
    if (!ctx) return false;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Ruido rosa suave para simular brisa cálida entre cerros
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3 cálido

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.018, ctx.currentTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 1.4);

    noiseSource.connect(filter);
    filter.connect(masterGain);

    droneOsc.connect(droneGain);
    droneGain.connect(masterGain);

    masterGain.connect(ctx.destination);

    noiseSource.start();
    droneOsc.start();

    this.ambientNodes = { noiseSource, droneOsc, masterGain };
    this.isAmbientPlaying = true;
    return true;
  }

  public stopAmbient() {
    if (!this.ctx || !this.ambientNodes) {
      this.isAmbientPlaying = false;
      return;
    }
    const now = this.ctx.currentTime;
    const { noiseSource, droneOsc, masterGain } = this.ambientNodes;
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value || 0.1, now);
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }
    setTimeout(() => {
      try {
        noiseSource?.stop();
        droneOsc?.stop();
      } catch {
        // Ya detenidos
      }
    }, 650);

    this.ambientNodes = null;
    this.isAmbientPlaying = false;
  }
}

export const soundscape = new SoundscapeEngine();

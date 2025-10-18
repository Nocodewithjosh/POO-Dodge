const BACKGROUND_DURATION = 16; // seconds
const BACKGROUND_TEMPO = 110; // BPM

type SoundKey = 'background' | 'splat' | 'hit' | 'powerup' | 'warning' | 'start' | 'gameOver';

type AudioContextLike = AudioContext & { resume: () => Promise<void>; };

const isBrowser = typeof window !== 'undefined';

const getAudioContext = (): AudioContextLike | null => {
  if (!isBrowser) return null;
  const AudioContextConstructor =
    (window.AudioContext as typeof AudioContext | undefined) ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    console.warn('Web Audio API is not supported in this browser.');
    return null;
  }

  const context = new AudioContextConstructor();
  return context as AudioContextLike;
};

const createBackgroundBuffer = (context: AudioContext): AudioBuffer => {
  const duration = BACKGROUND_DURATION;
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = context.createBuffer(2, frameCount, sampleRate);

  const progression = [
    { chord: [220, 440, 660], bass: 110 }, // A minor
    { chord: [174.61, 349.23, 523.25], bass: 87.31 }, // F major
    { chord: [130.81, 261.63, 392], bass: 65.41 }, // C major
    { chord: [196, 392, 587.33], bass: 98 }, // G major
  ];

  const melody = [440, 494, 523.25, 587.33, 659.25, 587.33, 523.25, 494];
  const beatDuration = 60 / BACKGROUND_TEMPO;
  const barDuration = beatDuration * 4;
  const eighthNoteDuration = beatDuration / 2;

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    const barIndex = Math.floor(t / barDuration) % progression.length;
    const chordInfo = progression[barIndex];

    const bass = Math.sin(2 * Math.PI * chordInfo.bass * t);
    const chordEnvelopePhase = ((t % beatDuration) / beatDuration);
    const chordEnvelope = Math.pow(Math.sin(Math.PI * chordEnvelopePhase), 2);

    const chordWaves = chordInfo.chord.reduce((sum, freq) => sum + Math.sin(2 * Math.PI * freq * t), 0);

    const eighthIndex = Math.floor((t % (melody.length * eighthNoteDuration)) / eighthNoteDuration) % melody.length;
    const leadFreq = melody[eighthIndex];
    const leadPhase = ((t % eighthNoteDuration) / eighthNoteDuration);
    const leadEnvelope = Math.pow(Math.sin(Math.PI * Math.min(leadPhase, 1)), 2);
    const lead = Math.sin(2 * Math.PI * leadFreq * t) * leadEnvelope;

    const hatPhase = t % beatDuration;
    const hatEnvelope = hatPhase < 0.07 ? Math.pow(1 - hatPhase / 0.07, 2) : 0;
    const hat = Math.sin(2 * Math.PI * 8000 * t) * hatEnvelope;

    let sample = bass * 0.25 + chordWaves * 0.1 * chordEnvelope + lead * 0.15 + hat * 0.08;

    const sidePhase = Math.sin(2 * Math.PI * t / (barDuration * 2));
    const stereoSpread = sidePhase * 0.15;

    const fadeIn = Math.min(1, t / 0.3);
    const fadeOut = Math.min(1, (duration - t) / 0.3);
    const masterEnvelope = Math.min(fadeIn, fadeOut);
    sample *= masterEnvelope;

    left[i] = Math.max(-1, Math.min(1, sample * (1 - stereoSpread)));
    right[i] = Math.max(-1, Math.min(1, sample * (1 + stereoSpread)));
  }

  return buffer;
};

class AudioManager {
  private context: AudioContextLike | null = null;
  private masterGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private backgroundGain: GainNode | null = null;
  private backgroundSource: AudioBufferSourceNode | null = null;
  private backgroundBuffer: AudioBuffer | null = null;

  private ensureContext() {
    if (this.context) {
      if (this.context.state === 'suspended') {
        void this.context.resume();
      }
      return true;
    }

    const ctx = getAudioContext();
    if (!ctx) return false;

    this.context = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(ctx.destination);

    this.effectsGain = ctx.createGain();
    this.effectsGain.gain.value = 0.9;
    this.effectsGain.connect(this.masterGain);

    this.backgroundGain = ctx.createGain();
    this.backgroundGain.gain.value = 0.25;
    this.backgroundGain.connect(this.masterGain);

    this.backgroundBuffer = createBackgroundBuffer(ctx);

    return true;
  }

  play(name: SoundKey, loop = false) {
    if (!isBrowser) return;
    if (!this.ensureContext() || !this.context) return;

    switch (name) {
      case 'background':
        this.startBackground(loop);
        break;
      case 'splat':
        this.playSplat();
        break;
      case 'hit':
        this.playHit();
        break;
      case 'powerup':
        this.playPowerUp();
        break;
      case 'warning':
        this.playWarning();
        break;
      case 'start':
        this.playStart();
        break;
      case 'gameOver':
        this.playGameOver();
        break;
    }
  }

  stop(name: SoundKey) {
    if (name === 'background') {
      if (this.backgroundSource) {
        try {
          this.backgroundSource.stop();
        } catch (error) {
          console.warn('Failed to stop background track', error);
        }
        this.backgroundSource.disconnect();
        this.backgroundSource = null;
      }
    }
  }

  private startBackground(loop: boolean) {
    if (!this.context || !this.backgroundGain || !this.backgroundBuffer) return;
    if (this.backgroundSource) return;

    const source = this.context.createBufferSource();
    source.buffer = this.backgroundBuffer;
    source.loop = loop;
    source.loopStart = 0;
    source.loopEnd = this.backgroundBuffer.duration;
    source.connect(this.backgroundGain);
    source.start();
    source.onended = () => {
      if (this.backgroundSource === source) {
        this.backgroundSource = null;
      }
    };
    this.backgroundSource = source;
  }

  private playSplat() {
    if (!this.context || !this.effectsGain) return;
    const duration = 0.45;
    const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * duration, this.context.sampleRate);
    const channel = noiseBuffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) {
      const decay = 1 - i / channel.length;
      channel[i] = (Math.random() * 2 - 1) * Math.pow(decay, 2);
    }

    const source = this.context.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.context.currentTime);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.8, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.effectsGain);
    source.start();
  }

  private playHit() {
    if (!this.context || !this.effectsGain) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  private playPowerUp() {
    if (!this.context || !this.effectsGain) return;
    const now = this.context.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const start = now + index * 0.12;
      const osc = this.context!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      const gain = this.context!.createGain();
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.5, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.effectsGain!);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  }

  private playWarning() {
    if (!this.context || !this.effectsGain) return;
    const now = this.context.currentTime;
    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.25;
      const osc = this.context.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, start);

      const gain = this.context.createGain();
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.45, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(this.effectsGain);
      osc.start(start);
      osc.stop(start + 0.24);
    }
  }

  private playStart() {
    if (!this.context || !this.effectsGain) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(196, now);
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.4);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.52);
  }

  private playGameOver() {
    if (!this.context || !this.effectsGain) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392, now);
    osc.frequency.exponentialRampToValueAtTime(98, now + 0.8);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    const reverb = this.context.createBiquadFilter();
    reverb.type = 'lowpass';
    reverb.frequency.setValueAtTime(1200, now);

    osc.connect(gain);
    gain.connect(reverb);
    reverb.connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.86);
  }
}

export const audioManager = new AudioManager();

'use client';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private activeNodes: { [key: string]: any } = {};
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSoundscape(trackId: string, synthType: string) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentTrackId = trackId;
    this.isPlaying = true;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.activeNodes.masterGain = masterGain;

    if (synthType === 'rain' || synthType === 'white-noise') {
      // Noise buffer synthesis
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = synthType === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(synthType === 'rain' ? 800 : 1000, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      this.activeNodes.source = whiteNoise;
      this.activeNodes.filter = filter;
    } else if (synthType === 'ocean') {
      // Pink noise modulated by low frequency oscillator (LFO)
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.1;
      }

      const pinkNoise = this.ctx.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // LFO for wave swells
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // one wave every 8 seconds
      lfoGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      const waveGain = this.ctx.createGain();
      waveGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      lfo.connect(waveGain.gain);
      pinkNoise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);

      pinkNoise.start();
      lfo.start();

      this.activeNodes.source = pinkNoise;
      this.activeNodes.lfo = lfo;
    } else if (synthType === 'forest') {
      // Gentle forest wind + rhythmic soft birdsong chirps
      const bufferSize = this.ctx.sampleRate * 2.5;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const windSource = this.ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      windFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      windSource.start();

      // Morning songbird sine oscillator with bird-like modulation
      const birdOsc = this.ctx.createOscillator();
      const birdGain = this.ctx.createGain();
      birdOsc.type = 'sine';
      birdOsc.frequency.setValueAtTime(2600, this.ctx.currentTime);

      // LFO for chirp melody
      const chirpLfo = this.ctx.createOscillator();
      const chirpLfoGain = this.ctx.createGain();
      chirpLfo.frequency.setValueAtTime(3.5, this.ctx.currentTime);
      chirpLfoGain.gain.setValueAtTime(600, this.ctx.currentTime);

      chirpLfo.connect(birdOsc.frequency);
      birdGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      birdOsc.connect(birdGain);
      birdGain.connect(masterGain);

      birdOsc.start();
      chirpLfo.start();

      this.activeNodes.source = windSource;
      this.activeNodes.windFilter = windFilter;
      this.activeNodes.birdOsc = birdOsc;
      this.activeNodes.chirpLfo = chirpLfo;
    } else {
      // Tibetan singing bowl / meditative sine harmonics
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'triangle';

      osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // A3 calm frequency
      osc2.frequency.setValueAtTime(432, this.ctx.currentTime);
      osc3.frequency.setValueAtTime(108, this.ctx.currentTime);

      const bowlGain = this.ctx.createGain();
      bowlGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      osc1.connect(bowlGain);
      osc2.connect(bowlGain);
      osc3.connect(bowlGain);
      bowlGain.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      this.activeNodes.osc1 = osc1;
      this.activeNodes.osc2 = osc2;
      this.activeNodes.osc3 = osc3;
    }
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.activeNodes.masterGain && this.ctx) {
      this.activeNodes.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    try {
      Object.keys(this.activeNodes).forEach(key => {
        const node = this.activeNodes[key];
        if (node && typeof node.stop === 'function') {
          node.stop();
        }
        if (node && typeof node.disconnect === 'function') {
          node.disconnect();
        }
      });
    } catch (e) {
      console.warn('Audio cleanup warning', e);
    }
    this.activeNodes = {};
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      volume: this.volume
    };
  }
}

export const audioSynth = new AudioSynthesizer();

'use client';

/**
 * Universal Audio Recorder & 16kHz WAV Encoder
 * Captures clean microphone input across all modern browsers (Chrome, Safari, Edge, Firefox)
 * and formats it into standard 16kHz mono WAV for high-accuracy Gnani Prisma STT inference.
 */

class AudioRecorderService {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private pcmSamples: Float32Array[] = [];
  private totalSamples = 0;
  private isRecording = false;
  private sampleRate = 16000;
  private onVolumeChange: ((volume: number) => void) | null = null;
  private animFrameId: number | null = null;
  private analyser: AnalyserNode | null = null;

  public async start(onVolume?: (volume: number) => void): Promise<boolean> {
    if (this.isRecording) {
      this.stop();
    }

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone access is not supported in this browser.');
    }

    this.onVolumeChange = onVolume || null;
    this.pcmSamples = [];
    this.totalSamples = 0;

    // Request microphone access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const inputSampleRate = this.audioContext.sampleRate;
    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

    // Audio Visualizer Analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.sourceNode.connect(this.analyser);

    // Volume level polling
    if (this.onVolumeChange) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const pollVolume = () => {
        if (!this.isRecording || !this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, avg / 128);
        this.onVolumeChange?.(normalized);
        this.animFrameId = requestAnimationFrame(pollVolume);
      };
      this.animFrameId = requestAnimationFrame(pollVolume);
    }

    // Audio processor to collect PCM samples
    const bufferSize = 4096;
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);

      // Downsample to 16,000 Hz if needed
      const downsampled = this.downsampleBuffer(inputData, inputSampleRate, this.sampleRate);
      this.pcmSamples.push(downsampled);
      this.totalSamples += downsampled.length;
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    this.isRecording = true;
    return true;
  }

  public async stop(): Promise<{ blob: Blob; durationSec: number }> {
    this.isRecording = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.processorNode) {
      try {
        this.processorNode.disconnect();
      } catch (e) {}
      this.processorNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    // Merge PCM sample buffers
    const merged = new Float32Array(this.totalSamples);
    let offset = 0;
    for (const chunk of this.pcmSamples) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const durationSec = this.totalSamples / this.sampleRate;
    const wavBlob = this.encodeWAV(merged, this.sampleRate);

    this.pcmSamples = [];
    this.totalSamples = 0;

    return { blob: wavBlob, durationSec };
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  private downsampleBuffer(buffer: Float32Array, inputRate: number, outputRate: number): Float32Array {
    if (inputRate === outputRate) {
      return new Float32Array(buffer);
    }
    const sampleRateRatio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  private encodeWAV(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (v: DataView, off: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        v.setUint8(off + i, str.charCodeAt(i));
      }
    };

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (1 = raw linear PCM) */
    view.setUint16(20, 1, true);
    /* channel count (mono = 1) */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Float32 to 16-bit signed PCM
    let writeOffset = 44;
    for (let i = 0; i < samples.length; i++, writeOffset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(writeOffset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  }
}

export const audioRecorder = new AudioRecorderService();

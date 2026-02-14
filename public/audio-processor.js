// Mic → Float32 → 16-bit PCM (16 kHz) → postMessage chunks to main thread
const TARGET_SAMPLE_RATE = 16000;
const CHUNK_BYTES = 1024;


class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const ctxRate = (options && options.processorOptions && options.processorOptions.sampleRate) || 16000;
    this.downsampleRatio = Math.max(1, Math.round(ctxRate / TARGET_SAMPLE_RATE));
    this.buffer = [];
  }

  floatTo16(float32) {
    const s = Math.max(-1, Math.min(1, float32));
    return s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input?.length) return true;

    const channel = input[0];
    if (!channel?.length) return true;

    for (let i = 0; i < channel.length; i += this.downsampleRatio) {
      const sample = this.floatTo16(channel[i]);
      this.buffer.push(sample & 0xff, (sample >> 8) & 0xff);
    }

    while (this.buffer.length >= CHUNK_BYTES) {
      const chunk = new Uint8Array(this.buffer.splice(0, CHUNK_BYTES));
      this.port.postMessage(chunk.buffer, [chunk.buffer]);
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);

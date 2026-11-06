import type { AudioCues, ScriptLine } from '@/entities/test';

const SAMPLE_RATE = 24000;
const BITRATE_KBPS = 64;
const DEFAULT_PAUSE_SEC = 0.6;
const LEAD_IN_SEC = 0.5;
const FRAME_SIZE = 1152;
const BYTES_PER_SAMPLE = 2;

export type RenderedAudio = { blob: Blob; durationSec: number; audioAt: AudioCues };

type Synthesize = (voice: string, text: string) => Promise<ArrayBuffer>;

type Progress = (done: number, total: number) => void;

const silence = (seconds: number) => new Int16Array(Math.round(seconds * SAMPLE_RATE));

const concat = (chunks: Int16Array[]) => {
  const merged = new Int16Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  chunks.reduce((offset, chunk) => {
    merged.set(chunk, offset);
    return offset + chunk.length;
  }, 0);
  return merged;
};

const encodeMp3 = async (samples: Int16Array) => {
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  const encoder = new Mp3Encoder(1, SAMPLE_RATE, BITRATE_KBPS);
  const frames: Uint8Array[] = [];
  for (let offset = 0; offset < samples.length; offset += FRAME_SIZE) {
    const frame = encoder.encodeBuffer(samples.subarray(offset, offset + FRAME_SIZE));
    if (frame.length) frames.push(new Uint8Array(frame));
  }
  const tail = encoder.flush();
  if (tail.length) frames.push(new Uint8Array(tail));
  return new Blob(frames as BlobPart[], { type: 'audio/mpeg' });
};

const toSamples = (buffer: ArrayBuffer) => new Int16Array(buffer, 0, Math.floor(buffer.byteLength / BYTES_PER_SAMPLE));

export const renderScript = async (lines: ScriptLine[], synthesize: Synthesize, onProgress?: Progress): Promise<RenderedAudio> => {
  const spoken = lines.filter((line) => line.text.trim());
  const chunks = [silence(LEAD_IN_SEC)];
  const audioAt: AudioCues = {};
  let length = chunks[0].length;

  for (const [index, line] of spoken.entries()) {
    onProgress?.(index, spoken.length);
    if (line.question) audioAt[line.question] = Math.floor(length / SAMPLE_RATE);
    const speech = toSamples(await synthesize(line.voice, line.text));
    const pause = silence(line.pauseAfter ?? DEFAULT_PAUSE_SEC);
    chunks.push(speech, pause);
    length += speech.length + pause.length;
  }

  onProgress?.(spoken.length, spoken.length);
  return { blob: await encodeMp3(concat(chunks)), durationSec: Math.ceil(length / SAMPLE_RATE), audioAt };
};

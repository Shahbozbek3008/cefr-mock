import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Mp3Encoder } from '@breezystack/lamejs';
import { loadSeed, seedDir } from './load-seed.mjs';

const SAMPLE_RATE = 24000;
const BITRATE_KBPS = 64;
const DEFAULT_PAUSE_SEC = 0.6;
const FRAME = 1152;

const voices = {
  narrator: 'aura-2-draco-en',
  woman: 'aura-2-thalia-en',
  man: 'aura-2-apollo-en',
  woman2: 'aura-2-luna-en',
  man2: 'aura-2-orion-en',
  woman3: 'aura-2-pandora-en',
  man3: 'aura-2-zeus-en',
};

const apiKey = process.env.DEEPGRAM_API_KEY;
const force = process.argv.includes('--force');
const only = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

if (!apiKey) {
  console.error('Set DEEPGRAM_API_KEY before running this script.');
  process.exit(1);
}

const speak = async (voice, text) => {
  const url = `https://api.deepgram.com/v1/speak?model=${voices[voice]}&encoding=linear16&sample_rate=${SAMPLE_RATE}&container=none`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Token ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error(`Deepgram ${response.status}: ${await response.text()}`);
  const buffer = await response.arrayBuffer();
  return new Int16Array(buffer, 0, Math.floor(buffer.byteLength / 2));
};

const silence = (seconds) => new Int16Array(Math.round(seconds * SAMPLE_RATE));

const concat = (chunks) => {
  const merged = new Int16Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });
  return merged;
};

const encodeMp3 = (samples) => {
  const encoder = new Mp3Encoder(1, SAMPLE_RATE, BITRATE_KBPS);
  const parts = [];
  for (let index = 0; index < samples.length; index += FRAME) {
    const frame = encoder.encodeBuffer(samples.subarray(index, index + FRAME));
    if (frame.length) parts.push(Buffer.from(frame));
  }
  const tail = encoder.flush();
  if (tail.length) parts.push(Buffer.from(tail));
  return Buffer.concat(parts);
};

const renderPart = async (outputDir, { partId, lines }) => {
  const chunks = [silence(0.5)];
  const audioAt = {};
  let length = chunks[0].length;

  for (const line of lines) {
    if (line.question) audioAt[line.question] = Math.floor(length / SAMPLE_RATE);
    const speech = await speak(line.voice, line.text);
    const pause = silence(line.pauseAfter ?? DEFAULT_PAUSE_SEC);
    chunks.push(speech, pause);
    length += speech.length + pause.length;
  }

  writeFileSync(join(outputDir, `${partId}.mp3`), encodeMp3(concat(chunks)));
  return { durationSec: Math.ceil(length / SAMPLE_RATE), audioAt };
};

const { testContents } = loadSeed('tests');

for (const [testId, content] of Object.entries(testContents)) {
  if (only.length && !only.includes(testId)) continue;
  const outputDir = join(seedDir, 'audio', testId);
  const manifestPath = join(outputDir, 'manifest.json');
  if (existsSync(manifestPath) && !force) {
    console.log(`${testId}: already generated, skipping (use --force to rebuild)`);
    continue;
  }

  mkdirSync(outputDir, { recursive: true });
  const manifest = {};
  for (const part of content.scripts) {
    const rendered = await renderPart(outputDir, part);
    manifest[part.partId] = { file: `${testId}/${part.partId}.mp3`, ...rendered };
    console.log(`${testId}/${part.partId}.mp3: ${rendered.durationSec}s`);
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

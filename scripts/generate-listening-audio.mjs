import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mp3Encoder } from '@breezystack/lamejs';
import ts from 'typescript';

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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seedDir = join(root, 'supabase', 'seed');
const outputDir = join(seedDir, 'audio');
const require = createRequire(import.meta.url);
const apiKey = process.env.DEEPGRAM_API_KEY;

if (!apiKey) {
  console.error('Set DEEPGRAM_API_KEY before running this script.');
  process.exit(1);
}

const load = (file) => {
  const { outputText } = ts.transpileModule(readFileSync(join(seedDir, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  new Function('module', 'exports', 'require', outputText)(module, module.exports, require);
  return module.exports;
};

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
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Int16Array(total);
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

const renderPart = async ({ partId, lines }) => {
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

  const file = `${partId}.mp3`;
  writeFileSync(join(outputDir, file), encodeMp3(concat(chunks)));
  const durationSec = Math.ceil(length / SAMPLE_RATE);
  console.log(`${file}: ${durationSec}s, ${lines.length} lines`);
  return [partId, { file, durationSec, audioAt }];
};

const { listeningScripts } = load('listening-scripts.ts');
mkdirSync(outputDir, { recursive: true });

const manifest = {};
for (const script of listeningScripts) {
  const [partId, entry] = await renderPart(script);
  manifest[partId] = entry;
}

writeFileSync(join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Manifest written.');

import { readFileSync } from 'node:fs';

const SOURCE = 'uz';
const LOCALES = ['ru', 'en'];

const load = (l) => JSON.parse(readFileSync(new URL(`../src/messages/${l}.json`, import.meta.url), 'utf8'));

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]));

const source = new Set(flatten(load(SOURCE)));
let failed = false;

for (const locale of LOCALES) {
  const keys = new Set(flatten(load(locale)));
  const missing = [...source].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !source.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`✗ ${locale}: missing ${missing.length}, extra ${extra.length}`);
    missing.forEach((k) => console.error(`  - missing ${k}`));
    extra.forEach((k) => console.error(`  + extra   ${k}`));
  } else {
    console.log(`✓ ${locale}: ${keys.size} keys match ${SOURCE}`);
  }
}

process.exit(failed ? 1 : 0);

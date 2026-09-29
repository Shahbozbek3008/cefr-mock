import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const seedDir = join(root, 'supabase', 'seed');

const nodeRequire = createRequire(import.meta.url);
const cache = new Map();

const resolveFile = (base, specifier) => {
  const target = resolve(dirname(base), specifier);
  const candidate = [`${target}.ts`, join(target, 'index.ts'), target].find((file) => existsSync(file));
  if (!candidate) throw new Error(`Cannot resolve ${specifier} from ${base}`);
  return candidate;
};

const loadFile = (file) => {
  if (cache.has(file)) return cache.get(file).exports;
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  cache.set(file, module);
  const localRequire = (specifier) =>
    specifier.startsWith('.') ? loadFile(resolveFile(file, specifier)) : nodeRequire(specifier);
  new Function('module', 'exports', 'require', outputText)(module, module.exports, localRequire);
  return module.exports;
};

export const loadSeed = (relativePath) => loadFile(resolveFile(join(seedDir, 'index.ts'), `./${relativePath}`));

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const seedDir = join(root, 'supabase', 'seed');
const output = join(root, 'supabase', 'migrations', process.argv[2] ?? '20260928000002_seed_tests.sql');
const manifestPath = join(seedDir, 'audio', 'manifest.json');
const require = createRequire(import.meta.url);

const load = (file) => {
  const source = readFileSync(join(seedDir, file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  new Function('module', 'exports', 'require', outputText)(module, module.exports, require);
  return module.exports;
};

const { listeningParts, readingParts, writingTasks, speakingQuestions } = load('content.ts');
const { seedTests, sectionMinutes } = load('tests.ts');

const stripQuestion = ({ answer, explanation, ...question }) => question;
const audio = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const withAudio = (part) =>
  audio[part.id]
    ? { ...part, audio: audio[part.id].file, durationSec: audio[part.id].durationSec, audioAt: audio[part.id].audioAt }
    : part;

const stripParts = (parts) => parts.map((part) => ({ ...withAudio(part), questions: part.questions.map(stripQuestion) }));
const countQuestions = (parts) => parts.reduce((sum, part) => sum + part.questions.length, 0);

const keys = Object.fromEntries(
  [...listeningParts, ...readingParts]
    .flatMap((part) => part.questions)
    .map(({ id, answer, explanation }) => [id, explanation ? { answer, explanation } : { answer }]),
);

const content = {
  sections: [
    {
      kind: 'listening',
      title: 'Listening',
      parts: listeningParts.length,
      questions: countQuestions(listeningParts),
      minutes: sectionMinutes.listening,
    },
    {
      kind: 'reading',
      title: 'Reading',
      parts: readingParts.length,
      questions: countQuestions(readingParts),
      minutes: sectionMinutes.reading,
    },
    { kind: 'writing', title: 'Writing', parts: writingTasks.length, minutes: sectionMinutes.writing },
    { kind: 'speaking', title: 'Speaking', parts: 3, minutes: sectionMinutes.speaking, approx: true },
  ],
  listening: stripParts(listeningParts),
  reading: stripParts(readingParts),
  writing: writingTasks,
  speaking: speakingQuestions,
};

const json = (value) => `$json$${JSON.stringify(value)}$json$::jsonb`;
const text = (value) => `'${String(value).replace(/'/g, "''")}'`;

const testRows = seedTests.map((test) =>
  [
    text(test.id),
    test.number,
    text(`Mock Test #${test.number}`),
    test.formatMonth,
    test.formatYear,
    test.isNew,
    !test.isPro,
    test.isPro,
    json(content),
  ].join(', '),
);

const sql = `insert into public.tests (id, number, title, format_month, format_year, is_new, is_free, is_pro, content)
values
${testRows.map((row) => `  (${row})`).join(',\n')}
on conflict (id) do update set
  number = excluded.number,
  title = excluded.title,
  format_month = excluded.format_month,
  format_year = excluded.format_year,
  is_new = excluded.is_new,
  is_free = excluded.is_free,
  is_pro = excluded.is_pro,
  content = excluded.content;

insert into public.test_keys (test_id, keys)
select id, ${json(keys)} from public.tests where id in (${seedTests.map((test) => text(test.id)).join(', ')})
on conflict (test_id) do update set keys = excluded.keys;
`;

writeFileSync(output, sql);
console.log(`Seed written: ${output}`);

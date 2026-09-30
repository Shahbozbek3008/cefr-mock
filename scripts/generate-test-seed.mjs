import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSeed, root, seedDir } from './load-seed.mjs';

const output = join(root, 'supabase', 'migrations', process.argv[2] ?? 'seed_tests.sql');
const EXPECTED_QUESTIONS = 35;

const { testContents } = loadSeed('tests');
const { seedTests, sectionMinutes } = loadSeed('tests-meta');

const readManifest = (testId) => {
  const path = join(seedDir, 'audio', testId, 'manifest.json');
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
};

const questionsOf = (parts) => parts.flatMap((part) => part.questions);

const validate = (testId, content) => {
  const listening = questionsOf(content.listening);
  const reading = questionsOf(content.reading);
  const cued = new Set(content.scripts.flatMap((part) => part.lines.map((line) => line.question).filter(Boolean)));
  const problems = [
    listening.length !== EXPECTED_QUESTIONS && `listening has ${listening.length} questions`,
    reading.length !== EXPECTED_QUESTIONS && `reading has ${reading.length} questions`,
    ...listening.filter((q) => !cued.has(q.number)).map((q) => `listening question ${q.number} has no audio cue`),
    content.scripts.length !== content.listening.length && 'every listening part needs a script',
  ].filter(Boolean);
  if (problems.length) throw new Error(`${testId}: ${problems.join('; ')}`);
};

const stripQuestion = ({ answer, explanation, ...question }) => question;

const buildContent = (testId, content) => {
  const audio = readManifest(testId);
  const withAudio = (part) =>
    audio[part.id]
      ? {
          ...part,
          audio: audio[part.id].file,
          durationSec: audio[part.id].durationSec,
          audioAt: audio[part.id].audioAt,
        }
      : part;
  const strip = (parts) => parts.map((part) => ({ ...part, questions: part.questions.map(stripQuestion) }));

  return {
    sections: [
      {
        kind: 'listening',
        title: 'Listening',
        parts: content.listening.length,
        questions: EXPECTED_QUESTIONS,
        minutes: sectionMinutes.listening,
      },
      {
        kind: 'reading',
        title: 'Reading',
        parts: content.reading.length,
        questions: EXPECTED_QUESTIONS,
        minutes: sectionMinutes.reading,
      },
      { kind: 'writing', title: 'Writing', parts: content.writing.length, minutes: sectionMinutes.writing },
      { kind: 'speaking', title: 'Speaking', parts: 3, minutes: sectionMinutes.speaking, approx: true },
    ],
    listening: strip(content.listening.map(withAudio)),
    reading: strip(content.reading),
    writing: content.writing,
    speaking: content.speaking,
  };
};

const keysOf = (content) =>
  Object.fromEntries(
    [...questionsOf(content.listening), ...questionsOf(content.reading)].map(({ id, answer, explanation }) => [
      id,
      explanation ? { answer, explanation } : { answer },
    ]),
  );

const scriptsOf = (content) =>
  content.scripts.map(({ partId, lines }) => ({
    partId,
    lines: lines.map(({ voice, text, question }) => (question ? { voice, text, question } : { voice, text })),
  }));

const json = (value) => `$json$${JSON.stringify(value)}$json$::jsonb`;
const text = (value) => `'${String(value).replace(/'/g, "''")}'`;

const statements = seedTests.map((test) => {
  const content = testContents[test.id];
  if (!content) throw new Error(`No content for ${test.id}`);
  validate(test.id, content);

  return `insert into public.tests (id, number, title, format_month, format_year, is_new, is_free, is_pro, content)
values (${[
    text(test.id),
    test.number,
    text(`Mock Test #${test.number}`),
    test.formatMonth,
    test.formatYear,
    test.isNew,
    !test.isPro,
    test.isPro,
    json(buildContent(test.id, content)),
  ].join(', ')})
on conflict (id) do update set
  number = excluded.number,
  title = excluded.title,
  format_month = excluded.format_month,
  format_year = excluded.format_year,
  is_new = excluded.is_new,
  is_free = excluded.is_free,
  is_pro = excluded.is_pro,
  content = excluded.content;

insert into public.test_keys (test_id, keys, scripts)
values (${text(test.id)}, ${json(keysOf(content))}, ${json(scriptsOf(content))})
on conflict (test_id) do update set keys = excluded.keys, scripts = excluded.scripts;
`;
});

writeFileSync(output, statements.join('\n'));
console.log(`Seed written for ${seedTests.length} tests: ${output}`);

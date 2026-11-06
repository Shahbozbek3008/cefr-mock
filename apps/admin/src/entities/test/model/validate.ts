import { answerKeysFor } from './completeness';
import { EXPECTED_QUESTIONS, TEST_ID_PATTERN } from './constants';
import type { DraftListeningPart, DraftQuestion, DraftReadingPart, QuestionSection, TestDraft } from './types';

export type IssueCode =
  | 'invalidId'
  | 'titleRequired'
  | 'numberInvalid'
  | 'questionCount'
  | 'notSequential'
  | 'duplicateNumber'
  | 'answerMissing'
  | 'matchWithoutChoices'
  | 'answerNotInChoices'
  | 'emptyOption'
  | 'audioMissing'
  | 'instructionEmpty'
  | 'scriptCuesMissing'
  | 'passageEmpty'
  | 'writingMissing'
  | 'writingPromptEmpty'
  | 'speakingMissing'
  | 'speakingPromptEmpty';

export type IssueSection = 'general' | QuestionSection | 'writing' | 'speaking';

export type IssueLocation = { section: IssueSection; part?: number; question?: number; item?: number };

export type Issue = {
  level: 'error' | 'warning';
  code: IssueCode;
  at: IssueLocation;
  values?: Record<string, string | number>;
};

type Part = DraftListeningPart | DraftReadingPart;

const error = (code: IssueCode, at: IssueLocation, values?: Issue['values']): Issue => ({ level: 'error', code, at, values });

const warning = (code: IssueCode, at: IssueLocation, values?: Issue['values']): Issue => ({ level: 'warning', code, at, values });

const checkQuestion = (section: QuestionSection, part: Part, question: DraftQuestion): Issue[] => {
  const at = { section, part: part.index, question: question.number };
  const allowed = answerKeysFor(question, part.choices);
  const issues: Issue[] = [];

  if (!question.answer.trim()) issues.push(error('answerMissing', at));
  if (question.kind === 'match' && part.choices.length === 0) issues.push(error('matchWithoutChoices', at));
  else if (allowed && question.answer && !allowed.includes(question.answer)) {
    issues.push(error('answerNotInChoices', at, { answer: question.answer, allowed: allowed.join(', ') }));
  }
  if (question.kind === 'mcq' && question.options.some((option) => !option.text.trim())) issues.push(warning('emptyOption', at));

  return issues;
};

const checkSection = (section: QuestionSection, parts: Part[]): Issue[] => {
  const entries = parts.flatMap((part) => part.questions.map((question) => ({ part, question })));
  const issues: Issue[] = [];

  if (entries.length !== EXPECTED_QUESTIONS) {
    issues.push(error('questionCount', { section }, { count: entries.length, expected: EXPECTED_QUESTIONS }));
  }

  const seen = new Set<number>();
  entries.forEach(({ part, question }) => {
    if (seen.has(question.number)) issues.push(error('duplicateNumber', { section, part: part.index, question: question.number }));
    seen.add(question.number);
    issues.push(...checkQuestion(section, part, question));
  });

  const numbers = [...seen].sort((a, b) => a - b);
  if (numbers.some((number, i) => number !== i + 1)) issues.push(warning('notSequential', { section }, { count: numbers.length }));

  return issues;
};

const checkListeningParts = (parts: DraftListeningPart[]): Issue[] =>
  parts.flatMap((part) => {
    const at = { section: 'listening' as const, part: part.index };
    const cued = new Set(part.script.map((line) => line.question).filter(Boolean));
    return [
      ...(part.audio ? [] : [error('audioMissing', at)]),
      ...(part.instruction.trim() ? [] : [warning('instructionEmpty', at)]),
      ...(part.script.length > 0 && part.questions.some((question) => !cued.has(question.number)) ? [warning('scriptCuesMissing', at)] : []),
    ];
  });

const checkReadingParts = (parts: DraftReadingPart[]): Issue[] =>
  parts.flatMap((part) => (part.passage.some((paragraph) => paragraph.text.trim()) ? [] : [error('passageEmpty', { section: 'reading', part: part.index })]));

const checkGeneral = (draft: TestDraft): Issue[] => {
  const at = { section: 'general' as const };
  return [
    ...(TEST_ID_PATTERN.test(draft.id) ? [] : [error('invalidId', at)]),
    ...(draft.title.trim() ? [] : [error('titleRequired', at)]),
    ...(Number.isInteger(draft.number) && draft.number > 0 ? [] : [error('numberInvalid', at)]),
  ];
};

const checkWriting = (draft: TestDraft): Issue[] => [
  ...(draft.writing.length ? [] : [error('writingMissing', { section: 'writing' })]),
  ...draft.writing.flatMap((task, i) => (task.prompt.trim() ? [] : [error('writingPromptEmpty', { section: 'writing', item: i + 1 })])),
];

const checkSpeaking = (draft: TestDraft): Issue[] => [
  ...(draft.speaking.length ? [] : [error('speakingMissing', { section: 'speaking' })]),
  ...draft.speaking.flatMap((question, i) => (question.prompt.trim() ? [] : [error('speakingPromptEmpty', { section: 'speaking', item: i + 1 })])),
];

const reindexed = <P extends { index: number }>(parts: P[]) => parts.map((part, i) => ({ ...part, index: i + 1 }));

export const validateDraft = (draft: TestDraft): Issue[] => {
  const listening = reindexed(draft.listening);
  const reading = reindexed(draft.reading);
  return [
    ...checkGeneral(draft),
    ...checkSection('listening', listening),
    ...checkListeningParts(listening),
    ...checkSection('reading', reading),
    ...checkReadingParts(reading),
    ...checkWriting(draft),
    ...checkSpeaking(draft),
  ];
};

export const errorsOf = (issues: Issue[]) => issues.filter((issue) => issue.level === 'error');

import type { Choice } from '@cefr/core';
import { createDraft, createListeningPart, createQuestion, createReadingPart, defaultTitleFor, testIdFor } from './factories';
import type { DraftQuestion, QuestionSection, TestDraft } from './types';

const blankChoices = (choices: Choice[]): Choice[] => choices.map(({ key }) => ({ key, text: '' }));

const blankQuestion = (section: QuestionSection, question: DraftQuestion): DraftQuestion => ({
  ...createQuestion(section, question.number, question.kind),
  options: blankChoices(question.options),
  group: question.group,
});

export const structureOf = (source: TestDraft, number: number): TestDraft => ({
  ...createDraft(number),
  formatMonth: source.formatMonth,
  formatYear: source.formatYear,
  durationLabel: source.durationLabel,
  listening: source.listening.map((part, i) => ({
    ...createListeningPart(i + 1),
    instruction: part.instruction,
    emphasis: part.emphasis,
    title: part.title,
    map: part.map,
    choices: blankChoices(part.choices),
    questions: part.questions.map((question) => blankQuestion('listening', question)),
  })),
  reading: source.reading.map((part, i) => ({
    ...createReadingPart(i + 1),
    title: part.title,
    instruction: part.instruction,
    passage: part.passage.map(({ label }) => ({ label, text: '' })),
    choices: blankChoices(part.choices),
    questions: part.questions.map((question) => blankQuestion('reading', question)),
  })),
  writing: source.writing.map((task) => ({ ...task, context: task.context === undefined ? undefined : '', prompt: '' })),
  speaking: source.speaking.map((question) => ({ ...question, prompt: '', image: question.image === undefined ? undefined : '' })),
});

export const copyOf = (source: TestDraft, number: number): TestDraft => ({
  ...source,
  id: testIdFor(number),
  number,
  title: defaultTitleFor(number),
  isNew: true,
  listening: source.listening.map((part) => ({ ...part, audio: '', durationSec: 0, audioAt: {} })),
});

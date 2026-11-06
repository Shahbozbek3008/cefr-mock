import type { Choice } from '@cefr/core';
import { TFNG_ANSWERS } from './constants';
import type { DraftQuestion } from './types';

const filled = (value: string | undefined) => Boolean(value?.trim());

export const answerKeysFor = (question: Pick<DraftQuestion, 'kind' | 'options'>, partChoices: Choice[]) => {
  if (question.kind === 'mcq') return question.options.map((option) => option.key);
  if (question.kind === 'tfng') return [...TFNG_ANSWERS];
  if (question.kind === 'match') return partChoices.map((choice) => choice.key);
  return null;
};

export const isQuestionComplete = (question: DraftQuestion, partChoices: Choice[]) => {
  const keys = answerKeysFor(question, partChoices);
  const answered = filled(question.answer) && (!keys || keys.includes(question.answer));
  const promptReady = question.kind === 'mcq' || filled(question.prompt);
  const optionsReady = question.kind !== 'mcq' || (question.options.length > 0 && question.options.every((option) => filled(option.text)));
  return answered && promptReady && optionsReady;
};

export const completedCount = (questions: DraftQuestion[], partChoices: Choice[]) =>
  questions.filter((question) => isQuestionComplete(question, partChoices)).length;

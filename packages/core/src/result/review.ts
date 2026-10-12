import type { AnswerKey, AnswerKeys, Question } from '../test/types';
import type { AnswerReview, Criterion, SectionReview } from './types';

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const accepted = (key: AnswerKey) => key.answer.split('|');

export const isCorrect = (key: AnswerKey | undefined, value: string) =>
  key !== undefined &&
  normalize(value) !== '' &&
  accepted(key).some((answer) => normalize(answer) === normalize(value));

export const buildReview = (
  questions: Question[],
  keys: AnswerKeys,
  answers: Record<string, string>,
  audioAt: Record<number, number> = {},
): SectionReview => {
  const items: AnswerReview[] = questions.map((q) => {
    const value = answers[q.id] ?? '';
    const key = keys[q.id];
    const status = value.trim() === '' ? 'empty' : isCorrect(key, value) ? 'correct' : 'wrong';
    return {
      questionId: q.id,
      number: q.number,
      status,
      prompt: q.prompt,
      yourAnswer: value,
      correctAnswer: key ? accepted(key).join(' / ') : '',
      explanation: key?.explanation,
      audioAt: audioAt[q.number],
    };
  });

  return {
    items,
    correct: items.filter((i) => i.status === 'correct').length,
    wrong: items.filter((i) => i.status === 'wrong').length,
    empty: items.filter((i) => i.status === 'empty').length,
  };
};

export const weakestLabel = (criteria: Criterion[]) =>
  criteria.reduce((min, c) => (c.score / c.max < min.score / min.max ? c : min), criteria[0])?.label;

import type { Question } from '@/entities/test';
import type { AnswerReview, SectionReview } from '../model/types';

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

export const isCorrect = (question: Question, value: string) =>
  normalize(value) !== '' && normalize(value) === normalize(question.answer);

export const buildReview = (
  questions: Question[],
  answers: Record<string, string>,
  audioAt: Record<number, number> = {},
): SectionReview => {
  const items: AnswerReview[] = questions.map((q) => {
    const value = answers[q.id] ?? '';
    const status = value.trim() === '' ? 'empty' : isCorrect(q, value) ? 'correct' : 'wrong';
    return {
      questionId: q.id,
      number: q.number,
      status,
      prompt: q.prompt,
      yourAnswer: value,
      correctAnswer: q.answer,
      explanation: q.explanation,
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

export const countCorrect = (questions: Question[], answers: Record<string, string>) =>
  questions.reduce((sum, q) => sum + (isCorrect(q, answers[q.id] ?? '') ? 1 : 0), 0);

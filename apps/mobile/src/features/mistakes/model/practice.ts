import { isCorrect } from '@/entities/result';
import type { AnswerKeys, ListeningPart, Question, ReadingPart, TestDetail } from '@/entities/test';

export type PracticeItem =
  | { section: 'listening'; question: Question; part: ListeningPart; startSec?: number; endSec?: number }
  | { section: 'reading'; question: Question; part: ReadingPart };

const missed = (keys: AnswerKeys, answers: Record<string, string>) => (question: Question) =>
  !isCorrect(keys[question.id], answers[question.id] ?? '');

const clipOf = (part: ListeningPart, number: number) => {
  const startSec = part.audioAt?.[number];
  if (startSec === undefined) return {};
  const later = Object.values(part.audioAt ?? {}).filter((mark) => mark > startSec);
  return { startSec, endSec: later.length ? Math.min(...later) : part.durationSec };
};

export const buildPractice = (
  test: TestDetail,
  keys: AnswerKeys,
  answers: Record<string, string>,
): PracticeItem[] => {
  const isMissed = missed(keys, answers);
  const listening = test.listening.flatMap((part) =>
    part.questions
      .filter(isMissed)
      .map((question): PracticeItem => ({ section: 'listening', question, part, ...clipOf(part, question.number) })),
  );
  const reading = test.reading.flatMap((part) =>
    part.questions.filter(isMissed).map((question): PracticeItem => ({ section: 'reading', question, part })),
  );
  return [...listening, ...reading];
};

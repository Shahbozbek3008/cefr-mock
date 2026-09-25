import { countCorrect } from '@/entities/result';
import type { Criterion, SectionScore, TestResult } from '@/entities/result';
import type { TestDetail } from '@/entities/test';
import { formatHours, formatShortDate, nextLevelGap, toScaled } from '@/shared/lib';

type AttemptSnapshot = {
  answers: Record<string, string>;
  startedAt: number | null;
};

type AiScores = {
  writing: number;
  speaking: Criterion[];
};

const criteriaScore = (criteria: Criterion[]) =>
  toScaled(
    criteria.reduce((sum, c) => sum + c.score, 0),
    criteria.reduce((sum, c) => sum + c.max, 0),
  );

export const buildResult = (
  test: TestDetail,
  attempt: AttemptSnapshot,
  ai: AiScores,
  previous?: TestResult,
): TestResult => {
  const listening = test.listening.flatMap((p) => p.questions);
  const reading = test.reading.flatMap((p) => p.questions);

  const scores: Omit<SectionScore, 'delta' | 'focus'>[] = [
    {
      kind: 'listening',
      title: 'Listening',
      score: toScaled(countCorrect(listening, attempt.answers), listening.length),
    },
    { kind: 'reading', title: 'Reading', score: toScaled(countCorrect(reading, attempt.answers), reading.length) },
    { kind: 'writing', title: 'Writing', score: ai.writing },
    { kind: 'speaking', title: 'Speaking', score: criteriaScore(ai.speaking) },
  ];

  const weakest = scores.reduce((min, s) => (s.score < min.score ? s : min), scores[0]);
  const sections: SectionScore[] = scores.map((s) => {
    const before = previous?.sections.find((p) => p.kind === s.kind)?.score;
    return { ...s, delta: before === undefined ? 0 : s.score - before, focus: s.kind === weakest.kind };
  });

  const total = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  const gap = nextLevelGap(total);
  const now = new Date();

  return {
    id: `r${now.getTime()}`,
    testId: test.id,
    title: test.title,
    dateLabel: formatShortDate(now),
    durationLabel: formatHours(attempt.startedAt ? (now.getTime() - attempt.startedAt) / 1000 : 0),
    total,
    delta: previous ? total - previous.total : 0,
    sections,
    recommendation: { level: gap?.level ?? null, points: gap?.points ?? 0, focus: weakest.title },
    answers: attempt.answers,
  };
};

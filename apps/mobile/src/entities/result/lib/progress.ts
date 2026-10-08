import { sectionOrder, sectionTitles } from '@/entities/test';
import type { SectionKind } from '@/entities/test';
import { levelFor } from '@/shared/lib';
import type { AxisMark, ProgressData, ProgressPeriod, TestResult } from '../model/types';

const DAY_MS = 86_400_000;
const periodDays: Record<ProgressPeriod, number | null> = { '1m': 30, '3m': 90, all: null };

const axisOf = (results: TestResult[]): AxisMark[] =>
  [...new Set([0, Math.floor((results.length - 1) / 2), results.length - 1])].map((index) => {
    const date = new Date(results[index].createdAt);
    return { month: date.getMonth(), day: date.getDate() };
  });

const scoreOf = (result: TestResult, kind: SectionKind) => result.sections.find((s) => s.kind === kind)?.score ?? 0;

export const buildProgress = (results: TestResult[], period: ProgressPeriod, now = Date.now()): ProgressData | null => {
  const days = periodDays[period];
  const inPeriod = results.filter((result) => days === null || now - Date.parse(result.createdAt) <= days * DAY_MS);
  if (inPeriod.length === 0) return null;

  const chronological = [...inPeriod].reverse();
  const first = chronological[0];
  const latest = chronological[chronological.length - 1];
  const weakest = sectionOrder.reduce((min, kind) => (scoreOf(latest, kind) < scoreOf(latest, min) ? kind : min));

  return {
    total: latest.total,
    delta: latest.total - first.total,
    testsCount: inPeriod.length,
    values: chronological.map((result) => result.total),
    axis: axisOf(chronological),
    sections: sectionOrder.map((kind) => ({
      title: sectionTitles[kind],
      score: scoreOf(latest, kind),
      delta: scoreOf(latest, kind) - scoreOf(first, kind),
      weak: kind === weakest,
    })),
    history: inPeriod.map((result) => ({
      resultId: result.id,
      dateLabel: result.dateLabel,
      title: result.title,
      score: result.total,
      level: levelFor(result.total),
    })),
  };
};

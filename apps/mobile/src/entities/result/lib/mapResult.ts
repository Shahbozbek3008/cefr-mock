import { sectionOrder, sectionTitles } from '@/entities/test';
import type { Tables } from '@/shared/api';
import { formatHours, formatShortDate, nextLevelGap } from '@/shared/lib';
import type { AiReviewKind, AiReviewStatus, SectionScore, TestResult } from '../model/types';

export type ResultRow = Pick<
  Tables<'results'>,
  | 'id'
  | 'test_id'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'total'
  | 'answers'
  | 'duration_sec'
  | 'created_at'
> & {
  tests: { title: string } | null;
  ai_reviews: { kind: AiReviewKind; status: AiReviewStatus }[];
};

const toResult = (row: ResultRow, previous?: ResultRow): TestResult => {
  const scores = sectionOrder.map((kind) => ({ kind, title: sectionTitles[kind], score: row[kind] }));
  const weakest = scores.reduce((min, item) => (item.score < min.score ? item : min), scores[0]);
  const sections: SectionScore[] = scores.map((item) => ({
    ...item,
    delta: previous ? item.score - previous[item.kind] : 0,
    focus: item.kind === weakest.kind,
  }));
  const gap = nextLevelGap(row.total);

  return {
    id: row.id,
    testId: row.test_id,
    title: row.tests?.title ?? '',
    createdAt: row.created_at,
    dateLabel: formatShortDate(new Date(row.created_at)),
    durationLabel: formatHours(row.duration_sec),
    total: row.total,
    delta: previous ? row.total - previous.total : 0,
    sections,
    recommendation: { level: gap?.level ?? null, points: gap?.points ?? 0, focus: weakest.title },
    answers: row.answers as Record<string, string>,
    aiStatus: Object.fromEntries((row.ai_reviews ?? []).map((review) => [review.kind, review.status])),
  };
};

export const mapResults = (rows: ResultRow[]) => rows.map((row, index) => toResult(row, rows[index + 1]));

import type { ProgressPeriod, TestSummary } from '@cefr/core';
import type { TagTone } from '@cefr/ui/components/tag';
import { LEVELS } from '@cefr/ui/lib/constants';

export const ACTIVITY_SKELETON_BARS = [45, 70, 30, 85, 55, 25, 60];

export const TREND_LENGTH = 8;

export const RECOMMENDED_LIMIT = 5;

export const TEST_STATUS_RANK: Record<TestSummary['status'], number> = { in_progress: 0, new: 1, completed: 2, locked: 3 };

export const RECOMMENDED_SKELETON_ROWS = 5;

export const TEST_STATUS_TONE: Partial<Record<TestSummary['status'], TagTone>> = { in_progress: 'blue', new: 'green', completed: 'neutral' };

export const SCORE_THRESHOLDS = LEVELS.slice(0, 2).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));

export const SCORE_PERIODS = ['1m', '3m', 'all'] as const satisfies readonly ProgressPeriod[];

export const SCORE_CHART_HEIGHT = 260;

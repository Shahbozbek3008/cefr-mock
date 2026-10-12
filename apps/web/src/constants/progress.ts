import type { ProgressPeriod } from '@cefr/core';
import { LEVELS } from '@cefr/ui/lib/constants';

export const PROGRESS_THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));

export const PROGRESS_PERIODS = ['1m', '3m', 'all'] as const satisfies readonly ProgressPeriod[];

export const PROGRESS_CHART_HEIGHT = 280;

export const PROGRESS_SKELETON_AXIS = 4;

export const PROGRESS_SKELETON_ROWS = 4;

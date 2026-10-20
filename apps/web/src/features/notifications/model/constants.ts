import { AlarmClock, CalendarDays, ChartNoAxesColumnIncreasing, FilePlus2, type LucideIcon, Sparkles } from 'lucide-react';
import type { NotificationKind } from '@cefr/core';
import type { NotificationGroup } from './types';

export const NOTIFICATION_GROUPS: NotificationGroup[] = ['today', 'yesterday', 'earlier'];

export const NOTIFICATION_BADGE_MAX = 9;

export const NOTIFICATION_SKELETON_ROWS = 3;

export const NOTIFICATION_KINDS: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  result: { icon: ChartNoAxesColumnIncreasing, tone: 'bg-green-50 text-green-text' },
  aiReview: { icon: Sparkles, tone: 'bg-blue-50 text-blue-text' },
  reminder: { icon: AlarmClock, tone: 'bg-warning-50 text-warning-text' },
  newTest: { icon: FilePlus2, tone: 'bg-blue-50 text-blue-text' },
  exam: { icon: CalendarDays, tone: 'bg-error-50 text-error-text' },
};

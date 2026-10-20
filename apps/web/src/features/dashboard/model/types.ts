import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ActivityCardProps = { week: readonly WeekDay[]; todayIndex: number; goal: number };

export type KpiCardProps = { label: string; icon: LucideIcon; value: ReactNode; unit?: ReactNode; aside?: ReactNode; footer: ReactNode; accent?: boolean };

export type WeekDay = { key: string; label: string; minutes: number };

export type KpiData = {
  score: number | null;
  delta: number;
  trend: number[];
  daysLeft: number | null;
  examLabel: string | null;
  target: string | null;
  streak: number;
  week: WeekDay[];
  weekGoal: number;
};

export type SparklineProps = { data: readonly number[]; width?: number; height?: number; color?: string };

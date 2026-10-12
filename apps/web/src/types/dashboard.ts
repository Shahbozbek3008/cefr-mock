import type { LucideIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import type { Skill } from '@cefr/ui/lib/constants';

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

export type PanelProps = Omit<ComponentProps<'section'>, 'title'> & { title?: ReactNode; subtitle?: ReactNode; action?: ReactNode };

export type SkillScore = { skill: Skill; score: number; delta: number; weak?: boolean };

export type SkillsCardProps = { skills: readonly SkillScore[]; title: string; subtitle: string };

export type SparklineProps = { data: readonly number[]; width?: number; height?: number; color?: string };

import type { ReactNode } from 'react';
import type { DailyMinutes, OnboardingDraft, TargetLevel } from '@cefr/core';

export type StepIndicatorProps = { current: number; total?: number; partial?: boolean };

export type ExamCalendarProps = {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (iso: string) => void;
  className?: string;
};

export type OnboardingSplitProps = { title: string; text: string; children: ReactNode; aside: ReactNode };

export type OnboardingSummary = { days: number | null; tests: number | null; minutes: number };

export type VerifyCodeFormProps = { digits: string; next?: string; onVerified?: () => Promise<void> };

export type OnboardingState = Omit<Required<OnboardingDraft>, 'dailyMinutes'> & {
  dailyMinutes: DailyMinutes;
  phone: string;
  setTargetLevel: (targetLevel: TargetLevel) => void;
  setExamDate: (examDate: string | null) => void;
  setDailyMinutes: (dailyMinutes: DailyMinutes) => void;
  setAccount: (firstName: string, phone: string) => void;
  reset: () => void;
};

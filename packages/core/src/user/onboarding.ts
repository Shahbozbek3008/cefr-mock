import { daysUntil } from '../lib/date';
import type { Profile, ProfilePatch } from './api';
import type { DailyMinutes, TargetLevel } from './types';

export type OnboardingDraft = {
  targetLevel: TargetLevel | null;
  examDate: string | null;
  dailyMinutes: DailyMinutes | null;
  firstName?: string;
};

const DAYS_PER_MOCK = 7;

export const onboardingPatch = (profile: Profile, draft: OnboardingDraft): ProfilePatch => {
  const patch: ProfilePatch = {};
  if (!profile.targetLevel && draft.targetLevel) patch.targetLevel = draft.targetLevel;
  if (!profile.examDate && draft.examDate) patch.examDate = draft.examDate;
  if (!profile.dailyMinutes && draft.dailyMinutes) patch.dailyMinutes = draft.dailyMinutes;
  if (!profile.firstName && draft.firstName?.trim()) patch.firstName = draft.firstName;
  return patch;
};

export const studyPlanOf = (examDate: string | null) => {
  if (!examDate) return null;
  const days = daysUntil(examDate);
  const tests = Math.max(1, Math.ceil(days / DAYS_PER_MOCK));
  return { days, tests, drills: Math.max(0, days - tests) };
};

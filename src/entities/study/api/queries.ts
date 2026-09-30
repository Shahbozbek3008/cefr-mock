import { useQuery } from '@tanstack/react-query';
import { ensureOk, supabase, unwrap } from '@/shared/api';
import { queryClient } from '@/shared/lib';
import { dayKey } from '../lib/streak';

const HISTORY_DAYS = 120;
const DAY_MS = 86_400_000;
const MAX_ENTRY_MINUTES = 240;

export const studyKeys = {
  all: ['study'] as const,
};

export const fetchStudyDays = async (): Promise<Record<string, number>> => {
  const since = dayKey(new Date(Date.now() - HISTORY_DAYS * DAY_MS));
  const rows = unwrap(await supabase.from('study_days').select('day, minutes').gte('day', since));
  return Object.fromEntries(rows.map((row) => [row.day, row.minutes]));
};

export const logStudy = async (seconds: number) => {
  const minutes = Math.min(MAX_ENTRY_MINUTES, Math.round(seconds / 60));
  if (minutes < 1) return;
  ensureOk(await supabase.rpc('log_study', { study_day: dayKey(new Date()), spent_minutes: minutes }));
  await queryClient.invalidateQueries({ queryKey: studyKeys.all });
};

export const useStudyDays = () => useQuery({ queryKey: studyKeys.all, queryFn: fetchStudyDays });

import { useQuery } from '@tanstack/react-query';
import { useCefrClient, type CefrClient } from '../api/client';
import { ensureOk, unwrap } from '../api/errors';
import { dayKey } from './streak';

const HISTORY_DAYS = 120;
const DAY_MS = 86_400_000;
const MAX_ENTRY_MINUTES = 240;

export const studyKeys = {
  all: ['study'] as const,
};

export const fetchStudyDays = async (client: CefrClient): Promise<Record<string, number>> => {
  const since = dayKey(new Date(Date.now() - HISTORY_DAYS * DAY_MS));
  const rows = unwrap(await client.from('study_days').select('day, minutes').gte('day', since));
  return Object.fromEntries(rows.map((row) => [row.day, row.minutes]));
};

export const logStudy = async (client: CefrClient, seconds: number) => {
  const minutes = Math.min(MAX_ENTRY_MINUTES, Math.round(seconds / 60));
  if (minutes < 1) return false;
  ensureOk(await client.rpc('log_study', { study_day: dayKey(new Date()), spent_minutes: minutes }));
  return true;
};

export const useStudyDays = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: studyKeys.all, queryFn: () => fetchStudyDays(client) });
};

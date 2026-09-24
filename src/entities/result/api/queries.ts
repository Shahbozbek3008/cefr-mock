import { useQuery } from '@tanstack/react-query';
import { delay } from '@/entities/test';
import { useResultStore } from '../model/store';
import type { ProgressPeriod, TestResult } from '../model/types';
import { buildMockResults, progressByPeriod, speakingReview, writingReview } from './mock';

export const resultKeys = {
  all: ['results'] as const,
  detail: (id: string) => ['results', id] as const,
  writing: (id: string) => ['results', id, 'writing'] as const,
  speaking: (id: string) => ['results', id, 'speaking'] as const,
  progress: (period: ProgressPeriod) => ['progress', period] as const,
};

let mockCache: Promise<TestResult[]> | null = null;
const mockResults = () => {
  mockCache ??= buildMockResults();
  return mockCache;
};

export const fetchResults = async () => {
  const local = useResultStore.getState().results;
  return delay([...local, ...(await mockResults())], 300);
};

export const fetchResult = async (id: string) => {
  const all = await fetchResults();
  const found = all.find((r) => r.id === id);
  if (!found) throw new Error('Natija topilmadi');
  return found;
};

export const useResults = () => useQuery({ queryKey: resultKeys.all, queryFn: fetchResults });

export const useResult = (id: string) =>
  useQuery({ queryKey: resultKeys.detail(id), queryFn: () => fetchResult(id) });

export const useLatestResult = () => {
  const query = useResults();
  return { ...query, data: query.data?.[0] };
};

export const useWritingReview = (id: string) =>
  useQuery({ queryKey: resultKeys.writing(id), queryFn: () => delay(writingReview, 500) });

export const useSpeakingReview = (id: string) =>
  useQuery({ queryKey: resultKeys.speaking(id), queryFn: () => delay(speakingReview, 500) });

export const useProgress = (period: ProgressPeriod) =>
  useQuery({ queryKey: resultKeys.progress(period), queryFn: () => delay(progressByPeriod[period], 250), placeholderData: (prev) => prev });

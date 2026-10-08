import { useQuery } from '@tanstack/react-query';
import { useCefrClient } from '../api/client';
import { AI_POLL_MS, fetchAiReview, fetchResult, fetchResults, hasActiveAi, isAiActive, resultKeys } from './api';
import { buildProgress } from './progress';
import type { AiReviewKind, ProgressPeriod, SpeakingReview, WritingReview } from './types';

export const useResults = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: resultKeys.all, queryFn: () => fetchResults(client) });
};

export const useResult = (id: string) => {
  const client = useCefrClient();
  return useQuery({
    queryKey: resultKeys.detail(id),
    queryFn: () => fetchResult(client, id),
    refetchInterval: (query) => (hasActiveAi(query.state.data) ? AI_POLL_MS : false),
  });
};

export const useLatestResult = () => {
  const query = useResults();
  return { ...query, data: query.data?.[0] };
};

const useAiReview = <T>(id: string, kind: AiReviewKind) => {
  const client = useCefrClient();
  return useQuery({
    queryKey: resultKeys.ai(id, kind),
    queryFn: () => fetchAiReview<T>(client, id, kind),
    refetchInterval: (query) => (isAiActive(query.state.data?.status) ? AI_POLL_MS : false),
  });
};

export const useWritingReview = (id: string) => useAiReview<WritingReview>(id, 'writing');

export const useSpeakingReview = (id: string) => useAiReview<SpeakingReview>(id, 'speaking');

export const useProgress = (period: ProgressPeriod) => {
  const client = useCefrClient();
  return useQuery({
    queryKey: resultKeys.all,
    queryFn: () => fetchResults(client),
    select: (results) => buildProgress(results, period),
  });
};

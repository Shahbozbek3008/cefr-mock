import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCefrClient } from '../api/client';
import { AI_POLL_MS, fetchAiReview, fetchResult, fetchResults, hasActiveAi, isAiActive, requestAiReview, resultKeys, type ReviewLocale } from './api';
import { buildProgress } from './progress';
import type { AiReviewKind, AiReviewStatus, ProgressPeriod, SpeakingReview, WritingReview } from './types';

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

export const useAiReviewRequest = (resultId: string, status: AiReviewStatus | undefined, locale: ReviewLocale) => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  const [requesting, setRequesting] = useState(false);
  const autoRequested = useRef(false);

  const request = useCallback(async () => {
    setRequesting(true);
    try {
      await requestAiReview(client, resultId, locale);
    } finally {
      setRequesting(false);
      await queryClient.invalidateQueries({ queryKey: resultKeys.detail(resultId) });
      await queryClient.invalidateQueries({ queryKey: ['results', resultId, 'ai'] });
    }
  }, [client, locale, queryClient, resultId]);

  useEffect(() => {
    if (status !== 'pending' || autoRequested.current) return;
    autoRequested.current = true;
    request().catch(() => undefined);
  }, [request, status]);

  return { request, requesting };
};

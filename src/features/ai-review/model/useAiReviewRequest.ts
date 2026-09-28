import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { requestAiReview, resultKeys } from '@/entities/result';
import type { AiReviewStatus } from '@/entities/result';

export const useAiReviewRequest = (resultId: string, status: AiReviewStatus | undefined) => {
  const client = useQueryClient();
  const [requesting, setRequesting] = useState(false);
  const autoRequested = useRef(false);

  const request = useCallback(async () => {
    setRequesting(true);
    try {
      await requestAiReview(resultId);
    } finally {
      setRequesting(false);
      await client.invalidateQueries({ queryKey: resultKeys.detail(resultId) });
      await client.invalidateQueries({ queryKey: ['results', resultId, 'ai'] });
    }
  }, [client, resultId]);

  useEffect(() => {
    if (status !== 'pending' || autoRequested.current) return;
    autoRequested.current = true;
    request().catch(() => undefined);
  }, [request, status]);

  return { request, requesting };
};

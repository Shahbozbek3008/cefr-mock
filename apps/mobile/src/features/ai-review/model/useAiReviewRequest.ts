import { useAiReviewRequest as coreUseAiReviewRequest } from '@cefr/core';
import type { AiReviewStatus } from '@/entities/result';
import { useLocaleStore } from '@/shared/i18n';

export const useAiReviewRequest = (resultId: string, status: AiReviewStatus | undefined) =>
  coreUseAiReviewRequest(resultId, status, useLocaleStore((s) => s.locale));

import {
  fetchResult as coreFetchResult,
  fetchResults as coreFetchResults,
  requestAiReview as coreRequestAiReview,
} from '@cefr/core';
import { useLocaleStore } from '@/shared/i18n';
import { supabase } from '@/shared/api';

export {
  isAiActive,
  resultKeys,
  useLatestResult,
  useProgress,
  useResult,
  useResults,
  useSpeakingReview,
  useWritingReview,
} from '@cefr/core';

export const fetchResults = () => coreFetchResults(supabase);

export const fetchResult = (id: string) => coreFetchResult(supabase, id);

export const requestAiReview = (resultId: string) =>
  coreRequestAiReview(supabase, resultId, useLocaleStore.getState().locale);

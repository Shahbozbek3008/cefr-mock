import { useQuery } from '@tanstack/react-query';
import { useLocaleStore } from '@/shared/i18n';
import { ApiError, invokeFunction, supabase, unwrap } from '@/shared/api';
import { mapResults } from '../lib/mapResult';
import type { ResultRow } from '../lib/mapResult';
import { buildProgress } from '../lib/progress';
import type {
  AiReview,
  AiReviewKind,
  AiReviewStatus,
  ProgressPeriod,
  SpeakingReview,
  TestResult,
  WritingReview,
} from '../model/types';

export const resultKeys = {
  all: ['results'] as const,
  detail: (id: string) => ['results', id] as const,
  ai: (id: string, kind: AiReviewKind) => ['results', id, 'ai', kind] as const,
};

const AI_POLL_MS = 4000;

const RESULT_COLUMNS =
  'id, test_id, listening, reading, writing, speaking, total, answers, duration_sec, created_at, tests(title), ai_reviews(kind, status)';

export const isAiActive = (status: AiReviewStatus | undefined) => status === 'pending' || status === 'processing';

const hasActiveAi = (result: TestResult | undefined) =>
  result !== undefined && Object.values(result.aiStatus).some(isAiActive);

export const fetchResults = async (): Promise<TestResult[]> => {
  const rows = unwrap(await supabase.from('results').select(RESULT_COLUMNS).order('created_at', { ascending: false }));
  return mapResults(rows as unknown as ResultRow[]);
};

export const fetchResult = async (id: string) => {
  const found = (await fetchResults()).find((result) => result.id === id);
  if (!found) throw new ApiError('not_found');
  return found;
};

const fetchAiReview = async <T>(resultId: string, kind: AiReviewKind): Promise<AiReview<T>> => {
  const { data, error } = await supabase
    .from('ai_reviews')
    .select('status, review')
    .eq('result_id', resultId)
    .eq('kind', kind)
    .maybeSingle();
  if (error) throw error;
  return { status: data?.status ?? 'pending', review: (data?.review ?? null) as T | null };
};

export const requestAiReview = (resultId: string) =>
  invokeFunction<{ status: string }>('ai-review', { resultId, locale: useLocaleStore.getState().locale });

export const useResults = () => useQuery({ queryKey: resultKeys.all, queryFn: fetchResults });

export const useResult = (id: string) =>
  useQuery({
    queryKey: resultKeys.detail(id),
    queryFn: () => fetchResult(id),
    refetchInterval: (query) => (hasActiveAi(query.state.data) ? AI_POLL_MS : false),
  });

export const useLatestResult = () => {
  const query = useResults();
  return { ...query, data: query.data?.[0] };
};

const useAiReview = <T>(id: string, kind: AiReviewKind) =>
  useQuery({
    queryKey: resultKeys.ai(id, kind),
    queryFn: () => fetchAiReview<T>(id, kind),
    refetchInterval: (query) => (isAiActive(query.state.data?.status) ? AI_POLL_MS : false),
  });

export const useWritingReview = (id: string) => useAiReview<WritingReview>(id, 'writing');

export const useSpeakingReview = (id: string) => useAiReview<SpeakingReview>(id, 'speaking');

export const useProgress = (period: ProgressPeriod) =>
  useQuery({
    queryKey: resultKeys.all,
    queryFn: fetchResults,
    select: (results) => buildProgress(results, period),
  });

import type { CefrClient } from '../api/client';
import { ApiError, invokeFunction, unwrap } from '../api/errors';
import { mapResult, mapResults, type ResultRow } from './mapResult';
import type { AiReview, AiReviewKind, AiReviewStatus, TestResult } from './types';

export type ReviewLocale = 'uz' | 'ru' | 'en';

export const resultKeys = {
  all: ['results'] as const,
  detail: (id: string) => ['results', id] as const,
  ai: (id: string, kind: AiReviewKind) => ['results', id, 'ai', kind] as const,
};

export const AI_POLL_MS = 4000;

const RESULT_COLUMNS =
  'id, test_id, scope, listening, reading, writing, speaking, total, answers, duration_sec, created_at, tests(title), ai_reviews(kind, status)';

export const isAiActive = (status: AiReviewStatus | undefined) => status === 'pending' || status === 'processing';

export const hasActiveAi = (result: TestResult | undefined) =>
  result !== undefined && Object.values(result.aiStatus).some(isAiActive);

export const fetchResults = async (client: CefrClient): Promise<TestResult[]> => {
  const rows = unwrap(
    await client.from('results').select(RESULT_COLUMNS).eq('scope', 'full').order('created_at', { ascending: false }),
  );
  return mapResults(rows as unknown as ResultRow[]);
};

export const fetchResult = async (client: CefrClient, id: string) => {
  const found = (await fetchResults(client)).find((result) => result.id === id);
  if (found) return found;
  const { data, error } = await client.from('results').select(RESULT_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError('not_found');
  return mapResult(data as unknown as ResultRow);
};

export const fetchAiReview = async <T>(client: CefrClient, resultId: string, kind: AiReviewKind): Promise<AiReview<T>> => {
  const { data, error } = await client
    .from('ai_reviews')
    .select('status, review')
    .eq('result_id', resultId)
    .eq('kind', kind)
    .maybeSingle();
  if (error) throw error;
  return { status: data?.status ?? 'pending', review: (data?.review ?? null) as T | null };
};

export const requestAiReview = (client: CefrClient, resultId: string, locale: ReviewLocale) =>
  invokeFunction<{ status: string }>(client, 'ai-review', { resultId, locale });

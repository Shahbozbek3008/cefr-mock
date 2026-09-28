import { createClient } from 'npm:@supabase/supabase-js@2';
import { toLocale } from './claude.ts';
import type { Locale } from './claude.ts';
import { reviewSpeaking } from './speaking.ts';
import type { SpeakingQuestion } from './speaking.ts';
import { reviewWriting } from './writing.ts';
import type { WritingTask } from './writing.ts';

type ClaimedReview = { id: string; kind: 'writing' | 'speaking' };
type TestContent = { writing: WritingTask[]; speaking: SpeakingQuestion[] };
type Attempt = { writing: Record<string, string>; recordings: Record<string, string> };

const RECORDINGS_BUCKET = 'recordings';

const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const download = async (path: string) => {
  const { data, error } = await admin.storage.from(RECORDINGS_BUCKET).download(path);
  if (error || !data) throw new Error('recording_unavailable');
  return data.arrayBuffer();
};

const loadInputs = async (resultId: string) => {
  const { data: result, error } = await admin
    .from('results')
    .select('attempt_id, test_id, attempts(writing, recordings), tests(content)')
    .eq('id', resultId)
    .single();
  if (error || !result) throw new Error('result_unavailable');

  const attempt = result.attempts as unknown as Attempt;
  const content = (result.tests as unknown as { content: TestContent }).content;
  return { attempt, content };
};

const runReview = async (review: ClaimedReview, inputs: Awaited<ReturnType<typeof loadInputs>>, locale: Locale) => {
  const { attempt, content } = inputs;
  const payload =
    review.kind === 'writing'
      ? await reviewWriting(content.writing, attempt.writing ?? {}, locale)
      : await reviewSpeaking(content.speaking, attempt.recordings ?? {}, download, locale);

  const { error } = await admin.rpc('complete_ai_review', {
    review_id: review.id,
    final_score: payload.score,
    payload,
  });
  if (error) throw error;
};

const runAll = async (resultId: string, reviews: ClaimedReview[], locale: Locale) => {
  const fail = (review: ClaimedReview, reason: unknown) =>
    admin.rpc('fail_ai_review', { review_id: review.id, reason: reason instanceof Error ? reason.message : 'unknown' });

  try {
    const inputs = await loadInputs(resultId);
    await Promise.all(
      reviews.map((review) => runReview(review, inputs, locale).catch((reason) => fail(review, reason))),
    );
  } catch (reason) {
    await Promise.all(reviews.map((review) => fail(review, reason)));
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return respond({ error: 'invalid_request' }, 405);

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const { data: auth } = await admin.auth.getUser(token);
  if (!auth.user) return respond({ error: 'not_authenticated' }, 401);

  const body = await req.json().catch(() => null);
  const resultId = typeof body?.resultId === 'string' ? body.resultId : '';
  if (!resultId) return respond({ error: 'invalid_request' }, 400);

  const { data: owned } = await admin
    .from('results')
    .select('id')
    .eq('id', resultId)
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (!owned) return respond({ error: 'not_found' }, 404);

  const { data: claimed, error } = await admin.rpc('claim_ai_reviews', { target_result: resultId });
  if (error) return respond({ error: 'server_error' }, 500);

  const reviews = (claimed ?? []) as ClaimedReview[];
  if (reviews.length === 0) return respond({ status: 'idle' });

  EdgeRuntime.waitUntil(runAll(resultId, reviews, toLocale(body?.locale)));
  return respond({ status: 'processing' }, 202);
});

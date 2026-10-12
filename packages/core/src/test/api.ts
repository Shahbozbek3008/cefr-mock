import type { CefrClient } from '../api/client';
import type { Json, Tables } from '../api/database';
import { requireUserId, unwrap } from '../api/errors';
import { levelFor } from '../lib/level';
import type { AnswerKeys, PartTranscript, SectionKind, SectionMeta, TestDetail, TestSummary } from './types';

export const testKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
  answers: (id: string) => ['tests', id, 'answers'] as const,
  scripts: (id: string) => ['tests', id, 'scripts'] as const,
};

const SCORE_RANGE = '0–75';

type TestContent = Pick<TestDetail, 'sections' | 'listening' | 'reading' | 'writing' | 'speaking'>;

type ActiveAttempt = Pick<Tables<'attempts'>, 'test_id' | 'current_section' | 'answers' | 'ends_at'>;
type LatestResult = Pick<Tables<'results'>, 'id' | 'test_id' | 'total' | 'created_at'>;
type SummaryRow = Pick<
  Tables<'tests'>,
  'id' | 'number' | 'title' | 'format_month' | 'format_year' | 'duration_label' | 'is_new' | 'is_free' | 'is_pro'
> & { sections: Json };

const objectiveTotal = (sections: SectionMeta[]) =>
  sections.reduce((sum, section) => sum + (section.questions ?? 0), 0);

const remainingSeconds = (endsAt: Json, section: string | null) => {
  const deadline = section ? (endsAt as Record<string, number> | null)?.[section] : undefined;
  return deadline ? Math.max(0, Math.round((deadline - Date.now()) / 1000)) : undefined;
};

const toSummary = (row: SummaryRow, isProUser: boolean, attempt?: ActiveAttempt, result?: LatestResult): TestSummary => {
  const base = {
    id: row.id,
    number: row.number,
    title: row.title,
    format: { month: row.format_month, year: row.format_year },
    durationLabel: row.duration_label,
    isNew: row.is_new,
    isFree: row.is_free,
    isPro: row.is_pro,
  };

  if (row.is_pro && !isProUser) return { ...base, status: 'locked' };

  if (attempt) {
    const total = objectiveTotal(row.sections as SectionMeta[]);
    const answered = Object.keys((attempt.answers as Record<string, string>) ?? {}).length;
    return {
      ...base,
      status: 'in_progress',
      progress: total ? Math.min(1, answered / total) : 0,
      resumeSection: (attempt.current_section as SectionKind | null) ?? 'listening',
      resumeAnswered: answered,
      resumeTotal: total,
      resumeRemainingSec: remainingSeconds(attempt.ends_at, attempt.current_section),
    };
  }

  if (result) {
    return {
      ...base,
      status: 'completed',
      score: result.total,
      level: levelFor(result.total),
      completedAt: result.created_at,
      resultId: result.id,
    };
  }

  return { ...base, status: 'new' };
};

export const fetchTests = async (client: CefrClient): Promise<TestSummary[]> => {
  const userId = await requireUserId(client);
  const [tests, attempts, results, profile] = await Promise.all([
    client
      .from('tests')
      .select('id, number, title, format_month, format_year, duration_label, is_new, is_free, is_pro, sections:content->sections')
      .order('published_at', { ascending: false })
      .order('number', { ascending: false }),
    client
      .from('attempts')
      .select('test_id, current_section, answers, ends_at')
      .eq('scope', 'full')
      .eq('status', 'in_progress')
      .order('updated_at', { ascending: false }),
    client.from('results').select('id, test_id, total, created_at').eq('scope', 'full').order('created_at', { ascending: false }),
    client.from('profiles').select('is_pro').eq('id', userId).single(),
  ]);

  const activeByTest = new Map(unwrap(attempts).map((attempt) => [attempt.test_id, attempt]));
  const latestByTest = new Map<string, LatestResult>();
  unwrap(results).forEach((result) => {
    if (!latestByTest.has(result.test_id)) latestByTest.set(result.test_id, result);
  });
  const isProUser = unwrap(profile).is_pro;

  return unwrap(tests).map((row) =>
    toSummary(row as unknown as SummaryRow, isProUser, activeByTest.get(row.id), latestByTest.get(row.id)),
  );
};

export const fetchTest = async (client: CefrClient, id: string): Promise<TestDetail> => {
  const row = unwrap(await client.from('tests').select('*').eq('id', id).single());
  const content = row.content as unknown as TestContent;
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    format: { month: row.format_month, year: row.format_year },
    durationLabel: row.duration_label,
    sectionsCount: content.sections.length,
    scoreRange: SCORE_RANGE,
    ...content,
  };
};

export const fetchTestKeys = async (client: CefrClient, id: string): Promise<AnswerKeys> => {
  const { data, error } = await client.from('test_keys').select('keys').eq('test_id', id).maybeSingle();
  if (error) throw error;
  return (data?.keys ?? {}) as unknown as AnswerKeys;
};

export const fetchTestScripts = async (client: CefrClient, id: string): Promise<PartTranscript[]> => {
  const { data, error } = await client.from('test_keys').select('scripts').eq('test_id', id).maybeSingle();
  if (error) throw error;
  return (data?.scripts ?? []) as unknown as PartTranscript[];
};

export const listeningAudioUrl = (client: CefrClient, file: string) =>
  client.storage.from('listening').getPublicUrl(file).data.publicUrl;

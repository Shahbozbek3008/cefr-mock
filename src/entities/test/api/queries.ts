import { useQuery } from '@tanstack/react-query';
import { requireUserId, supabase, unwrap } from '@/shared/api';
import type { Json, Tables } from '@/shared/api';
import type { AnswerKeys, SectionKind, SectionMeta, TestDetail, TestSummary } from '../model/types';

export const testKeys = {
  all: ['tests'] as const,
  detail: (id: string) => ['tests', id] as const,
  answers: (id: string) => ['tests', id, 'answers'] as const,
};

const SCORE_RANGE = '0–75';

type TestContent = Pick<TestDetail, 'sections' | 'listening' | 'reading' | 'writing' | 'speaking'>;

type ActiveAttempt = Pick<Tables<'attempts'>, 'test_id' | 'current_section' | 'answers' | 'ends_at'>;
type LatestResult = Pick<Tables<'results'>, 'id' | 'test_id' | 'total' | 'created_at'>;

const levelFor = (score: number) => {
  if (score >= 65) return 'C1';
  if (score >= 51) return 'B2';
  if (score >= 38) return 'B1';
  return 'A2';
};

const objectiveTotal = (sections: SectionMeta[]) =>
  sections.reduce((sum, section) => sum + (section.questions ?? 0), 0);

const remainingSeconds = (endsAt: Json, section: string | null) => {
  const deadline = section ? (endsAt as Record<string, number> | null)?.[section] : undefined;
  return deadline ? Math.max(0, Math.round((deadline - Date.now()) / 1000)) : undefined;
};

const toSummary = (
  row: Pick<
    Tables<'tests'>,
    'id' | 'number' | 'title' | 'format_month' | 'format_year' | 'duration_label' | 'is_new' | 'is_free' | 'is_pro'
  > & {
    sections: Json;
  },
  isProUser: boolean,
  attempt?: ActiveAttempt,
  result?: LatestResult,
): TestSummary => {
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

export const fetchTests = async (): Promise<TestSummary[]> => {
  const userId = await requireUserId();
  const [tests, attempts, results, profile] = await Promise.all([
    supabase
      .from('tests')
      .select(
        'id, number, title, format_month, format_year, duration_label, is_new, is_free, is_pro, sections:content->sections',
      )
      .order('published_at', { ascending: false })
      .order('number', { ascending: false }),
    supabase
      .from('attempts')
      .select('test_id, current_section, answers, ends_at')
      .eq('status', 'in_progress')
      .order('updated_at', { ascending: false }),
    supabase.from('results').select('id, test_id, total, created_at').order('created_at', { ascending: false }),
    supabase.from('profiles').select('is_pro').eq('id', userId).single(),
  ]);

  const activeByTest = new Map(unwrap(attempts).map((attempt) => [attempt.test_id, attempt]));
  const latestByTest = new Map<string, LatestResult>();
  unwrap(results).forEach((result) => {
    if (!latestByTest.has(result.test_id)) latestByTest.set(result.test_id, result);
  });
  const isProUser = unwrap(profile).is_pro;

  return unwrap(tests).map((row) =>
    toSummary(row as Parameters<typeof toSummary>[0], isProUser, activeByTest.get(row.id), latestByTest.get(row.id)),
  );
};

export const fetchTest = async (id: string): Promise<TestDetail> => {
  const row = unwrap(await supabase.from('tests').select('*').eq('id', id).single());
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

export const fetchTestKeys = async (id: string): Promise<AnswerKeys> => {
  const { data, error } = await supabase.from('test_keys').select('keys').eq('test_id', id).maybeSingle();
  if (error) throw error;
  return (data?.keys ?? {}) as unknown as AnswerKeys;
};

export const listeningAudioUrl = (file: string) => supabase.storage.from('listening').getPublicUrl(file).data.publicUrl;

export const useTests = () => useQuery({ queryKey: testKeys.all, queryFn: fetchTests });

export const useTest = (id: string) =>
  useQuery({ queryKey: testKeys.detail(id), queryFn: () => fetchTest(id), staleTime: Infinity, enabled: id !== '' });

export const useTestKeys = (id: string) =>
  useQuery({ queryKey: testKeys.answers(id), queryFn: () => fetchTestKeys(id), enabled: id !== '' });

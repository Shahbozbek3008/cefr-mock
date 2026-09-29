import { ensureOk, supabase, unwrap } from '@/shared/api';
import type { Json, Tables } from '@/shared/api';
import type { SectionKind } from '@/entities/test';
import type { AttemptMode, AttemptSnapshot } from '../model/store';

type AttemptRow = Tables<'attempts'>;

const UNIQUE_VIOLATION = '23505';

const toSnapshot = (row: AttemptRow): AttemptSnapshot => ({
  attemptId: row.id,
  testId: row.test_id,
  mode: row.mode,
  section: row.current_section as SectionKind | null,
  startedAt: new Date(row.started_at).getTime(),
  endsAt: row.ends_at as Partial<Record<SectionKind, number>>,
  completed: row.completed_sections as SectionKind[],
  answers: row.answers as Record<string, string>,
  flags: row.flags,
  writing: row.writing as Record<string, string>,
  uploads: (row.recordings as Record<string, string>) ?? {},
});

export const fetchActiveAttempt = async (testId: string) => {
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('test_id', testId)
    .eq('status', 'in_progress')
    .maybeSingle();
  if (error) throw error;
  return data ? toSnapshot(data) : null;
};

const createAttempt = async (testId: string, mode: AttemptMode) => {
  const { data, error } = await supabase.from('attempts').insert({ test_id: testId, mode }).select('*').single();
  if (error?.code === UNIQUE_VIOLATION) return fetchActiveAttempt(testId);
  return toSnapshot(unwrap({ data, error }));
};

export const openAttempt = async (testId: string, mode: AttemptMode): Promise<AttemptSnapshot> => {
  const snapshot = (await fetchActiveAttempt(testId)) ?? (await createAttempt(testId, mode));
  if (!snapshot) throw new Error('attempt_unavailable');
  return snapshot;
};

export const saveAttempt = async (snapshot: AttemptSnapshot) => {
  if (!snapshot.attemptId) return;
  ensureOk(
    await supabase
      .from('attempts')
      .update({
        current_section: snapshot.section,
        completed_sections: snapshot.completed,
        answers: snapshot.answers,
        flags: snapshot.flags,
        writing: snapshot.writing,
        recordings: snapshot.uploads,
        ends_at: snapshot.endsAt as Json,
      })
      .eq('id', snapshot.attemptId),
  );
};

export const submitAttempt = async (attemptId: string) =>
  unwrap(await supabase.rpc('submit_attempt', { attempt_id: attemptId }));

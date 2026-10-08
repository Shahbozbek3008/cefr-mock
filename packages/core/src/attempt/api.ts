import type { CefrClient } from '../api/client';
import type { Json, Tables } from '../api/database';
import { ensureOk, requireUserId, unwrap } from '../api/errors';
import type { SectionKind } from '../test/types';
import type { AttemptMode, AttemptSnapshot } from './store';

type AttemptRow = Tables<'attempts'>;

const UNIQUE_VIOLATION = '23505';
const RECORDINGS_BUCKET = 'recordings';
const SIGNED_URL_TTL_SEC = 60 * 60;

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

export const fetchActiveAttempt = async (client: CefrClient, testId: string) => {
  const { data, error } = await client
    .from('attempts')
    .select('*')
    .eq('test_id', testId)
    .eq('status', 'in_progress')
    .maybeSingle();
  if (error) throw error;
  return data ? toSnapshot(data) : null;
};

const createAttempt = async (client: CefrClient, testId: string, mode: AttemptMode) => {
  const { data, error } = await client.from('attempts').insert({ test_id: testId, mode }).select('*').single();
  if (error?.code === UNIQUE_VIOLATION) return fetchActiveAttempt(client, testId);
  return toSnapshot(unwrap({ data, error }));
};

export const openAttempt = async (client: CefrClient, testId: string, mode: AttemptMode): Promise<AttemptSnapshot> => {
  const snapshot = (await fetchActiveAttempt(client, testId)) ?? (await createAttempt(client, testId, mode));
  if (!snapshot) throw new Error('attempt_unavailable');
  return snapshot;
};

export const saveAttempt = async (client: CefrClient, snapshot: AttemptSnapshot) => {
  if (!snapshot.attemptId) return;
  ensureOk(
    await client
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

export const submitAttempt = async (client: CefrClient, attemptId: string) =>
  unwrap(await client.rpc('submit_attempt', { attempt_id: attemptId }));

export type RecordingFormat = { extension: string; contentType: string };

export const MOBILE_RECORDING: RecordingFormat = { extension: 'm4a', contentType: 'audio/mp4' };

const RECORDING_FORMATS: Record<string, RecordingFormat> = {
  'audio/mp4': { extension: 'mp4', contentType: 'audio/mp4' },
  'audio/webm': { extension: 'webm', contentType: 'audio/webm' },
  'audio/ogg': { extension: 'ogg', contentType: 'audio/ogg' },
};

export const recordingFormatOf = (body: ArrayBuffer | Blob): RecordingFormat =>
  body instanceof Blob ? (RECORDING_FORMATS[body.type.split(';')[0]] ?? MOBILE_RECORDING) : MOBILE_RECORDING;

export const uploadRecording = async (
  client: CefrClient,
  attemptId: string,
  questionId: string,
  body: ArrayBuffer | Blob,
  format: RecordingFormat = recordingFormatOf(body),
) => {
  const path = `${await requireUserId(client)}/${attemptId}/${questionId}.${format.extension}`;
  ensureOk(
    await client.storage
      .from(RECORDINGS_BUCKET)
      .upload(path, body, { contentType: format.contentType, upsert: true }),
  );
  return path;
};

export const recordingUrl = async (client: CefrClient, path: string) =>
  unwrap(await client.storage.from(RECORDINGS_BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SEC)).signedUrl;
